# SPEC — Air India 171 (Black Box Breakdown) — learnings applied

Two products:
- **DEFINITIVE doc (the real "best")** — HOLD until the AAIB FINAL report publishes
  (monitor `ai171-final-report-watch`). This is the flagship; build it grounded in
  the final report. [[blackbox-breakdown-channel]], TOPIC-QUEUE.
- **Interim explainer** — "Why is there still no final report?" — optional now, ~5 min,
  strictly AAIB-preliminary-attributed, ZERO blame. Script drafted (chat, 2026-07-14).

## Colgan learnings to apply to BOTH
- **Audio-forward, no cheap diagrams** ([[no-procedural-diagrams-feature-real-audio]]):
  use real footage/photos + document screenshots; minimize/avoid procedural blueprints.
- **RadioScene + radio_recreate.py** for cockpit lines (labeled "CVR RECREATION",
  distinct per-speaker voices); real audio gets green "ACTUAL ATC RECORDING".
- **Outro baked into the comp** — single render, no ffmpeg concat (BB_OUTRO, 483f).
- **counter** diagram is parameterized (`arg`), NOT hardcoded.
- English-only description + "MORE FROM" funnel block ([[channel-description-playbook]]).
- Still-verify every new scene type before the one full render.

## HARD CEILING — why AI-171 can't match Colgan yet (be honest on screen)
Unlike Colgan, AI-171 currently LACKS the material that made Colgan strong:
- **No public real ATC audio.** (Colgan had the FAA tape.) It crashed seconds after
  takeoff; no released Indian ATC audio confirmed. → verify; likely none. So the
  green "ACTUAL ATC RECORDING" beats mostly DON'T exist for AI-171.
- **No official animation.** (Colgan had the NTSB reconstruction.) Investigation is
  ongoing; no AAIB animation. → use real photos (VT-ANB, 787, Ahmedabad) + AAIB/FAA
  document screenshots. At most ONE restrained fuel-switch mechanism visual.
- **CVR = one contested, paraphrased exchange.** Use the AAIB's INDIRECT wording,
  do NOT identify which pilot, do NOT call it deliberate. At most one careful
  "CVR RECREATION" beat. Never the "why did you cut off / I didn't" media paraphrase
  as verbatim. ([[no names; defamation traps in the AI-171 research.]])
- **Live/contested** → the interim piece is structurally lighter (about the ABSENCE
  of an answer). The definitive, "best" AI-171 needs the final report.

## Verdict
Apply all transferable learnings to the interim explainer (real photos + doc
screenshots + one careful recreated CVR line + no diagrams + single render + funnel),
but its ceiling is capped by the missing real-audio/animation. Pour the FULL learnings
into the DEFINITIVE doc when the final report drops — that is the one that will be "best."
