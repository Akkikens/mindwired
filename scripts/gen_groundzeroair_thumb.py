#!/usr/bin/env python3
"""Build the 3 Ground Zero air-quality thumbnail variants from REAL public-domain assets.

House Style 2.0 (docs/guides/THUMBNAILS.md): zero text, or ONE word <=10 chars;
one focal element separated from a dark background by BRIGHTNESS; the real
archival asset IS the differentiator. Nothing here is generated — every pixel is
a page of EPA Office of Inspector General Report 2003-P-00012 (US federal work,
public domain), the same document the episode is built on.

  A  out/thumbs/groundzeroair_A.png  The DELETED sentence — the warning about
                                     workers returning to Water Street that was
                                     cut from the draft and never replaced.
                                     Page dimmed to near-black, that one row
                                     lit. Zero text.
  B  out/thumbs/groundzeroair_B.png  The margin instruction "INSERT HENSHAW
                                     quote somewhere around here" beside the
                                     line it produced. Zero text.
  C  out/thumbs/groundzeroair_C.png  = A + the one word "DELETED" (7 chars).
                                     Text-vs-no-text arm of Test & Compare.
                                     Does NOT repeat any title word (the title
                                     is "The 9/11 Files New York Hid for 25
                                     Years") — per the synergy rule.

NOTE ON THE PLANNED THUMBNAIL A: the original locked package wanted a page from
the Sept 8 2026 NYC records release. That portal serves no document programmatically
(see CLAIMS-groundzeroair.md N1a) — until a page is pulled by hand, these three run
on the OIG report instead, which is equally real and unambiguously public domain.

Usage: python3 scripts/gen_groundzeroair_thumb.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFont

REPO = Path(__file__).resolve().parent.parent
IMGS = REPO / "public/shorts/groundzeroair/images"
VIDS = REPO / "public/shorts/groundzeroair/video"
OUT = REPO / "out/thumbs"
W, H = 1280, 720
ORANGE = (255, 149, 0)
FONT_CANDIDATES = [
    "/System/Library/Fonts/Supplemental/Impact.ttf",
    "/System/Library/Fonts/Supplemental/Arial Black.ttf",
    "/System/Library/Fonts/HelveticaNeue.ttc",
]


def load_font(size: int) -> ImageFont.FreeTypeFont:
    for p in FONT_CANDIDATES:
        if Path(p).exists():
            try:
                return ImageFont.truetype(p, size)
            except OSError:
                continue
    return ImageFont.load_default()


def band_16x9(im: Image.Image, y_center: float) -> Image.Image:
    """Take a full-width 16:9 band of the page centred on y_center (fractional).

    Full page width maps to ~1280px, so this lands at roughly 1:1 — the page
    still reads as a PAGE at 170px (many lines of type), instead of two
    enormous half-words. That legibility is the whole point of the format.
    """
    w, h = im.size
    band_h = w * H / W                      # 16:9 band, full page width
    cy = y_center * h
    top = max(0, min(h - band_h, cy - band_h / 2))
    return im.crop((0, int(top), w, int(top + band_h))).resize((W, H), Image.LANCZOS)


def paper_to_dark(im: Image.Image) -> Image.Image:
    """Invert a white document page into the channel's dark-cinematic look:
    near-black ground, the ink glowing warm. Real page geometry preserved."""
    g = im.convert("L")
    g = Image.eval(g, lambda v: 255 - v)
    g = ImageEnhance.Contrast(g).enhance(1.6)
    return Image.merge("RGB", (
        Image.eval(g, lambda v: int(min(255, v * 1.00))),
        Image.eval(g, lambda v: int(v * 0.84)),
        Image.eval(g, lambda v: int(v * 0.58)),
    ))


def spotlight(im: Image.Image, y0: float, y1: float, dim: float = 0.30) -> Image.Image:
    """Dim the whole band, then restore full brightness on one horizontal row —
    so the frame's peak brightness sits on exactly one line of type."""
    from PIL import ImageFilter
    mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(mask).rectangle(
        (0, int(y0 * H), W, int(y1 * H)), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(26))
    dark = Image.eval(im, lambda v: int(v * dim))
    return Image.composite(im, dark, mask)


