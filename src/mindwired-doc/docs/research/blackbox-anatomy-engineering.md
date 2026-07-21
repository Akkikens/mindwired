# Fact-Check Brief — Black Box Anatomy: Engineering Specs

**Documentary:** "What's Actually Inside a Black Box?" (Black Box Breakdown)
**Bucket:** ENGINEERING SPECS
**Date:** 2026-07-21
**Standards referenced:** FAA TSO-C124 (a/b/c), EUROCAE ED-112 / ED-112A (MOPS for Crash-Protected Airborne Recorder Systems), ICAO Annex 6.

Confidence key: **HIGH** = matches the certification standard and multiple industry/gov sources; **MEDIUM** = correct but figure varies by standard revision or source; **CHECK ON SCREEN** = state carefully, nuance below.

---

## 1. Crash-Survivable Memory Unit (CSMU) — the survival tests

These are the ED-112A / TSO-C124 minimum crash-protection tests the memory core must survive. The unit is tested to destruction of everything *except* the memory.

- **Impact shock: 3,400 g for 6.5 milliseconds.** **HIGH.** This is the headline number and is exact and correct. Applied on the orthogonal axes. (A secondary lower-g/longer-duration profile also exists in the standard, e.g. ~1,000 g for 15 ms; the 3,400 g / 6.5 ms figure is the one to say on screen.)
- **Penetration ("pin-drop") test: a 227 kg (500 lb) mass with a 6.35 mm (1/4-inch) steel pin, cross-section ~0.32 cm², dropped from 3 m (10 ft)** onto the most vulnerable point of the unit. **HIGH.** Say it as "a 500-pound weight tipped with a steel spike, dropped from 10 feet."
- **Static crush: 22,250 N (≈ 5,000 lbf) applied for 5 minutes on each of the three axes.** **HIGH.** (Some sources round to 22,500 N — use "about 5,000 pounds of force.")
- **High-temperature fire: 1,100 °C (about 2,000 °F) enveloping the unit for 60 minutes.** **HIGH** for the modern ED-112A/TSO-C124b standard. **CHECK ON SCREEN:** older TSO-C124 revisions specified **30 minutes** at 1,100 °C — if the doc says "one hour of fire," that's the current standard; the 30-minute figure is historically accurate for older boxes. Both are defensible; say "up to an hour."
- **Low-temperature "slow-burn" fire: 260 °C (500 °F) for 10 hours.** **HIGH.** This simulates a smoldering post-crash fire (e.g. buried in wreckage). Real and separate from the 1,100 °C flash test.
- **Deep-sea pressure immersion: pressure equivalent to 6,096 m (20,000 ft) of seawater.** **HIGH.** This is the static deep-sea crush/immersion rating in ED-112A/TSO-C124.
- **Salt-water immersion endurance: 30 days submerged in seawater.** **HIGH.** Distinct from the pressure test — this is the corrosion/soak survival tied to the beacon's 30-day life. (Note: some older summaries cite a 3,000 m / 30-day soak; the 6,096 m depth-pressure figure is the crush spec, the 30-day figure is the soak spec. Keep them as two separate facts.)
- **Fluid immersion: submersion in aviation fluids** (jet fuel, hydraulic fluid, fire-retardant, oil, etc.) for defined periods. **HIGH** that the test exists; **MEDIUM** on any single duration — safest on screen as "soaked in jet fuel and other aircraft fluids."

---

## 2. Underwater Locator Beacon (ULB / "pinger")

