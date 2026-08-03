# CHERNOBYL — "The Official Report vs. The Show" (Black Box Breakdown)

Single-file summary of everything done on this episode. Read `CLAUDE.md` first
for the production manual; this doc is the episode-specific state.

## Status: 4K RENDER DONE, VERIFIED — metadata + SRT done — Shorts/thumbnail/commit remain

## Files
| What | Path |
|---|---|
| Fact base (GATE — every script line traces here) | `docs/planning/CLAIMS-chernobyl.md` |
| Doc spec (49 scenes) | `src/mindwired-doc/docs/chernobyl.json` |
| Comp registration | `src/Root.tsx` → `ChernobylDoc` (BB_OUTRO baked, 483f) |
| Metadata / SEO package | `docs/metadata/METADATA-chernobyl.md` |
| Captions | `mindwired_chernobyl.srt` (Whisper, 159 cues) |
| Rendered master | `out/chernobyl_gce.mp4` (1.22 GB) |
| Icahn validation | memory `icahn-chernobyl` |
| QA frames | `out/qa/chernobyl_exhibit.jpg`, `out/qa/chernobyl_outro_check.jpg` |
| Real INSAG-7 PDF (source, not committed) | `/tmp/insag7.pdf` — re-download from
  `https://www-pub.iaea.org/MTCD/Publications/PDF/Pub913e_web.pdf` if needed |

## 1. Icahn validation — PASS, 3/3 recognition, best of 8 swept topics
Validated via a parallel 8-topic yt-dlp sweep run through the new
`icahn-validate` skill: Chernobyl beat Titanic, Amelia Earhart, Bermuda
Triangle, Dyatlov Pass (all also PASS, queued as follow-ups) and D.B. Cooper,
Hindenburg, MH17 (all FAILED — stale evidence + broken copycat waves).

- Headline: Where on Earth — 1,155,856 v / 47,400 subs = **24.4:1** (fresh, Feb 2026)
- Corroboration: NightSchool — 72,568 v / 4,020 subs = 18.1:1 (fresh, Oct 2025)
- Ceiling: Dhruv Rathee 17,936,143 views; Kurzgesagt 10,817,919 views

## 2. The differentiation angle (why this episode exists at all)
Not another Chernobyl retelling — HBO already made the definitive dramatized
version. The hook, borrowed from the exact pattern that made MH370 and 21
Astronauts work on this channel (a blunt stat + an explicit "not the
speculation, the real record" positioning): **the Soviet/IAEA's own official
position on who was to blame changed** — INSAG-1 (1986) blamed operators;
INSAG-7 (1992) reversed this to blame the reactor's design. The episode shows
the real report and fairly, specifically compares it to what HBO's series
dramatized.

## 3. Research — 5-agent fan-out, synthesized into CLAIMS-chernobyl.md
Dimensions: plant/RBMK design history · INSAG-7 report deep-dive · HBO-vs-reality
fact-check · aftermath/liquidators/legacy · real-footage/PD scout. Two agents
failed mid-run (API errors) and were successfully relaunched.

**Hard corrections baked into the script** (do not revert if editing):
1. The void coefficient and control-rod "tip effect" — precise mechanism, not
   pop-science shorthand (see script scenes a3-a5 for the correct phrasing).
2. **INSAG-1 (1986) vs INSAG-7 (1992) — the official story changed** — this IS
   the hook, never flatten it.
3. Dyatlov's culpability is genuinely disputed — present both sides.
4. All named plant personnel (Akimov, Toptunov, Dyatlov) are deceased — no
   AI171-tier sensitivity.
5. Legasov died **27 April 1988** — "two years and one day" after the
   disaster, not "exactly two years to the day."
6. **Death toll is a disputed range, never one number** — 31 official acute
   deaths; long-term estimates 4,000 (WHO) to 90,000+ (Greenpeace), depending
   on methodology.
7. **🧍 The "Bridge of Death" is an UNVERIFIED URBAN LEGEND** — not in the
   final script at all after this flag, by design.
8. **🧍 Craig Mazin (HBO showrunner) is alive** — any creative-choice claim
   attributed to his own statements, never asserted as narrator fact.
9. Ulana Khomyuk's fictional-composite status is openly acknowledged by the
   show itself — safe to state as fact.
10. **🧍 The three divers (Ananenko, Bespalov, Baranov) all survived their
    mission** — HBO's fatalistic framing is dramatized; Ananenko (living, as
    of 2024) has personally disputed the "heroes' welcome" portrayal.

