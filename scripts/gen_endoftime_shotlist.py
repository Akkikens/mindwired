#!/usr/bin/env python3
"""endoftime shotlist — assign every script line a concrete visual.

Heuristic first pass; the audit sheets (audit_endoftime.py) are the review
gate — hand-fix entries in endoftime.shotlist.json after eyeballing.

Visual types: {"type":"veo","file":...} | {"type":"img","file":...}
            | {"type":"card"} (word/title/intro/outro) | {"type":"counter"} (timescale)
  .venv-lipsync/bin/python scripts/gen_endoftime_shotlist.py
"""
import json, re
from pathlib import Path
from collections import defaultdict

REPO = Path(__file__).resolve().parent.parent
DOCS = REPO / "src" / "mindwired-doc" / "docs"
doc = json.loads((DOCS / "endoftime.json").read_text())
man = json.loads((DOCS / "endoftime.manifest.json").read_text())
IMG = man["images"]

# scene -> image prefix pools (rotated per occurrence)
POOLS = {
    "void": ["deepfield", "starfield", "cmb", "cosmicweb", "milkyway"],
    "cmb": ["cmb", "deepfield", "cosmicweb"],
    "star": ["sunsurface", "starfield"],
    "sun": ["sunsurface"],
    "earth": ["earth", "earthnight"],
    "earthdark": ["earthnight"],
    "earthfrozen": [],  # veo frozenearth
    "galaxy": ["milkyway", "andromeda"],
    "galaxycollision": ["galaxycollision"],
    "nebula": ["helixnebula", "dyingstar", "pillars", "carina"],
    "supernova": ["supernovarem"],
    "redgiant": ["redgiant"],
    "whitedwarf": ["whitedwarf"],
    "blackhole": ["blackholeart", "blackholereal"],
    "horizon": ["blackholeart"],
    "ton618": ["quasar"],
    "roguebh": ["blackholeart"],
    "pulsar": ["pulsar"],
    "magnetar": ["magnetar"],
    "saturn": ["saturn"],
    "moon": ["moon"],
    "mars": ["mars"],
    "jupiter": ["jupiter"],
    "signal": ["voyager", "palebluedot"],
    "probe": ["voyager"],
    "comet": ["starfield"],
    "wormhole": ["cosmicweb"],
    "attractor": ["cosmicweb"],
    "bigbang": ["carina"],
    "flash": [],  # veo finalflash
    "blackdwarf": [],  # veo
    "evaporation": [],  # veo
    "timescale": [], "word": [], "title": [], "intro": [], "outro": [],
    "warp": ["deepfield"],
}
# scenes fully served by a veo clip
VEO = {"earthfrozen": "frozenearth.mp4", "flash": "finalflash.mp4",
       "blackdwarf": "blackdwarf.mp4", "evaporation": "evaporation.mp4"}
CARD = {"word", "title", "intro", "outro"}

# Free clips (public domain / CC-BY / CC0) as "dir:file". Big pools per scene so
# no clip repeats more than ~3x across 34 min. f1=freeclips (NASA SVS),
# f2=freeclips2 (ESO/ESA-Hubble/Pexels). VIDEO used on 2 of every 3 occurrences;
# the 3rd stays a real JWST/Hubble still for texture variety.
F1, F2 = "freeclips", "freeclips2"
def _c(dir, *files): return [f"{dir}:{f}" for f in files]
FREE = {
    "supernova":       _c(F2, "supernova_eso_1.mp4", "supernova_eso_2.mp4") + _c(F1, "supernovasim_svs20413.mp4"),
    "galaxycollision": _c(F1, "galaxysim_clean.mp4", "merger_close_svs13197.mp4", "merger_flyin_svs13197.mp4"),
    "galaxy":          _c(F2, "galaxy_eso_1.mp4", "galaxy_eso_3.mp4", "galaxy_pexels_1.mp4") + _c(F1, "galaxysim_roman_zoom_svs14301.mp4"),
    "sun":             _c(F1, "sunlive_clean.mp4") + _c(F2, "redgiant_eso_4.mp4", "exoplanet_eso_1.mp4"),
    "redgiant":        _c(F2, "redgiant_eso_2.mp4", "redgiant_eso_3.mp4", "redgiant_eso_4.mp4"),
    "nebula":          _c(F2, "nebula_esahubble_1.mp4", "nebula_esahubble_2.mp4", "nebula_esahubble_3.mp4",
                            "nebula_esahubble_4.mp4", "nebula_esahubble_5.mp4") + _c(F1, "nurseryfly_pillars3d_svs14616.mp4"),
    "blackhole":       _c(F1, "blackhole_lensed_disk_svs13326.mp4", "blackhole_approach_svs14619.mp4", "merger_close_svs13197.mp4"),
    "horizon":         _c(F1, "blackhole_approach_svs14619.mp4", "blackhole_lensed_disk_svs13326.mp4"),
    "ton618":          _c(F1, "blackhole_lensed_disk_svs13326.mp4"),
    "roguebh":         _c(F1, "merger_flyin_svs13197.mp4"),
    "earth":           _c(F2, "earth_pexels_1.mp4", "earth_pexels_2.mp4", "earth_pexels_3.mp4") + _c(F1, "earthiss_night_svs30180.mp4"),
    "earthdark":       _c(F1, "earthiss_aurora_svs30179.mp4") + _c(F2, "aurora_pexels_2.mp4", "earth_pexels_2.mp4"),
    "warp":            _c(F2, "warp_pexels_1.mp4", "warp_pexels_2.mp4"),
    "comet":           _c(F2, "comet_asteroid_eso_1.mp4", "comet_esahubble_2.mp4"),
    "saturn":          _c(F2, "planet_saturn_esahubble_1.mp4"),
    "moon":            _c(F2, "moon_pexels_2.mp4"),
    "signal":          _c(F2, "exoplanet_eso_3.mp4", "exoplanet_eso_4.mp4"),
    "bigbang":         _c(F1, "earlyuni_reionization_svs13511.mp4") + _c(F2, "warp_pexels_1.mp4"),
    "cmb":             _c(F1, "earlyuni_structure_svs14297.mp4", "earlyuni_reionization_svs13511.mp4"),
    "cosmicweb":       _c(F1, "earlyuni_structure_svs14297.mp4") + _c(F2, "deepfield_esahubble_1.mp4"),
    "attractor":       _c(F1, "merger_flyin_svs13197.mp4"),
}

