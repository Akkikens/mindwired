#!/usr/bin/env python3
"""
Fetch real, public-domain space imagery (NASA Image Library) for "The Scariest
Places" — so every scene gets the photoreal Ken-Burns treatment instead of
procedural 3D. NASA imagery is public domain; credit "NASA / ESA / STScI / CXC"
in the description. Downscales to <=2560px wide.

Run: python3 scripts/scariest/fetch_images.py
Writes public/scariest/img/<name>.jpg
"""
import json, subprocess
from pathlib import Path
from urllib.request import Request, urlopen

OUT = Path(__file__).resolve().parents[2] / "public" / "scariest" / "img"
OUT.mkdir(parents=True, exist_ok=True)
API = "https://images-api.nasa.gov/search"

# Several candidates per scene so we can pick the strongest frame.
WANT = {
    "rogue_planet":   "rogue planet free floating",
    "rogue_planet2":  "free-floating planet artist concept",
    "magnetar":       "magnetar",
    "neutron_star":   "neutron star magnetic field illustration",
    "quasar":         "quasar black hole jet",
    "quasar2":        "distant quasar hubble",
    "blackhole":      "black hole accretion disk simulation",
    "blackhole2":     "supermassive black hole simulation",
    "blackhole_jet":  "black hole jet galaxy",
    "cosmic_web":     "cosmic web large scale structure simulation",
    "deep_void":      "Hubble eXtreme Deep Field",
    "nebula_dark":    "pillars of creation",
}

def get(url, timeout=60):
    return urlopen(Request(url, headers={"User-Agent": "mindwired/1.0"}), timeout=timeout)

def pick_asset(item_href):
    try:
        data = json.loads(get(item_href, 40).read())
    except Exception:
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
    for it in res.get("collection", {}).get("items", [])[:8]:
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
        subprocess.run(["ffmpeg", "-y", "-i", str(tmp), "-vf", "scale='min(2560,iw)':-2",
                        "-q:v", "3", str(dest)], capture_output=True)
        tmp.unlink(missing_ok=True)
        if dest.exists() and dest.stat().st_size > 30_000:
            title = (it.get("data", [{}])[0] or {}).get("title", "")[:50]
            print(f"  {name}: {dest.stat().st_size//1024}KB  «{title}»")
            return True
    print(f"  {name}: no usable asset")
    return False

if __name__ == "__main__":
    print("Fetching public-domain space imagery for The Scariest Places...")
    ok = sum(fetch(n, q) for n, q in WANT.items())
    print(f"done: {ok}/{len(WANT)}")
