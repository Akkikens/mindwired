# TWA 800 — production handoff (2026-08-21)

**STATUS: PUBLISHED (Akshay confirmed upload 2026-08-24).** Real YouTube URL
not yet captured in this file — add it here and to memory
`blackbox-published-urls` when handy.

**⚠ KNOWN DEFECT, already live, cannot be fixed post-publish:** this episode
shipped with the OLD Veo-clone narrator voice (`00d3c951-...`), NOT the
current Grant voice (`d46abd1d-...`) that CLAUDE.md says Black Box switched
to before this session even started. The producing session (2026-08-21)
copied a stale voice ID from what it read as the doc-episode skill's
template text; by the time the mistake was caught, Akshay had already
uploaded the video, so a VO-rebuild-and-reupload was correctly abandoned
rather than pursued for an already-live video. Treat this episode as an
honest part of the pre-switch back-catalog going forward (the doc JSON's
`voice` field was reverted to match what's actually live, so the source
file stays an accurate record) — but the root cause (a stale ID in
whatever context produced the mistake) is worth a quick check before the
next episode: confirm `d46abd1d-2d02-43e8-819f-51fb652c1c61` is what
actually gets used, don't trust memory of what a skill file said earlier
in a long session.

Final files at repo root:
- `TWA Flight 800 - The Files the FBI Tried to Bury.mp4` — 3840×2160, 926.0s
  (15:26, includes baked-in BB outro), **−14.1 LUFS** (master log confirmed)
- `TWA Flight 800 - The Files the FBI Tried to Bury.srt` — whisper-generated,
  256 speech cues, word-accurate off the actual master, speech runs to 15:25.4

Verification done: 4 stills pulled and eyeballed (cold open — real jet-bridge
boarding video with caption/branding correct; hook takeoff — real dark night
jet with nav lights; mid-body c6_1 exhibit — the REAL NTSB "3.2 Probable
Cause" report page, text matches narration verbatim, citation card correct;
Montoursville memorial coda — real, dignified). A 9-frame scan around the
c6_1 timestamp confirmed one apparently-black extracted frame was just an
ffmpeg seek artifact on a transition boundary, not a render defect — every
neighboring second showed real content. Outro splice checked: Reid/
@Watch-BlackBox subscribe card present and clean. GCE VM auto-deleted after
fetch, no leftover billing. Render log: `out/twa800_gce_launch.log`.

## What's left (in order)

1. **Akshay: listen to the VO ear-check sample** (`out/qa/twa800_vo_sample.mp3`
   — hook + probable-cause reveal + subscribe end, 38s) and review the 3
   thumbnails (`out/thumbs/twa800_A/B/C.png`) if not already done.
2. Upload per `docs/metadata/METADATA-twa800.md` (3 thumbnails → Test &
   Compare, single-video end screen to the 737 MAX episode, pinned comment,
   description with the PD/CC-BY/GFDL credit block — the credits are a
   LICENSE REQUIREMENT, not optional).
3. **Ship soon, not eventually** — the currency is the 30th-anniversary FOIA
   wave (Judicial Watch's July 2026 release, the *Freefall* franchise's own
   TWA 800 chapter references, the still-live Krick appeal); every week of
   delay is a week further from "why now."
4. shorts-funnel: cut 3-5 trailer Shorts (suggested windows: the probable-
   cause exhibit reveal c6_1-c6_2; the FBI teletype/Cairo-fax beat c8_4-c8_6;
   the streak-of-light witness run c3_1-c3_3; the Oliver Krick callback
   c8_2) → `docs/publishing/SHORTS-SCHEDULE-twa800.md`.
5. 48h launch-diagnosis → LAUNCH-LESSONS.md after publish (this session's own
   BLOCKED-ON-DATA entries already note the standing backlog).

## What's done (all gates green)

