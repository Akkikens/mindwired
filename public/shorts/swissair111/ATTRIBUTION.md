# ATTRIBUTION — Swissair Flight 111 (Black Box Breakdown)

Fetched 2026-08-24 per `docs/planning/CLAIMS-swissair111.md`'s Archival Footage
Plan, via the Wikimedia Commons API, the DVIDS API, and Pexels — real
User-Agent header, normalized with ffmpeg. Everything below is PD or
CC-licensed. **Nothing from CNN/NBC/BBC/Fox or any broadcast-news source was
used anywhere in this episode.** Full per-file citations: `images/ATTRIBUTION.md`
and `video/ATTRIBUTION.md`.

## hbiwf/ (the accident aircraft, HB-IWF)

Three real Commons photos of HB-IWF itself: the primary pick (14 Jul 1998,
Zurich, ~7 weeks pre-crash, CC BY-SA 2.0, Aero Icarus) plus two more of the
same airframe from 1998 and April 1998. All confirmed via Commons imageinfo
API as depicting HB-IWF specifically (categories/descriptions cross-checked).

## swissairfleet/ (generic Swissair MD-11 cutaways)

Three real Commons photos of SISTER MD-11s (HB-IWD, HB-IWI, HB-IWC) — different
registrations from the accident aircraft, used only for generic "Swissair
fleet" cutaway beats, never captioned as the accident plane.

## navyrecovery/ (U.S. Navy recovery operation)

Three real DVIDS photos from the Sept 1998 USS Grapple/Mobile Diving Salvage
Unit Two operation, including the exact VIRIN named in the footage plan
(980913-D-D0439-7157). All public domain U.S. government works.

## reconstruction/ — DossierScene (illustrated, not a real photo)

CLAIMS confirmed no licensable real photo exists of the actual TSB fuselage
reconstruction at CFB Shearwater (exhaustive Commons/web search this pass
too — still nothing). `reconstruction_1.png` is a generated DossierScene
cutout (`scripts/gen_doc_dossier.py`, Gemini image-gen, white-to-alpha'd) —
a riveted aircraft fuselage panel in a support jig in a hangar, no real
photo, no identifiable people. Scenes c5_6/c5_7 render this via
`"dossier": true, "label": "CFB SHEARWATER · 1999"`, which always shows the
on-screen "RECONSTRUCTION" tag per channel convention. Per DOSSIER-SCENES.md
convention, generated dossier cutouts get NO entry in `images/ATTRIBUTION.md`
(nothing external to attribute) — documented here instead.

## Note: the doc script was under active concurrent editing during this pass

`src/mindwired-doc/docs/swissair111.json` grew from ~110 scenes to 179 scenes
(7 chapters to 15) multiple times while this footage/audio pass was running,
evidently edited by another process in parallel. Several `img`/`exhibit`
assignments this file corrects below were re-introduced by that expansion
after being fixed once already (most notably: `exhibit: true` on the
generated `tsbreport`/`tsbreportcover` illustration for 5 different TSB
report-section citations, and 37 plain `img: "tsbreport"` scenes rendering
that same generated illustration with no honesty tag at all). All are fixed
in the CURRENT file as of this pass. **Re-run
`python3 scripts/audit_scene_relevance.py swissair111` and
`python3 scripts/preflight_doc.py swissair111` immediately before rendering**
in case the script changed again after this pass — both showed 0 blocking
issues at the time this was written.

## tsbreportcover/ + tsbreport/ — DossierScene (illustrated, not a real photo)

CLAIMS flagged TSB's own report imagery as blocked (written-permission/
commercial-use restriction, unknown turnaround — not usable in this ship
window). The exhibit scene c6_1 (previously `exhibit: true` citing TSB
Aviation Investigation Report A98H0003) was converted to a DossierScene
instead of forcing a real-looking-but-fake "report" image: `dossier: true,
"label": "TSB REPORT A98H0003 · 2003"`. `tsbreportcover_1.png` is a generated
closed navy-blue binder with a ribbon — a generic case-file object, not a
depiction of the real TSB document. The remaining `tsbreport`-tagged
non-exhibit scenes (former c6/c6_2 through c6_6, c7/c7_1 through c7_6b,
coda3 — 16 scenes total) were repointed to the real `hbiwf` photo pool
(fleet-wide-rewiring scene c7_1 repointed to `swissairfleet` instead, since
that beat is about the whole DC-10/MD-11 fleet, not just HB-IWF) rather than
inventing a fake report visual — see `src/mindwired-doc/docs/swissair111.json`.

## memorial/ (Peggy's Cove memorial)

Three real Commons photos of the actual Swissair 111 memorial at Indian
Harbour, NS, including the exact primary pick named in the footage plan
(`Peggys_Cove_Swissair_Flight_111.jpg`, Aconcagua, dual GFDL 1.2+/CC BY-SA 3.0).

## oceannight/ (generic Atlantic-at-night mood)

Real Pexels photos/videos of dark open ocean at night — no landmark, no
branding. The automated `fetch_doc_footage.py` pass initially mismatched
this prefix to three Niagara Falls, Ontario photos (a vision-check miss,
since corrected/deleted) and one video was daytime surf on first pull; final
picks are all genuinely dark night water.

## jfkgate/ + md11takeoff/ (hook videos)

