# HELIOS522 — "The Plane That Flew Itself for Three Hours" (Black Box Breakdown)

Single-file summary of everything done on this episode. Read `CLAUDE.md` first
for the production manual; this doc is the episode-specific state.

## Status: 4K RENDER DONE, VERIFIED — thumbnail/Shorts/commit remain

## Files
| What | Path |
|---|---|
| Fact base (GATE — every script line traces here) | `docs/planning/CLAIMS-helios522.md` |
| Doc spec (55 scenes) | `src/mindwired-doc/docs/helios522.json` |
| Dossier concept sidecar | `src/mindwired-doc/docs/helios522.dossier.json` |
| Comp registration | `src/Root.tsx` → `Helios522Doc` (BB_OUTRO baked, 483f) |
| Icahn validation | memory `icahn-helios522` (live re-check 2026-07-31, PASS) |
| QA stills | `out/qa/helios522_stills/` (all 55 scenes) + contact sheets |
| Rendered master | `out/helios522_gce.mp4` |
| Upload-ready copy | `mindwired_The Plane That Flew Itself for Three Hours (Helios 522).mp4` (repo root) |
| SRT | `mindwired_helios522.srt` |

## 1. Topic & voice — both explicit user choices this session
- Topic: live-re-validated 2026-07-31 across TWA 800 / Swissair 111 / Helios
  522 (memory `icahn-helios522`) — Helios 522 won on the only genuinely fresh
  corroborator (Mayday: Catastrophe Aérienne, Oct 2025) plus the strongest
  raw headline (837.7:1).
- Narrator voice: **Clarence — "Newsman"** (Cartesia voice
  `41534e16-2966-4c6b-9670-111411def906`), NOT the channel's usual
  `orion_veo_clone` default — Akshay asked to try an alternate documentary
  voice; sampled 4 candidates (Clarence, James, Derek, Roy), Clarence's
  "old-time-radio, 20th-century-historical" framing fit the forensic-
  documentary tone. Swappable later via `build_doc_vo.py helios522 --force`
  with a different voice ID if this doesn't land well after publishing.

## 2. The differentiation angle
NOT another "here's what happened" recap — the two-court verdict split
(Cyprus acquits everyone; Greece convicts three, then lets them buy their
way out with fines; the one man actually acquitted on appeal is the ground
engineer everyone blames) is the spine. Same evidentiary, attribute-never-
assert treatment as JAL123/AI171/United 93.

## 3. Research — 5-agent parallel fan-out (Workflow), synthesized into CLAIMS
One research agent independently downloaded and grep'd the actual 198-page
AAIASB report PDF directly rather than relying on secondary sources — this
caught several real corrections baked into CLAUDE-style DATA CORRECTIONS in
CLAIMS-helios522.md, most importantly:
1. The famous "F-16 intercepting the airliner" image every documentary uses
   (Commons file Helios522.png) is CGI, explicitly labeled as such by
   Commons — NOT a real photo. Not used in this episode.
2. The widely-circulated "passenger farewell text message" is a CONFIRMED
   HOAX (Greek police arrested the person who spread it) — excluded
   entirely, never referenced.
3. Two separate, real criminal prosecutions (Cyprus: all acquitted; Greece:
   3 convicted then fined, 1 — the ground engineer — acquitted on appeal) —
   never conflated in the script.
4. No real CVR audio was ever released (only the transcript) — any spoken
   version is a clearly-labeled "CVR RECREATION," never presented as real.

## 4. Script — src/mindwired-doc/docs/helios522.json
55 scenes, ~9 min narration (~10:05 final runtime with BB outro). Structure:
cold open (the ground engineer's overnight pressurization check, `dossier`
reconstruction — zero real coverage exists for this moment) → sting → title
→ 8 chapters (the airline's cost-cutting culture → the aircraft's own
maintenance history → takeoff and the misidentified warning → the silent
autopilot flight and F-16 intercept → Prodromou's attempt and the crash →
the report's findings → the two-court verdict split → the airline's collapse
and the still-unresolved 2025 anniversary grievance) → coda → verbal bridge
(to JAL123, already published) → subscribe.

Two RadioScene moments added mid-build (per Akshay's request for the actual
CVR content): the captain's misidentified-warning radio call (`ch3_3`) and
Prodromou's real quoted mayday call (`ch5_4b`, "Mayday, mayday, mayday,
Helios Airways flight five two two, Athens") — both generated via
`scripts/radio_recreate.py`, both carry the on-screen "CVR RECREATION" label.

