---
name: icahn-validate
description: Validate a video topic BEFORE any production work using the Icahn outlier method, upgraded with topic-demand (name-recognition) weighting. Use for any new video idea, "should we make X", "is there demand for this", "icahn check", "validate this topic", topic-queue grooming in docs/planning/TOPIC-QUEUE.md, or a post-mortem where a flop traces to demand rather than packaging. No script, footage fetch, VO, or render happens on an unvalidated topic — this skill is the gate in front of the entire pipeline. Validates one named candidate topic (its outlier sweeps double as idea discovery when no candidate is given) — breaking down a single outlier video is video-analyzer-icahn, and packaging is ctr-engine.
---

# Icahn Validate — prove demand before spending a single production hour

## Why this gate exists (2026-07-26 analytics lesson — internalize this)

Real YouTube Studio numbers from Akshay's Studio review of 2026-07-26 (a snapshot,
not canon — re-pull live from Studio before citing these in a later diagnosis):

| Video (channel) | Impressions | CTR | Avg view duration | Views |
|---|---|---|---|---|
| MH370 (Black Box Breakdown) | 399,500 | 5.0% | 37.3% | 29,000 (channel best) |
| Tenerife (Black Box Breakdown) | 20,100 | 3.5% | 35.9% | 1,500 |
| 21 Astronauts (mindwired) | — | — | — | 56,000 |
| every other long-form | — | — | — | under 1,500 |

Retention and CTR are nearly IDENTICAL across the hit and the flop. The difference
is the size of the impressions pool YouTube granted — a 20x gap. That pool size is a
**topic-demand signal, not a packaging problem**. Topics with pre-existing global
name recognition (MH370, astronauts dying) get big test pools; historically-important-
but-unrecognized topics (Tenerife — the deadliest crash in aviation history, and it
still stalled) do not. Topic selection is currently the channel's #1 lever. Packaging
(ctr-engine) and hooks (hook-doctor) only optimize within the pool this skill wins.

## When to run

- Any new video idea, from anyone, on any channel (mindwired / Black Box Breakdown /
  DimaagBatti / KickOffDaily90) — BEFORE step 2 of the pipeline (research/CLAIMS).
- Grooming docs/planning/TOPIC-QUEUE.md (adding, reordering, or re-checking entries).
- After a flop, when ctr-engine/launch diagnosis rules out packaging — confirm or
  deny that demand was the failure.
- At production start for any already-queued topic whose evidence is older than
  ~2 weeks — ratios are point-in-time (see the Kola Superdeep invalidation below).

## Step 1 — the outlier sweep (exact working method)

Design 3-5 search queries a real viewer would type: the topic's common name, a
"documentary" variant, a "what happened" variant, and any alternative names
(flight number, ship name, nickname). Then run the production command — verified
working with yt-dlp 2026.06.09:

```bash
yt-dlp --dump-json --no-warnings \
  "ytsearch25:<query 1>" \
  "ytsearch25:<query 2>" \
  "ytsearch25:<query 3>" \
  2>/dev/null | python3 -c '
import sys, json
rows, seen = [], set()
for line in sys.stdin:
    d = json.loads(line)
    if d["id"] in seen:
        continue
    seen.add(d["id"])
    v = d.get("view_count") or 0
    s = d.get("channel_follower_count") or 0
    rows.append((v / s if s else 0.0, v, s,
                 d.get("channel") or "?", d.get("upload_date") or "?",
                 (d.get("title") or "")[:70], d["id"]))
rows.sort(reverse=True)
for r, v, s, ch, up, t, vid in rows:
    print(f"{r:8.1f}:1  {v:>12,} v / {s:>10,} subs  {up}  {ch}  |  {t}  https://youtu.be/{vid}")
'
```

Rules for the sweep:
- **Full `--dump-json`, never `--flat-playlist`** — flat mode is fast but does NOT
  return `channel_follower_count`, so ratios can't be computed. Full extraction runs
  ~1-3s per result; 3 x 25 results ≈ 2-4 minutes. That is the price of real numbers.
- Ratios come ONLY from this output — never from eyeballing a channel page. The Kola
  Superdeep topic was queued on a misread channel stat (43.7K vs the real 1.8M subs,
  a 41x error) and survived in the queue until a live re-check killed it. Compute,
  don't read.
