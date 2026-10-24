#!/usr/bin/env python3
"""Scene↔visual RELEVANCE audit + cross-video reuse detector for the doc engine.

Born from viewer feedback ("AI slop", generic ocean under specific facts) and the
two-MH370-videos-same-takeoff-clip incident (2026-07-19): every concrete thing the
narration dwells on should be shown by real footage OF that thing, and a new video
must not recycle another video's footage — especially in the first-30s hook.

For every scene with an img/video it resolves the EXACT file the comp will show
(same per-prefix rotation as DocWide), then checks the narration against what the
file actually IS (source title from ATTRIBUTION.md + filename), and flags:

  MISMATCH   asset's source title is about something else (foreign entities like
             "Oakland" / "1942" that appear nowhere in the doc, near-zero overlap)
  WEAK       zero keyword overlap between narration and the asset — generic b-roll
             under a specific fact
  UNSOURCED  file has no provenance at all — no manifest.assets/videos record,
             no PROVENANCE.jsonl row, no ATTRIBUTION.md entry (AI-generated?
             untracked origin). BLOCKS (exit 2) when the file is shown inside
             the first ~30s hook or on an `exhibit` scene (a receipt with no
             origin is a fabricated receipt — revamp Phase 2 #1); warn elsewhere
  REUSE      same file shown on >3 scenes, or two adjacent scenes with the
             same visual
  HOOK-REUSE (exit 2 — preflight BLOCKS) a file in the first ~30s hook is
             byte-identical to a file already used by ANOTHER slug. New video =
             new hook footage, always.
  X-REUSE    byte-identical file shared with another slug later in the body
             (warning — allowed for true utility shots, but keep it rare)

HyperFrames data scenes (`hf` field, or any video named hf_*.mp4) are generated
graphics with their own provenance row (source: hyperframes), NOT real footage:
they are exempt from MISMATCH/WEAK/UNSOURCED/REUSE and never count as reuse of
real footage (BLACKBOX-2027-REVAMP §3.1). The hook rule for them lives in
preflight_doc.py (an hf scene in the first ~25s BLOCKS like a still).

    python3 scripts/audit_scene_relevance.py <slug> [--hook-seconds 30] [--json]

Provenance is read from the manifest FIRST (manifest.assets / manifest.videos,
written by build_doc_vo.py from PROVENANCE.jsonl + ATTRIBUTION.md), then live
from those files (scripts/lib/provenance.py) for anything the manifest lacks.

Exit codes: 0 ok/warnings, 2 any BLOCK (hook-reuse, or UNSOURCED in the hook
window / on an exhibit) — render-blocking.
Wired into preflight_doc.py — runs automatically before every render.
"""
from __future__ import annotations
import argparse, hashlib, json, re, sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "scripts" / "lib"))
import provenance  # noqa: E402
DOCS = REPO / "src" / "mindwired-doc" / "docs"
SHORTS = REPO / "public" / "shorts"

# words that carry no subject meaning in either narration or asset titles
STOP = set("""a an the of in on at to for from with by and or is are was were be been it its
this that these those as into over under after before during near his her their our your
one two three four five six seven eight nine ten first second third new old more most very
he she they we you i not no than then when where which who whose what how why all any some
""".split())
# generic media words in archive titles — matchless but also meaningless
GENERIC = set("""video footage film clip aerial view drone hd 4k 1080p timelapse time-lapse
stock free photo image picture scene shot promo trailer archive archival documentary reel
b-roll broll animation animated cc0 media file wikimedia commons united states america
international national public domain library collection department office center
""".split())
IMG_EXT = {".jpg", ".jpeg", ".png", ".webp"}
VID_EXT = {".mp4", ".webm", ".mov"}


def is_hf(fname: str | None) -> bool:
    """build_hf_scenes.py output (video/hf_<name>.mp4) — generated, not footage."""
    return bool(fname) and Path(fname).name.startswith("hf_")


def tokens(text: str) -> set[str]:
    out = set()
    for t in re.findall(r"[A-Za-z0-9][A-Za-z0-9'&-]*", text.lower()):
        t = t.strip("'-&")
        if len(t) >= 3 and t not in STOP:
            out.add(t)
    return out


