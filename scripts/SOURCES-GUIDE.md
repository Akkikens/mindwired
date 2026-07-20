# Media sources — footage, photos, audio evidence

Two sections: **footage/photos** (companion to `scripts/fetch_footage.py`, added
2026-07-19) and **audio evidence** (companion to `scripts/fetch_ntsb_docket.py`).

---

# PART 1 — Real footage + photos (fetch_footage.py)

Full research dossier (every API, license quote, live test): docs/planning/FOOTAGE-UPGRADE.md.
Rules: PD / CC0 / CC-BY / CC-BY-SA / vetted site-licenses only; NC/ND never; every
file logged to ATTRIBUTION.md; real archival ALWAYS beats AI generation for real
events/people/places.

## Per-niche ranking (mirrors NICHE_RANK in scripts/fetch_footage.py — update both)

| Niche | Video order | Why |
|---|---|---|
| **aviation** | dvids → nara → archive_org → commons → loc → pexels/pixabay | NARA = 3,969 PD "Moving Images" for 'apollo' alone incl. military aviation; Universal Newsreels (archive.org) = cleanest PD claim on the site; DVIDS for modern military jets (free key) |
| **space** | nasa → nasa_svs → eso → commons → archive_org | images-api.nasa.gov (PD) + SVS cinematic visualizations (PD) + ESO/Hubble/Webb (CC BY 4.0, credit in description) |
| **ocean** | noaa_ocean → commons → nasa → archive_org | NOAA Ocean Exploration WP media API = deep-sea ROV footage, US-gov PD. Schmidt/MBARI/WHOI/Nautilus are all NC or permission-only — **never scrape them** |
| **history** | archive_org → nara → loc → commons | Prelinger + Universal Newsreels + FedFlix; LoC National Screening Room ("no known restrictions" filter ON) |
| **football** | commons → pexels/pixabay | honest verdict: **no free match footage exists** — rights minefield. Fan-shot CC on Commons, stills, or stock atmosphere only |
| **tech** | archive_org → commons → pexels/pixabay | Prelinger industrial films for retro tech |
| **generic** | commons → archive_org → pexels → pixabay | Pexels/Pixabay = modern generic b-roll ONLY (ocean, clouds, city) — never presented as archival |

## Per-source cheat sheet

- **archive_org** — advancedsearch → metadata → download. Trusted PD collections:
  `prelinger`, `universal_newsreels`, `usgovfilms` (FedFlix), `nasa`. Outside them,
  require a PD/CC `licenseurl` (user uploads lie — a licenseurl on a random upload
  is unverified). Files: prefer `h.264` derivative, then `512Kb MPEG4`; never the
  multi-GB MPEG2 master. Downloads 302-redirect to ia*.us.archive.org (follow_redirects).
- **nasa** — images-api.nasa.gov, PD. Caveats: no NASA logo use implying
  endorsement; identifiable-people caution. API ANDs every query word — the module
  auto-broadens thin queries.
- **nasa_svs** — svs.gsfc.nasa.gov/api/search/?search= — cinematic black-hole/
  Earth/data visualizations, often 4K. PD, credit "NASA SVS".
- **nara** — catalog.archives.gov keyless `/proxy/records/search`. Gotchas (live-
  tested): spaces MUST be %20, never `+`; >3 query params returns an HTML shell.
  Only `useRestriction: Unrestricted` items pass.
- **loc** — loc.gov JSON API, `fa=online-format:video`, keep only "no known
  restrictions"/PD rights. **RATE LIMIT: 20 req/min, exceeding blocks you for an
  HOUR** — one search per fetch.
- **eso** (ESO + ESA/Hubble + ESA/Webb) — djangoplicity sites, CC BY 4.0 (credit
  the `Credit` field verbatim in the description). 1080p mp4s on their CDNs. Many
  clips carry scored music — our transcode strips audio (`-an`), so no music-rights
  issue in the render.
- **noaa_ocean** — oceanexplorer.noaa.gov WP REST media API. US-gov PD; credit
  line ("NOAA Ocean Exploration") requested — log it.
- **dvids** — api.dvidshub.net, key CONFIGURED in .env (2026-07-20,
  `DVIDS_API_KEY`; private key stored as `DVIDS_PRIVATE_KEY`). US-military PD;
  no implication of DoD endorsement.
- **pexels / pixabay** — keys CONFIGURED in .env (2026-07-20; `PEXELS_API_KEY`
  200 req/hr / 20K/mo; `PIXABAY_API_KEY` 100 req/60s). Bespoke free-commercial
  licenses (NOT CC0 — both left CC0 years ago): composited b-roll fine,
  standalone redistribution prohibited; skip clips with recognizable
  brands/logos. Modern stock — never pass off as archival, never use for real
  events/people. Pixabay terms we must honor: credit the source when results
  are shown (our ATTRIBUTION.md → description block covers it), download to
  our storage (we do — no hotlinking), no systematic mass downloads (per-episode
  fetches only), responses cached 24h. Pixabay `videos.large` is often REAL
  3840×2160 — use `fetch_footage.py --uhd` on 4K episodes.
