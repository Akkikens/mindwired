#!/usr/bin/env python3
"""Build src/mindwired-doc/docs/jeju2216.json.

Every line traces to docs/planning/CLAIMS-jeju2216.md. The contested finding
(which engine the crew shut down) is attributed everywhere and never asserted —
the families rejected it and its scheduled release was withdrawn.

Facts come from the ARAIB preliminary report (AAR2404) directly, NOT from
secondary reporting. Two corrections the primary document forced:
  * the recorders stopped at 08:58:50 — SIX SECONDS BEFORE the 08:58:56 mayday,
    not after it
  * the aircraft was delivered to RYANAIR in 2009; Jeju Air leased it in 2017

Numbers spelled for TTS. No ALL-CAPS in `text` (the voice shouts them).
"""
import json, pathlib

S = []
def sc(i, text, tone="grave", **kw):
    d = {"id": i, "text": text, "tone": tone}; d.update(kw); S.append(d)
def ex(i, text, img, src, tone="grave", **kw):
    sc(i, text, tone=tone, img=img, exhibit=True, source=src, **kw)

P = "ARAIB Preliminary Report AAR2404"
FAA = "FAA AC 150/5300-13A, p. 20"
RSA = "FAA AC 150/5300-13A, p. 23"
FBF = "FAA AC 150/5300-13A, p. 19"

# ══════════════ COLD OPEN — must pay off the thumbnail inside 30s ══════════════
sc("h1", "A Boeing seven three seven is sliding down a Korean runway on its belly, backwards along the strip, with no wheels down.",
   video="c_b737_1_1.mp4", tone="tense", cap="09:03 KST")
sc("h1b", "It is the twenty ninth of December, two thousand and twenty four. Three minutes past nine in the morning.",
   video="c_runway_1_3.mp4", tone="tense")
sc("h2", "It is running out of runway. Two hundred and fifty metres past the end of it there is a low grassy mound with an aerial on top.",
   video="c_runway_1_1.mp4", tone="tense")
sc("h3", "Inside that mound is concrete.",
   video="c_runway_1_2.mp4")
sc("h4", "One hundred and seventy nine of the one hundred and eighty one people on board will die. And a simulation commissioned by their own government will later conclude that every one of them could have survived.",
   video="c_b737_1_2.mp4", stat="179 of 181")
sc("h5", "This is not a film about pilot error. It is about a mound of earth with concrete in it, a rule that said it should have come apart, and twenty two years of paperwork that said it was fine.",
   video="c_runway_1_3.mp4")
sc("h6", "And it is about four minutes and seven seconds that nobody has a recording of.",
   video="c_b737_1_3.mp4", tone="tense", stat="00:04:07 missing")
sc("title", "Jeju Air two two one six.", img="muan_still", tone="neutral")

# ══════════════ A1 — THE FLIGHT ══════════════
sc("a1_ch", "Bangkok to Muan.", chapter="A duck and two engines", img="b737_still", tone="neutral")
ex("a1_1", "The board's own file number for this is A A R twenty four zero four. A Boeing seven three seven eight hundred, registration H L eight zero eight eight, serial number thirty seven five four one.",
   "ex_araib_p1", P)
sc("a1_2", "One correction before we go on, because almost every comment thread gets it wrong. This is not a seven three seven Max. It is the previous generation, the eight hundred, and the difference matters the moment somebody reaches for the Max story.",
   img="b737_still", tone="neutral", note="CLAIMS: errors in circulation #1.")
ex("a1_3", "Something in the report I did not expect. This aircraft was not delivered new to Jeju Air. It went to Ryanair, in September two thousand and nine. Jeju Air leased it in February two thousand and seventeen.",
   "ex_araib_p2", P)
sc("a1_4", "It is fifteen years old. For an airliner that is middle aged, not old.",
   img="b737_still", tone="neutral")
ex("a1_5", "One hundred and seventy five passengers. Six crew. One hundred and eighty one people.",
   "ex_araib_p1", P, stat="181 aboard")
sc("a1_6", "It leaves Bangkok in the dark and it is due into Muan International, on the south western coast of Korea, a little after nine in the morning.",
   video="c_airport_1_1.mp4")
