# NASA'S REAL UFO FILES — "What the Government Actually Found" (mindwired)

Single-file summary of everything done on this episode. Read `CLAUDE.md` first for
the production manual; this doc is the episode-specific state.

## Status: DONE — 4K render verified (569s, 3840×2160, -14.1 LUFS, d4 fix
confirmed, outro confirmed), thumbnail + 4 Shorts + metadata + SRT all done and
committed — Akshay should watch before publishing

## Files
| What | Path |
|---|---|
| Icahn validation | memory `icahn-nasaufofiles` |
| Fact base (GATE — every script line traces here) | `docs/planning/CLAIMS-nasaufofiles.md` |
| Doc spec (49 scenes) | `src/mindwired-doc/docs/nasaufofiles.json` |
| Comp registration | `src/Root.tsx` → `NasaUfoFilesDoc` (MW_OUTRO baked, 527f) |
| Rendered master (v1, HAD the d4 defect) | overwritten — v2 replaced it at the same path before renaming |
| **Final deliverable (v2, fixed, verified)** | `mindwired_NASA's Real UFO Files - What the Government Actually Found.mp4` (repo root, 989MB, 569s, 3840×2160, -14.1 LUFS) |
| Thumbnail component | `src/mindwired-doc/NasaUfoFilesThumbnail.tsx` → Still `NasaUfoFilesThumbnail` |
| Thumbnail PNG | `out/qa/nasaufofiles_thumbnail.png` (real GIMBAL sensor frame + Fravor's real quote) |
| 4 funnel Shorts (rendered, mastered -14 LUFS) | `mindwired_short_navy_jet_chased_ufo_2004.mp4`, `mindwired_short_gimbal_gofast_balloon_theory.mp4`, `mindwired_short_grusch_congress_testimony.mp4`, `mindwired_short_nasa_no_aliens_report.mp4` (repo root) |
| Metadata / SEO package | `docs/metadata/METADATA-nasaufofiles.md` |
| SRT captions | `mindwired_nasaufofiles.srt` (repo root) |
| Episode memory (full detail) | memory `nasaufofiles-episode` |
| House-style rule this episode established | memory `attributed-mystery-format` |
| QA frames | `out/qa/nasaufo_mid.jpg`, `out/qa/nasaufo_outro.jpg`, `out/qa/nasaufo_f*.png` |

## ⚠️ WHY THIS EPISODE IS DIFFERENT — READ BEFORE TOUCHING ANYTHING

This is a conspiracy-adjacent topic (UFOs/UAP) chosen **explicitly to prioritize
views**, per Akshay's direct instruction. It stays inside the channel's honesty
rules via the **attributed mystery format** (memory `attributed-mystery-format`):
real theories/claims featured prominently as narrative hooks, but always attributed
to their claimant, with official findings stated as fact with equal or greater
weight, never blurred together.

- **David Grusch (living, 🧍) claims** the government has hidden crashed
  alien craft for decades. This is **secondhand** testimony (40+ interviews, no
  personal eyewitness claim) and is **directly disputed** by the Pentagon's own
  AARO investigators, who found "no verifiable information" to substantiate it.
  Every scene featuring Grusch's claim pairs it with AARO's rebuttal in the same
  or an adjacent beat (see scenes e2→e4, e5).
- **David Fravor / Alex Dietrich (living, 🧍)** gave real firsthand testimony
  about the 2004 encounter. Their observations are credible eyewitness fact;
  their *interpretation* ("not from this world" vs. Dietrich's "don't jump to
  conclusions") is opinion and is labeled as such — same sighting, different
  conclusions, presented as the actual human tension (see coda1-3).
- **Do not** edit any scene to assert Grusch's claims as fact, or to strip the
  AARO/Pentagon rebuttal out to make the hook punchier. That is the one hard
  line this episode cannot cross, per Akshay's explicit confirmation of the
  attributed-mystery format over "just assert it" (memory
  `attributed-mystery-format`).

## 1. Icahn validation — PASS-WITH-CONDITIONS
See memory `icahn-nasaufofiles`. Headline outlier: "SECRET NASA FOOTAGE MOON BASE"
(fake-conspiracy channel), 318,374 views / 335 subs = 950.4:1 — proof the
UFO/NASA-conspiracy packaging frame pulls extreme demand even from zero-substance
channels. Recognition 2/3 — the report itself doesn't self-explain, but the
underlying UFO/Navy-video/congressional-hearing subject matter has very high
mainstream recognition. Chosen over a higher-raw-score but saturated
"Challenger bodies" topic specifically to prioritize views via this angle.

## 2. Research — synthesized into CLAIMS-nasaufofiles.md
Full fact base with CONFIRMED/DISPUTED/ALLEGED/UNVERIFIED/EXCLUDE labels for every
claim. Key corrections baked into the script (do not revert if editing):
1. The "2-5% anomalous" statistic is Pentagon official Kirkpatrick's spoken remark
   at the press conference, **not text in NASA's report**.
2. "No convincing evidence of extraterrestrial origin" was also spoken at the
   podium, not printed in the report itself (script makes this distinction
   explicit — see scene f1).
3. Grusch's AATIP-director claim is Pentagon-disputed — not repeated as fact.
4. Grusch's claims are secondhand (40+ interviews) — never framed as eyewitness.
5. Fravor = firsthand observation + opinion; Dietrich = same sighting, different
   opinion. Both attributed as personal conclusions, not settled fact.
6. GOFAST/GIMBAL have real, credentialed counter-explanations (Mick West/
   Metabunk parallax/glare analysis) — presented as "real, honest, competing
   science," not as a settled debunk or a dismissed footnote.
7. AARO says no raw 2004 Tic Tac sensor data survived — the one case that can
   never be independently re-checked. This is stated plainly (scene d6).
8. Grusch's psychiatric history is **excluded entirely** — not relevant, not
   used, per the channel's living-person fairness bar.
9. Mark McInerney's current status as NASA's UAP research director was
   UNVERIFIED at write time — script sticks to his confirmed 2023 appointment
   only, no claims about his current status.

## 3. Script — src/mindwired-doc/docs/nasaufofiles.json
49 scenes, ~9:10 narration + MW_OUTRO. Structure: cold open (h1-h6, the real 2004
Nimitz/Tic Tac encounter, ending on Fravor's real "not from this world" quote) →
sting → title → 6 chapters (the 2023 NASA report → the Tic Tac → what the sensors
actually show → the whistleblower → what NASA actually concluded → where this
stands now) → 3-scene first-person coda → cliffhanger (z1) → verbal bridge to
"The Scariest Real Sounds Ever Recorded in Space" → subscribe. Channel: mindwired
(host-less evidence-doc format, MW_OUTRO 527f).

**Fixed this session:** scene `d4` (the "13,000 feet / balloon" kinetic data
reveal) had no `img`/`video`, rendering as a bare black-screen-and-text scene in
the first render — a direct violation of the channel's no-black-screen rule.
Fixed by giving it `img: "analyst_desk"`, reusing the same real photo already
established one scene earlier at `d3` (same Mick West/analyst segment). Confirmed
via `preflight_doc.py` still 0 blocking after the fix. **A GCE re-render was
launched to correct the already-shipped v1 master — do not ship
`out/nasaufofiles_gce.mp4` until the timestamp/log confirms it's the v2 build.**

## 4. Footage — Evidence Engine episode, all real
- **FLIR1 ("Tic Tac"), GIMBAL, GOFAST** — all three DoD-declassified 2020 Navy
  UAP videos, sourced directly via the DVIDS API (not the automated fetcher —
  see the bug below), frame-verified against the published stills.
- **Real House Oversight Committee hearing footage** (July 26, 2023) — the
  Committee's own PD recording via Wikimedia Commons, deliberately NOT C-SPAN's
  footage of the same hearing (C-SPAN's own camera feed of a public hearing is
  separately copyrighted — a non-obvious trap; the underlying government
  proceeding is public, the broadcaster's recording of it is not). One extracted
  frame happens to show Grusch himself at the witness table.
- **Real exhibit pages**: NASA UAP Independent Study Team Report (direct
  download) and the AARO Historical Record Report Vol. I (media.defense.gov
  403'd — worked via the Wikimedia Commons mirror instead). Exact quotes in
  narration match the exact primary-source PDF pages shown on screen.
- **New fetcher bug found**: `fetch_doc_footage.py`'s `niche="space"` biases
  video search toward ESO/NASA astronomy content even for military-aviation
  queries — "Nimitz aircraft carrier flight operations" returned Betelgeuse/
  Webb-telescope news clips. Fixed by querying DVIDS directly for the real
  Nimitz/F-18 b-roll. Full detail + fix in memory `nasaufofiles-episode`.
- Several stock-photo mismatches caught and fixed on eyeball review: wrong-event
  NASA press clip (was OSIRIS-REx, swapped for a real report-page exhibit),
  wrong Pentagon buildings (Indonesia + a federal penitentiary), wrong hearing
  rooms (were courtrooms — same recurring failure mode as `us1549`), a
  HOOK-REUSE ocean image (byte-identical to `flight93`'s, refetched fresh).

## 5. Render — GCE 4K
```
scripts/render_gce.sh NasaUfoFilesDoc nasaufofiles
```
- v1 (superseded): 569s, 3840×2160, -14.1 LUFS — had the `d4` black-screen defect.
- v2 (final, shipped): re-rendered after the `d4` fix. Verified: 569s duration,
  3840×2160, -14.1 LUFS (per render log), `d4` now shows the real
  `analyst_desk` photo (confirmed via frame extraction at 285s), outro confirmed
  via tail-frame extraction (mindwired branding, host avatar, "FOLLOW
  @MINDWIRED"). Renamed to the final deliverable filename at repo root.
- No music (the `doc_*.mp3` bed set stays banned; no replacement bed used here).

## 6. Shorts funnel — DONE (all 4 rendered + mastered -14 LUFS)
Cut directly from the doc's own scenes via `MindwiredShort` (no new fetches):
1. **`mindwired_short_navy_jet_chased_ufo_2004.mp4`** — h1→h4, the cold-open
   Tic Tac encounter, real Nimitz/F-18 b-roll.
2. **`mindwired_short_gimbal_gofast_balloon_theory.mp4`** — d1→d4, the real
   GIMBAL/GOFAST videos + Mick West's parallax/balloon counter-explanation.
3. **`mindwired_short_grusch_congress_testimony.mp4`** — e1→e4, real hearing
   footage of Grusch's testimony + the "secondhand, not eyewitness" caveat.
4. **`mindwired_short_nasa_no_aliens_report.mp4`** — f1→f3, the podium-quote-
   vs-report-text distinction.

**Real bug caught and fixed while cutting these**: `MindwiredShort.tsx`
(`src/mindwired-doc/MindwiredShort.tsx`) had **no support for `video` scenes at
all** — it only ever rendered `s.img`. Every scene using real b-roll/sensor
video (h1, h3, d1, d2, e1 — exactly the strongest, most "real footage" beats)
rendered as a bare black screen with only the caption and brand mark, in EVERY
mindwired Short ever cut with this component (`spacesounds`, `mariana` too,
though those two docs' cut ranges happened to be img-only scenes). Fixed by
adding an `OffthreadVideo` branch (object-fit cover, same Ken-Burns-style scale)
alongside the existing `Img` branch. Verified via stills that all 3 affected
Shorts now show the real footage (GIMBAL frame, Nimitz flight-deck crew, Grusch
at the witness table) instead of black. **Worth a proactive check**: if any
other mindwired Shorts get cut in the future from a doc whose scene range
includes a `video` scene, this fix now covers them — no further action needed,
but worth remembering this class of bug existed silently until now.

Pinned-comment funnel text for each Short should link back to "NASA's Real UFO
Files" by title once the long-form is live (not yet written — see Next steps).

## 7. Known gaps / not done yet
- **Akshay has not watched the master yet.** Given the living-person claims
  (Grusch, Fravor, Dietrich) and the explicit "prioritize views" framing, a
  personal review pass before upload is strongly recommended — this is the
  only remaining gate before publishing.
- Pinned-comment funnel text for each of the 4 Shorts isn't written yet (needs
  the long-form's real published URL, which doesn't exist until upload).

## Next steps (in order)
1. **Akshay watches the final master** (`mindwired_NASA's Real UFO Files -
   What the Government Actually Found.mp4`, repo root).
2. Upload per the standard packaging in `docs/metadata/METADATA-nasaufofiles.md`.
3. Once live, write pinned-comment funnel text for each of the 4 Shorts
   linking back to the long-form by its real URL, then drip the Shorts out
   ~1/day per the shorts-funnel playbook.
