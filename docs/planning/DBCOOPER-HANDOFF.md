# D.B. COOPER — production handoff (2026-08-16/19, Black Box Breakdown)

**STATUS: RENDER-READY, VERIFIED.** Master: 505.9s (8:26), 3840×2160, −14.1
LUFS, windowed `bed_tension_falsevacuum.mp3` (rotates off Kursk's
`bed_tension_rud`). Whisper SRT cut, pair renamed at repo root. **This is a
demand-override production — Icahn KILLED this topic** (memory
`icahn-dbcooper`; saturated, no fresh outlier, no genuine breakthrough), **produced
anyway per Akshay's explicit request.** All gates green otherwise: TTS lint
clean · relevance audit 0 blocking · preflight 0 blocking · 10 comp stills
eyeballed · VO ear-check sample sent to Akshay
(`out/qa/dbcooper_vo_sample.mp3`) · 4 funnel Shorts rendered + delivered.

## Files

| What | Where |
|---|---|
| Doc spec (43 scenes, 8.2 min body) | `src/mindwired-doc/docs/dbcooper.json` |
| Fact base (70 claims, 12 corrections) | `docs/planning/CLAIMS-dbcooper.md` |
| Comp | `DbCooperDoc` in Root.tsx (BB_OUTRO baked) |
| **Master (ready to upload)** | `The Only Unsolved Hijacking in American History.mp4` + `.srt` at repo root |
| Packaging | `docs/metadata/METADATA-dbcooper.md` |
| Thumbnails (3 BUILT) | `out/thumbs/dbcooper_A/B/C.png` |
| Funnel Shorts (4, delivered) | `DbCooperShort1-4` → `out/shorts_final/DbCooperShort<N>.mp4` |
| Drip plan | `docs/publishing/SHORTS-SCHEDULE-dbcooper.md` |
| Assets + licenses | `public/shorts/dbcooper/images/ATTRIBUTION.md` + `video/ATTRIBUTION.md` |
| Music | windowed `bed_tension_falsevacuum.mp3` |

## Bugs caught mid-production

1. **Two missing video files still referenced.** h2/h4 pointed at `b727_2.mp4`
   and `b727_4.mp4` — files that had been moved to `unused/` earlier as wrong
   content (a China Airlines 747, an unrelated alarm-clock video) but the
   script wasn't updated. Preflight caught this as a hard block. Retargeted
   to the two real remaining vintage-tarmac clips.
2. **Generic charcoal-portrait sketches masquerading as the FBI composite.**
   The auto-fetcher's "sketch" pool returned stock photos of unrelated
   people's faces, not D.B. Cooper's actual FBI composite. Replaced with the
   real FBI Composite A/B sketches (Wikimedia Commons, Public domain).
3. **Wrong-aircraft stock photos** (a KLM 787, a modern Boeing 737 nose, an
   Indonesian-labeled cabin door) in the airstair pool. Replaced with the
   real Northwest Orient 727 and its actual rear-airstair mechanism (Commons,
   CC BY 2.5/GFDL).
4. **`forest_1.mp4` was 1940s wheat-harvest farm-machinery footage**
   ("American Harvest"), not Pacific Northwest forest. Caught by eyeball,
   removed; retargeted to the real PD Molalla River aerial footage.
5. **Cross-episode reuse** — `tie_1.jpeg` was also used in the Concorde
   episode (reads as channel-wide slop). Replaced with a fresh fetch.

## Honesty rules baked in (do not soften — the entire premise depends on this)

- **The case is formally unsolved.** The FBI suspended active investigation
  July 8, 2016 and has never confirmed any suspect. Stated explicitly and
  repeatedly in the script (h5, e1, e2, coda2).
- **Every one of the 7 named suspects is attributed-never-asserted** — each
  segment states who proposed the theory and why the FBI/independent
  investigators ruled them out.
- **The 2026 "DNA confirms his identity" clickbait claim is explicitly named
  and refuted** (scene e4), not platformed or left ambiguous.
- **No real ATC audio exists for this case and none is claimed** — the
  RadioScene/recreation machinery was NOT used since no primary audio
  survives; the script narrates the hijacking without fabricating audio.

## What's left before publish

1. ~~Verify GCE master~~ DONE.
2. ~~Whisper SRT + rename~~ DONE — pair at repo root, ready to upload.
3. Upload with METADATA-dbcooper.md (3 thumbs → Test & Compare).
4. Paste the real Kursk URL into MORE FROM once it's confirmed published
   (Kursk was confirmed published this session but no URL was captured yet).
5. Set real dates in SHORTS-SCHEDULE-dbcooper.md and drip.
6. **Since this is a demand-override production, its real launch numbers are
   informative data** — did the Icahn kill verdict hold, or did the honest
   "still unsolved" differentiation angle actually work? Feed the answer
   back into `icahn-needs-currency-filter`-style lessons regardless of
   outcome.
