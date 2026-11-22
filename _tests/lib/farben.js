// Farbregel (22.11.2026): Grün ist echtes Grün (vorher Lila), Vermögen-Kacheln: Betrag neutral, Gewinn grün / Verlust rot,
// Mini-Verlauf immer blau (nicht rot, nur weil der letzte Punkt unter dem ersten liegt), Typfarbe nur als Punkt, keine Hex-Farben.
// Wird VOR store.js eingebunden (echte Daten, Sync aus).
(function () {
  var errs = [], info = [];
  window.addEventListener('error', function (e) { errs.push(e.message + ' @' + (e.filename || '').split('/').pop() + ':' + e.lineno); });
  localStorage.clear();
  var st = JSON.parse(JSON.stringify(window.__REAL.store || window.__REAL));
  st.settings.azureSync.enabled = false;
  localStorage.setItem('finanzplaner_v3', JSON.stringify(st));

  function rgb(css) { var m = String(css).match(/[\d.]+/g) || []; return m.slice(0, 3).map(Number); }
  function tok(name) { var d = document.createElement('div'); d.style.color = 'var(' + name + ')'; document.body.appendChild(d); var c = getComputedStyle(d).color; d.remove(); return c; }

  window.addEventListener('load', function () {
    setTimeout(function () {
      try {
        // 1. --green ist grün: Grünanteil größer als Rot und Blau
        var g = rgb(fpTokRgba('--green'));
        if (!(g[1] > g[0] && g[1] > g[2])) errs.push('--green ist nicht grün: rgb(' + g.join(',') + ')');
        else info.push('--green rgb(' + g.join(',') + ')');
        nav('vermoegen');
      } catch (e) { errs.push('Start: ' + e.message); }
      setTimeout(function () {
        try {
          var box = document.getElementById('vm-assets');
          var cards = [].slice.call(box.querySelectorAll('.vm-asset'));
          if (cards.length < 3) errs.push('zu wenige Anlage-Kacheln: ' + cards.length);
          var tx = tok('--tx'), green = tok('--green'), red = tok('--red');
          var nVal = 0, nSpark = 0, nGain = 0;
          cards.forEach(function (c) {
            var name = (c.querySelector('.vm-asset-name') || {}).textContent;
            var v = c.querySelector('.vm-asset-val');
            if (v && /\d/.test(v.textContent)) { nVal++; if (getComputedStyle(v).color !== tx) errs.push(name + ': Betrag farbig (' + getComputedStyle(v).color + ')'); }
            [].forEach.call(c.querySelectorAll('svg polyline'), function (pl) {
              nSpark++;
              if (pl.getAttribute('stroke') !== 'var(--blue)') errs.push(name + ': Verlauf in ' + pl.getAttribute('stroke'));
            });
            [].forEach.call(c.querySelectorAll('div'), function (d) {
              if (!/Einstand/.test(d.textContent) || d.children.length) return;
              nGain++;
              var want = /^\s*\+/.test(d.textContent) ? green : red;
              if (getComputedStyle(d).color !== want) errs.push(name + ': Gewinn-Zeile ' + getComputedStyle(d).color + ' statt ' + want);
            });
          });
          if (/#[0-9a-fA-F]{6}\b|rgba\(124,\s*58,\s*237/.test(box.innerHTML)) errs.push('feste Hex-/Lila-Farbe in den Kacheln');
          if (!nSpark) errs.push('kein Mini-Verlauf gefunden');
          // Typfarben sind Tokens (Ring/Punkt), nicht mehr feste Hex-Werte
          if (typeof vmTypeColor !== 'function') errs.push('vmTypeColor fehlt');
          else if (!/^rgba\(/.test(vmTypeColor('etf'))) errs.push('vmTypeColor liefert ' + vmTypeColor('etf'));
          // Historie-Tabelle (22.11.2026): füllt die Karte (vorher width:auto → endete mitten in der Karte),
          // keine Zeile „Änderung Vorjahr“ voller Striche, runde Farbpunkte wie Kacheln/Ring
          var hs = document.querySelector('#vm-hist .vm-hist-scroll'), ht = hs && hs.querySelector('table');
          if (!ht) errs.push('Historie-Tabelle fehlt');
          else {
            var old = hs.style.width; hs.style.width = '2000px';
            var tw = ht.getBoundingClientRect().width;
            if (tw < 1990) errs.push('Historie füllt die Breite nicht: Tabelle ' + Math.round(tw) + ' px in 2000 px');
            hs.style.width = old;
            var yoyRow = [].filter.call(ht.querySelectorAll('tr'), function (r) { return /Vorjahr/.test(r.cells[0] && r.cells[0].textContent); })[0];
            if (yoyRow && !/\d/.test([].slice.call(yoyRow.cells, 1).map(function (c) { return c.textContent; }).join(''))) errs.push('Historie: Zeile „Änderung Vorjahr“ nur mit Strichen');
            var dot = ht.querySelector('.vm-h-dot');
            if (dot && getComputedStyle(dot).borderTopLeftRadius !== '50%') errs.push('Historie: Farbpunkt eckig (' + getComputedStyle(dot).borderTopLeftRadius + ')');
            info.push('Historie füllt Breite, ' + (yoyRow ? 'Vorjahr mit Werten' : 'Vorjahr ausgeblendet'));
          }
          info.push(cards.length + ' Kacheln, ' + nVal + ' Beträge neutral, ' + nSpark + ' Verläufe blau, ' + nGain + ' Gewinn-Zeilen');
        } catch (e) { errs.push('Kacheln: ' + e.message); }
        // Kopf (22.11.2026): eine Hauptzahl = Summe der Auswahl, Auswahl erklärt + „alle zeigen“, Veränderung im Verlauf-Titel,
        // Höchstbreite 1.200 px; Balkenliste bleibt vollständig, Ausgeblendete blass (vm-bar-off)
        try {
          var hv = function () { return (document.querySelector('#vm-total .vm-head-val') || {}).textContent; };
          var hl = function () { return (document.querySelector('#vm-total .vm-head-lbl') || {}).textContent || ''; };
          if (hv() !== eur(FP.Calculator.getAssetSummary(vmInclude).total)) errs.push('Kopf: Hauptzahl ' + hv() + ' ≠ Summe');
          if (!/Gesamtvermögen/.test(hl())) errs.push('Kopf ohne Auswahl: „' + hl() + '“');
          if (getComputedStyle(document.querySelector('#p-vermoegen .vm-wrap')).maxWidth !== '1200px') errs.push('Vermögen-Seite ohne Höchstbreite 1.200 px');
          var tt = document.querySelector('#vm-total .vm-trend-ttl');
          if (!tt || !/[+\-−]?[\d.]+ € \([+\-−]?[\d,]+ %\)/.test(tt.textContent)) errs.push('Verlauf-Titel ohne Veränderung: „' + (tt && tt.textContent) + '“');
          var bigA = FP.Calculator.getAssetSummary().items.slice().sort(function (a, b) { return b.value - a.value; })[0];
          vmToggleAsset(bigA.id);
          if (!/1 Anlage ausgeblendet/.test(hl()) || !document.querySelector('#vm-total .vm-head-reset')) errs.push('Kopf mit Auswahl: „' + hl() + '“');
          if (hv() !== eur(FP.Calculator.getAssetSummary(vmInclude).total)) errs.push('Kopf mit Auswahl: Hauptzahl ≠ Summe der Auswahl');
          var rows = [].slice.call(document.querySelectorAll('#vm-charts .vm-bar-row'));
          var offRows = rows.filter(function (r) { return r.classList.contains('vm-bar-off'); }).map(function (r) { return r.textContent; });
          if (!rows.some(function (r) { return r.textContent.indexOf(bigA.name) >= 0; })) errs.push('Balkenliste: ausgeblendete Anlage fehlt (soll bleiben)');
          if (offRows.length !== 1 || offRows[0].indexOf(bigA.name) < 0) errs.push('Balkenliste blass: ' + offRows.length + ' Zeilen statt nur „' + bigA.name + '“');
          document.querySelector('#vm-total .vm-head-reset').click();
          if (!/Gesamtvermögen/.test(hl())) errs.push('„alle zeigen“ hebt die Auswahl nicht auf');
          info.push('Kopf: Hauptzahl, Auswahl, Verlauf-Titel ok');
        } catch (e) { errs.push('Kopf: ' + e.message); }
        var pre = document.createElement('pre'); pre.id = 'out';
        pre.textContent = JSON.stringify({ pass: errs.length === 0, info: info.join('; '), errors: errs });
        document.body.appendChild(pre);
      }, 1500);
    }, 400);
  });
})();
