# CONCORDE — "The Rise and Fall of Concorde" (mindwired pivot #3)

Single-file summary of everything done on this episode. Read `CLAUDE.md` first for
the production manual; this doc is the episode-specific state.

## Status: 4K RENDER DONE — packaging drafted — Shorts not yet cut

## Files
| What | Path |
|---|---|
| Fact base (GATE — every script line traces here) | `docs/planning/CLAIMS-concorde.md` |
| Doc spec (99 scenes) | `src/mindwired-doc/docs/concorde.json` |
| Comp registration | `src/Root.tsx` → `ConcordeDoc` (MW_OUTRO baked, 527f) |
| Metadata / SEO package | `docs/metadata/METADATA-concorde.md` |
| Rendered master | `out/concorde_gce.mp4` (2.25 GB) |
| Icahn validation | memory `icahn-concorde` |
| Episode memory (full detail) | memory `concorde-episode` |
| QA frames | `out/qa/concorde_mid.jpg`, `out/qa/concorde_outro_check.jpg` |

## 1. Icahn validation — PASS
AF4590 crash is the demand engine. yt-dlp outlier search found:
- Mayday Chronicles — 135,792 v / 799 subs = **170:1** (extreme small-channel outlier)
- AviFX — 78,899 v / 8,790 subs = 9:1
- Plane'n Boom — 976,217 v / 163,000 subs = 6:1
- Ascent And Collapse — 299,022 v / 90,900 subs = 3.3:1
- Smithsonian "How the Crash of 4590 Destroyed Concorde's Mystique" — 10.9M v / 662K subs = 16.5:1
- Proven big-channel rise-and-fall versions: Vox 17.9M, Mentour Pilot 15.8M, Real
  Engineering 1.5M, PBS America "Untold Story" 2-parter.

Structure confirmed: **rise → the one crash → the grounding decision.**

## 2. Research — 4-agent fan-out, synthesized into CLAIMS-concorde.md
Dimensions: origins/golden-age · AF4590+BEA · grounding/retirement · PD-archival scout.

**Hard corrections baked into the script** (do not revert if editing):
1. Cost overrun: "~£1.3 billion, many times the ~£70M original estimate" — never "6x."
2. Safety-mod programme = **£17M** (not "$47M" — unsupported figure).
3. Ticket price: "~$10,000+ round trip," never a hard $12,000.
4. Airframe stretch: "~15–25 cm," never a single hard number. "Cap in the gap" = lore, not fact.
5. Boeing 2707 "killed by one vote" is a **myth** — Senate margin was 51–46.
6. Tu-144 Paris crash cause is **unresolved** — present as such.
7. AF4590 tank mechanism: tyre debris did **NOT puncture** the tank — a pressure
   shockwave (hydrodynamic ram) **ruptured tank 5 from the inside**. Ignition =
   "most likely" an electrical arc, not certain.
8. **John Taylor / Continental (highest sensitivity — living, named private
   individual):** convicted 2010 → **overturned on appeal Nov 2012** — a French
   court found his mistake did not amount to criminal liability; Continental
   retained ~70% civil liability only. NEVER imply Taylor caused the deaths as
   settled fact.
9. No single "chief designer" — Russell (UK) and Satre/Servanty (France) were
   parallel binational leads.
10. Air France's last commercial flight = **31 May 2003** (not the 30 May some
    infoboxes show). BA last commercial = 24 Oct 2003. Very last Concorde flight
    of any kind = 26 Nov 2003 (G-BOAF → Filton).

Primary exhibit: **BEA interim report** on AF4590 (f-sc000725ae, 15 Dec 2000),
official French-government public record, English PDF at bea.aero — rendered as
an on-screen exhibit page via pdftoppm.

