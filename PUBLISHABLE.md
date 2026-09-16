# PUBLISHABLE — what is finished, what is blocking it

Updated 2026-09-15 from actual repo and channel state, verified with ffprobe, ffmpeg
ebur128 and frame sampling rather than memory. Keep it current: `publish-video` updates the row it ships,
`doc-episode` adds a row when a master lands.

**The backlog the 2026-08 audit flagged is gone.** Everything that was rendered-and-sitting
went live on 2026-09-13. What follows is the one episode still in flight, then the debts
the loop is carrying.

---

## 🟢 READY TO UPLOAD — everything below is copy-paste, nothing else to build

### sept11timeline — Black Box Breakdown — **9/11: The Orders That Never Arrived**

Rendered 2026-09-14. Packaged 2026-09-15 off the master and the measured SRT, not the
model's estimates. Title was LOCKED by ctr-engine Run A (2026-09-14, scored 9.00).

| Asset | Path | Verified |
|---|---|---|
| Master | `9-11 - The Orders That Never Arrived.mp4` (root) | 3840×2160 · **32:00** · 5.80 GB · **−14.0 LUFS** (LRA 4.1) · 57,612 frames · blackbox outro baked in |
| Captions | `9-11 - The Orders That Never Arrived.srt` (root) | **464 cues**, measured off the master (00:00:00,380 → 00:31:39,960) |
| **Thumb B2 (PICK)** | `out/thumbs/sept11timeline_B2_wedge_flag.png` | **1280×720, built 2026-09-16.** Pentagon Wedge 1 + the flag on the west face. Zero text. Gash reads at 170px, flag carries instant 9/11 recognition, and no competitor in this lane uses Pentagon imagery — they all use towers |
| Thumb B1 (alt) | `out/thumbs/sept11timeline_B1_wedge.png` | Same crop without the flag — cleaner, but loses the recognition cue |
| Thumb B3 (reject) | `out/thumbs/sept11timeline_B3_gash_tight.png` | Tight on the gash. Fails the squint test — reads as generic rubble at 170px |
| Source | `public/shorts/sept11timeline/images/pentagon_wedge_1.jpeg` | 1920×1251, TSGT Cedric H. Rudisill, USAF — **public domain** (US federal work), probed 2026-09-14 |
| Thumb C (fallback) | `public/shorts/_evidence/noradtapes/docs/GPO-911REPORT.pdf` | Commission timeline exhibit page — exhibit grammar, weakest squint test |

**QA run 2026-09-15 before ship:**
- Loudness −14.0 LUFS — exactly YouTube's target, no adjustment needed.
- **Visual variety is clean.** 51 distinct visuals over 137 scenes; heaviest asset is
  `ops_floor_1.mp4` at **8.4% of runtime** (noradtapes, the episode that triggered the
  monotony rule, ran one clip across **26%**). **Zero** back-to-back runs of 3+ on the
  same visual. The one real reuse hotspot is `pentagon_wedge_1.jpeg` — a single file
  carrying 5 scenes — and `atc_scope` at 2 files over 6 scenes.
- **Portrait-source sweep: passes.** 0 portrait video. Of 31 images, 16 are portrait and
  all 16 are `ex_` document exhibits, which route to `ExhibitScene` and are *meant* to be
  portrait. This master does **not** carry the flight93 face-crop defect.
- 128 frames sampled at 15s intervals and machine-checked for pillarboxing: the hits are
  radio scenes (centred waveform), exhibit pages and chapter cards — all correct by design.

**One known blemish, non-blocking:** `wtc_exterior_2.jpg` (1280×2236) is a portrait photo
in a photo scene, so it renders pillarboxed with ~68% of the frame as blurred backdrop.
It lands on **one** beat (the North Tower impact) via pool rotation. The new preflight gate
flags it. Not worth a 32-minute re-render; refetch landscape before any future cut.