- Dedupe by video id (queries overlap heavily).
- Note `upload_date` — fresh outliers (under 12 months) are worth far more than old
  ones. A niche whose only proof is years old (Kola's best was 2019) is not proven.

## Step 2 — PASS criteria (raw Icahn)

PASS requires:
- **A headline outlier at the CLAUDE.md bar: 100K+ views on a sub-100K-sub channel
  at 5:1+ views:subs** (mediocre packaging strengthens the signal — the demand pulled
  despite the package).
- **Plus at least one more independent small-channel outlier above 3:1** with
  meaningful absolute views. A big ratio on trivial absolute numbers (500 views /
  10 subs = 50:1) is noise, not demand. Every shipped validation had both: Concorde
  (170:1 headline at 135K views + 16.5:1 + 6:1 corroboration), AI171 (24.4:1 at
  232K views), Mars One (39:1 + 8:1 + 3:1).
- **Extreme outliers (100:1+) are the strongest signal in the system.** Real
  precedents from this channel's own validations:
  - Mayday Chronicles — 135,792 views / 799 subs = **170:1** (Concorde AF4590 crash)
  - Jason Payne "Challenger: A Rush To Launch" — 2,779,249 views / 4,590 subs = **605:1**
  - Aviation Files — 232,828 views / 9,540 subs = **24.4:1** (Air India 171)
- **Ceiling proof:** at least one big channel with 1M+ views on the exact subject
  (Concorde had Vox 17.9M, Mentour Pilot 15.8M; AI171 had Dhruv Rathee 22.7M). Small
  outliers prove the pull; the ceiling proves it scales.
- Reuploads of pro content (BBC/PBS rips) on tiny channels still count as demand
  proof — viewers sought the topic, not the channel — but never as the only proof.

FAIL if the outliers are stale, the absolute views are trivial, the ratio evidence
collapses on live re-check, or the niche is saturated with fresh near-zero-view
copycats (a sign the wave already broke — Kola's "hole to hell" cluster).

## Step 3 — the recognition test (NEW, mandatory — the 2026-07-26 rule)

**A topic can pass raw Icahn and still stall, because YouTube sizes the impressions
pool by pre-existing demand for the SUBJECT, not by your video's quality.** Tenerife
passed every craft bar MH370 passed and got 5% of the pool. So after the ratio sweep,
score the topic on 3 questions:

1. **Name test:** would a cold scroller with zero niche interest recognize the core
   noun of the title instantly, with no explanation? (MH370 — yes, global household
   mystery. Tenerife — no, despite being the deadliest crash ever.)
2. **Mainstream footprint:** has the subject had sustained international mainstream
   coverage — global news cycles, a Netflix/major-network documentary, a household
   phrase? Not "important to historians" — recognized by strangers.
3. **Alive right now:** do fresh (under 12 months) videos on the subject still pull
   big numbers, or is every outlier years old? Recency of demand predicts the size
   of today's test pool.

Scoring:
- **3/3 — full greenlight.** Expect a real impressions pool.
- **2/3 — conditional greenlight with a recognition bridge:** the packaging must
  lead with the recognized element (superlative, category, or famous adjacent name),
  never the unrecognized proper noun — and the expectation must be priced honestly.
  Tenerife shipped with exactly this bridge ("The Deadliest Plane Crash in History
  Happened on the Ground") and still drew a ~20x smaller pool than MH370: the bridge
  is necessary, not sufficient. Slot 2/3 topics between 3/3 winners rather than
  back-to-back, and hand the bridge constraint to ctr-engine explicitly.
- **0-1/3 — demand-weak even if raw Icahn passed.** Deprioritize behind recognized
  topics, or reframe the idea around a recognized entry point and re-validate the
  reframe. Do not spend a 4K render's worth of work on a topic YouTube will test on
  20K impressions.

## Step 4 — sensitivity gate (recent real disasters)

Fires when ANY of: event under ~3 years old, living victims/survivors/accused,
investigation open or contested. Before greenlight, answer two extra
honesty-feasibility questions (AI171 precedent — a ~13-month-old crash with a named
survivor and contested AAIB findings):

1. **Is the cause settled?** If the final report is out, cite it. If contested (AI171
   fuel-cutoff / pilot-blame theory), every causal claim in the eventual script must
   be attributed-never-asserted and tracked in docs/planning/CLAIMS-<slug>.md — flag
   this in the verdict so the research phase inherits it.
2. **Can we actually source footage?** Recent events are usually news-agency
   copyrighted, not PD (AI171's real CCTV crash footage existed but was news-org
   owned — the episode used the real AAIB report page as its exhibit instead). Run a
   quick probe (`--out` and `--prefix` are both required flags):

   ```bash
   python3 scripts/fetch_footage.py "<subject>" --niche <niche> --kind video \
     --count 3 --out out/qa/icahn_probe --prefix probe
   ```

   (niches: aviation, space, ocean, history, football, tech, generic) and check
   gov-docket availability (`scripts/fetch_ntsb_docket.py` for US events) before
   greenlighting.

If the cause is unsettled AND no honest visual path exists → **queue, don't
greenlight**. Sensitivity never blocks validation by itself; it attaches conditions.

## Step 5 — output contract (deliver ALL of this, every run)

1. **Verdict:** PASS / PASS-WITH-CONDITIONS (recognition bridge and/or sensitivity
   conditions, stated explicitly) / FAIL — with the one-sentence reason.
2. **Evidence table:** channel, views, subs, ratio, upload date, video URL for every
   outlier cited, plus the ceiling-proof row(s). Only numbers from the yt-dlp output.
3. **Recognition score** (0-3) with the packaging implication spelled out.
4. **Sensitivity gate result** where applicable.
5. **Log the memory:** create `icahn-<slug>` in the project memory directory,
   matching the format of the existing icahn-*.md files (verdict, dated "validated
   via yt-dlp outlier search", the evidence list, structure/risk notes), and add it
   to the MEMORY.md index.
6. **Queue it:** add or update the entry in docs/planning/TOPIC-QUEUE.md with ratios,
   proof URLs, and the standing note that ratios are point-in-time — recheck live at
   production start.
7. **Stop.** Validation is the gate, not the starting gun — production continues
   through the standard pipeline (CLAIMS fact base → doc JSON → fetch_doc_footage.py
   → ship_doc.py), and packaging goes to ctr-engine, hooks to hook-doctor, Shorts to
   shorts-funnel. Do not duplicate those skills here.

## What this skill will NOT do

Greenlight from memory or stale evidence (always re-run the sweep live), invent or
round ratios, count a queued topic as validated after 2+ weeks without a re-check,
treat a raw-Icahn PASS as sufficient without the recognition test, or promise views —
it sizes the pool the topic can earn; the video still has to hold it.