- `md11takeoff_1.mp4` / `md11takeoff_2.mp4` — the two real Commons MD-11
  motion clips named in the footage plan (UPS N292UP takeoff, hazy/dusk;
  FedEx N631FE landing, daylight) — different liveries from HB-IWF, as
  expected for generic "an MD-11 like the one on Flight 111" cutaways.
- `jfkgate_1.mp4` — manually re-sourced after the automated fetcher and
  several rounds of manual search kept surfacing real-but-wrong candidates:
  a Jetstar-branded night cargo-loading clip (Sydney — wrong airline, wrong
  activity), an Aegean-branded dusk boarding clip, an Azimut-branded and a
  Kenya-Airways-branded daytime boarding clip, an AIR FRANCE-branded night
  jet-bridge clip, and several ultra-modern glass-terminal clips (wrong
  era). Final pick is a dark, unbranded 1998-plausible cabin-interior
  boarding shot (passenger's hand holding a boarding pass, walking the
  aisle) with no visible airline livery or modern signage.

## The real ATC audio (r1/r2/r3) — genuine 2007-released recording

**Found and used real audio**, not a recreation. Confirmed via two
independent YouTube re-uploads of the actual May 2007 TSB-released tape
(release covered contemporaneously by CBC News, SWI swissinfo.ch,
Aero-News Network — see CLAIMS-swissair111.md). Both uploads carry
identical real ATC/cockpit content (matching Moncton Center coordination,
the fuel-dump clearance, "St. Margaret's Bay," etc.) — clearly the genuine
recording, not a narrated dramatization (no voiceover, no scripted acting,
just raw radio traffic and static).

- Source used: "Swissair Flight 111 - ATC Recording [IN-FLIGHT FIRE LEADING
  TO ELECTRICAL FAILURE]", YouTube channel PAN-PAN, uploaded 2017-01-25,
  https://www.youtube.com/watch?v=mtUi_YgshoI (description cites the CBC
  News article on the 2007 tape release as its own source). Cross-verified
  against a second independent upload, "Swissair Flight 111 ATC Recording",
  YouTube channel Allec Joshua Ibay, uploaded 2017-06-05,
  https://www.youtube.com/watch?v=yMocSzhs0GQ — same real audio content.
- Downloaded via yt-dlp (audio only), transcribed locally with faster-whisper
  (medium.en, VAD disabled — the default VAD filter was clipping the actual
  Pan-Pan call and swallowing brief radio-static onsets) to locate and verify
  the three target transmissions by timestamp before cutting.
- `r1.mp3` — the Pan Pan Pan call, trimmed ~10.7s-25.0s of the source
  recording. On-screen caption updated to match the actual words heard
  ("...request immediate return to a convenient place...") — the documented
  Correction #8 variant B wording, not the variant A phrasing the doc
  originally carried.
- `r2.mp3` — "at the time we must fly manually," trimmed ~592.5s-597.5s.
  Caption updated to "Swissair one-eleven, at the time, we must fly
  manually" to match the actual recording.
- `r3.mp3` — "And we are declaring emergency now, Swissair one eleven,"
  trimmed ~628.8s-632.6s. Caption updated to include the natural leading
  "And" actually present in the recording.
- `radioLabel` stays "ACTUAL ATC RECORDING" for all three scenes — this is
  genuine archival audio, not a Cartesia recreation. See Akshay's
  standing approval in CLAIMS-swissair111.md and the channel's honesty rule
  (RadioScene labeling: real audio only ever gets "ACTUAL ATC RECORDING").

### r4-r10 — seven more real-audio cuts added when the script expanded

The doc script grew mid-pass to include seven more `radioLabel: "ACTUAL ATC
RECORDING"` scenes (r4-r10) covering the runway-vectoring/back-course/fuel-dump
exchange between r1's Pan-Pan call and r2/r3's final transmissions. All seven
were cut from the same verified real `panpan_raw.mp3` source (the PAN-PAN
YouTube upload) using the same word-level faster-whisper verification method,
each re-transcribed after cutting to confirm the words match:
- `r4.mp3` ~310.6-315.2s — "active runway Halifax 06, should I start you a vector for 6"
- `r5.mp3` ~315.2-319.8s — "Yes, vectors for six will be fine, Swissair 111 heavy"
- `r6.mp3` ~320.6-336.9s — the full turn/back-course/threshold exchange (16.3s, includes a brief pilot readback in between — real, unedited)
- `r7.mp3` ~341.8-344.1s — "We need more than 30 miles"
- `r8.mp3` ~421.3-425.9s — "we must dump some fuel, may we do that in this area during descent"
- `r9.mp3` ~449.9-460.1s — "turn to the left heading of 200 degrees and advise me when you're ready to dump"
- `r10.mp3` ~620.3-624.2s — "[Swissair 1]11 heavy, we starting to dump, now — we have to land immediately"

r2/r3's on-screen `timestamp` fields were also corrected from "9:15 PM" to
"9:24 PM"/"9:25 PM" — the real recording's internal chronology (r2 at ~592s,
r10 at ~620s, r3 at ~629s, all clustered together near the end, ~570s after
r1's Pan-Pan call at ~15s) confirms these are the LAST transmissions, not
transmissions immediately following the Pan-Pan call. Scene *ordering* in the
JSON currently still places r2/r3 earlier in the narrative (chapter 3) than
r4-r10 (chapter 4/end) — flagged for a script/editorial pass, not changed
here since reordering scenes is outside this footage/audio pass's scope.
