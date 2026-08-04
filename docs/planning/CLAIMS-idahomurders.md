# CLAIMS — Moscow, Idaho (Nov 13, 2022) / the Kohberger record
**Proposed launch episode for the new channel: Criminal Record (@WatchCriminalRecord).**
Status: **fact base drafted, NOT cleared for production.** Read the SOURCING
VERDICT section before any scripting — it contains a blocking problem.

Every line the script speaks must trace to an entry here. Facts stated as fact;
anything contested attributed to whoever said it and never asserted.

---

## SOURCING VERDICT (read first — this is the blocker)

**The channel's real-footage rule cannot currently be satisfied for this topic.**
CLAUDE.md is absolute that the first 30 seconds carry real motion footage
(memory `hook-first-30s-real-video`: "NEVER dossier/generated/hand-drawn content
in the first 30s-1min, zero exceptions"). Probed 2026-08-03:

| Source | Query | Result |
|---|---|---|
| Wikimedia Commons (video) | "Moscow, Idaho" | Returns **Moscow, RUSSIA** — Kremlin clock, Moscow Metro, Moscow trams. Zero Idaho hits. Exactly the wrong-subject failure `audit_scene_relevance.py` exists to catch. |
| Wikimedia Commons (video) | "University of Idaho" | A campus panel discussion, a 2023 court "special sitting" recording, and several clips of an unrelated Indonesian university (UI). Nothing usable. |
| Wikimedia Commons (video) | "Pullman Washington" | Pullman *railway carriages* in the UK. Nothing about WSU. |
| `fetch_footage.py --kind video --niche history` | campus/town/courthouse | Timed out at 10 minutes without returning a usable candidate. |

Why: **the Evidence Engine's footage advantage is federal.** NTSB, NIST, NASA,
NARA and DVIDS release their work into the public domain, which is why the
aviation/space/disaster episodes can open on real motion. A state-court homicide
case produces superb *documents* and essentially no free *film*. Municipal and
state-court recordings are not automatically public domain the way federal works
are, and the broadcast footage everyone has seen belongs to news organisations.

The three ways forward, honestly stated:
1. **License court footage / news pool material.** Real, on-topic, correct — and
   a cost plus a Content ID exposure that needs Akshay's explicit sign-off.
2. **Open on generic modern b-roll** (a night street, patrol lights from
   Pexels/Pixabay). Permitted by CLAUDE.md *only* as generic modern b-roll never
   presented as archival — but for a specific 2022 crime that is precisely the
   "AI slop / stock filler" texture real viewers already complained about, and it
   cannot honestly carry a cold open about one house on one night.
3. **Change the format for this channel: document-first.** Build the episode on
   real court records on screen — the probable-cause affidavit, the plea
   agreement, the judgment, the hand-written post-conviction petition — with
   motion supplied by camera moves over genuine documents rather than by footage.
   That is honest and it is the channel's actual differentiator, but it means
   **Criminal Record needs its own explicit first-30s rule that differs from the
   space/disaster channels' rule** — a deliberate house-rule decision, not a
   quiet exception.

**Recommendation: option 3, decided explicitly, before scripting.** Do not let
this default silently into option 2.

---

## The victims (name them, once, plainly; no crime-scene imagery, ever)
Kaylee Goncalves, Madison Mogen, Xana Kernodle, and Ethan Chapin — four
University of Idaho students killed in an off-campus house in Moscow, Idaho, in
the early hours of **Sunday, November 13, 2022**. [CNN, CBS News, Time]

**Hard rules for this episode (stricter than the disaster episodes):**
- No crime-scene photographs, no injury description beyond the legally
  necessary word "stabbed", no autopsy detail, no house address, no exterior
  shots of the residence, no recreation of the attack in any form.
- No family photographs of the victims (copyrighted, and using them to sell a
  thumbnail is not something this channel does).
- Never speculate about motive. The record is explicit that motive was never
  established publicly — see below.
- The surviving roommates are private individuals who were not charged with
  anything. Their delay in calling 911 is part of the record, but it is
  reported without any framing that implies fault. They were 20-year-old
  students who had just woken up.
- No true-crime "entertainment" scoring over the events of that night.

## Timeline of that morning (from the record)
- Investigators placed the killings **between roughly 4:00 and 4:25 a.m.**
  [ABC News, CBS News]
- A surviving housemate told investigators she was woken around 4 a.m. by
  sounds from a victim's room, and described standing in "frozen shock" as a
  masked man dressed in black walked past her toward a door. [affidavit as
  reported by ABC News / Newsweek]
- Surviving roommates called and texted the victims repeatedly **between 4:19
  and 4:32 a.m.**, again at **10:23 a.m.**, and called someone outside the
  house at **11:50 a.m.** [ABC News / CNN, on released texts]
- The **911 call was placed at 11:58 a.m.**, reporting an unconscious person.
  On the released transcript one caller says "Something has happened in our
  house, and we don't know what," another says a roommate "was drunk last night
  and she's not waking up," and adds "they saw some man in their house last
  night." [CNN, NBC News, GMA — transcript and audio released March 2025]
  **Use these verbatim quotes sparingly and never for shock value.**

## The investigation — the part this episode is actually about
- A **tan leather Ka-Bar knife sheath** was recovered at the scene, beside
  Madison Mogen. The Idaho State Lab found **a single source of male DNA on the
  sheath's button snap**. [probable-cause affidavit, as reported by NewsNation,
  Newsweek, CBS]
