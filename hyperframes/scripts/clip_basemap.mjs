#!/usr/bin/env node
/**
 * Clip + simplify a Natural Earth GeoJSON (public domain) to a bounding box so a
 * route-map scene can bake a small, offline basemap into its HTML.
 *
 *   node scripts/clip_basemap.mjs --in ~/Downloads/ne_10m_admin_0_countries.geojson \
 *        --bbox 19,32,37,42.5 --tolerance 0.008 --out assets/geo/eastmed.json
 *
 * Source files (any of these work, all public domain):
 *   https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson
 *   https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson
 *
 * Output: { bbox, source, features: [{ name, rings: [[[lon,lat],...], ...] }] }
 * (every ring is an outer or inner ring of a polygon; the map scene draws them with even-odd fill)
 */
import fs from "node:fs";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith("--") ? [...a, [v.slice(2), arr[i + 1]]] : a), []),
);
if (!args.in || !args.bbox || !args.out) {
  console.error("usage: clip_basemap.mjs --in <geojson> --bbox lonMin,latMin,lonMax,latMax --out <json> [--tolerance deg] [--keep Name,Name]");
  process.exit(2);
}
const [x0, y0, x1, y1] = args.bbox.split(",").map(Number);
const tol = Number(args.tolerance ?? 0.01);
const keep = args.keep ? new Set(args.keep.split(",")) : null;

// Sutherland–Hodgman polygon clipping against an axis-aligned rectangle.
function clipRing(ring) {
  const edges = [
    { inside: (p) => p[0] >= x0, cross: (a, b) => [x0, a[1] + ((b[1] - a[1]) * (x0 - a[0])) / (b[0] - a[0])] },
    { inside: (p) => p[0] <= x1, cross: (a, b) => [x1, a[1] + ((b[1] - a[1]) * (x1 - a[0])) / (b[0] - a[0])] },
    { inside: (p) => p[1] >= y0, cross: (a, b) => [a[0] + ((b[0] - a[0]) * (y0 - a[1])) / (b[1] - a[1]), y0] },
    { inside: (p) => p[1] <= y1, cross: (a, b) => [a[0] + ((b[0] - a[0]) * (y1 - a[1])) / (b[1] - a[1]), y1] },
  ];
  let out = ring;
  for (const e of edges) {
    const input = out;
    out = [];
    if (!input.length) break;
    let prev = input[input.length - 1];
    for (const cur of input) {
      if (e.inside(cur)) {
        if (!e.inside(prev)) out.push(e.cross(prev, cur));
        out.push(cur);
      } else if (e.inside(prev)) out.push(e.cross(prev, cur));
      prev = cur;
    }
  }
  return out;
}

// Douglas–Peucker simplification (degrees).
function simplify(pts, eps) {
  if (pts.length < 3) return pts;
  const sqSegDist = (p, a, b) => {
    let x = a[0], y = a[1], dx = b[0] - x, dy = b[1] - y;
    if (dx || dy) {
      const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
      if (t > 1) { x = b[0]; y = b[1]; } else if (t > 0) { x += dx * t; y += dy * t; }
    }
    dx = p[0] - x; dy = p[1] - y;
    return dx * dx + dy * dy;
  };
  const keepIdx = new Uint8Array(pts.length);
  keepIdx[0] = keepIdx[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [s, e] = stack.pop();
    let maxD = 0, idx = -1;
    for (let i = s + 1; i < e; i++) {
      const d = sqSegDist(pts[i], pts[s], pts[e]);
      if (d > maxD) { maxD = d; idx = i; }
    }
    if (maxD > eps * eps && idx > 0) { keepIdx[idx] = 1; stack.push([s, idx], [idx, e]); }
  }
  return pts.filter((_, i) => keepIdx[i]);
}

const src = JSON.parse(fs.readFileSync(args.in, "utf8"));
const features = [];
for (const f of src.features) {
  const name = f.properties.NAME ?? f.properties.name ?? f.properties.ADMIN ?? "";
  if (keep && !keep.has(name)) continue;
  const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.type === "MultiPolygon" ? f.geometry.coordinates : [];
  const rings = [];
  for (const poly of polys) {
    for (const ring of poly) {
      const clipped = clipRing(ring);
      if (clipped.length < 4) continue;
      const simp = simplify(clipped, tol);
      if (simp.length < 4) continue;
      rings.push(simp.map(([x, y]) => [Math.round(x * 1e4) / 1e4, Math.round(y * 1e4) / 1e4]));
    }
  }
  if (rings.length) features.push({ name, rings });
}
const out = {
  source: `Natural Earth (public domain), ${args.in.split("/").pop()}, clipped to bbox and simplified (${tol}°)`,
  bbox: [x0, y0, x1, y1],
  features,
};
fs.writeFileSync(args.out, JSON.stringify(out));
console.log(`${args.out}: ${features.length} features, ${features.reduce((a, f) => a + f.rings.length, 0)} rings, ${(fs.statSync(args.out).size / 1024).toFixed(0)} KB`);
