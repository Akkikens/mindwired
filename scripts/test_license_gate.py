#!/usr/bin/env python3
"""Fixture check for the license gate (revamp Phase 2 #3, scripts/lib/licenses.py).

Builds a throwaway slug (`zz_licfixture`) in the real doc/public/metadata
paths, runs preflight_doc.py and publish_kit.py against it and asserts:
  - TSB Crown-Copyright page as an EXHIBIT          -> BLOCK naming its URL
  - same Crown-Copyright class as b-roll            -> warn only
  - CC BY-NC file (anywhere)                        -> BLOCK
  - file with no attribution inside the 25s hook    -> BLOCK
  - file with no attribution after the hook         -> warn only
  - CC BY 4.0 file whose author is missing from the METADATA credits block
                                                    -> publish_kit FAIL (exit 1)
  - same METADATA with the author credited          -> that FAIL is gone
Everything it creates is removed on exit. No network.

    python3 scripts/test_license_gate.py
"""
from __future__ import annotations

import json
import shutil
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
SLUG = "zz_licfixture"
DOC = REPO / "src" / "mindwired-doc" / "docs" / f"{SLUG}.json"
MAN = DOC.with_suffix(".manifest.json")
ROOT = REPO / "public" / "shorts" / SLUG
META = REPO / "docs" / "metadata" / f"METADATA-{SLUG}.md"
TSB_URL = "https://www.tsb.gc.ca/eng/rapports-reports/aviation/1998/a98h0003/a98h0003.pdf"
PNG = bytes.fromhex("89504e470d0a1a0a0000000d4948445200000001000000010806000000"
                    "1f15c4890000000d49444154789c6360000002000154a24f5d0000000049454e44ae426082")

SCENES = [  # (id, fields, seconds)
    ("h1", {"video": "hook_1.mp4"}, 9),
    ("h2", {"img": "mystery_hook"}, 9),            # unknown, in hook -> BLOCK
    ("e1", {"img": "tsbpage", "exhibit": True}, 9),  # crown exhibit -> BLOCK
    ("b1", {"img": "tsbbroll"}, 9),                # crown b-roll -> warn
    ("n1", {"img": "ncpic"}, 9),                   # BY-NC -> BLOCK
    ("c1", {"img": "ccphoto"}, 9),                 # CC BY -> credit check
    ("u1", {"img": "mystery"}, 9),                 # unknown after hook -> warn
]
ATTR_IMG = f"""- `tsbpage_1.png` — page 1 of TSB Canada report A98H0003 — Transportation Safety Board of Canada — Crown Copyright — {TSB_URL}
- `tsbbroll_1.png` — TSB hangar photo — Transportation Safety Board of Canada — Crown Copyright — https://www.tsb.gc.ca/eng/medias-media/photos/fixture.html
- `ncpic_1.png` — "Some research photo.jpg" by Lab Person — CC BY-NC-SA 4.0 — https://example.org/nc
- `ccphoto_1.png` — "MD-11 at Zurich.jpg" by Jane Fixture — CC BY 4.0 — https://commons.wikimedia.org/wiki/File:Fixture.jpg (commons)
"""
ATTR_VID = "- **hook_1.mp4** — Shuttle launch — Public domain (NASA) — KSC — https://images.nasa.gov/details/fixture\n"
META_BASE = """# METADATA — zz_licfixture

## Title
License Gate Fixture: The Test That Must Fail

## Alternates
1. Fixture alternate one for the license gate
2. Fixture alternate two for the license gate

FOOTAGE AND IMAGE CREDITS
{credits}

▶ MORE FROM BLACK BOX BREAKDOWN
https://youtu.be/d4_Rk50GkBg
"""


def build() -> None:
    (ROOT / "images").mkdir(parents=True, exist_ok=True)
    (ROOT / "video").mkdir(parents=True, exist_ok=True)
    doc = {"slug": SLUG, "title": "License Gate Fixture", "channel": "blackbox",
           "scenes": [{"id": i, "text": "word " * 20, **f} for i, f, _ in SCENES]}
    images = {}
    for _, f, _ in SCENES:
        if f.get("img"):
            images[f["img"]] = [f"{f['img']}_1.png"]
            (ROOT / "images" / f"{f['img']}_1.png").write_bytes(PNG)
    (ROOT / "video" / "hook_1.mp4").write_bytes(b"\0" * 64)
    (ROOT / "images" / "ATTRIBUTION.md").write_text(ATTR_IMG)
    (ROOT / "video" / "ATTRIBUTION.md").write_text(ATTR_VID)
    DOC.write_text(json.dumps(doc, indent=1))
    MAN.write_text(json.dumps({"durations": {i: s for i, _, s in SCENES}, "images": images}))


def run(*cmd: str) -> subprocess.CompletedProcess:
    return subprocess.run([sys.executable, *cmd], cwd=REPO, capture_output=True, text=True)


def main() -> int:
    for p in (DOC, MAN, ROOT, META):
        if p.exists():
            sys.exit(f"refusing to run: {p} already exists")
    bad: list[str] = []

    def check(ok: bool, what: str) -> None:
        print(("  ok    " if ok else "  FAIL  ") + what)
        if not ok:
            bad.append(what)
    try:
        build()
        pf = run("scripts/preflight_doc.py", SLUG)
        lines = pf.stdout.splitlines()
        blocks = [l for l in lines if l.startswith("BLOCK") and "license" in l]
        warns = [l for l in lines if l.startswith("warn") and "license" in l]
        print("preflight license lines:")
        for l in blocks + warns:
            print("    " + l)
        check(any("crown-copyright" in l and "e1" in l and TSB_URL in l for l in blocks),
              "TSB Crown-Copyright exhibit page BLOCKs with its URL")
        check(any("crown-copyright as b-roll" in l and "b1" in l for l in warns)
              and not any("b1" in l for l in blocks), "Crown-Copyright b-roll is warn only")
        check(any("non-commercial" in l and "n1" in l for l in blocks), "CC BY-NC BLOCKs")
        check(any("unknown" in l and "h2" in l and "hook" in l for l in blocks),
              "unattributed file inside the hook BLOCKs")
        check(any("unknown" in l and "u1" in l for l in warns)
              and not any("u1" in l for l in blocks), "unattributed file after the hook warns")
        check(pf.returncode != 0, "preflight exits non-zero")

        META.write_text(META_BASE.format(credits="Transportation Safety Board of Canada. NASA."))
        pk = run("scripts/publish_kit.py", SLUG)
        cc = [l for l in pk.stdout.splitlines() if "MISSING CC credit" in l]
        print("publish_kit CC lines (author missing):", *("    " + l for l in cc), sep="\n")
        check(pk.returncode == 1 and any("Jane Fixture" in l for l in cc),
              "CC-BY author missing from METADATA credits fails publish_kit")
        check(not any("Lab Person" in l for l in cc), "NC file is not asked for credit (it BLOCKs instead)")

        META.write_text(META_BASE.format(credits="Jane Fixture (CC BY 4.0). TSB Canada."))
        pk2 = run("scripts/publish_kit.py", SLUG)
        check(not any("MISSING CC credit" in l for l in pk2.stdout.splitlines())
              and "ok    CC credits" in pk2.stdout, "credited author clears the CC check")
    finally:
        for p in (DOC, MAN, META):
            p.unlink(missing_ok=True)
        shutil.rmtree(ROOT, ignore_errors=True)
    print("ALL PASS" if not bad else f"{len(bad)} FAILED")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
