# CLAIMS — Japan Airlines Flight 123 (Black Box Breakdown)

Built 2026-07-28 by a 5-agent research fan-out (origins/repair · disaster+
official report · aftermath/legacy · archival-footage scout · human-thread
cold-open). Labels: **CONFIRMED (primary) / CONFIRMED (primary recap) /
REPORTED / DISPUTED / UNVERIFIED / EXCLUDE**. Icahn-validated → memory
`icahn-jal123` (2026-07-28, winner of an 8-topic aviation sweep, PASS-WITH-
CONDITIONS, recognition 2/3 — packaging MUST lead with "the deadliest
single-aircraft disaster in history," never the bare flight name).

**PRIMARY SOURCE OBTAINED AND OCR'D DIRECTLY** — this is unusually strong
sourcing for this pipeline: the actual 332-page official English-translation
PDF of the Aircraft Accident Investigation Commission (AAIC, Ministry of
Transport)'s report was downloaded and OCR'd page-by-page, not summarized
from secondary retellings. **Report title:** *"Aircraft Accident
Investigation Report — Japan Air Lines Co., Ltd., Boeing 747 SR-100, JA8119,
Gunma Prefecture, Japan, August 12, 1985."* Dated June 19, 1987. **Live URL:**
https://jtsb.mlit.go.jp/eng-air_report/JA8119.pdf (mirror:
http://www.air-accidents.com/event/3487120885.pdf). Explicitly labeled
"(Tentative Translation from Original in Japanese)" with a disclaimer that
the Japanese original governs on discrepancy — worth putting on screen.
Local working copy: `/private/tmp/claude-501/.../scratchpad/jal123_jtsb.pdf`
— **fetch this into `public/shorts/jal123/exhibit/` before building exhibit
scenes; it's a scanned-image PDF (no text layer), so `pdftoppm` page captures
are the way to use it on screen.**

---

## ⚠ DATA CORRECTIONS (baked in — do NOT revert)

1. **"It's the end" is NOT a confirmed CVR line — do not script it as a direct
   quote.** This dramatic closing line (もうだめだ, attributed to Captain
   Takahama) is widely repeated across tailstrike.com, Admiral Cloudberg's
   writeup, and YouTube documentaries — but the agent who read the ACTUAL
   primary AAIC transcript (Attachment 6, OCR'd directly, not a secondary
   paraphrase) confirms it does **not appear** in the official record. The
   real final transcribed words are: Captain "Raise the nose" (×2), "Power"
   (×2) → **GPWS activates: "WHOOP WHOOP / PULL UP" ×6** → a logged "(contact
   sound)" → "(end of recording)." Total CVR runtime: 32 minutes 16 seconds.
   Use the GPWS pull-up alert as the climax's actual final audio beat, not an
   invented parting line.
2. **The popular "Boeing used two splice plates instead of one" framing is
   backwards — use the JTSB's own precise wording.** Verbatim primary quote
   (Report §3.2.2/§4.1.3): the correct repair called for ONE properly-sized
   splice plate; the repair team instead substituted **a narrower splice
   plate plus a separate filler piece**, which meant the L18 splice joint
   that should have been secured by **two rows of rivets** ended up secured
   by only **one row** — cutting the joint's strength to **about 70%** of
   design. Both framings agree on the outcome (one row doing two rows' job);
   use the JTSB's own wording, not the inverted NYT/Wikipedia shorthand.
3. **Use 16,195 hours 59 minutes / 12,319 landings as the post-repair,
   pre-crash figure — NOT "8,830 hours."** Wikipedia's "additional 8,830
   hours between repair and crash" is very likely a misattribution: the
   primary report's own total lifetime hours at crash (25,030h18m) minus its
   own post-repair hours (16,195h59m) = ~8,834 hours — i.e. that figure is
   almost certainly the aircraft's PRE-1978-tailstrike flight time (delivery
   Feb 1974 → tailstrike June 1978, ~4.3 years), not the post-repair figure.
   The correct on-air numbers: repair completed July 12, 1978 → crash Aug 12,
   1985 = **~7 years, 1 month**; **12,319 flights / 16,196 hours** flown in
   that window (both figures cross-referenced twice in the primary report).
