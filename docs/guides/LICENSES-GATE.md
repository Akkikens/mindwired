# License gate

BLACKBOX-2027-REVAMP §3.2, Phase 2 #3. Code: `scripts/lib/licenses.py`, called by
`scripts/preflight_doc.py` (the `LICENSE GATE` block) and `scripts/publish_kit.py`.
Fixture: `python3 scripts/test_license_gate.py`.

## What it reads

For every file the render shows (DocWide's router order and per-prefix rotation;
`hf_` scenes are skipped), in this order:

1. the file's `PROVENANCE.jsonl` row (`license`, then `lic_key`)
2. `video/ATTRIBUTION.md` or `images/ATTRIBUTION.md`, whichever matches the file's
   media type, then the other one, then the root `ATTRIBUTION.md`
3. `<slug>.dossier.json` (prefixes made by `dossier_gen.py` count as `generated`)

Files are matched by exact name, then by the same stem (a `.jpg` logged and a `.png`
on disk), then by a backticked glob (`` `a1film_*.mp4` ``). Groups like
`x_1/2/3.jpg` and `` `x_1.mp4` through `x_6.mp4` `` are expanded. If an entry has no
license of its own, it takes one from "same source/license as …", then from its
section heading and prose. Section prose that only talks about a license
("non-commercial, so it cannot appear") can't make a file BLOCK. A later note about a
file that gives no license doesn't override the real line above it.

## Classes and rules

| class | rule |
|---|---|
| `news-broadcast` (CNN/BBC/Reuters/AP/Getty… with no free licence) | **BLOCK** anywhere |
| `non-commercial` (BY-NC, BY-ND, NC-SA) | **BLOCK** anywhere |
| `crown-copyright` (TSB, AAIB, Malaysian MOT… with no OGL) | **BLOCK** as an `exhibit`/`dossier` page; WARN as b-roll |
| `unknown` (no entry, or the license text isn't recognised) | WARN; **BLOCK** in the first 25 s |
| `cc-by`, `cc-by-sa`, `ogl` | WARN if the line names no author; publish_kit **FAILs** unless every author appears in the METADATA credits block |
| `pd-usgov`, `pd`, `cc0`, `stock-free`, `generated` | pass |

`stock-free` (Pexels/Pixabay/Unsplash) still gets the existing exhibit-provenance
BLOCK in preflight (stock under a cited `source`).

**Credits block.** A credits block is any METADATA line that mentions "credit" and is a
heading, written in ALL CAPS, or ends in `:` (for example `FOOTAGE AND IMAGE CREDITS`
or `## Credits / attribution`). The block runs to the next heading or the `MORE FROM`
line. The full author name counts as credited. So does a name that contains every word
of the author's core name: "Kentaro Iemoto from Tokyo, Japan" is credited by "Kentaro
Iemoto".

**Fixing a hit.** Fix the source, not the gate. Write the real license and author into
ATTRIBUTION.md or the PROVENANCE row, swap the file for a PD or CC asset, or record the
issuing body's written terms. Crown Copyright documents need those terms before they
can be shown as an exhibit.

## Calibration (2026-10-24, before the BLOCKs went live)

`python3 scripts/lib/licenses.py [slug…] [-v]` runs over every doc that has a manifest
(88). It includes media that has been archived off disk.

Files on screen, by class: pd-usgov 1245 · pd 458 · cc0 63 · cc-by 356 · cc-by-sa 462 ·
ogl 0 · stock-free 958 · generated 104 · crown-copyright 1 · non-commercial 4 ·
news-broadcast 0 · unknown 203.

The run gave 18 BLOCKs and 0 false BLOCKs. Every BLOCK was checked by hand against
the episode's attribution files, and each one is a real gap:
- **marsone**: 4 exhibit pages from the MIT Mars One assessment, which the section
  header logs as CC BY-NC-ND.
- **mh370netflix**: the `annex13cover_1.png` exhibit is under Malaysian Crown
  Copyright, used twice.
- **mh370 / mh370theories**: the hook clips (`b777night`, `cockpitnight`,
  `earthnight`) come from `gen_mh370_broll.py`, are not on disk, and have no
  attribution.
- **colgan3407**: the `ntsb_anim.mp4` hook clip has no attribution.
- **sketchdemo, ww2epic-en**: these demos have no ATTRIBUTION.md at all.

On the 81 METADATA files that have a doc, the publish_kit CC check finds 54 episodes
with a missing credit. Most of them have no credits block at all. 27 pass, including
swissair111.