def parse_attribution(dirpath: Path) -> dict[str, str]:
    """filename -> source title from ATTRIBUTION.md (the four real-file
    shapes; parser lives in lib/provenance.py so build_doc_vo, the backfill
    and this audit can't drift). Kept for callers that only want titles."""
    return {f: r["title"] for f, r in provenance.parse_attribution_rows(dirpath).items()}


def scan_images(img_dir: Path) -> dict[str, list[str]]:
    groups: dict[str, list[str]] = {}
    for f in sorted(img_dir.glob("*")):
        if f.suffix.lower() not in IMG_EXT:
            continue
        m = re.match(r"(.+?)_\d+$", f.stem)
        groups.setdefault(m.group(1) if m else f.stem, []).append(f.name)
    return groups


def resolve_visuals(doc: dict, images: dict[str, list[str]]) -> list[tuple[dict, str | None, str]]:
    """[(scene, filename-or-None, kind)] mirroring DocWide exactly: the rotation
    counter ticks for EVERY scene with an img prefix (even when another branch
    renders), and the render branch follows DocWide's precedence
    chapter > speaker > hf > video > diagram > img."""
    rotation: dict[str, int] = {}
    out = []
    for s in doc["scenes"]:
        fidx = None
        if s.get("img"):
            fidx = rotation.get(s["img"], 0)
            rotation[s["img"]] = fidx + 1
        if s.get("chapter"):
            out.append((s, None, "card"))
        elif s.get("speaker"):
            out.append((s, None, "radio"))
        elif s.get("hf"):
            out.append((s, f"hf_{s['hf']}.mp4", "hf"))
        elif s.get("video"):
            out.append((s, s["video"], "video"))
        elif s.get("diagram"):
            out.append((s, None, "diagram"))
        elif s.get("img"):
            files = images.get(s["img"], [])
            f = files[fidx % len(files)] if files else None
            out.append((s, f, "img"))
        else:
            out.append((s, None, "card"))
    return out


def foreign_entities(title: str, doc_vocab: set[str]) -> list[str]:
    """Proper-noun-ish words + years in an asset title that appear NOWHERE in the
    doc — the '1942 Marine Corps promo under an MH370 ocean scene' detector."""
    cands = re.findall(r"\b[A-Z][a-zA-Z]{3,}\b|\b[A-Z]{3,6}\b|\b(?:19|20)\d{2}\b", title)
    out = []
    for c in cands:
        cl = c.lower()
        if cl in STOP or cl in GENERIC or cl in doc_vocab:
            continue
        if c not in out:
            out.append(c)
    return out


def quick_hash(p: Path) -> str | None:
    """size + md5 of the first 128KB — None for unreadable/broken files so one
    bad symlink anywhere in public/shorts can't kill the whole gate."""
    try:
        h = hashlib.md5()
        with p.open("rb") as f:
            h.update(f.read(131072))
        return f"{p.stat().st_size}:{h.hexdigest()}"
    except OSError:
        return None


def _same_family(a: str, b: str) -> bool:
    """Locale twins (spacedeaths / spacedeaths-hi, ww2epic-en) share assets BY
    DESIGN — they are the same video localized, not cross-video recycling.
    mh370 vs mh370theories (no dash) are different videos and stay checked."""
    return a.startswith(b + "-") or b.startswith(a + "-")


