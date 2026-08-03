# TITANIC — "The Verdict Two Governments Couldn't Agree On" (Black Box Breakdown)

Single-file summary of everything done on this episode. Read `CLAUDE.md` first
for the production manual; this doc is the episode-specific state.

## Status: 4K RENDER DONE, VERIFIED — SRT+chapters done — thumbnail/Shorts/commit remain

## Files
| What | Path |
|---|---|
| Fact base (GATE — every script line traces here) | `docs/planning/CLAIMS-titanic.md` |
| Doc spec (59 scenes) | `src/mindwired-doc/docs/titanic.json` |
| Dossier concepts sidecar | `src/mindwired-doc/docs/titanic.dossier.json` |
| Comp registration | `src/Root.tsx` → `TitanicDoc` (BB_OUTRO baked, 483f) |
| Metadata / SEO package | `docs/metadata/METADATA-titanic.md` (chapters + thumbnail still TODO) |
| Icahn validation | memory `icahn-titanic` (live re-check 2026-07-28, GO) |
| QA stills | `out/qa/titanic_stills/` (all 59 scenes) + `out/qa/titanic_stills_sheet_{1-6}.jpg` |
| Rendered master | TODO — `out/titanic_gce.mp4` once GCE finishes |
| Render launch log | `out/titanic_gce_launch.log` |

## 1. Icahn validation — PASS, live recheck 2026-07-28
Originally flagged as topic #2 in the `icahn-chernobyl` 8-topic sweep (stale,
months old). Re-validated live before committing to production:
- Fresh outliers up to **50.9:1** (If You Wonder, 1.96M views/38.6K subs, May
  2025), corroborated by Top History (36.1:1, Dec 2025) and others.
- Incumbent check: Oceanliner Designs (955K subs) still dominates wreck-
  forensics, but their own TWO inquiry-focused videos underperformed their own
  average by 10-20x (0.2-0.4:1 vs their usual 3.9:1) — confirming wreck-
  forensics is owned, but "the official inquiry as evidence" is a genuinely
  open lane, not a proven-dead one.
- Recognition 3/3, sensitivity gate LOW (no living survivors — last survivor
  Millvina Dean died 2009; all named principals deceased).

## 2. The differentiation angle
NOT another shipwreck-breakup-forensics video (that's Oceanliner Designs'
territory and already saturated). This episode uses the two REAL 1912
government inquiries (British Wreck Commissioner's Inquiry + US Senate
Inquiry) as the evidence spine — real report pages shown on screen via
`ExhibitScene`, exactly like this channel's aviation episodes use NTSB/BEA
reports. The hook: the two governments read the same testimony and reached
different verdicts, and on the Californian question, still don't agree today.

## 3. Research — 5-agent fan-out, synthesized into CLAIMS-titanic.md
Dimensions: origins/regulatory flaw · disaster+official inquiries · aftermath/
legacy/living-persons · archival-footage scout · human-thread cold-open.