ex("a1_7", "The crew are experienced. The captain has six thousand eight hundred and twenty three hours, six thousand of them on this type, and two and a half thousand of those in command of it. The first officer has one thousand six hundred and fifty.",
   "ex_araib_p5", P, tone="neutral")
ex("a1_8", "And the weather is, frankly, lovely. Wind from one hundred and ten degrees at two knots. Nine kilometres of visibility. A few clouds at four and a half thousand feet. Two degrees. No significant change expected.",
   "ex_araib_p5", P, tone="neutral")
sc("a1_9", "Nothing about the sky that morning is working against them.",
   video="c_airport_1_2.mp4", tone="neutral")
ex("a1_10", "At fifty four minutes and forty three seconds past eight, the aircraft calls Muan tower for landing. The tower clears it to land on runway zero one.",
   "ex_araib_p2", P, cap="08:54:43")
ex("a1_11", "At fifty seven minutes and fifty seconds past eight, the tower tells them to be cautious of bird activity.",
   "ex_araib_p2", P, tone="tense", cap="08:57:50")
sc("a1_12", "Five minutes and seven seconds later the aircraft is in the embankment.",
   video="c_birds_1_1.mp4", tone="grave")

# ══════════════ A2 — THE BIRDS ══════════════
sc("a2_ch", "Baikal teal.", chapter="Both engines", img="teal_still", tone="neutral")
sc("a2_1", "The bird is a Baikal teal. A migratory duck. Enormous flocks of them winter in that part of Korea, in numbers that are genuinely hard to picture.",
   img="teal_still", tone="neutral")
ex("a2_2", "The report is careful about how it knows. The pilots identified a group of birds on approach. A security camera filmed the aircraft coming close to a group of birds during the go around.",
   "ex_araib_p5", P)
ex("a2_3", "Both engines were examined. Feathers and blood were found on each. Samples went out for D N A analysis, and a domestic organisation identified them as Baikal teals.",
   "ex_araib_p5", P, tone="grave", stat="Both engines")
sc("a2_4", "Both. Not one.",
   img="engine_still")
sc("a2_5", "A twin engine airliner is built to fly on one. That is the whole design philosophy. What it is not built for is losing thrust on both at five hundred feet with no height to trade.",
   img="engine_still")

# ══════════════ A3 — THE RECORDERS ══════════════
sc("a3_ch", "Four minutes, seven seconds.", chapter="The black boxes stop", img="cvr_still", tone="neutral")
sc("a3_1", "This channel is called Black Box Breakdown, and this is the part of this accident I cannot get past.",
   img="cvr_still")
ex("a3_2", "Both recorders were fitted and both were working. And then, at fifty eight minutes and fifty seconds past eight, both of them stopped.",
   "ex_araib_p3", P, cap="08:58:50")
ex("a3_3", "The aircraft hit the embankment at two minutes and fifty seven seconds past nine. The report states the arithmetic plainly. The last four minutes and seven seconds of recording are missing.",
   "ex_araib_p3", P, stat="00:04:07", tone="grave")
ex("a3_4", "It even tells you where the aeroplane was when the recording ended. One hundred and sixty one knots. Four hundred and ninety eight feet.",
   "ex_araib_p4", P, cap="161 kts · 498 ft")
sc("a3_5", "Not burned. Not crushed. Not unreadable. They stopped, together, while the aircraft was still flying.",
   img="cvr_still")
ex("a3_6", "And here is the detail that reorganised this whole film for me. The mayday call is logged at fifty eight minutes and fifty six seconds past eight.",
   "ex_araib_p2", P, tone="tense", cap="08:58:56")
sc("a3_7", "Six seconds after the recorders stopped.",
   img="cvr_still", tone="grave")
sc("a3_8", "I had this the wrong way round before I read the primary document. I assumed the emergency came first and the recorders died in whatever followed. It is the other way round.",
   img="cvr_still", tone="neutral")
sc("a3_9", "The voice recorder was recovered intact and a transcript was made on the fourth of January. The data recorder had a severed connector and was flown to the National Transportation Safety Board in Washington to be read out.",
   img="fdr_still", source="ARAIB, Jan 2025")
sc("a3_10", "Both of them are missing the same four minutes and seven seconds.",
   img="cvr_still")