#### TITLE
```
9/11: The Orders That Never Arrived
```
Alternates, only if the thumbnail test settles first:
1. `Four Planes. Nobody Could Talk to Anybody.` (8.75)
2. `The Evacuation Order Nobody Could Hear` (8.50)

⛔ Never revive any title implying the official account is a lie or a cover-up. The
contradictions in the record are real and are this episode's spine, but that phrasing is
conspiracy vocabulary and summons that audience into the comments. Building 7 is the
reference for holding the line.

#### DESCRIPTION (paste whole)
```
At 9:59 in the morning the South Tower came down. It had stood fifty-six minutes after it
was hit, and it fell in ten seconds. Two hundred metres away, inside the North Tower,
firefighters were still climbing. Within about a minute an order went out over the radio
from the lobby command post: evacuate, get out of the building.

That order was sent. Whether it was heard is still disputed twenty-five years later.

This is September 11th told as one continuous communications failure, because that is what
the primary record actually shows. Not the broadcast footage — the tapes, the transcripts
and the radio logs. The day from 7:59 in the morning to 5:21 in the afternoon, assembled
from the 9/11 Commission Report and its staff statements, the NEADS and FAA tapes released
under FOIA, the NIST NCSTAR reports on the towers, the Pentagon Building Performance Report
and the Arlington County After-Action Report.

Seven acts, and every one of them is the same failure wearing a different uniform:

At 8:24 a hijacker keys a microphone and says "we have some planes." The transmission goes
to the wrong place and the controller does not hear it live.

Between 8:46 and 9:03 the second impact reaches the world by television before it reaches
the agencies responsible for the airspace.

At 9:37 the Pentagon is struck by an aircraft the system had already lost.

At 9:42 — or 9:45, depending on which official record you read — someone orders every
aircraft in American airspace to land. The record still cannot agree on who gave that order.

At 10:04 and 10:08 NYPD aviation transmits assessments of the North Tower's instability.
FDNY lobby command had no radio on which to receive them. That one is not disputed.

At around 10:10 the shootdown authorization is given. The Commission's finding is that it
never reached the pilots.

And at 17:21, a third building.

On the most recorded day in history, almost nothing that was said reached the people who
needed to hear it.

A note on what this video does not do. It assigns no personal blame — the Commission frames
these failures as systemic, and so do we. It does not adjudicate the disputes in the record;
where two official sources disagree, we show you both and say so. It does not platform
conspiracy claims. And it uses no network broadcast footage: everything here is primary
evidence, government imagery, or clearly labelled recreation.

Where a recording is real docket audio it is labelled ACTUAL RECORDING. Where a line is
performed from a transcript it is labelled RECREATION. We never mix those two up.

Sources are listed in the pinned comment.
```

#### CHAPTERS (measured off the master SRT — paste into the description)
```
0:00 9:59 — the order that went out
2:02 Act I — The first message went to the wrong place
5:53 Act II — Nine minutes was the most anyone got
8:54 Act III — The plane nobody was looking for
14:05 Act IV — Seventeen thousand people, and the stairs
16:32 Act V — The order that went out at 9:59
20:04 Act VI — The order that never arrived
24:22 Act VII — The one order that did arrive
29:16 Coda — The tape that was destroyed
```
Title card lands at 1:58; Act I opens at 2:02. YouTube requires the first chapter at 0:00,
so the cold open carries it. All nine timestamps were matched against SRT cue text, not
computed from scene durations — `gen_doc_srt` drifted 19s on a sister episode.

#### TAGS
```
9/11, september 11, 9/11 timeline, world trade center, pentagon september 11,
united 93, american 11, united 175, american 77, 9/11 commission report,
norad tapes, faa tapes, air traffic control 9/11, wtc 7, fdny 9/11,
september 11 documentary, 9/11 minute by minute, black box breakdown
```

