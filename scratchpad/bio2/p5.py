# -*- coding: utf-8 -*-
import json
S = []
def s(**kw): S.append(kw)

# ============ CHAPTER 7 — THE DOCTOR COULDN'T ADD ============
s(id="c7", chapter="THE DOCTOR COULDN'T ADD", img="b2_lab_2", query="medical examination laboratory doctor 1990s", cap="Chapter seven.")
s(id="i1", text="By January nineteen ninety three, sixteen months in, the oxygen inside Biosphere Two had fallen to about fourteen point two percent.",
  stat="14.2% O₂", img="b2_chart_1", query="line graph declining chart scientific data", stock=True,
  extraHold=22, tone="dread")
s(id="i2", text="Roy Walford was the doctor. Sixty seven years old, the oldest person inside by more than twenty years. His job was to monitor everybody else's health.",
  img="b2_lab_2", query="medical examination laboratory doctor 1990s", stock=True, tone="unease")
s(id="i3", text="He was also, it turned out, the most susceptible to the thin air of anyone in the building.",
  img="b2_lab_2", query="medical examination laboratory doctor 1990s", stock=True, tone="dread")
s(id="i4", text="Jane Poynter tells what happened next, and it is the moment this whole story turns from a science experiment into something else.",
  img="b2_crew_2", query="Biosphere 2 biospherians crew portrait", tone="tension")
s(id="i5", text="And one day, she said, he couldn't add up a line of figures.",
  kinetic={"words": ["He", "couldn't", "add", "up", "a", "line", "of", "figures."]},
  img="b2_lab_2", query="medical examination laboratory doctor 1990s", stock=True,
  source="Jane Poynter, TEDxUSC (2009)", extraHold=30, tone="dread")
s(id="i6", text="And it was time for us to put oxygen in.",
  img="b2_lab_2", query="medical examination laboratory doctor 1990s", stock=True, extraHold=24, tone="dread")
s(id="i7", text="The man measuring everyone else's decline was the instrument that finally registered it. He disqualified himself from duty. He could not do arithmetic.",
  img="b2_paper_2", query="handwritten column of figures numbers page", stock=True, tone="melancholy")
s(id="i8", text="On a winter night in January nineteen ninety three, they broke the seal on purpose.",
  video="b2_door_1.mp4", videoQuery="heavy steel airlock door closing industrial", tone="tension")
s(id="i9", text="Between day four hundred and seventy five and day four hundred and ninety four of the closure, pure oxygen was pumped into Biosphere Two from the outside world.",
  stat="DAYS 475–494", img="b2_tech_1", query="Biosphere 2 technosphere basement machinery pipes",
  source="Dempster, Ecological Engineering 13 (1999)", tone="curiosity")
s(id="i10", text="Nineteen days of it. Not a single dramatic moment, whatever you have read. A slow, deliberate, engineered rescue of a building's atmosphere.",
  img="b2_tech_1", query="Biosphere 2 technosphere basement machinery pipes", tone="curiosity")
s(id="i11", text="Mark Nelson wrote about the moment they opened the door between their world and the fresh air on the other side.",
  img="b2_crew_1", query="Biosphere 2 crew biospherians 1991", tone="hope")
s(id="i12", text="We left a world with an oxygen level around fourteen percent, he wrote. Equivalent to being on a fifteen thousand foot mountain. In fact, we were at a three thousand nine hundred foot elevation in southern Arizona.",
  img="b2_mountain_1", query="mountaineer high altitude thin air summit", stock=True,
  source="Mark Nelson, Pushing Our Limits (2018)", tone="melancholy")
s(id="i13", text="Oxygen had been slowly disappearing for sixteen months. No one knew where it had gone. We were slowly climbing a mountain, but going nowhere.",
  kinetic={"words": ["Climbing", "a", "mountain,", "going", "nowhere."]},
  img="b2_mountain_1", query="mountaineer high altitude thin air summit", stock=True, extraHold=28, tone="melancholy")
s(id="i14", text="And then, when the air came in. In minutes, we felt decades younger. For the first time in many months, I heard the sound of running feet.",
  kinetic={"words": ["The", "sound", "of", "running", "feet."]},
  video="b2_interior_1.mp4", videoQuery="Biosphere 2 interior rainforest biome under glass",
  extraHold=30, tone="hope")

# ============ CHAPTER 8 — THE PAYOFF: IN THE WALLS ============
s(id="c8", chapter="IN THE WALLS", img="b2_concrete_1", query="bare concrete wall texture industrial", cap="Chapter eight.")
s(id="j1", text="So where did seven tons of oxygen go, inside a building that leaked the equivalent of one three quarter inch hole?",
  img="b2_concrete_1", query="bare concrete wall texture industrial", stock=True, tone="mystery")
s(id="j2", text="The obvious answer had been on the table from the beginning, and it had been ruled out, and the reason it was ruled out is the single most interesting thing in this entire story.",
  img="b2_soil_1", query="dark rich soil organic matter close up", stock=True, tone="tension")
s(id="j3", text="Here is the obvious answer. Soil is alive. It is full of microbes, and microbes breathe. They take in oxygen and organic matter and they give off carbon dioxide, exactly the way you do.",
  img="b2_soil_1", query="dark rich soil organic matter close up", stock=True, tone="curiosity")
s(id="j4", text="And the designers of Biosphere Two had deliberately packed their soils with organic matter, because they wanted the farm to be fertile. They wanted things to grow.",
  img="b2_agri_1", query="Biosphere 2 agriculture crops interior greenhouse", tone="curiosity")
s(id="j5", text="So the soil microbes had an enormous banquet, and they ate it, and they breathed while they did. Respiration outran photosynthesis. The building's soil was eating its air.",
  img="b2_soil_1", query="dark rich soil organic matter close up", stock=True, tone="dread")
