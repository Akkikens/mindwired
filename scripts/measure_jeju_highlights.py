#!/usr/bin/env python3
"""Measure a highlight rect for every Jeju exhibit scene.

Rather than trusting my page assignment, each phrase is searched across ALL
candidate pages and lands on whichever one actually contains it — the img is
corrected to match. A rect is also ExhibitScene's zoom target, so a scene
without one renders the page full-frame and unreadable.
"""
import json, sys, pathlib
sys.path.insert(0, "/private/tmp/claude-501/-Users-akshay/7bcb3701-c584-4294-8d62-6078f2362210/scratchpad/hl")
from match import words, rect, norm

S = "/private/tmp/claude-501/-Users-akshay/7bcb3701-c584-4294-8d62-6078f2362210/scratchpad/jeju"
PAGES = {f"ex_araib_p{p}": (f"{S}/araib_prelim.pdf", p) for p in range(1, 7)}
PAGES["ex_faa_frangible"] = (f"{S}/faa_ac.pdf", 20)
PAGES["ex_faa_rsa"] = (f"{S}/faa_ac.pdf", 23)

# scene id -> the sentence the narration is pointing at
PHRASE = {
 "a1_1":  "Accident Number: AAR2404",
 "a1_3":  "first delivered to Ryanair on September 4, 2009",
 "a1_5":  "Injury total: 179 Fatal",
 "a1_7":  "Total Flight Hours 6,823 hrs",
 "a1_8":  "Wind from 110",
 "a1_10": "HL8088 first communicated for landing with the air traffic control tower",
 "a1_11": "advised the airplane at 08:57:50 to be cautious of bird activity",
 "a2_2":  "The pilots identified a group of birds while approaching runway 01",
 "a2_3":  "feathers and bird blood stains were found on each",
 "a3_2":  "both recordings stopped at 08:58:50",
 "a3_3":  "the last 00:04:07 recordings were missing",
 "a3_4":  "161 kts and 498 ft",
 "a3_6":  "made an emergency declaration",
 "a4_2":  "it turned right and approached runway 19",
 "a5_5":  "Both engines were buried in the embankment",
 "a5_6":  "the fore fuselage scattered up to 30-200 meters",
 "a9_10": "investigate the embankment, localizers, and bird strike evidence",
 "a9_11": "Bureau d'Enquetes et d'Analyses pour la Securite de l'Aviation Civile",
 "c3":    "the last 00:04:07 recordings were missing",
 "a6_2":  "Frangible. Retains its structural integrity",
 "a6_3":  "Retains its structural integrity and stiffness up to a designated maximum load",
 "a6_4":  "breaks, distorts, or yields in such a manner as to present the minimum hazard",
 "c5":    "present the minimum hazard to aircraft",
 "c11":   "Retains its structural integrity and stiffness",
 "a6_12": "Runway Safety Area (RSA). A defined surface surrounding the runway",
 "a6_13": "prepared or suitable for reducing the risk of damage to aircraft in the event of an undershoot",
 "a6_14": "in the event of an undershoot, overshoot, or excursion from the runway",
}

def locate(ws, pw, ph, phrase):
    page = [norm(w[4]) for w in ws]
    tgt = [norm(t) for t in phrase.split() if norm(t)]
    if not tgt: return None
    def eq(a, b): return bool(a) and (b in a or a in b)
    best = None
    for s0 in range(len(page)):
        if not eq(page[s0], tgt[0]): continue
        j, k, h = s0, 0, 0
        while j < len(page) and k < len(tgt):
            if eq(page[j], tgt[k]): h += 1; k += 1; j += 1
            elif h and (j - s0) > len(tgt) + 6: break
            else: j += 1
        if h >= max(2, int(len(tgt) * 0.7)):
            s = h / len(tgt)
            if best is None or s > best[0]: best = (s, s0, j)
    if not best: return None
    s, a0, b0 = best
    ys = [(w[1] + w[3]) / 2 for w in ws]; tol = 0.006 * ph
    a, b = a0, b0
    while a - 1 >= 0 and abs(ys[a-1] - ys[a]) < tol: a -= 1
    while b < len(ws) and abs(ys[b] - ys[b-1]) < tol: b += 1
    r = rect(ws, a, b - a, pw, ph)
    # Completing the boundary lines normally tightens the band. On a densely set
    # page (the METAR table) it instead swallows the line above, which drops the
    # zoom below readable. If that happens, keep the raw matched span.
    if r[3] > 0.09:
        r2 = rect(ws, a0, b0 - a0, pw, ph)
        if r2[3] < r[3]: a, b, r = a0, b0, r2
    return r, round(s, 2), " ".join(w[4] for w in ws[a:b])

cache = {k: words(*v) for k, v in PAGES.items()}
p = pathlib.Path("src/mindwired-doc/docs/jeju2216.json")
doc = json.loads(p.read_text())
fails, moved = [], []
for sc in doc["scenes"]:
    if not sc.get("exhibit"): continue
    i = sc["id"]
    if i not in PHRASE: fails.append((i, "no phrase")); continue
    hits = []
    for key, (ws, pw, ph) in cache.items():
        got = locate(ws, pw, ph, PHRASE[i])
        if got: hits.append((got[1], key, got[0], got[2]))
    if not hits: fails.append((i, f"NOT FOUND: {PHRASE[i][:45]}")); continue
    hits.sort(reverse=True)
    score, key, r, snip = hits[0]
    if key != sc["img"]: moved.append((i, sc["img"], key)); sc["img"] = key
    sc["highlight"] = r
    zoom = min(3.6, max(1.15, 0.30 / max(r[3] * 0.88, 0.001)))
    print(f"{i:<7} {key:<18} sc={score} h={r[3]:.4f} zoom={zoom:.2f}x  {snip[:72]}")
if moved:
    print("\nPAGE CORRECTED (my assignment was wrong):")
    for i, a, b in moved: print(f"   {i}: {a} -> {b}")
if fails:
    print("\n!! UNRESOLVED:")
    for f in fails: print("   ", f[0], f[1])
p.write_text(json.dumps(doc, indent=1, ensure_ascii=False) + "\n")
ex = [s for s in doc["scenes"] if s.get("exhibit")]
print(f"\nexhibit scenes {len(ex)}  with highlight {sum(1 for s in ex if s.get('highlight'))}")
