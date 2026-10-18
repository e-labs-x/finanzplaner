// Azure-Attrappe für die Sync-Szenarien (Paket 2). Wird von pruefen.ps1 VOR store.js/app.js eingebunden.
// ETag-Semantik wie Azure: If-Match / If-None-Match:* → 412, Fehler und Verzögerungen über __ctl.
// Zustand (Server, Aufrufe, Phase) liegt in localStorage/sessionStorage und überlebt das Neuladen der App.
(function () {
  var SRV = '__srv';
  function srv() { return JSON.parse(localStorage.getItem(SRV) || '{}'); }
  function setSrv(s) { localStorage.setItem(SRV, JSON.stringify(s)); }
  window.__srv = srv; window.__setSrv = setSrv;
  window.__log = function (o) { var a = JSON.parse(localStorage.getItem('__calls') || '[]'); a.push(o); localStorage.setItem('__calls', JSON.stringify(a)); };
  window.__mkTx = function (note, date) {
    return { id: 'tx_' + note, date: date || '10.2026', categoryId: 'cat_sonstiges', amount: 1.23, note: note,
             rawName: 'Test', source: 'manual', createdAt: new Date().toISOString() };
  };
  window.__hasNote = function (storeOrJson, note) {
    if (!storeOrJson) return false;
    var s = typeof storeOrJson === 'string' ? JSON.parse(storeOrJson) : storeOrJson; s = s.store || s;
    return (s.transactions || []).some(function (t) { return t.note === note; });
  };
  window.addEventListener('error', function (e) { __log({ err: e.message, line: e.lineno, file: (e.filename || '').split('/').pop() }); });
  window.addEventListener('unhandledrejection', function (e) { __log({ rej: String(e.reason && e.reason.message || e.reason) }); });

  sessionStorage.setItem('loads', String((+sessionStorage.getItem('loads') || 0) + 1));
  if (!sessionStorage.getItem('ph')) {
    localStorage.clear();
    var st = JSON.parse(JSON.stringify(window.__REAL.store || window.__REAL));
    st.settings.azureSync = { enabled: true, autoSync: true, blobUrl: 'https://fake.invalid/sync/sync.fpbackup', lastSync: null, lastETag: '"E1"' };
    var remote = { _backup: window.__REAL._backup, store: JSON.parse(JSON.stringify(st)) };
    localStorage.setItem('fp_azure_sas', 'sv=x&se=2099-12-31T00%3A00%3A00Z&sig=fake');
    localStorage.setItem('fp_backup_dt', new Date().toISOString().slice(0, 10)); // kein Tagesbackup im Test
    if (window.__setup) window.__setup(st, remote);
    localStorage.setItem('finanzplaner_v3', JSON.stringify(st));
    var s = srv(); if (!s.exists) { s = { exists: true, etag: '"E1"', body: JSON.stringify(remote), n: 100 }; } setSrv(s);
    sessionStorage.setItem('ph', '1');
  }

  window.fetch = function (url, opts) {
    opts = opts || {}; var m = opts.method || 'GET', h = opts.headers || {};
    var ctl = JSON.parse(localStorage.getItem('__ctl') || '{}');
    var rec = { ph: sessionStorage.getItem('ph'), m: m, ifMatch: h['If-Match'] || null, ifNone: h['If-None-Match'] || null };
    function resp(status, body, etag) {
      var hd = new Headers(); if (etag) hd.set('ETag', etag);
      return new Response(body == null ? null : body, { status: status, headers: hd });
    }
    var delay = (m === 'GET' && ctl.getDelay) || (m === 'PUT' && ctl.putDelay) || 0;
    return new Promise(function (res) {
      setTimeout(function () {
        var s = srv(); ctl = JSON.parse(localStorage.getItem('__ctl') || '{}');
        if (m === 'HEAD') { rec.status = s.exists ? 200 : 404; __log(rec); return res(resp(rec.status, null, s.exists ? s.etag : null)); }
        if (m === 'GET')  { rec.status = s.exists ? 200 : 404; __log(rec); return res(resp(rec.status, s.exists ? s.body : null, s.etag)); }
        if (m === 'PUT') {
          if (ctl.failPut > 0) { ctl.failPut--; localStorage.setItem('__ctl', JSON.stringify(ctl)); rec.status = 500; __log(rec); return res(resp(500, null)); }
          if (rec.ifMatch && (!s.exists || rec.ifMatch !== s.etag)) { rec.status = 412; __log(rec); return res(resp(412, null)); }
          if (rec.ifNone === '*' && s.exists) { rec.status = 412; __log(rec); return res(resp(412, null)); }
          s.n = (s.n || 100) + 1; s.exists = true; s.body = String(opts.body); s.etag = '"E' + s.n + '"'; setSrv(s);
          rec.status = 201; __log(rec); return res(resp(201, null, s.etag));
        }
        res(resp(405, null));
      }, delay);
    });
  };

  // Ergebnis ausgeben (einmal). Ohne Ergebnis nach 80 s: als FAIL melden.
  window.__done = function (out) {
    if (document.getElementById('out')) return;
    var calls = JSON.parse(localStorage.getItem('__calls') || '[]');
    out.errors = calls.filter(function (c) { return c.err || c.rej; });
    if (out.errors.length) out.pass = false;
    var pre = document.createElement('pre'); pre.id = 'out'; pre.textContent = JSON.stringify(out); document.body.appendChild(pre);
  };
  setTimeout(function () { window.__done({ pass: false, info: 'kein Ergebnis (Zeitüberschreitung)', ph: sessionStorage.getItem('ph') }); }, 80000);
})();
