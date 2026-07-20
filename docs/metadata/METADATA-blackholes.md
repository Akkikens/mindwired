# METADATA — Every Type of Black Hole, Explained (blackholes)

**Channel:** mindwired · **File:** `Every Type of Black Hole, Explained.mp4` (also `out/mindwired_blackholes.mp4`) · **Comp:** `BlackHolesDoc`
**Format:** new flat 2D icon-grid visual system (`src/mindwired-doc/BlackHoleIcons.tsx`, diagram key `bhicon`) — first mindwired video in this style, forked off the archival-doc engine rather than the WebGL cosmic engine.
**Icahn validation:** see memory `icahn-scary-space-niche` and this session's live pass — Bluntly Explained's "Every Type Of Black Hole Explained in 11 Minutes" (18.5K subs) pulled 1.2M views, a 65:1 ratio, using this exact chapter-list format; Mr. Ask / All Types Explained's "Every Planet in the Solar System Explained" (1.56K subs) pulled 97K views, 62:1, same "Every X Explained" structure.

## Title

**PRIMARY:** Every Type of Black Hole, Explained
  (carries the exact search phrase behind the 65:1 outlier this format is based on.)
- **ALT A (ranked/listicle framing):** 13 Types of Black Hole, Ranked From Smallest to Terrifying
- **ALT B (curiosity-gap, leads with the anomaly):** The Black Hole That, By the Math, Shouldn't Exist

Use YouTube Test & Compare once eligible; PRIMARY should pair with a flat-icon
thumbnail (accretion-disk silhouette + bold yellow type) to signal the new visual
identity rather than reusing the 3D cosmic-engine thumbnail style.

## Description

```
Some black holes are smaller than a single atom. Others outweigh four billion suns. And by the math, at least one type of black hole shouldn't exist at all. This is every known type of black hole in the universe, explained — from the smallest theoretical object physics allows to the true giants anchoring the largest galaxies ever observed.

Black holes are not one object — they're an entire family, sorted by size, by origin, and by how violently they feed:

• PLANCK BLACK HOLE — the smallest object physics allows to exist, at the exact point where gravity and quantum mechanics stop agreeing
• PRIMORDIAL BLACK HOLE — may have formed less than a second after the Big Bang, a leading suspect for dark matter itself
• MICRO BLACK HOLE — lighter than a mountain, evaporating via Hawking radiation almost the instant it forms
• STELLAR MASS BLACK HOLE — born when a massive star collapses; the Milky Way alone may hold a hundred million of them
• X-RAY BINARY BLACK HOLE — paired with a living star, stripping gas off its surface and screaming out X-rays we can detect from Earth
• ROGUE BLACK HOLE — ejected from its home galaxy entirely, drifting invisibly through intergalactic space
• BINARY BLACK HOLE — two black holes locked in a death spiral, releasing more energy in their final collision than every star in the observable universe combined
• INTERMEDIATE-MASS BLACK HOLE — the long-elusive "missing link," only confirmed in the last few years
• SUPERMASSIVE BLACK HOLE — anchors nearly every large galaxy, including our own (Sagittarius A*)
• QUASAR — a supermassive black hole caught in the act of feeding, outshining its entire host galaxy
• BLAZAR — that same feeding black hole, with a jet aimed almost directly at Earth
• ULTRAMASSIVE BLACK HOLE — tens of billions of solar masses; TON 618's event horizon alone is bigger than our solar system
• NAKED SINGULARITY — a theoretical black hole with no event horizon at all, a type physicists suspect nature simply forbids

CHAPTERS
0:00 — Cold open: the smallest and largest black holes in the universe
0:37 — Chapter 1: The Planck Black Hole
1:06 — Chapter 2: Primordial Black Holes
1:33 — Chapter 3: Micro Black Holes
2:01 — Chapter 4: Stellar Mass Black Holes
2:25 — Chapter 5: X-Ray Binary Black Holes
2:55 — Chapter 6: Rogue Black Holes
3:20 — Chapter 7: Binary Black Holes
3:48 — Chapter 8: Intermediate-Mass Black Holes
4:14 — Chapter 9: Supermassive Black Holes
4:40 — Chapter 10: Quasars
5:04 — Chapter 11: Blazars
5:28 — Chapter 12: Ultramassive Black Holes
5:54 — Chapter 13: Naked Singularities
6:25 — Closing thoughts

Based on established astrophysics (general relativity, Hawking radiation theory, and confirmed LIGO/Virgo gravitational-wave detections for black hole mergers). Intermediate-mass and primordial black holes remain unconfirmed / actively researched categories — the video says so explicitly rather than overstating certainty.

▶ MORE FROM MINDWIRED
The Lost Cosmonauts the USSR Pretended Never Existed → https://youtu.be/Hs6ZzZAQ7ms
21 Astronauts Never Came Home. Here's Every Story. → https://youtu.be/maxZwNGqIDU
THE END OF THE UNIVERSE: A Journey to the Last Moment → https://youtu.be/mJHk_dpUseI
Full playlist: https://www.youtube.com/playlist?list=PLSGw_l2_Tsdo
Subscribe: https://www.youtube.com/@Mindwiredd?sub_confirmation=1

#BlackHole #Space #Astrophysics #Universe #Cosmology #Quasar #Supermassive #SpaceDocumentary #Science #Physics #Singularity #DarkMatter #SpaceFacts #Cosmic #Mindwired
```

