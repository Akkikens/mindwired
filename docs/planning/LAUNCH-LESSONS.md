# Launch Lessons — the loop that steers the next video

One dated line per diagnosed upload (launch-diagnosis skill appends here at 48h
post-publish). **icahn-validate Step 0 refuses to validate a new topic until the
previous upload's lesson is banked here** — that's the enforcement that keeps this
file alive. Read the newest lessons before every topic pick and every packaging run.
Escape hatches (no deadlocks): the pre-seeded 2026-08-03 audit lessons satisfy the
gate for the first post-overhaul run; an under-48h upload notes DIAGNOSIS DUE and
proceeds; no-human-available records BLOCKED-ON-DATA and proceeds.

## Publish slots (one-time call per channel — publish-video reads this; TBD rows: ask Akshay once)

| Channel | Slot (day + time, local) |
|---|---|
| Black Box Breakdown | TBD (observed de-facto: near-daily, mornings — Akshay to confirm a fixed slot or bless the daily cadence) |
| mindwired | TBD (same observation) |

## ⚠ CORRECTION — 2026-09-02: the title-stance thesis was overstated

The 2026-09-01 LONG-FORM DIAGNOSIS below cited Mindwired's Bermuda title as
"Is the BERMUDA TRIANGLE Story FAKE?" and argued a *debunk-stance* defect.
**That is not the live title.** Verified 2026-09-02 via yt-dlp:

| Live Mindwired title | Views | Runtime | @official-yesterday, same title |
|---|---|---|---|
| "Why is the Bermuda Triangle still killing people?" | **178** | 21.6 min | 1,333,269 |
| "Why the Mariana Trench Still Terrifies Scientists" | **195** | 7.8 min | 1,993,872 |

Both are **verbatim clones of YESTERDAY's titles**, and both flopped. So:

1. **Title stance was NOT the differentiator.** The strongest possible title, copied
   exactly, moved nothing. ctr-engine already says this — *"verbatim clones of big
   titles demonstrably flop on cold channels; riff, don't copy."* Now twice-evidenced
   on this channel's own uploads. **Keep that rule; drop the claim that the debunk
   phrasing caused the Bermuda result.**
2. **The length finding SURVIVES and is strengthened.** The Mariana pair is a clean
   controlled comparison: identical title, 7.8 min vs 32.2 min, 195 views vs 1.99M.
   Same words, same topic, same year — the variable left is runtime (plus channel
   authority and cadence).
3. **A cold channel cannot inherit a big channel's authority by wearing its words.**
   Copy the *format* (length, pacing, research depth); write your own title.

### And the framing correction that matters most
Akshay's read was "my views are down". **They are not.** July median 191 on 26
uploads; August median 158 on 16. Flat. The channel's real baseline has always been
100-400/video. What happened is that ONE video — "21 ASTRONAUTS Never Came Home",
2026-07-12, **79,680 views** — is ~90% of all channel views ever, and every upload
since is being measured against an outlier. There was no decline to explain.
The real defect is **42 documentaries published in two months**.

## DIAGNOSIS — projecthailmary (mindwired), banked 2026-09-02 — FIRST REAL STUDIO DATA

Published **2026-08-31**. Numbers as reported by Akshay from Studio, ~2 days post-publish.
**This closes the BLOCKED-ON-DATA state open since 2026-08-26.**

| Metric | This video | Channel/industry benchmark | Read |
|---|---|---|---|
| Views (~48h) | **86** | Mindwired median lifetime 169 | on pace for "typical" |
| **Runtime (derived)** | **~11.5 min** (196s AVD ÷ 28.4%) | **35-40 min target** | **less than a third of target** |
| AVD | 3:16 (**28.4%**) | 35-45% "strong" band | **BELOW the band** |
| CTR | **1.8%** | 3.5-5% is *statistically normal* | **HALF of normal** |
| Likes / comments | 1 / 0 | — | no engagement signal |

