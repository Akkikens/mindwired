#!/usr/bin/env python3
"""Build src/mindwired-doc/docs/columbia.json from the CLAIMS fact base."""
import json
from pathlib import Path

S = []
def sc(id, text, **kw):
    d = {"id": id, "text": text}; d.update(kw); S.append(d)

# ─────────────────────────── COLD OPEN (gated: video>=25s, promise<=30s) ──
S.extend(json.load(open("scratchpad/columbia_coldopen.json")))

sc("title", "Columbia. The photographs NASA never took.",
   chapter="Columbia:\nThe Photos NASA Never Took", img="orbiter_orbit",
   motion="slow", tone="melancholy")

# ═══════════════════════════════ ACT I — THE THING THAT KEPT FALLING OFF ══
sc("a1_ch", "To understand why nobody took that photograph, you have to go back twenty two years, to the first time a space shuttle ever flew.",
   chapter="ACT I\nTHE THING THAT KEPT FALLING OFF", img="sts1_launch", tone="melancholy")
sc("a1_1", "April, nineteen eighty one. Columbia is the first orbiter, and this is the first flight of the programme. It comes back with damaged tiles.",
   videoQuery="space shuttle launch 1981 tracking camera film grain ascent",
   stat="12 APR 1981 · STS-1", cap="The first flight. The first damage.", tone="tension")
sc("a1_2", "The external tank is covered in insulating foam, because it holds liquid hydrogen at two hundred and fifty three degrees below zero and it would otherwise ice over.",
   videoQuery="external tank insulation foam orange spray application factory", tone="neutral")
sc("a1_3", "The design requirement was explicit. The tank was not supposed to shed anything. Not foam, not ice, nothing.",
   img="ex_debris_req", exhibit=True, source="CAIB Report, Vol. I, ch. 6",
   cap="The requirement: no debris shedding.", tone="tension")
sc("a1_4", "It shed foam on the first flight. And on the second. And it kept doing it, for twenty two years, on flight after flight after flight.",
   videoQuery="space shuttle launch ascent external tank separation tracking", motion="slow", tone="tension")
sc("a1_5", "There is a particular place on the tank called the left bipod ramp, a wedge of hand sprayed foam over the strut that holds the orbiter's nose.",
   img="ex_bipod_diagram", exhibit=True, source="CAIB Report, Vol. I, ch. 6",
   cap="The left bipod ramp.", tone="neutral")
sc("a1_6", "Before Columbia's last flight, foam had come off that exact ramp at least six times.",
   stat="6 BIPOD FOAM LOSSES", img="ex_bipod_events", exhibit=True,
   source="CAIB Report, Vol. I, ch. 6, p. 123", cap="Figure 6.1-1. Seven known events.", tone="fear")
sc("a1_7", "But here is the part that matters. At the flight readiness review before Columbia launched, managers were told there had been only three.",
   img="ex_frr_slide", exhibit=True, source="CAIB Report, Vol. I, ch. 6, p. 125",
   highlight=[0.52, 0.34, 0.44, 0.13], cap="\"only 3 documented instances\"", tone="fear",
   note="Dim-1 correction #9. Events four and five (STS-52, STS-62) were discovered by the BOARD, after the accident. The people approving the flight rationale were reasoning from a count wrong by half.")
sc("a1_8", "Two of the six had not been found yet. The accident board discovered them afterwards, going back through the record. The people approving the flight were working from a number that was wrong by half.",
   videoQuery="nasa engineers meeting conference room briefing slides projector", tone="fear")
sc("a1_9", "December, nineteen eighty eight. Atlantis comes back from a classified mission with more than seven hundred damaged tiles and one tile missing altogether.",
   stat="STS-27R · 707 DAMAGED TILES", img="sts27_damage", cap="Atlantis, 1988.", tone="fear")
sc("a1_10", "The commander later said he believed they were going to die on re entry. The damage was directly beneath an antenna mounting plate, which was made of steel, and that is the only reason the wing survived.",
   img="sts27_damage", cap="A steel plate. That is the whole reason.", motion="slow", tone="fear")
sc("a1_11", "October, two thousand and two. Three months before Columbia. Foam comes off the left bipod ramp and hits the solid rocket booster attach ring, about four inches wide and three inches deep.",
   stat="7 OCT 2002 · STS-112", videoQuery="solid rocket booster attach hardware closeup launch vehicle",
   cap="Two missions before Columbia.", tone="tension")
sc("a1_12", "That was the closest warning anyone got, and it arrived two missions before the accident. The programme classified it, flew twice more, and did not fix the ramp.",
   videoQuery="space shuttle vehicle assembly building crawler transport", motion="slow", tone="fear")
