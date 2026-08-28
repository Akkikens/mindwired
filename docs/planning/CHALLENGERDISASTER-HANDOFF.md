# Space Shuttle Challenger disaster — episode handoff (Black Box Breakdown)

**STATUS (2026-08-26): RENDERED + VERIFIED, ready for Akshay's review + upload.**
Comp `ChallengerDisasterDoc`, 4K (3840×2160), 16:34.5, −14.0 LUFS, windowed
`bed_tension_rud.mp3` at −20dB (16 mix windows). Chunked GCE render — 119/119
chunks succeeded, 29,663/29,663 frames verified, VM auto-deleted after fetch
(no orphan left behind). Final files at repo root:
`7 Astronauts. One Ignored Warning.mp4` + matching `.srt` (whisper, 297 cues,
word-accurate). Launch log: `out/challengerdisaster_gce_launch.log`.

Icahn PASS (memory `icahn-challengerdisaster`) — giant-name evergreen: Jason
Payne's "Challenger: A Rush To Launch" (605:1, 2.78M views/4,590 subs),
Secret Discovery fresh 2026 outlier (52.3:1), CNN/National Geographic ceiling
proof. Settled cause (1986 Rogers Commission), standard sensitivity tier.

First real-world production run for every preflight "lesson gate" built
earlier this session (retired-voice, duplicate-scene-id, chapter/kinetic-img,
first-25s-real-video, oversized-image, stale-texthash, exhibit-pinning,
single-file-repetition, img-pool-cap, etc.) — went to 0 blocking on a
brand-new episode with no gate exemptions needed.

## Files

| What | Where |
|---|---|
| Doc spec (108 scenes, 14.2 min narration) | `src/mindwired-doc/docs/challengerdisaster.json` |
| Manifest | `src/mindwired-doc/docs/challengerdisaster.manifest.json` |
| Fact base (10 data corrections, full labeled sections) | `docs/planning/CLAIMS-challengerdisaster.md` |
| Comp | `ChallengerDisasterDoc` in Root.tsx (BB_OUTRO baked) |
| Render log | `out/challengerdisaster_gce_launch.log` |
| Assets + licenses | `public/shorts/challengerdisaster/{images,video}/ATTRIBUTION.md` |
| Music | windowed `bed_tension_rud.mp3` (rotated from `falsevacuum` — no consecutive repeat) |
| Metadata (title/description/chapters/tags) | `docs/metadata/METADATA-challengerdisaster.md` |
| Funnel Shorts | NOT YET BUILT |
| Thumbnails | NOT YET BUILT (3 concepts specified in METADATA file) |

## The real-footage-scarcity problem this episode solved

The only real, freely-licensed pre-disaster motion footage found anywhere
(NASA image library, Wikimedia Commons, NARA) for this 40-year-old event was
a single 28.5-second Commons clip of the explosion/breakup moment itself —
**zero real liftoff-through-ascent video exists PD/CC**. This forced two
real fixes:

1. **The cold open is a flash-forward**, not a chronological "morning of
   launch" cold-open — it opens directly on the real explosion (Jan 28, 1986
   · T+73 seconds), then jumps back "six hours earlier" to the Ebeling
   dashboard-pounding beat (a verified real quote, NPR/Howard Berkes,
   Leslie Ebeling on the record). The one real clip is stretched across
   scenes h1/h2/h3/h3b/h4/h5/h8 using sequential (and, for h5, one
   deliberately reused) `videoFrom` offsets to satisfy the hard
   first-25-seconds-must-be-real-video preflight gate.
2. **A real pipeline bug was caught and worked around**: `fetch_footage.py`'s
   `transcode()` silently truncates every fetched clip to a fixed
   `max_seconds` cap — it had cut this one precious asset from its true
   28.5s down to 20s. Fixed for this episode by manually pulling the
   Commons API's `imageinfo` (confirming true `duration: 28.5`), then
   curling the raw upload URL directly and running an uncapped ffmpeg
   transcode. **The underlying `transcode()` cap is still generic and will
   silently truncate the next long real source too** — flagged in
   `docs/planning/SYSTEM-GATES-BACKLOG.md` for a real fix (make the cap
   configurable or skip it for sub-2-clip precious assets), not fixed here.

