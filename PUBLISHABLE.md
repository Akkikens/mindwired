# PUBLISHABLE — what is finished, what is blocking it

Built 2026-09-13 from actual repo state, not memory. **This is the file that did not exist
when it was asked for twice.** Keep it current: `publish-video` should update the row it
ships, and `doc-episode` should add a row when a master lands.

The 2026-08 audit found 8+ finished masters that were rendered and never uploaded. A
rendered master earns nothing and its currency decays. That is what this file is for.

---

## 🟢 READY — shortest path to live

### 1. noradtapes — "We Have Some Planes." Nobody Knew What It Meant. (Black Box)
**Master:** `out/noradtapes_gce.mp4` — 3840x2160 · 30fps · **31:50** · 4.61 GB · **−14.0 LUFS**
(rendered on GCE 2026-09-12, verified: outro is the correct Black Box/Reid asset, splice clean)
**Package:** `docs/metadata/METADATA-noradtapes.md` · **3 thumbnails built** · attribution
files written for images and video · fact base `CLAIMS-noradtapes.md` (976 lines)
**Why now:** the 25th-anniversary wave is live — this channel's two existing 9/11 uploads
went to #2 and #3 on the channel while it ran. Every week of delay costs pool.

| # | Blocker | Who | Effort |
|---|---|---|---|
| 1 | **SRT not generated** — run `whisper_srt.py` on the master | me | 5 min CPU |
| 2 | **Ear-check the four real-audio cuts.** I matched content against the printed transcript; nobody has listened. In-points in `_evidence/noradtapes/SOURCES.md` | **human** | 10 min |
| 3 | **Verify chapter timestamps** against the master — `gen_doc_srt.py` drifted 85s on colossalsquid, and this episode uses `extraHold` | me | 10 min |
| 4 | **Paste CC-BY / CC-BY-SA credit lines** into the description from the two ATTRIBUTION.md files | me | 5 min |
| 5 | **Decide two names:** Colin Scoggins (named in the draft monograph, not the published report — CLAIMS contradicts itself) and Larry Arnold (de-named pending a living-status check; he is one of the two officers whose testimony was referred) | **Akshay** | — |
| 6 | **Sensitivity pass — publish-video §6 is a hard gate on this episode** (mass-casualty terrorism, living named people) | **human** | 20 min |
| 7 | Publish slot — Black Box row is still TBD in LAUNCH-LESSONS.md | **Akshay** | one-time |

---

## 🟡 FINISHED BUT BLOCKED

### 2. biosphere2 — 8 People Sealed In. The Oxygen Kept Vanishing. (mindwired)
**Master:** `out/biosphere2_gce.mp4` — 3840x2160 · **37:53** · 6.1 GB · **−14.02 LUFS** (re-measured)
**Package:** `METADATA-biosphere2.md` · captions built and hand-corrected
**⚠ The episode source was never committed** — no doc spec, no manifest, no CLAIMS file.
It cannot be re-rendered. Chapters are transcript-derived.

| # | Blocker | Who |
|---|---|---|
| 1 | **No thumbnails built** — concepts only, so Test & Compare cannot run. Assets are probed and named in the metadata file | me, ~30 min |
| 2 | **No ATTRIBUTION.md** for 249 media files. CC BY-SA needs credit; this is a licence obligation, not a nicety | me + human eyeball |
| 3 | **End-screen target is unpublished** — the closing bridge names Project Hail Mary aloud, which has no URL | see #4 below |
| 4 | Confirm NASA eClips is PD (co-produced with the National Institute of Aerospace) | human, 2 min |

### 3. colossalsquid — Nobody Has Ever Seen a Full-Grown Colossal Squid (mindwired)
**Master:** `out/colossalsquid_gce.mp4` — **35:40** · 4.9 GB · package complete, 3 thumbnails built.
Chapters are frame-math verified (do **not** trust `gen_doc_srt.py` on this one).
**Blocker:** no ATTRIBUTION.md found under `public/shorts/colossalsquid/` despite the metadata
citing one — resolve before upload. Otherwise this is the closest to ready after noradtapes.

### 4. projecthailmary — Hail Mary's Sun-Killing Microbe Might Be Real (mindwired)
**⚠ The master is CORRUPT** — `out/projecthailmary_gce.CORRUPT-2026-08-29.mp4`, 0.3 GB.
Package and thumbnails exist; the render does not. **Needs a re-render.**
This is also what blocks biosphere2's end screen, and it is the video the noradtapes bridge
does *not* depend on (that one points at United 93, which is live).

---

## ⚪ PACKAGED, MASTER NOT IN `out/`
`dcamidair` and `groundzeroair` both have metadata and 3 built thumbnails, but no master in
`out/` — either already shipped, or the render lives elsewhere. **Check before assuming.**
`groundzeroair` has a handoff doc on PR #6.

---

## HOUSEKEEPING

- **Root directory is littered with truncated deliverables:** `Warning.mp4`, `Men.mp4`,
  `Wrong.mp4`, `Proof..mp4`, `Quiet..mp4` and others — the mp4-filename-is-title rule has
  produced files named after the *last word* of the title. Shipped episodes' captions and
  thumbnails are supposed to move to `archive/` once live; these should be reconciled
  against the publish log and archived.
- **Three dead branches** — `gallant-mccarthy-9dbf53`, `zen-chebyshev-deba08`,
  `unruffled-haibt-ab5fb6` — are each 124 commits behind main with their content already on
  main. Safe to delete; a PR from any of them would revert months of work.
- **Open PRs:** #5 (noradtapes + biosphere2), #6 (groundzeroair), #7 and #8 (colossalsquid,
  overlapping — merge whichever is ahead and close the other).
- **`render_gce.sh` has no billing safety net.** The VM is on-demand with no
  `maxRunDuration` and no `instanceTerminationAction`, and its service account lacks compute
  scope so it cannot self-delete. The local script's EXIT trap is the only thing that
  deletes it — if the laptop sleeps through the end of a render or the session is killed, a
  32-vCPU box bills at roughly $1.40/hour until someone notices. One-line fix, worth doing.
