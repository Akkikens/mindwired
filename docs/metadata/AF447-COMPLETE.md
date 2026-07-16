# Air France 447 — COMPLETE episode dossier (Black Box Breakdown)

Everything for this episode in one place: status, build, assets, honesty rules,
sources, and the full upload package.

---

## 1. Status — DONE ✅
- **Final upload file:** `Titanic of the Skies - The Fall of Air France 447.mp4` (repo root)
- **Runtime:** ~24.7 min body + baked subscribe outro = **25:16** (45,495 frames @ 30fps)
- **Loudness:** −24.3 → **−14.1 LUFS** (YouTube target) ✓
- **Channel:** Black Box Breakdown (@Watch-BlackBox) — orange `#FF9500`, wordmark "BLACK BOX"
- **Comp:** `AF447Doc` (`src/Root.tsx`), 115 scenes, `channel:"blackbox"`
- **Captions:** `Titanic of the Skies - The Fall of Air France 447.srt`
- **Source authority:** BEA Final Report (A330-203 F-GZCP), July 2012 + Appendix 1 (CVR transcript)

## 2. What the episode is
Angle: "the machine was fine — everything human around it failed." A mechanically
sound A330 stalls from 38,000 ft and falls into the Atlantic in 3.5 minutes with
two conscious pilots aboard. Pitot icing → autopilot quits → the pilot flying pulls
back and holds it → 2-year deep-ocean search for the boxes → the BEA verdict → the
13-year legal fight (acquittal 2023 → conviction on appeal May 2026 → Airbus appealing).
9 chapters.

CHAPTERS (for the description — exact, from the SRT)
```
0:00 The plane was working fine
1:16 Chapter 1 — The last flight out of Rio
3:10 Chapter 2 — The dead zone
5:34 Chapter 3 — Four minutes and twenty-three seconds
8:30 Chapter 4 — The word nobody said
10:50 Chapter 5 — The captain returns
14:14 Chapter 6 — Twenty-four messages
16:49 Chapter 7 — The abyss
19:33 Chapter 8 — What the boxes said
21:54 Chapter 9 — The longest verdict
```

## 3. How it was built (audio-forward, real-footage — NO cheap diagrams)
- **Recreated cockpit voices:** `scripts/radio_recreate.py af447` → 13 radio-EQ'd
  Cartesia lines (speaker PILOT FLYING / PILOT MONITORING / CAPTAIN, per-speaker pitch),
  shown via DocWide **RadioScene** with the orange **"CVR RECREATION"** label. Wording
  taken from the **BEA published transcript (Appendix 1) only** — never the leaked Otelli
  text. No real CVR audio exists publicly / is used (and none is claimed to be real).
- **Real photos** ($0): `scripts/fetch_media.py` → `public/shorts/af447/images/` —
  F-GZCP & sister A330s, the real **tail-fin / vertical-stabiliser recovery photos**
  (French Navy / BEA handouts), NASA/NOAA storm imagery, REMUS 6000 AUV (WHOI), Rio &
  CDG, pitot probe, recovered recorder, ocean, families.
- **Quote cards** (parameterized `quote` diagram, `arg="text||ATTRIBUTION"`): verbatim
  ACARS fault messages, BEA conclusions, and the court's words — attributed on screen.
- **Counter** (`arg="228|216 + 12|LIVES LOST"`) — parameterized, never hardcoded.
- **Narration:** `scripts/build_doc_vo.py af447` (cloned Cartesia `00d3c951-…`).
- **Render:** ONE pass, outro **baked into the comp** (`makeDocComp(doc, m, BB_OUTRO)`,
  483 frames), then `scripts/render_and_master.py` → −14 LUFS. No ffmpeg concat.

Scene mix: 115 scenes = narration+photo scenes · **13 CVR-recreation radio beats** ·
ACARS/BEA/court quote cards · 1 counter. **No AF447 official animation exists**, so this
episode has no VideoScenes — it leans on the real recovery photography and the CVR beats.

