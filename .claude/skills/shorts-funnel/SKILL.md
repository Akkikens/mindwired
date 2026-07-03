---
name: shorts-funnel
description: Cut vertical Shorts from a Mindwired long-form (or plan standalone Shorts) that funnel viewers to the main videos and break the cold-start problem. Use when a long-form is finished, when the user wants more reach/subscribers fast, or asks about Shorts, TikTok, Reels, or growing a new channel. Shorts are how small channels get discovered; long-forms are how they get watch-time and revenue.
---

# Shorts Funnel — how a young channel actually breaks out

## The strategy (why this exists)
Long-forms get almost no reach on a young channel (the cold-start problem). **Shorts
bypass it** — the Shorts feed shows new creators to large audiences fast, because it
judges each Short on its own first-3-seconds performance, not channel authority. The
play:
1. Shorts pull in *new* viewers and subscribers at volume.
2. A pinned comment / end-card / the channel itself funnels them to the long-forms.
3. Long-form watch-time then builds the authority that makes long-forms get promoted.

Post **1 Short per day minimum**. Shorts are the top of the funnel; long-forms are the
destination. A channel stuck at <50 views almost always has no Shorts funnel.

## Two sources of Shorts

### A. Cut from an existing long-form (fastest)
The best 30-45 seconds of a finished video, re-framed vertical:
- Pick the single most **self-contained shocking beat** (one fact, one payoff). It must
  make sense with zero context — a stranger scrolling knows nothing about the video.
- The teaser/cold-open of most Mindwired long-forms is often already the best Short
  (e.g. Apollo's broken-switch open, the "hole in the universe" open).
- Structure: **hook (0-3s) → build → payoff/twist → soft CTA** ("full story on the
  channel"). Never explain slowly; a Short earns the next second every second.

### B. Standalone Short via the viral engine (`src/viral`)
For punchier, purpose-built Shorts use the existing engine (see `src/viral/README.md`):
plan JSON → `python3 scripts/build_short.py <slug>` → register in Root.tsx →
`npx remotion render Short<Name>`. This gives kinetic center-typography, tone-driven
motion, and a proper 9:16 format. Preferred for hooks that need on-screen text punch.

## Rules for Shorts that actually perform
- **First 3 seconds are everything** — even more than long-forms. Open on the visual
  payoff or the boldest claim. No intro, no wordmark, no logo (CLAUDE.md: shorts stay
  logo-free).
- **Vertical 1080×1920.** Text in the mobile-safe zone (not under the UI). Big, readable.
- **Loop-ability:** end so the last second flows into the first (drives replays, which
  the algorithm rewards heavily).
- **One idea only.** A Short that teaches one stunning fact beats one that rushes five.
- **Caption every word** (sound-off viewing is the default).
- **CTA is soft and specific:** "the full breakdown is on the channel" beats "subscribe".
  Put the long-form title in the pinned comment.

## Funnel mechanics (the part people skip)
- Pin a comment on each Short linking the matching long-form by title.
- Batch: from each long-form, cut **3-5 Shorts** (different beats) and drip them over a
  week — each is a fresh shot at the Shorts feed pointing at the same long-form.
- Name/theme them consistently so a viewer who likes one finds the series.
- Track which Short *topics* pop (not which videos) — double down on the beat types that
  travel, feed those back into long-form topic selection (Icahn loop).

## Deliver
When cutting from a long-form: identify the 3-5 strongest standalone beats with their
timestamps, write the vertical hook line for each, and note the pinned-comment funnel
text. When building standalone: produce the `src/viral` plan JSON per the engine README.

## Honesty guard
Shorts views are cheap and often don't convert to long-form watch-time or subs — a
million Short views can yield few subscribers. They are a *discovery* tool, not a vanity
metric. Judge them by subscribers gained and long-form click-through, not raw Short views.
Don't promise that Shorts = viral channel; they're the top of a slow funnel that still
needs good long-forms and packaging underneath.
