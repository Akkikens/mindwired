#!/usr/bin/env python3
"""ONE command per doc-engine episode: every mandatory gate in order, human
checkpoints where CLAUDE.md demands them, then the single render+master.

    python3 scripts/ship_doc.py <slug> <CompId> [--music public/beds/bed_tension_rud.mp3]
                                [--windowed] [--music-gain-db -20] [--yes]

Order (a failing gate stops the run):
  1. lint_tts_text        spoken numbers/codes read wrong by TTS
  2. radio_recreate       scenes with `speaker` -> radio-EQ'd recreations
  3. build_doc_vo         per-scene VO + manifest (idempotent)
  4. audit_doc_images     contact sheets -> out/qa/ (CHECKPOINT: eyeball them)
  5. preflight_doc        blocks on missing assets/stale manifest/empty clips
  6. 4 stills             spread across the comp (CHECKPOINT: look at them)
  7. render_and_master    the ONE render, -14 LUFS, music ducked/windowed
  8. gen_doc_srt          SRT + CHAPTERS block

--windowed applies the long/heavy-doc music rule (bed only at cold open,
chapter transitions, closing). --yes skips the interactive checkpoints
(for reruns where the sheets/stills were already reviewed).
"""
from __future__ import annotations
import argparse, subprocess, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
import doctiming  # noqa: E402

REPO = doctiming.REPO
# TTS deps (cartesia/httpx) live in .venv-lipsync — use it when present
_venv = REPO / ".venv-lipsync" / "bin" / "python"
PY = str(_venv) if _venv.exists() else sys.executable


def run(desc: str, cmd: list[str]) -> None:
    print(f"\n=== {desc}\n$ {' '.join(cmd)}")
    if subprocess.run(cmd, cwd=REPO).returncode != 0:
        sys.exit(f"GATE FAILED: {desc}")


def checkpoint(prompt: str, auto: bool) -> None:
    if auto:
        print(f"[--yes] skipping checkpoint: {prompt}")
        return
    if input(f"\nCHECKPOINT — {prompt} Continue? [y/N] ").strip().lower() != "y":
        sys.exit("stopped at checkpoint")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    ap.add_argument("comp", help="Remotion composition id registered in Root.tsx")
    ap.add_argument("--music", type=Path)
    ap.add_argument("--windowed", action="store_true",
                    help="windowed bed (docs over ~8 min / heavy subject matter)")
    ap.add_argument("--music-gain-db", type=float, default=-20.0)
    ap.add_argument("--hd", action="store_true",
                    help="render at 1080p (default is 4K --scale 2, Akshay 2026-07-20)")
    ap.add_argument("--yes", action="store_true", help="skip interactive checkpoints")
    args = ap.parse_args()
    slug = args.slug

    run("1/8 TTS lint", [PY, "scripts/lint_tts_text.py",
                         str(doctiming.DOCS / f"{slug}.json")])
    run("2/8 radio recreations", [PY, "scripts/radio_recreate.py", slug])
    run("3/8 VO build + manifest", [PY, "scripts/build_doc_vo.py", slug])

    # run-BY-EAR check (2026-07-19, "AI voice" complaints): splice 3 clips
    # (hook / middle / last) into one sample and actually listen to it.
    import json
    doc_scenes = json.loads((doctiming.DOCS / f"{slug}.json").read_text())["scenes"]
    audio = REPO / "public" / "shorts" / slug / "audio"
    picks = list(dict.fromkeys(
        doc_scenes[i]["id"] for i in (0, len(doc_scenes) // 2, -1))) if doc_scenes else []
    clips = [audio / f"{sid}.mp3" for sid in picks if (audio / f"{sid}.mp3").exists()]
    if clips:
        sample = REPO / "out" / "qa" / f"{slug}_vo_sample.mp3"
        sample.parent.mkdir(parents=True, exist_ok=True)
        lst = sample.with_suffix(".txt")
        lst.write_text("".join(f"file '{c}'\n" for c in clips))
        rc = subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0",
                             "-i", str(lst), "-c", "copy", str(sample)], cwd=REPO).returncode
        lst.unlink(missing_ok=True)
        if rc == 0 and sample.exists() and sample.stat().st_size > 0:
            checkpoint(f"LISTEN to {sample.relative_to(REPO)} (scenes {'+'.join(picks)}) — "
                       f"pacing/emotion/pronunciation OK?", args.yes)
        else:
            checkpoint(f"VO sample concat FAILED (ffmpeg rc={rc}) — listen to 2-3 clips "
                       f"under {audio.relative_to(REPO)} by hand.", args.yes)

    run("4/8 image audit (contact sheets -> out/qa/)",
        [PY, "scripts/audit_doc_images.py", slug])
    checkpoint(f"eyeball the contact sheets in out/qa/ for {slug}.", args.yes)
    run("5/8 preflight validator", [PY, "scripts/preflight_doc.py", slug])

    doc, man = doctiming.load(slug)
    total = int(doctiming.body_seconds(doc, man["durations"]) * doctiming.FPS)
    stills = REPO / "out" / "qa" / f"{slug}_stills"
    stills.mkdir(parents=True, exist_ok=True)
    for i, fr in enumerate(int(total * p) for p in (0.02, 0.3, 0.6, 0.9)):
        run(f"6/8 still {i + 1}/4 (frame {fr})",
            ["npx", "remotion", "still", args.comp,
             str(stills / f"f{fr}.png"), f"--frame={fr}"])
    checkpoint(f"look at the 4 stills in {stills.relative_to(REPO)}.", args.yes)

    out = REPO / "out" / f"{slug}.mp4"
    cmd = [PY, "scripts/render_and_master.py", args.comp, str(out)]
    if not args.hd:  # default 4K: DOM/SVG comps scale losslessly (CLAUDE.md)
        cmd += ["--scale", "2"]
    if args.music:
        cmd += ["--music", str(args.music), "--music-gain-db", str(args.music_gain_db)]
        if args.windowed:
            cmd += ["--windows", slug]
    run("7/8 THE render + master", cmd)
    run("8/8 SRT + chapters", [PY, "scripts/gen_doc_srt.py", slug])
    print(f"\nDONE -> {out}  (verify: ffprobe duration, outro-splice frame, LUFS above)")


if __name__ == "__main__":
    main()
