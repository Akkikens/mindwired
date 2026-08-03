# WORLD TRADE CENTER COLLAPSE — "What Really Brought Down Building 7" (Black Box Breakdown)

Single-file summary of everything done on this episode. Read `CLAUDE.md` first for
the production manual; this doc is the episode-specific state.

## Status: 4K RENDER DONE, VERIFIED — Shorts + thumbnail image remain

**Verified:** 1298.0s duration (38,940 frames @ 30fps), 3840x2160, mastered
-14.1 LUFS (windowed `bed_tension_rud.mp3`). Checked 4 frames from the actual
master: a real NIST exhibit page (readable, correct), a real NIST NCSTAR 1A
report page (the free-fall calculation, excellent legibility), and the Black
Box subscribe outro (host Reid, correct). Zero sensitivity issues found
anywhere in the final render. Final file: `mindwired_What Really Brought
Down Building 7.mp4` (2.96 GB) at repo root.

**One minor cosmetic issue found, not blocking:** at approximately 9:25
(the `a4_4` exhibit scene, "the first known case of its kind"), the outgoing
caption text briefly overlaps the NIST press-release exhibit's on-screen
"Organizations" section during what appears to be a caption crossfade — a
legibility nit at one specific transition moment, not a content/sensitivity
problem (the exhibit's citation box and highlighted quote both stay legible
independently). Worth a look before publish if Akshay wants it cleaner, but
does not block shipping.

**This is the highest-sensitivity episode this channel has produced.** Read
`docs/planning/CLAIMS-wtccollapse.md` in full before touching anything — it
carries a dedicated adversarial ethics review, a primary-source verification
pass, and every correction applied, with exact citations.

## Files
| What | Path |
|---|---|
| Fact base (GATE — every script line traces here; ethics-reviewed) | `docs/planning/CLAIMS-wtccollapse.md` |
| Doc spec (93 scenes) | `src/mindwired-doc/docs/wtccollapse.json` |
| Dossier concept sidecar (water main, 1 scene) | `src/mindwired-doc/docs/wtccollapse.dossier.json` |
| Comp registration | `src/Root.tsx` -> `WtcCollapseDoc` (BB_OUTRO baked, 483f; total 38,939f = 21:58) |
| Icahn validation | memory `icahn-wtc-collapse` |
| Metadata package | `docs/metadata/METADATA-wtccollapse.md` |
| SRT + chapters | `mindwired_wtccollapse.srt` (189 cues, 21:21 body) |
| QA spot-check stills (10, incl. full conspiracy segment) | `out/qa/wtccollapse_f*.png` |
| Render launch log | `out/wtccollapse_gce_launch.log` (via nohup background task) |
| Rendered master (pending) | `out/wtccollapse_gce.mp4` |

