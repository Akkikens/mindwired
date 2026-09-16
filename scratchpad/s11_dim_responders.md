# FACT PACK — FDNY/NYPD response & the radio-interoperability failure
### Black Box Breakdown, `sept11timeline`

Built 2026-09-14 from open-web access to the 9/11 Commission Report, NIST
NCSTAR 1-8, and contemporaneous reporting on the McKinsey report and the
FDNY oral histories. **Labels: CONFIRMED / DISPUTED / ALLEGED (by whom) /
UNVERIFIED / EXCLUDE.** Living persons flagged 🧍 — attributed-never-asserted.
**This episode assigns NO personal blame for the communications failure.**
The 9/11 Commission's own finding is systemic (equipment, protocol, and
inter-agency structure — not an individual's judgment on the day), and nothing
below should be scripted to name a decision-maker as at fault. Where an
account is contested, script it as a contested account, not as a verdict.

---

## ⚠ SOURCE-ACCESS STATUS (read before scripting)

I could **fetch and quote directly**:
- **9/11 Commission Report, Chapter 9** ("Heroism and Horror") — full text,
  ibiblio.org mirror (plain HTML, GPO-identical text; official PDF also
  live, see below). This is the backbone of this fact pack.
- Confirmed **live** (HTTP 200) but not deep-read for this pack: NIST
  NCSTAR 1-8 full PDF (tsapps.nist.gov / nvlpubs.nist.gov), govinfo.gov's
  official PDF of the Commission Report, archive.org's host of the FDNY
  oral histories.

I could **NOT** confirm a live URL for:
- **A New York Times–hosted page for the FDNY oral histories.** I could not
  fetch nytimes.com directly (tool-blocked) and could not locate a working
  nytimes.com URL for the 2005 release via search. **Say so plainly on
  screen if this source is cited: do not display a NYT URL I have not
  verified live.** The transcripts ARE publicly hosted and verifiable at
  **archive.org/details/FDNY_9_11_Oral_Histories** (HTTP 200, confirmed) —
  use that as the on-screen citation instead of guessing at a NYT path.
- **The McKinsey & Company report's original NYC.gov URL**
  (`nyc.gov/html/fdny/html/mck_report/toc.shtml`) returned **HTTP 403**
  (blocked, not confirmed dead — likely bot-blocked, not necessarily
  gone). Do not display this URL on screen as "live" without a fresh check
  closer to production. Secondary mirrors exist (Everyone Goes Home
  Foundation, DTIC) but I could not confirm those loaded either — treat
  the McKinsey report's exact recommendation text as needing a fresh pull
  before airing, not as screen-ready today.

---

## 1. THE FDNY RESPONSE — alarm escalation and forces committed

**CONFIRMED**, 9/11 Commission Report Ch. 9 (page/section as cited in the
ibiblio.org mirror of the GPO text):

- FDNY's dispatch to the World Trade Center began as a response to the
  first plane strike (American 11, North Tower, 8:46) and **escalated
  alarm-by-alarm through the morning as commanders on scene assessed the
  scale of the fire.**
- **As of approximately 9:00** — i.e., before the second plane hit — FDNY
  had already committed roughly **235 firefighters**: **21 engine
  companies, nine ladder companies, four of the department's elite rescue
  companies, its single Hazmat company, two squad companies**, plus
  support/chief staff responding to headquarters.
- **At 9:46 the Chief of Department called an additional fifth alarm**,
  and **at 9:54 a further 20 engine and 6 ladder companies were
  dispatched** to the WTC. The Report states that as a result, **more than
  one-third of all FDNY companies citywide had been sent to the WTC.**
- FDNY established **separate lobby command posts in the North Tower and
  South Tower** — standard high-rise firefighting doctrine calls for a
  command post in the lobby of the affected building to track companies
  as they are assigned and to relay instructions. CONFIRMED as a matter of
  protocol and practice in Ch. 9; the North Tower lobby post is the
  better-documented of the two because its senior chief (Pfeifer) survived
  and the Port Authority's own repeater equipment was co-located there.

**UNVERIFIED in this pass — do not script a number without re-checking**:
a precise final count of "firefighters and companies committed" across
the whole operation (as opposed to as-of-9:00 and the 9:54 fifth-alarm
add). NIST NCSTAR 1-8 (not deep-read this pass — see access note above) is
the report designed to carry that aggregate; pull it before scripting a
specific total headcount for the day's full response.

---

## 2. THE REPEATER QUESTION — genuinely disputed, name every side

