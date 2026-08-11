# Deepwater Horizon Oil Rig Disaster (Black Box Breakdown)

Single-file summary of everything done on this episode. Read `CLAUDE.md` first
for the production manual; this doc is the episode-specific state.

## Status: DONE THROUGH PACKAGING — render verified, SRT done, 4 Shorts built. Commit + Akshay's review + actual YouTube upload remain.

## Files
| What | Path |
|---|---|
| Icahn validation | memory `icahn-deepwaterhorizon` |
| Fact base (GATE — every script line traces here) | `docs/planning/CLAIMS-deepwaterhorizon.md` |
| Doc spec (87 scenes) | `src/mindwired-doc/docs/deepwaterhorizon.json` |
| Manifest | `src/mindwired-doc/docs/deepwaterhorizon.manifest.json` |
| Comp registration | `src/Root.tsx` → `DeepwaterHorizonDoc` (BB_OUTRO baked, 483f) |
| Rendered master | `out/deepwaterhorizon_gce.mp4` + repo-root deliverable `BP Pled Guilty to Killing 11 Men.mp4` (2.07 GB, verified: 11:50 @ 3840x2160, -14.1 LUFS) |
| SRT captions | `BP Pled Guilty to Killing 11 Men.srt` (197 cues, whisper-transcribed) |
| Metadata package | `docs/metadata/METADATA-deepwaterhorizon.md` |
| Thumbnails (3 built) | `out/thumbs/deepwaterhorizon_A.png` (real fire footage, zero text — primary), `_B.png` ("GUILTY"), `_C.png` (real BOEMRE report title page, "THE PROOF") |
| Funnel Shorts (4 built) | `out/shorts_final/deepwaterhorizon_short1-4.mp4` — comps `DeepwaterHorizonShort1-4` in Root.tsx |
| Shorts drip schedule | `docs/publishing/SHORTS-SCHEDULE-deepwaterhorizon.md` (dates TBD — long-form not yet uploaded) |
| Media | `public/shorts/deepwaterhorizon/{images,video,audio}/` |

## 0. Why this topic — the stale-queue catch
TOPIC-QUEUE.md's "⭐ NEXT" flag pointed at a "3rd MH370 video" that had
**already been produced and published** on 2026-08-02 (`mh370netflix.json`,
real URL `https://youtu.be/Bee3SE4WEg0`) — the queue note was simply never
updated after shipping. Caught before wasting a production cycle on a
duplicate. Ran a fresh Icahn sweep across 5 untouched Black Box candidates
(MH17, Deepwater Horizon, Fukushima, Germanwings 9525, Piper Alpha) instead —
see `icahn-deepwaterhorizon` memory for the full sweep. TOPIC-QUEUE.md's
stale entry has been corrected in place.

