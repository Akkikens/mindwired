# SHORTS SCHEDULE — american587 (Black Box Breakdown)

**Status: PLANNED, NOT RENDERED.** 4 trailer Shorts for the long-form
"New York Thought It Was 9/11 Again. It Wasn't" (`American587Doc`). Comps
`American587Short1-4` are NOT yet registered in `src/Root.tsx` — register them on the
BlackBoxShort pattern after the long-form render (bodies are recycled long-form
clips; the first 3s of each is rebuilt as a native vertical hook). Black Box has no
vertical subscribe outro yet (CLAUDE.md outro table: "blackbox short — TBD") — that
asset must exist before these render; do not generate a per-video outro.

**Dates** derive from the Black Box publish slot, **Saturday 10:00 IST**:
long-form **Sat Nov 7, 2026 10:00 IST** (the Saturday before the Nov 12 25th
anniversary) → Shorts drip 1/day, ~24h apart, strongest hook first: **Sun Nov 8,
Mon Nov 9, Tue Nov 10, Wed Nov 11** — the drip ends the day before the anniversary.
**Alternative:** if Akshay publishes the long-form on **Thu Nov 12** itself, shift the
drip to Fri Nov 13 → Mon Nov 16 (the post-anniversary search tail).

`{{LONGFORM_URL}}` = the long-form's youtu.be link — fill in on publish day (it does
not exist yet; never ship the braces, never fabricate a link).

Sensitivity (CLAIMS tier HIGH, applies to every Short): no victim names on screen;
the first officer's inputs are always "the NTSB found"; every cockpit/tower line
keeps its **CVR RECREATION** label; no terrorism framing beyond "the city assumed an
attack — it wasn't"; captions and body lines are lifted verbatim from the
gate-checked long-form script, never rewritten.

---

### SHORT 1 — Sun Nov 8, 2026, 10:00 IST
COMP: American587Short1          FILE: out/shorts_final/American587Short1.mp4
BEAT: the tollbooth cold open — scenes `h1`–`h6` (tollbooth_1/2/3 + takeoff_2 real NTSB video, fin_1 at h4). Native hook: punch-in on the toll-camera frame, caption "62 DAYS AFTER 9/11" in the first second. Loop: ends on "It wasn't." → cuts back to the toll-camera frame.
TITLE: Two Months After 9/11, a Plane Fell on New York #aviation #newyork #ntsb
DESCRIPTION: November 12, 2001 — 62 days after September 11th, a security camera at a toll plaza across Jamaica Bay caught an Airbus falling onto Belle Harbor, Queens. The bridges closed, fighters were scrambled, and the whole city assumed a second attack. It wasn't. The full NTSB investigation is on the channel.
TAGS: american airlines 587, flight 587, belle harbor, queens plane crash, 2001 plane crash, airbus a300, ntsb, tollbooth camera, black box breakdown, aviation documentary
PINNED: The whole story — what actually tore the tail off, and why the Safety Board split 3–2 over it: {{LONGFORM_URL}}
RELATED-VIDEO LINK: the long-form, "New York Thought It Was 9/11 Again. It Wasn't"

### SHORT 2 — Mon Nov 9, 2026, 10:00 IST
COMP: American587Short2          FILE: out/shorts_final/American587Short2.mp4
BEAT: "little wake turbulence, huh?" → the 22 seconds — scenes `c3` → `r17` (CAPT, CVR RECREATION) → `c3_3` / `hf_pedals` → `c3_7` (the bang, tollbooth_2). Native hook: the RECREATION-labeled waveform with the caption "little wake turbulence, huh?" on frame 1, then "22 SECONDS LEFT". Loop: ends on the transcript page (`c3_8`) → back to the waveform.
TITLE: "Little Wake Turbulence, Huh?" 22 Seconds Later... #aviation #ntsb #airbus
DESCRIPTION: The cockpit voice recorder of an Airbus A300 climbing out of New York, November 12, 2001 — recreated word for word from the official NTSB transcript (the docket has no audio). From the first bump of wake turbulence to the moment the tail came off: twenty-two seconds. The full investigation is on the channel.
TAGS: cockpit voice recorder, cvr transcript, wake turbulence, american airlines 587, airbus a300, ntsb, plane crash, new york 2001, black box breakdown, aviation
PINNED: What the NTSB found happened inside those 22 seconds — and who it blamed: {{LONGFORM_URL}}  (Cockpit lines are a labeled recreation from the NTSB transcript; no recording was released.)
RELATED-VIDEO LINK: the long-form, "New York Thought It Was 9/11 Again. It Wasn't"

