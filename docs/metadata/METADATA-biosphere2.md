# METADATA — biosphere2 (mindwired)

**Master:** `out/biosphere2_gce.mp4` — 6.5 GB · 3840x2160 · 30fps · **37:53** · **−14.02 LUFS**
(measured 2026-09-12 off the master with `ffmpeg loudnorm` — the render log is gone;
input_tp −1.38 dBTP, input_lra 4.80. Passes the −14 target.)
**Captions:** `mindwired_biosphere2.srt` — 629 cues, whisper (`small.en`) off the master,
speech to 37:51. Rename to `<Title>.srt` alongside the titled mp4 at upload.
**Rendered:** 2026-09-06 (GCE). **Outro:** mindwired / Orion, verified on
`out/qa/bio2_outro_check.jpg`; splice clean on `bio2_preoutro_check.jpg` (real footage
into outro, no black gap). Body ends ~37:35, outro 17.6s.

> ⚠ **SOURCE-OF-TRUTH WARNING (2026-09-12).** There is no doc spec, manifest, script or
> `CLAIMS-biosphere2.md` anywhere in this repo or on any branch — the episode source was
> never committed. Everything below except the ctr-engine package was derived from the
> **whisper transcript of the master itself**, which is the only surviving record of what
> the film actually says. Chapters are transcript-verified, not manifest-derived
> (`gen_doc_srt.py` cannot run without a manifest). Treat the film as unre-renderable
> until the source turns up.

## Upload settings
**Category:** Science & Technology · **License:** Standard YouTube License ·
**Language:** English · **Description language:** English only ·
**AI disclosure:** YES — tick "Altered or synthetic content" (cloned/synthetic narration
voice; all visuals are real PD/CC footage and stills, no AI recreations of real people).

## TITLE (locked, ctr-engine Run A — 8.75/10 avg)
**8 People Sealed In. The Oxygen Kept Vanishing.**  (46 chars)

Alternates for Test & Compare:
- 8 People. 2 Years. The Air Kept Disappearing.  (45)
- The World They Built Started Suffocating Them  (45)

> Scored: curiosity gap 9 / first-3-words 9 / payoff honesty 9 / mobile length 8.
> **Title on the premise, never the proper noun** — the 1.25M competitor
> ("8 People Sealed Themselves Inside a Glass Dome for 2 Years") never says
> "Biosphere 2" in its hook either. **Riff, never clone:** that exact string is the one
> we must not reuse — this channel has already shipped two verbatim clones of big titles
> (178 and 195 views against 1.33M and 1.99M).

## THUMBNAIL — ❌ NOT BUILT (blocker before upload)
No `out/thumbs/biosphere2_A/B/C.png` exist. **A concept with no image file is an
incomplete package** and Test & Compare cannot run. Concepts + probed assets, from
ctr-engine Run A (all licences probed 2026-09-03), zero text on all three:

