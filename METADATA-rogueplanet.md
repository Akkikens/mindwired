# Metadata — A Rogue Planet Enters Our Solar System

Mindwired #5 · cinematic cosmic-horror explainer · 16:9 · ~7min38s (+ subscribe outro)

## Titles

**Primary:**
A Rogue Planet Enters Our Solar System… Then Earth Changes Forever

**A/B alternates:**
- A Rogue Planet Is Coming — And We Wouldn't See It Until It's Too Late
- What If a Rogue Planet Drifted Into Our Solar System?
- The Invisible Planet That Could End Life on Earth Without Touching It
- A Dark Planet Is Wandering Toward Us — Gravity Does the Rest

## Thumbnail

Text: **IT'S COMING** (gold, ALL-CAPS) + kicker "A ROGUE PLANET IS COMING".
Scene: a dark rogue planet crowding in from the right with a faint blue rim, deep
space, danger-red wash. Render: `npx remotion still RoguePlanetThumbnail out/rogueplanet_thumb.png`
(house style per THUMBNAILS.md). A/B against a "NO WARNING" frame grab from the hook.

## Description

A rogue planet is a world without a star — a dark planet drifting through interstellar
space. If one entered our solar system, the danger might not be a collision. Its gravity
alone could disturb Neptune, trigger comet storms, destabilize Earth's orbit, and change
the future of life on our planet.

This is the story of what could happen if a rogue planet entered our solar system without
warning.

Subscribe for cinematic science, cosmic mysteries, and terrifying possibilities from the
universe.

CHAPTERS
0:00 The planet you'd never see coming
0:37 Gravity is enough — no impact needed
0:50 What a rogue planet actually is
1:26 Why we'd be blind to it (microlensing)
2:11 The first signs — Neptune moves first
2:47 The frozen reservoir wakes up
3:42 The comet storm begins
4:18 Earth's orbit breaks
5:23 The worst case — thrown into the dark
6:05 A wandering, frozen world
6:50 The final flicker

## Tags (<500 chars)

rogue planet,what if rogue planet entered solar system,space documentary,cosmic horror,solar system,earth orbit,rogue planets,nasa,astronomy,planet collision,what if earth,space science,universe documentary,comet storm,gravity,cosmic threats,Mindwired

## Pinned comment

The scariest part isn't the impact — it's that gravity doesn't need one. A world that
never touches us could still rewrite Earth's orbit forever. Which phase unsettled you
most — the comet storm, or being thrown into the dark? 👇 Subscribe for more cosmic
what-ifs.

## Audience / settings
- Not made for kids.
- End screen: link the next cosmic what-if + the channel subscribe element.
- Category: Science & Technology.

## Production notes
- Narration: Cartesia "Clive" (measured documentary) — the ElevenLabs monthly quota
  ran out mid-build (2026-07-07), so all 12 clips were voiced in one consistent voice
  via Cartesia rather than a George/Clive mix. To move to the pinned channel voice
  (George) once quota resets: delete `public/rogueplanet/audio/{hook,gravity,whatis,
  invisible,neptune,freezer,comet,orbit,worstcase,frozen,ending,outro}.mp3` + their
  manifest entries, then `python3 scripts/rogueplanet/build_audio.py`.
- Visuals: the first 30s (hook) uses 4 real **Veo 3.1** cosmic shots (astronomer →
  rogue world → gravitational lensing → scale) as hard cuts; the rest is procedural
  (code-drawn diagrams). To swap in more Veo/Higgsfield footage, see
  `src/rogueplanet/CLIPS.md`. Higgsfield MCP wasn't connected in the build session, so
  the hook was done in Veo (the brief's designated tool for cosmic shots).
- SFX (cosmic rumble / heartbeat / bass hit / glass crack / boom) are synthesized
  placeholders in `public/rogueplanet/audio/sfx/` — replace with designed SFX anytime;
  the cue map in `src/rogueplanet/lib/script.ts` stays the same.
- Subscribe outro appended after render (mandatory): see below.
