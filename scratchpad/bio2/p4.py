# -*- coding: utf-8 -*-
import json
S = []
def s(**kw): S.append(kw)

# ============ CHAPTER 5 — THE AIR STARTS GOING ============
s(id="c5", chapter="THE AIR STARTS GOING", img="b2_lab_1", query="scientist analytical laboratory glassware testing air samples", cap="Chapter five.")
s(id="f1", text="Taber MacCallum ran the analytical chemistry lab inside. Every day, he measured the air.",
  img="b2_lab_1", query="scientist analytical laboratory glassware testing air samples", tone="curiosity")
s(id="f2", text="Normal air is twenty point nine percent oxygen. That is what they sealed in with, on the twenty sixth of September, nineteen ninety one.",
  stat="20.9% O₂", video="b2_glass_1.mp4", videoQuery="Biosphere 2 space frame glazing lattice interior looking up", tone="curiosity")
s(id="f3", text="Five months later it was eighteen percent.",
  stat="18% — 5 MONTHS IN", img="b2_lab_1", query="scientist analytical laboratory glassware testing air samples",
  extraHold=24, tone="dread")
s(id="f4", text="That is not a slow drift. That is a cliff. And it is the part of this story that almost never gets told, because everyone jumps straight to the famous number at the end.",
  img="b2_chart_1", query="line graph declining chart scientific data", stock=True, tone="tension")
s(id="f5", text="Then the fall slowed down. And kept going. Month after month, for over a year, roughly a hundred and forty parts per million of oxygen disappearing every single day.",
  stat="~140 PPM/DAY", img="b2_chart_1", query="line graph declining chart scientific data", stock=True, tone="dread")
s(id="f6", text="Now remember the seal. Fifty miles of glass joint, ten miles of weld, one nineteen millimetre hole's worth of leak in the whole building.",
  video="b2_glass_2.mp4", videoQuery="sunlight through greenhouse glass panes reflection", tone="tension")
s(id="f7", text="The oxygen was not escaping. It could not escape. It was disappearing inside a sealed box, and the same measurement that proved it was disappearing also proved it had nowhere to go.",
  kinetic={"words": ["It", "had", "nowhere", "to", "go."]},
  video="b2_glass_3.mp4", videoQuery="condensation on glass greenhouse interior humid", extraHold=28, tone="mystery")
s(id="f8", text="And there is a cruel piece of physics in here that I need you to understand, because it is why this got dangerous rather than just strange.",
  img="b2_habitat_1", query="Crew Quarters Biosphere 2 living space", tone="unease")
s(id="f9", text="When you climb a mountain, the oxygen percentage stays the same. What drops is the pressure. Your body knows how to respond to that. Over weeks it makes more red blood cells. You acclimatise.",
  img="b2_mountain_1", query="mountaineer high altitude thin air summit", stock=True, tone="curiosity")
s(id="f10", text="Inside Biosphere Two the pressure never dropped. The lungs saw to that. Only the oxygen fraction fell.",
  img="b2_lung_1", query="Biosphere 2 Lung interior dome", tone="dread")
s(id="f11", text="So their bodies never got the signal. They were living at the equivalent of thirteen to fifteen thousand feet, and they could not adapt to it, because as far as their physiology was concerned they were still at three thousand eight hundred feet in Arizona.",
  stat="≈14,000 FT OF AIR", img="b2_mountain_1", query="mountaineer high altitude thin air summit", stock=True,
  extraHold=24, tone="dread")
s(id="f12", text="They started developing sleep apnoea. Waking in the night gasping, because their blood chemistry had changed.",
  img="b2_habitat_1", query="Crew Quarters Biosphere 2 living space", tone="dread")
s(id="f13", text="So they ran oxygen lines from the analytical laboratory to the bedrooms, and slept breathing supplemented air, inside the sealed world that was supposed to make its own.",
  img="b2_habitat_2", query="oxygen line medical tubing bedroom", stock=True,
  cap="Oxygen lines to the bedrooms.", extraHold=26, tone="dread")
