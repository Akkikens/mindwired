# PUBLISHABLE — what is finished, what is blocking it

Updated 2026-09-13 15:20 from actual repo and channel state, verified with yt-dlp and
ffprobe rather than memory. Keep it current: `publish-video` updates the row it ships,
`doc-episode` adds a row when a master lands.

**The backlog the 2026-08 audit flagged is gone.** Everything that was rendered-and-sitting
went live on 2026-09-13. What follows is the one episode still in flight, then the debts
the loop is carrying.

---

## 🟠 IN FLIGHT

### thegrounding — "4,500 Planes Had to Land. There Was No Plan." (Black Box)
**Status: rendering on GCE at ~89%** (`render-thegrounding-2361`). 44,179 frames, 4K.
Body 24:16 + 16.1s outro ≈ **24:32**.
**Package:** none yet — METADATA still to write. Fact base `CLAIMS-thegrounding.md` is done.
**Visual pool:** 66 distinct assets across 112 scenes, heaviest at 3.6% — the fix for the
repetition problem, and now enforced by a preflight gate rather than intended.

| # | Blocker | Who |
|---|---|---|
| 1 | Master must land and verify (rescue fetcher armed — ffprobe BEFORE the VM is deleted) | automatic |
| 2 | `METADATA-thegrounding.md` — title, description, chapters, tags, pinned comment | me, ~30 min |
| 3 | **Thumbnails not built** — no concepts locked yet either | me |
| 4 | SRT off the master | me, 5 min |
| 5 | Chapters must be computed from the manifest, **not** `gen_doc_srt.py` — it drifted 19s on the sister episode | me |
| 6 | Human pulls still owed (in CLAIMS): the FAA's own 403'd pages, the Sliney MFR from NARA, Advisory 036, the NAV CANADA backgrounder | **human** |

---

## ✅ PUBLISHED 2026-09-13 (verified live)

| Date | Channel | Title as published | URL | Runtime |
|---|---|---|---|---|
| Sep 13 | Black Box | The Tapes That Broke NORAD's 9/11 Story | kl_rTye4ocA | 31:50 |
| Sep 13 | mindwired | 8 People Sealed In. The Oxygen Kept Vanishing. | --sTmQzJtBk | 37:53 |
| Sep 10 | Black Box | The 9/11 Air Files New York Kept Sealed for 25 Years | nPDC2r_m6ec | 16:42 |
| Sep 8 | mindwired | Nobody Has Ever Seen a Full-Grown Colossal Squid | N1ZlQpP5be4 | 35:40 |
| Aug 31 | mindwired | Project Hail Mary's Science Is More Real Than You Think | D9E-Opwl_HQ | 11:32 |

**noradtapes shipped on the ALTERNATE title** (ctr-engine 8.50) rather than the locked
primary ("We Have Some Planes." Nobody Knew What It Meant, 9.00). If it underperforms the
channel's 9/11 baseline, the title is the first variable to test — not the thumbnail.

### ⚠ Owed on the published set
1. **Nobody has ear-checked the four ACTUAL-labelled audio cuts** in the NORAD episode. I
   matched content against the printed transcript; that is not the same as listening.
   In-points are in `_evidence/noradtapes/SOURCES.md`. **This is the highest-stakes open
   item on the channel** — those clips carry an "ACTUAL FAA ATC RECORDING" label on screen.
2. **Two naming calls** left unresolved and currently written the conservative way: Colin
   Scoggins (named in the Commission's draft monograph, not the published report) and Larry
   Arnold (de-named pending a living-status check, though he is one of the two officers
   whose testimony was actually referred).
3. **CC-BY credit lines** must be pasted into the descriptions from the ATTRIBUTION.md
   files — a licence obligation, not a nicety.

---

## 🔴 THE DEBT THAT BLOCKS THE NEXT TOPIC PICK

**Three launches are past 48h with no Studio numbers, all under 200 views at last check:**
groundzeroair (Sep 10, 96), colossalsquid (Sep 8, 75), projecthailmary (Aug 31, 164).

Without impressions data nobody can say whether that is **topic demand** (small pool → the
fix is topic selection) or **packaging** (healthy pool, low CTR → the fix is ctr-engine).
Those are opposite prescriptions. icahn-validate Step 0 is supposed to block on exactly
this; I invoked the escape hatch to validate `thegrounding`, which is legitimate once and
corrosive twice.

**Needed from Akshay, per video:** days live · impressions · impressions CTR · average view
duration and average % viewed · the 0-60s curve shape · Test & Compare state. Compare
against MH370 (kRjhzp4Ho9k) for Black Box.

---

## 🟢 VALIDATED AND WAITING

**thegrounding** is the current build. Nothing else is validated and unbuilt — the queue's
older entries predate the current gates and would need re-validation, since ratios are
point-in-time (the Kola Superdeep lesson).

Worth noting for the wave calendar: the 25th-anniversary 9/11 wave that carried Building 7
and United 93 to the channel's #2 and #3 slots **is decaying**. Two 9/11 episodes are now
live into it and a third is rendering. The topic after this one should be a non-9/11
giant name, chosen off real launch data.

---

## HOUSEKEEPING

- **Root directory litter:** `Warning.mp4`, `Men.mp4`, `Wrong.mp4`, `Proof..mp4`,
  `Quiet..mp4` and others — the mp4-filename-is-title rule appears to have truncated titles
  to their last word. Reconcile against the publish log and move shipped captions and
  thumbnails to `archive/`.
- **Three dead branches** — `gallant-mccarthy-9dbf53`, `zen-chebyshev-deba08`,
  `unruffled-haibt-ab5fb6` — each 124 commits behind main with content already on main.
  Safe to delete; a PR from any of them would revert months of work.
- **Open PRs:** #5 (noradtapes + biosphere2), #6 (groundzeroair), #7 and #8 (colossalsquid,
  overlapping — merge whichever is ahead, close the other). Everything since has been
  committed on the `claude/biosphere2-metadata` branch; **merging #5 is what makes main
  current**, and Akshay has asked for main-direct commits from here on.
- **✅ FIXED 2026-09-13 — the render script no longer deletes healthy renders**, and
  on-demand VMs now carry `--max-run-duration` + `--instance-termination-action=DELETE`.
  Expired gcloud credentials had produced three confident wrong diagnoses in one session
  ("NO CAPACITY anywhere on the ladder", "VM GONE — preempted", and a silent scp stall);
  the second one tried to delete a render sitting at 56% and only failed because the delete
  needed the same broken credentials.
- **✅ NEW — visual monotony is a blocking gate.** Any asset over 12% of scenes, or more
  than four back-to-back repeats, fails preflight. Run against the published noradtapes it
  fails the episode: one clip carried 32 of 123 scenes with 23 consecutive repeats.
  `scripts/slice_shots.py` cuts a long source into its distinct shots when a pool is thin.