#### PINNED COMMENT
```
Every claim in this video comes from the primary record. The main sources:

• The 9/11 Commission Report and its staff statements (GPO, public domain)
• NEADS and FAA audio released under FOIA (NORAD/USNORTHCOM, April 2008)
• NIST NCSTAR 1-7 (occupant behaviour and egress) and 1-8 (emergency response)
• The Pentagon Building Performance Report (ASCE) and the Arlington County
  After-Action Report
• Department of Transportation Inspector General report on the destroyed
  New York ARTCC tape

Where the official record contradicts itself, the video says so rather than picking the
tidier version. Three of those conflicts are in here: who ordered the national ground stop
(9:42 vs 9:45), when ATC lost the airspace picture (9:03 vs 9:05), and how many controllers
had spoken onto the tape that was later destroyed (five vs six).

No network broadcast footage is used anywhere in this video.
```

#### END SCREEN
Bridge is spoken at the end of the master (scene `bridge`) and points at
**The Tapes That Broke NORAD's 9/11 Story** (`noradtapes`) — put that video in the end
screen slot, plus the subscribe element. Do not point at United 93 here; it is already
surging on Browse and does not need the referral, whereas `noradtapes` is the newer upload
carrying the same thesis.

#### SUGGESTED-ADJACENCY TARGETS (riff, never clone)
Christian Koller "9/11 attacks in realtime" 17.1M · SMH/The Age "9/11, 2001 as it happened"
21.3M · SmartHER News 8.4M · History with Charley "September 11th Attacks in REALTIME" 397K

#### ✅ NOTHING BLOCKING — this is ready to upload
The thumbnail was the last open item and it is built (2026-09-16). Upload **B2**. All three
crops carry a radial falloff so peak brightness sits on the collapse: B2 measures 13.8% of
the frame above L150, which clears the house "one focal element separated by brightness"
rule. Do not let YouTube auto-pick a frame — it will grab a chapter card.

---

### hadalpollution — mindwired — **What They Found Inside the Deepest Animals on Earth**

| Asset | Path | Verified |
|---|---|---|
| Master | `What They Found Inside the Deepest Animals on Earth.mp4` (root) | 3840×2160 · **12:52** · 2.39 GB · **−14.0 LUFS** · 23,032 frames · mindwired outro baked in |
| Captions | `What They Found Inside the Deepest Animals on Earth.srt` (root) | **180 cues, measured off the master** (model drifted +0.38s→+4.66s) |
| Thumb A | `out/thumbs/hadalpollution_A.png` | *Hirondellea gigas* — the real Mariana amphipod, on black |
| Thumb B | `out/thumbs/hadalpollution_B.png` | *Pseudoliparis swirei* — the real hadal snailfish |
| Thumb C | `out/thumbs/hadalpollution_C.png` | NOAA lander frame — a scavenger at bait |

Full package: `docs/metadata/METADATA-hadalpollution.md`

#### TITLE
```
What They Found Inside the Deepest Animals on Earth
```
Title-test variants (only after the thumbnail test settles):
1. `What They Found Seven Miles Down` (9.0)
2. `100% of the Animals at Earth's Deepest Point Had Plastic` (8.25)

