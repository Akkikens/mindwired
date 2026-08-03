# TUNGUSKA EVENT — "The Biggest Explosion in History Left No Crater" (mindwired)

Single-file summary of everything done on this episode. Read `CLAUDE.md` first for
the production manual; this doc is the episode-specific state.

## Status: 4K RENDER DONE, VERIFIED — Shorts done — thumbnail image / upload remain

**Verified:** 1016.5s duration (30,494 frames @ 30fps, exact match), 3840x2160,
mastered -14.1 LUFS (windowed `bed_awe_pulsar.mp3`). Mid-body frame confirms
the real Kulik-expedition flattened-forest photo with its caption; the
final-render frame at the fixed `bridge` scene confirms the black-screen bug
caught during spot-check is genuinely fixed in the actual master (real photo,
not black); outro frame confirms the mindwired subscribe outro baked in
correctly. Final file: `mindwired_The Biggest Explosion in History Left No
Crater.mp4` (2.34 GB) at repo root.

## Files
| What | Path |
|---|---|
| Fact base (GATE — every script line traces here) | `docs/planning/CLAIMS-tunguska.md` |
| Doc spec (83 scenes) | `src/mindwired-doc/docs/tunguska.json` |
| Dossier concept sidecar | `src/mindwired-doc/docs/tunguska.dossier.json` |
| Comp registration | `src/Root.tsx` -> `TunguskaDoc` (MW_OUTRO baked, 527f; total 30,494f = 16:56) |
| Icahn validation | memory `icahn-tunguska-event` |
| Metadata package | `docs/metadata/METADATA-tunguska.md` |
| SRT + chapters | `mindwired_tunguska.srt` (165 cues, 16:34 body) |
| QA spot-check stills | `out/qa/tunguska_f60.png`, `_f7600.png`, `_f15200.png`, `_f29800_fixed.png` |
| Render launch log | `out/tunguska_gce_launch.log` |
| Rendered master (pending) | `out/tunguska_gce.mp4` |

## Why this topic
Icahn-validated 2026-08-02 (memory `icahn-tunguska-event`) after confirming the
entire prior mindwired queue (Astronauts Scared, ISS deep-dive, Space Sounds,
Mariana Trench, 8 Real Planets, Unsettling Aliens, NASA UFO Files) was already
shipped or fully rendered. Won a fresh 4-topic sweep (Antikythera Mechanism,
Georgia Guidestones, Skinwalker Ranch) on the cleanest combination of proven
demand + zero paranormal-framing risk + no channel-diversity overlap (Skinwalker
Ranch had stronger raw numbers but was deliberately passed over to avoid
stacking a second UFO-adjacent long-form right after NASA UFO Files).

## Recognition bridge — mandatory, read before touching packaging
**Recognition is only 2/3.** Every title/thumbnail/description must lead with
the "biggest explosion in recorded history had no crater and no meteorite"
superlative — never open on the bare word "Tunguska" (it's fine inside the
video and in tags/search metadata, just not the hook). See
`docs/metadata/METADATA-tunguska.md` for the exact title/thumbnail package
built around this constraint.

## Sensitivity notes
None — 1908 event, no living parties, cause is settled mainstream science
(atmospheric airburst). Fringe theories (mini black hole, antimatter, alien
spacecraft) are handled as attributed-never-asserted curiosities that the real
science then answers on screen, via 6 `dossier:true` reconstruction cutouts
(anonymous, no identifiable faces, per DOSSIER-SCENES.md's composition rules).

## Production notes / gotchas hit
- **Caught a real black-screen violation during the mandatory spot-check
  stills** (this session's most important QA save): the `bridge` scene (the
  verbal next-video callout, "Watch next: 'The Pilot Who Said It Was Not From
  This World.'") had no `img` field and rendered as a bare black screen with
  text — a direct violation of the channel's hard no-black-screen rule.
  Fixed by adding `img: "kulik_fallen_trees"` (matching the coda scenes
  immediately before/after it), rebuilt the manifest, re-ran preflight (still
  0 blocking), and re-rendered the still to confirm the fix. **Lesson: the
  automated pre-render gates (preflight_doc.py, audit_scene_relevance.py) do
  NOT check for missing img on non-chapter/kinetic scene types like `bridge`
  — the mandatory "spot-check 3-4 stills and LOOK at them" step in the
  doc-episode skill is what actually catches this, not the automated gates
  alone.** Worth adding an explicit bridge/coda img check to preflight_doc.py.
- The verbal bridge names a real, already-shipped video by its exact title
  ("The Pilot Who Said 'It Was Not From This World'" — see
  `docs/metadata/METADATA-nasaufofiles.md`), not a fabricated one.
- Footage-fetch caught and fixed 8 blocking issues: 6 missing dossier cutouts
  (generated via `gen_doc_dossier.py tunguska --all`) and one over-length
  (31-word) cold-open hook line, trimmed to 25 words while preserving the
  exact Fern-formula date->location->named-person->action shape, then
  re-synthesized just that one VO clip.
- Remaining warnings (11 preflight / 53 full-audit) individually verified as
  false positives or accepted thin-pool tradeoffs — see the gates-stage
  summary in this session's workflow journal for the full per-warning
  reasoning (e.g. the L'Aigle 1803 meteorite specimen photo reused across 4
  "history of meteorite science" beats, the dossier UNSOURCED flags being
  expected/documented behavior per DOSSIER-SCENES.md).
- Windowed music bed: `bed_awe_pulsar.mp3` (cosmic-wonder tone family).

## What's left before publish
1. ~~Wait for the GCE render~~ — DONE, verified (see Status above).
2. ~~Extract and view a mid-body frame, outro frame, and re-check the fixed
   bridge scene~~ — DONE, all three confirmed correct in the actual master.
3. **Akshay should listen to a VO sample before this goes live** — the
   automated pipeline validated VO via ffprobe/silencedetect only, not a full
   human ear-check, per this session's full-autonomy instruction.
4. ~~Cut the 4 funnel Shorts~~ — DONE: `TunguskaShort1-4` registered in
   Root.tsx and rendered to `out/shorts_final/TunguskaShort1-4.mp4`
   (74.0s/50.9s/90.0s/98.0s). Hook cards spot-checked (cyan mindwired accent,
   correct text, recognition-bridge framing honored). Post 1/day, pinned
   comment on each names the long-form by title.
5. ~~Rename the final file~~ — DONE: `mindwired_The Biggest Explosion in
   History Left No Crater.mp4` (2.34 GB) at repo root.
6. Build the actual thumbnail image (concept + GPT prompt in
   METADATA-tunguska.md; no image generator wired into this repo).
7. Commit doc spec, manifest, CLAIMS, metadata, SRT, this handoff (never the
   multi-GB master).
8. Upload not done — user's explicit scope for this session was render +
   package only.

Full production narrative: memory `tunguska-episode` (to be written once the
render/verification is fully confirmed).
