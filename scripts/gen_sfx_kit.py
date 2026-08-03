#!/usr/bin/env python3
"""Synthesize the studio's core SFX kit into public/sfx/ (idempotent).

Every sound is generated locally with ffmpeg lavfi sources — owned outright,
$0, deterministic, license-clean (logged in public/sfx/LICENSES.md). These are
the cues DocWide's sfx layer plays: radio squelch around RadioScene beats,
boom on chapter cards, sub-bass hit on stat reveals, whooshes on transitions.

  python3 scripts/gen_sfx_kit.py [--force]

Re-run any time; existing files are kept unless --force.
"""
from __future__ import annotations
import argparse, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "sfx"
SR = 48000

# name -> (ffmpeg -filter_complex graph producing [out], duration_s)
KIT: dict[str, tuple[str, float]] = {
    # radio key-up: bright squelch burst + click
    "radio_key_up": (
        "anoisesrc=color=white:d=0.16:seed=71[n];"
        "[n]highpass=f=1400,lowpass=f=4200,afade=t=out:st=0.02:d=0.13,volume=0.9[out]",
        0.16),
    # radio key-down: shorter, duller mic-cut click
    "radio_key_down": (
        "anoisesrc=color=white:d=0.10:seed=72[n];"
        "[n]highpass=f=900,lowpass=f=3000,afade=t=out:st=0.01:d=0.08,volume=0.8[out]",
        0.10),
    # loopable radio-static bed (sits UNDER recreated transmissions)
    "radio_static_bed": (
        "anoisesrc=color=pink:d=12:seed=73[n];"
        "[n]highpass=f=300,lowpass=f=3200,volume=0.5[out]",
        12.0),
    # loopable low cockpit/engine hum
    "cockpit_hum": (
        "anoisesrc=color=brown:d=12:seed=74[n];sine=f=82:d=12[s];"
        "[n]lowpass=f=260,volume=0.5[nf];[s]volume=0.18[sf];"
        "[nf][sf]amix=inputs=2:normalize=0[out]",
        12.0),
    # sub-bass stat hit: 52Hz thump + tiny transient
    "stat_hit": (
        "sine=f=52:d=0.8[s];anoisesrc=color=white:d=0.03:seed=75[t];"
        "[s]afade=t=out:st=0.05:d=0.75,volume=0.9[sf];"
        "[t]lowpass=f=2500,volume=0.35[tf];"
        "[sf][tf]amix=inputs=2:normalize=0[out]",
        0.8),
    # stamp thud: a rubber stamp hitting paper — dry low-mid thump + a sharp
    # paper-click transient (DossierScene's stamp/label land, DocWide.tsx)
    "stamp_thud": (
        "sine=f=95:d=0.3[s];anoisesrc=color=white:d=0.05:seed=81[t];"
        "[s]afade=t=out:st=0.03:d=0.27,volume=0.85[sf];"
        "[t]highpass=f=1800,lowpass=f=5000,afade=t=out:st=0.01:d=0.04,volume=0.5[tf];"
        "[sf][tf]amix=inputs=2:normalize=0[out]",
        0.3),
    # chapter boom: deeper, longer, with low noise tail
    "chapter_boom": (
        "sine=f=44:d=1.8[s];anoisesrc=color=brown:d=1.8:seed=76[n];"
        "[s]afade=t=out:st=0.1:d=1.7,volume=0.9[sf];"
        "[n]lowpass=f=180,afade=t=out:st=0.0:d=1.8,volume=0.5[nf];"
        "[sf][nf]amix=inputs=2:normalize=0[out]",
        1.8),
    # transition whoosh: shaped noise swell-and-release
    "whoosh": (
        "anoisesrc=color=pink:d=0.7:seed=77[n];"
        "[n]lowpass=f=2200,highpass=f=200,"
        "afade=t=in:st=0:d=0.25,afade=t=out:st=0.3:d=0.4,volume=0.9[out]",
        0.7),
    # riser: 2.5s noise crescendo into a cut (pre-reveal tension)
    "riser": (
        "anoisesrc=color=pink:d=2.5:seed=78[n];"
        "[n]highpass=f=500,afade=t=in:st=0:d=2.3,afade=t=out:st=2.4:d=0.1,volume=0.85[out]",
        2.5),
    # heartbeat: one loopable lub-dub (~72bpm when looped at 0.83s... loop full file)
    "heartbeat": (
        "sine=f=50:d=0.12[a];sine=f=48:d=0.10[b];"
        "[a]afade=t=out:st=0.02:d=0.10,volume=0.9[af];"
        "[b]afade=t=out:st=0.02:d=0.08,adelay=220|220,volume=0.7[bf];"
        "[af][bf]amix=inputs=2:normalize=0,apad=whole_dur=0.83[out]",
        0.83),
    # cockpit warning tone: pulsing 950Hz
    "alarm": (
        "sine=f=950:d=2[s];[s]tremolo=f=4.5:d=0.9,volume=0.55,"
        "afade=t=in:st=0:d=0.05,afade=t=out:st=1.85:d=0.15[out]",
        2.0),
    # loopable wind ambience
    "ambience_wind": (
        "anoisesrc=color=brown:d=15:seed=79[n];"
        "[n]lowpass=f=520,tremolo=f=0.19:d=0.55,volume=0.6[out]",
        15.0),
    # loopable ocean ambience (slower swell, wider band)
    "ambience_ocean": (
        "anoisesrc=color=brown:d=15:seed=80[n];"
        "[n]lowpass=f=850,tremolo=f=0.11:d=0.65,volume=0.6[out]",
        15.0),
    # brand-sting ident motif: a rising A-major triad bloom that resolves to a
    # sustained chord with a shimmer tail — the mindwired audio ident (plays
    # under the wordmark bloom + spoken line in DocWide's StingScene).
    "sting_motif": (
        "sine=f=220:d=4.6[n1];sine=f=277.18:d=4.6[n2];"
        "sine=f=329.63:d=4.6[n3];sine=f=440:d=4.6[n4];"
        "[n1]afade=t=in:st=0:d=0.3,afade=t=out:st=2.6:d=1.9,volume=0.5[a1];"
        "[n2]adelay=340|340,afade=t=in:st=0.34:d=0.3,afade=t=out:st=2.7:d=1.8,volume=0.42[a2];"
        "[n3]adelay=700|700,afade=t=in:st=0.70:d=0.3,afade=t=out:st=2.8:d=1.7,volume=0.4[a3];"
        "[n4]adelay=700|700,afade=t=in:st=0.70:d=0.5,afade=t=out:st=2.8:d=1.7,volume=0.16[a4];"
        "[a1][a2][a3][a4]amix=inputs=4:normalize=0,"
        "aecho=0.8:0.9:360|620:0.24|0.15,highpass=f=80,lowpass=f=9500,"
        "volume=1.35,atrim=end=4.6[out]",
        4.6),
}

