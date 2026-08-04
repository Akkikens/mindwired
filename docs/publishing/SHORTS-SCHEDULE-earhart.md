# SHORTS SCHEDULE — Earhart (Black Box Breakdown)

Funnel Shorts for **"They Had AMELIA EARHART's RADIO Log. They Never Had Her BODY."**
→ https://youtu.be/998g3UmVjKw (published 2026-08-03)

**Upload from `out/shorts_upload/`, NOT `out/shorts_final/`.** The original
`shorts_final` batch had two defects, both fixed 2026-08-03:
1. Never mastered — measured −21.1 to −21.8 LUFS, ~7 LU under target. They'd
   have played audibly quiet against everything else in the feed.
2. **Every one opened on a bare black text card for 2.5s** — the thing CLAUDE.md
   forbids outright, and in the Shorts feed those 2.5s are the whole verdict.
   `BlackBoxShort` now renders the hook over real archival motion
   (`hookVideo`/`hookImg` props, set per Short in `src/Root.tsx`); all four were
   re-rendered and re-mastered to −14.0/−14.1 LUFS.
Verified in the final files: 1080×1920, real footage under every hook, Reid
outro intact (`out/qa/shorts_final_check/_sheet.png`).

Every file: 1080×1920, 30fps, Reid vertical subscribe outro baked on the end
(8s, `subscribe_blackbox_short.mp4` — do not strip).

Order = strongest hook first. Short 1 leads with the channel's actual
differentiator (the real radio record), which is the same framing currently
winning the live US1549 title test.

## Known deviations (read before judging the numbers)
- **Bodies run 79–103s, over the 35–60s sweet spot** in shorts-funnel. These were
  cut long at render time; they're legal Shorts and the hooks are native-built,
  but expect completion rate to suffer versus a tight 45s cut. If
  stayed-to-watch lands under 70%, the fix is a shorter scene range, not a new
  hook. Next episode: cut ranges to ~5–6 scenes.
- **No on-screen end-card CTA.** `BlackBoxShort` accepts a `cta` prop but never
  renders it, so the CTA text set in `src/Root.tsx` for these four Shorts is
  dead. The funnel therefore rests on the related-video link + pinned comment
  below (and the outro's subscribe ask). Deliberately NOT fixed in the same pass
  as the hook plates — one change per render batch, and the hook was the one
  worth burning renders on. Wire it up before the next batch.

---

### SHORT 1 — 2026-08-04
COMP: `EarhartShort1`  FILE: `out/shorts_upload/EarhartShort1.mp4`  (1:28)
TITLE: Amelia Earhart's Last Radio Call Was Loud and Clear
HASHTAGS: #ameliaearhart #aviationhistory #shorts
DESCRIPTION:
```
July 2, 1937. Chief Radioman Leo Bellarts, aboard the Coast Guard cutter Itasca off Howland Island, is listening for one aircraft. At 08:43 the last transmission anyone would ever receive from Amelia Earhart's Lockheed Electra comes through the speaker — and the detail almost everyone gets wrong is that the signal was not fading. It was as loud and clear as it had been all morning.

Full episode — the radio log, the 13 bones, and the 2025 declassification:
https://youtu.be/998g3UmVjKw
```
TAGS: amelia earhart, earhart disappearance, itasca radio log, howland island, fred noonan, lockheed electra, 1937, aviation mystery, black box breakdown, aviation history
PINNED: The full 30-minute investigation — the actual National Archives radio log, the 13 bones found on Nikumaroro, and what the 2025 declassification really contains: https://youtu.be/998g3UmVjKw
RELATED-VIDEO LINK: https://youtu.be/998g3UmVjKw

---

### SHORT 2 — 2026-08-05
COMP: `EarhartShort3`  FILE: `out/shorts_upload/EarhartShort3.mp4`  (1:44)
TITLE: 13 Bones Were Found. One Might Have Been Hers.
HASHTAGS: #ameliaearhart #forensics #shorts
DESCRIPTION:
```
1940, Nikumaroro. A British colonial officer finds 13 human bones near an old campfire. A doctor in Fiji rules them a stocky middle-aged man. In 2018 a forensic anthropologist re-ran the same original measurements and reached the opposite conclusion — and a 2015 paper defends the 1940 finding. The bones themselves have been lost since the 1940s, so no DNA test can ever settle it.

Full episode:
https://youtu.be/998g3UmVjKw
```
TAGS: amelia earhart, nikumaroro, earhart bones, richard jantz, hoodless report, tighar, forensic anthropology, earhart mystery, aviation history, black box breakdown
PINNED: Every side of the bones argument — Hoodless 1940, Jantz 2018, Cross & Wright 2015, and the 2019 National Geographic DNA attempt — in the full episode: https://youtu.be/998g3UmVjKw
RELATED-VIDEO LINK: https://youtu.be/998g3UmVjKw

---

### SHORT 3 — 2026-08-06
COMP: `EarhartShort4`  FILE: `out/shorts_upload/EarhartShort4.mp4`  (1:34)
TITLE: The US Declassified Her Files. There's No Smoking Gun.
HASHTAGS: #ameliaearhart #declassified #shorts
DESCRIPTION:
```
In September 2025 the US government ordered the release of every Earhart-related record still held back — 4,624 pages that month, thousands more through January. What's actually inside: radio transmissions, weather data, search records, Navy investigations, and a self-described 1937 "telepath." What isn't inside: a smoking gun. No outlet has reported one.

Full episode:
https://youtu.be/998g3UmVjKw
```
TAGS: amelia earhart, earhart declassified, national archives, 2025 declassification, taraia object, nikumaroro expedition, purdue earhart, aviation mystery, black box breakdown, aviation history
PINNED: The declassified files, the Taraia Object on the lagoon floor, and the Purdue expedition that still hasn't left port — full episode: https://youtu.be/998g3UmVjKw
RELATED-VIDEO LINK: https://youtu.be/998g3UmVjKw

---

### SHORT 4 — 2026-08-07
COMP: `EarhartShort2`  FILE: `out/shorts_upload/EarhartShort2.mp4`  (1:51)
TITLE: The Real Radio Log Doesn't Match the Famous Quote
HASHTAGS: #ameliaearhart #archives #shorts
DESCRIPTION:
```
The version of Amelia Earhart's final message everyone quotes is a cleaned-up, typed reconstruction. The raw handwritten Itasca radio log underneath it — held at the National Archives — is terser and harder to read. Even the ship's own commanding officer added details to his later report that aren't in the original log.

Full episode:
https://youtu.be/998g3UmVjKw
```
TAGS: amelia earhart, itasca radio log, national archives, 157 337 line, fred noonan navigation, gardner island, earhart final transmission, aviation mystery, black box breakdown, aviation history
PINNED: What the 157/337 line actually is, where it points, and why that isn't proof — full episode: https://youtu.be/998g3UmVjKw
RELATED-VIDEO LINK: https://youtu.be/998g3UmVjKw

---

## After each upload
Set the related-video link in Studio (Shorts → related video), pin the comment,
and log engaged views + stayed-to-watch % at 48h into
`docs/planning/LAUNCH-LESSONS.md`. Judge on engaged views and stayed-to-watch
(target 70%+), never raw Shorts views.
