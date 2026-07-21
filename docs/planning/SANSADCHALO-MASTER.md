# Sansadchalo — July 20, 2026 Delhi protest episode (DimaagBatti) — MASTER DOC

One-stop record for this episode: status, decisions, deliverables, sources, assets,
pipeline, the font bug + fix, infra flags, and open decisions. Deep detail lives in
the linked docs; this is the "everything in one place" index.

- Channel: **DimaagBatti** (@dimaagbatti) · Education category · Hindi · narrator **Rohan** (Cartesia `4877b818-…`)
- Working slug: `sansadchalo` (long-form) + `sansadchalo-short` (Short)
- Framing (Akshay's call): **layered & contested** — verified facts, viewer concludes. Personal position ≠ video's position.
- Compiled 2026-07-20.

---

## 1. STATUS SNAPSHOT

| Item | State |
|---|---|
| Research + verified claims list | ✅ done — [CLAIMS-sansadchalo-july20.md](CLAIMS-sansadchalo-july20.md) |
| Hindi script (57 scenes) | ✅ approved — `src/mindwired-doc/docs/sansadchalo.json` |
| Licensed real photos (9) + India map | ✅ fetched + attributed |
| Somber illustrations (33) | ✅ generated + QA'd (anonymous, no gore, no text) |
| Rohan VO (long-form + Short) | ✅ built (Cartesia, hi, speed 0.95) |
| Preflight | ✅ 0 blocking |
| Stills review | ✅ passed (2 fixes applied — see §7) |
| Long-form 4K render | 🔄 **RE-RENDERING on GCE** (font-embed fix; ~40 min) |
| Vertical Short | ✅ done + verified — `out/sansadchalo_short.mp4` |
| Metadata (Hindi-only) | ✅ drafted — [METADATA-sansadchalo-hi.md](../metadata/METADATA-sansadchalo-hi.md) |
| Commit (code+assets, no mp4) | ⏳ pending correct master |
| Upload | ⛔ NOT done — needs Akshay's explicit go-ahead |

---

## 2. DELIVERABLES

### Long-form — `SansadchaloDoc`
- 16:9, **4K (3840×2160)**, ~**9:56**, −14 LUFS, quiet windowed somber bed (owned `doc_somber.mp3`, −24 dB, cold-open + chapter transitions + close).
- No outro (DimaagBatti has none) — ends on the subscribe line. No wordmark-heavy cold open (teaser-first).
- Output on success: `out/sansadchalo_gce.mp4`.
- 9 chapters (see METADATA CHAPTERS; title-card entry dropped to satisfy YouTube ≥10s rule).

### Short — `SansadchaloShort`
- 9:16, **1080×1920**, **41.6s**, −14 LUFS, dry (respectful).
- `out/sansadchalo_short.mp4` — VERIFIED.
- Funnel to the long-form (per algorithm playbook: long-form first, Short ~24h later, pinned link).
- Leads with the students' side (strong lathi-charge illustration + Wangchuk/protester allegation), then police account, then "disputed", then Article 19, then CTA. Neutral/attributed.

---

## 3. VERIFIED FACTS (labels; full sourcing in CLAIMS doc)

- **July 20, 2026:** 10,000+ (organisers claimed ~50,000) marched "Sansad Chalo" to Parliament (monsoon-session day 1) demanding Education Minister **Dharmendra Pradhan's** resignation over the 2026 **NEET** paper leak. **CONFIRMED** (NBC, Al Jazeera, ABC, wire).
- Police used **tear gas + lathi charge**; **dozens injured on both sides**; ~70 detained; **Section 163 BNSS** prohibitory order in force; mobile internet cut (IFF condemned). **CONFIRMED.**
- **No deaths on July 20.** The 4 deaths + police firing + NSA detention = the **separate Sept 24, 2025 Leh** event (kept clearly dated/distinct).
- Numbers = ranges, attributed: police 118+ injured (police's own figure); ~50–60 protesters; ~65 medico-legal (RML); 15–20 govt vehicles.
- **DISPUTED (both sides shown):** who started the violence / whether force was "excessive." Police: protesters turned violent first, deny excess. CJP/opposition/Wangchuk: police brutality on a peaceful crowd.
- **Omitted** (per Akshay, "thin/inflammatory"): machine-guns-at-Parliament, electric barricades, wife-assault claim, Dipke-detention dispute.
- **Traps avoided:** no fatalities; no Oct-2024 Rahul "Chakravyuh" quote (wrong event); no named students; no press/social photos.

Quote bank (attributed, verbatim/translated): Wangchuk hospital note ("…बेरहमी…"), Delhi HC ("हर नागरिक का जीवन अनमोल है"), Tharoor ("लाठीचार्ज अहिंसा नहीं, हिंसा है"), Delhi Police ("उग्र और हिंसक").

Law close: Article 19(1)(a)/(b), 19(2)/(3), BNSS 163, SC jurisprudence (Ramlila Maidan 2012, MKSS 2018, Anita Thakur 2016, Anuradha Bhasin 2020).

---

## 4. ASSETS & LICENSING

- **Real photos (free-licensed, Wikimedia):** Wangchuk portrait ×2 (CC BY 2.0), Leh Palace (CC BY-SA 4.0), Leh town (CC BY 4.0), Pangong (CC BY-SA 3.0), Thiksey (CC BY-SA 4.0), Ice Stupa/HIAL (CC BY-SA 4.0), Jantar Mantar monument (CC BY-SA 3.0), New Parliament (GODL-India). India-view Ladakh map raster (CC BY-SA 3.0). Full log: `public/shorts/sansadchalo/ATTRIBUTION.md` (+ copy in `images/` for the audit).
- **Illustrations (owned, generated):** 33 somber ink illustrations via `scripts/gen_sansadchalo_sketches.py` (Gemini). Anonymous figures, no identifiable faces, no gore, no text/numbers (Hindi overlaid crisply in Remotion). Self-evidently illustrations; audit flags them UNSOURCED by design.
- **Strong police-action illustration** (`lathicharge_1.png`) — riot line + injured being helped away, anonymous — anchors the Short.
- **NOT used (copyright):** PTI/ANI/Reuters/AP/AFP/Getty, news-outlet images, social/YouTube grabs. No protest-day photography exists free-licensed → those beats are illustration/procedural.
- **Music:** `public/beds/doc_somber.mp3` — owned, ffmpeg-synthesized tanpura-adjacent drone (−20 LUFS), used windowed at −24 dB. (doc_tension/doc_awe ruled out.)

---

## 5. VOICE
Rohan (Cartesia `4877b818-c7fe-4c89-b1cf-eadf8e23da72`), `language: hi`, speed **0.95**, sonic-3.5. Long-form 57 clips (~8.9 min narration); Short 8 clips (~35s). No mascot/mascotVoice (guardrail — mascot does no comedy here). Clips validated (no empty/leading-ellipsis mp3s).

---

## 6. ON-SCREEN TEXT: Devanagari (kept) vs romanized
Decision: **keep Devanagari** (e.g. नमस्ते, not "namaste") for Hindi words; Latin only for terms
(Article 19, NEET, link, BNSS, DimaagBatti). Rationale: authentic + credible for a Hindi education
channel (Dhruv Rathee / Nitish Rajput convention), faster for Hindi readers. The font-tofu risk that
prompted the "just romanize it" idea is fixed properly (§7), so no need to trade away Devanagari. VO
is audio, unaffected either way. (Reversible if Akshay prefers romanized.)

---

## 7. RENDER PIPELINE + THE FONT BUG (lesson)
- Build: doc JSON → `build_doc_vo.py` (VO + manifest) → register in `Root.tsx` → `preflight_doc.py` → stills → `render_gce.sh` (4K) → master −14 LUFS.
- **Stills review caught 2 issues, both fixed:** (a) 48 internal `note` fields were rendering on-screen as handwritten margin annotations → stripped; (b) cold-open/`government` illustrations had a US-Capitol dome → regenerated as Indian red-sandstone secretariat (Kartavya Path).
- **THE FONT BUG:** the first 4K GCE master rendered **all Hindi as tofu boxes** — `@remotion/fonts` `loadFont` (via `src/lib/fonts.ts`) silently fails on the GCE headless Chrome (works locally). **FIX:** embedded Noto Sans Devanagari as a data-URI (`src/mindwired-doc/devanagariFont.ts`) injected at the DocWide root — same technique as `sketchFonts.ts`. Verified locally; re-rendering on GCE. **Lesson: always eyeball a cloud-rendered master frame for Hindi before shipping.**

---

## 8. INFRA FLAGS (not the video — for later)
1. **`scripts/render_gce.sh` fetch/cleanup bug:** on macOS bash 3.2 it errors near line 187 after a successful render → fails to auto-scp the master and leaves the VM **stopped, not deleted**. Manual recovery: `gcloud compute instances start <vm> --zone <z> && gcloud compute scp <vm>:~/mindwired/out/<slug>.mp4 out/<slug>_gce.mp4 --zone <z>` then delete. **Worth a proper fix.**
2. **Stranded VM:** `render-almostdied-hi-4106` was found RUNNING (spot $) — leftover from an earlier render's fetch failure. Awaiting Akshay's OK to delete (not created by this session).

---

## 9. METADATA (Hindi-only) — [METADATA-sansadchalo-hi.md](../metadata/METADATA-sansadchalo-hi.md)
Title + A/B, Hindi description (education-framed, keywords front-loaded, no angle brackets), ~495-char tags, 15 hashtags, pinned comment (a neutral QUESTION), thumbnail concepts (somber, no victim faces), CHAPTERS (verify vs final duration), Short blurb + drip plan.

---

## 10. OPEN DECISIONS / NEXT STEPS
1. **Description language:** written Hindi-only (task + `almostdied-hi` pattern + CLAUDE.md). A 2026-07-18 memory says reversed to English-first-then-Hindi — confirm which.
2. **Music windows:** currently open + chapter-transitions + close at −24 dB (standard `--windows`). Brief said "open + close only" — say if you want strictly that (custom windows).
3. **Stranded almostdied-hi VM:** delete? (recommended — cost)
4. **Devanagari vs romanized on-screen** (§6) — keeping Devanagari unless told otherwise.
5. After correct master verified: **commit** (code + assets, no mp4). **Upload is Akshay's call** (explicit go-ahead required; sensitive topic).
6. Thumbnail render (2 concepts in metadata), then publish plan: long-form first → Short ~24h later.
