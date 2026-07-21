# Fact-Check Brief — "What's Actually Inside a Black Box?"

Channel: Black Box Breakdown. Prepared 2026-07-21. Confidence levels and source URLs inline.
Two research buckets: **MYTHS** (graded) and **FUTURE TECH**.

---

## MYTHS

### 1. "Why not make the whole plane out of black-box material?" — VERDICT: The physics forbids it (weight)
**Confidence: HIGH.**

A flight recorder survives because its **Crash Survivable Memory Unit (CSMU)** — the only part that actually needs to survive — is tiny: a fist-sized stack of memory boards wrapped in three shells. Around the boards sits a solid aluminum housing, then ~1 inch (2.54 cm) of dry-silica high-temperature insulation, then a ~0.25 inch (0.64 cm) stainless-steel or titanium outer shell. That armored capsule is engineered to survive **3,400 g of impact shock for 6.5 milliseconds, 1,100°C fire for 30 minutes, and seawater pressure equivalent to ~20,000 ft of ocean depth**.

The reason you can't scale that up to an airframe is simple: an aircraft must be **light enough to generate more lift than its own weight**. Airliners are built from aluminum alloys and composites precisely to minimize mass; a fuselage built to CSMU spec (thick titanium/steel + silica) would weigh so much it could never take off, or would need engines and fuel loads that make flight economically and physically impossible. The CSMU only works *because* it is small — the mass penalty is negligible on a ~10 lb unit but catastrophic across a ~200-ton airframe. A crash also concentrates energy; the CSMU survives partly by being a small, dense object the surrounding aluminum crumples around, absorbing energy. (HowStuffWorks; Smithsonian "How Things Fly"; Straight Dope.)

### 2. "Black boxes are indestructible" — VERDICT: FALSE (they are crash-*survivable*, not indestructible)
**Confidence: HIGH.**

Recorders are hardened, not invincible. Documented cases where recorders were destroyed, unreadable, or never recovered:

- **9/11 World Trade Center (AA11, UA175):** Neither the CVRs nor FDRs from the two aircraft that struck the Twin Towers were ever recovered — crushed and incinerated in the collapse. (By contrast, **both** recorders from Flight 77/Pentagon and Flight 93/Shanksville *were* recovered and read — so 4 of 8 total survived.) (Forbes/Quora; Smithsonian NMAH.)
- **High-energy / deep-ocean crashes:** Recorders can be lost for years even when they survive. **AF447** (2009, Atlantic, ~3,900 m depth) took **two years** of deep-sea salvage before the recorders were found in May 2011 — the units survived, but recovery was near-miraculous, not guaranteed.
- **Fire- and tape-era losses:** Older magnetic-tape recorders (pre-solid-state) were far more vulnerable to fire and impact damage; investigations occasionally worked from partially melted or unreadable media. Solid-state CSMUs (standard since the late 1990s–2000s) are far more robust, but data can still be corrupted or partially unrecoverable in extreme events.

Takeaway line for script: recorders are rated to *specific* survival thresholds (3,400 g / 1,100°C / 30 min). Real crashes can exceed them, or bury the box where no one can reach it.

### 3. "They record video" — VERDICT: FALSE today (audio + data only; cockpit *image* recorders long recommended, never mandated)
**Confidence: HIGH.**

Commercial airliners do **not** currently carry cockpit cameras. The two boxes are the **CVR** (audio) and **FDR** (flight parameters). The debate over adding a **crash-protected cockpit image recording system** is decades old:

- The **NTSB** has urged the FAA to require cockpit image recorders for **more than a decade**, and repeatedly re-listed it on its "Most Wanted List" of safety improvements (e.g. the 2021–2022 list, released April 6, 2021). NTSB argues images resolve ambiguities audio and data can't (switch positions, crew actions, smoke).
- **ALPA** (Air Line Pilots Association) and other pilot unions **strongly oppose** it, on three grounds: (1) benefits are overstated and images are "imprecise"; (2) existing FDR/CVR tools already suffice; (3) privacy — inadequate legal protection against misuse, especially abroad. The visceral objection, quoted repeatedly: pilots don't want "a million strangers to watch me die."
- The debate reignited after the **Air India crash (2025)**, with renewed calls for cockpit video. (FlightGlobal; Runway Girl Network; CNN 2025; Rapoport Law.)