- **Frequency: 37.5 kHz**, one ultrasonic pulse per second. **HIGH.** International standard for the recorder-mounted beacon.
- **Activation: automatically on contact with water** (water-activated switch). **HIGH.**
- **Battery life: minimum 30 days** historically. **HIGH.** After MH370 (2014), the standard was extended to **90 days**. **HIGH.** EU/EASA regulation required recorder-ULB life extended from 30 to 90 days **by 1 January 2020**; ICAO's amendment carried the same intent. **CHECK ON SCREEN:** the widely-cited "effective 2018" date is close but imprecise — the ICAO applicability and EASA deadline cluster around **2018–2020**. Safest phrasing: "extended to 90 days, phased in after MH370 by around 2018–2020."
- **Detection range: roughly 1–3 km (about 1–2 nautical miles)** for the 37.5 kHz beacon in typical conditions, less in noisy/deep water. **MEDIUM** (real-world range varies with depth, thermoclines, sea state). Say "a couple of kilometers at best."
- **New low-frequency airframe beacon: 8.8 kHz**, minimum **90-day** life, mounted on the **airframe** (not the recorder). **HIGH.** Required post-MH370 for large aeroplanes operating more than 180 NM from shore, applicability **from 1 January 2019**. **HIGH.** The lower frequency travels much farther through water — **detection range on the order of tens of kilometers** — specifically to make a future deep-ocean wreck easier to find. **HIGH** on the rationale; **MEDIUM** on exact range figure.

---

## 3. What's actually recorded

**Cockpit Voice Recorder (CVR):**
- **Older tape CVRs: last 30 minutes** on a loop. **HIGH.**
- **Modern solid-state CVRs: last 2 hours.** **HIGH.**
- **New 25-hour CVR mandate: HIGH and current.** ICAO adopted the 25-hour standard (2016) for aircraft manufactured after **1 January 2021** with MTOW over 27,000 kg; EASA's 25-hour rule took effect **1 January 2021**. The **FAA** has been catching up — a 25-hour CVR rule for newly produced aircraft was finalized in the **2023–2024** window (US aircraft historically still ran 2-hour CVRs). **CHECK ON SCREEN:** frame as "Europe already requires 25 hours on new aircraft; the US is now adopting the same standard" — accurate as of 2026.
- Channels: **cockpit area microphone (CAM)** plus **one channel per crew position** (captain, first officer, and third/observer or PA). **HIGH.**

**Flight Data Recorder (FDR):**
- **Modern duration: 25 hours** of data. **HIGH.**
- **Minimum mandatory parameters: 88** for modern large aircraft (regulatory floor). **HIGH.** Older generations required far fewer — **early FDRs recorded as few as 5, then 11** basic parameters (altitude, airspeed, heading, vertical acceleration, time). **HIGH** on the "started with a handful" story; the exact 5-vs-11 depends on era/authority — say "as few as five."
- **Modern jets record hundreds to thousands of parameters** — commonly cited **over 1,000, up to ~3,000+** on newer types, sampled from **several times per second** up to higher rates for fast-changing parameters. **HIGH** on the range; **MEDIUM** on any single top-end number — say "well over a thousand."

---

## 4. Physical construction — layers around the memory board

From the outside in (**HIGH** on the layer scheme; exact materials vary by manufacturer/model):
1. **Outer shell: stainless steel or titanium** — the structural armor against impact and penetration. **HIGH.**
2. **High-temperature thermal insulation block** — ceramic/silica fiber or a thermal-reflective material filling the void, protecting against the 1,100 °C fire. **HIGH.**
3. **Aluminum housing** immediately around the memory stack. **HIGH.**
4. **The memory board itself** — a small solid-state (NAND flash / EEPROM) board. **HIGH.** Physically tiny relative to the massive protective shell around it — a strong visual beat for the doc.

**Technology history:** **HIGH.**
- Earliest recorders used **magnetic wire**, then **magnetic tape** (moving parts, ~30 min CVR / limited FDR capacity).
- Modern recorders are **solid-state flash** — no moving parts, far more reliable, vastly higher capacity (2 hr → 25 hr audio, tens of parameters → thousands), and more crash/fire-survivable. The move to solid-state is what enabled both the 25-hour mandates and the parameter explosion.

---

## 5. Where it's mounted, and why

- **Mounted in the tail / aft section** of the aircraft. **HIGH.**
- **Why: survivability.** In most impact scenarios the nose and forward fuselage absorb the crash forces first; the **tail is typically the last part to hit and the least crushed**, giving the recorder the best odds of surviving intact. **HIGH.** It also keeps the unit away from the fuel/engine fire zones and wing-box crush. Good on-screen line: "It sits in the tail because the tail is usually the last thing to hit the ground."
- Many aircraft carry **two boxes** (some combine CVR+FDR into combi-recorders); modern practice can place units to maximize survivability and, on newer designs, add deployable/ejectable recorders. **MEDIUM** (mention only if the doc goes there).

