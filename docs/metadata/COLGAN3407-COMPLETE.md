# Colgan Air 3407 — COMPLETE episode dossier (Black Box Breakdown)

Everything for this episode in one place: status, build, assets, honesty rules,
sources, and the full upload package.

---

## 1. Status — DONE ✅
- **Final upload file:** `blackbox_colgan3407.mp4` (repo root)
- **Runtime:** 27:34 body + baked subscribe outro ≈ **27.8 min**
- **Loudness:** −14.3 LUFS (YouTube target) ✓
- **Channel:** Black Box Breakdown (@Watch-BlackBox) — orange `#FF9500`, wordmark "BLACK BOX"
- **Comp:** `Colgan3407Doc` (`src/Root.tsx`), 126 scenes, `channel:"blackbox"`
- **Captions:** `blackbox_colgan3407.srt` (313 cues)
- **NTSB case:** DCA09MA027 · report **NTSB/AAR-10/01**

## 2. What the episode is
Angle: "Flying Cheap" corporate-accountability forensics. Icing red herring →
real cause (captain pulled into the stall, overrode the stick pusher) → WHY:
fatigue, ~$16k/yr FO, a captain who failed 5 checkrides, Colgan's procedures →
the families → the 1,500-hour rule. 10 chapters.

CHAPTERS (for the description)
```
0:00 The last 27 seconds
1:15 Continental Connection 3407
3:21 Two tired pilots
7:44 A conversation, instead of a checklist
9:45 Lots of ice
11:15 The approach
13:08 Twenty-seven seconds
15:50 Clarence Center
17:13 The red herring
19:35 The real cause
23:06 Flying cheap — and the families who changed the law
```

## 3. How it was built (audio-forward, real-footage — NO cheap diagrams)
- **Real ATC audio** (FAA public domain): `scripts/fetch_ntsb_docket.py DCA09MA027
  --faa-audio` → `public/shorts/_evidence/colgan3407/CO_CERTIFIED_*.mp3`. Trimmed to
  3× ~35s beats (`audio/atc1..3.mp3`), shown via DocWide **RadioScene** with the GREEN
  "ACTUAL ATC RECORDING" label.
- **Recreated cockpit voices:** `scripts/radio_recreate.py colgan3407` → 9 radio-EQ'd
  Cartesia lines (speaker CAPTAIN/FIRST OFFICER, per-speaker pitch), orange
  "CVR RECREATION" label. Lines from the NTSB public transcript only.
- **NTSB crash animation** (public domain): downloaded from Wikimedia Commons →
  converted to `public/shorts/colgan3407/video/ntsb_anim.mp4` (+ segments). Played via
  DocWide **VideoScene** with `videoFrom` windows (chronological through the approach→
  stall→impact). This replaced all blueprint diagrams.
- **Real photos** ($0): `scripts/fetch_media.py` → `public/shorts/colgan3407/images`
  (Q400, cockpit, Buffalo, winter/icing, Seattle, crash site, NTSB, Capitol/hearing).
- **Narration:** `scripts/build_doc_vo.py colgan3407` (cloned Cartesia `00d3c951-…`).
- **Render:** ONE pass, outro **baked into the comp** (`makeDocComp(doc, m, BB_OUTRO)`,
  483 frames), then `scripts/render_and_master.py` → −14 LUFS. No ffmpeg concat.

Scene mix: 126 scenes = narration+photo scenes · **16 NTSB video scenes** ·
**12 radio beats** (3 real ATC + 9 CVR recreation) · 3 counter numbers.

## 4. Assets on disk
- Evidence (PD/gov): `public/shorts/_evidence/colgan3407/` — real ATC mp3s, NTSB
  final report PDF (AAR-10/01), CVR stick-shaker study, pipeline report, NTSB
  animation .ogv, SOURCES.md.
- Video: `public/shorts/colgan3407/video/ntsb_anim.mp4` (+ segments).
- Images: `public/shorts/colgan3407/images/` (+ ATTRIBUTION.md).
- Audio: `public/shorts/colgan3407/audio/` (narration + atc1-3 real + *cvr recreations).
- Script: `src/mindwired-doc/docs/colgan3407.json` (+ `.manifest.json`).
- Outro (baked): `public/outro/subscribe_blackbox_long.mp4` (REAL copy, not a symlink).

## 5. Honesty / labeling (non-negotiable)
- **Real ATC** = "ACTUAL ATC RECORDING" (green) — FAA-released, public domain.
- **Cockpit dialogue** = "CVR RECREATION" (orange) — real CVR audio is sealed by US
  law; recreations use the NTSB public transcript only. Never implied as real.
- Defamation-safe: everything attributed to the NTSB; the captain's record stated as
  documented; the $16k figure attributed to reporting/FRONTLINE, not the NTSB.

## 6. Sources (for pinned replies / on-screen credibility)
- NTSB Aircraft Accident Report **NTSB/AAR-10/01** "Loss of Control on Approach"
- FAA-released ATC audio, 2009-02-12 (public domain)
- NTSB docket **DCA09MA027**; PBS FRONTLINE "Flying Cheap" (narrative source)

