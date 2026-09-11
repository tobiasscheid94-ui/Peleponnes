#!/usr/bin/env node
// Zero-dependency build: inlines everything from src/, vendor/, data/ and
// geo/ into a single self-contained dist/peloponnes-guide.html. No bundler,
// no npm packages at build or runtime — plain Node fs/path/child_process.

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const DATA = path.join(ROOT, 'data');
const OUT_DIR = path.join(ROOT, 'dist');
const OUT_FILE = path.join(OUT_DIR, 'peloponnes-guide.html');
const PAGES_DIR = path.join(ROOT, 'docs');
const PAGES_FILE = path.join(PAGES_DIR, 'index.html');

const SOFT_LIMIT_BYTES = 3 * 1024 * 1024;
const HARD_LIMIT_BYTES = 5 * 1024 * 1024;

function readText(p) {
  return fs.readFileSync(p, 'utf8');
}

function stripDummyDataBlock(js) {
  return js.replace(/\/\/ BUILD:STRIP-START[\s\S]*?\/\/ BUILD:STRIP-END\n?/, '');
}

function loadContentData() {
  const files = fs.readdirSync(DATA).filter((f) => f.endsWith('.json') && !['schema.json', 'habitats.json', 'routes.json'].includes(f));
  let entries = [];
  for (const file of files) {
    const parsed = JSON.parse(readText(path.join(DATA, file)));
    if (!Array.isArray(parsed)) throw new Error(`data/${file} muss ein Array sein.`);
    entries = entries.concat(parsed);
  }
  const habitatsPath = path.join(DATA, 'habitats.json');
  const habitats = fs.existsSync(habitatsPath) ? JSON.parse(readText(habitatsPath)) : { habitats: {} };
  const routesPath = path.join(DATA, 'routes.json');
  const routes = fs.existsSync(routesPath) ? JSON.parse(readText(routesPath)) : [];
  return { entries, habitats, routes };
}

function loadBasemap() {
  const p = path.join(ROOT, 'geo', 'basemap.geojson');
  if (!fs.existsSync(p)) return null;
  return JSON.parse(readText(p));
}

function runValidator() {
  console.log('-- Validierung der Inhalte (tools/validate.js) --');
  try {
    const output = execFileSync(process.execPath, [path.join(ROOT, 'tools', 'validate.js')], { encoding: 'utf8' });
    console.log(output);
  } catch (e) {
    console.log(e.stdout || '');
    console.error(e.stderr || '');
    throw new Error('Validierung fehlgeschlagen -- Build abgebrochen. Siehe Ausgabe oben.');
  }
}

function inlineHead(html, css) {
  return html
    .replace(/\s*<link rel="stylesheet" href="\.\.\/vendor\/leaflet\.css">\s*/, '\n  <style>\n' + css + '\n  </style>\n')
    .replace(/\s*<link rel="stylesheet" href="style\.css">\s*/, '\n');
}

function inlineScripts(html, dataScript, leafletJs, appJs) {
  return html.replace(
    /\s*<script src="\.\.\/vendor\/leaflet\.js"><\/script>\s*<script src="app\.js"><\/script>\s*/,
    '\n  <script>\n' + dataScript + '\n  </script>\n' +
    '  <script>\n' + leafletJs + '\n  </script>\n' +
    '  <script>\n' + appJs + '\n  </script>\n'
  );
}

function build() {
  runValidator();

  const { entries, habitats, routes } = loadContentData();
  const basemap = loadBasemap();

  console.log(`Content: ${entries.length} Eintraege, ${Object.keys(habitats.habitats || {}).length} Habitat-Profile, ${routes.length} Tagesrouten, Basemap: ${basemap ? 'vorhanden' : 'fehlt'}.`);

  const indexHtml = readText(path.join(SRC, 'index.html'));
  const leafletCss = readText(path.join(ROOT, 'vendor', 'leaflet.css'));
  const appCss = readText(path.join(SRC, 'style.css'));
  const leafletJs = readText(path.join(ROOT, 'vendor', 'leaflet.js'));
  const appJs = stripDummyDataBlock(readText(path.join(SRC, 'app.js')));

  const dataScript = [
    'window.PELOPONNES_DATA = ' + JSON.stringify(entries) + ';',
    'window.PELOPONNES_HABITATS = ' + JSON.stringify(habitats) + ';',
    'window.PELOPONNES_ROUTES = ' + JSON.stringify(routes) + ';',
    basemap ? 'window.PELOPONNES_BASEMAP = ' + JSON.stringify(basemap) + ';' : ''
  ].filter(Boolean).join('\n');

  let out = indexHtml;
  out = inlineHead(out, leafletCss + '\n' + appCss);
  out = inlineScripts(out, dataScript, leafletJs, appJs);

  if (out.indexOf('../vendor/') !== -1 || out.indexOf('href="style.css"') !== -1 || out.indexOf('src="app.js"') !== -1) {
    throw new Error('Inlining unvollstaendig -- src/index.html-Struktur hat sich vermutlich geaendert, ohne build.js anzupassen.');
  }

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, out, 'utf8');

  // Zusaetzliche Kopie fuer GitHub Pages (iPad kann dist/*.html nicht per
  // file:// mit aktivem JavaScript oeffnen -- Quick Look deaktiviert JS fuer
  // lokale HTML-Dateien). Gleicher Inhalt, nur als Hosting-Ziel unter /docs,
  // da GitHub Pages als Branch-Quelle nur "/" oder "/docs" erlaubt.
  if (!fs.existsSync(PAGES_DIR)) fs.mkdirSync(PAGES_DIR, { recursive: true });
  fs.writeFileSync(PAGES_FILE, out, 'utf8');

  const bytes = Buffer.byteLength(out, 'utf8');
  const mb = (bytes / (1024 * 1024)).toFixed(2);
  console.log(`\nGeschrieben: ${path.relative(ROOT, OUT_FILE)} (${mb} MB)`);
  console.log(`Geschrieben: ${path.relative(ROOT, PAGES_FILE)} (GitHub-Pages-Kopie)`);
  if (bytes > HARD_LIMIT_BYTES) {
    throw new Error(`Dateigroesse ${mb} MB ueberschreitet das harte Limit von 5 MB.`);
  }
  if (bytes > SOFT_LIMIT_BYTES) {
    console.warn(`WARNUNG: Dateigroesse ${mb} MB ueberschreitet das Ziel von 3 MB.`);
  }
  console.log('OK.');
}

build();