sc("a3_11", "The leading theory, and I want to be careful because it is a theory, is a total loss of electrical power. That explanation was offered by Sim Jai dong, a former transport ministry investigator, in coverage at the time. It has not been confirmed as the cause.",
   img="cvr_still", tone="neutral",
   note="ALLEGED — attribute every time. CLAIMS: black boxes section.")
sc("a3_12", "Now hold what is inside that window. The go around. The turn back. The decision to land the other way. Whatever happened with the gear. Whatever happened with the engines.",
   video="c_runway_1_2.mp4")
sc("a3_13", "All of it is in the four minutes nobody has.",
   video="c_runway_1_3.mp4")
sc("a3_14", "Everything anyone has concluded about those minutes was inferred from something other than the black boxes.",
   img="cvr_still")


ex("a3_15", "One more thing about that document, and I think it is to the board's credit. On every single page of the preliminary report there is a line in small type.",
   "ex_araib_p3", P, tone="neutral")
sc("a3_16", "This is preliminary information, subject to change, and may contain errors. Any errors in this report will be corrected when the final report has been completed.",
   img="ex_araib_p3", exhibit=True, source=P, tone="neutral")
sc("a3_17", "They wrote that on every page. I would ask you to hold it against everything that followed.",
   img="cvr_still", tone="neutral")


sc("a3_14b", "It is worth being concrete about what is in those four minutes, because black box is a phrase people use without picturing it.",
   img="cvr_still", tone="neutral")
sc("a3_14c", "A flight data recorder is not a summary. It is a continuous stream of hundreds of parameters, sampled several times a second. Control positions. Engine parameters for each engine separately. Gear position. Flap position. Every warning that sounded.",
   img="fdr_still", tone="neutral")
sc("a3_14d", "A cockpit voice recorder is four channels. Each pilot's microphone, the cockpit area microphone, and the radio.",
   img="cvr_still", tone="neutral")
sc("a3_14e", "Between them, those two boxes would have answered almost every question anybody has asked about this accident.",
   img="cvr_still")
sc("a3_14f", "Which engine was producing thrust, and which one was not. What the crew said to each other about it. Whether a warning sounded. Whether the gear was selected and did not come. What they were trying to do in the turn.",
   img="fdr_still")
sc("a3_14g", "All of it was being written down, continuously, until fifty eight minutes and fifty seconds past eight.",
   img="cvr_still")
sc("a3_14h", "And then it was not.",
   img="cvr_still")

# ══════════════ A4 — THE LANDING ══════════════
sc("a4_ch", "Nineteen, the wrong way.", chapter="The turn", img="muan_still", tone="neutral")
sc("a4_1", "They had been approaching runway zero one. They go around.",
   video="c_airport_1_3.mp4", tone="tense")
ex("a4_2", "And then they do something that tells you exactly how much time they believed they had. As the report puts it, the aircraft was flying over the left side of runway zero one, turned right, and approached runway one nine.",
   "ex_araib_p2", P)
sc("a4_3", "Same strip of tarmac. Opposite direction. No circuit, no second thoughts.",
   video="c_runway_1_1.mp4")
sc("a4_4", "The landing gear is not down. It never comes down.",
   img="b737_still")
sc("a4_5", "The aircraft touches down on its belly, roughly one thousand two hundred metres along the runway.",
   video="c_runway_1_2.mp4", stat="~1,200 m in")
sc("a4_6", "And I want to be very clear about this next part, because it is the hinge of the entire story.",
   video="c_runway_1_3.mp4", tone="neutral")
sc("a4_7", "A belly landing on a runway is survivable. Aircraft have done it and people have walked away. The airframe slides, the friction takes the energy out, and it stops.",
   img="b737_still", tone="neutral")
sc("a4_8", "This one was still moving when it ran out of tarmac.",
   video="c_runway_1_1.mp4", tone="tense")

# ══════════════ A5 — THE MOUND ══════════════
sc("a5_ch", "Two hundred and fifty metres.", chapter="What it hit", img="localizer_still", tone="neutral")
sc("a5_1", "Past the end of runway one nine there is a structure carrying the aerial array for the instrument landing system. The localiser. The part that tells an approaching aircraft whether it is left or right of the centreline.",
   img="localizer_still")
