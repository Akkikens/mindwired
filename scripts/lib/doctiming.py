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


# ── HyperFrames data scenes (BLACKBOX-2027-REVAMP §3.1) ──────────────────────
# A doc scene's `hf: "<name>"` = hyperframes/data/<slug>/<name>.json, rendered by
# scripts/build_hf_scenes.py to public/shorts/<slug>/video/hf_<name>.mp4 and
# recorded as manifest["hf"][<name>] = {sha256, rendered_at_frames, duration,
# accent, mp4}.
# hf_sha() is the ONE freshness hash: build_hf_scenes writes it, preflight
# recomputes it — both must call this, never re-derive it.
HF_ROOT = REPO / "hyperframes"


def hf_paths(slug: str, name: str) -> tuple[Path, Path | None]:
    """(data json, template html or None when the data file is unreadable /
    names no scene)."""
    data = HF_ROOT / "data" / slug / f"{name}.json"
    try:
        scene = json.loads(data.read_text()).get("scene")
    except (OSError, ValueError):
        return data, None
    return data, (HF_ROOT / "templates" / f"{scene}.html") if scene else None


# everything besides the data file + its template that shapes a rendered clip
# (accent is recorded/checked separately): the theme, the builder, the pinned CLI
HF_HASH_SHARED = ("theme/mindwired.css", "scripts/build.mjs", "scripts/hf")


def hf_sha(slug: str, name: str) -> str | None:
    """sha256 hex over data json + template html + HF_HASH_SHARED (revamp §3.1),
    each as `relpath \\0 bytes \\0` — byte-identical to build_hf_scenes.hf_hash,
    which stores it as manifest["hf"][name]["sha256"]. None if a file is missing.
    Compare by prefix (a 16-char stored value matches its full digest)."""
    import hashlib
    data, tpl = hf_paths(slug, name)
    parts = [data, tpl, *(HF_ROOT / r for r in HF_HASH_SHARED)]
    if any(p is None or not p.exists() for p in parts):
        return None
    h = hashlib.sha256()
    for p in parts:
        h.update(p.relative_to(HF_ROOT).as_posix().encode() + b"\0" + p.read_bytes() + b"\0")
    return h.hexdigest()
