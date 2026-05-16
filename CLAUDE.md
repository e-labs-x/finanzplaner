# Finanzplaner — Claude Code Session Guide

**Aktuelle Version:** v12.0 | **Stand:** Mai 2026

---

## Arbeitsweise — Pflichtregeln

**Best Practices sind Standard, keine Option.**
Weiche nur ab, wenn es einen konkreten Grund gibt — und erkläre diesen Grund unaufgefordert, bevor Code geschrieben wird.

**Lesen vor Schreiben.**
Vor jeder Implementierung die relevanten Codeabschnitte lesen und verstehen:
- Datenformate klären (z.B. wie Datum, Betrag, Kategorie-IDs gespeichert sind)
- Vorhandene Funktionen und Konventionen suchen, bevor neue geschrieben werden
- Store-APIs und bestehende Patterns prüfen, bevor sie genutzt werden

**Fragen ist Pflicht — Raten ist verboten.**
Bei Unklarheiten nachfragen, nicht schätzen. Jede vermeidbare Korrektur-Runde kostet Zeit.

Typische Pflicht-Fragen vor dem Start:
- Unbekanntes Datenformat oder unklare Datenstruktur → fragen
- Anforderung ist mehrdeutig oder unvollständig → klären
- Verhalten einer bestehenden Funktion nicht eindeutig aus dem Code ersichtlich → lesen oder fragen

---

## Design- und UX-Aufgaben — Pflichtprozess (niemals überspringen)

### Das Problem, das es zu verhindern gilt
Vage Anforderungen ("mach es wie X", "näher an Y") führen zu Stunden Aufwand
für Ergebnisse, die der Erwartung nicht entsprechen. Dieser Prozess ist
Pflicht — kein optionaler Schritt.

### Schritt 1 — Scope definieren, bevor Code geschrieben wird
Bei jeder Anfrage mit visuellem oder UX-Bezug:

1. **Was genau soll anders aussehen?**
   Konkrete Elemente nennen: Karten, Navigation, Farben, Abstände, Schrift.
   Nicht akzeptabel: "wie Monarch", "moderner", "schöner".

2. **Was bleibt unverändert?**
   Explizit abgrenzen, damit der Scope klar ist.

3. **Ist das in einer Session machbar?**
   Wenn nicht: Session aufteilen und Teilziel definieren.
   Niemals eine Mammutaufgabe beginnen ohne Meilenstein.

4. **Schriftliche Zusammenfassung zeigen und Freigabe einholen:**
   > "Ich werde folgendes ändern: [Liste]. Das wird so aussehen: [Beschreibung].
   > Ist das was du meinst? Soll ich anfangen?"
   Erst nach explizitem Ja weitermachen.

### Schritt 2 — Nach erstem Deploy: Sichtkontrolle Pflicht
Nach dem ersten Deploy einer Design-Änderung immer fragen:
> "Bitte schau es dir live an. Entspricht es dem was du dir vorgestellt hast?"
Erst wenn Bestätigung kommt, weiter mit dem nächsten Schritt.
Niemals mehrere Design-Schritte hintereinander ohne Zwischenfeedback.

### Schritt 3 — Aufwands-Ehrlichkeit
Wenn eine Anfrage nicht in einer Session umsetzbar ist, das sofort sagen:
> "Das was du beschreibst ist eine vollständige visuelle Umgestaltung.
> Das bedeutet X Stunden Arbeit und braucht eine eigene Session mit klarem Plan.
> Willst du das so angehen, oder soll ich einen kleineren Teilschritt vorschlagen?"
Niemals klein anfangen und hoffen dass es reicht.

---

## Dateistruktur (seit v12.0 — 4 separate Dateien)

| Datei | Inhalt |
|---|---|
| `index.html` | Nur HTML-Gerüst, keine Logik |
| `style.css` | Gesamtes Design-System + alle CSS-Tokens |
| `store.js` | FP.Store + FP.Calculator + GHSync — **kein UI-Code** |
| `app.js` | Gesamte UI-Logik (Tab-Renderer, Event-Handler) |

