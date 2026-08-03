# DOSSIER-SCENES — the hand-cut "case file" reconstruction beat

Built 2026-07-28. The illustrated sibling of `ExhibitScene` (which shows a REAL
document): `DossierScene` fills the one honest gap in the real-footage-first
pipeline — a narration beat with **zero real photo/footage coverage** (an
unfilmable moment, an abstraction). It is NOT a revival of the whiteboard
mascot system (`SKETCH-BRAND.md`) — that reads too cheerful/childish for a
serious documentary tone. This is a grimmer register: torn newsprint, masking
tape, a rubber-stamp label, a "RECONSTRUCTION" tag that never comes off.

**Use this sparingly.** The footage hierarchy stays: real footage > real photo
> `dossier` > nothing. A handful of beats per episode at most, only when the
archival-footage-scout research step (doc-episode Step 1) comes back empty for
that specific beat. Never use it for a real, identifiable person or event that
has archival coverage — that's what `ExhibitScene`/real photos are for.

## The pieces

| Piece | Where | What |
|---|---|---|
| Scene component | `src/mindwired-doc/Sketch.tsx` → `DossierScene` | torn-newsprint scrap + hero cutout (paper-drop settle, one decaying wobble — not a cartoon bounce) + masking-tape corner + rubber-stamp `label` + mandatory bottom-right "RECONSTRUCTION" tag |
| Doc-engine fields | `DocWide.tsx` `DocScene` | `dossier: true` (+ `img` prefix) renders `DossierScene`; `label` = short 1-4 word date/name stamp rendered as real text (not baked into the image); reuses `cap`/`camera` |
| Image generator | `scripts/lib/dossier_gen.py` + `scripts/gen_doc_dossier.py <slug>` | ONE Gemini still per prefix (`CASEFILE_STYLE` locked prefix, same $0-ish direct-API route as `gen_mascot.py`), white→alpha'd — **no Higgsfield/paid video-gen anywhere in this pipeline**; the animation is 100% native Remotion springs |
| Concepts sidecar | `src/mindwired-doc/docs/<slug>.dossier.json` | hand-authored `{prefix: concept}` map, same discipline as `gen_sansadchalo_sketches.py`'s `CONCEPTS` dict |
| SFX | `public/sfx/stamp_thud.wav` (`scripts/gen_sfx_kit.py`) | auto-cued: `page_turn` on entry, `stamp_thud` when `label` is set |

## Per-episode workflow

1. During research fan-out (doc-episode Step 1), the archival-footage-scout
   agent flags beats with NO real footage/photo. Those are `dossier`
   candidates — confirm there's genuinely nothing real before reaching for
   this (check `fetch_doc_footage.py`/`fetch_footage.py` results first).
2. Write `src/mindwired-doc/docs/<slug>.dossier.json`: one concept string per
   prefix, following the **composition law** below.
3. `python3 scripts/gen_doc_dossier.py <slug> --all` → generates the cutouts
   into `public/shorts/<slug>/images/`.
4. `python3 scripts/build_doc_vo.py <slug> --manifest-only` to register the
   new prefixes into the manifest.
5. Mark the scenes `"dossier": true, "img": "<prefix>", "label": "..."` (label
   optional) in the doc JSON. Normal pipeline from here — preflight blocks a
   `dossier` scene with no `img` (chrome-only, no cutout).

## Composition law (carried over from the source material's discipline)

- **One hero subject per cutout**, generous empty margin — the concept string
  should describe ONE person/object/place, not a whole scene. DossierScene's
  own Remotion chrome (torn scrap, tape, stamp) supplies the "collage"
  feeling; the generated image itself should be a clean, isolated cutout.
- **Anonymous where a real person is implied**: no identifiable real faces —
  same rule `gen_sansadchalo_sketches.py`'s `SOMBER_STYLE` already enforces
  (blank/shadowed/turned-away faces). This isn't a real photo; it must never
  read as a real photo of a real person either.
- `label` is short (1-4 words: a date, a name, a place) and rendered as real
  Remotion text — never ask the image model to render text.
- No gore, no suffering close-ups — the same real-tragedy restraint as every
  other scene type in this repo.

## The honesty rule (non-negotiable)

`DossierScene` ALWAYS renders a small "RECONSTRUCTION" tag, bottom-right,
permanently — there is no prop to turn it off. Same principle as `RadioScene`
labeling recreations "CVR RECREATION" vs "ACTUAL ATC RECORDING", and
`ExhibitScene` only ever showing a real document. If you find yourself wanting
to hide or shrink this tag to make a beat feel more "real," that's a sign the
beat should be real footage/a real photo instead, not a dossier scene.

## Gotchas

- Cutouts are white→alpha preprocessed (`gen_mascot.white_to_alpha`) exactly
  like sketch illustrations — same reason (mix-blend-multiply doesn't work for
  sitting art on a textured background, so real transparency is required).
- The relevance audit will flag dossier cutouts as UNSOURCED — correct and
  intended, same as sketch illustrations: they're self-evidently illustrations
  (the RECONSTRUCTION tag says so on-screen too), the flag is just provenance
  bookkeeping, not a defect to fix.
- `DossierScene`'s hero image uses `objectFit: "contain"` (not `cover`) so a
  portrait OR landscape source never gets cropped — request whichever aspect
  actually suits the concept (`--aspect` flag on `gen_doc_dossier.py`, default
  `4:5`), don't force everything into 16:9.

## v1 scope / not built yet

- No red-string-and-pin connector between beats (needs multi-beat anchor-point
  plumbing) — a documented future extension, not required for the honest,
  useful version of this scene type.
- No per-channel style variant beyond the accent-color swap (`THEMES` accents
  in `DocWide.tsx`) — revisit if a channel wants a visibly different collage
  texture, not just a different highlight color.
