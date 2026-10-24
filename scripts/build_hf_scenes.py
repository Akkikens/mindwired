#!/usr/bin/env python3
"""Render a doc's HyperFrames data scenes (`"hf": "<name>"`) into DocWide clips.

    python3 scripts/build_hf_scenes.py <slug> [--only id1,id2] [--dry-run] [--jobs 2]

Runs AFTER build_doc_vo.py (ship_doc step 3b) because every clip is sized to
its narration beat (docs/planning/BLACKBOX-2027-REVAMP.md §3.1):

  a. each hf scene names hyperframes/data/<slug>/<name>.json; the file must
     exist and its "scene" must have a templates/<scene>.html
  b. the data file's top-level "duration" is rewritten to
     doctiming.scene_frames(scene, manifest durations)/30 + 0.5 s, so a clip
     can never end before the VO (no manifest duration = VO not built = stop)
  c. hyperframes/scripts/build.mjs --episode <slug> --channel <doc channel>
     --only <names>
  d. ./scripts/hf render each built scene at 3840x2160 / 30 fps, --jobs at a
     time, logged to out/qa/<slug>_hf_render.log; a scene whose mp4 already
     matches its hash (and accent) is skipped as fresh
  e. copy to public/shorts/<slug>/video/hf_<name>.mp4 + one ATTRIBUTION.md
     line + one PROVENANCE.jsonl row (episode root, like lib/footage.py)
  f. manifest["hf"][name] = {sha256, rendered_at_frames, duration, accent, mp4}
     — only that key of src/mindwired-doc/docs/<slug>.manifest.json changes

HF owns its whole frame: an hf scene may not also carry chapter / video / img
(chapter cards keep their own text; hf is not real footage).
"""
from __future__ import annotations
import argparse, concurrent.futures as cf, json, math, re, shutil, subprocess, sys, time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
import doctiming  # noqa: E402

REPO = doctiming.REPO
HF = REPO / "hyperframes"
PAD_S = 0.5
WIDTH, HEIGHT, FPS = 3840, 2160, 30


def hf_hash(slug: str, name: str) -> str:
    """sha256 over data json + template html + theme + build.mjs + pinned CLI —
    doctiming.hf_sha, the one hash preflight recomputes (never re-derive it here)."""
    sha = doctiming.hf_sha(slug, name)
    if sha is None:
        sys.exit(f"hf_hash: {slug}/{name} — data, template or shared kit file missing")
    return sha


def probe(mp4: Path) -> dict | None:
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                        "stream=width,height,r_frame_rate:format=duration", "-of", "json", str(mp4)],
                       capture_output=True, text=True)
    if r.returncode != 0:
        return None
    j = json.loads(r.stdout)
    st = (j.get("streams") or [{}])[0]
    num, _, den = st.get("r_frame_rate", "0/1").partition("/")
    return {"width": st.get("width"), "height": st.get("height"),
            "fps": float(num) / float(den or 1), "duration": float(j["format"]["duration"])}


def probe_ok(info: dict | None, duration: float) -> bool:
    return bool(info) and info["width"] == WIDTH and info["height"] == HEIGHT \
        and abs(info["fps"] - FPS) < 0.01 and info["duration"] >= duration - 0.05


def set_duration(data_p: Path, seconds: float) -> bool:
    """Rewrite only the top-level "duration" (2-space indent) so the file's
    formatting and any nested "duration" (e.g. a route-map zoom) survive."""
    src = data_p.read_text()
    new, n = re.subn(r'^(  "duration":\s*)[0-9.]+', lambda m: f"{m.group(1)}{seconds:g}", src,
                     count=1, flags=re.M)
    if n != 1:
        sys.exit(f"{data_p.relative_to(REPO)}: no top-level \"duration\" line to rewrite")
    if json.loads(new)["duration"] != seconds:
        sys.exit(f"{data_p.relative_to(REPO)}: duration rewrite did not land")
    if new != src:
        data_p.write_text(new)
        return True
    return False


