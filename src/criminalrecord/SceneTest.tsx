/** Reference comps for the Criminal Record evidence-animation layer — the
 *  same role RadioTest plays for Black Box's radio scenes. Data here is real,
 *  taken from docs/planning/CLAIMS-idahomurders.md, so the preview shows what
 *  an actual episode beat looks like rather than lorem filler.
 *
 *  Render stills:  npx remotion still CRTimelineTest out/qa/cr_timeline.png --frame=110
 */
import React from "react";
import { CaseTimeline, GenealogyTree, RouteMap } from "./RecordScenes";

const ACCENT = "#7FB4FF";
const DUR = 150;

/** The documented chronology of that morning — every time from the record. */
export const CRTimelineTest: React.FC = () => (
  <CaseTimeline
    accent={ACCENT}
    sceneDur={DUR}
    title="From the record · November 13, 2022"
    marks={[
      { at: "4:00 a.m.", label: "A housemate wakes to sounds upstairs" },
      { at: "4:19–4:32", label: "Calls and texts to the victims go unanswered" },
      { at: "10:23 a.m.", label: "The roommates text again" },
      { at: "11:58 a.m.", label: "911 is called", emphasis: true },
    ]}
    cap="Nearly eight hours passed between the first sounds and the 911 call."
  />
);

/** The vehicle movements described in the probable-cause affidavit. */
export const CRRouteTest: React.FC = () => (
  <RouteMap
    accent={ACCENT}
    sceneDur={DUR}
    title="Vehicle movements in the affidavit"
    points={[
      { x: 0.22, y: 0.44, label: "Pullman, WA area", at: "2:44 a.m." },
      { x: 0.52, y: 0.62, label: "Moscow, ID" },
      { x: 0.80, y: 0.40, label: "Back near WSU", at: "5:25 a.m." },
    ]}
    cap="A white 2015 Hyundai Elantra, out and back, inside three hours."
  />
);

/** How investigative genetic genealogy actually works. */
export const CRTreeTest: React.FC = () => (
  <GenealogyTree
    accent={ACCENT}
    sceneDur={DUR}
    title="Investigative genetic genealogy"
    rows={[
      ["Unknown male DNA on the sheath snap"],
      ["Distant relative", "Distant relative", "Distant relative"],
      ["Family branch", "Family branch"],
      ["One household"],
    ]}
    cap="No database had him. It had his relatives."
  />
);
