# Fact-Check Brief — "What's Actually Inside a Black Box?"
## Bucket: RECOVERY CASE STUDIES & LAB FORENSICS

Prepared for: Black Box Breakdown. Facts only; victims treated with respect.
Confidence key: HIGH = multiple reliable sources agree / official report;
MEDIUM = single reliable source or standard-practice inference; LOW = contested.

---

### 1. Air France 447 (2009) — the deep-Atlantic recovery **[HIGH]**

An Airbus A330 (Rio de Janeiro → Paris) crashed into the equatorial Atlantic on
1 June 2009; all 228 aboard died. The wreckage sat on the ocean floor at roughly
**3,900 m (about 13,000 ft)** depth — well beyond the ~30-day pinger window, which
elapsed with no beacon detected.

Timeline of the recorder recovery:
- **Early April 2011** — after four search campaigns over nearly two years, the main
  wreckage debris field was finally located using deep-tow sonar and autonomous
  underwater vehicles (REMUS AUVs).
- **26 April 2011** — the flight data recorder (FDR) **chassis** was recovered on the
  first dive, but *without* its crash-survivable memory unit.
- **1 May 2011** — the FDR's memory module was found and lifted aboard.
- **2 May 2011** — the cockpit voice recorder (CVR) was located; raised the next day.
- Both units, despite ~2 years submerged and pressure/immersion far beyond design
  limits, were **physically intact and readable**. Over a single weekend the French
  BEA downloaded **all** FDR parameters and the **entire final ~2 hours** of CVR audio.
- **27 May 2011** — BEA released an update reconstructing the flight from FDR data.

Key finding the recorders delivered: the descent was **not** a mechanical failure or
weather overwhelming the jet — the crew had held the nose up, bleeding off speed until
the aircraft entered and stayed in an **aerodynamic stall** all the way down (triggered
after iced-over pitot tubes gave unreliable airspeed and the autopilot disengaged).
AF447 is the canonical proof that a modern **solid-state** memory module survives years
on the deep-ocean floor.

---

### 2. Japan Air Lines 123 (1985) — recorder role (brief) **[HIGH]**

