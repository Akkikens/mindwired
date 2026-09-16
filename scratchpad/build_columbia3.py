#!/usr/bin/env python3
import json
S = []
def sc(id, text, **kw):
    d = {"id": id, "text": text}; d.update(kw); S.append(d)

# ═══════════════════════════════ ACT V — THE MODEL ═══════════════════════
sc("a5_ch", "While all of that was happening, the engineers were doing the only thing left to them. They were trying to calculate the answer instead of photographing it.",
   chapter="ACT V\nTHE MODEL THEY HAD LEFT", img="ex_crater_diagram", tone="tension")
sc("a5_1", "The tool was called Crater. It was a mathematical model for predicting how deep a piece of debris would penetrate the tiles.",
   img="ex_crater_diagram", exhibit=True, source="CAIB Report, Vol. I, ch. 6", cap="Crater.", tone="neutral")
sc("a5_2", "It had been built and validated for small debris. Ice, mostly. Pieces about three cubic inches.",
   videoQuery="laboratory test rig materials testing equipment engineering", tone="neutral")
sc("a5_3", "The piece that hit Columbia was, by the board's later estimate, about four hundred times larger than anything Crater had ever been tested against.",
   stat="400× OUTSIDE VALIDATION", img="ex_crater_diagram", exhibit=True,
   source="CAIB Report, Vol. I, ch. 6", cap="Four hundred times.", tone="fear")
sc("a5_4", "The engineers running it that week thought the figure was six hundred and forty.",
   videoQuery="engineer calculations spreadsheet computer screen data analysis", motion="slow", tone="fear",
   note="Dim-2 correction C7. 640x is what the DAT believed at the time; 400x is the Board's own estimate. Both figures are real and they mean different things.")
sc("a5_5", "Crater came back and said the debris would go deeper than the tile itself. Which would mean burn through.",
   videoQuery="thermal protection tiles spacecraft surface closeup heat shield", tone="fear")
sc("a5_6", "And here is the part that gets told wrong almost everywhere. Management did not overrule that result. The engineers did.",
   videoQuery="engineers discussion whiteboard technical meeting", motion="slow", tone="tension",
   note="C6. The 'no safety of flight' conclusion was the DAT's own. Do not frame it as managers overruling engineers.")
sc("a5_7", "They knew Crater ran conservative. They knew it did not model the hardened lower layer of the tile. So they talked themselves down, on reasoning that was defensible and turned out to be wrong.",
   videoQuery="engineer office late night desk lamp documents", tone="melancholy")
sc("a5_8", "What they could not do was check that reasoning. To check it, they needed a picture.",
   videoQuery="camera lens telescope optics closeup aperture", motion="slow", tone="fear")
sc("a5_9", "The board wrote one sentence about this situation that is, I think, the single most important line in the entire report.",
   img="ex_burden_finding", exhibit=True, source="CAIB Report, Vol. I, ch. 7, p. 190", tone="tension")
sc("a5_10", "The debris assessment team was put in the untenable position of having to prove that a safety of flight issue existed, without the very images that would permit such a determination.",
   img="ex_burden_finding", exhibit=True, source="CAIB Report, Vol. I, ch. 7, p. 190",
   highlight=[0.08, 0.34, 0.84, 0.18], tone="fear")
sc("a5_11", "Operations must be proved safe, rather than the other way around. NASA inverted this burden of proof.",
   img="ex_burden_finding", exhibit=True, source="CAIB Report, Vol. I, ch. 7, p. 190",
   highlight=[0.08, 0.60, 0.84, 0.14], cap="NASA inverted this burden of proof.", motion="slow", tone="fear")
sc("a5_12", "Meanwhile, two engineers were emailing each other about what would happen if the landing gear bay burned through on the way down.",
   videoQuery="landing gear aircraft wheel assembly mechanism closeup", tone="tension")
sc("a5_13", "On the twenty seventh of January, a landing gear specialist at Langley wrote back to a colleague at Houston. I would bail out before I would let a loved one land like that.",
   img="ex_daugherty_email", exhibit=True, source="CAIB Report, Vol. I, ch. 6, p. 164",
   highlight=[0.08, 0.50, 0.84, 0.14], stat="27 JAN", tone="fear")
