# Archival-footage scout report — sept11timeline (Black Box Breakdown)

Scouted 2026-09-14. Master minute-by-minute timeline of 9/11. **HARD CONSTRAINT:**
zero network broadcast footage (CNN/NBC/ABC/CBS/FOX/PBS/History/HBO) anywhere in this
episode — Content-ID fingerprinted regardless of clip length, no safe-harbor, strike
risks the whole channel. Everything below is scored against that constraint first.

---

## 0. What this repo already has on disk (reusable evidence, NOT reusable hooks)

Read `SOURCES.md`/`ATTRIBUTION.md` for `noradtapes`, `groundzeroair`, `thegrounding`,
`flight93`, `wtccollapse`. Summary:

| Slug | What's there | Reuse rule |
|---|---|---|
| **noradtapes** | ~32h of real NEADS/NORAD FOIA audio (PD, `nsia-911` collection on archive.org), 4 verified real tape cuts already scene-mapped (h2a/h3a/a2_9a/a2_17a), FOIA release letter PDF, Otis F-15/AA11 767/ANG stock images, DVIDS *modern* NORAD-facility b-roll (NOT 9/11-day footage, honestly labeled) | **Audio is evidence, re-cuttable for new scenes.** The 4 already-cut tape moments are this episode's strongest available real audio for the NEADS/Otis timeline beats — re-license nothing, just re-edit new in/out points if the timeline needs different moments. The DVIDS modern-facility clips and stock images are generic b-roll pools, safe to refetch/reuse the same way any niche pool is, but **not** as the cold open (see NEW VIDEO = NEW FOOTAGE below) |
| **groundzeroair** | FEMA "Ground Zero Timeline Compilation" (DVIDS 734981, PD, 30:35 master on disk, 18 clips already cut), EPA OIG 403 report exhibit pages, NIST FOIA 9-11 video corpus flagged **UNSCREENED** | **FEMA reel is the single strongest PD motion-video asset in the whole repo for this subject.** Fully reusable for sept11timeline's Ground Zero/aftermath beats — it's PD, real, and not yet burned as any episode's hook |
| **thegrounding** | DVIDS ATC-tower/radar-ops/NORAD-alert b-roll (all PD, all modern), Pexels/Pixabay airport generic b-roll, exhibit pages from SCATANA CFR, Commission Staff Statement 17, Commission Report Ch.1 | Same as noradtapes: real but modern/generic, fine to re-fetch as evidence b-roll, not eligible as a fresh hook |
| **flight93** | Commission Report exhibit pages (Ch.1 pp.13, 45), Pexels 757/cockpit/cabin/Shanksville-field stock | Generic aviation b-roll pool, same reuse rule |
| **wtccollapse** | **NIST-generated** LS-DYNA/ANSYS collapse simulations (WTC7, WTC1, WTC2) — confirmed Tier-1 NIST-owned, PD, wireframe-only, content-screened; 1970s Prelinger construction footage (PD likely but flagged as not ironclad — still needs the one manual check); Pexels modern-NYC b-roll | **The NIST simulation videos are this repo's single most valuable motion-video find for the whole 9/11 lane** — real government-generated visualization of the actual physical collapse mechanism, unambiguously PD, already vetted. Directly reusable for sept11timeline's collapse-sequence beats (they are not "the hook" but they are exactly the *engineering exhibit* class of asset this episode needs at 9:59/10:28/17:20) |

**⛔ CONFIRMED TRAP, cross-episode:** `noradtapes/SOURCES.md` already flags that
archive.org's `nsia-911`/`government-documents` collections mix PD FOIA audio with
copyrighted CNN/ABC/CBS/NBC/FOX/HBO/PBS/History/NOVA dubs **in the same folder**. This
scout independently reproduced the identical pattern one layer up, in NIST's own FOIA
video corpus (see §1 below) — it is not a one-off, it is a structural feature of how
these collections get assembled. **Provenance must be checked per file, forever, never
per collection or per uploader.**

