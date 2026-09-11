// Peloponnes-Guide — Karten-Shell (Phase 1).
// Bindet Karte, Layer-Umschaltung, Cluster, Bottom Sheet, Filter, Suche und
// Favoriten. Datenquelle ist window.PELOPONNES_DATA / window.PELOPONNES_HABITATS;
// build.js injiziert diese Variablen mit dem echten Content vor diesem Script.
// Ohne injizierte Daten (lokale Entwicklung von src/index.html) greift der
// Dummy-Datensatz unten.

// Diagnose-Fallback: manche eingebetteten Vorschauen (Dateien-App Quick Look,
// Chat-Dateivorschauen) rendern die Seite in restriktiveren WebView-Kontexten.
// Falls irgendwo ein unbehandelter Fehler auftritt, wird er sichtbar auf der
// Seite angezeigt statt stumm zu einer leeren Karte zu fuehren.
(function () {
  function showFatalError(message) {
    var el = document.getElementById('map');
    if (!el) return;
    el.innerHTML = '<div style="position:absolute;inset:0;display:flex;align-items:center;' +
      'justify-content:center;padding:24px;background:#f4f1ea;color:#a0442c;' +
      'font-family:-apple-system,sans-serif;font-size:14px;text-align:center;">' +
      'Fehler beim Laden der Karte:<br>' + String(message).replace(/</g, '&lt;') + '</div>';
  }
  window.addEventListener('error', function (ev) {
    showFatalError((ev && ev.message) || 'Unbekannter Fehler');
  });
  window.addEventListener('unhandledrejection', function (ev) {
    showFatalError((ev && ev.reason && ev.reason.message) || 'Unbekannte Promise-Ablehnung');
  });
})();

// BUILD:STRIP-START — von build.js aus dist/ entfernt, da nur fuer lokale UI-Entwicklung ohne echten Content.
if (typeof window.PELOPONNES_DATA === 'undefined') {
  window.PELOPONNES_HABITATS = {
    habitats: {
      sandflach: { name: 'Sandflach', speciesLikely: ['Ährenfische'], speciesCaution: ['Petermännchen'] },
      felskueste: { name: 'Felsküste', speciesLikely: ['Geißbrassen', 'Lippfische'], speciesCaution: ['Drachenkopf', 'Seeigel'] }
    },
    disclaimerUI: 'Habitat-typische Arten, keine Sichtungsgarantie.'
  };

  window.PELOPONNES_DATA = [
    { id: 'dummy-beach-messenien', name: 'Dummy Strand Messenien', nameGr: '', type: 'beach', region: 'messenien',
      coords: [36.95, 21.90], coordSource: 'approx', summary: 'Platzhalter-Strandeintrag zum Testen der UI-Mechanik.',
      timeNeeded: '1 Std.', touristTrapRisk: { level: 2, note: 'Platzhalter.' }, nearby: [], tags: ['schnorcheln', 'sandstrand'],
      confidence: 'high', needsVerification: [],
      surface: 'feiner Sand', seabed: 'Sand', entry: 'flach abfallend', barefootFriendly: true,
      crowding: { peakSeason: 3, shoulderSeason: 1, timeOfDayNote: null }, shade: 'kein Schatten',
      windExposure: 'Platzhaltertext.', hazards: [],
      snorkeling: { rating: 2, habitat: 'sandflach', visibility: null, speciesLikely: ['Ährenfische'], speciesCaution: ['Petermännchen'] },
      facilities: { sunbeds: 'keine', taverna: 'keine', wc: null, freshwater: null, parking: null },
      access: { mode: 'direkt am Parkplatz', minutesFromParking: 2, roadQuality: null, difficulty: 'leicht' },
      nudistTolerated: null, bestTime: 'Platzhalter.', history: null },

    { id: 'dummy-beach-lakonien', name: 'Dummy Strand Lakonien', nameGr: '', type: 'beach', region: 'lakonien',
      coords: [36.75, 22.55], coordSource: 'approx', summary: 'Platzhalter mit niedriger Konfidenz zum Testen des Warn-Badges.',
      timeNeeded: '45 Min.', touristTrapRisk: { level: 1, note: 'Platzhalter.' }, nearby: [], tags: ['ruhig'],
      confidence: 'low', needsVerification: ['Zufahrt', 'Parkmöglichkeit', 'Aktueller Strandzustand'],
      surface: 'Kiesel', seabed: 'Fels', entry: 'Felseinstieg', barefootFriendly: false,
      crowding: { peakSeason: 2, shoulderSeason: 1, timeOfDayNote: null }, shade: 'Felswand vormittags',
      windExposure: 'Platzhaltertext.', hazards: ['Seeigel'],
      snorkeling: { rating: 4, habitat: 'felskueste', visibility: null, speciesLikely: ['Geißbrassen', 'Lippfische'], speciesCaution: ['Drachenkopf', 'Seeigel'] },
      facilities: { sunbeds: 'keine', taverna: 'keine', wc: null, freshwater: null, parking: null },
      access: { mode: 'Fussweg', minutesFromParking: 15, roadQuality: null, difficulty: 'mittel' },
      nudistTolerated: null, bestTime: 'Platzhalter.', history: null },

    { id: 'dummy-beach-achaia', name: 'Dummy Strand Achaia', nameGr: '', type: 'beach', region: 'achaia',
      coords: [38.15, 21.75], coordSource: 'approx', summary: 'Platzhalter-Strandeintrag.',
      timeNeeded: '1–2 Std.', touristTrapRisk: { level: 3, note: 'Platzhalter.' }, nearby: [], tags: ['sandstrand', 'sonnenuntergang'],
      confidence: 'medium', needsVerification: ['Parkgebühr'],
      surface: 'grober Sand', seabed: 'Sand', entry: 'flach abfallend', barefootFriendly: true,
      crowding: { peakSeason: 4, shoulderSeason: 2, timeOfDayNote: null }, shade: 'Tamarisken',
      windExposure: 'Platzhaltertext.', hazards: [],
      snorkeling: { rating: 1, habitat: 'sandflach', visibility: null, speciesLikely: ['Ährenfische'], speciesCaution: [] },
      facilities: { sunbeds: 'wenige', taverna: 'eine am Zugang', wc: null, freshwater: null, parking: null },
      access: { mode: 'direkt am Parkplatz', minutesFromParking: 1, roadQuality: null, difficulty: 'leicht' },
      nudistTolerated: null, bestTime: 'Platzhalter.', history: null },

    { id: 'dummy-site-argolis', name: 'Dummy Stätte Argolis', nameGr: '', type: 'site', region: 'argolis',
      coords: [37.60, 22.70], coordSource: 'approx', summary: 'Platzhalter-Stätteneintrag zum Testen der UI-Mechanik.',
      timeNeeded: '1 Std.', touristTrapRisk: { level: 2, note: 'Platzhalter.' }, nearby: [], tags: ['antike'],
      confidence: 'high', needsVerification: [],
      epoch: ['klassisch'], dating: 'Platzhalter-Datierung.',
      whyItMatters: 'Platzhaltertext, der die historische Bedeutung erklaeren wuerde. Dient hier ausschliesslich dem Layout-Test des Bottom Sheets mit einem laengeren Absatz aehnlicher Zeilenzahl wie echte Inhalte spaeter haben werden.',
      whatYouSee: 'Platzhaltertext zur Beschreibung der sichtbaren Ruinenreste vor Ort, ebenfalls nur zu Layout-Testzwecken.',
      walkthrough: [{ stop: 'Eingang', note: 'Platzhalter.' }], museumOnSite: false,
      terrain: 'Platzhalter.', shadeAndHeat: 'Platzhalter.', misconceptions: null, readingHooks: null,
      combineWith: [], ticketInfo: null },

    { id: 'dummy-site-korinthia', name: 'Dummy Stätte Korinthia', nameGr: '', type: 'site', region: 'korinthia',
      coords: [37.90, 22.88], coordSource: 'approx', summary: 'Platzhalter-Stätteneintrag.',
      timeNeeded: '1,5 Std.', touristTrapRisk: { level: 3, note: 'Platzhalter.' }, nearby: [], tags: ['antike', 'unesco'],
      confidence: 'medium', needsVerification: ['Öffnungszeiten'],
      epoch: ['roemisch'], dating: 'Platzhalter-Datierung.',
      whyItMatters: 'Platzhaltertext zur historischen Einordnung, nur zu Testzwecken im Rahmen der Karten-Shell dieser Phase.',
      whatYouSee: 'Platzhaltertext zur Beschreibung des heutigen Zustands.',
      walkthrough: [], museumOnSite: true,
      terrain: 'Platzhalter.', shadeAndHeat: 'Platzhalter.', misconceptions: null, readingHooks: null,
      combineWith: [], ticketInfo: null },

    { id: 'dummy-town-argolis', name: 'Dummy Stadt Argolis', nameGr: '', type: 'town', region: 'argolis',
      coords: [37.55, 22.80], coordSource: 'approx', summary: 'Platzhalter-Stadteintrag zum Testen der UI-Mechanik.',
      timeNeeded: 'Halber Tag', touristTrapRisk: { level: 4, note: 'Platzhalter.' }, nearby: [], tags: ['spazieren'],
      confidence: 'medium', needsVerification: ['Parkregelung'],
      character: 'Platzhaltertext zur Beschreibung des Orts-Charakters.',
      historyTimeline: [{ period: 'Platzhalter-Periode', note: 'Platzhalter.' }],
      whatToDo: ['Platzhalter-Aktivität'], parking: 'Platzhalter.', foodScene: 'Platzhaltertext.' },

    { id: 'dummy-town-ilia', name: 'Dummy Stadt Ilia', nameGr: '', type: 'town', region: 'ilia',
      coords: [37.65, 21.35], coordSource: 'approx', summary: 'Platzhalter-Stadteintrag.',
      timeNeeded: 'Ganzer Tag', touristTrapRisk: { level: 2, note: 'Platzhalter.' }, nearby: [], tags: ['hafenstadt'],
      confidence: 'high', needsVerification: [],
      character: 'Platzhaltertext.', historyTimeline: [], whatToDo: ['Platzhalter-Aktivität'],
      parking: 'Platzhalter.', foodScene: 'Platzhaltertext.' },

    { id: 'dummy-monastery-arkadien', name: 'Dummy Kloster Arkadien', nameGr: '', type: 'monastery_castle', region: 'arkadien',
      coords: [37.40, 22.20], coordSource: 'approx', summary: 'Platzhalter-Kloster/Burg-Eintrag.',
      timeNeeded: '1 Std.', touristTrapRisk: { level: 2, note: 'Platzhalter.' }, nearby: [], tags: ['byzantinisch'],
      confidence: 'medium', needsVerification: ['Öffnungszeiten'],
      epoch: ['byzantinisch'], dating: 'Platzhalter.', whyItMatters: 'Platzhaltertext.', whatYouSee: 'Platzhaltertext.',
      terrain: 'Platzhalter.', shadeAndHeat: null, combineWith: [], ticketInfo: null },

    { id: 'dummy-hike-arkadien', name: 'Dummy Wanderung Arkadien', nameGr: '', type: 'hike', region: 'arkadien',
      coords: [37.45, 22.25], coordSource: 'approx', summary: 'Platzhalter-Wandereintrag.',
      timeNeeded: '2,5 Std.', touristTrapRisk: { level: 1, note: 'Platzhalter.' }, nearby: [], tags: ['schlucht'],
      confidence: 'low', needsVerification: ['Wegmarkierung', 'Wasserstellen'],
      difficulty: 'mittel', distanceKm: 6.5, durationHours: '2,5–3 Std.', elevationGainM: 250,
      terrain: 'Platzhalter.', waymarking: null, waterAvailable: null, bestTime: 'Platzhalter.' },

    { id: 'dummy-viewpoint-lakonien', name: 'Dummy Aussichtspunkt Lakonien', nameGr: '', type: 'viewpoint', region: 'lakonien',
      coords: [36.80, 22.60], coordSource: 'approx', summary: 'Platzhalter-Aussichtspunkt.',
      timeNeeded: '20 Min.', touristTrapRisk: { level: 1, note: 'Platzhalter.' }, nearby: [], tags: ['sonnenuntergang'],
      confidence: 'high', needsVerification: [],
      access: { mode: 'direkt am Parkplatz', minutesFromParking: 2, roadQuality: null, difficulty: 'leicht' },
      bestTime: 'Platzhalter.', sunsetSunrise: null }
  ];
}
// BUILD:STRIP-END

