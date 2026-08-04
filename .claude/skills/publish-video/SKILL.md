---
name: publish-video
description: Upload-day runbook that takes a FINISHED, verified render to a fully-packaged YouTube upload. Use when a render is done and the user says "upload kit", "publish", "publish this", "metadata", "ready to upload", or asks what to do before/after uploading. Covers pre-upload verification, METADATA completeness, Studio settings, the launch sequence, the Shorts drip schedule, the sensitivity pass for real-disaster episodes, and post-publish logging.
---

# Publish Video — from finished render to live upload

This skill starts where the render pipeline ends. It does NOT write titles/thumbnails
(that's **ctr-engine**), rewrite hooks (**hook-doctor**), cut Shorts (**shorts-funnel**),
or diagnose an underperforming upload (**launch-diagnosis**) — it verifies, packages,
launches, and logs. Run every section in order; nothing here is optional.

## 0. Confirm the channel first

Branding + outro are already baked into the render, so verify — don't assume — which
channel this upload is for (mindwired / Black Box Breakdown / DimaagBatti / KickOffDaily90).
Everything below (URLs, sub-link, language, description rules) branches on it.

## 1. Pre-upload verification (never skip, even if "it rendered fine")

| Check | Command / action | Pass condition |
|---|---|---|
| Duration + resolution | `ffprobe -v error -show_entries format=duration -show_entries stream=width,height -of default=nw=1 <file>.mp4` | Duration = expected body + outro (BB outro 16.1s / 483f, MW outro 17.6s / 527f @30fps); resolution **3840x2160** (4K is the default — 1920x1080 only if the episode was explicitly shipped `--hd`) |
| Loudness | Read the before/after LUFS line printed by `render_and_master.py` / `master_video.py` from the render log | After = **−14 LUFS**. If the log is gone, re-measure: `ffmpeg -i <file>.mp4 -af loudnorm=I=-14:TP=-1.5:print_format=json -f null - 2>&1 \| tail -15` — never trust memory |
| Outro branding | `ffmpeg -ss <duration-8> -i <file>.mp4 -frames:v 1 out/qa/<slug>_outro.png` then **LOOK at the frame** | Correct channel's host + wordmark (Reid/Black Box vs Orion/mindwired). Wrong outro = wrong render, stop here |
| Splice frame | Extract a frame ~1s before body-end too | No black gap / frozen frame at the body→outro splice |
| SRT — captions file | `.venv-agent/bin/python3 scripts/whisper_srt.py out/<slug>_gce.mp4 --out mindwired_<slug>.srt` | **Preferred**: word-accurate cues transcribed from the actual rendered master (local faster-whisper, $0) — snaps to the real audio and writes numbers as digits ("Boeing 787") instead of the phonetic TTS spellings. Eyeball the first ~5 cues for proper nouns; bump `--model medium.en` if one misses |
| CHAPTERS block (doc-engine episodes) | `.venv-lipsync/bin/python scripts/gen_doc_srt.py <slug>` | Chapters still come from the manifest — use the CHAPTERS block this prints, not hand-computed timestamps. Regenerate from the FINAL manifest. (Its SRT output is the estimate-mode fallback if whisper is unavailable) |
| Filename | Rename the deliverable to the actual video title (mp4-filename-is-title rule) | e.g. `The Man Who Sold the Moon (And Got Away With It).mp4` — bare title, no channel prefix; slugs are for working files only. Sanitize only what the filesystem requires (`/` and `:` become `-`); keep spaces, capitalization, punctuation. **Rename the .srt alongside it to the same `<Title>.srt`** — the deliverable is the pair; the slug-named srt stays only as a working file |

## 2. METADATA-<slug>.md completeness check

Reference format: `docs/metadata/METADATA-boeing737max.md` and
`docs/metadata/METADATA-marsone.md`. The file must contain ALL of:

- [ ] **Primary title + 2 A/B alternates** (generate/score via ctr-engine if missing —
      30-50 chars, negative-emotion statement, per ctr-engine's title spec)
- [ ] **Thumbnail FILES, not concepts** — `out/thumbs/<slug>_A.png`, `_B.png`,
      `_C.png` must exist (≥720p) per ctr-engine step 5. **A metadata file whose
      thumbnail section is a concept/prompt with no built image is INCOMPLETE — this
      is the leak that shipped a month of episodes with no purpose-built thumbnail.**
      Style: zero text or one ≤10-char word, one bright focal element on dark,
      real archival asset as the subject (title asks, thumbnail teases)
- [ ] **Full description** ending in the **▶ MORE FROM block with REAL URLs** — no
      `[paste URL]` placeholders on these channels anymore:
      - **Black Box Breakdown:** 737 MAX `https://youtu.be/d4_Rk50GkBg` · Colgan
        `https://youtu.be/Oh8YpgbudHQ` · AF447 `https://youtu.be/ZvD4n8uNnuk` · playlist
        `https://www.youtube.com/playlist?list=PLGVCiFZm8sRw` · subscribe
        `https://www.youtube.com/@Watch-BlackBox?sub_confirmation=1`
      - **mindwired:** Mars One `https://youtu.be/fpCfIg2uQmA` · 21 Astronauts
        `https://youtu.be/maxZwNGqIDU` · Lost Cosmonauts `https://youtu.be/Hs6ZzZAQ7ms` ·
        playlist `https://www.youtube.com/playlist?list=PLSGw_l2_Tsdo` · subscribe
        `https://www.youtube.com/@MINDWIREDD?sub_confirmation=1`
      - Full rosters live in memory (`blackbox-published-urls`, `mindwired-published-urls`) —
        pick the 3-4 most related, drop the new video's own link
- [ ] **CHAPTERS** — first chapter at `0:00`, every chapter ≥10s, plain hyphens
      (no em-dashes/colons that break YouTube's parser); timestamps from gen_doc_srt.py output
- [ ] **Tags** — one comma-separated line, ~10-15 obvious terms, 10 seconds of
      effort MAX. (2026-08 update: YouTube states tags are near-worthless except for
      common misspellings — the old "maximize toward 500 chars" policy bought
      nothing; don't spend time here.)
- [ ] **3-5 hashtags** (only the 3 that display above the title matter — the old
      15-hashtag standard is retired; 3-5 is the evidence-backed sweet spot)
- [ ] **Pinned comment** text
- [ ] **Credits/attribution** — CC-BY/CC-BY-SA credits copied into the description from
      EVERY `ATTRIBUTION.md` under the slug's media dir — enumerate them, don't
      guess subdirs: `find public/shorts/<slug> -name ATTRIBUTION.md`
      (video/ is the second-most-common location and was missing from the old list)
- [ ] **Sources block** (credibility + ammo for pinned-comment replies)

## 3. Studio settings

| Setting | Value |
|---|---|
| Category | Follow the episode's METADATA file and the channel's lane — recent docs use **Science & Technology** (Mars One, AI171), several earlier Black Box uploads used **Education** (AF447, Colgan); METADATA-blackboxanatomy.md flags the split and says pick ONE lane channel-wide. KickOffDaily90 = Sports |
| Language | English (Hindi ONLY for DimaagBatti) |
| Description language | English-only everywhere EXCEPT DimaagBatti = Hindi-only |
| AI disclosure | **YES — tick "Altered or synthetic content"** whenever the cloned narration voice (Cartesia 00d3c951…) is used, i.e. every doc-engine episode |
| License | Standard YouTube License |

## 4. Launch sequence (in this exact order)

0. **The weekly slot rule:** each channel has ONE fixed publish day+time; never
   break it, never dump. Every documented breakout in this niche ran an unbroken
   weekly/fortnightly rhythm for years (Fascinating Horror compounded to 1M subs on
   discipline alone) — the win is audience habit, not an algorithm bonus, so spend
   zero effort micro-tuning time-of-day beyond "audience is awake." **The slot
   itself is a one-time call: read it from the "Publish slots" table at the top of
   `docs/planning/LAUNCH-LESSONS.md`; if a channel's row is still TBD, ask Akshay
   once and record the answer there — never invent a slot, never proceed
   slot-less.** **A rendered-but-unpublished backlog (the 2026-08 audit found 8+
   finished masters never uploaded) is dripped into the weekly slots — never
   batch-dumped, and never left to rot: an unpublished master earns nothing and
   its currency decays.**
1. Upload the mp4 as **draft/private** — never straight to public.
2. Set thumbnail **A** and start **Test & Compare with all 3 built variants**
   (`out/thumbs/<slug>_A/B/C.png`) — mandatory on every long-form. Winner is
   decided by WATCH-TIME SHARE (YouTube's own metric), not CTR eyeballing. One
   variable per test (thumbs now; a title test can follow after it settles).
3. Set **title A** (primary).
4. Paste **description + chapters** (verify chapters render as links in preview — if not, check the 0:00-first and ≥10s rules).
5. Paste the **tag line** (10 seconds, no more — see section 2).
6. Upload the **SRT** (Subtitles → English → upload file) — this also feeds
   search/AI-answer indexing of the transcript, which is a real discovery surface now.
7. **End screen: ONE video element only — the exact video named in the episode's
   final verbal-bridge narration line (the line just before the subscribe line,
   ahead of the standing outro; the fixed outro asset itself never names a video) —
   plus the subscribe element.** Single-video end screens roughly double the
   click-through of 4-grid end screens, and the card must match the spoken handoff.
   Never a generic grid.
8. **Publish** — but for any real-disaster / real-person episode, ONLY after the
   Section 6 sensitivity pass has passed (Section 6 is a pre-publish gate despite
   its position in this file; publishing a sensitive episode before it = the exact
   failure this order exists to prevent).
9. Immediately post and **pin the pinned comment** from the metadata file — and
   include a one-line **Hype ask** in it ("if this deserves more reach, Hype it")
   — channels under 500K subs get an inverse-size Hype multiplier; conversion
   evidence is thin but the ask is free. Keep it out of the VO.
10. **Post to Communities** (if enrolled): the thumbnail + one-line hook + link.
    Weekly rhythm on community posts is one of the few officially-measured
    distribution effects; also run occasional thumbnail A/B polls there — free
    packaging data.
11. **First 2 hours:** reply to every early comment (cheap, hour-1 only — reply
    quotas beyond that have no distribution evidence), and confirm in Studio →
    Reach that impressions/CTR are registering (a stuck 0 after 2h usually means a
    processing or visibility problem — check the video isn't stuck at SD).

## 5. Shorts drip (starting the NEXT day)

Long-form first, Shorts starting ~24h later while the audience the algorithm just
learned is still warm.

- 1 Short per day, ~24h apart — never dump all on day one.
- Order by **hook strength** (strongest first) — rank by first-3s stopping power.
- Each Short gets the **related-video LINK set** (official Shorts→long-form
  feature) + a **pinned comment linking the long-form** (the funnel is the point —
  though remember the real mechanism is topic continuity, not link clicks).
- Schedule from `docs/publishing/SHORTS-SCHEDULE-<slug>.md` — if shorts-funnel
  didn't write one, that's a gap; go back and get it. The audit found drips
  silently skipped whenever no schedule doc existed.
- Judge the drip on **engaged views and stayed-to-watch %** (70%+ target), never
  raw Shorts views (inflated since the March 2025 first-frame counting change).

## 6. Sensitivity pass — mandatory for real-disaster / real-person episodes

Run this BEFORE publish on any episode about a real accident, death, or named living person:

- **Open investigations (AI171 rule):** title/thumbnail must NOT assert an unproven
  cause. No "SOLVED", no "the pilot did it" framing while the investigation is open —
  the fuel-cutoff pilot-blame theory stays **attributed, never asserted**, everywhere
  including packaging.
- **Fairness note in the description** whenever a named living person (or their family/
  union) disputes the findings — state the dispute and the denial plainly
  (see the Mars One description's Lansdorp paragraph for the pattern).
- Claims must match `docs/planning/CLAIMS-<slug>.md` — the fact base gates the
  packaging exactly as it gated the script. If the title says something the CLAIMS
  file can't support, change the title.
- Never platform conspiracy claims; recreations stay labeled; quote calls as text
  where the episode rules require it (e.g. United 93).

## 7. Post-publish

1. **Log the upload TWICE** — (a) add title, URL, and publish date to the channel's
   published-URLs memory (`blackbox-published-urls` / `mindwired-published-urls`),
   and (b) append the same `title · URL · publish date` row to the **Publish log
   table at the top of `docs/planning/LAUNCH-LESSONS.md`** — that table is how the
   loop gates (icahn-validate/doc-episode Step 0) determine "the most recent
   upload"; "upload" always means published-on-YouTube, never merely rendered.
   Also add a dated line: `DIAGNOSIS DUE <publish date + 2 days> for <slug> —
   Akshay to paste Studio numbers` (this is the 48h trigger; optionally also
   create a scheduled reminder if Akshay wants one).
2. **Update future MORE FROM blocks** — any in-progress `METADATA-*.md` for the same
   channel should now include the new video where it's the best cross-link. Add the
   new episode to its **series playlist** (binge shelves lift session watch time and
   suggested traffic — every episode belongs to exactly one series playlist).
3. **48h later: launch diagnosis — NOT OPTIONAL.** The 2026-08 audit found this loop
   had never once closed (LAUNCH-LESSONS.md didn't exist while ~15 videos shipped).
   The enforcement is now structural: **icahn-validate Step 0 refuses to validate a
   new topic until the previous upload's diagnosis is banked in
   docs/planning/LAUNCH-LESSONS.md.** Run the **launch-diagnosis** skill with REAL
   Studio numbers (never from memory), including the Test & Compare result. Reading
   order, for reference:
   - **Impressions pool first.** If CTR and retention look normal for the channel but
     the impressions pool is small, the problem is **topic demand**, not packaging —
     feed that back into Icahn topic selection, don't repackage.
   - **Then CTR:** low CTR with a healthy pool = repackage via ctr-engine (Test & Compare).
   - **Then AVD/retention curve:** steep early cliff = hook problem, log it for
     hook-doctor on the next script.
   - Bank the lesson in LAUNCH-LESSONS.md — that file now steers the next topic pick.

## 8. Standing channel-level plays (monthly rhythm, not per-upload)

- **One collab per month with a similar-sized channel in the lane** (YouTube's
  official Collaborations feature, Oct 2025 — co-billing on both channels, no face
  needed: guest narration swaps, cross-description links). A collab is the only
  direct way to borrow a warm audience as the next upload's cold-start pool — the
  channel's precise diagnosed bottleneck.
- **Communities enrollment + weekly post rhythm** (poll / thumbnail A/B / behind-
  the-scenes exhibit) — one of the few officially-measured distribution effects.
- **Serialization check:** both channels should be running numbered/branded series
  with playlists (the no-signature channel in this exact niche — 306 videos, +13K
  subs in 28 months — is the cautionary case; every breakout had a nameable
  signature). Signature/series naming is a one-time branding call — confirm with
  Akshay once, then apply everywhere.
