# CARLA WALKER — production handoff (2026-08-16/19, Criminal Record)

**STATUS: RENDER-READY, VERIFIED.** Master: 456.8s (7:37), 3840×2160, −14.2
LUFS, windowed `bed_somber_redshift.mp3` (rotates off Dahmer's `bed_somber_kayak`).
Whisper SRT cut, pair renamed at repo root. Icahn PASS (memory
`icahn-carlawalker`). All gates green: TTS lint clean · relevance audit 0
blocking · preflight 0 blocking · 10 comp stills eyeballed (2 real accuracy
bugs caught and fixed — see below) · VO ear-check sample sent to Akshay
(`out/qa/carlawalker_vo_sample.mp3`) · 4 funnel Shorts rendered + delivered.

## Files

| What | Where |
|---|---|
| Doc spec (50 scenes, 6.4 min body) | `src/mindwired-doc/docs/carlawalker.json` |
| Fact base (60 claims, 16 corrections) | `docs/planning/CLAIMS-carlawalker.md` |
| Comp | `CarlaWalkerDoc` in Root.tsx (CR_OUTRO baked) |
| **Master (ready to upload)** | `The Killer Was in the File the Whole Time.mp4` + `.srt` at repo root |
| Packaging | `docs/metadata/METADATA-carlawalker.md` |
| Thumbnails (3 BUILT) | `out/thumbs/carlawalker_A/B/C.png` |
| Funnel Shorts (4, delivered) | `CarlaWalkerShort1-4` → `out/shorts_final/CarlaWalkerShort<N>.mp4` |
| Drip plan | `docs/publishing/SHORTS-SCHEDULE-carlawalker.md` |
| Assets + licenses | `public/shorts/carlawalker/images/ATTRIBUTION.md` |
| Music | windowed `bed_somber_redshift.mp3` |

## Two real accuracy bugs caught mid-production (not just gate false-positives)

1. **Age/photo mismatch.** Scene b2 introduces McCurley in 1974 at age 27,
   but the only real photo available is his 2020 arrest booking photo
   (clearly an elderly man). Showing the 2020 mugshot at the 1974
   introduction would have visually misled viewers about what he looked
   like at the time. Fixed: b2/h4 now use a neutral generic asset; the real
   mugshot is held back for the 2020 arrest/DNA-match reveal beats (d6, e1,
   g3) where it's accurate.
2. **False exhibit citation.** Scene f2 originally cited a generic pexels
   stock photo of a gavel as "Contemporaneous news photography, Tim Curry
   Criminal Justice Center, Aug 24, 2021" — an outright false claim (the
   asset probe confirmed a real courtroom photo exists in news coverage,
   but it was never actually fetched). Fixed: removed the exhibit/source
   claim, captioned as "(Illustrative courtroom image.)"

Both caught only by eyeballing the actual rendered stills, not by any
automated gate — **lesson for future episodes: an "exhibit" tag is a factual
claim about provenance and must be verified against the actual fetched file,
never assumed from a probe result.**

## Honesty rules baked in

- McCurley's real 1974 status (interviewed, passed a polygraph, cleared) is
  stated as documented record, not speculation.
- No crime-scene or autopsy detail beyond the single, plain, legally-necessary
  line (cause of death: strangulation).
- No victim photo — a widely-circulated 1974 photo of Carla Walker exists and
  is confirmed EXCLUDED per house policy, despite wide press availability.
- No crime reconstruction animation; only real photographs (mugshot,
  courthouse) + generic period texture (per CRIMINALRECORD-CHANNEL-BRIEF.md's
  opening-rule exception — state cases have no federal PD film pool).
- Rodney McCoy (surviving boyfriend, likely living) is named only for the
  documented facts of that night — no character/motive speculation.

## What's left before publish

1. ~~Verify GCE master~~ DONE.
2. ~~Whisper SRT + rename~~ DONE — pair at repo root, ready to upload.
3. Upload with METADATA-carlawalker.md (3 thumbs → Test & Compare).
4. Paste real MORE FROM links (Idaho murders, Dahmer episodes) + the real
   @WatchCriminalRecord subscribe deep-link once confirmed.
5. Set real dates in SHORTS-SCHEDULE-carlawalker.md and drip.
6. This is Criminal Record's 3rd episode — no prior launch-diagnosis loop
   exists yet for this channel; start banking one after this publishes.