### SHORT 3 — Tue Nov 10, 2026, 10:00 IST
COMP: American587Short3          FILE: out/shorts_final/American587Short3.mp4
BEAT: the 32-pound rudder + the training tape — scenes `hf_exhibit` (Table 3: 65 lb / 4 in at 135 kt vs 32 lb / 1.2 in at 250 kt) → `c5_3` → `c6_2` → `c6_3` (the training-video line). Native hook: "32 POUNDS" over the real rudder wreckage (rudder_1), first second. Keep every clause attributed ("the final report", "the board wrote"); no "the pilot did it" caption. Loop: ends on the training-tape line → back to the pedal numbers.
TITLE: 32 Pounds of Pressure Tore the Tail Off an Airbus #aviation #airbus #ntsb
DESCRIPTION: At 250 knots, the Airbus A300-600's rudder needed just 32 pounds of foot pressure and 1.2 inches of pedal travel to reach full deflection, according to the NTSB's final report — and the airline's 1997 training booklet told pilots that at higher angles of attack, the rudder becomes the most effective roll control. The full investigation, and why it was contested, is on the channel.
TAGS: airbus a300 rudder, rudder pedal, aamp training, american airlines 587, ntsb report, vertical stabilizer, plane crash investigation, aviation safety, black box breakdown, wake turbulence
PINNED: The design, the training, and the 3–2 vote over which came first: {{LONGFORM_URL}}
RELATED-VIDEO LINK: the long-form, "New York Thought It Was 9/11 Again. It Wasn't"
SENSITIVITY NOTE: the `c6` beats use `aamp_booklet.png` — if Akshay's license call (see METADATA known notes) goes against it, cut `c6_2` and use `c6_3` over `rudder_1` instead.

### SHORT 4 — Wed Nov 11, 2026, 10:00 IST
COMP: American587Short4          FILE: out/shorts_final/American587Short4.mp4
BEAT: the 3–2 vote — scenes `c7` → `c7_3` → `c7_4` → `c7_5` → `c7_7` / `c7_8` (probable-cause page, Carmody statement page). Must keep BOTH sides: the vote, Carmody's written dissent (with Healing), Airbus's and American's opposing statements. Native hook: "3 VOTES TO 2" over the real probable-cause page (aar_cause), first second. Loop: ends on "Airbus said… American said…" → back to the vote.
TITLE: The Safety Board Split 3–2 Over Who Was to Blame #aviation #ntsb #airbus
DESCRIPTION: Three years after an Airbus lost its tail over Queens, New York, the NTSB's five board members voted 3–2 on the order of the contributing factors — the airplane's rudder design or the airline's training. One member wrote down her dissent. Airbus and American Airlines each blamed the other. The full investigation is on the channel.
TAGS: ntsb vote, probable cause, carol carmody, airbus vs american airlines, american airlines 587, aviation accident report, rudder design, plane crash investigation, black box breakdown, 2004 ntsb
PINNED: The full record — the vote, the dissent, and the fix that took eleven years: {{LONGFORM_URL}}  Tomorrow, November 12, is the 25th anniversary.
RELATED-VIDEO LINK: the long-form, "New York Thought It Was 9/11 Again. It Wasn't"

---

Judge on engaged views + stayed-to-watch % (70%+ target) + subs gained, never raw
Shorts views. Log which beat popped in `docs/planning/TOPIC-QUEUE.md`.
