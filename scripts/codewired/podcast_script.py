"""
codewired podcast — episode 1 (PROTOTYPE SEGMENT): "Is Vibe Coding a Trap?"

Icahn-validated angle (2026-07-26 sweep): DevForge's "Vibe Coding is a Trap
(What Senior Devs See That You Don't)" hit 26.7:1 (354,928v/13,300 subs, fresh
Feb 2026) — the strongest fresh outlier in the whole niche sweep. Ceiling proof:
Nick Saraev's 4-hour Claude Code course did 2.18M views, and dialogue/interview
format is separately proven (Lenny's Podcast x Boris Cherny, 549K views).

This is a ~9-minute PROTOTYPE of the two-host engine — validate the visuals/
voices/pacing here before writing the full ~1-hour episode. Two hosts:
  DEV  (speaker A, cyan)  — skeptical senior engineer, has shipped for a decade
  VIBE (speaker B, amber) — enthusiastic AI-native builder, ships fast with agents
Structure mirrors the winning DevForge framing: steelman vibe coding's real
upside, then show what senior devs actually see that beginners miss, land on a
synthesis rather than a dunk (matches Black Box's own attributed-not-asserted
honesty discipline, ported to a tech-opinion format: strong claims, but never
"vibe coding is definitively X" as flat fact — always framed as "here's the
tension" / "here's what I've seen").
"""

TURNS = [
    {"id": "h1", "speaker": "A",
     "text": "So I want to start with something that's going to annoy half our audience immediately."},
    {"id": "h2", "speaker": "B",
     "text": "Oh, good. Love that energy. Go."},
    {"id": "h3", "speaker": "A",
     "text": "Vibe coding is a trap. Not because AI can't write code. Because it can write code that looks finished when it isn't, and most people can't tell the difference until it's in production."},
    {"id": "h4", "speaker": "B",
     "text": "Okay, but that's the same thing senior developers said about frameworks. About stack overflow. About every tool that made building faster. Someone always says the new thing hides the real skill."},
    {"id": "h5", "speaker": "A",
     "text": "Sure, and sometimes they were wrong. But I've been shipping software for over a decade, and I want to be specific about what's actually different this time, not just vibes versus vibes."},

    {"id": "c1", "speaker": "A", "chapter": "PART ONE\nTHE REAL UPSIDE",
     "text": "Let's steelman your side first, because it's a real one. What's actually good about vibe coding, in your own words?"},
    {"id": "b1", "speaker": "B",
     "text": "The upside is speed to a working thing. I can describe a feature in plain English, get a working version in minutes, and iterate by talking instead of typing every line myself. For a solo builder or a small team, that's not a toy. That's real leverage."},
    {"id": "a2", "speaker": "A",
     "text": "I'll go further than you expected. I think that leverage is completely real, and anyone dismissing it outright is coping. I use agentic tools every day now. That's not the trap."},
    {"id": "b2", "speaker": "B",
     "text": "Okay, so where is the trap, exactly?"},

    {"id": "c2", "speaker": "A", "chapter": "PART TWO\nWHAT SENIORS SEE",
     "text": "The trap is in what the output hides. When an agent generates code, it also generates the appearance of understanding, and those are not the same thing."},
    {"id": "a3", "speaker": "A",
     "text": "A senior engineer looks at a pull request and doesn't just ask, does this run. They ask, what happens when this input is empty, what happens under load, what happens when someone touches this file in eight months and doesn't know why it's shaped this way. Vibe coding, done carelessly, skips straight past all of that."},
    {"id": "b3", "speaker": "B",
     "text": "That's fair, but I'd push back on one word. Careless. That's a discipline problem, not a tool problem. A careless developer wrote bad code in 2015 too, they just did it slower."},
    {"id": "a4", "speaker": "A",
     "text": "Sure, but speed changes the failure mode. Slow bad code gets caught in review because there's time to think. Fast bad code gets shipped before anyone, including the person who quote wrote it, actually understands what it does."},
    {"id": "b4", "speaker": "B",
     "text": "Okay, I actually agree with that specific point. Speed without a review habit is where I've personally gotten burned."},

    {"id": "c3", "speaker": "B", "chapter": "PART THREE\nTHE ACTUAL SKILL",
     "text": "So let me flip it back on you. If vibe coding isn't going away, and it isn't, what does the skill of doing it well actually look like?"},
    {"id": "a5", "speaker": "A",
     "text": "It looks like the same skill that made someone a good engineer before agents existed. Reading code critically. Knowing what question to ask. Vibe coding doesn't remove the need for engineering judgment. It just moves that judgment from writing the first draft to reviewing it."},
    {"id": "b5", "speaker": "B",
     "text": "So the people getting burned aren't people using AI. They're people using AI as a replacement for judgment, instead of alongside it."},
    {"id": "a6", "speaker": "A",
     "text": "Exactly. And that's a harder sell as a headline than vibe coding bad or vibe coding good. But it's the actual answer, and it's the one senior developers I respect keep landing on."},

    {"id": "coda1", "speaker": "B", "chapter": "",
     "text": "So if you're someone learning to build with these tools right now, what's the one habit you'd tell them to build first?"},
    {"id": "coda2", "speaker": "A",
     "text": "Read every line before you ship it, at least once, slowly, like you're the one who's going to get paged at 3 AM when it breaks. Because eventually, you will be."},
    {"id": "end", "speaker": "B",
     "text": "That's it for this one. If this got under your skin a little, good, that was the point. Subscribe to codewired for more."},
]
