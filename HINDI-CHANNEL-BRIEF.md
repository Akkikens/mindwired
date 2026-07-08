# DimaagBatti — Hindi Explainer Channel — build brief (paste into a fresh chat)

**Channel name: DimaagBatti** (दिमाग़ बत्ती = "the mind's lightbulb", the aha/"now I get
it" moment). Handle @dimaagbatti (taken by Akshay 2026-07-07). Watermark/brand =
"DimaagBatti" + 💡. Visual identity: glowing lightbulb with a brain filament, warm yellow
on dark; use a "batti on" bulb-glow flourish as the signature transition when a point
lands. Tagline: "हर मुद्दा, आसान भाषा में".

Copy everything below the line into a new Claude Code chat in the `mindwired` repo.

---

You are building a **Hindi YouTube explainer channel** in the style of **Dhruv Rathee /
Nitish Rajput**: clear, factual, deep-dive explainers on economy / geopolitics /
"how things work", with a calm authoritative Hindi narrator + heavy on-screen
**animated charts, maps, and kinetic Hindi text** (not cinematic b-roll). Repo:
`/Users/akshay/Documents/GitHub/mindwired`. Read `CLAUDE.md` + `src/viral/README.md`
first. Relevant memory: `astrokobi-host-short-pipeline`, `cloned-channel-voice`,
`paid-clip-library`.

## First video
**Topic:** "रुपया लगातार क्यों गिर रहा है?" (Why does the Indian rupee keep falling?) —
economy explainer. Build a tight **~90-second vertical (1080×1920) first cut** to prove
the format, then scale to a 3–4 min long-form once approved.

## Voice (LOCKED)
**Rohan – Steady Communicator**, Cartesia, voice id `4877b818-c7fe-4c89-b1cf-eadf8e23da72`,
`language: "hi"`, model `sonic-3.5`, speed ~0.95, via `.venv-lipsync/bin/python`
(needs httpx). ⚠ `scripts/lib/cartesia.py` currently HARD-CODES `language:"en"` and
`DEFAULT_VOICE` = the English space clone — so add a `language` param (default "en") and
pass `"hi"` + Rohan's id for this channel (don't overwrite the mindwired default).
`build_short.py`'s cartesia path must forward the Hindi voice + language.

## Visual approach (KEY — keeps it cheap)
Dhruv's look is mostly **free procedural graphics**, which is perfect given the cost caps:
- **Build procedurally in Remotion (FREE):** animated line charts (rupee-vs-dollar
  falling), bar charts (imports vs exports, oil bill), count-ups (₹ figures), India/world
  maps, document/headline call-outs, and **kinetic Hindi captions**. This is 80–90% of a
  Dhruv-style video and costs nothing.
- Add these as new scene components (extend `src/viral/scenes` or a new `src/hindi/`).
- **Paid b-roll only where essential** (RBI building, cash, oil tankers, ports): use
  **Higgsfield Kling** (see cost caps below) or **Veo** — but sparingly.

## ⚠ Cost caps (hard constraints from Akshay)
- **Higgsfield: max 110 credits PER GENERATION.** He can top up 110 repeatedly, but no
  SINGLE generation may exceed 110cr. Individual Kling clips (~7.5cr/5s) are fine —
  just never fire one giant multi-scene "Explainer" generate (~104cr for 30s is near the
  cap). Generate clip-by-clip, download each, continue.
- **Veo (Gemini) costs real money** (~$1–2 per 8s clip). Minimize. Prefer procedural.
- Net: **lead with free procedural charts/maps/Hindi text; use paid b-roll rarely.**

## New requirement: Devanagari font
Current channel fonts (Space Grotesk / Inter) are Latin-only — Hindi will render as
boxes. Add **Noto Sans Devanagari** (TTF) to `public/fonts/`, register it in
`src/lib/fonts.ts` (loadFont), and use it as the font family for all Hindi text in the
caption/chart components. Verify by rendering a still with Hindi text before a full render.

## Pipeline (per video)
1. Write the Hindi script (short declarative sentences, one idea per scene; numbers
   numeric; Dhruv-style hook in line 1).
2. Plan JSON (`src/viral/plans/<slug>.json`) — scenes = mostly `data`/`shockfact` with
   procedural charts + `mainText` Hindi + `emphasis`.
