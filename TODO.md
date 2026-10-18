# Finanzplaner — To-Do Liste

Letzte Aktualisierung: 2026-10-17 — Betragssuche, Papierkorb für Buchungen, Übersicht + Kategorie-Detail umgebaut (`?v=20261017h`)

---

## 👀 Sichtkontrolle offen — Einstellungen Schritt 1 (18.10.2026, `?v=20261018h`)
- [x] Menü mit Statuszeilen (5 Gruppen, 12 Bereiche) + Unterseiten; iPhone: Menü → Bereich mit „‹ Einstellungen";
      PC (≥900 px): links Menü, rechts Bereich. Karten unverändert (data-st), `stOpen(k)`, `stGo(k)` für Sprünge
      (SAS-Banner → Sync, Ladefehler-Dialog → Auto-Sicherungen). Erweitert-Schalter entfällt.
- [x] Rundgang prüft jeden Bereich (genau die passende Karte sichtbar).
- [ ] **Nutzer schaut live** — danach Schritt 2: Kategorien kompakt (+ Doppel Haftpflicht/Hausrat klären).

## (Plan) Einstellungen neu ordnen (18.10.2026, freigegeben: Gliederung „passt")
Befund: Einstellungen = eine Seite, ~5.100 px am PC, 12 Karten; Kategorien ~⅓ davon mit 3 Dauer-Knöpfen je Zeile
(44 Zeilen); Sync/Backup/Papierkorb ganz unten. „Mehr" selbst ist ok.
Vorschlag (Nutzer entscheidet): Menü mit Statuszeilen + Unterseiten (iPhone: Zurück-Pfeil; PC: links Menü,
rechts Bereich). Gruppen: Daten & Sicherheit (Sync, Backup & Import, Auto-Sicherungen, Papierkorb) · Haushalt
(Personen & Steuer, Budget) · Ordnung (Kategorien, Objekte, Währungen) · Rechengrundlagen (Inflation, Kursabruf) ·
Technik (Log, Version). Schritt 2 getrennt: Kategorien kompakt (Unterkategorien zugeklappt, Aktionen per Antippen).
Nur Neuordnung, keine Änderung am Speichern. Nebenbefund: Haftpflicht + Hausrat je doppelt unter Versicherungen.

## ✅ Vermögen-Tab (18.10.2026, `?v=20261018d`–`g`) — vom Nutzer abgenommen („sieht gut aus")
- [x] Neue Karte „Historie · Stand je Monat": Anlagen × Monate wie die frühere Excel, ‹ Jahr ›, Summe, Δ Vormonat,
      Δ Vorjahr (nur Anlagen mit Wert in beiden Monaten), grau = fortgeschrieben, Zelle antippen = Wert für den Monat
      (vergangener Monat → Betragsfeld statt Kursabruf). Daten: `Calculator.getAssetHistory(year)`; Summe aktueller
      Monat = Gesamtvermögen (geprüft, `_tests/lib/vermoegen.test.js`).
- [x] Verlaufs-Chart: eine Gesamtlinie + Einstand statt 11 gestapelter Flächen; ESPP im laufenden Monat mitgezählt;
      Canvas-Regel eingehalten; matchMedia-Neuzeichnen bei Hell/Dunkel.
- [x] **Fehler behoben:** Monatsstände wurden als Text sortiert → ab 01.2027 hätte der Dezember-Wert als „aktuell"
      gegolten (Gesamtvermögen, Rente). Jetzt `sortSnapshots` (chronologisch) beim Laden, addSnapshot, Merge.
- [x] Nutzer-Feedback 1 umgesetzt (`?v=20261018e`): Tabelle am PC kompakt (width:auto); Auswahl oben
      „Alle · Enes · Ehli · Gemeinsam" + Name antippen = Anlage ausblenden — **Ring, Verlauf und Historie folgen**
      (Karten/Überblick bleiben vollständig), Auswahl je Gerät in localStorage `fp_vm_sel`; Budget-Symbol € statt $.
- [x] **Fehler behoben:** „Gewinn" unter dem Ring war Gesamt − Einstand → Konten ohne Einstand zählten voll als
      Gewinn (+496 T€ statt +303 T€). Jetzt nur Anlagen mit Einstand (`getAssetSummary().gain`), klar beschriftet.
      Einstand-Linie im Verlauf entfernt (gleicher Denkfehler: Einstand von 7 Anlagen gegen Wert aller).
- [x] Feedback 2 (`?v=20261018f`): Anlagennamen nie abgeschnitten (PC volle Länge, iPhone Umbruch), Änderungszeilen
      links je Zeile beschriftet („Änderung Vormonat €/%"), Trennlinie an der festen Spalte.
- [x] Feedback 3 (`?v=20261018g`): Namen in „Anlagen im Überblick" nicht mehr abgeschnitten (PC 280 px, iPhone
      Umbruch); Reihenfolge jetzt Auswahl · Ring/Verlauf · Anlagen im Überblick · Historie · Anlagen-Karten.
