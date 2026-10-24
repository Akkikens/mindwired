#!/usr/bin/env python3
"""Fixture check for the structured-provenance gates (revamp Phase 2 #1).

Builds a throwaway slug (`zz_provfixture`) in the real doc/public paths, runs
provenance_backfill.py -> build_doc_vo.py --manifest-only -> preflight_doc.py
and asserts the rule:
  - UNSOURCED video inside the first ~30s hook        -> BLOCK
  - UNSOURCED exhibit page (anywhere)                 -> BLOCK
  - UNSOURCED video after the hook                    -> warn only
  - legacy-unverified video inside the hook           -> BLOCK
  - legacy-unverified video after the hook            -> warn only
  - a human --verify row clears a legacy file
  - manifest.assets / manifest.videos written, other manifest keys intact
Everything it creates is removed on exit. No network, no Cartesia spend
(--manifest-only never synthesizes).

    python3 scripts/test_provenance_gates.py
"""
from __future__ import annotations

import json
import shutil
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
SLUG = "zz_provfixture"
DOC = REPO / "src" / "mindwired-doc" / "docs" / f"{SLUG}.json"
MAN = DOC.with_suffix(".manifest.json")
ROOT = REPO / "public" / "shorts" / SLUG
WORDS = " ".join(["word"] * 23)   # ~10s of estimated narration per scene
HOOK_WORDS = " ".join(["word"] * 40)   # ~17s: h1+h2 fill the 30s hook window
# a real 1x1 PNG so the image-shape gates stay quiet about the fixture
PNG = bytes.fromhex("89504e470d0a1a0a0000000d4948445200000001000000010806000000"
                    "1f15c4890000000d49444154789c6360000002000154a24f5d0000000049454e44ae426082")


def py_with_httpx() -> str:
    for cand in (sys.executable, "/usr/bin/python3", "python3"):
        r = subprocess.run([cand, "-c", "import httpx"], capture_output=True)
        if r.returncode == 0:
            return cand
    return sys.executable


def run(*cmd: str, py: str = sys.executable) -> subprocess.CompletedProcess:
    return subprocess.run([py, *cmd], capture_output=True, text=True, cwd=REPO)


