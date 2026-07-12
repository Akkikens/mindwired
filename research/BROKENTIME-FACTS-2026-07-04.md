# Fact-Check Report: "Gravity Slows Time" (gravitational time dilation)
Research agent verification, 2026-07-04. Every claim used in
`src/viral/plans/brokentime.json` traces to this file.

## Verified claims (as used in the video)

| # | Claim | Verdict | Source |
|---|---|---|---|
| 1 | GPS: −7 μs/day (velocity) vs +45 μs/day (gravity), net +38.6 μs/day; clocks detuned before launch (10.22999999543 MHz vs 10.23 MHz). Uncorrected ≈ 10 km of **ranging** error/day (NOT "your pin drifts 10 km"). | VERIFIED (10 km framing corrected) | [Ashby, AAPT](https://www.aapt.org/doorway/tgru/articles/ashbyarticle.pdf), [Ohio State — Pogge](https://www.astronomy.ohio-state.edu/pogge.1/Ast162/Unit5/gps.html), [GPS World](https://www.gpsworld.com/inside-the-box-gps-and-relativity/) |
| 2 | NIST 2010: 33 cm height difference measurable; head ages ~90 ns more than feet over a 79-year lifetime. | VERIFIED | [NIST](https://www.nist.gov/news-events/news/2010/09/nist-clock-experiment-demonstrates-your-head-older-your-feet), Chou et al., Science 329, 1630 (2010) |
| 3 | JILA 2022: gravitational redshift resolved across ~1 mm in a strontium clock. | VERIFIED | [Bothwell et al., Nature 602, 420 (2022)](https://www.nature.com/articles/s41586-021-04349-7), [NIST](https://www.nist.gov/news-events/news/2022/02/jila-atomic-clocks-measure-einsteins-general-relativity-millimeter-scale) |
| 4 | Earth's core ~2.5 years younger than surface over 4.5 Gyr; Feynman guessed "a day or two" — wrong ~1000x, uncorrected for decades. | VERIFIED | [Uggerhøj et al. 2016, arXiv:1604.05507](https://arxiv.org/abs/1604.05507) |
| 5 | ISS: velocity effect (~−26 μs/day) dominates gravitational (~+4 μs/day) → astronauts age SLOWER. Balance flips above ~3,200 km. Scott Kelly, 340 days → ~5 ms younger than Mark (say "about 5 ms", NEVER 13 ms). | VERIFIED (direction high, exact ms medium) | [Space.com](https://www.space.com/33411-astronaut-scott-kelly-relativity-twin-brother-ages.html) |
| 6 | Moon: +56.02 μs/day vs Earth; NASA directed (Apr 2024) to build Coordinated Lunar Time. Say ~56, not 58. | VERIFIED | [NIST](https://www.nist.gov/news-events/news/2024/08/what-time-it-moon), [NASA LTC](https://www.nasa.gov/solar-system/moon/nasa-to-develop-lunar-time-standard-for-exploration-initiatives/) |
| 7 | Mars: +477 μs/day vs Earth, varying ±226 μs/day over the Martian year. | VERIFIED | [Ashby & Patla, AJ 2025](https://iopscience.iop.org/article/10.3847/1538-3881/ae0c16), [NIST](https://www.nist.gov/news-events/news/2025/12/what-time-it-mars-nist-physicists-have-answer) |
| 8 | Sun's surface: clocks ~66 s/year behind (fractional 2.12×10⁻⁶). 79-year stay ≈ ~87 min → "more than an hour". | VERIFIED | standard GR arithmetic, [Wikipedia — gravitational time dilation](https://en.wikipedia.org/wiki/Gravitational_time_dilation) |
| 9 | Sirius B (white dwarf): HST-measured gravitational redshift 80.65 ± 0.77 km/s → ~2.4 hours/year slower. | VERIFIED | [Barstow et al. 2005](https://arxiv.org/abs/astro-ph/0506600), [Joyce et al. 2018](https://arxiv.org/abs/1809.01240) |
| 10 | Neutron star surface: GR **prediction** ~25-30% slower (1.4 M☉, ~12 km). z=0.35 (Cottam 2002) never reproduced — don't cite as measurement. | VERIFIED-AS-PREDICTION | theory range, high confidence |
| 11 | S2 at Sgr A*: May 2018 pericenter, ~7,650 km/s ≈ 2.55% of c, ~120 AU, gravitational redshift confirmed (GRAVITY collab). | VERIFIED | [arXiv:1807.09409](https://arxiv.org/abs/1807.09409) |
| 12 | Interstellar's Miller's planet (1 hr = 7 yr): Kip Thorne's calc; needs spin within ~1 part in 10¹⁴ of maximal (NOT the 0.998 astrophysical limit — different number). Thorne: "possible in principle, implausible in nature." | VERIFIED (spin corrected) | Thorne, *The Science of Interstellar*; [Luminet, arXiv:1503.08305](https://arxiv.org/pdf/1503.08305) |

## DO-NOT-CLAIM (obeyed in the script)
1. ~~"Your GPS pin drifts 10 km/day"~~ → say "equal to ~10 km of ranging error per day".
2. ~~"Astronauts age faster because they're higher"~~ → on ISS velocity wins; they age slower.
3. ~~"Scott Kelly aged 13 ms less"~~ → ~5 ms.
4. ~~"Feynman said 2.5 years"~~ → Feynman guessed a day or two; 2.5 yr is Uggerhøj 2016.
5. ~~"Neutron star clocks at half speed / time stops"~~ → ~25-30% slower, prediction only.
6. ~~"Gargantua spins at 99.8% of max"~~ → 1 part in 10¹⁴ of maximal.
7. ~~"Stronger surface gravity = slower clocks"~~ → it's gravitational *potential*, not g.
8. Jupiter per-year figure — UNVERIFIABLE, CUT from the video.
9. ~~"You'd feel time slow"~~ → locally clocks always tick normally (used as the twist).
10. No year-stamping narration; LTC phrased as "NASA is building … right now".
