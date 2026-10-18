# Finanzplaner — Claude Code Session Guide

**Aktuelle Version:** v12.0 (`FP_VERSION = '12.0.0'`, `STORE_VERSION = 3`) | **Cache-Stand:** `?v=20261018c`
**Letzter Stand:** 18.10.2026 (Audit-Pakete 1, 3, 2: ein Schreibweg, eine Vorlagen-Regel, Sync-Garantien) — gepflegte Aufgabenliste ist `TODO.md`, nicht dieser Guide

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

## Dateistruktur (seit v12.0 — getrennte Dateien)

| Datei | Inhalt |
|---|---|
| `index.html` | Nur HTML-Gerüst, keine Logik |
| `style.css` | Gesamtes Design-System + alle CSS-Tokens |
| `store.js` | FP.Store + FP.Calculator — **kein UI-Code** |
| `app.js` | Gesamte UI-Logik (Tab-Renderer, Event-Handler) + `AzureSync` (Cloud-Sync) |
| `sw.js` | Service Worker — `CACHE_NAME` muss bei **jedem** Deploy mit `?v=` übereinstimmen |
| `tests.html` | Selbsttests (laufen in `_tests\pruefen.ps1` mit) |
| `_tests/` | Prüfungen mit echten Daten + Git-Hook — **vor jedem Deploy**, siehe `_tests/README.md` |
| `TODO.md` | Gepflegte Aufgabenliste + Befund-Dokumentation (z. B. iOS-Rotationsfix) |

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
Alle 5 Deploy-Dateien (index.html, style.css, store.js, app.js, sw.js) mit Datum
in den files-Ordner kopieren:
C:\Users\enesc\OneDrive\Dokumente\07 Projekte\Claude\Finanzen\Finanzen App\files\
```

**Prüfen vor jedem Deploy (Pflicht, seit 18.10.2026):**
```
pwsh -File _tests\pruefen.ps1
```
Prüft mit **echten Daten** (frisch aus Azure, nur in `%TEMP%`, danach gelöscht): tests.html, Vorlagen-Regel (Node),
Rundgang durch alle Tabs, 9 Sync-Szenarien gegen eine Azure-Attrappe. ~30 s. Der `pre-push`-Hook führt es automatisch aus
und bricht den Push bei ROT ab (einrichten: `pwsh -File _tests\hook-installieren.ps1`). Nie mit `--no-verify` umgehen,
außer der Nutzer sagt es ausdrücklich. **Jede Korrektur bekommt eine Prüfung, die am alten Code scheitert**
(Gegenprobe per `git worktree`, siehe `_tests/README.md`). Repo ist öffentlich → in `_tests/` nie Daten oder Tokens.

**Nach Änderungen deployen:**
```
cd C:\Users\enesc\finanzplaner-repo
git add index.html style.css store.js app.js sw.js tests.html TODO.md
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
- `window.FP = { Store, Calculator, ... }` → Export am Ende von store.js

**Schlüsselfunktionen (app.js):**
- `rpRenderMain()` → ruft calcRente P1+P2, delegiert an KPI + Tabs
- `rpQuickSave()` → liest DOM → schreibt Store → ruft rpRenderMain()
- `rpFillForm()` → liest Store → befüllt DOM
- `setSyncStatus(state, label)` → Sync-Indikator Sidebar + Bottom-Nav
- `AzureSync.push() / AzureSync.pull()` → Cloud-Sync via Azure Blob (ETag/If-Match, 412 bei Konflikt; IIFE ganz oben in app.js)

**Store-Schlüssel:** `localStorage('finanzplaner_v3')` — `LS_KEY_STORE`

**Fixkosten-Vorlagen — eine Regel (seit 18.10.2026, niemals umgehen):**
- Welche Vorlage in Monat M gilt, entscheidet **nur** `recurringOwnerIndex` (store.js): Serie = Vorlagenname + Objekt,
  Vorrang späterer Start > längere Laufzeit > höhere id. Generierung, Bereinigung (`_reconcileRecurring`),
  Fixkosten-Liste (`Recurring.ownsInYear`) und Kacheln (`Recurring.ownersInMonth`) fragen alle diese Funktion.
  Nie wieder eigene „neuere Version"-Logik in der UI oder Gruppierung nach Buchungs-`rawName`.
- Jede Vorlagenänderung (`add`/`update`/`split`/`delete`, `Trash.restore`) gleicht die Buchungen im **selben**
  `_save()` ab — nicht erst beim nächsten Start. `Recurring._check` lehnt Ende vor Start und unbekannten Typ ab.
- ✏️ (`update`) = Korrektur für den ganzen Zeitraum (geänderte Felder gehen in die gebuchten Buchungen);
  ↕ (`split`) = Betrag ab Monat. Kein stilles Versionieren in `update`.
