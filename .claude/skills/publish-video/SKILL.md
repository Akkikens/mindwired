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
| Filename | Rename the deliverable to the actual video title (mp4-filename-is-title rule) | e.g. `The Man Who Sold the Moon (And Got Away With It).mp4` — slugs are for working files only. Sanitize only what the filesystem requires (`/` and `:` become `-`); keep spaces, capitalization, punctuation |

## 2. METADATA-<slug>.md completeness check

Reference format: `docs/metadata/METADATA-boeing737max.md` and
`docs/metadata/METADATA-marsone.md`. The file must contain ALL of:

- [ ] **Primary title + 3-4 A/B alternates** (generate/score via ctr-engine if missing)
- [ ] **Thumbnail concepts** — poster style: one lit image, near-black, film grain,
      **2-4 serif words that are NOT the title** (title asks, thumbnail teases; never the same words)
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
- [ ] **Tags** — one comma-separated line, maxed toward 500 chars (~495)
- [ ] **15 hashtags** (first 3 display above the title)
- [ ] **Pinned comment** text
- [ ] **Credits/attribution** — CC-BY/CC-BY-SA credits copied into the description from
      EVERY `ATTRIBUTION.md` under the slug's media dir (they live at
      `public/shorts/<slug>/ATTRIBUTION.md` and/or in `images/`, `broll/`, `archival/`
      subdirs — check all of them)
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

1. Upload the mp4 as **draft/private** — never straight to public.
2. Set the **thumbnail** (primary concept; queue alternates for Test & Compare when eligible).
3. Set **title A** (primary).
4. Paste **description + chapters** (verify chapters render as links in preview — if not, check the 0:00-first and ≥10s rules).
5. Paste the **tag line**.
6. Upload the **SRT** (Subtitles → English → upload file).
7. **End screen:** subscribe element + the specific bridge video the outro VO names
   ("If X shocked you, wait until you see Y…") — the end-screen card must match the spoken handoff.
8. **Publish.**
9. Immediately post and **pin the pinned comment** from the metadata file.
10. **First 2 hours:** reply to every early comment (early engagement feeds the test pool),
    and confirm in Studio → Reach that impressions/CTR are registering (a stuck 0 after
    2h usually means a processing or visibility problem — check the video isn't stuck at SD).

## 5. Shorts drip (starting the NEXT day)

Long-form first, Shorts starting ~24h later while the audience the algorithm just
learned is still warm.

- 1 Short per day, ~24h apart — never dump all on day one.
- Order by **hook strength** (strongest first) — rank by first-3s stopping power.
- Each Short gets a **pinned comment linking the long-form** (the funnel is the point).
- shorts-funnel builds them; this skill only schedules and sequences the drip.

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

1. **Log the upload** — add title, URL, and publish date to the channel's
   published-URLs memory (`blackbox-published-urls` / `mindwired-published-urls`).
2. **Update future MORE FROM blocks** — any in-progress `METADATA-*.md` for the same
   channel should now include the new video where it's the best cross-link.
3. **48h later: launch diagnosis** — run the **launch-diagnosis** skill with the REAL
   Studio numbers (never quote analytics from memory). Its reading order, for reference:
   - **Impressions pool first.** If CTR and retention look normal for the channel but
     the impressions pool is small, the problem is **topic demand**, not packaging —
     feed that back into Icahn topic selection, don't repackage.
   - **Then CTR:** low CTR with a healthy pool = repackage via ctr-engine (Test & Compare).
   - **Then AVD/retention curve:** steep early cliff = hook problem, log it for
     hook-doctor on the next script.
   - Log whatever the diagnosis was to memory so topic selection and packaging both learn.
