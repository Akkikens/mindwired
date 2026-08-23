# BERMUDA TRIANGLE — episode handoff (mindwired)

**STATUS (2026-08-20): RENDER-READY, awaiting Akshay's review + upload.**
Everything below is done: 4K master, SRT, 3 thumbnails, 4 funnel Shorts.

Icahn PASS (memory `icahn-bermudatriangle`) — recognition 3/3, corroborated
live by @official-yesterday's own 1.1M-view treatment of the exact same
topic. All gates green: TTS lint clean · relevance audit 0 blocking (54
warnings, all individually verified false-positive or asset-scarcity reuse
after genuine search effort) · preflight 0 blocking · comp stills eyeballed
throughout (cold open, myth-machine chapter, Gulf chart, statistics chapter,
outro — real archival footage/photos rendering correctly, outro splice
clean) · VO ear-check sample sent to Akshay
(`out/qa/bermudatriangle_vo_sample.mp3`, verified via volume-level scan, not
yet confirmed as a literal human listen).

**Render path note:** started local (gcloud auth was expired), Akshay
refreshed auth mid-render, switched to GCE (32-core on-demand VM) partway
through — finished much faster than the local path would have. Master
mastered to −14.1 LUFS, windowed `bed_awe_pulsar.mp3` across 12 beats, VM
auto-deleted on completion.

## Why this topic, why now

Akshay asked to study @official-yesterday's channel and "do everything you
can" to produce a video inspired by it. Bermuda Triangle was the natural
pick: already Icahn-validated 3 times (2026-07-26, re-checked 2026-08-02,
re-applied 2026-08-20), the exact topic named as the example candidate when
mindwired's scope was widened to ocean/earth mysteries that same session (see
[[yesterday-channel-study]]), and never previously produced. Mid-production,
Akshay asked for longer/deeper episodes (citing YESTERDAY/LEMMiNO/Dhruv
Rathee) — the script grew from an initial ~13min draft to ~21min using
material already gathered in CLAIMS-bermudatriangle.md, not padding (see
memory `longform-episode-length-preference`). Later, Akshay asked for zero
repeated footage across scenes — the image-pool structure was rebuilt from
~10 generic buckets to 19 narrower, more specific ones, with per-prefix
counts pushed as high as real licensed assets allowed (see "Footage" below).

## Files

| What | Where |
|---|---|
| Doc spec (79 scenes, ~21.3 min body) | `src/mindwired-doc/docs/bermudatriangle.json` |
| Manifest | `src/mindwired-doc/docs/bermudatriangle.manifest.json` |
| Fact base (11 acts/chapters, 10 data corrections) | `docs/planning/CLAIMS-bermudatriangle.md` |
| Comp | `BermudaTriangleDoc` in Root.tsx (MW_OUTRO baked) |
| **Master (DONE — 4K, −14.1 LUFS)** | `The Bermuda Triangle Isn't Real. Here's Proof..mp4` + `.srt` at repo root |
| Packaging | `docs/metadata/METADATA-bermudatriangle.md` |
| Thumbnails (3 BUILT) | `out/thumbs/bermudatriangle_A/B/C.png` |
| Funnel Shorts (4, rendered) | `BermudaTriangleShort1-4` → `out/shorts_final/BermudaTriangleShort<N>.mp4` |
| Shorts drip plan | `docs/publishing/SHORTS-SCHEDULE-bermudatriangle.md` |
| Assets + licenses | `public/shorts/bermudatriangle/` + `images/ATTRIBUTION.md` + `video/ATTRIBUTION.md` |
| Music | windowed `bed_awe_pulsar.mp3` (Venera/laniakea, Ötzi/singularity, Yellowstone/eventhorizon — no repeat) |

## Footage: what's real, what's honest b-roll, and the two false-positives caught

All real, PD/CC-licensed archival — no AI-generated imagery of real people or
events. Two automated-fetcher false matches were caught by eyeball before
they could ship:
1. `cyclops_1.jpg` auto-matched to "USS Langley hangar deck" (Openverse,
   BY-SA) — wrong ship entirely, wrong era, not even PD. Replaced with a
   manually-verified real USS Cyclops (1910-1918) Navy photo.
2. `avengersmoke_1.mp4` auto-matched to "INVASION OF SOUTHERN FRANCE; LCs
   APPROACH BEACH THRU SMOKE SCREEN" — landing craft in France, not a TBM
   Avenger at Iwo Jima. Replaced with a third distinct segment manually cut
   from the same verified-good NPC-8530 Yorktown reel used for the other two
   Avenger clips.