3. Audio: `build_short.py <slug> --voice cartesia` (routed to Rohan/hi).
4. Register comp in `src/Root.tsx`; render `render_and_master.py Short<Name> out/<name>.mp4`
   (−14 LUFS). No `--gl` needed.
5. Thumbnail (Nano Banana / Gemini image) + Hindi metadata (title/desc/tags).

## ⚠ ACCURACY RULE (learned the hard way — the rupee looked wrong)
AI video models (kling/Veo) **cannot draw specific symbols, text, Hindi words, or exact
numbers** — they garble them (a prompted "₹ rupee symbol" came out as an unreadable
cracked glyph). So:
- **Higgsfield generates ONLY the whiteboard hand + drawing motion + generic shapes.**
- **Overlay ALL facts as crisp Remotion graphics on top:** the real ₹ symbol, Hindi
  labels (Devanagari font), real numbers, real chart values, "$1 = ₹88", etc. This is
  free and 100% accurate. Never rely on the AI to render a symbol/number/word.
- For recognizable currency, either overlay a real ₹500-note graphic, OR feed Higgsfield
  a **reference start_image** of a real ₹500 note (Gandhi portrait, "500", Ashoka pillar)
  so it animates the correct object.

## Better Higgsfield prompt rules (mine were too generic)
- Name the **recognizable real object** ("Indian 500-rupee banknote with Mahatma Gandhi's
  portrait and the number 500"), not an abstract glyph.
- Specify: exact camera/hand action, what is drawn first→last, line weight, the ONE accent
  color, timelapse speed, "clean white whiteboard", and hard negatives ("no invented
  symbols, no gibberish text, no watermark").
- Keep each scene to ONE clear visual idea. Leave space in the composition for the
  Remotion text/number overlays.
- Example (hook): "2D whiteboard marker timelapse, a hand quickly sketches a plain
  rectangular banknote with a simple portrait face on the left and a blank center circle
  (label added later in post), the note then wilts and curls downward. Bold black marker
  on clean white, one red accent, hand-drawn, smooth. No text, no numbers, no symbols —
  leave them blank for overlay. No watermark."

## 🎯 CURRENT TASK for the new chat: 16:9 long-form in 30-second chunks
Akshay wants a **~4-minute 16:9 (1920×1080)** DimaagBatti explainer, generated in
**30-second chunks** because of the Higgsfield **≤110 credits-per-generation** cap +
recharge loop. Workflow:
1. First video already built (9:16 proof): `out/dimaagbatti_rupee.mp4`, comp
   `src/dimaagbatti/RupeeShort.tsx`. **Adapt that comp to 16:9** (1920×1080) and a longer
   scene list.
2. **Per 30s chunk:** generate ~5 whiteboard clips (kling3_0_turbo, `aspect_ratio:"16:9"`,
   5s each ≈ 7.5 cr → ~37 cr/chunk — safely under the 110/gen cap). Prompts: generic
   doodles, **no text/numbers/symbols** (overlay those). Akshay will DOWNLOAD the clips
   and drop them in `public/shorts/<slug>/broll-video/`.
3. ~102 credits ≈ 2 chunks (~60s). When it runs out, Akshay recharges 110 → next chunks.
   Repeat until ~8 chunks ≈ 4 min.
4. Rohan Hindi VO per scene (Cartesia, `language:"hi"`, id 4877b818…) as the main audio
   track ("Hindi voiceover in bg"); optional low bed music.
5. Overlay all facts (₹, numbers, Hindi captions) in Remotion with Noto Devanagari
   (already wired). Render each chunk, then concat chunks → master to −14 LUFS.
6. Keep DimaagBatti 💡 branding + a "batti-on" bulb-glow accent.

Start by picking the topic (e.g. रुपया deep-dive, UPI, India–China), writing the full
Hindi script broken into ~5s scene beats, then generating chunk 1's whiteboard clips.

## Style/quality rules
- Prompts for any paid clip must be RICH (lens, motion, lighting, palette) — basic
  prompts → basic videos.
- Tight pacing (Dhruv cuts fast); minimize dead air between scenes.
- Keep ONE consistent Hindi voice (Rohan) across every clip and video.

Start by: (1) adding the Devanagari font + Hindi Cartesia routing, (2) writing the rupee
script, (3) building 2–3 procedural chart/caption scenes as a proof still, then render the
90s first cut.
