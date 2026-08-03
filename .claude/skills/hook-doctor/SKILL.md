---
name: hook-doctor
description: Rewrite the first 3-15 seconds of a video script for maximum retention. Use when writing or revising any Mindwired long-form or Short, when a video has low average-view-duration or a steep early drop-off, or when the user asks about hooks, intros, or "people click away". The hook decides whether the few people who clicked actually stay — which decides whether YouTube keeps promoting the video.
---

# Hook Doctor — win the first 15 seconds or lose the video

## Why this matters more than the other 59 minutes
YouTube's test audience clicks, then watches ~15-30 seconds. If they bounce, the video
stops being promoted no matter how good minute 4 is. **The single biggest retention
cliff on almost every video is 0:00-0:30.** A great hook can 2-3x a video's reach with
zero change to the rest. This is the cheapest, highest-leverage edit you can make.

## The rules (Mindwired-specific, enforced)

0. **The first 30 seconds delivers the thumbnail's promise, on REAL VIDEO.** Two
   hard constraints that now precede everything else:
   - The package is locked at validation time (icahn-validate Step 4.5) — the hook's
     job is to pay off what the thumbnail teased, fast. A viewer who clicked on the
     radio-log thumbnail must SEE the radio log inside 30s.
   - **Nothing generated, hand-drawn, dossier-style, or still-image-only appears in
     the first 30-60 seconds. Ever.** (Akshay, 2026-08-03: "if we show that generated
     old school stuff... retention rate will be 0% if bad start." Memory:
     `hook-first-30s-real-video`.) Real motion footage only; if the topic has no real
     hook video, that's a topic problem, not a styling problem.
   - A concrete value/stakes claim lands in the FIRST SENTENCE, before any
     scene-setting — a 5,000-script analysis found openings with an explicit
     stakes/value claim average 52% APV vs 44% without.

1. **First sentence = the most shocking TRUE fact of the whole video.** Not a greeting,
   not "in this video", not "space is fascinating", not the logo. State the payoff-tease
   immediately. The viewer must think "wait, what?" within 3 seconds.
   - Weak: "The universe is a strange and wonderful place."
   - Strong: "There is a hole in the universe 330 million light years wide — and it
     should not exist."
   - **Dated/human-thread alternative (the "Fern" cold-open shape, CLAUDE.md
     2026-07-28):** for episodes anchored to a real event, date, and place —
     Black Box Breakdown, true-crime-adjacent Icahn topics — open on the date,
     the named location, then one small concrete action, in that order: "November
     24, 1971. Portland International Airport. A man in a dark suit pays cash
     for a one-way ticket." No rhetorical question, no "imagine this" — start
     inside the moment, not before it. This IS doc-episode's "Cold-open 2.0."

2. **Motion in the first 5 frames.** No slow fade from black. The first scene is already
   moving (per CLAUDE.md the teaser hook plays over content visuals BEFORE the wordmark).

3. **Open a loop you don't close.** Promise a specific answer later and withhold it:
   "One of these theories is happening to you right now — number 5." The brain hates an
   open loop; it keeps watching to close it.

4. **The wordmark intro comes AFTER the teaser, not before** (CLAUDE.md convention).
   Line 1-2 = hook over content, line 3 = wordmark, line 4 = title. Never cold-open a logo.

5. **Second-person > third-person.** "You would not survive one second here" beats
   "Humans could not survive there." Pull the viewer into the frame.

6. **No throat-clearing.** Cut any sentence that is setup, context, or "before we begin".
   Every line in the first 15s must escalate tension or curiosity. If a line can be
   deleted without losing the hook, delete it.

## Process
1. Read the target script's first ~6 lines.
2. Identify the single most shocking true fact anywhere in the video (may be buried at
   the end — pull it to the front as the teaser).
3. Rewrite lines 1-4 to: shock fact → escalate → open loop → (wordmark) → title.
4. Verify: does it obey the teaser-first convention? Is there an unclosed loop? Motion
   at frame 0? Second person where possible? No greeting/logo/throat-clear?
5. Deliver the rewritten opening + a one-line note on which loop it opens and where the
   video closes it (so the payoff actually lands).

## Closing the loop you opened
Rule 3 above says open a loop and don't close it early — but the script's FINAL line
must close it deliberately, not just trail off. Pick one of the **five cliffhanger-ending
patterns** (CLAUDE.md, "Writing scripts that retain viewers"): the unresolved object, the
dated forward jump, the missing piece, the quiet contradiction, or the price line. ≤12
words, lands on a noun/name/date. This sits right before the verbal-bridge + subscribe
line — the cliffhanger closes THIS episode's loop, the bridge opens the next video's.

## Retention beyond the hook (updated 2026-08 against current data)
- **This channel's ~37% average-percent-viewed on 15-25 min docs is already in the
  "strong" band (35-45% benchmark).** Retention is NOT the bottleneck — don't
  restructure videos around it; take only the free script-level wins below. And do
  NOT add cut-count/pacing pressure: the overstimulation meta is dead (MrBeast said
  so publicly; LEMMiNO/Fern's atmospheric pacing is the current growth style).
  Invest in tension architecture, not more cuts.
- **Place the strongest mid-video re-hook at the 55-65% runtime mark** (minutes
  11-14 of a 20-min doc) — the measured mid-video attention trough. Re-hook every
  2-3 minutes otherwise; every re-hook is a tease of a SPECIFIC later reveal.
- **Chapter cards are teases, not labels.** "THE PART NOBODY CHECKED" beats
  "CHAPTER 3 — THE INVESTIGATION". Each card should make skipping feel expensive.
- **Vary the scene every 1-2 lines** (already a CLAUDE.md rule — repetition kills retention).
- **Front-load the best visual.** If the video has one spectacular scene, tease it in the
  first 15s, don't save it for minute 8.
- **Say the searchable proper nouns early and often** ("Amelia Earhart," "Flight
  five two two") — the spoken transcript is now a first-class index for search and
  AI answers, and the SRT upload feeds it. Phonetic TTS spellings stay in the spoken
  text; the SRT from whisper_srt.py restores written forms.
- **Close every loop you opened.** Satisfaction signals (surveys, "not interested"
  taps, return visits) now formally outrank raw watch time in ranking — a viewer who
  feels baited costs future impressions, not just this video's.

## Honesty guard
The hook must be TRUE and the loop must actually pay off in the video. A hook that
overpromises spikes CTR but craters retention and trains YouTube that your clicks are
low-quality — worse than no hook. If the script can't honestly support a strong hook,
the problem is the topic/script, not the wording; say so.