sc("a5_2", "It sits about two hundred and fifty metres beyond the runway end, and with the aerials on top it stands around four metres tall.",
   img="localizer_still", stat="250 m · ~4 m")
sc("a5_3", "From the air it is a low grassy mound. That is genuinely what it looks like.",
   img="localizer_still", tone="neutral")
sc("a5_4", "Inside it there is a concrete structure. And in two thousand and twenty three, a concrete slab was added.",
   img="localizer_still", source="CLAIMS §embankment")
ex("a5_5", "The report's description of the wreckage is the part I would ask you to sit with. Both engines were buried in the embankment's soil mound.",
   "ex_araib_p2", P, tone="grave")
ex("a5_6", "The forward fuselage scattered between thirty and two hundred metres from the embankment. The tail flipped and came down beyond it, partly burning.",
   "ex_araib_p2", P)
sc("a5_7", "The two survivors were cabin crew, in the rear jump seats, in the tail. The part of the aeroplane that ended up past the thing it hit.",
   img="muan_still", stat="2 survivors")
sc("a5_8", "They were both seriously injured. Everyone forward of them died.",
   img="muan_still")


sc("a5_1b", "It is worth knowing what a localiser actually does, because it explains why it was sitting there at all.",
   img="localizer_still", tone="neutral")
sc("a5_1c", "It transmits a pair of overlapping radio beams straight down the runway centreline. An aircraft on approach compares them, and the needle in the cockpit tells the crew they are left, right, or exactly where they should be.",
   img="localizer_still", tone="neutral")
sc("a5_1d", "For that to work it has to sit in line with the runway, at the far end. Not near it. In line with it.",
   img="localizer_still", tone="neutral")
ex("a5_1e", "The design document has a phrase for equipment like this. Fixed by function. A navigation aid that must be positioned in a particular location in order to provide an essential benefit for aviation.",
   "ex_faa_fixedbyfunction", FBF, tone="neutral")
sc("a5_1f", "So nobody is arguing it should have been somewhere else. It could not be somewhere else. That is the whole point.",
   img="localizer_still")
sc("a5_1g", "The standard does not say move it. The standard says that because it has to be there, it has to break.",
   img="localizer_still")


sc("a5_8b", "I have not been able to establish much about the two who lived, and I am not going to invent it. What the report records is that they were crew, that they were seriously injured, and that they were in the tail.",
   img="muan_still", tone="neutral")
sc("a5_8c", "Whether they were seated there by roster, by rank, or by whatever ordinary arrangement puts a particular person in a particular seat on a particular morning, I do not know.",
   img="muan_still", tone="neutral")
sc("a5_8d", "It decided whether they lived.",
   img="muan_still")

# ══════════════ A6 — FRANGIBLE ══════════════
sc("a6_ch", "Frangible.", chapter="The word that decides it", img="ex_faa_frangible", tone="neutral")
sc("a6_1", "There is a word in airport design that decides this entire accident, and most people watching will never have needed to know it.",
   img="ex_faa_frangible", tone="neutral")
ex("a6_2", "Frangible. Here is how the American regulator defines it, and the international standard says the same thing in different words.",
   "ex_faa_frangible", FAA)
ex("a6_3", "Retains its structural integrity and stiffness up to a designated maximum load, but on impact from a greater load, breaks, distorts, or yields in such a manner as to present the minimum hazard to aircraft.",
   "ex_faa_frangible", FAA)
ex("a6_4", "Read it again, because it is doing something very specific. It is not asking for a strong structure. It is requiring that past a certain load, the thing must give way.",
   "ex_faa_frangible", FAA)
sc("a6_5", "The rule exists for exactly one reason. Aeroplanes sometimes leave the end of runways, and the things sitting near a runway have to break rather than stop them.",
   img="localizer_still")
sc("a6_6", "An aerial on a breakaway mast does its job perfectly well in normal use, and folds when seventy tonnes arrives.",
   img="localizer_still", tone="neutral")
sc("a6_7", "Concrete does not fold.",
   img="localizer_still")
