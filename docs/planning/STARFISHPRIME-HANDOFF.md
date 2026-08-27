# Starfish Prime / Operation Fishbowl — episode handoff (mindwired)

**STATUS (2026-08-24): RENDERED, ready for Akshay's review + upload.**
4K (3840×2160), 504.7s (8:24.7), −14.0 LUFS. Final: `The Day America Nuked
Space.mp4` at repo root.

**Render war story (see memory `starfishprime-video-10fps-bug` for full
detail)**: GCE failed 3x and a plain local render failed 2x more with a
misleading "font delayRender timeout" error. Real causes, two of them: (1)
all 7 hand-cut archival clips were left at the source's native 10fps instead
of conformed to the comp's 30fps — fixed by re-transcoding with `fps=30`;
(2) a genuine, still-not-fully-diagnosed intermittent font-loading race that
gets more likely to trigger the longer a single continuous render process
runs. Worked around by splitting the whole render into 61 chunks of 250
frames each (each its own fresh `npx remotion render` process), concatenating
with `ffmpeg -f concat -c copy` (verified exact 15,053-frame count, no
splice glitches at multiple checked boundaries), then running the windowed-
music master pass on the concatenated file. Zero chunks needed a retry once
split this small.

Icahn PASS (memory `icahn-starfishprime`) — winner of a live 3-candidate
sweep (Palomares/Azorian/Starfish Prime). Fresh 5.2:1/601K-view corroborator
proves the "US nuked space" framing pulls now; live 2024-2026 currency via
Russia's alleged space-based nuclear ASAT weapon (real reporting cites
Starfish Prime as the historical precedent).

## Files

| What | Where |
|---|---|
| Doc spec (42 scenes, ~7.3 min narration) | `src/mindwired-doc/docs/starfishprime.json` |
| Manifest | `src/mindwired-doc/docs/starfishprime.manifest.json` |
| Fact base (8 data corrections, 7 sections) | `docs/planning/CLAIMS-starfishprime.md` |
| Comp | `StarfishPrimeDoc` in Root.tsx (MW_OUTRO baked) |
| Render log | `out/starfishprime_gce_launch.log` |
| Assets + licenses | `public/shorts/starfishprime/{images,video}/ATTRIBUTION.md` |
| Music | windowed `bed_tension_falsevacuum.mp3` (Key Bridge used `rud` in between — no consecutive repeat) |
| Funnel Shorts | NOT YET BUILT |
| Packaging (METADATA/thumbnails) | NOT YET BUILT |

## What makes this episode different from the backlog

**First episode with the complete 2026-08-22 craft overhaul applied**:
narrator is Grant (neutral American, the direct answer to real viewer
accent complaints), every clip ran through the new pronunciation layer and
broadcast-polish chain (visible as `"polished": true` in the build log), and
the new 4-voice type system (Archivo Expanded / Spectral / IBM Plex Mono /
Inter) is rendering for the first time on real production content — verified
via spot-check stills, not just assumed from code.

## Real-footage sourcing note (for future footage-fetch passes)

The automated `fetch_doc_footage.py` returned **zero usable results** for
every prefix under niche `history` (matches the pattern already logged in
memory `icahn-starfishprime` from the validation-stage footage probe). All
footage in this episode was hand-fetched:
- Video: hand-cut directly from **`StarfishPrimeInterimReportByCommanderJTF8`**
  (archive.org, PD) — the real declassified detonation/aurora/launch reel.
  `JTF8PresentsOperationDominicJohnstonIsland` (also real PD) repeatedly
  failed to download from archive.org (500 errors / truncated transfers,
  3 attempts) — not used; not a licensing problem, just a flaky transfer.
- Images: hand-fetched via direct Wikimedia Commons API category searches
  (Johnston Atoll, Operation Argus/USS Norton Sound, Ariel 1, the real
  Kennedy LTBT-signing photo, a real Starlink constellation image for the
  2024 coda) — free-text Commons search returned mostly noise (PDFs,
  postage stamps); category-member search worked much better for this
  1960s-Cold-War-era topic.

## Known accepted warnings (preflight — 0 blocking, all reviewed)

All flagged as "MISMATCH"/"WEAK" by `audit_scene_relevance.py` because its
keyword-matcher compares narration against the archive reel's generic title
("Starfish Prime Interim Report By Commander JTF-8") rather than the actual
clip content — every clip was individually verified by scrubbing frames
before use (see video/ATTRIBUTION.md for exact in-reel timestamps).
Genuinely reviewed and accepted, not skipped.

## What's left before publish

1. Verify the finished render once GCE completes: duration, resolution,
   −14 LUFS, mid-frame + outro-frame stills.
2. Generate SRT via `whisper_srt.py`.
3. **Akshay: listen to the VO ear-check sample** and confirm Grant + the new
   polish chain read well on a full episode, not just the audition clips.
4. Build 3 thumbnails (House Style 2.0) + `METADATA-starfishprime.md`.
5. Cut 3-5 funnel Shorts (candidate beats: the cold-open detonation reveal
   h1-h4; the Honolulu streetlight cascade c4a-c4d; Telstar's slow death
   c6a-c6d; the live 2024 Russia-ASAT coda c8a-c8e).
6. Rename final render to the actual title, bare, at repo root.
7. Note the honest length (~7.6 min total incl. outro) — shorter than the
   channel's 15-25 min preference; this is the real verified material's
   natural length for this topic, same tradeoff flagged on Apollo 13.
8. This is now the **8th** long-form in the "rendered, awaiting upload"
   backlog once this render completes — flag to Akshay before starting a 9th.