s(id="f14", text="Jane Poynter described what those months were like. We were dragging ourselves around the Biosphere, she said. And everybody outside thought we were dying. The media was making it sound like we were dying. And I had to call up my mother every other day saying, no, Mum, it's fine. We're not dead.",
  img="b2_crew_2", query="Biosphere 2 biospherians crew portrait",
  source="Jane Poynter, TEDxUSC (2009)", extraHold=22, tone="melancholy")
s(id="f15", text="And she gave it the name that stuck. It was like playing atomic hide and seek, she said. We had lost seven tons of oxygen. And we had no clue where it was.",
  kinetic={"words": ["Atomic", "hide", "and", "seek."]},
  img="b2_crew_2", query="Biosphere 2 biospherians crew portrait", extraHold=28, tone="mystery")

# ============ CHAPTER 6 — MID-VIDEO RE-HOOK: the seal was never a seal ============
s(id="c6", chapter="THE SEAL WAS NEVER A SEAL", img="b2_door_3", query="Biosphere 2 airlock door entrance", cap="Chapter six.")
s(id="g1", text="While the oxygen was vanishing, the project's credibility was doing the same thing, and for entirely separate reasons.",
  img="b2_door_3", query="Biosphere 2 airlock door entrance", tone="tension")
s(id="g2", text="About twelve days into the mission, Jane Poynter was feeding rice into a threshing machine on the farm and it took off the tip of the middle finger of her left hand.",
  img="b2_agri_3", query="crop pests mites plant damage agriculture", stock=True,
  stat="DAY 12", cap="A rice thresher.", tone="dread")
s(id="g3", text="Walford reattached it inside. It failed. So on the eleventh of October, nineteen ninety one, sixteen days into a two year sealed mission, they opened the airlock and Jane Poynter walked out to a hospital.",
  img="b2_door_3", query="Biosphere 2 airlock door entrance", extraHold=22, tone="dread")
s(id="g4", text="She came back the same day. Out for a few hours. She lost the fingertip anyway.",
  img="b2_door_3", query="Biosphere 2 airlock door entrance", tone="melancholy")
s(id="g5", text="And that, on its own, would have been a footnote. A medical emergency, handled, disclosed, move on.",
  img="b2_hero", query="Biosphere 2 Arizona glass structure", tone="unease")
s(id="g6", text="Except they did not disclose it. Not for almost three months. The public did not learn that the seal had been broken until the fourth of January, nineteen ninety two.",
  stat="DISCLOSED 3 MONTHS LATE", img="b2_press_1", query="press conference microphones 1990s reporters", stock=True,
  extraHold=24, tone="dread")
s(id="g7", text="And when she came back through that airlock, she carried a duffel bag in with her. What was inside it has never been settled, and I am going to give you all three versions, because all three of those people are alive.",
  img="b2_bag_1", query="duffel bag canvas holdall", stock=True, tone="tension")
s(id="g8", text="The company's own inventory said the bag held plastic bags, two reference books, maps showing where plants were, colour film, hydrochloric acid and spare computer parts.",
  img="b2_bag_1", query="duffel bag canvas holdall", stock=True, cap="Version one: the company.", tone="curiosity")
s(id="g9", text="Poynter's own account is that it held nothing of substance. Some circuit boards, she said, and a planting plan for the rain forest.",
  img="b2_crew_2", query="Biosphere 2 biospherians crew portrait", cap="Version two: Poynter.", tone="curiosity")
s(id="g10", text="And then there is the allegation. A filmmaker named Louis Hawthorne, who had spent weeks on the site during preparation, told the Associated Press that his sources among the staff described two bags containing steel fittings, hydrochloric acid, and a handful of lead wire airlock tamper indicators.",
  img="b2_bag_1", query="duffel bag canvas holdall", stock=True,
  source="AP, Feb. 2, 1992", cap="Version three: the allegation.", tone="dread")