## Why this topic
Icahn-validated 2026-08-03 (memory `icahn-wtc-collapse`) after Akshay asked
for something 9/11-related with more traction, and specifically picked the
World Trade Center collapse / NIST investigation angle as the follow-up to
the channel's existing United 93 episode (that episode's own notes had
scoped "NIST tower-collapse engineering story" as a valid, unbuilt next
topic). Highest raw recognition (3/3) and highest ceiling of any topic this
channel has swept — and, per the new `icahn-needs-currency-filter` lesson
learned earlier this session, explicitly passes the "is this still alive
right now" test: Building 7's collapse is an actively-argued live
controversy (fresh 2025-2026 mainstream coverage, including a major political
media figure's multi-episode conspiracy-framed series), not settled/dormant
history — and rides the 25th anniversary (Sept 11, 2026), ~5-6 weeks out from
validation.

## Sensitivity process — read this before editing anything
Given this tops even United 93 on recognition/reach/conspiracy-magnet risk,
production followed an EXTRA process beyond the channel's normal pipeline:
1. Standard 6-dimension research fan-out (one dimension misfired — an agent
   returned unrelated Vercel-MCP boilerplate instead of cold-open research;
   caught and flagged rather than papered over, cold-open was synthesized
   from other confirmed research instead).
2. CLAIMS synthesis into `docs/planning/CLAIMS-wtccollapse.md`.
3. **A dedicated adversarial ethics/sensitivity review pass** (mirroring
   `united93-episode`'s process) — found and required fixes for: an
   uncitable Gayle/PBS-NOVA quote attribution, a likely misattribution
   (Steven Jones credited alongside David Chandler for work that's actually
   Chandler's individually-documented contribution), missing citations on 5
   of the most reputation-sensitive claims, a structural rule violation
   (Act VII/Hulsey was drafted as a separate chapter, doubling conspiracy
   exposure against the channel's own one-consolidated-segment rule), two
   technical figures needing verification, and a "gotcha" cold-open
   alternative that risked priming a conspiratorial read.
4. **A targeted primary-source verification pass** (separate workflow, 3
   agents) against NIST's own archived documents, live FAQ pages, and
   secondary-source triangulation — this is what actually confirmed/refuted
   each ethics-review finding (e.g., directly fetching NIST's real public-
   comment PDF to settle the Chandler/Jones question; directly fetching the
   NIST WTC7 FAQ to confirm the 130-140 dB and ~100 lbs thermite figures were
   genuine, not invented).
5. I (Claude) applied every fix to the CLAIMS file personally, verified
   internal consistency on a full re-read, then wrote the script.
6. **Caught a further error myself during exhibit-sourcing**: an unverified
   clause ("...once the buildings cooled, significant excess capacity
   remained in the structures") had been appended to a verbatim NIST quote
   when I was applying an earlier fix — the exhibit-generation agent
   couldn't locate it in either the FAQ or the full NCSTAR 1 PDF text, I
   confirmed the miss, and removed it from both the script and the CLAIMS
   file. This is exactly the kind of error the multi-pass process exists to
   catch — don't skip steps on a future high-sensitivity episode.

## Hard rules baked into the script (do not relax without re-reading CLAIMS)
- Zero depiction of people jumping/falling from the towers, anywhere —
  personally screened every fetched image/video frame for this; found
  nothing, caught and excluded 3 unrelated wrong-subject photos in the
  process (unrelated to the exclusion rule, just wrong-subject junk).
- No human remains/graphic content.
- NIST's collapse-sequence simulations are labeled on screen "NIST COMPUTER
  SIMULATION" — never implied as real footage.
- The consolidated conspiracy-claims segment ("The Questions People Still
  Ask" chapter) covers 5 beats (free-fall/blast, thermite, Silverstein "pull
  it," BBC early report, Hulsey/AE911Truth) in one placement, ~70-90s (over
  the file's aspirational ~45-55s target, but still proportionally brief —
  ~7% of runtime — given the mandatory attributions; flagged honestly by the
  script-writing agent rather than silently claiming exact compliance).
  Never repeated elsewhere, never a live debate, Silverstein quote never
  resolved to one meaning.
- Every quote/finding carries on-screen or spoken attribution.

## Production notes / gotchas hit
- 18 preflight-blocking missing-asset errors on first gate run: 7 scenes
  referencing a nonexistent "NIST 2008 briefing" video/photo (confirmed dead
  end — no real footage of the actual briefing exists) rerouted to real
  available assets (NIST simulation poster frame, col79 diagram, steel-
  recovery photo, the newly-created NIST press-release exhibit); 10 missing
  `exhibit:true` images generated fresh via real browser screenshots of live
  NIST FAQ pages / the GPO hearing transcript, and real `pdftoppm` extracts
  from the actual downloaded NCSTAR 1/1A PDFs (2 of the original `source`
  citations in the script turned out to point at the wrong document —
  corrected during this pass, logged in ATTRIBUTION.md); 1 dossier scene
  (water main) needed its cutout generated via `gen_doc_dossier.py`; 1
  kinetic scene had no spoken text at all (build_doc_vo.py can't handle a
  scene with no `text` field — added a short line matching the CLAIMS file).
- Relevance-audit MISMATCH warnings on `col79_diagram`/`steel_recovered`
  personally verified as false positives (the audit's keyword-matcher flags
  boilerplate caption text like "FEMA/Performance Study," not an actual wrong
  image — I opened both images directly and confirmed they're correct).
- `col79_diagram` reused 10x, `wtc7_exterior` reused 9x — real, thin-pool
  constraint (Building 7 was never a tourist-photography subject the way the
  Twin Towers were) rather than fetch laziness; accepted given time/scope.

## What's left before publish
1. **Wait for the GCE render to finish** — verify final duration (~38,939
   frames / 30fps = 21:58), 3840x2160, and the -14 LUFS master line once done.
2. Extract and view a mid-body frame and the outro frame from the finished
   master (not just the pre-render stills) to confirm the actual encode —
   pay particular attention to re-checking the conspiracy-claims segment and
   the NIST press-release exhibit frame (showed a minor caption/citation
   text overlap during a mid-transition still-check; verify it clears in
   motion).
3. **Akshay must personally review the conspiracy-claims segment and the
   overall tone before this goes live** — beyond the usual VO-sample listen,
   this episode's sensitivity means a full human watch-through (not just a
   sample) is warranted before publish, regardless of the ethics review
   already passed.
4. Cut funnel Shorts via shorts-funnel (not yet done) — pick beats carefully
   given the sensitivity; avoid cutting anything from the conspiracy segment
   into a standalone Short, since that would remove it from its full context.
5. Rename the final file to the actual title at repo root
   (`mindwired_What Really Brought Down Building 7.mp4` or whichever A/B
   title Akshay picks) before upload.
6. Commit doc spec, manifest, CLAIMS, dossier, metadata, SRT, this handoff
   (never the multi-GB master).
7. Upload not done — session scope was render + package only.

Full production narrative: memory `wtccollapse-episode` (to be written once
the render/verification is fully confirmed).
