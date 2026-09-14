# PUBLISHABLE — what is finished, what is blocking it

Updated 2026-09-13 15:20 from actual repo and channel state, verified with yt-dlp and
ffprobe rather than memory. Keep it current: `publish-video` updates the row it ships,
`doc-episode` adds a row when a master lands.

**The backlog the 2026-08 audit flagged is gone.** Everything that was rendered-and-sitting
went live on 2026-09-13. What follows is the one episode still in flight, then the debts
the loop is carrying.

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

Worth noting for the wave calendar: the 25th-anniversary 9/11 wave that carried Building 7
and United 93 to the channel's #2 and #3 slots **is decaying**. Two 9/11 episodes are now
live into it and a third is rendering. The topic after this one should be a non-9/11
giant name, chosen off real launch data.

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
