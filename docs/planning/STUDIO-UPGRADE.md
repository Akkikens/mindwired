# STUDIO-UPGRADE — five-pillar audit + build log (2026-07-18)

Goal: make the doc engine (Black Box + mindwired long-forms) sound and move like a
real studio production. Audit ran as two parallel code audits (doc engine +
mastering, viral engine + shared libs). This file is the ranked backlog and the
record of what shipped.

## Audit — where the studio actually stands

**What's already strong (don't rebuild):**
- Viral shorts engine has the whole motion vocabulary: named camera moves
  (`src/viral/lib/camera.ts`), shot recipes (`recipes.ts`), tone→motion/pacing/
  grade grammar (`tone.ts`), animated grain + parallax Backdrop, hook_lab
  generate→score→pick loop (`scripts/hook_lab.py`, HOOK-LAB.md).
- Mastering: two-pass −14 LUFS loudnorm + sidechain-ducked music
  (`scripts/lib/master.py`), including `mix_music_windowed()`.
- Doc pipeline discipline: idempotent per-scene VO, manifest-driven timing,
  image audits, evidence engine, ONE-render policy with baked outro.

**The gaps (ranked by impact on how videos look/sound/retain):**

| # | Gap | Evidence | Impact |
|---|---|---|---|
| 1 | **Zero SFX anywhere.** No `public/sfx/`, no sfx field in any schema. Radio beats are silent except VO; chapter cards, stat reveals, transitions all mute. | audit §audio | Every episode sounds like narration over a slideshow |
| 2 | **Doc engine music is post-render ffmpeg only**; `render_and_master.py` has no `--windows` flag, so windowed scoring (the standing rule for long docs) needs a hand-written one-off script per episode. No swell/drop tied to beats. | render_and_master.py:49-70 | Music either drones (viewer complaint) or takes manual work |
| 3 | **Doc engine motion ≈ Ken Burns only.** Fade-to-black between every scene, no crossfade, no grain/grade layer, VideoScene fully static, none of the viral engine's camera grammar reaches DocWide. | DocWide.tsx:163-185 | The "slideshow feel" on the channel's flagship format |
| 4 | **No preflight validator.** Missing img prefixes → silent black frames; missing videos → render-time 404; empty Cartesia mp3s → duration 0.0 accepted; stale manifests; diagram typos → blank scene; gen_doc_srt duplicates LEAD/HOLD by hand. | build_doc_vo.py:33, DocWide.tsx:168-169, gen_doc_srt.py:15 | A render once aborted on a stale manifest ref; failures are silent until CPU is spent |
| 5 | **No single episode command** — the runbook is a doc, not a script; gates are skippable by forgetting. Hook discipline exists for Shorts (hook_lab) but not enforced for docs. | BLACKBOX-PIPELINE-SPEC.md | Reliability depends on operator memory |

## Ranked backlog → what ships in this pass (P2/P3)

1. **SFX system** (Pillar 1) — `scripts/gen_sfx_kit.py` synthesizes an owned, $0
   core kit into `public/sfx/` (radio key-up/key-down squelch, radio static bed,
   cockpit hum, sub-bass stat hit, chapter boom, whoosh, riser, heartbeat, alarm,
   ocean/wind ambience — all ffmpeg-synthesized, license-clean, logged in
   `public/sfx/LICENSES.md`). DocWide gains a data-driven `sfx` scene field plus
   automatic cues: RadioScene = key-up + static bed + key-down; ChapterCard =
   boom; `stat` chip = sub-bass hit at reveal. All mixed inside the comp well
   under VO → rides the ONE render; loudnorm still finishes the job.
2. **Music scoring** (Pillar 2) — `--windows auto` on `render_and_master.py`:
   windows computed from the doc JSON + manifest (cold open, chapter
   transitions, closing) via shared timing lib `scripts/lib/doctiming.py`
   (kills the LEAD/HOLD duplication in gen_doc_srt.py). Default bed gain −20 dB.