s(id="g11", text="The tamper indicators are the seals fitted to the outside of the doors. They are the physical proof that nobody has gone in or out.",
  img="b2_seal_3", query="lead wire security seal tamper indicator", stock=True, extraHold=24, tone="dread")
s(id="g12", text="The company's spokesman called that claim patently ridiculous. I have no way to settle it and neither does anyone else. What I can tell you is that all three accounts include the hydrochloric acid, and they differ on everything that matters.",
  img="b2_bag_1", query="duffel bag canvas holdall", stock=True, tone="unease")
s(id="g13", text="But the bag is not what broke them. This is.",
  img="b2_tech_2", query="industrial chemical scrubber tank machinery", stock=True, extraHold=20, tone="tension")
s(id="g14", text="On the nineteenth of December, nineteen ninety one, the project acknowledged that it had installed a carbon dioxide scrubber inside Biosphere Two, and had not told anybody.",
  stat="DEC 19, 1991", img="b2_tech_2", query="industrial chemical scrubber tank machinery", stock=True,
  cap="An undisclosed scrubber.", tone="dread")
s(id="g15", text="A machine that pulled carbon dioxide out of the air by blowing it through a falling curtain of sodium hydroxide solution. In a world that was supposed to be balancing its own atmosphere with plants.",
  img="b2_tech_2", query="industrial chemical scrubber tank machinery", stock=True, tone="dread")
s(id="g16", text="On the same day, they also disclosed that six hundred thousand cubic feet of outside air had been pumped in to replace air that had leaked out.",
  img="b2_tech_1", query="Biosphere 2 technosphere basement machinery pipes", extraHold=22, tone="dread")
s(id="g17", text="That is the moment the press turned, and it never turned back. And I want to give the project its answer, because it does have one, and it is in the peer reviewed record.",
  img="b2_press_1", query="press conference microphones 1990s reporters", stock=True, tone="unease")
s(id="g18", text="The scrubber was not a last minute panic. It was designed in from the start, in anticipation of the seasonal swing between photosynthesis in summer and respiration in winter. And crucially, it was designed to be reversible.",
  img="b2_tech_2", query="industrial chemical scrubber tank machinery", stock=True, tone="curiosity")
s(id="g19", text="There was a furnace, whose job was to bake the captured carbon back out again in the summer and return it to the air, closing the loop.",
  img="b2_furnace_1", query="industrial electric furnace heating element", stock=True, tone="curiosity")
s(id="g20", text="Its heating elements failed. The loop was never closed. Across the entire two years, that furnace never once did the job it existed to do.",
  kinetic={"words": ["The", "furnace", "failed."]},
  img="b2_furnace_1", query="industrial electric furnace heating element", stock=True, extraHold=26, tone="melancholy")
s(id="g21", text="So which is it? A cover up, or a broken machine that a suspicious press found at the worst possible moment?",
  img="b2_hero", query="Biosphere 2 Arizona glass structure", tone="unease")
s(id="g22", text="Here is the fact that settles what it meant, if not what it was. That scrubber removed about ninety eight kilomoles of carbon dioxide. Around four point three tons.",
  stat="~4.3 TONS", img="b2_tech_2", query="industrial chemical scrubber tank machinery", stock=True, tone="curiosity")
s(id="g23", text="Set against the amount of oxygen that had gone missing, that accounted for almost nothing. Something like one and a half percent of the atmospheric carbon.",
  img="b2_chart_1", query="line graph declining chart scientific data", stock=True, tone="tension")
s(id="g24", text="Whatever the scrubber was, it was not where the oxygen went. The mystery was still completely open. And the crew had thirteen months of it left to live through.",
  video="b2_interior_1.mp4", videoQuery="Biosphere 2 interior rainforest biome under glass",
  extraHold=26, tone="mystery")
json.dump(S, open('scratchpad/bio2/part4.json','w'), indent=1)
print("part4 scenes:", len(S), "words:", sum(len((x.get('text') or '').split()) for x in S))