(function () {
  'use strict';

  var CLUSTER_THRESHOLD = 30;
  var CLUSTER_CELL_PX = 60;
  var PELOPONNES_BBOX = { minLon: 20.9, minLat: 36.3, maxLon: 23.4, maxLat: 38.4 };

  var TYPE_LABELS = {
    beach: 'Strand', site: 'Stätte', town: 'Stadt',
    monastery_castle: 'Kloster/Burg', hike: 'Wanderung', viewpoint: 'Aussichtspunkt'
  };
  var REGION_LABELS = {
    lakonien: 'Lakonien', messenien: 'Messenien', arkadien: 'Arkadien', argolis: 'Argolis',
    korinthia: 'Korinthia', achaia: 'Achaia', ilia: 'Ilia'
  };
  var TYPE_COLORS = {
    beach: '#2f7f9e', site: '#8a6d3b', town: '#a0442c',
    monastery_castle: '#5c5c66', hike: '#3f7d3a', viewpoint: '#6a4c93'
  };
  var TYPE_GLYPHS = {
    beach: '<path d="M9 12.5c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M9 16.5c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
    site: '<path d="M9 19h16M9 19V9M25 19V9M9 9h16M12 9v10M17 9v10M22 9v10" stroke="#fff" stroke-width="1.4" fill="none" stroke-linejoin="round"/>',
    town: '<path d="M9 19v-6L17 7l8 6v6z M13.5 19v-5h3v5" stroke="#fff" stroke-width="1.5" fill="none" stroke-linejoin="round"/>',
    monastery_castle: '<path d="M9 19v-6h3v-2h2v2h3v-2h2v2h3v-2h2v2h3v6z" stroke="#fff" stroke-width="1.4" fill="none" stroke-linejoin="round"/>',
    hike: '<path d="M7.5 19l5-8 3 4 3-6 5.5 10" stroke="#fff" stroke-width="1.6" fill="none" stroke-linejoin="round" stroke-linecap="round"/>',
    viewpoint: '<path d="M8 13c3-4 15-4 18 0-3 4-15 4-18 0z" stroke="#fff" stroke-width="1.4" fill="none"/><circle cx="17" cy="13" r="2.2" fill="#fff"/>'
  };
  var PIN_PATH = 'M17 1C9.8 1 4 6.8 4 14c0 9.5 13 19 13 19s13-9.5 13-19C30 6.8 24.2 1 17 1z';

  // ---------- Utilities ----------

  function normalizeText(str) {
    if (!str) return '';
    return String(str)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');
  }

  function haversineKm(a, b) {
    var R = 6371;
    var dLat = ((b[0] - a[0]) * Math.PI) / 180;
    var dLon = ((b[1] - a[1]) * Math.PI) / 180;
    var lat1 = (a[0] * Math.PI) / 180;
    var lat2 = (b[0] * Math.PI) / 180;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  function debounce(fn, ms) {
    var t = null;
    return function () {
      var args = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(null, args); }, ms);
    };
  }

  // ---------- Storage (file:// kann localStorage blockieren) ----------

  var memoryStore = {};
  var storageAvailable = (function () {
    try {
      var k = '__peloponnes_probe__';
      window.localStorage.setItem(k, '1');
      window.localStorage.removeItem(k);
      return true;
    } catch (e) {
      return false;
    }
  })();

  function storageGet(key) {
    try {
      if (storageAvailable) return window.localStorage.getItem(key);
    } catch (e) { /* fall through to memory */ }
    return Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : null;
  }
  function storageSet(key, val) {
    try {
      if (storageAvailable) { window.localStorage.setItem(key, val); return; }
    } catch (e) { /* fall through to memory */ }
    memoryStore[key] = val;
  }

  // ---------- State ----------

  var state = {
    types: new Set(),
    regions: new Set(),
    maxTrap: null,
    tags: new Set(),
    search: '',
    radius: null // { center: [lat, lon], km: number }
  };

  var favorites = new Set();
  (function loadFavorites() {
    try {
      var raw = storageGet('peloponnes:favorites');
      if (raw) JSON.parse(raw).forEach(function (id) { favorites.add(id); });
    } catch (e) { /* ignore corrupt storage */ }
  })();
  function persistFavorites() {
    storageSet('peloponnes:favorites', JSON.stringify(Array.from(favorites)));
  }

  // visits: entryId -> { rating: 1-5, visitedAt: ISO-String }
  var visits = {};
  (function loadVisits() {
    try {
      var raw = storageGet('peloponnes:visits');
      if (raw) visits = JSON.parse(raw) || {};
    } catch (e) { /* ignore corrupt storage */ }
  })();
  function persistVisits() {
    storageSet('peloponnes:visits', JSON.stringify(visits));
  }
  function setRating(id, rating) {
    if (rating === null) {
      delete visits[id];
    } else {
      visits[id] = { rating: rating, visitedAt: (visits[id] && visits[id].visitedAt) || new Date().toISOString() };
    }
    persistVisits();
  }

  function encodeHash() {
    var parts = [];
    if (state.types.size) parts.push('t=' + Array.from(state.types).join(','));
    if (state.regions.size) parts.push('r=' + Array.from(state.regions).join(','));
    if (state.maxTrap) parts.push('tt=' + state.maxTrap);
    if (state.tags.size) parts.push('tag=' + Array.from(state.tags).join(','));
    if (state.search) parts.push('q=' + encodeURIComponent(state.search));
    return parts.join(';');
  }
  function writeHash() {
    var hash = encodeHash();
    if (hash) window.location.hash = hash;
    else if (window.location.hash) history.replaceState(null, '', window.location.pathname + window.location.search);
  }
  function readHash() {
    var raw = window.location.hash.replace(/^#/, '');
    if (!raw) return;
    raw.split(';').forEach(function (part) {
      var eq = part.indexOf('=');
      if (eq < 0) return;
      var key = part.slice(0, eq);
      var val = part.slice(eq + 1);
      if (key === 't' && val) val.split(',').forEach(function (v) { state.types.add(v); });
      if (key === 'r' && val) val.split(',').forEach(function (v) { state.regions.add(v); });
      if (key === 'tt' && val) state.maxTrap = parseInt(val, 10) || null;
      if (key === 'tag' && val) val.split(',').forEach(function (v) { state.tags.add(v); });
      if (key === 'q' && val) state.search = decodeURIComponent(val);
    });
  }

  // ---------- Icons ----------

  function buildDivIcon(entry) {
    var color = TYPE_COLORS[entry.type] || '#444';
    var glyph = TYPE_GLYPHS[entry.type] || '';
    var favClass = favorites.has(entry.id) ? ' is-favorite' : '';
    var html = '<svg viewBox="0 0 34 34" width="34" height="34">' +
      '<path d="' + PIN_PATH + '" fill="' + color + '"/>' + glyph + '</svg>';
    return L.divIcon({
      html: html,
      className: 'peloponnes-marker' + favClass,
      iconSize: [34, 34],
      iconAnchor: [17, 33],
      popupAnchor: [0, -30]
    });
  }

  function buildClusterIcon(count) {
    return L.divIcon({
      html: '<div class="peloponnes-cluster">' + count + '</div>',
      className: 'peloponnes-cluster-wrap',
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });
  }

  // ---------- Map & Layer-Logik (online/offline) ----------

  var bounds = L.latLngBounds(
    [PELOPONNES_BBOX.minLat, PELOPONNES_BBOX.minLon],
    [PELOPONNES_BBOX.maxLat, PELOPONNES_BBOX.maxLon]
  );

  var map = L.map('map', { zoomControl: true, attributionControl: true, tap: true });
  map.fitBounds(bounds);

  // Manche eingebetteten WebViews (Quick-Look-Vorschauen, Chat-Dateivorschauen)
  // liefern beim ersten Layout noch keine endgueltige Containergroesse.
  // invalidateSize() nach Resize/Orientierungswechsel/kurzer Verzoegerung
  // verhindert eine leer bleibende Karte in solchen Faellen.
  setTimeout(function () { map.invalidateSize(); }, 200);
  window.addEventListener('resize', function () { map.invalidateSize(); });
  window.addEventListener('orientationchange', function () { setTimeout(function () { map.invalidateSize(); }, 200); });

  var onlineLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende'
  });

  var offlineLayer = L.layerGroup(); // Phase 2 füllt dies aus geo/basemap.geojson.
  var offlineAttribution = 'Offline-Basiskarte: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende (ODbL)';
  if (window.PELOPONNES_BASEMAP) {
    try {
      var basemapProps = window.PELOPONNES_BASEMAP.properties || {};
      if (basemapProps.source) {
        offlineAttribution = 'Offline-Basiskarte: ' + basemapProps.source +
          (basemapProps.license ? ' (' + basemapProps.license + ')' : '');
      }
      L.geoJSON(window.PELOPONNES_BASEMAP, {
        style: { color: '#8a6d3b', weight: 1, fillColor: '#e8e0cf', fillOpacity: 1 }
      }).addTo(offlineLayer);
    } catch (e) { /* Basemap fehlt oder ist fehlerhaft -- Offline-Layer bleibt dann leer. */ }
  }

  var offlineBanner = document.getElementById('offline-banner');
  var usingOffline = false;
  var tileErrorTimer = null;

  function activateOffline() {
    if (usingOffline) return;
    usingOffline = true;
    if (map.hasLayer(onlineLayer)) map.removeLayer(onlineLayer);
    if (!map.hasLayer(offlineLayer)) offlineLayer.addTo(map);
    map.attributionControl.addAttribution(offlineAttribution);
    if (offlineBanner) offlineBanner.hidden = false;
  }
  function activateOnline() {
    usingOffline = false;
    if (map.hasLayer(offlineLayer)) map.removeLayer(offlineLayer);
    if (!map.hasLayer(onlineLayer)) onlineLayer.addTo(map);
    map.attributionControl.removeAttribution(offlineAttribution);
    if (offlineBanner) offlineBanner.hidden = true;
  }

  onlineLayer.on('tileerror', function () {
    if (tileErrorTimer) return;
    tileErrorTimer = setTimeout(function () {
      tileErrorTimer = null;
      activateOffline();
    }, 2500);
  });
  onlineLayer.on('tileload', function () {
    if (tileErrorTimer) { clearTimeout(tileErrorTimer); tileErrorTimer = null; }
  });

  if (navigator.onLine === false) {
    activateOffline();
  } else {
    activateOnline();
  }
  window.addEventListener('online', activateOnline);
  window.addEventListener('offline', activateOffline);

  var markerLayer = L.layerGroup().addTo(map);

  // ---------- Daten ----------

  var allEntries = (window.PELOPONNES_DATA || []).slice();
  var entriesById = {};
  allEntries.forEach(function (e) { entriesById[e.id] = e; });
  var habitats = (window.PELOPONNES_HABITATS && window.PELOPONNES_HABITATS.habitats) || {};
  var habitatsDisclaimer = (window.PELOPONNES_HABITATS && window.PELOPONNES_HABITATS.disclaimerUI) ||
    'Habitat-typische Arten, keine Sichtungsgarantie.';
  var allRoutes = (window.PELOPONNES_ROUTES || []).slice();
  var routesById = {};
  allRoutes.forEach(function (r) { routesById[r.id] = r; });

  function matchesFilters(entry) {
    if (state.types.size && !state.types.has(entry.type)) return false;
    if (state.regions.size && !state.regions.has(entry.region)) return false;
    if (state.maxTrap && entry.touristTrapRisk && entry.touristTrapRisk.level > state.maxTrap) return false;
    if (state.tags.size) {
      var has = (entry.tags || []).some(function (t) { return state.tags.has(t); });
      if (!has) return false;
    }
    if (state.search) {
      var needle = normalizeText(state.search);
      var haystack = normalizeText(
        [entry.name, entry.nameGr, REGION_LABELS[entry.region], TYPE_LABELS[entry.type]]
          .concat(entry.tags || []).join(' ')
      );
      if (haystack.indexOf(needle) === -1) return false;
    }
    if (state.radius) {
      var d = haversineKm(state.radius.center, entry.coords);
      if (d > state.radius.km) return false;
    }
    return true;
  }

  function visibleEntries() {
    return allEntries.filter(matchesFilters);
  }

  // ---------- Merkmale, Aehnlichkeit, Empfehlungen ----------
  // Merkmalsbasierte Aehnlichkeit statt Blackbox-Score: jeder Eintrag wird auf
  // eine Menge einfacher Merkmal-Strings abgebildet (Tags plus typspezifische
  // Felder). Aehnlichkeit = Groesse der Schnittmenge zweier Merkmalsmengen.

  function featureSet(e) {
    var f = [];
    (e.tags || []).forEach(function (t) { f.push('tag:' + t); });
    f.push('region:' + e.region);
    if (e.type === 'beach') {
      if (e.seabed) f.push('seabed:' + e.seabed);
      if (e.shade) f.push('shade:' + e.shade);
      if (e.access && e.access.difficulty) f.push('difficulty:' + e.access.difficulty);
      if (e.snorkeling && e.snorkeling.habitat) f.push('habitat:' + e.snorkeling.habitat);
    } else if (e.type === 'site' || e.type === 'monastery_castle') {
      (e.epoch || []).forEach(function (ep) { f.push('epoch:' + ep); });
    } else if (e.type === 'hike') {
      if (e.difficulty) f.push('difficulty:' + e.difficulty);
    } else if (e.type === 'town') {
      // Tags und Region tragen hier das Hauptsignal.
    }
    return f;
  }

  function sharedFeatures(a, b) {
    var setB = {};
    featureSet(b).forEach(function (f) { setB[f] = true; });
    var shared = featureSet(a).filter(function (f) { return setB[f]; });
    // Verschiedene Merkmal-Praefixe koennen auf denselben Anzeigetext abbilden
    // (z. B. tag:mykenisch und epoch:mykenisch) -- fuer Begruendungstexte nach
    // Anzeigetext deduplizieren, damit nicht derselbe Begriff doppelt auftaucht.
    var seenLabels = {};
    return shared.filter(function (f) {
      var label = humanizeFeature(f);
      if (seenLabels[label]) return false;
      seenLabels[label] = true;
      return true;
    });
  }

  function humanizeFeature(f) {
    var parts = f.split(':');
    var key = parts[0], val = parts.slice(1).join(':');
    if (key === 'tag') return val;
    if (key === 'region') return REGION_LABELS[val] || val;
    if (key === 'seabed') return 'Meeresboden ' + val;
    if (key === 'shade') return val;
    if (key === 'difficulty') return 'Schwierigkeit ' + val;
    if (key === 'habitat') return (habitats[val] && habitats[val].name) || val;
    if (key === 'epoch') return val;
    return val;
  }

  function similarEntries(entry, limit) {
    var candidates = allEntries.filter(function (e) { return e.id !== entry.id && e.type === entry.type; });
    var scored = candidates.map(function (e) {
      return { entry: e, shared: sharedFeatures(entry, e) };
    }).filter(function (s) { return s.shared.length > 0; });
    scored.sort(function (a, b) { return b.shared.length - a.shared.length; });
    return scored.slice(0, limit || 3);
  }

  // Empfehlungen: Geschmacksprofil pro Typ aus bewerteten Eintraegen ableiten
  // (Gewicht = Bewertung - 3, also -2..+2), unbewertete Eintraege desselben
  // Typs danach bepunkten. Kein Rankingmysterium: jede Empfehlung nennt ihre
  // staerksten Bezugspunkte unter den bewerteten Orten.
  function ratedEntries() {
    return Object.keys(visits).map(function (id) {
      var e = entriesById[id];
      if (!e) return null;
      return { entry: e, rating: visits[id].rating };
    }).filter(Boolean);
  }

  function buildTasteProfiles() {
    var byType = {};
    ratedEntries().forEach(function (r) {
      var type = r.entry.type;
      if (!byType[type]) byType[type] = { weights: {}, exemplars: [], trapLevels: [] };
      var weight = r.rating - 3;
      featureSet(r.entry).forEach(function (f) {
        byType[type].weights[f] = (byType[type].weights[f] || 0) + weight;
      });
      byType[type].exemplars.push(r);
      if (r.rating >= 4 && r.entry.touristTrapRisk) byType[type].trapLevels.push(r.entry.touristTrapRisk.level);
    });
    return byType;
  }

  function recommendations(maxTotal) {
    var totalRatings = Object.keys(visits).length;
    if (totalRatings < 3) return { ready: false, items: [] };

    var profiles = buildTasteProfiles();
    var visitedIds = {};
    Object.keys(visits).forEach(function (id) { visitedIds[id] = true; });
    var items = [];

    Object.keys(profiles).forEach(function (type) {
      var profile = profiles[type];
      var trapCap = profile.trapLevels.length
        ? Math.max.apply(null, profile.trapLevels) + 1
        : 5;
      var candidates = allEntries.filter(function (e) { return e.type === type && !visitedIds[e.id]; });
      var scored = candidates.map(function (e) {
        var score = 0;
        featureSet(e).forEach(function (f) { score += profile.weights[f] || 0; });
        if (e.touristTrapRisk && e.touristTrapRisk.level > trapCap) score -= 3;
        return { entry: e, score: score };
      }).filter(function (s) { return s.score > 0; });
      scored.sort(function (a, b) { return b.score - a.score; });

      scored.slice(0, 2).forEach(function (s) {
        // Staerkste Bezugspunkte: bewertete Exemplare mit den meisten geteilten Merkmalen.
        var exemplarScores = profile.exemplars.map(function (ex) {
          return { ex: ex, shared: sharedFeatures(s.entry, ex.entry) };
        }).filter(function (x) { return x.shared.length > 0; });
        exemplarScores.sort(function (a, b) { return b.shared.length - a.shared.length; });
        var top = exemplarScores.slice(0, 2);
        items.push({ entry: s.entry, reasonExemplars: top });
      });
    });

    items.sort(function (a, b) {
      return (b.reasonExemplars[0] ? b.reasonExemplars[0].shared.length : 0) -
        (a.reasonExemplars[0] ? a.reasonExemplars[0].shared.length : 0);
    });
    return { ready: true, items: items.slice(0, maxTotal || 6) };
  }

  // ---------- Clustering (eigenes, einfaches Grid-Verfahren) ----------

  function groupIntoClusters(entries) {
    if (entries.length <= CLUSTER_THRESHOLD) {
      return entries.map(function (e) { return { kind: 'single', entry: e }; });
    }
    var zoom = map.getZoom();
    var cells = new Map();
    entries.forEach(function (e) {
      var pt = map.project(L.latLng(e.coords[0], e.coords[1]), zoom);
      var key = Math.floor(pt.x / CLUSTER_CELL_PX) + '_' + Math.floor(pt.y / CLUSTER_CELL_PX);
      if (!cells.has(key)) cells.set(key, []);
      cells.get(key).push(e);
    });
    var result = [];
    cells.forEach(function (group) {
      if (group.length === 1) {
        result.push({ kind: 'single', entry: group[0] });
      } else {
        var latSum = 0, lonSum = 0;
        group.forEach(function (e) { latSum += e.coords[0]; lonSum += e.coords[1]; });
        result.push({
          kind: 'cluster',
          count: group.length,
          center: [latSum / group.length, lonSum / group.length],
          entries: group
        });
      }
    });
    return result;
  }

  function renderMarkers() {
    markerLayer.clearLayers();
    var items = groupIntoClusters(visibleEntries());
    items.forEach(function (item) {
      if (item.kind === 'single') {
        var marker = L.marker([item.entry.coords[0], item.entry.coords[1]], { icon: buildDivIcon(item.entry) });
        marker.on('click', function () { openSheet(item.entry.id); });
        marker.addTo(markerLayer);
      } else {
        var clusterMarker = L.marker(item.center, { icon: buildClusterIcon(item.count) });
        clusterMarker.on('click', function () {
          var latlngs = item.entries.map(function (e) { return [e.coords[0], e.coords[1]]; });
          map.fitBounds(L.latLngBounds(latlngs), { padding: [40, 40], maxZoom: 16 });
        });
        clusterMarker.addTo(markerLayer);
      }
    });
    updateFilterCount();
  }

  map.on('zoomend', renderMarkers);

  // ---------- Stadtrundgang ----------
  // Eigener Layer mit nummerierten Stationsmarkern und einer gestrichelten
  // Linie, die ausdruecklich als Luftlinie (keine Wegfuehrung) gekennzeichnet
  // ist -- Vortaeuschen von echtem Routing ist laut Briefing ausgeschlossen.

  var tourLayer = L.layerGroup();
  var tourState = null; // { entryId, stopIndex }
  var tourBar = document.getElementById('tour-bar');
  var tourBarTitle = document.getElementById('tour-bar-title');
  var tourBarStop = document.getElementById('tour-bar-stop');
  var tourBarCounter = document.getElementById('tour-bar-counter');

  function buildTourMarkerIcon(num, isCurrent) {
    return L.divIcon({
      html: '<div class="tour-marker' + (isCurrent ? ' is-current' : '') + '">' + num + '</div>',
      className: 'tour-marker-wrap',
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
  }

  function startTour(entryId, stopIndex) {
    var e = entriesById[entryId];
    if (!e || !e.walkingTour) return;
    tourState = { entryId: entryId, stopIndex: stopIndex || 0 };
    closeSheet();
    map.removeLayer(markerLayer);
    tourLayer.clearLayers();
    var latlngs = e.walkingTour.stops.map(function (s) { return [s.coords[0], s.coords[1]]; });
    L.polyline(latlngs, { color: '#a0442c', weight: 3, dashArray: '6,8', opacity: 0.85 }).addTo(tourLayer);
    e.walkingTour.stops.forEach(function (s, i) {
      L.marker([s.coords[0], s.coords[1]], { icon: buildTourMarkerIcon(i + 1, i === tourState.stopIndex) }).addTo(tourLayer);
    });
    tourLayer.addTo(map);
    tourBar.hidden = false;
    updateTourUI();
  }

  function updateTourUI() {
    if (!tourState) return;
    var e = entriesById[tourState.entryId];
    var wt = e.walkingTour;
    var stop = wt.stops[tourState.stopIndex];
    tourBarTitle.textContent = wt.title;
    tourBarStop.textContent = (tourState.stopIndex + 1) + '. ' + stop.name;
    tourBarCounter.textContent = (tourState.stopIndex + 1) + '/' + wt.stops.length + ' · Luftlinie';
    // Marker-Icons neu setzen, damit die aktuelle Station hervorgehoben ist.
    var i = 0;
    tourLayer.eachLayer(function (layer) {
      if (layer instanceof L.Marker) {
        layer.setIcon(buildTourMarkerIcon(i + 1, i === tourState.stopIndex));
        i++;
      }
    });
    map.flyTo([stop.coords[0], stop.coords[1]], Math.max(map.getZoom(), 16), { duration: 0.5 });
  }

  function tourStep(delta) {
    if (!tourState) return;
    var e = entriesById[tourState.entryId];
    var n = e.walkingTour.stops.length;
    tourState.stopIndex = Math.max(0, Math.min(n - 1, tourState.stopIndex + delta));
    updateTourUI();
  }

  function exitTour() {
    if (!tourState) return;
    map.removeLayer(tourLayer);
    if (!map.hasLayer(markerLayer)) markerLayer.addTo(map);
    tourState = null;
    tourBar.hidden = true;
  }

  document.getElementById('tour-prev').addEventListener('click', function () { tourStep(-1); });
  document.getElementById('tour-next').addEventListener('click', function () { tourStep(1); });
  document.getElementById('tour-exit').addEventListener('click', exitTour);

  // ---------- Tagesrouten ----------
  // Wie beim Stadtrundgang: gestrichelte Linie ausdruecklich als Luftlinie
  // gekennzeichnet, keine echte Routenfuehrung. Anders als der Stadtrundgang
  // verweisen die Stationen hier auf vollwertige Eintraege (per entryId), die
  // beim Antippen im normalen Bottom Sheet geoeffnet werden.

  var routeLayer = L.layerGroup();
  var routeTripState = null; // { routeId, stopIndex }
  var routeBar = document.getElementById('route-bar');
  var routeBarTitle = document.getElementById('route-bar-title');
  var routeBarStop = document.getElementById('route-bar-stop');
  var routeBarCounter = document.getElementById('route-bar-counter');

  function routeStops(r) {
    return r.stops.filter(function (s) { return entriesById[s.entryId]; });
  }

  function buildRouteMarkerIcon(num, isCurrent) {
    return L.divIcon({
      html: '<div class="route-marker' + (isCurrent ? ' is-current' : '') + '">' + num + '</div>',
      className: 'route-marker-wrap',
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
  }

  function startRoute(routeId) {
    var r = routesById[routeId];
    if (!r) return;
    var stops = routeStops(r);
    if (!stops.length) return;
    if (tourState) exitTour();
    closeSheet();
    routesModal.hidden = true;
    routeTripState = { routeId: routeId, stopIndex: 0 };
    map.removeLayer(markerLayer);
    routeLayer.clearLayers();
    var latlngs = stops.map(function (s) { var e = entriesById[s.entryId]; return [e.coords[0], e.coords[1]]; });
    L.polyline(latlngs, { color: '#2b6ca8', weight: 3, dashArray: '6,8', opacity: 0.85 }).addTo(routeLayer);
    stops.forEach(function (s, i) {
      var e = entriesById[s.entryId];
      var marker = L.marker([e.coords[0], e.coords[1]], { icon: buildRouteMarkerIcon(i + 1, i === 0) });
      marker.on('click', function () { routeTripState.stopIndex = i; updateRouteUI(); });
      marker.addTo(routeLayer);
    });
    routeLayer.addTo(map);
    routeBar.hidden = false;
    updateRouteUI();
  }

  function updateRouteUI() {
    if (!routeTripState) return;
    var r = routesById[routeTripState.routeId];
    var stops = routeStops(r);
    var stop = stops[routeTripState.stopIndex];
    var e = entriesById[stop.entryId];
    routeBarTitle.textContent = r.title;
    var driveNote = stop.driveMinutesFromPrevious === null || stop.driveMinutesFromPrevious === undefined
      ? 'Start der Route'
      : '~' + stop.driveMinutesFromPrevious + ' Min. Fahrt davor (Schätzung)';
    routeBarStop.innerHTML = (routeTripState.stopIndex + 1) + '. ' + escapeHtml(e.name) +
      '<span class="tour-bar__drive">' + escapeHtml(driveNote) + '</span>';
    routeBarCounter.textContent = (routeTripState.stopIndex + 1) + '/' + stops.length;
    var i = 0;
    routeLayer.eachLayer(function (layer) {
      if (layer instanceof L.Marker) {
        layer.setIcon(buildRouteMarkerIcon(i + 1, i === routeTripState.stopIndex));
        i++;
      }
    });
    map.flyTo([e.coords[0], e.coords[1]], Math.max(map.getZoom(), 12), { duration: 0.5 });
  }

  function routeStep(delta) {
    if (!routeTripState) return;
    var r = routesById[routeTripState.routeId];
    var n = routeStops(r).length;
    routeTripState.stopIndex = Math.max(0, Math.min(n - 1, routeTripState.stopIndex + delta));
    updateRouteUI();
  }

  function exitRoute() {
    if (!routeTripState) return;
    map.removeLayer(routeLayer);
    if (!map.hasLayer(markerLayer)) markerLayer.addTo(map);
    routeTripState = null;
    routeBar.hidden = true;
  }

  function openRouteStopDetails() {
    if (!routeTripState) return;
    var r = routesById[routeTripState.routeId];
    var stop = routeStops(r)[routeTripState.stopIndex];
    openSheet(stop.entryId);
  }

  document.getElementById('route-prev').addEventListener('click', function () { routeStep(-1); });
  document.getElementById('route-next').addEventListener('click', function () { routeStep(1); });
  document.getElementById('route-exit').addEventListener('click', exitRoute);
  document.getElementById('route-details').addEventListener('click', openRouteStopDetails);

  // ---------- Bottom Sheet ----------

  var sheet = document.getElementById('bottom-sheet');
  var sheetHandle = document.getElementById('bottom-sheet-handle');
  var sheetHeader = sheet.querySelector('.bottom-sheet__header');
  var sheetNameEl = document.getElementById('sheet-name');
  var sheetNameGrEl = document.getElementById('sheet-name-gr');
  var sheetBadgesEl = document.getElementById('sheet-badges');
  var sheetBodyEl = document.getElementById('sheet-body');
  var sheetFavBtn = document.getElementById('sheet-fav');
  var sheetCloseBtn = document.getElementById('sheet-close');

  var currentSheetEntryId = null;
  var sheetState = 'hidden';
  var sheetPxHeight = window.innerHeight * 0.92;

  function stateToTranslateVh(s) {
    if (s === 'hidden') return sheetPxHeight;
    if (s === 'peek') return sheetPxHeight - 130;
    if (s === 'half') return sheetPxHeight * 0.5;
    return sheetPxHeight * 0.04; // full
  }

  function setSheetState(s) {
    sheetState = s;
    sheet.setAttribute('data-state', s);
    sheet.style.transform = '';
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function fieldRow(label, value) {
    if (value === null || value === undefined || value === '') return '';
    return '<p><strong>' + escapeHtml(label) + ':</strong> ' + escapeHtml(value) + '</p>';
  }

  function listBlock(title, items) {
    if (!items || !items.length) return '';
    return '<h3>' + escapeHtml(title) + '</h3><ul>' +
      items.map(function (i) { return '<li>' + escapeHtml(i) + '</li>'; }).join('') + '</ul>';
  }

  function renderBeachBody(e) {
    var html = '<p>' + escapeHtml(e.summary) + '</p>';
    html += fieldRow('Zeitbedarf', e.timeNeeded);
    html += fieldRow('Untergrund', e.surface);
    html += fieldRow('Meeresboden', e.seabed);
    html += fieldRow('Einstieg', e.entry);
    html += fieldRow('Barfußtauglich', e.barefootFriendly === true ? 'ja' : e.barefootFriendly === false ? 'nein' : null);
    html += fieldRow('Schatten', e.shade);
    html += fieldRow('Windexposition', e.windExposure);
    if (e.crowding) {
      html += '<h3>Belebtheit</h3><p>Hochsaison: ' + e.crowding.peakSeason + '/5 · Nebensaison: ' + e.crowding.shoulderSeason + '/5</p>';
      if (e.crowding.timeOfDayNote) html += '<p>' + escapeHtml(e.crowding.timeOfDayNote) + '</p>';
    }
    html += listBlock('Achtung', e.hazards);
    if (e.snorkeling) {
      html += '<h3>Schnorcheln</h3><p>Bewertung: ' + e.snorkeling.rating + '/5';
      if (e.snorkeling.visibility) html += ' · Sicht: ' + escapeHtml(e.snorkeling.visibility);
      html += '</p>';
      html += listBlock('Habitat-typische Arten', e.snorkeling.speciesLikely);
      html += listBlock('Vorsicht', e.snorkeling.speciesCaution);
      html += '<p class="species-note">' + escapeHtml(habitatsDisclaimer) + '</p>';
    }
    if (e.facilities) {
      html += '<h3>Infrastruktur</h3>';
      html += fieldRow('Liegen', e.facilities.sunbeds);
      html += fieldRow('Taverna', e.facilities.taverna);
      html += fieldRow('WC', e.facilities.wc === true ? 'ja' : e.facilities.wc === false ? 'nein' : 'nicht verifiziert');
      html += fieldRow('Trinkwasser', e.facilities.freshwater === true ? 'ja' : e.facilities.freshwater === false ? 'nein' : 'nicht verifiziert');
      html += fieldRow('Parken', e.facilities.parking || 'nicht verifiziert');
    }
    if (e.access) {
      html += '<h3>Zugang</h3>';
      html += fieldRow('Art', e.access.mode);
      html += fieldRow('Gehzeit ab Parkplatz', e.access.minutesFromParking != null ? e.access.minutesFromParking + ' Min.' : null);
      html += fieldRow('Wegqualität', e.access.roadQuality);
      html += fieldRow('Schwierigkeit', e.access.difficulty);
    }
    html += fieldRow('Nacktbaden toleriert', e.nudistTolerated === true ? 'ja' : e.nudistTolerated === false ? 'nein' : null);
    html += fieldRow('Beste Zeit', e.bestTime);
    html += fieldRow('Geschichte/Mythos', e.history);
    return html;
  }

  function renderSiteBody(e) {
    var html = '<p>' + escapeHtml(e.summary) + '</p>';
    html += fieldRow('Epoche', (e.epoch || []).join(', '));
    html += fieldRow('Datierung', e.dating);
    if (e.whyItMatters) html += '<h3>Warum das zählt</h3><p>' + escapeHtml(e.whyItMatters) + '</p>';
    if (e.whatYouSee) html += '<h3>Was man sieht</h3><p>' + escapeHtml(e.whatYouSee) + '</p>';
    if (e.walkthrough && e.walkthrough.length) {
      html += '<h3>Rundgang</h3><ul>' + e.walkthrough.map(function (w) {
        return '<li><strong>' + escapeHtml(w.stop) + ':</strong> ' + escapeHtml(w.note) + '</li>';
      }).join('') + '</ul>';
    }
    html += fieldRow('Gelände', e.terrain);
    html += fieldRow('Schatten/Hitze', e.shadeAndHeat);
    html += fieldRow('Museum vor Ort', e.museumOnSite === true ? 'ja' : e.museumOnSite === false ? 'nein' : null);
    if (e.misconceptions) html += '<h3>Verbreitete Irrtümer</h3><p>' + escapeHtml(e.misconceptions) + '</p>';
    if (e.readingHooks) html += '<h3>Anknüpfungspunkte</h3><p>' + escapeHtml(e.readingHooks) + '</p>';
    html += fieldRow('Ticket', e.ticketInfo || 'nicht verifiziert');
    return html;
  }

  function renderTownBody(e) {
    var html = '<p>' + escapeHtml(e.summary) + '</p>';
    if (e.character) html += '<h3>Charakter</h3><p>' + escapeHtml(e.character) + '</p>';
    if (e.historyTimeline && e.historyTimeline.length) {
      html += '<h3>Geschichte</h3><ul>' + e.historyTimeline.map(function (h) {
        return '<li><strong>' + escapeHtml(h.period) + ':</strong> ' + escapeHtml(h.note) + '</li>';
      }).join('') + '</ul>';
    }
    html += listBlock('Was tun', e.whatToDo);
    html += fieldRow('Parken', e.parking);
    if (e.foodScene) html += '<h3>Essen</h3><p>' + escapeHtml(e.foodScene) + '</p>';
    if (e.walkingTour) html += renderWalkingTourSection(e);
    return html;
  }

  function renderWalkingTourSection(e) {
    var wt = e.walkingTour;
    var html = '<h3>Rundgang: ' + escapeHtml(wt.title) + '</h3>';
    html += '<p>' + (wt.distanceKm ? wt.distanceKm + ' km, ' : '') + 'ca. ' + wt.durationMinutes + ' Min. · ' + escapeHtml(wt.terrain) + '</p>';
    html += '<p class="species-note">Die Linie zwischen den Stationen ist eine Luftlinie zur Orientierung, keine echte Wegführung.</p>';
    html += wt.stops.map(function (stop, i) {
      return '<button type="button" class="tour-stop-row" data-tour-jump="' + escapeHtml(e.id) + '" data-tour-index="' + i + '">' +
        '<span class="tour-stop-row__num">' + (i + 1) + '</span>' +
        '<span class="tour-stop-row__body"><strong>' + escapeHtml(stop.name) + '</strong><span>' + escapeHtml(stop.note) + '</span></span>' +
        '</button>';
    }).join('');
    html += '<button type="button" class="btn btn-primary tour-start-btn" data-tour-start="' + escapeHtml(e.id) + '">Rundgang starten</button>';
    return html;
  }

  function renderGenericBody(e) {
    var html = '<p>' + escapeHtml(e.summary) + '</p>';
    html += fieldRow('Zeitbedarf', e.timeNeeded);
    ['epoch', 'dating', 'whyItMatters', 'whatYouSee', 'terrain', 'shadeAndHeat',
      'difficulty', 'distanceKm', 'durationHours', 'elevationGainM', 'waymarking',
      'bestTime', 'sunsetSunrise'].forEach(function (key) {
      var v = e[key];
      if (Array.isArray(v)) v = v.join(', ');
      html += fieldRow(key, v);
    });
    if (e.access) {
      html += fieldRow('Zugang', e.access.mode);
      html += fieldRow('Schwierigkeit', e.access.difficulty);
    }
    return html;
  }

  function renderSheetBody(e) {
    if (e.type === 'beach') return renderBeachBody(e);
    // monastery_castle teilt sich praktisch dieselbe Feldstruktur wie site
    // (epoch/dating/whyItMatters/whatYouSee/walkthrough/misconceptions/...)
    // und bekommt daher dieselbe, vollstaendigere Darstellung statt der
    // generischen Fallback-Ansicht.
    if (e.type === 'site' || e.type === 'monastery_castle') return renderSiteBody(e);
    if (e.type === 'town') return renderTownBody(e);
    return renderGenericBody(e);
  }

  function openSheet(id) {
    var e = entriesById[id];
    if (!e) return;
    currentSheetEntryId = id;
    sheetNameEl.innerHTML = escapeHtml(e.name) + (e.nameGr ? '<span class="name-gr">' + escapeHtml(e.nameGr) + '</span>' : '');
    sheetFavBtn.classList.toggle('is-favorite', favorites.has(id));
    sheetFavBtn.textContent = favorites.has(id) ? '★' : '☆';

    var badges = '<span class="badge">' + escapeHtml(TYPE_LABELS[e.type] || e.type) + '</span>';
    badges += '<span class="badge">' + escapeHtml(REGION_LABELS[e.region] || e.region) + '</span>';
    if (e.touristTrapRisk) {
      badges += '<span class="badge badge-trap" title="' + escapeHtml(e.touristTrapRisk.note || '') + '">Touristenfalle ' + e.touristTrapRisk.level + '/5</span>';
    }
    if (e.confidence === 'low') badges += '<span class="badge badge-low-confidence">Unsichere Angaben</span>';
    if (e.coordSource === 'approx') badges += '<span class="badge">Position ungefähr</span>';
    sheetBadgesEl.innerHTML = badges;

    var bodyHtml = renderRatingWidget(id);
    bodyHtml += renderSheetBody(e);
    if (e.needsVerification && e.needsVerification.length) {
      bodyHtml += '<h3>Vor Ort prüfen</h3><ul class="verify-list">' +
        e.needsVerification.map(function (v) { return '<li>' + escapeHtml(v) + '</li>'; }).join('') + '</ul>';
    }
    var similar = similarEntries(e, 3);
    if (similar.length) {
      bodyHtml += '<h3>Ähnliche Orte</h3><div class="similar-places">' + similar.map(function (s) {
        var why = s.shared.slice(0, 3).map(humanizeFeature).join(', ');
        return '<button type="button" class="similar-place-btn" data-open-entry="' + escapeHtml(s.entry.id) + '">' +
          escapeHtml(s.entry.name) + '<span class="why">' + escapeHtml(why) + '</span></button>';
      }).join('') + '</div>';
    }
    sheetBodyEl.innerHTML = bodyHtml;

    setSheetState('half');
  }

  function renderRatingWidget(id) {
    var current = visits[id] ? visits[id].rating : 0;
    var stars = '';
    for (var i = 1; i <= 5; i++) {
      stars += '<button type="button" class="sheet-rating__star' + (i <= current ? ' is-filled' : '') +
        '" data-rate="' + i + '" aria-label="' + i + ' Sterne">' + (i <= current ? '★' : '☆') + '</button>';
    }
    return '<div class="sheet-rating">' +
      '<span class="sheet-rating__stars">' + stars + '</span>' +
      (current ? '<button type="button" class="sheet-rating__clear" data-rate-clear>War doch nicht hier</button>' : '<span class="species-note">War ich hier?</span>') +
      '</div>';
  }

  function closeSheet() {
    setSheetState('hidden');
    currentSheetEntryId = null;
  }

  sheetCloseBtn.addEventListener('click', closeSheet);
  sheetFavBtn.addEventListener('click', function () {
    if (!currentSheetEntryId) return;
    if (favorites.has(currentSheetEntryId)) favorites.delete(currentSheetEntryId);
    else favorites.add(currentSheetEntryId);
    persistFavorites();
    sheetFavBtn.classList.toggle('is-favorite', favorites.has(currentSheetEntryId));
    sheetFavBtn.textContent = favorites.has(currentSheetEntryId) ? '★' : '☆';
    renderMarkers();
  });

  // Event-Delegation fuer Inhalte, die bei jedem openSheet() neu als HTML
  // gesetzt werden (Sterne, Rundgang-Stationen/Start, "Aehnliche Orte").
  sheetBodyEl.addEventListener('click', function (ev) {
    var rateBtn = ev.target.closest('[data-rate]');
    if (rateBtn && currentSheetEntryId) {
      setRating(currentSheetEntryId, parseInt(rateBtn.getAttribute('data-rate'), 10));
      openSheet(currentSheetEntryId);
      return;
    }
    var clearBtn = ev.target.closest('[data-rate-clear]');
    if (clearBtn && currentSheetEntryId) {
      setRating(currentSheetEntryId, null);
      openSheet(currentSheetEntryId);
      return;
    }
    var openBtn = ev.target.closest('[data-open-entry]');
    if (openBtn) {
      openSheet(openBtn.getAttribute('data-open-entry'));
      return;
    }
    var tourStartBtn = ev.target.closest('[data-tour-start]');
    if (tourStartBtn) {
      startTour(tourStartBtn.getAttribute('data-tour-start'), 0);
      return;
    }
    var tourJumpBtn = ev.target.closest('[data-tour-jump]');
    if (tourJumpBtn) {
      startTour(tourJumpBtn.getAttribute('data-tour-jump'), parseInt(tourJumpBtn.getAttribute('data-tour-index'), 10));
      return;
    }
  });

  // Swipe-to-dismiss / Snap zwischen Peek-Half-Full über Handle & Header.
  (function setupDrag() {
    var dragging = false;
    var startY = 0;
    var startTranslate = 0;

    function currentTranslatePx() {
      var rect = sheet.getBoundingClientRect();
      return rect.top;
    }

    function onStart(clientY) {
      dragging = true;
      startY = clientY;
      startTranslate = currentTranslatePx();
      sheet.classList.add('dragging');
    }
    function onMove(clientY) {
      if (!dragging) return;
      var delta = clientY - startY;
      var next = Math.max(0, startTranslate + delta);
      sheet.style.transform = 'translateY(' + next + 'px)';
    }
    function onEnd() {
      if (!dragging) return;
      dragging = false;
      sheet.classList.remove('dragging');
      var top = sheet.getBoundingClientRect().top;
      var vh = window.innerHeight;
      var fullY = vh * 0.04, halfY = vh * 0.46, peekY = vh - 130, hiddenY = vh;

      var distances = [
        { s: 'full', y: fullY }, { s: 'half', y: halfY },
        { s: 'peek', y: peekY }, { s: 'hidden', y: hiddenY }
      ];
      distances.sort(function (a, b) { return Math.abs(top - a.y) - Math.abs(top - b.y); });
      var next = distances[0].s;
      if (top > peekY + 60) next = 'hidden';
      if (next === 'hidden') closeSheet(); else setSheetState(next);
    }

    sheetHandle.addEventListener('touchstart', function (ev) { onStart(ev.touches[0].clientY); }, { passive: true });
    sheetHeader.addEventListener('touchstart', function (ev) { onStart(ev.touches[0].clientY); }, { passive: true });
    document.addEventListener('touchmove', function (ev) {
      if (!dragging) return;
      onMove(ev.touches[0].clientY);
    }, { passive: true });
    document.addEventListener('touchend', onEnd);

    // Maus-Fallback fuer Desktop-Tests.
    sheetHandle.addEventListener('mousedown', function (ev) { onStart(ev.clientY); });
    sheetHeader.addEventListener('mousedown', function (ev) { onStart(ev.clientY); });
    document.addEventListener('mousemove', function (ev) { if (dragging) onMove(ev.clientY); });
    document.addEventListener('mouseup', onEnd);
  })();

  // ---------- Filter-Panel ----------

  var filterPanel = document.getElementById('filter-panel');
  var filterToggle = document.getElementById('filter-toggle');
  var filterCountEl = document.getElementById('filter-count');
  var chipsType = document.getElementById('chips-type');
  var chipsRegion = document.getElementById('chips-region');
  var chipsTrap = document.getElementById('chips-trap');
  var chipsTags = document.getElementById('chips-tags');
  var filterResetBtn = document.getElementById('filter-reset');

  function activeFilterCount() {
    var n = 0;
    if (state.types.size) n += state.types.size;
    if (state.regions.size) n += state.regions.size;
    if (state.maxTrap) n += 1;
    if (state.tags.size) n += state.tags.size;
    return n;
  }
  function updateFilterCount() {
    var n = activeFilterCount();
    filterCountEl.hidden = n === 0;
    filterCountEl.textContent = String(n);
  }

  function chip(label, active, onClick) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip' + (active ? ' active' : '');
    btn.textContent = label;
    btn.addEventListener('click', onClick);
    return btn;
  }

  function renderFilterChips() {
    var typesPresent = Array.from(new Set(allEntries.map(function (e) { return e.type; })));
    var regionsPresent = Array.from(new Set(allEntries.map(function (e) { return e.region; })));
    var tagsPresent = Array.from(new Set(allEntries.reduce(function (acc, e) { return acc.concat(e.tags || []); }, [])));

    chipsType.innerHTML = '';
    typesPresent.forEach(function (t) {
      chipsType.appendChild(chip(TYPE_LABELS[t] || t, state.types.has(t), function () {
        if (state.types.has(t)) state.types.delete(t); else state.types.add(t);
        onFilterChange();
      }));
    });

    chipsRegion.innerHTML = '';
    regionsPresent.forEach(function (r) {
      chipsRegion.appendChild(chip(REGION_LABELS[r] || r, state.regions.has(r), function () {
        if (state.regions.has(r)) state.regions.delete(r); else state.regions.add(r);
        onFilterChange();
      }));
    });

    chipsTrap.innerHTML = '';
    [1, 2, 3, 4, 5].forEach(function (n) {
      chipsTrap.appendChild(chip('≤ ' + n, state.maxTrap === n, function () {
        state.maxTrap = state.maxTrap === n ? null : n;
        onFilterChange();
      }));
    });

    chipsTags.innerHTML = '';
    tagsPresent.forEach(function (tag) {
      chipsTags.appendChild(chip(tag, state.tags.has(tag), function () {
        if (state.tags.has(tag)) state.tags.delete(tag); else state.tags.add(tag);
        onFilterChange();
      }));
    });
  }

  function onFilterChange() {
    renderFilterChips();
    writeHash();
    renderMarkers();
  }

  filterToggle.addEventListener('click', function () {
    filterPanel.hidden = !filterPanel.hidden;
    filterToggle.classList.toggle('is-active', !filterPanel.hidden);
  });
  filterResetBtn.addEventListener('click', function () {
    state.types.clear(); state.regions.clear(); state.tags.clear(); state.maxTrap = null;
    onFilterChange();
  });

  // ---------- Suche ----------

  var searchInput = document.getElementById('search-input');
  var searchClear = document.getElementById('search-clear');

  searchInput.value = state.search;
  searchClear.hidden = !state.search;

  var onSearchInput = debounce(function () {
    state.search = searchInput.value.trim();
    searchClear.hidden = !state.search;
    writeHash();
    renderMarkers();
  }, 150);
  searchInput.addEventListener('input', onSearchInput);
  searchClear.addEventListener('click', function () {
    searchInput.value = '';
    state.search = '';
    searchClear.hidden = true;
    writeHash();
    renderMarkers();
  });

  // ---------- Umkreisfilter (Luftlinie) ----------

  var locateBtn = document.getElementById('locate-btn');
  if (navigator.geolocation) {
    locateBtn.hidden = false;
    locateBtn.addEventListener('click', function () {
      if (state.radius) {
        state.radius = null;
        locateBtn.classList.remove('is-active');
        writeHash();
        renderMarkers();
        return;
      }
      navigator.geolocation.getCurrentPosition(function (pos) {
        state.radius = { center: [pos.coords.latitude, pos.coords.longitude], km: 20 };
        locateBtn.classList.add('is-active');
        writeHash();
        renderMarkers();
      }, function () { /* Kein Zugriff/kein Signal – Button bleibt sichtbar, aber ohne Wirkung. */ }, { timeout: 8000 });
    });
  } else {
    locateBtn.hidden = true;
  }

  // ---------- Favoriten-Modal ----------

  var favoritesToggle = document.getElementById('favorites-toggle');
  var favoritesModal = document.getElementById('favorites-modal');
  var favoritesListEl = document.getElementById('favorites-list');
  var ratingsListEl = document.getElementById('ratings-list');
  var recommendationsListEl = document.getElementById('recommendations-list');
  var favoritesIO = document.getElementById('favorites-io');

  function renderFavoritesList() {
    var favEntries = Array.from(favorites).map(function (id) { return entriesById[id]; }).filter(Boolean);
    if (!favEntries.length) {
      favoritesListEl.innerHTML = '<p class="species-note">Noch keine Favoriten gesetzt.</p>';
      return;
    }
    favoritesListEl.innerHTML = favEntries.map(function (e) {
      return '<button type="button" class="similar-place-btn" data-open-entry-modal="' + escapeHtml(e.id) + '"><strong>' + escapeHtml(e.name) + '</strong> · ' +
        escapeHtml(TYPE_LABELS[e.type] || e.type) + ' · ' + escapeHtml(REGION_LABELS[e.region] || e.region) + '</button>';
    }).join('');
  }

  function renderRatingsList() {
    var rated = ratedEntries();
    if (!rated.length) {
      ratingsListEl.innerHTML = '<p class="species-note">Noch keine Orte bewertet. Im Bottom Sheet eines Eintrags einfach Sterne vergeben.</p>';
      return;
    }
    rated.sort(function (a, b) { return b.rating - a.rating; });
    ratingsListEl.innerHTML = rated.map(function (r) {
      var stars = '';
      for (var i = 1; i <= 5; i++) stars += i <= r.rating ? '★' : '☆';
      return '<button type="button" class="similar-place-btn" data-open-entry-modal="' + escapeHtml(r.entry.id) + '"><strong>' + escapeHtml(r.entry.name) + '</strong> ' +
        '<span class="rating-star-row">' + stars + '</span></button>';
    }).join('');
  }

  function renderRecommendationsList() {
    var result = recommendations(6);
    if (!result.ready) {
      recommendationsListEl.innerHTML = '<p class="species-note">Noch keine Empfehlungen – bewerte mindestens 3 Orte, dann leite ich daraus Vorschläge ab.</p>';
      return;
    }
    if (!result.items.length) {
      recommendationsListEl.innerHTML = '<p class="species-note">Aus den bisherigen Bewertungen ergeben sich noch keine passenden Vorschläge.</p>';
      return;
    }
    recommendationsListEl.innerHTML = result.items.map(function (item) {
      var reasonParts = item.reasonExemplars.map(function (x) {
        return x.ex.entry.name + ' (' + x.ex.rating + '★)';
      });
      var sharedLabels = item.reasonExemplars.length
        ? item.reasonExemplars[0].shared.slice(0, 3).map(humanizeFeature).join(', ')
        : '';
      var reason = reasonParts.length
        ? 'Weil dir ' + reasonParts.join(' und ') + ' gefallen haben' + (sharedLabels ? ' — beide ' + sharedLabels : '')
        : 'Passt zu deinem bisherigen Geschmack';
      return '<button type="button" class="similar-place-btn" data-open-entry-modal="' + escapeHtml(item.entry.id) + '"><strong>' + escapeHtml(item.entry.name) + '</strong>' +
        '<span class="why">' + escapeHtml(reason) + '</span></button>';
    }).join('');
  }

  function renderFavoritesModal() {
    renderFavoritesList();
    renderRatingsList();
    renderRecommendationsList();
  }

  favoritesToggle.addEventListener('click', function () {
    renderFavoritesModal();
    favoritesModal.hidden = false;
  });
  favoritesModal.addEventListener('click', function (ev) {
    var btn = ev.target.closest('[data-open-entry-modal]');
    if (!btn) return;
    favoritesModal.hidden = true;
    openSheet(btn.getAttribute('data-open-entry-modal'));
  });
  document.getElementById('favorites-export').addEventListener('click', function () {
    favoritesIO.value = JSON.stringify({
      favorites: Array.from(favorites),
      visits: visits,
      exportedAt: new Date().toISOString()
    }, null, 2);
  });
  document.getElementById('favorites-import').addEventListener('click', function () {
    try {
      var parsed = JSON.parse(favoritesIO.value);
      var ids = Array.isArray(parsed) ? parsed : parsed.favorites;
      if (!Array.isArray(ids)) throw new Error('Kein Favoriten-Array gefunden.');
      favorites = new Set(ids.filter(function (id) { return entriesById[id]; }));
      persistFavorites();
      if (parsed.visits && typeof parsed.visits === 'object') {
        var importedVisits = {};
        Object.keys(parsed.visits).forEach(function (id) {
          var v = parsed.visits[id];
          if (entriesById[id] && v && v.rating >= 1 && v.rating <= 5) importedVisits[id] = v;
        });
        visits = importedVisits;
        persistVisits();
      }
      renderFavoritesModal();
      renderMarkers();
    } catch (e) {
      window.alert('Import fehlgeschlagen: ' + e.message);
    }
  });

  // ---------- Tagesrouten-Modal ----------

  var routesToggle = document.getElementById('routes-toggle');
  var routesModal = document.getElementById('routes-modal');
  var routesListEl = document.getElementById('routes-list');

  function renderRoutesModal() {
    if (!allRoutes.length) {
      routesListEl.innerHTML = '<p class="species-note">Noch keine Tagesrouten vorhanden.</p>';
      return;
    }
    routesListEl.innerHTML = allRoutes.map(function (r) {
      var stops = routeStops(r);
      var stopNames = stops.map(function (s) { return entriesById[s.entryId].name; }).join(' → ');
      return '<div class="route-card">' +
        '<h3>' + escapeHtml(r.title) + '</h3>' +
        '<p class="species-note">' + escapeHtml(r.summary) + '</p>' +
        '<p class="route-card__stops">' + escapeHtml(stopNames) + '</p>' +
        '<p class="route-card__meta">' + stops.length + ' Stopps · ca. ' + r.totalDriveMinutes + ' Min. Fahrzeit (Schätzung) · ' + escapeHtml(r.driveTimeDisclaimer) + '</p>' +
        '<button type="button" class="btn btn-primary" data-start-route="' + escapeHtml(r.id) + '">Route starten</button>' +
        '</div>';
    }).join('');
  }

  routesToggle.addEventListener('click', function () {
    renderRoutesModal();
    routesModal.hidden = false;
  });
  routesModal.addEventListener('click', function (ev) {
    var btn = ev.target.closest('[data-start-route]');
    if (!btn) return;
    startRoute(btn.getAttribute('data-start-route'));
  });

  // ---------- "Zu prüfen"-Modal ----------

  var needsVerifyBtn = document.getElementById('needs-verify-btn');
  var verifyModal = document.getElementById('verify-modal');
  var verifyListEl = document.getElementById('verify-list');

  needsVerifyBtn.addEventListener('click', function () {
    var withIssues = allEntries.filter(function (e) { return e.needsVerification && e.needsVerification.length; });
    if (!withIssues.length) {
      verifyListEl.innerHTML = '<p class="species-note">Aktuell keine offenen Prüfpunkte.</p>';
    } else {
      verifyListEl.innerHTML = withIssues.map(function (e) {
        return '<div class="needs-verify-entry"><strong>' + escapeHtml(e.name) + '</strong><ul class="verify-list">' +
          e.needsVerification.map(function (v) { return '<li>' + escapeHtml(v) + '</li>'; }).join('') + '</ul></div>';
      }).join('');
    }
    verifyModal.hidden = false;
  });

  document.querySelectorAll('[data-close-modal]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      btn.closest('.modal-overlay').hidden = true;
    });
  });

  // ---------- Boot ----------

  readHash();
  searchInput.value = state.search;
  searchClear.hidden = !state.search;
  renderFilterChips();
  renderMarkers();

  window.__peloponnesGuide = {
    map: map, bounds: bounds, state: state, allEntries: allEntries,
    openSheet: openSheet, closeSheet: closeSheet, renderMarkers: renderMarkers,
    groupIntoClusters: groupIntoClusters, favorites: favorites,
    visits: visits, setRating: setRating, recommendations: recommendations,
    similarEntries: similarEntries, startTour: startTour, tourStep: tourStep,
    exitTour: exitTour, getTourState: function () { return tourState; },
    allRoutes: allRoutes, startRoute: startRoute, routeStep: routeStep,
    exitRoute: exitRoute, getRouteState: function () { return routeTripState; }
  };
})();