## 3. Script — src/mindwired-doc/docs/concorde.json
99 scenes, ~18 min narration + MW subscribe outro (~20:10 final runtime, confirmed
by render). Structure: cold open (AF4590 morning, Capt. Marty, the strip on the
runway) → brand sting → title → 8 chapters (two nations/treaty → the machine →
golden age → the crash minute-by-minute → the verdict/BEA exhibit → the comeback →
the decision → the silence since) → first-person coda → verbal bridge to "21
Astronauts" → subscribe. Narrator: cloned Cartesia voice `00d3c951-...` @ 0.96 speed.

## 4. Footage — $0 real archival
`fetch_doc_footage.py concorde --uhd` (aviation niche) → Commons/NARA/Pexels/Pixabay.
Iterated 3x cleaning contact-sheet mismatches (RC toy Concorde, an Indonesia flag
ceremony, an Estonia song festival, 1918 letter scans, etc.) down to 0 blocking /
10 acceptable preflight warnings.

**No free AF4590 crash/fire footage exists** (the iconic Sato photo is copyrighted) —
those beats use BEA diagrams, tyre/undercarriage stills, and typographic recreations
instead, per the archival scout's findings.

## 5. Render — GCE 4K, single pass, VERIFIED
```
scripts/render_gce.sh ConcordeDoc concorde --music public/beds/doc_tension.mp3 \
  --windows concorde --music-gain-db -20
```
- Duration: **1210.5s = 20:10**
- Resolution: **3840×2160 @ 30fps** (true 4K, `--scale 2`)
- Loudness: **-14.1 LUFS** (target hit; input was -24.5 LUFS)
- Windowed music: 10 windows (cold open, chapter transitions, closing) via
  `doctiming.py`, bed `doc_tension.mp3` at -20dB gain
- Subscribe outro: confirmed baked in via tail-frame QA (`out/qa/concorde_outro_check.jpg`)
  — mindwired branding, host talking-head, correct

## 6. Packaging — docs/metadata/METADATA-concorde.md (drafted, not yet finalized)
Full-SEO package: primary title + 4 A/B alternates, thumbnail concepts (3), full
description with fairness note + MORE FROM block, chapter timestamps (**estimates —
recompute exact values from doctiming.py against the final master before
publishing**), ~495-char tag string, 15 hashtags, pinned comment, sources/credits,
and 4 planned-but-not-yet-built Shorts (titles/descs/hashtags/search clusters ready).

## 7. Known gaps / not done yet
- **4 vertical Shorts not cut.** Plans exist as prose in METADATA-concorde.md but
  no `src/viral/plans/concorde-short1..4.json` files or rendered MP4s yet.
- **Higgsfield AI b-roll blocked.** Akshay's account is on a Plus trial — every
  MCP model call (video + image) 403s with `only_website_usage_on_trial_is_available`,
  even with the website's "Unlimited mode" toggle on and at 720p. This is an
  account-wide MCP restriction, not a per-model/resolution issue — confirmed by
  direct testing. Real footage was used instead for the crash-dramatization beats
  (tyre burst, tank rupture, fire trail, cockpit alarm), which is consistent with
  the channel's own footage-first, anti-slop policy anyway. If Akshay wants
  Higgsfield clips later: he generates them manually on the website (prompts for
  scenes h1-h6 and d6-d10 were given to him in-session) and hands off the files.
- **Chapter timestamps in METADATA-concorde.md are estimates** — must be
  recomputed against the real final master duration before upload.
- SRT captions not yet generated (`scripts/gen_doc_srt.py concorde`).

## Next steps (in order)
1. Recompute exact chapter timestamps from doctiming.py against `out/concorde_gce.mp4`.
2. Generate SRT captions.
3. Build the 4 Shorts (`scripts/cut_shorts.py concorde` or hand-authored
   `src/viral/plans/concorde-short1..4.json` + register in Root.tsx).
4. Build thumbnail (Workflow B: Remotion still + text overlay, per THUMBNAILS.md).
5. Final human review of the master before upload (Akshay hasn't watched it yet).
6. Commit everything to git (nothing from this episode has been committed).
