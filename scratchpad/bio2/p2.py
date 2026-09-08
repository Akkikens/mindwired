# -*- coding: utf-8 -*-
import json
S = []
def s(**kw): S.append(kw)

# ============ CHAPTER 2 — FIFTY MILES OF GLASS (the wedge) ============
s(id="c2", chapter="THE NUMBER THAT MADE IT SCIENCE", img="b2_lung_1", query="Biosphere 2 Lung interior dome", cap="Chapter two.")
s(id="b1", text="Three point one four acres under glass. Seven million two hundred thousand cubic feet of sealed air. Six thousand five hundred windows. And underneath all of it, a welded stainless steel liner weighing five hundred tons, so that nothing could seep up out of the ground.",
  video="b2_wide_1.mp4", videoQuery="Biosphere 2 glass pyramid ziggurat wide exterior desert",
  stat="6,500 WINDOWS", cap="3.14 acres. Sealed top and bottom.", tone="curiosity")
s(id="b2", text="Inside, five wilderness biomes. A rainforest. An ocean, seven hundred thousand gallons of it, with a coral reef and a machine to make waves. Mangrove wetlands. A savannah. A fog desert.",
  img="b2_ocean_1", query="The Ocean Biosphere 2 coral reef interior", cap="Five wildernesses.", tone="hope")
s(id="b3", text="Plus a farm, and a place for the humans to live.",
  img="b2_agri_1", query="Biosphere 2 agriculture crops interior greenhouse", tone="curiosity")
s(id="b4", text="Roughly four thousand species went in. Most of them collected by the crew themselves, on expeditions to jungles and reefs and deserts. Roy Walford, the crew doctor, later said the place became, in his words, our baby.",
  img="b2_rainforest_1", query="Rainforest Biome Biosphere 2 interior", cap="~4,000 species.", tone="hope")
s(id="b5", text="Now. Here is the number that decides whether any of this was science or theatre, and almost nobody tells you about it.",
  video="b2_glass_2.mp4", videoQuery="sunlight through greenhouse glass panes reflection",
  extraHold=22, tone="tension")
s(id="b6", text="A greenhouse leaks. Every building leaks. The question is how much.",
  img="b2_seal_2", query="industrial silicone caulk seal glazing joint", stock=True, tone="curiosity")
s(id="b7", text="The engineer responsible for the seal was a man named William Dempster. He measured it two separate ways. He pumped the building up to a slight overpressure and watched how fast it sagged. And he spiked the air inside with three gases that do not react with anything, sulphur hexafluoride, helium and krypton, and watched how fast they thinned out.",
  img="b2_tech_1", query="Biosphere 2 technosphere basement machinery pipes", cap="Two independent methods.", tone="curiosity")
s(id="b8", text="Both methods agreed. Biosphere Two leaked less than ten percent of its atmosphere per year.",
  stat="<10% PER YEAR", img="b2_tech_1", query="Biosphere 2 technosphere basement machinery pipes",
  extraHold=20, cap="Under 10% a year.", tone="curiosity")
s(id="b9", text="That number means nothing to you yet. So let me give you Dempster's own way of saying it, from his engineering paper.",
  img="b2_seal_2", query="industrial silicone caulk seal glazing joint", stock=True, tone="tension")
s(id="b10", text="There were about eighty kilometres of caulked glazing joints in that building. About sixteen kilometres of welded seam. Call it fifty miles of sealed glass and ten miles of weld.",
  kinetic={"words": ["Fifty", "miles", "of", "sealed", "glass."]},
  img="b2_glass_4", query="Biosphere 2 Architecture glass space frame",
  source="Dempster, Advances in Space Research 42 (2008)", extraHold=24, tone="curiosity")
s(id="b11", text="And every flaw in all of it, every pinhole, every bad seal, every imperfect weld, added together, came to the equivalent of one single hole about nineteen millimetres across.",
  stat="ONE 19 mm HOLE", kinetic={"words": ["One", "hole.", "Nineteen", "millimetres."]},
  img="b2_glass_4", query="Biosphere 2 Architecture glass space frame", extraHold=28, tone="awe")
s(id="b12", text="Three quarters of an inch. That was the total leak in a building the size of two and a half football fields.",
  video="b2_wide_2.mp4", videoQuery="Biosphere 2 exterior aerial glass domes Arizona", tone="awe")
s(id="b13", text="Hold onto that, because it is the reason there is a story at all.",
  video="b2_glass_3.mp4", videoQuery="condensation on glass greenhouse interior humid", extraHold=20, tone="mystery")
# The lungs
s(id="b14", text="There was a second engineering problem, and the solution to it is the strangest looking thing on the property.",
  img="b2_lung_1", query="Biosphere 2 Lung interior dome", tone="curiosity")
s(id="b15", text="Seal a building this tight and heat it with desert sun, and the air inside expands. It has nowhere to go. Nothing to push against but glass.",
  video="b2_glass_2.mp4", videoQuery="sunlight through greenhouse glass panes reflection", tone="tension")
s(id="b16", text="A wire service reporter put it plainly on the day they sealed it. Otherwise, he wrote, the heat and pressure would burst the glass walls.",
  img="b2_glass_4", query="Biosphere 2 Architecture glass space frame",
  source="UPI, Sept. 26, 1991", cap="It would have burst.", tone="dread")
s(id="b17", text="So they built lungs. Two of them. Enormous domed chambers connected to the main structure by tunnels, each one containing a vast flexible diaphragm that rose and fell as the air inside expanded and contracted.",
  img="b2_lung_2", query="Biosphere 2 Lung dome exterior structure", cap="They built lungs.", tone="awe")
s(id="b18", text="The building breathed. Not as a metaphor. Mechanically, every day, with the sun.",
  img="b2_lung_1", query="Biosphere 2 Lung interior dome", extraHold=24, tone="awe")
s(id="b19", text="And it worked so well that the pressure difference between the inside and the outside of Biosphere Two stayed under eight pascals. About one thousandth of a pound per square inch.",
  stat="±8 PASCALS", img="b2_lung_3", query="Biosphere 2 lung diaphragm mechanism interior",
  cap="A thousandth of a psi.", tone="curiosity")
s(id="b20", text="There is one more detail from the construction that I think about a lot.",
  img="b2_desert_1", query="Desert Zone Biosphere 2 fog desert interior", tone="curiosity")
s(id="b21", text="They built a fog desert inside. It did not stay a desert. Water condensed on the underside of the steel and glass above it and dripped back down, and over time that section drifted toward chaparral, a wetter kind of scrubland.",
  img="b2_desert_1", query="Desert Zone Biosphere 2 fog desert interior", tone="unease")
s(id="b22", text="The building rained on its own desert. Nobody designed that. It is the first hint of the thing this whole story is about, which is that a sealed world does what it wants, not what you drew.",
  video="b2_interior_1.mp4", videoQuery="Biosphere 2 interior rainforest biome under glass",
  extraHold=26, tone="melancholy")
json.dump(S, open('scratchpad/bio2/part2.json','w'), indent=1)
print("part2 scenes:", len(S), "words:", sum(len((x.get('text') or '').split()) for x in S))
