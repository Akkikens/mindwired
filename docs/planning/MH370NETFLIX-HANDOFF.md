# MH370 #3 — "MH370: What Netflix Has Never Showed You" (Black Box Breakdown)

Single-file summary of everything done on this episode. Read `CLAUDE.md` first for
the production manual; this doc is the episode-specific state.

## Status: ✅ FINAL — corrected render verified, titled, ready to upload

Title went through two rounds: ctr-engine's original recommendation ("MH370:
The Theory Its Own Expert Doesn't Believe") was locked in first, then YouTube
reported title A/B testing **Ineligible** for this channel, Akshay tried two
new candidates directly, and the final pick is **"MH370: What Netflix Has
Never Showed You"** — see `METADATA-mh370netflix.md` for the rejected
alternate and why.

The black-screen bug (below) is fixed, re-rendered, and verified against the
real final file (not just local stills): all 44 previously-black scenes
pulled as real frames from the actual render and reviewed as one contact
sheet — every one has real visual content now. Repo-root file
`MH370 - What Netflix Has Never Showed You.mp4` is this corrected render
(1.79 GB, 19:25, 3840×2160, -14.1 LUFS). A duplicate copy that existed in
`out/` was moved to Trash (not deleted) once confirmed byte-identical.

**Akshay caught the black-screen bug by eye:** the first render had way too much
flat black screen (46% of scenes — 44/95 — had zero `img`/`video`/`exhibit`/
`dossier` field, so DocWide fell back to plain black behind the text). This is
the exact pattern CLAUDE.md already bans outright (2026-07-25 incident). Root
cause: many analysis/quote/chapter-card scenes were written with no visual
field at all, on the wrong assumption that DocWide had a black-screen-safe
default — it doesn't for plain text scenes. **Fixed in `mh370netflix.json`**
(all 44 scenes now reuse an already-fetched real image/video from the
surrounding chapter's pool, honestly labeled `stock: true` where generic).
Re-ran `audit_scene_relevance.py` + `preflight_doc.py` after the fix: still 0
blocking. Re-rendered on GCE (first attempt hit expired `gcloud` auth, fixed
by Akshay running `gcloud auth login`; second attempt hit a transient SCP
connection reset on the final fetch, fixed by a plain retry) — the corrected
render is what's now at repo root.

## Files
| What | Path |
|---|---|
| Fact base (GATE — every script line traces here) | `docs/planning/CLAIMS-mh370netflix.md` |
| Doc spec (95 scenes, black-screen bug fixed) | `src/mindwired-doc/docs/mh370netflix.json` |
| Comp registration | `src/Root.tsx` → `MH370NetflixDoc` (BB_OUTRO baked, 483f) |
| ✅ Final rendered master | `MH370 - What Netflix Has Never Showed You.mp4` (1.79 GB, repo root) |
| Captions | `MH370 - What Netflix Has Never Showed You.srt` (177 cues) |
| Metadata package | `docs/metadata/METADATA-mh370netflix.md` |
| Icahn validation (revised after live pushback) | memory `icahn-mh370-netflix-reaction` |
| Differentiation audit vs. our own back catalog | memory `mh370-coverage-audit-2026-08` |
| QA frames (pre-fix render, kept for reference) | `out/qa/mh370netflix_{hook,mid,outro}.jpg`, `out/qa/mh370netflix_{d3,v2}_real.png` |
| QA: all 44 fixed scenes, real frames from final render | `out/qa/mh370netflix_ALL_FIXED_SCENES_contact_sheet.jpg` |

## Why this video exists (read before touching anything)
This channel already shipped two MH370 videos: the disappearance timeline
(`mh370.json`, ~30 min) and the full 8-theory FOR/AGAINST/verdict roster
(`mh370theories.json`, ~17 min). **This video does NOT re-run either.** Its
job, confirmed by direct read of both prior specs, is to fact-check Netflix's
2023 three-part documentary specifically — per-episode claim vs. official
record, a dedicated "what Netflix got wrong" chapter, the previously-unexplored
glide-vs-dive flight-recorder physics, and the 2025-2026 present tense. If you
add a scene, ask first whether it belongs in Video 2 instead.

## 1. Icahn validation — PASS-WITH-CONDITIONS (revised)
First pass on the live yt-dlp sweep called the Netflix-reaction FRAME a FAIL
(two small-channel clones of Green Dot Aviation's exact title got 96 and 274
views). Akshay pushed back with the live view count on Green Dot's own video
(14M, vs 12.68M when the sweep ran) — a fair correction: that's the same order
of magnitude as the niche's own ceiling (LEMMiNO, 29.6M). Revised verdict: the
frame needs pre-existing channel authority to land, which this channel has
from 2 shipped MH370 videos, unlike the anonymous clone channels. Title
(below) rides both proven frames without cloning either verbatim.

## 2. Research — 5-agent fan-out, synthesized into CLAIMS-mh370netflix.md
Netflix documentary content audit · official investigation record + the
glide-vs-dive engineering debate · theory roster re-read through the Netflix
lens · archival-footage scout · living-person safety check. Spot-checked the
4 highest-stakes claims myself via WebFetch (Jeff Wise's Jan/Feb 2026
statements, Malkinson's "most likely southern Indian Ocean" quote, the
Vietnam-pulled-episode fact, Anthony Loke's June 2026 announcement) — all
confirmed accurate against primary sources, not hallucinated.

**Load-bearing correction baked into the script:** Jeff Wise is NOT a current
pilot-theory proponent — his sustained position since 2015 is the Russian-
hijack theory, and as of January 2026 he's on record arguing AGAINST the
cockpit/pilot theory, then in February 2026 published a third, different
theory. This "one man, three theories, none holding up" arc is the episode's
spine (cold open + Act 2 payoff + Act 6 callback).

**Honesty rule (non-negotiable, same as every episode):** every theory stated
as "argued by [named person], here's their evidence, here's the official
record." Zaharie Ahmad Shah: official investigation affirmatively found
nothing supporting the pilot theory — never asserted as fact, never implied.

## 3. Script — src/mindwired-doc/docs/mh370netflix.json
95 scenes, ~17.2 min narration (19:00 final runtime with BB outro, confirmed
by render — deliberately well short of the original "up to 60 min" brief,
since Gate 2 showed the theory roster is already covered elsewhere; a denser
19-min cut beats a padded hour). Structure: cold open (Wise's self-
contradiction teaser) → sting → title → 8 chapters (the documentary itself →
Ep1/Ep2/Ep3 claim-vs-record → dedicated "what Netflix got wrong" meta-chapter
→ the glide-vs-dive BFO/descent-rate physics → 2025-2026 present tense →
verdict) → coda → verbal bridge to AF447 (already shipped) → subscribe.
Narrator: cloned Cartesia voice `00d3c951-...` @ 0.96 speed.

## 4. Footage — real, none reused from the first two MH370 videos
Automated `fetch_doc_footage.py` returned mostly wrong/generic stock (eyeballed
via contact sheet, as always) — manually replaced the load-bearing ones with
real sources:
- **Malaysia's 2018 ICAO Annex 13 report** (mot.gov.my PDF) — 3 pages used as
  brief exhibit shots (cover, crew-profile/background-check page, the actual
  "unable to determine the real cause" conclusion page).
- **Ian Holland (DSTG), IEEE 2017 BFO analysis paper** (arXiv:1702.02432) — 3
  pages, the actual descent-rate math this episode narrates.
- **Wikimedia Commons**: the real Inmarsat data-graph (`MH370_data_graphs2.png`,
  distinct from the GEOMAR map already used in the first two videos), real
  Mozambique debris photos, the real JACC Perth press-conference photo.
- **DVIDS**: real US Navy footage of the actual Bluefin-21 AUV deployment
  (video:329635, 14 Apr 2014) — pulled directly via the DVIDS API with the
  repo's configured key after the generic search fetcher found nothing.
- No CC/PD photo of Jeff Wise or Florence de Changy exists anywhere —
  represented via `dossier` (case-file) scenes, never a fake stock photo.
- Never used Netflix's own footage/stills — same rule as the Chernobyl
  episode, critique the claims, not the imagery.
- `audit_scene_relevance.py`: 0 blocking, 34 warnings (all reviewed — generic
  mood b-roll honestly labeled `stock`/`dossier`, plus soft cross-video-reuse
  flags on generic Pexels stock also used in other unrelated episodes).

## 5. Render — GCE 4K, single pass, VERIFIED
```
scripts/render_gce.sh MH370NetflixDoc mh370netflix
```
- Duration: **1164.9s = 19:25** (34944 frames @ 30fps, matches `docTotalFrames()` exactly)
- Resolution: **3840×2160 @ 30fps** (true 4K, `--scale 2`)
- Loudness: **-14.1 LUFS** (target hit; input was -23.7 LUFS)
- No music (the `doc_*` bed set stays banned; no replacement beds landed yet)
- Subscribe outro confirmed baked in via tail-frame QA (`out/qa/mh370netflix_outro.jpg`)
  — Black Box branding, host Reid, correct
- Ran clean on the first attempt, ~68 minutes wall-clock, VM auto-deleted after fetch

## 6. Packaging — done
- Title, final: **"MH370: What Netflix Has Never Showed You"** — ctr-engine's
  original pick ("The Theory Its Own Expert Doesn't Believe") was locked in
  first, then superseded after YouTube reported A/B title testing Ineligible
  for this channel and Akshay chose this one directly from two new candidates
  (see METADATA for the rejected alternate and why)
- Other candidates + 3 thumbnail concepts in `METADATA-mh370netflix.md`
- Full-SEO description, chapters (real measured timestamps from `gen_doc_srt.py`),
  tags, 15 hashtags, pinned comment, attribution — all in the METADATA file
  (chapters/description text still reference the episode content, not the
  exact title string, so no further edits needed there)
- SRT: 177 cues, `MH370 - What Netflix Has Never Showed You.srt`

## 7. Shorts — 4 cut, rendered, verified
Comp `BlackBoxShort` (generic, reused across the channel) with `mh370netflix`
doc/manifest. All vertical 1080×1920, hook card + clip + baked vertical Reid
subscribe outro (240f/8s). Rendered to `out/Mh370NetflixShort{1,2,3,4}.mp4`.

| # | Comp id | Scenes | Duration | Hook | CTA |
|---|---|---|---|---|---|
| 1 | `Mh370NetflixShort1` | e8→e9 | 40.6s | "He wrote Netflix's hijack theory. Now he says it's wrong." | The full MH370 fact-check |
| 2 | `Mh370NetflixShort2` | g4→g6 | 45.8s | "The director doesn't believe her own Netflix series." | What Netflix's MH370 doc got wrong |
| 3 | `Mh370NetflixShort3` | p2→p4 | 59.2s | "The black box did the math. Nobody was flying it." | The full MH370 flight-recorder breakdown |
| 4 | `Mh370NetflixShort4` | r8→r9 | 47.5s | "Same man. 3 theories. Still no answer." | The full MH370 fact-check |

Each is self-contained (a stranger scrolling needs zero context) and carries
the same attributed-never-asserted framing as the long-form — none flatten
into "pilot did it" clickbait. Hook-card frames verified visually
(`out/qa/Mh370NetflixShort{1,3}_hook.jpg`); not yet reviewed for audio/pacing
by ear. Drip 1/day per the shorts-funnel schedule, pinned comment on each
linking the long-form by title.

## 8. Known gaps / not done yet
- **No thumbnail image generated yet** — 3 concepts specified in METADATA,
  none rendered.
- **Nothing from this episode committed to git yet.**
- One VO-pipeline finding worth logging: two adjacent Cartesia clips (f1/f1b)
  came back with suspiciously identical duration/byte-size despite different
  text — verified via spectrogram (not audio playback) that the actual speech
  content differs; this looks like a benign TTS-output quantization artifact
  (several other unrelated scene pairs across the episode share exact
  durations too), not a content bug, but flagging in case it recurs at scale.
- Akshay has not done a full listen-through of the VO — the automated ear-
  check (TTS lint, empty-clip scan, spectrogram spot-check) passed, but a
  human listen before publish is still the real bar for this channel.

## Next steps (in order)
1. Generate the thumbnail image (Workflow C, THUMBNAILS.md) for the chosen concept.
2. Akshay does a listen-through pass before upload (long-form + 4 Shorts).
3. Commit everything to git (doc spec, manifest, CLAIMS, metadata, SRT,
   handoff, Root.tsx change — never the multi-GB master/Shorts mp4s).
4. Publish per `publish-video` runbook once Akshay confirms; drip the 4
   Shorts ~1/day starting the day after the long-form goes live.
