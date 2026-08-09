# Three Mile Island — handoff ("The Meltdown Reactor AI Just Reopened")

**Status: RENDERED, VERIFIED, PACKAGED — ready for Akshay's final review + upload.**
Not yet published. Channel: Black Box Breakdown (@Watch-BlackBox).

## What's done

| Step | Status | Where |
|---|---|---|
| Icahn validation | PASS-WITH-CONDITIONS, adversarially re-checked | memory `icahn-threemileisland` |
| Packaging lock (ctr-engine Run A) | Done | Appended to `icahn-threemileisland` memory |
| CLAIMS fact base | Done, 5 gaps closed during production | `docs/planning/CLAIMS-threemileisland.md` |
| Script | 53 scenes | `src/mindwired-doc/docs/threemileisland.json` |
| Footage | Fetched + hand-verified, 2 wrong-topic images caught & removed | `public/shorts/threemileisland/{images,video}/` |
| VO | 53 clips, Cartesia, 8.4 min narration | `public/shorts/threemileisland/audio/` |
| Gates | 0 blocking (preflight + relevance audit) | — |
| Comp registered | `ThreeMileIslandDoc` in `src/Root.tsx` | — |
| Render | 4K (3840×2160), 586.7s, −14.1 LUFS, GCE on-demand | `The Meltdown Reactor AI Just Reopened.mp4` (repo root) |
| Captions | 156-cue whisper transcript | `The Meltdown Reactor AI Just Reopened.srt` (repo root) |
| Metadata package | Title + 2 alternates, description, chapters, tags, hashtags, pinned comment | `docs/metadata/METADATA-threemileisland.md` |
| Thumbnails | 3 built PNG files (real archival photo, graded, House Style 2.0) | `out/thumbs/threemileisland_{A,B,C}.png` |
| Shorts | 4 trailer Shorts built, rendered, mastered to -14 LUFS (2026-08-07) | `out/shorts_final/threemileisland_{1,2,3,4}.mp4`, comps `ThreeMileIslandShort1-4` |

## The one production lesson worth flagging

The real footage source (NRC's own "Moments in NRC History" YouTube video,
CC-BY licensed) is a **rapid-cut retrospective montage** — new content every
1-3 seconds. My first pass at clipping cold-open footage grabbed windows that
looked correct at a single spot-check frame but silently cut into an unrelated
interview segment 2-3 seconds later. Caught it during the mandatory
still-spot-check step (per CLAUDE.md's "mandatory still spot-check is what
catches it" rule — same lesson as the Tunguska episode's black-screen bug).
Fixed by re-scanning every candidate window at ~0.2-0.5s granularity across its
**full** intended duration, not just the start. Logged in
`public/shorts/threemileisland/video/ATTRIBUTION.md` for the next person who
touches this source file.

## What's left before publish

1. **Akshay's sensitivity/final watch-through** — no ethics-review-tier gate
   was required (47-year-old event, zero confirmed deaths), but do a normal
   pass: contested health-science line (Wing 1997 study) is presented
   two-sided, never resolved — confirm that reads right on watch.
2. **Re-verify the ship-by window before scheduling**: the currency case rests
   on the NRC's final Environmental Assessment (expected ~Sept 2026) and fuel
   arrival (end of 2026) — both still pending as of validation. Recommend
   publishing within 4-8 weeks of 2026-08-05.
3. ~~Build + render the 4 planned Shorts~~ — **DONE 2026-08-07.** Drip
   starting ~24h after the long-form publishes.
4. **Test & Compare**: upload all 3 thumbnail variants at publish (ctr-engine
   Run B convention) — winner picked on watch-time share, not CTR.
5. Fill in the real long-form URL into the Shorts schedule's pinned comments
   and `docs/planning/LAUNCH-LESSONS.md` publish log once live.
6. Note: Chernobyl ("The Official Report vs. The Show") and the 3rd MH370
   video are both already-made, unpublished episodes ahead of this one in the
   queue per Akshay's direct confirmation — sequence accordingly.

## Sensitivity summary
Event 47 years old, zero confirmed direct deaths. Contested health-effects
science (Wing 1997 vs. mainstream NRC/EPA consensus) presented two-sided.
Named living parties (Constellation, Microsoft, TMIA/Eric Epstein) quoted
factually, no motive speculation, no names of unverified officeholders put on
screen. No conspiracy claims platformed. See `CLAIMS-threemileisland.md`
section 5 for the full gate.
