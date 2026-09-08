# -*- coding: utf-8 -*-
import json
S = []
def s(**kw): S.append(kw)

# ============ CHAPTER 3 — EIGHT PEOPLE, TWO YEARS ============
s(id="c3", chapter="WHAT THEY ATE", img="b2_kitchen_1", query="Kitchen Biosphere 2 residents interior", cap="Chapter three.")
s(id="d1", text="Eight people. Four women, four men, a split chosen deliberately after looking at how Antarctic bases and submarine crews hold together.",
  img="b2_crew_1", query="Biosphere 2 crew biospherians 1991", cap="Four women. Four men.", tone="curiosity")
s(id="d2", text="Roy Walford, sixty seven, the doctor. Abigail Alling, thirty one, marine biologist, first through the door. Mark Nelson, forty four, wastewater and wetlands. Linda Leigh, thirty nine, botanist.",
  img="b2_crew_1", query="Biosphere 2 crew biospherians 1991", tone="curiosity")
s(id="d3", text="Taber MacCallum, twenty seven, running the analytical chemistry lab. Jane Poynter, twenty nine, farm manager. Sally Silverstone, thirty six, co captain and tropical agriculture. Mark Van Thillo, thirty, technical systems.",
  img="b2_crew_2", query="Biosphere 2 biospherians crew portrait", tone="curiosity")
s(id="d4", text="Their job was to grow their own food inside two thousand square metres of farm. On paper it worked. Over the full two years they averaged about two thousand two hundred calories a day each.",
  img="b2_agri_1", query="Biosphere 2 agriculture crops interior greenhouse", tone="hope")
s(id="d5", text="On paper.",
  img="b2_agri_2", query="banana leaves lemon tree greenhouse interior", extraHold=20, tone="unease")
s(id="d6", text="In the first six months the crops failed and the real number was one thousand seven hundred and eighty calories a day.",
  stat="1,780 CAL/DAY", img="b2_agri_2", query="banana leaves lemon tree greenhouse interior",
  source="Walford et al., PNAS 89:11533 (1992)", cap="First six months.", tone="dread")
s(id="d7", text="Broad mites got into the crops. Root knot nematodes got into the soil. And the two years they had chosen happened to land on back to back El Niño years, so the sky over Arizona was cloudier than the building had been designed for.",
  img="b2_agri_3", query="crop pests mites plant damage agriculture", stock=True, tone="tension")
s(id="d8", text="Less light. Less food. Mark Nelson went in at a hundred and forty seven pounds and bottomed out at a hundred and seventeen. Taber MacCallum lost forty six pounds in six months.",
  stat="−46 LB IN 6 MONTHS", img="b2_crew_2", query="Biosphere 2 biospherians crew portrait", tone="dread")
s(id="d9", text="Across the full two years the crew lost about seventeen percent of their body weight.",
  img="b2_kitchen_1", query="Kitchen Biosphere 2 residents interior",
  source="Walford et al., J Gerontol 57(6):B211 (2002)", tone="dread")
s(id="d10", text="Nelson wrote about it afterwards. We experienced hunger throughout the two years, he wrote, and plates were always licked clean. And then this. I and many others ate our roasted peanuts whole, shell and all. We would eat anything to fill the stomach void.",
  img="b2_kitchen_2", query="empty plates table kitchen interior", stock=True,
  source="Mark Nelson, Pushing Our Limits (2018)", cap="“Shell and all.”", extraHold=24, tone="melancholy")
s(id="d11", text="On the day they came out, a reporter asked him about it. Nelson said the hardest thing was that hunger was a constant, nagging presence. He said it was hard even to watch a movie, because he kept focusing on what the actors were eating.",
  img="b2_kitchen_2", query="empty plates table kitchen interior", stock=True,
  source="Arizona Daily Star, Sept. 27, 1993", extraHold=22, tone="melancholy")
s(id="d12", text="Jane Poynter said it took her four months to make a pizza. She had to grow the wheat, and thresh it, and feed and milk the goats for the cheese.",
  img="b2_agri_1", query="Biosphere 2 agriculture crops interior greenhouse", tone="melancholy")
s(id="d13", text="They ate so many sweet potatoes that their palms turned orange with beta carotene. Coffee was rationed to about one cup, per person, every few weeks.",
  img="b2_agri_2", query="banana leaves lemon tree greenhouse interior", tone="unease")
# Walford conflict
s(id="d14", text="And now the uncomfortable part, and I want to lay it out fairly because the man at the centre of it is dead and cannot answer.",
  img="b2_lab_2", query="medical examination laboratory doctor 1990s", stock=True, tone="unease")
s(id="d15", text="Roy Walford was the crew's only physician. He was also, at that time, the most prominent researcher in the world on the idea that eating substantially less food extends human lifespan. He had founded the Calorie Restriction Society. He had been on that diet himself for years.",
  img="b2_lab_2", query="medical examination laboratory doctor 1990s", stock=True,
  cap="The doctor was a caloric-restriction researcher.", tone="tension")
