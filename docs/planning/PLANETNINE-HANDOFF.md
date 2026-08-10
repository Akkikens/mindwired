# Planet Nine — handoff ("They've Never Seen It. They're Sure It's There.")

**Status: RENDERED, VERIFIED, PACKAGED — ready for Akshay's final review + upload.**
Not yet published. Channel: mindwired.

Produced fully autonomously (2026-08-09/10), including a full topic pivot
mid-production: Betelgeuse's companion star was initially locked, but Akshay
directly rejected it for having too-weak views:subs ratios versus Voyager 1's
gold-standard numbers. A fresh 6-candidate re-sweep found Planet Nine as the
strongest real alternative (see memory `icahn-planetnine`).

Render verification: 3840×2160, 30fps, 688.8s (11:28.8 — body 671s + 527-frame
outro), AAC 48kHz stereo, mastered to **−14.1 LUFS** (in −24.4 LUFS), windowed
`bed_awe_singularity.mp3` at 9 windows. **Full-timeline `ffmpeg blackdetect`
pass found zero black-screen events.** Captions: 68-scene whisper transcript,
accurate digit forms.

## What's done

| Step | Status | Where |
|---|---|---|
| Icahn validation | PASS-WITH-CONDITIONS — pivoted from a declined Betelgeuse pick after a 6-candidate re-sweep | memory `icahn-planetnine` (Betelgeuse's research preserved in `icahn-betelgeuse`, not wasted) |
| Packaging lock (ctr-engine) | Done — title held against 12 fresh challengers in a later re-test for the sibling Voyager 1 episode's process, applied the same rigor here at lock time | Appended to `icahn-planetnine` memory |
| CLAIMS fact base | Done — 4-agent research fan-out (origin/2016 evidence, decade-long search + live 2026 status, skeptical counter-arguments, footage scout) | `docs/planning/CLAIMS-planetnine.md` |
| Script | 68 scenes, ~1,728 words narration | `src/mindwired-doc/docs/planetnine.json` |
| Footage | Fetched + hand-verified; multiple manual Commons/direct-source pulls after automated fetch returned wrong subjects | `public/shorts/planetnine/{images,video}/` + `ATTRIBUTION.md` in each |
| VO | 68 clips, Cartesia, 9.9 min narration, speed 0.96 | `public/shorts/planetnine/audio/` |
| Gates | 0 blocking (preflight + relevance audit + TTS lint) | — |
| Comp registered | `PlanetNineDoc` in `src/Root.tsx` | — |
| Render | 4K, **two renders**: first render verified clean but had a real repetition defect caught post-render; corrective second render fixed it | `They've Never Seen It. They're Sure It's There..mp4` (repo root) |
| Captions | 68-cue whisper transcript (reused across both renders — audio never changed) | `They've Never Seen It. They're Sure It's There..srt` (repo root) |
| Metadata package | Title + 2 alternates, description, chapters, tags, pinned comment | `docs/metadata/METADATA-planetnine.md` |
| Thumbnails | 3 built PNG files (real Caltech illustration / real evidence diagram / real Rubin Observatory photo) | `out/thumbs/planetnine_{A,B,C}.png` |
| Shorts | Not yet cut | — |

## Real production lessons from this episode

1. **A single primary-source press page can yield several real assets at
   once.** Caltech's 2016 Planet Nine press release page had, in its raw
   HTML, direct links to the official artist's-concept illustration, the
   actual published clustering-evidence diagram, AND a real joint photo of
   Batygin and Brown together — three separate asset needs solved by fetching
   one URL and grepping for image links, instead of three separate searches.
   Worth trying this pattern earlier in future episodes' footage-fetch step.
2. **NOIRLab's video pages expose direct download URLs in their HTML** even
   though the automated fetcher's ranked-source search didn't surface them —
   fetching the actual `noirlab.edu/public/videos/<slug>/` page and
   regex-extracting `.mp4`/`.mov` links found real 4K drone footage of the
   Vera Rubin Observatory that the standard search-based fetch missed
   entirely (it returned a Mars rover video and an unrelated Betelgeuse clip
   instead).
3. **ATTRIBUTION.md's parser only supports one filename per line.** An entry
   grouping two files behind one shared description (`` `file1.jpg`,
   `file2.jpg` — description ``) silently fails to parse, and a description
   that opens with an explanation ("MANUAL PULL, automated fetch
   returned...") before the real title gets parsed as if THAT were the
   source title. Fix: one line per filename, real title first, explanation
   after. Both bugs produced confusing preflight warnings that looked like
   real sourcing gaps but weren't.
4. **Gamma-brightening a real diagram/illustration for text-overlay
   legibility is safe when the actual content — lines, labels, a glowing
   point — stays legible; raw pixel-mean brightness is a poor proxy on
   images that are mostly intentional black space** (a diagram of orbits in
   space, an illustration of a planet against the Milky Way). Verified by
   rendering an actual still and looking, not by trusting the number alone —
   same lesson as Voyager 1's brightness audit, refined further here.
5. **The real defect this episode caught: `orbit_diagram` was used 28 times**
   across a 68-scene, 11-minute episode — because it was the only real
   evidence-diagram asset available and got used as a lazy default for any
   generic "discussing the pattern" scene. Akshay caught this by watching the
   render; the automated relevance-audit's REUSE warning (capped at "~3 per
   video") had already flagged it but wasn't treated as blocking. **Fix
   applied:** fetched 3 new distinct real assets (2 Palomar Observatory
   photos, 1 real ESO starfield photo) and redistributed all 28 uses down to
   6 genuinely-justified reuses (only scenes literally discussing the diagram
   itself) plus real variety elsewhere — a full corrective re-render, since
   only images changed, audio/timing were untouched. **Recommend treating
   a >10x single-image reuse count as a preflight-blocking condition, not
   just a warning, in future episodes.**
6. **Large real-footage payloads (this episode's video folder alone was
   145MB, from two real 4K-sourced drone clips) make the GCE sync step more
   prone to transient "Connection reset by peer" SCP failures** — hit twice
   in a row on the corrective render before a third attempt succeeded. The
   render process and VM were confirmed still alive during the slow attempt
   (not hung) by checking `ps aux` for the actual `scp` child process — worth
   checking that before assuming a hang and killing/retrying prematurely.

## What's left before publish

1. **A real human listen to the VO** — this session verified clip integrity
   and the whisper transcript reads correctly, but did not literally listen.
2. **Build thumbnails into Test & Compare** at upload (files already exist).
3. **Cut 3-5 funnel Shorts** once Akshay confirms the long-form is good to go.
4. **Update the Voyager 1 "MORE FROM" placeholder** in this episode's
   description once Voyager 1 is actually published (currently a bracket
   placeholder, not a fabricated URL).
5. **Akshay's own review pass** before hitting publish — nothing here has
   had a human's eyes on the finished video yet, beyond the repetition catch
   already acted on.
