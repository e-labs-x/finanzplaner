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

**WICHTIG — Service Worker:** Bei jedem Deploy auch `CACHE_NAME` in `sw.js` auf die neue Version setzen:
```js
const CACHE_NAME = 'fp-YYYYMMDD';  // muss mit ?v=YYYYMMDD übereinstimmen
```
Ohne das serviert der SW alte gecachte Dateien, auch wenn Browser schon neu lädt.

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

## Feature-Backlog

### Abgeschlossen
- ~~GHSync-Umbau~~ — erledigt 24.05.2026
- ~~Best-Practices-Audit (33/33)~~ — erledigt 24.05.2026
- ~~Fixkosten-Jahresansicht~~ — erledigt 26.05.2026

### Offen (Reihenfolge)

| #  | Feature                  | Beschreibung                                               |
|----|--------------------------|------------------------------------------------------------|
| —  | Kategorien/Fixkosten     | UX-Überarbeitung (Eingabe-Flow vereinfachen)               |
| F  | Themes                   | Slate+Indigo, Warm Sand, Mono + Akzentfarbe + Dichte-Modus |
| B  | Cashflow-Forecast        | Kalender-Grid, Liquiditätslinie                            |
| C  | Ziel-Tracking / Goals    | CRUD, Fortschrittsbalken                                   |
| —  | Auszahlplan              | Entnahmeplanung Rente (eigene Session nötig)               |
| A  | Insights                 | Anomalie-Pillen, Monatsbriefing                            |
| E  | Visualisierungs-Upgrades | Sankey, Heatmap, Waterfall                                 |
| G  | Reports & Export         | PDF, Steuer-Helfer                                         |
| H  | Smart-Input              | Natural-Language, Autovervollständigung                    |
| I  | Bank-Integration         | Enable Banking + Azure Function                            |
| —  | Google Fonts lokal       | Inter lokal hosten oder System Fonts — IP-Übermittlung an Google vermeiden |
| —  | GitHub Data-Repo löschen | e-labs-x/finanzplaner-data (alt, GitHub Sync) — Repo löschen nach Übergangszeit |

---

## Bank-Integration — Detailplan (Feature I)

**Ziel:** Kontostände + Wertpapierpositionen automatisch aus Banken abrufen.
**Anzeige:** Vermögens-Tab + Fixkosten-Tab (Kontostand-Kontext).
**Kosten:** 0€ (Enable Banking kostenlos persönlich, Azure Functions Free Tier).

**Banken:** ING, 1822direkt, BMW Bank, Finanzen.net Zero → Enable Banking (PSD2/OAuth)
**Fidelity ESPP:** CSV-Import aus NetBenefits (kein EU-API-Zugang möglich)

**Architektur:**
- Kontostände werden als Asset-Snapshots gespeichert (renutzt `Assets.addSnapshot()`)
- Azure Function hält Enable Banking Client-Secret sicher (gleicher Azure Account wie Sync)
- Tokens in `localStorage('fp_bank_tokens')` — getrennt vom Store-JSON

**Voraussetzungen (vor Session 1 anlegen):**
- Enable Banking Developer-Account: enablebanking.com (kostenlos, ~5 Min)
- Azure Account: bereits vorhanden (finanzplanersync)

**Session 1 — Azure Function + OAuth** (~2h)
- Function: Enable Banking OAuth-Flow + Saldo-Endpunkt
- Erster Test mit ING

**Session 2 — Store-Integration** (~2h)
- `store.js`: neues Feld `bankConnections`
- `BankSync.pull()` → holt Salden → schreibt `Assets.addSnapshot()`

**Session 3 — Vermögens-Tab UI** (~2h)
- Bereich "Verknüpfte Konten" + Sync-Button + letzter Sync-Zeitstempel
- OAuth Connect-Flow (öffnet Bank-Login in neuem Tab)

**Session 4 — Fidelity CSV + Fixkosten** (~1h)
- CSV-Import-Dialog für Fidelity NetBenefits (Drag & Drop)
- Fixkosten-Tab: ING-Kontostand als Kontext-Indikator

---

## Bekannte offene Punkte

- Rentenwert-Wachstum nach Rentenantritt (Rentenanpassung) — diskutiert, nicht implementiert
- `expectedReturn`, `sonstigeEinkommen` — tote Store-Felder, harmlos, bewusst übersprungen
- Durchschnittsentgelt + BBG-RV nicht in Sidebar editierbar → in `jaehrliche_pruefung.md` dokumentiert
- Auszahlplan-Strategie noch nicht final definiert (Glidepath-Variante, Eimer-Strategie)
