# PUBLISHABLE — what is finished, what is blocking it

Rewritten 2026-09-20. **This file lives in the `~/mindwired` clone** because
`~/Documents/GitHub/mindwired` is unreadable to tooling (macOS permissions —
`cat`, `git` and every script fail with "Operation not permitted"). Merge this
back when that is fixed.

---

## 🟢 READY TO UPLOAD

### airforceone — Black Box Breakdown — **Cheney Said Engage. Nobody Told the Pilots.**

| Asset | Path | Verified |
|---|---|---|
| Master | `~/Desktop/RENDERS/Cheney Said Engage - Nobody Told the Pilots (BlackBox 19-30).mp4` | 3840×2160 · **19:30** · 2.3 GB · **−14.0 LUFS** · 34,747 frames · frame count verified 34,749==34,749 at concat · BB outro baked |
| Captions | `~/Desktop/RENDERS/Cheney Said Engage - Nobody Told the Pilots.srt` | **356 cues**, transcribed from the finished audio (faster-whisper), speech to 00:19:30,200 — matches the master exactly, no drift |
| Thumbs | `out/thumbs/airforceone_{A,B,C}.png` | A = "engage? VP: Yes" from Libby's note · B = Bush at Barksdale · C = the livery. All 1280×720, zero added text |
| Fact base | `docs/planning/CLAIMS-airforceone.md` | 384 lines, read from the Commission PDFs with pdftotext |

#### TITLE
```
Cheney Said Engage. Nobody Told the Pilots.
```
Alternates (title-test only after the thumbnail test settles):
1. `The Vice President Was Mistaken` (the Commission's verbatim finding)
2. `Air Force One Flew Nine Hours That Day`

⛔ Never drift back into "orders that never arrived" — the live sept11timeline
episode owns that phrasing and a near-duplicate splits them in search.

#### CHAPTERS
⚠ **Computed from the manifest, NOT measured. Verify against the SRT before
pasting.** The title card at 0:41 has been REMOVED: it sat 5 seconds before the
next chapter, and YouTube silently drops the entire chapter list if any chapter
is under 10 seconds.
```
0:00 Opening
0:46 A school in Florida
3:00 Wheels up
4:50 Ninety-five minutes
5:58 Engage
9:35 ID type and tail
13:02 Testing a theory
15:05 A threat that wasn't
17:14 The record
```

#### SETTINGS
Education · Standard YouTube Licence · Not made for kids · attach the .srt ·
all 3 thumbnails into Test & Compare (winner on **watch-time share**, not CTR).

#### ⚠ KNOWN DEFECTS — read before shipping
1. **Exhibit pages render too small to read.** 84 exhibit scenes, and until
   2026-09-20 **none** carried `highlight` coordinates, so `ExhibitScene` sits at
   1.12× and shows whole pages. A locator (`scripts/locate_exhibit_phrase.py`,
   reads the PDF's own word coordinates) auto-matched only **11 of 84** — the
   narration paraphrases rather than quotes, so there is nothing to match. The
   other 73 need their passage chosen by hand, then a re-render. **The primary
   record is on screen and illegible.**
2. **Footage is 7 genuine clips cut into 35 segments.** Passes the per-file
   repetition gate on file count; that is a technicality. The episode returns to
   the same podium and the same fuselage.
3. **Four exhibits are aliases** — `ex_faa_line` and `ex_fleischer_notes` point at
   Commission pages that *describe* those documents. On-screen citations must name
   the Commission page, never the underlying document. See the images
   ATTRIBUTION.md.

---

### columbiakalpana — mindwired — **Columbia: The Sixteen Days**

Working title. ctr-engine locked **"Kalpana Chawla Chose Her Own Name"** (9.5/10) —
front-loads the recognised name for the Indian audience and withholds.

| Asset | Path | Verified |
|---|---|---|
| Master | `~/Desktop/RENDERS/Columbia - The Sixteen Days (mindwired 22-16).mp4` | 3840×2160 · **22:16** · 2.6 GB · **−14.0 LUFS** · MW outro baked |
| Captions | `~/Desktop/RENDERS/Columbia - The Sixteen Days.srt` | **388 cues**, transcribed from the finished audio, speech to 00:21:58 |
| Thumbs | `~/Documents/.../out/thumbs/columbiakalpana_{A,B,C}.png` | A = her childhood photograph · B = arms spread by a light aircraft · C = the Karnal Aviation Club |

Structure: Kalpana carries ~5 min; the other six crew are woven into the mission
where the record touches them (Brown's camcorder = Missed Opportunity 2); the
Red/Blue shift split is the spine. All seven land twice — the CAIB dedication's
**nine** names (incl. Jules Mier and Charles Krenek) and the seven asteroids found
eighteen months before they died.

#### ⚠ BLOCKED
Chapters and the METADATA description cannot be produced from this session — the
doc spec and manifest are in `~/Documents`, which tooling cannot read.

---

## 🔴 OUTSTANDING

1. **Columbia re-cut (Black Box) — master lost.** Rendered clean at −14.0 LUFS,
   then the 6-hour `--max-run-duration` ceiling deleted the VM mid-fetch. Source is
   intact; re-render only. The live Black Box Columbia video still carries four
   factual defects (Request 1 misattributed to Rocha, Missed Opportunity 8 absent,
   "Peter Gins" for Petr Ginz, 26 stock scenes).
2. **A day of uncommitted work in `~/Documents`** — the `ExhibitScene` highlight
   rewrite, two new preflight gates (per-file repetition; stale-VO blind-spot),
   `FOOTAGE-MAP-columbia.md`, and the columbiakalpana doc spec. **Not committed,
   not recoverable from this clone.**
3. **`~/mindwired` is on branch `claude/best-video-project-lf3bau`** (head was the
   Project Hail Mary commit) — the Air Force One work needs merging to main.
4. **Launch-data debt, now 3 uploads deep** — groundzeroair, colossalsquid,
   projecthailmary all past 48h with no Studio numbers. icahn-validate Step 0 has
   been escaped via BLOCKED-ON-DATA more than once; the note itself says that is
   "legitimate once and corrosive twice".
5. **United 93's "forty four" fix is committed but the live video cannot be
   swapped** (wsFhuwUjg_4). It lands only on a future re-cut.

## HOUSEKEEPING

- **Whisper beats the manifest for captions.** `scripts/whisper_srt.py` transcribes
  the finished audio, so cues cannot drift from SFX, extraHold or the baked outro.
  Prefer it over `gen_doc_srt.py` for cue timing; keep gen_doc_srt for CHAPTERS.
- **Lower the GCE render parallelism.** `GCE_PARALLEL_CHUNKS` defaults to 4 ×
  concurrency 3 = 12 Chrome instances, which triggered the `delayRender` font race
  and killed a full Air Force One render (6 retries per chunk, then cancelled).
  2 × 2 with chunk-size 150 completed with **zero** retries. Both Columbia renders
  used the risky default and got lucky.
- **`render_gce.sh`'s fetch-failure guard works and saved this episode** — when all
  three fetch attempts failed it STOPPED rather than deleted the VM, and the master
  was recovered intact the next morning.
