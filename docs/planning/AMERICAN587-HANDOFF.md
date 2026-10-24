# American Airlines 587 (Belle Harbor, Nov 12, 2001) — episode handoff (Black Box Breakdown)

**STATUS (2026-10-24): PACKAGED, RENDER PENDING.** Comp `American587Doc` is
registered in Root.tsx (BB_OUTRO baked), preflight was 0 blocking at commit 33051fd,
and the publish package (METADATA, 3 built thumbnails, Shorts schedule, this file) is
done. Not done yet: the ONE 4K render + master, the real SRT, the funnel Shorts
renders. **Decide on the `aamp_booklet` license before the render** (see below).
Target publish: **Sat Nov 7, 2026, 10:00 IST**, or the alternative of **Thu Nov 12**,
the 25th anniversary.

Icahn PASS-WITH-CONDITIONS (memory `icahn-american587`): headline 276.5:1, a fresh
Jan-2026 outlier at 14:1 / 1.3M views, ceiling 3.5M. Recognition 2/3, so every piece
of packaging leads with 9/11 / New York and never with the flight number. Chosen
as the **proof episode for the Black Box 2027 pipeline**
(docs/planning/BLACKBOX-2027-REVAMP.md §6).

## Files

| What | Where |
|---|---|
| Doc spec (133 scenes, ~26.6 min body) | `src/mindwired-doc/docs/american587.json` |
| Manifest | `src/mindwired-doc/docs/american587.manifest.json` |
| Fact base (31 data corrections, ANCHORS, SENSITIVITY block, LOCKED PACKAGE) | `docs/planning/CLAIMS-american587.md` |
| Comp | `American587Doc` in `src/Root.tsx` (BB_OUTRO baked) |
| Assets + licenses | `public/shorts/american587/{images,video}/ATTRIBUTION.md` + `public/shorts/american587/PROVENANCE.jsonl` |
| HyperFrames data scenes (7) | `hyperframes/data/american587/*.json` → `public/shorts/american587/video/hf_*.mp4` |
| Metadata (title/alts/description/chapters/credits/tags/pinned/Studio/sensitivity) | `docs/metadata/METADATA-american587.md` |
| Thumbnails (built) | `assets/thumbs/american587_A/B/C.png` via `scripts/gen_american587_thumb.py` |
| Funnel Shorts (planned, not rendered) | `docs/publishing/SHORTS-SCHEDULE-american587.md` (comps `American587Short1-4`, not yet registered) |
| Pre-render SRT estimate (not for upload) | `out/qa/american587_estimate.srt` |
| Final render (pending) | `New York Thought It Was 9-11 Again. It Wasn't.mp4` + `.srt` at repo root |

## Pipeline firsts (2027 revamp proof)

1. **HyperFrames data scenes in a doc-engine episode.** 7 `hf` scenes (title plate,
   route map, flight timeline, pedal-input chart, altitude chart, tech-log exhibit,
   mechanism diagram) rendered at 4K and attributed as code-rendered.
2. **Provenance-gated.** Each on-screen file has a structured PROVENANCE row and
   passes the license gate (`scripts/lib/licenses.py`). `publish_kit.py`'s CC-credit
   check passes on the METADATA credits block.
3. **Claims-traced.** Every scene line, cap/stat/exhibit string and hf data value
   traces to a CLAIMS claim or `[cNN]` anchor. Of the 26 CVR/ATC lines, all are
   verbatim recreations through the quoted-transcript gate and labeled CVR/ATC
   RECREATION. The docket has no audio, so nothing is labeled ACTUAL.
4. **Slice-aware footage** (era/identity vision verify, `fetchRules.blocklist`
   against network-news sources). The hook is real NTSB motion video: the tollbooth
   camera and the takeoff tape.

## Sensitivity warnings (tier HIGH — read before any edit or Short)

- 265 dead, 5 of them on the ground. Around 90% of passengers were of Dominican
  descent, and the community holds an annual memorial. Belle Harbor had lost about
  65 residents on 9/11. `victimsNamed: false`: no victim surname in any
  cap/stat/chapter/thumbnail/description.
- The probable cause names the deceased first officer's inputs. Always write "the
  NTSB found", never assert it. The finding was contested by the Allied Pilots
  Association (2006 reopen bid) and by his father (Stan Molin, d. Apr 17, 2014,
  past tense). His widow and daughter are living. **All Sara Hammel material is
  EXCLUDED.**
- Carmody's dissent (Healing joining) concerns the **order of the contributing
  factors** (3–2 vote), not the probable cause itself.
- The 1:40 separation was less than two minutes but more than four miles, and the
  controller complied (Finding 3). Never write "too close" or "illegal".
- Terrorism appears only as the documented same-day rumor followed by the same-day
  ruling.
- The 25th anniversary has no announced 2026 plans (as of Oct 24). Don't claim any.
- Full checklist: METADATA "Sensitivity checklist" plus publish-video §6 before
  publish.

## The `aamp_booklet` decision (Akshay — before render)

`images/aamp_booklet.png` is American Airlines' own AAMP training-course page (dated
1/1/97) as reproduced in NTSB docket DCA02MA001. It is a documentary exhibit, **not a
US-government work**, so it isn't automatically PD. It appears on 4 scenes in chapter
6 ("What the Training Tape Said"): `c6`, `c6_1`, `c6_2`, `c6_12`. Options:
- **(a) Ship as a fair-use documentary exhibit.** It is short, transformative, a
  primary piece of the investigative record, and credited in METADATA.
- **(b) Swap to PD NTSB pages** that discuss the same program (`aar_p87.png`,
  `aar_memo.png`, already in the pool). This costs a small loss of directness on
  `c6_2`'s "in capital letters" line.
This decision also gates Short 3's `c6_2` beat (see SHORTS-SCHEDULE).

## What's left

1. **Akshay:** the `aamp_booklet` call (above). Also choose the publish date: Nov 7
   on the slot, or Nov 12 on the anniversary.
2. ONE 4K render + master: `ship_doc.py american587 American587Doc` (or
   `render_and_master.py … --scale 2`, chunked, `CHUNKED=1`). No more checkpoint
   renders. Windowed tension bed (rotate within family, not the last one shipped)
   or no bed, per Akshay's no-VO-plus-music preference.
3. Verify: ffprobe duration (~26:52), −14 LUFS, a mid frame plus the outro splice
   frame, VO ear-check sample.
4. Generate the real SRT and re-run `gen_doc_srt.py american587` for final chapter
   timestamps. Hand-clean them again: the script prints only line 2 of two-line
   chapter titles and emits both "Opening" and the title card. Update METADATA
   CHAPTERS if anything moved.
5. Rename the master to `New York Thought It Was 9-11 Again. It Wasn't.mp4` + `.srt`
   at repo root, then re-run `python3 scripts/publish_kit.py american587`. It should
   then report PACKAGE COMPLETE.
6. Build the Black Box vertical subscribe outro (the one asset still missing, needed
   for any BB Short). Then register and render `American587Short1-4`.
7. Upload per publish-video: draft, Test & Compare A/B/C, end screen = NORAD tapes
   only, pin the comment, drip Shorts Nov 8–11. Then log URLs in
   `blackbox-published-urls` + LAUNCH-LESSONS publish log and run the 48h
   diagnosis.
8. Open question flagged in METADATA: publish-video §3 still maps "synthetic
   narration → AI disclosure YES" from the clone-voice era. This episode is marked
   `AI use: NO` (Grant stock voice, labeled recreations, no realistic depiction of
   real people/events). Akshay can flip it to YES if he wants the conservative call.
