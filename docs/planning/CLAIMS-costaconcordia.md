# CLAIMS — Costa Concordia disaster (Black Box Breakdown)

Built 2026-08-12 by a 5-dimension research fan-out (timeline/facts · the real
radio call + Schettino trial/current status · victims/salvage/Netflix doc ·
mandatory archival-footage scout · cold-open human thread). Labels:
**CONFIRMED / DISPUTED / ALLEGED (by whom) / UNVERIFIED / EXCLUDE**.
Living-person claims flagged 🧍 — attributed-never-asserted. GATE: this is
the fact base the script is built on — every scene line must trace to a
claim here. Icahn-validated → [[icahn-costaconcordia]].

Primary source: no single official English-language PDF was fully
accessible this session (the Italian MIT technical report mirror 403'd,
CNN trial coverage 451'd/geo-blocked) — the closest thing to a primary
document is **Antonio Di Lieto, "Costa Concordia: Anatomy of an
Organisational Accident"** (Australian Maritime Safety Innovation Lab),
which quotes the officers' and Mario Palombo's official depositions
verbatim: https://maritimesafetyinnovationlab.org/wp-content/uploads/2012/07/costaconcordiaanatomyofanorganisationalaccident.pdf.
Wikipedia's "Costa Concordia disaster" page is a well-sourced index.

---

## ⚠ DATA CORRECTIONS (baked in — do NOT revert)

1. **The exact impact time is genuinely disputed between good sources —
   don't state a false-precise single second.** The Di Lieto paper (citing
   the Italian investigation) says "about 21:42"; multiple other outlets
   cite the Voyage Data Recorder showing 21:45:07. **Use "around 9:42-9:45pm"
   in narration, not a single manufactured timestamp.**
2. **Total people aboard: use the breakdown, not a bare total.** 3,206
   passengers + 1,023 crew = 4,229 by direct arithmetic — but several
   secondary outlets separately cite a rounded "4,252." The discrepancy was
   never resolved against a primary count in this research. **Say "3,206
   passengers and just over 1,000 crew" or do the 4,229 sum on screen —
   never state "4,252" as if it were the confirmed figure.**
3. **The real coast guard/Schettino audio was NEVER officially released —
   it was a press leak.** The recording was made by the Livorno Capitaneria
   di Porto's own operations room (De Falco says on tape "I am recording
   this conversation"), but it reached the public via an anonymous leak to
   journalist Simone Innocenti (Corriere della Sera/Corriere Fiorentino),
   published online Jan 16, 2012 — the Coast Guard only confirmed its
   authenticity AFTER the leak, to the AP. **No source in this research
   found a freely-licensed copy of the actual audio anywhere** (not
   Corriere della Sera, not the Guardia Costiera, not AP/Reuters). Every
   circulating copy is a news organization's copyrighted package or an
   unlicensed reupload. **This scene MUST use `radio_recreate.py` +
   RadioScene labeled as a RECREATION (from the widely-corroborated
   AP/BBC/Al Jazeera transcript), never "ACTUAL RECORDING."** See footage
   plan below.
4. **The helmsman's mis-executed turn did NOT cause the grounding — the
   official investigation says it was already too late regardless.**
   Schettino has repeatedly blamed helmsman Jacob Rusli Bin (a ~13-second
   delay/wrong-direction turn) — but a maritime expert testified at trial
   that a correct turn even 13 seconds earlier would not have avoided the
   collision. **Present Schettino's blame-shifting as ALLEGED (by
   Schettino), and the "too late regardless" finding as the investigation's
   own conclusion** — don't imply the helmsman caused the disaster.