s(id="j6", text="Simple. Obvious. And provably wrong, because of one number.",
  extraHold=22, img="b2_chart_1", query="line graph declining chart scientific data", stock=True, tone="tension")
s(id="j7", text="Respiration is a one for one trade. Every molecule of oxygen that goes in comes back out as a molecule of carbon dioxide. If the soil had eaten seven tons of oxygen, the carbon dioxide inside that sealed building should have gone through the roof.",
  img="b2_chem_1", query="chemical equation chalkboard chemistry formula", stock=True, tone="curiosity")
s(id="j8", text="It didn't.",
  kinetic={"words": ["It", "didn't."]}, img="b2_chart_1", query="line graph declining chart scientific data",
  stock=True, extraHold=28, tone="mystery")
s(id="j9", text="Dempster wrote it down plainly. The obvious explanation of loss to respiration was not evident, he wrote, because the implied increase of carbon dioxide did not occur. And furthermore, the atmospheric volume of Biosphere Two was shrinking.",
  img="b2_paper_1", query="scientific journal paper printed pages", stock=True,
  source="Dempster, Ecological Engineering 13 (1999)", tone="mystery")
s(id="j10", text="So the mystery was never really that oxygen was vanishing. The mystery was that carbon dioxide was not appearing to match it. Two gases should have moved together. One of them didn't show up.",
  kinetic={"words": ["One", "of", "them", "didn't", "show", "up."]},
  img="b2_chem_1", query="chemical equation chalkboard chemistry formula", stock=True, extraHold=26, tone="mystery")
s(id="j11", text="Which meant something inside that building was taking the carbon dioxide out of the air as fast as the soil was making it. Silently. Without a machine. Without anybody noticing.",
  img="b2_concrete_1", query="bare concrete wall texture industrial", stock=True, tone="dread")
s(id="j12", text="They brought in outside help. Wallace Broecker, one of the most important geochemists of the twentieth century, the man who put the phrase global warming into the scientific literature. And a young researcher named Jeffrey Severinghaus.",
  img="b2_scientist_1", query="geochemist laboratory isotope mass spectrometer", stock=True, tone="curiosity")
s(id="j13", text="And they did something clever. They went looking for the carbon by its fingerprint.",
  img="b2_scientist_1", query="geochemist laboratory isotope mass spectrometer", stock=True, tone="tension")
s(id="j14", text="Carbon comes in different weights. Carbon twelve and carbon thirteen. And living things are slightly fussy. When a plant or a microbe processes carbon, it prefers the lighter one, which leaves a measurable signature behind.",
  img="b2_chem_1", query="chemical equation chalkboard chemistry formula", stock=True, tone="curiosity")
s(id="j15", text="So carbon that has been through something alive is isotopically different from carbon that hasn't. It is a tag. And it does not wash off.",
  img="b2_scientist_1", query="geochemist laboratory isotope mass spectrometer", stock=True, tone="curiosity")
s(id="j16", text="They measured the isotopes in the atmosphere. In the biomass. In the scrubber's output. And then in the concrete.",
  img="b2_concrete_1", query="bare concrete wall texture industrial", stock=True, extraHold=22, tone="tension")
s(id="j17", text="Biosphere Two had fifteen thousand eight hundred square metres of exposed, unsealed concrete inside it. Foundations, walls, structure. And concrete, when it is young, is not inert. It cures. It reacts.",
  img="b2_concrete_2", query="concrete curing wall surface texture close", stock=True, tone="dread")
s(id="j18", text="Calcium oxide in the concrete pulls carbon dioxide straight out of the air and locks it up as calcium carbonate. As limestone. Permanently.",
  img="b2_concrete_2", query="concrete curing wall surface texture close", stock=True, tone="dread")
s(id="j19", text="And when they measured the carbon locked inside that concrete, it carried the isotopic signature of something that had been alive.",
  extraHold=28, img="b2_concrete_1", query="bare concrete wall texture industrial", stock=True, tone="awe")
s(id="j20", text="The inner surfaces held roughly ten times the calcium carbonate of the outer ones. Somewhere between six hundred and seven hundred and fifty kilomoles of carbon dioxide. On the order of twenty five tons of it. Sitting in the walls.",
  stat="~25 TONS IN THE WALLS", img="b2_concrete_2", query="concrete curing wall surface texture close", stock=True,
  source="Severinghaus et al., Eos 75(3):33–37 (1994)", extraHold=26, tone="awe")
s(id="j21", text="That is the answer. The soil microbes ate the oxygen, exactly as anyone would have guessed on day one. And then the building's own concrete quietly ate the evidence.",
  kinetic={"words": ["The", "building", "ate", "the", "evidence."]},
  img="b2_concrete_1", query="bare concrete wall texture industrial", stock=True, extraHold=30, tone="awe")
s(id="j22", text="Two chemical reactions, running in sequence, in a place where nobody was looking. One of them famous, one of them so boring that it happens on every construction site on Earth, every day, and nobody thinks about it once.",
  video="b2_glass_1.mp4", videoQuery="Biosphere 2 space frame glazing lattice interior looking up", tone="melancholy")
s(id="j23", text="Eight people nearly suffocated because their house was still drying.",
  kinetic={"words": ["Their", "house", "was", "still", "drying."]},
  img="b2_concrete_2", query="concrete curing wall surface texture close", stock=True, extraHold=30, tone="melancholy")
json.dump(S, open('scratchpad/bio2/part5.json','w'), indent=1)
print("part5 scenes:", len(S), "words:", sum(len((x.get('text') or '').split()) for x in S))
