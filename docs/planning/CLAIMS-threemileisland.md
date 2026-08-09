# CLAIMS — Three Mile Island (1979 meltdown + 2024-2027 AI-datacenter restart)

**Icahn memory:** `icahn-threemileisland` (PASS-WITH-CONDITIONS, 2026-08-05,
adversarially re-checked). **Channel:** Black Box Breakdown.
**Primary exhibit document:** Report of the President's Commission on the
Accident at Three Mile Island (the "Kemeny Commission Report"), submitted
1979-10-30. Best-available full-text mirrors (no single canonical NRC/OSTI
full-text scan found — flag as best-available, not an original-agency host):
- https://dp.la/item/0634ad190865d2ae5da12ad1efe4dd41
- https://nonuclear.se/en/PresidentsCommissionThreeMileIsland197910
- OSTI contemporaneous evaluation (not the full report): https://www.osti.gov/servlets/purl/5082863

**Labels legend:** CONFIRMED / DISPUTED (both sides reported) / ALLEGED (by whom)
/ UNVERIFIED (needs a follow-up check before scripting) / EXCLUDE (do not use).
🧍 = living named person — attributed-never-asserted only.

---

## ⚠ DATA CORRECTIONS (baked in — do NOT revert)

1. **"Normalized deviance" does NOT belong to the Kemeny Commission.** That term
   is Diane Vaughan's, coined for her 1996 Challenger analysis. The Kemeny
   Report's own language is "a preoccupation... with the safety of equipment,
   resulting in the downplaying of the importance of the human element" — use
   THAT phrasing (or close paraphrase), never "normalized deviance," when
   describing Kemeny's findings on screen. (Flagged independently by the Icahn
   adversarial pass AND this session's dedicated research check — confirmed
   twice.)
2. **The real 1979 NRC control-room/emergency-audio question is UNRESOLVED —
   do not assert "actual recording" on screen without one more check.** PBS's
   *Meltdown at Three Mile Island* aired excerpts of period audio, but that
   broadcast is PBS/WGBH-copyrighted, not a public-domain original. No specific
   NARA/NRC accession number for a raw, reusable audio original was confirmed
   in this pass. **Default plan: build labeled "CVR RECREATION"-style audio
   reconstructions from documented transcript lines (e.g., Kemeny/NUREG-quoted
   phrases), not lifted PBS clips** — same honesty rule as every other Black
   Box radio scene.
3. **TMI Unit 2's exact commercial-operation date needs reconciliation before
   an on-screen date is spoken.** Multiple secondary sources point to
   1978-12-30 (which would make the accident land almost exactly one year into
   commercial operation — a strong beat if true), but this must be checked
   against NRC's own TMI-2 decommissioning page before scripting:
   https://www.nrc.gov/info-finder/decommissioning/power-reactor/three-mile-island-unit-2
4. **The "Nov 2025 $1B federal loan" and current officeholder names
   (Constellation CEO, US Energy Secretary) are UNVERIFIED in this research
   pass — re-verify before the script names them on screen** (titles/loans can
   have moved between validation and scripting).

---

## 1. Origins — the plant, before 1979

