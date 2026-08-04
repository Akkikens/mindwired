---
name: launch-diagnosis
description: Diagnose why a published mindwired or Black Box Breakdown video is underperforming, using the channel's OWN baselines from YouTube Studio data the user pastes in. Use when the user asks "why no views", says a video flopped or died, wants to compare two videos' performance, or is deciding whether to change a thumbnail or move on. Diagnosis only — it hands off fixes: generating titles/thumbnails is ctr-engine, intro rewrites are hook-doctor, cutting Shorts is shorts-funnel. Produces exactly one diagnosis and one fix, and banks the lesson in docs/planning/LAUNCH-LESSONS.md.
---

# Launch Diagnosis — read the numbers before touching anything

## The one truth this skill exists for
On this channel, hits and flops show near-identical retention and same-band CTR — the
views gap comes almost entirely from the impressions pool. The Studio snapshot
(2026-07-26) that proved it — a SNAPSHOT, not a living baseline; always re-pull fresh
numbers per Step 0:

| Video | Impressions | CTR | Avg % viewed | Views |
|---|---|---|---|---|
| MH370 (channel's best) | 399.5K | 5.0% | 37.3% | 29K |
| Tenerife | 20.1K | 3.5% | 35.9% | 1.5K |

Retention within ~1.5 points, CTR in the same band (3.5% vs 5.0%) — yet a 20x difference
in views. The differentiator was the size of the impressions pool YouTube granted, and
that is a **topic-demand signal, not packaging**. Topics with pre-existing global name
recognition get big test pools: MH370, and astronauts dying — 21 Astronauts was at 56K
in the same snapshot (37.8K a few weeks earlier per docs/planning/DOCUMENTARY-PIVOT.md).
Historically-important-but-unrecognized topics (Tenerife) do not. At that snapshot,
every other long-form sat under 1.5K views. Diagnose against the channel's own winners —
never against universal benchmark numbers.

## Why this skill is structurally enforced now (2026-08)
The 2026-08-03 audit found this loop had NEVER closed — ~15 videos shipped,
LAUNCH-LESSONS.md didn't exist. Enforcement: **icahn-validate Step 0 refuses to
validate a new topic until the previous upload's diagnosis is banked here.** Every
upload buys a lesson only if this skill actually runs at 48h.

## Step 0 — get the real data (you CANNOT access YouTube Studio)
Ask the user to paste, from Studio → Content → the video → Reach + Engagement tabs:
1. Days live
2. Impressions
3. Impressions click-through rate
4. Average view duration AND average % viewed
5. The retention curve shape at 0-60s (the % still watching at ~0:30 and ~1:00, or a
   description: cliff / slope / flat)
6. **The same 5 numbers for the channel's best comparable video** (same channel, same
   format — e.g. MH370 for a Black Box long-form)
7. **The Test & Compare state** — which thumbnail variant is winning on watch-time
   share (or "test still running" / "no test was set up" — the latter is itself a
   launch-hygiene failure, see Step 1)
8. For Shorts: **engaged views + stayed-to-watch %**, never raw Shorts views (raw
   counts are first-frame-inflated since March 2025 and diagnose nothing)