4. **The Kyu Sakamoto farewell-note claim is DEBUNKED — do not repeat it.**
   A claim recurring "on many English websites" that Sakamoto wrote a
   farewell note (isho) is explicitly refuted by Christopher P. Hood, the
   academic author of the only English-language book on this crash
   (*Dealing with Disaster in Japan: Responses to the Flight JL123 Crash*):
   there is no evidence he wrote one. Reference his death and identification
   (Kasama Inari pendant) factually; do not claim or imply a note.
5. **Differential-thrust "steered home with the throttles" is a
   simplification the AAIC itself corrects.** The crew used engine power
   extensively (pitch/descent-rate control via symmetric thrust changes,
   gear/flap cycling as drag aids) — but the AAIC's own analysis states true
   DIRECTIONAL control via asymmetric/differential thrust is "virtually
   impossible" on this airframe without inducing dangerous dutch-roll, and
   explicitly states **"no evidence was found that such [deliberate
   differential-thrust steering] was attempted."** Script this as "fighting
   the aircraft with raw engine power for pitch and rate of descent," not as
   precision steering-by-throttle.
6. **Search-and-rescue delay: present BOTH the AAIC's own defense AND the
   survivor/press criticism — do not flatten to one side.** AAIC's own
   conclusion (§4.1.11): the ~14-16 hour delay (crash ≈18:56 Aug 12 →
   survivors found 10:45 Aug 13 → extracted 11:40 → hospital ~14:13) was
   "justifiable" given remote mountainous terrain and darkness. Popular/
   survivor accounts (Yumi Ochiai's own testimony of hearing cries fade
   overnight, plus reported physician statements) take a harder line that
   faster rescue could have saved more lives. The specific "a US Marine
   helicopter was recalled at 21:05" claim is a single, decade-later,
   unverified recollection (flagged as such by its own source) — do not
   present it as established fact. Frame this as "official verdict vs. what
   survivors and press have said," attributed on both sides.