3. **Motion system** (Pillar 3) — DocWide: per-scene `camera` moves with
   tone-appropriate defaults (push/pull/drift, deeper Ken Burns), crossfade-soft
   entrances synced to whoosh SFX, film-grain + vignette grade layer over the
   whole comp, VideoScene drift + grade. Defaults chosen so an untouched doc
   JSON simply looks better; no schema breakage.
4. **Preflight validator** (Pillar 5) — `scripts/preflight_doc.py <slug>` BLOCKS
   on: img prefix not in manifest, manifest stale vs images dir, missing video
   files, unknown diagram names, zero/empty VO mp3s, missing durations, radio
   scene without radioLabel, unknown sfx names, un-linted spoken text
   (runs lint_tts_text). Warnings for hook-checklist violations.
5. **One-command pipeline** (Pillar 5) — `scripts/ship_doc.py <slug> <Comp>`:
   lint → radio_recreate → build_doc_vo → audit_doc_images → preflight → stills
   → ONE render_and_master (--music/--windows) → gen_doc_srt, with explicit
   human checkpoints before the render.
6. **Hook checklist** (Pillar 4) — docs/guides/HOOK-CHECKLIST.md enforced as
   preflight warnings (first-scene word cap, no greetings/logo-first, stat or
   shock element in the first beat, chapter-end cliffhanger present, verbal
   bridge before outro); hook_lab remains the variant generator.

**Showcase (P3):** the `radiotest` doc (US1549 RadioTest comp) — small, real,
already has docket audio — gets the full treatment as the before/after proof:
radio squelch/static beat, stat hit, chapter boom, grain+camera motion, windowed
bed. Verified with stills + a short frame-range render + LUFS probe.

**Deliberately NOT in this pass:** porting the full recipes.ts vocabulary into
DocWide (diminishing returns vs risk), Freesound API fetcher (synth kit covers
the core; add a licensed fetcher when a specific episode needs a real-world
sound), retention-curve analytics ingestion (needs YT Studio data export).

## Change log (2026-07-18 — all six backlog items shipped + verified)

- `scripts/gen_sfx_kit.py` → 12 owned ffmpeg-synthesized SFX in `public/sfx/`
  (+ LICENSES.md). DocWide: `SfxCue`/`sfx`/`noAutoSfx` fields, `SceneSfx`
  player, auto cues (radio key-up/static-bed/key-down, chapter_boom, stat_hit).
- DocWide motion: `camera` field (push/pull/drift, smoothstep-eased, deeper
  Ken Burns range), VideoScene scale drift + grade, `GrainVignette` body layer.
- `scripts/lib/doctiming.py` — single Python mirror of LEAD/HOLD math;
  `gen_doc_srt.py` refactored onto it; `music_windows()` scores the bed to
  cold open / chapter transitions / closing and stops at body-end (outro-safe).
- `render_and_master.py --windows <slug>` — windowed bed without one-off scripts.
- `scripts/preflight_doc.py` — hard render gate (stale manifest, missing
  img/video/diagram, empty VO clips, unlabeled radio, unknown sfx, TTS lint)
  + hook-checklist warnings. Caught a REAL stale mh370 manifest on first run.
- `scripts/ship_doc.py` — the one-command episode pipeline (8 gates, human
  checkpoints, uses .venv-lipsync for TTS steps).
- `docs/guides/HOOK-CHECKLIST.md`; CLAUDE.md "Doc-engine studio layer";
  BLACKBOX-PIPELINE-SPEC Phase V→P updated.

**Verification:** RadioTest (US1549, 21s) ran the full ship_doc pipeline
end-to-end: all gates passed, ONE render, −24.1 → −14.1 LUFS, squelch bursts
measured at −21 dB RMS at each transmission start (pre-VO instants), static
bed audible between lines (−50 dB floor vs dead silence before), honesty label
verified in stills, grain/vignette subtle. mh370 `music_windows()` produced 11
sane windows over a 30-min body. No shipped episode re-rendered or altered.

**Next highest-impact move:** apply the layer to the next full Black Box
episode (the validated US1549 evidence pull is ready) and A/B the cold open
through hook_lab; then port the SFX/motion grammar to the viral shorts engine
(it has camera moves but still no SFX).