sc("a1_13", "There is a word for what was happening, and the accident board used it. NASA had two categories for problems. In family, and out of family.",
   img="ex_infamily_def", exhibit=True, source="CAIB Report, Vol. I, ch. 6, p. 122",
   cap="The definitions, as written.", tone="neutral")
sc("a1_14", "In family meant a problem you had seen before, within the experience base. Out of family meant something new. Foam loss had been seen so many times that it had become, by definition, in family.",
   videoQuery="documents paperwork filing archive shelves office", tone="tension")
sc("a1_15", "The board called that a strange term indeed for a violation of system requirements. Because the classification had been introduced after Challenger, to help. And by definition, the problems moved into the lesser category got less attention.",
   img="ex_infamily_def", exhibit=True, source="CAIB Report, Vol. I, ch. 6, p. 196",
   cap="A post-Challenger reform. It became a mechanism.", motion="slow", tone="fear")
sc("a1_16", "The sociologist who worked on this report has a name for it. The normalisation of deviance. You see the thing that should not happen, and it does not kill you, so it stops being the thing that should not happen.",
   videoQuery="space shuttle launch slow motion ascent plume", motion="slow", tone="melancholy",
   note="Vaughan named in CAIB p.130. She wrote Chapter 8 - paid off in Act VII.")

# ═══════════════════════════════════════ ACT II — SIXTEEN DAYS ═══════════
sc("a2_ch", "On the sixteenth of January, two thousand and three, seven people boarded that orbiter for a sixteen day science mission.",
   chapter="ACT II\nSIXTEEN DAYS", img="crew_portrait", tone="melancholy")
sc("a2_1", "Rick Husband, commander. William McCool, pilot. Michael Anderson, payload commander. Kalpana Chawla, flight engineer. David Brown. Laurel Clark. And Ilan Ramon, the first Israeli in space.",
   img="crew_portrait", cap="STS-107. Seven crew, sixteen days.", motion="slow", tone="melancholy")
sc("a2_2", "It was not a station flight. There was no docking, no rendezvous. Columbia carried a laboratory module in the payload bay and the crew ran experiments around the clock in two shifts.",
   videoQuery="astronauts working inside spacecraft laboratory module microgravity",
   cap="SPACEHAB. Around the clock, two shifts.", tone="neutral")
sc("a2_3", "That detail matters more than it sounds. Because Columbia was not going to the space station, it had no robotic arm fitted, and there was nowhere to shelter if anything went wrong.",
   videoQuery="space shuttle orbiter payload bay doors open earth below", tone="tension")
sc("a2_4", "Eighty one point seven seconds after launch, the foam came off.",
   stat="T PLUS 81.7 SECONDS", videoQuery="space shuttle launch ascent tracking camera long lens",
   motion="fast", tone="fear")
sc("a2_5", "Nobody saw it happen. Not in the control room, not on the pad, not anywhere. It was found the next day, when the routine film review caught it.",
   videoQuery="film review screening room projector engineers watching footage",
   cap="Found the next day. On the film.", tone="tension")
sc("a2_6", "And when they went looking for a clear picture of it, they did not have one.",
   videoQuery="long lens tracking camera optical ground station sky", motion="slow", tone="tension")
sc("a2_7", "Of the ground camera sites that should have recorded the ascent, the first lost track of the vehicle. The second was out of focus because of an improperly maintained lens. The third caught only the top of the wing.",
   img="ex_camera_finding", exhibit=True, source="CAIB Report, Vol. I, ch. 6, p. 140",
   cap="Three sites. No usable image.", tone="fear")
sc("a2_8", "The accident board added one sentence to that finding. Camera problems also hindered the Challenger investigation.",
   img="ex_camera_finding", exhibit=True, source="CAIB Report, Vol. I, ch. 6, p. 140",
   highlight=[0.10, 0.70, 0.80, 0.12], cap="Seventeen years earlier. The same problem.", motion="slow", tone="fear")
sc("a2_9", "So on the seventeenth of January, the chair of the photo working group picked up the phone. The strike was classified out of family. Something new. Something nobody had seen.",
   videoQuery="nasa engineer office telephone desk documents", stat="17 JAN · FLIGHT DAY 2", tone="tension")
sc("a2_10", "A team was stood up to analyse it. It was called the debris assessment team, and it was co chaired by Rodney Rocha.",
   videoQuery="nasa mission control johnson space center consoles engineers", cap="The Debris Assessment Team.", tone="neutral")

json.dump(S, open("scratchpad/columbia_part1.json","w"), indent=1, ensure_ascii=False)
print(f"part 1: {len(S)} scenes")
