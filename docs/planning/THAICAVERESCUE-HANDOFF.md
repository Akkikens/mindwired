# THAI CAVE RESCUE — episode handoff (mindwired)

**STATUS (2026-08-21): RENDER-READY, awaiting Akshay's review + upload.**
Everything below is done: 4K master, SRT, 3 thumbnails, 4 funnel Shorts.

Icahn PASS-WITH-CONDITIONS (memory `icahn-neo-lemmino-sweep`) — runner-up to
Fermi Paradox from the 2026-08-20 sweep, re-validated live at production start
2026-08-21. **The original condition did not survive the live recheck**: the
May-2026 Laos-cave-rescue "echo" (the same two divers, Mikko Paasi and
Norraseth Palasri, called back to a flooded mine) does not itself carry a
fresh small-channel outlier — no channel has yet broken out specifically on
the 2026 angle. Demand instead rests on the topic's own proven recognition: a
movie-recap channel hit 31.1:1 on "Thirteen Lives" alone. Production proceeded
on that basis, with the Laos echo demoted from "the hook" to an honest closing
thread (chapter 9) rather than the spine.

Research ran as a 9-agent Workflow (live currency recheck, footage scout, 5
research dimensions, 2 adversarial fact-checks). All gates green: TTS lint
clean (SEAL/BAFTA all-caps caught and fixed) · relevance audit 0 blocking
after two fix rounds (see footage section) · preflight 0 blocking after two
fix rounds (missing `img` on 5 dossier scenes, caught in two passes) · comp
stills eyeballed throughout.

## Sensitivity handling (do not soften or remove without asking Akshay first)

- **Duangphet "Dom" Phromthep's 2023 death** is included as a brief,
  respectful tribute beat (`coda1`/`coda2`) — explicit go-ahead from Akshay via
  AskUserQuestion. Script states only the Leicester coroner's own findings
  (suicide; not known to any mental-health service; unforeseeable; no
  third-party involvement) and never links it to the 2018 cave trauma — no
  source draws that line, and the script doesn't either.
- **Musk v. Unsworth** is framed attributed-never-asserted throughout: "not
  liable" (civil verdict, jury deliberated under an hour on a narrow technical
  point), never "not guilty," "cleared," or "vindicated." Full corrections in
  `docs/planning/CLAIMS-thaicaverescue.md` (§ DATA CORRECTIONS #1-2).
- **The user's original footage request (CNN/BBC/Fox/NBC/DW broadcast
  footage, "with sourcing") was declined** — attribution isn't a license,
  Content ID doesn't check credit lines, and the risk is the whole channel's
  monetization. All real footage in this episode is legally clear US-military
  PD (DVIDS) or Commons CC. See memory `footage-vision-verify-fix` for the
  tooling built as a direct result of this conversation, and CLAUDE.md's
  footage section for the standing house rule.

## Files

| What | Where |
|---|---|
| Doc spec (84 scenes, ~15.4 min body) | `src/mindwired-doc/docs/thaicaverescue.json` |
| Manifest | `src/mindwired-doc/docs/thaicaverescue.manifest.json` |
| Fact base (9 sections, 6 data corrections) | `docs/planning/CLAIMS-thaicaverescue.md` |
| Comp | `ThaiCaveRescueDoc` in Root.tsx (MW_OUTRO baked) |
| **Master (DONE — 4K, −14.1 LUFS)** | `The Rescue The Movies Left Out.mp4` + `.srt` at repo root |
| Packaging | `docs/metadata/METADATA-thaicaverescue.md` |
| Thumbnails (3 BUILT) | `out/thumbs/thaicaverescue_A/B/C.png` |
| Funnel Shorts (4, rendered) | `ThaiCaveRescueShort1-4` → `out/shorts_final/ThaiCaveRescueShort<N>.mp4` |
| Shorts drip plan | `docs/publishing/SHORTS-SCHEDULE-thaicaverescue.md` |
| Assets + licenses | `public/shorts/thaicaverescue/` + `images/ATTRIBUTION.md` + `video/ATTRIBUTION.md` |
| Music | windowed `bed_tension_falsevacuum.mp3` (first mindwired episode this session to use the tension family — Venera used awe/eventhorizon, no consecutive repeat) |

## Footage: the vision-verify layer's first live test, plus several manual catches it couldn't reach

