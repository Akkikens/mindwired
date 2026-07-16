# MINDWIRED — Thumbnail Playbook

How to make scroll-stopping, YouTube-grade thumbnails like the GTA 6 winner
("GTA 6'S / WEATHER / CHANGES / OPEN WORLDS / FOREVER" over a hurricane-over-Vice-City scene).

> **Reality check:** full *scene + baked-in text* thumbnails are made by an **image
> model** (GPT-4o / DALL·E 3 / Midjourney), **not** by this repo's Remotion pipeline
> (no image generator is wired in here — only audio). Use **Workflow A** for the
> blockbuster look. Use **Workflow B** when you want pixel-perfect, on-brand text
> over a background you already have.

---

## What makes the winning style work
1. **One dramatic, topic-true scene** — a single readable spectacle (a hurricane hitting the city), not clutter.
2. **Huge layered text, 3–5 short lines**, ALL CAPS, heavy condensed bold, **thick dark outline + drop shadow** so it survives at phone size.
3. **Color-coded emphasis** — the topic keyword in one bold color, the payoff in another. (GTA: WEATHER = yellow, CHANGES = white, OPEN WORLDS = black-on-cyan chip, FOREVER = cyan gradient.) Max ~3 accent colors.
4. **Text on the left ~45%, scene on the right** (or vice-versa) — never let text sit on busy detail. Leave the subject negative space.
5. **High saturation + contrast**, cinematic lighting, brand logo small in a top corner.
6. **Curiosity gap** — the text promises something the scene doesn't fully explain.

---

## Workflow A — Generate the whole thumbnail in an image model (recommended)

Use GPT-4o image / DALL·E 3 / Midjourney. Prompt template — fill the `[...]`:

```
A dramatic, ultra-high-contrast YouTube thumbnail, 16:9, cinematic digital painting,
blockbuster movie-poster style. SCENE (right ~60% of frame): [ONE VIVID SCENE — e.g.
a colossal hurricane vortex with forked lightning towering over a neon Miami / Vice City
skyline at sunset; a rain-slicked highway in the foreground with cars and a box truck;
palm trees bending in the wind; glowing wet reflections]. Vivid magenta-orange sunset
clashing with a purple storm, volumetric light, sharp detail, hyper-saturated.
LEFT ~40%: keep it darker / simpler as negative space for a large text overlay.
No watermark, no random text in the scene.
```

Then add the **text** (either ask the model to render it, or — safer — generate the
scene only and add text in Canva/Figma/Workflow B, because models often garble letters):

```
Big bold all-caps text, heavy condensed sans (Anton / Impact / Space Grotesk), left-aligned,
thick black outline + drop shadow, in 3–5 stacked lines with color-coded emphasis:
  line 1 (white):            "[BRAND/TOPIC, e.g. GTA 6'S]"
  line 2 (YELLOW, biggest):  "[KEYWORD, e.g. WEATHER]"
  line 3 (white):            "[VERB, e.g. CHANGES]"
  line 4 (black on cyan chip):"[OBJECT, e.g. OPEN WORLDS]"
  line 5 (cyan gradient):    "[PAYOFF, e.g. FOREVER]"
Small "MINDWIRED" logo, top-right corner.
```

Tips: generate 3–4, pick the cleanest text; export **1280×720**; keep faces/objects out
of the text zone; check legibility shrunk to ~210px wide (mobile feed size).

---

## Workflow B — Composite text over a background, in code (pixel-perfect text)

When you have a background (an AI scene with **no** text, or your own art) and want
exact brand fonts/colors, drop it in `public/<slug>/img/` and render a Remotion `Still`.
See the working examples:
- `src/attractor/Thumbnail.tsx` — cosmic art + layered text
- `src/gtavi/Thumbnail.tsx` — skyline + storm wash + text

Pattern: full-bleed `<Img>` → a left/bottom dark gradient for legibility → stacked
`DISPLAY`-font headline with color-coded `<span>`s + `WebkitTextStroke` outline → chip →
`MINDWIRED` mark. Register it as a `<Still id="...Thumbnail" width={1280} height={720}/>`
in `src/Root.tsx`, then:
```bash
pnpm exec remotion still src/index.ts <ThumbId> out/<name>-thumbnail.png
```

---

## Filled example — the GTA 6 winner
- **Scene:** hurricane vortex + lightning over neon Vice City at sunset; rain-slick causeway with cars + a "Vice City" box truck; palms bending.
- **Text:** `GTA 6'S` (white) · `WEATHER` (yellow) · `CHANGES` (white) · `OPEN WORLDS` (black-on-cyan) · `FOREVER` (cyan gradient)
- **Logo:** MINDWIRED, top-right.

Adapt per video: keep the text formula (**topic → keyword → verb → object → payoff**),
swap the scene + the keyword color, keep the logo + outline treatment consistent.