def main() -> int:
    if DOC.exists() or ROOT.exists():
        sys.exit(f"refusing to run: {SLUG} already exists")
    fails: list[str] = []
    try:
        (ROOT / "video").mkdir(parents=True)
        (ROOT / "images").mkdir(parents=True)
        for f in ("hook_unsourced_1.mp4", "hook_legacy_1.mp4", "late_unsourced_1.mp4",
                  "late_legacy_1.mp4", "late_checked_1.mp4"):
            (ROOT / "video" / f).write_bytes(b"\0" * 64)
        (ROOT / "images" / "ex_page.png").write_bytes(PNG)
        (ROOT / "images" / "ex_cited.png").write_bytes(PNG)
        (ROOT / "video" / "ATTRIBUTION.md").write_text(
            "- **hook_legacy_1.mp4** — Hook Legacy Clip — Public domain (NASA) — JSC — https://images.nasa.gov/details/x1\n"
            "- **late_legacy_1.mp4** — Late Legacy Clip — Public domain (NASA) — JSC — https://images.nasa.gov/details/x2\n"
            "- **late_checked_1.mp4** — Late Checked Clip — Public domain (NASA) — JSC — https://images.nasa.gov/details/x3\n")
        (ROOT / "images" / "ATTRIBUTION.md").write_text(
            "- `ex_cited.png` — page crop, Fixture Report, p. 1 — Fixture Board — "
            "US federal government work, public domain (17 U.S.C. 105) — https://example.gov/r\n")
        DOC.write_text(json.dumps({"id": SLUG, "title": "Fixture", "channel": "blackbox",
            "voice": "d46abd1d-2d02-43e8-819f-51fb652c1c61", "scenes": [
                {"id": "h1", "text": HOOK_WORDS, "video": "hook_unsourced_1.mp4"},
                {"id": "h2", "text": HOOK_WORDS, "video": "hook_legacy_1.mp4"},
                {"id": "b1", "text": WORDS, "video": "late_unsourced_1.mp4"},
                {"id": "b2", "text": WORDS, "video": "late_legacy_1.mp4"},
                {"id": "b3", "text": WORDS, "video": "late_checked_1.mp4"},
                {"id": "b4", "text": WORDS, "img": "ex_page", "exhibit": True},
                {"id": "b5", "text": WORDS + " subscribe next", "img": "ex_cited",
                 "exhibit": True},
            ]}, indent=1))
        # a pre-existing manifest key the provenance pass must not disturb
        MAN.write_text(json.dumps({"durations": {}, "texthash": {"h1": "abc"},
                                   "hf": {"x": {"sha256": "keep"}}}))

        r = run("scripts/provenance_backfill.py", SLUG)
        if "4 legacy-unverified row(s) written" not in r.stdout:
            fails.append(f"backfill: expected 4 rows (3 video + 1 image line), got: {r.stdout.strip()}")
        r = run("scripts/provenance_backfill.py", SLUG, "--verify", "video/late_checked_1.mp4",
                "--note", "fixture: frames eyeballed")
        if r.returncode != 0:
            fails.append(f"--verify failed: {r.stderr.strip()[-300:]}")
        r = run("scripts/build_doc_vo.py", SLUG, "--manifest-only", py=py_with_httpx())
        if r.returncode != 0:
            fails.append(f"build_doc_vo failed: {r.stderr.strip()[-300:]}")
        man = json.loads(MAN.read_text())
        vids = man.get("videos", {})
        if vids.get("hook_legacy_1.mp4", {}).get("verify", {}).get("status") != "legacy-unverified":
            fails.append(f"manifest.videos hook_legacy_1 not legacy-unverified: {vids.get('hook_legacy_1.mp4')}")
        if vids.get("late_checked_1.mp4", {}).get("verify", {}).get("status") != "verified":
            fails.append("manifest.videos late_checked_1 not verified after --verify")
        if "ex_cited.png" not in man.get("assets", {}):
            fails.append("manifest.assets missing ex_cited.png")
        if man.get("hf") != {"x": {"sha256": "keep"}}:
            fails.append(f"manifest.hf disturbed: {man.get('hf')}")

        r = run("scripts/preflight_doc.py", SLUG)
        out = r.stdout
        blocks = [l for l in out.splitlines() if l.startswith("BLOCK")]
        warns = [l for l in out.splitlines() if l.startswith("warn")]
        audit = run("scripts/audit_scene_relevance.py", SLUG)
        ab = [l for l in audit.stdout.splitlines() if l.startswith("BLOCK")]
        aw = [l for l in audit.stdout.splitlines() if l.startswith("warn")]

        def has(lines, *needles):
            return any(all(n in l for n in needles) for l in lines)

        checks = [
            (has(ab, "UNSOURCED", "hook_unsourced_1.mp4"), "audit: unsourced HOOK video must BLOCK"),
            (has(ab, "UNSOURCED", "ex_page.png"), "audit: unsourced EXHIBIT must BLOCK"),
            (has(aw, "UNSOURCED", "late_unsourced_1.mp4") and not has(ab, "late_unsourced_1.mp4"),
             "audit: unsourced body video must WARN, not BLOCK"),
            (audit.returncode == 2, f"audit exit must be 2, got {audit.returncode}"),
            (has(blocks, "hook_unsourced_1.mp4"), "preflight: unsourced hook video must BLOCK"),
            (has(blocks, "hook video 'hook_legacy_1.mp4' is legacy-unverified"),
             "preflight: legacy-unverified HOOK video must BLOCK"),
            (has(warns, "late_legacy_1.mp4 (legacy-unverified"),
             "preflight: legacy-unverified body video must WARN"),
            (not any(("late_legacy_1.mp4" in l or "late_unsourced_1.mp4" in l)
                     and ("UNSOURCED" in l or "unverified" in l) for l in blocks),
             "preflight: nothing after the hook may BLOCK on provenance"),
            (not any("late_checked_1.mp4" in l for l in warns + blocks if "provenance" in l
                     or "legacy" in l), "preflight: --verify row must clear late_checked_1"),
            (not any("ex_cited.png" in l and ("UNSOURCED" in l or "provenance" in l
                     or "stock" in l) for l in ab + blocks), "a cited exhibit must not BLOCK"),
        ]
        # a --verify AFTER the manifest snapshot: live row wins + stale warn
        run("scripts/provenance_backfill.py", SLUG, "--verify", "video/hook_legacy_1.mp4",
            "--note", "fixture: eyeballed after build")
        out2 = run("scripts/preflight_doc.py", SLUG).stdout
        checks += [
            (not any("hook_legacy_1.mp4" in l and "legacy-unverified" in l
                     for l in out2.splitlines()),
             "post-snapshot --verify row must clear the hook BLOCK"),
            ("predate PROVENANCE.jsonl for 1 file(s)" in out2,
             "stale manifest provenance must WARN"),
        ]
        for ok, msg in checks:
            if not ok:
                fails.append(msg)
        if fails:
            print(out)
            print(audit.stdout)
    finally:
        for p in (DOC, MAN):
            p.unlink(missing_ok=True)
        shutil.rmtree(ROOT, ignore_errors=True)
    for f in fails:
        print(f"FAIL  {f}")
    print(f"provenance gates fixture: {'FAIL' if fails else 'PASS'} "
          f"({len(fails)} failure(s))")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
