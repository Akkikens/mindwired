#!/usr/bin/env python3
"""Lint narration text for patterns TTS mispronounces — run BEFORE build_doc_vo.py /
build_short.py on every new script. (Born from the "seven hundred and thirty seven"
viewer complaints on the 737 MAX doc, 2026-07-14.)

Checks `text`/`voiceover` fields (spoken) — on-screen fields (cap/stat/mainText)
are NOT checked; they should keep the normal written form ("737 MAX").

Usage:
  python3 scripts/lint_tts_text.py                      # lint every doc + viral plan
  python3 scripts/lint_tts_text.py <path.json> [...]    # lint specific files
Exit 1 if any spoken-text hits are found.

Fix rule: spell it the way a narrator SAYS it —
  737            -> seven three seven
  737 MAX        -> seven three seven MAX
  A320           -> A three twenty
  MD-80 / DC-9   -> M D eighty / D C nine
  Flight 610     -> Flight six ten
  MiG-15 / R-16  -> MiG fifteen / R sixteen   (hyphen forms usually OK — verify by ear)
  US1549         -> US Airways fifteen forty nine
"""
from __future__ import annotations
import json, re, sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent

# spoken-text patterns that TTS engines reliably mangle
PATTERNS = [
    (re.compile(r"\b7[0-9]7(\s?MAX)?\b"), "aircraft model digits (737 -> 'seven three seven')"),
    (re.compile(r"\bA3[0-9]{2}\b"), "Airbus model (A320 -> 'A three twenty')"),
    (re.compile(r"\b(MD|DC|CRJ|ATR|ERJ)-?[0-9]{1,3}\b"), "aircraft designation (spell letters + digits)"),
    (re.compile(r"\bFlight\s[0-9]{3,4}\b"), "flight number (610 -> 'six ten', 302 -> 'three oh two')"),
    (re.compile(r"\b[A-Z]{2}[0-9]{3,4}\b"), "airline+number code (US1549 -> spoken words)"),
    (re.compile(r"\b[0-9]{1,2}:[0-9]{2}\b"), "clock time (18:45 -> 'a quarter to seven in the evening')"),
    (re.compile(r"\b[0-9]{4}s\b"), "decade (1960s is usually OK — verify by ear)"),
    (re.compile(r"[&%/@#]"), "symbol in spoken text (spell it out)"),
]
SPOKEN_KEYS = ("text", "voiceover")


def scenes_of(doc):
    if isinstance(doc, dict):
        return doc.get("scenes", doc.get("lines", []))
    return doc if isinstance(doc, list) else []


def lint(path: Path) -> list[str]:
    try:
        doc = json.loads(path.read_text())
    except Exception:
        return []
    hits = []
    for s in scenes_of(doc):
        if not isinstance(s, dict):
            continue
        for key in SPOKEN_KEYS:
            t = s.get(key)
            if not isinstance(t, str):
                continue
            for pat, why in PATTERNS:
                for m in pat.finditer(t):
                    hits.append(f"  {s.get('id','?'):12s} {key}: '{m.group(0)}'  <- {why}")
    return hits


def main() -> None:
    if len(sys.argv) > 1:
        files = [Path(a) for a in sys.argv[1:]]
    else:
        files = sorted((REPO / "src/mindwired-doc/docs").glob("*.json")) + \
                sorted((REPO / "src/viral/plans").glob("*.json"))
        files = [f for f in files if "manifest" not in f.name]
    bad = 0
    for f in files:
        hits = lint(f)
        if hits:
            bad += 1
            rel = f.relative_to(REPO) if f.is_absolute() else f
            print(f"\n{rel}")
            print("\n".join(hits))
    if bad:
        print(f"\n{bad} file(s) with TTS-risky spoken text. Fix narration (NOT caps/stats) and rerun.")
        sys.exit(1)
    print("all spoken text clean")


if __name__ == "__main__":
    main()
