#!/usr/bin/env python3
"""
Generate an .srt for a codewired episode from its audio manifest + the scene
timeline (mirrors src/codewired/*/script.ts placement math: each spoken clip
starts at scene_from + beat; silent scenes are fixed-length).

Usage: python3 scripts/codewired/make_srt.py subagents|mcp "<out.srt>"
"""
import json
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent.parent

# (id, beat_s, tail_s, silent_fixed_s or None) — MUST mirror the comp's script.ts
TIMELINES = {
    "subagents": [
        ("hook", 1.2, 0.8, None), ("intro", 0, 0, 2.6), ("title", 0, 0, 3.6),
        ("problem", 3.2, 1.2, None), ("delegate", 3.2, 1.0, None),
        ("work", 1.0, 1.0, None), ("memory", 1.0, 1.2, None),
        ("anatomy", 3.2, 1.2, None), ("team", 3.2, 1.0, None),
        ("cost", 1.0, 1.0, None), ("mistake", 3.2, 1.2, None),
        ("rule", 1.2, 1.4, None), ("outro", 1.0, 1.0, None),
        ("subscribe", 0, 0, 7.0),
    ],
    "skills": [
        ("hook", 1.2, 0.8, None), ("intro", 0, 0, 2.6), ("title", 0, 0, 3.6),
        ("problem", 3.2, 1.2, None), ("whatis", 3.2, 1.2, None),
        ("trigger", 3.2, 1.2, None), ("anatomy", 1.2, 1.2, None),
        ("build", 3.2, 1.2, None), ("everywhere", 1.2, 1.2, None),
        ("bigpicture", 3.2, 1.2, None), ("danger", 3.2, 1.2, None),
        ("outro", 1.0, 1.0, None), ("subscribe", 0, 0, 7.0),
    ],
    "flagship": [
        ("hook", 1.2, 0.8, None), ("intro", 0, 0, 2.6), ("title", 0, 0, 4.0),
        ("map", 3.2, 1.2, None), ("loop1", 3.2, 1.2, None), ("loop2", 1.2, 1.2, None),
        ("tools", 3.2, 1.2, None), ("permissions", 3.2, 1.2, None),
        ("context", 3.2, 1.2, None), ("checkpoint", 1.2, 1.4, None),
        ("sdk", 3.2, 1.2, None), ("build", 3.2, 1.2, None),
        ("run1", 1.2, 1.0, None), ("run2", 1.0, 1.4, None),
        ("upgrades", 3.2, 1.2, None), ("reveal", 1.6, 1.6, None),
        ("outro", 1.0, 1.0, None), ("subscribe", 0, 0, 7.0),
    ],
    "mcp": [
        ("hook", 1.2, 0.8, None), ("intro", 0, 0, 2.6), ("title", 0, 0, 3.6),
        ("chaos", 3.2, 1.2, None), ("port", 3.2, 1.2, None),
        ("anatomy", 3.2, 1.2, None), ("menu", 1.2, 1.2, None),
        ("flow", 3.2, 1.2, None), ("ecosystem", 1.2, 1.2, None),
        ("danger", 3.2, 1.2, None), ("outro", 1.0, 1.0, None),
        ("subscribe", 0, 0, 7.0),
    ],
}

MAX_CHARS = 42   # per caption line (YouTube-comfortable)
MAX_DUR = 5.0    # max seconds per cue


def fmt(t: float) -> str:
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def cues_for_clip(words, offset):
    """Group linear word timings into readable cues on sentence/length breaks."""
    cues, cur, start = [], [], None
    for w in words:
        if start is None:
            start = w["start"]
        cur.append(w)
        text = " ".join(x["word"] for x in cur)
        end_sentence = bool(re.search(r"[.!?]$", w["word"]))
        too_long = len(text) > MAX_CHARS * 2 - 10
        too_slow = (w["end"] - start) > MAX_DUR
        if end_sentence or too_long or too_slow:
            cues.append((offset + start, offset + w["end"], text))
            cur, start = [], None
    if cur:
        cues.append((offset + start, offset + cur[-1]["end"],
                     " ".join(x["word"] for x in cur)))
    return cues


def two_lines(text: str) -> str:
    if len(text) <= MAX_CHARS:
        return text
    mid = len(text) // 2
    space = text.rfind(" ", 0, mid + 12)
    if space <= 0:
        return text
    return text[:space] + "\n" + text[space + 1:]


def main():
    slug, out_path = sys.argv[1], sys.argv[2]
    man = json.loads((REPO / "public" / "codewired" / slug / "audio" / "manifest.json").read_text())
    clips = man["clips"]
    cursor, all_cues = 0.0, []
    for cid, beat, tail, fixed in TIMELINES[slug]:
        if fixed is not None:
            cursor += fixed
            continue
        dur = clips[cid]["dur"]
        all_cues += cues_for_clip(clips[cid]["words"], cursor + beat)
        cursor += beat + dur + tail
    lines = []
    for i, (a, b, text) in enumerate(all_cues, 1):
        lines += [str(i), f"{fmt(a)} --> {fmt(b)}", two_lines(text), ""]
    Path(out_path).write_text("\n".join(lines))
    print(f"{len(all_cues)} cues -> {out_path}  (video ends ~{fmt(cursor)})")


if __name__ == "__main__":
    main()
