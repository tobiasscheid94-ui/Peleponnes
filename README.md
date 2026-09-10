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

## Build (ab Phase 2)

```
node build.js
```

Erzeugt `dist/peloponnes-guide.html` — eine einzelne, vollständig
eigenständige Datei mit allen Assets inline (kein Netzwerk-Request zum
Start nötig).
