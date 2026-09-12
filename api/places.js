'use strict';

// Vercel Serverless Function: Ablage fuer selbst erfasste Orte.
//
// Gespeichert wird in data/eigene.json im Repo selbst (ueber die GitHub
// Contents-API). Damit sind die Eintraege versioniert, ohne Zusatzdienst
// gesichert und koennen spaeter mit Recherche angereichert in den
// kuratierten Bestand (data/<region>.json) uebernommen werden.
//
// Gelesen wird direkt aus der GitHub-API, nicht aus dem gebauten Bundle --
// ein neuer Ort ist deshalb sofort sichtbar und wartet nicht auf ein Deploy.
//
// Benoetigte Environment-Variablen in Vercel:
//   GUIDE_REPO           z.B. "tobiasscheid94-ui/Peleponnes"
//   GUIDE_BRANCH         Branch, in den geschrieben wird
//   GUIDE_GITHUB_TOKEN   Fine-grained Token mit Contents: Read and write
//   GUIDE_WRITE_KEY      frei gewaehltes Passwort fuer schreibende Zugriffe

const FILE_PATH = 'data/eigene.json';
const GITHUB = 'https://api.github.com';

const TYPES = ['beach', 'site', 'town', 'monastery_castle', 'hike', 'viewpoint'];
const REGIONS = ['lakonien', 'messenien', 'arkadien', 'argolis', 'korinthia', 'achaia', 'ilia'];
const BBOX = { minLon: 20.9, minLat: 36.3, maxLon: 23.4, maxLat: 38.4 };

// Obergrenzen, damit ein durchgesickerter Schreibschluessel das Repo nicht
// mit Muell volllaufen lassen kann.
const MAX_ENTRIES = 500;
const BEACH_FIELDS = ['surface', 'seabed', 'entry', 'shade', 'parking', 'access'];

function config() {
  return {
    repo: process.env.GUIDE_REPO,
    branch: process.env.GUIDE_BRANCH || 'main',
    token: process.env.GUIDE_GITHUB_TOKEN,
    writeKey: process.env.GUIDE_WRITE_KEY
  };
}

function trimStr(v, max) {
  if (typeof v !== 'string') return null;
  const s = v.trim().replace(/\s+/g, ' ');
  if (!s) return null;
  return s.length > max ? s.slice(0, max) : s;
}

function round6(n) {
  return Math.round(n * 1e6) / 1e6;
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'ort';
}

// Baut aus beliebigem Request-Body einen sauberen Eintrag: nur bekannte
// Felder, alles laengenbegrenzt. Nie den Body direkt uebernehmen.
function sanitize(body) {
  if (!body || typeof body !== 'object') return { error: 'Kein gueltiger JSON-Body.' };

  const name = trimStr(body.name, 80);
  if (!name) return { error: "Feld 'name' fehlt oder ist leer." };

  if (TYPES.indexOf(body.type) === -1) {
    return { error: "Feld 'type' ist ungueltig (erlaubt: " + TYPES.join(', ') + ').' };
  }

  const coords = body.coords;
  const valid = Array.isArray(coords) && coords.length === 2 &&
    coords.every((n) => typeof n === 'number' && isFinite(n));
  if (!valid) return { error: "Feld 'coords' muss [lat, lon] als Zahlen enthalten." };
  const lat = coords[0];
  const lon = coords[1];
  if (lat < BBOX.minLat || lat > BBOX.maxLat || lon < BBOX.minLon || lon > BBOX.maxLon) {
    return { error: 'Koordinaten liegen ausserhalb der Peloponnes.' };
  }

  const entry = {
    name: name,
    nameGr: trimStr(body.nameGr, 80),
    type: body.type,
    region: REGIONS.indexOf(body.region) === -1 ? null : body.region,
    coords: [round6(lat), round6(lon)],
    coordSource: body.coordSource === 'exact' ? 'exact' : 'approx',
    summary: trimStr(body.summary, 200),
    notes: trimStr(body.notes, 2000),
    tags: Array.isArray(body.tags)
      ? body.tags.map((t) => trimStr(t, 24)).filter(Boolean).slice(0, 12)
      : [],
    source: 'user'
  };

  if (body.type === 'beach' && body.beach && typeof body.beach === 'object') {
    const beach = {};
    let any = false;
    for (const field of BEACH_FIELDS) {
      const v = trimStr(body.beach[field], 80);
      if (v) { beach[field] = v; any = true; }
    }
    const rating = body.beach.snorkelRating;
    if (Number.isInteger(rating) && rating >= 0 && rating <= 5) {
      beach.snorkelRating = rating;
      any = true;
    }
    if (any) entry.beach = beach;
  }

  return { entry: entry };
}

async function github(path, options) {
  const cfg = config();
  const res = await fetch(GITHUB + path, Object.assign({}, options, {
    headers: Object.assign({
      Authorization: 'Bearer ' + cfg.token,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'peloponnes-guide'
    }, (options && options.headers) || {})
  }));
  return res;
}