**Mechanics — CONFIRMED, 9/11 Commission Report Ch. 9:**
- The WTC complex had a Port Authority–installed **radio repeater system**
  meant to boost FDNY handheld ("handie-talkie") signal between the lobby
  command post and firefighters deep inside/high inside the towers — a
  known dead-zone problem in high-rise steel-frame buildings.
- Operating it required **two steps**: someone activates a control
  console button in the building, and a **second button** must be pressed
  on the handset used by the commanding chief to actually transmit over
  the repeater. **"One button on the repeater system activation console
  in the North Tower was pressed at 8:54, though it is unclear by whom."**
  The **second button was never activated that morning**, per the
  Commission's account.
- **At 9:05, FDNY chiefs tested the system**; because the second button
  had not been pressed, the chief on the master handset could not
  transmit and could not hear another chief testing it from a portable
  radio.
- Because of that failed test, **the chiefs in the North Tower lobby
  decided not to rely on the repeater** and instead used FDNY's ordinary
  citywide tactical channels.
- The Report notes the repeater **was working at least partially on
  portable FDNY radios**, and that **firefighters in the South Tower did
  subsequently use repeater channel 7.** This is the crux of the
  discrepancy: North Tower command judged the system non-functional and
  abandoned it; some radios, some of the time, in fact carried traffic on
  it.

**DISPUTED — name every party, do not resolve it:**
- 🧍 **Deputy (later Assistant) Chief Joseph W. Pfeifer** (FDNY, retired;
  the North Tower's first-arriving, most senior chief, and the department's
  senior surviving witness to the lobby command post) told 9/11 Commission
  staff that he attempted to reach Battalion Chief **Orio Palmer** — who
  was operating deep in the South Tower — over the repeater/Channel 7 and
  that the attempt **failed**, after which he moved to a different
  tactical channel. Source: Commission staff questioning as reported
  contemporaneously by Firehouse Magazine's coverage of the Commission's
  eleventh public hearing (May 18–19, 2004,
  https://9-11commission.gov/archive/hearing11/9-11Commission_Hearing_2004-05-18.pdf
  — hearing transcript is the primary document; the characterization of
  the exchange below is from Firehouse's contemporaneous report on it and
  should be checked against the hearing transcript itself before airing
  any direct quote).
- **ALLEGED (by 9/11 Commission staff investigators, per that same
  reporting):** commission investigators, after reviewing a roughly
  78-minute recording of FDNY radio traffic at the WTC, told the hearing
  they believed **the repeater and radios were in fact working**, and
  that Pfeifer had switched frequencies rather than the system having
  failed outright — i.e., the staff's read of the tape did not straightforwardly
  match Pfeifer's account of a failed attempt.
- **ALLEGED (by the Port Authority, per the same reporting):** the Port
  Authority maintained the repeater system was in working order that
  morning, which is consistent with the Commission staff's tape-based
  position and in tension with the North Tower command post's operational
  decision to abandon it.
- Commission staff also questioned **why a Port Authority civilian
  employee, not FDNY personnel, was the one who initially activated the
  repeater control console** — raised as a possible contributing factor,
  not resolved as a cause, in that same hearing.
- **This dispute is not a personal-blame dispute and must not be scripted
  as one.** The Commission's own Chapter 9 narrative — which is the
  document actually adopted as the government's finding, as opposed to a
  single hearing's questioning — describes a genuinely ambiguous, partially
  working, procedurally confusing system (the two-button design itself,
  the civilian-operated console, the failed 9:05 test) and frames the
  failure as **systemic**: equipment/protocol/training, not an
  individual chief's on-the-day judgment. Script the mechanism (two-button
  design, failed test, and the fact that portable use nonetheless
  continued on Channel 7 in the South Tower) as the throughline, and
  present the Pfeifer/Commission-staff/Port-Authority disagreement as
  **an attributed dispute about what happened**, not as a verdict on
  anyone's competence or courage.

**Primary document for this section:** 9/11 Commission Report, Chapter 9
— official PDF: https://www.govinfo.gov/content/pkg/GPO-911REPORT/pdf/GPO-911REPORT-15.pdf
(GPO/govinfo, U.S. government, public domain; confirmed live HTTP 200).
Mirror used for direct-quote extraction in this pack:
http://www.ibiblio.org/hyperwar/AMH/XXI/GWOT/911-Report/911-Report-9.html
(plain text, matches GPO pagination in substance; use the govinfo PDF as
the on-screen-citable authority, not the ibiblio mirror).
Secondary, for the disputed-testimony detail only: Firehouse Magazine,
"9/11 Probers Grill FDNY Fire Hero," https://www.firehouse.com/home/news/10519296/9-11-probers-grill-fdny-fire-hero
— contemporaneous trade-press account of the May 2004 hearing; treat as
ALLEGED/reported, not as a primary transcript quote, unless the actual
hearing PDF is pulled and cross-checked.

