#!/usr/bin/env python3
"""Generic VO + manifest builder for the mindwired archival-documentary system.

Reads a doc spec (src/mindwired-doc/docs/<slug>.json — scenes of
{id, text, img?, cap?, stat?, chapter?}), synthesizes one Cartesia clip per
scene into public/shorts/<slug>/audio/<id>.mp3, then writes
src/mindwired-doc/docs/<slug>.manifest.json with:

  durations: {id: seconds}            (ffprobe of the real clips)
  images:    {prefix: [filenames...]} (scan of public/shorts/<slug>/images)

The Remotion comp (src/mindwired-doc/DocWide.tsx) imports doc + manifest
statically, so ALWAYS run this before typecheck/render. Idempotent per clip —
re-runs never re-spend Cartesia quota on existing mp3s.

    .venv-lipsync/bin/python scripts/build_doc_vo.py <slug> [--only a1,b2] [--force] [--manifest-only]
"""
from __future__ import annotations
import argparse, json, re, subprocess, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
import cartesia  # noqa: E402

REPO = Path(__file__).resolve().parent.parent
DOCS = REPO / "src" / "mindwired-doc" / "docs"


def duration(p: Path) -> float:
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(p)], capture_output=True, text=True)
    try: return float(r.stdout.strip())
    except ValueError: return 0.0


def scan_images(img_dir: Path) -> dict[str, list[str]]:
    groups: dict[str, list[str]] = {}
    for f in sorted(img_dir.glob("*")):
        if f.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}: continue
        m = re.match(r"(.+?)_\d+$", f.stem)
        groups.setdefault(m.group(1) if m else f.stem, []).append(f.name)
    return groups


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    ap.add_argument("--only", default="")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--manifest-only", action="store_true")
    # 0.97 (was 0.94, 2026-07-19): global slowdown reads robotic per Cartesia's
    # own docs — keep the pace near-natural, let punctuation do the breathing.
    # A/B evidence: out/qa/vo_ab/ (scripts/vo_ab_test.py).
    ap.add_argument("--speed", type=float, default=None,
                    help="default: the speed this episode was built with (manifest), "
                         "else 0.97 — so --only re-synths can't splice a different "
                         "cadence between existing clips")
    args = ap.parse_args()

    doc = json.loads((DOCS / f"{args.slug}.json").read_text())
    mpath_prev = DOCS / f"{args.slug}.manifest.json"
    prev_speed = None
    if mpath_prev.exists():
        prev_speed = json.loads(mpath_prev.read_text()).get("speed")
    if args.speed is None:
        args.speed = prev_speed or 0.97
    elif prev_speed and abs(args.speed - prev_speed) > 0.001:
        print(f"NOTE: episode was built at speed {prev_speed}; you passed "
              f"{args.speed} — mixed clips will have an audible cadence jump. "
              f"Use --force to re-synth ALL clips at the new speed.")
    out = REPO / "public" / "shorts" / args.slug
    audio_dir = out / "audio"; audio_dir.mkdir(parents=True, exist_ok=True)
    only = {s.strip() for s in args.only.split(",") if s.strip()}

    durs: dict[str, float] = {}
    for s in doc["scenes"]:
        bid = s["id"]
        dst = audio_dir / f"{bid}.mp3"
        if not args.manifest_only and (not only or bid in only):
            if dst.exists() and not args.force:
                pass
            else:
                slow = "chapter" in s  # chapter cards land heavier
                audio = cartesia.tts(s["text"], voice=doc.get("voice"),
                                     language=doc.get("language", "en"),
                                     speed=(args.speed - 0.02) if slow else args.speed)
                dst.write_bytes(audio)
                print(f"->  {bid}.mp3 ({len(audio)}b)")
        if dst.exists():
            durs[bid] = round(duration(dst), 3)

    missing = [s["id"] for s in doc["scenes"] if s["id"] not in durs]
    manifest = {"durations": durs, "images": scan_images(out / "images"),
                "missing": missing, "speed": args.speed}
    mpath = DOCS / f"{args.slug}.manifest.json"
    mpath.write_text(json.dumps(manifest, indent=1))
    total = sum(durs.values())
    print(f"\n{len(durs)} clips · narration {total/60:.1f} min · manifest -> {mpath.name}")
    if missing:
        print(f"MISSING AUDIO ({len(missing)}): {','.join(missing[:20])}{'...' if len(missing) > 20 else ''}")


if __name__ == "__main__":
    main()
