#!/usr/bin/env node
// Zero-dependency schema + plausibility check for /data/*.json entries.
// Implements the rules described in data/schema.json directly (no generic
// JSON-Schema engine, so this stays dependency-free per the project brief).

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const BBOX = { minLon: 20.9, minLat: 36.3, maxLon: 23.4, maxLat: 38.4 };

const REGIONS = ['lakonien', 'messenien', 'arkadien', 'argolis', 'korinthia', 'achaia', 'ilia'];
const TYPES = ['beach', 'site', 'town', 'monastery_castle', 'hike', 'viewpoint'];
const CONFIDENCE = ['high', 'medium', 'low'];
const COORD_SOURCE = ['exact', 'approx'];

let errors = [];
let warnings = [];

function err(entryId, file, msg) {
  errors.push(`[ERROR] ${file} :: ${entryId || '?'} :: ${msg}`);
}
function warn(entryId, file, msg) {
  warnings.push(`[WARN]  ${file} :: ${entryId || '?'} :: ${msg}`);
}

function countWords(text) {
  if (typeof text !== 'string') return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

function isNonEmptyString(v) {
  return typeof v === 'string' && v.length > 0;
}

function loadJson(file) {
  const raw = fs.readFileSync(file, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    errors.push(`[ERROR] ${path.basename(file)} :: JSON konnte nicht geparst werden: ${e.message}`);
    return null;
  }
}

function checkBase(e, file) {
  const id = e.id;
  const required = [
    'id', 'name', 'nameGr', 'type', 'region', 'coords', 'coordSource',
    'summary', 'timeNeeded', 'touristTrapRisk', 'nearby', 'tags',
    'confidence', 'needsVerification'
  ];
  for (const field of required) {
    if (!(field in e)) err(id, file, `Pflichtfeld '${field}' fehlt.`);
  }

  if (isNonEmptyString(e.id) && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(e.id)) {
    err(id, file, `id '${e.id}' entspricht nicht dem Format kleinbuchstaben-mit-bindestrichen.`);
  }
  if (!isNonEmptyString(e.name)) err(id, file, `'name' fehlt oder leer.`);
  if (!isNonEmptyString(e.nameGr)) err(id, file, `'nameGr' fehlt oder leer.`);
  if (!TYPES.includes(e.type)) err(id, file, `'type' ungueltig: ${e.type}`);
  if (!REGIONS.includes(e.region)) err(id, file, `'region' ungueltig: ${e.region}`);
  if (!COORD_SOURCE.includes(e.coordSource)) err(id, file, `'coordSource' ungueltig: ${e.coordSource}`);
  if (!CONFIDENCE.includes(e.confidence)) err(id, file, `'confidence' ungueltig: ${e.confidence}`);

  if (!Array.isArray(e.coords) || e.coords.length !== 2 || e.coords.some((n) => typeof n !== 'number')) {
    err(id, file, `'coords' muss [lat, lon] als Zahlen sein.`);
  } else {
    const [lat, lon] = e.coords;
    if (lat < BBOX.minLat || lat > BBOX.maxLat || lon < BBOX.minLon || lon > BBOX.maxLon) {
      err(id, file, `coords [${lat}, ${lon}] liegen ausserhalb der Peloponnes-Bounding-Box.`);
    }
    if (e.coordSource === 'approx') {
      warn(id, file, `coordSource 'approx' – im UI muss ein sichtbarer Hinweis am Marker erscheinen.`);
    }
  }

  if (isNonEmptyString(e.summary) && e.summary.length > 200) {
    err(id, file, `'summary' hat ${e.summary.length} Zeichen (max. 200).`);
  }
  if (!isNonEmptyString(e.summary)) err(id, file, `'summary' fehlt oder leer.`);

  if (!e.touristTrapRisk || typeof e.touristTrapRisk !== 'object') {
    err(id, file, `'touristTrapRisk' fehlt.`);
  } else {
    const lvl = e.touristTrapRisk.level;
    if (!Number.isInteger(lvl) || lvl < 1 || lvl > 5) {
      err(id, file, `touristTrapRisk.level muss ganzzahlig 1-5 sein, ist '${lvl}'.`);
    }
    if (!isNonEmptyString(e.touristTrapRisk.note)) {
      err(id, file, `touristTrapRisk.note fehlt oder leer.`);
    }
  }

  if (!Array.isArray(e.nearby)) err(id, file, `'nearby' muss ein Array sein.`);
  if (!Array.isArray(e.tags)) err(id, file, `'tags' muss ein Array sein.`);
  if (!Array.isArray(e.needsVerification)) err(id, file, `'needsVerification' muss ein Array sein.`);

  if (e.confidence === 'low') {
    // Informational only – UI must render a warning badge for these.
    warn(id, file, `confidence 'low' – wird im UI mit Warn-Badge gerendert.`);
  }
}

function checkWordRange(e, file, field, min, max) {
  const val = e[field];
  if (!isNonEmptyString(val)) {
    err(e.id, file, `'${field}' fehlt oder leer.`);
    return;
  }
  const words = countWords(val);
  if (words < min || words > max) {
    err(e.id, file, `'${field}' hat ${words} Woerter (erwartet ${min}-${max}).`);
  }
}

function checkBeach(e, file, habitats) {
  const req = [
    'surface', 'seabed', 'entry', 'barefootFriendly', 'crowding', 'shade',
    'windExposure', 'hazards', 'snorkeling', 'facilities', 'access',
    'nudistTolerated', 'bestTime'
  ];
  for (const f of req) if (!(f in e)) err(e.id, file, `Strand-Pflichtfeld '${f}' fehlt.`);

  if (e.crowding) {
    if (!Number.isInteger(e.crowding.peakSeason) || e.crowding.peakSeason < 1 || e.crowding.peakSeason > 5) {
      err(e.id, file, `crowding.peakSeason muss 1-5 sein.`);
    }
    if (!Number.isInteger(e.crowding.shoulderSeason) || e.crowding.shoulderSeason < 1 || e.crowding.shoulderSeason > 5) {
      err(e.id, file, `crowding.shoulderSeason muss 1-5 sein.`);
    }
  }

  if (e.snorkeling) {
    const s = e.snorkeling;
    if (!Number.isInteger(s.rating) || s.rating < 0 || s.rating > 5) {
      err(e.id, file, `snorkeling.rating muss 0-5 sein.`);
    }
    if (!habitats.habitats || !habitats.habitats[s.habitat]) {
      err(e.id, file, `snorkeling.habitat '${s.habitat}' ist kein bekanntes Profil aus habitats.json.`);
    } else {
      const profile = habitats.habitats[s.habitat];
      for (const sp of s.speciesLikely || []) {
        if (!profile.speciesLikely.includes(sp)) {
          err(e.id, file, `speciesLikely '${sp}' ist nicht Teil des Habitat-Profils '${s.habitat}' – Arten muessen aus habitats.json abgeleitet sein, nicht frei erfunden.`);
        }
      }
      for (const sp of s.speciesCaution || []) {
        if (!profile.speciesCaution.includes(sp)) {
          err(e.id, file, `speciesCaution '${sp}' ist nicht Teil des Habitat-Profils '${s.habitat}'.`);
        }
      }
    }
  }
}

function checkSite(e, file) {
  const req = ['epoch', 'dating', 'whyItMatters', 'whatYouSee', 'terrain', 'shadeAndHeat', 'combineWith', 'ticketInfo'];
  for (const f of req) if (!(f in e)) err(e.id, file, `Staette-Pflichtfeld '${f}' fehlt.`);
  checkWordRange(e, file, 'whyItMatters', 150, 300);
  checkWordRange(e, file, 'whatYouSee', 80, 150);
  if (e.ticketInfo !== null && e.ticketInfo !== undefined) {
    warn(e.id, file, `ticketInfo ist gesetzt – sicherstellen, dass Preis/Zeiten tatsaechlich verifiziert wurden (sonst null lassen).`);
  }
}

function checkTown(e, file) {
  const req = ['character', 'historyTimeline', 'whatToDo', 'parking', 'foodScene'];
  for (const f of req) if (!(f in e)) err(e.id, file, `Stadt-Pflichtfeld '${f}' fehlt.`);
  if (e.walkingTour) checkWalkingTour(e, file);
}

function checkWalkingTour(e, file) {
  const wt = e.walkingTour;
  const req = ['title', 'durationMinutes', 'distanceKm', 'terrain', 'stops'];
  for (const f of req) if (!(f in wt)) err(e.id, file, `walkingTour-Pflichtfeld '${f}' fehlt.`);
  if (!Array.isArray(wt.stops) || wt.stops.length < 2) {
    err(e.id, file, `walkingTour.stops muss mindestens 2 Stationen enthalten.`);
    return;
  }
  wt.stops.forEach((stop, i) => {
    if (!isNonEmptyString(stop.name)) err(e.id, file, `walkingTour.stops[${i}].name fehlt oder leer.`);
    if (!isNonEmptyString(stop.note)) err(e.id, file, `walkingTour.stops[${i}].note fehlt oder leer.`);
    if (!Array.isArray(stop.coords) || stop.coords.length !== 2 || stop.coords.some((n) => typeof n !== 'number')) {
      err(e.id, file, `walkingTour.stops[${i}].coords muss [lat, lon] als Zahlen sein.`);
    } else {
      const [lat, lon] = stop.coords;
      if (lat < BBOX.minLat || lat > BBOX.maxLat || lon < BBOX.minLon || lon > BBOX.maxLon) {
        err(e.id, file, `walkingTour.stops[${i}] coords [${lat}, ${lon}] liegen ausserhalb der Peloponnes-Bounding-Box.`);
      }
    }
  });
}

function main() {
  const habitatsPath = path.join(DATA_DIR, 'habitats.json');
  const habitats = fs.existsSync(habitatsPath) ? loadJson(habitatsPath) || {} : {};

  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.json') && !['schema.json', 'habitats.json'].includes(f));

  if (files.length === 0) {
    console.log('Keine Regions-Datendateien in /data gefunden.');
  }

  const allIds = new Map(); // id -> file
  const allEntries = [];

  for (const file of files) {
    const full = path.join(DATA_DIR, file);
    const entries = loadJson(full);
    if (!Array.isArray(entries)) {
      if (entries !== null) errors.push(`[ERROR] ${file} :: Datei muss ein Array von Eintraegen sein.`);
      continue;
    }
    for (const e of entries) {
      checkBase(e, file);
      if (isNonEmptyString(e.id)) {
        if (allIds.has(e.id)) {
          err(e.id, file, `Doppelte id, bereits vergeben in ${allIds.get(e.id)}.`);
        } else {
          allIds.set(e.id, file);
        }
      }
      if (e.type === 'beach') checkBeach(e, file, habitats);
      if (e.type === 'site') checkSite(e, file);
      if (e.type === 'town') checkTown(e, file);
      allEntries.push({ entry: e, file });
    }
  }

  // Cross-reference check: nearby / combineWith should point to existing ids.
  // During early phases (batches not yet done) this is expected to be incomplete,
  // so it is a warning, not a hard error.
  for (const { entry, file } of allEntries) {
    for (const refId of entry.nearby || []) {
      if (!allIds.has(refId)) warn(entry.id, file, `nearby-Referenz '${refId}' existiert (noch) nicht.`);
    }
    for (const refId of entry.combineWith || []) {
      if (!allIds.has(refId)) warn(entry.id, file, `combineWith-Referenz '${refId}' existiert (noch) nicht.`);
    }
  }

  console.log(`Geprueft: ${allEntries.length} Eintraege in ${files.length} Dateien.\n`);

  if (warnings.length) {
    console.log(`--- ${warnings.length} Warnung(en) ---`);
    warnings.forEach((w) => console.log(w));
    console.log('');
  }

  if (errors.length) {
    console.log(`--- ${errors.length} Fehler ---`);
    errors.forEach((e) => console.log(e));
    console.log(`\nFEHLGESCHLAGEN: ${errors.length} Fehler.`);
    process.exit(1);
  }

  console.log('OK: keine Fehler.');
}

main();