- **CONFIRMED** — Built/operated by Metropolitan Edison ("Met-Ed"), subsidiary
  of General Public Utilities (GPU) Corp. Site: Londonderry Township, Dauphin
  County, PA, on an island in the Susquehanna River, ~10 mi SE of Harrisburg.
  Reactor design: Babcock & Wilcox (B&W) pressurized water reactor, both units.
  — [Wikipedia](https://en.wikipedia.org/wiki/Three_Mile_Island_Nuclear_Generating_Station), [DOE](https://www.energy.gov/ne/articles/5-facts-know-about-three-mile-island)
- **CONFIRMED** — Unit 1 commercial operation began 1974-09-02.
- **UNVERIFIED** — Unit 2 commercial-operation date: most-supported figure is
  1978-12-30 (needs NRC decommissioning-page reconciliation — see correction #3
  above).
- **CONFIRMED (per NRC's own official history)** — 1977-09-24: Davis-Besse
  Unit 1 (Toledo Edison, OH) — same B&W design — had a near-identical
  stuck-open pilot-operated relief valve (PORV) event during a low-power
  transient. NRC's own historian (J. Samuel Walker) documents that neither B&W
  nor the NRC acted effectively to warn other operators before TMI. Label this
  **CONFIRMED, not ALLEGED** — it is the regulator's own historical finding.
  — [Jack Devanney, "The Davis Besse Warning"](https://jackdevanney.substack.com/p/the-davis-besse-warning)
- **UNVERIFIED** — Any specific "X% core-damage-probability" statistic for
  Davis-Besse — do not put a number on screen without a primary NRC ASP-program
  source.
- **CONFIRMED** — Named control-room personnel on shift March 28, 1979: shift
  supervisor **William Zewe**, shift foreman **Fred Scheimann**, operators
  **Edward Frederick** and **Craig Faust**. Cross-checked across two
  independent research passes (origins + cold-open dimensions); still flagged
  to verify against the primary Rogovin Report (NUREG/CR-1250) before scripting
  exact dialogue/attribution: https://www.ans.org/file/6647/1/NUREGCR-1250V2PT3,%20TMI,%20A%20Report%20To%20The%20Commissioners%20And%20To%20The%20Public%20(Rogovin%20Report)%20(1980-01)%20(2).pdf
- **EXCLUDE** — A "sabotage started the accident" theory surfaced in search
  (Atomic Insights). Fringe, not part of the accepted causal chain — exclude
  entirely, or if ever mentioned, attribute explicitly as a fringe theory, never
  blended into the main narrative.

## 2. The disaster — minute-by-minute + the Kemeny Report

**Cold-open anchor (verified twice, independently, across two research
passes):**
- **1979-03-28, 4:00:36 a.m.** — condensate-polisher maintenance work trips the
  first main feedwater pump feeding the steam generators. This is the accepted
  initiating event. **CONFIRMED.**
- **+2 sec** — turbine/generator auto-shutdown.
- **+8 sec** — reactor SCRAM (control rods drop).
- **+13-14 sec** — the pilot-operated relief valve (PORV) opens as designed to
  relieve rising pressure, then **sticks open** — the core mechanical fault,
  identical in kind to Davis-Besse 1977.
- **The core operator mistake (~2.5 min in):** the PORV's control-room
  indicator was a *command-state* light (showed a "close" signal had been
  sent), not a *position* light — it read "closed" while the valve was
  physically open. Reading a falsely-full pressurizer, **Edward Frederick**
  throttled back emergency core cooling (HPI) flow — the opposite of what was
  needed — while coolant actually drained out the open PORV. This is the
  single causal action that turned a manageable transient into a partial core
  meltdown. **CONFIRMED**, corroborated across NRC's own backgrounder and
  multiple secondary summaries.
- **+8 min** — **Craig Faust** discovers emergency-feedwater valves left closed
  after maintenance and reopens them.
- Result: **CONFIRMED** — partial core meltdown (~half the core damaged per
  later NRC assessment), a hydrogen bubble formed atop the reactor vessel
  (days of explosion-risk fear), radioactive noble gases (some iodine)
  intentionally vented from the auxiliary building starting March 30.
- Recommended cold-open line (Cold-open 2.0 formula): *"March 28, 1979. 4:00
  in the morning. Three Mile Island, Pennsylvania. Control room operator
  Craig Faust reaches for a switch as the first alarm cuts through the dark."*

**Named crisis-response figures (both now deceased — no defamation risk):**
- **Harold Denton**, NRC Director of Nuclear Reactor Regulation, sent by
  President Carter as his personal on-site representative; became the public
  face reassuring residents. Died 2017-02, age 80. **CONFIRMED.**
- **1979-03-30** — Governor **Dick Thornburgh**, on NRC Chairman Joseph
  Hendrie's advice, advised pregnant women/preschool children within 5 miles to
  evacuate; ~140,000 people voluntarily left the region. Thornburgh died
  2020-12-31, age 88. **CONFIRMED.**
- **1979-04-01** — President Carter (a trained nuclear engineer, ex-Navy)
  toured the TMI-2 control room with Denton and Thornburgh, 4 days after the
  accident, to calm public fear. **CONFIRMED.**

**Kemeny Commission Report — actual finding, not equipment-first:**
- **CONFIRMED** — Chaired by Dartmouth president John G. Kemeny; commission
  established by Carter 1979-04-11; report ("The Need for Change: The Legacy
  of TMI") submitted 1979-10-30.
- **CONFIRMED (paraphrase — verify exact wording against the primary DPLA scan
  before an on-screen quote)** — the Commission's central finding was NOT
  primarily equipment failure but human/organizational: inadequate operator
  training, poor control-room human-factors design (the ambiguous PORV light,
  alarm overload — over 100 alarms fired in the first minutes, more than the
  console could clearly display), and NRC regulatory-culture failure (a narrow
  focus on hardware compliance over overall safety performance). This is the
  factual backbone for the episode's real differentiated angle: putting these
  named findings on trial against the live 2026 restart paperwork.
- **DISPUTED / do not resolve on screen** — health effects: Dr. Steven Wing et
  al. (UNC-Chapel Hill), *Environmental Health Perspectives*, 1997, found
  elevated cancer rates (lung cancer, leukemia) downwind, arguing more
  radiation escaped than official estimates — **ALLEGED (Wing et al.)**.
  Countered by Maureen Hatch et al. (Columbia, 1990) and broader epidemiological
  criticism (confounding by smoking, methodology). Mainstream NRC/EPA consensus:
  official releases were too low to cause detectable health effects. **Report
  both sides, attribute both by name, never assert either as settled.**

## 3. Aftermath, legal record, and the LIVE 2026 restart

- **CONFIRMED** — TMI-2 cleanup ran ~1979-1993, cost ~$1B, involved robotic
  removal of damaged core fuel.
- **CONFIRMED** — *In re TMI Litigation*, 544 F. Supp. 853 (M.D. Pa. 1982): a
  narrow ruling that Pennsylvania/municipalities could not recover
  accident-response costs — NOT a global personal-injury settlement (broader
  personal-injury suits continued for years, largely dismissed on causation
  grounds — CONFIRMED as a separate thread, details not fully re-verified this
  pass).
- **CONFIRMED (existence); UNVERIFIED (exact findings)** — GAO Report
  EMD-80-109 and post-TMI NRC reforms (control-room redesign, operator
  training standards, the NRC resident-inspector program) — pull the exact GAO
  PDF (gao.gov/assets/emd-80-109.pdf) before quoting specific findings on
  screen.

**The live restart thread — dated, sourced, this is the currency spine:**
- **2024-09-20** — Constellation Energy announces a 20-year PPA with Microsoft
  to restart TMI Unit 1 (renamed **Crane Clean Energy Center**), ~$1.6B
  investment, full 835 MW sold to Microsoft for AI data centers. **CONFIRMED**
  — [CNBC](https://www.cnbc.com/2024/09/20/constellation-energy-to-restart-three-mile-island-and-sell-the-power-to-microsoft.html), [NPR](https://www.npr.org/2024/09/20/nx-s1-5120581/three-mile-island-nuclear-power-plant-microsoft-ai)
- Original target 2028, **accelerated to 2027** (Q3/Q4). **CONFIRMED** —
  [NRC reactor page](https://www.nrc.gov/info-finder/reactors/ccec)
- **UNVERIFIED** — the "Nov 2025 ~$1B federal loan" — not independently
  confirmed this pass; needs a DOE/loan-program primary source before scripting.
- **2026-06-08** — NRC Draft Environmental Assessment/FONSI released for
  public comment; preliminary determination = impacts "not significant."
  **CONFIRMED** — [WITF](https://www.witf.org/2026/07/28/three-mile-island-reactor-restart-progresses-through-environmental-review-public-comments/); exact ADAMS/Federal-Register citation numbers from the Icahn memo are UNVERIFIED in this pass, re-confirm the precise accession number before an on-screen citation.
- **2026-07-08** — public comment period closed. **CONFIRMED.**
- **~2026-07** — fuel-storage approval; fuel delivery proceeding toward the
  restart. **CONFIRMED directionally** — [The National](https://www.thenationalnews.com/future/technology/2026/07/13/ai-nuclear-power-three-mile-island/). TMIA director **Eric Epstein** 🧍 calls this evidence the outcome is
  predetermined — **ALLEGED (Epstein/TMIA)**, attribute by name, do not adopt
  as the episode's own conclusion.
- **Final Environmental Assessment: NOT yet published as of this research
  pass** — expected "sometime in September [2026]." **Do not assert it as
  issued** — say "expected" and give the real pending date.
- **FERC/PJM interconnection waiver granted** (~2026-06). **CONFIRMED** —
  [World Nuclear News](https://www.world-nuclear-news.org/articles/ferc-waiver-clears-way-for-crane-clean-nuclear-interconnection)
- 2027 restart timeline holding as of late July 2026 per NRC/company statements,
  though local reporting frames it as "progressing amid concern" — no confirmed
  slip. **CONFIRMED (as of this pass — re-verify at scripting time, this is a
  live, moving story).**

**🧍 Named living parties — attribute, never assert motive:**
- Constellation Energy CEO (brief says Joe Dominguez) — **UNVERIFIED current
  title**, re-confirm before air.
- Microsoft — company, safe to name as counterparty.
- US Energy Secretary (brief says Chris Wright) — **UNVERIFIED current
  officeholder**, re-confirm before air (cabinet titles change).
- **Three Mile Island Alert (TMIA)**, director **Eric Epstein** — real, active
  anti-nuclear advocacy nonprofit. Confirmed on-record quotes: called the
  licensing process "the intersection of the inane and the insane"; called the
  fuel-storage timing "a farce." **ALLEGED (Epstein/TMIA)** — quote and
  attribute exactly, never platform as the episode's own verdict.
  — https://www.tmia.com/content/tmias-oppositionfuel-storage

## 4. Archival footage plan (mandatory real-motion-footage check)

**Directly verified this session (not secondhand):** NRCgov's own YouTube video
*"Moments in NRC History: Three Mile Island - March 28, 1979"*
(https://youtu.be/SUct_69kNpQ) — confirmed via yt-dlp metadata: **license =
"Creative Commons Attribution license (reuse allowed)"**, duration 322s.
Frame-by-frame spot check (15s/60s/120s/200s/280s) confirms it is a **mix**, not
pure narrated stills: a real 1970s-look press-conference crowd shot (~60s,
genuine archival motion, not a photo), a real cooling-towers-over-a-lake shot
with boats at a marina (~280s, also genuine archival motion), plus an animated
reactor diagram (~120s) and a modern talking-head interview segment (~200s).
**This meaningfully de-risks the footage concern flagged at Icahn validation —
real, license-clear 1979-era motion footage exists in this one government
source.** Action: pull the specific archival segments (roughly the 55-70s and
270-290s windows, verify exact in/out points before the footage-fetch pass) —
do NOT use the animated-diagram or modern-interview segments as "1979 real
footage."

**Other leads (weaker, needs follow-up or is a paid fallback):**
- NARA/LOC hold **stills only** (not motion) of Carter's 1979-04-01 visit
  (NARA id 540021; LOC loc.gov/item/2005696437) — confirmed no free motion-picture
  holding found. C-SPAN's Facebook archive references a Carter-visit clip but
  that is a paid/licensed lead, not free.
- Wikimedia Commons "Category:Three Mile Island accident" returned **stills
  only**, no video file found in this pass.
- Archive.org hosts the full PBS *American Experience: Meltdown at Three Mile
  Island* documentary (archive.org/details/the-american-experience-meltdown-at-three-milse-island)
  — **PBS-copyrighted, treat as a research lead only, not a cleared source.**
- Network news (6abc/Action News 1979 coverage, AP Archive) — real footage
  almost certainly exists but is paid-licensing only; budget as a fallback, not
  a free source.
- Live 2026 restart B-roll: no specific free video URL confirmed this pass.
  **Follow-up before footage-fetch:** check Constellation Energy's own
  newsroom/YouTube and WITF's YouTube channel directly for Crane Clean Energy
  Center site B-roll.
- **Penn State "TMI-2 Recovery and Decontamination" collection** (3,700+ tapes)
  and **Dickinson College Archives** remain real, deep archives but gated
  behind multi-week institutional request processes — **open these requests
  now, in parallel with scripting**, per the Icahn deep-dive's standing flag.
  Do not treat as a fetch-and-go source.

**Net assessment:** the cold open can open on real 1979 archival motion
footage (the NRCgov CC-BY clip's press-conference segment, at minimum) rather
than falling back to a still or a dossier scene — the channel's hardest rule
(first 30-60s = real motion, no exceptions) is achievable. The deeper original
Carter-visit/control-room motion footage remains unconfirmed free and should
stay a parallel institutional-request track, not a blocking dependency for
this episode's first cut.

## 5. Sensitivity gate

- Event is 47 years old, zero confirmed direct deaths — outside the acute-grief
  window.
- Health-effects claims: DISPUTED, both sides above — never resolve on screen.
- Named living parties (Dominguez/Wright — titles UNVERIFIED, Microsoft, TMIA/
  Epstein) — factual quotes only, no motive speculation.
- Keep the restart-vs-AI-power-demand framing institutional/technical, never
  editorial for or against nuclear power.
- Do not misattribute "normalized deviance" to Kemeny (correction #1 above).
- Do not assert the PBS-aired 1979 audio as an "actual recording" without a
  further NARA/NRC accession-number check (correction #2 above) — default to
  labeled recreation.

## Gaps still open before scripting locks (do this during Step 2, not after)

1. Reconcile TMI-2's exact 1978 commercial-operation date against NRC's
   decommissioning page.
2. Verify current Constellation CEO name/title and current US Energy Secretary
   before naming either on screen.
3. ~~Confirm the exact ADAMS accession number / Federal Register citation for
   the June 2026 Draft EA~~ — **CLOSED.** Verified directly via the Federal
   Register's own API this session: Docket No. NRC-2026-0397, ADAMS accession
   ML26120A058, Federal Register Vol. 91, No. 109, June 8, 2026, p. 34658,
   document number 2026-11377. Real PDF: https://www.govinfo.gov/content/pkg/FR-2026-06-08/pdf/2026-11377.pdf
   — rendered as the `ex_nrc_ea` exhibit image.
4. Cross-check the four named 1979 control-room operators against the primary
   Rogovin Report (NUREG/CR-1250) rather than secondary narrative sources.
5. Pull exact in/out timestamps for the NRCgov video's two real-footage
   segments before footage-fetch.
