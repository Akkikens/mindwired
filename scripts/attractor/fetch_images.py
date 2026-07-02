#!/usr/bin/env python3
"""
Fetch real, public-domain telescope imagery (NASA/ESA/STScI via the NASA Image
Library) for the photoreal scenes of the Great Attractor video. Downloads a large
version of each and downscales to <=2560px wide. Public domain — credit
"NASA / ESA / STScI" in the description.

Run: python3 scripts/attractor/fetch_images.py
Writes public/attractor/img/<name>.jpg
"""
import json, subprocess, sys, os
from pathlib import Path
from urllib.request import Request, urlopen

OUT = Path(__file__).resolve().parents[2] / "public" / "attractor" / "img"
OUT.mkdir(parents=True, exist_ok=True)
API = "https://images-api.nasa.gov/search"

# name -> search query (curated for each photoreal scene)
WANT = {
    "galaxy_hero":   "barred spiral galaxy hubble",
    "andromeda":     "Andromeda galaxy",
    "cmb":           "cosmic microwave background WMAP",
    "cmb_planck":    "Planck cosmic microwave background",
    "deepfield":     "Hubble Ultra Deep Field",
    "webb_field":    "Webb first deep field SMACS",
    "milkyway":      "Milky Way panorama",
    "galactic_core": "Milky Way galactic center infrared",
    "cluster":       "massive galaxy cluster gravitational lensing",
    "galaxies_wide": "thousands of galaxies survey",
    "spiral2":       "spiral galaxy face on",
}

def get(url, timeout=60):
    return urlopen(Request(url, headers={"User-Agent": "mindwired/1.0"}), timeout=timeout)

def pick_asset(item_href):
    """Return the best large jpg URL from an asset collection."""
    try:
        data = json.loads(get(item_href, 40).read())
    except Exception as e:
        return None
    urls = data if isinstance(data, list) else data.get("collection", {}).get("items", [])
    cand = []
    for u in urls:
        s = u if isinstance(u, str) else (u.get("href") if isinstance(u, dict) else None)
        if s and s.lower().endswith(".jpg"):
            cand.append(s)
    if not cand:
        return None
    for key in ("~large.jpg", "~orig.jpg", "~medium.jpg"):
        for c in cand:
            if c.endswith(key):
                return c
    return cand[0]

def fetch(name, query):
    dest = OUT / f"{name}.jpg"
    if dest.exists() and dest.stat().st_size > 60_000:
        print(f"  skip {name} (exists)")
        return True
    try:
        res = json.loads(get(f"{API}?q={query.replace(' ', '%20')}&media_type=image", 30).read())
    except Exception as e:
        print(f"  {name}: search failed {e}")
        return False
    items = res.get("collection", {}).get("items", [])
    for it in items[:8]:
        href = it.get("href")
        if not href:
            continue
        asset = pick_asset(href)
        if not asset:
            continue
        try:
            raw = get(asset, 90).read()
        except Exception:
            continue
        if len(raw) < 60_000:
            continue
        tmp = OUT / f"_{name}_raw.jpg"
        tmp.write_bytes(raw)
        # downscale to <=2560 wide, strip to clean jpg
        r = subprocess.run(
            ["ffmpeg", "-y", "-i", str(tmp), "-vf", "scale='min(2560,iw)':-2",
             "-q:v", "3", str(dest)], capture_output=True)
        tmp.unlink(missing_ok=True)
        if dest.exists() and dest.stat().st_size > 30_000:
            title = (it.get("data", [{}])[0] or {}).get("title", "")[:50]
            print(f"  {name}: {dest.stat().st_size//1024}KB  «{title}»")
            return True
    print(f"  {name}: no usable asset")
    return False

if __name__ == "__main__":
    print("Fetching public-domain telescope imagery...")
    ok = 0
    for name, q in WANT.items():
        if fetch(name, q):
            ok += 1
    print(f"done: {ok}/{len(WANT)}")