- [x] Nutzer: „sieht gut aus" (18.10.2026). Altwerte aus Excel: Nutzer will keinen Import.

## ⏭️ Nächste Sitzung — Reparatur nach Voll-Audit vom 18.10.2026

Ergebnis: `Finanzen App/audit_ergebnis_2026-10-18.md` (OneDrive) — 32 Punkte in 5 Paketen, Summen-Abgleich
aller Ansichten auf den Cent **ok**. Reihenfolge (Nutzer-Freigabe pro Paket nötig):
1. ~~**Paket 1 — ein Schreibweg für den Store**~~ ✅ 18.10.2026 `?v=20261018a`: `replaceState` + Siegel, Nur-Lesen
   bei Ladefehler, Hauptstand verdrängt Auto-Sicherungen bei vollem Speicher, keine Verschachtelung, 1e (Import behält
   ETag + markDirty). tests.html 24/24 (7 neu, scheitern alle am alten Code); E2E mit echten Daten + Sync-Attrappe:
   Import überlebt Neustart und wird mit If-Match hochgeladen bzw. Konfliktdialog. Offen daraus: Punkt 5 (Pull belegt
   Backup-Plätze), Punkt 6 (16 direkte Store-Zugriffe aus app.js). **iPhone hatte < 5 Auto-Sicherungen = Speicher am Limit.**
2. ~~**Paket 3 — Vorlagen-Regel**~~ ✅ 18.10.2026 `?v=20261018b`: `recurringOwnerIndex` als einzige Regel,
   Abgleich bei jeder Vorlagenänderung, `Recurring.split`, ✏️ = Korrektur (Nutzer-Entscheid), Invarianten,
   Typ „variabel" im Formular, Papierkorb bindet Buchungen wieder an, bearbeitete/gelöschte Fixkosten-Buchung
   → `skipMonths`. Migration v2→v3: BU-Typ → variable, 4 tote Einzelmonats-Vorlagen in den Papierkorb samt
   ihrer 4 Doppelbuchungen (2022 −173,81 €, 2023 −284,78 €; Nutzer: neuere Beträge gelten). Belege: tests.html
   29/29, Echtdaten-Test 27/27 (beide Blob-Stände), alle Tabs ohne Fehler, Fixkosten-Liste 10/2026 = gebucht
   (1.707,06 €). Sicherung: Tag `vor-paket3`, `files/sync_2026-10-18_vor-paket3.fpbackup`.
   **Offen aus Paket 3 (MITTEL):** archivierte Objekte buchen weiter; „Ins Folgejahr kopieren" holt beendete
   Vorlagen zurück; XLSX-Import-Dialog verspricht „ersetzen", addiert; Vorlage löschen ohne Rückfrage.
3. ~~**Paket 2 — Sync-Garantie**~~ ✅ 18.10.2026 `?v=20261018c`: Hochgeladen wird nur der lokale Stand (Konflikt
   „Lokal"/„Zusammenführen" über normalen push, Merge erst lokal übernehmen); lokaler Stand wird nur bei `fp_dirty`=0
   ersetzt (Prüfung in pull() synchron mit `importData`); `fp_dirty` als Zähler; `If-None-Match: *` ohne ETag;
   Wiederholen 30 s/2 min/5 min + flush bei Poll/online/Vordergrund; Startsperre nach connect gelöst; Auto-Sync aus
   löscht Zähler nicht; esppRender speichert nur bei Kursänderung; Merge vollständig + Papierkorb als Löschvermerk.
   Belege: 9 Szenarien mit Azure-Attrappe + echten Daten bestanden, Gegenprobe am alten Code zeigt jeden Fehler;
   tests.html 30/30; alle Tabs fehlerfrei. Hinweis: „↓ Laden" fragt jetzt bei offenen lokalen Änderungen nach.
4. **Paket 4 — Sicherheitshärtung** (HOCH): Details nur in der Audit-Datei auf OneDrive (Repo ist öffentlich).
5. Paket 5 — Einzelfehler (MITTEL).
Alle KRITISCH-Pakete erledigt (1018a–c). **Seit 18.10. dauerhafte Prüfung** `_tests\pruefen.ps1` (12 Prüfungen mit
echten Daten, ~30 s, `pre-push`-Hook bricht bei ROT ab; Gegenprobe gegen Stand `sitzung-2026-10-18`: 10 von 12 rot).
Offen als Idee: Gesundheitscheck in der App (Doppelbuchungen, Liste ≠ gebucht, Waisen) mit Hinweis. Offen: Paket 4 (HOCH), Paket 5 (MITTEL), Reste aus 1 und 3 (siehe dort).

## (erledigt 18.10.) App-Check — Entscheidung: B voller Audit

