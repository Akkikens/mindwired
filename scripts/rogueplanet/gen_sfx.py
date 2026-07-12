#!/usr/bin/env python3
"""
Synthesize placeholder sound-design assets for the rogue-planet episode with
ffmpeg so the comp renders with real audio on every layer. These are functional
stand-ins for the brief's requested SFX (heartbeat / bass-hit / cosmic-rumble /
glass-crack / boom) — replace with real designed SFX any time; the cue map in
src/rogueplanet/lib/script.ts (SFX/MUSIC) and Video.tsx stays the same.

Run: python3 scripts/rogueplanet/gen_sfx.py
Writes public/rogueplanet/audio/sfx/*.mp3
"""
import subprocess
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent.parent
OUT = REPO / "public" / "rogueplanet" / "audio" / "sfx"
OUT.mkdir(parents=True, exist_ok=True)


def run(args):
    subprocess.run(args, check=True, capture_output=True)


def lavfi(out: str, inputs: list[str], filt: str):
    args = ["ffmpeg", "-y"]
    for i in inputs:
        args += ["-f", "lavfi", "-i", i]
    args += ["-filter_complex", filt, "-map", "[a]", "-q:a", "5", str(OUT / out)]
    run(args)


# long low cosmic drone (loopable) — 60s
lavfi("cosmic_rumble.mp3",
      ["sine=frequency=42:duration=60", "anoisesrc=d=60:c=brown:a=0.06"],
      "[0:a]volume=0.55[d];[1:a]lowpass=f=120,volume=0.6[n];"
      "[d][n]amix=inputs=2:duration=shortest,lowpass=f=170,volume=1.3[a]")

# heartbeat lub-dub (~1.1s, loopable)
lavfi("heartbeat.mp3",
      ["aevalsrc='0.9*sin(2*PI*55*t)*exp(-9*t)+0.6*sin(2*PI*48*(t-0.3))*exp(-9*(t-0.3))*gt(t,0.3)':d=1.1:s=44100"],
      "[0:a]lowpass=f=190,volume=1.2[a]")

# sub-bass hit (~1.6s) — rogue crosses the map
lavfi("bass_hit.mp3",
      ["aevalsrc='0.95*sin(2*PI*(60*exp(-1.2*t))*t)*exp(-3.2*t)':d=1.6:s=44100"],
      "[0:a]lowpass=f=200,volume=1.3[a]")

# glass crack (~0.7s) — orbit line stretches
lavfi("glass_crack.mp3",
      ["anoisesrc=d=0.7:c=white:a=0.8"],
      "[0:a]highpass=f=1800,afade=t=out:st=0.04:d=0.62,volume=1.6[a]")

# massive low boom (~2.6s) — Earth thrown from the Sun
lavfi("boom.mp3",
      ["aevalsrc='0.95*sin(2*PI*(58*exp(-1.4*t))*t)*exp(-1.7*t)':d=2.6:s=44100",
       "anoisesrc=d=0.35:c=brown:a=0.5"],
      "[1:a]lowpass=f=120[n];[0:a][n]amix=inputs=2:duration=first,volume=1.4[a]")

for f in sorted(OUT.glob("*.mp3")):
    print(f"  {f.name}")
print(f"wrote {len(list(OUT.glob('*.mp3')))} sfx to {OUT}")
