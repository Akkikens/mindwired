# HOSTILEPLANETS — "8 Real Planets So Hostile They Shouldn't Exist" (mindwired)

Single-file summary of everything done on this episode. Read `CLAUDE.md` first
for the production manual; this doc is the episode-specific state.

## Status: ALREADY PUBLISHED 2026-07-26 — DO NOT re-render or re-upload

**Correction (2026-07-30):** this episode was already live on YouTube
("8 Real Planets So Hostile They Shouldn't Exist (Ranked)", published
2026-07-26) before this document below was written. A session wrongly
inferred from local repo state (no `out/` master, nothing committed) that it
had never shipped, and re-rendered + nearly re-uploaded a duplicate —
caught and cancelled by Akshay before it went live twice. The local
duplicate render/file has been deleted. **Local git/file state is not proof
of publish status — always ask/check YouTube directly before re-rendering
anything.** Sections below describe that (unnecessary) re-render for the
record; treat this episode as finished and live, not as a pending task.

## Files
| What | Path |
|---|---|
| Doc spec (47 scenes) | `src/mindwired-doc/docs/hostileplanets.json` |
| Comp registration | `src/Root.tsx` → `HostilePlanetsDoc` (MW_OUTRO baked, 527f) |
| Metadata / SEO package | `docs/metadata/METADATA-hostileplanets.md` (thumbnail still TODO) |
| Icahn validation (original) | memory `hostileplanets-episode` (2026-07-25) |
| Icahn re-validation (this session) | memory `icahn-whatif-reframe` (2026-07-30, live re-check off a "What If" channel format study — headline upgraded to 62.4:1 @ 6.17M views, fresh Jan 2026) |
| QA stills | `out/qa/hostileplanets_stills/`, `out/qa/hostileplanets_final_check/`, `out/qa/hostileplanets_v2_check/` |
| Rendered master | `out/hostileplanets_gce.mp4` (1.41 GB) |
| Upload-ready copy | `mindwired_8 Real Planets So Hostile They Shouldn't Exist (Ranked).mp4` (repo root) |
| Render launch log | `out/hostileplanets_gce_launch.log` |
| SRT | `mindwired_hostileplanets.srt` |

## 1. Backstory (from a prior session, memory `hostileplanets-episode`)
Built 2026-07-25 to fix a recurring complaint: narration good, visuals/video
"aren't really making sense" with it. Picked "planets" (highest raw Icahn
ratio) over safer footage-only alternatives — a deliberate demand-over-safety
call. Built via `src/mindwired-doc` (DocWide engine) specifically so every
discovery/telescope beat could run on real NASA/ESA/ESO footage, with every
unfilmable exoplanet-surface shot honestly labeled "illustration" on screen
(twice) — no `dossier` scenes needed (0 in the script), since nothing here is
a zero-coverage reconstruction beat.

Went through CLAIMS-equivalent fact-checking directly against the cited
telescope discovery papers (Kepler/Spitzer/Hubble/VLT/Arecibo — see the
metadata's sources block for the exact citations, e.g. Ehrenreich et al. 2020
Nature for WASP-76b's iron rain, Wolszczan & Frail 1992 Nature for the first
confirmed exoplanets around PSR B1257+12). No separate `CLAIMS-hostileplanets.md`
file exists — the metadata file's sources block is the fact-base record for
this one.

## 2. This session (2026-07-30) — re-validation + the actual render
- Independently re-corroborated via a "What If" (@whatifscienceshow, 8.95M
  subs) channel-format study: their own hostile-planet/dying-on-every-planet
  content pulls big numbers (The Paint Explainer ceiling 12.4M views), and a
  live yt-dlp re-sweep found an even fresher, bigger headline outlier than
  the original validation (Cosmic Lens, 62.4:1 @ 6.17M views, Jan 2026). See
  memory `icahn-whatif-reframe`.
- **Discovered everything upstream (script/footage/VO/gates) was ALREADY
  done and fully gate-passed** from the 2026-07-25 session — the only
  missing piece was the actual final render (the `out/` master had been
  cleared, likely during a disk-space cleanup, and the source files were
  still sitting uncommitted). Rebuilding from scratch would have wasted the
  entire CLAIMS/script/footage/VO pipeline; instead just re-verified gates
  (`preflight_doc.py hostileplanets` → 0 blocking, 9 warnings, all reviewed
  false-positive generic-b-roll cases) and rendered.
- Spot-checked 4 stills before committing to the render (cold open, a real
  NASA infographic beat, a real observatory photo, the closing verbal-bridge
  line) — all real photos, correctly branded, bridge line intact ("Next:
  scarier than space — and it's on Earth" → sets up the Mariana Trench
  episode already in the queue).
- Rendered via `scripts/render_gce.sh HostilePlanetsDoc hostileplanets`
  (GCE auth had expired — Akshay ran `gcloud auth login` mid-session).

## 3. Render — DONE, VERIFIED
- Duration: **495.5s** (478s body + 527f/30fps MW outro ≈ 495.6s — matches)
- Resolution: **3840×2160** (true 4K)
- Loudness: **−14.1 LUFS** (target hit; input was −24.2 LUFS)
- Mid-frame + outro splice both visually verified
  (`out/qa/hostileplanets_final_mid.jpg`, `out/qa/hostileplanets_final_outro.jpg`)
  — mindwired subscribe outro (host, "HIT SUBSCRIBE") confirmed present and
  correctly branded.
- No `--music` flag (the `public/beds/doc_*.mp3` set stays banned).

## Next steps (in order)
1. Build thumbnail (Workflow A image-gen or ctr-engine) — VLT-at-twilight or
   similar real-observatory shot + 3-5 word ALL-CAPS text, per
   `docs/guides/THUMBNAILS.md` and the metadata's thumbnail brief.
2. Cut the 3 funnel Shorts already planned in the metadata (#1 reveal /
   WASP-76b iron rain / KELT-9b) via the shorts-funnel skill.
3. Commit (doc spec, manifest, metadata, SRT, this handoff — never the
   multi-GB master) — only once Akshay asks for it. Note: the working tree
   currently has a large backlog of OTHER uncommitted episodes (chernobyl,
   jal123, titanic, unexplainedobjects, oppositiondetained) — scope any
   commit to hostileplanets' own files unless told otherwise.
4. Publish via the publish-video skill.
