#!/usr/bin/env python3
"""endoftime VO — cloned mindwired voice over the 311-line topic script.

Reads src/mindwired-doc/docs/endoftime.json (topic format: lines[]),
writes public/shorts/endoftime/audio/<id>.mp3 + endoftime.manifest.json
(durations + image scan + veo scan). Idempotent per clip.

  .venv-lipsync/bin/python scripts/build_endoftime_vo.py [--only s001] [--force] [--manifest-only]
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


def scan(img_dir: Path, exts) -> dict[str, list[str]]:
    groups: dict[str, list[str]] = {}
    if not img_dir.exists(): return groups
    for f in sorted(img_dir.glob("*")):
        if f.suffix.lower() not in exts: continue
        m = re.match(r"(.+?)_\d+$", f.stem)
        groups.setdefault(m.group(1) if m else f.stem, []).append(f.name)
    return groups


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default="")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--manifest-only", action="store_true")
    ap.add_argument("--speed", type=float, default=0.92)  # epic = slower
    args = ap.parse_args()

    doc = json.loads((DOCS / "endoftime.json").read_text())
    out = REPO / "public" / "shorts" / "endoftime"
    audio = out / "audio"; audio.mkdir(parents=True, exist_ok=True)
    only = {s.strip() for s in args.only.split(",") if s.strip()}

    durs = {}
    for ln in doc["lines"]:
        lid = ln["id"]; dst = audio / f"{lid}.mp3"
        if not args.manifest_only and (not only or lid in only):
            if not dst.exists() or args.force:
                b = cartesia.tts(ln["text"], voice=doc.get("voice", "00d3c951-0474-4b48-814e-ef815f533e63"),
                                 language="en", speed=args.speed)
                dst.write_bytes(b)
                print(f"->  {lid}.mp3 ({len(b)}b)")
        if dst.exists(): durs[lid] = round(duration(dst), 3)

    manifest = {
        "durations": durs,
        "images": scan(out / "images", {".jpg", ".jpeg", ".png", ".webp"}),
        "veo": scan(out / "broll-video", {".mp4"}),
        "missing": [l["id"] for l in doc["lines"] if l["id"] not in durs],
    }
    (DOCS / "endoftime.manifest.json").write_text(json.dumps(manifest, indent=1))
    print(f"\n{len(durs)} clips · {sum(durs.values())/60:.1f} min · manifest written")
    bad = [l for l, d in durs.items() if d < 0.5]
    if bad: print("SUSPECT SHORT CLIPS:", bad)


if __name__ == "__main__":
    main()
