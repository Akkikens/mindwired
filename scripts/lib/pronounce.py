#!/usr/bin/env python3
"""Pronunciation layer for spoken narration — applied at SYNTH time only.

The TTS lint (lint_tts_text.py) catches *classes* of risky text (digits,
codes, ALL-CAPS); it cannot know that Cartesia reads "Haise" as "hay-see"
or "Liebergot" as "lee-BER-gott". This map holds per-word respellings the
way a narrator SAYS them, applied to the transcript right before the API
call — the doc JSON, on-screen text, and whisper SRT all keep the real
written forms, so honesty/searchability are untouched.

Add entries when an ear-check catches a mangle; never delete a shipped
entry without re-listening. Matching is whole-word, case-preserving on the
replacement (use the exact respelled casing you want spoken).
"""
from __future__ import annotations
import re

# written form (as it appears in scene text) -> spoken respelling
PRONOUNCE: dict[str, str] = {
    # ── Apollo 13 (2026-08-22) ──
    "Haise": "Hayes",                 # Fred Haise — rhymes with "days"
    "Liebergot": "Leebergott",        # Sy Liebergot, EECOM
    "Cortright": "Cortwright",        # Edgar Cortright, Review Board chair
    "Mattingly": "Mattingly",         # verified clean — kept as a listened-OK marker
    # ── Thai Cave Rescue (2026-08-21, ear-checked that session) ──
    "Tham Luang": "Tam Luang",        # aspirated Th- read as "Thham" otherwise
    "Ekkapol": "Ekkapon",             # closer to the Thai pronunciation
    "Chantawong": "Chantawong",       # listened-OK marker
    "Narongsak": "Narongsak",         # listened-OK marker
    # ── recurring channel vocabulary ──
    "NORSAR": "Norsar",               # else spelled letter-by-letter
    "Kolesnikov": "Kolesnikov",       # listened-OK marker
}

_PATTERNS = [(re.compile(rf"\b{re.escape(k)}\b"), v)
             for k, v in PRONOUNCE.items() if k != v]


def respell(text: str) -> str:
    """Apply spoken respellings to a narration string."""
    for pat, spoken in _PATTERNS:
        text = pat.sub(spoken, text)
    return text
