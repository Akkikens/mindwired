#!/usr/bin/env python3
"""Generate DossierScene "case file" cutouts for one doc-engine episode.

Reads hand-authored concept strings (one per img-prefix, same discipline as
gen_sansadchalo_sketches.py's CONCEPTS dict) from a small sidecar JSON instead
of a bespoke per-episode .py file:

  src/mindwired-doc/docs/<slug>.dossier.json
    { "<prefix>": "<concept description>", ... }

Usage:
  python3 scripts/gen_doc_dossier.py <slug> [prefix ...]   # subset
  python3 scripts/gen_doc_dossier.py <slug> --all          # every prefix
  python3 scripts/gen_doc_dossier.py <slug> --all --force  # regenerate

After generating, rerun scripts/build_doc_vo.py <slug> --manifest-only to
register the new prefix(es) into <slug>.manifest.json's images map, then
scripts/preflight_doc.py <slug> before the render.

See docs/guides/DOSSIER-SCENES.md for the full recipe and the honesty rule
(DossierScene ALWAYS renders a "RECONSTRUCTION" tag — never use this for a
real person/event that has archival footage/photo coverage).
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts" / "lib"))
from dossier_gen import generate_dossier_image  # noqa: E402

DOCS = ROOT / "src" / "mindwired-doc" / "docs"

# THEMES accents (DocWide.tsx) — keep in sync if a channel/accent is added there.
ACCENTS = {"mindwired": "#4DD8FF", "blackbox": "#FF9500", "dimaagbatti": "#FFC53D"}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    ap.add_argument("prefixes", nargs="*")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--channel", default=None,
                    help="override accent lookup (default: read <slug>.json's channel field)")
    ap.add_argument("--aspect", default="4:5")
    args = ap.parse_args()

    concepts_path = DOCS / f"{args.slug}.dossier.json"
    if not concepts_path.exists():
        sys.exit(f"no {concepts_path.relative_to(ROOT)} — author one first "
                  f"(prefix -> concept string, see docs/guides/DOSSIER-SCENES.md)")
    concepts: dict[str, str] = json.loads(concepts_path.read_text())

    channel = args.channel
    if channel is None:
        doc_path = DOCS / f"{args.slug}.json"
        if doc_path.exists():
            channel = json.loads(doc_path.read_text()).get("channel", "mindwired")
        else:
            channel = "mindwired"
    accent = ACCENTS.get(channel, ACCENTS["mindwired"])

    todo = list(concepts) if (args.all or not args.prefixes) else args.prefixes
    bad = [p for p in todo if p not in concepts]
    if bad:
        sys.exit(f"unknown prefixes (not in {concepts_path.name}): {bad}")

    out_dir = ROOT / "public" / "shorts" / args.slug / "images"
    tmp_dir = ROOT / "out" / "qa" / f"{args.slug}_dossier_raw"

    results = {
        p: generate_dossier_image(p, concepts[p], accent, out_dir, tmp_dir,
                                   force=args.force, aspect=args.aspect)
        for p in todo
    }
    ok = sum(results.values())
    failed = [p for p, v in results.items() if not v]
    print(f"\ndone: {ok}/{len(todo)}")
    if failed:
        print("FAILED:", " ".join(failed))
    print(f"\nnext: python3 scripts/build_doc_vo.py {args.slug} --manifest-only")
    return 0 if not failed else 1


if __name__ == "__main__":
    sys.exit(main())
