# KURSK — production handoff (2026-08-15)

**STATUS: PUBLISHED.** Master mp4 no longer on local disk (already uploaded
and cleared) — `.srt` remains at repo root for reference. Add the real
YouTube URL to `mindwired-published-urls` memory and this file once handy.

Final files at repo root:
- `Russia Said They Died Instantly. They Didn't..mp4` — 3840×2160, 1150.3s
  (19:10, includes baked-in BB outro), **−14.2 LUFS** (master log confirmed)
- `Russia Said They Died Instantly. They Didn't..srt` — whisper-generated,
  338 speech cues, word-accurate off the actual master (not the offline
  estimate), speech runs to 19:09.75

Verification done: 3 stills pulled and eyeballed (cold open — real Oscar-II
sister-ship footage; mid-body c6_1 — the real Priz photo, dossier caption
correct; outro splice — Reid/@Watch-BlackBox subscribe card present and
clean). GCE VM auto-deleted after fetch, no leftover billing. Render log:
`out/kursk_gce_launch.log`.

## What's left (in order)

1. **Akshay: listen to the VO ear-check sample** (sent earlier,
   `out/qa/kursk_vo_sample.mp3`) and review the 3 thumbnails
   (`out/thumbs/kursk_A/B/C.png`) if not already done.
2. Upload per `docs/metadata/METADATA-kursk.md` (3 thumbnails → Test &
   Compare, single-video end screen, pinned comment, description with the
   CC-BY credit block — the credits are a LICENSE REQUIREMENT, not optional).
3. shorts-funnel: cut 3-4 trailer Shorts (suggested windows: the seismogram
   cold-open beat; the SAID-vs-TRUE receipts run c5_2-c5_5; the 60°-lean
   exhibit c6_3-c6_8; the note beats c8_2-c8_6) → SHORTS-SCHEDULE-kursk.md.
4. 48h launch-diagnosis → LAUNCH-LESSONS.md after publish.

## What's done (all gates green)

| Step | State |
|---|---|
| Icahn validation | PASS-COND, memory `icahn-kursk` (8-candidate adversarial sweep, wf_c5c0eac8-232) |
| Locked package | Title + 3 BUILT thumbnails (`out/thumbs/kursk_A/B/C.png`) + adjacency cluster |
| CLAIMS fact base | `docs/planning/CLAIMS-kursk.md` — 6-agent fan-out (wf_78547df0-372) + ⚠ DATA CORRECTIONS block |
| Script | `src/mindwired-doc/docs/kursk.json` — 105 scenes, 12 chapters, receipts spine |
| Footage | 100% real + license-verified (see both ATTRIBUTION.md files); NO fetch_doc_footage run needed — all manual API pulls (the generic fetcher returns Ukraine-war "Kursk Oblast" junk for this topic; do NOT re-run it against this slug) |
| VO | 105 Cartesia clips @ 0.96, 16.7 min narration; 0 empty clips; ear-check sample at `out/qa/kursk_vo_sample.mp3` — **Akshay: LISTEN before/at upload review** |
| TTS lint | clean (exit 0) |
| Relevance audit | 0 blocking; residual warnings are Cyrillic-title keyword false positives, each eyeballed (verified real + on-topic) |
| Preflight | **0 blocking**, 9 verified-false-positive warnings |
| Comp | `KurskDoc` registered in Root.tsx, BB_OUTRO baked (483f) |
| Stills | 5 rendered + eyeballed (cold open, both exhibits w/ highlight boxes verified, Vidyayevo photo, note DossierScene) — `out/qa/kursk_f*.png` |
| SRT (offline fallback) | `mindwired_kursk.srt` + chapters (in METADATA) |

## Sensitivity (binding, from CLAIMS DATA CORRECTIONS)

- Seismic canon = DSA/NORSAR only (mag 1.5 / 3.5, 07:29:50 / 07:32:00 GMT, "two minutes and ten seconds").
- Living persons attributed-never-asserted throughout (Putin, Popov, Ustinov, Klebanov, Kuznetsov, Olga Kolesnikova, Nadezhda Tylik, Russell).
- Collision theory = attributed claim + seismology rebuttal, never platformed.
- Kolesnikov note = labeled RECONSTRUCTION; one translation rendering (IOL/GlobalSecurity); second note's author never named as fact.
- Official ≤8h survival finding stated as the official verdict; longer claims attributed to Kuznetsov/families; tapping presented as logged-and-contested.
- No Basayev sabotage claim (defames two named victims — EXCLUDE).
- Sister-ship footage labeled as such in-scene (Orel/Tomsk).

## Wave calendar

Publish late Sept → early Oct 2026. Oct 8 = 25th anniversary of the raising;
Oct 25 = anniversary of the note's recovery. Re-check ratios if production
slips past ~2026-08-28 (icahn rule). ALSO ON THE CALENDAR: AAIB told India's
Supreme Court the AI171 DRAFT final report is expected by **October 2026** —
check weekly in Oct; that episode outranks everything when the report drops.

## Publish-queue note

Costa Concordia (BB) is rendered and still awaiting Akshay's review/upload.
Kursk = second in the BB publish queue. Both are maritime — if a non-maritime
mindwired upload (Ötzi is rendered) can sit between them on the calendar, do
that.
