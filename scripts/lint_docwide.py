#!/usr/bin/env python3
"""Lint the doc-engine renderer for type-system regressions (BLACKBOX-2027-REVAMP
§3.3 / Phase 0 #3). Born from the 2026-08-22 craft audit + 2027 revamp audit:
DossierScene shipped in Courier New and six DocWide sites bypassed dsp(), so
display type rendered in the unexpanded cut while the rest of the episode used
Archivo Expanded.

Checks every .ts/.tsx under the given dirs (default: src/mindwired-doc, docs/
JSON excluded):
  - 'Courier New' anywhere      -> use the theme mono (th.mono / MONO)
  - fontFamily: th.display      -> use ...dsp(th, <weight>) — the one place
                                   allowed to read th.display is dsp() itself

Usage:
  python3 scripts/lint_docwide.py                 # lint src/mindwired-doc
  python3 scripts/lint_docwide.py <dir|file> [...]
Exit 1 if any hit is found.
"""
from __future__ import annotations
import re, sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
DEFAULT = [REPO / "src" / "mindwired-doc"]

RULES = [
    (re.compile(r"Courier New", re.I), "Courier New -> use the theme mono (th.mono / MONO from src/lib/theme)"),
    (re.compile(r"fontFamily:\s*th\.display\b"), "raw th.display -> use ...dsp(th, <weight>)"),
]
# dsp() is the sanctioned reader of th.display; skip its body
DSP_START = re.compile(r"^\s*(export\s+)?const\s+dsp\s*=")


def files(targets: list[Path]) -> list[Path]:
    out: list[Path] = []
    for t in targets:
        if t.is_file():
            out.append(t)
        elif t.is_dir():
            out += sorted(p for p in t.rglob("*") if p.suffix in (".ts", ".tsx"))
    return out


def lint(path: Path) -> list[str]:
    hits: list[str] = []
    in_dsp = False
    for n, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if DSP_START.match(line):
            in_dsp = True
        if not in_dsp:
            for rx, msg in RULES:
                if rx.search(line):
                    rel = path.relative_to(REPO) if path.is_relative_to(REPO) else path
                    hits.append(f"{rel}:{n}: {msg}\n    {line.strip()}")
        if in_dsp and line.rstrip().endswith(";"):
            in_dsp = False
    return hits


def main() -> int:
    targets = [Path(a).resolve() for a in sys.argv[1:]] or DEFAULT
    fs = files(targets)
    hits = [h for f in fs for h in lint(f)]
    for h in hits:
        print(h)
    print(f"lint_docwide: {len(fs)} file(s), {len(hits)} hit(s)")
    return 1 if hits else 0


if __name__ == "__main__":
    sys.exit(main())