### The trap in the report Akshay was given
The analytics summary says the video is *"matching the typical performance for your
channel across its core metrics."* **That is the finding, not the reassurance.**
Typical for this channel is a 169-view median and a catalogue where one video holds
90% of all views ever. Matching typical IS the failure mode. Any diagnosis that
grades a video against this channel's own average will always say "fine".

### What it actually confirms
1. **The length diagnosis holds.** 11.5 minutes → 86 views. The 2026-09-01 LONG-FORM
   DIAGNOSIS above predicted exactly this: @official-yesterday's 31-43 min uploads
   median 383,507 views; Mindwired's 13m43s median → 169. This is another data point
   on the same line, and it is the channel's most recent upload.
2. **AVD is NOT "consistent with typical" in the way that matters.** 28.4% sits below
   the 35-45% strong band the hook-doctor skill cites — and below the ~37% this
   channel has hit before. So retention is soft *as well as* short.
3. **CTR 1.8% is the real alarm.** launch-diagnosis says 3.5-5% blended is normal.
   1.8% is half that. Packaging underperformed, and it is the one lever fully under
   our control.
4. **Title stance, again.** "Project Hail Mary's Science Is More Real Than You Think"
   **resolves its own question in the title** — it tells you the answer (it's real)
   before the click. Same defect as the Bermuda debunk title (176 views). The
   2026-09-01 title-stance rule stands and is now twice-evidenced.

### Actions carried into the next episode (colossalsquid, in render 2026-09-02)
- **35.2 min**, not 11.5. ✅ already built that way.
- Title **"Nobody Has Ever Seen a Full-Grown Colossal Squid"** — states an absence,
  resolves nothing, and stays literally true. ✅
- Thumbnail: **zero text**, one unidentifiable focal object (the arm hooks). Directly
  targets the 1.8% CTR problem. ✅ — and it must ship as a real image FILE, not a
  concept (the 2026-08-03 audit defect).
- **Pinned comment must ask a real question.** 0 comments on a hard-science deep dive
  is a discovery drag. For colossalsquid the natural one: *no adult has ever been
  seen — do you think that's because they avoid our lights, or because we've been
  looking in the wrong place?* That is a genuine open scientific dispute, not
  engagement-bait.
- **Single-video end screen at the verbal bridge.** The colossalsquid script's bridge
  names "21 Astronauts Never Came Home" explicitly; place the end screen there.

### Owed
- 48h re-pull for projecthailmary once it is past the window (impressions count,
  traffic-source split) — the above is a 2-day snapshot, not a settled diagnosis.
- Same for colossalsquid 48h after publish. **Do not queue another render until that
  diagnosis is banked** (doc-episode Step 2 item 6 cadence rule).

## LONG-FORM DIAGNOSIS — 2026-09-01 (Akshay: "I WANT HIGH VIEWS LONG FORMS")

Public `yt-dlp --dump-json` pull of Mindwired's full 43-upload long-form catalogue
against the small-channel long-form breakouts surfaced in the same day's Icahn
sweeps. **This is the most actionable finding banked in this file. Read it before
planning another episode.**

### The head-to-head that removes topic from the argument

Two topics Mindwired and @official-yesterday BOTH covered, same lane, same year:

| Topic | Mindwired | YESTERDAY |
|---|---|---|
| **Bermuda Triangle** | "Is the BERMUDA TRIANGLE Story FAKE?" — **21m34s → 176 views** | "Why is the Bermuda Triangle still killing people?" — **34m29s → 1,333,269 views** |
| **Mariana Trench** | "The Place on Earth Scarier Than Space" — **7m51s → 195 views** | "Why the Mariana Trench Still Terrifies Scientists" — **32m22s → 1,993,872 views** |

Same subjects. ~7,600x and ~10,200x. The topic gate was never the thing that
failed on these two — icahn-validate passed both, correctly. What differs is
length, cadence, and title stance.

### Finding 1 — length. The winners in this lane make 35-40 minute documentaries.

| | Mindwired | YESTERDAY | BlackWater |
|---|---|---|---|
| Subs | 1,320 | 103,000 | 32,300 |
| Uploads | 43 | 19 | 5 |
| **Median duration** | **13m43s** | **38m24s** | **15m36s** |
| Duration spread | 3m - 115m, all over | **31m - 43m, every single one** | 13m - 17m |
| **Median views** | **169** | **383,507** | **470,643** |

YESTERDAY has **zero uploads under 20 minutes** across 19 videos. Not one.
Mindwired has 19 of 43 under 12 minutes.

**Mindwired's own catalogue already says this.** Its single hit — "21 ASTRONAUTS
Never Came Home", 79,672 views, 90% of all channel views ever — is **49m11s**, the
longest real documentary on the channel. The #2 video is 778 views at 21m57s. The
channel has already run this experiment once and won it.

### Finding 2 — cadence. 42 uploads in two months is actively harmful.

Mindwired uploads by month: **2026-06: 1, 2026-07: 26, 2026-08: 16.**
YESTERDAY: **19 uploads across 9 months** (~1 per 2-3 weeks), median 383,507.

Twenty-six long-form documentaries in a single month is a content-farm signature.
It splits every test pool, and it teaches the algorithm the channel produces
low-engagement content. A 35-minute documentary cannot be made well at that rate,
and the catalogue shows it: the July burst is where the 100-and-200-view videos
cluster.

### Finding 3 — title stance. Do not debunk. Debunking answers the question.

Mindwired's Bermuda title — "Is the BERMUDA TRIANGLE Story FAKE?" — and its caption
file "The Bermuda Triangle Isn't Real. Here's Proof." both **resolve the mystery in
the title**. A viewer who reads "it's fake" has no reason left to click.
YESTERDAY's — "Why is the Bermuda Triangle **still killing people?**" — presupposes
the mystery, and promises an answer it withholds. Same grammar on the trench:
"Why the Mariana Trench **Still Terrifies Scientists**."

Every YESTERDAY title takes an unresolved stance. This is a ctr-engine constraint
now: **the title may not settle the question the video exists to ask.**

### The prescription

1. **35-40 minutes, or don't ship it.** Kill the 7-12 minute format for this channel.
2. **One episode every 2-3 weeks.** Stop the burst uploads.
3. **Unresolved-stance titles.** No debunks, no "is it fake", no "here is proof".
4. Keep icahn-validate exactly as it is — it was never the broken part.

### Caveat
Public view counts only; no impressions/CTR/retention. The Studio numbers owed
since 2026-08-26 would confirm whether the short videos also died on retention or
were never served at all. The length correlation is strong and internally
corroborated, but it is correlation.

## PUBLIC-DATA DIAGNOSIS — 2026-09-01 (partial; supersedes nothing, still owes Studio numbers)

Triggered by Akshay: "why our videos arent getting any views man". Full public
pull via `yt-dlp --dump-json` over every tab of all four channels, 2026-09-01.
These are PUBLIC view counts only — no impressions, CTR or retention, so this is
a diagnosis of *distribution shape*, not of packaging. The Studio numbers owed
since the 2026-08-26 BLOCKED-ON-DATA entry are still owed.

| Channel | Subs | Long-form | LF total views | LF median | Shorts | Shorts total | Shorts median |
|---|---|---|---|---|---|---|---|
| Mindwired (@mindwiredd) | 1,320 | 43 | 88,849 | **169** | 75 | **948** | **6** |
| Black Box Breakdown | 781 | 27 | 61,020 | 549 | 19 | 5,082 | 202 |
| Criminal Record | — | 3 | — | — | 0 | — | — |
| DimaagBatti | 87 | 12 | 623 | — | 2 | 623 | — |
| *(reference)* **@sid.curious** | **350,000** | **0** | — | — | **72** | **128,322,000** | **1,200,000** |

### Finding 1 — both channels are single-hit channels
Mindwired: "21 ASTRONAUTS Never Came Home" = 79,672 of 88,849 total = **90% of all
channel views in one video**. The other 42 long-forms share 9,177 views.
Black Box: MH370 = 40,257 of 61,020 = **66%**. The other 26 share 20,763.
Two videos out of 70 have ever worked. This is consistent with icahn-validate's
founding thesis (topic demand sizes the pool) and with the fact that the gate only
started existing partway through — most of this catalogue predates it.

### Finding 2 — the Shorts operation is the emergency, and it is not close
**75 Shorts → 948 total views. Median 6.** Not 6 thousand. Six. Twenty-nine of them
are under 10 views. At that level YouTube is not testing the video at all — that is
a delivery-shaped number, not a quality-shaped one.
Against the reference: @sid.curious published **72 Shorts** — within three of the
same count — and took **128,322,000** views, median 1,200,000, floor ~300K, in four
months from a standing start. Same upload count, ~135,000x the total.
CLAUDE.md already names subscriber growth as the #1 problem and shorts-funnel as
the answer to it. The funnel has now had 75 attempts and returns 6 views a piece.

### Finding 3 — what differs, honestly scoped
Established from the data:
- **Master format.** sid.curious masters at 2160x3840 (4K vertical) 30fps. What
  `src/viral` currently outputs has NOT been checked — do that.
- **Shorts as product vs. Shorts as offcut.** Every mindwired Short maps to a
  shipped long-form (Green Boots, the USSR man, the space sounds, Laika). They are
  trailers. Every sid.curious Short is a self-contained idea that resolves inside
  itself. The Shorts feed does not reward trailers for your other video.
- **Lane coherence.** Mindwired's Shorts mix Everest, Soviet space dogs, a Navy
  jet UAP, a space cat. sid.curious does one thing: one science "why". This is the
  same mixed-identity failure CLAUDE.md already diagnosed when it parked the
  gaming/tech lane — it is now visibly repeating inside the Shorts feed.

**NOT established, and it may dominate everything above:** nobody has watched a
single sid.curious Short. Akshay's read is that they look "perfect." The actual
visual craft — footage sourcing, grade, typography, motion, cut rhythm, the first
1.5 seconds — is completely unexamined. Do not rebuild anything visual off this
diagnosis alone.

**Mechanical check owed first:** before treating 6-view Shorts as a creative
problem, verify the uploads are actually public, correctly 9:16, have audio, and
are not age-gated or flagged. A number that low deserves that check first.

## BLOCKED-ON-DATA — 2026-08-26

Most recent Black Box upload (Swissair 111, TXgg2Qy1Oa0, published ~2026-08-25)
is now >48h old and owes a launch-diagnosis, but this session has no YouTube
Studio access (only public view/like counts via yt-dlp, no CTR/retention/
Impressions data). Per Step 0's escape hatch (c): recording BLOCKED-ON-DATA
and proceeding with icahn-validate rather than stalling. Real diagnosis still
owed once Akshay can share Studio numbers.

## Publish log (publish-video appends `title · URL · publish date` per upload —
this table defines "the channel's most recent upload" for the loop gates;
"upload" = published on YouTube, never merely rendered)

