# GROUND ZERO AIR — "The 9/11 Files New York Hid for 25 Years" (Black Box Breakdown)

Single-file summary of everything done on this episode. Read `CLAUDE.md` first for
the production manual; this doc is the episode-specific state.

## Status: 4K RENDER DONE, VERIFIED — awaiting Akshay's watch-through, then upload

**Verified from the actual master:** 1001.9s (30,057 frames @ 30fps, includes the
483-frame Black Box outro), 3840×2160, mastered **−14.0 LUFS** (windowed
`bed_tension_falsevacuum.mp3`, 10 windows). Six frames pulled from the finished file
and eyeballed: the FEMA cold open, both OIG exhibits with correct source labels, the
memorial beat, the Benzman card, and the subscribe outro (host Reid, correct).

**Final files at repo root:**
- `The 9-11 Files New York Hid for 25 Years.mp4` (2.69 GB)
- `The 9-11 Files New York Hid for 25 Years.srt` (23 KB)

> **FILENAME ≠ TITLE.** The real title is **"The 9/11 Files New York Hid for 25 Years"**.
> A slash is illegal in a filename, so the file uses a hyphen. **Type the title with
> the slash at upload.** Do not copy the filename.

## Why this topic
Validated 2026-09-09, the day after NYC opened a portal with 170,000+ pages of
previously sealed city records on post-9/11 Ground Zero air quality — three days
before the 25th anniversary. Icahn verdict: **strict-bar FAIL, PASS-COND on the
docket-evidence override**, the same shape as DCA midair. Two sweeps, 8 queries, 170
unique videos, and **not one** cleared 100K views on a <100K-sub channel at 5:1+.
It was built anyway because the demand ceiling is enormous (The Independent did
3.18M views in one day on this exact story), every high-view result is news-clip
format with no documentary treatment, and 170,000 pages of new primary documents is
precisely the Evidence Engine's moat. Full numbers: memory `icahn-groundzeroair`.

## Files
| What | Path |
|---|---|
| Fact base (GATE — every scene traces here) | `docs/planning/CLAIMS-groundzeroair.md` |
| Doc spec (103 scenes) | `src/mindwired-doc/docs/groundzeroair.json` |
| Manifest | `src/mindwired-doc/docs/groundzeroair.manifest.json` |
| Comp registration | `src/Root.tsx` → `GroundZeroAirDoc` (BB_OUTRO baked) |
| Icahn validation | memory `icahn-groundzeroair` |
| Metadata / upload package | `docs/metadata/METADATA-groundzeroair.md` |
| Thumbnails (3 built) | `out/thumbs/groundzeroair_{A,B,C}.png` + `scripts/gen_groundzeroair_thumb.py` |
| Evidence + provenance | `public/shorts/_evidence/groundzeroair/` (`SOURCES.md`, `SHOTLIST-fema.md`, the OIG PDF) |

## What it's built on
- **EPA Office of Inspector General, Report 2003-P-00012** (2003-08-21, US federal
  work, public domain). Eight pages extracted with `pdftoppm` as on-screen exhibits.
  The spine is **Table 2-4** (PDF p.26 / printed p.16): the draft of the Sept 16
  press release printed beside what was issued.
- **FEMA "Ground Zero Timeline Compilation"** via DVIDS (public domain), 30:35 of
  2001 footage. 18 clips cut by hand; timecodes in `SHOTLIST-fema.md`.
  **It is 640×480 4:3 — that is DVIDS' ceiling, verified via their API, not a fetch
  failure.** Treat as archival; never naively upscale to full frame.
- No AI-generated imagery. No news footage (copyrighted and Content-ID'd — there is
  no "few seconds" safe harbour).

## Process — three review passes ran BEFORE scripting, and all three changed the episode
1. **Adversarial ethics/sensitivity review** — 17 findings, 3 blocking.
2. **Primary-source verification** — 6 corrections.
3. **Gap-close pass** — closed the political-balance and custody gaps, and **struck a
   claim outright**.

### What the passes actually caught (read this before skipping steps next time)
- **A quote that does not exist.** The first research pass produced a Giuliani
  spokesperson calling the release "cheap partisan political points." A dedicated
  search across CNN, Fox, Axios, TIME, The Hill and Al Jazeera found no such quote
  and no such spokesperson. It was struck. It is entirely plausible-sounding and
  would have gone on screen attributed to a real person.
- **The Henshaw trap.** Showing the "INSERT HENSHAW quote somewhere around here"
  margin instruction next to the finished quote invites "they faked a federal
  official's words." Press offices routinely draft quotes for approval, and nothing
  establishes Henshaw was deceived. Scene `a5_14` now says that out loud.
