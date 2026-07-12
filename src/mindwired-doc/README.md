# mindwired-doc — the $0 archival-documentary engine

Long-form (30-60 min) documentaries from **real public-domain photographs**:
fetch_media.py archival images + Ken-Burns Remotion template + cloned-channel-voice
Cartesia narration + render_and_master.py. Total cost per hour of video: a few
dollars of TTS. Everything else is free.

First production: `docs/spacedeaths.json` → comp `SpaceDeathsDoc`
("Every Way Space Has Killed a Human", ~55 min).

## Recipe for a new documentary

1. **Doc spec** — `docs/<slug>.json`:
   `{slug, title, language, voice, scenes:[{id, text, cap?, img?, stat?, statColor?, chapter?}]}`
   - `text` = narration (one beat, 20-35 words). `cap` = short on-screen caption
     (NOT the transcript). `stat` = top-left chip (dates/numbers). `chapter` =
     `"CHAPTER N\nTitle"` full-screen card.
   - `img` is a **prefix**: the template cycles through all fetched files with
     that prefix, so repeated subjects get variety. Missing prefix → dark base.
   - Beat IDs must be unique. Chapter numbering: keep spoken text + card in sync
     (renumber programmatically if you insert chapters — see git history).
2. **Images** — one `scripts/fetch_media.py` call per subject into
   `public/shorts/<slug>/images` with `--prefix <imgkey>`. Query lessons:
   - Commons proper nouns work best ("Mitrofan Nedelin", "STS-107 Columbia launch").
   - If 0 results: reword before loosening license; add "--source both" for
     modern/rare subjects; the script auto-relaxes min-width once.
   - **Always eyeball a contact sheet before rendering** — bad queries return
     tractors. (PIL thumbnail montage; prune junk files, refetch.)
   - ATTRIBUTION.md is generated — paste into the video description (CC-BY needs it).
3. **VO + manifest** — `.venv-lipsync/bin/python scripts/build_doc_vo.py <slug>`.
   Idempotent per clip. Writes `docs/<slug>.manifest.json` (real durations +
   image scan). Must run before typecheck/render (Root imports it statically).
4. **Register** — in `src/Root.tsx`:
   `makeDocComp(doc, manifest)` + `docTotalFrames(doc, manifest)`, 1920×1080.
5. **Render** — `npx remotion render <CompId> out/<slug>.mp4` (DOM comp, no --gl)
   → `scripts/master_video.py` (−14 LUFS) → **append the channel subscribe outro**
   (assets/subscribe-outro/, see CLAUDE.md — mandatory) → ffprobe + frame check.
6. **Chapters for the description**: scene start-frame = cumulative
   `LEAD + round(aud*30) + HOLD`; print per-chapter timestamps with a 5-line
   python loop over the manifest (see METADATA-spacedeaths.md).

## Pacing knobs
`LEAD`/`HOLD` in DocWide.tsx (10/24 frames). VO speed: `--speed` on build_doc_vo.py
(default 0.94; chapter cards auto −0.02).
