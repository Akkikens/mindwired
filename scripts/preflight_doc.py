#!/usr/bin/env python3
"""Preflight validator for doc-engine episodes — run BEFORE the ONE render.
Exits non-zero on any BLOCK so a bad render can never start.

    python3 scripts/preflight_doc.py <slug>

BLOCKS (each has burned a render or shipped a defect before):
  - manifest missing, or stale vs public/shorts/<slug>/images (files added/
    removed after build_doc_vo.py — rerun it / --manifest-only)
  - scene img prefix not in manifest.images (renders a silent black frame)
  - dossier:true scene with no img prefix (renders chrome-only, no cutout)
  - scene video file missing from public/shorts/<slug>/video (render-time 404)
  - diagram name not in DIAGRAMS (renders a blank scene)
  - VO mp3 missing/empty/zero-duration (Cartesia leading-"..." bug)
  - scene id missing from manifest durations (estimate fallback -> SRT drift)
  - radio scene (speaker) without an honesty radioLabel
  - sfx cue name with no matching file in public/sfx/
  - lint_tts_text.py hits on spoken text
LESSON GATES (added 2026-08-26 — every one of these is a defect that actually
shipped or crashed a render before, each caught MANUALLY at the time; see the
memory files cited inline):
  - RETIRED narrator voice on the doc (TWA800 shipped with the old Veo clone
    2026-08-24 — nothing checked doc.voice against the current narrator)
  - duplicate scene ids (silent audio/Sequence collisions)
  - chapter field not a string (yellowstone render-crash bug)
  - chapter/kinetic scene with no img -> flat-black text card (banned,
    memory no-black-screen-text-scenes; ChapterCard reads ONLY img)
  - chapter/kinetic scene relying on `video` for its backdrop (ChapterCard/
    TextSceneBg ignore video — deepwaterhorizon bug: assigning video to a
    chapter card silently did nothing)
  - "invisible" scene: no visual field at all -> IllusScene renders black
  - numbered chapter cards out of sequence / duplicated chapter title text
    (swissair111 title-card bug — caught only by eyeballing the SRT chapters)
  - first ~25s of the episode containing a non-video, non-radio scene
    (FIRST 30 SECONDS = REAL VIDEO hard rule; warn-only for criminalrecord,
    the one documented exception)
  - video clip under 15fps (starfishprime 10fps archival clips crashed the
    OffthreadVideo compositor intermittently; !=30fps warns to conform)
  - image asset over 2600px on a side (otzi Remotion timeout) or in a
    non-RGB colorspace (recurring CMYK-JPEG ffmpeg bug, venera/otzi)
  - WARN: one img pool covering >40% of visual scenes with <5 distinct files
    (swissair111 sprawl: one 3-photo pool crept to 100+ of 179 scenes)
WARNS (hook checklist — see docs/guides/HOOK-CHECKLIST.md):
  - first scene over 30 words / greeting-style opener
  - no stat/chapter in the first 4 scenes
  - final scene missing the subscribe CTA or the verbal next-video bridge
"""
from __future__ import annotations
import argparse, hashlib, json, re, subprocess, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
import doctiming  # noqa: E402

REPO = doctiming.REPO
BLOCK, WARN = [], []

# ── narrator roster (mirrors scripts/lib/cartesia.py + CLAUDE.md's channel
# table). RETIRED ids BLOCK on any preflight: the back-catalog keeps them on
# already-shipped docs, but a doc being preflighted is a doc about to render.
GRANT = "d46abd1d-2d02-43e8-819f-51fb652c1c61"   # current EN narrator (2026-08-22)
ROBYN = "8985388c-1332-4ce7-8d55-789628aa3df4"   # approved female-narrator override
RETIRED_VOICES = {
    "00d3c951-0474-4b48-814e-ef815f533e63":
        "Veo clone (retired 2026-08-22 after real viewer accent complaints)",
}
EN_CHANNELS = {"blackbox", "mindwired", "criminalrecord"}


def block(msg): BLOCK.append(msg)
def warn(msg): WARN.append(msg)


def ffprobe_dur(p: Path) -> float:
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "csv=p=0", str(p)], capture_output=True, text=True)
    try:
        return float(r.stdout.strip())
    except ValueError:
        return 0.0


