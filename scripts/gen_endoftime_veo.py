#!/usr/bin/env python3
"""endoftime — 8 Veo hero clips ($30 cap, fast tier ≈ $1.5-3/clip).

Continuity rules (Akshay: clips must talk to each other like a movie):
every prompt shares STYLE (one lens, one palette, one motion grammar); the
comp applies one unifying grade/grain/letterbox on top. Idempotent per clip.

  .venv-lipsync/bin/python scripts/gen_endoftime_veo.py [--only id1,id2] [--model fast]
"""
import argparse, sys, time
from pathlib import Path
import httpx

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "lipsync"))
from veo_client import BASE, MODELS, load_key  # noqa: E402

STYLE = (
    "Widescreen 16:9 photoreal cinematic astronomy documentary shot, IMAX "
    "Interstellar-grade. Near-monochrome deep blue-black palette with a single "
    "warm amber accent. Dense parallax starfield background, subtle film grain, "
    "gentle anamorphic lens flare. ONE continuous very slow push-in, no cuts, "
    "no camera shake. Absolutely no text, no watermarks, no logos, no UI. "
    "No cartoon colors, no fantasy elements — sober, physically plausible, awe."
)

PROMPTS = {
    "redgiantearth": (
        "Realistic telescope view: a colossal dim red giant star fills the upper "
        "half of the frame — smooth deep-red photosphere with fine solar "
        "granulation like real solar telescope footage, soft limb darkening, one "
        "thin prominence arc. Below it, small in frame, a dead barren planet: "
        "uniform charcoal-grey scorched rock, NO city lights, NO oceans, NO ice, "
        "no glowing cracks — just a dark airless cinder lit dim red on one side. "
        "Nothing else in frame. Funeral-slow, monumental, sober. " + STYLE
    ),
    "laststar": (
        "The last star in the universe: a single small dim red dwarf guttering "
        "like a candle flame in an immense, almost empty black void, its light "
        "pulsing weakly, darkness pressing in from every side, one faint amber "
        "glint in an ocean of black. " + STYLE
    ),
    "blackdwarf": (
        "A dead black dwarf star: a pitch-black sphere barely visible against "
        "deep space, rimmed by the faintest deep-crimson heat shimmer, no corona, "
        "no glow, drifting silently past camera in absolute cold darkness, a few "
        "distant dim stars behind. The coldest object imaginable. " + STYLE
    ),
    "frozenearth": (
        "First-person view standing on the frozen night-side plain of a dead "
        "world: an endless plain of dark cracked ice stretching to the horizon "
        "under a black sky with only a handful of faint dying stars, one cold "
        "white point of light low on the horizon casting long faint shadows "
        "across the ice. Utterly still, utterly silent. " + STYLE
    ),
    "milkdromeda": (
        "Seen from a dark planetary ridge silhouette: two enormous spiral "
        "galaxies colliding across the entire night sky, their arms interleaving "
        "in slow motion, rivers of amber and pale blue starlight, tidal streams "
        "arcing overhead, monumental and silent. " + STYLE
    ),
    "evaporation": (
        "A bare black hole with no accretion disk: a perfect black sphere "
        "surrounded by a thin lensed ring of warped starlight, slowly shrinking "
        "while a faint violet-white Hawking glow intensifies at its edge, "
        "delicate particle wisps streaming away into darkness. The last object "
        "in the universe, dying. " + STYLE
    ),
    "finalflash": (
        "In absolute darkness, a sudden blinding white-violet burst of light — "
        "the final flash of the last evaporating black hole — a perfect sphere "
        "of light expanding and then fading, leaving pure black nothingness with "
        "the faintest afterglow. The last event in history. " + STYLE
    ),
    "hookearth": (
        "Opening shot: ONE single planet Earth seen whole from deep space at night, "
        "city lights glittering across its dark continents, thin glowing blue "
        "atmosphere rim, the sun cresting its limb in one brilliant diamond flare. "
        "Exactly one planet, whole and centered, no other planets or moons. The "
        "camera pulls back very slowly and Earth shrinks into the star field, small "
        "and fragile. Present day. The calm before deep time. " + STYLE
    ),
    "bigbangrebirth": (
        "In pure darkness, a single point of golden light ignites and blooms "
        "outward into a newborn universe: filaments of golden and pale-blue "
        "light weaving into a vast cosmic web, star nurseries flaring alight, "
        "creation unfolding in reverent slow motion. Hopeful, luminous. " + STYLE
    ),
}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default="")
    ap.add_argument("--model", default="fast")
    args = ap.parse_args()
    only = {s.strip() for s in args.only.split(",") if s.strip()}
    out = REPO / "public" / "shorts" / "endoftime" / "broll-video"
    out.mkdir(parents=True, exist_ok=True)
    key = load_key()
    model = MODELS[args.model]
    for cid, prompt in PROMPTS.items():
        if only and cid not in only: continue
        dst = out / f"{cid}.mp4"
        if dst.exists():
            print(f"skip {cid} (exists)"); continue
        print(f"-> {cid} ({model})")
        r = httpx.post(f"{BASE}/models/{model}:predictLongRunning",
            params={"key": key},
            json={"instances": [{"prompt": prompt}],
                  "parameters": {"aspectRatio": "16:9", "resolution": "1080p"}},
            timeout=60)
        r.raise_for_status()
        op = r.json()["name"]
        while True:
            time.sleep(15)
            s = httpx.get(f"{BASE}/{op}", params={"key": key}, timeout=60).json()
            if s.get("done"): break
            print("   ...")
        try:
            uri = s["response"]["generateVideoResponse"]["generatedSamples"][0]["video"]["uri"]
        except (KeyError, IndexError):
            print(f"FAILED {cid}: {str(s)[:300]}"); continue
        dl = uri + ("&" if "?" in uri else "?") + "key=" + key
        vid = httpx.get(dl, timeout=300, follow_redirects=True)
        dst.write_bytes(vid.content)
        print(f"   saved {dst.name} ({len(vid.content)//1024}kb)")

if __name__ == "__main__":
    main()
