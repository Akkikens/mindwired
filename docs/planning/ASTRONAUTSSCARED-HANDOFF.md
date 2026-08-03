# ASTRONAUTSSCARED — "Astronauts Were Asked What Scared Them Most in Space" (mindwired)

Single-file summary of everything done on this episode. Read `CLAUDE.md` first
for the production manual; this doc is the episode-specific state.

## Status: 4K RENDER DONE, VERIFIED — thumbnail image/Shorts/commit remain

## Files
| What | Path |
|---|---|
| Fact base (GATE — every script line traces here) | `docs/planning/CLAIMS-astronautsscared.md` |
| Doc spec (55 scenes) | `src/mindwired-doc/docs/astronautsscared.json` |
| Dossier concept sidecar | `src/mindwired-doc/docs/astronautsscared.dossier.json` |
| Comp registration | `src/Root.tsx` → `AstronautsScaredDoc` (MW_OUTRO baked, 527f) |
| Icahn validation | memory `icahn-astronauts-scared` (live re-check 2026-07-31, PASS) |
| METADATA (title/desc/tags/chapters) | `docs/metadata/METADATA-astronautsscared.md` |
| Rendered master | `out/astronautsscared_gce.mp4` |
| Upload-ready copy | `mindwired_Astronauts Were Asked What Scared Them Most in Space.mp4` (repo root) |
| SRT | `mindwired_astronautsscared.srt` |

## 1. Topic — live-validated 2026-07-31, flipped mid-session
Originally the queue's #1 mindwired pick was "Objects Astronomers Can't
Explain" (Wow signal/'Oumuamua/Tabby's Star). A live re-check that day
couldn't relocate that topic's deciding headline stat (a channel called
"MindFold," 105.8:1) — direct search surfaced only unrelated sleep-mask/
music channels. Meanwhile this topic, previously the runner-up (passed over
only on channel-diversity grounds, never on weaker numbers), re-verified
cleanly: **183.1:1** headline (Deep Dive Space, 408,341v/2,230s, fresh) +
**12.1:1** corroborator (Some Guy Who Knows Stuff, 1.37Mv/113Ks, fresh) +
ceiling proof (Simple Paint 5.68M, ColdFusion 17M, WIRED 36M). Recognition
3/3 — no title/thumbnail bridge needed, unlike the objects topic's required
2/3 bridge. Full reasoning: memory `icahn-astronauts-scared`.

## 2. Format — explicitly NOT a deaths angle
mindwired already has "21 Astronauts Never Came Home" and "Every Astronaut
Who Almost Died" covering deaths. This episode is a **ranked-testimony
compilation of survivors** — 12 real astronauts/cosmonauts recounting their
own scariest moment, in their own words, sourced to mission transcripts,
memoirs, NASA investigation boards, and direct interviews. Zero invented
dialogue for any named person, living or deceased.

## 3. Research — 5-agent parallel fan-out (Workflow)
Four agents covered Gemini/Apollo, Soviet/Russian, Shuttle, and ISS/modern
eras independently; a fifth agent (footage scout) cross-checked real
archival coverage for every candidate and produced the final ranked 12.
Key finds baked into `CLAIMS-astronautsscared.md`'s DATA CORRECTIONS block:
- The movie line "Houston, we have a problem" is NOT the real Apollo 13
  quote (Swigert said it first, past tense) — corrected.
- The Curbeam ammonia-leak incident is STS-98 (2001), not STS-116 (2006) as
  a secondary source misdates it.
- STS-51-F's real in-flight abort has NO genuine first-person fear-quote
  findable — that entry was EXCLUDED from the final 12 for this exact gap,
  rather than inventing one.
- Tim Peake has no genuine first-person quote for the 2016 EVA-35 echo
  incident (his own blog post was staff-written) — that entry excluded too,
  redundant with Parmitano's stronger, fully-quoted story anyway.
- Jim Lovell died August 2025 (very recent) — framed in memoriam; Fred
  Haise (living, 92, last survivor) leads the Apollo 13 entry instead of the
  over-told "Houston" beat.

## 4. Footage — real, frame-verified for 9 of 12 entries
First automated fetch pass badly mismatched 6 of 9 video-needing beats
(generic NASA library keyword collisions — e.g. "mir_docking" pulled a
Hubble Space Telescope explainer, "gemini9_eva" pulled James Webb Crab
Nebula footage). Caught via `audit_scene_relevance.py` + manual title
inspection, then fixed via a 6-agent + 1 solo corrective pass that found
and verified the ACTUAL real footage:
- **Exact-incident matches (frame-verified, not just title-matched):**
  Parmitano EVA-23 (real NASA helmet-cam + the actual faulty-suit demo
  video), STS-27 tile-damage inspection (real 1988 OPF footage), Gemini 8
  splashdown/recovery (real 1966 NASA documentary, shot-by-shot confirmed),
  STS-74 Mir docking (real IMAX 65mm footage), STS-120 Parazynski repair
  (real NASA post-flight presentation reel).
- **Real same-mission bracketing footage** (exact moment has no free
  coverage, but real footage of the same spacewalk/mission is used):
  Feustel STS-134 EVA-3, Gemini 9-A mission footage (suit-up/launch/ATDA —
  the actual ~2hr EVA itself has no freely-licensed footage anywhere;
  copyrighted newsreel and a paid stock clip were both found and rejected).
