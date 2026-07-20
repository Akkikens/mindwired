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
  UNSOURCED  file has no ATTRIBUTION.md entry (AI-generated? untracked origin) —
             verify it is not passing off a recreation as real
  REUSE      same file shown on >3 scenes, or two adjacent scenes with the
             same visual
  HOOK-REUSE (exit 2 — preflight BLOCKS) a file in the first ~30s hook is
             byte-identical to a file already used by ANOTHER slug. New video =
             new hook footage, always.
  X-REUSE    byte-identical file shared with another slug later in the body
             (warning — allowed for true utility shots, but keep it rare)

    python3 scripts/audit_scene_relevance.py <slug> [--hook-seconds 30] [--json]

Exit codes: 0 ok/warnings, 2 hook-reuse (render-blocking).
Wired into preflight_doc.py — runs automatically before every render.
"""
from __future__ import annotations
import argparse, hashlib, json, re, sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
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


def tokens(text: str) -> set[str]:
    out = set()
    for t in re.findall(r"[A-Za-z0-9][A-Za-z0-9'&-]*", text.lower()):
        t = t.strip("'-&")
        if len(t) >= 3 and t not in STOP:
            out.add(t)
    return out


def parse_attribution(dirpath: Path) -> dict[str, str]:
    """filename -> source title. Handles fetch_video (- **f** — Title — …),
    fetch_media (- `f` — "Title" by …), hand-written bare lines
    (- f.jpg — "Title", …  /  - f.jpg — PIA24681 …) and grouped shorthand
    (- amphipod_1/2/3.jpg — …) — all formats found in real ATTRIBUTION.md files."""
    out: dict[str, str] = {}
    att = dirpath / "ATTRIBUTION.md"
    if not att.exists():
        return out
    for line in att.read_text(encoding="utf-8", errors="replace").splitlines():
        line = line.strip()
        # markdown-table format (mariana): filename | subject | url | license —
        # the wiki File: name in the URL carries the real source title
        tmrow = re.match(
            r"([\w./()\- ]+\.(?:jpg|jpeg|png|webp|mp4|webm|ogv|ogg))\s*\|"
            r"\s*([^|]*)\|\s*(\S+)\s*\|", line, re.I)
        if tmrow:
            from urllib.parse import unquote
            urlname = unquote(tmrow.group(3).rsplit("File:", 1)[-1].rsplit("/", 1)[-1])
            title = f"{tmrow.group(2).strip()} {urlname.replace('_', ' ')}".strip()
            out[tmrow.group(1).strip()] = title
            continue
        m = re.match(
            r"-\s+\*{0,2}`?(.+?\.(?:jpg|jpeg|png|webp|mp4|webm|ogv|ogg))`?\*{0,2}"
            r"\s+[—–-]\s+(.+)$", line, re.I)
        if not m:
            continue
        fname_part, rest = m.group(1).strip(), m.group(2).strip()
        tm = re.match(r'["“](.+?)["”]', rest)
        title = tm.group(1) if tm else re.split(r"\s+[—–-]\s+", rest)[0]
        gm = re.match(r"(.+?_)(\d+(?:/\d+)+)(\.\w+)$", fname_part)
        names = ([f"{gm.group(1)}{n}{gm.group(3)}" for n in gm.group(2).split("/")]
                 if gm else [fname_part])
        for nme in names:
            out[nme] = title.strip()
    return out


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
    chapter > speaker > video > diagram > img."""
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
                if f.suffix.lower() in IMG_EXT | VID_EXT:
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
    durations = (json.loads(man_path.read_text()).get("durations", {})
                 if man_path.exists() else {})
    img_dir = SHORTS / slug / "images"
    vid_dir = SHORTS / slug / "video"
    images = scan_images(img_dir) if img_dir.exists() else {}
    titles = parse_attribution(img_dir) | parse_attribution(vid_dir)

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
    for s, fname, kind in visuals:
        if kind not in ("img", "video") or not fname:
            continue
        title = titles.get(fname, "")
        scene_vocab = tokens(f"{s.get('text','')} {s.get('cap','')} {s.get('stat','')}")
        asset_vocab = (tokens(title) | tokens(fname.rsplit(".", 1)[0].replace("_", " "))) - GENERIC
        overlap = sorted(scene_vocab & asset_vocab)
        if not title:
            unsourced.setdefault(fname, []).append(s["id"])
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

    for fname, ids in sorted(unsourced.items()):
        findings.append(dict(level="warn", kind="UNSOURCED", id=ids[0], file=fname,
            msg=f"'{fname}' ({len(ids)} scene(s): {', '.join(ids[:5])}{'…' if len(ids) > 5 else ''}) "
                f"has no ATTRIBUTION.md entry — untracked origin (AI-generated?). "
                f"If it depicts a real event, it must be real archival."))

    # ---- variety: per-file use count + adjacent repeats ----
    use_count: dict[str, list[str]] = {}
    prev_file = None
    for s, fname, kind in visuals:
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
    ledger = cross_slug_ledger(slug)
    hook_ids: set[str] = set()
    t = 0.0
    for s in doc["scenes"]:
        hook_ids.add(s["id"])
        # screen time = narration (or the doctiming words/2.3 estimate when no
        # manifest yet) + LEAD/HOLD padding (~34 frames @30fps)
        est = len(s.get("text", "").split()) / 2.3
        t += durations.get(s["id"], est) + 34 / 30
        if t >= args.hook_seconds:
            break
    seen_x: set[str] = set()
    hook_block = False
    for s, fname, kind in visuals:
        if not fname:
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
    return 2 if hook_block else 0


if __name__ == "__main__":
    sys.exit(main())