**Hook-reuse rule (CLAUDE.md, non-negotiable):** none of the noradtapes/groundzeroair/
thegrounding/flight93/wtccollapse files may be reused as the *first ~30s* of
sept11timeline, even though they're legitimately on-license — a byte-identical hook
file across episodes is a render-blocking preflight failure. Established evidence and
audio *can* be re-cut into the body of the film. The cold open needs freshly-sourced
(or newly re-cut, different in/out points of the *same underlying* PD source) motion
footage.

---

## 1. Real motion video — public domain / CC-BY / CC-BY-SA / CC0 candidates

### 1a. NIST-generated simulations — SAFE, already proven in this repo
Source: NIST's own "NIST-Generated Photos, Videos, Simulations" repository (Tier 1),
https://www.nist.gov/world-trade-center-investigation/photos-videos-and-simulations
(NIST-owned Google Drive). **Public domain, 17 U.S.C. §105 (US federal work).**
Wireframe/mesh FEA renderings, no photorealistic content, content-screened safe (no
people/remains/jumping).
- `Deform_r600.avi` ("WTC 1 at 0/50/90 min, Displacement Scale") — WTC1 ANSYS model, 60.2s
- `DeformedShape.avi` ("WTC 2 at 0/35/42 min") — WTC2 ANSYS model, 33s (confirm MD5 ≠ WTC1's copy of the same filename before use — a duplicate-file trap NIST itself has in this folder, already caught once in wtccollapse)
- `north_overview_8.5-25s.avi` ("LSDYNA Model of WTC-7") + `truss2_collapse-2.avi` (Column-79 mechanism close-up), `global_collapse_NW_thru16_5s.avi`, `global_collapse_SE2_thru16_5.avi`, `north_view_19.9-24.3s.avi` — WTC7 LS-DYNA models
- Label rule (already established): on-screen "NIST COMPUTER SIMULATION", never presented as photographic footage.
- **This class of asset is directly reusable for sept11timeline's structural-mechanism beats** (why WTC1/2 collapsed top-down, why WTC7 collapsed at 5:20:52 PM). Confidence: **high** — this is the one footage class in the whole episode I'd call fully verified without reservation.

### 1b. NIST FOIA "Collected Materials" video corpus — TRAP, screen every file individually
https://commons.wikimedia.org/wiki/Commons:Batch_uploading/NIST_FOIA_9-11_videos ; also
mirrored at archive.org `NIST_9-11_Release_37` and elsewhere. This is the corpus already
flagged UNSCREENED in `groundzeroair/SOURCES.md` — this scout confirms why that flag is
correctly cautious and sharpens it:
- Wikimedia's instruction is simply "upload the videos that have 'NIST FOIA' in the
  title" and blanket-tags them `Template:PD-USGov-NIST`.
- But NIST's own repository page states plainly that "materials may be protected by
  copyrights where NIST has identified the copyright owner" — i.e. NIST's FOIA
  collection deliberately includes third-party-owned footage NIST gathered as
  investigative evidence, not footage NIST itself shot.
- The file-naming pattern proves it: titles literally contain source labels like
  `R14-UC -- WPIX Dub2 01-23 (WTC2 Explosion/Hole from Below/Eyewitness Interviews)` —
  WPIX is a commercial New York news station. That clip is a news-network dub sitting
  inside a "PD" batch-upload category, not government-generated material. NIST's act of
  collecting it as evidence in a federal investigation does not transfer copyright to
  the government.
- By contrast, files in the `R25` series (e.g. `NIST FOIA 09-42- R25 -- 42A0101 -
  G25D11, Video -1 (Twin Towers Destruction)`) are NOT clearly attributed to a named
  news outlet in the title, which is consistent with — but does not prove — citizen/
  bystander origin rather than broadcast origin; provenance for *any* individual R25
  file must still be traced to its original videographer before use, since amateur
  footage is also under its own (usually all-rights-reserved, occasionally donated-PD)
  copyright and is not automatically public domain just because NIST holds a copy.
- **Verdict: do not treat this corpus as a footage pool at all for this episode.**
  It would take file-by-file forensic tracing (checking NIST's internal chain-of-
  custody documentation, which is not published alongside the video files) to clear
  any individual clip, and the downside of getting it wrong is a Content-ID strike on
  the flagship episode of the flagship subject. Skip it entirely rather than gamble.

### 1c. Pentagon security-camera footage — SAFE, verified federal work, but extremely short/low-res
- 5-frame sequence (2002) + 200-frame extended sequence (2006 release, 4 of 85 total
  camera recordings that captured anything useful) — filmed by Pentagon's own
  perimeter security cameras (not a news camera; DoD custody throughout), released via
  FOIA to Judicial Watch after the Moussaoui trial concluded.
  Mirror: https://vault.fbi.gov/911-videos (FBI FOIA reading room — direct file access
  returned 403 to automated fetch during this scout; the reading room UI requires a
  browser session, so a human needs to pull the file manually) and
  https://www.fbi.gov/video-repository/security-camera-view-of-pentagon-on-9_11.mp4/view
  (same 403-to-automation issue).
  Licence: work of a federal employee/agency in the course of official duties = public
  domain, 17 U.S.C. §105. This is as solid a PD basis as exists in this whole scout —
  it is not "famous because a network shot it," it is famous *despite* being shot by a
  government camera and released only under FOIA pressure.
