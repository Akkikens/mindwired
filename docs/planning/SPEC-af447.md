# SPEC — Air France 447 ("Titanic of the Skies") — Black Box Breakdown ep. 2

**Status:** spec / awaiting go. **Channel:** Black Box Breakdown (`channel:"blackbox"`,
orange `#FF9500`, wordmark "BLACK BOX"). Confirm channel before first render.
**Engine:** mindwired-doc archival ($0) + DocWide animated diagrams (+ limited R3F/GL).
**Runtime target:** 35–42 min. **Narrator:** cloned Cartesia `00d3c951-…`.
**Outro:** `assets/subscribe-outro/subscribe_blackbox_long.mp4` (Reid).

## Why (Icahn, validated 2026-07)
8.5/10 viral. Outlier proof: Air Crash Investigation (237K subs) → 4.4M on AF447
(~18.6:1); Mentour 9M; TheFlightChannel 4.3M evergreen; fresh 2026 upload 158K/3 days.
30–45 min is the proven format. Low-effort versions flop → win on production + a
fresh angle. Demonetization low (respectful, factual; no "final moments" sensationalism).

## Positioning / differentiator
Everyone tells the cockpit-stall story. We lead on the **forensic mystery**: 228
people vanish, and for 2 years the ONLY evidence is **24 automated ACARS messages** —
decode them → the 2-year deep-ocean recovery → then resolve into the cockpit human
factors → the Thales pitot "known problem" paper trail → the 2022–23 criminal trial.
That's the under-served angle and it fits the "black box = the record of what went
wrong" brand.

## HONESTY / audio model (AF447 has NO real ATC or CVR audio — confirmed)
- **Narrator** carries the story (cloned voice).
- **REAL ACARS** rendered on screen, labeled `REAL ACARS TRANSMISSION · HH:MM UTC`,
  cited to the BEA report. This replaces "real ATC audio" as the genuine evidence beat.
- **CVR dialogue = labeled recreations**: `scripts/radio_recreate.py` + Cartesia,
  radio-EQ, spoken ONLY from the **official BEA Final Report transcript (Annexe 1)**.
  Every instance captioned `CVR RECREATION` + a spoken/preroll disclaimer.
- **NEVER**: any "real ATC/CVR audio" claim; the leaked *Erreurs de Pilotage* transcript.
- Sources on screen: BEA Final Report (5 July 2012) — FAA.gov mirror for a US-gov PD host.

## Visual model ("limited OpenGL")
Primary = **2D SVG diagrams** (extend `src/mindwired-doc/Diagrams.tsx`) + real PD/CC
stills (Ken-Burns) + NASA PD weather. Use **R3F/OpenGL ONLY** for the 2–3 shots 2D
can't sell (3D flight path over the nighttime Atlantic; the stall attitude / 3.5-min
freefall). GL comps render with `--gl=angle`; keep them few (cost/CPU + user pref).

New diagram scenes to build:
- `pitot` — pitot tube icing → airspeed reading collapses → "AIRSPEED DISAGREE"
- `laws` — autopilot drops, Normal Law → **Alternate Law** (protections lost)
- `stall` — AoA climbing past the stall threshold while nose is held UP (the core tragedy)
- `freefall` — altitude vs time: cruise 35,000 ft → zoom-climb to 38,000 → 3.5-min
  stall descent to impact (the "coffin" trace; AF447's signature image)
- `route` — Rio → INTOL → the ATLANTICO/DAKAR radar DEAD ZONE → impact point
- `abyss` — depth scale: surface → 3,900 m seabed, REMUS 6000 search (recovery arc)
- reuse `quote` for ACARS/CVR text beats; `counter` for the 228 toll

## Chapter structure (~10 chapters)
- HOOK (0–60s): the 3.5-min freefall + "the pilots never knew they were falling" +
  "for 2 years, the only clue was 24 automated messages."
- TITLE card: BLACK BOX / Air France 447 — Titanic of the Skies
- Ch1 The last routine flight (Rio→Paris, F-GZCP, the crew, the oceanic route)
- Ch2 The dead zone (no radar/ATC mid-Atlantic; the ITCZ storm wall ahead)
- Ch3 24 messages (the ACARS cascade — real on-screen evidence; the only clue)
- Ch4 What the messages meant (pitot icing → airspeed disagree → autopilot off →
  Alternate Law) — diagram-heavy
- Ch5 The abyss (4 search campaigns, WHOI, REMUS 6000, wreckage at 3,900 m, recorders up 2011)
- Ch6 Inside the cockpit (CVR RECREATION beats: confusion, persistent nose-up, stall warning)
- Ch7 The human factors (why a working plane was stalled: automation dependency,
  the junior pilot, captain out of seat, conflicting inputs)
- Ch8 The reckoning (Thales pitot AD "known problem"; BEA causes; 2022–23 trial + verdict)
- Ch9 What it changed (pitot replacement, stall-recovery training, manual-flying) + close + subscribe

## Best HOOKS (pick 1; A/B the rest as first line)
1. "For three and a half minutes, a perfectly working airliner fell out of the sky —
   and the two pilots at the controls never realized they were falling."
2. "228 people took off from Rio. For the next two years, the only trace of them was
   24 automated messages from a dying plane."
3. "They called it the Titanic of the Skies. Then, in the middle of the night, over
   the middle of the ocean, it simply vanished."

## TITLE (for packaging)
- Primary: `Titanic of the Skies: How Air France 447 Fell Out of the Sky`
- Alts: `The Plane That Stalled for 3.5 Minutes (Air France 447)` /
  `228 Gone, One Clue: The Air France 447 Mystery` /
  `The Crash That Fell 38,000 Feet — Air France 447`

## $0 asset plan (fetch_media.py → public/shorts/af447/images, verify each license)
- `fgzcp` — the actual aircraft (Commons `Category:F-GZCP`)  ⚠ log per-file license
- `wreckage` — `File:Wreckage of F-GZCP.jpg` (verify license)
- `a330cockpit` — generic A330 glass cockpit (labeled "A330 flight deck", not F-GZCP)
- `pitot` — pitot tube photos (+ our diagram)
- `search` — search vessels / REMUS 6000 / Île de Sein (verify; US Navy PD where possible)
- `bea` — BEA report cover / investigators (or reuse flight-recorder pool from 737 MAX)
- `itcz` — NASA GOES/Earth Observatory ITCZ + tropical Atlantic storms (PD)
- `rio` / `cdg` — Galeão & Charles de Gaulle airport (Commons)
Redraw all BEA figures as diagram scenes (rights-safe). Run audit_doc_images before render.

## Pipeline (ONE render, Black Box branded)
1. Confirm channel = Black Box. 2. Write `docs/... ` script JSON (`src/mindwired-doc/docs/af447.json`,
`channel:"blackbox"`). 3. Build new diagram scenes. 4. `fetch_media.py` per subject +
license log. 5. `radio_recreate.py` for CVR-recreation beats (before VO build). 6.
`audit_doc_images.py`. 7. `build_doc_vo.py`. 8. Register comp `AF447Doc`. 9. Still-verify
diagrams + a chapter. 10. ONE full render → master −14 LUFS → append Reid outro → verify.
11. `METADATA-af447.md` (English only) + SRT + attribution.