Anlass: am 17.10.2026 mehrere Fehler gefunden, fast alle **Widersprüche zwischen Ansichten**
(Übersicht rechnete Einkommen mit, Gruppen ergaben aufgeklappt nicht ihre Summe, Detail ignorierte
den Zeitraum, Lücken nach Umschalten, Betragssuche verglich „14.5" mit „14,50"). Nutzer wählt noch:
- **A — Zahlen-Abgleich mit echten Daten** (empfohlen, ca. 1 h, ohne Agenten): jede Summe, die an
  mehreren Stellen steht, nachrechnen — Home, Übersicht, Reports, Budget, Cashflow, Objekte, Fixkosten,
  Suche — plus die zwei XLSX-Import-Wege (`source:excel` store.js vs `source:import` app.js, offen seit Juni).
- **B — Voller Audit** nach `Finanzen App/audit_prompt_komplett.md` (OneDrive, 11 Blöcke, mehrere Agenten,
  deutlich teurer — braucht ausdrückliche Agenten-Freigabe).
- **C — erst A, dann B** in eigener Sitzung.
Ergebnis jeweils als Befundliste; nichts ändern ohne OK.

### Erledigt am 17.10.2026
- [x] Betragssuche (`amountMatches`): „14,50" / „14.50" / „14" in globaler Suche, Fixkosten, Buchungsliste
- [x] tests.html: 2 veraltete Tests korrigiert, 2 Papierkorb-Tests neu → 17/17
- [x] Papierkorb für Buchungen (30 T., Wiederherstellen ohne Doppelung)
- [x] Übersicht: 3 Kacheln (Ausgaben, Ø/Monat, Sparquote) statt Töpfe/Diagramm/6er-Leiste — auf den Cent wie Reports
- [x] Übersicht: Gruppen als Start + erster Reiter, jede Gruppe klappt auf (inkl. „· direkt"), Liste ohne eigenen Scrollbereich
- [x] Kategorie-Detail: folgt dem Zeitraum, eigener Container, Buchung antippen = bearbeiten, Tag sichtbar, Verlauf entfernt, Vorjahresvergleich
- [x] Sichtkontrolle Übersicht + Detail durch Nutzer — „sieht gut aus" (17.10.); Rückweg: Tags `vor-uebersicht-umbau`, `vor-detail-umbau`
- [x] iOS-Rotationsfix: Nutzer bestätigt am 18.10.2026 „alles gut" (Drehen ok, kein Pull-to-Refresh auf iPhone + iPad) → abgeschlossen

---

## ✅ Abgeschlossen 18.10.2026 — iOS-Rotationsfix (seit 16.08.2026, `?v=20260816d`, Commit `a0db27d`)

_Läuft ab `?v=20260816e` unter dieser Nummer weiter (0816e = nur Objekt-Sortierung, am Fix nichts geändert)._

**Symptom:** iPhone (Pro Max, installierte PWA). App im Hochformat geöffnet, dann ins Querformat gedreht →
Einträge der Seitenleiste reagieren nicht oder man trifft daneben. Quer geöffnet: alles korrekt.
Neuladen im Querformat behebt es. **iPad nie betroffen.**

**Ursache:** Nach einer Drehung erneuert iOS die Hit-Test-Regionen einer fest positionierten Ebene nicht —
gezeichnet wird das neue Layout, für Berührungen gilt die alte Geometrie. Die Ebene war `body { position: fixed }`,
seit Juni der Schutz gegen Apples Pull-to-Refresh.

**Was NICHT geholfen hat** (beides auf dem Gerät verifiziert, nicht nochmal probieren):
- `0816a` — `width/height:100%` vom body entfernt (Box war überbestimmt), `#app` von `100dvh` auf `100%`,
  Sidebar unter 768px ohne `display:none` (kein Struktur-Wechsel mehr beim Drehen). Sachlich richtig, **wirkungslos**.
- `0816b` / `0816c` — erzwungener Layout-Neuaufbau nach `orientationchange`, erst synchron, dann über zwei
  `requestAnimationFrame` mit tatsächlich gezeichnetem Zwischenbild. Per Diagnose-Abzeichen auf dem iPhone
  bestätigt: **Event kommt an, Neuaufbau läuft, Problem bleibt.** Ein Reflow reicht iOS nicht.

**Was jetzt drin ist (`0816d`):** `body` ist nicht mehr `position: fixed`, sondern `height: 100%`.
Pull-to-Refresh-Schutz ohne fixed: `overflow: hidden` auf html+body (kein Dokument-Scroll),
`overscroll-behavior: none` dort, `overscroll-behavior: contain` auf `.page`.
Verifiziert: Layout in vier Größen pixelgleich zum Stand `c76031c`; kein Dokument-/body-Scroll; Seiten scrollen intern.

**Offen — auf dem Gerät zu beobachten:** Kommt Apples Pull-to-Refresh / das Überscrollen zurück?
Besonders auf dem **iPad** gegenprüfen, dort war es ursprünglich das Ärgernis.

**Rückweg, falls es stört** (setzt nur den body-Teil zurück, behält die 0816a-Korrekturen, holt das
Diagnose-Abzeichen NICHT zurück):
```
cd C:\Users\enesc\finanzplaner-repo
git checkout f36a179 -- style.css
```
Danach `?v=` in index.html + `CACHE_NAME` in sw.js + `sb-ver` bumpen, committen, pushen.
Wiederherstellungspunkte: Tag `vor-rotationsfix` (Stand vor der Sitzung) und `rotationsfix-0816d`.
Dateikopien: `…\Finanzen App\files\*_2026-08-16.*` (vorher) und `*_2026-08-16_nach-rotationsfix.*` (nachher).

**Rückfall-Plan, falls das Drehen weiterhin kaputt ist:** automatisches Neuladen nach der Drehung —
nur auf iOS, nur wenn die 768px-Grenze überschritten wird (iPad also nie), Tab + Scrollposition über
`sessionStorage` wiederherstellen, kein Neuladen bei offener Eingabe (`amt` / `np-note`), Schleifenschutz
über eine Sperrzeit nach dem Start.

---

## ✅ Erledigt

- [x] **B1** — Chart Toggle (Monat / Quartal / Jahr) mit Drill-down
- [x] **B2** — iOS Kalender-Picker im Auswertungs-Tab (native input overlay)
- [x] **B3** — Sidebar-Farbe (hell auf PC/iPad, korrekte Darstellung)
- [x] **B4 Farben** — Apple HIG Farbsystem + CSS Custom Properties
- [x] **B4 Dark Mode** — `prefers-color-scheme: dark` vollständig umgesetzt
- [x] **Gestapeltes Diagramm** — Fixkosten / Freizeit / Sparen als Stacked Bars
- [x] **v2.0 Architektur** — `recurring` ersetzt `fixedCosts`, `appLog`, Partner aktiv, Geburtsjahrgang 1976
- [x] **v2.0 Tab-Umbenennung** — "Fixkosten" → "Vorlagen" (🔁) überall konsistent
- [x] **v2.0 Kategorie-Hierarchie** — Auto & Mobilität / Streaming & Abo als Gruppen im Eingabe-Tab
- [x] **Design v7.0** — Slate+Indigo, OKLCH-Tokens, Lucide-Icons, Sidebar-Toggle, kuratierte Kategorien-Palette, Schatten-Tokens
- [x] **v8.0 Schriftart** — Inter durchgehend (kein Consolas mehr), offene Null, tabular-nums global
- [x] **v9.0 Feature D** — Home-Dashboard auf Desktop, Eingabe bleibt Startseite auf iPhone

---

## 📋 Offen — Feature Backlog

### F — Theme-Variationen _(schnell, ~1–2h)_
- [ ] Settings-Bereich „Erscheinungsbild" mit Theme-Auswahl
- [ ] Theme „Slate+Indigo" (aktuell), „Warm Sand" (warme Erdtöne), „Mono" (neutral)
- [ ] Akzentfarbe-Picker: Indigo, Teal, Forest, Plum, Crimson (5 Swatches)
- [ ] Dichte-Modus: „Komfortabel" (default) / „Kompakt" (−25 % Padding/Gap)
- [ ] Persistenz in `store.settings.theme`, `.accent`, `.density`
- [ ] Wechsel ohne Reload, 200ms Transition, Dark Mode in jedem Theme korrekt

### B — Cashflow-Kalender / Kurzfrist-Forecast _(~3–4h)_
- [ ] Neuer Tab „Forecast" in Übersicht (neben bestehenden Modi)
- [ ] Kalender-Grid (Monatsansicht, Pfeil-Navigation): Tage mit fälligen Fixkosten als farbige Punkte
- [ ] Hover/Tap auf Tag → Liste der fälligen Posten
- [ ] Liquiditäts-Linie unter dem Kalender: Startwert = manuell eingebbarer Konto-Stand
- [ ] Tiefpunkt rot markieren, Warnung wenn < 0
- [ ] „Kann ich mir X leisten?"-Widget: Betrag + Datum → Ausgabe „Puffer fällt von X auf Y"
- [ ] Neue Store-Felder: `store.settings.liquidStartBalance`, `store.settings.liquidStartDate`
- [ ] Mobil: Kalender wird zur Listen-Ansicht ab < 600 px

### C — Ziel-Tracking / Goals _(~3–4h)_
- [ ] Neue Sidebar-Sektion „Ziele" (zwischen Vermögen und Rente)
- [ ] CRUD für Goals: Name, Zielbetrag, Zieldatum, Emoji-Icon, Farbe, verknüpfte Vermögenstöpfe
- [ ] Goal-Karte: Fortschrittsbalken, Zeitfortschritt, Pace-Anzeige (Im Plan / Hinterher + X €/Mo)
- [ ] Warnung wenn ein Vermögenstopf doppelt zugeordnet wird
- [ ] „Nächstes Ziel"-Widget auf dem Home-Dashboard einblenden (wenn Goals vorhanden)
- [ ] Store-Schema: `store.goals = [{ id, name, targetAmount, targetDate, startDate, icon, color, linkedAssetIds }]`

### A — Insights / Anomalie-Erkennung _(~2–3h)_
- [ ] **A2 (offline)** — Anomalie-Pillen auf Kategorie-Liste in Übersicht: amber Pille mit „+47 %" wenn aktueller Monat > 2σ über 12-Monats-Median (nur wenn ≥ 6 Monate Historie)
- [ ] **A1 (KI)** — Monatsbriefing-Karte auf Übersicht: Button „Briefing generieren", cached in `store.insights[YYYY-MM]`, Fehler-Toast wenn nicht verfügbar
- [ ] **A3 (KI)** — „Frag deine Daten" im Such-Overlay: anonymisierte Kategorien-Aggregate, keine Einzelbuchungen/PII
- [ ] Hinweis: A1 + A3 funktionieren nur innerhalb von Claude.ai (benötigen `window.claude.complete`)

### ESPP — Einzahlung + effektiver Gewinn _(~1–2h)_
- [ ] Beitragsprozentsatz als Einstellung pro Zyklus oder global speichern
- [ ] Einzahlung automatisch aus Gehaltsdaten berechnen: `esppGetEinzahlung(hj, jahr, pct)` bereits vorhanden
- [ ] Neue Spalte „Einzahlung" in der Zyklen-Tabelle
- [ ] Neue Spalte „Gewinn" = Netto-Erlös minus Einzahlung (effektiver Ertrag)

### ESPP — Vorabpauschale automatisch berechnen _(~1–2h)_
- [ ] Vorabpauschale für thesaurierende ETFs aus Vermögensdaten berechnen (ETF-Positionen × Basiszins × 0,7 × Teilfreistellung 30%)
- [ ] Basiszins als jährlich aktualisierbares Feld in den Einstellungen
- [ ] Berechneten Vorabpauschale-Betrag automatisch vom Sparerpauschbetrag abziehen → verbleibenden Betrag für ESPP-Berechnung nutzen
- [ ] Hinweis: Vorabpauschale fällt nur an wenn ETF-Rendite > 0 und Basisertrag > 0

### E — Visualisierungs-Upgrades _(je ~1–2h, einzeln einschiebbar)_
- [ ] **E1** — Sankey-Diagramm in Übersicht (Modus „Sankey"): Einkommen → Sparen/Ausgaben → Top-Kategorien, eigene SVG-Logik
- [ ] **E2** — Calendar-Heatmap in Übersicht (Modus „Heatmap"): 365 Quadrate, Intensität = Tagesausgaben, Hover-Detail
- [ ] **E3** — Net-Worth-Waterfall in Vermögen (Modus „Waterfall"): Start → +Einzahlungen → +Rendite → −Verluste → End, Zeitraum wählbar
- [ ] **E4** — Asset-Allocation-Drift in Vermögen (Modus „Allocation"): Soll vs. Ist, Diff-Bars, Umschicht-Empfehlung

### G — Reports & Export _(~2–3h)_
- [ ] Jahresbericht-PDF: Multi-page HTML mit `@media print`, Cover, Top-Kategorien, Sparquoten-Verlauf, Fun Facts
- [ ] Monats-PDF: Eine Seite, alle Buchungen als Tabelle, Summen, Top-Kategorien
- [ ] Steuer-Helfer-Sheet: Anlage R / AV / Vorsorgeaufwand, Werte aus Salary + Versicherungen vorausgefüllt
- [ ] Dark Mode wird im Print zu Light umgeschaltet

### Auszahlplan — Entnahmeplanung Rente _(komplex, eigene Session)_
- [ ] **Erwerbsende ≠ Rentenbeginn + gemeinsamer Haushalts-Cashflow** (Briefing/Konzept:
  `…\Finanzen App\konzept_auszahlplan_2026-06-06.md`). Auslöser: „Ehli hört mit 53 auf, Rente erst mit 63".
  Heutiges Modell rechnet Personen isoliert & addiert Endwerte (Depots zu verschiedenen Jahren) → bricht bei
  gestaffelten Renteneintritten. Soll: Feld „Erwerbsende-Alter" + EIN gemeinsames Depot auf EINEM Zeitstrahl,
  Phasen-Cashflow, KV-Lücke reaktivieren. Überschlag zeigt: Szenario tragbar (Phase-1-Lücke ~90 €/Mo).
- [ ] Strategie-Entscheidung vor Implementierung (Glidepath-Variante vs. Bucket vs. Floor+Upside)
- [ ] Jahr-für-Jahr-Simulation ab Renteneintritt
- [ ] Einnahmen: DRV + Direktzusage + weitere Quellen aus dem Store
- [ ] Lücke: benötigte Ausgaben (inflationsangepasst) minus garantierte Einnahmen
- [ ] Depot-Entnahme dynamisch angepasst an tatsächliche Portfolioentwicklung
- [ ] Eimer-Puffer: Cash/Geldmarkt (1–2 Jahre), Anleihen (3–7 Jahre), ETF (langfristig)
- [ ] Warnung wenn Depot vor Lebenserwartung aufgebraucht
- [ ] Szenario-Vergleich: „mit Erbschaft/Immobilien-Erlös" vs. ohne
- [ ] Daten-Fundament bereits vorhanden (Ausgaben, Vermögen, Rentendaten)
- [ ] Neue Store-Felder für Strategie-Einstellungen ergänzen (noch zu definieren)

### H — Smart-Input _(~3–4h, optional)_
- [ ] Natural-Language-Input: Button im Numpad, Textfeld „45€ rewe gestern", Betrag/Datum/Beschreibung-Parser (offline)
- [ ] Autovervollständigung auf Beschreibungsfeld: Datalist aus den letzten 50 Beschreibungen
- [ ] Smart-Kategorie-Vorschlag: Pille mit vorgeschlagener Kategorie beim Tippen, lernt aus Historie

### I — Bank-Integration _(mehrere Sessions, Detailplan unten)_
- [ ] Enable Banking (PSD2/OAuth) + Azure Functions: Kontostände/Wertpapiere automatisch abrufen
- [ ] **Hosting-Konsolidierung evaluieren** — Wenn für die Bank-Integration ohnehin Azure Functions aufgebaut werden: prüfen, ob das App-Hosting von **GitHub Pages → Azure Static Web Apps** ziehen sinnvoll ist (dann alles bei einem Anbieter, evtl. engere Integration mit Functions + Sync).
  - Kontext (06.06.2026): Heute bewusst NICHT umgestellt. Aktuell: Code auf GitHub Pages (`e-labs-x.github.io`), Daten-Sync auf Azure Blob — saubere, funktionierende Trennung. Eine Migration brächte **keinen funktionalen Mehrwert**, aber Risiko/Aufwand: URL-Wechsel (App auf allen Geräten neu installieren), Service-Worker-/Cache-Neuaufbau, CORS + Azure-Sync neu konfigurieren. GitHub Pages + Azure Functions können auch problemlos koexistieren → nur konsolidieren, wenn man einen klaren Grund hat.

#### Detailplan Bank-Integration _(am 05.10.2026 aus `CLAUDE.md` hierher verschoben — unverändert)_

**Ziel:** Kontostände + Wertpapierpositionen automatisch aus Banken abrufen.
**Anzeige:** Vermögens-Tab + Fixkosten-Tab (Kontostand-Kontext).
**Kosten:** 0 € (Enable Banking kostenlos persönlich, Azure Functions Free Tier).

**Banken:** ING, 1822direkt, BMW Bank, Finanzen.net Zero → Enable Banking (PSD2/OAuth)
**Fidelity ESPP:** CSV-Import aus NetBenefits (kein EU-API-Zugang möglich)

**Architektur:**
- Kontostände werden als Asset-Snapshots gespeichert (benutzt `Assets.addSnapshot()` erneut)
- Azure Function hält Enable Banking Client-Secret sicher (gleicher Azure Account wie Sync)
- Tokens in `localStorage('fp_bank_tokens')` — getrennt vom Store-JSON

**Voraussetzungen (vor Session 1 anlegen):**
- Enable Banking Developer-Account: enablebanking.com (kostenlos, ~5 Min)
- Azure Account: bereits vorhanden (`finanzplanersync`)

- [ ] **Session 1 — Azure Function + OAuth** (~2 h): Function mit Enable-Banking-OAuth-Flow +
      Saldo-Endpunkt, erster Test mit ING
- [ ] **Session 2 — Store-Integration** (~2 h): `store.js` neues Feld `bankConnections`;
      `BankSync.pull()` holt Salden → schreibt `Assets.addSnapshot()`
- [ ] **Session 3 — Vermögens-Tab UI** (~2 h): Bereich „Verknüpfte Konten" + Sync-Knopf +
      letzter Sync-Zeitstempel; OAuth-Connect-Flow (Bank-Login in neuem Tab)
- [ ] **Session 4 — Fidelity CSV + Fixkosten** (~1 h): CSV-Import-Dialog für Fidelity
      NetBenefits (Drag & Drop); ING-Kontostand als Kontext-Indikator im Fixkosten-Tab

### Rente — Audit-Nacharbeiten _(Stand 06.06.2026)_
_Voller Bericht: `…\Finanzen App\audit_rente_2026-06-06.md`. R1–R6 + Grundfreibetrag-Doppelabzug bereits erledigt & deployed (`?v=20260606v`)._
- [x] **R7** — ✅ ERLEDIGT 07.06. (`?v=20260607a`): Günstigerprüfung §32d Soli-Schwelle auf 25 % korrigiert. Persönlicher ESt-Grenzsatz (ohne Soli) wird gegen reine KapESt 25 % verglichen; gewinnt die Abgeltung, gilt voller Satz inkl. Soli (26,375 %). Tarif-Option nicht mehr fälschlich fast immer „günstiger".
- [x] **R8** — ✅ ERLEDIGT 06.06. (`?v=20260606w`, Commit 4af8946): KV-Lücke entfällt, da Rente ab Eintrittsalter bezogen wird → ab da KVdR-pflichtiger Rentner (DRV zahlt halbe KV, Depot-Entnahmen beitragsfrei). `kvLueckeJahre=0`; Berechnungsblock bleibt deaktiviert für evtl. späteren Rentenbeginn (Option B). Verifiziert: kvLueckeStatus=kein, Rente/Lücke unverändert.
- [x] **R9** — ✅ ERLEDIGT 06.06. (`?v=20260606y`): Projektion durchgängig in heutiger Kaufkraft (reale Renditen, reale konstante Entnahme) → behob zu optimistische Depot-Haltbarkeit (Nutzer: 37→26 J.). Umschalter „heutiges/zukünftiges Geld" im Renten-Tab (zentrale rpToNominal-Transform; eine Wahrheit, zwei Anzeigen).
- [x] **R10** — ✅ ERLEDIGT 07.06. (`?v=20260607c`): EINE monatliche Engine `_simDepot` als einzige Wahrheit für Haltbarkeit + Verlaufs-Chart + Worst-Case (vorher Chart jährlich, Haltbarkeit monatlich). Verlauf startet jetzt korrekt mit vollem Depot bei Rentenbeginn (vorher Depot nach 1 Jahr). Redundante luecke-Vorab-Schleife entfernt. Verifiziert headless (alt vs. neu): Haltbarkeit unverändert (keine Regression), Chart endet konsistent mit Haltbarkeit. Reine Taktungsdifferenz war in der Praxis klein (<0,4 J. bei 10–30 J.); strukturelle Garantie verhindert künftiges Auseinanderlaufen.
- [x] **R11** — ✅ ERLEDIGT 07.06. (`?v=20260607a`): Geburtsmonat fließt in die Restlaufzeit ein (`currentAgeExact`), nicht mehr nur das Jahr → bis ±1 Jahr genauer bei EP-Akkumulation & Depot-Projektion. `currentAge` bleibt ganzzahlig für Anzeige-Labels (kein Ripple). Verifiziert: yearsToRetire 12,58 statt 13.
- [x] **R12** — ✅ ERLEDIGT 07.06. (`?v=20260607c`): bAV-Einmalauszahlung mit Fünftelregelung §34 EStG (`5 × ESt(Betrag/5)` via rpCalcIncomeTax) statt pauschal 42 %. Annahme: zusammengeballte Auszahlung als isolierte Einkunft (zvE-Basis 0) — berücksichtigt Grundfreibetrag + Progressionszonen, bei großen Summen deutlich realistischer.
- [x] **R13** — ✅ ERLEDIGT 07.06. (`?v=20260607a`): SV-Sätze zentralisiert in `SV_SAETZE` + `pvSatzNachKindern()` (Modul-Konstanten, Entscheidung: gesetzliche Fixwerte gehören in den Code, nicht in den Store). KV-Basissatz (war 3×), PV-Staffel (war 2× dupliziert), bAV-Freibetrag, Werbungskostenpauschale jetzt an EINER Stelle. Jahres-Update nur noch dort.
- [x] **R14** — ✅ ERLEDIGT 07.06. (`?v=20260607c`): totes `person.isActive`-Feld aus beiden Personen-Defaults entfernt (nirgends gelesen). Partner wird allein über `settings.partnerEnabled` aktiviert → keine Verwirrung mehr.
- [x] **R15** — ✅ ERLEDIGT 07.06. (`?v=20260607c`): Halbeinkünfteverfahren (halber Satz) nur noch ab Alter 62 (§20 Abs.1 Nr.6 EStG); bei früherer Auszahlung voller Ertrag besteuert. Die 12-Jahre-Vertragsdauer bleibt mangels Vertragsbeginn-Daten ungeprüft (im Code vermerkt).

### Sicherheit / Sync _(aus Audit 05.06.2026, offen-optional)_
- [x] **Backup-Verhalten prüfen & absichern** — ✅ ERLEDIGT 07.06. (`?v=20260607b`):
  - (a) ✅ Cloud-Schutz vorhanden: Azure **Soft Delete für Blobs + Container** aktiv, **30 Tage** (Portal verifiziert 07.06., umfasst auch ÜBERSCHRIEBENE Blobs → guter Stand bleibt 30 T. wiederherstellbar, falls korrupter Stand `sync.fpbackup` überschreibt).
  - (b) ✅ Auto-Sicherungs-Historie wird jetzt ins Download-`.fpbackup` mit-exportiert (`download()` hängt `autoBackups` an; `import()` → `mergeAutoBackups()` stellt sie wieder her, dedupe nach timestamp, quota-sicher, abwärtskompatibel). Bewusst NUR im Download, nicht in `create()` (sonst Verschachtelung bei Auto-Backup/Azure-Push). Verifiziert headless (Export→Löschen→Import-Roundtrip).
  - (c) ✅ war bereits erledigt (M8): tägliches Backup läuft pro Kalendertag beim Start (`AzureSync.maybeDailyBackup()` in app.js init), unabhängig vom Sync.
  - Ziel erreicht: aktueller Stand cloud-gesichert (Azure+Soft Delete), Historie über `.fpbackup` wiederherstellbar.
- [x] Azure: HTTPS-only ✅ aktiviert (07.06., „Sichere Übertragung erforderlich" im Portal).
- [x] Azure: Soft Delete für Blobs + Container ✅ aktiviert (30 Tage, 07.06.) — deckt auch Überschreibungen ab. Versioning nicht zusätzlich nötig (Soft Delete genügt für den Use-Case).
- [x] `sw.js`: SHELL-Marker ✅ wartungsfrei gemacht (07.06., `?v=20260607d`) — `?v` aus SHELL entfernt; Network-First für JS/CSS sorgt für Frische, muss nicht mehr pro Deploy gepflegt werden.
- [x] Rente-Ausgabenbasis `getAusgabenAvg` ✅ entschieden (07.06.): archivierte Objekte ausgeschlossen — konsistent mit allen anderen Übersichten (M4).

### SAS-Härtung — eigene Session _(Sicherheit, aus Inventar-App-Vergleich 15.06.2026)_
_Kontext: Die Inventar-App nutzt dieselbe Azure-SAS-Technik und hat diese drei Punkte am 15.06.2026 bereits umgesetzt — der Finanzplaner noch nicht. Das Juni-Audit hat nur die Umgebung gehärtet (Container privat, CORS, HTTPS, Soft Delete), nicht die SAS selbst. Wegen sensibler Finanzdaten in EIGENER, fokussierter Session umsetzen + headless verifizieren._
- [x] **Engere SAS (Least Privilege)** ✅ umgesetzt (16.06.2026) — neuer Konto-SAS-Token erzeugt: nur Dienst **Blob**, Ressourcentypen **Container+Objekt**, Berechtigungen **`racwl`** (Lesen/Schreiben/Liste/Hinzufügen/Erstellen — KEIN Löschen `d`), **Nur HTTPS**, Ablauf 12 Monate. Auf allen Geräten neu eingefügt. **Wichtig fürs nächste Mal:** Die App-`connect()` baut die Blob-URL aus dem Teil VOR `?` → braucht eine **Konto-SAS** (Format `…blob.core.windows.net/?sv=…`), KEINE Container-SAS (`…/sync?sv=…` würde zu `/sync/sync/...` doppeln). Hinweis: alte SAS bleibt bis Ablauf parallel gültig — echtes Widerrufen nur via Stored Access Policy oder Key-Rotation.
- [x] **Ablauf-Erinnerung** ✅ umgesetzt (16.06.2026) — `_sasExpiry()`/`_sasDaysLeft()` lesen `se=` aus dem Token; globales Warnbanner `#sas-bar` (gelb ab ≤14 T., rot wenn abgelaufen) via `updateSasReminder()` + „Zugang gültig bis"-Zeile in den Einstellungen. Headless verifiziert (warn + danger). Vorbild: Inventar-App.
- [x] **Dirty-Flag `fp_dirty` sessionStorage → localStorage** ✅ umgesetzt (16.06.2026) — überlebt App-Neustart, schützt offline gemachte Änderungen vor stillem Überschreiben beim Auto-Pull (`DIRTY_KEY` in `AzureSync`).
- [x] `CLAUDE.md` (Abschnitt „Cloud-Sync") final nachgezogen (16.06.2026). **SAS-Härtung damit komplett (alle 3 Punkte).**

### Wartung / Sonstiges _(aus CLAUDE.md-Backlog)_
- [ ] **Kategorien / Fixkosten** — UX-Überarbeitung des Eingabe-Flows (vereinfachen)
- [ ] **Google Fonts lokal hosten** — Inter lokal einbinden statt von Google laden (vermeidet IP-Übermittlung an Google)
- [ ] **Altes Daten-Repo löschen** — `e-labs-x/finanzplaner-data` (alter GitHub-Sync) nach Übergangszeit entfernen

---

## Vor jeder neuen Version prüfen

- [ ] Datei-Version bumpen: `<title>`, `FP_VERSION`, `<div class="sb-ver">`
- [ ] Light + Dark Mode visuell testen
- [ ] Mobile-Breakpoints testen (< 480, < 768, < 1100 px)
- [ ] Sidebar collapse/expand testen
- [ ] localStorage-Migration: neue Felder mit Default-Werten absichern
- [ ] Console: 0 Errors, 0 Warnings
