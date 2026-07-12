# HOOK-LAB — hook A/B, generate → score → pick

The hook (first 3–15s) decides whether the few people who clicked actually
stay, which decides whether YouTube/TikTok keeps promoting the video. It is the
highest-leverage thing to test before publishing. This is the loop, borrowed
from Higgsfield's virality-predictor discipline: **generate several hooks, score
them, publish the winner** — instead of guessing.

## 1. Write 2–3 hook variants (different angles)

Add a `hookVariants` array to `src/viral/plans/<slug>.json`. Give each a
distinct *angle* (personal/body, cosmic/scale, contrarian, question, number):

```json
"hookVariants": [
  {"id": "aging",   "voiceover": "Your head is aging faster than your feet. Right now.",
   "mainText": "YOUR HEAD IS OLDER THAN YOUR FEET", "emphasis": ["OLDER"],
   "rationale": "personal-body angle — visceral, about the viewer"},
  {"id": "noclock", "voiceover": "There is no single now. Nowhere in the universe do two clocks agree.",
   "mainText": "THE UNIVERSE HAS NO MASTER CLOCK", "emphasis": ["NO MASTER CLOCK"],
   "rationale": "cosmic-scale angle — mysterious, big-idea"}
]
```

Angle discipline (what actually moves Hook Score): motion in the first second,
high contrast, a salient/human subject, and coherence between the opening line
and the title/thumbnail. See the `hook-doctor` skill for rewriting the line.

## 2. Generate the narration for each variant

```bash
python3 scripts/hook_lab.py <slug>
```

Writes `public/shorts/<slug>/hooklab/<id>.mp3` (+ real forced-aligned word
timings) and `hooks.json`. Same voice engine as the main build (Hume → Eleven),
so what you score is what ships. Idempotent per variant.

## 3. Render each hook as a short clip

Two paths, both fine to score:

- **Engine render** — set the plan's first scene to each variant in turn and
  render just the opening (or the whole Short) so the hook plays with the real
  camera move, captions and grade. Cheapest true-to-final option.
- **Cinematic footage** — if the hook uses Veo/Kling/Higgsfield footage, drop
  the generated clip in `public/shorts/<slug>/clips/` and composite it through
  the engine as `brollVideo` (NOT a hand ffmpeg edit — see ROADMAP.md "footage
  through Remotion"), so it inherits captions + grade.

## 4. Score with the virality predictor (the agent step)

Ask Claude to score each rendered hook clip with the **Higgsfield virality
predictor** MCP tool. It returns, per clip:

- **Hook Score** — does the first second stop the thumb.
- **Hold Rate** — predicted % who watch to the end (weight this most).
- **Viral Potential (0–100)** + a brain heatmap.

> Scoring calls consume Higgsfield credits — the agent runs them only when you
> ask, on the specific clips you name. `hook_lab.py` never fires a paid call.

## 5. Promote the winner

Copy the winning variant's `voiceover` / `mainText` / `emphasis` into the plan's
first (`hook`) scene, rebuild, and publish. Keep the losing variants in
`hookVariants` as a record of what was tested.

## Why this exists

Small channels live or die on the hook. Manually eyeballing one hook is how most
uploads underperform; a 3-way generate→score→pick loop is a few minutes of
compute that measurably raises average-view-duration — the metric the algorithm
rewards. The same `camera` move + `recipe` vocabulary (ROADMAP.md) lets you vary
the hook's *shot*, not just its *words*, in the same loop.
