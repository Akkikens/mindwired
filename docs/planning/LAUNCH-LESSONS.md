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