- **Confidence: high on licence, low on usability** — the actual footage is a handful
  of seconds, heavily pixelated, grainy black-and-white low-frame-rate security-camera
  video. It reads on screen as "blurry dark smudge, explosion." Good for one specific
  beat (9:37:46 AM impact) cut in once, not a cold-open carrier by itself.

### 1d. FEMA "Ground Zero Timeline Compilation" — SAFE, already on disk (see §0)
Reusable body footage for the aftermath act, not eligible as this episode's hook clip
since groundzeroair already used it as ITS hook/body footage.

### 1e. DVIDS modern stand-in b-roll (NORAD ops floors, radar rooms, ATC towers, fighter
scrambles) — SAFE, PD, already fetched across noradtapes/thegrounding. Useful for
generic "this is the kind of room/kind of scramble" cutaways in sept11timeline's NEADS
and Otis/Langley beats, always captioned as modern stand-in per the existing honesty
note in `noradtapes/video/ATTRIBUTION.md`. Not day-of footage — none exists.

### 1f. NASA/ISS smoke-plume imagery — mostly STILLS, one video worth checking
MODIS/Terra and Landsat-7 imagery of the smoke plume, and ISS Expedition-3 crew
photography (Frank Culbertson) — these are overwhelmingly single-frame satellite
images, PD (NASA federal work). Worth a direct check of NASA's Earth Observatory /
Worldview archive for whether any of the MODIS passes exist as an actual orbital
video/animation rather than a still; if so it's a strong, wholly safe "how far the
plume reached" motion beat. Not verified as motion video in this pass — file under
stills unless someone confirms an actual moving clip.

### 1g. What does NOT exist as usable motion video (say so plainly)
- **No real footage of NEADS/Otis/Langley operations on 9/11 itself** — confirmed
  absent in noradtapes' own research; no camera recorded that room that morning.
- **No PD/CC footage of either aircraft impact at the WTC.** Every surviving impact
  video was shot by a bystander, a news crew, or (WTC2) captured live on network TV —
  all under private/broadcast copyright, none of it clearable at PD/CC terms. The
  Naudet brothers' WTC1-impact footage is the most famous instance and is commercially
  licensed, not free-use.
- **No real footage of the Flight 93 crash site at impact** — no camera was present;
  the only imagery is post-impact photography of the crater/debris field, and even
  that is sparse and largely law-enforcement custody.