JAL123, a Boeing 747SR, crashed into Osutaka Ridge on 12 August 1985 after an in-flight
structural failure; 520 died (one of the deadliest single-aircraft accidents in history;
4 survived). About 12 minutes after takeoff the CVR captured a **bang, vibration and
decompression** at ~24,000 ft. The CVR/FDR combination let investigators (JCAB's
Fujiwara, with Boeing and NTSB's Ron Schleede assisting) reconstruct a ~32-minute
struggle to fly a jet that had lost its vertical stabilizer and all four hydraulic
systems. Root cause: rupture of the **aft pressure bulkhead**, traced to a faulty
Boeing repair after a 1978 tailstrike. The recorders were recovered from the mountainside
crash site (land, not deep water); they were central to establishing the failure sequence.

---

### 3. The 9/11 recorders — HANDLE CAREFULLY, facts only **[HIGH]**

Eight recorders existed across the four hijacked aircraft (a CVR + FDR each). Documented
outcomes:
- **World Trade Center — AA11 and UA175:** No recorders were ever officially recovered
  from the Twin Towers site. They are believed destroyed/crushed in the tower collapses.
  The 9/11 Commission and NTSB have no data from these two aircraft.
- **Pentagon — AA77:** Both recorders **were recovered**. The FDR's solid-state memory
  yielded data; the CVR (older magnetic-tape design) was **too damaged to recover usable
  audio**.
- **Shanksville — UA93:** Both recorders were recovered. The **CVR yielded usable audio**
  (the transcript was later entered into evidence at the Moussaoui trial and played for
  victims' families); the FDR yielded data.

Net: of the eight recorders, **three yielded usable data** — the AA77 FDR, the UA93 FDR,
and the UA93 CVR. Frame this on-screen with the NTSB/9/11 Commission attribution and
without dwelling on cockpit-audio content out of respect for the families.

---

### 4. MH370 (2014) — the pinger race that rewrote the rules **[HIGH]**

Malaysia Airlines MH370 (Boeing 777) vanished 8 March 2014 with 239 aboard; the main
wreckage and recorders have never been found. Two recorder facts drove global regulation:
- **The 30-day battery race:** underwater locator beacons (ULBs) on the recorders are
  designed to ping for ~30 days. But MH370's position was unknown for much of that window
  — days were burned just working out *where* to search — so the pingers likely fell
  silent before search assets reached the right area. A later Malaysian report also noted
  the FDR's ULB **battery had expired in December 2012** with no record of replacement
  (the CVR's beacon was in date).
- **The regulatory response (GADSS):** ICAO's **Global Aeronautical Distress and Safety
  System**, mandated 2016, set staged requirements:
  - **Aircraft tracking** — automated 4-D position reports at **≤15-minute** intervals
    (normal ops), applicable from **1 January 2021**.
  - **Autonomous Distress Tracking (ADT)** — when a jet is in distress, position
    transmitted automatically **≥ once per minute**, no crew action needed (forward-fit
    standard, phased from 2021).
  - **ULB battery life extended from 30 to 90 days** for the airframe-mounted beacon, and
    a low-frequency (8.8 kHz) ULB with much longer detection range added to help locate
    wreckage; plus provisions for **deployable/ejectable recorders** and timely flight-data
    recovery. (ICAO Annex 6.)

---

### 5. Chip-/board-level forensic salvage of a damaged recorder **[HIGH for technique;
MEDIUM for a single "burned" showcase]**

The strongest documented salvage mechanism is the NTSB Recorder Lab's **"golden chassis"
(surrogate recorder) technique** (bucket 6). When a recorder's own electronics are burned,
crushed or corroded but the **crash-survivable memory unit** is intact, engineers extract
the physical memory board/chips and read them out inside a **pristine reference unit of the
same recorder model** — the lab keeps "a pristine example of nearly every FDR model ever
used in modern aircraft." This is exactly how heavily fire- or impact-damaged units still
give up their data.

Supporting real cases:
- **TWA 800 (1996):** CVR and FDR recovered by U.S. Navy divers from the Atlantic ~1 week
  after the center-fuel-tank explosion, shipped to the NTSB lab and read out; they showed a
  normal flight ending abruptly at 8:31 p.m. Sea-recovered, still readable.
- **Swissair 111 (1998):** FDR and CVR recovered from the Atlantic off Nova Scotia after a
  violent crash and 8 days underwater; the CVR still gave ~30 minutes of good-quality audio.
  Note the honest nuance: both recorders **stopped recording ~6 min before impact** (at
  ~10,000 ft) because the in-flight fire knocked out their power — a limitation of the fire,
  not a lab failure. Good case for "why recorders can go dark early," but present it
  accurately.

If the script wants a single vivid "shattered/burned board rebuilt" beat, anchor it to the
golden-chassis process itself (well-documented, on the record) rather than over-claiming a
specific airframe.

---

### 6. NTSB / BEA recorder LAB procedures **[HIGH for lab flow; MEDIUM for wet-handling
specifics]**

Documented NTSB Vehicle Recorder Lab flow (NTSB Safety Compass, FDR/CVR Handbooks):
1. **"Dirty Room" intake** — the recorder's as-arrived condition is documented and
   photographed before anything is touched.
2. **Mechanical access** — engineers cut into damaged housings with "cutting wheels, shears,
   and even hammers and pry bars" to reach the crash-survivable memory unit.
3. **Microelectronics inspection** — digital/optical microscopes check the memory ICs for
   broken bonds, cracks or corrosion; **X-ray and, in some cases, CT scanning** map internal
   damage in 3-D before any risky handling.
4. **Board/chip repair** — broken connections are repaired at the bench where possible.
5. **Golden-chassis readout** — the physical memory device is transferred from the damaged
   unit into a pristine surrogate recorder of the same model, then powered through a **data
   extraction rack** running the manufacturer's software to download parametric data / audio.

**Sea-recovered ("wet") handling — MEDIUM confidence, standard practice:** the widely-taught
rule is that a water-recovered recorder should be **kept wet / immersed and NOT allowed to
dry out** in transit, because drying lets dissolved salts crystallize on the circuit board
and accelerates corrosion of traces and chip legs. In the lab the board is **rinsed in clean
fresh / deionized water** to flush salt and contaminants, then **dried slowly and carefully**
(gentle/controlled drying) before power is applied. AF447's two-year saltwater immersion with
fully readable modules is the real-world proof this discipline works. (This wet-handling
detail is standard recorder-recovery guidance rather than a line I could pin to one NTSB URL
in this pass — worth a caption hedge like "per standard lab practice.")

BEA (France) and TSB Canada follow equivalent readout philosophies; BEA's AF447 weekend
download of both units is the flagship example of the process end-to-end.

---

## Sources
- Air France 447: [Wikipedia](https://en.wikipedia.org/wiki/Air_France_Flight_447) · [MercoPress — CVR recovered](https://en.mercopress.com/2011/05/03/air-france-flight-447-cockpit-voice-recorder-recovered-from-the-atlantic) · [FlyingMag — CVR/FDR recovered](https://www.flyingmag.com/news-air-france-447-cvr-fdr-recovered/) · [BEA Final Report (PDF)](https://www.faa.gov/sites/faa.gov/files/AirFrance447_BEA.pdf) · [Wikinews](https://en.wikinews.org/wiki/Flight_recorders_from_Air_France_Flight_447_found)
- JAL123: [Wikipedia](https://en.wikipedia.org/wiki/Japan_Air_Lines_Flight_123) · [FAA accident report (PDF)](https://www.faa.gov/sites/faa.gov/files/JAL123_Acc_Report.pdf) · [FAA Lessons Learned](https://www.faa.gov/lessons_learned/transport_airplane/accidents/JA8119)
- 9/11 recorders: [PBS NewsHour — Pentagon recorders found](https://www.pbs.org/newshour/world/terrorism-july-dec01-washington_09-14) · [NPS — Flight 93 CVR](https://www.nps.gov/flni/learn/historyculture/flight-93-cockpit-voice-recorder.htm) · [PolitiFact — debris/remains recovered](https://www.politifact.com/factchecks/2023/jul/19/instagram-posts/human-remains-aircraft-debris-recovered-from-911-c/) · [Forbes/Quora — why WTC boxes not recovered](https://www.forbes.com/sites/quora/2017/02/13/why-wasnt-one-single-black-box-recovered-from-any-of-the-crashes-on-911/)
- MH370: [NPR — expired ULB battery](https://www.npr.org/sections/thetwo-way/2015/03/08/391624343/mh370-had-expired-battery-on-black-box-pinger-report-says) · [Hydro International — pingers & search window](https://www.hydro-international.com/content/article/finding-lost-aircraft-with-pingers)
- GADSS: [ICAO — Understanding GADSS](https://www.icao.int/operational-safety/Understanding-GADSS) · [SKYbrary — GADSS](https://skybrary.aero/articles/global-aeronautical-distress-and-safety-system-gadss) · [Airbus — Autonomous Distress Tracking](https://www.airbus.com/en/newsroom/stories/2024-02-safety-innovation-12-aircraft-autonomous-distress-tracking)
- Lab forensics: [NTSB Safety Compass — Inside the Vehicle Recorder Lab](https://safetycompass.wordpress.com/2023/10/06/inside-the-ntsbs-vehicle-recorder-lab/) · [NTSB FDR Handbook (PDF)](https://www.flightradar24.com/blog/wp-content/uploads/2021/04/NTSB_FDR_Handbook.pdf) · [NTSB CVR Handbook (PDF)](https://www.flightradar24.com/blog/wp-content/uploads/2021/04/NTSB_CVR_Handbook.pdf) · [GlobalAir — inside the NTSB lab](https://www.globalair.com/articles/a-look-inside-the-ntsb-investigation-lab?id=6470)
- TWA 800 / Swissair 111: [TSB Canada — Swissair 111 summary](https://www.tsb.gc.ca/eng/medias-media/fiches-facts/A98H0003/sum_a98h0003.html) · [TSB Canada — SR111 chronology](https://www.bst.gc.ca/eng/medias-media/fiches-facts/A98H0003/chronology_a98h0003.html) · [Admiral Cloudberg — TWA 800](https://admiralcloudberg.medium.com/memories-of-flame-the-crash-of-twa-flight-800-fecfd651a157)