**Backfilled 2026-08-03 directly from YouTube Studio (both channels' Content lists,
read via Akshay's browser). Views are point-in-time snapshots from that read.**

| Date | Channel | Title | URL (watch?v=) | Views @03 Aug |
|---|---|---|---|---|
| Aug 3 | Black Box | (UNLISTED DRAFT — What Really Brought Down BUILDING 7 ? — no description yet, awaiting Akshay's sensitivity watch-through) | wp8t2gOKYyE | 0 |
| Aug 3 | Black Box | They Had AMELIA EARHART's RADIO Log. They Never Had Her BODY. | 998g3UmVjKw | 30 |
| Aug 3 | mindwired | The Biggest EXPLOSION in HISTORY Left No Crater | 9YOOCyi6oqk | 10 |
| Aug 2 | Black Box | MH370: What the NETFLIX Documentary Didn't Tell You | Bee3SE4WEg0 | 394 |
| Aug 2 | mindwired | The Government's REAL UFO Files | nlhdw6buxzs | 45 |
| Aug 1 | Black Box | MIRACLE on the Hudson: He Thought They All DIED US1549 | nTDjKSrQNpY | 439 |
| Aug 1 | mindwired | INSIDE $150 Billion SPACE STATION Before It's DESTROYED | fgbRaGhuNEg | 79 |
| Jul 31 | Black Box | The Plane That Flew Itself for Three Hours (Helios 522) | 0tT8C6v1Sj0 | 169 |
| Jul 31 | mindwired | Astronauts Were Asked What Scared Them Most in Space | cj1JAMa1Y0w | 59 |
| Jul 30 | mindwired | Real Space Facts to Fall Asleep To | DM9_CEWjDt0 | 52 |
| Jul 29 | Black Box | 520 DEAD The DEADLIEST Plane Crash in History - Japan Airlines 123 | aRLDo-7-GQA | 504 |
| Jul 29 | mindwired | The Strangest Space Mystery Nobody Has Ever Solved (Ranked) | IcFzgwNfhiY | 70 |
| Jul 28 | Black Box | Titanic: The Verdict Two Governments Couldn't Agree On | mh6AIUhYftc | 71 |
| Jul 27 | mindwired | What HBO's Chernobyl Didn't Show You | sv66ViWyvbQ | 92 |
| Jul 26 | Black Box | What the Cockpit Recorder on United 93 Actually Captured | wsFhuwUjg_4 | 641 |
| Jul 26 | mindwired | 8 Real Planets So Hostile They Shouldn't Exist (Ranked) | hG2hA7XAkjY | 194 |
| Jul 25 | Black Box | AI171 FINAL REPORT Still Hasn't ANSWERED | M_pfBvrauKE | 301 |
| Jul 25 | mindwired | The Man Who Sold the Moon And Got Away With It | 8i_eF1wCmp0 | 132 |
| Jul 24 | Black Box | The Rise and Fall of Concorde | q_yY42_yDRA | 459 |
| Jul 24 | mindwired | IGNORED Every WARNING OceanGate The Billionaire Sub | pVgG5FhKNoY | 358 |
| Jul 22 | mindwired | How 200,000 People Fell for the Mars One Scam | fpCfIg2uQmA | 256 |
| Jul 21 | Black Box | What's Actually Inside a Black Box? | zP9seHMB8qc | 618 |
| Jul 21 | Black Box | Two 747s. One Runway. The Deadliest Crash Ever. (Tenerife) | n99qUg5BNYw | 2,386 |
| Jul 20 | mindwired | 32 Astronauts Almost DIED In Space! | 0ovoWoiRBXg | 707 |
| Jul 19 | Black Box | What Really Happened to MH370? Every Theory, Tested | IyHKrZvLRWA | 2,669 |
| Jul 17 | Black Box | MH370: Only Plane World Couldn't Find! 12 Years & Found NOTHING | kRjhzp4Ho9k | **37,722** |
| Jul 15 | Black Box | Air France 447 Fell for 3 Minutes And Nobody Knew Why | ZvD4n8uNnuk | 1,779 |
| Jul 14 | Black Box | Colgan Air 3407 Too Tired to Fly | (see memory) | 837 |
| Jul 13 | Black Box | How Boeing Killed 346 People (The 737 MAX Disaster) | d4_Rk50GkBg | 807 |
| Jul 11 | mindwired | 21 ASTRONAUTS Never Came Home! Here's Every Story. | maxZwNGqIDU | **68,760** |
(older mindwired uploads Jul 1-17 range 29-615 views — full list in Studio; two GTA videos + Chernobyl live on mindwired = historical lane-mixing, now parked)

Format per entry:
`- YYYY-MM-DD · <slug> · branch=<a|b|c|d|e> · <one-line lesson> · T&C winner: <thumb variant/pattern or n/a>`

## Standing lessons (from the 2026-08-03 growth-research audit, pre-seeded)

- 2026-08-03 · (channel-wide) · branch=a · Hits vs flops differ on impressions-pool
  size, not CTR/retention — topic recognition + package appeal set the pool; keep
  validating demand AND package before production. · T&C winner: n/a
- 2026-08-03 · (channel-wide) · process · **CORRECTED after reading Studio
  directly:** the repo pipeline ships no thumbnail files, but Akshay DOES build
  thumbnails + run A/B tests at upload (tests live on nearly every video, title
  tests included). Refined lesson: packaging happens ad-hoc outside the repo —
  the skills' job is to PRODUCE the 3 variants + title alternates so Akshay's
  tests start from data-backed candidates instead of improvised ones.
  · T&C winner: n/a
- 2026-08-03 · (channel-wide) · process · **CORRECTED after reading Studio
  directly:** there was no publish backlog — Akshay published near-daily on both
  channels through July; the published-URLs memories were simply ~2 weeks stale.
  Only ONE unpublished item exists (WTC/Building 7, unlisted, no description,
  awaiting the sensitivity watch-through). Standing fix: publish-video step 7.1
  keeps this file's Publish log current so gates never run on stale memory again.
  · T&C winner: n/a

## Lessons

- 2026-08-03 · us1549 · a+b mixed (interim, ~2.5 days live, title test running) ·
  Pool 14.3K impressions (28x under the MH370 baseline's 399.5K), CTR 2.2% (below
  the winner's 5.0%), AVD 4:47 on 12:29 = 38% healthy, 84.7% suggested traffic.
  Reads as topic-demand ceiling + packaging drag together. The in-flight title
  test has a clear leader: "The Real Radio Call Behind the MIRACLE on the Hudson"
  at 43.9% watch-time share vs 31.7% (current) — REAL-AUDIO framing beats
  drama framing on this channel; adopt the leader when the test settles and lead
  future Black Box packaging with the Evidence Engine signature. · T&C winner:
  pending ("Radio Call" leading)
- 2026-08-03 · issinside · a (interim, ~2.5 days live) · Pool only 2.9K
  impressions, CTR 1.5%, AVD 6:34 on 15:59 = 41% healthy; end screens drive
  17.7% of views (single-video end-screen funnel works). The bare "$150B ISS"
  framing was pre-flagged as a dead copycat wave at validation — tiny pool
  confirms it; the differentiated-depth condition didn't rescue demand. Feed to
  icahn-validate: saturation warnings deserve more weight. · T&C winner:
  insufficient data yet
- DIAGNOSIS DUE 2026-08-05: earhart (BB), tunguska (MW), mh370netflix (BB),
  nasaufofiles (MW) — all under 48h at backfill time.
- BLOCKED-ON-DATA 2026-08-06: threemileisland (BB) doc-episode kickoff — no live
  Studio access in this session to pull real numbers for the still-due earhart/
  tunguska/mh370netflix/nasaufofiles diagnoses. Per icahn-validate/doc-episode's
  own escape hatch (no-human-available → record and proceed), TMI production
  starts without re-blocking on this. Diagnoses remain owed before the NEXT
  publish after TMI.
- BLOCKED-ON-DATA 2026-08-07 · channel-wide · branch=a (low-confidence, view-counts
  only — Akshay declined to pull fresh impressions/CTR/retention) · Akshay reports
  "no views at all" across the board; view-count log confirms only 2 outliers
  (21 Astronauts 68.7K, MH370 37.7K, both global-recognition topics) against ~25
  other videos mostly under 800 views — restates the channel's own standing
  lesson (pool size = topic recognition, not quality). Titanic (71 views) is a
  genuine anomaly worth a real Studio pull if revisited — a globally-famous name
  landing near the bottom doesn't fit the pattern and may be branch (b) on that
  one video specifically. Real impressions/CTR/retention numbers still owed for
  earhart/tunguska/mh370netflix/nasaufofiles AND this channel-wide read — this is
  a directional read, not a confirmed diagnosis. · T&C winner: n/a
- 2026-08-07 · tunguska (MW) · branch=a (confirmed, real Studio pull via logged-in
  Chrome) · 4 days live: 2.7K impressions / 1.7% CTR / 82 views / 7:05 avg view
  duration (~42% avg-viewed, healthy retention) vs MH370 baseline 399.5K
  impressions / 5.0% CTR / 29K views — ~150x smaller impressions pool is the
  whole gap; CTR is secondary (also below the 3.5-5% normal band, worth a look
  later but would not rescue a pool this small). Confirms topic-demand is the
  dominant signal, not packaging — do not touch this video's thumb/title. Fix
  targets the NEXT topic pick via icahn-validate (name-recognition bar). ·
  T&C winner: insufficient data yet (pool too small)
- DIAGNOSIS DUE 2026-08-09: area51 (MW, published Aug 7, 14 impressions at pull
  time — too fresh to read) and spacexlunarimpact/"A Rocket Just Hit the Moon"
  (MW, published Aug 6, 1.1K impressions / 2.5% CTR / 57 views at pull time —
  still under 48h). Re-pull Reach tab numbers once both clear 48-72h live.
- BLOCKED-ON-DATA 2026-08-09 · channel-wide · no live Studio/browser access in
  this session to pull real Reach-tab numbers for the still-owed area51/
  spacexlunarimpact diagnoses. Per icahn-validate Step 0's own escape hatch
  (no-human-available → record and proceed), betelgeuse validation proceeds
  without re-blocking on this. Diagnoses remain owed before the NEXT publish
  after betelgeuse.
- 2026-08-10 · voyager1 (MW) · branch=a (confirmed, real Studio pull via logged-in
  Chrome, ~45h live) · 6.7K impressions / 1.0% CTR / 117 views / 8:23 avg (~28%
  avg-viewed, mid-normal) vs 21-Astronauts baseline 923.3K impressions / 4.2% CTR
  / 71.2K views / 20:00 avg (~41%) — impressions pool ~138x smaller is the story;
  CTR is also below band but the video is still inside the 48h settling window
  AND has a live 3-way title A/B test splitting the sample (currently "VOYAGER 1
  Is Losing Power It Can Never Get Back" leading at 46.7% watch-time share vs
  incumbent 35% and 2nd alt 18.4%, 12 days left) — do not read the CTR number as
  final yet. **This is the SECOND real-data confirmation of the exact branch-a
  pattern (tunguska, 2026-08-07, was the first) — a repeated lesson is a process
  failure, not a video failure: the fix has to land on topic-recognition
  discipline at icahn-validate time, not be re-logged per-video again.** ·
  T&C winner: title test still running (see above), thumbnail test insufficient
  data.
- 2026-08-10 · channel-wide Shorts · NOT branch (a)-(e), a distinct finding —
  Shorts are getting near-zero reach, not just a small pool: 26 Shorts published
  in the last 28 days, 509 total views combined (most individual Shorts sit at
  5-13 views, a few outliers to 41-43). This is far below even the long-form
  topic-demand floor — Shorts aren't being tested by the algorithm at meaningful
  volume at all, which is a distinct problem from "the topic is niche." Making
  MORE Shorts before diagnosing why the existing 26 aren't being shown is very
  likely to repeat the same zero-reach result. Also spotted in Studio: a "Balance
  exhausted" Google Ads promotion banner on the channel — worth checking whether
  paid promotion recently stopped and how much of recent traffic depended on it.
  Needs its own real diagnosis pass (per-Short Reach-tab pull) before the next
  Shorts batch — not done in this session, flagged for follow-up.
- BLOCKED-ON-DATA 2026-08-12 · channel-wide · no live Studio/browser access in
  this session to pull real Reach-tab numbers for yellowstone (MW) and
  deepwaterhorizon/ic814kandahar (BB), all shipped since the voyager1 diagnosis
  on 2026-08-10. Per icahn-validate Step 0's own escape hatch (no-human-available
  → record and proceed), this session's discovery sweep (real-photo/real-data
  tragedy topics adjacent to 21 Astronauts) proceeds without re-blocking on this.
  Diagnoses remain owed before the next publish.
- DIAGNOSIS DUE 2026-08-14ish: everestbodies (MW) — "They Called Him Green
  Boots. He Wasn't." — published 2026-08-12 (today), under 48h at this point.
  Also still owed: yellowstone/deepwaterhorizon/ic814kandahar (above). Separately,
  a real per-Short Reach-tab diagnosis (impressions, not just views) for the
  channel-wide near-zero-Shorts-reach finding (2026-08-10, 26 Shorts/509 total
  views) was requested this session but blocked — Claude in Chrome not connected,
  Akshay asked to paste numbers or connect the extension; still outstanding.
  Per Step 0's escape hatch, this session's next-topic icahn-validate sweep
  proceeds without re-blocking on any of the above.
- BLOCKED-ON-DATA 2026-08-14 · channel-wide · Black Box next-topic icahn sweep
  (this session) proceeds under Step 0's escape hatch: still no Studio/browser
  access for the owed diagnoses (everestbodies ~48h; yellowstone /
  deepwaterhorizon / ic814kandahar; the per-Short Reach-tab pull). All remain
  owed before the next publish.
- BLOCKED-ON-DATA 2026-08-16 · channel-wide · mindwired next-topic icahn sweep
  (this session, post-Venera/Ötzi) proceeds under Step 0's escape hatch: no
  Studio/browser access for the owed diagnoses (kursk PUBLISHED per Akshay
  confirmation this session — diagnosis still owed; otzi/venera not yet
  published so no diagnosis due yet). Everestbodies/yellowstone/
  deepwaterhorizon/ic814kandahar diagnoses from prior sessions also remain
  owed. All still owed before the channel's next publish-plus-48h checkpoint.
- BLOCKED-ON-DATA 2026-08-20 · channel-wide · Bermuda Triangle production
  (mindwired, widened ocean/earth-mystery scope — see memory
  `yesterday-channel-study`) proceeds under Step 0's escape hatch: this
  session DOES have live Claude-in-Chrome/Studio access (used it earlier to
  edit channel settings), but a full real-Studio diagnosis pull for the ~9
  owed videos (everestbodies/yellowstone/deepwaterhorizon/ic814kandahar/
  kursk/otzi/venera/carlawalker/dbcooper) is a separate, large task from
  producing this episode — deferred rather than blocking production, per the
  same escape-hatch pattern already used repeatedly in this file. Note for
  next diagnosis session: the channel's own repeated lesson (topic
  name-recognition drives the impressions pool far more than packaging/CTR)
  is exactly why Bermuda Triangle was picked — globally famous name, unlike
  Voyager 1/Tunguska which got small pools despite strong ratios.
