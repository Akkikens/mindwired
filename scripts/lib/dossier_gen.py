"""Shared image-gen recipe for DossierScene "case file" cutouts (DocWide.tsx).

DossierScene is the illustrated sibling of ExhibitScene, used ONLY for beats
with zero real photo/footage coverage (docs/guides/DOSSIER-SCENES.md). Every
cutout is ONE Gemini still (same $0-ish direct-API route as gen_mascot.py /
gen_sansadchalo_sketches.py — no Higgsfield/paid video-gen involved anywhere
in this pipeline), white->alpha'd so it composites cleanly over the torn-paper
backdrop DossierScene renders in Remotion.

Per-episode driver: scripts/gen_doc_dossier.py <slug>. This module holds the
locked style prefix + the generate-with-retry function so that script (and any
future one) doesn't reimplement the recipe.
"""
from __future__ import annotations
import sys, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT / "lipsync"))
sys.path.insert(0, str(ROOT / "scripts"))
import gemini_host                      # generate(prompt, out, refs, aspect)
from gen_mascot import white_to_alpha   # paper-white -> transparency

# Frozen style prefix — every dossier cutout across every episode reads as one
# "case file" illustrator's hand, same locked-prefix idea as gen_mascot.STYLE.
# {accent} is the channel accent hex (THEMES in DocWide.tsx: mindwired cyan
# #4DD8FF, blackbox orange #FF9500, dimaagbatti amber #FFC53D).
CASEFILE_STYLE = (
    "product photograph of a single die-cut paper sticker, shot flat against "
    "a SEAMLESS PURE WHITE STUDIO BACKGROUND (like a die-cut sticker mockup on "
    "a white e-commerce listing) — the sticker itself depicts a black-and-white "
    "halftone photograph-style figure or object with rough scissor-cut edges "
    "and an offset accent stroke in {accent}, desaturated tan/ink/gray tones, "
    "visible print grain, flat even documentary lighting, ONE hero subject "
    "centered with generous white margin around it. "
    "CRITICAL: absolutely NO second sheet of paper, NO torn newsprint border, "
    "NO photo frame, NO metal clip, NO table or surface, NO vignette, NO drop "
    "shadow on a backdrop, NO additional collage elements of any kind — ONLY "
    "the one sticker cutout floating on flat solid white, nothing else in "
    "frame (a separate compositing step adds the torn-newsprint backdrop and "
    "chrome afterward; this image must be just the isolated cutout). "
    "NOT 3D, NOT airbrushed, NOT cartoon, NOT gradient-shaded, no photoreal "
    "skin gloss, no text, no lettering, no watermark, no signature, no logos."
)


def build_prompt(concept: str, accent: str) -> str:
    return f"{concept}. {CASEFILE_STYLE.format(accent=accent)}"


def generate_dossier_image(
    prefix: str, concept: str, accent: str, out_dir: Path,
    tmp_dir: Path, tries: int = 4, force: bool = False, aspect: str = "4:5",
) -> bool:
    """Generate ONE dossier cutout (public/shorts/<slug>/images/<prefix>_1.png),
    retrying on API hiccups exactly like gen_sansadchalo_sketches.gen()."""
    out_dir.mkdir(parents=True, exist_ok=True)
    tmp_dir.mkdir(parents=True, exist_ok=True)
    final = out_dir / f"{prefix}_1.png"
    if final.exists() and not force:
        print(f"[{prefix}] exists, skip", flush=True)
        return True
    prompt = build_prompt(concept, accent)
    raw = tmp_dir / f"{prefix}.png"
    for attempt in range(1, tries + 1):
        try:
            if raw.exists():
                raw.unlink()
            print(f"[{prefix}] generating (try {attempt}/{tries})...", flush=True)
            gemini_host.generate(prompt, raw, [], aspect=aspect)
            if raw.exists():
                white_to_alpha(raw, final)
                print(f"[{prefix}] -> {final.relative_to(ROOT)}", flush=True)
                return True
            print(f"[{prefix}] no output this try", flush=True)
        except BaseException as e:  # httpx resets, API hiccups — retry
            print(f"[{prefix}] err: {type(e).__name__}: {str(e)[:120]}", flush=True)
        time.sleep(min(5 * attempt, 20))
    print(f"[{prefix}] FAILED after {tries} tries", flush=True)
    return False
