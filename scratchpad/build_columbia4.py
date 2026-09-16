#!/usr/bin/env python3
import json
S = []
def sc(id, text, **kw):
    d = {"id": id, "text": text}; d.update(kw); S.append(d)

# ═══════════════════════════ ACT VII — WHAT THE RECORD SAYS ══════════════
sc("a7_ch", "What follows is the part the accident board actually spent most of its time on. Not the foam. The organisation.",
   chapter="ACT VII\nWHAT THE RECORD SAYS", img="ex_caib_cover", tone="melancholy")
sc("a7_1", "First, the search. More than twenty five thousand people from two hundred and seventy organisations. Over one and a half million hours, across two point three million acres, an area approaching the size of Connecticut.",
   stat="25,000 PEOPLE · 2.3M ACRES", img="debris_search_field", cap="East Texas, February 2003.", tone="melancholy")
sc("a7_2", "Eighty four thousand pieces were recovered. Eighty four thousand, nine hundred pounds. Thirty eight per cent of the orbiter.",
   stat="84,000 PIECES · 38%", img="debris_hangar", cap="The reconstruction hangar, KSC.", tone="melancholy")
sc("a7_3", "Satellites, infrared, hyperspectral imaging, ground penetrating radar and U two aircraft were all used. The board's assessment is that they proved of little value. It came down to people walking in a line through the woods.",
   videoQuery="search teams walking line forest ground search personnel", motion="slow", tone="melancholy")
sc("a7_4", "On the twenty seventh of March, a helicopter searching Angelina National Forest suffered a mechanical failure and went down at treetop height. It was too low to autorotate.",
   stat="27 MAR 2003", videoQuery="helicopter flying low over forest treetops aerial", tone="fear")
sc("a7_5", "Jules Mier, a contract pilot, and Charles Krenek, a Texas Forest Service aviation specialist, were killed. Three others were injured.",
   img="ex_caib_dedication", exhibit=True, source="CAIB Report, Vol. I, dedication",
   cap="Jules F. Mier, Jr. · Charles Krenek", tone="melancholy")
sc("a7_6", "The accident board put both of their names on the dedication page of its report, with their job titles, underneath the seven astronauts. Nine people died because of this accident, and the report says so on the first page.",
   img="ex_caib_dedication", exhibit=True, source="CAIB Report, Vol. I, dedication",
   highlight=[0.20, 0.62, 0.60, 0.18], motion="slow", tone="melancholy")
sc("a7_7", "Then, in July, they went to San Antonio and fired the foam at the wing.",
   img="swri_airgun_before", stat="7 JULY 2003", cap="Southwest Research Institute.", tone="tension")
sc("a7_8", "One point six seven pounds of foam, at seven hundred and seventy seven feet per second, into a panel taken from Atlantis that had flown twenty six missions.",
   img="swri_airgun_before", cap="A reference projectile. The real foam was never found.", tone="tension",
   note="C3. 1.67 lb is the Board's SELECTED reference projectile, not a measurement of the actual debris, which was destroyed.")
sc("a7_9", "A hole roughly sixteen inches by seventeen. Cracks running eleven inches out from it.",
   img="swri_impact_after_1", stat="16×17 INCHES", cap="CAIB photo, 7 July 2003.", motion="slow", tone="fear")
sc("a7_10", "And the board wrote down what the test was actually for, which is the most revealing sentence in that whole chapter.",
   img="ex_denial_finding", exhibit=True, source="CAIB Report, Vol. I, ch. 3, p. 82", tone="tension")
sc("a7_11", "The impact tests established that foam can breach the reinforced carbon carbon, and also counteracted the lingering denial or discounting of the analytic evidence.",
   img="ex_denial_finding", exhibit=True, source="CAIB Report, Vol. I, ch. 3, p. 82",
   highlight=[0.08, 0.46, 0.84, 0.16], cap="\"...counteracted the lingering denial.\"", motion="slow", tone="fear")
sc("a7_12", "They did not fire that gun to find out whether foam could break a wing. The analysis already said it could. They fired it to end an argument inside their own organisation.",
   videoQuery="laboratory test facility equipment industrial engineering", motion="slow", tone="fear")
sc("a7_13", "Because five months earlier, four days after the accident, the shuttle programme manager had told a press conference that it doesn't make sense to us that a piece of debris could be the root cause of the loss of Columbia and its crew.",
   videoQuery="press conference podium microphones briefing room", stat="5 FEB 2003", tone="tension",
   note="Ron Dittemore. Frame as a documented institutional position held on the analysis then available - NEVER as a personal error. CAIB's own framing is collective.")
sc("a7_14", "That was not a lie. It was what the analysis appeared to show, to people who had watched foam fall off that tank for twenty two years without anyone dying.",
   videoQuery="space shuttle launch ascent plume slow motion", motion="slow", tone="melancholy")
