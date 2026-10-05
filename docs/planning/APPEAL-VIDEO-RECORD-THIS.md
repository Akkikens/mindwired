# RECORD THIS — the YPP appeal video narration (one take, your voice)

This is the ONLY missing piece of the appeal video. Everything else — the
visuals, the comp, the evidence panels — is built and registered
(`MindwiredProcessDoc`). Your recording becomes the narration spine; the
pipeline cuts it into scenes automatically.

## How to record (2 minutes of setup)

- **Phone voice memo or QuickTime on the Mac — either is fine.** Honest beats
  polished; don't chase studio quality. Quiet room, phone ~30cm from your
  mouth, no fan/AC right next to you.
- Read the numbered beats below **in order, one take**. Leave a **~2 second
  pause between beats** (that's what the auto-splitter cuts on).
- Flubbed a line? Pause, and **re-read that whole beat** — the splitter
  aligns on each beat's opening words and takes the later match; worst case
  I trim it.
- Read naturally, like you're explaining it to one person. Don't rush —
  target is around four minutes; anything under ~4:50 total is fine.
- Numbers/URL are written the way you should SAY them.

## Send it back

```
mkdir -p ~/mindwired/recordings
# save/AirDrop your file there as appeal_vo.m4a (or .mp3/.wav), then:
cd ~/mindwired
git checkout claude/best-video-project-lf3bau && git pull
git add -f recordings/appeal_vo.m4a
git commit -m "Appeal VO take (Akshay)" && git push
```

Then tell Claude it's pushed. The rest (split → manifest → preflight →
4K GCE render command) happens from there.

---

## THE SCRIPT — read each numbered beat, pause ~2s between them

**1.**
Hi. I'm Akshay, and I run the YouTube channel mindwired. You can find it at
youtube dot com, slash, at mindwired, spelled with two d's.

**2.**
I'm making this video because a review flagged my channel as generic or
repetitive content. I don't believe that's a fair read of the work. So
instead of arguing about it, I'm going to show you, step by step, how an
episode here actually gets made.

**3.**
Everything you're about to see is real: the actual research files, the
actual quality gates, and the actual footage logs behind the newest episode
on this channel.

**4.**
You're watching mindwired.

**5.**
Here is how a mindwired episode gets made, in four steps.

**6.**
Step one. Prove the topic deserves to exist.

**7.**
Nothing here gets made on a hunch. Before any production starts, I research
real audience demand: which versions of a topic massively outperformed the
channels that posted them. This is the actual research entry for the newest
episode. Real view counts, real ratios, and a locked decision at the bottom.

**8.**
Step two. Build the fact base before the script.

**9.**
Every claim that reaches an episode has to trace back to a sourced fact base
first. This is the real one for the Project Hail Mary episode: pages of
claims tied to published science journalism, named researchers, and the
author's own public interviews.

**10.**
It opens with a corrections section: places where the popular version of a
story gets the science wrong, which the episode then fixes on screen. When a
claim is contested, the episode says so. When the science kills a good line,
the line dies.

**11.**
Step three. Real footage, logged and licensed.

**12.**
The visuals are real archival material from public domain government science
sources, fetched fresh for every episode. Every file lands in an attribution
log with its origin and license. This is the actual log.

**13.**
And there are standing honesty rules, in writing: no footage presented as
something it isn't, recreations labeled as recreations, and no real event
shown through generated imagery when archival coverage exists.

**14.**
Step four. Gates that can block the whole video.

**15.**
Before anything renders, a preflight check runs over thirty hard gates:
stale narration, missing sources, recycled hook footage, broken visuals. One
failure blocks the render entirely. This is the real output for the newest
episode. Zero blocking issues.

**16.**
And here's the part I want to be direct about. I do use artificial
intelligence tools in this pipeline, for the narration voice and parts of
the assembly. I'm scaling that back, with more of the research, the writing,
and the narration done myself. Starting with this video, which is my own
voice.

**17.**
But the judgment was always human. What gets covered, what counts as true,
what ships. That's me, on every upload. Nothing publishes without me
reviewing it start to finish.

**18.**
So. Is this channel generic?

**19.**
This channel is more than thirty long form episodes, each built with its own
researched fact base, its own fresh archival footage, and its own packaging,
on subjects viewers demonstrably search for. That's not generic, and it's
not repetitive. It's a one person documentary operation with written
editorial standards, applied on every upload.

**20.**
I'd ask you to take another look at mindwired with all of that in mind.
Thank you for your time. I'm Akshay, and the channel is youtube dot com,
slash, at mindwired, with two d's.

---

*(These 20 beats are exactly the scene texts in
`src/mindwired-doc/docs/mindwiredprocess.json` — if you change any wording
here while recording, that's fine for small ad-libs, but tell Claude so the
on-screen doc text can be matched to what you actually said.)*
