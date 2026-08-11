# IC 814 / Indian Airlines Flight 814 "Kandahar Hijacking" (Black Box Breakdown)

Single-file summary of everything done on this episode. Read `CLAUDE.md` first
for the production manual; this doc is the episode-specific state.

## Status: DONE THROUGH PACKAGING — render verified, SRT done, 4 Shorts built. Commit + Akshay's sensitivity review + actual YouTube upload remain.

## Files
| What | Path |
|---|---|
| Icahn validation | memory `icahn-ic814kandahar` |
| Fact base (GATE — every script line traces here) | `docs/planning/CLAIMS-ic814kandahar.md` |
| Doc spec (94 scenes) | `src/mindwired-doc/docs/ic814kandahar.json` |
| Manifest | `src/mindwired-doc/docs/ic814kandahar.manifest.json` |
| Comp registration | `src/Root.tsx` → `Ic814KandaharDoc` (BB_OUTRO baked, 483f) |
| Rendered master | `out/ic814kandahar_gce.mp4` + repo-root deliverable `India Freed 3 Terrorists to End This Hijacking.mp4` (1.31 GB, verified) |
| SRT captions | `India Freed 3 Terrorists to End This Hijacking.srt` (205 cues, whisper-transcribed) |
| Metadata package | `docs/metadata/METADATA-ic814kandahar.md` |
| Thumbnails (3 built) | `out/thumbs/ic814kandahar_A.png` (real A300, zero text — primary), `_B.png` ("HIJACKED"), `_C.png` (real document header, "EXHIBIT A") |
| Funnel Shorts (4 built) | `out/shorts_final/ic814kandahar_short1-4.mp4` — comps `Ic814KandaharShort1-4` in Root.tsx |
| Shorts drip schedule | `docs/publishing/SHORTS-SCHEDULE-ic814kandahar.md` (dates TBD — long-form not yet uploaded) |
| Media | `public/shorts/ic814kandahar/{images,video,audio}/` |

## 1. Icahn validation — PASS-WITH-CONDITIONS
287.5:1 headline outlier (National Geographic doc reupload, 971K views/3,380
subs), 263.8:1 corroborator, two fresh 2026 corroborators (94.7:1 in March,
13.5:1 in August — proves the topic is still pulling right now). Ceiling:
Netflix India trailer 45.8M views, Dhruv Rathee 21.6M, Mighty Monk 11.2M.
Recognition 2/3 (fails cold name-test, passes mainstream-footprint and
alive-right-now) — required a recognition bridge: packaging leads with
"India Freed 3 Terrorists," never the unrecognized "IC 814"/"Kandahar" names
cold. Currency filter PASS via the still-live 2024 Netflix code-name
controversy and Masood Azhar's ongoing terrorism. Beat Entebbe (comparable
raw ratios, but a fully closed 50-year-old story with no living throughline).
Full detail in the memory file.

## 2. Research — 5-agent fan-out, synthesized into CLAIMS-ic814kandahar.md
Dimensions: background/rise of the hijackers · the hijacking itself ·
the Kandahar standoff and the swap · aftermath and living-persons status ·
the 2024 Netflix controversy. Ran as a Workflow (5 parallel research agents +
1 synthesis agent writing the CLAIMS file directly).

**Key corrections/flags baked into the script:**
1. Primary exhibit is the real Lok Sabha statement by the Minister of External
   Affairs (13 March 2000) — NOT a "White Paper" (no such document exists;
   the original production plan's assumption was wrong, corrected during
   sourcing).
2. 🧍 Masood Azhar is alive, real, dangerous — every claim linking him to
   later attacks (2001 Parliament, 2016 Pathankot, 2019 Pulwama) stays
   attributed to public reporting/investigation findings, never a bare
   assertion beyond what's officially attributed to JeM.
3. Criticism of the government's swap decision is politically contested in
   India today — framed as "critics argue," never stated as settled fact.
4. The 2024 Netflix code-name controversy is described factually (what the
   show did, what the reaction was), no side taken.
5. Rupin Katyal (murdered passenger) handled with the same dignity standard
   as this channel's other named-victim episodes.

## 3. Script — src/mindwired-doc/docs/ic814kandahar.json
94 scenes, ~10.6 min narration (~12:40 final runtime with BB outro). Structure:
cold open (Dec 24 1999, Capt. Devi Sharan, the hijack-code moment) → sting →
title → 8 chapters (the airport that waved him through → forty-five minutes →
the Lahore bluff → Kandahar → the decision → what Masood Azhar did next →
where everyone else is now → the 2024 Netflix controversy) → coda → verbal
bridge to a future United 93-style episode → subscribe. Narrator: standard
male cloned Cartesia voice `00d3c951-...` @ 0.96 speed. Channel: `blackbox`.

