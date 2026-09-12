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
  // Optionale Gruende bei Bewertungen <=2. Zweck: eine schlechte Bewertung soll
  // nicht diffus alle Merkmale des Orts belasten (siehe buildTasteProfiles) --
  // "zu ueberlaufen" ist etwas anderes als "Sandstrand war nicht meins".
  var DISLIKE_REASONS = [
    { id: 'ueberlaufen', label: 'zu überlaufen' },
    { id: 'zugang', label: 'Zufahrt/Zugang schwierig' },
    { id: 'erwartung', label: 'nicht wie erwartet' },
    { id: 'zustand', label: 'schlechter Zustand' },
    { id: 'teuer', label: 'zu teuer' },
    { id: 'geschmack', label: 'einfach nicht mein Ding' }
  ];
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
      var existing = visits[id];
      visits[id] = {
        rating: rating,
        visitedAt: (existing && existing.visitedAt) || new Date().toISOString(),
        // Alte Ablehnungsgruende nur behalten, wenn weiterhin niedrig bewertet --
        // beim Hochstufen auf eine gute Bewertung sollen sie nicht anhaften bleiben.
        dislikeReasons: rating <= 2 ? ((existing && existing.dislikeReasons) || []) : []
      };
    }
    persistVisits();
  }

  function toggleDislikeReason(id, reasonId) {
    var v = visits[id];
    if (!v || v.rating > 2) return;
    var list = v.dislikeReasons || [];
    var idx = list.indexOf(reasonId);
    if (idx === -1) list.push(reasonId); else list.splice(idx, 1);
    v.dislikeReasons = list;
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
    // Selbst erfasste Orte bekommen ein kleines Plus-Abzeichen, damit auf der
    // Karte sofort erkennbar ist, was kuratiert und was selbst notiert ist.
    var userMark = entry.source === 'user'
      ? '<circle cx="27" cy="7" r="6" fill="#fff" stroke="' + color + '" stroke-width="1.5"/>' +
        '<path d="M27 4v6M24 7h6" stroke="' + color + '" stroke-width="1.8" stroke-linecap="round"/>'
      : '';
    var html = '<svg viewBox="0 0 34 34" width="34" height="34">' +
      '<path d="' + PIN_PATH + '" fill="' + color + '"/>' + glyph + userMark + '</svg>';
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

  // Leitet aus strukturierten Feldern ab, ob ein Kandidat dieselbe Art von
  // Problem aufweisen koennte wie ein zuvor genannter Ablehnungsgrund -- nur
  // fuer Gruende, die sich verlaesslich an echten Feldern festmachen lassen
  // (touristTrapRisk, crowding, Zugangsschwierigkeit). Die uebrigen Gruende
  // ("nicht wie erwartet", "schlechter Zustand", "zu teuer", "nicht mein Ding")
  // haben keine verlaessliche strukturelle Entsprechung und bleiben rein
  // informativ in der eigenen Bewertungsliste, statt eine erfundene Heuristik
  // vorzutaeuschen.
  function reasonFeaturesForCandidate(e) {
    var reasons = {};
    var trapLevel = e.touristTrapRisk && e.touristTrapRisk.level;
    if (trapLevel >= 4) reasons['grund:ueberlaufen'] = true;
    if (e.type === 'beach' && e.crowding && e.crowding.peakSeason >= 4) reasons['grund:ueberlaufen'] = true;
    if (e.type === 'beach' && e.access && (e.access.difficulty === 'mittel' || e.access.difficulty === 'schwer')) {
      reasons['grund:zugang'] = true;
    }
    return Object.keys(reasons);
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
      return { entry: e, rating: visits[id].rating, dislikeReasons: visits[id].dislikeReasons || [] };
    }).filter(Boolean);
  }

  function buildTasteProfiles() {
    var byType = {};
    ratedEntries().forEach(function (r) {
      var type = r.entry.type;
      if (!byType[type]) byType[type] = { weights: {}, exemplars: [], trapLevels: [] };
      var weight = r.rating - 3;
      if (weight < 0 && r.dislikeReasons.length) {
        // Gezielt statt diffus: die Ablehnung wird den genannten Gruenden
        // zugeschrieben, nicht allen Merkmalen des Orts. Sonst waere z.B.
        // "Sandstrand" pauschal negativ belastet, obwohl nur die Ueberfuellung
        // am Tag des Besuchs gestoert hat.
        r.dislikeReasons.forEach(function (reasonId) {
          var f = 'grund:' + reasonId;
          byType[type].weights[f] = (byType[type].weights[f] || 0) + weight;
        });
      } else {
        featureSet(r.entry).forEach(function (f) {
          byType[type].weights[f] = (byType[type].weights[f] || 0) + weight;
        });
      }
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
        reasonFeaturesForCandidate(e).forEach(function (f) { score += profile.weights[f] || 0; });
        if (e.touristTrapRisk && e.touristTrapRisk.level > trapCap) score -= 3;
        return { entry: e, score: score };
      }).filter(function (s) { return s.score > 0; });
      scored.sort(function (a, b) { return b.score - a.score; });

      scored.slice(0, 2).forEach(function (s) {
        // Staerkste Bezugspunkte: bewertete Exemplare mit den meisten geteilten
        // Merkmalen -- nur unter den tatsaechlich gemochten (>=4 Sterne), sonst
        // koennte der Begruendungstext ("weil dir X gefallen hat") faelschlich
        // einen abgelehnten Ort als positiven Bezugspunkt nennen.
        var exemplarScores = profile.exemplars.filter(function (ex) { return ex.rating >= 4; }).map(function (ex) {
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
  var sheetPreviewEl = document.getElementById('sheet-preview');
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

  // ---------- Fakten-Zeilen (Icon + Label + Wert mit gepunkteter Linie) ----------
  // Fuer die kurzen, scanbaren Kennzahlen jedes Eintrags (Zeitbedarf,
  // Schwierigkeit, Distanz, Schnorchel-Bewertung ...) statt sie in derselben
  // Fliesstext-Zeile wie ausfuehrliche Beschreibungen unterzubringen.
  var FACT_ICONS = {
    hourglass: '<path d="M7,4 L17,4 C17,9 13,10 12,12 C13,14 17,15 17,20 L7,20 C7,15 11,14 12,12 C11,10 7,9 7,4 Z" stroke-linejoin="round"/>',
    incline: '<path d="M4,18 L12,8 L20,18" stroke-linejoin="round" stroke-linecap="round"/><path d="M12,8 V4"/>',
    ruler: '<path d="M4,12 H20" stroke-linecap="round" stroke-dasharray="2,3"/><path d="M4,9 V15 M20,9 V15"/>',
    waves: '<path d="M3,10 C5,8 7,8 9,10 C11,12 13,12 15,10 C17,8 19,8 21,10" stroke-linecap="round"/><path d="M3,15 C5,13 7,13 9,15 C11,17 13,17 15,15 C17,13 19,13 21,15" stroke-linecap="round"/>',
    people: '<circle cx="9" cy="8" r="3"/><path d="M4,19 C4,15 6.5,13 9,13 C11.5,13 14,15 14,19" stroke-linecap="round"/><circle cx="16" cy="9" r="2.4"/><path d="M13,19 C13.2,16 15,14.5 16,14.5 C18,14.5 20,16.3 20,19" stroke-linecap="round"/>'
  };

  function factRow(iconKey, label, value) {
    if (value === null || value === undefined || value === '') return '';
    var icon = FACT_ICONS[iconKey] || '';
    return '<div class="fact-row">' +
      '<svg class="fact-row__icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">' +
      '<g fill="none" stroke="currentColor" stroke-width="1.6">' + icon + '</g></svg>' +
      '<span class="fact-row__label">' + escapeHtml(label) + '</span>' +
      '<span class="fact-row__value">' + escapeHtml(value) + '</span>' +
      '</div>';
  }

  function factGrid(rows) {
    var joined = rows.filter(Boolean).join('');
    return joined ? '<div class="fact-grid">' + joined + '</div>' : '';
  }

  function listBlock(title, items) {
    if (!items || !items.length) return '';
    return '<h3>' + escapeHtml(title) + '</h3><ul>' +
      items.map(function (i) { return '<li>' + escapeHtml(i) + '</li>'; }).join('') + '</ul>';
  }

  // ---------- Arten-Illustrationen (Schnorcheln) ----------
  // Handgezeichnete, mehrfarbige Illustrationen mit artspezifischen Merkmalen
  // (Diplodus' schwarzer Schwanzfleck, das schwarze Ruecken-Gift-Flossen des
  // Petermaennchens, die violettschwarze Faerbung des Seeigels Paracentrotus
  // lividus u.a.) statt einfarbiger Icon-Silhouetten -- naeher an einer
  // Bestimmungstafel als an einem UI-Icon, aber weiterhin reines Inline-SVG:
  // keine Fotos, kein externes Bild-Hosting, kein zusaetzliches Netzwerk-
  // Request. speciesLikely/speciesCaution enthalten laut validate.js nur
  // exakte Werte aus habitats.json -- die Menge moeglicher Texte ist also
  // geschlossen, eine Stichwort-Zuordnung reicht und bleibt robust gegenueber
  // den leicht unterschiedlichen Formulierungen je Habitat. Jede Form traegt
  // ihre Farben selbst (kein gemeinsames fg/stroke mehr), weil echte Tiere
  // aus mehreren Farbtoenen bestehen statt aus einer Silhouette.
  var SPECIES_ICONS = {
    seabream: { bg: '#dfeef2', shape:
      '<ellipse cx="15" cy="17" rx="9.5" ry="6" fill="#c7ccc0"/>' +
      '<path d="M24,17 L30,10 L26.5,17 L30,24 Z" fill="#8a9186"/>' +
      '<path d="M9.5,11 Q14,5.5 18,11 Z" fill="#8a9186"/>' +
      '<path d="M8,12 L8,22 M11,10.8 L11,23.2 M14.5,10.5 L14.5,23.5 M18,11.3 L18,22.7" stroke="#3a3b32" stroke-width="1.3" opacity="0.5"/>' +
      '<circle cx="22.5" cy="17" r="1.4" fill="#232219"/>' +
      '<circle cx="7.3" cy="15.5" r="1.7" fill="#fff"/><circle cx="7.7" cy="15.5" r="0.85" fill="#1c1b19"/>'
    },
    wrasse: { bg: '#dfeef2', shape:
      '<path d="M4,17 C4,12.5 9,10 15,10 C21,10 26,12.8 28,17 C26,21.2 21,24 15,24 C9,24 4,21.5 4,17 Z" fill="#3f7d5c"/>' +
      '<path d="M15,10 C19,10.6 23,12.8 25,15.5 C21,14.5 17,14.3 13,15 Z" fill="#d98a3d" opacity="0.9"/>' +
      '<path d="M28,17 L32,13 L30,17 L32,21 Z" fill="#2c5940"/>' +
      '<path d="M10,11.5 Q14,8.3 18,11 Z" fill="#2c5940"/>' +
      '<circle cx="7.5" cy="16.3" r="1.6" fill="#fff"/><circle cx="7.9" cy="16.3" r="0.8" fill="#1c1b19"/>' +
      '<path d="M4,18 Q6.5,19.5 4.7,21" stroke="#2c5940" stroke-width="1.1" fill="none"/>'
    },
    mullet: { bg: '#dfeef2', shape:
      '<ellipse cx="16" cy="17" rx="11" ry="4.8" fill="#b7c4c9"/>' +
      '<ellipse cx="16" cy="19.8" rx="9.5" ry="1.7" fill="#e8edee" opacity="0.85"/>' +
      '<path d="M27,17 L33,11.5 L29.5,17 L33,22.5 Z" fill="#7d8c91"/>' +
      '<path d="M13.5,12 Q17,8.6 20.5,12 Z" fill="#7d8c91"/>' +
      '<path d="M8,17 L8,14 M11,17 L11,14.3" stroke="#7d8c91" stroke-width="1" opacity="0.7"/>' +
      '<circle cx="6.6" cy="16.2" r="1.5" fill="#fff"/><circle cx="7" cy="16.2" r="0.75" fill="#1c1b19"/>'
    },
    sandsmelt: { bg: '#dfeef2', shape:
      '<ellipse cx="12" cy="13.5" rx="7.5" ry="2.6" fill="#c3ccce"/>' +
      '<path d="M5.5,13.5 L18.5,13.5" stroke="#8b979a" stroke-width="0.8" opacity="0.8"/>' +
      '<path d="M19.3,13.5 L23.3,11 L21.2,13.5 L23.3,16 Z" fill="#8b979a"/>' +
      '<circle cx="6.4" cy="13.2" r="1" fill="#1c1b19"/>' +
      '<ellipse cx="19" cy="21.5" rx="6.8" ry="2.4" fill="#b7c1c3" opacity="0.95"/>' +
      '<path d="M25.3,21.5 L29,19.1 L27.1,21.5 L29,23.9 Z" fill="#7d8c91" opacity="0.95"/>' +
      '<circle cx="13.5" cy="21.2" r="0.9" fill="#1c1b19"/>'
    },
    goby: { bg: '#dfeef2', shape:
      '<ellipse cx="15" cy="19.5" rx="9" ry="4.2" fill="#a9906b"/>' +
      '<circle cx="11" cy="17.8" r="1.5" fill="#7a6449"/><circle cx="16" cy="20.5" r="1.7" fill="#7a6449"/><circle cx="20.5" cy="18.2" r="1.3" fill="#7a6449"/>' +
      '<path d="M23,19.5 L27.5,16.6 L25.5,19.5 L27.5,22.4 Z" fill="#7a6449"/>' +
      '<path d="M9.5,15.6 Q12.5,13 15,15.6 Z" fill="#7a6449"/>' +
      '<circle cx="8" cy="18.5" r="1.7" fill="#fff"/><circle cx="8.4" cy="18.5" r="0.85" fill="#1c1b19"/>'
    },
    grouper: { bg: '#dfeef2', shape:
      '<path d="M4,18 C4,12 10,8.5 17,8.5 C24,8.5 29,13 29,18 C29,23 24,27 17,27 C10,27 4,24 4,18 Z" fill="#6b5a3d"/>' +
      '<circle cx="10.5" cy="14.5" r="1.7" fill="#4a3f2a"/><circle cx="16" cy="11.7" r="1.4" fill="#4a3f2a"/><circle cx="20" cy="16" r="1.9" fill="#4a3f2a"/><circle cx="12.5" cy="21" r="1.5" fill="#4a3f2a"/><circle cx="21" cy="22" r="1.6" fill="#4a3f2a"/>' +
      '<path d="M4,18 C2.7,16.3 2.7,19.7 4,18 Z" fill="#3a3021"/>' +
      '<circle cx="7.7" cy="14.2" r="1.8" fill="#fff"/><circle cx="8.1" cy="14.2" r="0.9" fill="#1c1b19"/>'
    },
    eel: { bg: '#dfeef2', shape:
      '<path d="M3,20 C8,12 13,26 18,18 C23,11 27,22 32,15" fill="none" stroke="#8a6d3b" stroke-width="5.8" stroke-linecap="round"/>' +
      '<circle cx="6.5" cy="17.6" r="1.2" fill="#4a3820"/><circle cx="14" cy="20.5" r="1.1" fill="#4a3820"/><circle cx="21.5" cy="16" r="1.2" fill="#4a3820"/><circle cx="28" cy="19.5" r="1.1" fill="#4a3820"/>' +
      '<circle cx="4.3" cy="19" r="1.4" fill="#fff"/><circle cx="4.6" cy="19" r="0.7" fill="#1c1b19"/>'
    },
    flatfish: { bg: '#dfeef2', shape:
      '<ellipse cx="16" cy="17" rx="11.5" ry="6.8" fill="#b39a72"/>' +
      '<circle cx="10.5" cy="13.5" r="1.2" fill="#7a6142"/><circle cx="16" cy="12.5" r="1.1" fill="#7a6142"/><circle cx="20.5" cy="14.8" r="1.3" fill="#7a6142"/><circle cx="13.5" cy="19" r="1.1" fill="#7a6142"/><circle cx="19.5" cy="20.3" r="1.2" fill="#7a6142"/>' +
      '<circle cx="9.8" cy="10.5" r="1.6" fill="#fff"/><circle cx="10.2" cy="10.5" r="0.8" fill="#1c1b19"/>' +
      '<circle cx="13.3" cy="9.7" r="1.5" fill="#fff"/><circle cx="13.7" cy="9.7" r="0.75" fill="#1c1b19"/>'
    },
    pipefish: { bg: '#dfeef2', shape:
      '<path d="M2,20 C9,17.3 16,18.3 23,16 L29,14.5" fill="none" stroke="#8a9166" stroke-width="2.3" stroke-linecap="round"/>' +
      '<path d="M29,14.5 L32,13.6" stroke="#8a9166" stroke-width="1.4" stroke-linecap="round"/>' +
      '<path d="M8,18.6 L8,20.2 M14,17.4 L14,19 M20,16.5 L20,18" stroke="#5c6440" stroke-width="0.9"/>' +
      '<circle cx="3.2" cy="19.6" r="1.05" fill="#1c1b19"/>'
    },
    seahorse: { bg: '#dfeef2', shape:
      '<circle cx="19" cy="9" r="3.6" fill="#b58a4a"/>' +
      '<path d="M21.5,7.5 L26,6 L22.5,10 Z" fill="#b58a4a"/>' +
      '<path d="M16.5,12 C12,13.7 9.5,18 14,19.8 C19.5,22 19.5,26.3 14,27.7 C11,28.5 10.3,31.8 14,33" fill="none" stroke="#b58a4a" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M13.7,16 L11.2,16.5 M14.2,20.7 L11.7,21.3 M13.7,25.3 L11.3,26" stroke="#8a6a38" stroke-width="1.1"/>' +
      '<circle cx="18.2" cy="7.9" r="1" fill="#fff"/><circle cx="18.4" cy="7.9" r="0.5" fill="#1c1b19"/>'
    },
    ray: { bg: '#fbecd0', shape:
      '<path d="M16,5 L28,17 L16,23 L4,17 Z" fill="#7d746a"/>' +
      '<path d="M16,23 L16,32" stroke="#5c554a" stroke-width="1.9" stroke-linecap="round"/>' +
      '<path d="M16,29 L18.5,27.3" stroke="#8a5813" stroke-width="1.7" stroke-linecap="round"/>' +
      '<circle cx="13" cy="13" r="1.1" fill="#4a4238"/><circle cx="19" cy="13" r="1.1" fill="#4a4238"/>' +
      '<ellipse cx="16" cy="17.5" rx="7.5" ry="3.2" fill="#948b7e" opacity="0.55"/>'
    },
    octopus: { bg: '#dfeef2', shape:
      '<path d="M10,11 C10,5.5 24,5.5 24,11 C24,16 20,17.7 17,17.7 C14,17.7 10,16 10,11 Z" fill="#8a5040"/>' +
      '<path d="M12,16.5 C10,22 13,25.5 10,31 M15.3,17.5 C14.3,23 17.3,25.5 15.3,32 M18.7,17.5 C19.7,23 16.7,25.5 18.7,31.5 M22,16.5 C24,22 21,25.5 24,30.5" fill="none" stroke="#8a5040" stroke-width="2.3" stroke-linecap="round"/>' +
      '<circle cx="13.5" cy="10.3" r="1.6" fill="#fff"/><circle cx="14" cy="10.3" r="0.8" fill="#1c1b19"/>' +
      '<circle cx="20.5" cy="10.3" r="1.6" fill="#fff"/><circle cx="21" cy="10.3" r="0.8" fill="#1c1b19"/>'
    },
    crab: { bg: '#dfeef2', shape:
      '<circle cx="18" cy="17" r="8.5" fill="#c9a876"/>' +
      '<path d="M18,17 m-5.3,0 a5.3,5.3 0 1,1 10.6,0 a3.5,3.5 0 1,1 -7,0 a2.1,2.1 0 1,1 4.2,0" fill="none" stroke="#a0442c" stroke-width="1.4" opacity="0.85"/>' +
      '<path d="M9.5,12.5 L3.5,9 M9.5,21.5 L3.5,25" stroke="#a0442c" stroke-width="2.1" stroke-linecap="round"/>' +
      '<path d="M3.5,9 L1,6 M3.5,9 L1.3,11 M3.5,25 L1.3,22.5 M3.5,25 L1.3,27.5" stroke="#a0442c" stroke-width="1.7" stroke-linecap="round"/>' +
      '<circle cx="8.7" cy="13" r="1.05" fill="#1c1b19"/>'
    },
    urchin: { bg: '#fbecd0', shape:
      '<circle cx="16" cy="16" r="6.8" fill="#2e2440"/>' +
      '<path d="M16,16 L16,2 M16,16 L16,30 M16,16 L2,16 M16,16 L30,16 M16,16 L6,6 M16,16 L26,26 M16,16 L26,6 M16,16 L6,26 M16,16 L9,3 M16,16 L23,29 M16,16 L3,9 M16,16 L29,23 M16,16 L3,23 M16,16 L29,9 M16,16 L9,29 M16,16 L23,3" stroke="#4a3a60" stroke-width="1.2" stroke-linecap="round"/>' +
      '<circle cx="13.5" cy="13.5" r="1.6" fill="#5a4a78" opacity="0.7"/>'
    },
    cucumber: { bg: '#dfeef2', shape:
      '<path d="M4,17 C4,12.5 9,10.5 16,10.5 C23,10.5 28,12.5 28,17 C28,21.5 23,23.5 16,23.5 C9,23.5 4,21.5 4,17 Z" fill="#6b5842"/>' +
      '<circle cx="9.5" cy="14" r="1" fill="#4a3c2c"/><circle cx="14.5" cy="12.6" r="1" fill="#4a3c2c"/><circle cx="19.5" cy="13.4" r="1" fill="#4a3c2c"/><circle cx="24" cy="14.9" r="1" fill="#4a3c2c"/>' +
      '<circle cx="11.5" cy="20" r="1" fill="#4a3c2c"/><circle cx="17.5" cy="21" r="1" fill="#4a3c2c"/><circle cx="23" cy="19.8" r="1" fill="#4a3c2c"/>'
    },
    worm: { bg: '#fbecd0', shape:
      '<path d="M3,20 C8,14 13,25 18,19 C23,13 27,23 32,17" fill="none" stroke="#a0442c" stroke-width="3.4" stroke-linecap="round"/>' +
      '<path d="M6.5,18 L5.3,15 M6.5,18 L5.3,21 M11.5,21.3 L10.3,18.3 M11.5,21.3 L10.3,24.3 M16.5,18 L15.3,15 M16.5,18 L15.3,21 M21.5,21.3 L20.3,18.3 M21.5,21.3 L20.3,24.3 M26,17.5 L24.9,14.7" stroke="#7a2e1c" stroke-width="1" stroke-linecap="round"/>'
    },
    jellyfish: { bg: '#fbecd0', shape:
      '<path d="M8,15 A9,7.7 0 0 1 28,15 Z" fill="#b8cdd6" opacity="0.92"/>' +
      '<path d="M10.5,15.5 C10.5,18.5 12.8,16.2 12.8,19.2 C12.8,22.2 10.5,20.8 10.5,25.5 M15.3,15.8 C15.3,18.8 17.6,16.5 17.6,19.6 C17.6,22.6 15.3,21.3 15.3,27 M20.2,15.8 C20.2,18.8 22.5,16.5 22.5,19.6 C22.5,22.6 20.2,21.3 20.2,25.7 M25,15.5 C25,18.5 27.3,16.2 27.3,19.2 C27.3,22.2 25,20.8 25,24.7" fill="none" stroke="#7fa3ae" stroke-width="1.3" stroke-linecap="round"/>'
    },
    weever: { bg: '#fbecd0', shape:
      '<path d="M4,21 C4,17.5 9,15.8 15,15.8 C21,15.8 25,17.7 28,20.5 L28,21.7 C25,23.8 21,25 15,25 C9,25 4,23.8 4,21 Z" fill="#a89060"/>' +
      '<path d="M28,21 L32.5,18.2 L30.3,21 L32.5,23.8 Z" fill="#a89060"/>' +
      '<path d="M11,15.8 L9.8,10 L13.2,14.9 L14.3,9.5 L16.5,15.2 L18.2,9.8 L19.3,15.5" fill="#2b241d"/>' +
      '<path d="M2,23.5 C7,25.8 22,25.8 28,23.5 L28,26.5 C20,27.7 9,27.7 2,26.2 Z" fill="#c9b98a" opacity="0.75"/>' +
      '<circle cx="7" cy="19.3" r="1.4" fill="#fff"/><circle cx="7.4" cy="19.3" r="0.7" fill="#1c1b19"/>'
    },
    scorpionfish: { bg: '#fbecd0', shape:
      '<path d="M4,19 C4,12.5 11,9.5 18,9.5 C25,9.5 29,14 29,19 C29,24 24,27 18,27 C11,27 4,25 4,19 Z" fill="#8a5040"/>' +
      '<circle cx="10" cy="16" r="1.6" fill="#5c3428"/><circle cx="15.5" cy="13" r="1.4" fill="#5c3428"/><circle cx="20.5" cy="17" r="1.8" fill="#5c3428"/><circle cx="13" cy="21.5" r="1.5" fill="#5c3428"/><circle cx="21.5" cy="23" r="1.6" fill="#5c3428"/>' +
      '<path d="M12,9.8 L10.8,6 M15.3,9.3 L14.5,5.5 M18.7,9.6 L18.2,5.8 M22,10.8 L21.6,7.3" stroke="#5c3428" stroke-width="1.2" stroke-linecap="round"/>' +
      '<circle cx="7.7" cy="15.3" r="1.7" fill="#fff"/><circle cx="8.1" cy="15.3" r="0.85" fill="#1c1b19"/>'
    }
  };

  // Reihenfolge zaehlt: spezifischere Muster zuerst. "i"-Flag, weil z.B.
  // "Sandgrundeln" das Stichwort "grundel" klein-mitten-im-Wort traegt.
  var SPECIES_ICON_RULES = [
    { test: /Murän/i, icon: 'eel' },
    { test: /Plattfisch/i, icon: 'flatfish' },
    { test: /Seenadel/i, icon: 'pipefish' },
    { test: /Seepferdchen/i, icon: 'seahorse' },
    { test: /Stechrochen/i, icon: 'ray' },
    { test: /Oktopus/i, icon: 'octopus' },
    { test: /Einsiedlerkrebs/i, icon: 'crab' },
    { test: /Seeigel/i, icon: 'urchin' },
    { test: /Seegurke/i, icon: 'cucumber' },
    { test: /Feuerwurm/i, icon: 'worm' },
    { test: /Qualle/i, icon: 'jellyfish' },
    { test: /Petermännchen/i, icon: 'weever' },
    { test: /Drachenkopf/i, icon: 'scorpionfish' },
    { test: /Geißbrass|Meerbrass|Jungfisch/i, icon: 'seabream' },
    { test: /Lippfisch/i, icon: 'wrasse' },
    { test: /Meeräsch/i, icon: 'mullet' },
    { test: /Ährenfisch/i, icon: 'sandsmelt' },
    { test: /Grundel/i, icon: 'goby' },
    { test: /Zackenbarsch/i, icon: 'grouper' }
  ];

  function speciesIconFor(text) {
    for (var i = 0; i < SPECIES_ICON_RULES.length; i++) {
      if (SPECIES_ICON_RULES[i].test.test(text)) return SPECIES_ICONS[SPECIES_ICON_RULES[i].icon];
    }
    // Kein Treffer -- z.B. eine reine Strömungswarnung ohne Lebewesen. Dann
    // lieber kein Icon als eines vorzutaeuschen, das nicht passt.
    return null;
  }

  function speciesListBlock(title, items) {
    if (!items || !items.length) return '';
    var cards = items.map(function (text) {
      var icon = speciesIconFor(text);
      var iconHtml = icon
        ? '<svg viewBox="0 0 32 32" width="44" height="44" aria-hidden="true">' +
          '<circle cx="16" cy="16" r="16" fill="' + icon.bg + '"/>' + icon.shape + '</svg>'
        : '<span class="species-card__no-icon" aria-hidden="true"></span>';
      return '<li class="species-card">' + iconHtml + '<span>' + escapeHtml(text) + '</span></li>';
    }).join('');
    return '<h3>' + escapeHtml(title) + '</h3><ul class="species-grid">' + cards + '</ul>';
  }

  // Jede render*Body-Funktion liefert jetzt eine Liste von Tabs statt eines
  // einzelnen Fliesstext-Blocks -- gruppiert nach Absicht (Überblick/Vor
  // Ort/Hintergrund), nicht nach Datenfeld, damit aus 3+ Bildschirmen
  // linearem Scrollen drei kurze, fokussierte Abschnitte werden. Leere Tabs
  // werden von renderTabsUI() automatisch ausgeblendet.
  function renderBeachBody(e) {
    var ueberblick = '<p>' + escapeHtml(e.summary) + '</p>';
    ueberblick += factGrid([
      factRow('hourglass', 'Zeitbedarf', e.timeNeeded),
      e.snorkeling ? factRow('waves', 'Schnorcheln', e.snorkeling.rating + '/5') : '',
      e.crowding ? factRow('people', 'Belebtheit (Hochsaison)', e.crowding.peakSeason + '/5') : '',
      e.access ? factRow('incline', 'Schwierigkeit', e.access.difficulty) : ''
    ]);
    ueberblick += fieldRow('Untergrund', e.surface);
    ueberblick += fieldRow('Meeresboden', e.seabed);
    ueberblick += fieldRow('Einstieg', e.entry);
    ueberblick += fieldRow('Schatten', e.shade);
    ueberblick += fieldRow('Barfußtauglich', e.barefootFriendly === true ? 'ja' : e.barefootFriendly === false ? 'nein' : null);

    var vorOrt = fieldRow('Windexposition', e.windExposure);
    if (e.crowding && (e.crowding.shoulderSeason != null || e.crowding.timeOfDayNote)) {
      vorOrt += fieldRow('Belebtheit (Nebensaison)', e.crowding.shoulderSeason != null ? e.crowding.shoulderSeason + '/5' : null);
      if (e.crowding.timeOfDayNote) vorOrt += '<p>' + escapeHtml(e.crowding.timeOfDayNote) + '</p>';
    }
    vorOrt += listBlock('Achtung', e.hazards);
    if (e.snorkeling) {
      if (e.snorkeling.visibility) vorOrt += '<h3>Schnorcheln</h3><p>Sicht: ' + escapeHtml(e.snorkeling.visibility) + '</p>';
      vorOrt += speciesListBlock('Habitat-typische Arten', e.snorkeling.speciesLikely);
      vorOrt += speciesListBlock('Vorsicht', e.snorkeling.speciesCaution);
      if ((e.snorkeling.speciesLikely && e.snorkeling.speciesLikely.length) || (e.snorkeling.speciesCaution && e.snorkeling.speciesCaution.length)) {
        vorOrt += '<p class="species-note">' + escapeHtml(habitatsDisclaimer) + '</p>';
      }
    }
    if (e.facilities) {
      vorOrt += '<h3>Infrastruktur</h3>';
      vorOrt += fieldRow('Liegen', e.facilities.sunbeds);
      vorOrt += fieldRow('Taverna', e.facilities.taverna);
      vorOrt += fieldRow('WC', e.facilities.wc === true ? 'ja' : e.facilities.wc === false ? 'nein' : 'nicht verifiziert');
      vorOrt += fieldRow('Trinkwasser', e.facilities.freshwater === true ? 'ja' : e.facilities.freshwater === false ? 'nein' : 'nicht verifiziert');
      vorOrt += fieldRow('Parken', e.facilities.parking || 'nicht verifiziert');
    }
    if (e.access) {
      vorOrt += '<h3>Zugang</h3>';
      vorOrt += fieldRow('Art', e.access.mode);
      vorOrt += fieldRow('Gehzeit ab Parkplatz', e.access.minutesFromParking != null ? e.access.minutesFromParking + ' Min.' : null);
      vorOrt += fieldRow('Wegqualität', e.access.roadQuality);
    }
    vorOrt += fieldRow('Nacktbaden toleriert', e.nudistTolerated === true ? 'ja' : e.nudistTolerated === false ? 'nein' : null);
    vorOrt += fieldRow('Beste Zeit', e.bestTime);

    var hintergrund = fieldRow('Geschichte/Mythos', e.history);

    return [
      { id: 'ueberblick', label: 'Überblick', html: ueberblick },
      { id: 'vor-ort', label: 'Vor Ort', html: vorOrt },
      { id: 'hintergrund', label: 'Hintergrund', html: hintergrund }
    ];
  }

  function renderSiteBody(e) {
    var ueberblick = '<p>' + escapeHtml(e.summary) + '</p>';
    ueberblick += factGrid([factRow('hourglass', 'Zeitbedarf', e.timeNeeded)]);
    if (e.epoch && e.epoch.length) {
      ueberblick += '<div class="chip-row">' + e.epoch.map(function (ep) {
        return '<span class="chip">' + escapeHtml(ep) + '</span>';
      }).join('') + '</div>';
    }
    if (e.whyItMatters) ueberblick += '<h3>Warum das zählt</h3><p>' + escapeHtml(e.whyItMatters) + '</p>';

    var vorOrt = '';
    if (e.whatYouSee) vorOrt += '<h3>Was man sieht</h3><p>' + escapeHtml(e.whatYouSee) + '</p>';
    if (e.walkthrough && e.walkthrough.length) {
      vorOrt += '<h3>Rundgang</h3><ul>' + e.walkthrough.map(function (w) {
        return '<li><strong>' + escapeHtml(w.stop) + ':</strong> ' + escapeHtml(w.note) + '</li>';
      }).join('') + '</ul>';
    }
    vorOrt += factGrid([
      factRow(null, 'Museum vor Ort', e.museumOnSite === true ? 'ja' : e.museumOnSite === false ? 'nein' : null),
      factRow(null, 'Ticket', e.ticketInfo || 'nicht verifiziert')
    ]);
    vorOrt += fieldRow('Gelände', e.terrain);
    vorOrt += fieldRow('Schatten/Hitze', e.shadeAndHeat);

    var hintergrund = fieldRow('Datierung', e.dating);
    if (e.misconceptions) hintergrund += '<h3>Verbreitete Irrtümer</h3><p>' + escapeHtml(e.misconceptions) + '</p>';
    if (e.readingHooks) hintergrund += '<h3>Anknüpfungspunkte</h3><p>' + escapeHtml(e.readingHooks) + '</p>';

    return [
      { id: 'ueberblick', label: 'Überblick', html: ueberblick },
      { id: 'vor-ort', label: 'Vor Ort', html: vorOrt },
      { id: 'hintergrund', label: 'Hintergrund', html: hintergrund }
    ];
  }

  function renderTownBody(e) {
    var ueberblick = '<p>' + escapeHtml(e.summary) + '</p>';
    ueberblick += factGrid([factRow('hourglass', 'Zeitbedarf', e.timeNeeded)]);
    if (e.character) ueberblick += '<h3>Charakter</h3><p>' + escapeHtml(e.character) + '</p>';

    var vorOrt = listBlock('Was tun', e.whatToDo);
    vorOrt += fieldRow('Parken', e.parking);
    if (e.foodScene) vorOrt += '<h3>Essen</h3><p>' + escapeHtml(e.foodScene) + '</p>';
    if (e.walkingTour) vorOrt += renderWalkingTourSection(e);

    var hintergrund = '';
    if (e.historyTimeline && e.historyTimeline.length) {
      hintergrund += '<ul>' + e.historyTimeline.map(function (h) {
        return '<li><strong>' + escapeHtml(h.period) + ':</strong> ' + escapeHtml(h.note) + '</li>';
      }).join('') + '</ul>';
    }

    return [
      { id: 'ueberblick', label: 'Überblick', html: ueberblick },
      { id: 'vor-ort', label: 'Vor Ort', html: vorOrt },
      { id: 'hintergrund', label: 'Hintergrund', html: hintergrund }
    ];
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

  var GENERIC_FIELD_LABELS = {
    epoch: 'Epoche', dating: 'Datierung', whyItMatters: 'Warum das zählt',
    whatYouSee: 'Was man sieht', terrain: 'Gelände', shadeAndHeat: 'Schatten/Hitze',
    durationHours: 'Dauer', elevationGainM: 'Höhenmeter', waymarking: 'Markierung',
    bestTime: 'Beste Zeit', sunsetSunrise: 'Sonnenauf-/-untergang'
  };

  function renderGenericBody(e) {
    var ueberblick = '<p>' + escapeHtml(e.summary) + '</p>';
    // Nur kurze, verlaesslich knappe Werte in die Fakten-Zeilen -- durationHours
    // ist bei mehreren Wanderungen ein ganzer Hinweissatz (widersprechende
    // Quellen zu Distanz/Dauer), keine kurze Kennzahl, und bleibt deshalb unten
    // als normaler Fliesstext.
    ueberblick += factGrid([
      factRow('hourglass', 'Zeitbedarf', e.timeNeeded),
      factRow('incline', 'Schwierigkeit', e.difficulty || (e.access && e.access.difficulty)),
      factRow('ruler', 'Distanz', e.distanceKm != null ? e.distanceKm + ' km' : null),
      factRow(null, 'Höhenmeter', e.elevationGainM != null ? e.elevationGainM + ' m' : null)
    ]);

    var vorOrt = '';
    ['terrain', 'shadeAndHeat', 'durationHours', 'waymarking', 'bestTime', 'sunsetSunrise'].forEach(function (key) {
      var v = e[key];
      if (Array.isArray(v)) v = v.join(', ');
      vorOrt += fieldRow(GENERIC_FIELD_LABELS[key] || key, v);
    });
    if (e.access) vorOrt += fieldRow('Zugang', e.access.mode);

    var hintergrund = '';
    ['epoch', 'dating', 'whyItMatters', 'whatYouSee'].forEach(function (key) {
      var v = e[key];
      if (Array.isArray(v)) v = v.join(', ');
      hintergrund += fieldRow(GENERIC_FIELD_LABELS[key] || key, v);
    });

    return [
      { id: 'ueberblick', label: 'Überblick', html: ueberblick },
      { id: 'vor-ort', label: 'Vor Ort', html: vorOrt },
      { id: 'hintergrund', label: 'Hintergrund', html: hintergrund }
    ];
  }

  // Baut Tab-Leiste + Panels aus einer Liste { id, label, html }. Leere Tabs
  // (kein Inhalt fuer diesen Eintrag) werden herausgefiltert statt als leerer
  // Reiter angezeigt zu werden. Bleibt nur ein Tab uebrig, entfaellt die
  // Tab-Leiste komplett -- eine einzelne Reiterbeschriftung waere unnoetig.
  function renderTabsUI(tabs) {
    var visible = tabs.filter(function (t) { return t && t.html && t.html.trim(); });
    if (!visible.length) return '';
    if (visible.length === 1) return visible[0].html;
    var bar = '<div class="sheet-tabs">' + visible.map(function (t, i) {
      return '<button type="button" class="sheet-tab' + (i === 0 ? ' active' : '') +
        '" data-sheet-tab="' + escapeHtml(t.id) + '">' + escapeHtml(t.label) + '</button>';
    }).join('') + '</div>';
    var panels = visible.map(function (t, i) {
      return '<div class="sheet-tab-panel" data-sheet-panel="' + escapeHtml(t.id) + '"' + (i === 0 ? '' : ' hidden') + '>' + t.html + '</div>';
    }).join('');
    return '<div class="sheet-tabs-wrap">' + bar + panels + '</div>';
  }

  function renderSheetBody(e) {
    // Selbst erfasste Orte haben ein reduziertes Feldset ohne Tab-Struktur.
    if (e.source === 'user') return renderUserBody(e);
    var tabs;
    if (e.type === 'beach') {
      tabs = renderBeachBody(e);
    } else if (e.type === 'site' || e.type === 'monastery_castle') {
      // monastery_castle teilt sich praktisch dieselbe Feldstruktur wie site
      // (epoch/dating/whyItMatters/whatYouSee/walkthrough/misconceptions/...)
      // und bekommt daher dieselbe, vollstaendigere Darstellung statt der
      // generischen Fallback-Ansicht.
      tabs = renderSiteBody(e);
    } else if (e.type === 'town') {
      tabs = renderTownBody(e);
    } else {
      tabs = renderGenericBody(e);
    }
    return renderTabsUI(tabs);
  }

  function openSheet(id) {
    var e = entriesById[id];
    if (!e) return;
    currentSheetEntryId = id;
    sheetNameEl.innerHTML = escapeHtml(e.name) + (e.nameGr ? '<span class="name-gr">' + escapeHtml(e.nameGr) + '</span>' : '');
    sheetFavBtn.classList.toggle('is-favorite', favorites.has(id));
    sheetFavBtn.textContent = favorites.has(id) ? '★' : '☆';

    var badges = '<span class="badge">' + escapeHtml(TYPE_LABELS[e.type] || e.type) + '</span>';
    if (e.region) badges += '<span class="badge">' + escapeHtml(REGION_LABELS[e.region] || e.region) + '</span>';
    if (e.source === 'user') badges += '<span class="badge badge-user">Eigener Ort</span>';
    if (e.touristTrapRisk) {
      badges += '<span class="badge badge-trap" title="' + escapeHtml(e.touristTrapRisk.note || '') + '">Touristenfalle ' + e.touristTrapRisk.level + '/5</span>';
    }
    if (e.confidence === 'low') badges += '<span class="badge badge-low-confidence">Unsichere Angaben</span>';
    if (e.coordSource === 'approx') badges += '<span class="badge">Position ungefähr</span>';
    sheetBadgesEl.innerHTML = badges;

    // Vorschau bleibt im fixen Header sichtbar, unabhaengig vom Sheet-Zustand
    // (peek/half/full) und vom Scroll-/Tab-Stand darunter -- im peek-Zustand
    // ist das die einzige Information, die ueber den Namen hinausgeht.
    if (e.timeNeeded || e.summary) {
      sheetPreviewEl.innerHTML =
        (e.timeNeeded ? '<span class="fact">' + escapeHtml(e.timeNeeded) + '</span>' : '') +
        (e.summary ? '<span class="summary">' + escapeHtml(e.summary) + '</span>' : '');
      sheetPreviewEl.hidden = false;
    } else {
      sheetPreviewEl.hidden = true;
    }

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
    var v = visits[id];
    var current = v ? v.rating : 0;
    var stars = '';
    for (var i = 1; i <= 5; i++) {
      stars += '<button type="button" class="sheet-rating__star' + (i <= current ? ' is-filled' : '') +
        '" data-rate="' + i + '" aria-label="' + i + ' Sterne">' + (i <= current ? '★' : '☆') + '</button>';
    }
    var html = '<div class="sheet-rating">' +
      '<span class="sheet-rating__stars">' + stars + '</span>' +
      (current ? '<button type="button" class="sheet-rating__clear" data-rate-clear>War doch nicht hier</button>' : '<span class="species-note">War ich hier?</span>') +
      '</div>';
    if (current && current <= 2) {
      var activeReasons = v.dislikeReasons || [];
      html += '<div class="dislike-reasons">' +
        '<span class="species-note">Was hat nicht gefallen? (optional, schärft künftige Empfehlungen)</span>' +
        '<div class="chip-row">' +
        DISLIKE_REASONS.map(function (r) {
          var active = activeReasons.indexOf(r.id) !== -1;
          return '<button type="button" class="chip' + (active ? ' active' : '') +
            '" data-dislike-reason="' + r.id + '">' + escapeHtml(r.label) + '</button>';
        }).join('') +
        '</div></div>';
    }
    return html;
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
    var reasonBtn = ev.target.closest('[data-dislike-reason]');
    if (reasonBtn && currentSheetEntryId) {
      toggleDislikeReason(currentSheetEntryId, reasonBtn.getAttribute('data-dislike-reason'));
      openSheet(currentSheetEntryId);
      return;
    }
    var openBtn = ev.target.closest('[data-open-entry]');
    if (openBtn) {
      openSheet(openBtn.getAttribute('data-open-entry'));
      return;
    }
    var sheetTabBtn = ev.target.closest('[data-sheet-tab]');
    if (sheetTabBtn) {
      var tabsWrap = sheetTabBtn.closest('.sheet-tabs-wrap');
      tabsWrap.querySelectorAll('[data-sheet-tab]').forEach(function (b) { b.classList.remove('active'); });
      sheetTabBtn.classList.add('active');
      var targetTab = sheetTabBtn.getAttribute('data-sheet-tab');
      tabsWrap.querySelectorAll('[data-sheet-panel]').forEach(function (p) {
        p.hidden = p.getAttribute('data-sheet-panel') !== targetTab;
      });
      sheetBodyEl.scrollTop = 0;
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

  // ---------- "Ich"-Modal (Gemerkt/Bewertet/Daten) ----------
  // War frueher ein einzelnes "Favoriten"-Modal, das Favoriten, Bewertungen,
  // Empfehlungen und Export/Import untereinander wegscrollte -- vier Themen,
  // die nur zufaellig zusammen entstanden sind. Jetzt drei Reiter nach
  // Absicht, dasselbe Muster wie bei den Orts-Tabs im Sheet.

  var profileToggle = document.getElementById('profile-toggle');
  var profileModal = document.getElementById('profile-modal');
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
      var reasonLabels = r.dislikeReasons.map(function (id) {
        var found = DISLIKE_REASONS.filter(function (x) { return x.id === id; })[0];
        return found ? found.label : id;
      });
      var reasonHtml = reasonLabels.length ? '<span class="why">' + escapeHtml(reasonLabels.join(', ')) + '</span>' : '';
      return '<button type="button" class="similar-place-btn" data-open-entry-modal="' + escapeHtml(r.entry.id) + '"><strong>' + escapeHtml(r.entry.name) + '</strong> ' +
        '<span class="rating-star-row">' + stars + '</span>' + reasonHtml + '</button>';
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

  function renderProfileModal() {
    renderFavoritesList();
    renderRatingsList();
    renderRecommendationsList();
  }

  profileToggle.addEventListener('click', function () {
    renderProfileModal();
    profileModal.hidden = false;
  });
  profileModal.addEventListener('click', function (ev) {
    var tabBtn = ev.target.closest('[data-profile-tab]');
    if (tabBtn) {
      var target = tabBtn.getAttribute('data-profile-tab');
      profileModal.querySelectorAll('[data-profile-tab]').forEach(function (b) { b.classList.remove('active'); });
      tabBtn.classList.add('active');
      profileModal.querySelectorAll('[data-profile-panel]').forEach(function (p) {
        p.hidden = p.getAttribute('data-profile-panel') !== target;
      });
      return;
    }
    var btn = ev.target.closest('[data-open-entry-modal]');
    if (!btn) return;
    profileModal.hidden = true;
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
      renderProfileModal();
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

  // ---------- Eigene Orte ----------
  // Erfassung laeuft gegen /api/places (Vercel-Function), die die Eintraege
  // versioniert in data/eigene.json im Repo ablegt. Gelesen wird zur Laufzeit
  // statt aus dem gebauten Bundle, damit ein neuer Ort sofort auf der Karte
  // steht und nicht auf ein Deploy wartet. Eigene Orte bleiben bewusst von den
  // kuratierten Eintraegen getrennt: source='user', eigenes Marker-Kennzeichen,
  // und sie durchlaufen nicht die Faktenpruefung des kuratierten Bestands.

  var PLACES_API = '/api/places';

  var addPlaceBtn = document.getElementById('add-place-btn');
  var placeModal = document.getElementById('place-modal');
  var placeModalTitle = document.getElementById('place-modal-title');
  var placeNameEl = document.getElementById('place-name');
  var placeTypeEl = document.getElementById('place-type');
  var placePasteEl = document.getElementById('place-pos-paste');
  var placeReadoutEl = document.getElementById('place-pos-readout');
  var placeSummaryEl = document.getElementById('place-summary');
  var placeNotesEl = document.getElementById('place-notes');
  var placeTagsEl = document.getElementById('place-tags');
  var placeKeyRow = document.getElementById('place-key-row');
  var placeKeyEl = document.getElementById('place-key');
  var placeErrorEl = document.getElementById('place-error');
  var placeSaveBtn = document.getElementById('place-save');
  var placeDeleteBtn = document.getElementById('place-delete');
  var placeBeachBlock = document.getElementById('place-beach-block');
  var placeSnorkelEl = document.getElementById('place-beach-snorkel');
  var pickHint = document.getElementById('pick-hint');
  var beachFieldEls = {
    surface: document.getElementById('place-beach-surface'),
    seabed: document.getElementById('place-beach-seabed'),
    entry: document.getElementById('place-beach-entry'),
    shade: document.getElementById('place-beach-shade'),
    parking: document.getElementById('place-beach-parking')
  };

  var editingPlaceId = null;
  var draftCoords = null;
  var draftCoordSource = 'approx';

  Object.keys(TYPE_LABELS).forEach(function (t) {
    var opt = document.createElement('option');
    opt.value = t;
    opt.textContent = TYPE_LABELS[t];
    placeTypeEl.appendChild(opt);
  });

  // Region wird nicht abgefragt, sondern aus dem naechstgelegenen kuratierten
  // Eintrag abgeleitet -- ein Feld weniger im Formular, und die Region-Filter
  // greifen trotzdem.
  function nearestRegion(coords) {
    var best = null;
    var bestKm = Infinity;
    allEntries.forEach(function (e) {
      if (e.source === 'user' || !e.region) return;
      var km = haversineKm(coords, e.coords);
      if (km < bestKm) { bestKm = km; best = e.region; }
    });
    return best;
  }

  function mergeUserEntries(list) {
    // In-place aktualisieren, damit bestehende Referenzen auf allEntries gueltig bleiben.
    for (var i = allEntries.length - 1; i >= 0; i--) {
      if (allEntries[i].source === 'user') {
        delete entriesById[allEntries[i].id];
        allEntries.splice(i, 1);
      }
    }
    list.forEach(function (e) {
      if (!e || !e.id || !Array.isArray(e.coords) || e.coords.length !== 2) return;
      e.source = 'user';
      allEntries.push(e);
      entriesById[e.id] = e;
    });
    renderFilterChips();
    renderMarkers();
  }

  function loadUserEntries() {
    return fetch(PLACES_API, { headers: { Accept: 'application/json' } })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (data) {
        if (data && Array.isArray(data.entries)) mergeUserEntries(data.entries);
      })
      .catch(function () {
        // Kein Server erreichbar: der kuratierte Guide funktioniert unveraendert weiter.
      });
  }

  function showPlaceError(msg) {
    placeErrorEl.textContent = msg || '';
    placeErrorEl.hidden = !msg;
  }

  function setDraftCoords(coords, source) {
    draftCoords = [coords[0], coords[1]];
    draftCoordSource = source;
    var region = nearestRegion(draftCoords);
    placeReadoutEl.textContent = draftCoords[0].toFixed(5) + ', ' + draftCoords[1].toFixed(5) +
      ' · ' + (source === 'exact' ? 'GPS-genau' : 'ungefähr') +
      (region ? ' · ' + (REGION_LABELS[region] || region) : '');
  }

  function syncBeachBlock() {
    placeBeachBlock.hidden = placeTypeEl.value !== 'beach';
  }
  placeTypeEl.addEventListener('change', syncBeachBlock);

  function openPlaceForm(entry) {
    editingPlaceId = entry ? entry.id : null;
    placeModalTitle.textContent = entry ? 'Eigenen Ort bearbeiten' : 'Eigenen Ort hinzufügen';
    placeNameEl.value = entry ? entry.name : '';
    placeTypeEl.value = entry ? entry.type : 'beach';
    placeSummaryEl.value = (entry && entry.summary) || '';
    placeNotesEl.value = (entry && entry.notes) || '';
    placeTagsEl.value = entry && entry.tags ? entry.tags.join(', ') : '';
    placePasteEl.value = '';
    Object.keys(beachFieldEls).forEach(function (k) {
      beachFieldEls[k].value = (entry && entry.beach && entry.beach[k]) || '';
    });
    placeSnorkelEl.value = entry && entry.beach && typeof entry.beach.snorkelRating === 'number'
      ? String(entry.beach.snorkelRating) : '';
    placeDeleteBtn.hidden = !entry;
    placeKeyRow.hidden = !!storageGet('peloponnes:writeKey');
    placeKeyEl.value = '';
    showPlaceError('');
    syncBeachBlock();
    if (entry) {
      setDraftCoords(entry.coords, entry.coordSource || 'approx');
    } else {
      draftCoords = null;
      draftCoordSource = 'approx';
      placeReadoutEl.textContent = 'Noch keine Position gesetzt.';
    }
    placeModal.hidden = false;
  }

  document.getElementById('place-pos-gps').addEventListener('click', function () {
    if (!navigator.geolocation) {
      showPlaceError('Dieses Gerät liefert keine Standortdaten.');
      return;
    }
    showPlaceError('');
    placeReadoutEl.textContent = 'Standort wird ermittelt…';
    navigator.geolocation.getCurrentPosition(function (pos) {
      setDraftCoords([pos.coords.latitude, pos.coords.longitude], 'exact');
    }, function () {
      placeReadoutEl.textContent = 'Standort nicht verfügbar.';
      showPlaceError('Standort nicht ermittelbar — Koordinaten einfügen oder auf der Karte wählen.');
    }, { enableHighAccuracy: true, timeout: 10000 });
  });

  document.getElementById('place-pos-map').addEventListener('click', function () {
    placeModal.hidden = true;
    pickHint.hidden = false;
    map.once('click', function (ev) {
      pickHint.hidden = true;
      placeModal.hidden = false;
      setDraftCoords([ev.latlng.lat, ev.latlng.lng], 'approx');
    });
  });

  // Koordinaten aus Google Maps o.ä. einfuegen: "36.9583, 21.6597"
  placePasteEl.addEventListener('input', function () {
    var m = placePasteEl.value.match(/(-?\d+(?:\.\d+)?)\s*[,\s]\s*(-?\d+(?:\.\d+)?)/);
    if (!m) return;
    var lat = parseFloat(m[1]);
    var lon = parseFloat(m[2]);
    if (!isFinite(lat) || !isFinite(lon)) return;
    setDraftCoords([lat, lon], 'approx');
  });

  function collectPlacePayload() {
    var name = placeNameEl.value.trim();
    if (!name) return { error: 'Bitte einen Namen eingeben.' };
    if (!draftCoords) return { error: 'Bitte eine Position setzen.' };

    var payload = {
      name: name,
      type: placeTypeEl.value,
      coords: draftCoords,
      coordSource: draftCoordSource,
      region: nearestRegion(draftCoords),
      summary: placeSummaryEl.value.trim() || null,
      notes: placeNotesEl.value.trim() || null,
      tags: placeTagsEl.value.split(',').map(function (t) { return t.trim(); }).filter(Boolean)
    };

    if (payload.type === 'beach') {
      var beach = {};
      Object.keys(beachFieldEls).forEach(function (k) {
        var v = beachFieldEls[k].value.trim();
        if (v) beach[k] = v;
      });
      if (placeSnorkelEl.value !== '') beach.snorkelRating = parseInt(placeSnorkelEl.value, 10);
      if (Object.keys(beach).length) payload.beach = beach;
    }
    return { payload: payload };
  }

  function sendPlace(method, body) {
    var key = placeKeyRow.hidden ? storageGet('peloponnes:writeKey') : placeKeyEl.value.trim();
    if (!key) return Promise.reject(new Error('Bitte den Schreibschlüssel eingeben.'));
    return fetch(PLACES_API, {
      method: method,
      headers: { 'Content-Type': 'application/json', 'x-guide-key': key },
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok) throw new Error(data.error || ('Server antwortete mit ' + res.status + '.'));
        storageSet('peloponnes:writeKey', key);
        return data;
      });
    });
  }

  placeSaveBtn.addEventListener('click', function () {
    var collected = collectPlacePayload();
    if (collected.error) { showPlaceError(collected.error); return; }

    var body = collected.payload;
    var method = 'POST';
    if (editingPlaceId) { body.id = editingPlaceId; method = 'PUT'; }

    placeSaveBtn.disabled = true;
    showPlaceError('');
    sendPlace(method, body)
      .then(function (data) {
        var id = (data && data.entry && data.entry.id) || editingPlaceId;
        return loadUserEntries().then(function () { return id; });
      })
      .then(function (id) {
        placeModal.hidden = true;
        if (id && entriesById[id]) openSheet(id);
      })
      .catch(function (err) { showPlaceError(err.message); })
      .then(function () { placeSaveBtn.disabled = false; });
  });

  placeDeleteBtn.addEventListener('click', function () {
    if (!editingPlaceId) return;
    if (!window.confirm('Diesen eigenen Ort wirklich löschen?')) return;
    placeDeleteBtn.disabled = true;
    showPlaceError('');
    sendPlace('DELETE', { id: editingPlaceId })
      .then(function () { return loadUserEntries(); })
      .then(function () { placeModal.hidden = true; closeSheet(); })
      .catch(function (err) { showPlaceError(err.message); })
      .then(function () { placeDeleteBtn.disabled = false; });
  });

  addPlaceBtn.addEventListener('click', function () { openPlaceForm(null); });

  sheetBodyEl.addEventListener('click', function (ev) {
    var btn = ev.target.closest('[data-edit-place]');
    if (!btn) return;
    var entry = entriesById[btn.getAttribute('data-edit-place')];
    if (entry) openPlaceForm(entry);
  });

  function renderUserBody(e) {
    var html = '';
    if (e.summary) html += '<p>' + escapeHtml(e.summary) + '</p>';
    if (e.beach) {
      html += fieldRow('Untergrund', e.beach.surface);
      html += fieldRow('Meeresboden', e.beach.seabed);
      html += fieldRow('Einstieg', e.beach.entry);
      html += fieldRow('Schatten', e.beach.shade);
      html += fieldRow('Parken', e.beach.parking);
      html += fieldRow('Zugang', e.beach.access);
      if (typeof e.beach.snorkelRating === 'number') {
        html += fieldRow('Schnorcheln', e.beach.snorkelRating + '/5');
      }
    }
    if (e.notes) {
      html += '<h3>Notizen</h3><p>' + escapeHtml(e.notes).replace(/\n/g, '<br>') + '</p>';
    }
    html += '<p class="species-note">Selbst erfasst' +
      (e.createdAt ? ' am ' + escapeHtml(new Date(e.createdAt).toLocaleDateString('de-DE')) : '') +
      ' · nicht gegengeprüft.</p>';
    html += '<button type="button" class="btn place-edit-btn" data-edit-place="' +
      escapeHtml(e.id) + '">Bearbeiten</button>';
    return html;
  }

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
  loadUserEntries();

  window.__peloponnesGuide = {
    map: map, bounds: bounds, state: state, allEntries: allEntries,
    openSheet: openSheet, closeSheet: closeSheet, renderMarkers: renderMarkers,
    groupIntoClusters: groupIntoClusters, favorites: favorites,
    visits: visits, setRating: setRating, recommendations: recommendations,
    similarEntries: similarEntries, startTour: startTour, tourStep: tourStep,
    exitTour: exitTour, getTourState: function () { return tourState; },
    allRoutes: allRoutes, startRoute: startRoute, routeStep: routeStep,
    exitRoute: exitRoute, getRouteState: function () { return routeTripState; },
    loadUserEntries: loadUserEntries, openPlaceForm: openPlaceForm,
    mergeUserEntries: mergeUserEntries, nearestRegion: nearestRegion,
    buildTasteProfiles: buildTasteProfiles, reasonFeaturesForCandidate: reasonFeaturesForCandidate,
    speciesListBlock: speciesListBlock
  };
})();
