- `ship_1.mp4` — trimmed 0:03-0:18 from "Titanic Disaster - Genuine Footage (1911-1912).webm" (the ship's real bow/dry-dock movement sequence) — Public domain — https://commons.wikimedia.org/wiki/File:Titanic_Disaster_-_Genuine_Footage_(1911-1912).webm (commons, sourced from British Pathé's own archive)
- `ship_2.mp4` — trimmed 1:00-1:15 from the same reel (a second real dry-dock bow-movement angle) — Public domain — same source
- `carpathia_1.mp4` — trimmed 2:13-2:28 from the same reel (the real "THE CARPATHIA NEARING NEW YORK WITH SURVIVORS" Gaumont newsreel segment, ship underway) — Public domain — same source
- `mackaybennett_1.mp4` — trimmed 6:28-6:41 from the same reel (the real "MACKAY-BENNETT" recovery ship, hull nameplate + departure) — Public domain — same source

Manual pull note (2026-07-28): `fetch_doc_footage.py`'s automated video search
returned 0 results for "ocean liner cruising archival" style queries (no source
indexes this footage by generic description). Resolved by locating the exact
known real reel via Commons search (doc-episode SKILL.md Step 3 technique),
verifying its PD license via imageinfo, downloading the full ~6.7min compilation,
and hand-selecting/trimming four real, clearly-identified segments (confirmed
via their own period Gaumont intertitles, not guessed) — never presenting a
misattributed segment (the reel also contains genuine Olympic-substituted
shots elsewhere per CLAIMS-titanic.md correction #11, which were avoided).

Relevance-audit fix (2026-07-28): the Carpathia clip was initially planned for
scene a9 (narration about the night BEFORE the collision) — a genuine temporal
mismatch, not a false positive. Fixed by adding a new scene (rescue beat, right
after the sinking) so the Carpathia footage narrates the actual event it shows,
and reassigning a9 to the second dry-dock angle instead.
