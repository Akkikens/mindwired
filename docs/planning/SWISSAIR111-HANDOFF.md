# Swissair 111 — episode handoff (Black Box Breakdown)

**STATUS (2026-08-26): PUBLISHED — https://youtu.be/TXgg2Qy1Oa0** (uploaded
~2026-08-25 as "Swissair 111 : The 17 Minutes That KILLED 229 People", inside
the Sept 2-16 dual news-peg window early). Remaining: funnel Shorts drip
(in progress), pinned comment + description from METADATA-swissair111.md
(TWA800 MORE FROM link now resolved to https://youtu.be/pr-F-iRTP18).

**Prior status (2026-08-25): RENDERED, ready for Akshay's review + upload.**
1080p (1920x1080, per explicit instruction), 38:29 final, -14.1 LUFS. Final:
`Swissair 111 - The 17 Minutes That Killed 229.mp4` at repo root.

## Render war story

The plain single-pass GCE render (`render_and_master.py --scale 2` path)
failed at frame 1252/69815 with a misleading "delayRender... font Space
Grotesk... was called but not cleared" timeout — the same class of
intermittent Remotion instability first hit on the Starfish Prime episode
two days earlier (memory `starfishprime-video-10fps-bug`), which that
session worked around ad hoc but never turned into a reusable script.

Built that reusable fix this episode: `scripts/render_chunked_and_master.py`
+ `scripts/lib/chunked_render.py` — splits the render into 250-frame chunks,
each its own fresh `npx remotion render --frames=A-B` process, with
per-chunk retry and a persistent (resumable) chunk directory. Wired into
`render_gce.sh` as `CHUNKED=1`.

Two more bugs found and fixed while building it:
1. **Resource contention, not random flakiness.** The second attempt (24
   concurrent Chrome tabs: 6 parallel chunks × 4 concurrency) reliably
   failed on frames 750-1499 — the real-video-heavy cold-open — even though
   that exact range rendered fine in isolation locally. Fixed by dropping to
   12 concurrent tabs (`GCE_PARALLEL_CHUNKS=4`, `GCE_CHUNK_CONCURRENCY=3`)
   and raising `--remotion-timeout` to 240s. Third attempt: 280/280 chunks,
   zero retries.
2. **My own chunking script wasn't failing fast** — a fatal chunk failure
   would still let `ThreadPoolExecutor`'s default `wait=True` drain the
   entire remaining queue (200+ more chunks, ~20+ min) before reporting the
   already-known error, AND the temp directory holding all completed chunks
   would be deleted on the way out via `tempfile.TemporaryDirectory`,
   discarding real work. Fixed: `cancel_futures=True` on a fatal error, and
   chunks now render into a persistent, resumable directory (skip-existing)
   instead of an auto-deleting temp dir. Validated with targeted local
   tests before the real re-render (confirmed cancellation stops mid-queue;
   confirmed resume via skip-existing works; confirmed no chunk-boundary
   splice glitches).

**A real content bug surfaced only via the SRT/chapters output** after the
render finished: the title-card scene had `chapter: "THE FIRE\nNOBODY COULD
SEE"` — chapter 6's title text, accidentally duplicated onto the title card
instead of the episode's own title. Caught by comparing the printed chapter
list against the doc JSON. Fixed in the JSON, then patched into the
already-completed render via a targeted 371-frame re-render (frames
2006-2376) + an `ffmpeg` trim/concat splice, rather than a full second
GCE render — see the `ffmpeg -filter_complex trim+concat` command in this
session's history if this pattern is needed again.

**Image-reuse rebalanced twice.** First pass over-concentrated on `hbiwf`
(100+ scenes on 3 real photos) after a bad/wrong-subject `reconstruction_1`
image was discovered (showed an unrelated aerospace-manufacturing warehouse,
no ATTRIBUTION.md entry — deleted) and its 14 scenes got reassigned. A
second, chapter-aware rebalance pulled roughly a third of the technical/
legacy-chapter scenes off `hbiwf` onto `swissairfleet`/`memorial`/
`oceannight`/`navyrecovery`, landing at: hbiwf 81, swissairfleet 31,
memorial 23, oceannight 12, navyrecovery 11, tsbreportcover 5.

**Real TSB report pages were fetched but NOT used as generic b-roll.** 4
real pages from the actual 351-page TSB PDF (cover, §2.13.1, Conclusions,
Findings as to Causes) were rendered via `pdftoppm` and briefly used across
41 scenes — then correctly walked back (independently, by both this session
and a concurrently-running footage-research agent) once the Crown Copyright
commercial-reuse restriction (flagged in CLAIMS-swissair111.md) was
recognized as unresolved. The 5 scenes citing specific TSB sections instead
use a properly generated, honestly-labeled `dossier` illustration (a
"RECONSTRUCTION"-tagged case-file cutout, `scripts/gen_doc_dossier.py`) —
never a real scan, never claimed as one.

**Real ATC audio confirmed, not a recreation.** All 10 radio scenes use
genuine 1998 ATC recordings (two independent 2017 re-uploads of the actual
May-2007 TSB-released tape, transcribed locally with faster-whisper,
re-verified after cutting) — `radioLabel: "ACTUAL ATC RECORDING"` is
accurate, not aspirational.

Icahn PASS (memory `icahn-swissair111`) — winner of a round-2 sweep after
round 1 came back thin. Fresh 546.9:1 headline + confirmed dual news-peg:
28th crash anniversary (Sept 2, 2026) two weeks before the first dramatized
feature film's confirmed World Premiere (Sept 16, 2026, Atlantic
International Film Festival, Halifax).

## Files

| What | Where |
|---|---|
| Doc spec (179 scenes, ~35.1 min narration) | `src/mindwired-doc/docs/swissair111.json` |
| Manifest | `src/mindwired-doc/docs/swissair111.manifest.json` |
| Fact base (extensive, 4 research passes) | `docs/planning/CLAIMS-swissair111.md` |
| Comp | `Swissair111Doc` in Root.tsx (BB_OUTRO baked) |
| Render logs | `out/swissair111_gce_driver3.log` (successful attempt) |
| Chunked-render infra (new, reusable) | `scripts/render_chunked_and_master.py`, `scripts/lib/chunked_render.py` |
| Assets + licenses | `public/shorts/swissair111/{images,video,audio}/ATTRIBUTION.md` |
| Music | NONE under narration (explicit instruction) — only the outro's own baked-in audio |
| Thumbnails | `out/thumbs/swissair111_{A,B,C}.png` (`scripts/gen_swissair111_thumb.py`) |
| SRT | `Swissair 111 - The 17 Minutes That Killed 229.srt` |
| Metadata | `docs/metadata/METADATA-swissair111.md` |
| Funnel Shorts | NOT YET BUILT |

## Ship window

**Target Sept 2 - Sept 16, 2026** to land inside both the anniversary and
the film-premiere news pegs — real time pressure, not a "whenever" topic.