sc("a6_8", "In December two thousand and twenty five, South Korea's Anti Corruption and Civil Rights Commission ruled that the embankment at Muan violated frangibility safety requirements.",
   img="localizer_still", source="ACRC ruling, Dec 2025")
sc("a6_9", "Not that it was unlucky. Not that it was borderline. That it violated the requirement.",
   img="localizer_still")


# ── RSA — the ground past the runway has a name and a job ──
sc("a6_10", "And there is a second thing in that same document, which I did not know before I read it, and which I think is the quietest and worst fact in this entire story.",
   img="ex_faa_rsa", tone="neutral")
sc("a6_11", "The ground past the end of a runway is not spare ground. It has a name, and it has a defined purpose.",
   img="localizer_still", tone="neutral")
ex("a6_12", "It is called the runway safety area.",
   "ex_faa_rsa", RSA)
ex("a6_13", "A defined surface surrounding the runway, prepared or suitable for reducing the risk of damage to aircraft in the event of an undershoot, overshoot, or excursion from the runway.",
   "ex_faa_rsa", RSA)
ex("a6_14", "Read what that ground is for. It exists specifically for the case where an aeroplane leaves the runway. That is not an unforeseen event. It is the event the surface is designed around.",
   "ex_faa_rsa", RSA)
sc("a6_15", "It is the one piece of an airport whose entire job is to be survivable.",
   img="localizer_still")
sc("a6_16", "And two hundred and fifty metres into it, at Muan, there was concrete.",
   img="localizer_still")


sc("a6_9b", "A caveat I owe you, because I have been quoting an American document at a Korean airport.",
   img="ex_faa_rsa", tone="neutral")
sc("a6_9c", "The Federal Aviation Administration does not regulate Muan. I am using its wording because it is public, it is precise, and it is free to show you on screen.",
   img="ex_faa_rsa", tone="neutral")
sc("a6_9d", "The standard that actually binds a Korean airport is the international one, through the civil aviation organisation, and it requires the same thing in its own words. Equipment sited near a runway must be frangible.",
   img="localizer_still", tone="neutral")
sc("a6_9e", "I am not relying on my paraphrase of that. I am relying on what Korea's own anti corruption commission concluded in December two thousand and twenty five, which is that the embankment violated frangibility requirements.",
   img="localizer_still")

# ══════════════ A7 — 22 YEARS ══════════════
sc("a7_ch", "Twenty two years.", chapter="It was not one airport", img="localizer_still", tone="neutral")
sc("a7_1", "If this were only Muan, it would be a story about one airport and one bad decision.",
   video="c_airport_1_1.mp4", tone="neutral")
sc("a7_2", "In March two thousand and twenty six, a state audit reported that fourteen non compliant localiser installations, at eight airports, had been wrongly approved.",
   img="localizer_still", stat="14 · 8 airports")
sc("a7_3", "The list included Muan. It also included Jeju, and Gimhae.",
   img="localizer_still")
sc("a7_4", "And they had been carrying certified safety inspections for up to twenty two years, while failing frangibility requirements.",
   img="localizer_still", stat="Up to 22 years")
sc("a7_5", "Twenty two years of somebody signing a piece of paper that said this is fine.",
   img="localizer_still")
sc("a7_6", "As for why concrete was there at all. The reporting on the state findings says the ground beneath the runway safety area slopes away, and levelling it would have meant major earthworks.",
   img="localizer_still", tone="neutral",
   note="Attribute to the state report. Do not assert motive beyond it.")
sc("a7_7", "So instead of moving the earth, they raised the aerial on a structure. It was cheaper.",
   img="localizer_still")

# ══════════════ A8 — SURVIVABLE ══════════════
sc("a8_ch", "All of them.", chapter="The simulation", img="muan_still", tone="neutral")
sc("a8_1", "On the eighth of January, two thousand and twenty six, the Korean broadcaster S B S and the New York Times revealed a report the families had been asking to see and had not been given.",
   img="muan_still", source="SBS / New York Times, 8 Jan 2026")
sc("a8_2", "A computer simulation, commissioned by the government.",
   img="muan_still")
sc("a8_3", "Its conclusion was that if the localiser and its supports had not been there, or had been built from frangible materials, everyone on board would have survived.",
   img="muan_still", stat="All 179")