(NOTE: the mindwired channel handle has not been independently re-verified this
session — memory `mindwired-published-urls` flags the outro art shows "@MINDWIREDD"
while Studio shows display name "Mindwired." Confirm the live @handle before
publishing rather than trusting the deep-link above as-is.)

## Chapters timestamp script

```python
import json
m = json.load(open('src/mindwired-doc/docs/blackholes.manifest.json'))
d = json.load(open('src/mindwired-doc/docs/blackholes.json'))
LEAD, HOLD, FPS = 10, 24, 30
marks = {
    'c1': 'Chapter 1: The Planck Black Hole', 'c2': 'Chapter 2: Primordial Black Holes',
    'c3': 'Chapter 3: Micro Black Holes', 'c4': 'Chapter 4: Stellar Mass Black Holes',
    'c5': 'Chapter 5: X-Ray Binary Black Holes', 'c6': 'Chapter 6: Rogue Black Holes',
    'c7': 'Chapter 7: Binary Black Holes', 'c8': 'Chapter 8: Intermediate-Mass Black Holes',
    'c9': 'Chapter 9: Supermassive Black Holes', 'c10': 'Chapter 10: Quasars',
    'c11': 'Chapter 11: Blazars', 'c12': 'Chapter 12: Ultramassive Black Holes',
    'c13': 'Chapter 13: Naked Singularities', 'z1': 'Closing thoughts',
}
f = 0
for s in d['scenes']:
    if s['id'] in marks:
        t = f // 30
        print(f"{t//60}:{t%60:02d} — {marks[s['id']]}")
    dur = m['durations'].get(s['id']) or len(s.get('text', '').split()) / 2.3
    f += LEAD + round(dur * FPS) + HOLD
```

## Tags (496 chars, 31 tags)

```
black hole,black holes explained,every type of black hole,types of black holes,supermassive black hole,quasar,blazar,naked singularity,primordial black hole,micro black hole,stellar black hole,intermediate mass black hole,ultramassive black hole,rogue black hole,binary black hole,x-ray binary,hawking radiation,event horizon,sagittarius a star,ton 618,space documentary,astrophysics,cosmology,dark matter,ligo,general relativity,universe explained,space facts,scariest black hole,space,mindwired
```

## Hashtags (15)

#BlackHole #Space #Astrophysics #Universe #Cosmology #Quasar #Supermassive #SpaceDocumentary #Science #Physics #Singularity #DarkMatter #SpaceFacts #Cosmic #Mindwired

## Pinned comment

```
The one that should genuinely unsettle you isn't the biggest one — it's the last one in the video. A naked singularity would break general relativity's own rules, and nobody has proven it's actually impossible. Which type surprised you most: the ones smaller than a proton, or the ones bigger than our whole solar system?
```

## Category / license

Category: Science & Technology · License: Standard YouTube License
Not made for kids. General-audience science content, no graphic imagery.

## Design notes (for future icon-format videos)

- New reusable diagram key: `bhicon` in `src/mindwired-doc/Diagrams.tsx`, backed by
  `src/mindwired-doc/BlackHoleIcons.tsx` — one config-driven component
  (`BLACKHOLE_TYPES` table: radius, ring color, jets/twin/dashed-horizon flags,
  comparison caption) rather than 13 hand-built SVGs. Reuse this pattern for
  future "Every X Explained" videos — just add new type configs.
- Internal diagram labels must sit below y=210 — the DocWide chrome reserves
  y=118-~196 for the `stat` overlay (top-left) and long stat strings will
  overlap anything centered above that band.
- This video reuses the mindwired-doc engine (`makeDocComp`/`DocWide.tsx`), the
  same one used for photo-driven docs like `spaceanimals`/`lostcosmonauts` — no
  new render pipeline was needed, only a new diagram scene type.
