// Navigation (Schritt 3, 22.11.2026): neue Navigation hinter dem Schalter „Neue Navigation testen“ (localStorage fp_newnav).
// navigation.html?nn=0 → alte Navigation muss unverändert sein (keine neuen Elemente, alle Tabs wie bisher).
// navigation.html?nn=1 → jeder Bereich und jeder Reiter öffnet die richtige Seite mit Inhalt, genau ein Bereich markiert,
// alle bisherigen Ansichten (außer Budget/Mehr) erreichbar, Import und Freistellungsaufträge umgezogen.
// Wird VOR store.js eingebunden (echte Daten, Sync aus).
(function () {
  var errs = [], info = [];
  window.addEventListener('error', function (e) { errs.push(e.message + ' @' + (e.filename || '').split('/').pop() + ':' + e.lineno); });
  var NN = /[?&]nn=1/.test(location.search);
  localStorage.clear();
  var st = JSON.parse(JSON.stringify(window.__REAL.store || window.__REAL));
  st.settings.azureSync.enabled = false;
  localStorage.setItem('finanzplaner_v3', JSON.stringify(st));
  if (NN) localStorage.setItem('fp_newnav', '1');

  function $(s) { return document.querySelector(s); }
  function $$(s) { return [].slice.call(document.querySelectorAll(s)); }
  function activePage() { var p = $('.page.active'); return p ? p.id.slice(2) : ''; }
  function vis(el) {
    if (!el || !el.getClientRects().length || !el.offsetHeight) return false;
    for (var e = el; e && e.nodeType === 1; e = e.parentElement) { if (getComputedStyle(e).visibility === 'hidden' || e.getBoundingClientRect().width === 0) return false; }
    return true;
  }
  // Alle markierten Bereichs-Knöpfe (Leiste unten, Seitenleiste, Zahnrad) — sichtbar oder nicht — müssen denselben Bereich meinen
  function marked() { var o = {}; $$('[data-a].active').forEach(function (b) { o[b.getAttribute('data-a')] = 1; }); return Object.keys(o); }
  function steps(list, done) {
    var i = 0;
    (function next() { if (i >= list.length) return done(); try { list[i++](); } catch (e) { errs.push('Schritt ' + i + ': ' + e.message); } setTimeout(next, 350); })();
  }

  window.addEventListener('load', function () {
    var s = [];
    if (!NN) {
      // ── Alte Navigation: nichts Neues sichtbar, alles wie bisher ──
      s.push(function () {
        if (document.body.classList.contains('nn')) errs.push('alt: body.nn gesetzt');
        ['.bn-items-nn', '.sb-grp-nn', '.nn-gear', '[data-a]'].forEach(function (q) { if ($(q)) errs.push('alt: ' + q + ' vorhanden'); });
        if (vis($('#nn-sub'))) errs.push('alt: Reiterleiste sichtbar');
        var bn = $$('#bot-nav .bn-item').map(function (b) { return b.getAttribute('data-p'); }).join(',');
        if (bn !== 'home,eingabe,auswertung,vermoegen,rente,mehr') errs.push('alt: Leiste unten = ' + bn);
        if (!$('#p-eingabe .imp-start') || !$('#p-eingabe #imp-hist')) errs.push('alt: Import nicht mehr in der Eingabe');
        if (!$('#p-vermoegen #vm-fsa')) errs.push('alt: Freistellungsaufträge nicht mehr im Vermögen');
      });
      'home eingabe auswertung cashflow reports budget objekte gehalt fixkosten vermoegen rente mehr'.split(' ').forEach(function (id) {
        s.push(function () { nav(id); });
        s.push(function () {
          if (activePage() !== id) errs.push('alt: nav(' + id + ') zeigt ' + activePage());
          var lbl = $('#mob-lbl').textContent;
          if (lbl !== LABELS[id]) errs.push('alt: Titel bei ' + id + ' = ' + lbl);
        });
      });
      s.push(function () { nav('einstellungen'); });
      s.push(function () {
        var m = $('#st-menu').textContent;
        if (m.indexOf('Budget-Aufteilung') < 0) errs.push('alt: Budget-Aufteilung fehlt im Einstellungsmenü');
        if (m.indexOf('bisherige Navigation') < 0) errs.push('alt: Menüpunkt Navigation zeigt nicht „bisherige Navigation“');
        if ($('#st-nn').checked) errs.push('alt: Schalter steht auf an');
        info.push('alte Navigation: 12 Tabs');
      });
    } else {
      // ── Neue Navigation ──
      var seen = {};
      s.push(function () {
        if (!document.body.classList.contains('nn')) errs.push('neu: body.nn fehlt');
        var bn = $$('#bot-nav .bn-item').filter(vis).map(function (b) { return b.textContent.trim(); }).join(',');
        var sb = $$('#sidebar .sb-item').filter(vis).map(function (b) { return b.getAttribute('data-tip'); }).join(',');
        // Unten (iPhone) bzw. Seitenleiste (PC): je nach Fensterbreite ist eines davon sichtbar
        var want = 'Start,Buchungen,Auswertung,Vermögen,Planung';
        if (bn && bn !== want) errs.push('neu: Leiste unten = ' + bn);
        if (!bn && sb.indexOf(want) !== 0) errs.push('neu: Seitenleiste = ' + sb);
        if (!$('#p-import .imp-start') || !$('#p-import #imp-hist') || !$('#p-import #imp-file')) errs.push('neu: Import nicht im Reiter Import');
        if ($('#p-eingabe .imp-start')) errs.push('neu: Import-Knopf noch in der Eingabe');
        if (!$('#p-eingabe #e-list')) errs.push('neu: Letzte Einträge fehlen in der Eingabe');
        if (!$('#p-steuern #vm-fsa') || $('#p-vermoegen #vm-fsa')) errs.push('neu: Freistellungsaufträge nicht unter Steuern');
        // 27.11.2026: Liste (Reports) gehört zur Auswertung, nicht zu Buchungen
        var la = nnAreaOf('reports');
        if (!la || la.k !== 'auswertung') errs.push('neu: Liste liegt unter ' + (la && la.t) + ' statt Auswertung');
        // 27.11.2026: Kopf- und Fußleiste deckend ohne Milchglas (iPhone zeigte sie unscharf), Leiste unten mit Seitenabstand
        ['#mob-hdr', '#bot-nav'].forEach(function (q) {
          var cs = getComputedStyle($(q)), bf = cs.backdropFilter || cs.webkitBackdropFilter || 'none';
          if (bf !== 'none') errs.push(q + ': Milchglas (' + bf + ')');
          var a = (cs.backgroundColor.match(/[\d.]+/g) || []).map(Number);
          if (a.length === 4 && a[3] < 1) errs.push(q + ': Hintergrund durchsichtig (' + cs.backgroundColor + ')');
        });
        // 27.11.2026: iOS 26 zeichnet in der Home-Bildschirm-App den oberen Rand weich — fester deckender Streifen ganz oben,
        // App rückt darunter (nichts verdeckt). Nur mit html.standalone.
        var root = document.documentElement, hadSa = root.classList.contains('standalone');
        root.classList.add('standalone');
        var sb = getComputedStyle(document.body, '::before'), sbg = (sb.backgroundColor.match(/[\d.]+/g) || []).map(Number);
        var sh = parseFloat(sb.height), appTop = $('#app').getBoundingClientRect().top;
        if (sb.content === 'none' || sb.position !== 'fixed' || parseFloat(sb.top) !== 0 || !(sh >= 10)) errs.push('standalone: kein fester Streifen oben (' + sb.position + ', ' + sb.height + ')');
        if (sbg.length === 4 && sbg[3] < 1) errs.push('standalone: Streifen durchsichtig');
        if (appTop < sh) errs.push('standalone: Streifen verdeckt die App (App beginnt bei ' + appTop + ' px)');
        if (!hadSa) root.classList.remove('standalone');
        if (getComputedStyle(document.body, '::before').content !== 'none' && !hadSa) errs.push('Streifen auch ohne standalone (Browser/PC)');
        var bi = getComputedStyle($('.bn-items-nn'));
        if (parseFloat(bi.paddingLeft) < 12 || parseFloat(bi.paddingRight) < 12) errs.push('Leiste unten ohne Seitenabstand (' + bi.paddingLeft + ')');
      });
      NN_AREAS.forEach(function (a) {
        s.push(function () { nnArea(a.k); });
        a.subs.forEach(function (sub) {
          s.push(function () {
            // Reiter wie ein Nutzer antippen (bei Bereichen mit nur einer Seite gibt es keine Reiter)
            var tab = $$('#nn-sub .nn-tab').filter(function (b) { return b.textContent === sub[1]; })[0];
            if (a.subs.length > 1) { if (!tab) errs.push('neu: Reiter ' + sub[1] + ' fehlt in ' + a.t); else tab.click(); }
          });
          s.push(function () {
            var id = sub[0];
            if (activePage() !== id) { errs.push('neu: ' + a.t + ' › ' + sub[1] + ' zeigt ' + activePage()); return; }
            seen[id] = 1;
            var pg = document.getElementById('p-' + id);
            if ((pg.textContent || '').replace(/\s+/g, '').length < 20) errs.push('neu: ' + id + ' ist leer');
            var on = marked();
            if (on.length !== 1 || on[0] !== a.k) errs.push('neu: bei ' + id + ' markiert: ' + on.join('+'));
            var tabs = $$('#nn-sub .nn-tab');
            if (a.subs.length > 1) {
              if (!vis($('#nn-sub'))) errs.push('neu: Reiterleiste fehlt bei ' + id);
              var onTab = tabs.filter(function (b) { return b.classList.contains('on'); }).map(function (b) { return b.textContent; });
              if (onTab.join() !== sub[1]) errs.push('neu: aktiver Reiter bei ' + id + ' = ' + onTab.join('+'));
            } else if (vis($('#nn-sub'))) errs.push('neu: Reiterleiste bei ' + id + ' sichtbar');
            if ($('#mob-lbl').textContent !== a.t) errs.push('neu: Titel bei ' + id + ' = ' + $('#mob-lbl').textContent);
          });
        });
      });
      // Bereich merkt sich den zuletzt gewählten Reiter
      s.push(function () { nav('cashflow'); nnArea('start'); });
      s.push(function () { nnArea('auswertung'); });
      s.push(function () { if (activePage() !== 'cashflow') errs.push('neu: Auswertung merkt Reiter nicht (zeigt ' + activePage() + ')'); });
      // Zahnrad
      s.push(function () { var g = $$('[data-a="settings"]').filter(vis)[0]; if (!g) errs.push('neu: Zahnrad nicht sichtbar'); else g.click(); });
      s.push(function () {
        if (activePage() !== 'einstellungen') errs.push('neu: Zahnrad öffnet ' + activePage());
        seen.einstellungen = 1;
        var on = marked();
        if (on.join() !== 'settings') errs.push('neu: in Einstellungen markiert: ' + on.join('+'));
        if (vis($('#nn-sub'))) errs.push('neu: Reiterleiste in Einstellungen sichtbar');
        var m = $('#st-menu').textContent;
        if (m.indexOf('Budget-Aufteilung') >= 0) errs.push('neu: Budget-Aufteilung noch im Menü');
        if (m.indexOf('neue Navigation') < 0) errs.push('neu: Menüpunkt Navigation zeigt nicht „neue Navigation“');
        if (!$('#st-nn').checked) errs.push('neu: Schalter steht auf aus');
      });
      // Sync-Punkt am Zahnrad
      s.push(function () {
        setSyncStatus('pending', 'x');
        var b = document.getElementById('nn-sync-badge');
        if (!b || !b.classList.contains('show')) errs.push('neu: Sync-Punkt am Zahnrad fehlt');
        setSyncStatus('off', '');
      });
      s.push(function () {
        var need = 'home eingabe reports import fixkosten auswertung objekte cashflow vermoegen gehalt rente steuern einstellungen'.split(' ');
        var miss = need.filter(function (id) { return !seen[id]; });
        if (miss.length) errs.push('neu: nicht erreichbar: ' + miss.join(','));
        info.push('neue Navigation: ' + Object.keys(seen).length + ' Ansichten über 5 Bereiche + Zahnrad');
      });
    }
    steps(s, function () {
      var pre = document.createElement('pre'); pre.id = 'out';
      pre.textContent = JSON.stringify({ pass: errs.length === 0, info: info.join('; '), errors: errs });
      document.body.appendChild(pre);
    });
  });
})();