n = len(doc["lines"])
rot = defaultdict(int)
shots = []
for i, ln in enumerate(doc["lines"]):
    sc = ln["scene"]; frac = i / n
    v = None
    if sc == "timescale": v = {"type": "counter", "label": ln.get("arg", "")}
    elif sc in CARD: v = {"type": "card"}
    elif sc in VEO: v = {"type": "veo", "file": VEO[sc]}
    # hand-tuned hero placements (paid Veo — Akshay's favorites kept)
    elif i == 0: v = {"type": "veo", "file": "redgiantearth.mp4"}          # hook line 1
    elif i == 1: v = {"type": "veo", "file": "bigbangrebirth.mp4"}          # hook line 2
    elif sc == "redgiant": v = {"type": "veo", "file": "redgiantearth.mp4"}
    elif sc == "galaxycollision" and rot["gcveo"] < 2 and (rot.update(gcveo=rot["gcveo"]+1) or True):
        v = {"type": "veo", "file": "milkdromeda.mp4"}
    elif sc == "bigbang" and frac > 0.82: v = {"type": "veo", "file": "bigbangrebirth.mp4"}
    elif sc == "earth" and frac < 0.10: v = {"type": "veo", "file": "hookearth.mp4"}
    elif sc == "star" and 0.35 < frac < 0.75 and rot["lsveo"] < 2 and (rot.update(lsveo=rot["lsveo"]+1) or True):
        v = {"type": "veo", "file": "laststar.mp4"}
    # free clips on 2 of every 3 occurrences of eligible scenes (3rd = still)
    if v is None and sc in FREE:
        occ = rot[f"free_{sc}"]; rot[f"free_{sc}"] = occ + 1
        if occ % 3 != 2:
            pool = FREE[sc]
            dirfile = pool[occ % len(pool)]
            d, f = dirfile.split(":", 1)
            v = {"type": "free", "dir": d, "file": f}
    if v is None:
        pool = POOLS.get(sc, ["deepfield"])
        files = [f for p in pool for f in IMG.get(p, [])]
        if not files: v = {"type": "card"}
        else:
            v = {"type": "img", "file": files[rot[sc] % len(files)]}
            rot[sc] += 1
    shots.append({"id": ln["id"], "scene": sc, **v})

# mark consecutive same-file video runs (climax sequences) so the comp plays
# them as ONE continuous shot: runIdx = position in the run, runLen = run length.
for i, s in enumerate(shots):
    if s["type"] not in ("veo", "free"):
        continue
    j = i
    while j > 0 and shots[j-1].get("file") == s["file"] and shots[j-1]["type"] == s["type"]:
        j -= 1
    k = i
    while k < len(shots)-1 and shots[k+1].get("file") == s["file"] and shots[k+1]["type"] == s["type"]:
        k += 1
    s["runIdx"] = i - j
    s["runLen"] = k - j + 1

(DOCS / "endoftime.shotlist.json").write_text(json.dumps(shots, indent=1))
from collections import Counter
print(len(shots), "shots ·", Counter(s["type"] for s in shots))