- `skipMonths` an der Vorlage: Monat wird nicht gebucht (gesetzt von `Transactions.edit`, wenn der Nutzer eine
  Fixkosten-Buchung in Betrag/Monat/Kategorie/Objekt ändert — sie wird dann `manual` mit `detachedFrom` —
  und von `Transactions.delete`). Waisen behalten `origRecurringId`, `Trash.restore` bindet sie wieder an.

---

## Design-System (niemals brechen)

- **Niemals Hex hardcoden** — immer `var(--token)` verwenden
- **OKLCH-Tokens:** `--blue`, `--green`, `--red`, `--amber`, `--purple`, `--cat-*`
- **Flächen:** `--surf`, `--surf2`, `--brd`, `--tx`, `--tx2`, `--tx3`
- **Schatten:** `--sh`, `--sh-md`, `--sh-modal`, `--sh-toast`, `--sh-popup`
- **Radii:** `--r` 14px, `--r-sm` 9px, `--r-lg` 18px, `--r-xl` 26px
- **Dark Mode:** automatisch via `@media (prefers-color-scheme: dark)` — kein manueller Schalter
- **Canvas/Donut:** echte Hex-Werte aus `VM_TYPE_COLOR` — kein `var(--...)` in Canvas-API
- **Canvas-Breite niemals auf px fixieren:** `canvas.style.width='100%'` **vor** der Messung setzen,
  danach nur `style.height` — ein `style.width = W+'px'` lässt die nächste Messung den alten Wert
  liefern, dann reagieren Charts nie auf iPhone-Drehung. Betrifft `ghDrawChart`, `ghDrawLineChart`,
  `rpDrawVerlaufChart`, `rpDrawStichtagChart`, `rpDrawEntnahmeChart` (`vmDrawTrendRight` u. a. nutzen
  `canvas.parentNode` und ist nicht betroffen).

---

## Cloud-Sync (Azure Blob) — Wichtige Regeln

Sync läuft über **Azure Blob Storage** (ersetzt seit 05.06.2026 die alte GitHub-API).
Code: `AzureSync`-IIFE in `app.js`. **Hosting bleibt GitHub Pages** — nur die *Daten* liegen in Azure.

- **Speicher:** Account `finanzplanersync` · Container `sync` · Blob `sync.fpbackup`
  (`https://finanzplanersync.blob.core.windows.net/sync/sync.fpbackup`)
- **SAS-Token:** in `localStorage('fp_azure_sas')` — NICHT im Store-JSON / Backup. Eingabefeld `type=password`.
- **Settings:** `settings.azureSync = { enabled, blobUrl, lastETag, lastSync, autoSync }`
- **Atomare Writes:** PUT mit `If-Match: <lastETag>` → `412` bei Konflikt → Konflikt-Dialog (`AzureSync.conflictChoose`), kein stilles Überschreiben.
  Ohne `lastETag` geht der PUT mit `If-None-Match: *` (nur anlegen, nie blind überschreiben).
- **Zwei Sync-Garantien (Paket 2, 18.10.2026) — niemals umgehen:**
  1. Hochgeladen wird **nur der lokale Stand** über `push()`. Konflikt „Lokal" = `lastETag:=remoteETag` + `push()`;
     „Zusammenführen" = Ergebnis per `importData` lokal übernehmen (versiegelt), dirty markieren, Neuladen → Start-Push.
     Kein eigener PUT-Weg im Konfliktcode.
  2. Der lokale Stand wird **nur ersetzt, wenn `fp_dirty` 0 ist** — geprüft in `pull()` im selben Takt wie
     `BackupManager.importData` (synchron, kein FileReader). Sonst Konfliktdialog. Ausnahme: Nutzer wählt „Server".
- **`fp_dirty` ist ein Zähler** (jede Änderung +1). `push()` merkt sich den Stand, `_clearDirtyIf(gen)` löscht nur bei
  Gleichstand, sonst wird nachgeschoben. `clearPending()` (Auto-Sync aus) löscht ihn NICHT.
- **Wiederholen:** fehlgeschlagener Push → 30 s / 2 min / 5 min; `_checkRemote` (Poll, online, Vordergrund) ruft bei
  unverändertem Server `flush()`. `_kickPush()` stößt an, ohne den Zähler zu erhöhen.
- **Merge** (`_mergeBackups`): Listen per id (+ Freistellungsaufträge, Sparpläne, ESPP-Zyklen), Gehalt pro Monat,
  Budgets, Anlagen-Wertstände pro Monat, `skipMonths` vereinigt; **Papierkorb beider Seiten = Löschvermerk**.
