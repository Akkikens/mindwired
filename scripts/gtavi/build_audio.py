#!/usr/bin/env python3
"""
Mindwired (Digital Simulation) — "The Insane Weather Tech Behind GTA 6."
Speculative-analysis doc: framed on what's shown/leaked/rumored, never stated as
confirmed fact. Brian VO + cinematic synthwave score via ElevenLabs.

Run: python3 scripts/gtavi/build_audio.py  ->  public/gtavi/audio/*.mp3 + manifest.json
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "lib"))
import eleven  # noqa: E402

SLUG = "gtavi"

NARRATION = [
    {"id": "hook", "text": (
        "Somewhere off the coast of a city that doesn't exist, a storm is forming. Not "
        "a scripted animation. Not a weather effect on a timer. A storm that builds, "
        "pressure system by pressure system, and rolls inland on its own. If the leaks "
        "and the trailers are any sign, the weather in Grand Theft Auto Six may be the "
        "most ambitious simulation ever attempted in a video game, a sky that behaves "
        "like a living thing. This is the technology that could make it possible, and "
        "why it might quietly change open worlds forever."
    )},
    {"id": "leonida", "text": (
        "To understand the storm, you have to understand where it's happening. Grand "
        "Theft Auto Six is set in Leonida, Rockstar's reimagining of Florida. And of all "
        "the places they could have chosen, they picked one of the most volatile skies "
        "in America. Florida is hurricane country. It is a place of sudden downpours, "
        "of afternoon thunderheads that tower miles into the air, of flooding streets "
        "and storm surges that swallow coastlines. This was not an accident. By setting "
        "the game in a region defined by its weather, Rockstar made the sky itself a "
        "character, something that can turn a quiet sunset drive into a fight for "
        "survival in a matter of minutes. The setting is the first clue to how seriously "
        "they are taking the simulation."
    )},
    {"id": "from_static", "text": (
        "To see how big the leap is, look at where games have been. In most open worlds, "
        "including Grand Theft Auto Five, weather is essentially a costume change. The "
        "game picks from a handful of preset states, clear, cloudy, rainy, and fades "
        "between them on a hidden timer. The clouds are often a flat painted texture far "
        "overhead. The rain is a particle effect bolted onto the camera. It looks good, "
        "but nothing is really happening. What the newer footage appears to show is "
        "different in kind. Volumetric clouds with real depth and internal lighting, lit "
        "from within by the sun. Skies that shift gradually as fronts move through. Light "
        "that scatters and reddens as it cuts through humid air. It is the difference "
        "between a photograph of weather, and weather that is actually unfolding."
    )},
    {"id": "the_storm", "text": (
        "Then the storm arrives. And this is where the simulation seems to show its "
        "teeth. Clouds thicken and darken. The wind picks up, and you can see it, in the "
        "palms bending, in the spray coming off the water. Rain begins, and it does not "
        "just fall past the camera. It lands. It beads on the windshield and is wiped "
        "away. It darkens concrete, pools in the gutters, and runs downhill in sheets. "
        "Every surface in the world appears to respond, going wet and reflective, "
        "catching the neon and throwing it back. And above it all, lightning, not a "
        "looping flash, but strikes that briefly turn night into day and light the "
        "underside of the clouds from miles away. Each of these is hard on its own. "
        "Together, in a living open world, they are a genuine feat of engineering."
    )},
    {"id": "the_flood", "text": (
        "But rain that simply looks wet is only the surface. The footage and the leaks "
        "hint at something harder, water that accumulates. As a storm intensifies, low "
        "streets appear to begin to flood. Water rises against curbs, fills "
        "intersections, and creeps up the wheels of stranded cars. For a game world, "
        "this is enormously difficult. The system has to understand the shape of the "
        "ground, where water would gather and where it would drain, and it has to do it "
        "everywhere, all at once, while everything else in the city keeps running. If "
        "Rockstar has truly pulled this off across an entire map, it would be one of the "
        "most sophisticated real-time water simulations ever shipped in a game."
    )},
    {"id": "the_hurricane", "text": (
        "And then there is the event that everyone is whispering about. The hurricane. "
        "Rumors and leaked descriptions point to full-blown extreme weather, storms so "
        "severe they become a kind of natural disaster you live through. Imagine the sky "
        "turning a sick shade of green. The wind rising to a scream. Debris tearing loose "
        "and flying through the streets. A storm surge climbing out of the bay and into "
        "the city. If this is real, and Rockstar has not officially confirmed it, then "
        "the weather stops being scenery and becomes an antagonist. Not a cutscene you "
        "watch, but a systemic event that reshapes the world around you while you try to "
        "survive it."
    )},
    {"id": "living_world", "text": (
        "What makes this matter is not the storm by itself. It is what the storm touches. "
        "In a true simulation, weather is not a separate layer. It reaches into "
        "everything. The leaks suggest that when the rain comes, the world reacts. "
        "Pedestrians pull out umbrellas, or break into a run, or crowd under awnings. "
        "Traffic thins and slows. The whole rhythm of the city bends around the sky. "
        "This is the real leap, weather as a multiplier on every other system in the "
        "game, generating moments no designer scripted, a chase through a flooding "
        "underpass, a getaway hidden by a wall of rain. Emergent stories, written by the "
        "collision of systems rather than by a writer. That is what a living world "
        "actually means."
    )},
    {"id": "the_cost", "text": (
        "So why has no one really done this before? Because it is brutally expensive. "
        "Every one of these systems, volumetric clouds, dynamic water, surface wetness, "
        "thousands of reacting characters, costs precious processing power, and they all "
        "have to run at once, sixty times a second, without the world ever stuttering. "
        "This is almost certainly why a game of this ambition is built only for "
        "current-generation hardware, and why it has reportedly taken Rockstar more than "
        "a decade and a fortune to make. Their engine has been quietly rebuilt to make "
        "the environment itself dynamic. The weather is not a feature sitting on top of "
        "the world. It may be woven into the foundation of it."
    )},
    {"id": "outro", "text": (
        "If even half of what we have glimpsed turns out to be real, Grand Theft Auto Six "
        "will not just raise the bar for graphics. It will raise the bar for what a world "
        "is allowed to do on its own, a place that is weathering, flooding, and living "
        "whether you are watching or not. And once players feel a world that alive, every "
        "open world that comes after will be measured against it. If you love taking apart "
        "the hidden machinery behind the things we build, subscribe to Mindwired. And "
        "we'll see you in the next one."
    )},
]

NEG = "no vocals, no singing, no lyrics, no spoken word"
SCORE = [
    {"id": "music_open", "length_ms": 80000, "prompt": (
        "Dark cinematic synthwave, deep analog bass pulse, slow ominous neon pads, "
        "distant thunder ambience, moody Miami night, tense and atmospheric, purely "
        f"instrumental. {NEG}."
    )},
    {"id": "music_build", "length_ms": 120000, "prompt": (
        "Driving cinematic synthwave with rising tension, arpeggiated analog synth, "
        "pulsing bass, electronic percussion building, neon and storm energy, purely "
        f"instrumental. {NEG}."
    )},
    {"id": "music_storm", "length_ms": 120000, "prompt": (
        "Intense dark electronic cinematic, heavy distorted bass, dramatic synth stabs, "
        "thunderous percussion, chaos and power of a storm, trailer intensity, purely "
        f"instrumental. {NEG}."
    )},
    {"id": "music_awe", "length_ms": 110000, "prompt": (
        "Awe-inspiring cinematic synthwave, soaring warm analog leads, lush neon pads, "
        "wonder and scale, emotional and vast, retro-futuristic, purely instrumental. "
        f"{NEG}."
    )},
    {"id": "music_outro", "length_ms": 80000, "prompt": (
        "Reflective cinematic synthwave outro, warm analog pad, gentle arpeggio, hopeful "
        f"and atmospheric, slow fade, purely instrumental. {NEG}."
    )},
]

if __name__ == "__main__":
    eleven.build_audio(SLUG, sung=[], spoken=NARRATION, instrumental=SCORE)
