# hyperframes/ — the mindwired scene kit

Six parameterized, data-driven scene types rendered with [HyperFrames](https://hyperframes.heygen.com)
(HTML + GSAP → MP4) that drop into the existing Remotion doc engine as `video` scenes. The point is
craft and specificity: real geography, real charts, a real minute-by-minute timeline, a typeset or
scanned exhibit, a kinetic chapter card and a mechanism diagram — each driven by a small JSON file so
no two episodes look alike, and none of it looks like stock filler.

Sample content: **Helios Airways 522** (`data/helios522/`). Every number, time and quote in those files
traces to `docs/planning/CLAIMS-helios522.md`; each file carries a `_facts` field saying which claim it
uses and what was deliberately left out.

## Scene types

| scene (`"scene"` in JSON) | what it does | sample |
|---|---|---|
| `route-map` | Mercator basemap from Natural Earth 10m (public domain, clipped + baked in), great-circle legs, holding racetrack, labeled waypoints, event marker, optional camera push with counter-scaled labels, live time readout | `route-map.json` — Larnaca → KEA hold → Grammatiko |
| `chart` | `kind:"line"` time series with a read head + fixed clock/value readout, markers, point labels; `kind:"bar"` with scaleY bars; both with count-up stat tiles | `chart-altitude.json`, `chart-nationality.json` |
| `timeline` | true-scale time rail with a moving playhead, scrolling log on the left, active event large on the right | `timeline-flight.json` (13 events) |
| `exhibit` | document page with slow push to the key line, highlight sweep, cover-bar reveal. `mode:"page"` typesets a stand-in (stamped "typeset excerpt · not a facsimile"); `mode:"image"` shows a public-domain scan with normalized rects like DocWide's `ExhibitScene` | `exhibit-techlog.json` |
| `title-card` | kinetic chapter card: mono eyebrow, word-by-word Archivo Expanded title (last word in accent), diamond rule, sub line, dimmed slow-push plate | `title-chapter2.json` |
| `diagram` | mechanism flowchart in diagram-design plugin grammar (oval start/end, rect step, diamond decision, one accent focal node, labeled branches) with staggered reveal + edge draw | `diagram-mechanism.json` |

Theme: `theme/mindwired.css` — palette and the four-voice type system from `src/mindwired-doc/DocWide.tsx`
and `docs/planning/CRAFT-AUDIT.md` (Archivo Expanded display, Spectral editorial, IBM Plex Mono evidence
chrome, Inter body). The fonts are the same OFL files as `public/fonts/`, copied to `assets/fonts/` and
declared with `@font-face` so HyperFrames inlines them at build time. Verified in rendered frames: the
wide Archivo cuts and Plex Mono are unmistakable; nothing falls back to Helvetica.

## Build → check → render

```bash
cd hyperframes
node scripts/build.mjs --episode helios522      # data + templates → compositions/, scenes/, index.html
./scripts/hf check --snapshots                  # lint + runtime + layout + motion + contrast
./scripts/render-all.sh helios522               # → ../out/scene-kit/helios522-<name>.mp4 (3840×2160, 30 fps)
```

`scripts/hf` is a thin wrapper for the pinned CLI (`npx --yes hyperframes@0.8.173`).

- **Channel / accent.** The build reads `channel` from `src/mindwired-doc/docs/<episode>.json` (helios522
  is `blackbox`) and falls back to `mindwired`; `--channel <name>` overrides (render-all.sh takes it as
  its 4th argument). The accent hex is parsed from DocWide's `THEMES` table at build time, so the clips
  always match the comp (`mindwired` #4DD8FF, `blackbox` #FF9500, `criminalrecord` #7FB4FF,
  `dimaagbatti` #FFC53D).
- **Clean output.** Every build empties `scenes/` and `compositions/` (keeping `compositions/components/`
  if it exists) before writing, so a removed data file or another episode's scenes never linger.
- **Built list.** The build writes `.hyperframes/built-<episode>.json` (episode, channel, accent, scene
  names, durations); `render-all.sh` renders exactly that list instead of globbing `scenes/*.html`.
- **Offline.** gsap 3.14.2 is vendored in `assets/vendor/` (see its README for provenance + sha256), and
  the build fails if any emitted HTML still has a remote `<script src>`, `<link href>`, `@import` or
  `url()` — renders need no network.

The build writes two renderable forms of every scene from one template:

- `compositions/<name>.html` — templated sub-composition, mounted back-to-back by the generated
  `index.html` so one `check`/`preview` covers the whole kit.
- `scenes/<name>.html` — standalone composition for `hf render --composition scenes/<name>.html`, which
  is what `render-all.sh` does so each scene becomes its own clip.

Render matches DocWide: 1920×1080 composition supersampled to 3840×2160 (`--resolution landscape-4k`,
the HyperFrames equivalent of Remotion `--scale 2`), 30 fps, H.264. Outputs land in the repo's
gitignored `out/` (`out/scene-kit/`); `hyperframes/renders/` is covered by the `*.mp4` ignore.

## Adding an episode

1. `mkdir data/<slug>` and write one JSON per scene (copy the Helios files as a starting point). The
   file name becomes the composition id and the clip name (`<slug>-<name>.mp4`).
2. Every file needs `"scene"` and `"duration"` (seconds). Everything else is per scene — the
   comment at the top of each `templates/<scene>.html` lists its fields.
3. Maps: clip a basemap once per region with
   `node scripts/clip_basemap.mjs --in ne_10m_admin_0_countries.geojson --bbox lonMin,latMin,lonMax,latMax --out assets/geo/<region>.json`
   (source: `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/`, public
   domain) and point `"basemap"` at it. Place coordinates come from reference geography; keep the
   recorded-track caveat in `pathNote` unless you are drawing a real radar track.
4. Exhibits: use `mode:"image"` only for public-domain scans (NTSB/NASA/FAA etc. — e.g. the
   `public/shorts/twa800/images/ntsbreport_*.jpg` pages). Non-US government reports (AAIASB, BEA…) are
   not automatically public domain — use `mode:"page"` and quote, don't fabricate: the `gap` block
   exists so a page can say "not reproduced" instead of filling space with invented prose.
5. Set `channel` in the doc spec, then `node scripts/build.mjs --episode <slug>`, `./scripts/hf check
   --snapshots`, look at the frames, `./scripts/render-all.sh <slug>`.
6. To ship them in the episode, put `"hf": "<name>"` on the doc scenes (see below) and let
   `build_hf_scenes.py` size, render and register them.

### Design rules baked into the templates

- One accent, dark base, the DocWide safe zones: scenes keep the bottom 150 px quiet (caption bar) and
  the top-right corner free (brand lockup). Scene chrome (eyebrow + title) lives top-left, so **do not
  also pass `stat` on the DocWide scene** — it would land on the same corner.
- Everything is seek-safe and deterministic: one paused GSAP timeline per scene, geometry baked at build
  time, no DOM measurement in callbacks, no randomness, no network (gsap is vendored; the build rejects remote URLs).
- Text is sized for phones: nothing informational below 16 px mono / 19 px labels at 1080p, titles 44 px,
  stat numerals 76 px.

## Declaring a scene in a DocWide episode (`hf`)

A doc scene names a data file with `"hf": "<name>"` (= `data/<slug>/<name>.json`; the data file
carries the `scene` type, so the doc never repeats it):

```json
{ "id": "ch4_3", "text": "With no instructions, the autopilot ... starts flying in circles.", "hf": "route-map" }
```

HyperFrames owns that whole frame (docs/planning/BLACKBOX-2027-REVAMP.md §3.1): no `img`, `video`,
`chapter`, `stat` or `cap` on an hf scene. It is code-rendered, not real footage — it never counts
toward the first-30s real-video hook and never replaces real footage of the actual aircraft/place.

```bash
python3 scripts/build_hf_scenes.py <slug> [--only id1,id2] [--dry-run] [--jobs 2] [--force]
```

`ship_doc.py` runs it as step 3b, right after `build_doc_vo.py`, because it:

1. checks every hf scene's data file exists and its `scene` has a template;
2. rewrites the data file's top-level `duration` to `doctiming.scene_frames(scene)/30 + 0.5 s`
   (rounded up to 0.01 s) so the clip always outlasts the VO — it stops if the manifest has no
   duration for the scene (build the VO first);
3. runs `build.mjs --episode <slug> --channel <doc channel> --only <names>` (then a full rebuild
   so the checked-in `scenes/`/`compositions/` keep every scene);
4. renders each at 3840×2160 / 30 fps, `--jobs` at a time, logging wall seconds and bytes to
   `out/qa/<slug>_hf_render.log`; a clip whose sha256 (data JSON + template + theme + build.mjs +
   pinned CLI) and accent match the last render is skipped as fresh;
5. copies it to `public/shorts/<slug>/video/hf_<name>.mp4`, adds an `ATTRIBUTION.md` line
   (`code-rendered, not archival`) and a `PROVENANCE.jsonl` row (`source: "hyperframes"`,
   `license: "code-rendered"`, `sha`);
6. records `manifest["hf"][<name>] = {sha256, rendered_at_frames, duration, accent, mp4}` in
   `src/mindwired-doc/docs/<slug>.manifest.json`, leaving every other key alone.

Editing a data file or template after that changes the hash: rerun `build_hf_scenes.py <slug>
--only <id>`. The hand-copy route below still works for one-off experiments, but a declared `hf`
scene is the shipping path.

## Dropping a clip into a DocWide episode by hand

DocWide already has a `video` scene (`VideoScene` in `src/mindwired-doc/DocWide.tsx`): a muted clip
from `public/shorts/<slug>/video/`, letterboxed with `objectFit: contain`, narration over it, optional
caption and stat chip. The kit's clips are 16:9 at exactly the comp's aspect, so they fill the frame.
**No DocWide change was needed.**

1. Copy the clip (real copy, not a symlink — Remotion doesn't bundle symlinks):

   ```bash
   mkdir -p public/shorts/helios522/video
   cp out/scene-kit/helios522-route-map.mp4 public/shorts/helios522/video/route-map.mp4
   ```

   (`public/shorts/*/video/*.mp4` is gitignored, same as every other render.)

2. Reference it from the doc spec (`docs/<slug>.json`) as a `video` scene. Exact fields:

   ```json
   {
     "id": "map_route",
     "text": "From Larnaca the 737 flew its programmed route to Athens and, with nobody answering, into a holding pattern over the island of Kea.",
     "video": "route-map.mp4",
     "videoFrom": 0
   }
   ```

   - `video` — file name inside `public/shorts/<slug>/video/`.
   - `videoFrom` — start offset in seconds (window into a longer clip; 0 for these).
   - `cap` / `stat` / `statColor` — optional; the kit scenes carry their own chrome, so leave them out
     unless the narration needs a caption (the caption bar sits in the clip's reserved bottom band).
   - `sfx` / `noAutoSfx` — as for any scene.

   The scene plays for the narration's length (`LEAD + VO + HOLD` frames). Size the clip's `duration`
   in the JSON to the narration beat it accompanies (the clips hold their final frame, so a slightly
   long clip is fine; a short one would cut to black before the VO ends — `VideoScene` does not loop).

3. Run `build_doc_vo.py <slug>` as usual (the manifest scan picks the scene up like any other), then
   render. DocWide's grain/vignette and its 0.92 saturate / 1.06 contrast grade are applied over the
   clip, so the kit's palette is slightly cooler and flatter in the final than in `out/scene-kit/`.

## What is NOT here

- No real radar track for Helios 522 — the map legs are great-circle schematics between the places the
  AAIASB timeline names, and say so on screen.
- No AAIASB page scans — the report is not public domain (see `CLAIMS-helios522.md`), so the exhibit is
  a typeset excerpt of verbatim quotes, stamped as such.
- No narration, music or SFX inside the clips — DocWide owns audio.
