# AIR INDIA 171 — "The Question Nobody Can Answer Yet" (Black Box Breakdown)

Single-file summary of everything done on this episode. Read `CLAUDE.md` first for
the production manual; this doc is the episode-specific state.

## Status: 4K RENDER DONE — packaging not yet started — Akshay should watch before publishing

## Files
| What | Path |
|---|---|
| Fact base (GATE — every script line traces here) | `docs/planning/CLAIMS-ai171.md` |
| Doc spec (52 scenes) | `src/mindwired-doc/docs/ai171.json` |
| Comp registration | `src/Root.tsx` → `Ai171Doc` (BB_OUTRO baked, 483f) |
| Rendered master | `out/ai171_gce.mp4` (1.03 GB) |
| Icahn validation | memory `icahn-ai171` |
| Episode memory (full detail) | memory `ai171-episode` |
| QA frames | `out/qa/ai171_exhibit.jpg`, `out/qa/ai171_outro_check.jpg` |
| Real AAIB report PDF (source) | `/tmp/aaib_vtanb.pdf` (not committed — re-download if needed, see below) |

## ⚠️ WHY THIS EPISODE IS DIFFERENT — READ BEFORE TOUCHING ANYTHING

This is a **real disaster ~13 months old**, not a decades-settled historical
story like Concorde/Shuttle/Mars One. Two things make it categorically more
sensitive:

1. **The investigation is still open.** India's AAIB has published only a
   preliminary report (12 July 2025); the **final report — the one that assigns
   an actual cause — is not due until October 2026**. Nobody outside the
   investigation knows the real answer yet.
2. **The central causal question is disputed by real, living, grieving people.**
   Why the fuel-control switches moved from RUN to CUTOFF seconds after liftoff
   is contested: some reporting reads the cockpit voice recorder exchange as
   consistent with deliberate pilot action; the Federation of Indian Pilots
   argues an electrical fault could have caused it as a symptom, not a cause.
   **Captain Sabharwal's own 91-year-old father** has publicly disputed the
   pilot-blame reading and taken it to India's Supreme Court. **Two pilot
   unions** (ICPA, ALPA-India) have called the "pilot suicide" narrative
   "reckless and unfounded" and said the crew "deserve respect, not unfounded
   character judgement."

**The script (`ai171.json`) presents both readings with equal weight and states
plainly, in the cold open and the coda, that this is unresolved.** Do not edit
any scene to lean toward one reading without re-checking `CLAUDE.md`'s honesty
rules and `CLAIMS-ai171.md`'s correction #7/#8 first.

## 1. Icahn validation — PASS
- Aviation Files — 232,828 v / 9,540 subs = **24.4:1**
- CockpitConfession — 42,493 v / 4,470 subs = 9.5:1
- Inside Aviation — 40,801 v / 4,750 subs = 8.6:1
- Wyngx — 2.28M v / 363K subs = 6.3:1
- Captain Steeeve — 6.79M v / 1.12M subs = 6.1:1
- Ceiling: Dhruv Rathee 22.7M views, Flying Beast 3.75M, NDTV 2.99M.

## 2. Research — 4-agent fan-out, synthesized into CLAIMS-ai171.md
Dimensions: flight/aircraft/survivor context · AAIB official findings vs.
speculation · aftermath/legal/systemic · real-video/CCTV footage scout.

**Hard corrections baked into the script** (do not revert if editing):
1. **Death toll = 260 total** (230 pax + 12 crew aboard, 241/242 aboard died +
   19 on the ground). Not the day-one 241 figure.
2. **NOT "India's deadliest air disaster ever."** That's the 1996 Charkhi Dadri
   collision (~350 dead). AI171 is **Air India's own deadliest crash** and
   India's **second**-deadliest overall, the worst in ~30 years.
3. First fatal hull-loss of a Boeing 787 since 2011 — safe, well-sourced claim.
4. Engines are GE GEnx-1B70, not Rolls-Royce Trent.
5. **Only a PRELIMINARY report exists** — by design, facts-only, no assigned
   cause. Final report not due until **October 2026**.
6. The CVR exchange as AAIB actually published it does **not** name which pilot
   said which line — any specific attribution in secondary reporting is
   unofficial.
7. **Why the switches moved is unresolved — present both readings, neither as
   fact:** pilot-action reading (some press) vs. electrical-fault-symptom
   reading (Federation of Indian Pilots). Neither is an AAIB conclusion.
8. **🧍 Highest sensitivity: Captain Sabharwal's father** (91, living) disputes
   the pilot-blame reading, in the Supreme Court. **🧍 ICPA and ALPA-India**
   (pilot unions) call "pilot suicide" framing "reckless and unfounded."
9. A 2018 FAA bulletin flagged some 787 fuel-switch locking issues (advisory,
   not mandatory); Air India never inspected under it; FAA/Boeing later called
   the switch design itself safe. Don't claim a "known faulty design caused
   this crash."
10. **🧍 Sole survivor Vishwash Kumar Ramesh** (British, seat 11A, living) — use
    ONLY his own published quotes (BBC/CBS). No invented interior monologue.
