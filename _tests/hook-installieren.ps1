# Richtet den Git-Hook ein, der vor jedem "git push" _tests\pruefen.ps1 ausfuehrt.
# Einmal pro Rechner/Klon ausfuehren:  pwsh -File _tests\hook-installieren.ps1
# Git-Hooks werden nicht mitversioniert - deshalb dieses Skript.
$repo = Split-Path -Parent $PSScriptRoot
$hook = Join-Path $repo '.git\hooks\pre-push'
$text = @'
#!/bin/sh
# Finanzplaner: vor jedem Push alle Pruefungen mit echten Daten (_tests/README.md).
# Nur wenn App- oder Testdateien im Push stecken. Bewusst umgehen: git push --no-verify
if git rev-parse --abbrev-ref --symbolic-full-name @{u} >/dev/null 2>&1; then
  changed=$(git diff --name-only @{u}..HEAD)
  if ! echo "$changed" | grep -qE '^(index\.html|style\.css|store\.js|app\.js|sw\.js|tests\.html|_tests/)'; then
    echo "Pruefung uebersprungen: keine App-Dateien im Push."
    exit 0
  fi
fi
if command -v pwsh >/dev/null 2>&1; then PS=pwsh; else PS=powershell.exe; fi
echo "Pruefe vor dem Push (ca. 30 s) ..."
"$PS" -NoProfile -ExecutionPolicy Bypass -File "_tests/pruefen.ps1"
rc=$?
if [ $rc -ne 0 ]; then
  echo ""
  echo "PUSH ABGEBROCHEN: Pruefung rot. Erst beheben, dann erneut pushen."
fi
exit $rc
'@
[IO.File]::WriteAllText($hook, $text.Replace("`r`n", "`n"), (New-Object System.Text.UTF8Encoding $false))
Write-Host ('Hook eingerichtet: ' + $hook)
