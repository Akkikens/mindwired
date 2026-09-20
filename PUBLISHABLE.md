# PUBLISHABLE — upload packets

Everything needed to put a finished episode on YouTube, with nothing taken on
trust. Two rules this file follows:

1. **Every number here was measured, not computed.** Chapter marks come from the
   finished audio (the SRT), never from the manifest — the manifest-computed marks
   for airforceone were out by up to 11 seconds and put "A threat that wasn't" on
   top of the victim-identification passage.
2. **Known defects are written down, not hidden.** If something is wrong and
   shipping anyway, it says so and says why.

| Episode | Channel | Length | State |
|---|---|---|---|
| **Cheney Said Engage. Nobody Told the Pilots.** | Black Box Breakdown | 19:26 | 🟡 re-rendering — exhibits fixed, verify master then upload |
| **Kalpana Chawla Chose Her Own Name** | mindwired | 22:16 | 🟢 **upload now** — one known cosmetic defect, documented below |

---

# 1 · airforceone — Black Box Breakdown

## Status: 🟡 re-render in flight

The shipped master had all 84 Commission exhibits on screen at full-page size and
unreadable — **11:22 of a 19:30 episode, 59.8% of the runtime**, showing the primary
record as grey texture while the narration quoted it. That is fatal for this episode
specifically, because its entire argument is *"here is what the document actually
says versus what everyone repeats."* Fixed and re-rendering. **Do not upload the old
master.**

| Asset | Path |
|---|---|
| Master (new) | `out/airforceone_gce.mp4` → copy to `~/Desktop/RENDERS/` when verified |
| Master (old, superseded) | `out/airforceone_gce_OLD.mp4` — **delete after the new one is verified** |
| Captions | `~/Desktop/RENDERS/Cheney Said Engage - Nobody Told the Pilots.srt` — 356 cues, still valid (VO untouched, audio byte-identical) |
| Thumbnails | `out/thumbs/airforceone_{A,B,C}.png` |
| Fact base | `docs/planning/CLAIMS-airforceone.md` — 384 lines, read from the Commission PDFs with pdftotext |

**Verify on completion** (do not skip — the previous master passed every one of these
and was still unshippable):
- [ ] 3840×2160, ~19:26, BB outro baked on the end
- [ ] −14.0 LUFS
- [ ] frame count matches at concat
- [ ] **sample frames at 6:03, 9:40, 13:10, 15:15 — the Commission body text must be readable**

## TITLE
```
Cheney Said Engage. Nobody Told the Pilots.
```
Alternates — title-test only **after** the thumbnail test settles, never both at once:
1. `The Vice President Was Mistaken` — the Commission's own verbatim finding
2. `Air Force One Flew Nine Hours That Day`

⛔ Never drift into **"orders that never arrived"** — the live sept11timeline episode
owns that phrasing and a near-duplicate splits them in search.

## THUMBNAILS — upload all three to Test & Compare
| | Concept | Built on |
|---|---|---|
| A | "engage? VP: Yes" from Libby's handwritten note | the real Notes page |
| B | Bush at Barksdale | WHCA footage |
| C | The livery | DVIDS |

All 1280×720, zero added text (House Style 2.0 — thumbnail text costs ~19% median
views at scale). **The winner is decided on watch-time share, not CTR** — that is the
metric YouTube itself uses to settle the test. Log the winning pattern in
`docs/planning/LAUNCH-LESSONS.md`.

## CHAPTERS — measured from the audio
Each mark is the cue where that chapter card's own narration is spoken, located in
the SRT. All gaps clear YouTube's 10-second minimum. The 0:41 title card was removed
deliberately: it sat 5 seconds before the next chapter and YouTube silently drops the
**entire** chapter list if any single chapter is under 10 seconds.
```
0:00 Opening
0:44 A school in Florida
3:02 Wheels up
4:54 Ninety-five minutes
6:03 Engage
9:40 ID type and tail
13:10 Testing a theory
15:15 A threat that wasn't
17:25 The record
```

## DESCRIPTION
```
At 10:02 on the morning of September 11, 2001, an FAA controller asked whether Air
Force One had a fighter escort yet. It did not.

This is what the 9/11 Commission Report actually records about the shootdown order:
who gave it, when it was given, and who it reached. The Vice President authorised
fighters to engage an inbound aircraft at roughly 10:15. United 93 had already
crashed at 10:03. The authority reached NORAD at 10:31 — twenty-eight minutes after
impact — and the only orders ever conveyed to the pilots over Washington were to
"ID type and tail."

The film also tests the military-shootdown theory against the record rather than
dismissing it, and says plainly where the sources are thin or disputed.

Every document on screen is the primary record, rendered from the official PDFs and
cited page by page.

Sources: The 9/11 Commission Report (chapters 1 and 10, and the Notes volume).
Footage: US DoD via DVIDS, NARA, and the White House Communications Agency — all
public domain.
```