#### DESCRIPTION (paste whole)
```
In 2019 a research team opened the guts of ninety amphipods — small scavenging
crustaceans — pulled from six of the deepest ocean trenches on Earth, at depths between
7,000 and 10,890 metres.

Over 72% of them had swallowed something synthetic. In the Mariana Trench, the deepest
of the six, the figure was 100%. Every animal they examined. The single most common item
was a blue fibre, and every Mariana amphipod had at least one.

The paper's own comparison is the part that stays with you: the animals in the hadal
zone are ingesting plastic at "a similar frequency (72%) to crustaceans in coastal water
habitats." The deepest, most isolated animals on the planet are as contaminated as the
ones living just off our beaches.

This is the investigation behind that measurement — and behind two others: the
persistent organic pollutants found at levels "considerably higher than documented for
nearby regions of heavy industrialization," and the mercury accumulating in trench
sediment at up to 400 times the global deep-sea average, most of it arriving from the
surface ocean.

It is also the story of what lives down there: the hadal snailfish, the deepest
vertebrate in the ocean, which appears to have arrived only in the last few million
years and gave up its pigment, its vision genes and the calcium in its bones to stay.

We say what the record says and we stop there. Where a number is widely repeated but
could not be sourced to a document we could actually read, we say that out loud and
leave it out.

CHAPTERS
0:00 A blue fibre, seven kilometres down
1:09 Act I — The zone that begins at six thousand metres
2:26 Act II — The animal that got there first
4:34 Act III — Ninety animals, six trenches
7:16 Act IV — The chemicals that were supposed to be gone
9:09 Act V — Four hundred times
10:25 Act VI — Why it ends up at the bottom

SOURCES
• Jamieson AJ, Malkocs T, Piertney SB, Fujii T, Zhang Z. "Bioaccumulation of persistent
  organic pollutants in the deepest ocean fauna." Nature Ecology & Evolution, 13 Feb
  2017. doi:10.1038/s41559-016-0051
• Jamieson AJ et al. "Microplastics and synthetic particles ingested by deep-sea
  amphipods in six of the deepest marine ecosystems on Earth." Royal Society Open
  Science, 2019. doi:10.1098/rsos.180667 (open access)
• Liu M et al. "Substantial accumulation of mercury in the deepest parts of the ocean
  and implications for the environmental mercury cycle." PNAS, 2021.
  doi:10.1073/pnas.2102629118
• Xu W et al. "Chromosome-level genome assembly of hadal snailfish reveals mechanisms of
  deep-sea adaptation in vertebrates." eLife, 2023. doi:10.7554/eLife.87198
• Chen Y et al. "In situ swimming behavior of the Mariana snailfish Pseudoliparis
  swirei." Scientific Reports, 2026. doi:10.1038/s41598-026-48409-2

FOOTAGE CREDIT
Deep-sea footage courtesy of **NOAA Ocean Exploration** (public domain). These are real
ROV dives, but NOAA works largely between 300 and 3,000 metres — no footage in this
video is presented as having been filmed in the hadal zone.

IMAGE CREDITS
• Hirondellea gigas — Wikimedia Commons, CC BY-SA 2.5
• Pseudoliparis swirei — Wikimedia Commons, CC BY 3.0 (from the species description,
  Zootaxa 4358.1.7)
• Mariana Trench bathymetry — Wikimedia Commons, CC BY-SA 4.0 / CC BY 4.0

▶ MORE FROM MINDWIRED
• Nobody Has Ever Seen a Full-Grown Colossal Squid → https://youtu.be/N1ZlQpP5be4
• 21 Astronauts Never Came Home. Here's Every Story. → https://youtu.be/maxZwNGqIDU
• 8 People Sealed In. The Oxygen Kept Vanishing. → https://youtu.be/--sTmQzJtBk
• The Lost Cosmonauts the USSR Pretended Never Existed → https://youtu.be/Hs6ZzZAQ7ms
• Documentaries playlist → https://www.youtube.com/playlist?list=PLSGw_l2_Tsdo
• Subscribe → https://www.youtube.com/@MINDWIREDD?sub_confirmation=1

#DeepSea #MarianaTrench #Microplastics
```

#### TAGS
```
mariana trench, deep sea, hadal zone, microplastics, amphipod, hirondellea gigas,
snailfish, pseudoliparis swirei, ocean pollution, deepest place on earth, challenger
deep, deep sea creatures, ocean science, noaa ocean exploration, marine biology
```

