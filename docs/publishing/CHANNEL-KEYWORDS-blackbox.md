# Black Box Breakdown — channel keywords + About refresh (2026-08-20)

Why: same exercise as `docs/publishing/CHANNEL-KEYWORDS-mindwired.md`, done
right after studying @official-yesterday for mindwired. Checked whether
Black Box's own stated scope ("disaster & corporate-catastrophe forensics")
needed widening the same way. Conclusion: **no new scope needed** — the
channel's real catalog already spans aviation, maritime (Titanic, Costa
Concordia, Kursk), nuclear (Chernobyl, Three Mile Island), and terrorism/
hijacking (IC 814, D.B. Cooper, WTC Building 7) investigations, all
legitimately "corporate-catastrophe forensics" per the existing CLAUDE.md
definition. The actual gap was that the live channel keywords/description
didn't reflect that breadth — heavily aviation-skewed and missing nuclear/
hijacking entirely. Fixed by precise edits, not a scope change.

## Channel keywords (Studio → Settings → Channel → Basic info → Keywords)

**PUSHED LIVE 2026-08-20 via Chrome/Studio.** The live field was already at
500/500 (completely full) with 24 tags, 14 of them aviation-specific:
`aviation disasters, plane crash investigation, aviation documentary, plane
crash documentary, flight data recorder, cockpit voice recorder, aviation
safety, aircraft accident, what went wrong, chain of errors, forensic
documentary, disaster documentary, engineering disasters, industrial
disasters, maritime disasters, corporate disasters, official accident
reports, Boeing 737 MAX, MCAS, air accident investigation, crash, black box
investigation, aircraft, aircrash investigation`. Maritime/industrial/
corporate combined got only 4 tags; nuclear and hijacking/terrorism — both
categories with shipped episodes — got zero.

**Fix:** removed `Boeing 737 MAX` and `MCAS` (two hyper-specific tags tied
to a single past episode, low ongoing search value) to free budget, then
added `nuclear` and `hijacking` — one word each, matching the existing
set's short-tag style, each covering a whole already-shipped content
category with zero prior coverage. Final field: ~460-478/500, still nearly
maxed, now covering every major content pillar instead of just aviation.

## About / channel description (Studio → Customization → Basic info)

**PUSHED LIVE 2026-08-20 via Chrome/Studio**, confirmed via the "Changes
published" toast. Purely additive — the old description had ~176 chars of
headroom (824/1000), so nothing was removed:

Every disaster leaves evidence a record of what went wrong and why. Black Box Breakdown follows it.

We investigate aviation disasters, shipwrecks, engineering failures, nuclear meltdowns, hijackings and corporate catastrophes, tracing each event back to the decisions, warnings and overlooked details that made failure possible.

Because disasters are rarely caused by one broken component or one unlucky moment. They are usually the final result of a chain of errors.

Using official accident reports, investigation findings, technical records and archival material, we reconstruct what happened, explain the systems involved and uncover the real causes behind history's most consequential failures.

Clear evidence. Detailed timelines. No easy answers.

New investigation every week.

Subscribe and never look at a disaster headline the same way again.

(856/1000 chars — only real change from the prior version: "engineering
failures" → "engineering failures, nuclear meltdowns, hijackings" in the
second paragraph.)

## Notes

- Do NOT widen Black Box's actual scope — "disaster & corporate-catastrophe
  forensics" already covers everything in the real catalog. This was a
  packaging fix, not a positioning change.
- This Google login's Studio defaults to Black Box Breakdown, not mindwired
  — the opposite direction (Black Box → mindwired) needs the channel-ID
  navigation trick documented in `CHANNEL-KEYWORDS-mindwired.md` / memory
  `yesterday-channel-study`.
- Channel handle stays @Watch-BlackBox.
