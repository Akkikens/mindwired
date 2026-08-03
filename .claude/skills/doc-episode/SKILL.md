---
name: doc-episode
description: End-to-end runbook for producing ONE documentary long-form episode on the mindwired doc engine — the exact pipeline that shipped Mars One, OceanGate, Concorde, Moon-seller, Space Shuttle, United 93, and AI171. Use when the user says "make the <topic> doc", "new episode", "next documentary", "run the doc pipeline", or hands over an Icahn-validated topic to turn into a finished video. Covers research fan-out → CLAIMS fact base → doc-spec script → footage → VO → gates → ONE 4K render → packaging, with every gate command.
---

# Doc Episode — one validated topic in, one finished 4K documentary out

Run the steps IN ORDER. Every step has a gate; a failed gate stops the run. Read
`CLAUDE.md` first — nothing below overrides it. Companion skills (do NOT redo their
work here): **ctr-engine** (titles/thumbnails), **hook-doctor** (first 15s rewrites),
**shorts-funnel** (cutting the funnel Shorts).

## Step 0 — Channel + demand gates (before ANY work)

1. **Ask which channel** (mindwired / Black Box Breakdown / other). Branding + the
   subscribe outro bake into the render: `MW_OUTRO` = 527 frames, `BB_OUTRO` = 483
   frames (defined in `src/Root.tsx`). Deciding mid-render = a wasted full re-render.
   For a Black Box episode, also read `docs/guides/BLACKBOX-PIPELINE-SPEC.md` first
   (CLAUDE.md mandates it — evidence engine, radio-scene honesty labels).
2. **Icahn validation must already be PASS** (a memory entry `icahn-<slug>` with real
   outlier ratios). If not, stop and run the Icahn method first — no exceptions.
3. **Topic-demand check (YT Studio pull, @Watch-BlackBox, 2026-07-26 — recheck live
   before leaning on the exact figures):** MH370 got 399.5K impressions (5.0% CTR,
   37.3% AVD → 29K views); Tenerife got 20.1K impressions (3.5% CTR, 35.9% AVD →
   1.5K views). Retention and CTR were nearly identical — the difference was the
   impressions pool YouTube granted, which is a TOPIC-DEMAND signal. Prefer topics with
   pre-existing global name recognition / search demand; a historically-important-but-
   unrecognized topic gets a tiny test pool no matter how good the video is. Topic
   selection is the channel's #1 lever right now.

## Step 1 — Research fan-out → `docs/planning/CLAIMS-<slug>.md`

Launch **4-5 parallel research agents**, one per dimension:

| Agent | Dimension |
|---|---|
| 1 | Origins / the rise (people, dates, money, engineering) |
| 2 | The disaster + the OFFICIAL report (BEA/NTSB/CAIB/AAIB/USCG — find the real PDF URL) |
| 3 | Aftermath: legal outcomes, legacy, where everyone is now, living-person status |
| 4 | **Archival-footage scout — MANDATORY.** Must report what real VIDEO exists (exact Wikimedia Commons / NASA / NARA file titles + licenses), not just photos. If no free footage of a beat exists, say so explicitly so the script plans a real still instead — and if truly nothing real exists for that ONE beat (an unfilmable moment), that's a `dossier: true` candidate (docs/guides/DOSSIER-SCENES.md), used sparingly, never for a real person/event with archival coverage. |
| 5 (optional) | The human thread for the cold open (a named person, a dated moment) |

Merge into `docs/planning/CLAIMS-<slug>.md` (model: `CLAIMS-concorde.md`):

- Header: labels legend, primary exhibit document with live URL, Icahn memory link.
- **"⚠ DATA CORRECTIONS (baked in — do NOT revert)"** block first — every number the
  fan-out corrected, with the exact softened phrasing to use.
- Every claim labeled **CONFIRMED / DISPUTED / ALLEGED (by whom) / UNVERIFIED /
  EXCLUDE**, with sources. Living people flagged 🧍 — their claims stay
  **attributed-never-asserted** (highest defamation risk; see Concorde/Taylor,
  AI171 pilot-blame handling).