#### PINNED COMMENT
```
The sentence that made this video, from the paper itself:

"Over 72% of individuals examined (65 of 90) contained at least one microparticle… The
frequency of ingestion varied between 50 and 100% of amphipods from a given site; the
lowest being the New Hebrides Trench (50%) and the highest the Mariana Trench (100%)."

And the comparison underneath it: that is "a similar frequency (72%) to crustaceans in
coastal water habitats."

Ninety animals is a small sample and we say so in the video. What it shows is that there
is no longer anywhere on this planet clean enough to use as a control.

Jamieson et al., Royal Society Open Science, 2019 — doi:10.1098/rsos.180667, open access.
```

#### SETTINGS
Science & Technology · Standard YouTube License · Not made for kids · attach the .srt ·
all 3 thumbnails into **Test & Compare** (winner on watch-time share, not CTR).

#### ⚠ NOT OPTIONAL
The description carries **CC BY-SA 2.5 / CC BY 3.0 / CC BY-SA 4.0** credits for the
amphipod, snailfish and bathymetry stills, plus the NOAA Ocean Exploration credit.
Those are licence obligations — if the description is trimmed, they stay.

---

## 🟢 READY TO UPLOAD — everything below is copy-paste, nothing else to build

### apollo1 — mindwired — **The Apollo 1 Transcript That Doesn't Exist**

**All five deliverables verified on disk 2026-09-13:**

| Asset | Path | Verified |
|---|---|---|
| Master | `The Apollo 1 Transcript That Doesn't Exist.mp4` (repo root) | 3840×2160 · **23:18** · 2.98 GB · **−14.0 LUFS** · mindwired outro baked in · frames 41,719 == 41,719 |
| Captions | `The Apollo 1 Transcript That Doesn't Exist.srt` (repo root) | **329 cues**, measured off the master (see the drift note in HOUSEKEEPING) |
| Thumbnail A | `out/thumbs/apollo1_A.png` | 1920×1080 — the real AS-204 hatch, open, on near-black |
| Thumbnail B | `out/thumbs/apollo1_B.png` | 1920×1080 — the burned interior of CM-012 |
| Thumbnail C | `out/thumbs/apollo1_C.png` | 1920×1080 — the fire-scarred hatch opening in the hull |

Full package with title scoring and rationale: `docs/metadata/METADATA-apollo1.md`.

---

#### TITLE (paste this one)
```
The Apollo 1 Transcript That Doesn't Exist
```
A/B variants for the title test — **only after the thumbnail test settles**:
1. `NASA Printed 3 Versions of Apollo 1's Last Words` (scored 9.0 — higher than the shipped 8.5)
2. `NASA's Own Report: No Transcript Is Possible` (8.75)

#### DESCRIPTION (paste whole)
```
On 27 January 1967, Grissom, White and Chaffee died in a fire on the pad at Launch
Complex 34. The line everyone quotes from that fire — "We've got a fire in the
cockpit" — is not what the official record says.

The Apollo 204 Review Board had the tape. It had Bell Telephone Laboratories run
extensive analysis on it. And then it wrote, about the crew's second transmission,
that it "is garbled and is, therefore, subject to wide variation of interpretation as
to content and as to who made the transmission and no definitive transcription is
possible."

Then it printed three different readings of those five seconds, side by side, and
refused to choose between them.

This is the story of 10.3 seconds of recorded voice, a hatch that could not open
against its own cabin pressure, a report the NASA Administrator said he had never
seen, and a Board that was honest enough to write down what it could not prove.

Everything on screen is a scanned page of the primary record — the Apollo 204 Review
Board report of 5 April 1967, and Senate Report 956. We do not play the fire audio,
and we do not read any of the three readings aloud as though it were the truth.

CHAPTERS
0:00 The line everyone knows
1:31 Act I — A test nobody called dangerous
4:17 Act II — Sixteen point seven
6:16 Act III — The hatch
9:04 Act IV — Ten point three seconds
12:43 Act V — The Board could not name the spark
16:29 Act VI — What Congress found in a drawer
19:58 Act VII — The hatch that opens against the pressure

SOURCES
• Report of Apollo 204 Review Board to the Administrator, NASA (NASA-TM-84105), 5 April 1967
• Apollo 204 Accident, Report of the Committee on Aeronautical and Space Sciences,
  United States Senate (Senate Report No. 956, 90th Congress), 30 January 1968
• NASA History Office, "Chariots for Apollo" (NASA SP-4205)
All footage and stills are NASA/US government public domain except where credited below.

IMAGE CREDIT
Launch Complex 34 memorial photograph — "Launch Complex 34: Apollo 1 Crew, in
Memoriam" via Wikimedia Commons, licensed CC BY-SA 2.0.

▶ MORE FROM MINDWIRED
• 21 Astronauts Never Came Home. Here's Every Story. → https://youtu.be/maxZwNGqIDU
• Every Astronaut Who Almost Died in Space → https://youtu.be/0ovoWoiRBXg
• The Lost Cosmonauts the USSR Pretended Never Existed → https://youtu.be/Hs6ZzZAQ7ms
• 8 People Sealed In. The Oxygen Kept Vanishing. → https://youtu.be/--sTmQzJtBk
• Documentaries playlist → https://www.youtube.com/playlist?list=PLSGw_l2_Tsdo
• Subscribe → https://www.youtube.com/@MINDWIREDD?sub_confirmation=1

#Apollo1 #NASA #SpaceHistory
```