sc("a8_4", "I want to be precise, because this is the strongest claim in this film and it does not need any help from me. The finding is that they could have survived. It is a simulation, and it carries a simulation's assumptions.",
   img="muan_still", tone="neutral")
sc("a8_5", "It is still a government commissioned finding that the structure is the reason the number is one hundred and seventy nine, rather than something close to zero.",
   img="muan_still")
sc("a8_6", "And the families had asked for it, and had not been shown it, until a journalist put it in a newspaper.",
   img="muan_still")

# ══════════════ A9 — THE WITHDRAWN FINDING ══════════════
sc("a9_ch", "Withdrawn.", chapter="The finding they pulled", img="muan_still", tone="neutral")
sc("a9_1", "Now the part most coverage of this accident handles badly, and I would rather go slowly here.",
   img="muan_still", tone="neutral")
sc("a9_2", "On the nineteenth of July, two thousand and twenty five, investigators presented interim findings to the victims' families.",
   img="muan_still", source="ARAIB interim findings, 19 Jul 2025")
sc("a9_3", "Those findings said the crew had shut down the left engine, which was relatively undamaged, rather than the right, which was the one the birds had destroyed.",
   img="muan_still",
   note="DISPUTED — never assert. Families and pilots' union reject it; release withdrawn. CLAIMS: contested finding.")
sc("a9_4", "That finding is disputed. I am not going to tell you it is true and I am not going to tell you it is false, because the investigation has not finished and the people who would know have not published.",
   img="muan_still", tone="neutral")
sc("a9_5", "What I can tell you is that it is an interim finding, and that the black boxes stop four minutes and seven seconds before impact.",
   img="cvr_still")
sc("a9_6", "The families rejected it. So did the pilots' union.",
   img="muan_still")
sc("a9_7", "Their objection was not simply that it blamed the crew. It was that it made the crew's actions the story, while the barrier the aircraft actually hit was treated as background.",
   img="muan_still")
sc("a9_8", "And then something happened that almost never happens. The scheduled release of those findings was withdrawn, after the protests.",
   img="muan_still")
sc("a9_9", "The board agreed to widen the inquiry beyond pilot error, into infrastructure and systemic factors.",
   img="muan_still")
ex("a9_10", "Which, to be fair to the board, is what its own preliminary report had already said it would do. Tear down the engines. Analyse the recorders and the air traffic data. Investigate the embankment, the localisers, and the bird strike evidence.",
   "ex_araib_p6", P, tone="neutral")
ex("a9_11", "It also says the investigation is being assisted by the National Transportation Safety Board in the United States and the B E A in France.",
   "ex_araib_p6", P, tone="neutral")
sc("a9_12", "On the second of December, two thousand and twenty five, the interim report was delayed. International rules require an interim update when a final report is not finished within a year.",
   img="muan_still", source="ICAO Annex 13")
sc("a9_13", "On the twenty second of December, South Korea's parliament passed a bill authorising an independent investigation.",
   img="muan_still")
sc("a9_14", "The final report was expected around the middle of two thousand and twenty six. As this film is made, it has still not been published.",
   img="muan_still")

# ══════════════ CLOSE ══════════════
sc("c_ch", "The record.", chapter="What the record says", img="muan_still", tone="neutral")
sc("c1", "Strip out the argument and here is what is not in dispute.",
   img="muan_still", tone="neutral")
sc("c2", "On a clear morning with two knots of wind, a duck went into both engines of a serviceable aircraft, five minutes from the ground.",
   img="teal_still")
ex("c3", "Both flight recorders stopped together, four minutes and seven seconds before the end, at one hundred and sixty one knots and four hundred and ninety eight feet, and nobody has yet said why with certainty.",
   "ex_araib_p3", P)
sc("c4", "An experienced crew put the aircraft down on a runway, on its belly, which is a thing people survive.",
   video="c_runway_1_2.mp4")
ex("c5", "And it slid into concrete that an international standard said should have broken apart.",
   "ex_faa_frangible", FAA)
sc("c6", "A state commission has since ruled that it violated the requirement. A government simulation says it is the reason everyone died.",
   img="localizer_still")
