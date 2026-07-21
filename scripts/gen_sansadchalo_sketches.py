#!/usr/bin/env python3
"""Somber ink illustrations for the DimaagBatti 'sansadchalo' episode.

Uses lipsync/gemini_host.generate() with a SOMBER editorial variant of the
locked sketch STYLE. Every illustration is:
  - anonymous: no identifiable faces / no recognizable real people
  - text-free: no words/numbers/logos (Hindi facts are overlaid by DocWide)
  - restrained: no explicit violence; documentary/editorial tone
Output: public/shorts/sansadchalo/images/<prefix>_1.png (white->alpha).

Usage:
  python3 scripts/gen_sansadchalo_sketches.py [prefix ...]     # subset
  python3 scripts/gen_sansadchalo_sketches.py --all
"""
import sys, os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "lipsync"))
sys.path.insert(0, str(ROOT / "scripts"))
import gemini_host                      # generate(prompt, out, refs, aspect)
from gen_mascot import white_to_alpha   # paper-white -> transparency

OUT = ROOT / "public/shorts/sansadchalo/images"
TMP = ROOT / "out/qa/sansadchalo_sketch_raw"
OUT.mkdir(parents=True, exist_ok=True)
TMP.mkdir(parents=True, exist_ok=True)

SOMBER_STYLE = (
    "hand-drawn EDITORIAL ink illustration, confident thick black ink outlines "
    "with a slightly wobbly hand-inked line, restrained flat MUTED tones, minimal "
    "cross-hatch shading, a single warm amber accent color #FFC53D used sparingly, "
    "clean off-white paper background, SERIOUS and SOMBER documentary tone like a "
    "newspaper op-ed illustration (NOT cheerful, NOT cute, NOT a cartoon mascot). "
    "All human figures are GENERIC and ANONYMOUS: faces left blank, shadowed, or "
    "turned away; NO recognizable real people, NO identifiable faces. No explicit "
    "violence or blood. NOT 3D, NOT airbrushed, NOT gradient-shaded, no photorealism, "
    "no text, no lettering, no numbers, no watermark, no signature, no logos."
)