### 4. "Someone is listening to you constantly" — VERDICT: FALSE
**Confidence: HIGH.**

The CVR is a **continuous loop that overwrites itself** — nobody monitors it live. Historically the loop retained the **last 2 hours** of cockpit audio, older audio erased automatically. It is only ever pulled and read **after an accident or serious incident.**

- **New rule:** The FAA finalized a **25-hour CVR requirement** (published Feb 2, 2026), phasing in for newly manufactured aircraft from 2027 — extending the loop from 2 to 25 hours so runway-incursion and earlier-phase evidence isn't lost to overwrite.
- **Privacy protection:** CVR audio is tightly restricted. Under US law (14 CFR Part 193 and related statute) the Administrator/operator **may not use a CVR recording for certificate action, civil penalty, or disciplinary proceedings** against a crewmember. The NTSB does not publicly release CVR *audio*; it releases written transcripts. Foreign investigation boards operate under comparable ICAO Annex 13 protections. (Pilot unions, incl. APA, opposed the 25-hour extension partly on privacy grounds.) (Federal Register 2026-02110; FAA NPRM; AeroTime.)

---

## FUTURE TECH

### 5. Deployable / ejectable flight recorders (DFR)
**Confidence: HIGH.**

A DFR is a recorder designed to **automatically eject from the airframe** at the moment of a crash and, crucially, **float**. Deployable recorders have been standard on **military aircraft and some helicopters for years**; the news is their arrival in civil aviation.

- **Airbus** launched fixed *and* deployable recorder options in **June 2017**, targeting the **A350** (and A380). The DFR sits in a spring-loaded tray built into the vertical fin near its root/leading edge, its skin flush with the fin (no aerodynamic penalty).
- **Trigger & mechanism:** accelerometers, fuselage-deformation sensors, and/or water-immersion sensors fire a spring-loaded ejection that separates the "beacon airfoil unit" from the fin. The unit contains the crash-protected memory (up to **25 hours** of voice + data), an **Emergency Locator Transmitter (ELT)**, batteries, and a satellite receiver.
- **Why it floats:** a buoyant housing keeps it on the surface after a water crash, so it can be recovered in hours instead of the years AF447 took. (Airbus press release 2017-06; Runway Girl Network; Flight Safety Foundation white paper.)

### 6. Real-time streaming — "black box in the cloud"
**Confidence: HIGH.**

Technically proven, not widely adopted. **FLYHT's AFIRS** system streams position/altitude/performance data via **Iridium's 66-satellite constellation** to ground servers.

- **Why full adoption stalled — bandwidth, volume, cost.** Streaming every parameter of every flight continuously is enormous data over expensive satellite links. First Air (Canadian Arctic) — long the *only* airline using it operationally — spent ~**$1.8M** to equip 18 aircraft plus ~**$22,000/year** in data. Carriers historically won't adopt without a mandate.
- **The workaround — triggered streaming.** AFIRS doesn't stream constantly; it **begins streaming only when an abnormal event triggers it** (unusual attitude, rapid descent, etc.), and compresses the data, slashing satellite cost. FLYHT's distress streaming was validated on the **Boeing ecoDemonstrator** program. This "stream only when something's wrong" model is the pragmatic middle path between full live streaming and a physical box. (CNN Money 2014; CBC; NBC News; FLYHT.)

### 7. Post-MH370 ICAO GADSS (Global Aeronautical Distress and Safety System)
**Confidence: HIGH.**

After **MH370** vanished in **2014**, ICAO built **GADSS** to make it impossible for a large airliner to simply disappear. Its centerpiece is **Autonomous Distress Tracking (ADT)**.