## 4. Assets on disk
- Images: `public/shorts/af447/images/` (+ ATTRIBUTION.md) — fgzcp, a330, cockpit×5,
  recovery, remus, itcz×6, rio, cdg, pitot, court, recorder, ocean×5, families.
- Audio: `public/shorts/af447/audio/` (narration + 13 cvr recreations).
- Script: `src/mindwired-doc/docs/af447.json` (+ `.manifest.json`).
- Outro (baked): `public/outro/subscribe_blackbox_long.mp4` (REAL copy, not a symlink).

## 5. Honesty / labeling (non-negotiable)
- **Cockpit dialogue** = "CVR RECREATION" (orange) — real CVR audio is not released;
  recreations use the BEA published transcript only. Never implied as real, and none of
  the leaked material is quoted.
- **No image is passed off as "the actual AF447 storm."** The ITCZ satellite shots are
  labelled as representative of the storm cells that build along the zone — the original
  "actual satellite image taken the night of the flight" line was caught in QA and
  rewritten before render (2026-07-15).
- Quote cards (ACARS / BEA / court) are verbatim from the record, attributed on screen.
- Legal status stated current & accurate: acquittal (Apr 2023) → conviction on appeal
  (Cour d'appel de Paris, May 2026) → Airbus appealing to the Cour de cassation.

## 6. Sources (for pinned replies / on-screen credibility)
- **BEA Final Report** — Airbus A330-203 F-GZCP (Air France 447), 27 July 2012, incl.
  Appendix 1 (CVR transcript) and the ACARS automatic fault-message log.
- Court: Tribunal correctionnel de Paris (Apr 2023); Cour d'appel de Paris (May 2026).
- Images: Wikimedia Commons, NASA/NOAA, French Navy / BEA recovery handouts, WHOI
  (REMUS 6000). CC BY / CC BY-SA / public domain — see the ATTRIBUTION.md above.

---

## 7. UPLOAD PACKAGE (copy-paste)

### Title (primary)
`Titanic of the Skies: The Fall of Air France 447`
A/B alternates:
- `228 People Fell for 3 Minutes and Never Knew Why — Air France 447`
- `The Plane Was Working Fine. Everyone Died. — Air France 447`
- `Three Frozen Tubes Killed 228 People — The AF447 Disaster`

### Description (English only — paste as-is, then paste CHAPTERS from §2)
```
On the night of June 1st, 2009, an Airbus A330 — one of the most advanced airliners ever built — fell out of the sky over the middle of the Atlantic Ocean. 228 people were on board. There were no survivors. And for almost two years, nobody knew why.

The aircraft was mechanically sound. The engines never failed. The wings never broke. Air France Flight 447 flew itself into the ocean in three and a half minutes — nose-up, stalled, the entire way down — while two conscious, healthy pilots sat at the controls and never understood what was happening to them.

This is the full forensic breakdown. How three small speed-sensing tubes froze over for less than a minute at 38,000 feet. How that tiny failure handed the aircraft back to a crew that had never been trained for it. How one pilot pulled back on the stick and held it there — the exact opposite of the recovery — while the airplane screamed STALL 75 times. And how it took a two-year deep-ocean search, nearly four kilometres down, to find the black boxes that finally told the story.

Everything here is grounded in the official BEA final report. The cockpit dialogue is reconstructed from the BEA's published transcript and clearly labelled on screen as recreation — no cockpit voice recorder audio is used, and none of the leaked material is quoted. The ACARS fault messages, the BEA conclusions, and the court's words are quoted directly from the record.

It is also, still, an open case. In April 2023 a French court acquitted Air France and Airbus. In May 2026 the Paris Court of Appeal overturned that acquittal and convicted both. Airbus is appealing to France's highest court. Seventeen years on, AF447 is — legally — still falling.

[CHAPTERS — see §2]

▶ MORE FROM BLACK BOX
• Too Tired to Fly: The Crash That Rewrote Aviation Law (Colgan Air 3407) → https://youtu.be/Oh8YpgbudHQ
• How Boeing Killed 346 People — The 737 MAX Disaster → https://youtu.be/d4_Rk50GkBg
• Full disaster investigations playlist → https://www.youtube.com/playlist?list=PLGVCiFZm8sRw
• Subscribe (free): https://www.youtube.com/@Watch-BlackBox?sub_confirmation=1

Sources: BEA Final Report on Airbus A330-203 F-GZCP (Air France 447), 2012, incl. Appendix 1 (CVR transcript) and the ACARS message log. Cockpit dialogue: labelled recreation from the BEA published transcript; no CVR audio used. Court outcome: Tribunal correctionnel de Paris (Apr 2023) and Cour d'appel de Paris (May 2026). Archival images public domain / Creative Commons — full credits: public/shorts/af447/images/ATTRIBUTION.md.

#AirFrance447 #PlaneCrash #Aviation
```

### Tags (~490/500 chars, one line)
```
air france 447,af447,air france flight 447,airbus a330,a330 crash,pitot tube,pitot tube icing,plane crash investigation,aviation disaster documentary,ntsb,bea report,aerodynamic stall,high altitude stall,f-gzcp,rio to paris,atlantic plane crash,black box found,cockpit voice recorder,how af447 crashed,why did air france 447 crash,pilot error,thales pitot,alternate law,coffin corner,deep ocean search,air crash investigation,mayday air disaster,black box breakdown,aviation safety,228 dead
```

### Hashtags (15 — first 3 show above title)
```
#AirFrance447 #PlaneCrash #Aviation #AF447 #AirbusA330 #AviationDisaster #Documentary #PitotTube #BlackBox #NTSB #BEA #AtlanticOcean #AirCrashInvestigation #TrueStory #Education
```

### Pinned comment
```
228 people died in an airplane that was mechanically perfect, because three tubes iced over for under a minute and every human system around that moment failed at once. Everything here comes from the official BEA final report; cockpit lines are labelled recreations from the published transcript — no CVR audio, none of the leaked material. In May 2026 the Paris Court of Appeal finally convicted Air France and Airbus; Airbus is appealing. Seventeen years later, this case is still falling. Subscribe for the next breakdown. ✈️🔧
```

### YouTube category / license
- Category: **Education** (or People & Blogs). License: Standard YouTube License.

---

## 8. Re-render / reproduce
```bash
# (assets already fetched; outro is a REAL copy in public/outro/, never a symlink)
.venv-lipsync/bin/python scripts/radio_recreate.py af447        # CVR beats (skips existing)
.venv-lipsync/bin/python scripts/build_doc_vo.py af447          # narration + manifest
python3 scripts/render_and_master.py AF447Doc blackbox_af447.mp4 # ONE pass, outro baked, -14 LUFS
.venv-lipsync/bin/python scripts/gen_doc_srt.py af447           # -> rename to the title .srt
# then rename the deliverables to the video title:
#   mv blackbox_af447.mp4 "Titanic of the Skies - The Fall of Air France 447.mp4"
#   mv blackbox_af447.srt "Titanic of the Skies - The Fall of Air France 447.srt"
```

## 9. Learnings applied (standing rules — see memory)
- No procedural diagrams; feature real audio at length + real footage/photos.
- CVR recreations via DocWide RadioScene + radio_recreate.py; recreation = orange label,
  wording from the official published transcript only (no leaked audio/text).
- Never claim a representative image is the actual event footage (ITCZ QA catch).
- Outro baked into the comp = ONE render (real copy in public/outro/, not a symlink).
- Parameterized `counter` / `quote` (arg), never hardcoded numbers or text.
- Legal outcomes stated current, not the outdated "acquitted, the end."
- Final deliverable named with the actual video title (YT SEO + direct upload).

## 10. TODO for this episode
- **Thumbnail** — A330 tail fin from the black Atlantic, yellow ALL-CAPS
  "THE PLANE WAS FINE" / "TITANIC OF THE SKIES" (see docs/guides/THUMBNAILS.md).
- **Shorts** (optional) — strong hooks: the CVR "I have the controls" beat, the
  3.5-minute stalled fall, "the plane was working fine."