LICENSE_NOTE = """# public/sfx/ — license log

Every file in this directory was synthesized locally by scripts/gen_sfx_kit.py
using ffmpeg lavfi generators (noise/sine sources + filters). No third-party
recordings, no downloads. Owned by the channel outright; safe for monetized use
on every channel. Regenerate with: python3 scripts/gen_sfx_kit.py --force
"""


def synth(name: str, graph: str, force: bool) -> bool:
    out = OUT / f"{name}.wav"
    if out.exists() and not force:
        print(f"  = {out.name} (exists)")
        return True
    cmd = ["ffmpeg", "-y", "-v", "error", "-filter_complex", graph,
           "-map", "[out]", "-ar", str(SR), "-ac", "2", str(out)]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0 or not out.exists() or out.stat().st_size < 1000:
        print(f"  ! {name} FAILED: {r.stderr.strip()[:300]}")
        return False
    print(f"  + {out.name} ({out.stat().st_size // 1024} KB)")
    return True


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    ok = all([synth(n, g, args.force) for n, (g, _) in KIT.items()])
    (OUT / "LICENSES.md").write_text(LICENSE_NOTE)
    print(f"{'OK' if ok else 'ERRORS'}: {len(list(OUT.glob('*.wav')))} sfx in {OUT}")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
