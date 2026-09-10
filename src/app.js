// Peloponnes-Guide — Phase 0: Karten-Shell.
// Vollstaendige UI (Layer-Umschaltung, Cluster, Bottom Sheet, Filter, Suche,
// Favoriten) folgt in Phase 1. Hier nur: Karte initialisieren und anzeigen.

(function () {
  'use strict';

  var PELOPONNES_BBOX = {
    minLon: 20.9,
    minLat: 36.3,
    maxLon: 23.4,
    maxLat: 38.4
  };

  var bounds = L.latLngBounds(
    [PELOPONNES_BBOX.minLat, PELOPONNES_BBOX.minLon],
    [PELOPONNES_BBOX.maxLat, PELOPONNES_BBOX.maxLon]
  );

  var map = L.map('map', {
    zoomControl: true,
    attributionControl: true,
    tap: true
  });

  map.fitBounds(bounds);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende'
  }).addTo(map);

  // Fuer Phase 1/2 zugaenglich machen (Layer-Wechsel, Marker, etc.).
  window.__peloponnesGuide = { map: map, bounds: bounds };
})();
