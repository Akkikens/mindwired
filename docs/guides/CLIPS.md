# AI Video Clips in Mindwired

A `ClipScene` ([src/components/ClipScene.tsx](src/components/ClipScene.tsx)) lets any
AI-generated video clip play as a full Mindwired scene — under the channel's grade,
vignette, grain, and the standard overlays (chapter title, key-only captions,
count-up stat callouts). Use it for shots real photos + Remotion can't do: a moving
astronaut, a camera fly-through, a collapsing structure, atmospheric motion.

## Workflow

1. **Generate the clip** in any AI video tool (see below). Target **1920×1080, 16:9,
   ~8–10s, no on-screen text, silent** (VO comes from ElevenLabs). Cinematic, slow,
   dark — match the channel.
2. **Drop it in** `public/<slug>/clips/<name>.mp4`.
3. **Use it in a scene:**
   ```tsx
   <ClipScene src="scariest/clips/rogue.mp4" durationInFrames={sc.durationInFrames}>
     <ChapterTitle chapter="No. 8 · Rogue Planets" title={"THE WANDERING\nWORLDS"} />
     <StatCallout value="270°C BELOW" label="a world with no sun" appearAt={90} hold={5} />
     <Captions clipId="rogue" startFrame={narrationStart} lines={captionLines("rogue")} select="key" />
   </ClipScene>
   ```
   The clip is muted by default (won't fight the VO), gets a gentle Ken-Burns push +
   edge fades, and freezes on its last frame if the scene outlasts the clip.
   Watermarked output: the `kenBurns` scale usually crops it; else cover with a logo.

## Tools (generate the same scene in 2–3, pick the best — that's what the pros do)

- **Google Flow / Veo** — highest quality; free tier has daily generation caps.
- **Runway (Gen-3/4)**, **Kling**, **Pika**, **Luma** — strong alternatives; each renders
  the same prompt differently, so generate across a couple and choose.
- Availability + pricing shift constantly; "unlimited free" claims (e.g. for Veo in
  Google Vids) are usually overstated — verify current limits before relying on them.

## Prompt template (tuned for Mindwired's cinematic-cosmic look)

> Cinematic space documentary shot, [SUBJECT], slow deliberate camera push-in, deep
> blacks, cold cyan and amber highlights, volumetric light, photoreal, film grain,
> anamorphic, 8 seconds, no text, no captions, no watermark, 16:9.

Swap `[SUBJECT]`, e.g.:
- `a lone dark rogue planet drifting through starless interstellar space, no sun`
- `a magnetar neutron star with violent magnetic field lines, plasma streaming`
- `slowly falling into a supermassive black hole, accretion disk glowing`
- `a vast empty void of space, almost no galaxies, profound loneliness`

Keep motion **slow** — fast AI motion reveals artifacts and clashes with the doc pace.

## Notes

- `OffthreadVideo` (used by `ClipScene`) is the render-accurate video component.
- Live template composition: **ClipSceneDemo** (`pnpm dev`) shows a clip under a
  chapter title + count-up stat.
- Credit generated content appropriately; check each tool's commercial-use terms.
