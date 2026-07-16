# METADATA — The Cosmonauts the Soviets Erased From History (lostcosmonauts)

**Channel:** mindwired · **File:** `mindwired_lostcosmonauts.mp4` · **Comp:** `LostCosmonautsDoc`
**Icahn validation:** see memory `icahn-lost-cosmonauts` (RetroGamingNow 1.5M off-niche, Joe Scott 2.1M, BE AMAZED 6.4M adjacent; differentiation = ranked "erased men" + honest radio recreations).

## Title

**PRIMARY:** The Lost Cosmonauts the USSR Pretended Never Existed
  (Akshay's title, 2026-07-14 — carries the niche's exact search keyword "Lost
  Cosmonauts" → search + suggested-rail placement next to the 1.5M/2.1M outliers.)
- **ALT A (claim-led):** The Cosmonauts the Soviets Erased From History
- **ALT B (woman-led, question form — honest):** Did a Woman Die in Space Before Tereshkova?
- **ALT C (audio-led):** The Recording a Dying Cosmonaut Left Behind

Use YouTube Test & Compare with all three thumbnails/titles once eligible; ALT A pairs
best with the stamp/crew imagery, ALT B with the waveform concept.

## Thumbnail

`out/thumbs/lostcosmonauts_thumb.png` — the REAL May 1961 first-cosmonaut-group
photograph (CC BY 4.0, Commons), one standing figure scratched into black void,
yellow "ERASED." lower-left. Squint-tested at 170px. Honest: the video is literally
about men removed from photographs like this one.

## Description

```
Six men the Soviet space program erased — and one woman who may never have existed at all.

A Marshal vaporized beside his own missile — reported as a plane crash. A 24-year-old cosmonaut who burned alive in a training chamber, 20 days before Gagarin flew — his file sealed for 25 years. Gagarin's own second backup, airbrushed out of the photographs so completely that when he told the truth, nobody believed him. And two disasters so public the USSR couldn't hide the bodies — so it hid the reasons instead.

Then there are the tapes. In 1961, two brothers in Turin, Italy — the Judica-Cordiglia brothers — claimed their homemade listening station "Torre Bert" intercepted transmissions from Soviet missions that officially never existed: an SOS in Morse code, a dying heartbeat, and a woman's voice reporting flames on re-entry, two years before Valentina Tereshkova became the first woman in space. The radio segments in this video are RECREATIONS of what the brothers logged — clearly labeled on screen — because unlike the missions, the controversy is real, and it has never fully died.

This is the complete story of the erased men of the Soviet space program: what is proven, what was buried, and what is still argued over 60 years later.

CHAPTERS
0:00 — The voice from the static
1:19 — Erasure No. 1: The day the steppe burned (Nedelin, 1960)
4:15 — Erasure No. 2: The fire nobody was told about (Bondarenko, 1961)
6:51 — Erasure No. 3: The man scratched out of the picture (Nelyubov)
9:57 — Erasure No. 4: The one they could not hide (Komarov, Soyuz 1)
13:24 — Erasure No. 5: Three men who never woke up (Soyuz 11)
15:46 — Erasure No. 6: The voices on the tapes (Torre Bert)
18:50 — What came back with glasnost

All photographs are archival, from public collections (Wikimedia Commons / NASA / museum archives); full attribution below. Radio audio is voice-acted recreation based on published intercept logs — labeled as such on screen. No leaked or misattributed audio is used.

Sources include: declassified Soviet-era records reported after 1989, NASA history archives, RussianSpaceWeb, and published histories of the Soviet space program.

▶ MORE FROM MINDWIRED
Every Way Space Has Killed a Human — [paste URL]
The Scariest Places in the Known Universe — [paste URL]
Stranded on the Moon: the speech Nixon never gave — [paste URL]
Full playlist: [paste playlist URL]
Subscribe: https://www.youtube.com/@mindwired?sub_confirmation=1

#LostCosmonauts #SpaceHistory #SovietUnion
```

(Timestamps computed from the final manifest — video runs 20:37 + 17.6s outro ≈ 20:55.
First three hashtags display above the title.)

## Chapters timestamp script

```python
# run after manifest exists
import json
m=json.load(open('src/mindwired-doc/docs/lostcosmonauts.manifest.json'))
d=json.load(open('src/mindwired-doc/docs/lostcosmonauts.json'))
LEAD,HOLD=10,24; f=0
marks={'h1':'The voice from the static','c1_t':'Erasure No. 1: The day the steppe burned','c2_t':'Erasure No. 2: The fire nobody was told about','c3_t':'Erasure No. 3: The man scratched out of the picture','c4_t':'Erasure No. 4: The one they could not hide','c5_t':'Erasure No. 5: Three men who never woke up','c6_t':'Erasure No. 6: The voices on the tapes','e1':'What came back with glasnost'}
for s in d['scenes']:
    if s['id'] in marks:
        t=f//30; print(f"{t//60}:{t%60:02d} — {marks[s['id']]}")
    f+=LEAD+round(m['clips'][s['id']]['dur']*30)+HOLD
```

## Tags (476 chars, 31 tags)

```
lost cosmonauts,phantom cosmonauts,judica cordiglia,torre bert,lost female cosmonaut,female cosmonaut recording,soviet space program,nedelin catastrophe,valentin bondarenko,grigori nelyubov,vladimir komarov,soyuz 1,soyuz 11,salyut 1,yuri gagarin,space race,cold war,erased from history,space documentary,space disasters,cosmonaut deaths,soviet cover up,dead cosmonauts,first man in space,russian space program,baikonur,vostok program,space mysteries,declassified,glasnost,ussr
```

## Hashtags (15)

#LostCosmonauts #SpaceHistory #SovietUnion #SpaceRace #Cosmonaut #ColdWar #Gagarin #SpaceDocumentary #Komarov #Soyuz #NASA #SpaceMystery #Declassified #USSR #Mindwired

## Pinned comment

```
The question everyone asks first: was the woman on the tape real? Honest answer — almost certainly not (her story is chapter 6, including WHY experts doubt the recordings). But here's the strangest part of researching this: every "debunking" of the lost cosmonauts has to begin by admitting the USSR really did erase dead spacemen — just not these ones. Which erasure shocked you most? (And before anyone asks — the radio audio is a labeled recreation of the Torre Bert logs; her voice is an actress. The original nine recordings are still with the brothers' archive in Italy.)
```

## Category / license

Category: Science & Technology · License: Standard YouTube License
Not made for kids. Contains discussion of death — keep monetization-safe framing (no gore imagery; archival photos only).

## Attribution

Paste `public/shorts/lostcosmonauts/images/ATTRIBUTION.md` (CC-BY items) into the
description below the MORE FROM block, or link a pinned attribution comment if over
the 5000-char description limit.

---

# SHORTS FUNNEL (4 Shorts — drip 1/day, each pins a comment linking the long-form)

All four end with a soft CTA to the channel; pin the long-form link on each the moment
it's live. Files: `out/mindwired_short_<slug>.mp4`. Drop order below = strongest first.

## Short 1 — erasedman (drop day 1)
**Title:** The USSR Deleted This Man While He Was Still Alive
**Search cluster:** grigori nelyubov / airbrushed cosmonaut / soviet photo erased / gagarin backup
**Description:** He was 3rd in line to be the first human in space. Then the USSR erased him from every photograph — while he was alive to watch it happen. Full story of all 6 erased cosmonauts on the channel. #LostCosmonauts #SpaceHistory #Shorts
**Pinned:** The full documentary — "The Cosmonauts the Soviets Erased From History" (all 6 erasures, including the tape at the end) → [long-form URL]

## Short 2 — womantape (drop day 2)
**Title:** The Woman Who Burned Up in Space — Who Never Existed
**Search cluster:** lost female cosmonaut / judica cordiglia recording / torre bert / woman lost in space 1961
**Description:** In 1961 two Italian brothers recorded a woman dying in orbit — two years before the first woman officially flew. Moscow said she never existed. The problem: the USSR really was hiding dead spacemen. Full story on the channel. #LostCosmonauts #SpaceMystery #Shorts
**Pinned:** Was she real? Honest answer in the full video (chapter 6) — "The Cosmonauts the Soviets Erased From History" → [long-form URL]

## Short 3 — marshalchair (drop day 3)
**Title:** He Sat in a Chair Next to a Fueled ICBM
**Search cluster:** nedelin catastrophe / r-16 disaster / worst rocket disaster / soviet missile explosion 1960
**Description:** A Soviet Marshal brought a CHAIR to a leaking, fully-fueled ICBM to prove it was safe. 78+ men never came home, and Moscow called it a plane crash — for 29 years. Full story on the channel. #SpaceHistory #ColdWar #Shorts
**Pinned:** This was only Erasure No.1. All six → "The Cosmonauts the Soviets Erased From History" → [long-form URL]

## Short 4 — landeddead (drop day 4)
**Title:** The Only 3 Humans Who Died in Space Landed Perfectly
**Search cluster:** soyuz 11 / only people who died in space / cosmonauts found dead / salyut 1 crew
**Description:** Retrofire clean. Chute open. Textbook landing. Rescue crews opened the hatch and found all three cosmonauts calm, composed, and dead. One valve, 168 km up. Full story on the channel. #Soyuz11 #SpaceHistory #Shorts
**Pinned:** Why no cosmonaut has flown without a pressure suit since 1971 — full video → [long-form URL]

**Loop note:** each Short's last frame returns to its hook image (erasedman: group photo ↔ portrait; womantape: same tape machine) — built for replay.
**Track:** subs gained + long-form CTR from each Short, not raw views. Whichever beat pops, that's the next long-form topic signal (Icahn loop).
