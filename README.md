# MINDWIRED — Channel Production Doc

Cinematic, faceless documentary channel — *"the strange machinery of our universe."*
Two lanes: **Space/Science** and **Digital Simulation** (gaming/tech).

Built with **Remotion** (React → MP4), **React Three Fiber / Three.js** (3D), and
**ElevenLabs** (Brian VO + score). Narration is word-aligned for captions; every
video is mastered to **−14 LUFS** for YouTube.

---

## 📺 Episodes (all upload-ready)

| # | Episode | Runtime | Visual approach | Video | Thumbnail |
|---|---------|---------|-----------------|-------|-----------|
| 1 | **Lost in Orbit** | 6:09 | Procedural WebGL 3D (Earth, debris, orbital rings) | `out/mindwired-lost-in-orbit-3d.mp4` | `out/mindwired-lost-in-orbit-thumbnail.png` |
| 2 | **The Great Attractor** | 13:11 | Real telescope imagery (Hubble/Planck/NASA) + 3D diagrams | `out/mindwired-great-attractor.mp4` | `out/mindwired-great-attractor-thumbnail.png` |
| 3 | **GTA 6: Insane Weather** | 7:25 | Real GTA 6 art + 2D weather overlays | `out/mindwired-gtavi-weather.mp4` | `out/mindwired-gtavi-thumbnail.png` |
| 4 | **The Scariest Places In The Universe** | ~9:03 | Real NASA/ESA space imagery (black-hole viz, magnetar art, deep fields) — Ken Burns + cinematic grade + kinetic count-up stats | `out/mindwired-scariest-places.mp4` | `out/mindwired-scariest-thumbnail.png` |

