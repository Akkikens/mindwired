# Yellowstone — handoff ("Yellowstone Just Cracked Open a New Crater")

**Status: RENDER IN PROGRESS on GCE — not yet verified, not yet published.**
Channel: mindwired.

Produced end-to-end in one autonomous session (2026-08-11) under the standing
"WORK ON NEXT BIG VID" authorization.

## What's done

| Step | Status | Where |
|---|---|---|
| Icahn validation | Winner of a 6-candidate live sweep, weighted for recognition/currency per the channel's repeated-lesson rule — 554.8:1 headline + 375.6:1 corroborator, recognition 3/3, giant-name ceiling class | memory `icahn-yellowstone` |
| Packaging lock (ctr-engine Run A) | Done, kill bar cleared | Appended to `icahn-yellowstone` memory |
| CLAIMS fact base | Done — includes a "DATA CORRECTIONS" block (10 items) softening disputed figures (Hebgen Lake magnitude, caldera dimensions, no city-size comparison, no eruption-probability overstatement, etc.) | `docs/planning/CLAIMS-yellowstone.md` |
| Script | 67 scenes | `src/mindwired-doc/docs/yellowstone.json` |
| Footage | Real USGS monitoring-camera video + photos of the actual June 13/18, 2026 Biscuit Basin explosion; real 1959 Hebgen Lake/Madison Canyon landslide photos; real Old Faithful photos (4 variants); real NASA Landsat thermal image. See lessons below — the auto-fetcher's first pass matched 2 generic Pexels stock clips to the cold open by mistake; both replaced with the real event footage. | `public/shorts/yellowstone/{images,video}/` + `ATTRIBUTION.md` in each |
| VO | 67 clips, Cartesia, 10.3 min narration, speed 0.96 | `public/shorts/yellowstone/audio/` |
| Gates | 0 blocking (preflight + relevance audit + TTS lint); remaining warnings are variety/rotation notes or a verified false-positive (the linter only checks the literal last scene for the verbal bridge, missing the bridge scene one before it — same structure as the already-shipped `voyager1.json`/`planetnine.json`) | — |
| Comp registered | `YellowstoneDoc` in `src/Root.tsx` | — |
| Stills spot-check | 6 frames checked across cold open, exhibit maps, chapter cards, the 1959 section | `out/qa/yellowstone_*.png` |
| Render | 4K, windowed `bed_awe_eventhorizon.mp3` — **IN PROGRESS on GCE** (killed and relaunched once, see lesson #2) | `out/yellowstone_gce.mp4` (not yet fetched) |
| Captions | Not yet generated — needs the finished master | — |
| Metadata package | Title + 2 alternates, description, chapters, tags, pinned comment | `docs/metadata/METADATA-yellowstone.md` |
| Thumbnails | 3 built PNG files (real Biscuit Basin pool/fissure photos, House Style 2.0) | `out/thumbs/yellowstone_{A,B,C}.png` |
| Shorts | 4 comps registered (`YellowstoneShort1-4` in Root.tsx), not yet rendered — drip plan written | `docs/publishing/SHORTS-SCHEDULE-yellowstone.md` |

## Real production lessons from this episode

1. **The footage fetcher matched generic stock to a specific real event —
   silently.** `fetch_doc_footage.py` matched `biscuit_explosion_1.mp4` and
   `biscuit_spouting_1.mp4` to generic Pexels geyser clips ("geyser eruption in
   yellowstone national park", "steaming geyser eruption in rocky landscape")
   instead of the real USGS monitoring-camera footage of the actual June 2026
   event — even though the CLAIMS file already had the real direct S3 mp4 URLs
   from research. The query terms were generic enough to match *any* geyser
   footage, and nothing in the pipeline flags "this real-sounding query matched
   unrelated stock" automatically. Caught by manually cross-checking the
   fetcher's picks against the CLAIMS footage table, not by any gate. Fixed by
   pulling the real USGS videos directly (their burned-in timestamps —
   "YS-BBSN 05:09:48 2026-06-13" — match CLAIMS' cited detection time exactly)
   and transcoding them to match pipeline conventions.
2. **Two real DocScene field-type bugs, one of them render-crashing.** Wrote
   `"chapter": true` (boolean) on all 6 chapter-card scenes instead of the
   actual string the field expects (`"CHAPTER ONE\nTITLE TEXT"` — DocWide calls
   `.split("\n")` on it), and `"exhibit": "<prefix>"` (string) instead of the
   boolean the field actually is. Neither was caught by `preflight_doc.py` or
   the relevance audit — both are content/asset gates, not a TypeScript-level
   schema check on the JSON. The `exhibit` bug was harmless (JS truthiness);
   the `chapter` bug would have crashed the render (`true.split is not a
   function`) the moment it reached the first chapter card. Caught by writing
   a quick Python type-consistency check against DocWide.tsx's actual
   `DocScene` type before trusting a still-render, then confirmed via a real
   `npx remotion still` of a chapter-card scene. **The GCE render had already
   synced the broken version by the time the fix landed locally — killed and
   deleted that VM before it wasted real render time, then relaunched clean.**
   Worth a real lesson: verify a fix landed with a fresh sync check (or just a
   still-render) before trusting a race against an in-flight `rsync`.
3. **Image-prefix filenames need a numeric suffix even when the "prefix" the
   script wants already ends in a number.** Named real photo files
   `caldera_map_1.jpg`, `biscuit_pool_1.jpg`, etc. — but `build_doc_vo.py`'s
   prefix regex (`(.+?)_\d+$`) strips the LAST `_<digits>` off the filename
   stem to get the prefix key, so `caldera_map_1.jpg` produces manifest key
   `caldera_map`, not `caldera_map_1` (which is what the JSON's `img` field
   actually references). This silently produced an empty image pool for every
   scene using those prefixes — `preflight_doc.py` caught it immediately as 39
   "black frame" blocks, so it never reached a render, but it's a naming trap
   worth remembering: when a script's own `img` prefix ends in a digit (here,
   an arbitrary "_1" baked into names like `old_faithful_1`), the actual files
   need a SECOND numeric suffix (`old_faithful_1_1.jpg`, `caldera_map_1_1.jpg`)
   for the regex to parse the intended prefix.
4. **Asset-pool rotation fixes reuse without touching the script.** Once
   `old_faithful_1`'s image pool grew from 1 file to 4 (all real, sourced via
   parallel research agents), DocWide's built-in per-prefix rotation
   automatically spread the 8 scenes referencing that prefix across all 4
   photos with zero JSON edits — the relevance audit's REUSE warnings for that
   prefix cleared on their own. Only genuinely mismatched scenes (an explosion
   video standing in for a river-discoloration beat, a road-damage photo
   standing in for a landslide/Quake-Lake beat) needed actual reassignment.

## What's left before publish

1. **Verify the render** once it finishes: ffprobe duration/resolution, a mid
   frame + outro frame, confirm the −14 LUFS line in the render log.
2. **A real human listen to the VO** — this session verified clip integrity
   (silence-detection scan, volume levels, whisper-viable) but did not
   literally listen; do a quick pass before publish.
3. **Generate captions** via `whisper_srt.py` once the master exists.
4. **Render the 4 Shorts** (comps already registered) and finalize the drip
   schedule's actual dates once a publish date is set.
5. **Build thumbnails into Test & Compare** at upload.
6. **Akshay's own review pass** before hitting publish — this was an
   autonomous end-to-end run; nothing here has had a human's eyes on the
   finished video yet.