7. **A criminal referral happened but no one was indicted — state the
   REPORTED shape, not invented specifics.** Gunma Prefectural Police
   referred 20 people (incl. 4 Boeing employees, 16 JAL/transport-ministry
   personnel) to prosecutors in 1988 on suspicion of professional negligence
   resulting in death. No one was ultimately indicted. The precise mechanical
   reason (Boeing's limited cooperation with a foreign criminal probe) is
   REPORTED via secondary sources only — do not name specific individuals
   beyond the two below (§8), since no other names were independently
   verified.
8. **Two real, named deaths by suicide — state plainly, no invented detail.**
   Hiroo Tominaga (JAL maintenance manager) and Susumu Tajima (the engineer
   who cleared the aircraft airworthy post-1978-repair) are widely and
   consistently reported (multiple independent secondary sources, not one
   primary wire record) to have died by suicide, reportedly guilt-driven.
   State this factually — two men, real roles, reported cause — with no
   invented method, no invented final words, no dramatization. Phrase as
   "widely reported" given the primary-source gap for names specifically.
9. **NTSB accredited representative was George Seidlein, per the primary
   report — not "Ron Schleede" (a name that surfaced in one secondary
   search summary).** Report §1.2.1.7 names Seidlein explicitly; use the
   primary-sourced name.
10. **Living-person handling:** Diana Yukawa (violinist, born ~5 weeks after
    the crash to victim Akihisa Yukawa, paternity legally confirmed) is
    verifiably alive and has PUBLICLY discussed her father's death in her own
    interviews — safe to reference factually with attribution to her own
    public statements, never inventing quotes. Her mother Susanne
    Bayly-Yukawa is a public reinvestigation campaigner — any claims from her
    must be attributed to her specifically, never asserted as fact. **The
    four survivors (Yumi Ochiai, Keiko Kawakami, Hiroko Yoshizaki, Mikiko
    Yoshizaki) stay strictly 1985/historical, past-tense — no speculation
    about current status, whereabouts, or willingness to be featured; no
    reporting found on their present-day (2026) lives.** Do not imply
    Yasumoto Takagi (JAL president who resigned) is alive today without
    fresh verification.
11. **The SDF/missile conspiracy-theory ecosystem exists — never platform it
    as fact.** A persistent Japanese-and-English theory alleges military
    involvement/wreckage tampering; it is not accepted by the official
    investigation. If referenced at all: "some family members and
    independent researchers have publicly disputed the official account" —
    attributed, never asserted, per this channel's United 93 precedent.
12. **No free video footage of this event exists anywhere — this is a
    photo + document episode, and that's fine, state it honestly rather than
    forcing footage that doesn't exist.** This is a foreign (Japanese) 1985
    news event — the US-gov-PD assumption used on American disasters (NTSB/
    FAA dockets) does NOT transfer. NHK footage is confirmed commercially
    licensed only. An unlabeled "ATC audio" file on Internet Archive
    (archive.org/details/japan-air-123-12-august-1985, uploaded by a random
    user with zero source citation) must NOT be used or labeled as real
    audio — provenance is unverifiable.

---

## THE REAL STORY (facts for the script, organized by act)

### Act 1 — The aircraft and the 1978 repair
- **[CONFIRMED primary]** JA8119, Boeing 747SR-100, MSN 20783, manufactured
  30 Jan 1974, delivered to JAL 19 Feb 1974. At crash: 25,030h18m total
  flying time, 18,835 total landings.
- **[CONFIRMED primary]** 2 June 1978: during a landing roll at Osaka
  International Airport, JA8119 struck its aft fuselage on the runway,
  substantially damaging the aircraft and cracking the aft pressure
  bulkhead. **[REPORTED]** This was JAL Flight 115 (same Tokyo–Osaka route as
  the fatal 1985 flight); aircraft bounced on first touchdown, pilot
  over-flared on the second, causing the tailstrike; 25 of 394 aboard
  injured (23 minor, 2 serious).
- **[CONFIRMED primary]** Repair timeline: provisional JAL repairs at Osaka
  (7-14 June 1978) → ferried to Tokyo/Haneda → permanent structural repair by
  a Boeing "AOG" (Aircraft on Ground) team dispatched to Tokyo (17 June - 11
  July 1978) → passed Tokyo Regional Civil Aviation Bureau reinspection 12
  July 1978, returned to service.
- **[CONFIRMED primary, verbatim]** The repair error: *"one splice plate
  narrower than described in rework instructions, and one filler were
  applied, instead of one splice plate... part of L18 splice which should
  have been spliced by two-row rivets became spliced by one-row rivets, with
  the result that the strength of this part decreased to about 70% of the
  original strength."* No written record of this substitution was found; a
  Boeing inspector checked the work but did not catch the deviation, partly
  because the joint edge was later covered by fillet seal, making visual
  reinspection impossible.
- **[CONFIRMED primary]** Fatigue mechanism: cracks began forming at L18
  splice rivet holes almost immediately after the repair, propagating with
  every pressurization cycle (~10,000 cycles estimated for crack growth,
  matching the actual 12,319 post-repair flights). By the last major
  inspection (No. 11C C-check, 20 Nov - 5 Dec 1984), cracks were already
  ~10mm — but the JTSB's own probability study found routine visual
  inspection had only ~10% chance of catching a single crack that size (14-
  60% chance of catching at least one of the many). By 12 Aug 1985, cracks
  had linked into a fracture line ~280mm long.
- **General-audience paraphrase (safe, grounded only in the above — not a
  quote):** every climb to cruising altitude pushed the pressurized cabin
  outward against the aft bulkhead. A correct repair spreads that repeating
  stress across two rows of rivets; because of the botched 1978 fix, nearly
  all of it funneled through one row instead. Microscopic cracks started
  forming at those rivet holes almost immediately, growing with every
  flight, for seven years, undetected.

### Act 2 — 12 August 1985: the flight (all times JST, all CONFIRMED primary
unless noted)
- 18:12 — Takeoff, Haneda, Runway 15L. First Officer Yutaka Sasaki in the
  captain's (left) seat under training/evaluation for captain upgrade;
  Captain Masami Takahama (49, ~12,400 total hours, ~4,850 on the 747, one of
  JAL's most experienced 747 captains) in the first officer's (right) seat as
  instructor, handling radio communication.
- **18:24:35** — Just before 24,000 ft: a loud bang. Both pilots
  simultaneously say "squawk 77" (transponder 7700/emergency). This is the
  aft pressure bulkhead rupture (~8.66 psi differential at failure).
  Mechanism: bulkhead fracture (~2-3 m² opening) → cabin air rushes aft,
  over-pressurizes the unpressurized tail → APU firewall breaks → part of
  the empennage separates → pressurized air enters the vertical fin through
  the torque-box opening → destroys the fin's internal structure, peels the
  skin, separates the rudder → all four hydraulic lines for flight control
  fracture. "Such destruction... progressed within a period as short as a
  few seconds" (AAIC).
- ~18:26 — Full hydraulic loss recognized in the cockpit (FE: "Hydraulic
  pressure has dropped... all out?" / "Yes.") — within ~90 seconds of the
  bang.
- **18:28:35** — Aircraft transmits **"now uncontrollable"** to Tokyo
  Control for the first time.
- ~18:30-18:41 — Traverses Suruga Bay, switches to Japanese-language ATC,
  does an uncontrolled ~360° turn near Mt. Fuji over ~3 minutes, descending
  ~21,000→17,000 ft. ~18:38-40: gear lowered via alternate/electric system to
  dampen the phugoid oscillation — the first deliberate control input beyond
  engine thrust.
- **~18:47:33-18:48** — The "mountain" exchange (verbatim CVR, near
  Oku-Tama, ~9 minutes before the actual crash — a near-miss, not the final
  impact): Co-pilot: "Hey, mountain" / FE: "Yes, please" / Captain: "Mountain
  — take control, right. Right turn." / Co-pilot: "Right turn?" / Co-pilot:
  "We'll hit a mountain!" / Captain: "Max power."
- 18:54:19-18:55:05 — Switches to Tokyo Approach, reports position; Approach
  offers Haneda or Yokota — **no further response from the aircraft to any
  ATC call after this.**
- **18:56:00-18:56:28 (final transcribed CVR content)** — Captain: "Raise
  the nose" (×2), "Power" (×2) → **GPWS: "WHOOP WHOOP / PULL UP" ×6** → logged
  "(contact sound)" → "(end of recording)." Total CVR runtime 32 min 16 sec.
- **~18:56:30 (est.)** — Aircraft clips a ridge/a single larch tree, then a
  "U-shaped ditch" ridge, then crashes nose-and-right-wing-down on a third
  ridge (35°59′54″N, 138°41′49″E) — Ueno Village, Gunma Prefecture, on the
  Gunma/Nagano/Saitama boundary. Later named Osutaka Ridge.
- **[CONFIRMED primary, translation-completeness caveat, good on-screen
  line]:** *"voices were recorded for approximately 32 minutes and 16
  seconds, but information helpful to the accident investigation may have
  been recorded at a portion which had been erased. There were also found
  portions difficult to read..."* — even the official transcript has gaps.

### Act 3 — The investigation and official cause
- **[CONFIRMED primary, verbatim, §4.2 "Cause"]:** *"It is estimated that
  this accident was caused by deterioration of flying quality and loss of
  primary flight control functions due to rupture of the aft pressure
  bulkhead... The reason why the aft pressure bulkhead was ruptured in
  flight is estimated to be that the strength of the said bulkhead was
  reduced due to fatigue cracks propagating at the spliced portion of the
  bulkhead's webs... The initiation and propagation of the fatigue cracks
  are attributable to the improper repairs of the said bulkhead conducted in
  1978, and it is estimated that the fatigue cracks having not been found in
  the later maintenance inspection is contributive..."*
- **[CONFIRMED primary]** Investigation scale: 15 investigators + 2
  aviomedical officers + 13 outside technical advisers; on-site work 13 Aug -
  13 Oct 1985; CVR/FDR decoding ran Aug 1985 - Sept 1986; report issued 19
  June 1987 (~22 months after the crash). NTSB accredited representative:
  George Seidlein.
- **[REPORTED]** Boeing publicly acknowledged the faulty repair execution
  ~3 weeks after the crash (UPI, "Boeing acknowledges faulty repair in JAL
  747," 7 Sept 1985; NYT, "Boeing Says Repairs on Japanese 747 Were Faulty,"
  8 Sept 1985) — acknowledging the repair didn't match specification while
  stopping short at that time of confirming it caused the crash.
- **[REPORTED]** FAA issued Airworthiness Directives (AD 85-21-01, AD
  85-22-12) mandating 747 aft-pressure-bulkhead inspection for fatigue/
  repair deficiencies, and Action Notice 8110.7 (18 Nov 1986) tightening
  inspector guidance on approving major repairs — verify exact AD numbers at
  faa.gov/lessons_learned/transport_airplane/accidents/JA8119 before locking
  into the final script.

### Act 4 — Aftermath and legacy
- **[CONFIRMED]** JAL president Yasumoto Takagi resigned ~24 Aug 1985 (~12
  days after the crash). **[REPORTED]** JAL paid ¥780 million (~$7.6M) in
  condolence money (mimaikin) — explicitly not a legal-liability admission.
- **[REPORTED]** Criminal referral of 20 people (incl. 4 Boeing employees) to
  Maebashi prosecutors (1988) on suspicion of professional negligence
  resulting in death; no one ultimately indicted.
- **[CONFIRMED]** Only 4 of 524 aboard survived (all female), all seated at
  the left side or center of rows 54-60 in the aft fuselage — the section
  that separated and fell into a ravine short of the main impact point,
  shielding them from the worst of the crash forces ("miraculous," in the
  AAIC's own word). All suffered fractures requiring 2-6 months' recovery.
- **[CONFIRMED]** Notable named victims: Kyu Sakamoto, 43 (singer, "Ue o
  Muite Arukō"/"Sukiyaki," first Japanese/Asian #1 on the Billboard Hot 100,
  1963 — body identified partly via a Kasama Inari pendant); Hajimu Nakano
  (Hanshin Tigers club president — the team's first-ever championship that
  same year was dedicated to his memory); Ikuo Urakami (House Foods
  Corporation president); Akihisa Yukawa (Sumitomo banker, father of
  violinist Diana Yukawa, born ~5 weeks after the crash).
- **[CONFIRMED]** Farewell notes (isho) are real and well-documented —
  academic source Christopher P. Hood, corroborated by a contemporaneous UPI
  wire story (18 Aug 1985, "JAL passengers wrote wills as plane plunged").
  Named documented note-writers: Hirotsugu Kawaguchi, Keiichi Matsumoto,
  Ryohei Murakami, Mariko Shirai, Masakazu Taniguchi, Yumiko Tsushima (a
  flight attendant who wrote safety instructions in Japanese and English
  mid-emergency), Kazuo Yoshimura. General content (safe to reference):
  expressions of love/gratitude, instructions to care for children,
  expressions of fear. Use only lines traceable to Hood's book or the JAL
  Safety Promotion Center's own translated-note display; do not invent
  composite quotes.
- **[CONFIRMED]** Memorial: crash site on Osutaka Ridge (Mount
  Takamagahara), Ueno Village, Gunma Prefecture — a cenotaph lists all 520
  victims by name. Annual memorial climb every 12 August, including the 40th
  anniversary (12 Aug 2025). JAL's own Safety Promotion Center (opened 2006,
  Haneda Airport) displays recovered wreckage, passenger effects, and
  translated farewell notes as an internal safety-education exhibit.

---

## LIVING-PERSON FLAGS (🧍 — attributed-never-asserted where noted)

- **🧍 Diana Yukawa** — violinist/composer, born ~5 weeks after the crash to
  victim Akihisa Yukawa (paternity legally confirmed, UK High Court). Alive
  and public; has discussed her father's death in her own interviews — safe
  to reference factually with attribution to her own statements.
- **🧍 Susanne Bayly-Yukawa** — Diana's mother, public reinvestigation
  campaigner. Alive at least as of 2019. Any claims from her (incl. calls to
  reopen the case) must be attributed to her specifically, never asserted.
- **🧍 The four survivors** (Yumi Ochiai, Keiko Kawakami, Hiroko Yoshizaki,
  Mikiko Yoshizaki) — presumed alive; NO current reporting found. Treat
  strictly as 1985 historical figures; no speculation about present-day
  status or willingness to be featured.
- Yasumoto Takagi (resigned JAL president) — do not imply current living
  status without fresh verification.
- Hiroo Tominaga / Susumu Tajima — **deceased** (died by suicide, widely
  reported as guilt-driven) — not a living-person flag, but handle per
  correction #8 above (plain statement, no invented detail).

---

## FOOTAGE/EXHIBIT PLAN (from the archival scout — this is a photo + document
episode, no free video exists; state that honestly, do not force it)

- **Strongest exhibit source in the episode:** the JTSB/AAIC report itself.
  Several figures are already extracted and CC BY 4.0-tagged on Commons
  (crash-site map, aft-fuselage debris photos, "aft torque box destruction
  process" diagrams) — same technique as the AAIB/NTSB pages used in prior
  episodes. `pdftoppm` real pages from the downloaded PDF for the cover,
  cause finding (§4.2), and repair-error diagram beats.
- **Real photos exist (use these):** JA8119 itself pre-crash (`File:
  BOEING_747SR-46,_JA8119,_JAPAN_AIRLINES.jpg`, CC BY-SA 2.0, taken 3 March
  1985 — 5 months before the crash — plus other airport photos in
  Category:JA8119 (aircraft)); crash-site/debris (`File:
  Japan_Airlines_Flight_123_wreckage.jpg`, PD-USGov-FAA; `File:
  Japan_Airlines_123_05_Debris_of_aft_fuselage_(2).png`, CC BY 4.0,
  JTSB-credited); present-day Osutaka Ridge memorial (`File:
  Cenotaph_of_the_japan_air_flight_123_at_osutaka_Ridge.JPG`, CC-BY-SA-3.0 +
  GFDL; `File:Japan_Airlines_Flight_123_Memorial_Ueno_Village_Gunma_
  Prefecture.jpg`, CC BY-SA 4.0) — full category (37 files):
  commons.wikimedia.org/wiki/Category:Japan_Airlines_Flight_123.
- **NOTHING FREE EXISTS — use DossierScene or respectful text-only cards
  for:** (1) the 1978 tailstrike itself (only fan-made Blender
  recreation/diagrams exist — caption as illustration if used, never as
  archival); (2) the interior/decompression moment (obviously unfilmable);
  (3) the 32-minute emergency's audio (CVR transcript text is real and
  quotable, but audio was never publicly released by Japanese authorities —
  an unsourced "ATC audio" file on Internet Archive must NOT be used, per
  correction #12); (4) search & rescue (Getty has paywalled JGSDF photos,
  nothing free).
- **CVR beats:** quote the transcript as on-screen text, OR run through
  `radio_recreate.py` as a Cartesia recreation labeled **"CVR RECREATION"**
  exactly per this channel's honesty rule — never claim real audio.
- **No usable free video anywhere** — this is a foreign (Japanese) 1985 news
  event; NHK footage is commercially licensed only, the US-gov-PD assumption
  does not transfer. Two possibly-PD Boeing corporate promotional films
  ("Assignment 747," "The Outer Limit" on Internet Archive, ~1970, showing
  period 747s including JAL livery in "Assignment 747") exist as *generic*
  period b-roll if their PD status is verified on the archive.org rights
  field — NOT the SR variant specifically, NOT JA8119, use only as
  unlabeled period-appropriate cutaway if used at all.

## COLD OPEN PICK

**Kyu Sakamoto, Haneda Airport, 12 August 1985.** Sakamoto normally flew ANA;
every ANA seat was booked solid for the Obon holiday rush, so his trip was
rebooked onto the extra JAL 123 evening service instead. A friend reportedly
urged him to try to switch back; he is said to have replied (by several
accounts) that since the seat had been arranged for him, he'd use it. His
wife didn't know he was aboard — she found out from the published passenger
list. He was traveling to Osaka to attend a former manager's campaign-office
opening. Precise date, named location, one small concrete action (the
rebooking) — then the recognition-bridge payoff: this was the man who sang
"Sukiyaki," the only Japanese/Asian #1 in Billboard Hot 100 history. Second
character thread for immediately after: Captain Masami Takahama, JAL's most
experienced 747 captain, sits in the CO-PILOT's seat that night — not flying,
teaching. Reserve the CVR "mountain" exchange and the passenger farewell
notes for the climax, exactly as scoped.
