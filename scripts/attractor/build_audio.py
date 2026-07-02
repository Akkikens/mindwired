#!/usr/bin/env python3
"""
Mindwired #2 — "The Great Attractor." Deep documentary narration (Brian, TTS +
word timings) + cinematic instrumental score via ElevenLabs.

Run: python3 scripts/attractor/build_audio.py
Writes public/attractor/audio/<clip>.mp3 + manifest.json.
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "lib"))
import eleven  # noqa: E402

SLUG = "attractor"

NARRATION = [
    {"id": "hook", "text": (
        "Right now, without feeling a thing, you are moving. Not just spinning with "
        "the Earth. Not just orbiting the Sun. Your entire galaxy, every star you have "
        "ever seen, is being pulled through space at over two million kilometers an "
        "hour, toward a single point we cannot even see. Something out there is reaching "
        "across hundreds of millions of light-years, and dragging the Milky Way toward "
        "it. Astronomers hid its name behind a wall of dust for decades, because they "
        "could not explain it. They call it the Great Attractor. And today, we are going "
        "to look straight into the one part of the sky we were never able to see."
    )},
    {"id": "first_clue", "text": (
        "But how can anyone know that our galaxy is moving at all, when we are riding "
        "along inside it, with no fixed wall to measure against? The answer came from the "
        "faint afterglow of the Big Bang itself. The entire sky is bathed in a microwave "
        "glow, left over from the universe's very first moments, and it is almost "
        "perfectly even in every direction. Almost. When astronomers measured it "
        "precisely, they found that one half of the sky is very slightly warmer, and the "
        "opposite half very slightly cooler. There is only one good explanation. We are "
        "moving. The whole Milky Way is rushing toward the warm side at around six hundred "
        "kilometers every second, more than two million kilometers an hour, and that "
        "motion shifts the ancient light, like the pitch of a siren rising as it races "
        "toward you. It was a cosmic speedometer, and it gave a startling reading. Through "
        "the nineteen eighties, a group of astronomers nicknamed the Seven Samurai traced "
        "the motion of hundreds of galaxies, and found they were all streaming the same "
        "way, toward the same hidden region of the sky. One of them, the astronomer Alan "
        "Dressler, gave the unseen culprit its name. But naming a monster is not the same "
        "as understanding it. Because what this one was doing should not have been "
        "possible at all."
    )},
    {"id": "tug_of_war", "text": (
        "To understand what is happening to us, you first have to understand what the "
        "universe is supposed to be doing. Ever since the Big Bang, space itself has "
        "been stretching. Galaxies are flying apart in every direction, carried on an "
        "expanding tide driven by a force we call dark energy. On the largest scales, "
        "everything should be racing away from everything else. And yet our galaxy is not "
        "simply drifting with the expansion. It is being pulled, sideways, deliberately, "
        "toward that one specific region the Seven Samurai had found. Whole clusters of "
        "galaxies around us are moving with it, like leaves all caught in the same "
        "invisible current. Something is overpowering the expansion of the universe in our "
        "corner of space. Something with a gravitational grip so immense that it bends the "
        "motion of thousands of galaxies. For a long time, no one could say what it was. "
        "Only that it lay in a direction we were physically unable to look. And that "
        "direction has a name that sounds like a warning. The Zone of Avoidance."
    )},
    {"id": "zone", "text": (
        "The irony is almost cruel. The thing pulling our galaxy is hidden behind our "
        "galaxy. When you look toward the constellations of Centaurus and Norma, you are "
        "not looking out into open space. You are looking straight through the crowded "
        "disk of the Milky Way itself. Through billions of stars, and through thick, "
        "choking clouds of gas and dust. To an ordinary telescope, it is a wall. Visible "
        "light from anything beyond it is simply swallowed. Astronomers call this band "
        "across our sky the Zone of Avoidance, because for most of history, this is the "
        "part of the universe we were forced to avoid. Roughly a fifth of the entire sky "
        "was, in effect, a blind spot. But dust that stops visible light is not the end "
        "of the story. Radio waves pass through it. So does infrared. So does the X-ray "
        "glow of superheated gas. And as our instruments grew sharper, astronomers began "
        "to map the hidden sky in these other kinds of light, peeling back the veil, "
        "layer by layer. What emerged from behind the curtain was breathtaking. Galaxies. "
        "Not a few. Thousands of them, packed together in the one direction we had never "
        "been able to see clearly. And right at the heart of that hidden crowd sat a "
        "gravitational center, an anchor point, exactly where the pull was coming from."
    )},
    {"id": "scale", "text": (
        "What they found is difficult to put into human terms, because nothing in human "
        "experience is this big. The Great Attractor is not a single object. It is a "
        "concentration of mass. Galaxies, clusters of galaxies, and vast clouds of hot "
        "gas, all crowded into one region around two hundred million light-years away. At "
        "its core sits a colossal cluster known as the Norma Cluster, a swarm of galaxies "
        "bound together by their own gravity. Add everything up, and the Great Attractor "
        "weighs in at something on the order of ten thousand times the mass of the entire "
        "Milky Way. Picture the universe not as flat, but as a landscape. A surface of "
        "hills and valleys, where mass bends the terrain. Most galaxies sit on gentle "
        "slopes. But the Great Attractor is a canyon. A vast basin carved into the shape "
        "of space itself, so deep that everything for hundreds of millions of light-years "
        "around it begins, slowly, to roll downhill toward the bottom. And we are one of "
        "the things rolling. The Milky Way, the Andromeda galaxy, our entire Local Group, "
        "all of us are sliding down the inside of this basin, drawn toward the lowest "
        "point. For years, that seemed to be the whole story. A giant, pulling us in. But "
        "the truth, it turned out, was stranger. Because the Great Attractor is not just "
        "pulling. Something behind us is also pushing."
    )},
    {"id": "repeller", "text": (
        "In two thousand seventeen, a team of astronomers mapping the flow of galaxies "
        "noticed something no one expected. Our motion through space could not be "
        "explained by the Great Attractor alone. The pull in front of us was real. But "
        "there was a second influence, coming from the exact opposite direction. Behind "
        "us, on the far side of the sky, lay a region almost entirely empty. No galaxies. "
        "No clusters. Just a vast, dark void, hundreds of millions of light-years across. "
        "And here is the strange part. Emptiness has consequences. In a universe full of "
        "matter, a region with almost nothing in it has less gravity than everything "
        "around it. Matter is gently pushed away from the void, and toward the crowded "
        "regions. So this enormous hole in the cosmos acts like a hill we are rolling away "
        "from, even as the Great Attractor is a valley we are rolling into. Scientists "
        "named this empty region the Dipole Repeller. Together, the repeller behind us, "
        "and the attractor ahead of us, form a kind of cosmic tug of war. One side "
        "pushing, one side pulling, and our galaxy caught in the middle, carried along by "
        "both. We are not simply falling toward something. We are being squeezed through "
        "space by the architecture of the entire local universe."
    )},
    {"id": "laniakea", "text": (
        "Step back far enough, and a pattern emerges out of the chaos. In two thousand "
        "fourteen, astronomers used the motion of thousands of galaxies to draw a new "
        "kind of map. Not of where galaxies are, but of where they are flowing. They "
        "traced the invisible currents, the streams of galaxies all sliding in the same "
        "directions, and they looked for the boundaries. The places where the flow tips "
        "one way instead of another. What they found was a structure so large it redrew "
        "our address in the universe. They called it Laniakea, a Hawaiian word meaning "
        "immense heaven. It is a supercluster. A connected continent of more than one "
        "hundred thousand galaxies, stretching over five hundred million light-years. The "
        "Milky Way is not at its center. We are out near the edge, in the suburbs, on a "
        "long thread of galaxies flowing inward. And the point that all of those currents "
        "drain toward, the bottom of the entire basin, is the Great Attractor. This is "
        "what it truly is. Not just a thing pulling us, but the lowest point in our "
        "cosmic home. The bottom of the valley that defines which galaxies are us, and "
        "which belong to someone else. For the first time, we could see the shape of the "
        "thing we live inside. And it raised an unsettling question. If the Great "
        "Attractor is the bottom of our basin, then why are the galaxies beyond it still "
        "moving past it, toward something even bigger?"
    )},
    {"id": "shapley", "text": (
        "Because the Great Attractor, for all its terrifying size, may not be the one in "
        "charge. When astronomers followed the flow of galaxies even further, past the "
        "Great Attractor, deeper into the obscured sky, they found that the river kept "
        "going. Beyond the basin, in the same general direction, lies something larger "
        "still. The Shapley Concentration. It is the single greatest collection of matter "
        "in the nearby universe. A supercluster of superclusters, tens of thousands of "
        "galaxies pooled together more than six hundred million light-years away. Some "
        "astronomers now believe that a significant fraction of our motion, and the "
        "motion of the Great Attractor itself, is ultimately owed to the distant gravity "
        "of Shapley. In other words, the monster we feared may itself be falling toward a "
        "greater one. It is attractors all the way down. A hierarchy of gravitational "
        "giants, each one being drawn toward something bigger and further away, in a chain "
        "that stretches beyond the limits of what we can measure. And standing at the end "
        "of that chain, looking up at structures that dwarf our entire galaxy by factors "
        "we can barely write down, you are forced to ask the only question that really "
        "matters. After all of this falling, will we ever actually arrive?"
    )},
    {"id": "destination", "text": (
        "The answer is one of the strangest truths in modern cosmology. Almost certainly, "
        "no. We will never reach the Great Attractor. Remember dark energy, the force "
        "stretching the universe apart? On small scales, gravity wins, and galaxies fall "
        "together. But across the immense distances between us and the Attractor, the "
        "relentless expansion of space is winning. The gap between us and our destination "
        "is, on the largest scale, slowly growing faster than we can cross it. Astronomers "
        "now believe that Laniakea itself is not gravitationally bound. Our great cosmic "
        "continent, the structure we just learned we belong to, is not destined to "
        "collapse together. It is destined to be pulled apart. The same dark energy "
        "carrying distant galaxies beyond our sight forever will, in time, stretch the "
        "threads of Laniakea until they snap. We are falling toward the Great Attractor, "
        "and yet the finish line is racing away from us, and the expansion of the universe "
        "will win the race. We are chasing something we are fated never to catch. A "
        "destination that exists, that has a name, that bends our entire galaxy toward it, "
        "and that we will nonetheless watch slip beyond our reach across the deep future."
    )},
    {"id": "outro", "text": (
        "So the next time you look up at a quiet, fixed sky, remember what is really "
        "happening. You, this planet, this galaxy, and a hundred thousand others, are "
        "sliding silently across the universe, pulled toward a giant we still cannot fully "
        "see, that is itself falling toward something greater. We are passengers on a "
        "current billions of years old, headed somewhere we will never arrive. If you want "
        "to keep staring into the questions most people never think to ask, subscribe to "
        "Mindwired. And we'll see you in the next one."
    )},
]

NEG = "no vocals, no singing, no lyrics, no spoken word"
SCORE = [
    {"id": "music_open", "length_ms": 80000, "prompt": (
        "Dark cinematic cosmic documentary score, deep sub-bass drone, slow ominous "
        "string swells, distant shimmering pulse, vast cold awe and mystery, epic film "
        f"trailer mood, purely instrumental. {NEG}."
    )},
    {"id": "music_build", "length_ms": 120000, "prompt": (
        "Cinematic discovery and rising tension, pulsing low strings, ticking ostinato, "
        "growing suspense and wonder, building momentum, orchestral, purely instrumental. "
        f"{NEG}."
    )},
    {"id": "music_vast", "length_ms": 120000, "prompt": (
        "Soaring awe-inspiring cosmic orchestral, shimmering high strings, ethereal "
        "ambient synth pads, immense scale and wonder, emotional and vast, purely "
        f"instrumental. {NEG}."
    )},
    {"id": "music_dread", "length_ms": 110000, "prompt": (
        "Ominous cinematic dread and grandeur, deep brass, low choir-like pads, slow "
        "menacing build, overwhelming gravity and scale, dark orchestral, purely "
        f"instrumental. {NEG}."
    )},
    {"id": "music_resolve", "length_ms": 95000, "prompt": (
        "Bittersweet reflective cinematic finale, gentle piano, warm strings, melancholic "
        "awe fading into calm, hopeful but haunting, purely instrumental. {0}.".format(NEG)
    )},
]

if __name__ == "__main__":
    eleven.build_audio(SLUG, sung=[], spoken=NARRATION, instrumental=SCORE)
