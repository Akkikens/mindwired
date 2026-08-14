# OTZI — episode handoff (mindwired)

**STATUS (2026-08-14):** 4K GCE render IN FLIGHT (`out/otzi_gce_launch.log`);
everything else built and gated. Icahn PASS 2026-08-14 (memory `icahn-otzi`).
All gates green: TTS lint clean · relevance audit 0 blocking (warnings
individually verified: proper-noun-title false positives + accepted
generic-stock class) · preflight 0 blocking · 7 comp stills eyeballed ·
VO ear-check sample sent to Akshay (out/qa/otzi_vo_sample.mp3).

## Files

| What | Where |
|---|---|
| Doc spec (85 scenes, 15.1 min body) | `src/mindwired-doc/docs/otzi.json` |
| Manifest | `src/mindwired-doc/docs/otzi.manifest.json` |
| Fact base (142 claims, 50 corrections) | `docs/planning/CLAIMS-otzi.md` |
| Comp | `OtziDoc` in Root.tsx (MW_OUTRO baked) |
| Render (when done) | `out/otzi_gce.mp4` → rename to `Something in the Iceman Is Still Alive.mp4` |
| Packaging | `docs/metadata/METADATA-otzi.md` |
| Thumbnails (3 BUILT) | `out/thumbs/otzi_A/B/C.png` |
| Funnel Shorts (4) | `OtziShort1-4` → `out/shorts_final/OtziShort<N>.mp4` |
| Drip plan | `docs/publishing/SHORTS-SCHEDULE-otzi.md` (dates = publish day +1..+4) |
| Assets + licenses | `public/shorts/otzi/` + `images/ATTRIBUTION.md` |
| Music | windowed `bed_awe_singularity.mp3` (Yellowstone used eventhorizon, Tunguska pulsar — no repeat) |

## Honesty rules baked in (do not soften in packaging)

- **The title claim is scoped on screen and in the script (scene i8):** the
  living things are cold-adapted glacial yeasts ON/IN the mummy — "not his
  cells, his passengers." Never imply his own tissue lives.
- **Cause-of-death is presented as a history of reversals** (2001 hours →
  2007 minutes → 2025 hours), each attributed to its actual paper/team.
- **Every murder theory is attributed, never asserted** (Horn/NYT 2017,
  Leitner 2007, Loy 2003 + "never independently verified"). Living
  researchers: Horn, Zink, Maixner, Sarhan, Samadelli, Villa, Lynnerup,
  Rühli, Coia, Vallazza, Erika Simon — attributed-never-asserted throughout.
- **The "curse" appears only as a debunked tabloid legend** (Spindler's
  "load of rubbish" is the voice of the beat). Helmut Simon's death is told
  factually — on the Gamskarkogel, ~200 km from the find site (the "died
  near the same spot" tabloid line is geographically false and excluded).
- **Replicas are captioned RECONSTRUCTION**; real-mummy imagery appears ONLY
  via CC BY paper figures (Villa IJLM 2025; Sarhan Microbiome 2026). The
  Sci Rep 2025 + Cell Genomics 2023 figures are CC BY-NC-ND — cited as facts,
  never shown. Museum/Eurac press images = permission-only, not used.

## What's left before publish

1. Verify the GCE master: duration ≈ 16:43 (30,139f body + 527f outro ≈
   1022s), 3840×2160, −14 LUFS line in log, mid-frame + outro-frame eyeball.
2. Whisper SRT from the actual master; rename the pair to
   `Something in the Iceman Is Still Alive.mp4/.srt` at repo root.
3. Upload with METADATA-otzi.md (3 thumbs → Test & Compare; single-video end
   screen → Everest bodies, per the verbal bridge).
4. Paste the Everest long-form's real URL into METADATA + this episode's
   pinned/MORE FROM (still owed from Akshay: memory `mindwired-published-urls`).
5. Set real dates in SHORTS-SCHEDULE-otzi.md (publish day +1..+4) and drip.
6. 48h launch diagnosis (also still owed: everestbodies + yellowstone
   diagnoses, blocked on Studio numbers — LAUNCH-LESSONS 2026-08-12/14).

## Wave calendar

**Sept 19, 2026 = 35th anniversary of the discovery** (Ötzi-Dorf Umhausen
festival announced). If Akshay wants to hold the upload for the wave,
early-to-mid September is the ideal slot; ratios in `icahn-otzi` are
point-in-time (recheck live if production slips past ~2026-08-28).
