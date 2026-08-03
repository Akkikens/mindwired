"""
codewired podcast — episode 1: "Is AI Actually Replacing Developers?"
CIPHER (speaker A, cyan) vs. DRIFT (speaker B, amber)

Icahn-validated (2026-07-26): headline outlier 73:1 (Mackard, 2.88M views) on
the "AI replacing developers is backfiring" narrative. Full fact base:
docs/planning/CLAIMS-codewired-ai-replacing-devs.md — every factual claim
below traces to a numbered correction/claim in that file. Do not add a
statistic or company detail that isn't sourced there.

The differentiated hook: rather than repeat the viral "AI broke Amazon"
narrative like every other channel in this niche, CIPHER fact-checks it live
on air (it's largely unconfirmed — Amazon's own newsroom disputed the story
that spawned it), then the dialogue pivots to the real, solid, both-sides
research nobody else in the sweep is actually citing.

CIPHER = skeptical, methodical, insists on verification before conclusions
DRIFT  = fast, confident, genuinely believes in the tools, updates on real data
Neither is a strawman — both cite only real, sourced claims from the CLAIMS file.
"""

TURNS = [
    {"id": "h1", "speaker": "B",
     "text": "Okay so you sent me this video with two point eight million views, title is basically, quote, AI replacing developers is going horribly wrong, and you said, and I quote, this is fake."},
    {"id": "h2", "speaker": "A",
     "text": "I said most of it is fake. There's a real story buried under it. But the viral version people are sharing is not that story."},
    {"id": "h3", "speaker": "B",
     "text": "This is going to be one of those episodes, isn't it."},
    {"id": "h4", "speaker": "A",
     "text": "It's going to be exactly one of those episodes."},

    {"id": "c1", "speaker": "A", "chapter": "PART ONE\nTHE VIRAL CLAIM",
     "text": "So the story going around is, Amazon let AI write its code, it caused a disaster, six figures of lost orders, some number of systems down, and now they're quietly hiring humans back to clean it up."},
    {"id": "b1", "speaker": "B",
     "text": "Right, and there was a whole thing about an AI tool deciding to delete and recreate an entire environment on its own."},
    {"id": "a2", "speaker": "A",
     "text": "I went looking for where those specific numbers actually come from. Not the video essay repeating them. The actual source underneath."},
    {"id": "b2", "speaker": "B",
     "text": "And what did you find?"},
    {"id": "a3", "speaker": "A",
     "text": "They trace back to a handful of SEO blogs quoting each other. Not Reuters, not Bloomberg, not the Financial Times, which is the outlet that actually broke the real story underneath this. I could not find those numbers anywhere near a primary source."},
    {"id": "b3", "speaker": "B",
     "text": "Okay, but something real did happen, right? This didn't come from nowhere."},

    {"id": "c2", "speaker": "A", "chapter": "PART TWO\nWHAT ACTUALLY HAPPENED",
     "text": "Something real did happen, and it's honestly a better story than the fake one. The Financial Times reported that an Amazon executive sent an internal email describing a pattern of incidents tied to AI-assisted code changes, serious enough that they wanted senior engineers to sign off before certain changes shipped."},
    {"id": "b4", "speaker": "B",
     "text": "Okay, that's a real story."},
    {"id": "a4", "speaker": "A",
     "text": "Here's the part almost nobody repeats. Amazon's own newsroom directly disputed that story. On the record. They said only one recent incident involved AI in any way, and even that one wasn't AI writing bad code, it was an AI assistant pulling outdated information from an old internal wiki. And it never touched AWS at all."},
    {"id": "b5", "speaker": "B",
     "text": "So the company being blamed came out and said, that's not quite what happened."},
    {"id": "a5", "speaker": "A",
     "text": "Publicly, on their own site. That's an unusually direct rebuttal, and it barely made it into any of the viral retellings, because it's a much less exciting sentence than, AI destroyed Amazon."},

    {"id": "c3", "speaker": "B", "chapter": "PART THREE\nTHE STORY THAT'S ACTUALLY TRUE",
     "text": "Okay, so if the disaster story is mostly fake, is there anything real underneath all of this at all?"},
    {"id": "a6", "speaker": "A",
     "text": "Yes, and it's more interesting than the fake version, honestly. Amazon built its own AI coding tool, called Kiro, and in November of twenty twenty five, leadership told engineers to use it instead of third party tools. Their own memo said they didn't plan to support outside AI coding tools at all."},
    {"id": "b6", "speaker": "B",
     "text": "That sounds like a company betting hard on its own thing."},
    {"id": "a7", "speaker": "A",
     "text": "By May of twenty twenty six, they reversed it completely. Engineers can now use OpenAI's Codex and Anthropic's Claude internally, because, in their own reporting, employees would not stop asking for Claude specifically."},
    {"id": "b7", "speaker": "B",
     "text": "So the actual story is, a huge company tried to force its engineers onto its own tool, and the engineers just quietly won that fight by refusing to stop asking for the other one."},
    {"id": "a8", "speaker": "A",
     "text": "That's the real story. No six figure disaster numbers required. Just, a company's own engineers telling leadership, no, we're using the better tool, until leadership gave in."},

    {"id": "c4", "speaker": "A", "chapter": "PART FOUR\nTHE STUDY EVERYONE MISQUOTES",
     "text": "Now let's talk about the study that actually matters here, because it gets misquoted constantly. METR, an independent research group, not a vendor, ran a real trial in twenty twenty five."},
    {"id": "b8", "speaker": "B",
     "text": "This is the one where developers were slower with AI, right? I've seen that clip a hundred times."},
    {"id": "a9", "speaker": "A",
     "text": "Sixteen experienced open source developers, working on their own real, mature codebases, on real issues from their own backlog. When they were allowed to use AI tools, they took nineteen percent longer than when they weren't."},
    {"id": "b9", "speaker": "B",
     "text": "Okay, so it's true, AI made them slower."},
    {"id": "a10", "speaker": "A",
     "text": "Here's the actual finding, and it's better than that. Before the study, they predicted AI would make them twenty four percent faster. Afterward, having just been measurably slower, they still believed AI had made them twenty percent faster."},
    {"id": "b10", "speaker": "B",
     "text": "Wait, so they were wrong twice. Wrong about the prediction, and then wrong again about their own experience, in the same direction both times."},
    {"id": "a11", "speaker": "A",
     "text": "That gap, between how fast people feel and how fast they actually are, is the real finding. Not the nineteen percent number by itself."},
    {"id": "b11", "speaker": "B",
     "text": "Okay but that was early twenty twenty five. That's not nothing, the tools have obviously improved since then."},
    {"id": "a12", "speaker": "A",
     "text": "Genuinely fair, so I checked. METR actually ran a follow up in twenty twenty six to see if that changed. And in their own words, they now believe their own new data is, quote, an unreliable signal. Developers who didn't want to work without AI kept dropping out of the study, which breaks the sample."},
    {"id": "a12b", "speaker": "A",
     "text": "The raw numbers do lean toward people being faster now. But the confidence intervals are wide enough to include zero, which means it's not something they can actually stand behind yet. Their honest position is, probably faster, based on talking to people, not proven by the data."},
    {"id": "b12b", "speaker": "B",
     "text": "So even the team that found the original slowdown is being careful not to overclaim the fix."},
    {"id": "a12c", "speaker": "A",
     "text": "Which is exactly the discipline I wish more of this debate had. I'm not here to tell you the tools are bad. I'm here to tell you that people, including researchers, are consistently worse at judging AI-assisted speed than they think, in both directions."},

    {"id": "c5", "speaker": "B", "chapter": "PART FIVE\nTHE REAL NUMBERS, BOTH WAYS",
     "text": "Alright, give me the real numbers on your side too, then, not just the scary one. Because I have real numbers on mine."},
    {"id": "b12", "speaker": "B",
     "text": "GitHub's own study had developers finish a benchmark task fifty five percent faster with Copilot. McKinsey surveyed over four thousand developers this year and found AI cut time on routine coding tasks by around forty six percent."},
    {"id": "a13", "speaker": "A",
     "text": "Both of those are real. I'll add the caveats for free. GitHub sells Copilot, so that's a vendor measuring its own product, on one narrow benchmark task. And McKinsey's own number drops to under ten percent gains once you move past routine work into anything complex."},
    {"id": "b13", "speaker": "B",
     "text": "Okay, so routine work, genuinely faster. Hard, novel work, barely moves the needle. That actually tracks with how I use it personally."},
    {"id": "a14", "speaker": "A",
     "text": "Now here's the one that should worry both of us equally. Independent researchers at Stanford found that developers using an AI assistant wrote measurably less secure code, and were more confident it was secure, than developers with no AI assistant at all."},
    {"id": "b14", "speaker": "B",
     "text": "Same pattern as the speed thing. People feel more confident exactly where they should be checking harder."},
    {"id": "a15", "speaker": "A",
     "text": "Exactly the same shape, twice, from two completely unrelated studies. That's not a coincidence I'm comfortable ignoring."},

    {"id": "c6", "speaker": "A", "chapter": "PART SIX\nWHAT NOBODY IN THIS DEBATE SAYS",
     "text": "Here's the thing that actually surprised me most doing this research. Not one of these studies, not METR, not GitHub, not Stanford, not Google's own DORA research, makes the claim that AI is replacing developers."},
    {"id": "b15", "speaker": "B",
     "text": "Wait, none of them?"},
    {"id": "a16", "speaker": "A",
     "text": "None of them. That framing comes entirely from commentary and video titles, ours included, honestly. The actual research is about whether AI makes people faster or better, not whether it eliminates the job."},
    {"id": "b16", "speaker": "B",
     "text": "And Stack Overflow's own survey backs that up too. Usage is up to eighty four percent of developers, but trust in the accuracy of the output is actually falling, not rising, as more people use it."},
    {"id": "a17", "speaker": "A",
     "text": "People are adopting a tool faster than they're learning to trust it. That's a genuinely strange, very human thing to watch happen in real time."},

    {"id": "coda1", "speaker": "B", "chapter": "",
     "text": "So if you had to leave people with one honest sentence instead of a scary headline, what would it be?"},
    {"id": "coda2", "speaker": "A",
     "text": "Every study that actually measured this, instead of just asking people how they felt, found the same gap. People consistently feel more productive and more secure with AI than they actually are. Not useless. Not replacing you. Just, worse at judging itself than it feels like in the moment."},
    {"id": "coda3", "speaker": "B",
     "text": "Which, honestly, might just be true of people using any new tool, not just this one."},
    {"id": "a18", "speaker": "A",
     "text": "Probably. This one just happens to write the code you're going to be debugging at three in the morning."},
    {"id": "end", "speaker": "B",
     "text": "That's the episode. If the fake version of this story is what got you here, hopefully the real one was more interesting. Subscribe to codewired."},
]
