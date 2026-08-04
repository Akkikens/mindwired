# Criminal Record — channel brief (@WatchCriminalRecord)

New channel, created 2026-08-03. True-crime documentaries built on the **primary
legal record**: probable-cause affidavits, dockets, plea agreements, judgments,
transcripts, post-conviction filings. Sibling to Black Box Breakdown — same
evidentiary method, different domain.

Positioning in one line: **the crime is not the product; the record is.**
Thousands of channels narrate murders. Almost none put the actual filing on
screen and read it.

| | |
|---|---|
| Handle | `@WatchCriminalRecord` (display name: **Criminal Record**) |
| Theme accent | cold blue-white `#7FB4FF` — deliberately NOT Black Box's orange, so the two read as siblings rather than clones |
| Wordmark | `CRIMINAL RECORD`, same weight/treatment as Black Box |
| Host | none yet (faceless start; a Reid-equivalent can come later) |
| Subscribe outro | **does not exist** — one long + one vertical, the single legitimate new-outro spend, pending Akshay's approval |
| Engine | mindwired doc engine (`src/mindwired-doc/DocWide.tsx`), `channel: "criminalrecord"` |

## THE OPENING RULE — a documented exception (Akshay, 2026-08-03)

The other channels' hardest rule is "first 30 seconds = real motion video, never
stills, zero exceptions" (memory `hook-first-30s-real-video`). **Criminal Record
is an explicit, permanent exception**, decided deliberately after probing the
sources for the Idaho episode and finding the wall:

> The footage advantage on the space/aviation/disaster channels is **federal
> public domain** — NTSB, NIST, NASA, NARA, DVIDS. State-court criminal cases
> produce world-class *documents* and essentially no free *film*. Probed
> 2026-08-03: Commons video for "Moscow, Idaho" returns Moscow, **Russia**;
> "University of Idaho" returns an unrelated Indonesian university. There is no
> pool to draw on. See `docs/planning/CLAIMS-idahomurders.md`.

So on this channel the cold open may be built from **real photographs, real
documents, and code-generated animation** instead of footage — with one
condition that keeps it from becoming an excuse: **the opening must still MOVE,
and the motion must come from real material.** A static page on screen for eight
seconds is still the failure the original rule was written against.

Acceptable opening motion, in preference order:
1. **Document motion** — a slow push across the actual affidavit, a highlight
   travelling to the line that matters, a page turn on the real filing.
   (`ExhibitScene` already does this; it's the channel's signature shot.)
2. **Code-generated data animation** (Remotion/React, R3F only if 3D earns it):
   a route drawing itself across a map, a timeline filling, a family tree
   expanding outward, phone-ping markers accumulating. Every frame of these is
   a *visualisation of a fact in the record* — that's what makes it honest.
3. **Real photographs with camera moves** — courthouses, exteriors of public
   buildings, verified news-agency stills where licensed.
4. Licensed court/news footage where it exists and the licence is clean.

Still forbidden, and this is the part that matters:
- **No animated reconstruction of any crime.** No figures, no rooms, no
  weapons, no timelines that dramatise the attack itself. The animation layer
  visualises *evidence and chronology*, never the act.
- No AI-generated depiction of a real person, living or dead. Ever.
- No crime-scene photographs, no injury or autopsy detail beyond what the legal
  finding requires, no victim family photographs.
- No dramatic music under the events of a death.
- Nothing that implies guilt or fault for anyone not convicted of it —
  witnesses, survivors, and cleared suspects are handled with the same care the
  channel gives a defendant's presumption of innocence.

## Animation components to build (first episode)
These are the channel's reusable visual vocabulary — build them once, use them
every episode:
- `RecordExhibit` — real filing on screen, citation box, travelling highlight.
  (Extends the existing `ExhibitScene`.)
- `CaseTimeline` — a horizontal clock that fills, marks stamped at each
  documented time. For Idaho: 4:00 / 4:19-4:32 / 10:23 / 11:50 / 11:58.
- `RouteMap` — a schematic (not photoreal) map with a path drawing itself
  between two labelled points. For Idaho: the 2:44 a.m. and 5:25 a.m.
  vehicle movements as described in the affidavit.
- `GenealogyTree` — nodes expanding outward from an unknown profile to a named
  match. The single best explanation of investigative genetic genealogy anyone
  has put on screen, and pure data animation.
- `DocketStack` — filings accumulating chronologically, for procedural history.

Schematic on purpose: a stylised map or tree is a diagram of evidence, and reads
as one. A photoreal recreation would read as a claim about what happened.

## Cadence
Deliberately slower than Black Box. This is a sixth channel and "spread too
thin" is cause #1 in `docs/planning/CHANNEL-DIAGNOSIS-2026-08.md` — launch on
its own rhythm rather than borrowing days from a channel that's already working.

## Launch episode
Moscow, Idaho / the Kohberger record — fact base and sensitivity rules in
`docs/planning/CLAIMS-idahomurders.md`. Needs: the real documents pulled for
exhibits, packaging through ctr-engine, the outro, and a Building-7-tier
sensitivity review before render.