*(Also: `out/mindwired-lost-in-orbit.mp4` = the earlier 2D version of #1; `out/mindwired-3d-POC.mp4` = the original 3D proof-of-concept.)*

---

## 1 · Lost in Orbit
**Title:** What Happens To Astronaut Gear Lost In Orbit
**Hook:** A lost glove orbiting at 17,500 mph that never came down.
**Thumbnail text:** STILL IN ORBIT · 17,500 MPH
Full metadata → [METADATA.md](METADATA.md)

## 2 · The Great Attractor
**Title:** The Great Attractor: Something Is Pulling Our Galaxy
**Hook:** Our whole galaxy is being pulled at 2,000,000 km/h toward something we can't see.
**Thumbnail text:** PULLING OUR GALAXY · 2,000,000 KM/H (cosmic art from YT thumbnail tool)
**Chapters:** 0:00 Hunted · 0:41 Cosmic Speedometer · 2:09 Tug of War · 3:23 Zone of Avoidance · 4:52 Scale of the Monster · 6:31 Dipole Repeller · 8:01 Laniakea · 9:36 Bigger Giant · 11:03 Will We Arrive? · 12:30 Final Thoughts
Full metadata → [METADATA-attractor.md](METADATA-attractor.md) · Quiz → [QUIZ-attractor.md](QUIZ-attractor.md)
**Image credit (required in description):** NASA / ESA / STScI / Hubble / Spitzer / Planck (public domain / CC BY 4.0)

## 3 · GTA 6: Insane Weather
**Title:** How GTA 6's Weather Tech Got This Insane
**Hook:** A simulated hurricane that turns Vice City into a disaster you survive.
**Thumbnail text:** GTA 6'S INSANE WEATHER
**Chapters (approx):** 0:00 A Storm That Builds Itself · 0:38 Leonida · 1:31 A Living Atmosphere · 2:30 When the Storm Hits · 3:30 The Streets Flood · 4:20 The Hurricane · 5:08 A Living World · 6:03 The Brutal Cost · 6:54 What It Means
Full metadata → [METADATA-gtavi.md](METADATA-gtavi.md)
**⚠️ Notes:** Speculative analysis (leak/trailer-based; not confirmed). Uses official GTA 6 art for commentary; logos cropped; no Rockstar trailer footage. Confirm your IP comfort before monetizing.

## 4 · The Scariest Places In The Universe
**Title:** The Scariest Places In The Universe
**Hook:** A ranked countdown (8 → 1) from eerie to reality-ending — the last one may be coming toward us at light speed.
**Thumbnail text:** SCARIEST PLACE IN SPACE · WHERE LIGHT DIES
**Countdown:** 8 Rogue Planets · 7 Magnetar · 6 Sagittarius A* · 5 Quasars · 4 The Great Attractor · 3 TON 618 · 2 The Boötes Void · 1 The False Vacuum
**Idea source:** Icahn-method outliers — "scariest places in the universe" proven on 3 small channels (SciMind 3.4M/23K, Space Dude 621K/36K, Space Time Narratives 236K/13K). Ranked-escalation ordering out-executes the originals.
**Build:** verified factual figures in narration (TON 618 ≈66B M☉, Sgr A* ≈4M M☉, Boötes Void ≈330M ly). Stat beats use the kinetic count-up treatment (`src/components/kinetic.tsx`). Every scene is real public-domain space imagery (Ken Burns + grade), matching the channel's photoreal look — no procedural 3D.
**Image credit (required in description):** NASA / ESA / STScI / CXC (public domain). Imagery fetched via `scripts/scariest/fetch_images.py`.

---

## 🛠 How to rebuild / re-render

```bash
cd ~/Documents/GitHub/mindwired
pnpm install
```

**1. Generate audio (Brian VO + score)** — needs `ELEVENLABS_API_KEY` (in `.env`):
```bash
python3 scripts/build_audio.py            # Lost in Orbit
python3 scripts/attractor/build_audio.py  # Great Attractor
python3 scripts/attractor/fetch_images.py # (re)download public-domain telescope imagery
python3 scripts/gtavi/build_audio.py      # GTA 6 Weather
python3 scripts/scariest/build_audio.py   # The Scariest Places
```
Each writes `public/<slug>/audio/*.mp3` + `manifest.json` (durations + word timings).
Idempotent — existing clips are skipped (delete a clip's `.mp3` to regenerate it).
No key handy? `python3 scripts/scariest/estimate_manifest.py` writes silent placeholders + estimated
timings so the episode renders as an offline preview; the real `build_audio.py` overwrites them.

**2. Render video** (`--gl=angle` only needed for the WebGL ones):
```bash
pnpm exec remotion render src/index.ts LostInOrbit   out/raw.mp4 --gl=angle --concurrency=3
pnpm exec remotion render src/index.ts GreatAttractor out/raw.mp4 --gl=angle --concurrency=3
pnpm exec remotion render src/index.ts GTAVIWeather   out/raw.mp4 --concurrency=4
pnpm exec remotion render src/index.ts ScariestPlaces out/raw.mp4 --gl=angle --concurrency=3
```

**3. Render thumbnails** (1280×720 stills):
```bash
pnpm exec remotion still src/index.ts Thumbnail           out/...-thumbnail.png --gl=angle
pnpm exec remotion still src/index.ts AttractorThumbnail  out/...-thumbnail.png
pnpm exec remotion still src/index.ts GTAVIThumbnail      out/...-thumbnail.png
pnpm exec remotion still src/index.ts ScariestThumbnail   out/mindwired-scariest-thumbnail.png --gl=angle
```

**4. Master audio to −14 LUFS** (video copied untouched, fast):
```bash
ffmpeg -y -i out/raw.mp4 -c:v copy \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11" -ar 48000 -c:a aac -b:a 192k \
  out/<final-name>.mp4
```

---

## 🗂 Project map
```
src/
  index.ts, Root.tsx          → all compositions registered here
  lib/theme.ts                → shared palette / fonts
  components/                 → Captions, ChapterTitle, StatCallout, FilmLook, Stage3D-overlays
  three/                      → Stage3D (camera+bloom), Earth3D, cosmic.tsx, Glove3D, objects3d
  Video.tsx, scenes/, Thumbnail.tsx           → Lost in Orbit
  attractor/  (Video, scenes/, lib/, Thumbnail)→ Great Attractor (ImageScene + 3D diagrams)
  gtavi/      (Video, scenes/, lib/, three/synthwave, Thumbnail) → GTA 6 (ImageScene + WeatherOverlay)
scripts/
  lib/eleven.py               → ElevenLabs toolkit (music_sung, forced_align, tts_aligned, build_audio)
  build_audio.py, attractor/, gtavi/          → per-video audio + image fetch
public/<slug>/audio|img/      → generated audio + imagery
out/                          → rendered .mp4 + .png deliverables
```

## 🔑 Notes
- **ElevenLabs key:** read from `ELEVENLABS_API_KEY` env or `mindwired/.env` (gitignored). Creator tier; music + TTS bill against the character pool (cheap).
- **Pipeline trick:** Music API ignores its own `words_timestamps`, so VO is force-aligned (`/forced-alignment`) for frame-accurate captions; effects/callouts are synced to specific spoken words.
- **Packaging** (titles/thumbnails/descriptions/tags) was built with the CGE skills (Holy Trifecta + Launch checklist).
- **Thumbnails:** for the blockbuster scene-with-text look (made in an image model like GPT-4o/DALL·E/Midjourney) **and** the in-repo code-composite route, see [THUMBNAILS.md](THUMBNAILS.md).
