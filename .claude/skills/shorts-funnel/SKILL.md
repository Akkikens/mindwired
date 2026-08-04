---
name: shorts-funnel
description: Cut vertical Shorts from a Mindwired long-form (or plan standalone Shorts) that funnel viewers to the main videos and break the cold-start problem. Use when a long-form is finished, when the user wants more reach/subscribers fast, or asks about Shorts, TikTok, Reels, or growing a new channel. Every Short is a TRAILER for one named episode — never a generic factoid — and is judged on engaged views, never raw view counts.
---

# Shorts Funnel — episode trailers, not factoids

## The strategy (updated 2026-08 against current evidence)
Long-forms get almost no reach on a young channel (the cold-start problem). Shorts
bypass it — the Shorts feed judges each Short on its own first-3-seconds, not channel
authority. But the funnel's real mechanism is NOT the link (links convert <1-3%):
**it's topic continuity.** A Short about the Earhart radio log teaches the algorithm
exactly which viewers want that story; the long-form then gets pulled into those same
viewers' browse/suggested. The Short is a targeting instrument. That only works if
the Short is unmistakably a trailer for one specific episode.

Honesty notes from the case-study record: Shorts mattered in only a minority of
documented channel breakouts in this niche — the steady compounders (Fascinating
Horror) never used them, and the one spectacular Shorts rescue (Why Files, 25K→1M)
used broad meme-adjacent clips, which is the HIGH-VARIANCE play and only worked
because a 60-episode catalog existed to catch the spike. Trailer discipline is the
low-variance default; don't chase viral off-lane Shorts until the catalog is deep
(mixing formats/topics measurably hurt Science & Tech channels — −16% average in an
18K-channel study). Officially confirmed: Shorts cannot hurt long-form distribution
on the same channel — same-channel posting is correct.

## The spec (every Short)

- **A trailer for ONE named episode.** The Short's story IS the episode's story,
  cut to its single most arresting beat. Never a standalone factoid, never off-lane.
- **35-60 seconds of BODY.** The 3-minute expansion has shown no evidence of earning
  the runtime; 35-60s remains the data-backed sweet spot. Don't pad. Note: the comp
  patterns (MindwiredShort / BlackBoxShort) bake the channel's ~8-9s vertical
  subscribe outro on top of the body, per CLAUDE.md's mandatory-outro rule — never
  strip it; all loop/CTA rules below apply to the BODY, before the outro Sequence.
- **First 3 seconds rebuilt as a native vertical hook** — punch-in framing, the
  boldest claim or most striking real footage instantly, big mobile-safe caption.
  Never inherit the long-form's pacing; a long-form cold open is usually too slow
  for the feed by itself.
- **Built to loop:** end flows into the beginning (loops/replays are heavily
  rewarded). AND the ending opens a curiosity gap only the full episode resolves —
  "the full investigation is on the channel" beats "subscribe."
- **Set the related-video LINK** (the official Shorts→long-form link feature) on
  every Short + a verbal/text CTA in the final 5 seconds + pinned comment with the
  long-form link. Belt and suspenders — but remember the real funnel is topic
  continuity, not clicks.
- **Caption every word** (sound-off default), text inside the mobile-safe zone,
  no logos/wordmarks (Shorts stay logo-free per CLAUDE.md).
- Recycled long-form clips are fine as the BODY of the Short — the hook is what
  must be native-built. (No strong evidence recycled bodies underperform when the
  first 3s is purpose-made.)

## Metrics — what to judge Shorts on (changed March 2025)
Raw Shorts "views" are counted at first frame since 2025-03-31 and are inflated
noise. Judge on:
- **Engaged views** (the pre-2025 definition, still in Studio Advanced Mode) —
  this is also what YPP monetization counts.
- **"Stayed to watch" %** (Studio → Shorts feed report): target 70%+. Below that,
  the first 3 seconds failed — rebuild the hook, don't blame the topic.
- Subscribers gained + long-form views from Shorts viewers (Audience tab) — the
  actual funnel output.

## Funnel mechanics
- From each long-form cut **3-5 Shorts** (different beats), drip **1/day starting
  ~24h after the long-form** while the just-learned audience is warm. Never dump
  all on day one. Strongest hook first.
- Write the drip plan into `docs/publishing/SHORTS-SCHEDULE-<slug>.md` —
  publish-video schedules from that file; the audit found drips silently skipped
  when no schedule doc existed. One entry per Short, complete and paste-ready:
  ```
  ### SHORT <n> — <absolute date, derived from the channel's publish slot>
  COMP: <Remotion comp ID>          FILE: out/shorts_final/<comp>.mp4
  TITLE: <title w/ 3-5 hashtags inline or below>
  DESCRIPTION: <search-targeted description>
  TAGS: <~10-15 terms>
  PINNED: <pinned-comment text with the REAL long-form URL>
  RELATED-VIDEO LINK: <the long-form, set in Studio>
  ```
  (The pre-overhaul exemplar `SHORTS-SCHEDULE-nasaufofiles.md` uses the retired
  15-hashtag/500-char-tag format and relative Day-N dates — don't copy it; this
  template supersedes it.)
- Sensitivity rule: never cut a Short from a consolidated conspiracy-claims segment
  or any beat that only works with its full context (e.g. WTC collapse claims) —
  a de-contextualized 45s clip of a claim IS platforming it.
- Track which Short TOPICS pop and log them in `docs/planning/TOPIC-QUEUE.md` with
  their engaged-view numbers as a demand signal — icahn-validate Step 0 reads that
  file at the start of every validation, so that's where the loop actually lands.

## Two sources of Shorts
- **A. Cut from a finished long-form** (default): pick the most self-contained
  shocking beat; register `<Slug>Short1-4` comps (BlackBoxShort / MindwiredShort
  patterns in Root.tsx); render 1080×1920.
- **B. Standalone via the viral engine** (`src/viral`, see its README): for hooks
  that need kinetic center-typography. Same trailer rule applies — it must point at
  a specific episode.

## Honesty guard
A million Short views can yield near-zero subscribers — Shorts are a discovery and
targeting tool, not a vanity metric. Judge by engaged views, stayed-to-watch, subs
gained, and long-form lift. Don't promise that Shorts = viral channel; they
accelerate a channel whose long-forms and packaging already work, and they can't
rescue one whose don't.
