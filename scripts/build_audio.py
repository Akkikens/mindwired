#!/usr/bin/env python3
"""
Mindwired — "What Happens To Lost Astronaut Equipment Floating Forever In Earth's
High Orbit". Generates the deep documentary narration (TTS + word timings) and a
cinematic instrumental score via ElevenLabs.

Run: python3 scripts/build_audio.py
Writes public/orbit/audio/<clip>.mp3 + manifest.json (durations + word timings).
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
import eleven  # noqa: E402

SLUG = "orbit"

# ── Narration (deep, cinematic; punctuation tuned for dramatic pacing) ──────────
NARRATION = [
    {"id": "hook", "text": (
        "Right now, more than two hundred fifty miles above your head, a single lost "
        "glove is moving faster than a rifle bullet. Seventeen thousand five hundred "
        "miles per hour. It isn't a weapon. It was never meant to be dangerous. It is "
        "a thermal glove, dropped by an astronaut more than half a century ago. But up "
        "here, in the cold and the silence, the rules are different. Out here, the things "
        "we lose don't fall. They don't decay the way they would on Earth. They transform "
        "into something else entirely. This is the story of the equipment we left behind "
        "in orbit, and what the universe is slowly, patiently turning it into."
    )},
    {"id": "s1_launch", "text": (
        "It always begins the same way. A small mistake. In nineteen sixty-five, during "
        "the very first American spacewalk, astronaut Ed White reached out into the void, "
        "and a spare thermal glove drifted away from the open hatch. It was gone in seconds. "
        "Decades later, in two thousand eight, astronaut Heidemarie Stefanyshyn-Piper was "
        "repairing the International Space Station when a grease gun erupted inside her tool "
        "bag. As she tried to clean it, the entire bag, worth around one hundred thousand "
        "dollars, slipped from her grasp and floated into the black. On Earth, a dropped "
        "object falls. It hits the ground, and the story ends. But in orbit, there is no "
        "ground. These objects were already traveling at seventeen thousand five hundred "
        "miles per hour, the same blistering speed as the spacecraft beside them. So they "
        "didn't fall. They kept going. In an instant, a glove and a tool bag stopped being "
        "equipment, and became satellites. Independent, uncontrolled, and utterly alone."
    )},
    {"id": "s2_shredder", "text": (
        "You might imagine that, sealed in the vacuum of space, these objects would last "
        "forever. Perfectly preserved. The truth is far stranger. Space is not empty. It is "
        "corrosive. At the altitude where the Space Station flies, the thin upper atmosphere "
        "is filled with atomic oxygen, single, highly reactive oxygen atoms torn apart by "
        "the sun. At seventeen thousand miles per hour, the glove slams into these atoms "
        "like an invisible sandstorm, and they burn its surface away, atom by atom. Smooth "
        "fabric turns porous. Solid metal is eaten into dust. Then there is the light. With "
        "no atmosphere to filter it, raw ultraviolet radiation bombards every surface. Bright "
        "mission patches fade. Colorful nylon is bleached a ghostly, lifeless white. And "
        "every ninety minutes, as the object races in and out of Earth's shadow, the "
        "temperature swings violently. From over two hundred fifty degrees in the sunlight, "
        "to nearly minus two hundred fifty in the dark. Again. And again. Materials expand, "
        "then contract, then crack. Slowly, the universe is taking our equipment apart."
    )},
    {"id": "s3_ballistic", "text": (
        "But as these objects break down, they become something far more dangerous than "
        "litter. In orbit, energy is not about size. It is about speed. A fleck of paint "
        "traveling at orbital velocity carries the force of a bullet. A lost bolt hits with "
        "the energy of a hand grenade. That harmless glove? If it struck a spacecraft "
        "head-on, the impact could punch straight through metal shielding designed to "
        "protect human lives. And every object that fragments creates more debris. More "
        "fragments mean more collisions. More collisions mean more fragments. Scientists "
        "have a name for the nightmare scenario. The Kessler Syndrome. A runaway chain "
        "reaction, where orbiting debris collides, multiplies, and cascades, until entire "
        "regions of space become a wall of shrapnel. And as we launch tens of thousands of "
        "new satellites into these same orbits, the margin for error is vanishing. A single "
        "forgotten glove could, in theory, be the first domino."
    )},
    {"id": "s4_graveyard", "text": (
        "So where does all of it go? Lost objects don't scatter randomly. They follow the "
        "invisible highways of orbital mechanics, drifting into specific lanes and altitudes, "
        "places where, over the decades, the discarded artifacts of human spaceflight quietly "
        "gather. In low orbit, there is a mercy. The faint drag of the atmosphere slowly "
        "pulls objects down, and within months or years, they burn away. Ed White's glove "
        "fell back to Earth within a month. But push something higher, into the graveyard "
        "orbits, and it can circle the planet for centuries. Untouched. Untracked. Almost. "
        "Because we are watching. Powerful radar systems, like the Space Fence, stare "
        "constantly into orbit, cataloguing tens of thousands of objects, some no larger "
        "than a marble, mapping their paths to predict the next deadly collision before it "
        "happens. Every glove. Every bolt. Every flake of frozen paint. Counted. And followed."
    )},
    {"id": "s5_legacy", "text": (
        "There is something haunting about all of this. Each lost object is an accidental "
        "time capsule. A frozen fragment of twenty-first century human engineering, sealed "
        "in the most hostile museum ever built. And it raises a strange question. Is a glove "
        "dropped by one of the first humans to walk in space simply garbage, to be cleaned "
        "up? Or is it a historical artifact, a piece of our story that deserves to be "
        "protected, right where it floats? For now, most of these relics share the same "
        "quiet fate. Slowly, inevitably, the thin grip of the atmosphere wins. They spiral "
        "lower, and lower, until one day they meet the air at full orbital speed, and end "
        "their long journey the way so many things in space do. Not with a whisper, but as "
        "a brief, brilliant streak of light across the night sky. A shooting star, that was "
        "once a glove."
    )},
    {"id": "outro", "text": (
        "The next time you look up, remember. We have left more than footprints out there. "
        "We've left pieces of ourselves, drifting in the dark, changing in ways we are only "
        "beginning to understand. If you want to keep exploring the strange machinery of our "
        "universe, subscribe to Mindwired. And we'll see you in the next one."
    )},
]

# ── Cinematic instrumental score cues (no vocals) ──────────────────────────────
NEG = "no vocals, no singing, no lyrics, no spoken word"
SCORE = [
    {"id": "music_open", "length_ms": 75000, "prompt": (
        "Dark cinematic space documentary score, deep sub-bass drone, slow ominous "
        "string swells, a distant ticking pulse, vast cold and mysterious atmosphere, "
        f"epic film trailer mood, purely instrumental. {NEG}."
    )},
    {"id": "music_tension", "length_ms": 95000, "prompt": (
        "Driving cinematic tension, pulsing ostinato strings, low brass stabs, trailer "
        "percussion, rising suspense and dread, building danger, purely instrumental. "
        f"{NEG}."
    )},
    {"id": "music_awe", "length_ms": 95000, "prompt": (
        "Soaring awe-inspiring cinematic orchestral, shimmering high strings, ethereal "
        "ambient synth pads, cosmic wonder mixed with melancholy, emotional and vast, "
        f"purely instrumental. {NEG}."
    )},
    {"id": "music_outro", "length_ms": 45000, "prompt": (
        "Reflective hopeful but haunting cinematic outro, gentle piano, warm analog synth "
        f"pad, slow fade into silence, bittersweet, purely instrumental. {NEG}."
    )},
]

if __name__ == "__main__":
    eleven.build_audio(SLUG, sung=[], spoken=NARRATION, instrumental=SCORE)