- **No real footage of the Pentagon impact beyond the 4 FOIA-released security-camera
  angles** (§1c) — every other "Pentagon 9/11 footage" result on the open web is
  either a news dub, a modern DVIDS "As It Happened" 2017 audio-over-recreation (see
  §3), or a documentary reconstruction, none of it usable.
- **No real footage inside either tower during the evacuation/collapse.** What exists
  (still photographs, some amateur stairwell video) is under private copyright.

---

## 2. The first-30-seconds problem — cold-open candidates

CLAUDE.md's rule: first 30-60s must be real motion footage, no stills, and must not
reuse a file already used as another episode's hook.

**Top 3 candidates, ranked:**

1. **NIST WTC1/WTC2/WTC7 collapse simulations (§1a), re-cut with fresh in/out points
   never used in wtccollapse.** Licence confidence: **very high** (federal work,
   already vetted twice in this repo). Usability: the mesh visualizations are visually
   striking and unmistakably "documentary evidence," not stock — they read as urgent
   and real precisely because they're clinical. Risk: wtccollapse already used this
   *source*, so sept11timeline must cut genuinely different frames/timestamps (e.g.
   the WTC7 truss-2 connection-failure close-up, unused in wtccollapse, is a strong
   candidate never yet on screen anywhere in this repo) and treat it as one hook
   element among several rather than the entire 30s, to avoid the cold open reading as
   a rerun of wtccollapse's own opening.

2. **Pentagon FOIA security-camera sequence (§1c).** Licence confidence: **very high**
   (cleanest PD basis in this scout). Usability: **moderate** — real, dramatic, never
   used elsewhere in this repo, but only a few seconds of genuinely usable frames at
   low resolution; needs to be combined with something else (a radar-plot animation, a
   NIST simulation, a slow push on an exhibit document) to fill 30s without visibly
   looping the same handful of frames. Someone needs to pull the actual .mp4 by hand
   from the FBI Vault UI (automated fetch got a 403) and confirm frame count/duration
   before committing to it as a hook anchor.

3. **DVIDS NEADS/NORAD-ops-floor and fighter-scramble b-roll (§1e), re-cut with new
   selects not already used as noradtapes' hook.** Licence confidence: **very high**
   (PD, already verified). Usability: **moderate-high** — modern stand-in footage, but
   genuinely cinematic (operations floors, F-15/F-16 scrambles) and can visually carry
   30s on its own. Must stay honestly captioned as a modern stand-in per the existing
   house rule, and must select frames noradtapes did not already burn as its own hook.

**Honest fallback if none of the above clears final review:** a `dossier: true`
reconstruction scene (torn-newsprint / stamped "RECONSTRUCTION" treatment) built around
the Pentagon FOIA frames or a radar-plot recreation, per the documented exception for
genuinely unfilmable beats — this is not a first choice, but it is the honest one if the
Pentagon clip turns out (once someone actually opens the file) to be too short/degraded
to hold 30s even combined with other real footage.

---

## 3. Audio

**Already on disk:** ~32h of real NEADS/NORAD FOIA audio (`_evidence/noradtapes/`),
4 tape moments already located, cut, and treatment-applied (h2a/h3a/a2_9a/a2_17a — see
`noradtapes/SOURCES.md` for exact in-points). **Reusable and re-cuttable for
sept11timeline** — different scenes, same underlying licensed source, no new clearance
needed. This is this episode's best single audio asset.

