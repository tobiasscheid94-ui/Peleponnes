# Peloponnes Reiseguide

Interaktiver, karten-basierter Reiseguide für die Peloponnes. Läuft als einzelne
HTML-Datei offline aus der iPad-Dateien-App (`file://`), ohne Server, ohne
Laufzeit-Abhängigkeiten. Details siehe Projekt-Brief.

## Entwicklung

Keine Build-Frameworks, kein npm zur Laufzeit. Vanilla JS/CSS/HTML in `src/`,
Leaflet als lokale Kopie in `vendor/`, Inhalte als JSON in `data/`.

`src/index.html` kann während der Entwicklung direkt im Browser geöffnet
werden (Skripte/Styles werden relativ geladen, das funktioniert auch per
`file://`).

## Daten validieren

```
node tools/validate.js
```

Prüft alle Einträge unter `data/*.json` gegen `data/schema.json`
(Pflichtfelder, Werte-Bereiche, Textlängen, Koordinaten-Bounding-Box,
doppelte IDs, Habitat-konsistente Artenlisten).

## Build

```
node build.js
```

Validiert zuerst alle Inhalte (`tools/validate.js`) und erzeugt dann
`dist/peloponnes-guide.html` — eine einzelne, vollständig eigenständige
Datei mit CSS/JS/Content/Basemap inline (kein Netzwerk-Request zum Start
nötig). Bricht bei Validierungsfehlern oder > 5 MB Dateigröße ab.

## Offline-Basiskarte (`geo/basemap.geojson`)

Abweichend vom ursprünglichen Plan (Natural Earth + Geofabrik-OSM-Extract,
manuell per `mapshaper` verarbeitet) stammt die Landfläche/Küstenlinie der
Offline-Karte aus dem npm-Paket `@geo-maps/earth-lands-1km`
(simonepri/geo-maps), da `naturalearthdata.com` und `download.geofabrik.de`
im Build-Netzwerk dieser Sitzung blockiert waren. Die Daten sind ihrerseits
aus OpenStreetMap abgeleitet (ODbL, Attribution im UI vorhanden), auf die
Peloponnes-Bounding-Box zugeschnitten (`mapshaper -clip`) und liegen in
~1 km Auflösung vor — als grober Offline-Fallback ausreichend, aber ohne
Straßen (Geofabrik-Straßendaten waren nicht erreichbar). Bei Bedarf lässt
sich `geo/basemap.geojson` später gegen eine feinere/andere Quelle
austauschen, ohne `build.js` anzupassen.
