# PROJECT HAIL MARY — "The Real Science" (mindwired)

Single-file summary of everything done on this episode. Read `CLAUDE.md` first for
the production manual; this doc is the episode-specific state.

## Status: SCRIPT + FOOTAGE DONE — BLOCKED ON CARTESIA_API_KEY (no narration/render possible yet)

## Files
| What | Path |
|---|---|
| Fact base (GATE — every script line traces here) | `docs/planning/CLAIMS-projecthailmary.md` |
| Doc spec (43 scenes) | `src/mindwired-doc/docs/projecthailmary.json` |
| Icahn validation + locked package | `docs/planning/TOPIC-QUEUE.md`, entry "projecthailmary" (no `icahn-<slug>` memory entry — see note below) |
| Fetched images (33 real photos) | `public/shorts/projecthailmary/images/` + `ATTRIBUTION.md` |
| Fetched video (4 real NASA solar clips) | `public/shorts/projecthailmary/video/` + `ATTRIBUTION.md` (gitignored — not committed) |
| Comp registration | **NOT DONE YET** — needs a manifest first (see below) |
| Rendered master | **NOT DONE — blocked** |

## ⚠️ Why this episode exists and what it's for

Icahn-validated 2026-08-29 alongside three candidates for the new **Booked**
channel (48 Laws of Power, Atomic Habits, Psychology of Money). Project Hail
Mary's own demand cluster (Storm King's "Science of the Ending" / "Biology of
Rocky" videos, 38:1 and 31.9:1) is a **science-explainer** shape, not a
book-critique shape — wrong format for Booked, right format for mindwired's
existing space/science lane. Redirected here on Akshay's call. Full ranking
of all 4 candidates + the locked ctr-engine package is in `TOPIC-QUEUE.md`.

**Legal constraint (carries through everything in this episode):** the user
uploaded an EPUB of the novel. Per this channel's standing rule (same one
written for Booked), **nothing in this episode was written from that file** —
CLAIMS and the script are built entirely from general public knowledge of the
novel's widely-reviewed premise, real science literature, and Andy Weir's own
published interviews. No movie footage/clips anywhere either (the 2026 film
is a separate copyrighted work) — every visual is real-world science
photography/footage, independent of the movie.