- Archival/footage plan section from agent 4.

**GATE: this file is the fact base — every scene line in the script must trace to a
claim here.** Never platform conspiracy claims; recreations get labeled; real
documents only as exhibits.

## Step 2 — Script `src/mindwired-doc/docs/<slug>.json`

Doc-level fields: `{slug, title, channel, niche, language, voice: "00d3c951-0474-4b48-814e-ef815f533e63"}`
(`niche` drives the footage fetcher's source ranking: aviation|space|ocean|history|tech|generic).

**Structure (in order):**
1. **Cold-open 2.0** — a dated scene with a person in tension ("It is January twenty
   eighth, nineteen eighty six…"), NEVER a stat dump. Run **hook-doctor** on it.
2. `sting` scene → title card → **chaptered acts** (`chapter` cards; 6-8 chapters).
3. **First-person coda** (reflective, narrator steps forward).
4. **Verbal bridge naming a SPECIFIC next video** ("If X shocked you, wait until you
   see Y…") → subscribe end scene.

**Scene craft fields** (all real — see `spaceshuttle.json`/`marsone.json`):
`id, text, img, query, video, videoQuery, exhibit, source, highlight, kinetic, motion
("fast"|"slow"), extraHold (frames), sfx, stat, cap, chapter, sting, tone, stock, speed, note`.

- **`video`/`videoQuery` is MANDATORY on every beat where real motion footage
  plausibly exists.** The first 4 pivot docs shipped 0% real video and got flagged;
  spaceshuttle fixed it at 28% (22/79 scenes). Target well above 0% — agent 4's scout
  report tells you exactly which beats can carry real clips.
- **Exhibits = real government documents ONLY** (BEA/CAIB/AAIB/USCG/court filings):
  `pdftoppm -png -f <page> -l <page> -r 150 report.pdf public/shorts/<slug>/images/<prefix>`
  then scene gets `exhibit` + `source` (on-screen citation — cite the ACTUAL fetched
  PDF, the Concorde episode initially cited the wrong report edition) + `highlight`.
- **No bare black-screen text scenes:** every `chapter`/`kinetic` scene gets an `img`
  (reuse a real photo the segment already established).
- **TTS conventions:** spoken `text` spells things the way a narrator SAYS them —
  "seven three seven MAX", "Flight six ten", "A three twenty"; NEVER ALL-CAPS in
  spoken text (TTS spells it letter-by-letter). Written forms stay in `cap`/`stat`.
- Sensitive victim beats with no free-licensed photo → respectful text-only memorial
  cards, never a misleading stock stand-in (OceanGate pattern).

## Step 3 — Footage

```bash
.venv-agent/bin/python scripts/fetch_doc_footage.py <slug> --uhd
# (.venv-lipsync/bin/python also works — the fetcher needs httpx; bare python3 does not have it)
```

- **EYEBALL every contact sheet in `out/qa/`** — search APIs return junk confidently
  (RC toy Concordes, wrong-country ceremonies, wrong celestial bodies have all
  slipped in before).
- **The fetcher silently SKIPS scenes without a `query`/`videoQuery`** — silence is
  not "fetched". Check the relevance audit for UNSOURCED/missing assets.
- **Known-title misses → direct Wikimedia Commons API** (faster than fuzzy rewords):
  `https://commons.wikimedia.org/w/api.php?action=query&titles=File:<exact title>&prop=imageinfo&iiprop=url|size|extmetadata`
  with a real `User-Agent` header (Commons blanks the default httpx UA), then `curl`
  the returned url and `ffmpeg` transcode to 1080p H.264 to match the pipeline.
- Log every manual pull in `public/shorts/<slug>/ATTRIBUTION.md` (source, license URL).
- **License caveat: non-US government works are NOT automatically PD** (India's AAIB,
  UK/French agencies, etc. — US-gov PD logic does not transfer). Verify each license.
- **NEW VIDEO = NEW FOOTAGE.** Never copy another slug's media dir. Fix audit flags by
  refetching real footage, not by hoping.

## Step 4 — VO

```bash
python3 scripts/lint_tts_text.py src/mindwired-doc/docs/<slug>.json   # gate: exit 0
.venv-lipsync/bin/python scripts/radio_recreate.py <slug>   # ONLY if any scene has `speaker` (Black Box); needs the venv (httpx/cartesia)
.venv-lipsync/bin/python scripts/build_doc_vo.py <slug> --speed 0.96
```

- Idempotent per clip — re-runs never re-spend Cartesia quota. (`--speed 0.96` is what
  the shipped pivot docs used; omitting the flag uses the episode's manifest speed,
  else 0.97.)
- **Empty-clip check (Cartesia leading-"..." bug renders silent mp3s):**
  `find public/shorts/<slug>/audio -name '*.mp3' -size -15k` and ffprobe anything
  flagged; re-synth with `--only <ids> --force`.
- **Ear-check:** splice hook + middle + last clips into a sample and LISTEN before
  proceeding (ship_doc.py builds `out/qa/<slug>_vo_sample.mp3` for you).

## Step 5 — Gates (0 blocking REQUIRED before render)

```bash
python3 scripts/audit_scene_relevance.py <slug>   # MISMATCH/WEAK/UNSOURCED/REUSE/HOOK-REUSE
python3 scripts/preflight_doc.py <slug>           # hard render gate — exit 0 or NO render
```

- **HOOK-REUSE (a first-30s file byte-identical to another slug's) is render-blocking
  (exit 2).** Fix with a fresh fetch of different footage — never by copying media.
- Preflight blocks on: stale manifest, missing img/video/diagram refs, empty VO clips,
  unlabeled radio scenes, unknown sfx names, TTS-lint hits. If you added images after
  the VO build: `build_doc_vo.py <slug> --manifest-only` to refresh the manifest.
- Iterate to **0 blocking**; warnings are acceptable only when individually verified
  false-positive (spaceshuttle went 2 blocking + 30 warnings → 0 + 9 verified).

## Step 6 — Register the comp in `src/Root.tsx`

**The manifest must exist BEFORE typecheck/render** (Root imports it statically) —
that is why the VO build precedes this step.

```tsx
import <slug>Doc from "./mindwired-doc/docs/<slug>.json";
import <slug>Manifest from "./mindwired-doc/docs/<slug>.manifest.json";

<Composition
  id="<CompId>"
  component={makeDocComp(<slug>Doc, <slug>Manifest, MW_OUTRO)}   // BB_OUTRO for Black Box
  durationInFrames={docTotalFrames(<slug>Doc, <slug>Manifest, MW_OUTRO)}
  fps={30} width={1920} height={1080}
/>
```

Spot-check 3-4 stills before render:
`npx remotion still <CompId> out/qa/<slug>_f<N>.png --frame=<N>`
(cold open, an exhibit, a video scene, the last body scene) and LOOK at them.

## Step 7 — The ONE render (GCE, 4K)

Pre-check auth FIRST — expired gcloud creds need an interactive `gcloud auth login`
that only Akshay can run:

```bash
gcloud auth print-access-token >/dev/null || echo "AUTH EXPIRED — ask Akshay to run: gcloud auth login"
```

```bash
nohup scripts/render_gce.sh <CompId> <slug> > out/<slug>_gce_launch.log 2>&1 &
```

- **Music: the `public/beds/doc_*.mp3` set is BANNED — render with NO music flags.**
  Only if replacement beds ever land: add `--music public/beds/<newbed>.mp3 --windows
  <slug> --music-gain-db -20` (the three go together — `--windows` errors without
  `--music`; windowed = bed only at cold open / chapter transitions / closing).
- **Launcher-exits-early trap:** the `nohup … &` returns your shell immediately — the
  render is NOT done. Watch the log:
  ```bash
  until grep -q '\[gce\] done ->' out/<slug>_gce_launch.log; do sleep 180; done
  ```
  (This loop spins forever if the launcher died — if it runs suspiciously long, tail
  the log for gcloud/render errors instead of waiting.)
- Known flakes: transient scp/tar failures on the ~340MB upload → plain retry fixes
  them. If the log says "RENDER DONE BUT NOT FETCHED", the VM is STOPPED (not
  deleted) and the log prints the exact recovery scp command — the master survives.
- (Local fallback: `python3 scripts/render_and_master.py <CompId> out/<slug>.mp4 --scale 2`.)

**Verify before calling it done** (output lands at `out/<slug>_gce.mp4`):

```bash
ffprobe -v error -show_entries format=duration -of csv=p=0 out/<slug>_gce.mp4   # expect (body frames + outro frames) ÷ 30 seconds
ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 out/<slug>_gce.mp4  # 3840,2160
ffmpeg -ss <mid> -i out/<slug>_gce.mp4 -frames:v 1 out/qa/<slug>_mid.jpg        # LOOK at it
ffmpeg -sseof -8 -i out/<slug>_gce.mp4 -frames:v 1 out/qa/<slug>_outro.jpg      # outro present? LOOK
```

Confirm the −14 LUFS line in the render log (render_and_master prints before/after).

## Step 8 — Package + ship

1. **SRT + chapters:** `.venv-lipsync/bin/python scripts/gen_doc_srt.py <slug>` —
   writes `mindwired_<slug>.srt` and prints the exact CHAPTERS block (doctiming.py is
   the single timing source; never hand-compute timestamps).
2. **`docs/metadata/METADATA-<slug>.md`** — full-SEO standard (model:
   `METADATA-boeing737max.md`): title + A/B alternates (run **ctr-engine**), big
   searchable description ending with the "▶ MORE FROM" block using REAL URLs from
   memory (`blackbox-published-urls` / `mindwired-published-urls`), parser-safe
   chapters, ~495-char tags, 15 hashtags, pinned comment, category/license lines.
   English only (Hindi only on DimaagBatti).
3. **Final filename = the actual video title** at repo root
   (`mindwired_<Title>.mp4`), slugs only for working files.
4. **4 vertical funnel Shorts:** invoke **shorts-funnel**.
5. **Handoff doc `docs/planning/<SLUG>-HANDOFF.md`** (model: `AI171-HANDOFF.md`):
   status line, file-path table, sensitivity warnings, what's left before publish.
6. **Commit** everything (doc spec, manifest, CLAIMS, metadata, SRT, handoff — never
   the multi-GB master) and **write the episode memory** (structure, honesty rules,
   gotchas hit, link to the Icahn memory).

## One-command alternative: ship_doc.py

```bash
python3 scripts/ship_doc.py <slug> <CompId> [--windowed] [--yes]
```

Runs the step 4-5 gates, the render, and the SRT in the mandatory order — lint →
radio_recreate → build_doc_vo → VO ear-check → image audit → preflight → 4 stills →
the ONE render_and_master (4K default, `--hd` opts out) → SRT — with human
checkpoints at the VO sample, contact sheets, and stills. **The comp must already be
registered (step 6) before running it** — it renders stills and the comp itself. Its
internal VO build uses the manifest speed (else 0.97); to build at 0.96 run step 4's
`build_doc_vo.py --speed 0.96` first (idempotent — ship_doc's call then no-ops). Its
render is LOCAL; when the render must go to GCE (the normal case — no local CPU
load), run steps 4-6 individually and use `render_gce.sh` at step 7. `--yes` only on
reruns where the checkpoints were already reviewed. Do not pass `--music` while the
bed ban stands.

## What this skill will NOT do

Skip a gate to save time, assert claims about living people, use another video's
footage, label a recreation as real audio, render before preflight passes 0 blocking,
or ship without the channel's subscribe outro baked in. If the topic has no Icahn
PASS, the answer is "validate first", not a better hook.
