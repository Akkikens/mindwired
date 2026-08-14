# Costa Concordia — Handoff

**Status: rendered, verified, packaged. Ready to upload.** Shorts + a real
Studio launch-diagnosis are the only things left.

## What shipped
- Channel: **Black Box Breakdown** (@Watch-BlackBox)
- Title: "What Netflix's Costa Concordia Documentary Left Out"
- 11:16.7, 3840×2160, −14.1 LUFS, BB subscribe outro baked in
- 74 scenes, including a 4-line RadioScene recreation of the real
  Schettino/De Falco coast-guard call (labeled "CALL RECREATION" — the real
  audio was never officially released; see below)

## File paths
| What | Path |
|---|---|
| Master mp4 | `What Netflix's Costa Concordia Documentary Left Out.mp4` (repo root) |
| Captions | `What Netflix's Costa Concordia Documentary Left Out.srt` (repo root, 189 cues) |
| Doc spec | `src/mindwired-doc/docs/costaconcordia.json` |
| Fact base | `docs/planning/CLAIMS-costaconcordia.md` |
| Icahn validation + locked package | memory `icahn-costaconcordia` |
| Metadata/packaging | `docs/metadata/METADATA-costaconcordia.md` |
| Thumbnails | `out/thumbs/costaconcordia_{A,B,C}.png` |
| Image attribution | `public/shorts/costaconcordia/images/ATTRIBUTION.md` |
| Video attribution | `public/shorts/costaconcordia/video/ATTRIBUTION.md` |

## Sensitivity warnings (read before publishing)
- **Francesco Schettino is alive and still incarcerated** (Rebibbia Prison,
  Rome; scheduled release ~2033, confirmed via 2026 reporting). Every claim
  about him beyond his 2015 verdict is attributed, not asserted.
- **The real coast-guard radio audio was never officially released** —
  reached the public via a 2012 press leak (journalist Simone Innocenti,
  Corriere della Sera), later authenticated by the Coast Guard. No free
  license exists anywhere for the actual recording. The episode uses ONLY a
  labeled Cartesia recreation from the court-verified transcript — never
  claims to be the real audio.
- **Manrico Giampedroni** (a sympathetic Netflix-doc participant, trapped 36
  hours) was himself convicted (suspended sentence, no prison time) for his
  own role in the evacuation delay — CLAIMS correction #7. If he's discussed
  in any Short, keep this in frame.
- **32 real named victims** — respectful treatment only, no invented
  personal detail beyond what's sourced in CLAIMS-costaconcordia.md.

## Gotchas hit this episode (worth remembering)
1. **Reused an already-mined identity-reveal structure.** This episode's
   packaging leans on the same "wrong for decades, new evidence corrected
   it" DNA as [[icahn-everest-bodies]] (shipped the day before) — except
   here the "reveal" is about what a competitor's documentary left out, not
   an identity correction. Different enough not to feel repetitive, but
   worth tracking if this pattern gets reused a third time soon.
2. **Wrote `"img": "wreck_1"` / `"wreck_2"` / etc. as if they were distinct
   image IDs — they aren't.** The pipeline pools all `<prefix>_N.*` files
   under ONE manifest key (the prefix stripped of its trailing `_N`), so
   `wreck_1.jpg` through `wreck_4.png` all collapse into a single `wreck`
   pool. Referencing `"wreck_1"` directly in a scene is referencing a
   nonexistent manifest key — 41 scenes came back as `BLOCK ... not in
   manifest.images (black frame)` in preflight. Fixed with a blanket
   `"wreck_1"`/`"wreck_2"`/`"wreck_3"`/`"wreck_4"` → `"wreck"` regex
   replace. **Lesson: always use the bare prefix as the `img` value, never
   the numbered filename — even when there's only one file per prefix at
   fetch time**, because adding more files later (which happened here, for
   `giglio` and `salvage`) silently changes the pool key in a way that's
   easy to get backwards.
3. **Generic Pexels/stock fetches pulled wrong-ship contamination.**
   Fetching "Costa Concordia ship before disaster" via the standard fuzzy
   fetcher returned six photos of "Costa Toscana" and "Costa Smeralda" —
   different, much newer Costa-brand ships — plus unrelated shipwrecks in
   Costa Rica and Greece, and (from a "Concordia" query-matching glitch) two
   photos of farm animals in Concórdia, Brazil. All caught on the mandatory
   contact-sheet eyeball and discarded. Fixed by fetching the *exact* real
   Commons file titles the research fan-out's footage-scout agent had
   already verified, via the direct Commons API path — same fix pattern as
   the Everest episode's wrong-David-Sharp catch.
4. **ATTRIBUTION.md format is parser-sensitive.** The relevance-audit script
   expects the exact shape `` `filename.ext` — "Real Title" by Author — ``.
   Writing "MANUAL PULL 2026-08-12 (note)... "Real Title"..." with the note
   before the quoted title causes the parser to grab the wrong substring and
   flag the file as `[UNSOURCED]`/possibly-AI-generated even when it's
   properly attributed. Keep the quoted title immediately after the
   backtick-filename and em-dash; put any manual-pull note at the end.
5. **The GCE render was interrupted mid-run by the local machine sleeping
   overnight** — an 8-hour gap appeared in the render-poll log between two
   consecutive 2-minute polls, after which the VM was gone (not a
   `GCE_SPOT` issue — that env var was unset; the sleep broke the polling
   SSH connection and the VM was separately cleaned up). No cost was left
   running. Re-running from scratch after a fresh `gcloud auth login`
   completed cleanly. Worth flagging for the next unattended overnight
   render: this is the second time in two consecutive episodes that a
   local-machine sleep has interrupted a long-running background process
   (also hit the research workflow's WebSearch agents earlier the same
   session) — if this becomes a recurring pattern, consider asking Akshay
   about disabling sleep during active render/research sessions.

## Left to do
1. **Cut 3-5 funnel Shorts** (shorts-funnel skill). Strongest standalone
   beats: the radio-call climax (`cq1`-`cq5`+`radio1`-`radio4`) and the
   Russel Rebello reveal (`d1`-`d7`).
2. **Real Studio launch-diagnosis owed** once this is live (per
   icahn-validate/doc-episode's closed-loop rule) — log it in
   `docs/planning/LAUNCH-LESSONS.md` within 48h of publish.
3. Paste the CC-BY/BY-SA attribution lines from the two ATTRIBUTION.md
   files into the description if Studio's character limit allows.