## TAGS
```
9/11, September 11, Air Force One, Dick Cheney, shootdown order, United 93, Flight 93, 9/11 Commission Report, NEADS, NORAD, Scooter Libby, Ari Fleischer, George W Bush, Barksdale, Langley F-16, chain of command, PEOC, air threat conference, primary sources, declassified, aviation history, military history, documentary, Black Box Breakdown, what really happened, Pentagon, World Trade Center, Emma E Booker, Secret Service, Andrews Air Force Base, General Larry Arnold, Donald Rumsfeld, 2001
```

## WHAT IS ACTUALLY IN THIS VIDEO
- **147 scenes**, 19:26 of body
- **84 exhibit scenes** — 9/11 Commission Report ch.1 pp.35 and 38–45, ch.10 p.325,
  and the Notes page carrying n.220 (Libby's contemporaneous note) and ch.10 n.1
- **35 video segments cut from 7 distinct source clips** — af1_1, af1_2,
  barksdale_1, barksdale_2, bush_2, bush_3, bush_4. This is the honest number.
  Seven sources across 19 minutes is thin, and it is the main reason the episode
  leans on exhibits.
- **Narrator:** Grant (Cartesia)

## ACCURACY NOTES — the things this episode gets right that the popular ones don't
The 14.9M-view reference video states an untraceable 45,000 ft, quotes Fleischer's
note as settled text when the handwriting is disputed, and implies the "Angel" threat
drove the diversion when it actually arrived *after* that decision. This cut:
- attributes rather than asserts every contested causal claim
- says on screen that the "Holy cow" FAA exchange is a phone line we do **not** hold
- states that the Commission found **no documentary evidence** for the earlier
  authorising call, and that Libby and Mrs Cheney — both taking notes — recorded none
- carries a 20-item errors-in-circulation table in the fact base

## ⚠ DEFECTS CARRIED (accepted, not fixed)
1. **Four aliased exhibits.** `ex_card_line`, `ex_faa_line` (both = p.38),
   `ex_norad_chat` (= p.42) and `ex_fleischer_notes` (= p.41) are the Commission page
   that *describes or quotes* a document, because the document itself is not in the
   Report. The on-screen source lower-third names the Commission page, never the
   underlying document — correct, but know that it is an alias.
2. **22 unsourced asset warnings** in the relevance audit (`c_bush_2_*`,
   `c_barksdale_*`, `pentagon_damage_1.jpg` and others have no ATTRIBUTION entry).
   They derive from sourced parents, but the audit cannot see that. Worth closing.
3. **Thin footage base** — see above.

---

# 2 · columbiakalpana — mindwired

## Status: 🟢 upload now

| Asset | Path | Verified |
|---|---|---|
| Master | `~/Desktop/RENDERS/Columbia - The Sixteen Days (mindwired 22-16).mp4` | 3840×2160 · **22:16** · 2.7 GB · −14.0 LUFS · MW outro baked |
| Captions | `~/Desktop/RENDERS/Columbia - The Sixteen Days.srt` | **388 cues**, transcribed from the finished audio, speech to 21:58 |
| Thumbnails | `~/Documents/.../out/thumbs/columbiakalpana_{A,B,C}.png` | A = her childhood photograph · B = arms spread by a light aircraft · C = the Karnal Aviation Club |

## TITLE
```
Kalpana Chawla Chose Her Own Name
```
Locked by ctr-engine at 9.5/10 — front-loads the recognised name for the Indian
audience and withholds the payoff. Working title was "Columbia: The Sixteen Days".

⛔ **Must not compete with the live Black Box "Columbia: The Photos NASA Never Took."**
Different channel, different spine: this one is the crew, that one is the imagery
requests.

## CHAPTERS — derived from the finished audio
The doc spec is unreadable from this session (see BLOCKER below), so these come from
the 388-cue SRT. Every mark is a real cue start, so none can drift from the master.
**Eyeball against the on-screen chapter cards before pasting**, since the card labels
live in the spec.
```
0:00 The last morning
1:42 The girl who named herself
5:15 Eighty experiments, around the clock
6:07 The seven
8:39 The crew's cameraman
11:18 Eighty-one point seven seconds
12:12 Three requests for imagery
14:51 No imagery was taken
15:42 Eight fifty-four and twenty-four seconds
18:14 What fell over Texas
19:04 Culture as much as foam
20:44 Fifteen things before anyone flew again
21:35 The names
```

## DESCRIPTION
```
She was born in Karnal, and the name on her school register was not the name she
used. She picked Kalpana herself. It means imagination.

This is the story of STS-107 told through its seven crew and the sixteen days they
spent in orbit — the science they ran around the clock, the camcorder Dave Brown
carried, the foam that came off eighty-one point seven seconds after liftoff, and
the three separate requests for imagery of the wing that were never acted on.

All seven are named twice: once in the Columbia Accident Investigation Board's
dedication, which carries nine names because two searchers died looking for them,
and once in the seven asteroids discovered eighteen months before they flew.

Sources are the CAIB report and NASA's own footage. Where the record is disputed or
thin, the film says so.

Archival footage: NASA and the CAIB (public domain). Some archival material has been
digitally upscaled. The breakup footage is US Army AH-64D gun-camera video.
```

## TAGS
```
Kalpana Chawla, Columbia disaster, STS-107, space shuttle Columbia, NASA, CAIB report, Columbia Accident Investigation Board, foam strike, Rick Husband, William McCool, Michael Anderson, David Brown, Laurel Clark, Ilan Ramon, Karnal, Indian astronaut, space shuttle, reentry, NASA culture, Challenger, space disaster, documentary, mindwired, space history, real footage, February 1 2003, wing leading edge, imagery request, return to flight, Petr Ginz, gun camera footage, space shuttle program
```

## PINNED COMMENT
Post it yourself, then pin. Pin within the first hour — it seeds the comment
section's tone before the first wave of replies sets it.
```
Petr Ginz drew "Moon Landscape" in the Terezín ghetto when he was fourteen — the
Earth as seen from the Moon, imagined by a boy who would never see either. He was
murdered at Auschwitz in 1944.

He was born on the 1st of February, 1928. Columbia broke up on the 1st of February,
2003 — what would have been his 75th birthday. Ilan Ramon was carrying a copy of his
drawing. The original has never left Jerusalem.

That date isn't in the video. It's true, and it belongs somewhere.

Three things worth repeating:

— The CAIB report's dedication page carries NINE names, not seven. Jules Mier and
Charles Krenek died when their helicopter came down while searching for debris in
Texas. The board put them with the crew, job titles underneath.

— The seven asteroids were picked up at Palomar in July 2001 and named in August
2003. They were found eighteen months before the crew flew.

— Kalpana chose her own name. It means imagination. So, in the end, did the drawing.

Sources are the Columbia Accident Investigation Board report and NASA's own footage,
all public domain. Where the record is thin or disputed, the film says so rather than
picking the better story.

Corrections welcome — with a source, and I'll pin them here.
```

## CAPTION FIX APPLIED 2026-09-20
Whisper mangled every crew name it met. Corrected in the .srt on the Desktop
(original backed up in the session scratchpad):
| was | now | count |
|---|---|---|
| Kalpana **Chala** | Kalpana **Chawla** | 4 — *zero* correct spellings shipped |
| **Ilhan** / **Elan** Ramon | **Ilan** Ramon | 2 |
| Jules **Meir** | Jules **Mier** | 1 |
| Charles **Krennek** | Charles **Krenek** | 1 |
| **Peh Turjins** | **Petr Ginz** | 1 |

The narration says all of these correctly — only the transcript was wrong. Worth
catching: these are the names of the dead, and "Kalpana Chala" in the captions of an
episode built for an Indian audience is the kind of thing that costs trust in the
first comment.

## STRUCTURE
Kalpana carries roughly 5 minutes; the other six crew are woven into the mission
where the record touches them (Brown's camcorder = Missed Opportunity 2); the
Red/Blue shift split is the spine. All seven land twice — the CAIB dedication's
**nine** names (including Jules Mier and Charles Krenek, the search helicopter crew)
and the seven asteroids.

## ⚠ DEFECT CARRIED — the same weak-zoom bug, at 1/4 the scale
**~7 of 44 sampled frames — about 16% of runtime, ~3:30** — are CAIB pages rendered
full-page and too small to read.

**Shipping anyway, and here is the honest reason it is acceptable here but was not
for Air Force One:** this episode is carried by real footage and narration, not by
reading documents. Its two exhibits that carry *visual* information — the CAIB cover
and the ch.6 wing-diagram figure page — read fine, because a diagram survives being
small in a way body text does not. Air Force One was 60% and its whole argument was
the text.

## 🔴 BLOCKER — why this one could not be fixed
`~/Documents/GitHub/mindwired/src/mindwired-doc/docs/` is **permission-denied to every
tool** — `cat`, `cp`, `ls` and the editor all return EPERM, though the sibling
`src/mindwired-doc/` and the images folder read fine. So the columbiakalpana spec and
manifest cannot be read or written from here.

**To unblock:** grant the terminal Full Disk Access (System Settings → Privacy &
Security), **or** move the columbiakalpana spec into `~/mindwired`.

This split clone is not a cosmetic problem. It is what nearly shipped a broken
re-render: the ExhibitScene zoom fix existed in `~/Documents` and not in `~/mindwired`,
which is the clone that actually renders, so the first re-render attempt was launched
against the old 1.5× zoom and would have produced the same unreadable pages. Caught
by reading the file rather than trusting the clones agreed. **`preflight_doc.py` is
248 diff-lines apart and `scripts/lib/footage.py` 203 — still unreconciled.**

---

# 3 · UPLOAD PROCEDURE

For each episode:
1. Visibility **Private** first. Upload, let processing finish to 4K, watch the first
   30 seconds and one exhibit-heavy stretch before going public.
2. Title, description, tags from the blocks above.
3. **Upload the .srt manually** — do not rely on auto-captions.
4. Paste chapters into the description (the 0:00 mark is mandatory or none render).
5. Upload **all three** thumbnails to Test & Compare.
6. "Altered or synthetic content" — **No** for both. Neither uses generated video.
   The upscaling disclosure is already in the description.
7. Set the correct channel. `BB_OUTRO` vs `MW_OUTRO` is baked in and wrong-channel
   costs a full re-render.
8. Not made for kids.

# 4 · AFTER LAUNCH — this is owed, not optional

`icahn-validate` Step 0 blocks the **next** topic until the most recent upload's 48h
diagnosis is banked in `docs/planning/LAUNCH-LESSONS.md`. That loop was audited on
2026-08-03 and found never once closed.

At 48 hours, pull from Studio and record: impressions, CTR, average % viewed, views,
and the Test & Compare winner **by watch-time share**.

**Unpaid launch-data debt, blocking new topic validation:** groundzeroair,
colossalsquid, projecthailmary.

**Next topic should be a non-9/11 giant name.** Air Force One is the channel's
6th 9/11 video; the lane is saturating.

# 5 · OUTSTANDING

1. **Columbia re-cut (Black Box) — master lost.** Rendered clean at −14.0 LUFS, then
   a 6-hour `--max-run-duration` ceiling deleted the VM mid-fetch. Source intact,
   re-render only. The live Black Box Columbia video still carries four factual
   defects: Request 1 misattributed to Rocha, Missed Opportunity 8 absent, "Peter
   Gins" for Petr Ginz, and 26 stock scenes.
2. **A day of work uncommitted in `~/Documents`** — the CLAIMS and FOOTAGE-MAP files
   and the columbiakalpana spec. Blocked by the same permission wall.
3. **Merge** `claude/best-video-project-lf3bau` → main.
4. **Reconcile the two clones** (see BLOCKER above).
5. Close the 22 unsourced-asset audit warnings on airforceone.

# 6 · LESSONS BANKED

- **A highlight rect is also the zoom target.** A scene without one never zooms, so
  the page renders full-frame and unreadable. That single fact caused the entire
  airforceone defect.
- **Anchor exhibits by measuring, not eyeballing.** Rects measured off the PDF's own
  glyph boxes land on the words. Two bugs found doing it: pdftotext glues punctuation
  onto words (`told,"negative`), so equality matching makes every quoted phrase
  unfindable; and expanding a match to whole lines must compare against the *adjacent*
  word, not the span's full extent, or a two-line match swallows most of the page.
- **Check the caption against the image.** Three exhibits named one page and showed
  another — worst was `ex_commission_ch10n1`, captioned "ch. 10, n. 1" while rendering
  a page containing no Angel material at all.
- **Chapter marks from the manifest drift.** Measure from the SRT.
- **GCE parallelism:** 12 Chrome instances trigger the delayRender font race and kill
  a full render. 2 × 2 with chunk-size 150 completes with zero retries.
- **Spot VMs use `term=STOP`, never DELETE** — a preemption once destroyed a box and
  its finished work.