---

## 3. THE EVACUATION ORDER THAT DID NOT GET THROUGH

**CONFIRMED, 9/11 Commission Report Ch. 9:**
- The **South Tower collapsed at 9:59 a.m.**
- **Within about one minute of the collapse**, a chief evacuating the
  North Tower lobby gave the order — the Report's own paraphrase/quote of
  the substance is "**command to all units in Tower 1, evacuate the
  building**" — transmitted from the North Tower lobby command post.
  **[QUOTE STATUS: this exact wording came back from an AI-summarized pass
  over the Commission text, not a verified verbatim primary quote — before
  airing this as an on-screen quoted transmission, pull the govinfo.gov PDF
  directly and confirm the exact wording and page number. Do not put it
  on screen as a verbatim radio quote until re-verified against the PDF.]**
- **Evacuation orders did not follow FDNY's own Mayday protocol** for a
  building in danger of imminent collapse — a protocol that calls for
  continuously repeating "Mayday, Mayday, Mayday" — which the Report
  identifies as one reason the order's urgency did not register with
  everyone who did hear some transmission.
- **Reception was uneven for identifiable, structural reasons**, not
  because of any one person's failure to transmit: high-rise steel-frame
  radio signal degradation; **tactical channel 1 was overcrowded** with
  simultaneous traffic; **off-duty and mutual-aid personnel without
  assigned radios**; and **companies operating on different tactical
  channels** than the one carrying the evacuation order.
- **North Tower collapsed at 10:28 a.m.** — roughly 29 minutes after the
  evacuation order was first given.

**Numbers — handle carefully, two different figures exist and must be
kept separate and sourced:**
- **9/11 Commission's own figure (CONFIRMED, per Commission text as
  surfaced in this research pass):** "**at least 24 of the at most 32
  companies who were dispatched to and actually in the North Tower
  received the evacuation instruction — either via radio or directly from
  other first responders.**" **[VERIFY WORDING/PAGE against the govinfo
  PDF before airing as a direct quote — this exact sentence came from a
  search-engine synthesis, not a tool-verified primary-text extraction in
  this pass.]** This is a **company-count**, not a headcount of
  individual firefighters.
