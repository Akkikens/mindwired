#!/usr/bin/env python3
import json
S = []
def sc(id, text, **kw):
    d = {"id": id, "text": text}; d.update(kw); S.append(d)

# ═══════════════════════════════ ACT III — THREE REQUESTS ════════════════
sc("a3_ch", "Over the next five days, three separate people asked for a photograph of that wing. Three separate requests, through three separate channels.",
   chapter="ACT III\nTHREE REQUESTS", img="ex_imagery_box", tone="tension")
sc("a3_1", "The board counted them, and printed them in a box in the report, so there could be no argument about it afterwards.",
   img="ex_imagery_box", exhibit=True, source="CAIB Report, Vol. I, ch. 6, p. 166",
   cap="Imagery Requests. The Board's own box.", tone="neutral")
sc("a3_2", "Request one. Flight day two. Bob Page, chair of the photo working group, to Wayne Hale, shuttle programme manager for launch integration. In person.",
   img="ex_imagery_box", exhibit=True, source="CAIB Report, Vol. I, ch. 6, p. 166",
   highlight=[0.08, 0.26, 0.84, 0.13], stat="REQUEST 1 · IN PERSON", tone="tension")
sc("a3_3", "Request two. Flight day six. Bob White, a contractor manager, to Lambert Austin, head of systems integration. By phone.",
   img="ex_imagery_box", exhibit=True, source="CAIB Report, Vol. I, ch. 6, p. 166",
   highlight=[0.08, 0.42, 0.84, 0.13], stat="REQUEST 2 · BY PHONE", tone="tension")
sc("a3_4", "Request three. Flight day six. Rodney Rocha, to Paul Shack, manager of the shuttle engineering office. By email.",
   img="ex_imagery_box", exhibit=True, source="CAIB Report, Vol. I, ch. 6, p. 166",
   highlight=[0.08, 0.58, 0.84, 0.13], stat="REQUEST 3 · BY EMAIL", tone="tension")
sc("a3_5", "Rocha's email is worth reading, because of one word in it.",
   img="ex_rocha_beg", exhibit=True, source="CAIB Report, Vol. I, ch. 6, p. 151", tone="tension")
sc("a3_6", "Can we petition, and then in brackets, beg, for outside agency assistance.",
   img="ex_rocha_beg", exhibit=True, source="CAIB Report, Vol. I, ch. 6, p. 151",
   highlight=[0.08, 0.58, 0.84, 0.12], cap="\"Can we petition (beg)...\"", motion="slow", tone="fear",
   note="Bold in the original. Verified verbatim against chapter6.txt.")
sc("a3_7", "He was the chief engineer for the thermal protection system. The heat shield. The thing that keeps the vehicle from burning up. And he is using the word beg.",
   videoQuery="nasa engineer office desk computer documents working late", motion="slow", tone="melancholy")
sc("a3_8", "None of the three requests went through the normal channel, which ran through mission management. The engineers went up the engineering side instead, because management was not engaging.",
   videoQuery="office corridor doors fluorescent institutional building", tone="tension")
sc("a3_9", "And the board found that this routing was itself part of the failure.",
   img="ex_routing_finding", exhibit=True, source="CAIB Report, Vol. I, ch. 6, p. 152", tone="tension")
sc("a3_10", "Routing the request through the engineering department led in part to it being viewed by shuttle programme managers as a non critical engineering desire, rather than a critical operational need.",
   img="ex_routing_finding", exhibit=True, source="CAIB Report, Vol. I, ch. 6, p. 152",
   highlight=[0.08, 0.44, 0.84, 0.16], cap="A desire. Not a need.", motion="slow", tone="fear")

# ═══════════════════════════════ ACT IV — NINETY MINUTES ═════════════════
sc("a4_ch", "On the morning of the twenty second of January, the United States military began preparing to photograph Columbia in orbit. Ninety minutes later it stopped.",
   chapter="ACT IV\nNINETY MINUTES", img="ex_dod_cancel", tone="fear")
sc("a4_1", "Wayne Hale phoned a defence department representative at the Cape and asked the military to start the process.",
   videoQuery="military operations center personnel consoles screens dark room",
   stat="22 JAN · MORNING", tone="tension")
sc("a4_2", "Within an hour, that request reached United States Strategic Command at Cheyenne Mountain, in Colorado. A plans officer there began identifying which assets could do it.",
   videoQuery="cheyenne mountain military command facility tunnel blast door", cap="Cheyenne Mountain. Assets being tasked.", tone="tension")
