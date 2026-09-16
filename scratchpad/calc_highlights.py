#!/usr/bin/env python3
"""Compute exhibit highlight rects from the PDF's own word bounding boxes."""
import re, subprocess, json, html
from pathlib import Path
SP=Path("/private/tmp/claude-501/-Users-akshay/c7ee7c73-f680-44fb-805e-098746dc68ec/scratchpad")
PDF=SP/"unt_vol1.pdf"

# exhibit -> (pdf page, phrase to box)
TARGETS = {
 "ex_rocha_email":       (157, "Remember the NASA safety posters everywhere around stating"),
 "ex_rocha_beg":         (152, "Can we petition (beg) for outside agency assistance"),
 "ex_dod_cancel":        (153, "both made and rescinded within 90 minutes"),
 "ex_ham_finding":       (153, "she never asked them directly if the request was theirs"),
 "ex_safety_finding":    (153, "safety personnel took no actions to obtain imagery"),
 "ex_clearance_finding": (154, "based on little or no knowledge"),
 "ex_cain_email":        (158, "I consider it to be a dead issue"),
 "ex_stich_email":       (159, "absolutely no concern for entry"),
 "ex_daugherty_email":   (164, "I would bail out before I would let a loved one land like that"),
 "ex_daugherty_email2":  (165, "crossing their fingers and hoping for the best"),
 "ex_routing_finding":   (152, "non-critical engineering desire"),
 "ex_camera_finding":    (140, "improperly maintained lens"),
 "ex_frr_slide":         (125, "only 3 documented instances"),
 "ex_burden_finding":    (190, "NASA inverted this burden of proof"),
 "ex_org_cause":         (177, "as much to do with this accident as the External Tank foam"),
 "ex_blame_warning":     (177, "The Board did not want to make these errors"),
 "ex_ch8_conclusion":    (195, "have not been fixed"),
 "ex_ch8_parallel":      (202, "the foam strike was not a problem"),
 "ex_caib_staff":        (244, "Diane Vaughan, Ph.D."),
 "ex_denial_finding":    (83,  "counteracted the lingering denial"),
 "ex_last_words":        (43,  "cut off in mid-word"),
 "ex_caib_dedication":   (3,   "Jules F. Mier, Jr."),
}
out={}
for name,(pg,phrase) in TARGETS.items():
    xml=subprocess.run(["pdftotext","-bbox","-f",str(pg),"-l",str(pg),str(PDF),"-"],
                       capture_output=True,text=True).stdout
    pw=float(re.search(r'width="([\d.]+)"',xml).group(1)); ph=float(re.search(r'height="([\d.]+)"',xml).group(1))
    words=[(float(m.group(1)),float(m.group(2)),float(m.group(3)),float(m.group(4)),
            html.unescape(m.group(5)))
           for m in re.finditer(r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">(.*?)</word>',xml)]
    def norm(s): return re.sub(r"[^a-z0-9]","",s.lower())
    tgt=[norm(w) for w in phrase.split() if norm(w)]
    seq=[norm(w[4]) for w in words]
    hit=None
    for i in range(len(seq)-len(tgt)+1):
        if seq[i:i+len(tgt)]==tgt: hit=(i,i+len(tgt)); break
    if not hit:  # fall back: first+last anchor word
        try:
            i=seq.index(tgt[0]); j=seq.index(tgt[-1],i)
            if j-i < len(tgt)+14: hit=(i,j+1)
        except ValueError: pass
    if not hit: out[name]=None; print(f"  {name:24} p.{pg:3d}  *** phrase not boxed ***"); continue
    ws=words[hit[0]:hit[1]]
    x0=min(w[0] for w in ws); x1=max(w[2] for w in ws)
    y0=min(w[1] for w in ws); y1=max(w[3] for w in ws)
    pad=3.0
    rect=[round(max(0,(x0-pad))/pw,4), round(max(0,(y0-pad))/ph,4),
          round(min(pw,(x1+pad-x0+pad))/pw,4), round(min(ph,(y1+pad-y0+pad))/ph,4)]
    out[name]=rect
    print(f"  {name:24} p.{pg:3d}  {rect}   \"{phrase[:42]}\"")
json.dump(out,open("scratchpad/highlights.json","w"),indent=1)
print(f"\nboxed {sum(1 for v in out.values() if v)}/{len(TARGETS)}")