- **The knowledge/intent firewall.** The OIG found the AGENCY's sampling was
  incomplete. It made **no** finding about Whitman's personal knowledge or intent.
  "Wrong" and "lying" are different findings — set up in Act I, paid off in Act VIII.
- **The CEQ official is not named** — verified directly in the PDF, which says only
  "one particular CEQ official." Do not import a name from other CEQ reporting.
- **An unsupportable statistic.** "More people died after 9/11 than on it" is
  advocacy framing, not a WTC Health Program figure — CDC publishes all-cause
  mortality only and states it "does not track cause of death for deceased members."
  The episode **refuses it on air** and gives the certifiable number instead.
- **Political balance.** The first draft named only 2001 federal officials. The
  records sat at DEP across four mayoralties; only the last stretch carries a court
  finding, and the episode states exactly that distinction (`a7_8/9/10`).
- **Date and wording errors:** Zadroga Act signed **January 2, 2011** (not 2010);
  Whitman's denial includes "**at the time**"; the Avalon primary text of the Sept 18
  statement reads "safe to **breath**" — a period typo, reproduce it if quoting the
  document verbatim on screen.

## Structure
Cold open (seven consecutive real-motion-video beats — no stills in the first 30s) →
scoping beat that inoculates against the "this is about how the towers fell" read →
sting → title → Acts I-VIII → first-person coda → verbal bridge to the live Building 7
episode → subscribe outro. The strongest reveal (Table 2-4, the deleted Water Street
warning, "2.1 to 3.3 percent" softened to "slightly above") lands in Act V at ~55-65%
runtime, where the mid-video re-hook belongs.

## Render notes — READ BEFORE RE-RENDERING ANYTHING
The first six render attempts died at a **random frame every time** with
`A delayRender() ... "Loading font Space Grotesk" ... was called but not cleared`.
Fixed in commit `31d7cb9` by replacing `@remotion/fonts`' `loadFont` with plain CSS
`@font-face` registration (`src/lib/fonts.ts`). After that fix the comp rendered all
30,057 frames at 4K with zero font errors.

**Do not re-try these — they were tested and do not work:**
- Raising `--timeout` (the promise never settles at all).
- A `setTimeout` fallback (Remotion controls timers; it never fires).
- Inlining the font as a base64 data URI (the hang is the FontFace promise, not the
  network).
- **`CHUNKED=1`** — it makes things *worse* here. Every chunk spawns a fresh Chrome
  that re-runs the font module, so 121 chunks is 121 rolls of the dice; a GCE run
  died with three chunks each exhausting all six retries.
  **`scripts/render_gce.sh`'s header still recommends CHUNKED for this exact failure
  and should be corrected.**

Rendered on GCE: `scripts/render_gce.sh GroundZeroAirDoc groundzeroair --music
public/beds/bed_tension_falsevacuum.mp3 --windows groundzeroair` (c2d-highcpu-32,
us-central1-f, ~65 min). The VM auto-deletes on exit; confirmed no `render-*`
instances left billing.

## Remaining before publish
1. **Akshay's full watch-through.** Standing rule for this sensitivity tier, same as
   Building 7. This episode names living officials and rules on what a federal report
   does and does not establish.
2. **Pull 2-4 pages from the 2026 NYC portal by hand** and add them as exhibits. The
   portal (`sept11documents.cityofnewyork.us`) is live and searchable — ~48,900
   indexed documents with real Bates IDs (e.g. `NYC-WTC_000058160.pdf`) — but its
   Mindbreeze API serves **no document download endpoint**, so nothing could be
   retrieved programmatically. Until then the news-hook act runs on the OIG document
   and on reporting, and the on-screen source tiers must stay distinct (CLAIMS
   "ON-SCREEN SOURCE TIERS").
3. **Verify Giuliani's exact posted wording** before the `a8_1` line ships.
4. Human sensitivity screening of any NIST FOIA clip before it is used. **None were
   used in this cut** — the ~6,977-clip corpus is unscreened.
5. Cut funnel Shorts via shorts-funnel. Avoid cutting the Whitman apology or the
   court findings into a standalone Short — both lose their balancing half out of
   context.
6. Upload not done — session scope was research → render → package.

## Known cosmetic nit (not blocking)
On the Act V exhibit beats, the caption line can overlap the document page edge
slightly during a transition. Same class of nit as the Building 7 episode's ~9:25
caption overlap. Legibility survives; worth a look if Akshay wants it cleaner.