sc("c7", "One hundred and seventy nine people.",
   img="muan_still", stat="179")
sc("c8", "Fourteen installations. Eight airports. Twenty two years of approvals.",
   img="localizer_still", stat="14 · 8 · 22")
sc("c9", "None of it is hidden. It is in a preliminary report, a commission ruling, a state audit, and a simulation that had to be prised out through a newspaper.",
   img="muan_still")
sc("c10", "What I keep coming back to is not the engines. It is not even the four minutes, though I would very much like to know what is on them.",
   img="cvr_still", tone="neutral")
sc("c11", "It is that the rule was already written. Somebody worked out, decades ago, that aircraft sometimes run off the end, and that whatever sits near a runway has to give way when they do.",
   img="ex_faa_frangible", exhibit=True, source=FAA)
sc("c12", "The rule was there. The paperwork said it had been followed.",
   img="localizer_still")
sc("c13", "And it had not been.",
   img="localizer_still")


# ── fetch queries ────────────────────────────────────────────────────────────
# fetch_doc_footage.py reads these. Pools must be DEEP: preflight counts
# repetition per FILE, so muan_still at 27 scenes needs ~9 distinct images.
# No query targets the crash itself — that footage is news-agency owned and the
# probe confirmed none of it is licensable.
IMG_Q = {
 "muan_still":      "airport terminal and runway aerial view",
 "localizer_still": "ILS localizer antenna array beside airport runway",
 "cvr_still":       "cockpit voice recorder orange flight recorder",
 "fdr_still":       "flight data recorder black box aircraft",
 "b737_still":      "Boeing 737-800 airliner exterior",
 "engine_still":    "CFM56 turbofan jet engine close up",
 "teal_still":      "Baikal teal duck flock wetland",
}
VID_Q = {
 "c_b737_1":  "Boeing 737 landing on runway",
 "c_runway_1":"airport runway seen from moving aircraft",
 "c_airport_1":"airport control tower and apron operations",
 "c_birds_1": "large flock of birds flying over wetland",
 "c_atc_1":   "air traffic control tower radar screen",
 "c_fire_1":  "airport fire service foam tender exercise",
}
for _s in S:
    if _s.get("img") in IMG_Q and not _s.get("exhibit"):
        _s["query"] = IMG_Q[_s["img"]]
    v = _s.get("video")
    if v:
        stem = "_".join(v.replace(".mp4","").split("_")[:3])
        if stem in VID_Q: _s["videoQuery"] = VID_Q[stem]


sc("c14", "If you want the rest of this, the final report is still to come, and when it lands I will go through it here line by line, the same way.",
   img="muan_still", tone="neutral")
sc("c15", "Subscribe if you want that one, because it is the only way it reaches you.",
   img="muan_still", tone="neutral")
sc("c16", "And if you want the other side of this coin, there is a film on this channel about an order that was given in a bunker in Washington, correctly, by a man who was not in the chain of command, and which reached no pilot at all.",
   img="muan_still", tone="neutral")
sc("c17", "Same failure, running the opposite way. That video is called Cheney Said Engage, Nobody Told the Pilots, and it is on the channel now. Watch that one next.",
   img="muan_still", tone="neutral")

doc = {"slug": "jeju2216",
       "title": "Jeju Air 2216: The Mound at the End of the Runway",
       "channel": "blackbox", "niche": "briefing", "language": "en",
       "voice": "d46abd1d-2d02-43e8-819f-51fb652c1c61", "scenes": S}
pathlib.Path("src/mindwired-doc/docs/jeju2216.json").write_text(
    json.dumps(doc, indent=1, ensure_ascii=False)+"\n")

import collections
w = sum(len(s["text"].split()) for s in S)
print(f"scenes {len(S)}  words {w}  est {w/150:.1f} min @150wpm  ({w/140:.1f} min @140)")
print(f"exhibit {sum(1 for s in S if s.get('exhibit'))}  video {sum(1 for s in S if s.get('video'))}  chapters {sum(1 for s in S if s.get('chapter'))}")
c = collections.Counter(s.get("img") for s in S if s.get("img"))
print("\nimg pool usage (cap ~3 for non-exhibit):")
for k,v in c.most_common(): print(f"  {v:3d}  {k}")
