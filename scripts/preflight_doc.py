#!/usr/bin/env python3
"""Preflight validator for doc-engine episodes — run BEFORE the ONE render.
Exits non-zero on any BLOCK so a bad render can never start.

    python3 scripts/preflight_doc.py <slug>

BLOCKS (each has burned a render or shipped a defect before):
  - manifest missing, or stale vs public/shorts/<slug>/images (files added/
    removed after build_doc_vo.py — rerun it / --manifest-only)
  - scene img prefix not in manifest.images (renders a silent black frame)
  - scene video file missing from public/shorts/<slug>/video (render-time 404)
  - diagram name not in DIAGRAMS (renders a blank scene)
  - VO mp3 missing/empty/zero-duration (Cartesia leading-"..." bug)
  - scene id missing from manifest durations (estimate fallback -> SRT drift)
  - radio scene (speaker) without an honesty radioLabel
  - sfx cue name with no matching file in public/sfx/
  - lint_tts_text.py hits on spoken text
WARNS (hook checklist — see docs/guides/HOOK-CHECKLIST.md):
  - first scene over 30 words / greeting-style opener
  - no stat/chapter in the first 4 scenes
  - final scene missing the subscribe CTA or the verbal next-video bridge
"""
from __future__ import annotations
import argparse, json, re, subprocess, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
import doctiming  # noqa: E402

REPO = doctiming.REPO
BLOCK, WARN = [], []


def block(msg): BLOCK.append(msg)
def warn(msg): WARN.append(msg)


def ffprobe_dur(p: Path) -> float:
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "csv=p=0", str(p)], capture_output=True, text=True)
    try:
        return float(r.stdout.strip())
    except ValueError:
        return 0.0


def diagram_names() -> set[str]:
    src = (REPO / "src/mindwired-doc/Diagrams.tsx").read_text()
    m = re.search(r"export const DIAGRAMS[^=]*=\s*\{(.*?)\};", src, re.S)
    return set(re.findall(r"(\w+)\s*:", m.group(1))) if m else set()


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    args = ap.parse_args()
    slug = args.slug

    doc_path = doctiming.DOCS / f"{slug}.json"
    man_path = doctiming.DOCS / f"{slug}.manifest.json"
    if not doc_path.exists():
        print(f"BLOCK: no doc spec {doc_path}"); return 1
    doc = json.loads(doc_path.read_text())
    if not man_path.exists():
        print(f"BLOCK: no manifest — run build_doc_vo.py {slug}"); return 1
    man = json.loads(man_path.read_text())
    scenes = doc["scenes"]
    durations = man.get("durations", {})

    # manifest freshness vs images dir
    img_dir = REPO / "public" / "shorts" / slug / "images"
    disk = sorted(f.name for f in img_dir.glob("*") if f.is_file()) if img_dir.exists() else []
    man_files = sorted(f for files in man.get("images", {}).values() for f in files)
    if disk != man_files:
        added = set(disk) - set(man_files); removed = set(man_files) - set(disk)
        block(f"manifest stale vs {img_dir.relative_to(REPO)} "
              f"(+{len(added)} on disk, -{len(removed)} missing) — rerun build_doc_vo.py {slug}")

    diagrams = diagram_names()
    sfx_names = {f.stem for f in (REPO / "public" / "sfx").glob("*.wav")}
    audio_dir = REPO / "public" / "shorts" / slug / "audio"
    video_dir = REPO / "public" / "shorts" / slug / "video"

    for s in scenes:
        sid = s["id"]
        if s.get("img") and s["img"] not in man.get("images", {}):
            block(f"{sid}: img prefix '{s['img']}' not in manifest.images (black frame)")
        if s.get("video") and not (video_dir / s["video"]).exists():
            block(f"{sid}: video '{s['video']}' missing from {video_dir.relative_to(REPO)}")
        if s.get("diagram") and diagrams and s["diagram"] not in diagrams:
            block(f"{sid}: diagram '{s['diagram']}' not in DIAGRAMS (blank scene)")
        if s.get("speaker") and not s.get("radioLabel"):
            block(f"{sid}: radio scene without radioLabel — label ACTUAL vs RECREATION")
        for cue in s.get("sfx", []):
            if cue.get("name") not in sfx_names:
                block(f"{sid}: sfx '{cue.get('name')}' not in public/sfx/ "
                      f"(run gen_sfx_kit.py; valid: {', '.join(sorted(sfx_names))})")
        if sid not in durations:
            block(f"{sid}: no duration in manifest (estimate fallback -> drift) — rerun build_doc_vo.py")
        clip = audio_dir / f"{sid}.mp3"
        if not clip.exists():
            block(f"{sid}: VO clip missing {clip.relative_to(REPO)}")
        elif clip.stat().st_size < 500 or ffprobe_dur(clip) < 0.15:
            block(f"{sid}: VO clip empty/near-empty ({clip.name}) — Cartesia leading-'...' bug")

    # spoken-text lint (numbers/codes read wrong by TTS)
    r = subprocess.run([sys.executable, str(REPO / "scripts/lint_tts_text.py"), str(doc_path)],
                       capture_output=True, text=True)
    if r.returncode != 0:
        block("lint_tts_text hits:\n" + (r.stdout or r.stderr).strip())

    # ---- hook checklist (warnings) ----
    first = scenes[0]
    if len(first["text"].split()) > 30:
        warn("hook: first scene over 30 words — tighten to one shocking fact")
    if re.match(r"\s*(hi|hello|hey|welcome|in this video)\b", first["text"], re.I):
        warn("hook: greeting-style opener — open on the fact, not a greeting")
    if not any(s.get("stat") or s.get("chapter") for s in scenes[:4]):
        warn("hook: no stat chip or card in the first 4 scenes — front-load a concrete number")
    last_text = scenes[-1]["text"].lower()
    if "subscribe" not in last_text:
        warn("outro: final scene has no subscribe CTA line")
    if not re.search(r"(next|wait until|if .* shocked)", last_text):
        warn("outro: no verbal next-video bridge in the final line (CLAUDE.md 2026-07-14 rule)")

    for m in BLOCK:
        print(f"BLOCK  {m}")
    for m in WARN:
        print(f"warn   {m}")
    print(f"\n{slug}: {len(BLOCK)} blocking, {len(WARN)} warnings "
          f"({len(scenes)} scenes, {doctiming.body_seconds(doc, durations):.0f}s body)")
    return 1 if BLOCK else 0


if __name__ == "__main__":
    sys.exit(main())