sc("a5_14", "The next day he wrote again. Any more activity today on the tile damage, or are people just relegated to crossing their fingers and hoping for the best?",
   img="ex_daugherty_email2", exhibit=True, source="CAIB Report, Vol. I, ch. 6, p. 165",
   highlight=[0.08, 0.42, 0.84, 0.14], cap="Four days before re-entry.", motion="slow", tone="fear")
sc("a5_15", "Those emails went sideways, between two engineers. They did not go up.",
   videoQuery="email inbox screen computer monitor office dark", motion="slow", tone="melancholy")
sc("a5_16", "Programme rules said the mission management team would meet every day of a flight. During Columbia's sixteen days, it met five times.",
   stat="5 MEETINGS IN 16 DAYS", videoQuery="empty conference room table chairs institutional", tone="fear")
sc("a5_17", "Two safety officials were contacted about the strike. One of them was the highest ranking safety official at NASA. The board's finding is that safety personnel took no actions to obtain imagery.",
   img="ex_safety_finding", exhibit=True, source="CAIB Report, Vol. I, ch. 6, p. 152",
   cap="Safety took no action.", tone="fear")
sc("a5_18", "And the crew. People often say the crew never knew. That is not true.",
   videoQuery="astronauts inside spacecraft crew cabin working microgravity", tone="tension")
sc("a5_19", "On the twenty third of January a flight director emailed the commander and the pilot, sent them the video of the strike, and told them it was not even worth mentioning, and that there was absolutely no concern for entry. Husband wrote back and thanked him.",
   img="ex_stich_email", exhibit=True, source="CAIB Report, Vol. I, ch. 6, p. 159",
   highlight=[0.08, 0.46, 0.84, 0.16], cap="\"...absolutely no concern for entry.\"", tone="melancholy",
   note="C12. They KNEW about the strike. What they were never told was that three imagery requests had been made and called off.")
sc("a5_20", "They knew about the foam. What they were never told was that three people had asked for a photograph of their wing, and that the request had been called off.",
   videoQuery="astronauts inside spacecraft flight deck windows earth", motion="slow", tone="melancholy")

# ═══════════════════════════════ ACT VI — ONE FEBRUARY ═══════════════════
sc("a6_ch", "Saturday, the first of February, two thousand and three. Entry interface over the Pacific, eight forty four in the morning, eastern time.",
   chapter="ACT VI\nTHE FIRST OF FEBRUARY", img="mcc_entry", tone="fear")
sc("a6_1", "Columbia comes in over California, then Nevada, then New Mexico, trailing plasma. On the ground in Texas, people are filming it because it is a nice thing to watch on a Saturday morning.",
   videoQuery="reentry plasma trail night sky spacecraft streak", tone="tension")
sc("a6_2", "At eight fifty four and twenty four seconds, a console officer in mission control calls the flight director.",
   videoQuery="nasa mission control consoles screens operators headsets", stat="8:54:24 A.M.", tone="fear")
sc("a6_3", "Flight, MMACS. I've just lost four separate temperature transducers on the left side of the vehicle.",
   speaker="MMACS", radioLabel="RECREATION FROM TRANSCRIPT", timestamp="8:54:24 A.M. EST",
   source="CAIB Report, Vol. I, ch. 2, p. 42", tone="fear",
   note="HONESTY RULE: this is a Cartesia recreation from the printed CAIB transcript, NOT actual MCC audio. Label must read RECREATION.")
sc("a6_4", "Four hydraulic return temps? Is there anything common to them? I mean, you're telling me you lost them all at exactly the same time?",
   speaker="FLIGHT", radioLabel="RECREATION FROM TRANSCRIPT", timestamp="8:54:35 A.M. EST",
   source="CAIB Report, Vol. I, ch. 2, p. 42", tone="fear")
sc("a6_5", "All four of them are located in the aft part of the left wing. And there is no commonality.",
   speaker="MMACS", radioLabel="RECREATION FROM TRANSCRIPT", timestamp="8:54:45 A.M. EST",
   source="CAIB Report, Vol. I, ch. 2, p. 42", tone="fear")
