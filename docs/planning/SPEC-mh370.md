# SPEC — MH370 (Black Box Breakdown flagship) · "the best video yet"

Channel: **Black Box Breakdown** (@Watch-BlackBox), `channel:"blackbox"`, host Reid,
doc engine (DocWide). Comp `MH370Doc`. Outro baked in (`subscribe_blackbox_long.mp4`,
483f). Final upload: title-named .mp4. Target the channel's **longest + most cinematic**
episode: **~38–45 min**, animation-forward (Veo b-roll + one signature animated map +
real archival video), not a still slideshow.

## Why this is THE flagship
MH370 is the biggest unsolved mystery in aviation history — and it is **still live in
2026**. That is the hook no other MH370 video has: we end in the present tense.

- 8 Mar 2014: Malaysia Airlines MH370, Boeing 777-200ER (reg **9M-MRO**), Kuala Lumpur→
  Beijing, **239 aboard (227 passengers + 12 crew)**. Vanished from radar ~00:21 MYT.
- Last voice: **"Good night, Malaysian three seven zero"** (01:19 MYT, near waypoint
  IGARI, at the Malaysia→Vietnam handoff). Transponder stops ~01:21.
- Military radar tracked a **deliberate turn back** west across the Malay Peninsula, up
  the Strait of Malacca, past Penang, then gone.
- **Inmarsat satellite handshakes** ("pings") — the only witness left — put a final
  "7th arc" in the **remote southern Indian Ocean**; fuel exhaustion ~08:19 MYT.
- Debris confirmed: the **Réunion Island flaperon** (Jul 2015) + pieces on Mozambique,
  South Africa, Mauritius, Madagascar, Tanzania — drift analysis consistent with the arc.
- Searches: ATSB-led underwater search (~120,000 km², ended 2017); Ocean Infinity 2018;
  then the modern beat →

**The 2026 ending (verified, current):** Ocean Infinity returned under a **"no-find,
no-fee"** deal (Malaysia pledged a **$70M reward**). Search **concluded 23 Jan 2026 with
NOTHING found**, after **140,000+ km²** total. In **June/July 2026 Malaysia extended the
deal to 30 June 2027** (~7,400 km² remaining, searches Nov–Apr). A private company spent
its own money hunting the seabed and came back empty. **We are the video that ends
today, with the ocean still holding it.**

## HONESTY & DEFAMATION PLAN (non-negotiable — read before scripting)
MH370 names a **real, deceased person with a living family** (Captain Zaharie Ahmad
Shah) and a living First Officer's family (Fariq Abdul Hamid). The "deliberate
diversion / pilot" theory is the most-discussed but has **never been proven** and the
official investigation **could not determine** a cause. Rules:

1. **Never state, imply, or lean the edit toward "the captain did it" as fact.** Present
   the deliberate-diversion theory as a *theory*, attributed (some investigators;
   journalism such as *The Atlantic*), always paired with the official position and the
   counter-evidence.
2. **The home-simulator detail** (FBI recovered a partial route on his personal flight
   sim ending in the southern Indian Ocean) is real but **circumstantial**; state exactly
   that, note investigators said it proved nothing conclusive, and do not dwell on his
   face during it.
3. **Official position always gets the last word** in the theories chapter: the Malaysian
   Annex 13 safety report (2018) could not determine the cause and did not rule out
   third-party interference; the turn-back was likely manual but unattributable.
4. **The two stolen-passport passengers**: name the fact, then immediately give the
   resolution — investigated, assessed as **likely asylum seekers, not terrorism**. Do
   not leave a false terrorism implication hanging.
5. **No fabricated cockpit dialogue.** No CVR was ever recovered — none exists. The ONLY
   real transmissions are the known ATC exchanges. Recreate those as radio beats labeled
   **"ATC — RECREATION"** (audio was never officially released; only the transcript was).
   Do not invent anything said inside the cockpit.
6. Passengers/families shown with dignity, never as props.

## Structure (teaser-first cold open, then chapters — channel convention)
**COLD OPEN (0–~40s, no logo):** the last words → "and then a Boeing 777 with 239 people
vanished from every radar on Earth. Twelve years, two hundred million dollars, and the
largest search in history have not found it. This is everything we know." → wordmark →
title card.

1. **The last 40 minutes** — pushback at KL, climb, the routine handoff, "Good night,
   Malaysian three seven zero," transponder off at IGARI. (ATC recreation beat.)
2. **The turn** — military radar: the deliberate westward turn back across Malaysia, up
   the Strait of Malacca, past Penang, off the scope. Someone flew it there.
3. **The only witness left** — how a comms satellite (Inmarsat) accidentally became the
   black box: the handshakes, the Doppler math, the seven arcs. **Signature animated map.**
4. **Seven hours into nowhere** — the southern arc, the "ghost flight"/hypoxia vs
   controlled-glide debate, fuel exhaustion, the final partial handshake.
5. **The ocean gives back pieces** — Réunion flaperon (2015), the global debris trail,
   drift modelling, what the flaperon's trailing-edge damage did and didn't tell us.
