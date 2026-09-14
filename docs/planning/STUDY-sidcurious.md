# Channel study — @sid.curious (Siddharth Choudhary)

Pulled 2026-09-01 via `yt-dlp --flat-playlist` over `/@sid.curious/shorts`, plus
full `--dump-json` on 6 individual videos for the format spec. All numbers below
are point-in-time from that pull — re-pull before citing them in a later diagnosis.

## Why this channel matters

| | @sid.curious | mindwired |
|---|---|---|
| Opened | 2026-05-03 (4 months old) | long-running |
| Uploads | 72, **Shorts only** | ~25 long-form |
| Subs | 350,000 | — |
| Total views | 128,322,000 | — |
| **Median views/upload** | **1,200,000** | see LAUNCH-LESSONS publish log |
| Floor | only 2 of 72 below 300K | — |

Self-description: *"Exploring science from space to biology, one why at a time."*
That is mindwired's lane almost word for word. India-based; Instagram
`instagram.com/sid.curious`.

**The channel has no `videos` tab at all** — `yt-dlp` errors with "This channel
does not have a videos tab." 350K subs and 128M views in four months, entirely
from Shorts, with zero long-form. Relevant to CLAUDE.md's standing note that
subscriber growth is the channel's #1 problem.

## Verified format spec

Confirmed identical across all 6 videos sampled (7.9M, 7.1M, 7.0M, 6.5M, 5.5M, 1.6M):

- **2160 x 3840 (4K vertical), 30fps.** Not 1080x1920 — they master at 4K.
- **`language: hi`** — the narration is Hindi, with **English titles, English
  hashtags, and an English description**. Akshay's read: "proper narration."
- **Duration is NOT fixed**: 34s / 50s / 63s / 63s / 79s / 128s in the sample.
  Length follows the idea, it is not padded or cut to a 60s target.
- **The description is the complete English script**, 240-429 words, written as
  clean prose. This is doing double duty as the reach/SEO surface for a
  Hindi-narrated video — likely a large part of why English-language search and
  suggest still serve it.
- **Titles are declarative payoff lines, never questions**: "This is not a spider",
  "The animal that broke biology", "50 years of saving human lives", "It's not one
  creature", "Astronauts aren't floating. They're falling". The title states the
  twist; the video explains it. 4-5 CamelCase hashtags trail every title.
- One idea per Short — one organism, one object, one phenomenon. "One why."

## Content clusters, ranked by pull

1. **Deep ocean / marine biology — the dominant cluster.** Sea spider 7.1M,
   mantis shrimp 5.5M + 3.0M, anglerfish 4.3M, hadal zone 2.4M, octopus RNA 2.0M,
   thresher shark 1.9M, sea slug 1.7M, colossal squid 1.1M, bobbit worm 1.0M,
   blanket octopus, stargazer, scaly-foot snail, parrotfish, Greenland shark.
2. **Deep time / extinction.** Horseshoe crab 7.9M, Earth without humans 7.0M,
   Chicxulub 3.8M, the Great Dying 1.7M, tardigrade 1.1M.
3. **Cosmic scale.** "How big are you really" 6.5M, Voyager 1 4.1M, unfilmed
   Milky Way 2.5M, why space is dark 2.4M.
4. **Nuclear / lab-death forensics.** DEMON CORE 1.6M, Karen Wetterhahn 1.4M.
   Note this is Criminal-Record/Black-Box-adjacent material working in a science frame.

Overlap warning — mindwired has already shipped its own take on several of this
channel's biggest hits: Voyager ("NASA Built It to Last 5 Years. It's Been 49."),
the lunar rocket impact ("A Rocket Just Hit the Moon"), and the Fermi paradox.
Same topics, ~1.8M vs. our numbers. The gap is format and cadence, not subject.

## What is actually transferable

- The **deep-ocean cluster** is the single biggest proven demand pool here, and
  mindwired's lane was already widened on 2026-08-20 to cover earth/ocean
  mysteries. It is the obvious next lane to work — see the Mariana Trench entry
  at the top of TOPIC-QUEUE.md, validated the same day off the back of this study.
- The **declarative-payoff title grammar** is directly portable to ctr-engine.
- **4K vertical masters** — worth checking what `src/viral` currently renders at.
- The **full-script-in-description** habit costs nothing and is not currently a
  mindwired practice.

## What is NOT established

We have view counts, titles, durations, resolutions and descriptions. We have not
watched a single one of these Shorts. Akshay's read is that they look "perfect" —
the actual visual craft (footage sourcing, grade, typography, motion, whether the
footage is licensed stock, AI-generated, or scientific archive) is **unexamined**
and is the thing that would need a real teardown before copying anything visual.
