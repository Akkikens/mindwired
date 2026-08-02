# Mindwired — onboarding for a new Claude Code session

You're about to work on **Mindwired**, a faceless YouTube video factory. Everything
is code-generated: Remotion (React → MP4) for video, React Three Fiber for 3D,
TTS narration with word-level timing. Nothing is hand-edited in a video editor —
if you want to change a frame of any video, you change code or data and re-render.

**Read `CLAUDE.md` in full before touching anything.** It's the production
manual, checked into this repo's root, and Claude Code loads it automatically
as project instructions every session. This file is just a fast orientation —
CLAUDE.md is the actual authority and is kept current; if the two ever
disagree, trust CLAUDE.md.

## The 5 channels

| Channel | Lane | Voice/host |
|---|---|---|
| **mindwired** | faceless space/science + gaming/tech | Orion host; cloned narrator voice |
| **Black Box Breakdown** | disaster & corporate-catastrophe forensics (@Watch-BlackBox) | host Reid |
| **DimaagBatti** | Hindi explainers (economy/geopolitics/how-it-works) | host Rohan |
| **KickOffDaily90** | football / World Cup | host Jamie |
| **Singaloo.kids** | kids singalongs (separate repo, `../singaloo`) | host Melody |

**Always confirm which channel a video is for before the first render.** Branding
and the subscribe outro bake into the render — deciding mid-render means a wasted
full re-render.

## The three video-building systems (all in this repo except cosmic)

1. **Cosmic explainer engine** — lives in the `singaloo` repo, produces the bulk
   of mindwired's space long-forms from a JSON topic file, finished mp4 copied
   here for upload.
2. **Viral shorts engine** (`src/viral`) — vertical Shorts from a plan JSON,
   AI avatar hosts, registered in `src/Root.tsx`. See `src/viral/README.md`.
3. **Doc-engine documentaries** (`src/mindwired-doc`) — the system used for
   Black Box Breakdown and most one-off long-forms (this is what "doc-episode"
   below refers to). Shared primitives for hand-built one-off comps live in
   `src/components` / `src/lib`.

## How a documentary episode actually gets made

This is the `doc-episode` skill's pipeline, run roughly in this order:
1. **Validate the topic first** (`icahn-validate` skill) — outlier-proven
   demand, not a guess. No production work starts on an unvalidated topic.
2. **Research fan-out → `docs/planning/CLAIMS-<slug>.md`** — the fact base.
   Every line of the eventual script must trace back to this file.
3. **Script → `src/mindwired-doc/docs/<slug>.json`** — cold open, chapters,
   coda, verbal bridge to the next video, subscribe.
4. **Footage** (`scripts/fetch_doc_footage.py`) — real archival footage first;
   AI/stylized visuals only for genuinely unfilmable moments.
5. **Voiceover** (`scripts/build_doc_vo.py`) — Cartesia TTS, idempotent per clip.
6. **Gates** (`scripts/audit_scene_relevance.py`, `scripts/preflight_doc.py`) —
   hard blockers. A doc that hasn't passed preflight does not get rendered.
7. **Register the comp in `src/Root.tsx`**, spot-check a few stills.
8. **ONE render** (`scripts/render_gce.sh`, GCE, 4K by default) — never a
   second full render as a "checkpoint."
9. **Package** (`ctr-engine` for title/thumbnail, `docs/metadata/METADATA-<slug>.md`)
   and cut funnel Shorts (`shorts-funnel` skill).

There's a one-command wrapper, `scripts/ship_doc.py`, that runs steps 5-8 with
human checkpoints — see CLAUDE.md for exact flags.

## Rules that will bite you if you skip CLAUDE.md

These are the ones most likely to cause real damage if missed — the full
reasoning and more rules are in CLAUDE.md:

- **Honesty is non-negotiable.** Contested claims about real people (living or
  recently deceased) are always attributed to whoever actually argues them,
  never asserted as fact by the narrator. This is both an ethics rule and,
  per the channel's own algorithm notes, a growth strategy — a trust-breaking
  video is scored as deceptive and kills reach.
- **Real footage before AI-generated.** A "dossier"/case-file reconstruction
  is the one accepted exception, used sparingly, only when zero real footage
  or photo exists for a beat.
- **Never regenerate the subscribe outros.** They're paid-for, reviewed,
  standing assets in `assets/subscribe-outro/` — always append the existing
  one for the target channel, baked into the single render.
- **Never reuse footage across videos on the same topic** — a preflight check
  blocks on byte-identical hook footage between videos.
- **No bare black-screen-and-text scenes.** Every scene needs a real image or
  video behind it — this has caused real viewer complaints before.
- **New video = new footage.** Never copy another slug's media directory.

## Where things live

- `docs/metadata/` — one `METADATA-<slug>.md` per upload (title, description, tags)
- `docs/planning/` — fact bases (`CLAIMS-*.md`), roadmap, topic queue, handoff docs
- `docs/guides/` — how-to specs (hosts, thumbnails, hook-writing, pipeline specs)
- `docs/publishing/` — upload kits, chapter/timestamp generators
- Finished renders + captions live at the repo root, named after the actual
  video title, not the working slug.

## Skills you'll want (invoke with `/skill-name` in Claude Code)

`icahn-validate` (topic demand check) → `doc-episode` (the full pipeline above)
→ `ctr-engine` (titles/thumbnails) → `hook-doctor` (first-15-seconds rewrites)
→ `shorts-funnel` (cutting vertical Shorts) → `publish-video` (upload-day
checklist) → `launch-diagnosis` (why a published video underperformed).

## First thing to actually do

Read `CLAUDE.md` top to bottom, then ask what topic/video you're working on —
the answer determines which channel, which system, and which skill to start with.
