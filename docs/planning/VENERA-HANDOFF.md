# VENERA — episode handoff (mindwired)

**STATUS (2026-08-20): PUBLISHED.** Master mp4 no longer on local disk
(already uploaded and cleared); caption archived to
`archive/captions/The Only Photos Ever Taken on Venus.srt`. Add the real
YouTube URL to `mindwired-published-urls` memory and this file once handy.

Icahn PASS-WITH-CONDITIONS (memory `icahn-venera`). All gates
green: TTS lint clean · relevance audit 0 blocking · preflight 0 blocking ·
9 comp stills eyeballed · VO ear-check sample sent to Akshay
(`out/qa/venera_vo_sample.mp3`) · 4 funnel Shorts rendered + delivered.

## Files

| What | Where |
|---|---|
| Doc spec (60 scenes, 12 min body) | `src/mindwired-doc/docs/venera.json` |
| Manifest | `src/mindwired-doc/docs/venera.manifest.json` |
| Fact base (160 claims, 46 corrections) | `docs/planning/CLAIMS-venera.md` |
| Comp | `VeneraDoc` in Root.tsx (MW_OUTRO baked) |
| **Master (ready to upload)** | `The Only Photos Ever Taken on Venus.mp4` + `.srt` at repo root |
| Packaging | `docs/metadata/METADATA-venera.md` |
| Thumbnails (3 BUILT) | `out/thumbs/venera_A/B/C.png` |
| Funnel Shorts (4, delivered) | `VeneraShort1-4` → `out/shorts_final/VeneraShort<N>.mp4` |
| Drip plan | `docs/publishing/SHORTS-SCHEDULE-venera.md` (dates = publish day +1..+4) |
| Assets + licenses | `public/shorts/venera/` + `images/ATTRIBUTION.md` + `video/ATTRIBUTION.md` |
| Music | windowed `bed_awe_laniakea.mp3` (Ötzi/singularity, Yellowstone/eventhorizon, Tunguska/pulsar — no repeat) |

## Bug caught mid-production: a mislabeled Commons asset

The file titled "Cut-away model of a Soviet Venera 12 lander.jpg" on Wikimedia
Commons is **not** a Venera lander — the model is stamped "СОЮЗ" (Soyuz) and
its placard reads "СПУСКАЕМЫЙ АППАРАТ" (generic descent vehicle). Caught at
the thumbnail-generation eyeball step, not by any automated gate — the
relevance auditor didn't flag it because the Commons title matched the doc's
`cutaway` pool name. Moved to `public/shorts/venera/unused/
MISLABELED_soyuz_not_venera.jpg`, all 9 scene references retargeted to the
`museum` pool (verified real Venera lander replicas), attribution line
removed. **Lesson: Commons file titles are not self-verifying — eyeball the
actual pixels, especially for museum/replica photos, before trusting a title
string.** Banked to memory.

Also recurring: the ffmpeg TIF/GIF→JPEG RGB-colorspace bug (same as Ötzi) hit
20 files this time — fixed by re-saving through PIL before the first still
render crashed on it.

## Honesty rules baked in (do not soften in packaging)

- **The Ksanfomaliti anomaly is attributed-never-asserted throughout**
  (scenes d1-d7): his claim is stated as his own interpretation, the debunk
  (lens caps + processing noise) is stated as the finding, "never replicated,
  never confirmed" closes the chapter. Living-person care: Stryk, Lakdawalla,
  Hill (the debunkers) attributed only to their published words.
- **The 2026 budget wedge is stated as unresolved, not settled** (scene e5):
  the FY27 fight was live in Congress as of 2026-08-16 — if it resolves
  before publish, recheck the framing (still honest either way, but a
  resolution strengthens the pinned-comment update option).
- **JWST-cannot-see-Venus guardrail respected** — no such claim anywhere in
  the script (verified against CLAIMS-venera.md across all 5 research
  dimensions).
- **No Soviet newsreel, no Mitchell/Stryk reprocessed panoramas, no
  recolorized Commons files** — every real-mummy-equivalent visual (the
  Venera panoramas themselves) is a plain PD/CC-BY original scan.
- **Generic NASA hardware-test b-roll (chamber tests, Orion vac-chamber
  footage) is used under engineering narration but never captioned as
  archival Venera footage** — logged explicitly in
  `public/shorts/venera/video/ATTRIBUTION.md` as "GENERIC, NOT Venera-specific."

## What's left before publish

1. ~~Verify the GCE master~~ DONE — 799.7s, 3840×2160, −14.1 LUFS confirmed.
2. ~~Whisper SRT + rename~~ DONE — pair is at repo root, ready to upload.
3. Upload with METADATA-venera.md (3 thumbs → Test & Compare; single-video
   end screen → the Ötzi episode, per the verbal bridge).
4. ~~Paste the Ötzi long-form's real URL~~ DONE — https://youtu.be/4sataIWXFqc
5. Set real dates in SHORTS-SCHEDULE-venera.md (publish day +1..+4) and drip.
6. Recheck the FY27 budget fight status right before publish — update the
   pinned comment if Congress resolves it either way.
7. 48h launch diagnosis (still owed on Everest/Yellowstone/Ötzi too).