#### TAGS
```
apollo 1, apollo 204, apollo 1 fire, gus grissom, ed white, roger chaffee, launch
complex 34, apollo 204 review board, nasa history, apollo program, spacecraft 012,
space disaster, 1967, nasa documentary, apollo 1 transcript
```

#### PINNED COMMENT (paste after upload, then pin)
```
The Board had the tape, and it had Bell Labs analyse it. Here is what it wrote about
the crew's second transmission:

"The entire second transmission is garbled and is, therefore, subject to wide variation
of interpretation as to content and as to who made the transmission and no definitive
transcription is possible."

Then it printed three readings and picked none of them. That is why this video doesn't
either.

Report of Apollo 204 Review Board, 5 April 1967, page 5-8.

(If this held you, the other eighteen are in 21 Astronauts Never Came Home:
https://youtu.be/maxZwNGqIDU)
```

#### SETTINGS
Category **Science & Technology** · Standard YouTube License · **Not made for kids** ·
upload the .srt as English captions · all 3 thumbnails into **Test & Compare**.

---

#### ⚠ THE ONE THING THAT IS NOT OPTIONAL
The description block above already contains the **CC BY-SA 2.0** credit for the
Launch Complex 34 memorial photograph. That is a **licence obligation**, not a
courtesy — if the description is trimmed, that line stays.

| # | Remaining | Who |
|---|---|---|
| 1 | Upload with the description above, captions attached | **human** |
| 2 | Test & Compare with all 3 thumbnails. Winner is decided on **watch-time share, not CTR** | human |
| 3 | Title test only AFTER the thumbnail test settles | human |
| 4 | 48h launch-diagnosis owed — **DIAGNOSIS DUE**, it gates the next topic pick | human |

---

## 🟡 RENDERED, NOT YET PUBLISHED

### thegrounding — "4,500 Planes Had to Land. There Was No Plan." (Black Box)
**Master landed and verified:** `out/thegrounding_gce.mp4`, 24:32, 4K, 3.39 GB.
**Package:** `METADATA-thegrounding.md` written 2026-09-13 (title, description,
chapters, tags, pinned comment all done).
**Visual pool:** 66 distinct assets across 112 scenes, heaviest at 3.6%.
**Known and accepted:** 16 scenes are pillarboxed from portrait sources. Akshay's call
2026-09-13 — "i dont want u to rework on the vid the grounding iots okay". Both root
causes are fixed for every future episode (a preflight portrait gate and a portrait
guard in the footage fetcher), so this cannot recur.