**Real motion footage (cold open, all from NARA/archive.org NPC-8530,
Public Domain Mark 1.0):** 4 distinct segments cut from "Scenes Aboard The
USS Yorktown (CV-10) & Night Firing, 02/24/1945" — taxi/crew, low-altitude
flight, folded-wing close-up, landing approach. Real TBM/TBF Avengers, the
same aircraft type Flight 19 flew.

**Historically-specific real photos:** Fort Lauderdale TBF formation (NARA/
Horace Bristol, 2 files), the actual 1945 Navy chart for Flight 19's real
mission ("Navigation Problem No. 1," 2 files), USS Cyclops (5 real photos
incl. her captain), the real Sept 1950 AP newspaper clipping that started the
myth (2 files), 4 real Avro Tudor photos (exact BSAA aircraft type for Star
Tiger/Star Ariel, incl. 2 from the actual 1948-49 Berlin Airlift era), a real
1852 Gulf of Mexico/Florida Straits chart, a real Puerto Rico Trench
bathymetry map.

**Honest generic b-roll (Pexels/Commons modern cargo ships, satellite cloud
imagery, compass photos)** used only under abstract/reflective narration
(statistics, theories, closing chapter) — never presented as archival to a
specific event. 12-image pools built for the two biggest reuse buckets
(oceanscene, azoresmap — 13 scenes each) to minimize repeats.

**Known structural limit:** the renderer's image-pool rotation
(`DocWide.tsx` line ~798) has no per-scene override — it's a simple counter
per prefix, so which exact file a scene lands on isn't individually
controllable. One scene (j5, hexagon-cloud theory) lands on a real NASA
iceberg-satellite photo instead of a more precisely-matching cloud image —
verified as imprecise, not false (both real NASA/NOAA Atlantic satellite
imagery), accepted rather than restructuring the whole rotation system for
one scene.

## Honesty rules baked in (do not soften in packaging)

- **Every popular theory is attributed-never-asserted**: methane hydrates
  (USGS's Bill Dillon quote — no evidence in 15,000 years), compass variation
  (real science, exaggerated significance), rogue waves (Dr. Simon Boxall's
  real wave-tank test on a Cyclops-shaped hull, not unique to this water),
  hexagonal clouds (Dr. Randy Cerveny's own on-record "horrendous editing"
  complaint about how a TV network turned his illustrative example into a
  fake solved mystery).
- **The circulating "sonar survey found a glassy geometric triangle" claim
  is named explicitly as a likely AI-generated hoax** (no real study/
  researcher/institution located) — used as a "the myth machine is still
  running" closing beat, never platformed as real.
- **The fabricated 1962 Flight 19 radio quote ("they're not even Navy
  planes") is explicitly debunked on screen**, not just omitted — naming and
  killing the single most repeated piece of misinformation is the episode's
  best single beat.
- **Star Tiger/Star Ariel are presented as genuinely unsolved** — the
  episode's honesty doesn't overreach into "everything has an answer";
  official "cause unknown" verdicts are quoted directly and left as such.
- **Marine Sulphur Queen (1963, within living memory) is framed per the
  Coast Guard's own finding**: the ship's owners/maintenance were
  responsible, never the crew.

## Known minor gap (not worth a re-render)

The verbal-bridge scene's on-screen caption reads "Watch next: 'The Mariana
Trench.'" — should read "The Place on Earth Scarier Than Space" (its real
published title, confirmed live at
https://www.youtube.com/watch?v=U-5x9k7vfD4). The fix landed in the source
JSON after this render's Remotion bundle was already frozen. The *spoken*
narration is already correct ("wait until you see the place on Earth that is
actually scarier than space") — only the on-screen caption card is stale.
Fix in a future incremental touch if it bothers on review; not blocking.

## What's left before publish

1. Wait for the render to finish; verify ffprobe duration (~1294s = body +
   outro)/resolution (3840x2160)/LUFS (−14), pull mid/outro stills.
2. Generate SRT via `whisper_srt.py` from the actual master (word-accurate).
3. Build 3 thumbnails (`out/thumbs/bermudatriangle_{A,B,C}.png`) — concept:
   real WWII TBM Avenger photo/frame against dark stormy Atlantic, House
   Style 2.0 (zero text or one short word).
4. Cut 3-5 funnel Shorts (shorts-funnel skill) — candidate hooks: the
   fabricated-quote reveal, the Mary Celeste geography reveal, the "not even
   top 10" statistic, the hexagonal-clouds "horrendous editing" quote.
5. A real human ear-check of the VO sample (only volume-scanned by this
   session, not literally listened to).
6. Rename the final render to the exact title + move to repo root as the
   `<Title>.mp4` + `<Title>.srt` pair.