Do not proceed on vibes. If a metric is missing, mark it unknown and say which branch of
the tree it blocks. Never invent or estimate a number the user didn't paste.
Context for reading the numbers: 3.5-5% blended CTR is statistically NORMAL, not
low (browse skews lower than search by design), and ~37% average-viewed on a
15-25 min doc sits in the "strong" 35-45% band — do not pathologize healthy
numbers; the pool size is usually the story. Satisfaction signals (surveys, "not
interested" taps) now formally outrank raw watch time in ranking — a video can die
from feeling baity even with fine CTR/retention.

## Step 1 — launch hygiene BEFORE blaming the content
Check these channel-specific facts first; if any failed, that IS the diagnosis — fix it
and re-observe before deeper surgery:
- **Is the video under 48h old?** Impressions are still settling. Say so plainly,
  diagnose nothing yet, and tell the user to re-run this skill at 48-72h (offer to
  create a scheduled reminder if they want one; the "done" condition is a dated
  `DIAGNOSIS DUE` line in LAUNCH-LESSONS.md, which publish-video step 7.1 should
  already have written at publish time). An under-48h upload does NOT block
  icahn-validate's Step 0 gate — validation proceeds, the diagnosis is owed before
  the NEXT publish.
- **Was the full metadata package applied?** `docs/metadata/METADATA-<slug>.md` must
  exist AND actually be live on the upload: SEO description with chapters and the
  "▶ MORE FROM" block, pinned comment, and the single-video end screen matching the
  verbal bridge. (Tags/hashtag counts are no longer diagnostic — near-worthless
  officially.)
- **Was a purpose-built thumbnail actually uploaded, with Test & Compare running
  on 3 variants?** Concepts-in-the-metadata-file ≠ a thumbnail. If the upload went
  out on an auto-frame or a hasty manual thumb with no test, that IS the
  launch-hygiene failure — build the 3 variants via ctr-engine and start the test
  on the LIVE video before diagnosing anything else.
- **Was the Shorts drip run?** 3-5 vertical Shorts (per the shorts-funnel skill),
  spaced ~24h apart starting the day after upload, each with the related-video
  link set and a pinned link to the long-form. A long-form with no drip never got
  its cold-start push.

## Step 2 — the decision tree (run IN ORDER, stop at the FIRST branch that fires)
All comparisons are against the channel's own winner from Step 0, never absolute numbers.

| # | Pattern (vs channel's own winner) | Diagnosis | The fix |
|---|---|---|---|
| a | Impressions pool an order of magnitude smaller, CTR + retention near-baseline | **TOPIC DEMAND** | Pick recognized topics; feed Icahn |
| b | Pool comparable, CTR clearly below the channel's own | **PACKAGING** | ctr-engine → swap thumb/title LIVE |
| c | CTR fine, retention cliff inside 0-60s | **INTRO** | hook-doctor, for the NEXT video |
| d | CTR fine, hook holds, mid-video bleed steeper than winners | **PACING** | Next script: re-hooks, scene variety |
| e | Everything within the channel's normal band | **NOTHING BROKEN** | More at-bats; say so honestly |

**(a) Topic demand — the common case on this channel.** Small pool + healthy CTR +
healthy retention means the viewers who saw it liked it; YouTube just found few viewers
to test it on. This is the MH370-vs-Tenerife pattern exactly. Repackaging will not fix
it — do NOT send it to ctr-engine. The fix lands on the NEXT topic: require pre-existing
global name recognition / search demand, validate via the Icahn method
(the icahn-validate skill), and update
`docs/planning/TOPIC-QUEUE.md`.

**(b) Packaging.** A normal-sized pool that doesn't click is the only branch where the
LIVE video gets touched: hand off to the **ctr-engine** skill, then swap the thumbnail
and/or title on the live upload (use Test & Compare where eligible).

**(c) Intro.** Clicks are fine but the first-60s curve falls off a cliff relative to the
winner's curve: hand off to **hook-doctor** — for the NEXT video's script. A live
long-form's intro can't be recut without a re-upload, which is almost never worth it.

**(d) Pacing.** Hook holds but the middle bleeds faster than the winners: note WHERE the
bleed starts, and apply to the next script — re-hook every 2-3 minutes with a tease
of a specific later reveal, strongest re-hook at the 55-65% runtime mark (per
hook-doctor; do NOT prescribe more cuts — the overstim meta is dead), chapter cards, vary
the scene every 1-2 lines, cut any segment that doesn't escalate.

**(e) All healthy.** Pool, CTR, and retention all in the channel's normal band: say so.
The honest answer is more at-bats on proven topics, not tinkering with this upload.

## Hard rules
- **ONE diagnosis, ONE fix.** Never a laundry list. If two branches look plausible, name
  the one earlier in the tree and say what data would separate them.
- **Never invent numbers.** Real pasted Studio data or "unknown" — nothing in between.
- **Never blame "the algorithm."** It pulls per-viewer on predicted satisfaction — it
  mirrors demand, it doesn't withhold. "The algorithm buried it" is banned phrasing.
- **A flop is data.** Every diagnosed video buys a lesson; the loop note (below) is how
  the channel keeps it.

## Output format (every run)
```
Diagnosis: <one line — which branch fired>
Evidence:  <the video's numbers vs the channel baseline, side by side>
The one fix: <one action — who does it, and whether it targets the LIVE video or the NEXT one>
Loop note: <one-line dated lesson>
```
Then append the loop note (date, slug, branch, lesson, T&C winner or n/a — all
five fields, matching that file's declared entry format) to
`docs/planning/LAUNCH-LESSONS.md` — create the file if it doesn't exist. Read that file
BEFORE diagnosing, too: if the same lesson has fired before, say so — a repeated lesson
is a process failure, not a video failure.

## What this skill will NOT do
Generate titles or thumbnails (ctr-engine), rewrite intros (hook-doctor), or cut Shorts
(shorts-funnel) — it hands off to those. For this repo's channels it supersedes the
third-party `lite-cge-launch-optimization` plugin skill (still installed in the
environment, but it has no channel baselines — never use it for mindwired/Black Box
videos). It also won't promise a rescue: if the topic had no demand, no amount of
post-hoc optimization creates it, and the skill says so.