- **FDNY's own later figure — ALLEGED (by FDNY, in FDNY's response to/
  disagreement with the Commission's findings):** FDNY stated that
  problems with the repeater system and with digital Motorola radios
  prevented **up to 121 firefighters** in the North Tower from hearing
  evacuation orders given roughly an hour before the building collapsed.
  **This is a different metric (individual firefighters, FDNY's own count)
  from the Commission's company-count and should never be merged with it
  on screen** — script them as two separate figures from two separate
  parties (the Commission's report vs. FDNY's own account), not
  reconciled into one number.
- **CONFIRMED, per this pass's Commission-text extraction:** at least
  three firefighters are recorded as having heard evacuation instructions
  specifically describing the North Tower as in danger of "imminent
  collapse" — this is a floor, not a ceiling, and should not be scripted
  as "only three heard it."

**What the official reports concluded about why (CONFIRMED, systemic
framing, Ch. 9):** the Commission's own account attributes the shortfall
to a combination of (a) the repeater's contested/limited functioning
(§2 above), (b) radio-channel overcrowding and channel fragmentation,
(c) analog point-to-point radios with only six normal operating channels
citywide, unable to guarantee penetration in a high-rise, and (d) the
absence of Mayday-protocol repetition that would have flagged the order's
urgency to anyone who did receive a fragment of it. The Commission frames
this explicitly as a **systems and procedure failure**, not a failure of
individual radio operators or chiefs, and this episode must not
editorialize past that framing.

**Primary document:** 9/11 Commission Report Ch. 9, same as §2.

---

## 4. NYPD vs FDNY INTEROPERABILITY — the aviation-unit transmissions

**CONFIRMED, 9/11 Commission Report Ch. 9 (again: verify exact wording
against the govinfo PDF before airing as an on-screen quote — the
sentences below came out of this pass's extraction tooling, not a
manually cross-checked primary read):**
- **At 10:04 a.m.**, an NYPD aviation unit transmitted an assessment that
  the **top ~15 stories of the North Tower "were glowing red"** and were
  at risk of collapse.
- **At 10:08 a.m.**, an NYPD helicopter pilot transmitted that he did not
  believe the North Tower would last much longer.
- **CONFIRMED separately, widely corroborated in multiple secondary
  accounts of the same general period:** NYPD aviation unit personnel,
  including **Detective Greg Semendinger**, are separately quoted (in
  reporting distinct from the Commission's own Ch. 9 text) making
  real-time assessments of tower instability and urging evacuation of the
  surrounding area — e.g., an assessment along the lines of "I don't
  think this has too much longer to go" and a recommendation to evacuate
  people from the area of the (South, at that point) tower. **Treat this
  Semendinger material as a separately sourced, separately time-stamped
  strand from the 10:04/10:08 transmissions above — do not blend the two
  into one quote or one timestamp**, and confirm Semendinger's own
  account/timestamp against a primary interview or the NIST/Commission
  record before using it on screen.
- **CONFIRMED, the interoperability gap itself:** NYPD and FDNY units did
  **not share a common radio channel** — NYPD aviation's warnings were
  transmitted on NYPD frequencies that FDNY commanders in the North Tower
  lobby had no radio capable of receiving. The Commission's account states
  there is **no evidence the North Tower lobby command post received
  these NYPD aviation transmissions**, and separately notes that **"none
  of the chiefs present [in the lobby] believed that a total collapse of
  either tower was possible"** at that point — i.e., the gap was not
  merely that a warning was missed, but that FDNY command's own operating
  assumption (steel high-rises don't fully collapse) was not challenged by
  information NYPD had and FDNY could not hear.

**What this section must NOT do:** must not be scripted as "NYPD knew and
FDNY didn't listen" — the finding is that **FDNY had no technical means to
hear it at all**, not that a warning was received and disregarded. Keep
the causal chain as: different radio systems on different frequencies →
NYPD's real-time aerial assessment physically could not reach the FDNY
lobby post → command continued operating on an assumption (no total
collapse) that NYPD's vantage point had already begun to contradict.

**Primary document:** 9/11 Commission Report Ch. 9, same as above.

---

## 5. DEATH TOLL AMONG FIRST RESPONDERS

**CONFIRMED, widely corroborated and stable figures across multiple
independent tallies (search-verified this pass, not yet cross-checked
against a single primary-document page citation — recommend confirming
final digits against the National September 11 Memorial & Museum's own
published responder count, https://www.911memorial.org, before locking
for air):**

- **343 FDNY firefighters** killed. (Some tallies list 344, including
  Fire Patrol member **Keith Roma** of the New York City Fire Patrol — a
  privately funded insurance-industry fire patrol, not an FDNY member —
  who also died responding; note this distinction on screen if the 343
  vs. 344 discrepancy is raised, rather than picking one silently.)
- **37 Port Authority Police Department officers** killed.
- **23 New York City Police Department officers** killed.
- **8 EMTs/paramedics** (private and municipal EMS) killed, per the same
  tally.
- Combined total commonly cited: **~412 emergency responders** killed at
  the World Trade Center that day (343 + 37 + 23 + 8 + Roma depending on
  which tally is used — **do not state a single combined number on screen
  without picking a specific source and citing it**, since the exact
  total varies by 1–2 depending on whether Fire Patrol and specific EMS
  categories are included).

**Separately, CONFIRMED as an ongoing, distinct figure — do not conflate
with the day-of toll:**
- As of recent FDNY memorial-wall updates (reported in ongoing coverage,
  not a single fixed document), **deaths among FDNY fire/EMS members from
  9/11-related illness (WTC Health Program–linked cancers and respiratory
  disease) are reported to be approaching or exceeding the number who died
  on the day itself** — this is a **separate, later, ongoing count**, not
  part of the 343. Script this explicitly as "since then," never merged
  into the day-of toll.

**Sources:** National September 11 Memorial & Museum (911memorial.org) is
the standard citable authority for exact final figures and should be the
on-screen citation; this pass's numbers are search-corroborated across
History.com, FireRescue1, International Fire & Safety Journal, and Fire
and Safety Journal Americas reporting, which is consistent but is
secondary sourcing — **verify against 911memorial.org's own published
figures before locking exact numbers for air.**

---

## 6. WHAT CHANGED AFTERWARD

**CONFIRMED:**
- The **9/11 Commission Report recommended establishing a dedicated,
  interoperable nationwide broadband communications network for first
  responders** — a direct response to the NYPD/FDNY and (separately)
  NYPD/PAPD interoperability failures documented in Ch. 9.
- **Implementation was slow and politically contested.** Congress did not
  act on dedicated spectrum until **the Middle Class Tax Relief and Job
  Creation Act of 2012**, which allocated **20 MHz of spectrum in the 700
  MHz band and approximately $7 billion** to build a nationwide public-safety
  broadband network (this became FirstNet) — **more than a decade** after
  the Commission's recommendation.
- **A National Preparedness Group assessment found the recommendation
  "continues to languish,"** attributing the delay in part to a political
  fight over whether to allocate spectrum directly to public safety or
  auction it to commercial wireless bidders.
- **Locally, NYPD and FDNY made incremental interoperability fixes in the
  years after 9/11** — reporting around the 10-year anniversary (WNYC,
  Police1) describes improved but still partial radio synchronization
  between the two departments; this should be scripted as "improved, not
  solved" rather than either "fixed" or "nothing changed."
- **McKinsey & Company's 2002 report to FDNY** ("Increasing FDNY's
  Preparedness," commissioned directly in response to the operational
  failures of 9/11) made recommendations across **operations, planning
  and management, communications/technology, and family/member support**,
  including recommendations on command-and-control structures that scale
  for major incidents. It **prompted FDNY's first formal strategic
  planning process**, culminating in FDNY's first strategic plan in 2004.
  **The report's original NYC.gov host returned HTTP 403 in this pass —
  do not cite that URL as confirmed-live without re-checking; find a
  current mirror (Everyone Goes Home Foundation's page referenced this
  report but was not confirmed to load in this pass either) before
  putting a URL on screen.**

**Sources:** 9/11 Commission Report (recommendations chapter, not deep-read
this pass — locate and cite the specific recommendation-chapter page before
air); Congress.gov hearing record "20 Years After 9/11: Examining Emergency
Communications" (https://www.congress.gov/event/117th-congress/house-event/114112/text);
WNYC, "10 Years Later, FDNY and NYPD in Radio Sync,"
https://wnyc.org/story/161257-blog-10-years-later-fdny-and-nypd-radio-sync/;
CBS News, "Emergency radio woes persist 10 years after 9/11,"
https://www.cbsnews.com/news/emergency-radio-woes-persist-10-years-after-9-11/.

---

## EXCLUDE list — everything not usable

- **Any exact-word radio transmission not re-verified against a primary
  PDF.** Multiple candidate wordings surfaced in this research pass for
  the 9:59 evacuation order, the 10:04/10:08 NYPD aviation transmissions,
  and the Semendinger quotes — **none should be treated as broadcast-ready
  verbatim until pulled directly from the govinfo.gov PDF of Ch. 9 (or the
  NIST NCSTAR 1-8 PDF, or a primary hearing transcript) rather than from
  this pass's search-engine/AI-summarized extraction.** This pack flags
  each instance above; treat every one as provisional.
- **A New York Times–hosted URL for the FDNY oral histories.** Could not
  find or confirm one live. Use archive.org's host instead
  (archive.org/details/FDNY_9_11_Oral_Histories, confirmed HTTP 200) and
  say on screen that the interviews were compelled into release by
  litigation brought by the New York Times and 9/11 families (2005 New
  York Court of Appeals ruling), without displaying an unverified NYT URL.
- **The McKinsey report's original nyc.gov URL** — 403 in this pass, not
  screen-ready without a fresh check.
- **Any framing that assigns personal blame to Chief Pfeifer, the Port
  Authority console operator, or any other named individual for the
  communications failure.** Per the hard rule set for this episode: the
  finding is systemic. The Pfeifer/Commission-staff/Port-Authority
  disagreement is reportable as a **disputed account of what happened**,
  never as a verdict on anyone's competence, judgment, or courage.
- **Any conspiracy-adjacent framing of the repeater dispute** (e.g.
  material sourced from 911research.wtc7.net or similar sites surfaced
  during this search) — **not used as a source anywhere in this pack**,
  flagged here only to record that such material exists online and was
  deliberately excluded, not overlooked.
- **A single combined "how many responders died" number** — excluded as a
  single locked figure pending direct verification against
  911memorial.org; use the broken-down figures in §5 instead, each
  individually sourced.
- **A precise total headcount of "firefighters and companies committed"
  across the full day's operation** — excluded pending a direct NIST
  NCSTAR 1-8 read (confirmed live this pass, not deep-read); the as-of-9:00
  and fifth-alarm figures in §1 are the only numbers confirmed in this
  pass.
