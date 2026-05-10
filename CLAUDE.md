# Finanzplaner — Claude Code Session Guide

**Aktuelle Version:** v11.0 | **Stand:** Mai 2026

---

## Dateien & Deployment

| Zweck | Pfad |
|---|---|
| Aktive Arbeitsdatei | `C:\Users\enesc\OneDrive\Dokumente\07 Projekte\Claude\Finanzen\Finanzen App\files\finanzplaner_v11.0.html` |
| GitHub-Repo (Deploy) | `C:\Users\enesc\finanzplaner-repo\index.html` |
| Live-URL | https://e-labs-x.github.io/finanzplaner/ |
| Jährliche Prüfliste | `...\Finanzen App\jaehrliche_pruefung.md` |

**Deploy-Workflow:**
1. Neue HTML unter `files\finanzplaner_vX.Y.html` speichern
2. Nach `finanzplaner-repo\index.html` kopieren
3. `git add index.html && git commit -m "Deploy: Finanzplaner vX.Y" && git push`

**Backup vor jeder Session** — Datei mit Datum kopieren, bevor Änderungen beginnen.

---

## Session starten

1. Aktuelle HTML-Datei einlesen
2. `TODO.md` im Repo prüfen
3. Nur **ein Feature oder 1–2 Bugs** pro Session
4. Nach fertiger Version: `<title>`, `FP_VERSION`, `<div class="sb-ver">` bumpen

---

## Architektur

**Single-HTML-Datei** — kein Build, kein Framework, kein Backend.

```
<style>   Design-System + CSS-Tokens
<script>  Block 1: window.FP.Store + window.FP.Calculator
          Block 2: App-UI-Logik (Tab-Renderer, Event-Handler)
```

**Schlüsselfunktionen:**
- `calcRente(personId, scenarioId)` → großes result-Objekt, alles in einem Pass
- `rpRenderMain()` → ruft calcRente P1+P2, delegiert an KPI + Tabs
- `rpQuickSave()` → liest DOM → schreibt Store → ruft rpRenderMain()
- `rpFillForm()` → liest Store → befüllt DOM
- `GHSync.push() / GHSync.pull()` → GitHub Sync via API
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

## GitHub Sync — Wichtige Regeln (v11.0)

- **Nach Pull:** `FP.Store.Settings.setGithubSync()` NICHT aufrufen → würde alte Daten zurückschreiben. Stattdessen `_origSetItem` direkt nutzen.
- **Push-Loop:** `_justPushed=true` für 12s nach Push blockiert `schedulePush()`
- **Startup-Lock:** 15s nach App-Start kein Auto-Push (`_pendingPush=true` wird danach nachgeholt)
- **Polling:** alle 3 Min — kein `visibilitychange` (verursacht Loop auf iPhone-Webapp)
- **Token:** in `localStorage('fp_gh_token')` — NICHT im Store-JSON

---

## Feature-Backlog (Reihenfolge)

Siehe `TODO.md` für Details. Empfohlene Reihenfolge:

1. **F** — Themes (Slate+Indigo, Warm Sand, Mono + Akzentfarbe + Dichte)
2. **B** — Cashflow-Forecast (Kalender-Grid, Liquiditätslinie)
3. **C** — Ziel-Tracking/Goals (CRUD, Fortschrittsbalken)
4. **A** — Insights (Anomalie-Pillen, Monatsbriefing)
5. **E** — Visualisierungs-Upgrades (Sankey, Heatmap, Waterfall)
6. **G** — Reports & Export (PDF, Steuer-Helfer)
7. **H** — Smart-Input (Natural-Language, Autovervollständigung)

**Nächste Version:** als `finanzplaner_v12.0.html` speichern.

---

## Bekannte offene Punkte

- Rentenwert-Wachstum nach Rentenantritt (Rentenanpassung) — diskutiert, nicht implementiert
- `expectedReturn`, `sonstigeEinkommen` — tote Store-Felder, harmlos, bewusst übersprungen
- Durchschnittsentgelt + BBG-RV nicht in Sidebar editierbar → in `jaehrliche_pruefung.md`