sc("a7_15", "The board's conclusion is one sentence and it is the reason this episode exists.",
   img="ex_org_cause", exhibit=True, source="CAIB Report, Vol. I, ch. 7, p. 177", tone="tension")
sc("a7_16", "In the board's view, NASA's organisational culture and structure had as much to do with this accident as the external tank foam.",
   img="ex_org_cause", exhibit=True, source="CAIB Report, Vol. I, ch. 7, p. 177",
   highlight=[0.08, 0.42, 0.84, 0.15], cap="As much as the foam.", motion="slow", tone="fear")
sc("a7_17", "And they knew how that would be received, so they wrote a warning about it first.",
   img="ex_blame_warning", exhibit=True, source="CAIB Report, Vol. I, ch. 7, p. 177", tone="tension")
sc("a7_18", "Many accident investigations make the same mistake in defining causes. They identify the widget that broke, then locate the person most closely connected with the technical failure. The board did not want to make these errors.",
   img="ex_blame_warning", exhibit=True, source="CAIB Report, Vol. I, ch. 7, p. 177",
   highlight=[0.08, 0.34, 0.84, 0.20], cap="\"The Board did not want to make these errors.\"", motion="slow", tone="melancholy")
sc("a7_19", "Nobody was prosecuted. Some managers were reassigned that July, and NASA said publicly on the day that the changes were no reflection on the competence or diligence or commitment or professionalism of anybody.",
   videoQuery="office building institutional exterior government facility", tone="melancholy",
   note="PHRASING RULE: reassigned / moved to / retired. NEVER removed, demoted, held responsible, took the fall.")
sc("a7_20", "So the organisation restructured while stating that no individual was at fault. Which is exactly what the board asked for. And it is also why no one was ever held to account. Both of those things are true at once.",
   videoQuery="empty office corridor institutional building windows", motion="slow", tone="melancholy")

# ── the Vaughan / Ride payoff ──
sc("a7_21", "There is one more thing in this report, and it is the strangest fact I found.",
   img="ex_caib_cover", tone="tension")
sc("a7_22", "In nineteen ninety six, a sociologist named Diane Vaughan published a book about the Challenger accident. She argued that the disaster was not caused by villains, but by an organisation slowly agreeing that a dangerous thing was normal. She called it the normalisation of deviance.",
   img="vaughan_book", cap="The Challenger Launch Decision, 1996.", tone="melancholy")
sc("a7_23", "In April two thousand and three, she was called to testify before the Columbia board, in Houston.",
   stat="23 APR 2003 · TESTIMONY", videoQuery="hearing room testimony table microphones panel", tone="tension")
sc("a7_24", "Then they hired her onto the staff.",
   img="ex_caib_staff", exhibit=True, source="CAIB Report, Vol. I, staff roster, p. 244",
   highlight=[0.10, 0.48, 0.70, 0.08], cap="Diane Vaughan, Ph.D. — Researcher.", tone="tension")
sc("a7_25", "And then she personally wrote chapter eight of the report. The chapter is called History as Cause: Columbia and Challenger.",
   img="ex_ch8_title", exhibit=True, source="CAIB Report, Vol. I, ch. 8",
   cap="Chapter 8. She wrote it.", motion="slow", tone="fear")
sc("a7_26", "The woman who diagnosed the first accident was brought in to write the finding that nobody had listened.",
   videoQuery="library archive books shelves reading study", motion="slow", tone="melancholy")
sc("a7_27", "Her chapter says this. The causes of the institutional failure responsible for Challenger have not been fixed. And second, that if these systemic flaws are not resolved, the scene is set for another accident.",
   img="ex_ch8_conclusion", exhibit=True, source="CAIB Report, Vol. I, ch. 8, p. 195",
   highlight=[0.08, 0.40, 0.84, 0.18], cap="\"...have not been fixed.\"", tone="fear")
sc("a7_28", "There is an image in that chapter I have not been able to stop thinking about. Engineers and managers incorporated worsening anomalies into the engineering experience base, which functioned as an elastic waistband, expanding to hold larger deviations from the original design.",
   img="ex_ch8_conclusion", exhibit=True, source="CAIB Report, Vol. I, ch. 8, p. 196",
   cap="An elastic waistband.", motion="slow", tone="melancholy")
sc("a7_29", "The word echoes, which that chapter turns on, came from Sally Ride. She sat on the Challenger commission in nineteen eighty six and on the Columbia board in two thousand and three. The only person who ever did both.",
   img="sally_ride", cap="Sally Ride. Both boards.", motion="slow", tone="melancholy")
sc("a7_30", "And the closest parallel the report draws between the two accidents is a single sentence. Challenger astronauts were told that the cold temperature was not a problem, and Columbia astronauts were told that the foam strike was not a problem.",
   img="ex_ch8_parallel", exhibit=True, source="CAIB Report, Vol. I, ch. 8, p. 202",
   highlight=[0.08, 0.44, 0.84, 0.16], motion="slow", tone="fear")