s(id="d16", text="The crew's daily food allotments were planned using Walford's own diet planning computer program. That is stated plainly in a paper written by two of the crew.",
  img="b2_lab_2", query="medical examination laboratory doctor 1990s", stock=True,
  source="Silverstone & Nelson, Adv. Space Res. (1995)", tone="dread")
s(id="d17", text="And when the farm failed and the calories fell, he published the crew as research subjects. Twice. In the Proceedings of the National Academy of Sciences, and in a gerontology journal.",
  img="b2_paper_1", query="scientific journal paper printed pages", stock=True, tone="dread")
s(id="d18", text="The mission's biggest failure became his dataset.",
  kinetic={"words": ["became", "his", "dataset."]},
  img="b2_paper_1", query="scientific journal paper printed pages", stock=True, extraHold=26, tone="dread")
s(id="d19", text="Walford knew exactly how that looked. He said so himself, unprompted.",
  img="b2_lab_2", query="medical examination laboratory doctor 1990s", stock=True, tone="unease")
s(id="d20", text="I think if there had been any other nutritionist or physician, he said, they would have freaked out and said, we're starving. But I knew we were actually on a program of health enhancement.",
  img="b2_lab_2", query="medical examination laboratory doctor 1990s", stock=True,
  cap="“I knew we were on a program of health enhancement.”", extraHold=24, tone="unease")
s(id="d21", text="You can read that two ways and both readings are honest. The experiment's worst failure and the doctor's life's work happened to point in the same direction, and he was the only person inside qualified to make the call.",
  img="b2_crew_2", query="Biosphere 2 biospherians crew portrait", tone="melancholy")
s(id="d22", text="For what it is worth, his own follow up paper concluded that all eight of them came out in excellent health. That is also on the record.",
  img="b2_crew_1", query="Biosphere 2 crew biospherians 1991", extraHold=20, tone="melancholy")

# ============ CHAPTER 4 — THE DIE-OFF ============
s(id="c4", chapter="THE THING NOBODY INVITED", img="b2_ant_1", query="crazy ant Paratrechina longicornis macro", cap="Chapter four.")
s(id="e1", text="While the humans were getting thinner, the sealed world was doing something worse.",
  img="b2_rainforest_1", query="Rainforest Biome Biosphere 2 interior", tone="dread")
s(id="e2", text="Of twenty five small vertebrate species they put inside, nineteen went extinct.",
  stat="19 OF 25 EXTINCT", img="b2_mangrove_1", query="Mangroves Biosphere 2 interior wetland",
  source="Cohen & Tilman, Science 274:1150 (1996)", tone="dread")
s(id="e3", text="And every single pollinating insect species died.",
  kinetic={"words": ["Every", "pollinator.", "Gone."]},
  img="b2_rainforest_1", query="Rainforest Biome Biosphere 2 interior", extraHold=28, tone="dread")
s(id="e4", text="Think about what that means in a building where the humans have to grow their own food. The flowering plants inside Biosphere Two could no longer reproduce on their own. In a sealed world, that is a countdown.",
  img="b2_agri_1", query="Biosphere 2 agriculture crops interior greenhouse", tone="dread")
s(id="e5", text="What thrived instead was a species nobody had invited.",
  img="b2_ant_1", query="crazy ant Paratrechina longicornis macro", tone="unease")
s(id="e6", text="When they surveyed the site in nineteen ninety and ninety one, before closure, no ant species was dominant, and one particular ant, the longhorn crazy ant, was not present at all. Not one. It got in as a stowaway.",
  img="b2_ant_1", query="crazy ant Paratrechina longicornis macro",
  source="Wetterer et al., Florida Entomologist 82(3) (1999)", cap="It wasn't on the list.", tone="tension")
s(id="e7", text="By nineteen ninety six, more than ninety nine point nine percent of every ant that came to a bait station inside Biosphere Two was that one species.",
  stat="99.9% ONE SPECIES", img="b2_ant_2", query="ants swarming colony macro insects", stock=True,
  extraHold=26, tone="dread")
s(id="e8", text="They did it by farming. The ants tended enormous populations of sap sucking insects on the plants and lived off the honeydew those insects produced. A closed loop, inside a closed world, that nobody planned.",
  img="b2_ant_2", query="ants swarming colony macro insects", stock=True, tone="unease")
s(id="e9", text="Alongside them, cockroaches, which had been deliberately introduced to break down dead material, and which also ran away with the place.",
  img="b2_roach_1", query="cockroach macro insect detritus", stock=True, tone="unease")
s(id="e10", text="The scientists who later wrote the most damning assessment of the whole project described what was left inside as crazy ants running everywhere, together with scattered cockroaches and katydids.",
  img="b2_ant_2", query="ants swarming colony macro insects", stock=True,
  source="Cohen & Tilman, Science 274:1150 (1996)", extraHold=22, tone="melancholy")
json.dump(S, open('scratchpad/bio2/part3.json','w'), indent=1)
print("part3 scenes:", len(S), "words:", sum(len((x.get('text') or '').split()) for x in S))
