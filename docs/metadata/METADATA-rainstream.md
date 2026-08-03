# METADATA — rainstream (mindwired 24/7 LIVE, "Space Rain")

Channel: **mindwired** (@MINDWIREDD). Format: permanent 24/7 YouTube Live.
Comp: `RainStreamLoop` (60s seamless visual) → `build_rain_stream_video.sh`
→ `rain_restream.sh` (passthrough push). **1080p, not 4K** (Akshay's call
2026-08-01 — at 24/7 the egress bill dominates: ~1.5 TB/mo at 1080p vs
~4.9 TB/mo at 4K, for a dark slow scene mostly watched on phones/background
tabs).

**No Super Chat overlay this time** (Akshay, 2026-08-01) — which is what
lets the whole thing run as a pure `-c:v copy` passthrough on a small VM.
Encourage supporters in the DESCRIPTION and pinned comment instead of
on-screen.

## LICENSING — the whole point of this rebuild
The previous 24/7 stream took a real Content ID claim ("Memory" by Oleg
Mazur, sourced via a SoundCloud "Free Music" reuploader — provenance we
couldn't defend). Everything here is claim-proof by construction:
- **Rain: generated in-house** (ffmpeg noise shaping, `scripts/build_rain_stream_audio.py`).
  We own it outright. There is no rights-holder to claim it.
- **Music: Scott Buckley, CC BY 4.0, downloaded from the artist's own site**
  (scottbuckley.com.au) where he states the licence himself — first-party
  provenance, not an aggregator's label.
- **Visuals: generated in-house** (Imagen plates + Remotion animation).
Attribution for Buckley is REQUIRED and lives in the description below.

## Title (primary)
Space Rain · Lofi Sleep & Study · 24/7 Rain Sounds in Deep Space 🌧️🛰️

### A/B alternates
- 🔴 Rain on a Spaceship Window · Lofi Beats to Sleep & Study to · 24/7
- Space Rain 24/7 · Rain Sounds for Sleep, Study & Anxiety Relief 🌧️
- 24/7 Lofi Rain in Deep Space · Sleep · Study · Relax 🛰️🌧️

Keep the 🔴 or 🌧️ — live streams win the scroll on the thumbnail-adjacent
emoji, and "24/7" is the strongest single search token in this niche.

## Thumbnail
A frame from the loop itself: the spacecraft window, rain beaded on the
glass, nebula beyond. Text: "SPACE RAIN" (2 words, white/cyan, upper-left or
bottom-left, clear of the window's centre). Optional small "24/7" badge.
Dark, high-contrast, reads at 170px. Pull the frame with:
`ffmpeg -ss 12 -i out/rainstream_loop.mp4 -frames:v 1 out/qa/rain_thumb.png`

## Description
Rain on a spaceship window, 24 hours a day.

Somewhere out past the last relay, it's raining on the glass — and beyond
it there's nothing but a nebula, a sleeping Earth, and quiet. Put this on
and let it run: for sleep, for studying, for winding down when your head
won't stop.

🌧️ What you're hearing: gentle, continuously evolving rain — the texture
shifts slowly between soft drizzle, steady rain, rain on the window and
distant downpour, so it never loops back on itself the way most rain
videos do. Underneath it, slow ambient piano and strings, crossfading
track to track.

🛰️ What you're seeing: a quiet spacecraft cabin, rain running down the
window, deep space drifting past outside.

Perfect for: falling asleep · studying and deep work · reading · anxiety
and overthinking · white noise for a restless room · background for long
work sessions.

No ads interrupting your sleep where we can help it. No jump scares, no
sudden volume changes, nothing bright enough to wake you. Just rain.

💙 If this helped you sleep or focus, a Super Thanks or a channel
membership keeps the stream running — it costs real money to keep a 24/7
broadcast alive, and supporters are the reason it stays up. Even a comment
telling us what you're using it for genuinely helps the algorithm keep it
alive for the next person who needs it at 3am.

🎧 Best with headphones or a speaker with some low end.

MUSIC
"Decoherence", "In Search of Solitude", "Moonlight", "Permafrost", "First
Snow", "Cirrus", "Reawakening", "Within Our Nature", "Effervescence",
"Phase Shift", "Cicadas", "Life in Motion", "Echoes", "Meanwhile", "Eyes in
the Void", "Penumbra", "Wildflowers", "Memories of Stone", "Convergence",
"Unraveling", "Home Was You", "Hymn to the Dawn" — all by **Scott Buckley**
(scottbuckley.com.au), licensed **CC BY 4.0**.
Rain sounds and all visuals: created in-house by mindwired.

▶ MORE FROM MINDWIRED
21 Astronauts Never Came Home. Here's Every Story.: https://youtu.be/maxZwNGqIDU
The Lost Cosmonauts the USSR Pretended Never Existed: https://youtu.be/Hs6ZzZAQ7ms
Every Astronaut Who Almost Died in Space: https://youtu.be/0ovoWoiRBXg
Full playlist — Space Documentaries: https://www.youtube.com/playlist?list=PLSGw_l2_Tsdo
Subscribe: https://www.youtube.com/@MINDWIREDD?sub_confirmation=1

## Tags (492/500 chars — one comma-separated line)
rain sounds,lofi rain,24/7 lofi,sleep music,study music,rain for sleeping,space rain,lofi hip hop radio,rain sounds for sleeping,relaxing music,white noise,anxiety relief,deep sleep,focus music,ambient music,rain on window,study with me,insomnia help,calm music,background music,lofi radio,sleep sounds,rainstorm,space ambience,concentration music,stress relief,mindwired,chill music,night rain,lofi beats,rain ambience,sleep aid,study session,lofi chill,relaxing rain sounds,rain white noise

## Hashtags (15 — first 3 show above the title)
#RainSounds #LofiHipHop #SleepMusic #StudyMusic #Rain
#24_7 #Lofi #SpaceAmbience #Relaxing #WhiteNoise
#DeepSleep #FocusMusic #AnxietyRelief #ChillBeats #Mindwired

## Pinned comment
Rain on a spaceship window, running 24/7. 🌧️🛰️ The rain here is
continuously evolving — it never loops back on itself, so it shouldn't get
that "same 3 minutes again" feeling most rain videos have.

What are you here for — sleeping, studying, or just quieting your head?
Tell us below; it genuinely helps this reach the next person who needs it
at 3am. 💙

Music by Scott Buckley (scottbuckley.com.au), CC BY 4.0. Rain and visuals
made in-house.

## Live stream settings (Studio)
- **Category:** Music (this niche is categorised Music, not Science)
- **Latency:** Normal (lowest CPU/bandwidth; nobody needs low-latency chat here)
- **DVR:** on · **Chat:** on · **Age restriction:** none · **Made for kids:** NO
- **Monetization:** on; mid-rolls **OFF** or heavily limited — ads waking a
  sleeping viewer is the single fastest way to lose this audience
- **Thumbnail:** frame from the loop (see above)
- **Auto-start / auto-stop:** OFF (the stream must survive brief encoder
  hiccups without YouTube ending the broadcast and minting a new video ID —
  the bug that broke the previous stream twice)

## Ops (how it actually runs)
```
scripts/build_rain_stream_audio.py --hours 3      # evolving rain + music bed
npx remotion render RainStreamLoop out/rainstream_loop.mp4
scripts/build_rain_stream_video.sh                # encode ONCE -> rain_stream_final.mp4
scripts/rain_restream.sh                          # passthrough push (tiny VM)
```
Passthrough means ~2-5% CPU instead of ~190% — an **e2-small** is enough.
Regenerate the audio bed periodically (different seeds = different rain) so
long-session listeners never hear a repeat.

## SEO notes
The searchable demand here is "rain sounds", "lofi", "sleep music",
"study music" — the space angle is the DIFFERENTIATOR, not the search term.
That's why the title leads with "Space Rain · Lofi Sleep & Study" and lets
the niche keywords carry discovery, rather than leading with the space
concept alone.