## 1. Icahn validation — PASS
Headline: Storm King, 1,098,169 views / 28,900 subs = **38.0:1** ("The Science
of Project Hail Mary's Ending," Apr 2026). Corroboration: Storm King's own
"Biology of Rocky" (31.9:1), Flop Guy (9.9:1), SciFi Safari (9.9:1). Ceiling:
StarTalk/Neil deGrasse Tyson 3.8M views. Recognition 3/3, giant-name class,
currency very high (live movie-release wave) but time-bound — don't let
production drag. Full evidence table in `TOPIC-QUEUE.md`.

## 2. Research — 4-agent fan-out, synthesized into CLAIMS-projecthailmary.md
Dimensions: astrophage energy/biology · propulsion/relativity physics ·
Rocky's xenobiology/language · real-footage scout. Every claim sourced to
real science journalism (Scientific American, NYT, Northeastern, Inverse,
Physics World), physics/astrobiology reference material, and Andy Weir's own
publicly published interviews (StarTalk, Space.com, Astronomy.com) — never
the novel's text.

**Hard corrections baked into the script** (do not revert if editing):
1. "Petrova line" is NOT a real astronomical term — invented for the novel.
2. Don't oversell "ammonia-based alien" — it's water-based biology in an
   ammonia-rich atmosphere, per Weir's own account, not full ammonia
   biochemistry (that's a separate, real 1954 Haldane hypothesis).
3. Rocky's real candidate homeworld (40 Eridani Ab) has since been partly
   revised by newer observations — a "science moves fast" beat, not a gotcha.
4. Breakthrough Starshot animations are CC BY-NC-SA — excluded, NC blocks
   monetized use.
5. CDC's Public Health Image Library has zero results for *Deinococcus
   radiodurans* (it's a human-pathogen library) — don't search it for this.
6. The real NASA JPL Feb-2026 panel (Weir + Ryan Gosling + Sandra Hüller) is
   excluded even though it's on a .nasa.gov page — film-promotional, honors
   the no-movie-footage rule's intent not just its letter.
7. Andy Weir interview/panel footage is real but NOT PD (outlet-copyrighted)
   — quote him verbally/attributed, never show the clip.
8. Tau Ceti can't be visually resolved by any real telescope — don't oversell
   any "alien system" image as more than it is.

## 3. Script — src/mindwired-doc/docs/projecthailmary.json
43 scenes. Structure: cold open (real Oct-2014 NASA SDO sunspot event → the
book's premise → the movie → "we checked 3 claims," all real video) → sting →
title → 4 chapters (the microbe/astrophage → the engine/propulsion+relativity
→ the alien/Rocky's biology+language → the verdict) → coda → bridge (names
the live "Fermi Paradox" episode specifically) → subscribe. Voice field set
to `d46abd1d-2d02-43e8-819f-51fb652c1c61` (Grant, the current shared
DEFAULT_VOICE) — **not yet locked as final**: a separate audition
(quentin/theo/ronald vs. Grant) is in progress for Booked and could change
the shared default later; re-check `scripts/lib/cartesia.py` DEFAULT_VOICE
before the real VO build in case it moved. `python3 scripts/lint_tts_text.py`
passes clean.

## 4. Footage — genuinely the hardest part of this episode

**Wikimedia Commons is 403-blocked from this session's network egress.**
Confirmed directly (not inferred): a bare API call with the fetcher's own
User-Agent string still returns `403 Please respect our robot policy` from
`commons.wikimedia.org`. This is a session/environment-level block (Commons
likely rate-limiting this proxy's shared IP), not a code bug or a "no
matches" — a request to the same endpoint for a trivially common query
("Earth planet photograph") also came back empty. archive.org and openverse
ARE reachable, but returned "no usable results" for several specific niche
queries (real licensed hydrothermal-vent/tardigrade video specifically),
even though broader phrasing on openverse alone eventually surfaced real,
correctly-licensed **still photos** for both.

**No GEMINI_API_KEY either**, so the vision relevance auto-check never ran —
every fetch had to be eyeballed by hand (contact sheets + individual crops).
This caught real, confidently-wrong matches that titles alone didn't reveal:
an interview studio shot returned for "hydrothermal vent," the ISS for
"tardigrade," a meeting room for "Voyager launch," a NEOWISE asteroid graphic
for "Arecibo," a wind-tunnel test for "centrifuge," a black frame for a
generic "deep space" b-roll slot, and three unrelated people/helicopter
photos for "Carl Sagan." All caught and replaced or reworded — see the
commit history on this file for the full sequence. `audit_scene_relevance.py`
now reports **0 blocking**; the remaining ~30 warnings are almost all false
positives from its keyword-vs-title heuristic on images already confirmed
correct by eye (e.g. flagging genuine NASA solar-flare video as a "mismatch"
because the exact wording differs from the narration).

**Honest compromises made (not perfect matches, but real and accurately
framed) — revisit if the environment's access improves:**
- Centrifuge-training beat (e4) uses real NASA astronaut spacewalk photos
  instead of literal centrifuge footage (none surfaced).
- Arecibo beat (a6) reuses the real Deep Space Network antenna photos from
  the `deepspacestill` pool instead of an Arecibo-specific dish photo.
- Carl Sagan beat (a3) reuses a real starfield/Kepler photo rather than a
  portrait (no real, correctly-licensed Sagan portrait surfaced).
- A few image pools run above the usual ~3-scene cap (`sunsurface` ×6,
  `starfield` ×5, `deepspacestill`/`hydrothermalvent`/`spacecraftshielding`
  ×4 each) — a side effect of cascading substitutions when a fresh fetch
  failed. Not ideal, but every file is real and honestly captioned; no
  scene lies about what it shows.
- 4 non-hook-window images are also used in the already-shipped
  `fermiparadox` episode (flagged `X-REUSE`, not the blocking `HOOK-REUSE`
  since none are in the first-30s window) — generic NASA stock photos both
  pipelines independently fetched. Worth a fresh fetch later if Commons
  access is restored.

## 5. What's blocked and why

`scripts/lib/cartesia.py` (the only VO path `build_doc_vo.py` uses — no
fallback to Hume/ElevenLabs exists in this script) hard-exits without
**CARTESIA_API_KEY**. No `.env` existed in this session at all; only
`HUME_API_KEY`/`HUME_SECRET_KEY` were supplied, which this pipeline doesn't
use. Without real VO clips there is no manifest (`build_doc_vo.py` produces
it from real clip durations), and without a manifest the comp can't be
registered in `Root.tsx` (it imports the manifest statically), so nothing
downstream — preflight, stills, the render — can run yet.

**GEMINI_API_KEY** and **REPLICATE_API_TOKEN** are also unset (relevant to
the separate, paused Booked/Marlowe work — not required for this episode's
remaining steps, only for its optional footage vision-check).

## Next steps (in order, once CARTESIA_API_KEY is available)
1. `python3 scripts/build_doc_vo.py projecthailmary --speed 0.96` — real
   narration, then the mandatory ear-check (splice hook+middle+last clips,
   listen).
2. `python3 scripts/audit_scene_relevance.py projecthailmary` and
   `python3 scripts/preflight_doc.py projecthailmary` — iterate to 0 blocking.
3. Register `ProjecthailmaryDoc` in `src/Root.tsx` (`MW_OUTRO`, mindwired
   channel branding), spot-check 3-4 stills.
4. ONE 4K render via `scripts/render_gce.sh` (or `render_and_master.py`
   locally) — windowed `bed_awe_*` music given the runtime, mindwired
   subscribe outro baked in.
5. SRT captions, `docs/metadata/METADATA-projecthailmary.md` (ctr-engine Run
   B against the locked package in `TOPIC-QUEUE.md`), 3 built thumbnails,
   Shorts funnel cut.
6. File rename to the real title at repo root per the mp4-filename-is-title
   convention; commit everything except the multi-GB master.
