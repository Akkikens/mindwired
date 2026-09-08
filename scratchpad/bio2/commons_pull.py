import json, os, subprocess, sys, time, urllib.parse, urllib.request
UA = "mindwired-doc/1.0 (https://github.com/; contact akshay@climbtogether.co)"
OUT = "public/shorts/biosphere2/images"
os.makedirs(OUT, exist_ok=True)

# prefix -> list of exact Commons file titles (from the dimension-4 footage scout)
POOLS = {
 "b2_hero":       ["Biosphere 2015 01 18 0051.jpg", "Biosphere 2.jpg", "Biosphere Panorama.jpg"],
 "b2_wide_s":     ["Biosphere 2 - Arizona.jpg", "Exterior of Biosphere 2.jpg", "Biosphere 2 Campus - Flickr - treegrow (1).jpg"],
 "b2_glass_4":    ["Biosphere 2 Architecture.jpg", "Biosphere 2 TucsonAZ 20050822 1.jpg"],
 "b2_lung_1":     ["Biosphere 2 Lung, 2-25-17.jpg", "Biosphere 2 Lung - Flickr - treegrow.jpg"],
 "b2_lung_2":     ["Biosphere 2 Lung - Flickr - treegrow (1).jpg", "Biosphere 2 Habitat & Lung 2009-05-10.jpg"],
 "b2_lung_3":     ["Lung Closeup - Flickr - treegrow.jpg", "Lung Closeup - Flickr - treegrow (1).jpg"],
 "b2_rainforest_1":["Rainforest Biome Biosphere 2.jpg", "Biosphere2 Rain Forest Biome.jpg"],
 "b2_ocean_1":    ["The Ocean - Flickr - treegrow.jpg", "Ocean Zone - panoramio.jpg", "Océan Biosphère 2.JPG"],
 "b2_mangrove_1": ["Mangroves - Flickr - treegrow.jpg", "Mangroves Biosphère 2.jpg"],
 "b2_desert_1":   ["Desert Zone - panoramio.jpg", "Désert Biosphère 2.jpg", "Tucson05 BiosphereFogDesert.jpg"],
 "b2_agri_1":     ["Lemon Trees - panoramio (1).jpg", "Lemon Tree - panoramio.jpg"],
 "b2_agri_2":     ["Fig Leaves - Flickr - treegrow.jpg", "Banana Leaf - Flickr - treegrow.jpg"],
 "b2_kitchen_1":  ["Kitchen Biosphere 2.jpg", "Kitchen for Biosphere 2 residents - panoramio.jpg"],
 "b2_tech_1":     ["Biosphere 2 Bowels - Flickr - treegrow.jpg", "Maintenance Tunnels - panoramio.jpg"],
 "b2_tech_2":     ["Reverse Osmosis Tanks in Biosphere 2 Tunnels - panoramio.jpg"],
 "b2_present_1":  ["Biosphere 2 Campus - Flickr - treegrow (2).jpg", "Biosphere 2 Campus - Flickr - treegrow (8).jpg"],
 "b2_present_2":  ["Biosphere2 1.jpg", "Biosphere 2 - 1998 a.jpg", "Biosphere 2 - 1998 e.jpg"],
 "b2_crew_2":     ["Jane Poynter Taber MacCallum World View Enterprises.JPG", "Mark Nelson.jpg", "MarkNelson.jpg"],
 "b2_allen":      ["John P. Allen.jpg"],
 "b2_heraclitus": ["Heraclitus.jpg"],
 "b2_testmod":    ["Biosphere 2 Test Module.jpg"],
 "b2_mission93":  ["Measuring soil moisture and CO2 soil emissions.tif"],
 "b2_interior_s": ["Biosphere2 Inside big.jpg", "Air Vents in Desert Zone - panoramio.jpg"],
 "b2_leo_1":      ["Landscape Evolution Observatory (LEO) at Biosphere 2.jpg"],
}
def api(titles):
    q = "https://commons.wikimedia.org/w/api.php?action=query&titles=%s&prop=imageinfo&iiprop=url|size|extmetadata&format=json" % \
        urllib.parse.quote("|".join("File:" + t for t in titles))
    r = urllib.request.Request(q, headers={"User-Agent": UA})
    return json.load(urllib.request.urlopen(r, timeout=60))

BAD = ("NonCommercial", "NoDeriv", "-NC", "-ND")
rows, got, skipped = [], 0, []
for prefix, titles in POOLS.items():
    d = api(titles)
    pages = (d.get("query", {}) or {}).get("pages", {}) or {}
    n = 0
    for p in pages.values():
        if "imageinfo" not in p:
            skipped.append((prefix, p.get("title", "?"), "NOT FOUND")); continue
        ii = p["imageinfo"][0]; em = ii.get("extmetadata", {}) or {}
        lic = (em.get("LicenseShortName", {}) or {}).get("value", "?")
        if any(b.lower() in lic.lower() for b in BAD):
            skipped.append((prefix, p["title"], "LICENCE " + lic)); continue
        n += 1
        if os.path.exists("%s/%s_%d.jpg" % (OUT, prefix, n)):
            continue
        ext = os.path.splitext(ii["url"])[1].lower()
        raw = "%s/%s_%d_raw%s" % (OUT, prefix, n, ext)
        dst = "%s/%s_%d.jpg" % (OUT, prefix, n)
        ok = False
        for attempt in range(5):
            try:
                rq = urllib.request.Request(ii["url"], headers={"User-Agent": UA})
                open(raw, "wb").write(urllib.request.urlopen(rq, timeout=180).read())
                ok = True; break
            except Exception as e:
                if "429" in str(e):
                    time.sleep(8 * (attempt + 1)); continue
                skipped.append((prefix, p["title"], "DL FAIL %s" % e)); break
        if not ok:
            if not any(s0[1] == p["title"] for s0 in skipped):
                skipped.append((prefix, p["title"], "DL FAIL rate-limited"))
            n -= 1; continue
        time.sleep(2.5)
        # normalise: RGB jpg, cap long edge at 3840 for the 4K pipeline
        subprocess.run(["ffmpeg","-v","error","-y","-i",raw,
                        "-vf","scale='min(3840,iw)':-2:flags=lanczos,format=yuvj420p",
                        "-q:v","2",dst], check=False)
        os.remove(raw)
        if os.path.exists(dst):
            got += 1
            au = (em.get("Artist", {}) or {}).get("value", "")
            au = __import__("re").sub("<[^>]+>", "", au)[:60]
            rows.append("- `%s` — \"%s\" by %s — %s — %s" %
                        (os.path.basename(dst), p["title"][5:], au or "?", lic, ii["descriptionurl"]))
        else:
            skipped.append((prefix, p["title"], "TRANSCODE FAIL")); n -= 1
with open("%s/ATTRIBUTION.md" % OUT, "a") as f:
    f.write("\n\n## Direct Wikimedia Commons pulls (2026-09-03)\n" + "\n".join(rows) + "\n")
print("fetched %d real Biosphere 2 files" % got)
if skipped:
    print("\nSKIPPED:")
    for s in skipped: print("   ", s)
