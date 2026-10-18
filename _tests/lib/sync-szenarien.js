// Sync-Szenarien (Audit-Block 2 / Paket 2). Wird VOR sync-harness.js eingebunden; Szenario über ?sc=…
// __setup(lokalerStore, remoteBackup) läuft vor dem App-Start, run(phase) nach dem Laden.
// Jedes Szenario meldet { pass, … } über __done.
(function () {
  var SC = new URLSearchParams(location.search).get('sc');
  function after(ms, fn) { setTimeout(fn, ms); }
  function remoteWith(remote, note, etag) {
    remote.store.transactions.push(__mkTx(note));
    __setSrv({ exists: true, etag: etag, body: JSON.stringify(remote), n: 200 });
  }
  function local() { return JSON.parse(localStorage.getItem('finanzplaner_v3')); }
  function srvBody() { var s = __srv(); return s.body ? JSON.parse(s.body) : null; }
  function conflictOpen() { return document.getElementById('m-conflict').classList.contains('open'); }
  function calls() { return JSON.parse(localStorage.getItem('__calls') || '[]'); }
  function add(note) { FP.Store.Transactions.add({ amount: 2, date: '10.2026', categoryId: 'cat_sonstiges', note: note }); }

  var S = {
    // Konflikt → Zusammenführen: Ergebnis lokal UND auf dem Server, spätere Buchung geht hinterher
    merge: {
      setup: function (st, remote) { st.transactions.push(__mkTx('L1')); localStorage.setItem('fp_dirty', '1'); remoteWith(remote, 'R1', '"E2"'); },
      run: function (ph) {
        if (ph === '1') after(5000, function () {
          if (!conflictOpen()) return __done({ pass: false, info: 'kein Konfliktdialog' });
          sessionStorage.setItem('ph', '2'); AzureSync.conflictChoose('merge');
        });
        if (ph === '2') after(20000, function () {
          add('L2');
          after(16000, function () {
            var sb = srvBody(), l = local();
            var ok = __hasNote(sb, 'L1') && __hasNote(sb, 'R1') && __hasNote(sb, 'L2') &&
                     __hasNote(l, 'L1') && __hasNote(l, 'R1') && __hasNote(l, 'L2') &&
                     !localStorage.getItem('fp_dirty') && l.settings.azureSync.lastETag === __srv().etag;
            __done({ pass: ok, info: 'Server+lokal L1/R1/L2, ETag gleich' });
          });
        });
      }
    },
    // Konflikt → Server-Daten: lokale Änderung bewusst verworfen, liegt aber in „Vor Import"
    remote: {
      setup: function (st, remote) { st.transactions.push(__mkTx('L1')); localStorage.setItem('fp_dirty', '1'); remoteWith(remote, 'R1', '"E2"'); },
      run: function (ph) {
        if (ph === '1') after(5000, function () { sessionStorage.setItem('ph', '2'); AzureSync.conflictChoose('remote'); });
        if (ph === '2') after(20000, function () {
          var l = local();
          var saved = FP.BackupManager.getAutoBackups().some(function (b) { return b.label === 'Vor Import' && __hasNote(b.data, 'L1'); });
          var puts = calls().filter(function (c) { return c.ph === '2' && c.m === 'PUT'; }).length;
          __done({ pass: !__hasNote(l, 'L1') && __hasNote(l, 'R1') && !localStorage.getItem('fp_dirty') && puts === 0 && saved,
                   info: 'Server-Stand übernommen, lokaler in Vor-Import gesichert' });
        });
      }
    },
    // Neu verbinden mit offenen Änderungen (Token war abgelaufen): Konflikt statt Pull
    connect: {
      setup: function (st, remote) {
        st.transactions.push(__mkTx('L1')); localStorage.setItem('fp_dirty', '3');
        st.settings.azureSync = { enabled: false, autoSync: true, blobUrl: null, lastSync: null, lastETag: null };
        localStorage.removeItem('fp_azure_sas'); remoteWith(remote, 'R1', '"E2"');
      },
      run: function () {
        after(3000, function () {
          AzureSync.connect('https://fake.invalid/?sv=x&se=2099-12-31T00%3A00%3A00Z&sig=fake');
          after(4000, function () {
            var open = conflictOpen(), kept = __hasNote(local(), 'L1');
            AzureSync.conflictChoose('local');
            after(4000, function () {
              __done({ pass: open && kept && sessionStorage.getItem('loads') === '1' && __hasNote(srvBody(), 'L1') && !localStorage.getItem('fp_dirty'),
                       info: 'Konfliktdialog, kein Neuladen, Lokal hochgeladen' });
            });
          });
        });
      }
    },
    // Buchung während eines Downloads: Konflikt statt Überschreiben
    pullrace: {
      // Download dauert 10 s, Buchung nach 3,5 s — liegt sicher mitten im Download, auch bei Last
      setup: function (st, remote) { remoteWith(remote, 'R1', '"E2"'); localStorage.setItem('__ctl', JSON.stringify({ getDelay: 10000 })); },
      run: function () {
        after(3500, function () { add('L-RACE'); });
        after(18000, function () {
          __done({ pass: conflictOpen() && __hasNote(local(), 'L-RACE') && sessionStorage.getItem('loads') === '1',
                   info: 'Konfliktdialog, Buchung erhalten, kein Neuladen' });
        });
      }
    },
    // Buchung während eines Uploads: geht im zweiten Upload hinterher
    pushrace: {
      setup: function () { localStorage.setItem('__ctl', JSON.stringify({ putDelay: 2000 })); },
      run: function () {
        after(17000, function () {
          add('P1');
          after(1200, function () { add('P2'); });
          after(22000, function () {
            var sb = srvBody();
            __done({ pass: __hasNote(sb, 'P1') && __hasNote(sb, 'P2') && !localStorage.getItem('fp_dirty'), info: 'P1 und P2 auf dem Server' });
          });
        });
      }
    },
    // Upload scheitert einmal: neuer Versuch
    retry: {
      setup: function (st) { st.transactions.push(__mkTx('L1')); localStorage.setItem('fp_dirty', '1'); localStorage.setItem('__ctl', JSON.stringify({ failPut: 1 })); },
      run: function () {
        after(55000, function () {
          var puts = calls().filter(function (c) { return c.m === 'PUT'; }).map(function (c) { return c.status; });
          __done({ pass: __hasNote(srvBody(), 'L1') && !localStorage.getItem('fp_dirty') && puts[0] === 500, info: 'PUTs ' + puts.join(',') });
        });
      }
    },
    // Ohne bekannten Server-Stand nie blind überschreiben
    nonematch: {
      // Startprüfung verzögert: sonst kann sie je nach Rechnerlast vor dem Test-Upload laufen
      setup: function (st, remote) {
        st.transactions.push(__mkTx('L1')); st.settings.azureSync.lastETag = null; localStorage.setItem('fp_dirty', '1');
        localStorage.setItem('__ctl', JSON.stringify({ headDelay: 10000 })); remoteWith(remote, 'R1', '"E2"');
      },
      run: function () {
        after(500, function () { AzureSync.push(false); });
        after(4000, function () {
          var p = calls().filter(function (c) { return c.m === 'PUT'; })[0] || {};
          __done({ pass: p.ifNone === '*' && p.status === 412 && __hasNote(srvBody(), 'R1') && !__hasNote(srvBody(), 'L1') && conflictOpen(),
                   info: 'If-None-Match:* → 412 → Konflikt' });
        });
      }
    },
    // Vermögen-Tab öffnen speichert nichts
    espp: {
      setup: function () {},
      run: function () {
        after(17000, function () {
          var lm = local().meta.lastModified;
          nav('vermoegen');
          after(3000, function () {
            var puts = calls().filter(function (c) { return c.m === 'PUT'; }).length;
            __done({ pass: local().meta.lastModified === lm && !localStorage.getItem('fp_dirty') && puts === 0, info: 'kein Speichern, kein Upload' });
          });
        });
      }
    },
    // Auto-Sync aus löscht offene Änderungen nicht. Startprüfung (HEAD) verzögert, damit kein regulärer
    // Upload vor dem Ausschalten den Zähler leert — sonst hinge das Ergebnis von der Rechnerlast ab.
    autosync: {
      setup: function (st) { st.transactions.push(__mkTx('L1')); localStorage.setItem('fp_dirty', '2'); localStorage.setItem('__ctl', JSON.stringify({ headDelay: 10000 })); },
      run: function () {
        after(1000, function () {
          azsToggleAuto(false);
          after(1000, function () { __done({ pass: +localStorage.getItem('fp_dirty') > 0, info: 'Zähler nach Aus: ' + localStorage.getItem('fp_dirty') }); });
        });
      }
    },
  };
  if (!S[SC]) return;
  window.__setup = S[SC].setup;
  window.addEventListener('load', function () { S[SC].run(sessionStorage.getItem('ph')); });
})();