sc("a6_6", "No commonality. Meaning the sensors are not wired together, so a single wiring fault cannot explain it. Meaning something is happening to the left wing.",
   videoQuery="wiring harness cables electrical schematic technical", motion="slow", tone="fear")
sc("a6_7", "At eight fifty nine and fifteen seconds, the tyre pressures on the left main gear go.",
   speaker="MMACS", radioLabel="RECREATION FROM TRANSCRIPT", timestamp="8:59:15 A.M. EST",
   source="CAIB Report, Vol. I, ch. 2, p. 43", stat="8:59:15 A.M.", tone="fear")
sc("a6_8", "And Columbia, Houston, we see your tyre pressure messages and we did not copy your last call.",
   speaker="CAPCOM", radioLabel="RECREATION FROM TRANSCRIPT", timestamp="8:59:28 A.M. EST",
   source="CAIB Report, Vol. I, ch. 2, p. 43", tone="fear")
sc("a6_9", "The answer comes back from the flight deck. One word, and the beginning of another.",
   videoQuery="spacecraft cockpit instruments controls closeup", motion="slow", tone="fear")
sc("a6_10", "The report prints it as: Roger. And then, in square brackets, cut off in mid word.",
   img="ex_last_words", exhibit=True, source="CAIB Report, Vol. I, ch. 2, p. 43",
   highlight=[0.08, 0.46, 0.84, 0.12], cap="The last transmission.", motion="slow", tone="fear",
   note="C11. CAIB does NOT transcribe the fragment. 'Roger, uh, buh' is a press/audio rendering - never attribute it to the report.")
sc("a6_11", "Eight fifty nine and thirty two seconds. Loss of signal. Which, at that point in an entry, is completely normal. It happens every flight when the antennas switch.",
   stat="8:59:32 · LOSS OF SIGNAL", videoQuery="antenna dish tracking station communications ground", tone="fear")
sc("a6_12", "So nobody in that room reacts. They wait, the way they always wait.",
   videoQuery="nasa mission control room operators waiting consoles", motion="slow", tone="fear")
sc("a6_13", "Forty six seconds later, the vehicle comes apart over east Texas. Mission control has no idea. They are still working the tyre pressure problem.",
   stat="9:00:18 · BREAKUP", videoQuery="nasa mission control consoles telemetry screens data", tone="fear")
sc("a6_14", "For twelve more minutes, the loop carries an ordinary technical conversation about instrumentation, while outside, in Nacogdoches and Hemphill and Lufkin, people are hearing what sounds like thunder on a clear day.",
   videoQuery="small town texas street pine trees rural road", motion="slow", tone="fear")
sc("a6_15", "At about twelve minutes past nine, a member of the flight control team gets a call on his mobile phone from someone who has just seen it on television. He walks over to the flight director's console and tells him.",
   videoQuery="nasa mission control room wide view consoles personnel", tone="fear")
sc("a6_16", "LeRoy Cain calls for the ground control officer. He has to call twice.",
   speaker="FLIGHT", radioLabel="RECREATION FROM TRANSCRIPT", timestamp="~9:12 A.M. EST",
   source="CAIB Report, Vol. I, ch. 2, p. 44", tone="fear")
sc("a6_17", "Lock the doors.",
   speaker="FLIGHT", radioLabel="RECREATION FROM TRANSCRIPT", timestamp="~9:12 A.M. EST",
   source="CAIB Report, Vol. I, ch. 2, p. 44", motion="slow", tone="fear",
   note="Verified verbatim by orchestrator against chapter2.txt. Three words, to GC. C5: do NOT weld the later contingency instructions onto it as one sentence.")
sc("a6_18", "Then he tells the room: no phone calls off site. No data in or out. Every console begins archiving its own data, because from this moment the room is evidence.",
   videoQuery="nasa mission control consoles screens data archiving", motion="slow", tone="melancholy")

json.dump(S, open("scratchpad/columbia_part3.json","w"), indent=1, ensure_ascii=False)
print(f"part 3: {len(S)} scenes")