- **A (primary)** — the glass space-frame lattice shot from INSIDE, backlit, geometry
  filling frame, dark below, peak brightness only where sun hits the glazing. One
  dominant alien geometric shape, unidentifiable at 170px — that IS the curiosity gap.
  asset: NASA eClips "Launchpad: NASA and Biosphere 2" HD master frame
  (archive.org/details/LaunchpadNasaAndBiosphere2, PD, 372.7s h.264 — the same source
  the film's motion b-roll came from; local copy `scratchpad/bio2/src/eclips_hd.mp4`).
  fallback still: `File:Biosphere 2 Architecture.jpg` 4608x3072 CC BY-SA 4.0.
- **B (Test & Compare)** — **the Lung**, the giant sealed diaphragm chamber. Strongest
  squint test of the three; nobody can identify it at 170px and it is mechanically
  central (it's why the pressure never dropped, which is why the crew couldn't
  acclimatize). asset: `File:Biosphere 2 Lung, 2-25-17.jpg` 4032x3024 CC BY-SA 4.0;
  alt `File:Biosphere 2 Lung - Flickr - treegrow.jpg` 4000x3000 CC BY 2.0.
  **RISK: the Lung is not confirmed present in the PD motion footage.** The film DOES
  explain the lungs in narration at 07:33, but if B wins Test & Compare, check the
  first 30s actually shows one — the first-30s must pay the thumbnail's promise.
- **C (fallback)** — the ziggurat/structure at dusk against the Arizona desert, lit from
  within: the "alien building on Earth" read. asset:
  `File:Biosphere 2, Tucson, Arizona LCCN2010630699.tif` 7240x5433, PUBLIC DOMAIN
  (Carol Highsmith / Library of Congress).

## CHAPTERS (transcript-verified against the master, 2026-09-12)
```
00:00 September 26, 1991 - the door that bounced back open
01:57 1 - The ranch before the glass
04:57 2 - The number that made it science
08:35 3 - What they ate
12:27 4 - The thing nobody invited
14:00 5 - The air starts going
16:31 6 - The seal was never a seal
20:33 7 - The doctor couldn't add
22:33 8 - In the walls
26:27 9 - The only building that could have seen it
27:55 10 - The door opens from outside
31:15 11 - The verdict
33:04 12 - What it became
35:11 What I actually think
```
First chapter at 0:00, every gap ≥10s, plain hyphens only (no em-dashes/colons —
they break YouTube's parser). Last chapter ends before the body→outro splice at ~37:35.

## DESCRIPTION (English only)
On 26 September 1991, eight people were sealed inside a 3.14-acre glass building in the
Arizona desert with 4,000 other species, and no way to take in food, water or air from
the outside for two years. The man who closed the door was a Texas oil heir, not a
scientist. It took him two tries — the airlock bounced back open on the first, and the
reporter from the Arizona Daily Star wrote it down exactly as it happened.

Sixteen months later, the air inside was missing seven tons of oxygen, and nobody on
Earth could say where it had gone.

This is the full story of Biosphere 2: what it cost, what it promised, and what actually
happened to the air inside it. The seal was the tightest ever built around a living
system — 50 miles of glazing joint and 10 miles of welded seam, and every flaw in all of
it added up to the equivalent of a single hole 19 millimetres across. So the oxygen was
not leaking out. It could not leak out. It was going somewhere inside.

We follow the whole thing: the ranch in New Mexico where it started and the "cult"
allegation that did more damage than any scientific result; the number that decides
whether this was science or theatre; the farm that failed and left the crew at 1,780
calories a day, losing 17% of their body weight, eating peanuts shell and all; the crew
doctor whose life's work was calorie restriction and whose own diet-planning software
set the rations; the pollinators that all died and the stowaway crazy ant that took the
place over; the fingertip lost to a threshing machine 16 days in, the airlock that
opened for it, and the duffel bag that came back through — three accounts of what was
inside it, all three from people who are alive to disagree; the CO2 scrubber they didn't
disclose, and the furnace that was supposed to close that loop and never once worked.

Then the answer, which took two of the best geochemists alive to find. The mystery was
never that oxygen was vanishing. The mystery was that carbon dioxide wasn't appearing to
match it. Soil microbes ate the oxygen, exactly as anyone would have guessed on day one
— and then the building's own curing concrete quietly ate the evidence, locking it up as
limestone. Eight people nearly suffocated because their house was still drying.

And the part almost nobody tells you: this is the only building that could ever have
found that out. The oxygen fell by about 140 parts per million a day. A leak rate of
just 1% a day would have hidden that signal completely — and after 1996, when the seal
stopped being maintained, the building degraded to 1-2% a day. The discovery that makes
Biosphere 2 scientifically important could not have been made in the building it became.
It got exactly one chance, and the reason it took it is the thing everyone was laughing
at: the obsessive, expensive, ridiculous tightness of the seal.

A note on fairness. Almost everyone in this story is still alive. The 1991 Village Voice
"personality cult" line is an allegation by a named journalist, not a finding — and the
most credentialed early critic, Kew's Ghillean Prance, publicly walked his own version of
it back. The April 1994 airlock opening is described by Abigail Alling as an emergency
response and by the company as sabotage; both positions are quoted and neither is
endorsed here. Alling and Van Thillo were charged; two independent research passes could
not find the disposition of that criminal case in any reachable public record, so this
film states plainly that it does not know and implies no conviction. What is on the
record is that in June 1996 a jury in Florence, Arizona found in their favour in a
separate civil case over being fired, awarding nearly $520,000 in lost wages. Roy Walford
died in 2004 and cannot answer the questions raised about the rations; his own follow-up
paper concluded all eight came out in excellent health, and that is included too.

Everything here is built from the primary record — the peer-reviewed engineering and
atmospheric papers, contemporary reporting, and the crew's own published accounts and
interviews. No invented dialogue.

▶ MORE FROM MINDWIRED
• 200,000 People Signed Up to Die on Mars. Then It All Fell Apart. → https://youtu.be/fpCfIg2uQmA
• 21 Astronauts Never Came Home. Here's Every Story. → https://youtu.be/maxZwNGqIDU
• The Biggest EXPLOSION in HISTORY Left No Crater → https://youtu.be/9YOOCyi6oqk
• The Lost Cosmonauts the USSR Pretended Never Existed → https://youtu.be/Hs6ZzZAQ7ms
• Documentaries playlist → https://www.youtube.com/playlist?list=PLSGw_l2_Tsdo
• Subscribe → https://www.youtube.com/@MINDWIREDD?sub_confirmation=1

CHAPTERS
(paste the block above)

## TAGS (one line — 10 seconds of effort, tags are near-worthless now)
biosphere 2,biosphere 2 documentary,biosphere two,what happened to biosphere 2,oxygen
mystery,sealed ecosystem,closed ecological system,arizona desert glass dome,jane poynter,
roy walford,john allen biosphere,steve bannon biosphere 2,biosphere 2 oxygen,science
documentary,mindwired

## HASHTAGS (3-5 — only the first 3 display above the title)
#Biosphere2 #Documentary #Science #SealedWorld #mindwired

## PINNED COMMENT
Seven tons of oxygen went missing from a sealed building and the carbon dioxide reading
stayed flat, which is the only reason it took two world-class geochemists to solve. The
answer was in the walls: the concrete was still curing, and it ate the evidence while the
soil ate the air. The part I keep thinking about is that a slightly leakier building —
any normal greenhouse — would never have noticed any of it. Was Biosphere 2 a failure, or
an experiment that worked in the only way experiments ever really do?

(Sources are in the description. If this one deserves more reach, Hype it 🙏)

## END SCREEN
Single video element only (roughly doubles click-through vs a 4-grid), placed at the
verbal bridge at **37:06**, where the narration says: *"I made a video about whether the
sun-killing microbe in Project Hail Mary could actually exist… it is on screen now."*
Plus the subscribe element.

> ⚠ **BLOCKER:** the named video — *Hail Mary's Sun-Killing Microbe Might Be Real* — is
> rendered (repo root) but has **no published URL** in the publish log. The end-screen
> card cannot point at an unpublished video, and the bridge is spoken aloud. Either
> publish Project Hail Mary first (it is the better order anyway — the bridge then works),
> or accept an end screen with no matching card for one upload.

## HONESTY / SENSITIVITY NOTES (the film already carries these — keep them in packaging)
- **Six of the eight crew are living**, as are Margret Augustine, Mark Cooper and Steve
  Bannon. Roy Walford died in 2004; Sally Silverstone died in 2020 (do not state a cause).
- **"Cult" stays attributed, never asserted** — Cooper's 1991 Village Voice line, and
  Prance's 1983 criticism *plus* his 1991 retraction ("they are not a cult, per se").
  The film gives both; the packaging must not collapse them into a verdict.
- **The 1994 airlock opening is contested** — Alling's "emergency state / in no way was
  it sabotage" against the company's "sabotage." Both quoted, neither endorsed.
- **Criminal case disposition unknown.** No verdict, no plea, no dismissal found. Never
  imply a conviction, in the title, thumbnail, description or pinned replies.
- **The duffel bag has three incompatible accounts** (company inventory / Poynter /
  Hawthorne's AP allegation, which the company called "patently ridiculous"). All three
  are in the film. Do not pick one in the description.
- The $200M construction figure is citable (Cohen & Tilman) but genuinely disputed
  against the NYT's $150M-through-1991 — the film avoids leading on a cost number, and so
  should the packaging.
- **⛔ Two closure-day quotes circulating online are FABRICATED** — an Alling "brave new
  step" line and a Walford "labyrinth" line, both untraceable. Neither is in the film.
  Never use them in a pinned reply, a Short, or a community post.

## SOURCES (credibility + ammo for pinned replies)
- **Dempster, W.** — peer-reviewed engineering on the seal: leak rate <10%/yr, the
  19 mm-equivalent aggregate flaw across ~80 km of glazing joint and ~16 km of weld, the
  <8 Pa lung-buffered pressure differential, and the simulation showing a 1%/day leak
  would have masked the ~140 ppm/day oxygen signal entirely.
- **Severinghaus, J. P. et al.**, "Oxygen loss in Biosphere 2," *Eos* 75(3):33-37 (1994)
  — the carbon-isotope trace into the concrete; 600-750 kmol (~25 t) CO2 locked as
  calcium carbonate across 15,800 m² of exposed concrete, inner surfaces ~10× the outer.
  With **Wallace Broecker**, who put "global warming" into the literature.
- **Cohen, J. E. & Tilman, D.**, "Biosphere 2 and Biodiversity: The Lessons So Far,"
  *Science* 274:1150 (1996) — the defining critical assessment, including the
  "no demonstrated alternative to maintaining the viability of Earth" paragraph AND the
  Hubble-analogy paragraph immediately before it that almost never gets quoted.
- **Nelson, M.** — published crew accounts (hunger, the 14% oxygen "climbing a mountain
  and going nowhere," the sailors-vs-scientists split, which he deliberately declined to
  name sides in — the film honours that choice).
- **Poynter, J.** — TEDxUSC (2009) and contemporary interviews: "he couldn't add up a
  line of figures," "atomic hide and seek," "no mom, it's fine, we're not dead," the
  telephone and the hand against the glass.
- **Walford, R.** — PNAS and gerontology-journal papers on the crew as calorie-restriction
  subjects, and his own on-record "program of health enhancement" quote.
- Contemporary press: *Arizona Daily Star* (sealing day, the door that bounced),
  Associated Press (the Hawthorne allegation; the June 1996 ~$520,000 civil award),
  *Village Voice* (Cooper, 1991), *Discover* (1987), *Ecology* (1992, "New Age drivel").
- Ant survey (crazy ant >99.9% of bait-station captures by 1996) and the UA-era work:
  the Landscape Evolution Observatory ("life finds a way"), the April 2026 Mars-analogue
  grant, and the February 2026 return of 108 coral fragments to the ocean biome.

## CREDITS / ATTRIBUTION — ⚠ INCOMPLETE, MUST BE RESOLVED BEFORE UPLOAD
`find public/shorts/biosphere2 -name ATTRIBUTION.md` returns **nothing** — the media dir
holds 249 asset files (video + audio) with no machine-generated attribution log, and the
episode source that assigned them is missing. CC BY / CC BY-SA assets *require* credit in
the description.

Known-good from the locked package and the probe log (all probed 2026-09-03):
- NASA eClips, "Launchpad: NASA and Biosphere 2" — Public Domain (archive.org
  `LaunchpadNasaAndBiosphere2`). **One caveat still open:** eClips is co-produced with the
  National Institute of Aerospace. NASA-produced works are PD by default and the fetcher's
  licence filter passed it via the nasa/nasaeclips collection, but a human should confirm
  this before it carries the cold open. 2 minutes of work.
- Carol M. Highsmith / Library of Congress, *Biosphere 2, Tucson, Arizona*
  (LCCN 2010630699) — Public Domain.
- Wikimedia Commons exteriors/interiors — CC BY-SA 4.0 / CC BY 2.0 (see thumbnail assets).
- Mark Nelson's own 1993-03-18 mission-era photograph — CC BY-SA 4.0, the only free
  mission-era still that exists.

**Known limit, stated honestly:** no 1991-94 mission-era *motion* footage exists under any
free licence (verified negative against Commons, archive.org, the NASA media API and
Openverse). The film has the building in motion; it does not have the crew inside it. That
material is describable but not showable until a human clears it with the Allen-affiliated
archive holders.

**Before upload:** eyeball the film's visuals against `public/shorts/biosphere2/video/`
and write the credit lines by hand, or regenerate an ATTRIBUTION.md from the fetcher logs
if they can be recovered. Do not upload CC BY-SA visuals with no credit block.

## OPEN BLOCKERS (all of these gate publish)
1. **Thumbnails not built** — no Test & Compare possible. (ctr-engine, ~30 min)
2. **Attribution block missing** — licence obligation, not optional.
3. **End-screen target unpublished** — publish Project Hail Mary first, or ship without a
   matching card.
4. **NASA eClips PD confirmation** — 2-minute human check.
5. **Publish slot** — `docs/planning/LAUNCH-LESSONS.md` still has mindwired's row as TBD.
   publish-video refuses to invent one; ask Akshay once and record it there.
6. **No `CLAIMS-biosphere2.md` in the repo** — the fact base that is supposed to gate
   packaging does not exist here. Everything above was checked against the film's own
   narration instead, which is weaker. Worth reconstructing from the transcript before
   the pinned comment starts taking replies.