## 4. Script — src/mindwired-doc/docs/chernobyl.json
49 scenes, 7.8 min narration (~9:07 final runtime with BB outro, confirmed by
render). Structure: cold open (the show-vs-report hook stated immediately) →
sting → title → 5 chapters (the flaw nobody was told about → the night → the
story that changed [INSAG-1→INSAG-7, the cover-up, Legasov] → the show versus
the report → what it actually cost) → coda → verbal bridge to the 737 MAX
episode → subscribe. Channel: `blackbox` (Black Box Breakdown, BB_OUTRO 483f).

## 5. Footage — real Commons/INSAG-7 exhibit, unlike AI171's drought
**Real exhibit:** downloaded the actual INSAG-7 PDF (confirmed live at
`www-pub.iaea.org/MTCD/Publications/PDF/Pub913e_web.pdf`, 55pp), used
`pdftotext | grep` to find the causal-reversal language, then had to correct
for a **~10-page offset** between the text-extraction page count and the
physical PDF page (the first render attempt grabbed the wrong page) — the
correct exhibit is **printed page 38** (`ex_insag7_1.png`), containing the
Commission's real finding that the RBMK-1000's core design violated safety
requirements.

**Real photo/video coverage confirmed strong:** Wikimedia Commons
`Category:Chernobyl disaster` (135 files), `Category:Chernobyl Nuclear Power
Plant` (139 files), `Category:Pripyat` (104 files) — control room, reactor
exterior, sarcophagus/NSC, ghost-town imagery all well covered under CC
BY-SA/GFDL. Pixabay/Pexels have 100+ Exclusion Zone drone clips. Fixed several
scene mismatches during preflight (wrong-location stock photos — Nigeria,
Tbilisi, Indonesia swapped for real Commons Pripyat/Chernobyl imagery; one
cross-video-reuse flag against a Space Shuttle episode image fixed with a
fresh fetch).

**Two honest gaps, planned around rather than faked:** no free 1986-era motion
footage (the famous Shevchenko cameraman footage is not PD); no free original
Legasov audio (only translated transcripts are published — narrated via TTS
with on-screen sourcing, never claimed as "the real tapes").

## 6. Render — GCE 4K, VERIFIED (one transient retry)
```
scripts/render_gce.sh ChernobylDoc chernobyl --music public/beds/doc_tension.mp3 \
  --windows chernobyl --music-gain-db -20
```
- **First attempt failed on a transient SCP connection reset** during file
  sync (not auth this time) — VM auto-deleted cleanly, relaunched successfully.
- Duration: **547.1s = 9:07**
- Resolution: **3840×2160 @ 30fps** (true 4K, `--scale 2`)
- Loudness: **-14.1 LUFS** (target hit; input was -23.0 LUFS)
- Windowed music: 7 windows via `doctiming.py`, bed `doc_tension.mp3` at -20dB
- Subscribe outro: confirmed baked in via tail-frame QA (Black Box branding, correct)

## 7. Packaging — done
- `docs/metadata/METADATA-chernobyl.md` — full-SEO package, fairness rules
  enforced (Dyatlov's disputed culpability, disputed death toll, no
  "gotcha"-framing against HBO).
- `mindwired_chernobyl.srt` — generated via the new `scripts/whisper_srt.py`
  (word-accurate, transcribed from the actual final render), 159 cues.
  **Gotcha hit during this step:** `gen_doc_srt.py` (run for the CHAPTERS
  block) writes to the same default filename and silently overwrote the
  Whisper SRT — had to regenerate Whisper's version afterward. Going forward,
  always run `gen_doc_srt.py` FIRST (chapters only) then `whisper_srt.py`
  LAST, or use distinct `--out` paths for each.

## 8. Known gaps / not done yet
- **No Shorts cut yet** — 4 angles planned in the metadata doc, carrying the
  "real report, fair to the show" framing into each.
- **No thumbnail yet** — 3 concepts drafted in metadata, explicit
  "do not use HBO show stills/footage" constraint noted.
- **AI171's MORE FROM URL is still a placeholder** in this doc's description
  (AI171 was uploaded but its real URL wasn't logged back into this file yet)
  — fill in once confirmed.
- Nothing from this episode is committed to git yet.

## Next steps (in order)
1. Build the 4 Shorts (`src/viral/plans/chernobyl-short1..4.json` + register
   in Root.tsx), carrying the fairness framing through.
2. Build thumbnail (Workflow B, per THUMBNAILS.md) — no HBO show imagery.
3. Fill in the real AI171 URL in this doc's MORE FROM block once confirmed.
4. Akshay reviews the master.
5. Commit everything to git.