## 5. Footage — real Commons photos, zero real video (confirmed)
- **Real, correctly attributed:** 7 different real photos of the actual
  accident aircraft (5B-DBY) from Wikimedia Commons — used as the visual
  anchor throughout rather than generic aviation stock. 3 real Hellenic Air
  Force F-16 photos (type/livery reference).
- **Caught and fixed mid-build:** the first footage-fetch pass pulled
  generic stock that showed OTHER real named airlines (Lion Air, American,
  Etihad, Atlantic, Ryanair, Alaska, Corendon) — Akshay caught this
  immediately from the review stills ("why we are showing Lion airways so
  many times"). Fixed by replacing every generic-737 reference with the real
  Helios aircraft photos, and the F-16 reference with real Hellenic AF
  (not Turkish, which the first fetch had pulled).
- **No real archival video exists anywhere for this crash** — checked
  Wikimedia Commons and Internet Archive thoroughly; only copyrighted news-
  wire clips and a paid stock-footage broker clip were found, neither
  usable. This episode is photo/illustration-forward by hard necessity, not
  by shortcut.
- **AAIASB report NOT used as an ExhibitScene** — checked aaiasb.eu
  directly, only a bare "© 2022 AAIASB" notice, no open-license/PD
  statement (it's a Greek, non-US government work — does not inherit
  NTSB/FAA-style automatic PD status). Report findings are quoted as
  on-screen `kinetic`/`cap` text reveals instead of showing scanned pages.
- One `dossier: true` scene (the cold-open engineer inspection) — the new
  hand-cut illustration engine, zero real coverage exists for this beat.

## 6. Known limitation (flagged, not hidden)
Even with 7 real photos of the correct aircraft, the visual pool is smaller
than higher-profile topics — aviation spotter photography converges on a
similar "3/4 side profile" angle, so repeated real photos can still read as
similar-looking to viewers. Mitigated by converting several photo-only
beats to kinetic word/number reveals (text is the visual focus, photo is a
dimmed backdrop) rather than fetching more (increasingly irrelevant) generic
stock. This is a real, structural constraint of an obscure ~20-year-old
foreign crash on a defunct airline, not a shortcut.

## 7. VO — done, alternate voice
`build_doc_vo.py --speed 0.96`, all 55 clips (53 narration + 2 radio
recreations) synthesized clean, no empty-clip Cartesia bug. Voice: Clarence
(see §1). Ear-check sample sent to Akshay before the render.

## 8. Gates — 0 blocking
`preflight_doc.py helios522` → 0 blocking, 9 warnings (all reviewed —
keyword-mismatch false positives on real, correct footage; not actual
wrong-subject errors).

## 9. Stills — all 55 scenes rendered and reviewed by Akshay before render
Full 55-scene review (not spot-check) at Akshay's request, via contact
sheets — caught the wrong-airline footage issue described in §5 before
committing to the render, then a second focused review confirmed the fix.

## 10. Render — DONE, VERIFIED
```
scripts/render_gce.sh Helios522Doc helios522
```
No `--music` flag (the `public/beds/doc_*.mp3` set stays banned).
- Duration: **625.0s** (matches expected 609s body + 483f/30fps BB outro)
- Resolution: **3840×2160** (true 4K)
- Loudness: **−14.0 LUFS** (target hit; input was −17.0 LUFS)
- Mid-frame + outro splice both visually verified (`out/qa/helios522_mid.jpg`,
  `out/qa/helios522_outro.jpg`) — real Hellenic AF F-16, correct BB subscribe
  outro (host Reid) confirmed present.
- Master: `out/helios522_gce.mp4`. Final upload-ready copy at repo root.

## 11. SRT + chapters — DONE
`.venv-lipsync/bin/python scripts/gen_doc_srt.py helios522` →
`mindwired_helios522.srt` (122 cues). No chapter-gap violations this time
(all ≥16s apart). Final runtime: **10:05**.

## Next steps (in order)
1. Build thumbnail (Workflow A or ctr-engine) — real Helios livery photo +
   3-5 word ALL-CAPS text, follow THUMBNAILS.md house style.
2. Cut funnel Shorts (shorts-funnel skill) — strong candidates: the cold
   open (engineer's night), the F-16 pilots' description, Prodromou's real
   mayday call, the "none of them served a day" verdict beat.
3. Commit everything (doc spec, dossier sidecar, manifest, CLAIMS, SRT,
   handoff — never the multi-GB master) — only once Akshay asks. Note: this
   repo has a large backlog of other uncommitted episodes already sitting
   in the tree — scope any commit to helios522's own files.
4. Write the episode memory once the above is done.