| # | Blocker | Who |
|---|---|---|
| 1 | **Thumbnails not built** — no concepts locked either | me |
| 2 | SRT off the master | me, 5 min |
| 3 | Human pulls still owed (in CLAIMS): the FAA's own 403'd pages, the Sliney MFR from NARA, Advisory 036, the NAV CANADA backgrounder | **human** |

---

## ✅ PUBLISHED 2026-09-13 (verified live)

| Date | Channel | Title as published | URL | Runtime |
|---|---|---|---|---|
| Sep 13 | Black Box | The Tapes That Broke NORAD's 9/11 Story | kl_rTye4ocA | 31:50 |
| Sep 13 | mindwired | 8 People Sealed In. The Oxygen Kept Vanishing. | --sTmQzJtBk | 37:53 |
| Sep 10 | Black Box | The 9/11 Air Files New York Kept Sealed for 25 Years | nPDC2r_m6ec | 16:42 |
| Sep 8 | mindwired | Nobody Has Ever Seen a Full-Grown Colossal Squid | N1ZlQpP5be4 | 35:40 |
| Aug 31 | mindwired | Project Hail Mary's Science Is More Real Than You Think | D9E-Opwl_HQ | 11:32 |

**noradtapes shipped on the ALTERNATE title** (ctr-engine 8.50) rather than the locked
primary ("We Have Some Planes." Nobody Knew What It Meant, 9.00). If it underperforms the
channel's 9/11 baseline, the title is the first variable to test — not the thumbnail.

### ⚠ Owed on the published set
1. **Nobody has ear-checked the four ACTUAL-labelled audio cuts** in the NORAD episode. I
   matched content against the printed transcript; that is not the same as listening.
   In-points are in `_evidence/noradtapes/SOURCES.md`. **This is the highest-stakes open
   item on the channel** — those clips carry an "ACTUAL FAA ATC RECORDING" label on screen.
