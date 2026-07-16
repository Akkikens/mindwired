# SPEC — Colgan Air 3407 ("Flying Cheap") — Black Box Breakdown ep. 2

**Status:** spec / awaiting go. **Channel:** Black Box Breakdown (`channel:"blackbox"`,
orange `#FF9500`, wordmark "BLACK BOX"). **Engine:** mindwired-doc + Evidence Engine
(`scripts/fetch_ntsb_docket.py`, `scripts/radio_recreate.py`) + DocWide diagrams
(+ limited R3F/GL). **Runtime:** 30–38 min. **Narrator:** cloned Cartesia `00d3c951-…`.
**Outro:** `subscribe_blackbox_long.mp4` (Reid). NTSB case **DCA09MA027**; report **AAR-10/01**.

## Why (validated 2026-07) — viral ~8/10
Every major aviation channel has covered it (Mentour "The CRASH that Changed US
Aviation", Disaster Breakdown, "Dead Tired [Real Audio]" cuts, PBS FRONTLINE
"Flying Cheap"). Lower global fame than AF447 → lower ceiling, BUT it's THE
"crash that changed the law" evergreen + a clean corporate-villain story = the
underserved angle that beats the saturated "what happened" retellings. Realistic:
strong six figures, breakout upside on the corporate + real-audio hook.

## Differentiator / angle (the "Flying Cheap" spine)
Icing red herring → detonate it with the real cause (stall mishandling) → widen to
WHY: fatigue, ~$16k/yr FO who commuted overnight from Seattle, a captain with prior
failed checkrides, Colgan's procedures, "Continental Connection" brand flown by a
low-cost contractor → the families → the 1500-hour rule & Airline Safety Act 2010.

## HONESTY / audio model — REAL ATC + labeled recreations (Evidence Engine)
- **REAL FAA ATC audio**, labeled `ACTUAL ATC RECORDING` — Buffalo approach/tower +
  "Colgan 3407". Source of record = NTSB docket / FAA (US-gov PD). NOT LiveATC scrape.
- **CVR = labeled recreations** (`radio_recreate.py` + Cartesia, radio-EQ), from the
  **public NTSB CVR transcript only**, captioned `CVR RECREATION` + spoken disclaimer.
  CVR audio is barred by US law — never imply it's real.
- **Narrator** carries the story. On-screen NTSB probable-cause verbatim for credibility.
- Defamation-safe: attribute to NTSB findings; state the captain's record precisely as
  documented; keep the $16k pay figure attributed to reporting/FRONTLINE, not NTSB.

## Visual model ("limited OpenGL")
- **Use the NTSB crash animation** (`File:NTSB_Colgan_Air_Flight_3407_Crash_Animation.ogv`,
  PD) for the stall/loss-of-control sequence — official, free, authoritative.
- Real PD/CC stills: N200WQ / Q400, Q400 glass cockpit (generic, labeled), wreckage
  (verify license), Clarence Center memorial, ILS RWY 23 KBUF plate (FAA PD).
- 2D SVG diagram scenes (extend `Diagrams.tsx`); R3F/GL only for 1–2 shots (approach
  path into KBUF at night) if no footage fits. GL comps → `--gl=angle`.

New diagram scenes:
- `stallseq` — airspeed decays → **low-speed cue** rises → **stick shaker** → captain
  pulls AFT → **stick pusher** fires → he overrides → aerodynamic stall (the core)
- `approach` — ILS RWY 23 KBUF profile, config change (flaps/gear), speed bleed
- `icing` — the red herring: light ice, plane controllable → NOT the cause
- `fatigue` — the two pilots' pre-flight: overnight commute (Seattle→Newark), airport
  overnight, disrupted sleep (human-factors beat)
- `reform` — 250 hrs → **1,500-hour rule**; the legislative payoff
- reuse `quote` (ATC/CVR/NTSB text), `counter` (50 lost)

## Chapters (~10, 30–38 min)
- HOOK (0–60s): a routine 53-minute hop into Buffalo; the last 30 seconds; "the men
  and women who died were failed long before they boarded" + real ATC "Colgan 3407…"
- TITLE: BLACK BOX / Colgan Air 3407
- Ch1 Continental Connection 3407 (the flight, the Q400, the passengers, Buffalo)
- Ch2 Two tired pilots (the overnight commutes, the pay, the sterile-cockpit chatter)
- Ch3 The approach (icing talk, config, the low-speed cue rising) — real ATC audio
- Ch4 8 seconds (stick shaker → pull-aft → stick pusher → override → stall) + NTSB animation
- Ch5 Clarence Center (the impact into the house; first responders; 50 gone)
- Ch6 The icing red herring (why everyone blamed ice — and why the NTSB didn't)
- Ch7 The real cause (NTSB probable cause verbatim; the mishandled recovery)
- Ch8 Flying Cheap (the corporate spine: Colgan pay/fatigue/training; brand vs operator)
- Ch9 The families & the law (the 3407 families → 1500-hour rule, Part 117, Pilot Records DB)
- Ch10 Close + subscribe (what changed; the empty seats)

## Best HOOKS (pick 1)
1. "The pilots of this flight were failed long before they ever stepped into the cockpit."
2. "It's a 53-minute hop to Buffalo. The last 30 seconds of it would rewrite American aviation law."
3. "One pilot was earning sixteen thousand dollars a year. The other had flown overnight
   across the country just to get to work. Neither should have been that tired — and 50
   people paid for it."

## TITLE (packaging)
- Primary: `Too Tired to Fly: The Crash That Rewrote Aviation Law (Colgan Air 3407)`
- Alts: `$16,000 a Year: The Colgan Air 3407 Disaster` / `The Red Herring That Hid the
  Real Cause — Colgan Air 3407` / `The Crash That Changed How Every US Pilot Is Hired`

## $0 asset / evidence plan
1. `scripts/fetch_ntsb_docket.py "Colgan Air 3407" --types audio,pdf,image [--faa-audio]`
   → real ATC audio + CVR transcript + photos → `public/shorts/_evidence/colgan3407/` + SOURCES.md
2. Relocate the misfiled Colgan CVR PDFs out of `public/shorts/_evidence/us1549/` (VERIFY first).
3. `fetch_media.py` for Q400, Q400 cockpit, icing, stick-shaker stock (license-logged).
4. NTSB animation .ogv + ILS plate from Commons (PD). Verify wreckage-photo licenses.
5. `audit_doc_images.py` before render.

## Pipeline (ONE render, Black Box branded)
Confirm channel=Black Box → `src/mindwired-doc/docs/colgan3407.json` (`channel:"blackbox"`)
→ build diagrams → fetch_ntsb_docket + fetch_media → radio_recreate (CVR beats) →
audit → build_doc_vo → register `Colgan3407Doc` → still-verify → ONE render → master
−14 LUFS → append Reid outro → verify → `METADATA-colgan3407.md` (English only) + SRT.

## Open items to close at build
- Manual view/sub pull on the 6 competitor videos (log the Icahn ratio).
- Confirm docket ATC item is audio (not transcript-only); else FAA FOIA / archive.
- Per-file license on the 2 Commons wreckage photos.
