# Finanzplaner - alle Pruefungen mit echten Daten in einem Lauf.
# Aufruf:  pwsh -File _tests\pruefen.ps1            (Daten frisch aus Azure)
#          pwsh -File _tests\pruefen.ps1 -Daten X.fpbackup
# Laeuft automatisch vor jedem git push (Hook, siehe _tests\README.md).
# Echte Daten liegen NUR in einem Temp-Ordner und werden am Ende geloescht - nie im Repo (oeffentlich!).
param([string]$Daten = '')

$ErrorActionPreference = 'Continue'
try { [Console]::OutputEncoding = [Text.Encoding]::UTF8 } catch {}
$repo   = Split-Path -Parent $PSScriptRoot
$lib    = Join-Path $PSScriptRoot 'lib'
$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$backupDir = $env:FP_BACKUP_DIR
if (-not $backupDir) { $backupDir = Join-Path $env:USERPROFILE 'OneDrive\Dokumente\07 Projekte\Claude\Finanzen\Finanzen App\files' }
$work   = Join-Path $env:TEMP ('fp_pruefung_' + [guid]::NewGuid().ToString('N').Substring(0, 8))
$utf8   = New-Object System.Text.UTF8Encoding $false
$results = New-Object System.Collections.ArrayList
function Add-Result([string]$name, [bool]$pass, [string]$info) {
  [void]$results.Add([pscustomobject]@{ Name = $name; Pass = $pass; Info = $info })
}