5. **Costa management's role in approving the "inchino" (sail-past) is
   DISPUTED, not settled.** Costa's then-CEO Pier Luigi Foschi publicly
   called it "unapproved, unauthorised and unknown to Costa"; Schettino
   testified it was "arranged and wanted by Costa... for publicity
   reasons." Neither side's claim was ever definitively resolved in
   Schettino's favor or against in the criminal verdict (his conviction
   rests on his own conduct, not on proving Costa ordered the maneuver).
   **Keep this strictly attributed on both sides** ("Schettino claimed...
   Costa's CEO said...").
6. **Salvage/total cost figures span a wide, genuinely disputed range —
   don't pick one number and call it definitive.** Parbuckling-phase-only
   cost ~€600M (~$800M, confirmed contemporary reporting); total
   wreck-removal-through-scrapping figures range from ~$1.2B to "$2 billion"
   depending on source and what's bundled in (insurance/P&I reserves vs.
   salvage-only). **Say "over a billion dollars — some estimates put the
   full cost near two billion" rather than asserting one hard total.**
7. **Manrico Giampedroni (documentary participant, the last survivor
   pulled out alive) was himself convicted** — a suspended 2.5-year
   sentence for negligence/delaying the evacuation order while relaying
   Schettino's "everything is under control" message — he never served
   prison time. If he appears sympathetically (36 hours trapped with a
   broken leg), also note this conviction for balance — don't present him
   as purely a victim without the fuller record.