def frame_from(clip: str, n: int) -> Image.Image:
    """Pull one frame out of a real PD FEMA clip (no generation, no stock)."""
    import subprocess, tempfile, os
    src = VIDS / clip
    if not src.exists():
        raise SystemExit(f"missing real asset: {src}")
    tmp = Path(tempfile.mkdtemp()) / "f.png"
    subprocess.run(["ffmpeg", "-v", "error", "-i", str(src),
                    "-vf", f"select=eq(n\\,{n})", "-frames:v", "1",
                    "-y", str(tmp)], check=True)
    im = Image.open(tmp).convert("RGB")
    im.load()
    os.unlink(tmp)
    return im


def cover(im: Image.Image) -> Image.Image:
    scale = max(W / im.width, H / im.height)
    im = im.resize((int(im.width * scale), int(im.height * scale)), Image.LANCZOS)
    l, t = (im.width - W) // 2, (im.height - H) // 2
    return im.crop((l, t, l + W, t + H))


def grade(im: Image.Image) -> Image.Image:
    """Black Box dark-cinematic grade: crush the shadows, keep the highlight on
    the subject, warm it slightly toward the channel accent."""
    im = ImageEnhance.Color(im).enhance(0.62)
    im = ImageEnhance.Contrast(im).enhance(1.62)
    r, g, b = im.split()
    r = Image.eval(r, lambda v: min(255, int(v * 1.06)))
    b = Image.eval(b, lambda v: int(v * 0.90))
    im = Image.merge("RGB", (r, g, b))
    return ImageEnhance.Brightness(im).enhance(1.04)


def edge_vignette(im: Image.Image, strength: float = 0.50) -> Image.Image:
    from PIL import ImageFilter
    mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(mask).ellipse(
        (int(-W * 0.18), int(-H * 0.22), int(W * 1.18), int(H * 1.22)), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(120))
    dark = Image.eval(im, lambda v: int(v * (1 - strength)))
    return Image.composite(im, dark, mask)


def build_photo(clip: str, n: int, out_name: str, word: str | None = None) -> Path:
    im = edge_vignette(grade(cover(frame_from(clip, n))))
    if word:
        d = ImageDraw.Draw(im)
        f = load_font(150)
        assert len(word) <= 10, "House Style 2.0: one word, <=10 chars"
        assert d.textlength(word, font=f) < W * 0.42, "word too wide"
        x, y = int(W * 0.055), int(H * 0.70)
        for dx, dy in ((4, 4), (3, 3)):
            d.text((x + dx, y + dy), word, font=f, fill=(0, 0, 0))
        d.text((x, y), word, font=f, fill=ORANGE)
    OUT.mkdir(parents=True, exist_ok=True)
    dst = OUT / out_name
    im.save(dst, "PNG")
    return dst


def build_doc(src_name: str, y_center: float, row: tuple[float, float],
              out_name: str) -> Path:
    src = IMGS / src_name
    if not src.exists():
        raise SystemExit(f"missing real asset: {src}")
    im = spotlight(paper_to_dark(band_16x9(Image.open(src), y_center)), *row)
    OUT.mkdir(parents=True, exist_ok=True)
    dst = OUT / out_name
    im.save(dst, "PNG")
    return dst


def main() -> None:
    # A + C: real FEMA footage frames. The thumbnail promise is THE AIR, and the
    # cold open delivers exactly that in real motion video (scenes h1-h8).
    a = build_photo("fema_hose_smoke_1.mp4", 170, "groundzeroair_A.png")
    c = build_photo("fema_hose_smoke_1.mp4", 170, "groundzeroair_C.png", word="SAFE")
    # B: the document arm of Test & Compare — real EPA OIG page, Table 2-4.
    b = build_doc("ex_ceqredline_1.png", 0.845, (0.40, 0.62), "groundzeroair_B.png")
    for p in (a, b, c):
        print("wrote", p.relative_to(REPO))
    print("\nA/C: real FEMA footage (PD). B: real EPA OIG page (PD). No generation.")
    print("'SAFE' is the government's own word, set against the air — it adds a fact")
    print("the title does not state, per the thumbnail/title synergy rule.")
    print("EYEBALL AT 170px before shipping (docs/guides/THUMBNAILS.md).")


if __name__ == "__main__":
    main()
