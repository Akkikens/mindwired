"""Shared doc-engine timing math — the ONE Python mirror of DocWide.tsx.

LEAD/HOLD/FPS here MUST match src/mindwired-doc/DocWide.tsx (const LEAD, HOLD).
Everything that needs scene start/end times (SRT cues, chapter stamps, music
windows, preflight) imports this instead of re-deriving the constants.
"""
from __future__ import annotations
import json
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent.parent
DOCS = REPO / "src" / "mindwired-doc" / "docs"
LEAD, HOLD, FPS = 10, 24, 30


def load(slug: str) -> tuple[dict, dict]:
    """(doc spec, manifest) for a slug."""
    doc = json.loads((DOCS / f"{slug}.json").read_text())
    man = json.loads((DOCS / f"{slug}.manifest.json").read_text())
    return doc, man


def scene_aud(scene: dict, durations: dict) -> float:
    """Narration seconds; mirrors DocWide's words/2.3 estimate fallback.

    `durations` is manifest["durations"], NEVER the whole manifest — passing
    the full dict used to silently fall back to word-count estimates for
    every scene, producing timestamps that drift minutes wrong by the end
    (memory starfishprime-video-10fps-bug, fourth lesson). Now it raises."""
    if "durations" in durations or "images" in durations:
        raise ValueError(
            "scene_aud got the FULL manifest — pass man['durations'] "
            "(silent word-count fallback used to drift every timestamp)")
    d = durations.get(scene["id"])
    return d if d is not None else len(scene["text"].split()) / 2.3


def scene_frames(scene: dict, durations: dict) -> int:
    # extraHold mirrors DocWide.tsx (documentary-pivot pacing beat)
    return LEAD + round(scene_aud(scene, durations) * FPS) + HOLD + int(scene.get("extraHold", 0) or 0)


def scene_spans(doc: dict, durations: dict) -> list[tuple[dict, float, float]]:
    """[(scene, start_sec, end_sec)] over the doc body."""
    out, cursor = [], 0
    for s in doc["scenes"]:
        fr = scene_frames(s, durations)
        out.append((s, cursor / FPS, (cursor + fr) / FPS))
        cursor += fr
    return out


def body_seconds(doc: dict, durations: dict) -> float:
    return sum(scene_frames(s, durations) for s in doc["scenes"]) / FPS


def music_windows(doc: dict, durations: dict, *,
                  open_s: float = 25.0, chapter_pad_s: float = 8.0,
                  close_s: float = 30.0) -> list[tuple[float, float]]:
    """Score-to-the-beats windows for mix_music_windowed():
    the cold open, a swell around each chapter card, and the closing —
    dry narration in between, and NOTHING past body-end (the baked outro
    has its own audio). Overlapping/adjacent windows are merged."""
    total = body_seconds(doc, durations)
    spans = scene_spans(doc, durations)
    raw: list[tuple[float, float]] = [(0.0, min(open_s, total))]
    for s, a, b in spans:
        if s.get("chapter"):
            raw.append((max(0.0, a - chapter_pad_s), min(total, b + chapter_pad_s)))
    raw.append((max(0.0, total - close_s), total))
    raw.sort()
    merged = [raw[0]]
    for a, b in raw[1:]:
        pa, pb = merged[-1]
        if a <= pb + 2.0:
            merged[-1] = (pa, max(pb, b))
        else:
            merged.append((a, b))
    return merged