- **Real photos only:** Tsibliyev/Lazutkin Mir-Progress collision aftermath
  (STS-86 crew photos), Soyuz TMA-11 recovery.
- **Dossier (zero real coverage, illustrated reconstruction):** Boris
  Volynov's Soyuz 5 reentry — Soviet secrecy + no camera present. The one
  such beat in the episode, clearly labeled "RECONSTRUCTION" on screen.

## 5. A real bug caught post-render: black-screen scenes
After the first render attempt, a user-reported "black screen with only
subtitle" issue traced to **13 scenes missing both `img` and `video`
fields** — quote/reaction beats that I'd assumed would visually continue
from the previous scene, but the doc engine requires each scene to declare
its own visual or it falls back to flat black (the exact house rule this
channel already had a hard "no bare black-screen scenes" policy for). Fixed
by assigning every one of the 13 scenes a real image or video file. Caught
a second bug in the same pass: scene `n5_1` (Armstrong/Scott's Gemini 8
tumble) had wrongly been assigned a Cernan-labeled photo (Gemini 9, a
different mission/different people) during an earlier reuse-avoidance fix —
corrected to generic Gemini-capsule imagery.

**Verification method that actually worked:** manual `remotion still` frame
spot-checks proved unreliable for pinpointing exact scenes (a stale webpack
bundle cache, `node_modules/.cache/webpack`, silently served pre-fix content
even after script edits — clearing it forced a real rebundle) and separately
the ad-hoc `doctiming.py`-based frame estimates didn't reliably land on the
intended scene either. The check that actually gave a trustworthy answer:
a full low-res local render (`--scale=0.25`, throwaway, deleted after) +
`ffmpeg blackdetect` scanning literally every frame of the entire ~750s
timeline. Only one region flagged, and it was a false positive (a real
photo of a small spacecraft against genuinely-black deep space, not a
missing-visual bug). This is a more rigorous check than spot-checking
individual estimated frames and should be the go-to method if this class of
bug is suspected on a future episode.

## 6. VO — done
`build_doc_vo.py --speed 0.96`, all 55 clips clean, no empty-clip Cartesia
bug. Voice: `00d3c951-...` (the channel's own cloned narrator, not an
alternate this time). Ear-check sample sent to Akshay before the render.

## 7. Gates — 0 blocking
`preflight_doc.py astronautsscared` → 0 blocking, 9 warnings (reviewed —
mostly title-text-vs-narration keyword mismatches on footage already
frame-verified correct, plus generic b-roll reuse against the channel's
existing library, not actual wrong-content).

## 8. Render — DONE, VERIFIED (two attempts; first two were stopped)
```
scripts/render_gce.sh AstronautsScaredDoc astronautsscared
```
No `--music` flag (the `public/beds/doc_*.mp3` set stays banned).
- **First attempt:** local orchestration got killed mid-file-sync when the
  session was interrupted; the VM sat idle for 5+ minutes with a
  half-synced repo. Deleted and relaunched clean rather than trying to
  resume a broken sync.
- **Second attempt:** completed successfully, but this was BEFORE the
  black-screen bug (§5) was found and fixed — would have shipped with 13
  black-screen scenes. Stopped deliberately once the bug was confirmed.
- **Third attempt (final):** ran clean after the fix.
- Duration: **641.4s** (matches 18,711 body frames + 527f/30fps MW outro)
- Resolution: **3840×2160** (true 4K)
- Loudness: **−14.1 LUFS** (target hit; input was −24.3 LUFS)
- Mid-frame + outro splice both visually verified — the Volynov dossier
  reconstruction renders correctly in-context (RECONSTRUCTION tag visible),
  correct mindwired subscribe outro confirmed present at the tail.
- Master: `out/astronautsscared_gce.mp4`. Final upload-ready copy at repo
  root.

## 9. SRT + chapters — DONE
`.venv-lipsync/bin/python scripts/gen_doc_srt.py astronautsscared` →
`mindwired_astronautsscared.srt` (114 cues). All chapter gaps ≥12s, first
at 0:00 — no YouTube chapter-rejection risk. Final runtime: **10:20**.

## 10. Packaging — DONE
`ctr-engine` skill run for title/thumbnail: primary title reuses the
Icahn-validated headline's own proven phrasing (183.1:1) rather than an
unproven fresh angle; two A/B alternates scored and logged in
`METADATA-astronautsscared.md`. Full SEO package: description, chapters,
MORE FROM block (real published mindwired URLs only), tags (482/500
chars), 15 hashtags, pinned comment, credits/sources.

## Next steps (in order)
1. Build the actual thumbnail image (Workflow B: real Parmitano EVA-23
   frame + minimal text overlay) — concept already specified in METADATA.
2. Cut funnel Shorts (shorts-funnel skill) — strong candidates: Parmitano's
   helmet flooding (already the cold open), Volynov's "Is my hair gray?"
   line, Parazynski's live-wire quote, the Cernan "spacewalk from hell"
   beat.
3. Commit everything (doc spec, dossier sidecar, manifest, CLAIMS,
   METADATA, SRT, handoff — never the multi-GB master) — only once Akshay
   asks.
4. Write the episode memory once the above is done.