---

## 7. UPLOAD PACKAGE (copy-paste)

### Title (primary)
`Too Tired to Fly: The Crash That Rewrote Aviation Law (Colgan Air 3407)`
A/B alternates:
- `$16,000 a Year: The Colgan Air 3407 Disaster`
- `The Red Herring That Hid the Real Cause — Colgan Air 3407`
- `The Crash That Changed How Every US Pilot Is Hired`

### Description (English only — paste as-is, then paste CHAPTERS from §2)
```
It was a 53-minute flight. A routine hop from Newark to Buffalo on a snowy night in February 2009 — and the entire disaster happened in the last 27 seconds.

A stall warning went off in the cockpit. The recovery is the first thing every pilot learns: push the nose down, add power. The captain of Colgan Air Flight 3407 did the exact opposite — he pulled back, and fought the one automatic system trying to save the plane. It fell out of the sky onto a house in Clarence Center, New York. All 49 people on board, and one man asleep in his home below, were killed. 50 dead.

Everyone blamed the ice. The investigators found something far more uncomfortable. This is the full forensic breakdown of how two exhausted, underpaid, under-trained pilots ended up flying you through a snowstorm in the first place — a first officer earning $15,800 a year who had flown overnight across the country just to get to work, and a captain who had failed five checkrides. It's the story of "flying cheap," and of the grieving families who forced Congress to change the law — the reason every US airline pilot now needs 1,500 hours before they can carry you.

Everything in this video is grounded in the official NTSB accident report (AAR-10/01), including the real FAA air traffic control audio. Cockpit dialogue is reconstructed from the NTSB's public transcript and clearly labeled as recreation. No cockpit voice recorder audio is used.

[CHAPTERS — see §2]

▶ MORE FROM BLACK BOX
• Titanic of the Skies: The Fall of Air France 447 → https://youtu.be/ZvD4n8uNnuk
• How Boeing Killed 346 People — The 737 MAX Disaster → https://youtu.be/d4_Rk50GkBg
• Full disaster investigations playlist → https://www.youtube.com/playlist?list=PLGVCiFZm8sRw
• Subscribe (free): https://www.youtube.com/@Watch-BlackBox?sub_confirmation=1

Sources: NTSB Aircraft Accident Report AAR-10/01; FAA-released ATC recordings (public domain). ATC audio labeled "ACTUAL ATC RECORDING." Cockpit dialogue: labeled recreation from the NTSB public transcript. Archival images public domain / Creative Commons — full credits: public/shorts/colgan3407/images/ATTRIBUTION.md.

#ColganAir #PlaneCrash #Aviation
```

### Tags (~490/500 chars, one line)
```
colgan air 3407,colgan air flight 3407,flight 3407,buffalo plane crash,pilot fatigue,aviation disaster documentary,plane crash investigation,ntsb,aerodynamic stall,stick shaker,stick pusher,1500 hour rule,flying cheap,regional airline,continental connection,bombardier q400,dash 8 q400,rebecca shaw,aviation safety,air crash investigation,real atc audio,how flight 3407 crashed,why did colgan 3407 crash,airline safety act,pilot pay,black box breakdown,mayday air disaster
```

### Hashtags (15 — first 3 show above title)
```
#ColganAir #PlaneCrash #Aviation #Flight3407 #AviationDisaster #Documentary #PilotFatigue #NTSB #BlackBox #Buffalo #AirCrashInvestigation #FlyingCheap #TrueStory #Q400 #Education
```

### Pinned comment
```
50 people died on a 53-minute flight because the system that put two exhausted, underpaid pilots in that cockpit had cut every corner it could. Everything here comes from the official NTSB report (AAR-10/01) and the real FAA ATC audio; cockpit lines are labeled recreations from the public transcript. The families of Flight 3407 turned their grief into the 1,500-hour rule — the reason flying is safer today. Subscribe for the next one. ✈️🔧
```

---

## 8. Re-render / reproduce
```bash
# (assets already fetched; outro is a REAL copy in public/outro/, never a symlink)
.venv-lipsync/bin/python scripts/radio_recreate.py colgan3407      # CVR beats (skips existing)
.venv-lipsync/bin/python scripts/build_doc_vo.py colgan3407        # narration + manifest
python3 scripts/render_and_master.py Colgan3407Doc blackbox_colgan3407.mp4  # ONE pass, outro baked, -14 LUFS
.venv-lipsync/bin/python scripts/gen_doc_srt.py colgan3407         # -> rename to blackbox_colgan3407.srt
```

## 9. Learnings applied (now standing rules — see memory)
- No procedural diagrams; feature real audio at length + real footage/photos.
- Use DocWide RadioScene + radio_recreate.py; real=green label, recreation=orange.
- Outro baked into the comp = ONE render (real copy in public/outro/, not a symlink).
- Parameterized `counter` (arg), never hardcoded numbers.
- Confirm channel before the first render; still-verify every new scene type first.
- TODO for this episode: thumbnail (see docs/guides/THUMBNAILS.md).
