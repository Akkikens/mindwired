#!/usr/bin/env python3
"""
Mindwired #4 — "The Scariest Places In The Universe." A ranked countdown (8 → 1),
escalating from eerie to reality-ending. Deep documentary narration (Brian, TTS +
word timings) + cinematic instrumental score via ElevenLabs.

Run: python3 scripts/scariest/build_audio.py
Writes public/scariest/audio/<clip>.mp3 + manifest.json.
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "lib"))
import eleven  # noqa: E402

SLUG = "scariest"

NARRATION = [
    {"id": "hook", "text": (
        "The universe is not a safe place. Scattered across it are regions so violent, "
        "so empty, or so impossibly hostile that the word scary almost undersells them. "
        "One would tear you into a stream of atoms before your nerves could send a single "
        "signal. One is so vast and so empty that it makes our entire galaxy feel utterly "
        "alone. And the last one on this list may not be a place you travel to at all. It "
        "may be coming toward us, right now, at the speed of light. These are the scariest "
        "places in the universe, ranked from deeply unsettling to the single most "
        "nightmarish thing we have ever found. Let's begin where it's only just starting "
        "to get dark."
    )},
    {"id": "rogue", "text": (
        "Number eight. The rogue planets. Every world you have ever imagined was warmed by "
        "a sun. These are not. Rogue planets are entire worlds that drift through the empty "
        "space between the stars, bound to nothing, falling through the dark forever. Some "
        "were flung out of their solar systems before they ever settled. And there may be "
        "more of them wandering the galaxy than there are stars to light it. On a rogue "
        "planet, there is no sunrise. No day. The surface sits at nearly two hundred and "
        "seventy degrees below zero, frozen under a sky with no sun in it, only the faint "
        "smear of a galaxy that does not care that you are there. It is the loneliest kind "
        "of place a world can be. And it is only the beginning."
    )},
    {"id": "magnetar", "text": (
        "Number seven. The magnetar. When a giant star dies and collapses, it can leave "
        "behind a core just twenty kilometers wide, so dense that a single teaspoon of it "
        "would weigh as much as a mountain range. That alone would be terrifying. But a "
        "magnetar adds something worse. It is the most powerful magnet in the known "
        "universe, with a magnetic field around a quadrillion times stronger than Earth's. "
        "Come within a thousand kilometers of one, and that field would not just kill you. "
        "It would dissolve you, ripping the atoms of your body out of alignment until you "
        "stopped being matter as you understand it. And these are not gentle. When one "
        "convulsed in the year two thousand four, the burst of energy reached Earth from "
        "fifty thousand light-years away, and still disturbed our atmosphere."
    )},
    {"id": "sag_a", "text": (
        "Number six. Sagittarius A-star. You do not have to travel to the far side of the "
        "universe to find a monster. There is one at the center of our own galaxy, and we "
        "are orbiting it right now. Sagittarius A-star is a supermassive black hole weighing "
        "about four million times the mass of our Sun, sitting twenty-six thousand "
        "light-years from where you are sitting. Every star in the Milky Way, including "
        "ours, circles this single point of no return. For most of history we could only "
        "infer it, by watching stars whip around something invisible at a fraction of the "
        "speed of light. It is not the biggest black hole on this list. It is just the one "
        "we can never escape, because we have been falling around it since before there was "
        "anyone here to be afraid."
    )},
    {"id": "quasar", "text": (
        "Number five. The quasars. Take a supermassive black hole, and instead of letting "
        "it sit quietly, feed it. Pour in gas and stars and entire shredded worlds. As that "
        "matter spirals in, it heats to millions of degrees and blazes with the light of a "
        "trillion suns. This is a quasar, and a single one can outshine its entire host "
        "galaxy of hundreds of billions of stars. From the black hole's poles, it fires "
        "jets of plasma across thousands of light-years at nearly the speed of light. If a "
        "quasar's beam were pointed at a nearby world, it would sterilize it completely. "
        "These are the brightest objects in the universe, and they are powered by the "
        "hungriest. A beacon of pure destruction, visible from the edge of everything."
    )},
    {"id": "great_attractor", "text": (
        "Number four. The Great Attractor. This one is frightening for a different reason. "
        "We cannot see it, and it is pulling us toward it. Right now, our entire galaxy is "
        "being dragged across space at over two million kilometers an hour, toward a region "
        "we have never been able to look at directly, because it hides behind the crowded "
        "dust of the Milky Way. Whatever sits there has the gravity of around ten thousand "
        "Milky Ways, and our galaxy, and thousands of others, are sliding helplessly toward "
        "it. We did not choose this journey. We cannot stop it. We are simply passengers, "
        "falling toward something enormous that we still cannot fully explain. If that idea "
        "unsettles you, hold on, because the next one is bigger."
    )},
    {"id": "ton618", "text": (
        "Number three. TON 618. If Sagittarius A-star is a monster, TON 618 is a god. It is "
        "one of the largest black holes ever discovered, weighing an almost unthinkable "
        "sixty-six billion times the mass of our Sun. Its event horizon is so wide that you "
        "could fit our entire solar system inside it thousands of times over, with room to "
        "spare. The light we see from it left over ten billion years ago, when the universe "
        "was young, which means we are looking at an ancient horror that has only grown "
        "since. If you dropped the Sun toward it, the Sun would vanish without TON 618 "
        "registering the loss. It is not a place. It is an appetite the size of a galaxy. "
        "And still, it is not the most disturbing thing on this list."
    )},
    {"id": "bootes", "text": (
        "Number two. The Boötes Void. Everything so far has been about too much, too "
        "violent, too massive. This one is terrifying because of nothing. The Boötes Void "
        "is a region of space roughly three hundred and thirty million light-years across, "
        "and it is almost completely empty. In a volume that should hold thousands of "
        "galaxies, there are only a scattered handful. Astronomers have a chilling way to "
        "describe it. If the Milky Way sat at the center of the Boötes Void, we would not "
        "have known other galaxies existed until very recently, because there would have "
        "been nothing close enough to see. Imagine being so alone in the dark that you "
        "believed you were the entire universe. That is the Great Nothing. And it is "
        "real."
    )},
    {"id": "vacuum", "text": (
        "Number one. The false vacuum. The scariest place in the universe might be every "
        "place at once, including the one you are in. Physics suggests that empty space "
        "itself may not be truly stable. It may be sitting in a false vacuum, a state that "
        "feels permanent but is not, like a ball resting in a dip partway down a hill. If, "
        "anywhere in the cosmos, that space slips into its true lowest state, it creates a "
        "bubble of new reality, where the laws of physics are different and nothing we are "
        "made of can exist. And that bubble expands outward at the speed of light. You "
        "would never see it coming. There would be no warning, no light, no sound from "
        "beyond it. One instant you are here, and the next, you, the Earth, and everything "
        "you have ever known is simply rewritten out of existence. The scariest place in "
        "the universe is the quiet possibility that it could begin anywhere, at any moment, "
        "and we would never know until it was already over."
    )},
    {"id": "outro", "text": (
        "So the next time the night sky looks calm and fixed and safe, remember what is "
        "really out there. Frozen wanderers, dissolving magnets, hungry giants, vast empty "
        "voids, and the faint chance that reality itself is less permanent than it looks. "
        "The universe is not trying to hurt you. It is simply far stranger, and far more "
        "dangerous, than it lets on. If you want to keep staring into the questions most "
        "people never think to ask, subscribe to Mindwired. And we'll see you in the next "
        "one."
    )},
]

NEG = "no vocals, no singing, no lyrics, no spoken word"
SCORE = [
    {"id": "music_open", "length_ms": 95000, "prompt": (
        "Dark cinematic cosmic horror documentary score, deep sub-bass drone, slow ominous "
        "string swells, distant shimmering pulse, vast cold dread and mystery, epic film "
        f"trailer mood, purely instrumental. {NEG}."
    )},
    {"id": "music_creep", "length_ms": 130000, "prompt": (
        "Creeping cinematic unease, low pulsing drone, sparse ticking percussion, slowly "
        "rising tension, eerie and isolating, dark ambient orchestral, purely instrumental. "
        f"{NEG}."
    )},
    {"id": "music_monster", "length_ms": 130000, "prompt": (
        "Overwhelming cinematic dread and grandeur, deep menacing brass, low choir-like "
        "pads, pounding slow build, crushing gravity and scale, dark orchestral, purely "
        f"instrumental. {NEG}."
    )},
    {"id": "music_void", "length_ms": 120000, "prompt": (
        "Vast empty ambient drone, hollow shimmering pads, profound loneliness and silence, "
        "cold and immense, almost no rhythm, purely instrumental. "
        f"{NEG}."
    )},
    {"id": "music_terror", "length_ms": 110000, "prompt": (
        "Climactic cinematic existential terror, swelling dissonant strings, deep impact "
        "hits, accelerating dread resolving into eerie calm, dark epic orchestral, purely "
        f"instrumental. {NEG}."
    )},
]

if __name__ == "__main__":
    eleven.build_audio(SLUG, sung=[], spoken=NARRATION, instrumental=SCORE)