- The FBI used **investigative genetic genealogy** — uploading the unknown
  profile to public genealogy databases and building family trees outward — to
  develop Bryan Kohberger as a suspect. Prosecutors confirmed this in filings in
  June 2023. [NBC News, CNN]
- Investigators then collected **DNA from the trash at the Kohberger family home
  in Monroe County, Pennsylvania**, days before the arrest, and concluded a male
  there was "not excluded as the biological father" of the suspect profile.
  [affidavit, as reported by NBC News / AOL]
- The comparison was later put at **at least 5.37 octillion times more likely**
  to be Kohberger's than an unrelated person's. [as reported in court filings /
  CNN] — *state this as the figure prosecutors put in the record, not as an
  independent scientific claim.*
- **A white 2015 Hyundai Elantra** became the case's other spine: observed
  moving from the WSU area toward Moscow around **2:44 a.m.** and back near WSU
  around **5:25 a.m.**; Kohberger **re-registered the car in Washington on
  November 18, 2022 — five days after the killings** — receiving a new plate.
  [CBS Philadelphia, FOX 13]
- Cell-site records placed his phone **in the area of the house at least 12
  times before that night, starting in August**. [affidavit as reported]
- **Notable and worth the screen time:** the lead detective acknowledged the
  genetic-genealogy work was **not mentioned in the probable-cause affidavit**.
  That omission became a live defence issue — and it is the most interesting
  legal thread in the whole case for a channel built on the record.
- Kohberger was a **criminal-justice PhD student at Washington State
  University**, arrested in Pennsylvania on **December 30, 2022**, about six
  weeks after the killings. [NBC News, Time]

## Disposition
- **July 2, 2025:** pleaded guilty to four counts of first-degree murder and one
  count of burglary, under an agreement that removed the death penalty. [CNN,
  Time]
- **July 23, 2025:** sentenced to **four consecutive life terms without parole**,
  plus 10 years for the burglary. He declined to speak. **The families were left
  without a stated motive** — that absence is the episode's real ending, and it
  must not be filled with speculation. [CNN, Time]

## The live development (why this is current, not settled history)
- **July 27, 2026:** Kohberger filed a **hand-written petition for
  post-conviction relief** in Idaho district court, **representing himself**,
  from the Idaho Maximum Security Institution. [NBC News, CNN, Spectrum News]
- The petition alleges **ineffective assistance of counsel, coercion,
  disinformation and false promises**, and asks for a new trial — claiming the
  plea "was induced by unkept promises," including alleged promises about prison
  conditions (contact visits, movement, employment) and what he characterises as
  "elaborate lies" about death-row life. **These are his allegations, filed by
  him, and unproven — attribute every one.** [NBC News, CNN]
- Legal commentators broadly describe the odds as poor, and note the plea
  included appeal waivers. Report that as expert commentary, not as fact.
  [CNN, Newsweek]
- Kaylee Goncalves' mother has said publicly the family is ready for trial.
  [Fox News] — one line, respectfully, no more.
- Netflix released a three-part documentary, *The Idaho Murders: College
  Nightmare*, in late July 2026. If the episode positions against it, the
  comparison must be about *what the court record contains*, not a swipe at
  another production.

## What the episode should NOT claim
- Any motive. None was established on the record.
- That genetic genealogy "solved" the case unaided — it developed a lead;
  the confirmatory comparison and the plea are what closed it.
- That the plea withdrawal is likely to succeed, or that it is meritless.
  Report the filing, the claims, the waivers, and the commentary. Stop there.
- Anything drawn from Reddit/TikTok theorising from 2022-23. There was a great
  deal of it, and it caused real harm to at least one innocent person who was
  publicly accused online. If that is covered at all, it is covered as a
  cautionary thread with no names.

## Open items before this can go into production
1. **The first-30s decision above.** Blocking.
2. Pull the actual documents for on-screen exhibits: the probable-cause
   affidavit, the plea agreement, the judgment, and the July 2026 petition.
   Idaho's iCourt portal / Ada County District Court. Screenshot at high
   resolution the way `exhibits_src/` was built for Building 7.
3. Channel assets that do not exist yet: Criminal Record theme accent,
   wordmark, host, and **one** vertical + one horizontal subscribe outro
   (the single legitimate new-outro spend — see CLAUDE.md's hard rule).
4. Run icahn-validate properly for the packaging gate before scripting.
5. A dedicated sensitivity review, at United-93 / Building-7 tier. Four
   identifiable young victims with living, publicly-active families puts this
   at the top of the channel's risk scale.