- **Skipped after legal audit** (do not add): Videezy (license conflicts),
  Mazwai + Life of Vids (dead sites), Schmidt Ocean/MBARI/WHOI/Nautilus (NC or
  permission-only), ISRO/JAXA (no commercial grant), British Pathé/AP/Reuters
  (paid). **Manual-only** (license OK, no scriptable/ToS-clean API): Mixkit,
  FAA.gov media pages, Getty Open Content, Flickr Commons (incl. San Diego Air &
  Space Museum), Coverr (API exists but library now mixes in AI-generated clips —
  against the whole point).

## Doc-driven fetching (the default path per episode, 2026-07-20)

`scripts/fetch_doc_footage.py <slug> [--uhd]` — reads the doc spec and sources
the whole episode in one command. Scene fields: `"img": "klia", "query": "kuala
lumpur airport night"` (image pool per prefix), `"video": "b777_1.mp4",
"videoQuery": "boeing 777 takeoff night"` (exact clips), `"stock": true`
(generic atmosphere b-roll -> Pexels/Pixabay first; specific/real things stay
archival-first), doc-level `"niche"`. Write SPECIFIC queries — the aircraft,
the ship name, the place — never just "ocean". Then eyeball the contact sheet,
`build_doc_vo.py --manifest-only`, `audit_scene_relevance.py`.

## The anti-slop rules (enforced by the pipeline)

1. **Real thing > real category > stock > AI.** Every concrete noun the narration
   dwells on (a plane, a ship, a place, a person) gets REAL footage/photos of that
   thing when it exists. AI/stylized shots only for abstractions or unfilmable
   moments — never for real people/events with archival coverage.
2. **New video = new footage.** Never copy another slug's media dir. Hook (first
   ~30s) reusing ANY file from another video is a preflight BLOCK
   (`scripts/audit_scene_relevance.py`, wired into preflight_doc.py).
3. Same file max ~3 scenes per video; no two adjacent scenes on the same visual.
4. Every fetch ends with a contact sheet in out/qa/ — EYEBALL it before wiring
   scenes (the "wall of sticky notes as a 777" incident, 2026-07-19).

---

# PART 2 — Audio-evidence sources for aviation-disaster videos

Companion to `scripts/fetch_ntsb_docket.py`. Ranked by licensing safety.

## 1. NTSB dockets (default — public domain)
- `https://data.ntsb.gov/Docket/?NTSBNumber=<id>` — the full investigation file:
  CVR transcript PDFs ("Cockpit Voice Recorder … Factual Report"), ATC factual
  reports, photos, FDR data, board-meeting animations (animations often have the
  real ATC audio embedded — extract with ffmpeg).
- US government work = public domain (17 U.S.C. § 105). Log provenance in
  SOURCES.md anyway (the fetch script does this automatically).
- Quirk: dockets rarely contain standalone ATC audio files; audio usually comes
  from the FAA release or the docket animation.

## 2. FAA released ATC tapes (public domain)
- Accident/incident pages: `https://www.faa.gov/data_research/accident_incident/<YYYY-MM-DD>`
  — e.g. US1549 has 8 live mp3s (LGA tower positions, N90 TRACON, TEB) + position
  transcripts. Fetch with a real browser User-Agent (Akamai 403s bot UAs).
- Older/removed pages: Wayback CDX
  `web.archive.org/cdx/search/cdx?url=faa.gov/data_research/accident_incident/*`
  finds dead mp3 URLs; download the snapshot via `web.archive.org/web/<ts>/<url>`.

## 3. archive.org
- No single canonical ATC collection; material is scattered (uploads of FAA/NTSB
  releases, GPO hearing records, TV-news airchecks). Search
  `archive.org/advancedsearch.php?q=<flight>+(mediatype:audio OR mediatype:movies)&output=json`.
- License varies PER ITEM — check the item's metadata; only reuse items that are
  themselves US-gov material or clearly licensed. TV-news items are NOT clear to use.

## 4. LiveATC.net — fallback WITH PERMISSION ONLY
- Huge archive of real ATC recordings, but LiveATC's terms prohibit commercial
  use of its recordings without written permission. For a monetized YouTube
  channel: email them for permission first (they do grant it to media), keep the
  grant on file, credit them. NOT a default source.

## 5. Foreign accident boards (transcript sources, not audio)
- **BEA** (France, bea.aero) — final reports (AF447 etc.) include full CVR
  transcript excerpts; reports freely reusable with attribution.
- **AAIB** (UK, gov.uk/aaib-reports) — Open Government Licence v3: free
  commercial reuse with attribution.
- **KNKT/NTSC** (Indonesia, knkt.go.id) — final reports (Lion Air 610 etc.)
  with CVR excerpts; government publications, attribute.
- **TSB Canada / ATSB Australia / JTSB Japan** — similar report-PDF policies;
  audio itself is almost never released — narrate/recreate from transcripts,
  label recreations on screen.

Rule of thumb: real audio = NTSB/FAA (PD). Everything else = transcripts you
dramatize, clearly labeled "recreation based on official transcript".