**Additional PD audio worth pursuing:**
- **Remaining NEADS/NORAD channels not yet downloaded** (15 of 21 channels — see the
  noradtapes SOURCES.md table) — same archive.org item, same PD basis, pull on demand
  via `scratchpad/dl_norad.sh`. Worth pulling specifically for the 8:37:52 "is this
  real-world or exercise?" call, which noradtapes itself flags as **not yet located**
  as real audio (it's on one of the un-pulled channels). If sept11timeline's script
  needs that specific line and it can be found, that's a genuine improvement over what
  any prior episode shipped.
- **9/11 Commission public hearings.** The Commission is itself a federal body; its own
  hearing recordings and transcripts are federal works — **PD basis is solid for
  Commission-produced recordings**, distinct from any broadcaster's separate
  recording/re-air of the same hearing. Problem: the Commission's own archive
  (911commission.gov/archive, mirrored at govinfo.library.unt.edu) hosts transcripts
  and some video/RealMedia links from the mid-2000s; live-status of those old media
  links was not verified in this pass and needs a direct check before relying on them.
  Staff Statement transcripts (already used as document exhibits across this repo) are
  a safer bet than trying to source 2003-era streaming video.
- **C-SPAN — do NOT assume PD, confirmed.** C-SPAN's own copyright policy: floor
  proceedings of the House/Senate chambers are PD, but everything else C-SPAN airs
  (including committee hearings it merely broadcasts, like the 9/11 Commission
  hearings) is NOT blanket PD — C-SPAN explicitly prohibits unlicensed commercial use
  and requires a license for documentary/film use. MyC-SPAN's "free download" allowance
  (4 hearings/month) is a *personal-use* download quota, not a redistribution licence.
  **Do not source 9/11 Commission hearing audio/video from C-SPAN for this monetized
  episode** — go to the Commission's own federal-source recording/transcript instead,
  or use the printed Staff Statement / transcript as a read exhibit with Cartesia
  RECREATION voice, labeled as such.
- **FAA recordings beyond what's on disk:** the existing noradtapes evidence already
  includes the Boston Center (ZBW) tape (`faa/3_ZBW_127_SEC46R_1204-1240_UTC.mp3`).
  Other FAA facilities (Indianapolis Center for AA77/Flight 93, New York Center for
  UA175) would need their own FOIA-release search — not located as already-on-disk PD
  audio in this pass; flag as a gap if the script needs those centers' real audio
  specifically rather than a Cartesia RECREATION.

**Honesty labeling (carry forward the established rule):** any of the above tape audio
is "ACTUAL [SOURCE] RECORDING" on screen; anything voiced by Cartesia is "RECREATION."
No victim phone-call audio, no Flight 93 CVR (never publicly released) — same
exclusions noradtapes already enforces.

---

## 4. Stills

**The FEMA 403 trap, checked for recurrence:** confirmed real and worth restating
precisely. FEMA 403 ("World Trade Center Building Performance Study," 2002) is a
public-domain federal report, but its interior photography is individually credited —
e.g. the title-page photo is "courtesy of Val Junker, Mobius Communications, Inc." —
and photographer credit lines like that mean the *photograph* carries its own
copyright even though the *report text and diagrams* are PD federal work. **Only the
report's own generated diagrams/charts (structural drawings, floor plans, engineering
figures) inherit the PD status automatically; any photograph with a named non-NIST/
non-FEMA-staff photographer credit does not.**

Checked for the same pattern elsewhere in this scout:
- **EPA OIG report 2003-P-00012** (already used in groundzeroair) — text and tables PD,
  consistent with straight government-authored content; no named outside-photographer
  credits were found in the pages already extracted, so the existing use is fine, but
  any *new* photo pulled from elsewhere in that 165-page report should get the same
  photographer-credit check before use.
- **NIST NCSTAR reports** — same risk pattern as FEMA 403 is plausible (NIST also
  commissioned outside photography during the investigation); this scout did not
  exhaustively screen NCSTAR's photo appendices page-by-page, so **treat any NCSTAR
  photograph (not diagram) the same way as FEMA 403 until individually checked** —
  the NIST-generated *simulations* (§1a) are a completely different, already-verified
  asset class from NCSTAR's *photographs*.
