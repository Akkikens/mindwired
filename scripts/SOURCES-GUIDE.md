# Audio-evidence sources for aviation-disaster videos

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