11. **Litigation: ONE confirmed suit** — Delaware Superior Court, 16 Sept 2025,
    4 passenger families vs. Boeing + Honeywell. Not a broad class action.
12. **No fleet-wide 787 grounding occurred anywhere.** DGCA ordered
    airline-specific inspections on Air India's fleet only; later cleared the
    fuel-switch design (Feb 2026) rather than mandating a fix.

## 3. Script — src/mindwired-doc/docs/ai171.json
52 scenes, ~7.7 min narration (~9:06 final runtime with BB outro, confirmed by
render). Structure: cold open (the flight, the crash, the unanswered question
stated up front — the hook is deliberately "we won't tell you who's to blame")
→ brand sting → title → 6 chapters (the flight → thirty-two seconds/the crash
mechanics → seat 11A/the survivor → the report/what's confirmed → the
question/both readings presented evenly → the aftermath) → coda (explicitly:
"this is unfinished") → bridge to the 737 MAX episode → subscribe. Narrator:
cloned Cartesia voice `00d3c951-...` @ 0.96 speed. Channel: `blackbox`
(Black Box Breakdown, host Reid, BB_OUTRO 483f).

## 4. Footage — the hardest part of this episode
**No free footage of the actual crash exists.** Confirmed by research: the
viral CCTV clip is AP/Reuters-distributed and explicitly kept OFF Wikimedia
Commons by its own editors (file page warns "do not copy to Commons" — India's
copyright law doesn't share the US's narrow view of CCTV authorship); the
bystander phone video is a private citizen's copyrighted recording licensed to
news outlets under news-reporting terms.

**Solved legitimately:** downloaded the real **AAIB Preliminary Report PDF**
(15 pages, `aaib.gov.in`) and used `pdftotext | grep` to find the exact page
containing the fuel-cutoff finding — **page 14**, which also happens to contain
the AAIB's own officially-published CCTV screenshot (Figure 15, RAT
deployment). Rendered via `pdftoppm`, used as the `ex_aaib` exhibit scene's
image. This shows the real crash-moment visual through the government's own
published report, not raw copyrighted footage — same technique as the
BEA/CAIB exhibits in Concorde/Shuttle, just needed the right page found first.

**Also confirmed important general finding:** Indian government works are
**NOT** automatically public domain like US federal works (60-year Government
Copyright by default) — only content explicitly tagged **GODL-India**
(Government Open Data License) is genuinely free-use. Keep this in mind for
any future India-based episode.

Real generic Boeing 787 b-roll (Pexels: ANA/Turkish/Vietnam Airlines 787s) used
throughout for aircraft-type shots. 3 cross-video-reuse flags fixed with fresh
fetches (`boarding_fresh`, `union_fresh`, `seat_fresh`) — never reuse another
episode's exact file.

## 5. Render — GCE 4K, single pass, VERIFIED
```
scripts/render_gce.sh Ai171Doc ai171 --music public/beds/doc_tension.mp3 \
  --windows ai171 --music-gain-db -20
```
- Duration: **546s = 9:06**
- Resolution: **3840×2160 @ 30fps** (true 4K, `--scale 2`)
- Loudness: **-14.1 LUFS** (target hit; input was -23.3 LUFS)
- Windowed music: 8 windows via `doctiming.py`, bed `doc_tension.mp3` at -20dB
- Subscribe outro: confirmed baked in via tail-frame QA (`out/qa/ai171_outro_check.jpg`)
  — Black Box branding, host Reid, correct
- **First attempt failed on a `gcloud` auth expiry** (not a content issue) —
  re-ran successfully after `gcloud auth login`.

## 6. Known gaps / not done yet
- **No metadata package yet** (no `docs/metadata/METADATA-ai171.md`). When
  written, it needs the same fairness/attribution care as the script itself —
  title/thumbnail must not imply a settled cause or pilot blame either.
- **No SRT captions yet** (`scripts/gen_doc_srt.py ai171`).
- **No Shorts cut yet.** Given the sensitivity here, think carefully about
  which beats make good short-form hooks — the "both readings, unresolved"
  framing should carry through to Shorts too, not get flattened into
  clickbait "pilot did it?" framing in the process of cutting.
- **No thumbnail yet.**
- **Akshay has not watched the master yet** — given the subject matter
  (a real, recent tragedy with living affected people), a personal review pass
  before anything goes further (metadata, Shorts, upload) is strongly
  recommended, more so than on the historical episodes.
- Nothing from this episode is committed to git yet.

## Next steps (in order)
1. **Akshay watches `out/ai171_gce.mp4` first**, given the sensitivity.
2. Generate SRT captions.
3. Write `docs/metadata/METADATA-ai171.md` — full-SEO package, but title/
   thumbnail must stay fairness-first (no "pilot suicide" implication, no
   "solved" framing — the honest hook is "here's what's confirmed and what
   genuinely isn't yet").
4. Build 4 Shorts, carrying the same unresolved-cause honesty through.
5. Build thumbnail (Workflow B, per THUMBNAILS.md) — same fairness constraint.
6. Commit everything to git.
7. **Flag for a future follow-up**: when AAIB's final report lands (~Oct 2026),
   this story gets an actual ending — worth a follow-up video then.