- **The 1-minute rule:** aircraft over **27,000 kg (60,000 lb) MTOW** must **autonomously transmit position at least once per minute when in distress** — narrowing a wreck's search area to roughly a **6-nautical-mile radius** (vs. the ocean-sized MH370 search).
- **Timeline:** GADSS provisions entered ICAO regulation in **2018** (4 years after MH370). "Autonomous" means the system self-activates and **cannot be switched off** by the crew — a direct MH370 lesson. The ADT compliance deadline slipped repeatedly: originally **Jan 2021**, pushed to **2023**, then to **January 1, 2025**. (An earlier GADSS layer already required normal-ops aircraft tracking at 15-minute intervals.) (ICAO GADSS docs; Aviation Today; Airbus Safety Innovation #12; IATA.)

---

## Sources
- [HowStuffWorks — How Black Boxes Work](https://science.howstuffworks.com/transport/flight/modern/black-box.htm)
- [Smithsonian, How Things Fly — black box materials](https://howthingsfly.si.edu/ask-an-explainer/what-materials-are-used-make-black-box-and-why-cant-we-use-them-make-planes)
- [The Straight Dope — why not build the whole plane from it](https://www.straightdope.com/21342059/if-aircraft-black-boxes-are-indestructible-why-can-t-the-whole-plane-be-made-from-the-same-material)
- [ScienceDirect — next-gen recorder (CSMU 3,400g/1,100°C/20,000ft specs)](https://www.sciencedirect.com/science/article/pii/S2950338825000270)
- [Forbes/Quora — 9/11 black boxes](https://www.forbes.com/sites/quora/2017/02/13/why-wasnt-one-single-black-box-recovered-from-any-of-the-crashes-on-911/)
- [Smithsonian NMAH — 9/11 flight recorder poster](https://www.si.edu/object/911-poster-flight-recorder-boxes-identification-new:nmah_1195299)
- [Wikipedia — Air France Flight 447 (recovery)](https://en.wikipedia.org/wiki/Air_France_Flight_447)
- [FlightGlobal — NTSB again calls for cockpit video recorders](https://www.flightglobal.com/safety/ntsb-again-calls-for-cockpit-video-recorders/143210.article)
- [Runway Girl Network — ALPA opposes cockpit video recorders](https://runwaygirlnetwork.com/2021/04/alpa-opposes-cockpit-video-recorders-despite-continued-ntsb-push/)
- [ALPA — Cockpit Video is not the Answer](https://www2.alpa.org/DesktopModules/ALPA_Documents/ALPA_DocumentsView.aspx?itemid=2672&ModuleId=3357&Tabid=256)
- [CNN 2025 — Air India crash rekindles cockpit video debate](https://edition.cnn.com/2025/07/16/asia/air-india-crash-cockpit-video-camera-debate-intl-hnk)
- [Federal Register — 25-Hour CVR Requirement (2026-02110)](https://www.federalregister.gov/documents/2026/02/02/2026-02110/25-hour-cockpit-voice-recorder-cvr-requirement-new-aircraft-production)
- [AeroTime — FAA 25-hour CVR rule](https://www.aerotime.aero/articles/faa-25-hour-cockpit-voice-recorder-final-rule)
- [Airbus — launches fixed and deployable flight recorders (2017)](https://www.airbus.com/en/newsroom/press-releases/2017-06-airbus-launches-new-fixed-and-deployable-flight-recorders)
- [Runway Girl Network — Airbus combined/floating deployable recorders](https://runwaygirlnetwork.com/2017/06/airbus-unveils-combined-and-floating-deployable-flight-recorders/)
- [Flight Safety Foundation — Deployable Flight Recorder Systems (white paper)](https://flightsafety.org/wp-content/uploads/2017/08/DFRS.pdf)
- [CNN Money — Flyht $100,000 live-streaming black box](https://money.cnn.com/2014/03/21/technology/flyht-flight-data-streaming-black-box)
- [CBC — Why airlines don't live-stream black box data](https://www.cbc.ca/news/science/airasia-flight-qz8501-why-airlines-don-t-live-stream-black-box-data-1.2586966)
- [FLYHT — distress streaming validated on Boeing ecoDemonstrator](https://flyht.com/investors/news-and-media/view/flyhts-distress-flight-data-streaming-capabilities-validated-on-boeing-ecodemonstrator/)
- [Aviation Today — Keeping Track of GADSS](https://interactive.aviationtoday.com/keeping-track-of-gadss-everything-you-need-to-know-about-icaos-gadss-delay/)
- [Airbus — Safety Innovation #12: Autonomous Distress Tracking](https://www.airbus.com/en/newsroom/stories/2024-02-safety-innovation-12-aircraft-autonomous-distress-tracking)
- [ICAO — GADSS components and implementation plans](https://www.icao.int/sites/default/files/MID/MeetingDocs/2024/MID%20SAR%20Workshop/PPT/PPT8-Presentation-on-GADSS-components-and-implementation-plans.pdf)
