# Finanzplaner — To-Do Liste

Letzte Aktualisierung: 2026-05-20

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

---

## Vor jeder neuen Version prüfen

- [ ] Datei-Version bumpen: `<title>`, `FP_VERSION`, `<div class="sb-ver">`
- [ ] Light + Dark Mode visuell testen
- [ ] Mobile-Breakpoints testen (< 480, < 768, < 1100 px)
- [ ] Sidebar collapse/expand testen
- [ ] localStorage-Migration: neue Felder mit Default-Werten absichern
- [ ] Console: 0 Errors, 0 Warnings
