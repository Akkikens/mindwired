#!/usr/bin/env python3
"""Find a phrase on a rendered PDF page and return its rect as page fractions.

Uses pdftotext -bbox word coordinates, so the rect lands on the actual glyphs
instead of being eyeballed. Returns [x, y, w, h] in the 0-1 space DocWide's
`highlight` field expects.
"""
import re, subprocess, sys, unicodedata

def words(pdf, page):
    xml = subprocess.run(["pdftotext","-bbox","-f",str(page),"-l",str(page),pdf,"-"],
                         capture_output=True, text=True).stdout
    pw = float(re.search(r'width="([0-9.]+)"', xml).group(1))
    ph = float(re.search(r'height="([0-9.]+)"', xml).group(1))
    out = []
    for m in re.finditer(r'<word xMin="([0-9.]+)" yMin="([0-9.]+)" xMax="([0-9.]+)" yMax="([0-9.]+)">(.*?)</word>', xml):
        x0,y0,x1,y1,w = float(m.group(1)),float(m.group(2)),float(m.group(3)),float(m.group(4)),m.group(5)
        out.append((x0,y0,x1,y1,w))
    return out, pw, ph

def norm(s):
    s = unicodedata.normalize("NFKD", s).lower()
    return "".join(c for c in s if c.isalnum())

def locate(pdf, page, phrase, pad=0.004):
    ws, pw, ph = words(pdf, page)
    target = [norm(t) for t in phrase.split() if norm(t)]
    if not target: return None
    n = len(ws)
    best = None
    for i in range(n):
        j, k, hits = i, 0, 0
        while j < n and k < len(target):
            if norm(ws[j][4]) and target[k] in norm(ws[j][4]) or norm(ws[j][4]) in target[k]:
                hits += 1; k += 1
            elif hits: break
            j += 1
        if hits >= max(2, int(len(target)*0.6)):
            span = ws[i:j]
            if not span: continue
            score = hits/len(target)
            if best is None or score > best[0]:
                best = (score, span)
    if not best: return None
    span = best[1]
    x0 = min(w[0] for w in span)/pw; x1 = max(w[2] for w in span)/pw
    y0 = min(w[1] for w in span)/ph; y1 = max(w[3] for w in span)/ph
    return [round(max(0,x0-pad),4), round(max(0,y0-pad),4),
            round(min(1,x1-x0+2*pad),4), round(min(1,y1-y0+2*pad),4)], round(best[0],2)

if __name__ == "__main__":
    pdf, page, phrase = sys.argv[1], int(sys.argv[2]), sys.argv[3]
    r = locate(pdf, page, phrase)
    print(r if r else "NOT FOUND")