$started = Get-Date
New-Item -ItemType Directory -Path $work | Out-Null
try {
  # --- 1. Testdaten -------------------------------------------------------
  $dataFile = Join-Path $work 'daten.fpbackup'
  $quelle = ''
  if ($Daten) {
    Copy-Item $Daten $dataFile; $quelle = $Daten
  } else {
    $key = az storage account keys list -n finanzplanersync --query "[0].value" -o tsv 2>$null
    if ($LASTEXITCODE -eq 0 -and $key) {
      az storage blob download --account-name finanzplanersync --account-key $key -c sync -n sync.fpbackup -f $dataFile --auth-mode key -o none 2>$null | Out-Null
      if ($LASTEXITCODE -eq 0 -and (Test-Path $dataFile)) { $quelle = 'Azure (aktueller Stand)' }
    }
    if (-not $quelle) {
      $newest = Get-ChildItem $backupDir -Filter 'sync_*.fpbackup' -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1
      if (-not $newest) { throw 'Keine Testdaten: Azure nicht erreichbar und keine files\sync_*.fpbackup gefunden' }
      Copy-Item $newest.FullName $dataFile
      $quelle = 'Sicherung ' + $newest.Name + ' (Azure nicht erreichbar)'
    }
  }
  Write-Host ('Testdaten: ' + $quelle)

  # --- 2. App-Kopie mit Testseiten ----------------------------------------
  $app = Join-Path $work 'app'
  New-Item -ItemType Directory -Path $app | Out-Null
  foreach ($f in 'index.html', 'style.css', 'store.js', 'app.js', 'tests.html') { Copy-Item (Join-Path $repo $f) $app }
  Copy-Item (Join-Path $lib '*.js') $app
  [IO.File]::WriteAllText((Join-Path $app 'data.js'), 'window.__REAL=' + [IO.File]::ReadAllText($dataFile) + ';', $utf8)
  $index = [IO.File]::ReadAllText((Join-Path $app 'index.html'))
  $cut = $index.IndexOf('<script src="store.js')
  if ($cut -lt 0) { throw 'index.html: Einbindung von store.js nicht gefunden' }
  function Write-Page([string]$name, [string]$inject) {
    [IO.File]::WriteAllText((Join-Path $app $name), $index.Substring(0, $cut) + $inject + "`n" + $index.Substring($cut), $utf8)
  }
  Write-Page 'rundgang.html' '<script src="data.js"></script><script src="rundgang.js"></script>'
  Write-Page 'sicherheit.html' '<script src="data.js"></script><script src="sicherheit.js"></script>'
  Write-Page 'sync.html' '<script src="data.js"></script><script src="sync-szenarien.js"></script><script src="sync-harness.js"></script>'
  $t = [IO.File]::ReadAllText((Join-Path $app 'tests.html')).Replace('</body>', '<script>window.addEventListener("load",function(){runTests()})</script></body>')
  [IO.File]::WriteAllText((Join-Path $app 'tests-auto.html'), $t, $utf8)

  # --- 3. Browser-Pruefungen parallel starten -----------------------------
  $base = 'file:///' + ($app -replace '\\', '/') + '/'
  $runs = @()
  function Start-Page([string]$label, [string]$page, [int]$budget) {
    $prof = Join-Path $work ('prof_' + $label)
    $out  = Join-Path $work ('out_' + $label + '.html')
    $p = Start-Process -FilePath $chrome -PassThru -WindowStyle Hidden -RedirectStandardOutput $out -ArgumentList @(
      '--headless=new', '--disable-gpu', '--no-sandbox', "--user-data-dir=$prof", '--allow-file-access-from-files',
      "--virtual-time-budget=$budget", '--dump-dom', ($base + $page))
    return [pscustomobject]@{ Label = $label; Proc = $p; Out = $out }
  }
  $runs += Start-Page 'tests' 'tests-auto.html' 10000
  $runs += Start-Page 'rundgang' 'rundgang.html' 15000
  $runs += Start-Page 'sicherheit' 'sicherheit.html' 30000
  $szen = 'merge', 'remote', 'connect', 'pullrace', 'pushrace', 'retry', 'nonematch', 'espp', 'autosync'
  foreach ($s in $szen) { $runs += Start-Page ('sync_' + $s) ('sync.html?sc=' + $s) 90000 }

  # --- 4. Node: Store-Regeln gegen echte Daten (laeuft waehrenddessen), jede lib\*.test.js ---
  foreach ($tf in Get-ChildItem (Join-Path $lib '*.test.js') | Sort-Object Name) {
    $nodeOut = & node $tf.FullName (Join-Path $app 'store.js') $dataFile 2>&1
    $nodeExit = $LASTEXITCODE
    $sumLine = ($nodeOut | Where-Object { "$_" -like 'SUMMARY*' }) -join ''
    $fails = ($nodeOut | Where-Object { "$_" -like 'FAIL*' }) -join ' | '
    if (-not $sumLine) { $fails = 'Absturz: ' + ((@($nodeOut | Where-Object { "$_" -match 'Error' }) | Select-Object -First 1) -join '') }
    $label = ($tf.Name -replace '\.test\.js$', '')
    Add-Result ('Node ' + $label + ' (echte Daten)') ($nodeExit -eq 0) (($sumLine -replace 'SUMMARY ', '') + $(if ($fails) { ' - ' + $fails }))
  }

  # --- 5. Browser-Ergebnisse einsammeln -----------------------------------
  # Chrome-Unterprozesse erben den Ausgabe-Handle -> geteilt lesen und warten, bis </html> da ist
  function Read-Shared([string]$path) {
    try {
      $fs = [IO.File]::Open($path, 'Open', 'Read', 'ReadWrite')
      try { $sr = New-Object IO.StreamReader($fs, [Text.Encoding]::UTF8); return $sr.ReadToEnd() } finally { $fs.Dispose() }
    } catch { return '' }
  }
  $deadline = (Get-Date).AddSeconds(300)
  do {
    $open = @($runs | Where-Object { -not ((Test-Path $_.Out) -and ((Read-Shared $_.Out) -match '</html>')) })
    if ($open.Count -gt 0) { Start-Sleep -Seconds 2 }
  } while ($open.Count -gt 0 -and (Get-Date) -lt $deadline)
  foreach ($r in $runs) {
    if (-not $r.Proc.HasExited) { try { $r.Proc.Kill() } catch {} }
    $html = ''
    if (Test-Path $r.Out) { $html = Read-Shared $r.Out }
    if ($r.Label -eq 'tests') {
      $ok = $html -match '<div class="summary ok">'
      $sum = ''
      if ($html -match '<div class="summary[^>]*>([^<]*)') { $sum = $Matches[1] }
      $failRows = [regex]::Matches($html, '<tr><td>([^<]*)(?:<div class="err-msg">([^<]*)</div>)?</td><td>[^<]*</td><td class="fail"') |
        ForEach-Object { $_.Groups[1].Value + ': ' + $_.Groups[2].Value }
      Add-Result 'Selbsttests (tests.html)' $ok ($sum + $(if ($failRows) { ' - ' + ($failRows -join ' | ') }))
      continue
    }
    $o = $null
    if ($html -match '<pre id="out">([^<]*)</pre>') { $o = [Net.WebUtility]::HtmlDecode($Matches[1]) | ConvertFrom-Json }
    $name = if ($r.Label -eq 'rundgang') { 'Rundgang alle Tabs' } elseif ($r.Label -eq 'sicherheit') { 'Sicherheit (Gift-Eintraege, Kurse)' } else { 'Sync: ' + ($r.Label -replace 'sync_', '') }
    if (-not $o) { Add-Result $name $false 'keine Ausgabe'; continue }
    $info = [string]$o.info
    if ($o.errors -and @($o.errors).Count -gt 0) { $info += ' - Fehler: ' + ((@($o.errors) | ForEach-Object { if ($_ -is [string]) { $_ } else { $_ | ConvertTo-Json -Compress } }) -join ' | ') }
    Add-Result $name ([bool]$o.pass) $info
  }
}
catch {
  Add-Result 'Pruefung selbst' $false $_.Exception.Message
}
finally {
  for ($i = 0; $i -lt 5 -and (Test-Path $work); $i++) {
    Remove-Item -Recurse -Force $work -ErrorAction SilentlyContinue
    if (Test-Path $work) { Start-Sleep -Seconds 2 }
  }
  if (Test-Path $work) { Write-Host ('Hinweis: Temp-Ordner nicht ganz geloescht: ' + $work) -ForegroundColor Yellow }
}

# --- 6. Ergebnis ------------------------------------------------------------
Write-Host ''
foreach ($r in $results) {
  $tag = if ($r.Pass) { '[OK]  ' } else { '[FAIL]' }
  $col = if ($r.Pass) { 'Green' } else { 'Red' }
  Write-Host ($tag + ' ' + $r.Name + '  ' + $r.Info) -ForegroundColor $col
}
$bad = @($results | Where-Object { -not $_.Pass }).Count
$dauer = [int]((Get-Date) - $started).TotalSeconds
Write-Host ''
if ($bad -eq 0 -and $results.Count -gt 0) {
  Write-Host ('ALLES GRUEN - ' + $results.Count + ' Pruefungen in ' + $dauer + ' s') -ForegroundColor Green
  exit 0
}
Write-Host ('ROT - ' + $bad + ' von ' + $results.Count + ' Pruefungen fehlgeschlagen (' + $dauer + ' s)') -ForegroundColor Red
exit 1
