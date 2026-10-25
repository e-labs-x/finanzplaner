// Layout: Rente-Tab in iPhone- (390 px) und iPad-hochkant-Breite (820 px) — nichts darf sichtbar über den
// rechten Rand ragen (Elemente in einem wischbaren Bereich zählen nicht). Headless Chrome kann nicht schmaler
// als ~500 px rendern, deshalb iframes. Äußere Seite; die innere ist layout-app.html.
(function () {
  var sizes = [{ id: 'iphone', w: 390 }, { id: 'ipad', w: 820 }];
  document.body.style.margin = '0';
  sizes.forEach(function (s) {
    var f = document.createElement('iframe');
    f.id = s.id; f.src = 'layout-app.html';
    f.style.cssText = 'width:' + s.w + 'px;height:844px;border:0';
    document.body.appendChild(f);
  });
  // Warten, bis beide Rahmen den Rente-Tab zeigen (bei vielen parallelen Prüfungen dauert das), max. 20 s
  var t0 = Date.now();
  (function wait() {
    var ready = sizes.every(function (s) {
      try { var p = document.getElementById(s.id).contentDocument.getElementById('p-rente'); return p && p.classList.contains('active') && p.querySelector('#rp-kpi-grid').children.length; } catch (e) { return false; }
    });
    if (!ready && Date.now() - t0 < 20000) return setTimeout(wait, 300);
    setTimeout(measure, 800);
  })();
  function measure() {
    var errs = [], info = [];
    sizes.forEach(function (s) {
      try {
        var d = document.getElementById(s.id).contentDocument, vw = d.documentElement.clientWidth;
        var page = d.getElementById('p-rente');
        if (!page || !page.classList.contains('active')) { errs.push(s.id + ': Rente-Tab nicht geöffnet'); return; }
        var clipped = function (e) {
          for (var p = e.parentElement; p && p !== page; p = p.parentElement) {
            if (getComputedStyle(p).overflowX !== 'visible' && p.getBoundingClientRect().right <= vw + 1) return true;
          }
          return false;
        };
        var over = [].filter.call(page.querySelectorAll('*'), function (e) {
          var b = e.getBoundingClientRect();
          return b.width > 0 && b.right > vw + 1 && !clipped(e);
        });
        var where = {};
        over.forEach(function (e) { var k = e.tagName + '.' + String(e.className).split(' ')[0]; where[k] = (where[k] || 0) + 1; });
        info.push(s.id + ' ' + s.w + ' px: ' + over.length + ' ueber dem Rand');
        if (over.length) errs.push(s.id + ': ' + over.length + ' Elemente ragen ueber den Rand ' + JSON.stringify(where).slice(0, 200));
        var main = d.querySelector('#p-rente .rp-main');
        if (main && main.getBoundingClientRect().width < 200) errs.push(s.id + ': Ergebnisbereich zu schmal');
      } catch (e) { errs.push(s.id + ': ' + e.message); }
    });
    // Einklapp-Knopf (iPhone): Personen-Umschalter bleibt, Einstellungen gehen weg und kommen wieder
    try {
      var d = document.getElementById('iphone').contentDocument;
      var vis = function (sel) { var e = d.querySelector(sel); return !!e && e.getBoundingClientRect().height > 0; };
      var fab = d.querySelector('#p-rente .rp-fab');
      fab.click();
      var zu = { person: vis('#rp-person-bar'), einst: vis('#p-rente .rp-sidebar .rp-sec') };
      fab.click();
      var auf = { person: vis('#rp-person-bar'), einst: vis('#p-rente .rp-sidebar .rp-sec') };
      info.push('Knopf zu: Person ' + zu.person + '/Einst. ' + zu.einst + ', auf: ' + auf.person + '/' + auf.einst);
      if (!zu.person || zu.einst || !auf.person || !auf.einst) errs.push('iphone: Einklapp-Knopf ' + JSON.stringify({ zu: zu, auf: auf }));
    } catch (e) { errs.push('Einklapp-Knopf: ' + e.message); }
    var pre = document.createElement('pre'); pre.id = 'out';
    pre.textContent = JSON.stringify({ pass: errs.length === 0, info: info.join(', '), errors: errs });
    document.body.appendChild(pre);
  }
})();
