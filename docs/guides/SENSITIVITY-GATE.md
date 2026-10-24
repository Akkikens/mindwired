# Sensitivity gate (v1, 2026-10-24)

Automated part of the publish-video §6 sensitivity pass, run by
`scripts/preflight_doc.py <slug>` before every render (logic in
`scripts/claims_lint.py`, `sensitivity_gate()`; run it alone with
`python3 scripts/claims_lint.py <slug>`). Spec: BLACKBOX-2027-REVAMP §4.4,
Phase 1 #5.

Real-disaster episodes put real victims and real living people on screen.
Two failures have to be made impossible, not just discouraged: naming the dead
in on-screen text by accident, and stating as fact that a living person lied,
knew, or caused a death when that is only an allegation (the Helios 522
engineer was acquitted on appeal; AI171's pilot-blame theory is unproven).
Narration may still carry both — attributed — but the decision has to be
written down where the gate can see it.

## What it checks

| Check | Result |
|---|---|
| A victim surname (from the CLAIMS `victims:` list) appears in `cap`, `stat`, `mainText` or `chapter` and the doc does not declare `victimsNamed: true` | **BLOCK** |
| A sentence in `text`/`cap`/`stat`/`mainText`/`chapter` matches `<living party> [adverb] is lying / lied / lies / knew / knows / caused / covered up / killed / murdered / falsified / sabotaged / is guilty / is responsible / is to blame …` with no attribution word in the same sentence | **BLOCK** |
| `sensitivity` is not an object, `tier` is not `standard`/`high`/`wtc`, `victimsNamed` is not a boolean, `livingParties` is not a list of strings | **BLOCK** |
| A `blackbox` doc has no `sensitivity` block at all | WARN (the back-catalog predates the gate) |
| `victimsNamed: true` with no `victimsRationale` | WARN |
| `tier` is `high`/`wtc` but the CLAIMS file has no `victims:` list, so the name check cannot run | WARN |

**Attribution words** (any one in the sentence clears the living-party
check): according to, testified/testimony, told, said, says, claims/claimed,
alleged/allegedly, accused, argued, ruled, found, concluded, convicted,
acquitted, charged.

Matching notes: names match as whole words, case-insensitive, so ALL-CAPS stat
chips are caught. A living party matches on the full name or the surname. A
victim matches on the surname only (last word, Jr./Sr./II-IV dropped,
surnames under 3 letters skipped).

## How to declare it

In the doc JSON (`src/mindwired-doc/docs/<slug>.json`), at the top level:

```json
"sensitivity": {
  "tier": "high",
  "victimsNamed": false,
  "victimsRationale": "",
  "livingParties": ["Alan Irwin", "Demetris Pantazis"]
}
```

- `tier`: `standard` (no deaths, or historical with no living families in the
  story), `high` (a fatal accident with living families or named living
  people), `wtc` (United 93 / 9/11-class: the strictest rules in
  `memory icahn-united93` and `icahn-wtc-collapse` apply on top of this gate).
- `victimsNamed`: `true` only when naming victims on screen is a deliberate
  decision. Then set `victimsRationale` too.
- `livingParties`: everyone in the story who is alive (or whose status is
  unverified, like the five Helios defendants), especially anyone accused,
  charged, acquitted or blamed. Treat unverified as living.

In the CLAIMS file (`docs/planning/CLAIMS-<slug>.md`), the victims list goes
under a `## SENSITIVITY` heading (any heading containing that word), as either
form:

```markdown
## SENSITIVITY

victims: Hans-Jürgen Merten; Pambos Charalambous; Andreas Prodromou
```

```markdown
## SENSITIVITY

### Victims
- Hans-Jürgen Merten — captain
- Pambos Charalambous — first officer
```

List the victims the script talks about by name, not the full manifest.
Without a list the name check does not run, and on a `high`/`wtc` doc the gate
warns about that.

## The escape hatch, and why it exists

`"victimsNamed": true` plus a `victimsRationale` turns the victim-name BLOCK
off for that doc. It exists because some episodes should name victims: the
crew whose decisions are the story (Helios 522's captain and first officer,
whose bios are in the report), memorial beats, and United 93's passengers, who
are the subject of the episode. In those cases naming them is a mark of
respect. The gate is there to make that a deliberate choice with a written
reason. It is not a ban.

There is no flag that turns off the living-party check. The fix is always in
the sentence: attribute it ("prosecutors alleged Irwin knew…", "the Greek
court convicted…", "according to the AAIASB…") or cut it. A finding by a
court or an investigation board is still stated as that body's finding. That
is the attributed-mystery format (memory `attributed-mystery-format`) and the
AI171 rule from publish-video §6.

## What v1 does not cover yet (§4.4 backlog)

- Per-person identifiers in seat-map/debris-map data (lands with the Phase 2
  `seat-map` template, aggregate-only)
- WARN when a fatal-accident doc has no memorial beat in its last 10%
- `bannedTerms`: the channel's banned vocabulary (United 93 / 9/11 rules)
- A METADATA `sensitivity` section checked by `publish_kit.py`

Until those land, the manual publish-video §6 pass still runs on every
real-disaster episode. This gate replaces only the parts listed above.
