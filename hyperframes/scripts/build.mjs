#!/usr/bin/env node
/**
 * mindwired scene-kit builder.
 *
 *   node scripts/build.mjs [--episode helios522] [--channel mindwired|blackbox|criminalrecord] [--only a,b]
 *
 * --only limits the build to those data file names (scripts/build_hf_scenes.py passes the doc's
 * hf scenes); the built list then holds just those, so render-all.sh renders just those.
 *
 * For every data/<episode>/<name>.json it reads templates/<scene>.html (scene = json.scene),
 * bakes the JSON (and any basemap it references) into the markup, inlines theme/mindwired.css
 * with the channel accent, and writes:
 *
 *   compositions/<name>.html   — templated sub-composition (mounted by index.html for check/preview)
 *   scenes/<name>.html         — standalone composition of the same scene (what render-all.sh renders)
 *   index.html                 — host that plays every scene back to back
 *
 * Templates are plain HTML fragments: a <style>, the #root composition div, and a <script>.
 * Placeholders: {{ID}} {{DURATION}} {{DATA}} (JSON) {{GEO}} (JSON basemap or null).
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf(`--${k}`); return i >= 0 ? argv[i + 1] : d; };
const episode = opt("episode", "helios522");
const repo = path.resolve(root, "..");

// Channel: --channel wins, else the doc spec's "channel" (src/mindwired-doc/docs/<episode>.json),
// else mindwired — the same default DocWide applies.
const docPath = path.join(repo, "src/mindwired-doc/docs", `${episode}.json`);
const docChannel = fs.existsSync(docPath) ? JSON.parse(fs.readFileSync(docPath, "utf8")).channel : undefined;
const channel = opt("channel", docChannel ?? "mindwired");

// Accents come straight from DocWide's THEMES table so the clips can never drift from the comp.
const docWide = fs.readFileSync(path.join(repo, "src/mindwired-doc/DocWide.tsx"), "utf8");
const themesSrc = docWide.slice(docWide.indexOf("const THEMES"), docWide.indexOf("\n};", docWide.indexOf("const THEMES")));
const ACCENTS = Object.fromEntries([...themesSrc.matchAll(/^  (\w+): \{[\s\S]*?accent: "(#[0-9A-Fa-f]{6})"/gm)].map((m) => [m[1], m[2]]));
if (!ACCENTS.mindwired) { console.error("could not parse THEMES accents from src/mindwired-doc/DocWide.tsx"); process.exit(2); }
const accent = ACCENTS[channel];
if (!accent) { console.error(`unknown channel ${channel}; one of ${Object.keys(ACCENTS).join(", ")}`); process.exit(2); }
const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(", ");

let theme = fs.readFileSync(path.join(root, "theme/mindwired.css"), "utf8")
  .replace(/--accent: #[0-9A-Fa-f]{6};/, `--accent: ${accent};`)
  .replace(/--accent-dim: rgba\([^)]*\)/, `--accent-dim: rgba(${hexToRgb(accent)}, 0.35)`)
  .replace(/--accent-tint: rgba\([^)]*\)/, `--accent-tint: rgba(${hexToRgb(accent)}, 0.12)`);

const dataDir = path.join(root, "data", episode);
const only = (opt("only", "") || "").split(",").map((x) => x.trim()).filter(Boolean);
let files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".json")).sort();
if (only.length) {
  const missing = only.filter((n) => !files.includes(`${n}.json`));
  if (missing.length) { console.error(`--only: no data/${episode}/<name>.json for ${missing.join(", ")}`); process.exit(1); }
  files = files.filter((f) => only.includes(path.basename(f, ".json")));
}
// Vendored (assets/vendor/README.md) — renders must work offline.
const GSAP_FILE = "assets/vendor/gsap-3.14.2.min.js";
if (!fs.existsSync(path.join(root, GSAP_FILE))) { console.error(`missing ${GSAP_FILE}`); process.exit(1); }
const GSAP = `<script src="${GSAP_FILE}"></script>`;
const built = [];

// Start from empty output dirs so a scene deleted from data/ (or another episode's scenes) can't
// linger and get rendered. compositions/components/ is hand-authored and kept.
for (const dir of ["scenes", "compositions"]) {
  const abs = path.join(root, dir);
  fs.mkdirSync(abs, { recursive: true });
  for (const e of fs.readdirSync(abs)) if (!(dir === "compositions" && e === "components")) fs.rmSync(path.join(abs, e), { recursive: true, force: true });
}
const written = [];
const emit = (rel, html) => { fs.writeFileSync(path.join(root, rel), html); written.push(rel); };

for (const file of files) {
  const name = path.basename(file, ".json");
  const data = JSON.parse(fs.readFileSync(path.join(dataDir, file), "utf8"));
  const tplPath = path.join(root, "templates", `${data.scene}.html`);
  if (!fs.existsSync(tplPath)) { console.error(`${file}: no template for scene "${data.scene}"`); process.exit(1); }
  const duration = Number(data.duration);
  if (!(duration > 0)) { console.error(`${file}: "duration" (seconds) is required`); process.exit(1); }
  let geo = null;
  if (data.basemap) geo = JSON.parse(fs.readFileSync(path.join(root, data.basemap), "utf8"));

  const fragment = fs.readFileSync(tplPath, "utf8")
    .replaceAll("{{ID}}", name)
    .replaceAll("{{DURATION}}", String(duration))
    .replaceAll("{{DATA}}", JSON.stringify(data))
    .replaceAll("{{GEO}}", JSON.stringify(geo));

  const sub = `<!doctype html>\n<html lang="en">\n<head><meta charset="UTF-8" /><title>${name}</title></head>\n<body>\n<template>\n<style>\n${theme}\n</style>\n${fragment}\n</template>\n</body>\n</html>\n`;
  emit(`compositions/${name}.html`, sub);

  const standalone = `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="UTF-8" />\n<meta name="viewport" content="width=1920, height=1080" />\n<title>${episode} · ${name}</title>\n${GSAP}\n<style>\n* { margin: 0; padding: 0; box-sizing: border-box; }\nhtml, body { width: 1920px; height: 1080px; overflow: hidden; background: #05070C; }\n${theme}\n</style>\n</head>\n<body>\n${fragment}\n</body>\n</html>\n`;
  // scenes/ is one level down, so asset references step up one directory
  emit(`scenes/${name}.html`, standalone.replaceAll("assets/", "../assets/"));
  built.push({ name, duration, scene: data.scene });
  console.log(`built ${name} (${data.scene}, ${duration}s)`);
}

// Host composition: every scene back to back on one lane.
let t = 0;
const mounts = built.map((b) => {
  const m = `  <div id="slot-${b.name}" class="clip" data-composition-id="${b.name}" data-composition-src="compositions/${b.name}.html" data-start="${t}" data-duration="${b.duration}" data-track-index="0" data-width="1920" data-height="1080"></div>`;
  t += b.duration;
  return m;
}).join("\n");
const index = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=1920, height=1080" />
<title>mindwired scene kit · ${episode}</title>
${GSAP}
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 1920px; height: 1080px; overflow: hidden; background: #05070C; }
#root { position: relative; width: 100%; height: 100%; overflow: hidden; background: #05070C; }
.clip { position: absolute; inset: 0; }
</style>
</head>
<body>
<!-- GENERATED by scripts/build.mjs — edit data/${episode}/*.json or templates/*.html, not this file. -->
<div id="root" data-composition-id="main" data-start="0" data-duration="${t}" data-width="1920" data-height="1080">
${mounts}
</div>
<script>
  const tl = gsap.timeline({ paused: true });
  window.__timelines["main"] = tl;
</script>
</body>
</html>
`;
emit("index.html", index);

// Offline gate: no remote script/stylesheet/import may survive into anything we emitted.
// (SVG xmlns="http://www.w3.org/2000/svg" is a namespace string, not a fetch, and is allowed.)
const REMOTE = /<script\b[^>]*\bsrc\s*=\s*["']?(?:https?:)?\/\/|<link\b[^>]*\bhref\s*=\s*["']?(?:https?:)?\/\/|@import\s+(?:url\()?\s*["']?(?:https?:)?\/\/|url\(\s*["']?(?:https?:)?\/\//i;
const remote = written.filter((rel) => REMOTE.test(fs.readFileSync(path.join(root, rel), "utf8")));
if (remote.length) { console.error(`REMOTE URL in emitted HTML (vendor it under assets/vendor/): ${remote.join(", ")}`); process.exit(1); }

// The exact scene list render-all.sh renders (never a glob over scenes/).
fs.mkdirSync(path.join(root, ".hyperframes"), { recursive: true });
fs.writeFileSync(path.join(root, ".hyperframes", `built-${episode}.json`),
  JSON.stringify({ episode, channel, accent, scenes: built.map((b) => b.name), durations: Object.fromEntries(built.map((b) => [b.name, b.duration])) }, null, 2) + "\n");
console.log(`index.html: ${built.length} scenes, ${t}s total (${episode}, ${channel} accent ${accent})`);
