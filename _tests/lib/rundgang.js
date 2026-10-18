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
      var pre = document.createElement('pre'); pre.id = 'out';
      pre.textContent = JSON.stringify({ pass: errs.length === 0 && FP.Store.writeLock() === null, info: tabs.length + ' Tabs', errors: errs });
      document.body.appendChild(pre);
    })();
  });
})();
