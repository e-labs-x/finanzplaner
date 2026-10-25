// Rundgang: echte Daten laden (Sync aus), alle Tabs öffnen, Fehler sammeln. Wird VOR store.js eingebunden.
(function () {
  var errs = [];
  window.addEventListener('error', function (e) { errs.push(e.message + ' @' + (e.filename || '').split('/').pop() + ':' + e.lineno); });
  localStorage.clear();
  var st = JSON.parse(JSON.stringify(window.__REAL.store || window.__REAL));
  st.settings.azureSync.enabled = false;
  localStorage.setItem('finanzplaner_v3', JSON.stringify(st));
  window.addEventListener('load', function () {
    var tabs = 'home eingabe auswertung budget cashflow reports objekte fixkosten gehalt vermoegen rente einstellungen mehr'.split(' '), i = 0;
    (function next() {
      if (i < tabs.length) {
        try { nav(tabs[i]); } catch (e) { errs.push(tabs[i] + ': ' + e.message); }
        i++; setTimeout(next, 400);
        return;
      }
      // Einstellungen: jeder Menüpunkt zeigt genau seine Karte(n), nichts anderes
      var nSec = 0;
      if (window.ST_MENU && window.stOpen) {
        try { nav('einstellungen'); } catch (e) { errs.push('einstellungen: ' + e.message); }
        ST_MENU.forEach(function (g) {
          g.items.forEach(function (it) {
            try {
              stOpen(it.k); nSec++;
              var vis = [].filter.call(document.querySelectorAll('#st-wrap [data-st]'), function (c) { return c.offsetHeight > 0; });
              if (!vis.length || vis.some(function (c) { return c.getAttribute('data-st') !== it.k; }))
                errs.push('Einstellungen ' + it.k + ': sichtbar ' + vis.map(function (c) { return c.getAttribute('data-st'); }).join('+'));
            } catch (e) { errs.push('Einstellungen ' + it.k + ': ' + e.message); }
          });
        });
      }
      // Excel-Export: Datei abfangen statt herunterladen; Blatt „Sparpläne“ = alle Sparraten der Daten
      var xInfo = 'Excel nicht geprueft';
      function finish() {
        var pre = document.createElement('pre'); pre.id = 'out';
        pre.textContent = JSON.stringify({ pass: errs.length === 0 && FP.Store.writeLock() === null, info: tabs.length + ' Tabs, ' + nSec + ' Einstellungsbereiche, ' + xInfo, errors: errs });
        document.body.appendChild(pre);
      }
      _loadXLSX(function () {
        try {
          var wb = null;
          XLSX.writeFile = function (w) { wb = w; };
          stExportExcel();
          var S = FP.Store.get();
          var soll = (S.assets || []).filter(function (a) { return a.status === 'aktiv' && a.monthlyPlan > 0; }).length + (S.savingsPlans || []).length;
          function blatt(n) { return wb && wb.Sheets[n] ? XLSX.utils.sheet_to_json(wb.Sheets[n], { header: 1 }).slice(1) : null; }
          function summe(r, col) { return Math.round(r.reduce(function (a, z) { return a + (Number(z[col]) || 0); }, 0) * 100); }
          function gleich(name, ist, sollW) { if (ist !== sollW) errs.push('Excel-Export ' + name + ': ' + ist + ' statt ' + sollW); }
          var rows = (blatt('Sparpläne') || []).length;
          gleich('Sparplaene Zeilen', rows, soll);
          if (!soll) errs.push('Excel-Export: Testdaten ohne Sparplan - Pruefung waere wirkungslos');
          // Buchungen: jede Zeile, Summe auf den Cent, Kategorie überall gesetzt
          var tx = blatt('Transaktionen') || [];
          gleich('Transaktionen Zeilen', tx.length, S.transactions.length);
          gleich('Transaktionen Summe (Cent)', summe(tx, 1), Math.round(S.transactions.reduce(function (a, t) { return a + t.amount; }, 0) * 100));
          gleich('Transaktionen ohne Kategorie', tx.filter(function (z) { return !z[2]; }).length, 0);
          var txt = function (arr) { return arr.slice().sort().join(''); };
          gleich('Transaktionen Spalte Text = Buchungstexte', txt(tx.map(function (z) { return String(z[3] == null ? '' : z[3]); })) === txt(S.transactions.map(function (t) { return t.rawName || ''; })), true);
          // Vorlagen: jede Vorlage, Summe der Monatsbeträge
          var fk = blatt('Vorlagen') || [];
          gleich('Vorlagen Zeilen', fk.length, (S.recurring || []).length);
          var objIds = {}; S.objects.forEach(function (o) { objIds[o.id] = 1; });
          gleich('Vorlagen mit Objekt', fk.filter(function (z) { return z[4]; }).length, (S.recurring || []).filter(function (r) { return objIds[r.objectId]; }).length);
          gleich('Vorlagen Summe (Cent)', summe(fk, 1), Math.round((S.recurring || []).reduce(function (a, r) { return a + (r.amount || 0); }, 0) * 100));
          // Vermögen: jede aktive Anlage + ESPP-Zeile, Summe = Gesamtvermögen der App
          var akt = (S.assets || []).filter(function (a) { return a.status === 'aktiv'; });
          var vm = blatt('Vermögen') || [];
          var vs = FP.Calculator.getAssetSummary();
          gleich('Vermoegen Zeilen', vm.length, akt.length + ((vs.byType.espp || 0) > 0 ? 1 : 0));
          gleich('Vermoegen Summe (Cent) gegen App', summe(vm, 3), Math.round(vs.total * 100));
          // Gehalt: jeder Monat jeder Person, Netto-Summe
          var gl = blatt('Gehalt') || [], gSoll = 0, gNetto = 0;
          Object.keys(S.salary || {}).forEach(function (pid) { Object.keys(S.salary[pid] || {}).forEach(function (m) { gSoll++; gNetto += S.salary[pid][m].netSalary || 0; }); });
          gleich('Gehalt Zeilen', gl.length, gSoll);
          gleich('Gehalt Netto (Cent)', summe(gl, 3), Math.round(gNetto * 100));
          // ESPP: jeder Zyklus
          var es = blatt('ESPP') || [];
          gleich('ESPP Zeilen', es.length, ((S.espp && S.espp.zyklen) || []).length);
          xInfo = 'Excel ' + tx.length + ' Buchungen, ' + fk.length + ' Vorlagen, ' + vm.length + ' Vermoegen, ' + rows + ' Sparplaene, ' + gl.length + ' Gehalt, ' + es.length + ' ESPP geprueft';
        } catch (e) { errs.push('Excel-Export: ' + e.message); }
        finish();
      }, function () { errs.push('Excel-Bibliothek laedt nicht'); finish(); });
    })();
  });
})();