# ═══════════════════════════════════ CODA ════════════════════════════════
sc("coda1", "The board made twenty nine recommendations. Fifteen had to be done before anyone flew again.",
   img="ex_recommendations", exhibit=True, source="CAIB Report, Vol. I, ch. 11", tone="neutral")
sc("coda2", "An independent task group later found NASA met the intent of twelve of them. Three, it could not.",
   stat="12 OF 15", videoQuery="nasa engineers hardware assembly facility work", tone="tension")
sc("coda3", "One of the three was hardening the orbiter's wing. And the stated reason it was dropped is this: the long term plan was abandoned after the national policy decision to retire the space shuttle fleet no later than twenty ten.",
   img="ex_rtf_finding", exhibit=True, source="Return to Flight Task Group, Final Report, Aug 2005",
   highlight=[0.08, 0.48, 0.84, 0.16], tone="fear")
sc("coda4", "Which is worth sitting with. The accident board never recommended retiring the shuttle. It said: if you fly past twenty ten, recertify it first. A conditional.",
   videoQuery="space shuttle orbiter hangar processing facility", tone="tension")
sc("coda5", "One hundred and fifty four days later the White House turned that conditional into a deadline. And the retirement decision then cancelled one of the fixes the accident had called for.",
   stat="154 DAYS", videoQuery="white house washington government building exterior", motion="slow", tone="fear")
sc("coda6", "In July two thousand and five, Discovery flew the return to flight mission. The tank shed foam again. It missed. NASA grounded the fleet the following day, and did not fly again for eleven months.",
   videoQuery="space shuttle launch ascent external tank camera view", tone="melancholy",
   note="C7. The foam MISSED the orbiter. Never say 'foam struck Discovery.'")
sc("coda7", "Columbia itself is still at the Kennedy Space Center. Eighty four thousand pieces of it, in a room on the sixteenth floor of the Vehicle Assembly Building.",
   img="vab_exterior", cap="Vehicle Assembly Building, 16th floor.", tone="melancholy")
sc("coda8", "And they lend it out. Researchers studying how spacecraft come apart during re entry can borrow pieces of it. Three people have written doctorates based on that debris.",
   img="debris_hangar", motion="slow", tone="melancholy")
sc("coda9", "Challenger's recovered structure was sealed into a disused missile silo. Columbia's is signed out, studied, and returned. It is the only destroyed spacecraft in history that is still working.",
   videoQuery="archive storage facility shelves containers industrial", motion="slow", tone="melancholy")
sc("coda10", "One last thing. Ilan Ramon carried a copy of a pencil drawing into orbit with him. It is called Moon Landscape, and it shows the Earth as seen from the moon.",
   img="ex_moon_landscape", exhibit=True, source="Yad Vashem Art Museum, Jerusalem",
   cap="Petr Ginz, \"Moon Landscape,\" 1942.", tone="melancholy")
sc("coda11", "It was drawn in nineteen forty two by a fourteen year old boy named Petr Ginz, in the Theresienstadt ghetto, from imagination. He was murdered at Auschwitz two years later, aged sixteen.",
   img="ex_moon_landscape", exhibit=True, source="Yad Vashem Art Museum, Jerusalem",
   motion="slow", tone="melancholy")
sc("coda12", "Yad Vashem made Ramon a facsimile to take with him. The original never left Jerusalem, and it is still there.",
   img="ex_moon_landscape", exhibit=True, source="Yad Vashem Art Museum, Jerusalem",
   cap="A facsimile. The original is still in Jerusalem.", tone="melancholy",
   note="C6/dim-5. He carried a COPY. Very commonly reported wrong.")
sc("coda13", "Petr Ginz was born on the first of February, nineteen twenty eight. Columbia came apart on the first of February, two thousand and three, which would have been his seventy fifth birthday.",
   img="ex_moon_landscape", exhibit=True, source="Yad Vashem Art Museum, Jerusalem",
   motion="slow", tone="melancholy")
sc("coda14", "Three people asked for a photograph of that wing. The photograph was never taken. Everything else in this story follows from that.",
   img="swri_impact_after_1", cap="The hole, seven July, two thousand and three.", motion="slow", tone="fear")
sc("bridge", "If the way an organisation talks itself past a warning is the part that stays with you, we made the other half of this story. Watch Engineers Said Don't Launch, Seventy Three Seconds Later Challenger Was Gone, right here on this channel. And subscribe to Black Box Breakdown, so you don't miss the next one.",
   videoQuery="space shuttle launch night pad floodlights", motion="slow", tone="melancholy")

json.dump(S, open("scratchpad/columbia_part4.json","w"), indent=1, ensure_ascii=False)
print(f"part 4: {len(S)} scenes")
