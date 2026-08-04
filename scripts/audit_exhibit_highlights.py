#!/usr/bin/env python3
"""Exhibit-highlight gate — build a contact sheet of every cited highlight box so
it can be EYEBALLED, and flag boxes that are too large to mean anything.

Born from Akshay's recurring complaint (2026-08-04): "u always miss the right
portion to highlight." Twice now a highlight box has sat on a neighbouring
paragraph instead of the sentence the narration reads — including 13 wrong
coordinates on one episode. Coordinate measurement alone is not trustworthy
(pdftotext -bbox and an ink-profile locator disagreed by ~1.5 lines on real
files), so the deliverable here is a picture a human looks at.

  python3 scripts/audit_exhibit_highlights.py <slug>
    -> out/qa/<slug>_highlights.png   (one tile per exhibit: the page cropped
                                       around the box, with redactions applied)

Warnings (stdout, non-fatal):
  BIG        highlight height > 0.06 of page height — a box spanning several
             paragraphs highlights nothing
  MISSING    exhibit scene with no highlight at all
  OFFPAGE    box extends past the page edges

Exit 0 always: a machine cannot tell whether a box is on the RIGHT sentence.
That judgement is the human's, which is the whole point of the sheet.
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw

REPO = Path(__file__).resolve().parent.parent
MAX_H = 0.06
TILE_W = 820


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 0
    slug = sys.argv[1]
    doc = json.loads((REPO / f"src/mindwired-doc/docs/{slug}.json").read_text())
    man_path = REPO / f"src/mindwired-doc/docs/{slug}.manifest.json"
    man = json.loads(man_path.read_text()) if man_path.exists() else {"images": {}}
    img_dir = REPO / f"public/shorts/{slug}/images"

    tiles, warns = [], []
    for s in doc["scenes"]:
        if not s.get("exhibit"):
            continue
        hl = s.get("highlight")
        if not hl or len(hl) != 4:
            warns.append(f"MISSING  {s['id']}: exhibit scene with no highlight box")
            continue
        x, y, w, h = hl
        if h > MAX_H:
            warns.append(f"BIG      {s['id']}: highlight height {h:.3f} > {MAX_H} "
                         f"— a box over several paragraphs highlights nothing")
        if x < 0 or y < 0 or x + w > 1.001 or y + h > 1.001:
            warns.append(f"OFFPAGE  {s['id']}: box {hl} runs past the page edge")

        files = (man.get("images") or {}).get(s.get("img", ""), [])
        if not files:
            warns.append(f"MISSING  {s['id']}: no image files for prefix {s.get('img')!r}")
            continue
        page = img_dir / files[0]
        if not page.exists():
            warns.append(f"MISSING  {s['id']}: {page.name} not on disk")
            continue

        im = Image.open(page).convert("RGB")
        pw, ph = im.size
        d = ImageDraw.Draw(im)
        for r in (s.get("redact") or []):
            if len(r) == 4:
                d.rectangle([r[0] * pw, r[1] * ph, (r[0] + r[2]) * pw, (r[1] + r[3]) * ph],
                            fill=(12, 14, 18))
        d.rectangle([x * pw, y * ph, (x + w) * pw, (y + h) * ph],
                    outline=(0, 122, 255), width=6)
        pad = max(0.05, h * 1.6)
        crop = im.crop((int(0.05 * pw), int(max(0, y - pad) * ph),
                        int(0.98 * pw), int(min(1, y + h + pad) * ph)))
        crop = crop.resize((TILE_W, max(40, int(crop.height * TILE_W / crop.width))))
        tile = Image.new("RGB", (TILE_W, crop.height + 26), (0, 0, 0))
        tile.paste(crop, (0, 26))
        ImageDraw.Draw(tile).text(
            (6, 6), f"{s['id']}   {s.get('img')}   y={y}  h={h}   {(s.get('source') or '')[:64]}",
            fill=(255, 220, 80))
        tiles.append(tile)

    out = REPO / f"out/qa/{slug}_highlights.png"
    out.parent.mkdir(parents=True, exist_ok=True)
    if tiles:
        sheet = Image.new("RGB", (TILE_W, sum(t.height + 6 for t in tiles)), (0, 0, 0))
        yy = 0
        for t in tiles:
            sheet.paste(t, (0, yy))
            yy += t.height + 6
        sheet.save(out)

    for w in warns:
        print(f"warn   exhibit-highlight: {w}")
    print(f"{slug}: {len(tiles)} exhibit highlight(s) -> {out.relative_to(REPO)}"
          f"{'  — LOOK AT IT before rendering' if tiles else ''}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