- **Andrea Booher's FEMA/Ground Zero photography** turned up in search as a named,
  credited FEMA photographer from this event — a useful positive signal that FEMA-
  staff-photographer work (as opposed to contracted outside photography like Val
  Junker's) likely IS the federal-employee-work class of PD, but each individual image
  still needs its own credit line checked before use, not assumed from the fact that
  it's "a FEMA photo."

**Other PD/CC still candidates surfaced:**
- NASA/ISS smoke-plume stills (Terra/MODIS, Landsat-7, Frank Culbertson's ISS
  photography) — PD, federal/NASA-astronaut-official-duty work.
- Library of Congress oral-history collections (Benjamin Luft Collection of ~484
  first-responder interviews, September 11 2001 Documentary Project) — primarily audio
  narrative content, not photography, but the LOC collection pages may carry usable
  photographs/drawings (the Documentary Project description mentions "41 photographs
  and drawings") — worth a direct pull if a first-responder-voice beat needs a face to
  put with it; not independently verified for individual image licence in this pass.
- Existing repo stock (Commons CC-BY/CC-BY-SA aircraft, memorial, skyline, Capitol,
  courthouse images already fetched for groundzeroair/flight93/noradtapes) is reusable
  the same way any evidence-class asset is — not hook material, fine for body beats.

---

## 5. Documents suitable as on-screen exhibits

| Document | URL | Notes |
|---|---|---|
| **9/11 Commission Report** (GPO-authenticated) | https://www.govinfo.gov/content/pkg/GPO-911REPORT/pdf/GPO-911REPORT.pdf | Already used across this repo (Ch.1 pp.13, 45-46, 62; notes p.477 — note 120 on the missing NEADS recordings). PD, US federal work. |
| **Staff Statement No. 17** ("Improvising a Homeland Defense") | https://www.9-11commission.gov/staff_statements/staff_statement_17.pdf | Already used extensively (pp.3-19) — the single richest exhibit source for the NEADS/air-defense strand of the timeline. PD. |
| **NIST NCSTAR 1** (final WTC towers collapse report) | https://nvlpubs.nist.gov/nistpubs/Legacy/NCSTAR/ncstar1.pdf | Not yet used in this repo. PD, US federal work. Large PDF (direct fetch exceeded a 10MB auto-summarize limit in this pass — pull page ranges manually); worth mining for its structural-analysis diagrams and its own timeline-of-collapse tables as fresh exhibit pages distinct from what wtccollapse already rendered. |
| **NIST NCSTAR 1A** (WTC7 collapse final report) | https://www.nist.gov/publications/final-report-collapse-world-trade-center-building-7-federal-building-and-fire-safety-0 | PD. Companion to the WTC7 simulation videos already on disk. |
| **Pentagon Building Performance Report** (ASCE, 2003) | https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=860488 | PD (mirrored via NIST); not yet used anywhere in this repo — a real gap for the Pentagon strand of the timeline, which currently has almost no structural/engineering exhibit backing compared to the WTC strand. |
| **Arlington County After-Action Report** | https://www.arlingtonva.us/files/sharedassets/public/v/1/topics/documents/after_report.pdf | County government work; confirm PD basis before use (county-level, not federal — the "US federal work" §105 exemption doesn't automatically apply to county government publications the way it does to NIST/FEMA/9-11 Commission; Virginia's own state/local government-works copyright posture should be checked, or treat as "used with attribution" rather than assumed PD). Strong content for the Pentagon response timeline regardless of the licence nuance. |
| **NORAD-USNORTHCOM FOIA release letter + file list** | Already on disk, `_evidence/noradtapes/NORAD-USNORTHCOM_9-11_Tapes_FOIA.pdf` | Already rendered as exhibits in noradtapes (`ex_foia_letter_1.png`, `ex_foia_filelist_1.png`) — reusable exhibit imagery for sept11timeline's audio-provenance beat, not a hook. |
| **FAA/NORAD other FOIA releases** | — | Not independently located beyond what noradtapes already has; a further FOIA-release search (governmentattic.org, National Security Archive) is warranted if the script needs FAA-side (rather than NORAD-side) primary documents. |

**Visually striking pages worth flagging for the script (from what's already
extracted in this repo, cross-useful for sept11timeline):** Commission Report Ch.1
p.45 (why the Langley fighters flew east — a real strategic-confusion beat with a
citable primary-source page); Staff Statement 17 p.18-19 (the N334AA phantom-flight
log entry, "negative clearance to shoot," the no-discredit finding — three of the most
dramatic single-page exhibits already rendered in this repo); NCSTAR 1/1A's own
collapse-sequence timeline tables (not yet rendered — worth extracting fresh for this
episode specifically since it's the one video that needs the WHOLE day's timeline, not
one act of it).

---

## 6. Traps actively checked

1. **Archive.org collections mixing PD government audio with copyrighted network
   dubs in the same folder.** Confirmed pre-existing in noradtapes' own evidence
   (`nsia-911`/`government-documents`, CNN/ABC/CBS/NBC/FOX/HBO/PBS/History/NOVA sitting
   next to the real FOIA tapes). Provenance checked per-file, never per-collection.

2. **The identical pattern one layer up, newly found in NIST's own FOIA video corpus**
   (§1b) — Wikimedia's blanket `PD-USGov-NIST` tag on "anything with NIST FOIA in the
   title" incorrectly sweeps in third-party news-network footage (the WPIX-labeled
   file is the smoking gun) that NIST merely collected as investigative evidence.
   **This corpus is unsafe as a bulk pool and was excluded from the footage plan
   entirely** rather than risk file-by-file misjudgment on the channel's flagship
   9/11 episode.

3. **FEMA 403's photographer-copyright trap**, re-verified directly (Val Junker/Mobius
   Communications credit on the report's own title page) and checked for recurrence in
   EPA OIG 2003-P-00012 (clean, text/tables only, no outside-photographer credits
   found in the pages already used) and flagged as an open risk in NIST's NCSTAR photo
   appendices (not exhaustively screened this pass — treat NCSTAR photographs, as
   opposed to NCSTAR's own simulations/diagrams, with the same suspicion as FEMA 403
   until individually checked).

4. **Anything sourced from a news organization, however labeled.** Applied throughout:
   the WPIX-labeled NIST file is excluded (§1b); the DVIDS "As It Happened" Pentagon
   video (§below) is flagged as a modern audio-over-recreation, not usable as real
   archival footage of the event itself, regardless of its PD/government hosting; the
   C-SPAN 9/11 Commission hearing footage is flagged as NOT blanket-PD despite
   covering a federal proceeding, because C-SPAN (a private nonprofit) holds its own
   copyright over its broadcast production, separate from the underlying public
   proceeding.

5. **Footage famous precisely because a network shot it.** Named and excluded
   explicitly: the WTC1/WTC2 impact videos (Naudet brothers and every other surviving
   angle), any Pentagon "plane crash" footage beyond the 4 FOIA security-camera
   releases (everything else circulating as "Pentagon 9/11 footage" traces to a news
   camera, a documentary reconstruction, or the 2017 DVIDS "As It Happened" audio-led
   recreation — none of it is real day-of visual footage under a clear licence).

6. **New trap this scout surfaced, worth flagging forward for future episodes:**
   DVIDS itself is not risk-free just because it's the channel's default trusted
   source — "As It Happened - The 9/11 Pentagon Attack" (DVIDS 506581, DoD/War.gov,
   2017) LOOKS like archival footage in a DVIDS search result but is actually a
   modern audio-led compilation/recreation using real ATC/911-dispatch audio over
   illustrative visuals, not a genuine 2001 recording. PD-hosted does not automatically
   mean "real footage of the event" — check what a DVIDS item actually IS, not just
   whether it's DVIDS-hosted, exactly the same discipline the honesty note in
   `noradtapes/video/ATTRIBUTION.md` already applies to its own modern b-roll.

---

## 7. Beats with NO usable real motion footage (plan a still / exhibit / dossier scene)

Stated plainly, per the brief's instruction to be honest about absence:

- **Both WTC aircraft impacts (8:46:40 AM, 9:03:11 AM).** No PD/CC motion footage
  exists. Every surviving angle is privately/broadcast-copyrighted. Plan: NIST
  simulation footage (§1a) for the structural aftermath, exhibit stills/radar-plot
  reconstruction for the impact moment itself, or a `dossier: true` scene.
- **The Pentagon impact itself (9:37:46 AM), beyond the ~4 FOIA security-camera
  clips.** Those 4 clips are real but extremely short/low-res (§1c); anything beyond
  what they show has no PD/CC motion coverage. Plan: lean on the security-camera
  frames for the moment itself, radar-plot animation or exhibit document for buildup/
  aftermath framing.
- **Flight 93's crash (10:03:11 AM).** No camera present. No PD/CC motion footage of
  the crash itself exists at all, and post-impact site footage is sparse/law-
  enforcement custody. Plan: `dossier: true` reconstruction or a still-photo-plus-
  radar-track beat, matching how flight93's own SOURCES already handle this gap.
- **NEADS/Otis/Langley scramble operations, as they actually happened that morning.**
  No footage exists — confirmed absent in noradtapes' own research. Plan (already the
  house pattern): honestly-labeled modern DVIDS stand-in b-roll, real tape audio
  carrying the scene.
