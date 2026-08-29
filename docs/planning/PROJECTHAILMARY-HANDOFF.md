# PROJECT HAIL MARY — "The Real Science" (mindwired)

Single-file summary of everything done on this episode. Read `CLAUDE.md` first for
the production manual; this doc is the episode-specific state.

## Status: VO + PREFLIGHT + COMP DONE — 4K RENDER RUNNING on Akshay's local machine via GCE (packaging drafted, not yet finalized)

## Files
| What | Path |
|---|---|
| Fact base (GATE — every script line traces here) | `docs/planning/CLAIMS-projecthailmary.md` |
| Doc spec (43 scenes) | `src/mindwired-doc/docs/projecthailmary.json` |
| Icahn validation + locked package | `docs/planning/TOPIC-QUEUE.md`, entry "projecthailmary" (no `icahn-<slug>` memory entry — see note below) |
| Fetched images (33 real photos) | `public/shorts/projecthailmary/images/` + `ATTRIBUTION.md` |
| Fetched video (4 real NASA solar clips) | `public/shorts/projecthailmary/video/` + `ATTRIBUTION.md` (gitignored — not committed) |
| VO (43 clips, 10.4 min) + manifest | `public/shorts/projecthailmary/audio/` (gitignored) + `src/mindwired-doc/docs/projecthailmary.manifest.json` (committed) |
| Comp registration | `src/Root.tsx` → `ProjectHailMaryDoc` (MW_OUTRO baked) |
| Preflight | 0 blocking, 10 warnings (false positives / documented compromises — see below) |
| Rendered master | **RENDERING NOW** on Akshay's local Mac via `scripts/render_gce.sh` (GCE, not reachable from this remote session — see below). Lands at `out/projecthailmary_gce.mp4` on his machine, not this one. |
| Thumbnails (3 built files) | `out/thumbs/projecthailmary_A/B/C.png` — real NASA sunspot frame, House Style 2.0 |
| Metadata draft | `docs/metadata/METADATA-projecthailmary.md` |

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

## 5. VO — unblocked, done

`scripts/lib/cartesia.py` (the only VO path `build_doc_vo.py` uses — no
fallback to Hume/ElevenLabs exists in this script) needed **CARTESIA_API_KEY**
specifically; Akshay supplied one mid-session and all 43 clips synthesized
cleanly (10.4 min narration, no empty/silent clips). h1's hook line was
tightened post-synthesis (preflight's word-count check) and re-synthed with
`--only h1 --force` — if editing scene text after this point, always re-run
`build_doc_vo.py --only <id> --force` for that scene or the render will speak
stale narration (a real preflight-blocking check exists for this now).

## 6. Preflight fixes applied (worth knowing before touching the script again)
- **8 images were oversized** (up to 8256×5504 — real high-res NASA downloads)
  and would have timed out Remotion; downscaled every image over 2400px on its
  longest side.
- **Title card text didn't match the packaging title** (a known past bug
  class, per preflight's own swissair111 reference) — changed the on-screen
  title card to closely echo the locked title instead of a generic paraphrase.
- **Several image pools read as pure black once dimmed behind chapter/kinetic
  text** (deepspacestill, exoplanetreal, titanmoon, starfield all had at least
  one near-black member) — reassigned chapter-card scenes (title, c3, end) to
  pools confirmed bright enough (rocketengine, observatorynight, gpssatellite).
  One remaining low-severity warning: `sunsurface_2.jpg` (41/255) is still in
  the `sunsurface` pool used by kinetic scene v2 — acceptable, not near-black.
- **Hook (h1) was over 30 words** — tightened to 28, re-synthesized.
- Preflight now passes **0 blocking, 10 warnings** — the remaining warnings
  are the same false-positive keyword-vs-title mismatches already
  human-verified correct in Step 4 above, plus the documented non-hook-window
  cross-episode image reuse.

## 7. GCE render — NOT reachable from this remote session

No `gcloud` CLI exists in this container, and even after installing it,
**interactive `gcloud auth login` does not survive in this sandbox** — the
process gets killed while waiting on the verification code, across two
independent attempts (a FIFO-based stdin-keepalive technique that normally
works elsewhere). A GCP service-account key was also tried but was the wrong
credential type (Vercel's Workload Identity Federation config, not a real GCP
service-account JSON — unusable here).

**Resolution: Akshay is running the render himself**, locally, per this
repo's own documented convention for exactly this situation (see other
`*-HANDOFF.md` files' "only Akshay can run gcloud auth login" notes):
```
cd ~/mindwired   # his existing local clone
git checkout claude/best-video-project-lf3bau && git pull
scripts/render_gce.sh ProjectHailMaryDoc projecthailmary
# optionally: --music public/beds/bed_awe_<name>.mp3 --windows projecthailmary --music-gain-db -20
```
This lands the master at `out/projecthailmary_gce.mp4` **on his machine**, not
in this session — so the next session/agent picking this up needs him to
share that file, or needs to run the verification steps below itself once it
has the file.

## 8. Packaging — drafted, not finalized
Thumbnails (3 files, all built from a real NASA sunspot frame — the same
footage the cold open uses) and `docs/metadata/METADATA-projecthailmary.md`
are both done. Chapter timestamps came from `gen_doc_srt.py` (the real timing
source — never hand-computed). Two "MORE FROM mindwired" links are real,
confirmed URLs from `docs/planning/LAUNCH-LESSONS.md`'s publish log
(Tunguska, NASA UFO Files); the Fermi Paradox link (named in the episode's own
verbal bridge) has no confirmed URL anywhere in this repo — it's a
`[paste URL]` placeholder, fill in the real one before publishing.

## Next steps (in order)
1. **Verify the render once Akshay's GCE job finishes**: ffprobe duration
   (expect ~671s body + 527 frames outro ÷ 30 ≈ 11:28) and resolution
   (3840×2160 if he ran default 4K), extract and look at a mid-video frame and
   the last few frames (outro present?), confirm the −14 LUFS line in the
   render log.
2. Real SRT captions via `whisper_srt.py` against the actual master (word-
   accurate, digits not phonetic spellings) — needs the mp4, so needs his
   machine or the file shared back.
3. Fill in the Fermi Paradox URL in the metadata's MORE FROM block.
4. Shorts funnel (3-5 vertical cuts) via the shorts-funnel skill, once the
   master exists.
5. Final repo-root rename to the bare title + `.srt` pair (mp4-filename-is-
   title convention); commit everything except the multi-GB master itself.
