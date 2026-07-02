# PROMPT — 2-Hour Space Sleep Documentary (run on the render PC)

Copy everything below the line into Claude Code, opened in the **singaloo** repo clone.

---

Read mindwired/CLAUDE.md (in the sibling mindwired repo clone) first — it is the production manual. Then build a **2-hour space facts sleep documentary** using the cosmic explainer engine in this repo, following this spec exactly.

## The video
- **Working title:** "2 Hours of Space Facts to Fall Asleep To" (slug `sleepspace`, comp id `CosmicSleepSpace`)
- **Audience & intent:** people falling asleep. This inverts the channel's usual retention rules — no hooks, no jump-scares, no urgency. The video succeeds if the viewer is unconscious by minute 20 and it keeps them company for the rest. Sleep-video demand is proven (Sleep On Science 138K/67K, "47 Scary Space Theories" 1:48hr with 167K views, Science Before Sleep).
- **Length:** 120+ minutes ≈ **950-1050 narration lines** at sleep pacing (verify against real audio durations after TTS; extend if under 115 min).

## Sleep pacing (do this FIRST — engine changes)
1. In `src/videos/cosmic/lib/pads.json`-style fashion, add a **per-topic pad profile**: give the topic JSON an optional top-level `"padProfile": "sleep"`, and in `lib/cosmic.ts` + `Scene.tsx` (+ `scripts/cosmic/gen_subs.py` / `gen_chapters.py`) use a `padsSleep.json` when set: `{"intro": 3.5, "title": 3.5, "outro": 6.0, "word": 2.2, "default": 2.6}`. Keep the existing pads.json untouched for normal videos. All four readers MUST share the two JSON files — never inline the numbers (that exact drift bug was already fixed once).
2. Narration speed: build audio with **Hume speed 0.85** (build_topic_multi passes speed to hume.build_audio — make it a `--speed` flag, default 0.95).
3. Visual calm: in `Cosmos3D.tsx`, when a new prop `sleep` is true (wire it from the topic through `CosmicVideo → CosmicScene → CosmicCanvas`): halve Bloom intensity, slow every `frame *` rotation/drift multiplier by 0.5, and never render `FlashOverlay` (Scene.tsx: skip it for sleep topics even on flash/supernova/bigbang scenes).
4. Fades: for sleep topics use edgeIn 15 / edgeOut 45 in Video.tsx's Fade (gentle 1.5s dissolves).

## Script (write `src/videos/cosmic/topics/sleepspace.json`)
- **Opening (no teaser-slam):** 3 slow `intro`-scene lines welcoming the listener to drift off ("You don't need to remember any of this. Just listen.") → `title`.
- **10 chapters, ~95-100 lines each**, ordered from engaging to hypnotic (energy must DECREASE over the runtime):
  1. The gentle giants — Jupiter, Saturn, the slow weather of gas worlds (scenes: jupiter, saturn, planet)
  2. Moons and quiet oceans — Europa, Titan, Enceladus (moon, planet, earth)
  3. The life of a star, told slowly (star, redgiant, whitedwarf, nebula)
  4. Comets and the long orbits (comet, void)
  5. The Milky Way from above (galaxy, attractor — gentle)
  6. Nebulae: where stars are born (nebula, star)
  7. The scale of everything (horizon, galaxy — wonder, not dread)
  8. Deep time — how long the universe thinks (cmb, whitedwarf)
  9. The quietest places (void, bootes material — framed as peaceful, NOT scary)
  10. The far future, told as a lullaby (horizon, void — ending on comfort)
- **Voice rules:** everything in CLAUDE.md applies PLUS: no questions to the viewer, no "but here's the terrifying part", no cliffhangers, numbers rounded and soft ("about four billion years"), every chapter ends with a settling line. Facts must still be accurate.
- `word` cards: max 1 per 12 lines, soft phrases only ("STARLIGHT IS OLD LIGHT"), never numbers-slams.
- Last line exactly: "If this made you wonder about the universe, subscribe to mindwired." (outro)
- Chapter-header lines must start "Chapter one." / "Chapter two." … so gen_chapters.py picks them up — add `Chapter` to its SECTION regex.

## Build & render (on this PC)
1. `.env`: copy keys from the main Mac (HUME_API_KEY etc. — .env is not in git).
2. `python3 scripts/cosmic/build_topic_multi.py sleepspace --speed 0.85` (Hume Nature Documentary Narrator; falls back Cartesia → ElevenLabs; ~65K chars — check Hume credits first with a 1-line probe).
3. `python3 scripts/cosmic/gen_registry.py`
4. Verify BEFORE the long render: `npx remotion still CosmicSleepSpace out/t.png --frame=900 --gl=angle` + compute total duration from the manifest (must be ≥115 min; add lines if short).
5. Render (~216,000 frames): `npx remotion render CosmicSleepSpace out/mindwired_sleepspace.mp4 --gl=angle --concurrency=<cores-2> --overwrite`. If the machine is beefy, render halves in parallel with `--frames=0-108000` / `--frames=108001-<end>` into two files and concat with ffmpeg `-c copy`.
6. `python3 scripts/cosmic/gen_subs.py sleepspace` and `gen_chapters.py sleepspace`; copy the mp4 + srt into the mindwired repo.
7. Spot-check 6 frames across the runtime and listen to 30s at three points before declaring done.

## Packaging (write METADATA-sleepspace.md in mindwired)
- Titles (A/B): "2 Hours of Space Facts to Fall Asleep To" / "Sleep in the Universe — 2 Hours of Calm Space Facts" / "A 2-Hour Journey Through Space (for Sleep)"
- Description: emphasize calm narration, no jarring sounds, chapters listed for sleep timers; hashtags ≤15 (#sleep #spacefacts #asmr #relaxation #cosmos …); tags from the master pool + sleep keywords (sleep documentary, calm space video, fall asleep to space, bedtime science).
- Note in the description that volume is mastered low and consistent — then actually check loudness: `ffmpeg -i out.mp4 -af loudnorm=print_format=summary -f null -` and target −18 to −20 LUFS (quieter than the usual −14; it's a sleep video).

Work autonomously start to finish. Verify every stage before the next (the engine's gotchas are documented in CLAUDE.md). Do not publish anything — deliver the mp4, srt, chapters, and metadata as files.

---
