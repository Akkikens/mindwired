#!/usr/bin/env python3
"""Render CAIB Vol I pages as episode exhibits. Page is resolved by searching for
the exhibit's own key phrase, so a wrong page cite in the research cannot propagate."""
import re, subprocess, sys
from pathlib import Path

SP   = Path("/private/tmp/claude-501/-Users-akshay/c7ee7c73-f680-44fb-805e-098746dc68ec/scratchpad")
PDF  = SP/"unt_vol1.pdf"
OUT  = Path("public/shorts/columbia/images"); OUT.mkdir(parents=True, exist_ok=True)
pages=[re.sub(r"\s+"," ",p.replace("-\n","")) for p in (SP/"vol1_all.txt").read_text(errors="ignore").split("\f")]

# name -> (key phrase to locate the page, or explicit int page)
EX = {
 "ex_caib_cover":        1,
 "ex_caib_dedication":   "Jules F. Mier",
 "ex_last_words":        "cut off in mid-word",
 "ex_infamily_def":      122,
 "ex_bipod_events":      "Figure 6.1-1",
 "ex_frr_slide":         "only 3 documented",
 "ex_crater_diagram":    "Figure 6.3-1",
 "ex_camera_finding":    "improperly maintained lens",
 "ex_rocha_beg":         "petition (beg)",
 "ex_routing_finding":   "non-critical engineering desire",
 "ex_dod_cancel":        "made and rescinded within 90",
 "ex_ham_finding":       "never asked them directly",
 "ex_safety_finding":    "took no actions to obtain imagery",
 "ex_clearance_finding": "little or no knowledge",
 "ex_rocha_email":       "did not send but instead printed",
 "ex_cain_email":        "consider it to be a dead issue",
 "ex_stich_email":       "not even worth mentioning",
 "ex_daugherty_email":   "pucker strings",
 "ex_daugherty_email2":  "crossing their fingers",
 "ex_imagery_box":       "IMAGERY REQUESTS",
 "ex_denial_finding":    "counteracted the lingering",
 "ex_org_cause":         "as much to do with this accident",
 "ex_blame_warning":     "did not want to make these errors",
 "ex_burden_finding":    "inverted this burden of proof",
 "ex_ch8_title":         "History as Cause",
 "ex_ch8_conclusion":    "have not been fixed",
 "ex_ch8_parallel":      "cold tem",
 "ex_caib_staff":        "Vaughan, Ph.D.",
 "ex_recommendations":   225,
}
MIN_PAGE = {"ex_org_cause":170, "ex_ch8_title":193, "ex_ch8_parallel":200, "ex_caib_staff":240,
            "ex_denial_finding":70, "ex_last_words":40}

resolved, missing = {}, []
for name, probe in EX.items():
    if isinstance(probe,int): resolved[name]=probe; continue
    lo = MIN_PAGE.get(name,1)
    hits=[i+1 for i,p in enumerate(pages) if i+1>=lo and probe.lower() in p.lower()]
    if hits: resolved[name]=hits[0]
    else: missing.append((name,probe))

for name,pg in sorted(resolved.items(), key=lambda kv: kv[1]):
    dest = OUT/name
    subprocess.run(["pdftoppm","-png","-r","150","-f",str(pg),"-l",str(pg),str(PDF),str(dest)],check=True)
    # pdftoppm appends -NNN; normalise
    for f in OUT.glob(f"{name}-*.png"): f.rename(OUT/f"{name}.png")
    print(f"  p.{pg:3d}  {name}.png")
print(f"\nrendered {len(resolved)}")
if missing:
    print("*** UNRESOLVED (no page matched the probe) ***")
    for n,p in missing: print(f"   {n}  <- {p!r}")
