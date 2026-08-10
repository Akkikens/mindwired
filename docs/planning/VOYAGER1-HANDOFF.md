# Voyager 1 — handoff ("NASA Built It to Last 5 Years. It's Been 49.")

**Status: RENDERED, VERIFIED, PACKAGED — ready for Akshay's final review + upload.**
Not yet published. Channel: mindwired.

Render verification (2026-08-08): 3840×2160, 30fps, 1814.6s (30:14.6 — body
1797s + 527-frame/17.6s outro, matches doctiming.py's prediction almost
exactly), AAC 48kHz stereo, mastered to **−14.1 LUFS** (in −24.4 LUFS), windowed
`bed_awe_laniakea.mp3` at 11 windows (cold open + each chapter transition +
closing). **Full-timeline `ffmpeg blackdetect` pass (d=0.5, pic_th=0.98) found
zero black-screen events across all 30:14** — confirms the mid-production
brightness-audit fix (see lesson #2 below) actually worked, not just at the
spot-checked frames. Captions generated via whisper (495 cues, accurate digit
forms, not TTS phonetic spellings).

Produced end-to-end in one autonomous session (2026-08-08) at Akshay's request
for "anything on space, 30 minutes, that'll make YouTube push and promote it."

## What's done

| Step | Status | Where |
|---|---|---|
| Icahn validation | PASS, no conditions — beat Betelgeuse companion (close 2nd, kept as next alternate) and the Carrington Event | memory `icahn-voyager1` |
| Packaging lock (ctr-engine Run A) | Done, kill bar cleared | Appended to `icahn-voyager1` memory |
| CLAIMS fact base | Done — 5-agent research fan-out (origins/engineering, Grand Tour, Golden Record/Pale Blue Dot, power-down/2024 glitch, footage scout) | `docs/planning/CLAIMS-voyager1.md` |
| Script | 179 scenes, 4,671 words narration | `src/mindwired-doc/docs/voyager1.json` |
| Footage | Fetched + hand-verified; multiple wrong-mission images caught and replaced with manual Commons pulls (real Ed Stone, Carl Sagan, Suzanne Dodd photos; real Voyager RTG; real Golden Record cover diagram; real DSN dish video reprojected from a 360° source) | `public/shorts/voyager1/{images,video}/` + `ATTRIBUTION.md` in each |
| VO | 179 clips, Cartesia, 26.4 min narration, speed 0.96 | `public/shorts/voyager1/audio/` |
| Gates | 0 blocking (preflight + relevance audit + TTS lint) | — |
| Comp registered | `Voyager1Doc` in `src/Root.tsx` | — |
| Stills spot-check | 9 frames checked across cold open, kinetic reveals, chapter transitions, coda | `out/qa/voyager1_stills/` |
| Render | 4K (3840×2160), 1814.6s, −14.1 LUFS, windowed `bed_awe_laniakea.mp3`, GCE on-demand — **DONE** | `NASA Built It to Last 5 Years. It's Been 49..mp4` (repo root) |
| Captions | 495-cue whisper transcript | `NASA Built It to Last 5 Years. It's Been 49..srt` (repo root) |
| Metadata package | Title + 2 alternates, description, chapters, tags, pinned comment | `docs/metadata/METADATA-voyager1.md` |
| Thumbnails | 3 built PNG files (real archival photos — Pale Blue Dot / 1977 launch / Uranus — graded, House Style 2.0, squint-tested) | `out/thumbs/voyager1_{A,B,C}.png` |
| Shorts | Not yet cut | — |

## Real production lessons from this episode

1. **Two of three footage leads that looked good on paper turned out wrong on
   inspection.** The "vintage 1977 JPL mission control" video the automated
   fetcher and initial research turned up was actually a Webb/Hubble nebula
   clip; the "1990 Pale Blue Dot press conference" video was generic stock
   Earth-from-space CGI. Both got caught by eyeballing actual frames, not by
   trusting the source title. Fixed by finding a real, confirmed NASA/Commons
   DSN dish video and reprojecting it (equirectangular 360° → flat rectilinear,
   `ffmpeg -vf v360`) into three distinct real clips for the cold open, and by
   converting the Pale Blue Dot beats to the real photo (a still, but outside
   the mandatory first-30-60s real-video window).
2. **"img present" isn't the same as "img visible."** Every chapter/kinetic
   scene had an `img` field (passing the automated no-black-screen check), but
   several of the actual source photos were themselves shot on black
   backgrounds (spacecraft artist-concept renders, a crescent-phase Uranus
   image) — once `TextSceneBg`'s dimming filter (`brightness(0.62)` + a dark
   radial gradient) was applied on top, they read as functionally black
   screens. Caught by rendering actual stills and looking, not by trusting the
   preflight gate. Fixed by auditing raw pixel brightness (Pillow
   `ImageStat.Stat`) across every prefix used behind text and swapping/
   deleting anything under ~70/255 mean brightness. **This is a real gap in
   the automated tooling** — worth considering a brightness check in
   `preflight_doc.py` itself for future episodes.
3. **A verbal bridge naming a topic that isn't a published video yet is a
   real bug, not a nitpick.** The first draft's closing bridge referenced
   "the star astronomers just found orbiting Betelgeuse" — a real Icahn
   research finding, but not an actual live mindwired video. Caught before
   the render (the render was still in the file-sync phase, so it was cheap
   to kill and relaunch) and fixed to bridge to "21 Astronauts Never Came
   Home," a real, live, channel-best video.
4. **Word-count-based runtime estimates undershoot.** Narration word count
   alone (4,671 words → ~26.4 min at typical wpm) suggested the episode would
   land short of the requested 30 minutes. The actual body runtime, computed
   via `doctiming.scene_frames()` (which adds LEAD+HOLD framing per scene),
   came out to 1,797s = 29m57s — almost exactly 30 minutes. Use the timing
   module for real estimates, not raw word-count math.

## What's left before publish

1. **A real human listen to the VO** — this session verified clip integrity
   (no empty/undersized files, valid audio streams, whisper transcript reads
   correctly) but did not literally listen; do a quick pass before publish.
2. **Build thumbnails into Test & Compare** at upload (files already exist,
   see below) and set up the title test per ctr-engine's sequencing (thumbnail
   test first, title test after it settles).
3. **Cut 3-5 funnel Shorts** (shorts-funnel skill) once Akshay confirms the
   long-form is good to go.
4. **Akshay's own review pass** before hitting publish — this was an
   autonomous end-to-end run; nothing here has had a human's eyes on the
   finished video yet.
5. Everything else (render verification, blackdetect, captions, file naming)
   is done — see the table above.