- **Ein Schreibweg (seit 18.10.2026):** Nur `Store._save()` und `Store.replaceState()` schreiben `finanzplaner_v3`.
  Import, Auto-Sicherung, Pull und „Server-Daten laden" gehen über `BackupManager.import(file, {azureSync, log})` /
  `restoreAutoBackup(i, {log})` → `replaceState()`; danach ist der Store bis zum Neuladen **versiegelt**
  (`writeLock()==='replaced'`, jedes `_save()` ist wirkungslos). Nie wieder `localStorage.setItem` auf den Store-Schlüssel
  am Store vorbei — genau das ließ Import/Wiederherstellen wirkungslos werden (Audit 18.10.).
- **Ladefehler:** `writeLock()==='load-failed'` → nichts wird geschrieben, kein Push, kein Tagesbackup; Dialog
  `showStoreProblem`. Nur `replaceState` (Wiederherstellen/Import/Pull) hebt die Sperre auf.
- **Speicher voll:** `_writeMain` verwirft älteste Auto-Sicherungen, bis der Hauptstand passt; sonst Event
  `fp:store` `save-failed` → stehender Dialog.
- **Nach Import/Wiederherstellen:** `lastETag` bleibt, UI ruft `AzureSync.markDirty()` → Neustart lädt hoch
  (Server unverändert) oder zeigt den Konfliktdialog (Server geändert). Pull setzt die Sync-Felder über `opts.azureSync`.
- **Push-Loop:** `_justPushed=true` für 12s nach Push blockiert `schedulePush()`
- **Startup-Lock:** 15s nach App-Start kein Auto-Push (`_pendingPush=true` wird danach nachgeholt)
- **Polling:** HEAD alle 3 Min (ETag-Vergleich)
- **Token-Fehler:** 401/403 → `_authFailed()` zeigt „Token abgelaufen" + Toast (einmalig)
- **Dirty-Zähler:** `fp_dirty` in **localStorage** (`DIRTY_KEY`) — überlebt App-Neustart, schützt offline gemachte Änderungen vor stillem Überschreiben beim Auto-Pull (Konflikt statt Pull, wenn > 0).
- **SAS-Ablauf-Erinnerung:** `AzureSync.sasExpiry()`/`sasDaysLeft()` lesen `se=` aus dem Token; `updateSasReminder()` steuert das globale Banner `#sas-bar` (gelb ≤14 T., rot abgelaufen) + „Zugang gültig bis"-Zeile in den Einstellungen (`st-az-expiry`).
- **Das Token muss ein Konto-SAS sein**, kein Container-SAS: `connect()` baut die Blob-URL aus dem Teil vor `?`, braucht also das Format `…blob.core.windows.net/?sv=…`. Ein Container-SAS (`…/sync?sv=…`) führt zu `/sync/sync/…`. Rechte **`racwl`** (kein Löschen), nur Blob, Container+Objekt, Nur-HTTPS.
- **Azure-Konfiguration:** Container privat, CORS nur `e-labs-x.github.io`, HTTPS-only, Soft Delete 30 T. (Blobs + Container)
- **Altlast:** `localStorage('fp_gh_token')` wird bei `load()` automatisch entfernt (Migration githubSync→azureSync)

---

## Feature-Backlog

### Abgeschlossen
Vollständige Chronik steht in `TODO.md` — hier nur die Meilensteine:
- ~~GHSync-Umbau~~ (24.05.2026) · ~~Best-Practices-Audit 33/33~~ (24.05.2026) ·
  ~~Fixkosten-Jahresansicht~~ (26.05.2026)
- ~~Azure-Blob-Sync statt GitHub-API~~ (05.06.2026)
- ~~SAS-Härtung komplett~~ (16.06.2026: Konto-SAS `racwl`, Ablauf-Erinnerung, Dirty-Flag)
- ~~Renten-Audit R1–R15~~ (Stammwerte 2026, GFB, Migration v1→v2, Fünftelregelung u. a.)
- ~~iOS-Rotationsfix~~ (16.08.2026, `?v=20260816d`) — vom Nutzer am 18.10.2026 bestätigt, Befund in `TODO.md`
- ~~Audit-Paket 1 „ein Schreibweg"~~ (18.10.2026, `?v=20261018a`) — weitere Pakete in `TODO.md`
- ~~Audit-Paket 3 „eine Vorlagen-Regel"~~ (18.10.2026, `?v=20261018b`, Migration v2→v3)
- ~~Audit-Paket 2 „Sync-Garantien"~~ (18.10.2026, `?v=20261018c`)

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

## Bekannte offene Punkte

- Rentenwert-Wachstum nach Rentenantritt (Rentenanpassung) — diskutiert, nicht implementiert
- `expectedReturn`, `sonstigeEinkommen` — tote Store-Felder, harmlos, bewusst übersprungen
- Durchschnittsentgelt + BBG-RV nicht in Sidebar editierbar → in `jaehrliche_pruefung.md` dokumentiert
- Auszahlplan-Strategie noch nicht final definiert (Glidepath-Variante, Eimer-Strategie)