2. **Two naming calls** left unresolved and currently written the conservative way: Colin
   Scoggins (named in the Commission's draft monograph, not the published report) and Larry
   Arnold (de-named pending a living-status check, though he is one of the two officers
   whose testimony was actually referred).
3. **CC-BY credit lines** must be pasted into the descriptions from the ATTRIBUTION.md
   files — a licence obligation, not a nicety.

---

## 🔴 THE DEBT THAT BLOCKS THE NEXT TOPIC PICK

**Three launches are past 48h with no Studio numbers, all under 200 views at last check:**
groundzeroair (Sep 10, 96), colossalsquid (Sep 8, 75), projecthailmary (Aug 31, 164).

Without impressions data nobody can say whether that is **topic demand** (small pool → the
fix is topic selection) or **packaging** (healthy pool, low CTR → the fix is ctr-engine).
Those are opposite prescriptions. icahn-validate Step 0 is supposed to block on exactly
this; I invoked the escape hatch to validate `thegrounding`, which is legitimate once and
corrosive twice.

**Needed from Akshay, per video:** days live · impressions · impressions CTR · average view
duration and average % viewed · the 0-60s curve shape · Test & Compare state. Compare
against MH370 (kRjhzp4Ho9k) for Black Box.

---

## 🟢 VALIDATED AND WAITING

**thegrounding** is the current build. Nothing else is validated and unbuilt — the queue's
older entries predate the current gates and would need re-validation, since ratios are
point-in-time (the Kola Superdeep lesson).

~~Worth noting for the wave calendar: the 25th-anniversary 9/11 wave that carried Building 7
and United 93 to the channel's #2 and #3 slots **is decaying**. Two 9/11 episodes are now
live into it and a third is rendering. The topic after this one should be a non-9/11
giant name, chosen off real launch data.~~

**⚠ CORRECTED 2026-09-14 — the wave is at CREST, not decaying.** The paragraph above was
inferred from this channel's own two launches, with no market sweep behind it. A live
yt-dlp sweep the next day (8 queries, 200 raw → 108 deduped) found three fresh uploads
days old and still climbing: SmartHER News 8,395,722 v / 79,800 subs (Sep 10), The World
History Channel 5,006,915 v / 278,000 subs (Sep 11), Bitesize Education 77,530 v / **135
subs** (Sep 7). A weak launch of ours is a CTR/packaging signal inside our pool; the sweep
measures the pool's size. They are different measurements and must not be conflated — see
LAUNCH-LESSONS.md 2026-09-14. **`sept11timeline` (the master minute-by-minute episode) is
validated PASS/extreme-class off that sweep and is the next Black Box topic; the crest is
perishable, so it ships fast.**

---

## HOUSEKEEPING

- **🔴 CHUNKED RENDERS DRIFT — chapters and SRTs must be MEASURED, not computed.**
  apollo1's master rendered 41,719 frames (1390.6s at 30fps) but runs 1398.7s, with
  every narration clip landing progressively later than `doctiming.py` predicts:
  +0.38s at the cold open, **+8.44s by the close**. Audio and video drift together so
  the video is fine; everything timed from the composition is not. **This is the real
  cause of the "gen_doc_srt.py drifted 19s" note banked on noradtapes** — the script
  was never wrong, the master just isn't the composition, and noradtapes shipped with
  captions up to 19s out because of it. Fix, for every chunked render:
  `scripts/align_srt_to_master.py <slug> <master.mp4> --out "<Title>.srt"`.
  **noradtapes and thegrounding were both chunked and both need re-timing** —
  noradtapes is already live with a drifting SRT.
- **⚠ MUSIC BEDS ARE NOT IN GIT.** `.gitignore` line 12 is `*.mp3`, so the eight
  `public/beds/bed_*.mp3` files have never been version-controlled. They were missing
  from this checkout entirely on 2026-09-13 and were recovered by copying from a second
  clone at `~/mindwired`. If that copy is ever cleared, the approved bed set is gone and
  has to be re-downloaded from the YouTube Audio Library by hand. Worth force-adding
  them (the thumbnails already get force-added past the same ignore).
- **⚠ `node_modules` was empty** on 2026-09-13; `npm install` restores it. Local
  `remotion still` silently fails with "could not determine executable to run" until
  it is.

- **Root directory litter:** `Warning.mp4`, `Men.mp4`, `Wrong.mp4`, `Proof..mp4`,
  `Quiet..mp4` and others — the mp4-filename-is-title rule appears to have truncated titles
  to their last word. Reconcile against the publish log and move shipped captions and
  thumbnails to `archive/`.
- **Three dead branches** — `gallant-mccarthy-9dbf53`, `zen-chebyshev-deba08`,
  `unruffled-haibt-ab5fb6` — each 124 commits behind main with content already on main.
  Safe to delete; a PR from any of them would revert months of work.
- **Open PRs:** #5 (noradtapes + biosphere2), #6 (groundzeroair), #7 and #8 (colossalsquid,
  overlapping — merge whichever is ahead, close the other). Everything since has been
  committed on the `claude/biosphere2-metadata` branch; **merging #5 is what makes main
  current**, and Akshay has asked for main-direct commits from here on.
- **✅ FIXED 2026-09-13 — the render script no longer deletes healthy renders**, and
  on-demand VMs now carry `--max-run-duration` + `--instance-termination-action=DELETE`.
  Expired gcloud credentials had produced three confident wrong diagnoses in one session
  ("NO CAPACITY anywhere on the ladder", "VM GONE — preempted", and a silent scp stall);
  the second one tried to delete a render sitting at 56% and only failed because the delete
  needed the same broken credentials.
- **✅ NEW — visual monotony is a blocking gate.** Any asset over 12% of scenes, or more
  than four back-to-back repeats, fails preflight. Run against the published noradtapes it
  fails the episode: one clip carried 32 of 123 scenes with 23 consecutive repeats.
  `scripts/slice_shots.py` cuts a long source into its distinct shots when a pool is thin.
