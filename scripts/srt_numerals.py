#!/usr/bin/env python3
"""Rewrite TTS-spelled numbers in a doc SRT into written form for viewers.

Spoken `text` fields spell numbers the way the narrator says them (lint rule,
so TTS doesn't read "737" as "seven hundred and thirty seven"); captions should
read like print. Explicit ID replacements run first (per-episode list), then a
cardinal parser rewrites runs of number words >= 11, runs of 2+ single digits
("zero one" -> 01), and ordinals ("twenty ninth" -> 29th). Words for one..ten
stay as words (print style). Operates per cue; a number split across two cues
is left alone.

Usage: python3 scripts/srt_numerals.py <in.srt> [--ids "spoken=>written" ...]
"""
import re, sys

UNITS = dict(zero=0, one=1, two=2, three=3, four=4, five=5, six=6, seven=7, eight=8, nine=9,
             ten=10, eleven=11, twelve=12, thirteen=13, fourteen=14, fifteen=15, sixteen=16,
             seventeen=17, eighteen=18, nineteen=19)
TENS = dict(twenty=20, thirty=30, forty=40, fifty=50, sixty=60, seventy=70, eighty=80, ninety=90)
ORD = dict(first=1, second=2, third=3, fourth=4, fifth=5, sixth=6, seventh=7, eighth=8, ninth=9,
           tenth=10, eleventh=11, twelfth=12, thirteenth=13, fourteenth=14, fifteenth=15,
           sixteenth=16, seventeenth=17, eighteenth=18, nineteenth=19, twentieth=20, thirtieth=30)
NUMW = set(UNITS) | set(TENS) | {"hundred", "thousand"}
SUF = lambda n: "th" if 10 <= n % 100 <= 20 else {1: "st", 2: "nd", 3: "rd"}.get(n % 10, "th")


def cardinal(ws):
    total, cur = 0, 0
    for w in ws:
        if w in UNITS: cur += UNITS[w]
        elif w in TENS: cur += TENS[w]
        elif w == "hundred": cur = (cur or 1) * 100
        elif w == "thousand": total += (cur or 1) * 1000; cur = 0
    return total + cur


def convert(line):
    toks = re.findall(r"[A-Za-z]+|[^A-Za-z]+", line)
    out, i = [], 0
    while i < len(toks):
        w = toks[i].lower()
        if w in NUMW:
            j, words, end = i, [], i
            while j < len(toks):
                lw = toks[j].lower()
                if lw in NUMW: words.append(lw); end = j
                elif lw == "and" and words and words[-1] in ("hundred", "thousand"): pass
                elif not toks[j].strip() or toks[j] == "-": pass
                else: break
                j += 1
            # trailing ordinal ("twenty ninth")
            ordv = None
            k = end + 1
            if k + 1 < len(toks) and not toks[k].strip() and toks[k + 1].lower() in ORD and words[-1] in TENS:
                ordv = ORD[toks[k + 1].lower()]; end = k + 1
            singles = all(x in UNITS and UNITS[x] <= 9 for x in words)
            if len(words) >= 2 and singles:
                rep = "".join(str(UNITS[x]) for x in words)
            else:
                n = cardinal(words) + (ordv or 0)
                if ordv: rep = f"{n}{SUF(n)}"
                elif words in (["hundred"], ["thousand"]): rep = None
                elif n > 10 or len(words) > 1:
                    rep = f"{n:,}" if n >= 1000 and not 1900 <= n <= 2099 else str(n)
                else: rep = None
            if rep is not None:
                out.append(rep); i = end + 1; continue
        out.append(toks[i]); i += 1
    return "".join(out)


def main():
    src = sys.argv[1]; ids = []
    if "--ids" in sys.argv:
        ids = [a.split("=>") for a in sys.argv[sys.argv.index("--ids") + 1:]]
    blocks = open(src, encoding="utf-8").read().split("\n\n")
    res = []
    for b in blocks:
        ls = b.split("\n")
        if len(ls) >= 3:
            t = "\n".join(ls[2:])
            for a, z in ids: t = re.sub(rf"\b{re.escape(a)}\b", z, t, flags=re.I)
            ls = ls[:2] + [convert(x) for x in t.split("\n")]
        res.append("\n".join(ls))
    open(src, "w", encoding="utf-8").write("\n\n".join(res))


if __name__ == "__main__":
    main()
