# APOLLO 13 — episode handoff (mindwired)

**STATUS (2026-08-22): RENDER-READY, awaiting Akshay's review + upload.**
Everything below is done: 4K master, SRT, 3 thumbnails, 4 funnel Shorts.

Icahn PASS (memory `icahn-apollo13`) — winner of an 8-candidate sweep
(Apollo 13, K2 2008, Grenfell Tower, Beirut port explosion, MV Sewol,
Fukushima, VW Dieselgate, Delphi murders) run after Fermi Paradox/Bermuda
Triangle/TWA800/Thai Cave Rescue/Key Bridge all landed in the "rendered,
awaiting upload" backlog. **Channel is mindwired, not Black Box** — this
repo's own standing rule routes NASA mission/spaceflight material to
mindwired (the SpaceX lunar-impact episode set the precedent); Black Box's
roster is aviation/maritime/industrial/corporate disasters with zero
NASA-mission precedent.

Research ran as a 7-agent Workflow (5 dimensions incl. a dedicated
strongest-cold-open scout, 2 adversarial fact-checks). The user gave an
explicit, emphatic instruction this session — "INTRO SHOULD BE THE STRONGEST
BEST VID IT SHOULD KEEP VIEWERS HOOKED" — so the cold open got a dedicated
hook-doctor pass before the script was locked.

## Sensitivity handling (do not soften or remove without asking Akshay first)

- **Jim Lovell died August 7, 2025**, at home in Lake Forest, IL, at 97. A
  coroner's report (Oct 29, 2025) attributed it to complications from a fall/
  hip fracture — **deliberately omitted from the narration** (states only
  that he died at home at 97) as the safer, still-accurate editorial choice.
  Never invents a Fred Haise quote reacting to the death (none exists on the
  record).
- 🧍 **Fred Haise, 92, is the sole surviving crew member.** Every claim about
  him is attributed and present-tense-cautious — see CLAIMS §correction 
  and WHO'S WHO section.
- **Never conflates the two 2026 films called "Odyssey"** — Avi Belkin's
  real Apollo 13 documentary (Tribeca, June 7, 2026) vs. Christopher Nolan's
  unrelated Homer-epic film of the same name (wide release July 17, 2026).
  Real coverage is still actively mixing these up; double-check before
  publish if any date/score gets pulled fresh.

## Files

| What | Where |
|---|---|
| Doc spec (70 scenes, ~13.4 min body) | `src/mindwired-doc/docs/apollo13.json` |
| Manifest | `src/mindwired-doc/docs/apollo13.manifest.json` |
| Fact base (11 data corrections) | `docs/planning/CLAIMS-apollo13.md` |
| Comp | `Apollo13Doc` in Root.tsx (MW_OUTRO baked) |
| **Master (DONE — 4K, −14.1 LUFS)** | `Everything You Know About Apollo 13 Is Wrong.mp4` + `.srt` at repo root (822.9s = 13:42.9 incl. outro; whisper SRT, 168 cues, one "Fred Hayes"→"Fred Haise" mistranscription fixed) |
| Packaging | `docs/metadata/METADATA-apollo13.md` |
| Thumbnails (3 BUILT) | `out/thumbs/apollo13_A/B/C.png` |
| Funnel Shorts (4, rendered) | `Apollo13Short1-4` → `out/shorts_final/Apollo13Short<N>.mp4` |
| Shorts drip plan | `docs/publishing/SHORTS-SCHEDULE-apollo13.md` |
| Assets + licenses | `public/shorts/apollo13/` + `images/ATTRIBUTION.md` + `video/ATTRIBUTION.md` |
| Music | windowed `bed_awe_pulsar.mp3` (last mindwired awe-bed was Fermi Paradox's eventhorizon; Thai Cave Rescue used the tension family — no consecutive repeat) |

## Footage: two full NASA/JSC documentaries manually sourced and cut

Unlike most episodes, the automated fetcher (`fetch_doc_footage.py`) can only
place *stills* — every real-motion scene in this episode was hand-cut from
two full public-domain NASA/JSC documentaries downloaded and scrubbed
directly:

1. **"Apollo 13: Houston, We've Got a Problem"** (archive.org
   `apollo13_houston_weve_got_a_problem`, NARA ARC 1155023) — real 1970 MOCR
   floor footage, flight-controller close-ups, and cabin interior footage.
   5 clips cut (`moccontrol_1-5.mp4`, `lmcabin_1-2.mp4`).
2. **"Apollo 13 Facts: Recovery part C"** (archive.org `Apollo_13_Part_C`) —
   the actual *live* 1970 splashdown/recovery broadcast feed, with NASA's own
   real-time captions ("LIVE FROM THE RECOVERY HELICOPTER") burned in. 3
   clips cut (`recovery_1-3.mp4`) — real parachute descent and the real Navy
   helicopter (tail "NAVY 402") approaching the floating capsule.

Both confirmed public domain directly via archive.org metadata (`creator:
NASA/JSC`, `rights: public domain`) before use. Full cut list + timestamps in
`public/shorts/apollo13/video/ATTRIBUTION.md`.

## Two real bugs caught during production (logged for future reference)

1. **28 of 70 scenes (40%) had no visual field at all** (`stat`/`cap`/`tone`
   only) — the exact black-screen bug documented on Key Bridge, recurring
   here because it was introduced fresh while writing this script rather
   than inherited. Caught by rendering spot-check stills at frames 0/7000/
   16000/23500 BEFORE the real render — two of four were bare black. Fixed
   by grepping the doc spec for `not any(img/video/exhibit/kinetic/chapter/
   sting/dossier)` (the exact 5-line check the Key Bridge handoff
   recommended) and assigning each of the 28 a real, already-fetched,
   topically-appropriate image. Re-verified via the same 3 frames — all
   fixed.
2. **The automated footage fetcher can only satisfy `img` prefixes, never
   `video` prefixes with bare names** — `fetch_doc_footage.py` requires the
   scene's `video` field to already be an exact `<prefix>_N.mp4` filename,
   which it then treats as a fetch target; a descriptive placeholder like
   `video: "moccontrol"` is silently skipped ("fetch it by hand"). All 10
   real video clips in this episode were manually cut and placed first, then
   the scene fields were repointed to the exact final filenames.

## Real-vs-movie corrections (the episode's spine — verify these on watch)

- Real: "Okay, Houston, I believe we've had a problem here" (Swigert, past
  tense, "I believe," "here") — not the movie's "Houston, we have a
  problem."
- Real: Kranz never said "Failure is not an option" during the crisis (it
  was written for the 1995 film); his real words are quoted instead.
- The insulation damaged inside oxygen tank 2 was **Teflon, not Kapton** —
  a factual correction caught during CLAIMS research, not the movie's error.
- The reentry blackout ran ~6-6.5 minutes, not the commonly-repeated "12
  minutes."

## What's left before publish

1. **Akshay: listen to the VO ear-check sample**
   (`out/qa/apollo13_vo_sample.mp3`) and review the 3 thumbnails + 4 Shorts.
2. **Test & Compare**: upload all 3 thumbnail variants at publish.
3. Note the episode's honest length (~13.4 min, shorter than the channel's
   15-25 min preference) — this is the real material's natural length, not
   padding; flagged in METADATA's Known Gaps section too.
4. Verified: render 822.9s @ 3840×2160, −14.1 LUFS; mid-frame (real Apollo 13
   LM-after-separation photo) and outro-frame (standard mindwired subscribe
   card) both eyeballed correct.