// Liest data/eigene.json. Fehlt die Datei noch, ist das kein Fehler --
// dann gibt es eben noch keine eigenen Orte.
async function readFile() {
  const cfg = config();
  const path = '/repos/' + cfg.repo + '/contents/' + FILE_PATH +
    '?ref=' + encodeURIComponent(cfg.branch) + '&t=' + Date.now();
  const res = await github(path, { method: 'GET' });

  if (res.status === 404) return { entries: [], sha: null };
  if (!res.ok) throw new Error('GitHub-Lesefehler ' + res.status + ': ' + (await res.text()).slice(0, 200));

  const json = await res.json();
  const raw = Buffer.from(json.content || '', 'base64').toString('utf8');
  let entries;
  try {
    entries = JSON.parse(raw);
  } catch (e) {
    throw new Error('data/eigene.json ist kein gueltiges JSON.');
  }
  if (!Array.isArray(entries)) throw new Error('data/eigene.json muss ein Array sein.');
  return { entries: entries, sha: json.sha };
}

async function writeFile(entries, sha, message) {
  const cfg = config();
  const body = {
    message: message,
    content: Buffer.from(JSON.stringify(entries, null, 2) + '\n', 'utf8').toString('base64'),
    branch: cfg.branch
  };
  if (sha) body.sha = sha;

  const res = await github('/repos/' + cfg.repo + '/contents/' + FILE_PATH, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res;
}

// Schreiben mit Konfliktschutz: GitHub lehnt ein PUT mit veraltetem sha ab.
// Dann einmal neu lesen, Aenderung erneut anwenden, nochmal schreiben.
async function mutate(message, apply) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const current = await readFile();
    const result = apply(current.entries);
    if (result.error) return result;

    const res = await writeFile(result.entries, current.sha, message);
    if (res.ok) return result;
    if (res.status !== 409 && res.status !== 422) {
      throw new Error('GitHub-Schreibfehler ' + res.status + ': ' + (await res.text()).slice(0, 200));
    }
  }
  return { error: 'Schreibkonflikt -- bitte erneut versuchen.' };
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch (e) { return null; }
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return null;
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch (e) { return null; }
}

module.exports = async function handler(req, res) {
  const cfg = config();
  res.setHeader('Cache-Control', 'no-store');

  if (!cfg.repo || !cfg.token || !cfg.writeKey) {
    res.status(503).json({ error: 'Server ist nicht konfiguriert (Environment-Variablen fehlen).' });
    return;
  }

  // Lesen ist offen -- der Guide ist ohnehin oeffentlich erreichbar.
  // Schreiben braucht den Schluessel, sonst traegt hier irgendwann ein Bot ein.
  if (req.method !== 'GET') {
    const provided = req.headers['x-guide-key'];
    if (!provided || provided !== cfg.writeKey) {
      res.status(401).json({ error: 'Schreibschluessel fehlt oder ist falsch.' });
      return;
    }
  }

  try {
    if (req.method === 'GET') {
      const current = await readFile();
      res.status(200).json({ entries: current.entries });
      return;
    }

    if (req.method === 'POST') {
      const body = await readBody(req);
      const clean = sanitize(body);
      if (clean.error) { res.status(400).json({ error: clean.error }); return; }

      const outcome = await mutate('Eigener Ort: ' + clean.entry.name, function (entries) {
        if (entries.length >= MAX_ENTRIES) {
          return { error: 'Maximale Anzahl eigener Orte erreicht (' + MAX_ENTRIES + ').' };
        }
        const taken = new Set(entries.map(function (e) { return e.id; }));
        let id;
        do {
          id = 'eigen-' + slugify(clean.entry.name) + '-' + Math.random().toString(36).slice(2, 6);
        } while (taken.has(id));

        const now = new Date().toISOString();
        const entry = Object.assign({ id: id }, clean.entry, { createdAt: now, updatedAt: now });
        return { entries: entries.concat([entry]), entry: entry };
      });

      if (outcome.error) { res.status(409).json({ error: outcome.error }); return; }
      res.status(201).json({ entry: outcome.entry });
      return;
    }

    if (req.method === 'PUT') {
      const body = await readBody(req);
      const id = body && trimStr(body.id, 80);
      if (!id) { res.status(400).json({ error: "Feld 'id' fehlt." }); return; }
      const clean = sanitize(body);
      if (clean.error) { res.status(400).json({ error: clean.error }); return; }

      const outcome = await mutate('Eigener Ort geaendert: ' + clean.entry.name, function (entries) {
        const idx = entries.findIndex(function (e) { return e.id === id; });
        if (idx === -1) return { error: 'Ort nicht gefunden.' };
        const entry = Object.assign({}, entries[idx], clean.entry, {
          id: id,
          createdAt: entries[idx].createdAt,
          updatedAt: new Date().toISOString()
        });
        const next = entries.slice();
        next[idx] = entry;
        return { entries: next, entry: entry };
      });

      if (outcome.error) { res.status(404).json({ error: outcome.error }); return; }
      res.status(200).json({ entry: outcome.entry });
      return;
    }

    if (req.method === 'DELETE') {
      const body = await readBody(req);
      const id = body && trimStr(body.id, 80);
      if (!id) { res.status(400).json({ error: "Feld 'id' fehlt." }); return; }

      const outcome = await mutate('Eigener Ort geloescht: ' + id, function (entries) {
        const next = entries.filter(function (e) { return e.id !== id; });
        if (next.length === entries.length) return { error: 'Ort nicht gefunden.' };
        return { entries: next };
      });

      if (outcome.error) { res.status(404).json({ error: outcome.error }); return; }
      res.status(200).json({ ok: true });
      return;
    }

    res.setHeader('Allow', 'GET, POST, PUT, DELETE');
    res.status(405).json({ error: 'Methode nicht erlaubt.' });
  } catch (e) {
    res.status(502).json({ error: String((e && e.message) || e) });
  }
};