sc("a4_3", "This is real. It was happening. Somewhere in Colorado, people were working out how to point something at a wing.",
   videoQuery="ground based telescope observatory dome night sky tracking", motion="slow", tone="tension")
sc("a4_4", "At half past eight that morning, NASA's liaison officer called Strategic Command back and cancelled it.",
   img="ex_dod_cancel", exhibit=True, source="CAIB Report, Vol. I, ch. 6, p. 153",
   stat="8:30 A.M. · CANCELLED", tone="fear")
sc("a4_5", "The reason given was that NASA had identified its own in house resources and no longer needed the military's help.",
   img="ex_dod_cancel", exhibit=True, source="CAIB Report, Vol. I, ch. 6, p. 153",
   highlight=[0.08, 0.40, 0.84, 0.14], tone="fear")
sc("a4_6", "The board wrote the next sentence in a way that leaves nothing to interpret. The NASA request to the department of defense to prepare to image Columbia on orbit was both made and rescinded within ninety minutes.",
   img="ex_dod_cancel", exhibit=True, source="CAIB Report, Vol. I, ch. 6, p. 153",
   highlight=[0.08, 0.56, 0.84, 0.16], cap="Made and rescinded. Ninety minutes.", motion="slow", tone="fear")
sc("a4_7", "What happened inside those ninety minutes, the board describes carefully, and so will we. It says the following sequence likely occurred.",
   videoQuery="clock face ticking time office wall institutional", tone="tension",
   note="C1/C4. CAIB says 'likely occurred'. Do NOT assert. Ham did not personally phone USSTRATCOM.")
sc("a4_8", "The chair of the mission management team, Linda Ham, asked who was requesting the imagery. She called several senior managers. Each said they had not requested it, and could not identify a requirement for it.",
   videoQuery="nasa management meeting conference table briefing", tone="tension")
sc("a4_9", "And that word, requirement, is where this comes apart. Because the engineers had not filed a requirement. They had asked a question.",
   videoQuery="documents forms paperwork desk bureaucracy stamp", motion="slow", tone="fear")
sc("a4_10", "The board's finding is narrow and it is precise. Ham has publicly said she did not know the debris assessment team wanted the images. The board does not dispute that. What it says is this.",
   img="ex_ham_finding", exhibit=True, source="CAIB Report, Vol. I, ch. 6, p. 153", tone="tension")
sc("a4_11", "She never asked them directly if the request was theirs, even though they were the team analysing the foam strike.",
   img="ex_ham_finding", exhibit=True, source="CAIB Report, Vol. I, ch. 6, p. 153",
   highlight=[0.08, 0.48, 0.84, 0.14], cap="She never asked them.", motion="slow", tone="fear")
sc("a4_12", "There is one more finding here, and it is the one almost nobody quotes.",
   videoQuery="satellite orbiting earth space imagery reconnaissance", tone="tension")
sc("a4_13", "Nobody in the chain of command had the security clearance to know what American imaging satellites could actually do. Not at NASA, not at the contractors. Nobody asked what quality of picture was even possible.",
   img="ex_clearance_finding", exhibit=True, source="CAIB Report, Vol. I, ch. 6, p. 154",
   cap="No one was cleared to know.", tone="fear")
sc("a4_14", "So the decision not to look was made by people who did not know what looking would have shown them. The board's phrase is that they were making critical decisions about imagery capabilities based on little or no knowledge.",
   img="ex_clearance_finding", exhibit=True, source="CAIB Report, Vol. I, ch. 6, p. 154",
   highlight=[0.08, 0.52, 0.84, 0.15], motion="slow", tone="fear",
   note="C5. The finding is NOT that satellites would have shown the hole. Never claim that.")
sc("a4_15", "On the twenty third of January, a flight director wrote an email closing the matter. The shuttle programme was asked directly if they wanted outside resources. They said no. After talking to Phil, I consider it to be a dead issue.",
   img="ex_cain_email", exhibit=True, source="CAIB Report, Vol. I, ch. 6, p. 158",
   highlight=[0.08, 0.54, 0.84, 0.16], cap="\"I consider it to be a dead issue.\"", tone="fear")
sc("a4_16", "The flight director who wrote that was LeRoy Cain. Remember the name. He comes back at the end of this.",
   videoQuery="nasa mission control flight director console headset", motion="slow", tone="melancholy")

json.dump(S, open("scratchpad/columbia_part2.json","w"), indent=1, ensure_ascii=False)
print(f"part 2: {len(S)} scenes")
