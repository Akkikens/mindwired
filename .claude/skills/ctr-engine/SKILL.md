---
name: ctr-engine
description: Generate, score, and BUILD high-CTR titles and thumbnails for a Mindwired video. Runs TWICE per episode — first at Icahn-validation time (packaging-first gate — a topic that can't produce a killer package dies before production), then as final packaging at upload. Use when validating any topic, packaging any video, or when the user asks for titles or thumbnails. For "why no views" run launch-diagnosis first. A thumbnail that exists only as a concept is a failed run — this skill's deliverable is image FILES.
---

# CTR Engine — packaging is the product, and it comes FIRST

## The two truths this skill exists for
1. On a young channel YouTube shows each video to a small test pool; the package
   decides whether it escapes. But this channel's own analytics prove the pool SIZE is
   set by topic+package appeal at the idea level — so packaging is decided **before
   production**, not after the render. (Top creators spend ~30% of effort on
   ideation/packaging; small channels ~5%. MrBeast's workflow generates dozens of
   packaging concepts before shooting anything. Be the former.)
2. **A concept is not a thumbnail.** Audit finding (2026-08-03): every episode since
   ~mid-July shipped metadata with thumbnail *concepts* and no actual image file —
   the single most-controllable CTR lever, skipped at the last step. This skill is
   not done until real image files exist in `out/thumbs/`.

## When it runs
- **Run A — validation gate (inside icahn-validate):** 10 title concepts + 3
  thumbnail concepts per candidate topic. If nothing scores well, the topic FAILS
  validation regardless of demand numbers — no compelling package, no production.
  The winning title+thumbnail concept is recorded in the Icahn memory and **handed
  to the script as a constraint: the first 30 seconds must deliver what the
  thumbnail promises.**
- **Run B — upload packaging:** refine Run A's winner against the finished video,
  BUILD the 3 thumbnail variants as files, set up Test & Compare.

## Process

### 1. Find the ONE curiosity gap
Every winning title/thumbnail pair creates a question the viewer *must* click to
answer, without giving away the answer. Write the gap in one sentence first, e.g.:
- "There's a hole in the universe and it shouldn't exist" (not "The Boötes Void explained")
- "This switch almost stranded them on the Moon" (not "Apollo 11 documentary")
Bad packaging *describes*. Good packaging *withholds*.

### 2. Suggested-adjacency check (2026-08 — this is how small channels scale)
Trending is dead (retired July 2025); essentially all small-channel reach is now
personalized browse/suggested. From the Icahn sweep, name the specific high-traffic
videos this upload should appear NEXT TO (the outlier + ceiling videos already in
the memo). Align title vocabulary and thumbnail visual language with that cluster —
enough that the recommender maps this video to the same viewer population — WITHOUT
cloning any single title (verbatim clones of big titles demonstrably flop on cold
channels; riff, don't copy).

### 3. Titles — generate 10, cut to 3 (2025-26 data-backed spec)
- **30-50 characters.** Large-scale studies (1of10's 323K-video dataset; AIR
  Media-Tech's 18K-channel study) put short titles far ahead — ~30 chars ≈ +60%
  median views vs long. Front-load the payload noun.
- **Negative-emotion STATEMENT beats question** — "vanished," "killed," "never
  found," "the mistake that…" ≈ +20% median views vs neutral/question phrasing.
- **Numbers only when the number IS the story** ("346 people" yes). Generic
  list-format numbers scored −11% median in the same data — but this channel's
  niche has validated listicles, so resolve the tension empirically: run the
  listicle title vs a statement title through Test & Compare, log the winner.
- Proven frames (vary across the 3): contradiction / stakes-threat /
  forbidden-secret / second-person / the-price-line.
- NO clickbait the video can't pay off — satisfaction signals (surveys, "not
  interested" taps, return visits) now formally outrank raw watch time; a
  felt-tricked viewer costs future impressions. NO ALL-CAPS words. NO "..."
- Score each 1-10 on: curiosity gap, first-3-words stopping power, payoff honesty,
  mobile length. Top 3 survive — they double as the title-test variants.

### 4. Thumbnails — 3 concepts, built for 170px (HOUSE STYLE 2.0, 2026-08)
The old "3-5 word ALL-CAPS yellow text" spec is **RETIRED** — it reads content-farm
in 2026 and thumbnail text costs views at scale (−19% median, 1of10 data). New spec:
- **Zero text, or ONE word ≤10 characters covering <7% of the image.** The niche's
  top channels (LEMMiNO, Fern) ship text-free cinematic thumbnails. Any text must
  NOT repeat title words (title asks, thumbnail teases, neither answers).
- **One focal element, separated from a dark background by BRIGHTNESS** — keep the
  channel's dark-cinematic look; put the frame's peak brightness on the focal
  subject only. One dominant shape that survives the 170px squint test.
- **No faces required** — near-zero measured lift for story/documentary niches (and
  never a generated face, per house rules).
- **The real archival asset IS the differentiator** — a real NARA radio log, a real
  NIST simulation frame, a real Kulik expedition photo. Not generic CGI drama every
  copycat channel uses.

### 5. BUILD the thumbnails (mandatory — the step that keeps getting skipped)
Two working paths in this repo, both already proven:
- **Path A (keyart):** Gemini scene-only keyart via the `scripts/gen_af447_thumb.py`
  pattern (copy to `scripts/gen_<slug>_thumb.py`; its style block is already tuned:
  scene only, NO text, negative space) → pick the best frame → add the ≤10-char word
  (if any) via a small PIL overlay. For episodes with strong real archival imagery,
  skip generation entirely: crop/grade the real photo or exhibit directly.
- **Path B (Remotion comp):** a `<Slug>Thumbnail` composition in Root.tsx (existing
  pattern: `NasaUfoFilesThumbnail`), rendered via
  `npx remotion still <Comp> out/thumbs/<slug>_A.png` — pixel-perfect text, reuses
  the episode's own real assets.
Deliverable: **three files** — `out/thumbs/<slug>_A.png`, `_B.png`, `_C.png`
(1280×720 minimum; Test & Compare rejects variants under 720p). Eyeball each at
small size before calling it done. **No files = the run failed.**

### 6. Test & Compare — every long-form, no exceptions
- Upload all 3 thumbnail variants at publish (Studio → Thumbnail → Test & Compare).
- **The winner is picked on WATCH-TIME SHARE, not CTR** — that is the metric YouTube
  itself uses to settle the test; don't override it by eyeballing CTR.
- One variable per test: 3 thumbnails OR 2-3 titles (title testing rolled out
  globally Dec 2025) — never both simultaneously.
- Log the winning *pattern* (frame type, visual class) in
  `docs/planning/LAUNCH-LESSONS.md` so the next package starts from the winner.

## Deliver
- **Run A:** ranked titles + 3 thumbnail concepts + the suggested-adjacency cluster
  + a one-line "the first 30s must show ___" handoff, recorded in the Icahn memo.
- **Run B:** the 3 built PNG files, final title + 2 alternates, the Test & Compare
  setup note, and a one-line prediction of what could make it fail (honesty check).

## What this skill will NOT do
Promise virality, invent fake numbers, approve packaging that overpromises (tanks
satisfaction signals = future impressions), or count a run as done without image
files in `out/thumbs/`. If the topic has no proven demand, point to icahn-validate
first — and if no package concept scores, say the topic should die NOW, before a
dollar of production is spent on it.
