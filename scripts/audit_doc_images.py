#!/usr/bin/env python3
"""Scene↔image audit for the mindwired-doc engine.

Renders contact sheets pairing each scene's narration text with the EXACT
image file the comp will display (per-prefix rotation, matching DocWide).
Run AFTER images+script and BEFORE VO/render; eyeball every sheet — narration
that describes a specific visual ("she is smiling") must be checked against
the actual photo, and junk/mismatched photos pruned + refetched.

    .venv-lipsync/bin/python scripts/audit_doc_images.py <slug> [--per-sheet 24]
"""
from __future__ import annotations
import argparse, json, re, sys
from collections import defaultdict
from pathlib import Path
from PIL import Image, ImageDraw

REPO = Path(__file__).resolve().parent.parent
DOCS = REPO / "src" / "mindwired-doc" / "docs"


def scan_images(img_dir: Path) -> dict[str, list[str]]:
    groups: dict[str, list[str]] = {}
    for f in sorted(img_dir.glob("*")):
        if f.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}: continue
        m = re.match(r"(.+?)_\d+$", f.stem)
        groups.setdefault(m.group(1) if m else f.stem, []).append(f.name)
    return groups


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("slug"); ap.add_argument("--per-sheet", type=int, default=24)
    args = ap.parse_args()
    doc = json.loads((DOCS / f"{args.slug}.json").read_text())
    img_dir = REPO / "public" / "shorts" / args.slug / "images"
    images = scan_images(img_dir)
    counts: dict[str, int] = defaultdict(int)

    rows = []
    for s in doc["scenes"]:
        p = s.get("img")
        if not p: rows.append((s["id"], s["text"], None)); continue
        files = images.get(p, [])
        f = files[counts[p] % len(files)] if files else None
        counts[p] += 1
        rows.append((s["id"], s["text"], f"{p} → {f}" if f else f"{p} → MISSING", img_dir / f if f else None)
                    if False else (s["id"], s["text"], img_dir / f if f else None))

    TW, TH, TXT = 300, 200, 96
    per = args.per_sheet; cols = 4
    out_dir = REPO / "out" / "qa"; out_dir.mkdir(parents=True, exist_ok=True)
    for si in range(0, len(rows), per):
        chunk = rows[si:si + per]
        rws = (len(chunk) + cols - 1) // cols
        sheet = Image.new("RGB", (cols * TW, rws * (TH + TXT)), "black")
        d = ImageDraw.Draw(sheet)
        for i, (sid, text, fp) in enumerate(chunk):
            x, y = (i % cols) * TW, (i // cols) * (TH + TXT)
            if fp and fp.exists():
                im = Image.open(fp).convert("RGB"); im.thumbnail((TW, TH))
                sheet.paste(im, (x + (TW - im.width) // 2, y))
            else:
                d.text((x + 8, y + TH // 2), "(no image)", fill="red")
            label = f"{sid}: {text}"
            words, lines, cur = label.split(), [], ""
            for w in words:
                if len(cur) + len(w) < 46: cur += (" " if cur else "") + w
                else: lines.append(cur); cur = w
                if len(lines) >= 6: break
            if cur and len(lines) < 6: lines.append(cur)
            for li, ln in enumerate(lines):
                d.text((x + 4, y + TH + 2 + li * 15), ln, fill="yellow" if li == 0 else "white")
        n = si // per + 1
        sheet.save(out_dir / f"{args.slug}_audit_{n:02d}.png")
    print(f"{(len(rows) + per - 1) // per} audit sheets -> out/qa/{args.slug}_audit_*.png")


if __name__ == "__main__":
    main()
