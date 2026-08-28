# Booked — channel brief

New 6th channel (Icahn-validated 2026-08-28, see memory `icahn-booksummary-channel`).
Animated-avatar book-summary/critique channel — legal fair-use commentary, NEVER
full-text narration of the source book.

## Identity
- **Channel name:** Booked
- **Host:** Marlowe — avatar host, built on the existing `src/viral` host-mode
  engine (Gemini identity → Real-ESRGAN 4x → Sonic lip-sync; same pipeline as
  Orion/Sterling/Jamie/Vex). Registered in `src/viral/hosts.json` once the host
  image is generated (not yet done — pending Akshay sign-off on the look).
- **Narrator voice:** pending the in-flight Cartesia audition (quentin / theo /
  ronald vs. current default Grant) — Akshay wants the winner to become the
  shared `DEFAULT_VOICE` for ALL channels (mindwired/Black Box/Criminal
  Record/Booked), not a Booked-only voice. Do not lock this channel's voice
  until that pick lands; then update `scripts/lib/cartesia.py` DEFAULT_VOICE
  once, which propagates everywhere.

## Format
- Host (Marlowe) talks to camera, critique-forward framing — "which ideas
  actually hold up vs. which are just repackaged common sense" — not a
  straight recap, per the validated whitespace (incumbents in this niche only
  do straight recaps).
- **Kinetic text pop-ins layered over the host**, synced to the word-level VO
  manifest — reuse `src/components/Captions.tsx` (word-level pop) and
  `src/components/kinetic.tsx` (bigger keyword/stat reveals) exactly as the
  viral engine already does. Bold/circle the specific phrase Marlowe is
  agreeing with or pushing back on. This is the differentiator vs. the
  niche's dominant static-kinetic-typography-only style (illacertus, Antidote,
  After Skool all skip an on-screen host).
- `"board": true` scenes (existing viral-engine convention) for any beat that
  needs a full-screen graphic instead of the host — e.g. listing all 48 laws
  at a glance.

## Scripting rule (legal)
Write summaries/critiques from general knowledge of the book's well-known
ideas — never quote or closely paraphrase the author's actual prose, and never
work from the pirated ePUB source. Ideas/facts aren't copyrightable; the
specific expression is. This matches how every large incumbent in this niche
(illacertus, Antidote, After Skool, FightMediocrity) already operates.

## First episode
**48 Laws of Power** (Robert Greene) — strongest fresh Icahn outlier
(80.9:1 @ 562K views, Apr 2026). Critique-angle title direction: which laws
hold up vs. which are cynical noise; NOT a plain "here are the 48 laws" recap.

## Open items before first render
1. Marlowe host image (Gemini gen — real API cost, needs Akshay's look sign-off)
2. DEFAULT_VOICE lock (audition in progress, see out/qa/vo_audition_newdefault/)
3. Register `booked` in `src/viral/hosts.json` + add to the channel table in
   the repo's `CLAUDE.md` once 1-2 are settled — channel/branding must be
   confirmed before the first render, per the repo's standing rule (bakes into
   the render, re-render is wasted work).