def ffprobe_fps(p: Path) -> float:
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0",
                        "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0",
                        str(p)], capture_output=True, text=True)
    try:
        num, den = r.stdout.strip().split("/")
        return float(num) / float(den) if float(den) else 0.0
    except (ValueError, ZeroDivisionError):
        return 0.0


# fields that give a scene a visible plate — a scene with NONE of these hits
# IllusScene's no-file branch and renders black (memory: astronautsscared /
# ic814kandahar / starfishprime black-screen sweeps, all found post-render)
VISUAL_FIELDS = ("img", "video", "diagram", "dossier", "kinetic", "chapter",
                 "timeline", "route", "tree", "sting", "speaker", "sketch",
                 "mascotFull", "mascotAside", "exhibit")


def diagram_names() -> set[str]:
    src = (REPO / "src/mindwired-doc/Diagrams.tsx").read_text()
    m = re.search(r"export const DIAGRAMS[^=]*=\s*\{(.*?)\};", src, re.S)
    return set(re.findall(r"(\w+)\s*:", m.group(1))) if m else set()


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    args = ap.parse_args()
    slug = args.slug

    doc_path = doctiming.DOCS / f"{slug}.json"
    man_path = doctiming.DOCS / f"{slug}.manifest.json"
    if not doc_path.exists():
        print(f"BLOCK: no doc spec {doc_path}"); return 1
    doc = json.loads(doc_path.read_text())
    if not man_path.exists():
        print(f"BLOCK: no manifest — run build_doc_vo.py {slug}"); return 1
    man = json.loads(man_path.read_text())
    scenes = doc["scenes"]
    durations = man.get("durations", {})

    # manifest freshness vs images dir
    img_dir = REPO / "public" / "shorts" / slug / "images"
    IMG_EXT = {".jpg", ".jpeg", ".png", ".webp"}  # mirror build_doc_vo.scan_images
    disk = sorted(f.name for f in img_dir.glob("*")
                  if f.is_file() and f.suffix.lower() in IMG_EXT) if img_dir.exists() else []
    man_files = sorted(f for files in man.get("images", {}).values() for f in files)
    if disk != man_files:
        added = set(disk) - set(man_files); removed = set(man_files) - set(disk)
        block(f"manifest stale vs {img_dir.relative_to(REPO)} "
              f"(+{len(added)} on disk, -{len(removed)} missing) — rerun build_doc_vo.py {slug}")

    diagrams = diagram_names()
    sfx_names = {f.stem for f in (REPO / "public" / "sfx").glob("*.wav")}
    audio_dir = REPO / "public" / "shorts" / slug / "audio"
    video_dir = REPO / "public" / "shorts" / slug / "video"

    for s in scenes:
        sid = s["id"]
        if s.get("img") and s["img"] not in man.get("images", {}):
            block(f"{sid}: img prefix '{s['img']}' not in manifest.images (black frame)")
        if s.get("dossier") and not s.get("img"):
            block(f"{sid}: dossier:true with no img prefix — renders chrome-only, "
                  f"no hero cutout (gen_doc_dossier.py)")
        if s.get("video") and not (video_dir / s["video"]).exists():
            block(f"{sid}: video '{s['video']}' missing from {video_dir.relative_to(REPO)}")
        if s.get("diagram") and diagrams and s["diagram"] not in diagrams:
            block(f"{sid}: diagram '{s['diagram']}' not in DIAGRAMS (blank scene)")
        if s.get("speaker") and not s.get("radioLabel"):
            block(f"{sid}: radio scene without radioLabel — label ACTUAL vs RECREATION")
        if s.get("speaker") and "[pause]" in s.get("text", ""):
            block(f"{sid}: [pause] marker in a RADIO scene — RadioScene renders text "
                  f"verbatim on screen; the marker is for narration-only scenes")
        # sketch-brand fields (Sketch.tsx): a typo'd pose or missing mouth
        # track renders a blank corner / frozen mouth — block before the render
        mascot_dir = REPO / "public" / "mascot"
        if s.get("react") and not (mascot_dir / f"{s['react']}.png").exists():
            block(f"{sid}: react pose '{s['react']}' not in public/mascot/ "
                  f"(run gen_mascot.py + copy, or fix the pose name)")
        if s.get("speak"):
            missing_rig = [f"host_m{k}" for k in range(4)
                           if not (mascot_dir / f"host_m{k}.png").exists()]
            if missing_rig:
                block(f"{sid}: speak:true but talking rig missing "
                      f"({', '.join(missing_rig)}) — gen_mascot.py --only host")
            if not man.get("mouth", {}).get(sid):
                block(f"{sid}: speak:true but no mouth track in manifest — "
                      f"rerun build_doc_vo.py {slug} --manifest-only")
        for cue in s.get("sfx", []):
            if cue.get("name") not in sfx_names:
                block(f"{sid}: sfx '{cue.get('name')}' not in public/sfx/ "
                      f"(run gen_sfx_kit.py; valid: {', '.join(sorted(sfx_names))})")
        if sid not in durations:
            block(f"{sid}: no duration in manifest (estimate fallback -> drift) — rerun build_doc_vo.py")
        clip = audio_dir / f"{sid}.mp3"
        if not clip.exists():
            block(f"{sid}: VO clip missing {clip.relative_to(REPO)}")
        elif clip.stat().st_size < 500 or ffprobe_dur(clip) < 0.15:
            block(f"{sid}: VO clip empty/near-empty ({clip.name}) — Cartesia leading-'...' bug")

    # ---- lesson gates (2026-08-26): shipped-defect classes, automated ----

    # narrator voice lock — TWA800 shipped with the retired clone because
    # nothing compared doc.voice to the current narrator (memory twa800-episode)
    voice = doc.get("voice")
    channel = doc.get("channel", "mindwired")
    if voice in RETIRED_VOICES:
        block(f"doc voice {voice[:8]}… is RETIRED ({RETIRED_VOICES[voice]}) — "
              f"new renders use Grant {GRANT[:8]}…; back-catalog docs keep the old "
              f"voice only as a record of what shipped, never for a new render")
    elif channel in EN_CHANNELS and voice and voice not in (GRANT, ROBYN):
        warn(f"doc voice {voice[:8]}… is neither Grant nor Robyn — intentional?")

    # duplicate scene ids -> silent Sequence/audio collisions
    seen_ids: dict[str, int] = {}
    for s in scenes:
        seen_ids[s["id"]] = seen_ids.get(s["id"], 0) + 1
    for sid, n in seen_ids.items():
        if n > 1:
            block(f"duplicate scene id '{sid}' ({n}×) — Sequences and VO clips collide")

    chapters_in_order: list[tuple[str, str]] = []   # (scene id, chapter text)
    for s in scenes:
        sid = s["id"]
        ch = s.get("chapter")
        if ch is not None and not isinstance(ch, str):
            block(f"{sid}: chapter field is {type(ch).__name__}, not a string "
                  f"(yellowstone render-crash bug)")
            continue
        if ch:
            chapters_in_order.append((sid, ch))
        # chapter cards / kinetic reveals read ONLY img (TextSceneBg): no img =
        # flat black text card (banned); a video field on them silently does
        # NOTHING (deepwaterhorizon bug) — both block before the render
        if (ch or s.get("kinetic")) and not s.get("img"):
            block(f"{sid}: chapter/kinetic scene with no img — renders flat black "
                  f"text (banned; reuse the segment's established real photo)")
        if (ch or s.get("kinetic")) and s.get("video"):
            # with an img too it's a harmless no-op field; without one the
            # author THINKS the scene has a backdrop and it renders black
            (warn if s.get("img") else block)(
                f"{sid}: chapter/kinetic scene has a `video` field — ChapterCard/"
                f"TextSceneBg IGNORE video (deepwaterhorizon bug); "
                + ("img present, video field is dead weight" if s.get("img")
                   else "use img instead"))
        # a scene with no visual field at all hits IllusScene's no-file branch
        if not any(s.get(f) for f in VISUAL_FIELDS):
            block(f"{sid}: no visual field at all ({'/'.join(VISUAL_FIELDS[:4])}/…) "
                  f"— renders a black frame")

    # numbered chapter cards must be strictly sequential, and no two chapter
    # cards may carry the same title text (swissair111 title-card bug: the
    # title card silently duplicated chapter 6's text — caught only in the SRT)
    nums = []
    for sid, ch in chapters_in_order:
        m = re.match(r"\s*(\d+)\s*[—–-]", ch)
        if m:
            nums.append((sid, int(m.group(1))))
    for (sid_a, a), (sid_b, b) in zip(nums, nums[1:]):
        if b != a + 1:
            block(f"chapter numbering breaks at {sid_b}: {a} -> {b} "
                  f"(expected {a + 1}) — renumber the chapter fields")
    norm = {}
    for sid, ch in chapters_in_order:
        key = re.sub(r"\s+", " ", re.sub(r"^\s*\d+\s*[—–-]\s*", "", ch)).strip().upper()
        if key and key in norm:
            block(f"duplicate chapter title text on {norm[key]} and {sid} "
                  f"({key!r}) — the swissair111 title-card bug")
        norm.setdefault(key, sid)
    # the title card should echo the DOC's own title, not some chapter's
    title_scene = next((s for s in scenes if s["id"] == "title" and s.get("chapter")), None)
    if title_scene and doc.get("title"):
        card = re.sub(r"\s+", " ", title_scene["chapter"]).strip().upper()
        if card and card not in re.sub(r"\s+", " ", doc["title"]).upper():
            warn(f"title card text {card!r} is not a substring of the doc title "
                 f"{doc['title']!r} — intended? (the swissair111 title-card bug "
                 f"shipped exactly this way)")

    # stale-VO gate: text edited AFTER TTS means the clip speaks the OLD words
    # while doc/SRT claim the new ones — a silent honesty defect no other gate
    # can see (audit 2026-08-26). Hashes recorded by build_doc_vo at synth time.
    texthash = man.get("texthash", {})
    if texthash:
        for s in scenes:
            h = texthash.get(s["id"])
            if h and hashlib.sha256(s["text"].encode()).hexdigest()[:16] != h:
                block(f"{s['id']}: scene text edited AFTER its VO was synthesized — "
                      f"the clip speaks the OLD text; rerun build_doc_vo.py {slug} "
                      f"--only {s['id']} --force")
    else:
        warn("manifest has no texthash record (predates the stale-VO gate) — "
             "text-vs-audio staleness NOT checked; rerun build_doc_vo.py --manifest-only "
             "after the next synth to start recording")

    # author intended footage but none was ever fetched/assigned — the ic814
    # black-cold-open class (videoQuery set, video never filled in)
    for s in scenes:
        if s.get("videoQuery") and not s.get("video"):
            warn(f"{s['id']}: has videoQuery but no `video` file — footage was "
                 f"intended here and never landed (fetch_doc_footage.py, or drop the query)")

    # exhibit pinning + provenance (TWA800 ntsbcause fix, now enforced; the
    # carlawalker false-provenance lesson): an exhibit is a RECEIPT on screen —
    # its prefix must resolve deterministically, and its file must trace to a
    # real, non-stock ATTRIBUTION entry
    attr_text = ""
    attr_path = REPO / "public" / "shorts" / slug / "images" / "ATTRIBUTION.md"
    if attr_path.exists():
        attr_text = attr_path.read_text()
    for s in scenes:
        if not s.get("exhibit"):
            continue
        sid, pref = s["id"], s.get("img")
        files = man.get("images", {}).get(pref, []) if pref else []
        if len(files) > 1:
            # measured highlight coords are per-FILE — rotation guarantees the
            # box frames the wrong page (exhibit-highlight-discipline memory);
            # without a highlight, multiple photos of the same object are OK
            # but a pinned single-file prefix is still the discipline
            (block if s.get("highlight") else warn)(
                f"{sid}: exhibit prefix '{pref}' maps to {len(files)} files — "
                + ("its highlight coords WILL land on the wrong file under "
                   "rotation; " if s.get("highlight") else "rotation risk; ")
                + "give the exhibit its own single-file prefix")
        for f in files:
            if attr_text and f not in attr_text:
                block(f"{sid}: exhibit file {f} has NO ATTRIBUTION.md entry — "
                      f"an exhibit without provenance is a fabricated receipt")
            elif attr_text and s.get("source"):
                line = next((l for l in attr_text.splitlines() if f in l), "")
                if re.search(r"pexels|pixabay", line, re.I):
                    block(f"{sid}: exhibit cites source {s['source']!r} but the file "
                          f"is generic stock ({f}) — the carlawalker false-provenance bug")

    # radio caps with hand-typed quote marks render visibly doubled (RadioScene
    # adds its own curly quotes)
    for s in scenes:
        cap = s.get("cap") or ""
        if s.get("speaker") and cap and (cap[0] in "\"'“‘" or cap[-1] in "\"'”’"):
            block(f"{s['id']}: radio cap starts/ends with a quote character — "
                  f"RadioScene adds its own quotes; strip them")

    # one img pool carrying most of the episode = the same few photos on
    # loop (swissair111 sprawl, memory idea-bank-and-asset-caps); a single
    # FILE on >20 scenes is the planetnine corrective-re-render class
    vis = [s for s in scenes if s.get("img") and not s.get("exhibit")]
    if vis:
        counts: dict[str, int] = {}
        for s in vis:
            counts[s["img"]] = counts.get(s["img"], 0) + 1
        top, n = max(counts.items(), key=lambda kv: kv[1])
        share = n / len(vis)
        files = len(man.get("images", {}).get(top, []))
        if share > 0.40 and files < 5:
            warn(f"img pool '{top}' covers {share:.0%} of {len(vis)} visual scenes "
                 f"with only {files} distinct files — cap pools at authoring time "
                 f"(CLAUDE.md 2026-08-25); full split: "
                 + ", ".join(f"{k}:{v}" for k, v in sorted(counts.items(), key=lambda kv: -kv[1])))
        for pref, cnt in counts.items():
            nfiles = max(1, len(man.get("images", {}).get(pref, [])))
            if nfiles <= 2 and cnt > 20:
                block(f"img pool '{pref}': {cnt} scenes on {nfiles} file(s) "
                      f"(~{cnt // nfiles}× per photo) — the planetnine 28×-repetition "
                      f"defect; fetch more variety or reassign scenes")

    # FIRST 30 SECONDS = REAL VIDEO (hard rule, memory hook-first-30s-real-video;
    # criminalrecord is the one documented exception -> warn there)
    t = 0.0
    for s in scenes:
        if t >= 25.0:
            break
        sid = s["id"]
        if not s.get("video") and not s.get("speaker"):
            msg = (f"{sid}: scene starting at {t:.0f}s has no `video` — first ~30s "
                   f"must be real motion footage, stills don't hold scrollers")
            (warn if channel == "criminalrecord" else block)(msg)
        t += durations.get(sid, 3.0)

    # clip fps sanity — 10fps archival cuts crashed the OffthreadVideo
    # compositor intermittently (memory starfishprime-video-10fps-bug)
    for s in scenes:
        if s.get("video"):
            vp = video_dir / s["video"]
            if vp.exists():
                fps = ffprobe_fps(vp)
                if 0 < fps < 15:
                    block(f"{s['id']}: video '{s['video']}' is {fps:.0f}fps — "
                          f"conform with `-vf fps=30` (starfishprime compositor crash)")
                elif fps and abs(fps - 30) > 0.51:
                    warn(f"{s['id']}: video '{s['video']}' is {fps:.3g}fps, comp is 30 "
                         f"— consider conforming with `-vf fps=30`")

    # image constraints — >2600px sides timed out Remotion (otzi); CMYK/odd
    # colorspaces break the ffmpeg steps (venera/otzi recurring bug)
    # files that sit BEHIND text (chapter/kinetic backdrops get dimmed ~60%
    # by TextSceneBg — a dark source photo becomes a functional black screen,
    # the voyager1 lesson: "bright-enough-after-dimming, not just img-present")
    text_bg_files: set[str] = set()
    for s in scenes:
        if (s.get("chapter") or s.get("kinetic")) and s.get("img"):
            text_bg_files.update(man.get("images", {}).get(s["img"], []))

    try:
        from PIL import Image, ImageStat
        for f in disk:
            fp = img_dir / f
            try:
                with Image.open(fp) as im:
                    if f in text_bg_files:
                        luma = ImageStat.Stat(im.convert("L")).mean[0]
                        if luma < 60:
                            warn(f"image {f} (used behind chapter/kinetic text) has "
                                 f"mean brightness {luma:.0f}/255 — after TextSceneBg "
                                 f"dimming it reads as black (voyager1 lesson)")
                    # otzi's >2600px Remotion timeout — but 2880px shipped fine
                    # on twa800, so warn 2600-4500 and block only clearly
                    # pathological sizes
                    if max(im.size) > 4500:
                        block(f"image {f} is {im.size[0]}x{im.size[1]} — oversize "
                              f"images time out Remotion (otzi); downscale it")
                    elif max(im.size) > 2600:
                        warn(f"image {f} is {im.size[0]}x{im.size[1]} — >2600px "
                             f"risked a Remotion timeout on otzi; consider downscaling")
                    if im.mode not in ("RGB", "RGBA", "L", "P"):
                        block(f"image {f} is mode {im.mode} — non-RGB JPEGs break "
                              f"the ffmpeg steps (venera/otzi); convert to RGB")
            except OSError as e:
                block(f"image {f} unreadable ({e}) — corrupt download?")
    except ImportError:
        warn("PIL not available — image size/colorspace gates SKIPPED "
             "(pip install pillow, or run under .venv-agent)")

    # spoken-text lint (numbers/codes read wrong by TTS)
    r = subprocess.run([sys.executable, str(REPO / "scripts/lint_tts_text.py"), str(doc_path)],
                       capture_output=True, text=True)
    if r.returncode != 0:
        block("lint_tts_text hits:\n" + (r.stdout or r.stderr).strip())

    # scene<->visual relevance + cross-video reuse (audit_scene_relevance.py):
    # hook footage recycled from another slug BLOCKS (new video = new hook,
    # 2026-07-19); mismatched/generic/overused visuals warn.
    r = subprocess.run([sys.executable, str(REPO / "scripts/audit_scene_relevance.py"), slug],
                       capture_output=True, text=True)
    rel_lines = [l for l in (r.stdout or "").splitlines() if l.strip()]
    if r.returncode == 2:
        block("relevance audit — hook reuses another video's footage:\n" +
              "\n".join(l for l in rel_lines if l.startswith("BLOCK")))
    elif r.returncode != 0:
        # the audit CRASHED — never let the anti-slop gate vanish silently
        warn(f"relevance audit crashed (exit {r.returncode}) — gate did NOT run; "
             f"fix and rerun: {(r.stderr or r.stdout or '').strip()[-300:]}")
    rel_warns = [l for l in rel_lines if l.startswith("warn")]
    if rel_warns:
        warn(f"relevance audit: {len(rel_warns)} scene<->visual issues — run "
             f"`python3 scripts/audit_scene_relevance.py {slug}` for the full list; top hits:")
        for l in rel_warns[:8]:
            warn("  " + l[6:].strip())

    # ---- hook checklist (warnings) ----
    first = scenes[0]
    if len(first["text"].split()) > 30:
        warn("hook: first scene over 30 words — tighten to one shocking fact")
    if re.match(r"\s*(hi|hello|hey|welcome|in this video)\b", first["text"], re.I):
        warn("hook: greeting-style opener — open on the fact, not a greeting")
    if not any(s.get("stat") or s.get("chapter") for s in scenes[:4]):
        warn("hook: no stat chip or card in the first 4 scenes — front-load a concrete number")
    # scan the last THREE scenes, not just the final one — the Kursk episode
    # kept its bridge in a separate scene before the closer and false-warned
    tail_text = " ".join(s["text"].lower() for s in scenes[-3:])
    if "subscribe" not in tail_text:
        warn("outro: no subscribe CTA line in the last 3 scenes")
    if not re.search(r"(next|wait until|if .* shocked)", tail_text):
        warn("outro: no verbal next-video bridge in the last 3 scenes (CLAUDE.md 2026-07-14 rule)")

    for m in BLOCK:
        print(f"BLOCK  {m}")
    for m in WARN:
        print(f"warn   {m}")
    # print the derived chapter list on EVERY run — the swissair111 title-card
    # bug was only ever visible in this list, previously printed post-render
    if chapters_in_order:
        print("\nCHAPTERS (eyeball these — they become the SRT/description chapter list):")
        for sid, ch in chapters_in_order:
            print(f"  {sid:8s} {ch.replace(chr(10), ' / ')}")
    print(f"\n{slug}: {len(BLOCK)} blocking, {len(WARN)} warnings "
          f"({len(scenes)} scenes, {doctiming.body_seconds(doc, durations):.0f}s body)")
    return 1 if BLOCK else 0


if __name__ == "__main__":
    sys.exit(main())
