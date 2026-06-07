# Finanzplaner — To-Do Liste

Letzte Aktualisierung: 2026-06-07 (3) — Renten-Audit R1–R15 komplett abgearbeitet

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

### I — Bank-Integration _(mehrere Sessions, Detailplan in CLAUDE.md)_
- [ ] Enable Banking (PSD2/OAuth) + Azure Functions: Kontostände/Wertpapiere automatisch abrufen
- [ ] **Hosting-Konsolidierung evaluieren** — Wenn für die Bank-Integration ohnehin Azure Functions aufgebaut werden: prüfen, ob das App-Hosting von **GitHub Pages → Azure Static Web Apps** ziehen sinnvoll ist (dann alles bei einem Anbieter, evtl. engere Integration mit Functions + Sync).
  - Kontext (06.06.2026): Heute bewusst NICHT umgestellt. Aktuell: Code auf GitHub Pages (`e-labs-x.github.io`), Daten-Sync auf Azure Blob — saubere, funktionierende Trennung. Eine Migration brächte **keinen funktionalen Mehrwert**, aber Risiko/Aufwand: URL-Wechsel (App auf allen Geräten neu installieren), Service-Worker-/Cache-Neuaufbau, CORS + Azure-Sync neu konfigurieren. GitHub Pages + Azure Functions können auch problemlos koexistieren → nur konsolidieren, wenn man einen klaren Grund hat.

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
- [ ] Azure: HTTPS-only erzwingen
- [x] Azure: Soft Delete für Blobs + Container ✅ aktiviert (30 Tage, 07.06.) — deckt auch Überschreibungen ab. Versioning nicht zusätzlich nötig (Soft Delete genügt für den Use-Case).
- [ ] `sw.js`: SHELL-/Versionsmarker pflegen (kosmetisch)
- [ ] Rente-Ausgabenbasis `getAusgabenAvg` bzgl. archivierter Objekte entscheiden (bewusst offen gelassen)

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
