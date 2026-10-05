# MINDWIREDPROCESS — "How a mindwired Episode Is Made" (YPP appeal video)

**NOT channel content.** This is the appeal video for the YPP monetization
review (deadline **Oct 21, 2026**) — reviewer-facing, unlisted upload, URL
pasted into the appeal form. Strategy + submission checklist:
`docs/planning/YPP-APPEAL-SCRIPT.md`.

## Status: BUILT AND REGISTERED — waiting on ONE input: Akshay's recorded voice take

## The design decision that defines this video
The channel was flagged "generic or repetitive." The previous attempt at a
making-of video (unlisted, made by a local session) used the same synthesized
narrator as every episode — which undercut the exact point it had to prove,
and Akshay called it amateur. This version: **narration is Akshay's own
recorded voice** (one take, split per scene), over the channel's real
production evidence, produced at the channel's full visual standard. Human
where it counts, sleek where it shows.

## Files
| What | Path |
|---|---|
| Doc spec (20 scenes — scene texts ARE the recording script) | `src/mindwired-doc/docs/mindwiredprocess.json` |
| Recording kit for Akshay (read this, record, push) | `docs/planning/APPEAL-VIDEO-RECORD-THIS.md` |
| One-take → per-scene splitter (faster-whisper align + ffmpeg cut) | `scripts/split_vo_take.py` |
| Scaffold manifest (`"estimated": true` — replaced after the take) | `src/mindwired-doc/docs/mindwiredprocess.manifest.json` |
| Comp (registered, NO outro — reviewer-facing + 5-min cap) | `src/Root.tsx` → `MindwiredProcessDoc` |
| Fresh real footage, zero reuse (NASA PD: Artemis flight control room, SLS on pad at dawn, Webb in cleanroom) | `public/shorts/mindwiredprocess/video/` + ATTRIBUTION.md |
| Chapter-card stills (NASA PD, downscaled ≤2400px) | `public/shorts/mindwiredprocess/images/chapterbg_*.jpg` + ATTRIBUTION.md |
| Evidence panels — styled renders of REAL repo artifacts | `public/shorts/mindwiredprocess/images/*.png` (topicqueue, claims×3, attribution, policy, preflight, gitlog, breadth, episodeframes×2) |

Every panel's text comes from the actual files (TOPIC-QUEUE entry, CLAIMS
pages + corrections, ATTRIBUTION log, `preflight_doc.py projecthailmary` run
LIVE 2026-10-05 → "0 blocking, 10 warnings", filtered `git log`, CLAIMS-file
listing, built thumbnails). Nothing mocked up.

## Honesty notes (hold these if editing)
- Every spoken claim was verified against the repo before locking: 34
  mindwired-channel docs ("more than thirty episodes"), 33 preflight
  `block()` gates ("over thirty hard gates"), 38.0:1 headline outlier
  (TOPIC-QUEUE), repo history since 2026-07-01 ("months"), 180 commits.
- s7 discloses AI tool use explicitly and commits to scaling it back —
  Akshay's stated direction, not spin. s16/beat-16 in the recording kit.
- The video reuses NOTHING from other slugs: all 3 hook clips + 4 stills
  fetched fresh (HOOK-REUSE gate respected); panels are new renders.
- NO music bed by choice: a reviewer-facing explainer reads sincerer dry,
  and it keeps every second for content. NO subscribe outro (not viewer
  content; also keeps runtime safely under the 5:00 appeal cap).
- Estimated runtime ~4:05 at a 145wpm read; hard ceiling 4:50 — if Akshay's
  take runs over, trim beats 13/19 first.

## Pipeline from here (in order)
1. **Akshay records + pushes** `recordings/appeal_vo.m4a` (kit has exact steps).
2. `pip3 install --user faster-whisper` (first run only), then
   `python3 scripts/split_vo_take.py mindwiredprocess recordings/appeal_vo.m4a`
   — LISTEN to any clips it flags `??`.
3. `python3 scripts/build_doc_vo.py mindwiredprocess --manifest-only`
   (NEVER without --manifest-only on this slug — nothing may be synthesized).
4. `python3 scripts/preflight_doc.py mindwiredprocess` — expect warnings
   (greeting-style opener etc. are channel-content heuristics; this isn't
   channel content). Fix anything BLOCKING.
5. Verify stills again (`out/qa/mwp_*.png` pattern), then render 4K on GCE
   from Akshay's machine:
   ```
   CHUNKED=1 scripts/render_gce.sh MindwiredProcessDoc mindwiredprocess
   ```
   (no --music by design; `--scale 2` 4K is the script default; CHUNKED
   dodges the delayRender font race).
6. ffprobe duration (must be < 5:00) + resolution 3840×2160, eyeball
   mid-frame + last frame, confirm −14 LUFS in the log.
7. Upload **unlisted**, paste URL into the appeal form, submit well before
   Oct 21.

## Verification already done (2026-10-05, this session)
- `lint_tts_text.py` on the spec: clean.
- `tsc --noEmit`: zero errors at the new comp (57 pre-existing errors on old
  comps, untouched).
- 3 stills rendered and eyeballed: o1 (graded mission-control + URL
  lower-third + wordmark), title card, STEP ONE card — all on-brand.
- All fetched clips/stills eyeballed by hand (no GEMINI key in this
  container): one bad clip caught and replaced (SLS "booster test" clip was
  actually a spokesperson desk intro → swapped for Artemis-on-pad dawn shot).