---

## Quick on-screen number sheet (safe to show)

| Spec | Number | Confidence |
|---|---|---|
| Impact shock | 3,400 g / 6.5 ms | HIGH |
| Pin penetration | 227 kg (500 lb) + steel pin, 3 m (10 ft) drop | HIGH |
| Static crush | 22,250 N (~5,000 lbf), 5 min/axis | HIGH |
| Fire (high) | 1,100 °C for 60 min (older: 30 min) | HIGH |
| Fire (slow-burn) | 260 °C for 10 hours | HIGH |
| Deep-sea pressure | 6,096 m (20,000 ft) equiv. | HIGH |
| Salt-water soak | 30 days | HIGH |
| ULB (recorder) | 37.5 kHz, water-activated, 30→90 days | HIGH |
| ULB (airframe, post-MH370) | 8.8 kHz, 90 days, >180 NM ops | HIGH |
| CVR | 30 min (tape) → 2 hr → 25 hr new-build | HIGH |
| FDR | 25 hr; 88 min. parameters; 1,000s modern | HIGH |
| Mounted | Tail / aft (last to impact) | HIGH |

---

## Sources

- [FAA TSO-C124b (full standard PDF)](http://files.engineering.com/files/92f8697a-5a38-46cc-baf1-c81764f81547/TSO-C124b.pdf)
- [Curtiss-Wright — How do Flight Recorders Survive Aircraft Accidents?](https://defense-solutions.curtisswright.com/media-center/blog/how-do-flight-recorders-survive-aircraft-accidents) (227 kg / 6.35 mm pin / 3 m; 22,500 N / 5 min; 1,100 °C / 30 min; 30-day / deep immersion)
- [SKYbrary — Flight Data Recorder (FDR)](https://skybrary.aero/articles/flight-data-recorder-fdr)
- [SKYbrary — Cockpit Voice Recorder (CVR)](https://skybrary.aero/articles/cockpit-voice-recorder-cvr)
- [SKYbrary — Underwater Locator Beacon (ULB)](https://skybrary.aero/articles/underwater-locator-beacon-ulb) (37.5 kHz, 30→90 day, 8.8 kHz airframe LF-ULB)
- [Wikipedia — Underwater locator beacon](https://en.wikipedia.org/wiki/Underwater_locator_beacon)
- [Fear of Landing — MH370: Beacons, Pingers and Locators](https://fearoflanding.com/accidents/mh370-search-beacons-and-pingers-and-locators/)
- [Federal Register — 25-Hour CVR Requirement, New Aircraft Production](https://www.federalregister.gov/documents/2023/12/04/2023-26144/25-hour-cockpit-voice-recorder-cvr-requirement-new-aircraft-production)
- [Honeywell/Curtiss-Wright — EASA certifies 25-hour recorder (2021)](https://aerospace.honeywell.com/us/en/about-us/press-release/2021/05/easa-certifies-honeywell-curtiss-wright-25-hour-flight-data-recorder)
- [Pilot Institute — Aircraft Black Boxes Explained](https://pilotinstitute.com/black-box-in-aircraft/)
- [ScienceDirect — Next-generation civil aircraft flight recording system](https://www.sciencedirect.com/science/article/pii/S2950338825000270)
- [Avionics News (Mar 2010) — flight recorder shell/impact profiles](https://avionicsnews.net/ANArchives/TechSpeakMar10.pdf) (3,400 g/6.5 ms and 1,000 g/15 ms profiles, titanium/stainless shell, aluminum inner)

**Note on standard revisions:** the current governing MOPS is EUROCAE ED-112A (harmonized with FAA TSO-C124b/c). Where numbers differ between older TSO-C124 and current ED-112A (notably fire 30 vs 60 min, ULB 30 vs 90 days), the brief flags both — pick the modern figure for a "today's black box" doc, and use the older figure only when talking about a specific older accident aircraft.
