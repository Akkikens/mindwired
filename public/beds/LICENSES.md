# public/beds/ — licensed music attribution log

The old `doc_*.mp3` set (doc_awe/doc_tension/doc_open/doc_somber) stays
BANNED per CLAUDE.md (2026-07-25, "irritating," repeated viewer complaints) —
do not use them, do not re-license them under a new name.

## sleepspacefacts / 24/7-stream lofi rotation

Six distinct tracks (~34 min combined before any repeat), all verified via the
Wikimedia Commons API directly (`action=query&prop=imageinfo&iiprop=extmetadata`)
— NOT just the file-page description, since several similar-looking Commons
audio files carry an unverified "license review needed" flag and were
deliberately excluded (Lo-Fi Space Ambient Drone Music - 1 Hour, Hoving/Cascade,
SoundAudio/Forest, Scott Buckley - The Long Dark). Rotate all six rather than
looping one — a single repeating track across hours of runtime is exactly the
"templated/low-variation" pattern flagged as monetization risk in the ambient-
stream policy research (memory `mindwired-247-ambient-research`).

| File | Source track | Artist | License | Length |
|---|---|---|---|---|
| `lofi_sleepspace_memory.mp3` | "Memory - A Slow Ambient Subtle Melancholic Track" | Oleg Mazur (uploaded via Free Music, soundcloud.com/fm_freemusic) | CC BY 3.0 | 3:49 |
| `lofi_sleepspace_raspberry.mp3` | "Ambient (10 minutes)" | raspberrymusic | CC BY 3.0 | 10:01 |
| `lofi_sleepspace_buckley_aurora.mp3` | "Aurora" | Scott Buckley | CC BY 4.0 | 8:19 |
| `lofi_sleepspace_soluslunes.mp3` | "Solus - Endless Space" | SolusLunes | CC BY 3.0 | 1:10 |
| `lofi_sleepspace_industree.mp3` | "Homesick" | IndusTree | CC BY-SA 3.0 | 8:23 |
| `lofi_sleepspace_peaceful.mp3` | "Peaceful" | Tamlin Lollis Love | CC BY-SA 3.0 | 2:41 |

All originals: https://commons.wikimedia.org/wiki/Category:Audio_files_of_ambient_music

**Attribution line for the video description (every upload using this rotation):**
> Music: "Memory" by Oleg Mazur, "Ambient (10 minutes)" by raspberrymusic,
> "Aurora" by Scott Buckley (scottbuckley.com.au), "Solus - Endless Space" by
> SolusLunes, "Homesick" by IndusTree, "Peaceful" by Tamlin Lollis Love — all
> via Wikimedia Commons, licensed CC BY 3.0/4.0 or CC BY-SA 3.0.

CC BY-SA tracks (IndusTree, Peaceful) carry a share-alike term — fine for use
as a background bed in a video (the video itself isn't a derivative work of
the audio requiring re-licensing), but do not distribute either audio file
itself, standalone, under different terms.

## bed_* set — YouTube Audio Library (added 2026-07-31, replaces the banned doc_* set)
All 8 by **The Grey Room / Density & Time**, downloaded from YouTube Studio's
Audio Library while logged into the Mindwired channel account. YouTube Audio
Library free license: usable in YouTube videos including monetized ones, no
attribution required. Chosen specifically because the artist's tracks were
added to the library Jun–Aug 2025 (fresh, less recognizable than the older
overused library staples — Akshay's explicit selection criterion, 2026-07-31).
NOT cleared for the 24/7 live stream or off-platform use without re-checking
library terms.

| file | track | mood | length |
|---|---|---|---|
| bed_awe_pulsar.mp3 | Pulsar | Calm | 4:08 |
| bed_awe_eventhorizon.mp3 | Event Horizon | Calm | 4:00 |
| bed_awe_singularity.mp3 | Singularity | Calm | 5:14 |
| bed_awe_laniakea.mp3 | Laniakea | Calm | 4:00 |
| bed_tension_falsevacuum.mp3 | False Vacuum Decay | Dramatic | 3:45 |
| bed_tension_rud.mp3 | Rapid Unscheduled Disassembly | Dramatic | 5:37 |
| bed_somber_redshift.mp3 | Red Shift | Sad | 4:12 |
| bed_somber_kayak.mp3 | Kayak | Sad | 2:42 |

The old `doc_awe/doc_tension/doc_open/doc_somber.mp3` files remain BANNED
(viewer complaints, 2026-07-25) — kept on disk only so old comps don't 404.

## generated/ — original per-episode beds (scaffold added 2026-09-16; NOTHING generated yet)
Goal: replace the fixed 8-track library with an original, generated stem per
episode so no viewer ever recognizes a bed from another channel, and so nothing
here can ever Content-ID match a commercial track. Rules: prompts describe
instrumentation/tempo/mood only — never an artist, song, soundtrack or
"in the style of" (scripts/gen_music_bed.py refuses such prompts). Every file
in `generated/` MUST have a row below, written by `gen_music_bed.py ingest`,
so the licence question ("where did this audio come from?") is answerable.

Probe result 2026-09-16 (Higgsfield MCP, evidence not assumption): the only
music model is `sonilo_music` (FAL), labelled "Game pipeline only" in the
catalog; get_cost prices it at 0.0625 credits/sec (30s=1.88, 180s=11.25,
600s=37.5); account balance was 0 credits on the free plan, so no stem has
been generated and the model's acceptance of a standalone music job is
UNPROVEN. Licence terms for Sonilo/FAL output have NOT been reviewed — do
that before the first ingested bed ships in a monetized upload.

| file | model | generated | tone | length | loudness | exact prompt |
|---|---|---|---|---|---|---|