def cross_slug_ledger(exclude_slug: str) -> dict[str, list[str]]:
    """hash -> ['slug/video/file.mp4', ...] for every OTHER slug's media."""
    ledger: dict[str, list[str]] = {}
    if not SHORTS.exists():
        return ledger
    for slug_dir in sorted(SHORTS.iterdir()):
        if (not slug_dir.is_dir() or slug_dir.name in (exclude_slug, "_evidence", "_wc-crests")
                or _same_family(slug_dir.name, exclude_slug)):
            continue
        for sub in ("video", "images"):
            d = slug_dir / sub
            # a symlinked media dir IS another slug's assets (localization) —
            # its real files get hashed under the slug that owns them
            if not d.exists() or d.is_symlink():
                continue
            for f in d.iterdir():
                if f.suffix.lower() in IMG_EXT | VID_EXT and not is_hf(f.name):
                    key = quick_hash(f)
                    if key:
                        ledger.setdefault(key, []).append(
                            f"{slug_dir.name}/{sub}/{f.name}")
    return ledger


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    ap.add_argument("--hook-seconds", type=float, default=30.0)
    ap.add_argument("--json", action="store_true", help="machine-readable output")
    args = ap.parse_args()
    slug = args.slug

    doc = json.loads((DOCS / f"{slug}.json").read_text())
    man_path = DOCS / f"{slug}.manifest.json"
    man = json.loads(man_path.read_text()) if man_path.exists() else {}
    durations = man.get("durations", {})
    img_dir = SHORTS / slug / "images"
    vid_dir = SHORTS / slug / "video"
    # resolve against manifest.images — the pool DocWide actually renders from
    # — so a slug whose media is archived off disk is still audited (the old
    # preflight exhibit check read the manifest too); disk scan when no manifest
    images = man.get("images") or (scan_images(img_dir) if img_dir.exists() else {})
    prov = provenance.Provenance(slug, man)

    def sub_of(kind: str) -> str:
        return "video" if kind == "video" else "images"

    def title_of(fname: str, kind: str) -> str:
        rec = prov.get(sub_of(kind), fname)
        return (rec or {}).get("title", "") or ""

    # hook window computed once, up front: UNSOURCED and HOOK-REUSE share it
    hook_ids = set(provenance.hook_scene_ids(doc, durations, args.hook_seconds))

    doc_vocab = tokens(" ".join(
        [doc.get("title", "")] +
        [f"{s.get('text','')} {s.get('cap','')} {s.get('stat','')} {s.get('chapter','')}"
         for s in doc["scenes"]]))
    # also index hyphen parts: narration says "F-GZCP" (vocab token 'f-gzcp')
    # but asset titles carry the bare 'GZCP' — without this the doc's OWN
    # subject aircraft would flag as a foreign entity
    doc_vocab |= {p for t in list(doc_vocab) for p in t.split("-") if len(p) >= 3}

    visuals = resolve_visuals(doc, images)
    findings: list[dict] = []

    # ---- per-scene relevance ----
    unsourced: dict[str, list[str]] = {}
    unsourced_kind: dict[str, str] = {}
    for s, fname, kind in visuals:
        if kind not in ("img", "video") or not fname or is_hf(fname):
            continue
        title = title_of(fname, kind)
        scene_vocab = tokens(f"{s.get('text','')} {s.get('cap','')} {s.get('stat','')}")
        asset_vocab = (tokens(title) | tokens(fname.rsplit(".", 1)[0].replace("_", " "))) - GENERIC
        overlap = sorted(scene_vocab & asset_vocab)
        if not title:
            # named in ATTRIBUTION.md but in a shape the parser can't title:
            # sourced (it has an entry), just nothing to compare narration to
            if prov.sourced(sub_of(kind), fname):
                continue
            unsourced.setdefault(fname, []).append(s["id"])
            unsourced_kind[fname] = kind
            continue
        foreign = foreign_entities(title, doc_vocab)
        if len(foreign) >= 2 and len(overlap) < 2:
            findings.append(dict(level="warn", kind="MISMATCH", id=s["id"], file=fname,
                msg=f"{s['id']}: '{fname}' is actually “{title[:70]}” — foreign to this doc "
                    f"({', '.join(foreign[:4])}). Fetch real footage of what the narration says."))
        elif not overlap:
            findings.append(dict(level="warn", kind="WEAK", id=s["id"], file=fname,
                msg=f"{s['id']}: no keyword overlap between narration and '{fname}' "
                    f"(“{title[:60]}”) — generic b-roll under a specific fact reads lazy."))
        elif foreign:
            findings.append(dict(level="info", kind="CHECK", id=s["id"], file=fname,
                msg=f"{s['id']}: '{fname}' mentions {', '.join(foreign[:3])} — not in this doc; "
                    f"eyeball that the shot can't be identified as the wrong subject."))

    exhibit_ids = {s["id"] for s in doc["scenes"] if s.get("exhibit")}
    hard_block = False
    for fname, ids in sorted(unsourced.items()):
        where = ", ".join(ids[:5]) + ("…" if len(ids) > 5 else "")
        in_hook = [i for i in ids if i in hook_ids]
        on_exhibit = [i for i in ids if i in exhibit_ids]
        if in_hook or on_exhibit:
            hard_block = True
            why = (f"inside the first {args.hook_seconds:.0f}s hook ({', '.join(in_hook)})"
                   if in_hook else f"on exhibit scene(s) {', '.join(on_exhibit)}")
            findings.append(dict(level="block", kind="UNSOURCED", id=(in_hook or on_exhibit)[0],
                file=fname,
                msg=f"'{fname}' has NO provenance (no manifest/PROVENANCE.jsonl row, no "
                    f"{sub_of(unsourced_kind[fname])}/ATTRIBUTION.md entry) and is shown {why} — "
                    f"an untracked file in the hook or on a receipt is a render BLOCK. "
                    f"Log its real source (fetch via fetch_doc_footage.py, or add the "
                    f"ATTRIBUTION line + provenance_backfill.py {slug}) or replace it."))
            continue
        findings.append(dict(level="warn", kind="UNSOURCED", id=ids[0], file=fname,
            msg=f"'{fname}' ({len(ids)} scene(s): {where}) "
                f"has no provenance entry — untracked origin (AI-generated?). "
                f"If it depicts a real event, it must be real archival."))

    # ---- variety: per-file use count + adjacent repeats ----
    use_count: dict[str, list[str]] = {}
    prev_file = None
    for s, fname, kind in visuals:
        if is_hf(fname):
            prev_file = None
            continue
        if fname:
            use_count.setdefault(fname, []).append(s["id"])
            if fname == prev_file:
                findings.append(dict(level="warn", kind="REUSE", id=s["id"], file=fname,
                    msg=f"{s['id']}: same visual '{fname}' as the previous scene — vary the shot "
                        f"(add files to the prefix pool or assign a different asset)."))
        prev_file = fname
    for fname, ids in use_count.items():
        if len(ids) > 3:
            findings.append(dict(level="warn", kind="REUSE", id=ids[0], file=fname,
                msg=f"'{fname}' appears on {len(ids)} scenes ({', '.join(ids[:6])}…) — "
                    f"cap is ~3 per video; fetch more variety."))

    # ---- cross-video reuse (new video = new footage; hook must be FRESH) ----
    # hook_ids (above): screen time = narration (or the doctiming words/2.3
    # estimate when no manifest yet) + LEAD/HOLD padding (~34 frames @30fps)
    ledger = cross_slug_ledger(slug)
    seen_x: set[str] = set()
    hook_block = False
    for s, fname, kind in visuals:
        if not fname or is_hf(fname):
            continue
        p = (vid_dir if kind == "video" else img_dir) / fname
        if not p.exists():
            continue
        key = f"{kind}:{fname}"
        if key in seen_x:
            continue
        seen_x.add(key)
        fhash = quick_hash(p)
        elsewhere = ledger.get(fhash, []) if fhash else []
        if not elsewhere:
            continue
        where = ", ".join(elsewhere[:3])
        if s["id"] in hook_ids or any(sid in hook_ids for sid in use_count.get(fname, [])):
            hook_block = True
            findings.append(dict(level="block", kind="HOOK-REUSE", id=s["id"], file=fname,
                msg=f"{s['id']}: HOOK footage '{fname}' is byte-identical to {where} — the "
                    f"first {args.hook_seconds:.0f}s must be footage no other video has used. "
                    f"Fetch fresh (scripts/fetch_footage.py)."))
        else:
            findings.append(dict(level="warn", kind="X-REUSE", id=s["id"], file=fname,
                msg=f"{s['id']}: '{fname}' also used by {where} — cross-video reuse reads as "
                    f"channel-wide slop; prefer a fresh fetch."))

    if args.json:
        print(json.dumps(findings, indent=1))
    else:
        order = {"block": 0, "warn": 1, "info": 2}
        for f in sorted(findings, key=lambda f: (order[f["level"]], f["id"])):
            tag = {"block": "BLOCK ", "warn": "warn  ", "info": "info  "}[f["level"]]
            print(f"{tag} [{f['kind']}] {f['msg']}")
        n_scenes = sum(1 for _, f, k in visuals if k in ("img", "video"))
        print(f"\n{slug}: {sum(1 for f in findings if f['level']=='block')} blocking, "
              f"{sum(1 for f in findings if f['level']=='warn')} warnings, "
              f"{sum(1 for f in findings if f['level']=='info')} info "
              f"({n_scenes} visual scenes audited)")
    return 2 if (hook_block or hard_block) else 0


if __name__ == "__main__":
    sys.exit(main())
