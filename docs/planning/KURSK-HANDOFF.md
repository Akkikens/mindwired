# KURSK — production handoff (2026-08-15)

**STATUS: RENDER-READY. Everything is built and gated; the ONE 4K render is
blocked ONLY on `gcloud auth login` (interactive — Akshay must run it).**

## The one command chain left

```bash
gcloud auth login   # Akshay, interactive — creds expired 2026-08-15
```

then:

```bash
nohup scripts/render_gce.sh KurskDoc kursk \
  --music public/beds/bed_tension_rud.mp3 --windows kursk --music-gain-db -20 \
  > out/kursk_gce_launch.log 2>&1 &
until grep -q '\[gce\] done ->' out/kursk_gce_launch.log; do sleep 180; done
```

(Windowed bed per the long-doc music rule; bed_tension_rud rotates off Costa
Concordia's falsevacuum. GCE is on-demand, never spot — memory
`gce-renders-ondemand`; scp flake recovery instructions print in the log.)

## After the render (in order)

1. Verify: ffprobe duration ≈ **1139s** (34,028 body frames + 483 outro ÷ 30 —
   confirm against the render log's frame count), 3840×2160, −14 LUFS line in
   the log; extract + LOOK at a mid frame and an outro frame.
2. `.venv-agent/bin/python3 scripts/whisper_srt.py out/kursk_gce.mp4 --out "Russia Said They Died Instantly. They Didn't..srt"`
   (replaces the offline `mindwired_kursk.srt`; eyeball first ~5 cues).
3. Rename master to `Russia Said They Died Instantly. They Didn't..mp4` at repo
   root (mp4-filename-is-title).
4. Upload per `docs/metadata/METADATA-kursk.md` (3 thumbnails → Test & Compare,
   single-video end screen, pinned comment, description with the CC-BY credit
   block — the credits are a LICENSE REQUIREMENT, not optional).
5. shorts-funnel: cut 3-4 trailer Shorts (suggested windows: the seismogram
   cold-open beat; the SAID-vs-TRUE receipts run c5_2-c5_5; the 60°-lean
   exhibit c6_3-c6_8; the note beats c8_2-c8_6) → SHORTS-SCHEDULE-kursk.md.
6. 48h launch-diagnosis → LAUNCH-LESSONS.md.

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
