# Mindwired — Batch 10 Upload Kit (Icahn-validated long-forms)

All 10 topics trace to proven outliers from the 2026-07-01 research sweep (see
memory: icahn-scary-space-niche). Every video: intro wordmark open → ranked/
listicle body → Wow-style close → subscribe outro. Voice: Hume "Nature
Documentary Narrator". Upload order below = strongest proof first. One per 1-2
days; pair each with a matching Short where one exists.

Common description footer:
> 🛰 Subscribe to @Mindwired for more on the strange machinery of our universe.
> Animations by Mindwired (WebGL / Remotion).

---

## 1. mindwired_space_theories.mp4 — 10 Space Theories That Will Keep You Awake
Proof: Space Dude "10 Scariest Space Theories Ever" 621K views / 36K subs (17:1).
Alts: "10 Space Theories That Get Worse the Longer You Think" · "Ranked: The Space Theories Scientists Whisper About"
Description hook: From the anthropic shadow to the last light — 10 real ideas from physics, ranked from unsettling to unbearable. #7 is happening to you right now.
Tags: scary space theories, quantum immortality, boltzmann brain, great filter, vacuum decay, big rip, dark forest, simulation hypothesis, space theories ranked, mindwired
Pinned: Which number actually scared you? Be honest.

## 2. mindwired_blackholes_ranked.mp4 — The 7 Most Terrifying Black Holes Ever Found
Proof: SciMind scariest-places 3.4M/23.1K (147:1) + TON 618 segment demand; Spacedust object deep-dives 200K/75K.
Alts: "The Most Terrifying Black Holes We've Ever Found, Ranked" · "7 Real Black Holes Worse Than Fiction"
Description hook: From the first monster Hawking bet against, to the one that may be hiding inside our own solar system.
Tags: black holes ranked, ton 618, sagittarius a star, m87, gaia bh1, cygnus x1, rogue black hole, primordial black holes, planet nine black hole, mindwired
Pinned: Planet Nine — planet or bowling-ball black hole? Place your bets.

## 3. mindwired_universe_endings.mp4 — Every Way the Universe Could End
Proof: Kurzgesagt vacuum decay 16M; Infographics 259K; Space Dude ending chapters; enduniverse Short demand.
Alts: "Every Way the Universe Could End, Ranked" · "The 5 Endings of the Universe (One Is Already Underway)"
Description hook: Big Crunch, Big Rip, Heat Death, Vacuum Decay — and the one thing cosmologists admit: the author of the ending is still unknown.
Tags: end of the universe, heat death, big rip, big crunch, vacuum decay, dark energy, phantom energy, how the universe ends, cosmology, mindwired
Pinned: Which ending do you find most peaceful? I'll go first: the long dark.

## 4. mindwired_deadliest_objects.mp4 — The Deadliest Objects in the Universe
Proof: magnetar/quasar/GRB segments across all winning compilations.
Alts: "Ranked: The Universe's Deadliest Objects" · "7 Objects That Kill From Light Years Away"
Tags: deadliest objects in space, magnetar, gamma ray burst, quasar, neutron star collision, rogue black hole, supernova, false vacuum, mindwired

## 5. mindwired_great_filter.mp4 — The Great Filter
Proof: Dark-forest cluster (SciMind 522K/23.1K, Great Abyss 346K/69K) + Space Dude filter chapters.
Alts: "The Great Filter: Why the Universe Is a Graveyard" · "The Wall That Kills Every Civilization"
Tags: great filter, fermi paradox, why aliens are silent, abiogenesis, drake equation, alien civilizations, existential risk, mindwired
Launch pairing: re-share ShortDarkForest.

## 6. mindwired_disturbing_space.mp4 — The Most Disturbing Things Found in Space
Proof: The Paint Explainer "Most Disturbing Events in Space" 1.7M; quack doc iceberg 644K.
Alts: "8 Real Space Mysteries With No Explanation" · "The Most Disturbing Signals We've Ever Received"
Tags: wow signal, tabby's star, oumuamua, fast radio bursts, apollo 10 music, cmb cold spot, dark flow, space mysteries, unexplained space, mindwired

## 7. mindwired_cosmic_horror.mp4 — Cosmic Horror Theories That Might Be Real
Proof: The Great Abyss 346K/69.3K (5:1) + 157K follow-up.
Alts: "Cosmic Horror That Passes Peer Review" · "7 Theories Too Unsettling for Textbooks"
Tags: cosmic horror, dark forest, boltzmann brain, zoo hypothesis, simulation theory, berserker probes, existential dread, scary theories, mindwired

## 8. mindwired_bootes_void.mp4 — The Great Nothing (Boötes Void deep dive)
Proof: Places 220K; Spacedust 200K/75.2K; Space Matters 385K; Late Science 72K/6mo.
Alts: "The Boötes Void: The Emptiest Place That Shouldn't Exist" · "There Is a Hole in the Universe"
Tags: bootes void, great nothing, cosmic voids, emptiest place in the universe, cosmic web, dark energy, supervoid, mindwired
Launch pairing: re-share ShortBootesVoid.

## 9. mindwired_quantum_reality.mp4 — The Theories That Break Reality
Proof: Space Dude theory-listicle format (621K) + Thomas Mulligan "15 Ideas That Horrify Scientists" 2M.
Alts: "Quantum Immortality and 5 Other Reality-Breaking Ideas" · "The Physics Ideas That Shouldn't Be Legal"
Tags: quantum immortality, many worlds, block universe, holographic principle, observer effect, boltzmann brain, quantum physics explained, mindwired

## 10. mindwired_edge_universe.mp4 — What Is at the Edge of the Universe?
Proof: SciMind places "Edge of Universe" segment (3.4M video); AstroKobi mysteries 751K.
Alts: "The Edge of the Universe Is Closing In" · "What's Beyond the Observable Universe?"
Tags: edge of the universe, observable universe, cosmic horizon, expansion of the universe, beyond the universe, cosmology explained, mindwired

---

## Rebuild / re-render commands (singaloo repo)
- Audio (any topic): `python3 scripts/cosmic/build_topic_multi.py <slug>` (Hume → Cartesia → ElevenLabs)
- Everything: `python3 scripts/cosmic/gen_registry.py && bash scripts/cosmic/render_batch10.sh`
  (skips finished videos; delete an mp4 from singaloo/out to force a re-render)
- Thumbnails: THUMBNAILS.md Workflow A; grab hero frames with
  `npx remotion still <CompId> out/x.png --frame=N --gl=angle`