8. **Domnica Cemortan (the dancer on the bridge, later confirmed as
   Schettino's mistress) was NOT criminally charged** — she testified as a
   witness and separately joined as a civil claimant (compensation
   awarded). Don't imply she was prosecuted.

---

## ACT 1 — The ship, the voyage, the sail-past

- **[CONFIRMED]** Costa Concordia: built by Fincantieri (Genoa), keel laid
  Nov 8 2004, delivered June 30 2006 (~€450M), 114,147 GT, 290.2m long,
  designed for 3,780 passengers (double occ.) + 1,100 crew — first of the
  Concordia-class. Owned by Carnival Corporation, operated by Costa
  Crociere. Registered Genoa.
- **[CONFIRMED]** Jan 13, 2012: departed Civitavecchia (correction #2 on
  headcount) on a 7-day western-Mediterranean cruise (Savona, Marseille,
  Barcelona, more). At 21:37, still holding a 0.5-nautical-mile safety
  margin off Le Scole rocks, doing 15.4 knots (sourced to the ship's own
  NACOS nav-display reconstruction, presented by Italy's own Maritime
  Investigative Body to the IMO).
- **[CONFIRMED — strong cold-open beat]** Captain Francesco Schettino
  approved an unauthorized close pass ("inchino"/sail-past salute) of Isola
  del Giglio, requested by the ship's maître d'hôtel (a Giglio native) and
  connected to Schettino's own former mentor, retired Costa captain **Mario
  Palombo**, who lived on the island. Four similar close salutes had
  happened 2007-2011 (the last Aug 14, 2011), always arranged in advance
  with the Port Authority and shipowner. On the night of the disaster,
  Palombo — reached by phone — told Schettino the water near the port was
  deep enough at 0.4 nautical miles. Correction #5 applies to the "who
  really authorized it" dispute.
- **[CONFIRMED — the key causal beat]** The safety margin eroded from 0.5
  nautical miles to 0.28 nautical miles as the ship closed on Le Scole. The
  Senior Officer of the Watch, growing concerned, **ordered the helmsman to
  turn away** — Schettino **took over and ordered the helmsman to hold
  course and increase speed instead** (sourced to the Safety Officer's own
  deposition). Impact followed around 9:42-9:45pm (correction #1) at ~14-16
  knots, opening a ~53-meter gash across 5 watertight compartments.

## ACT 2 — The blackout, the delay, the evacuation

- **[CONFIRMED]** Power/propulsion failed within minutes of impact; a
  failed emergency-generator restart is timestamped 21:52. Crew told
  passengers it was just an "electrical blackout," "under control," for
  roughly the next hour.
- **[CONFIRMED — the signature stat]** The formal abandon-ship order wasn't
  given until **~22:50 — roughly 65 minutes after impact.** SOLAS requires
  ships be designed for a 30-minute full evacuation from that order; this
  one took **~7 hours end-to-end** (evacuation completed 04:46).
- **[CONFIRMED]** Official cause per Italy's Ministry of Infrastructure and
  Transport investigation: **"the Master's unconventional behaviour"** —
  Schettino's decision to sail an unsafe, unauthorized, high-speed close
  pass at night near a poorly-charted coastline — plus a chain of
  contributing failures: bridge crew not challenging his orders, delayed
  alarm/notification to search-and-rescue, downplaying severity to
  passengers and shore authorities. Correction #4 applies to the helmsman
  angle.
- **[CONFIRMED]** 32 dead (27 passengers, 5 crew); ~64 seriously injured
  (some sources cite up to 157 total treated injuries — likely reflects
  different injury-severity thresholds, DISPUTED which is "the" number).

## ACT 3 — The real radio exchange (RECREATION ONLY — correction #3)

- **[CONFIRMED, mechanism explained]** Coast Guard Cdr. **Gregorio De
  Falco** 🧍 (Livorno Capitaneria di Porto) made/received multiple recorded
  calls with Schettino through the night; the exact total count across the
  whole night is UNVERIFIED (press-reported, not court-transcript-itemized
  in sources found) — narrate as "at least two recorded calls," never a
  hard number. The famous ~4-minute exchange is timestamped **01:46, Jan
  14**.
- **[CONFIRMED — real transcript, widely corroborated across AP/BBC/Al
  Jazeera/HuffPost/Fox/CBC]:** De Falco: *"Lei deve andare da quella prua,
  tramite la biscaggina, e salire su quella nave... Vada a bordo, cazzo!"*
  — rendered in English press as "Get on that bow using the pilot ladder
  and climb up... Get on board, dammit!" (translation of "cazzo" varies by
  outlet — some render it more literally; treat as a translation-choice
  matter, not a factual dispute). De Falco's most-quoted line: *"Lei si è
  salvato dal mare, ma io la porto molto male, le faccio passare le anime
  dei guai. Vada a bordo!"* — "You saved yourself from the sea, but I'll
  make sure you go through hell. Get on board!"
- **[EXCLUDE — footage rule]** Do not use any YouTube reupload or news-site
  embed of this audio as "real audio" in the render — no free license
  exists anywhere (footage-scout finding). Build via `radio_recreate.py`
  from the transcript above, labeled on screen as a recreation.
- **[CONFIRMED]** Schettino left the ship before the evacuation was
  complete and did not comply with De Falco's repeated orders to reboard.

## ACT 4 — The trial, the verdict, and where everyone is now (2026)

- **[CONFIRMED]** Charged Feb 23, 2013 (32 counts manslaughter + causing
  the shipwreck + abandoning ship + false info to authorities). Convicted
  Feb 11, 2015 after a ~19-month trial: **16 years** (never pleaded guilty;
  has consistently framed himself as a scapegoat — ALLEGED by Schettino).
  Appeals upheld conviction: appellate court May 31 2016, Court of
  Cassation (final) May 12 2017 — he then reported to Rebibbia Prison,
  Rome.
- **🧍 [CONFIRMED, current as of 2026]** Schettino remains incarcerated at
  Rebibbia — roughly 10 years into the 16-year term, scheduled release
  **~May 2033**. Withdrew a day-release ("semi-libertà") petition in April
  2025 after failing to secure the required work placement. No evidence of
  any release/parole as of Aug 2026.
- **[CONFIRMED]** Five other defendants (First Officer Ciro Ambrosio 🧍,
  helmsman Jacob Rusli Bin 🧍, Third Officer Silvia Coronica 🧍, Costa's
  crisis coordinator Roberto Ferrarini 🧍, and the ship's hotel director)
  took a 2013 plea bargain — sentences 1 year 8 months to 2 years 10
  months, all under Italy's 3-year automatic-suspension threshold, so
  **none served prison time.**
- **🧍 [CONFIRMED]** De Falco publicly rejected being called a hero. Moved
  to a desk role in 2014, briefly into the Italian Navy in 2016, elected to
  the Italian Senate 2018 (Five Star Movement), expelled from the party
  Dec 2018, returned to the Coast Guard after his term ended (Oct 2022),
  later headed Naples Maritime Authority operations, and — per lower-
  confidence Italian entertainment-press sourcing, not wire-verified —
  retired from the Coast Guard around his 61st birthday, March 2026.
- **🧍 [ALLEGED, not new fact]** Correction #7 — Manrico Giampedroni, a 2026
  Netflix documentary participant (trapped 36 hours, last survivor pulled
  out alive), was himself convicted (suspended sentence, no prison time)
  for his own role relaying Schettino's "under control" message and
  delaying the evacuation order.
- **[CONFIRMED]** Domnica Cemortan 🧍 (Moldovan dancer/hostess on the bridge
  at impact, later admitted as Schettino's mistress) — testified as a
  witness and joined as a civil claimant; correction #8, was NOT criminally
  charged.

## ACT 5 — The 32, and the two who took years to find

- **[CONFIRMED]** Recovery ran in stages: ~17 bodies in the immediate
  aftermath (Jan 2012); 8 more via robotic/mini-sub search of the lifeboat
  deck (Feb 2012); 5 more (trapped between hull and seabed) by March 22,
  2012; passenger **Maria Grazia Trecarichi**, 50 (Sicily), DNA-confirmed
  Oct 24, 2013, after the ship was righted; and finally **Russel Rebello**,
  32, Indian assistant waiter, found **Nov 3, 2014** — almost 3 years after
  the sinking, during dismantling in Genoa, identified by an ID card in his
  uniform. He left behind a young son. His brother Kevin has spoken
  publicly (2026 press tied to the Netflix doc) about him being "a hero."
- **[CONFIRMED — real, sourced heroism beats, keep names straight, they are
  two different people]** Hungarian ship's violinist **Sándor Fehér**, 38,
  is documented (2012 contemporaneous ABC/CBS reporting) to have helped
  frightened children into life jackets before going back for his violin
  and not making it out. Crew member **Giuseppe Girolamo**, 30, is reported
  (witness-sourced, not video-confirmed — label as such) to have given up
  his own lifeboat seat for a child. French passenger **Francis Servel**,
  71, is reported to have given his life jacket to his wife and drowned.
- **[CONFIRMED, separate death — do not fold into "the 32"]** Spanish
  salvage diver **Israel Franco Moreno** died Feb 1, 2014 from a leg injury
  sustained installing sponsons during the salvage — a distinct,
  salvage-operation fatality.

## ACT 6 — The salvage, the rules that changed, and the 2026 Netflix wave

- **[CONFIRMED]** The parbuckling (righting) operation — widely reported as
  the largest maritime salvage by weight in history — was led by salvage
  master **Nick Sloane** 🧍 (Titan Salvage/Micoperi joint venture), ~500
  workers from 24 countries. The rotation itself: **Sept 16-17, 2013**, ~19
  hours. Refloated via steel sponsons and towed ~200nm to Genoa, arriving
  **July 27, 2014**. Correction #6 applies to total cost.
- **[CONFIRMED]** Real regulatory aftermath: SOLAS amendments (adopted by
  IMO's Maritime Safety Committee) now require passenger musters **before
  or immediately upon departure**, not within 24 hours — took force Jan 1,
  2015. A separate SOLAS II-1 damage-stability revision took force Jan 1,
  2020. CLIA/European Cruise Council moved industry policy the same
  direction within weeks of the disaster (Feb 2012).
- **[CONFIRMED — the live 2026 currency hook]** Netflix released
  **"Shipwrecked: Nightmare at Sea"** (dir. Chiara Messineo) on **July 10,
  2026** — hit #1 on the US Netflix Top 10 about a week later. Uses real
  VDR/black-box audio, coast guard radio communications, and passenger
  cellphone video from the actual sinking, plus new 2026 interviews.
  Reception mixed-to-positive (Movieguide 4/5; some reviews note it
  "retells" rather than adds new analysis). Notably, per LadBible reporting
  cross-checked here, **the documentary does not cover the nearly-3-year
  search for Russel Rebello's remains** — real, open differentiation
  territory for this episode.

---

## Archival-footage plan (mandatory scout findings — binding on Step 2/3)

| Beat | Real free asset? | Plan |
|---|---|---|
| The ship before the disaster | **YES** — multiple CC-BY-SA Commons photos (Palma, Savona, Genoa harbour 2010, Valletta, Las Palmas, 2009) | Real `img` establishing shots. |
| The grounded/capsized wreck at Giglio | **YES, extensive** — dozens of CC-BY-SA amateur/press photos dated Jan-June 2012 (`Category:January 2012 grounding of the Costa Concordia`), including 2 real aerials. Verified: `Collision_of_Costa_Concordia_1.jpg` (Rvongher, 14 Jan 2012, CC BY-SA 3.0); `Costa_Concordia_2.jpg` (paolodefalco75, 9 June 2012, CC BY-SA 3.0). | Real `img`/exhibit scenes — strong pool. **Photo-only on Commons** — a real VIDEO of the actual grounding/wreck was not confirmed found; verify again during Step 3 fetch, and if none turns up, the cold-open's first 30-60s needs a different real-video anchor (a real, generic Mediterranean/cruise-ship-at-sea clip, honestly captioned as illustrative, same pattern as [[icahn-everest-bodies]]'s generic climbing b-roll). |
| The 2013-2014 parbuckling salvage | **YES** — CC-BY-SA high-res photos + real engineering diagrams. Verified: `Costa_Concordia_parbuckling_07.jpg` (Rvongher, 16 Sept 2013, CC BY-SA 3.0). | Real `img`/exhibit scenes — a strong "engineering spectacle" chapter. |
| Giglio island (establishing shots) | **YES** — general CC-licensed location photography. | Real `img` establishing shots. |
| Schettino/De Falco radio call | **NO free license anywhere** (see correction #3) — real recording, never officially released, press-leak provenance, no CC copy found from Corriere della Sera, Guardia Costiera, or wire services. | `radio_recreate.py` + RadioScene, honestly labeled as a **recreation from the court/press transcript**, never "actual recording." |
| Guardia Costiera official B-roll (helicopters, patrol boats) | **NOT FOUND** open-licensed — Commons' Guardia Costiera category has zero Concordia-specific material; their YouTube channel has relevant video but standard all-rights-reserved terms. | No free footage for this beat — use real wreck/rescue-context stills instead. |
| Underwater wreck-interior footage (2014 police release) | Found only as a copyrighted BBC News mirror on archive.org. | Not usable — no free footage exists for this beat. |
| US military/DVIDS/NARA | **N/A** — no US federal jurisdiction/involvement in this Italian civil disaster and salvage. | Drop from footage plan. |

## Living people flagged (attributed-never-asserted throughout)

🧍 Francesco Schettino (captain, incarcerated, real current status confirmed
above) · 🧍 Gregorio De Falco (coast guard commander) · 🧍 Ciro Ambrosio,
Jacob Rusli Bin, Silvia Coronica, Roberto Ferrarini (co-defendants, plea
bargain, no prison time) · 🧍 Domnica Cemortan (witness/civil claimant, NOT
charged — correction #8) · 🧍 Manrico Giampedroni (Netflix doc participant,
also convicted — correction #7) · 🧍 Kevin Rebello (Russel Rebello's
brother, quoted publicly) · 🧍 Nick Sloane (salvage master) · 🧍 Netflix doc
participants: Stefania Vincenzi, John & Meghan Scimone, Patricia Sandoval,
Nicholas Taliaferro, Rose Metcalf, Manoj Singh, journalist Barbie Nadeau,
Francesco Boaria, Alessandro Cantelli-Forti, director Chiara Messineo.