- **Evacuation and interior-stairwell scenes in either tower.** What little amateur
  footage survives is privately copyrighted, not PD/CC. Plan: exhibit documents
  (Commission Report evacuation-timeline pages), stills, or a dossier scene — never a
  video field for this beat.
- **The 9:59:04 AM and 10:28:22 AM tower collapses, from ground level.** Every ground-
  level angle in circulation is a news broadcast or a bystander video under private
  copyright. Plan: this is exactly what the NIST engineering simulations (§1a) are
  for — use the mechanism visualization instead of chasing an unclearable "real"
  collapse shot.
- **The 9/11 Commission's own hearing sessions as video**, if the script wants that
  visual specifically rather than a document exhibit. C-SPAN's footage is the only
  readily surfaced source and it's not blanket-clearable (§3). Plan: use the printed
  Staff Statement/transcript as an exhibit with Cartesia RECREATION narration, the way
  this repo already treats Mineta's testimony in thegrounding (no PDF page exists for
  that testimony either, so it's handled as an on-screen quote card, not a document
  image — same pattern applies here).

---

## Sources consulted (external, this session)

- https://commons.wikimedia.org/wiki/Commons:Batch_uploading/NIST_FOIA_9-11_videos
- https://www.nist.gov/world-trade-center-investigation/photos-videos-and-simulations
- https://www.dvidshub.net/video/506581/happened-9-11-pentagon-attack
- https://vault.fbi.gov/911-videos ; https://www.fbi.gov/video-repository/security-camera-view-of-pentagon-on-9_11.mp4/view (both 403'd automated fetch — pull manually)
- https://www.c-span.org/about/copyrightsAndLicensing/ ; https://www.c-span.org/about/termsAndConditions/
- https://science.nasa.gov/photojournal/smoke-plume-dispersal-from-the-world-trade-center-disaster/ ; https://www.jpl.nasa.gov/images/pia04388-smoke-plume-dispersal-from-the-world-trade-center-disaster/
- https://loc.gov/item/prn-15-221 ; https://www.loc.gov/collections/benjamin-luft-collection-of-9-11-oral-histories/about-this-collection/
- https://nvlpubs.nist.gov/nistpubs/Legacy/NCSTAR/ncstar1.pdf
- https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=860488 (Pentagon Building Performance Report)
- https://www.arlingtonva.us/files/sharedassets/public/v/1/topics/documents/after_report.pdf
- https://www.govinfo.gov/content/pkg/GPO-911REPORT/pdf/GPO-911REPORT.pdf
- https://www.9-11commission.gov/staff_statements/staff_statement_17.pdf