## Image pools that needed manual real-asset fetching

The automated `fetch_doc_footage.py` pass returned **zero results** for the
`hearingroom` prefix (referenced by ~21 scenes across chapters 4, 5, 8, 11)
and left `launch`/`recovery`/`crewgroup`/`memorial` thin (1-2 files each
across dozens of scene references) or, on contact-sheet eyeball, wrong-subject:

- `crewgroup_1/2.jpg`, `explosion_1.jpg` (the still), `recovery_2/3.jpg`,
  `memorial_2.jpg` — all confirmed wrong-subject (a MADS-tape data page, a
  memorial-service audience shot, an unrelated engine test photo, SRB
  drop-test-VEHICLE qualification photos, a different astronaut's memorial)
  and deleted.
- Replaced/expanded via direct NASA images-api.nasa.gov and Wikimedia Commons
  API fetches, each eyeballed before use: 4 real Rogers Commission
  investigation photos (`hearingroom_1-4`), the iconic ice-on-the-gantry
  photos (`launch_2/3`), real STS-51-L recovered-debris photos including a
  close-up of actual O-ring erosion tracks (`recovery_1-3`), 4 individual
  crew portraits (Scobee/Onizuka/McNair/Jarvis, `crewgroup_4-7`), and 2 more
  Space Mirror Memorial photos including one naming all 7 crew members
  (`memorial_4/5`). Full citation list in `images/ATTRIBUTION.md`.

## Known accepted warnings (preflight — 0 blocking, all reviewed)

11 warnings remain, all reviewed and accepted:
- 2 brightness warnings on `explosion_2/3.jpg` behind chapter/kinetic text —
  real archival smoke-plume photos are inherently dark; a real photo dimmed
  is preferable to a fabricated brighter one.
- The rest are `audit_scene_relevance.py` REUSE/MISMATCH/WEAK flags, all
  false-positive or accepted real-footage-scarcity tradeoffs: the
  "Presidential commission investigating Challenger accident" photos read as
  MISMATCH because the keyword-matcher looks for named individuals
  (Boisjoly/Feynman) the narration mentions, not the commission's own name —
  visually confirmed on-topic. `memorial_1/3.jpg` cross-video reuse (also
  used in `astronautbodies`/`spacedeaths`) reflects that only a handful of
  real Space Mirror Memorial photos exist at all — same logic as the
  explosion stills, which are literally the only 2-3 PD photos of the event.

## What's left before publish

1. ~~Verify the finished render~~ — DONE: 3840×2160, 16:34.5, −14.0 LUFS,
   mid-frame + outro-frame stills confirmed correct. VO ear-check not yet
   listened to by Akshay — full 108-scene episode, Grant narrator.
2. ~~Generate SRT~~ — DONE: `7 Astronauts. One Ignored Warning.srt` (whisper,
   297 cues, speech to 16:33.87, matches render duration).
3. ~~Build 3 thumbnails~~ — DONE: `out/thumbs/challengerdisaster_A/B/C.png`
   (explosion / crew portrait / "IGNORED" investigation-room), all eyeballed.
4. Cut 3-5 funnel Shorts (candidate beats: the Ebeling dashboard cold open
   h4-h8; the Jan 27 teleconference reversal c5_4-c5_9; Feynman's ice-water
   demo c8_2-c8_4; the "no one was punished" legal outcome c10). NOT DONE.
5. ~~Rename final render~~ — DONE: `7 Astronauts. One Ignored Warning.mp4` at
   repo root (out/ copy deleted, per disk-space convention).
6. **Channel backlog note — now urgent, not just a flag.** Repo root
   currently holds **9 fully rendered, titled `.mp4` masters** (BP/Deepwater
   Horizon, Apollo 13, Swissair 111, TWA 800, Bermuda Triangle, Starfish
   Prime, D.B. Cooper, Thai Cave Rescue, and this one) plus several more
   `.srt`-only entries suggesting even more in some stage of packaging. This
   episode should NOT trigger another production cycle before Akshay decides
   whether to pause and clear the upload backlog — asked directly in the
   session summary, not just noted here.