**Hard corrections baked into the script** (do not revert if editing — see
CLAIMS-titanic.md's full "DATA CORRECTIONS" block for all 13):
1. "Practically unsinkable" was qualified trade-press language, not a public ad
   slogan — never say "advertised as unsinkable."
2. Titanic legally EXCEEDED the lifeboat minimum (20 boats vs 16 required,
   1,178 capacity vs ~2,224 aboard) — the failure is regulatory (outdated
   tonnage-based law), not corner-cutting.
3. Casualty toll is a disputed range (1,490-1,517), never a single hard number.
4. Frederick Fleet's exact testified words: "Iceberg, right ahead" — no
   embellishment.
5. The Mesaba ice warning was left on the wireless-room table, never relayed
   to the bridge — separate from Phillips cutting off the Californian's Evans
   ("Shut up... I am busy"), which IS on the record. The "paperweight" story is
   UNVERIFIED legend — excluded.
6. **The Californian dispute stays attributed-never-asserted** — the British
   inquiry's finding and the US Senate's harsher recommendation are both
   presented as "the inquiry found," never flat fact. 🧍 Living researchers
   (Dr. Paul Lee, Senan Moloney) actively argue a "mystery ship" theory —
   attributed by name, never asserted as settled.
7. The "women/children first" class-survival gap (97% vs ~25%) is CONFIRMED as
   an outcome; the CAUSE was never formally investigated by either inquiry —
   the "gates were locked" narrative is not asserted.
8. Captain Smith: British verdict (not negligent, but the practice condemned)
   vs. US Senate verdict ("indifference to danger") — both presented, both
   attributed to their own inquiry, never picked as "the truth."
9. Bruce Ismay: never called "a coward" as narrator fact — attributed to
   contemporary press (Hearst), not settled history.
10. Southampton "departure day" footage commonly circulated online is
    misattributed Olympic film — not used. All Ballard/WHOI/RMS Titanic Inc.
    wreck imagery since 1987 is NOT public domain — not used.

## 4. Script — src/mindwired-doc/docs/titanic.json
59 scenes, ~9.0 min narration (~10.3min final runtime with BB outro). Structure:
cold open (Ismay pocketing the Baltic ice warning — `dossier` reconstruction,
zero real photo of this moment exists) → sting → title → 5 chapters (the ship
with more lifeboats than the law required → seven warnings, one never reached
the bridge → 11:40pm, the night the ship had left itself no margin → two
governments, two verdicts → what changed because of this ship) → coda →
verbal bridge to the Chernobyl episode → subscribe. Channel: `blackbox`
(BB_OUTRO 483f).

Two `dossier: true` scenes (the new hand-cut "case file" engine, shipped this
session — see `docs/guides/DOSSIER-SCENES.md`): the cold open and the collision
moment, both permanently tagged RECONSTRUCTION, both genuinely zero-coverage
beats (nobody photographed either).

## 5. Footage — real Commons/Pathé/LoC photos + real 1912 newsreel video
- **Real exhibit:** downloaded the actual British Wreck Commissioner's Inquiry
  PDF (archive.org `losssteamshipti00titgoog`), OCR-searched it for the exact
  quoted findings, then calibrated the physical PDF page (offset = printed
  page + 2 for this scan) by rendering and visually confirming before
  extracting: **p.41** (Smith verdict + the "Iceberg, right ahead" account)
  and **p.60** (the Californian finding). Both used as real `exhibit` pages
  with hand-calibrated highlight boxes.
- **US Senate Report No. 806 could not be downloaded** — the archive.org item
  requires authorization; an open alternate (`titanicdisaster00commgoog`, the
  hearings transcript compilation) was confirmed downloadable, but an OCR
  search did not turn up the exact "indifference to danger"/"drastic action"
  phrasing my research cited (real per secondary/Wikipedia sourcing, just not
  personally page-verified today) — so those two scenes render as regular
  photo beats over real Senate-hearing photography, NOT as unverified exhibit
  pages. Upgrade path noted in CLAIMS-titanic.md if a future session locates
  the actual short-form report.
- **Real video, not just stills:** found and used the exact real 1912
  newsreel ("Titanic Disaster - Genuine Footage (1911-1912).webm", British
  Pathé, PD) — trimmed 4 distinct, individually verified-real segments (dry-
  dock bow shots ×2, the real Carpathia rescue footage, the real Mackay-
  Bennett recovery-ship footage) rather than using the reel's own misattributed
  Olympic segments.
- **Manual Commons pulls** for `senate_hearing` and `lord_californian` (auto-
  fetch returned 0 results) via the direct Commons API technique — all
  verified PD/no-restriction before download.
- One relevance-audit catch: the Carpathia footage was first assigned to a
  scene about the night BEFORE the collision (a real temporal mismatch, not a
  false positive) — fixed by adding a new scene about the actual rescue
  instead of forcing the wrong footage onto the wrong beat.

## 6. Bugs found and fixed during production (don't reintroduce)
- **`ExhibitScene` source-citation/caption text overlap**: a long `source`
  string had no `maxWidth`, and `cap` sat almost the same vertical position —
  long citations + long captions collided illegibly. Fixed in `DocWide.tsx`:
  `source` now wraps within `maxWidth: 960`, and `cap` moves to a completely
  different vertical band (`bottom: s.source ? 210 : 104`) whenever `source` is
  present, so they can never occupy the same row regardless of text length.
  **This fixes every future episode using ExhibitScene, not just this one.**
- **4 scenes (casualty-toll beat + all 3 closing reflections) had no `img`**,
  silently falling back to `IllusScene`'s flat-black default — exactly the
  "bare black-screen-and-text" anti-pattern CLAUDE.md bans. Caught only by
  rendering every scene as a still and looking (per Akshay's explicit request
  to review all stills before rendering) — a spot-check of 3-4 stills would
  likely have missed this. Fixed by giving each a real photo from the existing
  pool.

## 7. VO — done
`build_doc_vo.py --speed 0.96`, all 59 clips synthesized clean (no empty-clip
Cartesia bug). Ear-check sample sent to Akshay (`out/qa/titanic_vo_sample.mp3`).
One hook-checklist fix: the cold-open scene was tightened from 39 to 28 words
to clear the "first scene over 30 words" warning.

## 8. Gates — 0 blocking
`preflight_doc.py titanic` → 0 blocking, 9 warnings (all individually reviewed:
real Titanic-era photos the relevance-audit heuristic just didn't keyword-
match, or reasonable pool-reuse trade-offs given the finite real archive).

## 9. Stills — all 59 scenes reviewed by Akshay before render
Per explicit request, rendered and reviewed a still for every single scene
(not just the usual 3-4 spot-check) before committing to the render — this is
what caught both bugs in section 6. Approved 2026-07-28.

## 10. Render — DONE, VERIFIED
```
scripts/render_gce.sh TitanicDoc titanic
```
No `--music` flag (the `public/beds/doc_*.mp3` set stays banned).
- Duration: **633.0s** (expected 632.9s = 616.8s body + 483f/30fps outro — exact match)
- Resolution: **3840×2160** (true 4K)
- Loudness: **−14.1 LUFS** (target hit; input was −23.3 LUFS)
- Mid-frame + outro splice both visually verified (`out/qa/titanic_mid.jpg`,
  `out/qa/titanic_outro.jpg`) — BB subscribe outro (host Reid) confirmed present
  and correctly branded.
- Master: `out/titanic_gce.mp4` (1.43 GB). Final upload-ready copy at repo root:
  `mindwired_Titanic - The Verdict Two Governments Couldn't Agree On.mp4`.

## 11. SRT + chapters — DONE
`.venv-lipsync/bin/python scripts/gen_doc_srt.py titanic` → `mindwired_titanic.srt`
(117 cues). **Gotcha hit:** the raw CHAPTERS output had the title card (00:51)
and Chapter 1's heading (00:55) only 4s apart — would make YouTube reject the
ENTIRE chapters list (every entry needs ≥10s separation). Merged into one line
in `METADATA-titanic.md`; every other timestamp is gen_doc_srt.py's exact,
unmodified output. Final runtime per the tool: **10:08**.

## Next steps (in order)
1. Build thumbnail (Workflow B or ctr-engine) — no 1997-film imagery, follow
   THUMBNAILS.md house style.
2. Cut 4 funnel Shorts (shorts-funnel skill) — strong candidates: the Ismay
   cold open, the Californian "might have saved... all" verdict, the
   Fleet/collision beat, the lifeboat-regulation irony.
3. Commit everything (doc spec, dossier sidecar, manifest, CLAIMS, metadata,
   handoff, SRT — never the multi-GB master) — only once Akshay asks for it.
4. Write the episode memory (structure, honesty rules, gotchas hit, link to
   `icahn-titanic`) once the above is done.
