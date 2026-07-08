#!/usr/bin/env python3
"""
Mindwired — "A Rogue Planet Enters Our Solar System… Then Earth Changes Forever."
A cinematic cosmic-horror explainer (~7-8 min). Deep documentary narration
(ElevenLabs "George", TTS + word timings) + a cinematic instrumental score.

Run: python3 scripts/rogueplanet/build_audio.py
Writes public/rogueplanet/audio/<clip>.mp3 + manifest.json (real, word-aligned).
Idempotent per clip — safe to re-run; it never re-spends quota on existing clips.

Offline / no-key preview: run scripts/rogueplanet/estimate_manifest.py first to
write silent placeholder mp3s + an estimated manifest so the comp renders without
the ElevenLabs key. This script overwrites the estimated clips with real audio and
the video re-times itself off the new word timings.
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "lib"))
import eleven  # noqa: E402

SLUG = "rogueplanet"

# One narration clip per scene beat. Wording follows the approved script; TTS
# mangle-prone constructs are lightly de-punctuated (em dashes → periods) so
# George's pacing lands the pauses the sound design leans on.
NARRATION = [
    {"id": "hook", "text": (
        "A planet could enter our solar system tomorrow, and no one on Earth would see "
        "it coming. No sunrise. No warning flash. No giant object glowing in the sky. "
        "Just a tiny distortion in the light of distant stars. A dark world, drifting "
        "alone through interstellar space, pulled by nothing, warmed by nothing, "
        "orbiting no sun. A rogue planet."
    )},
    {"id": "gravity", "text": (
        "And the most terrifying part is this. It would not need to hit Earth to destroy "
        "us. It would only need to pass close enough."
    )},
    {"id": "whatis", "text": (
        "Because the solar system is not a machine made of solid tracks. It is a balance. "
        "A gravitational agreement between the Sun, the planets, moons, asteroids, and "
        "comets. For billions of years, Earth has survived because that balance has "
        "remained stable enough for oceans, seasons, weather, and life. But introduce "
        "one new planet from the darkness, and the entire system begins to negotiate "
        "again."
    )},
    {"id": "invisible", "text": (
        "At first, nothing dramatic happens. No fire in the sky. No tidal waves. No "
        "earthquakes. The rogue planet is still far beyond Neptune. It is cold, black, "
        "and almost invisible. Astronomers do not see the planet itself. They see what "
        "it does to light. As it passes in front of background stars, its gravity bends "
        "their light for a moment, making them brighten, distort, and fade again. That "
        "tiny flicker could be the first sign that something massive has entered the "
        "outer edge of our solar system."
    )},
    {"id": "neptune", "text": (
        "Then Neptune begins to betray the secret. Its orbit changes by a fraction. Too "
        "small for anyone outside astronomy to care. Too precise for scientists to "
        "ignore. Then Uranus shifts. Then tiny icy objects beyond Neptune begin moving "
        "in ways they should not. At this point, humanity has not seen the danger. We "
        "have only seen its fingerprints. A planet is moving in the dark. And it is "
        "coming inward."
    )},
    {"id": "freezer", "text": (
        "If the rogue planet is small, maybe Earth survives with almost no effect. But if "
        "it is the size of Earth, Neptune, or Jupiter, the story changes completely. The "
        "first disaster may not begin on Earth. It begins in the freezer of the solar "
        "system. Beyond Neptune lies a vast population of icy bodies. Comets. Frozen "
        "debris. Ancient leftovers from the formation of the planets. For billions of "
        "years, most of them have stayed far away. But the rogue planet's gravity could "
        "shake that distant reservoir. Some objects would be thrown outward into "
        "interstellar space. Others would be thrown inward. Toward the Sun. Toward the "
        "inner planets. Toward us."
    )},
    {"id": "comet", "text": (
        "At first, the night sky becomes beautiful. More comets than any human "
        "generation has ever seen. Then beauty becomes statistics. Every new comet is "
        "another roll of the dice. Most miss. Some pass close. A few do not. And even "
        "one large impact could change the climate of Earth for years. But the comet "
        "storm is only the opening act. The real threat is orbit."
    )},
    {"id": "orbit", "text": (
        "Earth's orbit is why life exists. Not just because we are the right distance "
        "from the Sun, but because that distance stays stable. A little closer, and "
        "oceans begin to evaporate faster. A little farther, and ice spreads across the "
        "continents. A more stretched orbit means more extreme seasons. Longer winters. "
        "Hotter summers. Broken agriculture. Collapsing ecosystems. And if the rogue "
        "planet passes close enough, Earth could be pulled into an orbit it was never "
        "meant to have. Not destroyed instantly. Changed permanently. Imagine Earth "
        "spending part of the year far enough from the Sun that oceans begin to freeze, "
        "then swinging back inward into brutal heat. Every year becomes a planetary "
        "trauma. Civilization was built around predictable seasons. But gravity does not "
        "care about civilization."
    )},
    {"id": "worstcase", "text": (
        "Then comes the worst possibility. A close gravitational encounter. The rogue "
        "planet does not collide with Earth. It passes near Jupiter, or Saturn, or even "
        "the Sun. And that encounter transfers energy through the solar system like a "
        "cue ball striking a table. One planet shifts. Then another. Then Earth. In the "
        "most extreme case, Earth could be thrown away from the Sun entirely. No "
        "explosion. No impact. Just a slow departure."
    )},
    {"id": "frozen", "text": (
        "The Sun would shrink in the sky. Daylight would weaken. The oceans would freeze "
        "from the surface downward. The atmosphere itself could begin to collapse onto "
        "the ground as snow. Earth would become a wandering world. A frozen planet "
        "carrying the ruins of life through the galaxy. And the rogue planet? It would "
        "keep moving. It would not know what it had done. That is the horror of gravity. "
        "It does not hate us. It does not hunt us. It does not even notice us. But it can "
        "end everything we know without ever touching us."
    )},
    {"id": "ending", "text": (
        "A rogue planet entering the solar system is unlikely on human timescales. But "
        "the universe is full of worlds that lost their stars. Dark planets. Silent "
        "planets. Planets with no sunrise. Somewhere in the galaxy, they are moving "
        "between the stars right now. And if one ever enters our solar system, the first "
        "sign may not be a planet in the sky. It may be a star, that flickers."
    )},
    {"id": "outro", "text": (
        "If you want to keep staring into the questions most people never think to ask, "
        "subscribe to Mindwired. And we'll see you in the next one."
    )},
]

NEG = "no vocals, no singing, no lyrics, no spoken word"
SCORE = [
    {"id": "music_open", "length_ms": 120000, "prompt": (
        "Dark cinematic cosmic horror documentary score, deep sub-bass drone, slow "
        "ominous string swells, a distant heartbeat-like pulse, vast cold dread and "
        f"mystery, epic film trailer mood, purely instrumental. {NEG}."
    )},
    {"id": "music_dread", "length_ms": 150000, "prompt": (
        "Creeping cinematic unease, low pulsing drone, sparse ticking percussion, slowly "
        "rising tension, eerie and isolating, dark ambient orchestral, purely "
        f"instrumental. {NEG}."
    )},
    {"id": "music_signs", "length_ms": 150000, "prompt": (
        "Building cinematic tension and scientific unease, pulsing low synth, subtle "
        "clock-like percussion, cold strings tightening, a sense of something "
        f"approaching in the dark, dark orchestral, purely instrumental. {NEG}."
    )},
    {"id": "music_storm", "length_ms": 150000, "prompt": (
        "Overwhelming cinematic dread and grandeur, deep menacing brass, low choir-like "
        "pads, pounding slow build, crushing gravity and scale, dark orchestral, purely "
        f"instrumental. {NEG}."
    )},
    {"id": "music_end", "length_ms": 170000, "prompt": (
        "Climactic cinematic existential grief, swelling dissonant strings, deep impact "
        "hits, a slow departure into cold empty ambience, haunting and final, dark epic "
        f"orchestral, purely instrumental. {NEG}."
    )},
]

if __name__ == "__main__":
    eleven.build_audio(SLUG, sung=[], spoken=NARRATION, instrumental=SCORE)