## 4. Footage — the hard constraint, same shape as AI171
**No free archival motion footage of the actual 1999 event or Kandahar/
Taliban-era Afghanistan exists** in any of this pipeline's sources (mirrors
the AI171 finding — Indian-government-era news footage isn't automatically
PD the way US-federal works are). Solved via the same pattern as AI171:
- **Real document exhibit:** the actual Lok Sabha statement PDF, sourced from
  archive.org (`eparlib.nic.in.714070`), confirmed real via `pdftotext`,
  converted to PNG via `pdftoppm`. Used across 3 exhibit scenes.
- **Real identity anchor:** Commons CC-BY-SA photos of the actual Indian
  Airlines Airbus A300 fleet livery (VT-EHD tail number) — same photo used
  for the primary thumbnail concept.
- **Real generic motion for pacing (including the mandatory first-30s real
  video):** commercial airliner cruise/cabin/cockpit/takeoff/landing clips,
  sourced via `fetch_doc_footage.py`/`fetch_footage.py` (Pexels primarily).

**Caught and fixed before render — a real gap, not a false-positive:** the
doc-spec's `videoQuery` fields on the cold-open scenes (h1-h6) plus c3/d1/d6/d9
were set without matching `video` target filenames, so `fetch_doc_footage.py`
silently skipped fetching them entirely (it only fetches for scenes with
BOTH fields — mirrors images needing both `img`+`query`). This produced bare
BLACK SCREENS on the cold open — caught by a still-frame spot-check, not by
either automated gate (neither the relevance audit nor preflight flag a
`videoQuery`-only scene as a problem). Fixed by adding `video` target
filenames and re-fetching. **Process lesson for the next episode:** spot-check
stills must include at least one frame from every `videoQuery`-tagged scene,
not just exhibit/image scenes — a still is the only check that catches a
video field silently missing.

**Also caught during that refetch:** ~5 of 9 video prefixes' first-pass
results were wrong-era/wrong-subject junk from archive.org/DVIDS (a WWII
biplane, a submarine, a cowboy-and-horse Western film clip, a 1920s aircraft
factory reel, a Swedish military exercise) despite plausible-sounding search
queries — confirms the "search APIs return junk confidently" warning applies
to video just as much as images. Fixed by deleting and re-fetching with
`stock: true` (forces Pexels/Commons-first ranking over archive_org/DVIDS)
and more specific query wording; verified every clip via an extracted frame,
not just the fetch log's title text.

## 5. Render — GCE 4K, single pass, VERIFIED
```
scripts/render_gce.sh Ic814KandaharDoc ic814kandahar \
  --music public/beds/bed_tension_falsevacuum.mp3 --windows ic814kandahar --music-gain-db -20
```
- Duration: **760.0s = 12:40**
- Resolution: **3840×2160 @ 30fps** (true 4K, `--scale 2`)
- Loudness: **-14.1 LUFS** (independently measured via `ebur128` on the final
  file — the render log itself didn't capture the remote mastering output,
  so this was verified directly rather than trusted from a log line)
- Windowed music: `bed_tension_falsevacuum.mp3` at -20dB, rotated from Key
  Bridge's `bed_tension_rud.mp3` per the no-repeat-on-consecutive-uploads rule
- Subscribe outro: confirmed baked in via tail-frame QA — Black Box branding,
  host Reid, `@Watch-BlackBox` handle, correct
- **The final scp fetch failed 3x on a transient connection reset** (known
  flake on large 4K masters) — the GCE launch script correctly stopped
  (not deleted) the VM per its own recovery contract. Recovered manually:
  `gcloud compute instances start render-ic814kandahar-8010 --zone
  us-central1-f` → re-ran the scp → deleted the VM once the fetch completed.

## 6. Known gaps / not done yet
- Nothing from this episode is committed to git yet.
- **Akshay has not watched the master yet** — given HIGH sensitivity (a
  living, dangerous named figure; a politically contested government
  decision), a personal review pass before upload is recommended, same as
  the AI171/WTC/United93 precedent.
- The long-form has not been uploaded to YouTube — Shorts drip dates in
  `SHORTS-SCHEDULE-ic814kandahar.md` are placeholders until it is.

## Next steps (in order)
1. Commit everything (doc spec, manifest, CLAIMS, metadata, thumbnails,
   Shorts comps in Root.tsx, this handoff — never the multi-GB master or the
   repo-root mp4/srt deliverables, which stay local until upload).
2. Akshay watches the master + reviews the sensitivity framing before upload.
3. Upload the long-form, then drip the 4 Shorts starting ~24h later per the
   schedule doc (fill in real dates once the long-form is live).
