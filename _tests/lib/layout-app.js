// Innere Seite der Layout-Prüfung: echte Daten laden (Sync aus) und den Rente-Tab öffnen.
// Wird VOR store.js eingebunden. Die Messung macht layout.js in der äußeren Seite (iframes).
(function () {
  localStorage.clear();
  var st = JSON.parse(JSON.stringify(window.__REAL.store || window.__REAL));
  st.settings.azureSync.enabled = false;
  localStorage.setItem('finanzplaner_v3', JSON.stringify(st));
  window.addEventListener('load', function () { setTimeout(function () { nav('rente'); }, 300); });
})();