# prefix -> concept (kept symbolic + anonymous; Hindi facts overlaid in Remotion)
CONCEPTS = {
 "march":       "a large crowd of young people seen FROM BEHIND marching down a wide ceremonial New Delhi boulevard (like Kartavya Path) toward a long low RED-SANDSTONE government secretariat building with a flat classical colonnade in the distance, holding up plain blank placards, evening light. Indian government architecture. Absolutely NO white-domed US-Capitol building, no tall dome.",
 "assembly":    "a peaceful gathering of people sitting and standing together calmly in an open public square, seen from a respectful distance, quiet dignity",
 "crowdscale":  "a high wide aerial view of a very dense crowd filling a broad city street, thousands of tiny anonymous figures, conveying scale",
 "examleak":    "a single blank OMR exam answer sheet and a pencil on a wooden desk under a desk lamp, a quiet sense of unease",
 "prohibitory": "a line of metal police barricades blocking an empty city street at dawn, a blank notice pinned to one barricade",
 "teargas":     "a hazy empty city street with drifting smoke and a few distant anonymous silhouettes in the mist, somber, restrained, no violence shown",
 "numbers":     "a quiet clinical hospital corridor with empty gurneys and a plain wall clock, cold light",
 "internet":    "a hand holding a smartphone that shows a broken signal / no-connection symbol, dim room",
 "movement":    "a small cluster of anonymous young people lit by the glow of their phone screens at night, an online movement",
 "demands":     "a hand-drawn checklist on a sheet of paper with three empty checkbox lines, a pen resting beside it",
 "fast":        "a lone figure sitting cross-legged on the ground wrapped in a shawl in cold pale light, head bowed, face hidden, quiet determination",
 "padyatra":    "a long single-file line of walkers with walking sticks crossing a high mountain road toward the horizon, seen from behind, small figures",
 "demands5":    "a sheet of paper with five blank horizontal ruled lines, a small empty circle bullet at the start of each line, a pen resting beside the sheet, tidy and minimal, absolutely no digits or numbers anywhere",
 "sixthschedule":"an open old law book with a ribbon bookmark, and a protective open hand hovering over a simple outline of hills, symbolic",
 "hunger":      "a lone figure seated in silent protest under a simple canvas canopy at night beside a small lamp, somber, face in shadow",
 "court":       "the dignified facade of a tall high-court building with stone pillars and wide steps, empty, overcast",
 "quotecard":   "a single torn notebook page and a plain framed paper card lying on a dark desk, blank, leaving empty space for words",
 "hospital":    "a hospital bed beside a window with a heart monitor stand, a still dim room, no person visible",
 "note":        "a hand holding a sheet of lined paper covered in illegible handwriting squiggles, close view",
 "police":      "a distant row of police personnel in riot helmets holding shields standing in a line across a street, anonymous silhouettes, neutral",
 "opposition":  "an empty speaking podium with several microphones in a press-conference setting, symbolic",
 "government":  "the distant facade of a long low red-sandstone Indian government secretariat building with a flat classical colonnade and a flagpole, official and remote, Indian government architecture, NO white dome, no US-Capitol",
 "disputed":    "two large opposing arrows meeting head-on over a frame split down the middle into two shaded halves, symbolic of two conflicting accounts",
 "verify":      "a magnifying glass held over a blurred video play-button triangle on a phone screen, small question marks, symbolic of fact-checking",
 "lehstreet":   "a quiet Himalayan town street of low flat-roofed houses with tall barren mountains behind, empty, somber grey light",
 "leh2025":     "a town street at dusk with faint drifting smoke far down the road and a few distant anonymous figures, somber and restrained, no explicit violence",
 "leh2025b":    "empty small-town streets under curfew, closed metal shop shutters and a single barricade, cold grey light, deserted",
 "detention":   "a lone figure gently escorted by two uniformed silhouettes toward a waiting vehicle, seen from behind, anonymous, restrained",
 "article19":   "an open constitution book with a quill pen, and a single open hand raised in a calm peaceful gesture above it, dignified, symbolic of rights",
 "restrictions":"a balance scale holding a small group of people on one pan and a police shield on the other, roughly level, symbolic of balancing rights and order",
 "supremecourt":"the facade of a grand domed supreme-court building with a long colonnade of pillars, dignified, empty, overcast",
 "wordmark":    "a single simple lightbulb glowing warm amber with a stylized brain-shaped filament inside, on a dark background, calm",
}

import time

def gen(prefix: str, tries: int = 4, force: bool = False):
    final = OUT / f"{prefix}_1.png"
    if final.exists() and not force:
        print(f"[{prefix}] exists, skip", flush=True); return True
    concept = CONCEPTS[prefix]
    prompt = f"{concept}. {SOMBER_STYLE}"
    raw = TMP / f"{prefix}.png"
    for attempt in range(1, tries + 1):
        try:
            if raw.exists():
                raw.unlink()
            print(f"[{prefix}] generating (try {attempt}/{tries})...", flush=True)
            gemini_host.generate(prompt, raw, [], aspect="16:9")
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

if __name__ == "__main__":
    force = "--force" in sys.argv
    args = [a for a in sys.argv[1:] if a not in ("--all", "--force")]
    todo = list(CONCEPTS) if ("--all" in sys.argv or not args) else args
    bad = [p for p in todo if p not in CONCEPTS]
    if bad:
        print("unknown prefixes:", bad); sys.exit(1)
    results = {p: gen(p, force=force) for p in todo}
    ok = sum(results.values())
    failed = [p for p, v in results.items() if not v]
    print(f"\ndone: {ok}/{len(todo)}")
    if failed:
        print("FAILED:", " ".join(failed))
