# AMELIA EARHART — "They Had Her Radio Log. They Never Had Her Body." (Black Box Breakdown)

Single-file summary of everything done on this episode. Read `CLAUDE.md` first for
the production manual; this doc is the episode-specific state.

## Status: 4K RENDER DONE, VERIFIED — Shorts done — thumbnail image / upload remain

**Verified:** 1275.0s duration (38,250 frames @ 30fps, exact match), 3840x2160,
mastered -14.1 LUFS (windowed `bed_tension_falsevacuum.mp3`). Mid-body frame
confirms the real NARA radio-log exhibit with its citation caption; outro frame
confirms host Reid's Black Box subscribe outro baked in correctly.

**Note:** the automated GCE fetch failed 3x on a transient SSH reset (known
flake per doc-episode skill) — the render itself had already finished
successfully. Recovered manually: restarted the stopped VM
(`render-earhart-4913`), scp'd the master directly, verified it, then deleted
the VM. Final file: `mindwired_They Had Her Radio Log. They Never Had Her
Body.mp4` (2.30 GB) at repo root.

## Files
| What | Path |
|---|---|
| Fact base (GATE — every script line traces here) | `docs/planning/CLAIMS-earhart.md` |
| Doc spec (110 scenes) | `src/mindwired-doc/docs/earhart.json` |
| Dossier concept sidecar | `src/mindwired-doc/docs/earhart.dossier.json` |
| Comp registration | `src/Root.tsx` -> `EarhartDoc` (BB_OUTRO baked, 483f; total 38,250f = 21:15) |
| Icahn validation | memory `icahn-earhart` |
| Metadata package | `docs/metadata/METADATA-earhart.md` |
| SRT + chapters | `mindwired_earhart.srt` (198 cues, 20:50 body) |
| QA spot-check stills | `out/qa/earhart_f60.png`, `_f9500.png`, `_f19000.png`, `_f37500.png` |
| Render launch log | `out/earhart_gce_launch.log` |
| Rendered master (pending) | `out/earhart_gce.mp4` |

## Why this topic
Icahn-validated 2026-08-02 (memory `icahn-earhart`) after confirming the entire
prior Black Box queue (US1549, JAL123, Helios522, Chernobyl, AI171, MH370 x3,
737 MAX, Colgan 3407, AF447, United 93, Concorde, Tenerife, Titanic) was already
shipped or fully rendered. Won a live 3-topic re-check against Bermuda Triangle
and Dyatlov Pass Incident on strongest raw ratio (553.6:1 headline) and cleanest
3/3 recognition score.

## Sensitivity notes
Clean overall — 1937 event, no living survivors/accused, no corporate-blame
angle. The one honesty-critical constraint: **no real audio survives from 1937
radio technology** — every spoken Itasca radio exchange in the script uses a
`speaker` field so DocWide's RadioScene renders it as a clearly labeled
RECREATION, never as "actual recording." The TIGHAR Nikumaroro
castaway/artifact theory and the Japanese-capture theory are both handled
attributed-never-asserted (per CLAIMS-earhart.md's DATA CORRECTIONS block) —
do not edit any scene to assert either as settled fact.

## Production notes / gotchas hit
- **Black-screen catch during Root.tsx spot-check stills is a Tunguska issue, not
  this one** — Earhart's 4 spot-check stills (cold open USCGC Itasca photo, a
  real 1937 Luke Field ground-loop-crash photo, the actual NARA radio-log
  exhibit page, and the closing Earhart portrait + verbal bridge to MH370) all
  showed real imagery, no fix needed here.
- Footage-fetch pass caught and replaced several wrong-subject files during the
  gates stage: `declassification_2025_*` (was 1966-70 construction photos of
  the wrong building), a mislabeled `taraia_object_3.jpg` entry in
  ATTRIBUTION.md. Full detail in `public/shorts/earhart/images/ATTRIBUTION.md`.
- No freely-licensed real photo/video of the actual June 1, 1937 Miami send-off
  exists (checked twice) — scene c2_6 uses the verified `electra_burbank` photo
  pool instead of a Miami-specific one; documented as an accepted honesty
  tradeoff, not a defect.
- Two `dossier:true` reconstruction scenes used for genuinely unfilmable
  moments: the open-ocean ditching, and the 1940/41 forensic bone-examination
  table. First dossier-generation attempt hallucinated a realistic human face
  (forbidden by DOSSIER-SCENES.md's composition rules) — regenerated with a
  tighter prompt, verified face-free on the second pass.
- Windowed music bed: `bed_tension_falsevacuum.mp3` (dread/mystery tone family,
  matches the disaster-forensics lane). Rotate to a different tension bed on
  the next Black Box episode per the "don't repeat consecutive beds" rule.

## What's left before publish
1. ~~Wait for the GCE render~~ — DONE, verified (see above).
2. ~~Extract and view a mid-body frame and the outro frame~~ — DONE, both
   confirmed correct.
3. **Akshay should listen to a VO sample before this goes live** — the
   automated pipeline validated VO via ffprobe/silencedetect only, not a full
   human ear-check, per this session's full-autonomy instruction.
4. ~~Cut the 4 funnel Shorts~~ — DONE: `EarhartShort1-4` registered in Root.tsx
   and rendered to `out/shorts_final/EarhartShort1-4.mp4` (88.6s/110.8s/104.5s/
   94.3s). Hook cards spot-checked (orange Black Box accent, correct text).
   Post 1/day, pinned comment on each names the long-form by title.
5. ~~Rename the final file~~ — DONE: `mindwired_They Had Her Radio Log. They
   Never Had Her Body.mp4` (2.30 GB) at repo root.
6. Build the actual thumbnail image (concept + GPT prompt in
   METADATA-earhart.md; no image generator wired into this repo).
7. Commit doc spec, manifest, CLAIMS, metadata, SRT, this handoff (never the
   multi-GB master).
8. Upload not done — user's explicit scope for this session was render +
   package only.

Full production narrative: memory `earhart-episode` (to be written once the
render/verification is fully confirmed).
