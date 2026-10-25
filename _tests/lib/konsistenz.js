// Konsistenz (Paket 5, Schritt 2): dieselbe Zahl muss überall gleich sein. Echte Daten, Sync aus.
// Wird VOR store.js eingebunden (wie rundgang.js).
(function () {
  var errs = [], info = [];
  window.addEventListener('error', function (e) { errs.push(e.message + ' @' + (e.filename || '').split('/').pop() + ':' + e.lineno); });
  localStorage.clear();
  var st = JSON.parse(JSON.stringify(window.__REAL.store || window.__REAL));
  st.settings.azureSync.enabled = false;
  localStorage.setItem('finanzplaner_v3', JSON.stringify(st));
  function cent(v) { return Math.round(v * 100); }
  function txtEur(id) { var t = (document.getElementById(id) || {}).textContent || ''; return cent(parseFloat(t.replace(/[^\d,−-]/g, '').replace('−', '-').replace(',', '.'))); }
  function check(name, ok, detail) { info.push(name + (ok ? ' ok' : ' FEHLER')); if (!ok) errs.push(name + (detail ? ': ' + detail : '')); }

  window.addEventListener('load', function () {
    try {
      var S = FP.Store.get(), y = new Date().getFullYear();
      // 1) Ø/Monat: Reports = Kategorie-Detail (eine Nenner-Regel). Kategorie wählen, die NICHT in jedem
      //    Monat vorkommt — nur dort unterscheiden sich die beiden möglichen Nenner.
      var arch = _archObjSet(), sums = {}, act = {}, catAct = {};
      S.transactions.forEach(function (t) {
        if (t.date.split('.')[1] !== String(y) || (t.objectId && arch[t.objectId])) return;
        act[t.date] = 1; sums[t.categoryId] = (sums[t.categoryId] || 0) + t.amount;
        (catAct[t.categoryId] = catAct[t.categoryId] || {})[t.date] = 1;
      });
      var nAct = Object.keys(act).length;
      var top = Object.keys(sums).filter(function (id) { return sums[id] > 0 && Object.keys(catAct[id]).length < nAct && !FP.Store.Categories.getAll().some(function (c) { return c.parentId === id; }); })
        .sort(function (a, b) { return sums[b] - sums[a]; })[0];
      var soll = cent(sums[top] / Object.keys(act).length);
      nav('reports'); _rp2.period = 'year'; _rp2.offset = 0; _rp2.cats = [top]; rp2Render();
      check('Reports Ø/Monat = Summe / Monate mit Buchung', txtEur('rp2-kpi-avg') === soll, txtEur('rp2-kpi-avg') + ' statt ' + soll + ' (' + top + ')');
      nav('auswertung'); avS.mode = 'jahr'; avS.year = y; avS.detail = { id: top, objId: null }; avRender();
      var det = (document.getElementById('av-cd') || {}).textContent || '';
      check('Kategorie-Detail zeigt denselben Ø', det.indexOf(eur(soll / 100)) >= 0, det);
      avS.detail = null;

      // 2) Einnahmen: mit Partner zählt Home/Budget/Cashflow beide Gehälter
      var m = FP.currentMonthStr(), mm = parseInt(m.split('.')[0], 10);
      S.settings.partnerEnabled = true;
      S.salary.person_2 = S.salary.person_2 || {};
      S.salary.person_2[m] = { grossSalary: 2000, netSalary: 1234.56, grossBonus: 0, netBonus: 0, note: '' };
      var p1 = (S.salary.person_1 && S.salary.person_1[m] && S.salary.person_1[m].netSalary) || 0;
      var home = FP.Calculator.getMonthSummary(mm, y).netSalary;
      check('Home/Budget-Einnahmen = beide Gehälter', cent(home) === cent(p1 + 1234.56), home + ' statt ' + (p1 + 1234.56));
      cfY = y; var cf = cfGetData()[mm - 1];
      var cfInc = cf && (cf.inc != null ? cf.inc : cf.income);
      check('Cashflow-Einnahmen = Home', cent(cfInc) === cent(home), cfInc + ' / ' + home);

      // 3) Budget auf Oberkategorie zählt Unterkategorien mit
      var parent = FP.Store.Categories.getAll().filter(function (c) { return !c.parentId && FP.Store.Categories.getAll().some(function (k) { return k.parentId === c.id; }); })
        .map(function (c) {
          var ids = FP.Store.Categories.getAll().filter(function (k) { return k.id === c.id || k.parentId === c.id; }).map(function (k) { return k.id; });
          var s = S.transactions.filter(function (t) { return t.date === m && ids.indexOf(t.categoryId) >= 0 && !(t.objectId && arch[t.objectId]); }).reduce(function (a, t) { return a + t.amount; }, 0);
          var direct = S.transactions.filter(function (t) { return t.date === m && t.categoryId === c.id; }).length;
          return { id: c.id, sum: s, direct: direct };
        }).filter(function (x) { return x.sum > 0; })[0];
      if (!parent) errs.push('Testdaten: keine Oberkategorie mit Ausgaben im laufenden Monat');
      else {
        S.categoryBudgets = {}; S.categoryBudgets[parent.id] = 1;
        nav('budget'); bgtState.month = mm; bgtState.year = y; bgtRender();
        var sum = (document.getElementById('bgt-summary') || {}).textContent || '';
        check('Budget Oberkategorie = Gruppensumme', sum.indexOf(eur(parent.sum)) >= 0, sum + ' / erwartet ' + eur(parent.sum));
        S.categoryBudgets = {};
      }

      // 4) Reports-Liste: Ausgabe mit „−“, Erstattung mit „+“ in Grün
      nav('reports'); _rp2.period = 'all'; rp2SelectAll(); rp2Render();
      var items = [].slice.call(document.querySelectorAll('#rp2-tx-list .rp2-tx-amt, .rp2-tx-amt'));
      var exp = items.filter(function (e) { return e.textContent.trim().charAt(0) === '−'; }).length;
      var nExp = rp2Filter().filter(function (t) { return t.amount > 0; }).length;
      var ref = items.filter(function (e) { return e.textContent.trim().charAt(0) === '+'; });
      var nRef = rp2Filter().filter(function (t) { return t.amount < 0; }).length;
      check('Reports: Ausgaben mit Minus', exp > 0 && exp === nExp, exp + ' statt ' + nExp);
      check('Reports: Erstattungen mit Plus und grün', ref.length === nRef && ref.every(function (e) { return e.classList.contains('rp2-pos'); }), ref.length + ' / ' + nRef);
      // 5) Ins Folgejahr kopieren: nur Vorlagen, die im Dezember enden; Person bleibt erhalten
      var Y = y - 2;
      FP.Store.Recurring.add({ name: 'Testvertrag gekuendigt', amount: 10, type: 'fixed', categoryId: 'cat_sonstiges', personId: 'person_1', validFrom: '01.' + Y, validUntil: '05.' + Y });
      FP.Store.Recurring.add({ name: 'Testvertrag Jahresende', amount: 11, type: 'fixed', categoryId: 'cat_sonstiges', personId: 'person_2', validFrom: '01.' + Y, validUntil: '12.' + Y });
      nav('fixkosten'); _fkNavYear = Y; fkCopyToNextYear();
      var nx = FP.Store.Recurring.getAll().filter(function (r) { return r.validFrom === '01.' + (Y + 1); });
      check('Folgejahr: gekuendigter Vertrag wird nicht wiederbelebt', !nx.some(function (r) { return r.name === 'Testvertrag gekuendigt'; }));
      var jj = nx.filter(function (r) { return r.name === 'Testvertrag Jahresende'; })[0];
      check('Folgejahr: Vorlage mit Jahresende kopiert, Person erhalten', !!jj && jj.personId === 'person_2', jj ? jj.personId : 'nicht kopiert');

      // 6) Archivieren fragt nach; Abbrechen tut nichts, dritte Wahl archiviert ohne Beenden
      var ob = FP.Store.Objects.getAll().filter(function (o) { return o.status !== 'archiviert' && FP.Store.Objects.openRecurring && FP.Store.Objects.openRecurring(o.id).length; })[0];
      if (!ob) check('Archivieren: Objekt mit offener Vorlage in den Daten', false);
      else {
        nav('objekte'); obArchive(ob.id);
        var asked = document.getElementById('m-confirm').classList.contains('open');
        document.getElementById('mconf-cancel').click();
        check('Archivieren fragt, Abbrechen laesst das Objekt aktiv', asked && FP.Store.Objects.getById(ob.id).status !== 'archiviert');
        obArchive(ob.id); var keep = document.getElementById('mconf-keep'); if (keep) keep.click();
        check('Dritte Wahl: archiviert, Vorlagen laufen weiter', !!keep && FP.Store.Objects.getById(ob.id).status === 'archiviert' && FP.Store.Objects.openRecurring(ob.id).length > 0);
      }

      // 7) Excel-Import alter Ausgaben ist entfernt
      check('Excel-Import entfernt', typeof window.stImportAusgaben === 'undefined' && !document.querySelector('[onchange*="stImportAusgaben"]'));
    } catch (e) { errs.push('Abbruch: ' + e.message); }
    var pre = document.createElement('pre'); pre.id = 'out';
    pre.textContent = JSON.stringify({ pass: errs.length === 0, info: info.join(', '), errors: errs });
    document.body.appendChild(pre);
  });
})();
