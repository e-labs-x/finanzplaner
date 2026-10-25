# Prüfungen — Finanzplaner

Ein Befehl prüft die App mit **echten Daten**, bevor etwas live geht:

```
pwsh -File _tests\pruefen.ps1
```

Ergebnis nach ca. 30 s: `ALLES GRUEN` oder `ROT` mit der fehlgeschlagenen Prüfung.
**Läuft automatisch vor jedem `git push`**, sobald App- oder Testdateien im Push stecken
(Hook einrichten: `pwsh -File _tests\hook-installieren.ps1`, einmal pro Rechner). Ist die Prüfung rot,
wird der Push abgebrochen.

## Woher die Daten kommen — und wohin sie NICHT kommen

- Frisch aus Azure (`az`, Kontoschlüssel), sonst die neueste `files\sync_*.fpbackup` aus OneDrive
  (Ordner per `FP_BACKUP_DIR` änderbar), oder ausdrücklich: `-Daten pfad.fpbackup`.
- Die Kopie liegt nur in `%TEMP%\fp_pruefung_*` und wird am Ende gelöscht.
- **Dieses Repo ist öffentlich: hier dürfen nie Daten, Schlüssel oder Tokens landen.**
  Die Sync-Tests benutzen eine Azure-Attrappe und ein Schein-Token.

## Was geprüft wird

| Prüfung | Datei | Was sie belegt |
|---|---|---|
| Selbsttests | `../tests.html` | Store-Funktionen auf einem isolierten Standard-Datensatz |
| Vorlagen-Regel | `lib/vorlagen.test.js` (Node) | Kein Hin und Her beim Start, keine Doppelbuchung, Fixkosten-Liste = gebucht, ↕ / ✏️ / Löschen / Papierkorb / Verschieben mit echten Daten, Migration wiederholbar |
| Robustheit | `lib/robust.test.js` (Node) | Papierkorb für Anlagen/Freistellungsaufträge, Wiederherstellen ohne Doppel, Rentenrechnung meldet fehlende Eingaben statt 0, Service Worker nimmt bei hängendem Netz nach 3 s den Cache |
| Rundgang | `lib/rundgang.js` | Alle 13 Tabs öffnen sich mit echten Daten ohne Fehler |
| Sicherheit | `lib/sicherheit.js` | Gift-Einträge (Namen, Notizen, Farben, Suchbegriff …) in allen Ansichten führen keinen Code aus; „Kurse aktualisieren“ lädt kein Script von fremden Servern; CSP sperrt Abruf an fremden Server; Excel-Bibliothek lädt als 0.20.3 mit Prüfsumme |
| Sync (9 Szenarien) | `lib/sync-harness.js` + `lib/sync-szenarien.js` | Zusammenführen, Server-Daten, Neu verbinden, Buchung während Download/Upload, Wiederholen, If-None-Match, Vermögen-Tab, Auto-Sync aus |

## Regel für neue Korrekturen

Jede Korrektur bekommt eine Prüfung, die **am alten Code scheitert** (Gegenprobe), und kommt hier dazu.
Gegenprobe gegen einen alten Stand:

```
git worktree add --detach %TEMP%\fp_alt <tag-oder-commit>
xcopy /E /I _tests %TEMP%\fp_alt\_tests
pwsh -File %TEMP%\fp_alt\_tests\pruefen.ps1      # muss ROT sein
git worktree remove --force %TEMP%\fp_alt
```

`.ps1`-Dateien hier sind ASCII-rein (Windows PowerShell 5.1 liest UTF-8 ohne BOM als ANSI).