6. **239** — who was on board; the two stolen passports (and why it wasn't terrorism);
   the families who have waited 12 years.
7. **The theories, weighed** — hypoxia/ghost flight · fire/electrical · hijacking ·
   deliberate diversion (+ simulator, handled per rules). Each: the case FOR, the case
   AGAINST, verdict = unproven. Official position last.
8. **The greatest search on Earth** — ATSB effort, cost, Ocean Infinity 2018, then the
   **2025–2026 no-find-no-fee** search, concluded Jan 2026 with nothing, extended to
   June 2027. The $70M no one has collected.
9. **Why it changed flying / why it still matters** — GADSS + 15-minute tracking rules
   born from MH370; the families' fight; the ocean still holding the answer *right now*.

**CLOSE:** verbal bridge → AF447 ("MH370 is the plane we never found — but even the one
we DID pull from the Atlantic took two years and told a story just as disturbing…")
→ subscribe to Black Box.

## Animation / media plan (out-of-comfort-zone, animation-forward)
- **Veo 3.1 hero b-roll — CAPPED at 5 clips ≈ $7–9 (budget ≤ $10, Akshay 2026-07-16).**
  (Gemini API, `--model fast`, 16:9, ~$1–2/8s clip.) Original cinematic recreations,
  **faces never clearly shown**, no text/logos (NEG prompt). Reserved ONLY for
  MH370-specific motion with no free equivalent: (1) night 777 taxi/climb into black sky;
  (2) dark cockpit night ambience, no identifiable faces; (3) a flaperon washing in surf
  on a beach; (4) a search ship sweeping sonar / an AUV descending into the abyss at night;
  (5) a candlelight vigil, crowd indistinct. Output → `public/shorts/mh370/video/<id>.mp4`.
- **REUSE (free)** the owned NASA SVS + Pexels space/ocean clips in
  `public/shorts/endoftime/freeclips*` for the Earth-from-space / night-Earth / satellite
  beats — do NOT spend Veo on those.
- **One signature animated map** — Remotion-drawn flight path + the 7 Inmarsat arcs over a
  **real PD satellite basemap** of the SE Asia / Indian Ocean. Slow, glowing, cinematic —
  motion graphics over real imagery, NOT a flat blueprint diagram.
- **Real archival video** (PD/CC) where it exists: NASA/NOAA Earth-from-space & ocean,
  any ATSB/gov search visualisation that is openly licensed.
- **Real photos** (Ken-Burns) for concrete artifacts only: the actual 9M-MRO, KLIA/Beijing,
  the confirmed debris pieces, search ships, families/vigils. Captain/FO shown minimally
  and neutrally, never as the "villain shot."
- Fetchers: `fetch_media.py` (Commons/Openverse, license-filtered + ATTRIBUTION.md),
  `gen_mh370_broll.py` (new, Veo, adapted from `gen_veo_broll.py`, outputs to
  `public/shorts/mh370/video/<id>.mp4`). Contact-sheet audit before render.

## Audio
- Narrator: cloned Cartesia `00d3c951-…` (channel voice). Build via `build_doc_vo.py mh370`.
- ATC recreation beats: `radio_recreate.py mh370` (speaker "ATC"/"MH370"), radio EQ,
  labeled **"ATC — RECREATION"**. Run BEFORE the VO builder.
- Music bed: `--music public/beds/doc_tension.mp3` (dread) under the −18 dB sidechain duck.
- TTS lint (`lint_tts_text.py`) before VO: "seven seven seven", "nine-M-M-R-O",
  "M-H three seven zero", "one nineteen UTC" spoken correctly.

## Build order (single full render at the end)
1. Lock this spec → 2. Fetch $0 photos + real archival video → 3. Generate Veo hero clips
→ 4. Build the animated-map sequence (Remotion) → 5. Write `mh370.json` (~150–180 scenes)
→ 6. `radio_recreate.py` (ATC beats) → 7. `lint_tts_text.py` → 8. `build_doc_vo.py`
→ 9. audit images+video ↔ scenes → 10. register `MH370Doc` in Root (BB_OUTRO) →
11. still-verify new scene types + a tiny frame-range of the map sequence →
12. **ONE** `render_and_master.py … --music doc_tension.mp3` → 13. verify dur/LUFS/outro
→ 14. SRT + METADATA + AF447-style MORE FROM funnel + 3–5 Shorts.

## Packaging direction (full-SEO later)
Title candidates (A/B): "MH370: The Plane That Vanished From Earth" · "They Spent $200
Million and Found Nothing — MH370" · "The Only Plane We Never Found — MH370". Thumbnail:
a 777 tail/silhouette swallowed by black ocean, yellow "VANISHED" / "STILL MISSING".
MORE FROM → AF447, Colgan, 737 MAX, playlist (real URLs from memory `blackbox-published-urls`).

## Sources (spine — verify each fact against these before it goes in the VO)
- Malaysia ICAO Annex 13 Safety Investigation Report for MH370 (2018).
- ATSB (Australian Transport Safety Bureau) search reports & drift analyses.
- Inmarsat / DSTG "Bayesian methods" underwater-search analysis.
- Ocean Infinity 2025–2026 search: Malaysian Transport Ministry statements (Loke),
  reporting concluded 23 Jan 2026 (no findings, 140,000+ km²), extension to 30 Jun 2027.
- Réunion flaperon confirmation (French judicial / Malaysian govt, 2015).