## 1. Icahn validation — PASS
715.1:1 headline (Alertometer blowout animation, 5.96M views/8,330 subs) +
560.8:1 corroborator, both with real seven-figure absolute views — one of the
strongest raw signals swept on this channel. Recognition 2/3 (bridge: lead
with "BP," not the rig's name — the locked title does this). Currency PASS
(BP's restoration payments run into the 2030s; real 2023/2025 fresh
corroborators). Sensitivity MODERATE — cleaner than IC814/AI171: cause is
legally settled via BP's own 2012 guilty plea, no living dangerous figures.
Beat Fukushima (would stack 2 nuclear-disaster episodes back-to-back with
Three Mile Island) and MH17 (highest sensitivity of the five, active-war-
adjacent). Full evidence + LOCKED PACKAGE: memory `icahn-deepwaterhorizon`.

## 2. Research — 5-agent fan-out via Workflow, synthesized into CLAIMS-deepwaterhorizon.md
Dimensions: origins/corporate roles · the blowout + official findings ·
aftermath/legal outcomes + living-persons status · archival-footage scout ·
cold-open/human-thread scout. Exceptionally thorough — found and cross-
checked 4 distinct real government/investigative documents (National
Commission report, BOEMRE/USCG joint investigation report, BP's own "Bly
Report," the later CSB/DNV blowout-preventer forensic analysis) and flagged
where they genuinely disagree on contributing-cause weighting.

**Key corrections/flags baked into the script:**
1. Exact figures locked: 11 dead, 4.9M barrels spilled, $4B criminal penalty,
   $20.8B civil settlement (largest single-defendant settlement in US history
   — not "largest ever," which is the multi-defendant tobacco settlement).
2. Neither Robert Kaluza nor Donald Vidrine was ever convicted of
   manslaughter — only the corporation pleaded guilty to those 11 counts.
   Kaluza was acquitted outright (2016); Vidrine pleaded to one misdemeanor
   and died in 2017. Every mention states this explicitly.
3. 🧍 Robert Kaluza — private citizen, acquitted, current status (even
   alive/deceased) UNVERIFIED. Highest defamation-risk name in the episode;
   never implied guilty.
4. 🧍 Tony Hayward — public figure, on-record by choice ("I'd like my life
   back," later apology). Safe to quote verbatim; no claims about
   2026-specific activity (no source found past his 2021 Glencore departure).
5. The "nightmare well" and "who cares" emails are both real, verbatim,
   sourced to House Energy & Commerce Committee document production —
   quoted exactly, not paraphrased harsher or softer.
6. The "bladder effect" (the crew's rationalization for the bad pressure
   test) was found to have no scientific basis — stated as a fatal
   misunderstanding, not a real phenomenon.

## 3. Script — src/mindwired-doc/docs/deepwaterhorizon.json
87 scenes, ~9.9 min narration (~11:50 final runtime with BB outro).
Structure: cold open (Jason Anderson's last "good test" call, April 20 2010)
→ sting → title → 8 chapters (the rig/well/three companies → six warnings and
one "who cares" → the night of April 20th → eleven names → 87 days → the
guilty plea → who paid and who didn't → still paying) → coda → verbal bridge
to the published 737 MAX episode → subscribe. Narrator: standard male cloned
Cartesia voice `00d3c951-...` @ 0.96 speed. Channel: `blackbox`.

## 4. Footage — genuinely better situation than IC814/AI171
Real US Coast Guard helicopter footage of the actual fire exists and anchors
the cold open (`dh_fire_1.mp4`, Wikimedia Commons, PD). Real DVIDS photos of
Brett Cocales and a second officer testifying at the joint investigation
hearing anchor the "who cares" email beat. Real satellite imagery of the
actual oil slick (Commons, "Deepwater Horizon oil spill - May 24, 2010")
anchors the spill-scale beats. The real BOEMRE/USCG joint investigation
report (Sept 2011, downloaded directly, 217 pages) is the document exhibit —
its title page and its regulatory-violations findings page (p.12, citing all
three companies by name) both used.

**Two real bugs caught and fixed during production, both process lessons:**
1. **Chapter cards silently ignore `video` fields — they only read `img`.**
   `TextSceneBg` (the component `ChapterCard` uses for its background) checks
   `s.img` only; a chapter scene given only a `video` field renders as a bare
   black card with just the text overlay. Two chapter cards (c3, c5) shipped
   this way until the mandatory spot-check caught it. **New rule for future
   episodes: chapter/kinetic scenes must use `img`, never rely on `video`
   alone — this is a different bug class from the IC814 videoQuery/video
   pairing issue, and preflight/audit don't catch it either.**
2. **Wrong-content video hits despite explicit per-scene assignment.** Two
   critical narrative beats (h5's "explosion," d10's "second explosion, fire
   engulfs the rig") were assigned to a generic calm-harbor-construction clip
   that had nothing to do with fire, because the pool cycling put a weak
   generic file on the most dramatic beats. Fixed by explicitly pinning the
   one real fire clip (`dh_fire_1.mp4`) to every scene that narrates the fire
   itself, rather than trusting pool rotation for the episode's most
   important visual moments. Also caught and removed 3 building photos with
   large, readable WRONG-company signage (Rosen Group, Baker Hughes, Nippon
   Oil) that had been kept as "generic corporate building" stand-ins — a
   readable competitor logo is a step past acceptable generic-stand-in
   territory into actively confusing/misleading.

## 5. Render — GCE 4K, single pass, VERIFIED
```
scripts/render_gce.sh DeepwaterHorizonDoc deepwaterhorizon \
  --music public/beds/bed_tension_rud.mp3 --windows deepwaterhorizon --music-gain-db -20
```
- Duration: **710.0s = 11:50**
- Resolution: **3840×2160 @ 30fps** (true 4K, `--scale 2`)
- Loudness: **-14.1 LUFS** (from the render log's own mastering output)
- Windowed music: `bed_tension_rud.mp3` at -20dB, rotated from IC814
  Kandahar's `bed_tension_falsevacuum.mp3` per the no-repeat rule
- Subscribe outro: confirmed baked in via tail-frame QA — Black Box branding,
  host Reid, `@Watch-BlackBox` handle, correct
- Clean run, no GCE flakes this time (contrast with IC814's 3x scp retry)

## 6. Known gaps / not done yet
- Nothing from this episode is committed to git yet.
- **Akshay has not watched the master yet** — MODERATE sensitivity (cleaner
  than IC814/AI171/WTC, but still real named deaths and a real acquitted
  private citizen) — a review pass before upload is still recommended.
- The long-form has not been uploaded to YouTube — Shorts drip dates in
  `SHORTS-SCHEDULE-deepwaterhorizon.md` are placeholders until it is.

## Next steps (in order)
1. Commit everything (doc spec, manifest, CLAIMS, metadata, thumbnails,
   Shorts comps in Root.tsx, this handoff — never the multi-GB master or the
   repo-root mp4/srt deliverables' binary size, though the SRT itself is
   small enough to commit per this repo's own convention).
2. Akshay watches the master + reviews the sensitivity framing before upload.
3. Upload the long-form, then drip the 4 Shorts starting ~24h later per the
   schedule doc (fill in real dates once the long-form is live).
