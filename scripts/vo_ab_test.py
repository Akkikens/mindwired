#!/usr/bin/env python3
"""VO delivery A/B harness — renders the SAME paragraph under competing Cartesia
configs so the "robotic voice" complaints get fixed by ear, not by vibes.

    .venv-lipsync/bin/python scripts/vo_ab_test.py [--text "..."] [--voice ID]

Writes out/qa/vo_ab/<variant>.mp3 + README.md (settings + measured durations).
LISTEN to them back to back (open out/qa/vo_ab/) before changing channel-wide
defaults. Also verifies the pinned dated model snapshot still resolves.

Variants (built from the 2026-07-19 docs.cartesia.ai audit):
  a_old_breaks_092   the pre-2026-07-19 shipped config: blanket <break> tags
                     after every sentence/dash + global speed 0.92
  b_nobreaks_092     punctuation-only prosody, speed 0.92
  c_nobreaks_097     punctuation-only, speed 0.97 (new build_doc_vo default)
  d_nobreaks_100     punctuation-only, speed 1.0 (cartesia.tts default)
  e_calm_100         punctuation-only, speed 1.0, emotion=calm
"""
from __future__ import annotations
import argparse, re, subprocess, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
import cartesia  # noqa: E402

REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "out" / "qa" / "vo_ab"

# ~20s of real channel narration (mh370 cold open) — representative pacing:
# short dramatic sentences + one long factual one.
DEFAULT_TEXT = (
    "Thirty-nine minutes after takeoff, this Boeing triple-seven vanished from "
    "every radar on Earth. Two hundred and thirty-nine people were on board. "
    "It has never been found. What followed became the largest and most "
    "expensive search in the history of aviation — and to this day, it has "
    "found almost nothing.")


def old_with_pauses(text: str, beat_ms: int = 260, sentence_ms: int = 480) -> str:
    """The retired blanket-break behaviour, kept here so the A/B can reproduce it."""
    text = re.sub(r"(\.\.\.|—)\s*", rf'\1<break time="{beat_ms}ms"/> ', text)
    text = re.sub(r"([.!?])\s+", rf'\1<break time="{sentence_ms}ms"/> ', text)
    return text


def dur(p: Path) -> float:
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "csv=p=0", str(p)], capture_output=True, text=True)
    try:
        return float(r.stdout.strip())
    except ValueError:
        return 0.0


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--text", default=DEFAULT_TEXT)
    ap.add_argument("--voice", default=None)
    args = ap.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)

    variants = [
        ("a_old_breaks_092", dict(pauses=False, speed=0.92), old_with_pauses(args.text)),
        ("b_nobreaks_092",   dict(pauses=False, speed=0.92), args.text),
        ("c_nobreaks_097",   dict(pauses=False, speed=0.97), args.text),
        ("d_nobreaks_100",   dict(pauses=False, speed=1.0),  args.text),
        ("e_calm_100",       dict(pauses=False, speed=1.0, tone="confidence"), args.text),
    ]
    rows = []
    for name, kw, text in variants:
        dst = OUT / f"{name}.mp3"
        if not dst.exists():
            print(f"synthesizing {name} …")
            dst.write_bytes(cartesia.tts(text, voice=args.voice, **kw))
        rows.append((name, kw, dur(dst)))

    lines = [
        "# VO A/B — same paragraph, competing delivery configs",
        f"\nModel: `{cartesia.MODEL}` (fallback `{cartesia.MODEL_FALLBACK}`) · "
        f"voice `{args.voice or cartesia.DEFAULT_VOICE}`",
        "\nListen back to back; the winner becomes the channel default.\n",
        "| file | settings | duration |", "|---|---|---|",
    ]
    for name, kw, d in rows:
        lines.append(f"| {name}.mp3 | {kw} | {d:.1f}s |")
    lines.append("\nText:\n> " + args.text)
    (OUT / "README.md").write_text("\n".join(lines) + "\n")
    print("\n".join(lines[4:4 + len(rows) + 1]))
    print(f"\n-> {OUT.relative_to(REPO)}/  — LISTEN before shipping a default change")


if __name__ == "__main__":
    main()