**Repo:** `C:\Users\enesc\finanzplaner-repo\`
**Live-URL:** https://e-labs-x.github.io/finanzplaner/
**Jährliche Prüfliste:** `C:\Users\enesc\OneDrive\Dokumente\07 Projekte\Claude\Finanzen\Finanzen App\jaehrliche_pruefung.md`

### Trennungsregel (niemals brechen)
- `store.js` enthält **kein** `document.`, **kein** `getElementById`, **kein** DOM-Zugriff
- `app.js` ruft nur `FP.Store.*` und `FP.Calculator.*` auf — greift nie auf interne Store-Felder direkt zu
- `style.css` ist unabhängig — Änderungen dort können niemals Berechnungen brechen

---

## Deploy-Workflow

**Backup vor jeder Session:**
```
Alle 4 Dateien mit Datum in den files-Ordner kopieren:
C:\Users\enesc\OneDrive\Dokumente\07 Projekte\Claude\Finanzen\Finanzen App\files\
```

**Nach Änderungen deployen:**
```
cd C:\Users\enesc\finanzplaner-repo
git add index.html style.css store.js app.js
git commit -m "Deploy: Finanzplaner vX.Y — Beschreibung"
git push
```
Nach ~1 Min ist die Live-URL aktualisiert.

**WICHTIG — Cache-Busting:** Bei jedem Deploy das Datum in den Script/CSS-Tags in `index.html` aktualisieren:
```html
<link rel="stylesheet" href="style.css?v=YYYYMMDD">
<script src="store.js?v=YYYYMMDD"></script>
<script src="app.js?v=YYYYMMDD"></script>
```
Ohne das können Browser alte Versionen der JS/CSS-Dateien cachen und Fixes greifen nicht.

**Version bumpen** (bei neuen Meilensteinen): `<title>`, `FP_VERSION` in store.js, `<div class="sb-ver">` in index.html.

---

## Session starten

1. Relevante Datei(en) einlesen — je nach Aufgabe `store.js` (Logik) oder `app.js` (UI)
2. Nur **ein Feature oder 1–2 Bugs** pro Session
3. Backup nicht vergessen

---

## Architektur

**Schlüsselfunktionen (store.js):**
- `calcRente(personId, scenarioId)` → großes result-Objekt, alles in einem Pass
- `GHSync.push() / GHSync.pull()` → GitHub Sync via API
- `window.FP = { Store, Calculator, ... }` → Export am Ende von store.js

**Schlüsselfunktionen (app.js):**
- `rpRenderMain()` → ruft calcRente P1+P2, delegiert an KPI + Tabs
- `rpQuickSave()` → liest DOM → schreibt Store → ruft rpRenderMain()
- `rpFillForm()` → liest Store → befüllt DOM
- `setSyncStatus(state, label)` → Sync-Indikator Sidebar + Bottom-Nav

**Store-Schlüssel:** `localStorage('finanzplaner_v3')` — `LS_KEY_STORE`

---

## Design-System (niemals brechen)

- **Niemals Hex hardcoden** — immer `var(--token)` verwenden
- **OKLCH-Tokens:** `--blue`, `--green`, `--red`, `--amber`, `--purple`, `--cat-*`
- **Flächen:** `--surf`, `--surf2`, `--brd`, `--tx`, `--tx2`, `--tx3`
- **Schatten:** `--sh`, `--sh-md`, `--sh-modal`, `--sh-toast`, `--sh-popup`
- **Radii:** `--r` 14px, `--r-sm` 9px, `--r-lg` 18px, `--r-xl` 26px
- **Dark Mode:** automatisch via `@media (prefers-color-scheme: dark)` — kein manueller Schalter
- **Canvas/Donut:** echte Hex-Werte aus `VM_TYPE_COLOR` — kein `var(--...)` in Canvas-API

---

## GitHub Sync — Wichtige Regeln

- **Nach Pull:** `FP.Store.Settings.setGithubSync()` NICHT aufrufen → würde alte Daten zurückschreiben. Stattdessen `_origSetItem` direkt nutzen.
- **Push-Loop:** `_justPushed=true` für 12s nach Push blockiert `schedulePush()`
- **Startup-Lock:** 15s nach App-Start kein Auto-Push (`_pendingPush=true` wird danach nachgeholt)
- **Polling:** alle 3 Min — kein `visibilitychange` (verursacht Loop auf iPhone-Webapp)
- **Token:** in `localStorage('fp_gh_token')` — NICHT im Store-JSON

---

## Feature-Backlog (Reihenfolge)

1. **Kategorien/Fixkosten** — UX-Überarbeitung (Eingabe-Flow vereinfachen)
2. **F** — Themes (Slate+Indigo, Warm Sand, Mono + Akzentfarbe + Dichte)
3. **B** — Cashflow-Forecast (Kalender-Grid, Liquiditätslinie)
4. **C** — Ziel-Tracking/Goals (CRUD, Fortschrittsbalken)
5. **Auszahlplan** — Entnahmeplanung Rente (Strategie noch offen, Daten vorhanden)
6. **A** — Insights (Anomalie-Pillen, Monatsbriefing)
7. **E** — Visualisierungs-Upgrades (Sankey, Heatmap, Waterfall)
8. **G** — Reports & Export (PDF, Steuer-Helfer)
9. **H** — Smart-Input (Natural-Language, Autovervollständigung)

---

## Bekannte offene Punkte

- Rentenwert-Wachstum nach Rentenantritt (Rentenanpassung) — diskutiert, nicht implementiert
- `expectedReturn`, `sonstigeEinkommen` — tote Store-Felder, harmlos, bewusst übersprungen
- Durchschnittsentgelt + BBG-RV nicht in Sidebar editierbar → in `jaehrliche_pruefung.md`
- Auszahlplan-Strategie noch nicht final definiert (Glidepath-Variante, Eimer-Strategie)
