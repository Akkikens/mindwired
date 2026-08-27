# SYSTEM GATES — BACKLOG (from the 2026-08-26 lesson-gate audit)

A 4-agent audit swept every memory file + planning doc for documented
production defects: **121 found, 109 automatable.** The highest-value tier
was implemented the same day (see `preflight_doc.py`'s docstring and memory
`preflight-lesson-gates`). This file is the rest, prioritized. When picking
one up: implement → validate against the WHOLE existing doc catalog (first
drafts of the 2026-08-26 gates false-blocked twice before calibration) →
delete the entry here.

Full audit detail (per-item coverage analysis with file:line citations):
the coverage-matrix output is summarized per item below; regenerate anytime
by re-running a memory sweep against the current gate code.

## Tier 1 — honesty/defect classes with real prior incidents

- **Post-render blackdetect sweep in ship_doc.py** — the authoring-time
  gates now block known black-scene causes, but a final
  `ffmpeg -vf blackdetect=d=0.3:pix_th=0.10` over the finished master (parse
  stderr in Python — NOT grep, whose exit-1-on-clean-pass caused a false
  "failed" reading once) is the belt-and-suspenders that catches causes
  nobody predicted. Starfishprime's black sweep found 23 scenes the gates
  of that era missed.
- **Exhibit-citation verification** — pdftotext the exhibit's kept source
  PDF and grep for the title/date used in the scene's `source` field
  (kursk episode cited the Dec-2000 interim report as "final report Jan
  2002"). audit_exhibit_highlights.py exists but is not wired into
  preflight/ship_doc and never blocks — wire it in, add OCR-crop
  fuzzy-match against the quoted text.
- **Vision-verify prompt enrichment** (footage.py `verify_relevance`) —
  pass the referencing scene's narration text + era constraints into the
  prompt (today it sees only the search query + source title, which is why
  wrong-era stock and "Wild Boars coach"-class ambiguity pass); verify 2-3
  frames per clip, not 1. Also: track MISMATCH rate per prefix and above
  50% abort fuzzy retries, fall back to direct Commons title search.
- **License parse-back gate** — fetch-time allowlisting exists, but nothing
  parses licenses back OUT of ATTRIBUTION.md at preflight; hand-added
  assets (the Crown-Copyright TSB pages took exactly this path onto 41
  scenes) pass ungated. BLOCK Crown Copyright/unknown/missing licenses.
- **Dossier face check** — gen_doc_dossier.py hallucinated realistic human
  faces TWICE in one session (2026-08-26, swissair111) despite prompt
  rules; auto-check each generation (Gemini vision: "does this depict a
  person/face?") and retry with a tightened prompt.

## Tier 2 — pipeline robustness

- **CHUNKED auto-default for long comps** — render_gce.sh still defaults
  CHUNKED=0; auto-route to chunked above ~15 min (needs frame count, e.g.
  a doctiming call before launch), plus a --frames=0-30 smoke render in
  preflight to surface comp-level crashes before a VM is paid for.
- **Doc-spec schema validation** — chapter-string is now checked, but
  exhibit/sting/dossier accept any truthy value ("exhibit": "<prefix>"
  would silently pass), sfx cues validated by name only. A small JSON-schema
  for DocScene ends the whole class.
- **did-you-mean on img-prefix blocks** — 3 episodes hit numbered-filename-
  instead-of-prefix (41/88/39 blocks); strip `_\d+$` and suggest.
- **Verbal-bridge target check** — extract named/teased titles from closing
  scenes and check against the published-URLs memory (an unpublished video
  was once named on-air as if live).
- **Outlier-stats recheck at production start** — re-fetch subs/views via
  yt-dlp for the validated topic's proof channels; a 41× subs error
  slipped through once. Plus: check TOPIC-QUEUE's NEXT flag against
  existing doc JSONs/Root.tsx/published-URLs (stale-flag near-double-upload
  happened once; live-channel check is now habit but not code).
- **Viral-engine (src/viral) gates** — plan-JSON schema validation (bad
  emotionalTone enum crashed a build cryptically), and a component-
  capability preflight (MindwiredShort once had zero `video` support —
  video scenes rendered silently black).

## Tier 3 — nice-to-have

- **OCR passes**: placard/marking reading on museum/replica photos (the
  mislabeled Soyuz-as-Venera Commons asset), branding detection on generic
  stock stand-ins, exhibit-highlight crop OCR (also Tier 1 item).
- **CLAIMS→fetch integration**: parse the CLAIMS footage table for exact
  Commons titles/URLs; fetch those FIRST (wrong-namesake contamination),
  BLOCK prefixes whose CLAIMS-named asset is absent from ATTRIBUTION;
  per-slug FETCH-BLOCKLIST (the "Kursk" Ukraine-war-results problem);
  per-scene `niche` override (naval-aviation queries got nebula clips).
- **Photo-vs-diagram classification sweep** over pooled files (Commons
  filenames lied twice); hand-added files bypass fetch-time checks.
- **Thumbnail gates**: block sub-1280px sources, brightness/contrast floor
  on out/thumbs/*.png (apollo13 6×-upscale blur, ic814 over-darkening).
- **Publish-completeness script**: refuse "shipped" status without
  SHORTS-SCHEDULE-<slug>.md + registered Shorts comps (everestbodies
  2-day-late drip).
- **Banned-assertion lint**: per-episode banned-assertions list from the
  CLAIMS honesty block, checked against narration (the "scam"-in-narrator-
  voice near-miss).
- **ATTRIBUTION `content:` lines** for hand-cut sub-clips so the relevance
  audit stops false-flagging them against the parent reel's title.
