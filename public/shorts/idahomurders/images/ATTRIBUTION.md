# ATTRIBUTION — idahomurders (Criminal Record launch episode)

Every image in this directory is a page rendered from ONE real public court
record. There is no AI-generated imagery in this episode, no stock photography,
and no crime-scene material of any kind.

## Source document
**Probable cause affidavit, State of Idaho v. Bryan C. Kohberger** — Moscow
Police Department, Latah County, Idaho. 19 pages, unsealed January 2023. A
public court record.

- Retrieved 2026-08-03 from DocumentCloud (the copy published by news
  organisations when the affidavit was unsealed):
  https://www.documentcloud.org/documents/23564645-kohberger-moscow-pd-probable-cause-affidavit/
- Local master: `../exhibits_src/affidavit.pdf` (4.8 MB) with the OCR text
  extract at `../exhibits_src/affidavit.txt`, used to grep-verify every quoted
  passage before scripting.
- Rendered to PNG with `pdftoppm -r 200 -png` — no generative step, no retouching.

## Page map (exhibit scenes — the highlight coordinates target these passages)
| File | Affidavit page | Passage it actually contains |
|---|---|---|
| `ex_affidavit_sheath_1.png` | p. 3 | "a tan leather knife sheath laying on the bed next to Mogen's right side"; "Ka-Bar"; DNA on the button snap |
| `ex_affidavit_p1_1.png` | p. 5 | D.M.'s account — the 4:17 a.m. neighbouring-camera audio, the figure "clad in black clothing and a mask", the "frozen shock phase" quote |
| `ex_affidavit_car_1.png` | p. 9 | The white Elantra observed at approximately 2:44 a.m. and 5:25 a.m. |
| `ex_affidavit_phone_1.png` | p. 17 | The 8458 phone near King Road "on at least twelve occasions prior to November 13, 2022" |
| `ex_affidavit_dna_1.png` | p. 19 | The trash-comparison result — "identified a male as not being excluded" as the biological father of the suspect profile |


## Machine-readable log (one line per file — the format audit_scene_relevance.py parses)
- `ex_affidavit_sheath_1.png` — "Probable cause affidavit, State of Idaho v. Kohberger, p.3 — tan leather Ka-Bar knife sheath, DNA on the button snap" — public court record — https://www.documentcloud.org/documents/23564645-kohberger-moscow-pd-probable-cause-affidavit/
- `ex_affidavit_p1_1.png` — "Probable cause affidavit p.5 — D.M. account, masked figure clad in black, frozen shock phase, 4:17 a.m. camera audio" — public court record — https://www.documentcloud.org/documents/23564645-kohberger-moscow-pd-probable-cause-affidavit/
- `ex_affidavit_car_1.png` — "Probable cause affidavit p.9 — white Hyundai Elantra observed 2:44 a.m. and 5:25 a.m., Moscow Idaho and WSU Pullman" — public court record — https://www.documentcloud.org/documents/23564645-kohberger-moscow-pd-probable-cause-affidavit/
- `ex_affidavit_phone_1.png` — "Probable cause affidavit p.17 — phone near King Road on at least twelve occasions prior to November 13 2022" — public court record — https://www.documentcloud.org/documents/23564645-kohberger-moscow-pd-probable-cause-affidavit/
- `ex_affidavit_dna_1.png` — "Probable cause affidavit p.19 — Pennsylvania trash DNA comparison, male not being excluded as biological father of the suspect profile" — public court record — https://www.documentcloud.org/documents/23564645-kohberger-moscow-pd-probable-cause-affidavit/
- `ex_docpage_1/2/3/4/5/6/7/8/9/10/11/12/13/14.png` — "Probable cause affidavit, State of Idaho v. Kohberger — additional pages (2, 4, 7, 11, 14, 16, 18, 1, 6, 8, 10, 12, 13, 15) used as dimmed document texture behind chapter and record cards, never as a cited exhibit" — public court record — https://www.documentcloud.org/documents/23564645-kohberger-moscow-pd-probable-cause-affidavit/

## Texture pool (non-exhibit scenes)
`ex_docpage_1.png` … `ex_docpage_14.png` — affidavit pages 2, 4, 7, 11, 14, 16, 18,
1, 6, 8, 10, 12, 13 and 15 respectively (fourteen distinct pages, so no single
page carries more than ~3 scenes). These carry chapter cards and kinetic beats as dimmed,
blurred document texture so no scene is a bare black card. They are never
presented as a specific cited exhibit; only `exhibit: true` scenes carry a
citation lower-third, and those use the mapped pages above.

## Deliberately NOT used
- No crime-scene photographs, no victim photographs, no autopsy material.
- No photographs of Moscow, Idaho: Wikimedia Commons holds only 1908–1945
  imagery of the town, and using a 1913 photograph for a 2022 case would be
  misleading. Probed 2026-08-03.
- No court or news footage: not public domain, and licensing wasn't in scope for
  the launch episode. See `docs/planning/CLAIMS-idahomurders.md`.

## Still to pull (these would upgrade attributed record cards into real exhibits)
The plea agreement (July 2, 2025), the judgment of conviction (July 23, 2025),
and the hand-written petition for post-conviction relief (filed July 27, 2026).
Until they're in hand, those beats state the record in on-screen text with an
attribution line and show no document — never a stand-in page passed off as the
filing being discussed.
