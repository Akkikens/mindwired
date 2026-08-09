# Francis Scott Key Bridge Collapse — handoff ("Prosecutors Say This Wasn't Just an Accident")

**Status: 4K RENDER IN PROGRESS (GCE) — script, footage, VO, gates, comp, thumbnails all done.**
Not yet published. Channel: Black Box Breakdown (@Watch-BlackBox).

## What's done

| Step | Status | Where |
|---|---|---|
| Icahn validation | PASS-WITH-CONDITIONS, 2026-08-08 (won over Edmund Fitzgerald, which failed its own footage check) | memory `icahn-keybridge` |
| Packaging lock (ctr-engine Run A) | Done — title leads with DOJ-charges wedge, not the saturated "revisiting 2024" angle | Appended to `icahn-keybridge` memory |
| CLAIMS fact base | Done — 95+ labeled claims across 2 research rounds (14 agents total) | `docs/planning/CLAIMS-keybridge.md` |
| Script | 151 scenes, ~29 min runtime | `src/mindwired-doc/docs/keybridge.json` |
| Footage | Real NTSB-docket CCTV of the actual collapse + real DOJ/EPA indictment exhibit + real Commons/NARA photos; 2 factual mismatches caught and fixed (wrong memorial event, wrong "Key Bridge" in DC) | `public/shorts/keybridge/{images,video}/`, `ATTRIBUTION.md` |
| VO | 151 clips, Cartesia, Robyn voice (female — Akshay's explicit choice for this episode), 25.6 min narration | `public/shorts/keybridge/audio/` |
| Gates | 0 blocking, 9 verified-acceptable warnings | `preflight_doc.py keybridge` |
| Comp registered | `KeyBridgeDoc` in `src/Root.tsx`, BB_OUTRO baked | — |
| Stills spot-check | 4/4 verified (cold open, damage exhibit, DOJ exhibit, subscribe card) | `out/qa/keybridge_*.png` |
| Render | 4K, windowed `bed_tension_rud.mp3` | IN PROGRESS — `out/keybridge_gce_launch.log` |
| Metadata package | Title + 2 alternates, description, chapters, tags, hashtags, pinned comment | `docs/metadata/METADATA-keybridge.md` |
| Thumbnails | 3 built PNG files (real NTSB/Commons wreckage photos + real DOJ document, House Style 2.0) | `out/thumbs/keybridge_{A,B,C}.png` |

## The runtime honesty note

Akshay asked for a 40-60 minute documentary. After two full research rounds
(14 agents, ~95 CLAIMS entries covering the bridge's history, the ship, the
minute-by-minute NTSB timeline, all 6 victims individually, the DOJ case, real
quotes from NTSB Chair Homendy and Gov. Wes Moore, real economic-ripple
stories, and a dedicated emergency-response chapter), the honest ceiling of
verified, non-repetitive real material landed at **~29 minutes (151 scenes)**.
This is flagged transparently rather than padded to hit the number — and it's
already comfortably the longest, most heavily-sourced episode this channel has
shipped. Akshay was given the choice to expand further, do a different angle,
or proceed at this length, and chose to proceed (via clearing the GCE auth
blocker rather than requesting more script work).

## Three real bugs caught during production (logged for future reference)

0. **34 scenes (22% of the episode) rendered as bare black screens** in the
   first 4K render — caught only by watching the mid-video verification frame
   after the render completed, not by the automated gates (preflight/relevance
   audit don't check for this). Root cause: these scenes had `stat`/`cap`
   overlay fields but no base `img`/`video` — I incorrectly assumed a `stat`
   chip alone would render on some default background; it doesn't, `stat`/`cap`
   are overlays meant to sit on top of a real photo. Fixed by assigning a real,
   topically-matched `img` from an already-fetched pool to all 34 scenes, then
   re-rendering the full video (justified exception to "ONE render per video"
   — this fixes a hard, explicit CLAUDE.md rule violation, not a minor tweak).
   **Process fix for next episode**: grep the doc-spec for any scene with
   `stat`/`cap`/`tone` but none of `img`/`video`/`exhibit`/`kinetic`/`chapter`/
   `sting` BEFORE the render, not after — this is a 5-line Python check that
   would have caught it before spending the first render's GCE cost.

1. **Auto-fetch pool contamination**: `fetch_doc_footage.py`, when re-run after
   a manual fix to backfill an unrelated pool, re-populated OTHER already-fixed
   pools with wrong-topic images again (an unrelated "82nd Airborne" military
   ceremony for `kb_memorial`, and a "Ben Franklin Bridge" — a different bridge
   entirely — for `kb_bridge_1976`), because those pools weren't yet at their
   full count of 3 when the typo'd first fix attempt silently failed. Caught by
   `audit_scene_relevance.py`, not by eyeballing the contact sheet alone —
   re-confirms CLAUDE.md's "eyeball every contact sheet" rule isn't sufficient
   alone when files get silently re-populated after the initial fetch.
2. **`scripts/fetch_ntsb_docket.py`'s CAROL search API is currently down**
   (HTTP 500 for both free-text and exact-NTSB-number queries, confirmed via
   raw curl). Workaround used: call the docket page directly
   (`data.ntsb.gov/Docket/?NTSBNumber=<case>`) and parse the HTML for
   `docBLOB` links rather than going through the script's search step. The
   script needs a code path that accepts an already-known NTSB number and
   skips CAROL entirely — flagged for a future fix, not fixed in this session.

## What's left before publish

1. **Verify the finished render** once GCE completes: duration ≈29 min body +
   16.1s outro, 3840×2160, −14 LUFS, mid-frame + outro-frame stills.
2. **Akshay's sensitivity/final watch-through** — confirm the attributed-never-
   asserted framing around Nair and the corporate allegations reads right on
   watch, and that all 6 victims are given equal dignity (not a Purja-style —
   wait, wrong episode — not a lopsided emphasis on any one name).
3. **Generate the SRT** via `whisper_srt.py` once the master exists.
4. **Build 3-5 funnel Shorts** (invoke `shorts-funnel`) — not yet planned for
   this episode. Strong candidate beats: the cold-open MTA-officer radio call,
   the "the fuel pump — remember that detail" foreshadowing payoff, the real
   DOJ press-conference-aboard-a-ship-with-the-wreckage-behind-them reveal.
5. **Test & Compare**: upload all 3 thumbnail variants at publish.
6. Fill in the real long-form URL into the Shorts schedule and
   `docs/planning/LAUNCH-LESSONS.md` publish log once live.
7. Note: per `icahn-keybridge`, avoid scheduling this back-to-back with Three
   Mile Island — both are "official report vs. who's really responsible"
   framings and would read repetitive on the same channel in close succession.

## Sensitivity summary
See `docs/planning/CLAIMS-keybridge.md`'s correction block (20 numbered
corrections) for the full attributed-never-asserted gate. Highest-risk items:
the named-but-not-convicted defendant Radhakrishnan Karthik Nair, and the
allegation (not yet proven) that a cost-cutting fuel-pump modification caused
the fatal second blackout. No conspiracy claims platformed; physical cause is
cited as NTSB-settled fact throughout, criminal liability is not.