def last_provenance_sha(prov: Path, rel: str) -> str | None:
    if not prov.exists():
        return None
    sha = None
    for line in prov.read_text().splitlines():
        try:
            row = json.loads(line)
        except ValueError:
            continue
        if row.get("file") == rel and row.get("source") == "hyperframes":
            sha = row.get("sha")
    return sha


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    ap.add_argument("--only", default="", help="comma-separated scene ids (default: every hf scene)")
    ap.add_argument("--dry-run", action="store_true", help="validate + print the plan, write nothing")
    ap.add_argument("--jobs", type=int, default=2, help="parallel hf renders (2-3)")
    ap.add_argument("--force", action="store_true", help="re-render even when fresh")
    args = ap.parse_args()
    slug = args.slug

    doc_p = doctiming.DOCS / f"{slug}.json"
    man_p = doctiming.DOCS / f"{slug}.manifest.json"
    doc = json.loads(doc_p.read_text())
    channel = doc.get("channel") or "mindwired"
    only = {s.strip() for s in args.only.split(",") if s.strip()}
    hf_scenes = [s for s in doc["scenes"] if s.get("hf")]
    if only:
        unknown = only - {s["id"] for s in hf_scenes}
        if unknown:
            sys.exit(f"--only: not hf scenes in {slug}.json: {', '.join(sorted(unknown))}")
        hf_scenes = [s for s in hf_scenes if s["id"] in only]
    if not hf_scenes:
        print(f"{slug}: no hf scenes — nothing to do")
        return

    # (a) validate data + template; hf owns the frame
    errs: list[str] = []
    for s in hf_scenes:
        data_p = HF / "data" / slug / f"{s['hf']}.json"
        if not data_p.exists():
            errs.append(f"{s['id']}: hf \"{s['hf']}\" -> missing {data_p.relative_to(REPO)}")
            continue
        scene = json.loads(data_p.read_text()).get("scene")
        if not scene or not (HF / "templates" / f"{scene}.html").exists():
            errs.append(f"{s['id']}: {data_p.name} scene \"{scene}\" has no hyperframes/templates/{scene}.html")
        for k in ("chapter", "video", "img"):
            if s.get(k):
                errs.append(f"{s['id']}: hf scenes own their whole frame — drop \"{k}\"")
    # (b) narration-sized durations; the VO must exist first
    if not man_p.exists():
        errs.append(f"no {man_p.relative_to(REPO)} — run build_doc_vo.py {slug} first")
        man = {}
    else:
        man = json.loads(man_p.read_text())
    durs = man.get("durations", {})
    missing_vo = set(man.get("missing", []))
    audio = REPO / "public" / "shorts" / slug / "audio"
    want: dict[str, float] = {}   # name -> seconds (max over scenes sharing a data file)
    for s in hf_scenes:
        if man and (s["id"] not in durs or s["id"] in missing_vo):
            errs.append(f"{s['id']}: no VO duration in the manifest — run build_doc_vo.py {slug} first")
            continue
        if man and not (audio / f"{s['id']}.mp3").exists():
            print(f"  WARN {s['id']}: {audio.relative_to(REPO)}/{s['id']}.mp3 not on disk — "
                  f"sizing from the manifest's recorded duration ({durs[s['id']]}s)")
        # rounded UP to 0.01 s so the pad can only grow
        sec = math.ceil((doctiming.scene_frames(s, durs) / doctiming.FPS + PAD_S) * 100 - 1e-9) / 100
        want[s["hf"]] = max(want.get(s["hf"], 0.0), sec)
    if errs:
        print("\n".join(f"BLOCK {e}" for e in errs))
        sys.exit(f"build_hf_scenes: {len(errs)} problem(s)")

    names = sorted(want)
    vid_dir = REPO / "public" / "shorts" / slug / "video"
    ep_root = vid_dir.parent
    prov = ep_root / "PROVENANCE.jsonl"
    hf_man = man.get("hf", {})
    print(f"{slug}: {len(names)} hf scene(s), channel {channel}")
    if args.dry_run:
        for n in names:
            print(f"  {n}: duration -> {want[n]}s  -> {vid_dir.relative_to(REPO)}/hf_{n}.mp4")
        print("--dry-run: nothing written")
        return

    for n in names:
        if set_duration(HF / "data" / slug / f"{n}.json", want[n]):
            print(f"  {n}: duration set to {want[n]}s")

    # (c) build exactly these scenes with the doc's channel
    r = subprocess.run(["node", "scripts/build.mjs", "--episode", slug, "--channel", channel,
                        "--only", ",".join(names)], cwd=HF, capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit(f"build.mjs failed:\n{r.stdout}{r.stderr}")
    built = json.loads((HF / ".hyperframes" / f"built-{slug}.json").read_text())
    accent = built["accent"]
    if sorted(built["scenes"]) != names:
        sys.exit(f"build.mjs built {built['scenes']}, expected {names}")

    # (d) render, skipping fresh clips
    shas = {n: hf_hash(slug, n) for n in names}
    todo, fresh = [], []
    for n in names:
        dst = vid_dir / f"hf_{n}.mp4"
        rel = dst.relative_to(ep_root).as_posix()
        rec = hf_man.get(n, {})
        # build_doc_vo rewrites the manifest without "hf"; PROVENANCE keeps the last sha
        known = rec.get("sha256") or last_provenance_sha(prov, rel)
        acc_ok = rec.get("accent", accent) == accent
        if not args.force and known == shas[n] and acc_ok and dst.exists() \
                and probe_ok(probe(dst), want[n]):
            fresh.append(n)
        else:
            todo.append(n)
    for n in fresh:
        print(f"  {n}: fresh (sha {shas[n][:12]}) — skipped")

    log_p = REPO / "out" / "qa" / f"{slug}_hf_render.log"
    log_p.parent.mkdir(parents=True, exist_ok=True)
    stage = REPO / "out" / "scene-kit"
    stage.mkdir(parents=True, exist_ok=True)

    def render(n: str) -> tuple[str, int, float, str]:
        out = stage / f"{slug}-{n}.mp4"
        t0 = time.time()
        r = subprocess.run(["./scripts/hf", "render", "--composition", f"scenes/{n}.html",
                            "--resolution", "landscape-4k", "--fps", str(FPS),
                            "--quality", "delivery", "--output", str(out)],
                           cwd=HF, capture_output=True, text=True)
        return n, r.returncode, time.time() - t0, r.stdout + r.stderr

    results: dict[str, tuple[int, float]] = {}
    with log_p.open("a") as log:
        log.write(f"\n## {time.strftime('%Y-%m-%dT%H:%M:%S')} {slug} channel={channel} accent={accent} "
                  f"render={todo} fresh={fresh} jobs={args.jobs}\n")
        if todo:
            print(f"  rendering {len(todo)} scene(s), {max(1, args.jobs)} at a time -> {log_p.relative_to(REPO)}")
        with cf.ThreadPoolExecutor(max_workers=max(1, args.jobs)) as ex:
            for n, rc, wall, text in ex.map(render, todo):
                out = stage / f"{slug}-{n}.mp4"
                size = out.stat().st_size if out.exists() else 0
                log.write(f"### {n} rc={rc} wall_s={wall:.1f} bytes={size}\n{text}\n")
                results[n] = (rc, wall)
                print(f"  {n}: rc={rc} {wall:.0f}s {size / 1e6:.1f} MB")
    failed = [n for n, (rc, _) in results.items() if rc != 0]
    if failed:
        sys.exit(f"hf render failed for {', '.join(failed)} — see {log_p.relative_to(REPO)}")

    # (e) publish into the episode + attribution/provenance
    vid_dir.mkdir(parents=True, exist_ok=True)
    attr = vid_dir / "ATTRIBUTION.md"
    attr_txt = attr.read_text() if attr.exists() else ""
    new_attr, new_prov = [], []
    entries: dict[str, dict] = {}
    for n in names:
        dst = vid_dir / f"hf_{n}.mp4"
        data_rel = f"hyperframes/data/{slug}/{n}.json"
        scene = json.loads((HF / "data" / slug / f"{n}.json").read_text())["scene"]
        if n in results:
            shutil.copyfile(stage / f"{slug}-{n}.mp4", dst)  # real copy — Remotion won't bundle symlinks
            info = probe(dst)
            if not probe_ok(info, want[n]):
                sys.exit(f"{dst.relative_to(REPO)}: expected {WIDTH}x{HEIGHT}@{FPS} >= {want[n]}s, got {info}")
            new_prov.append({"file": dst.relative_to(ep_root).as_posix(), "source": "hyperframes",
                             "template": f"hyperframes/templates/{scene}.html", "data": data_rel,
                             "sha": shas[n], "license": "code-rendered", "accent": accent,
                             "rendered_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())})
        line = (f"- **hf_{n}.mp4** — HyperFrames scene-kit {scene} generated from {data_rel} "
                f"(figures: CLAIMS-{slug}.md) — code-rendered, not archival")
        if line not in attr_txt and line not in new_attr:
            new_attr.append(line)
        info = probe(dst)
        entries[n] = {"sha256": shas[n], "rendered_at_frames": round(info["duration"] * FPS),
                      "duration": want[n], "accent": accent,
                      "mp4": dst.relative_to(REPO).as_posix()}
    if new_attr:
        head = "" if attr_txt else f"# ATTRIBUTION — {slug} video\n"
        sep = "" if not attr_txt or attr_txt.endswith("\n") else "\n"
        attr.write_text(attr_txt + sep + head + "\n".join(new_attr) + "\n")
    if new_prov:
        with prov.open("a", encoding="utf-8") as f:
            for row in new_prov:
                f.write(json.dumps(row, ensure_ascii=False) + "\n")

    # the --only build emptied the kit's tracked scenes/ + compositions/ down to these
    # names; rebuild the whole episode so the checkout (and `hf check`) keep every scene
    r = subprocess.run(["node", "scripts/build.mjs", "--episode", slug, "--channel", channel],
                       cwd=HF, capture_output=True, text=True)
    if r.returncode != 0:
        print(f"  WARN full kit rebuild failed (clips are fine):\n{r.stdout}{r.stderr}")

    # (f) manifest["hf"] only — re-read so a concurrent VO rebuild's keys survive
    man = json.loads(man_p.read_text())
    man.setdefault("hf", {}).update(entries)
    man_p.write_text(json.dumps(man, indent=1))
    print(f"manifest.hf: {len(entries)} entr{'y' if len(entries) == 1 else 'ies'} -> {man_p.name} "
          f"({len(results)} rendered, {len(fresh)} fresh)")


if __name__ == "__main__":
    main()