This episode was the live proving ground for the Gemini vision-verification
fix built earlier this session (memory `footage-vision-verify-fix`) — it
correctly auto-rejected several wrong-subject fetches before they ever reached
a scene. But it isn't a complete solution; it checks "does the image match the
query text," not "does it match the intended real-world referent," so several
errors still needed a human eyeball:

- **Caught automatically by vision-verify:** "Ekkapol Chantawong Wild Boars
  coach Thailand" returned literal wild-boar *animal* photos (the verifier
  judged them a correct match to the ambiguous query text — a real limitation,
  not a false negative). Fixed with direct Commons pulls of the real "Wild
  Boars at the 2018 Summer Youth Olympics" photos.
- **Caught only by the still-eyeball review, not any gate:** a "medical
  prep" query returned a cosmetic eyelid-surgery-with-calipers stock photo for
  a scene about the real sedation protocol (frame `f18507`, scene `e3`) —
  replaced with a real labeled-syringe CC BY 4.0 photo. A "memorial ceremony
  tribute" query returned two real-but-wrong "Marilyn Monroe 10-year death
  tribute" photos — deleted, scenes redirected to an existing correct pool. A
  "Laos map" query returned anachronistic 1770/1881 antique maps for a 2026
  news event — replaced with a modern CIA World Factbook map plus real 2026
  Xaysomboun Province photos. A US-military query returned a generic Pixabay
  cargo-plane stock photo for ground-based pararescue personnel — replaced
  with 3 real 2018-dated DVIDS photos via direct API lookup by ID.
- **A self-authored repetition bug, same class as the Fermi Paradox
  "navmap" incident**: several overloaded generic image prefixes
  (`cavemap`, `courthouse`, `staging`, `ekkapol`) had been reused across
  unrelated subjects (cave maps + oxygen equipment + memorials + diver
  credit all under one prefix; legal/trial content mixed with unrelated
  film-industry photos under another). Split into 8 correctly-scoped
  prefixes before render — caught by the relevance audit's REUSE flag, not
  by inspection.
- **5 dossier scenes were missing `img` fields** across two preflight
  passes (`gen_doc_dossier.py` requires a background image even for the
  chrome-only "case file" treatment — a new discovery this session). Fixed
  scene by scene; `a5`'s dossier image is a real DVIDS training-demonstration
  photo (ID 4669581) specifically because its narration describes that exact
  reenactment technique.

Full attribution/license trail: `public/shorts/thaicaverescue/images/
ATTRIBUTION.md` and `.../video/ATTRIBUTION.md`.

## The one scope decision worth flagging

Akshay explicitly requested real CNN/NBC/BBC/DW broadcast footage three
separate times in this conversation ("we will give source so we will be
fine i guess"), including for this specific episode. Declined each time —
attribution is not a license, and Content ID doesn't check credit lines. The
Royal Thai Government/Navy's own rescue footage was also ruled out on the
same non-US-government-PD basis (Thai copyright law only exempts bare
administrative/legal documents, not produced AV works). All real motion in
this episode is DVIDS (US Air Force pararescue, genuinely on-site) plus
Commons CC stills — the American-pararescue thread exists in this episode
specifically *because* it was the one real, legally clear "we were there"
footage available.

## What's left before publish

1. **VO ear-check sample built (`out/qa/thaicaverescue_vo_sample.mp3`, hook +
   trial-verdict + closing + outro, 35.8s) but not yet actually listened to
   by a human** — the whisper transcript confirms the words are correct and
   no clip is silent/corrupted, but only Akshay's own listen catches tone/
   pacing/mispronunciation issues. Quick listen before upload.
2. **Second pass of eyes on ATTRIBUTION.md** given the volume of manual
   footage correction this episode (see above) — verified correct this
   session, but the pattern from Fermi Paradox was that a second look still
   found things.
3. The verbal bridge (`bridge` scene) intentionally names no specific next
   video ("That full story is live on this channel right now") rather than a
   title — this was deliberate: it avoids ever pointing at a video that
   isn't actually live, at the cost of the extra lift a named bridge gets.
   Fine to leave as-is; flagging in case Akshay wants to name a specific
   live title instead (would require rebuilding just that one VO clip and
   re-rendering the affected seconds — not a full re-render, since it's the
   very last scene before the outro).
