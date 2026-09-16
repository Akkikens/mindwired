#!/usr/bin/env python3
"""Fetch specific DVIDS assets BY ID - no keyword search, no guessing.

Why this exists: keyword search against generic stock sources cannot depict a
specific historical event. On sept11timeline it returned a cloth-physics
"simulation" for the WTC collapse simulation query and the US Treasury Building
for "Pentagon", because the relevance check scores files against the QUERY
STRING and those files genuinely match the words. The fix is to name the exact
federal asset you want and fetch it by its DVIDS id.

Every DVIDS asset is a US Government work, public domain under 17 U.S.C. 105.
Usage: fetch_dvids_ids.py <slug> [--dry-run]
"""
import json, os, re, subprocess, sys, urllib.request, urllib.parse
from pathlib import Path

SLUG = sys.argv[1] if len(sys.argv) > 1 else "sept11timeline"
DRY = "--dry-run" in sys.argv

# prefix -> [(dvids_id, why_this_clip)]
WANT = {
 "ops_floor": [
   ("873438", "Western Air Defense Sector Operations Floor - the room, dark, scopes lit"),
   ("873403", "NORAD and USNORTHCOM Joint Operations Center"),
   ("913487", "Eastern Air Defense Sector, Rome NY - 'The Sector' Ep.1 (NEADS' own successor unit)"),
 ],
 "radar_scope": [
   ("916535", "Liberty Wing radar approach control - daily operations"),
   ("916539", "Liberty Wing radar approach control - b-roll"),
 ],
 "atc_center": [
   ("415647", "B-roll: air traffic control Marines running flight tower / radar room"),
   ("966382", "Air traffic control tower operations"),
   ("840375", "Whiteman AFB air traffic control tower b-roll"),
 ],
 "fighter_scramble": [
   ("737138", "'Scramble!' - 125th Fighter Wing Alert Detachment, Homestead ARB"),
 ],
 "fema_groundzero": [
   ("734981", "FEMA Ground Zero Timeline Compilation - 30:35 of real PD 2001 footage"),
 ],
}

key = None
for line in open(".env", encoding="utf-8"):
    if line.startswith("DVIDS_API_KEY="):
        key = line.split("=", 1)[1].strip().strip('"').strip("'")
if not key:
    sys.exit("no DVIDS_API_KEY in .env")

outdir = Path(f"public/shorts/{SLUG}/video"); outdir.mkdir(parents=True, exist_ok=True)
att = outdir / "ATTRIBUTION.md"
rows, failures = [], []

def api(aid):
    u = f"https://api.dvidshub.net/asset?api_key={key}&id=video:{aid}"
    with urllib.request.urlopen(u, timeout=60) as r:
        return json.load(r)["results"]

for prefix, items in WANT.items():
    for n, (aid, why) in enumerate(items, 1):
        dest = outdir / f"{prefix}_{n}.mp4"
        try:
            a = api(aid)
        except Exception as e:
            failures.append((aid, prefix, f"API error: {e}")); print(f"!! {aid} API FAILED: {e}"); continue
        files = [f for f in a.get("files", []) if f.get("type") == "video/mp4"]
        if not files:
            failures.append((aid, prefix, "no mp4 in asset")); print(f"!! {aid} no mp4"); continue
        # prefer the largest <=1080p (we upscale in the render, not here)
        files.sort(key=lambda f: (f.get("height") or 0, f.get("size") or 0))
        pick = [f for f in files if (f.get("height") or 0) <= 1080][-1]
        title, credit = a.get("title", ""), a.get("description", "")
        print(f"-> {dest.name}  [{aid}] {title}  ({a.get('duration')}s, {pick['width']}x{pick['height']})")
        print(f"     why: {why}")
        rows.append((dest.name, aid, title, credit, a.get("url", ""), why, a.get("duration")))
        if DRY: continue
        tmp = dest.with_suffix(".src.mp4")
        try:
            urllib.request.urlretrieve(pick["src"], tmp)
            subprocess.run(["ffmpeg","-y","-v","error","-i",str(tmp),
                "-vf","scale='min(3840,iw)':'min(2160,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2,fps=30",
                "-c:v","libx264","-pix_fmt","yuv420p","-crf","20","-preset","medium",
                "-movflags","+faststart","-an",str(dest)], check=True)
            tmp.unlink(missing_ok=True)
        except Exception as e:
            failures.append((aid, prefix, f"download/transcode: {e}")); print(f"!! {aid} FAILED: {e}")
            tmp.unlink(missing_ok=True)

if not DRY and rows:
    with open(att, "a", encoding="utf-8") as fh:
        fh.write("\n## Hand-sourced from DVIDS BY ID (2026-09-14)\n")
        fh.write("Every item below is a US Government work, public domain under 17 U.S.C. 105,\n")
        fh.write("fetched directly from the DVIDS API by asset id - NOT by keyword search.\n")
        fh.write("Keyword search produced wrong-subject stock for this episode (a cloth-physics\n")
        fh.write("'simulation' for the collapse simulation, the US Treasury Building for the\n")
        fh.write("Pentagon); fetching by id is the fix.\n\n")
        fh.write("**HONESTY NOTE - none of this is 11 September 2001 footage.** These are modern\n")
        fh.write("clips of the KIND of room and the KIND of aircraft. No caption may present them\n")
        fh.write("as archival. The one real 2001 asset in this episode is the Pentagon still\n")
        fh.write("(TSGT Cedric H. Rudisill, USAF, PD) - plus FEMA's Ground Zero compilation, which\n")
        fh.write("IS real 2001 footage but is AFTERMATH (from Sept 18), never the day itself.\n\n")
        for name, aid, title, credit, url, why, dur in rows:
            fh.write(f"- `{name}` - \"{title}\" (DVIDS {aid}, {dur}s) - Public domain (US Government work, 17 U.S.C. 105) - {url}\n")
            fh.write(f"  - use: {why}\n")

print(f"\n{len(rows)} asset(s) resolved, {len(failures)} failed")
for aid, prefix, why in failures:
    print(f"  FAILED {aid} ({prefix}): {why}")