| Step | State |
|---|---|
| Icahn validation | PASS-COND, memory `icahn-twa800` (8-candidate live sweep, wf_005e65bc-95f) |
| Locked package | Title + 3 BUILT thumbnails (`out/thumbs/twa800_A/B/C.png`) + adjacency cluster |
| CLAIMS fact base | `docs/planning/CLAIMS-twa800.md` — 5-agent fan-out (wf_c77a9b33-5ff) + ⚠ DATA CORRECTIONS block (10 items) |
| Script | `src/mindwired-doc/docs/twa800.json` — 86 scenes, 8 chapters + cold open/coda, evidence-vs-conspiracy spine |
| Footage | 100% real + license-verified (NTSB/DVIDS/Commons/Judicial Watch — see both `public/shorts/twa800/ATTRIBUTION.md` and `images/ATTRIBUTION.md`); zero broadcast-news sourcing anywhere |
| Exhibit pinning | The two central "receipts" beats (c6_1 Probable Cause, c6_4 wiring findings) repointed to dedicated single-file prefixes (`ntsbcause`, `ntsbwiring`) so they always show their own cited page, not whatever the shared rotation lands on |
| VO | 85 Cartesia clips + 3 radio-recreation clips @ 0.96, 13.5 min narration; 0 empty clips (r3's 0.99s duration is a legit 3-word line, not the empty-clip bug); ear-check sample at `out/qa/twa800_vo_sample.mp3` — **Akshay: LISTEN before/at upload review** |
| TTS lint | clean (exit 0) |
| Relevance audit | 0 blocking, 52 warnings — all reviewed; MISMATCH/WEAK hits are the keyword-overlap heuristic flagging real, correctly-sourced files (e.g. modern USCGC Kimball photos used as generic Coast Guard atmosphere; 2021 Ashburn reconstruction photos standing in for the 1997 Calverton era — same physical object, different year) |
| Preflight | **0 blocking**, 9 warnings (same reviewed set) |
| Comp | `Twa800Doc` registered in Root.tsx, BB_OUTRO baked (483f) |
| Stills | 4 rendered + eyeballed (cold open, hook takeoff, probable-cause exhibit, Montoursville coda) — `out/qa/twa800_f*.png` |
| SRT | `TWA Flight 800 - The Files the FBI Tried to Bury.srt` — whisper, word-accurate off the real master |

## Sensitivity (binding, from CLAIMS DATA CORRECTIONS)

- NTSB's center-wing-tank/wiring finding stated as fact, WITH its own
  "could not be determined with certainty" hedge preserved — never flattened.
- The Krick lawsuit (Raytheon/Lockheed Martin, alleging an errant Navy
  missile) is DISPUTED/ALLEGED only — "the case is still working its way
  through federal appeals court, its outcome undecided," never a finding.
- 🧍 Ronald Krick (lead plaintiff, Oliver Krick's father), Jack Cashill
  (author), Tom Stalcup (physicist), Tom Fitton (Judicial Watch) — every
  claim attributed by name, never asserted as the narrator's own voice.
- The 2026 FBI teletype's Cairo-fax terrorism lead is scripted as
  unsubstantiated by design: "the FBI's own investigation never
  substantiated the claim" — never implied as proof.
- The government-cover-up theory is EXCLUDED entirely (directly denied on
  the record by investigators involved; risks defamatory innuendo).
- James Sanders' 1999 conviction was probation + community service, NOT
  prison — do not imply jail time.
- Montoursville's 16 students/5 chaperones handled with restraint — stated
  plainly, no individual-student anecdotes invented, no exploitation of the
  Oliver Krick father-son connection for shock value.
- James Kallstrom (FBI, led the investigation) is deceased (2021) — no
  living-person attribution caution needed for his quotes.

## Wave calendar

Currency is LIVE right now, not a future date to wait for: the 30th
anniversary (Jul 17, 2026) already triggered the Judicial Watch FOIA wave
this episode is built around, and Netflix's *Freefall: A Reckoning for
Boeing* (released Aug 19, 2026 — 2 days before this render, unrelated
Boeing-whistleblower film, NOT about TWA 800, see memory `icahn-johnbarnett`
for why that topic was separately declined) keeps Boeing/aviation-safety
content generally warm in the recommender right now. Ship within days, not
weeks — the FOIA/lawsuit news cycle cools fast once outlets move on.