- BLOCKED-ON-DATA 2026-08-21 · channel-wide · Thai Cave Rescue production
  (mindwired) proceeds under Step 0's escape hatch: the owed-diagnosis
  backlog (everestbodies/yellowstone/deepwaterhorizon/ic814kandahar/kursk/
  otzi/venera/carlawalker/dbcooper/bermudatriangle/fermiparadox — the last
  two not yet published, so no diagnosis due on those two specifically) is
  unchanged from the 2026-08-20 entry above; still no dedicated
  diagnosis-pull session run. Production proceeds per the same repeated
  pattern in this file. Separately: Akshay initially asked to use CNN/NBC/DW
  broadcast footage "with sourcing" for this episode — declined (attribution
  is not a license, Content ID doesn't check for credit lines); redirected
  to the confirmed-legal DVIDS US-military PD footage of the actual 2018
  on-site pararescue team instead. Not a launch lesson per se, but worth
  banking here since it's a real recurring misconception risk for future
  episodes too.
- BLOCKED-ON-DATA 2026-08-21 (2nd) · channel-wide · Black Box Breakdown
  aviation next-topic icahn sweep (this session, separate request from Thai
  Cave Rescue above) proceeds under the same Step 0 escape hatch — no live
  Studio/browser access this session; owed-diagnosis backlog unchanged.
  Akshay again asked for CNN/NBC-sourced footage "with proper credit" —
  declined again, same reasoning (attribution ≠ license, Content ID doesn't
  check credit lines); redirected to NTSB/FAA docket + DVIDS/archive.org/PD
  sourcing per CLAUDE.md's real-footage-first pipeline. Second occurrence of
  this exact misconception in one day — consider flagging it more visibly
  (e.g. a standing note Akshay sees before requesting footage) if it recurs
  again.
