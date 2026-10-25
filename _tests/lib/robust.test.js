// Robustheit (Paket 5, Schritt 1): Papierkorb für Anlagen/Freistellungsaufträge, Rentenrechnung mit
// fehlenden Eingaben, Service Worker mit Zeitlimit. Aufruf wie vorlagen.test.js.
'use strict';
const fs = require('fs'), vm = require('vm'), path = require('path');
const [storePath, dataPath] = process.argv.slice(2);
const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const src = fs.readFileSync(storePath, 'utf8');

function fresh(mutate) {
  const mem = {};
  const localStorage = { getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: k => { delete mem[k]; } };
  const ctx = { window: { dispatchEvent() {}, addEventListener() {} }, localStorage, console: { log() {}, warn() {}, error() {} }, CustomEvent: function () {} };
  vm.createContext(ctx);
  const st = JSON.parse(JSON.stringify(raw.store || raw));
  if (st.settings && st.settings.azureSync) st.settings.azureSync.enabled = false;
  if (mutate) mutate(st);
  mem['finanzplaner_v3'] = JSON.stringify(st);
  vm.runInContext(src, ctx);
  const FP = ctx.window.FP;
  FP.Store.load();
  return FP;
}
const results = [];
function check(name, cond, info) { results.push((cond ? 'OK   ' : 'FAIL ') + name + (info !== undefined ? '  [' + info + ']' : '')); }

// ── Papierkorb: Anlage mit allen Wertständen, Freistellungsauftrag ──
let FP = fresh();
const a = FP.Store.Assets.getAll()[0];
const nSnap = (a.snapshots || []).length, nAssets = FP.Store.Assets.getAll().length;
FP.Store.Assets.delete(a.id);
const tA = FP.Trash.getAll().find(e => e.item && e.item.id === a.id);
check('Anlage löschen legt sie in den Papierkorb', !!tA && tA.type === 'asset', tA && tA.type);
if (tA) {
  FP.Trash.restore(tA.id);
  const back = FP.Store.Assets.getById(a.id);
  check('Anlage wiederherstellen: mit allen Wertständen zurück', back && (back.snapshots || []).length === nSnap, back && back.snapshots.length + '/' + nSnap);
  check('Anlage wiederherstellen: keine Doppel', FP.Store.Assets.getAll().length === nAssets);
}
const fsaAll = FP.Store.get().freistellungsauftraege || [];
if (fsaAll.length) {
  const f = fsaAll[0];
  FP.Store.Freistellung.delete(f.id);
  const tF = FP.Trash.getAll().find(e => e.item && e.item.id === f.id);
  check('Freistellungsauftrag löschen legt ihn in den Papierkorb', !!tF && tF.type === 'fsa', tF && tF.type);
  if (tF) {
    FP.Trash.restore(tF.id);
    check('Freistellungsauftrag wiederherstellen', (FP.Store.get().freistellungsauftraege || []).some(x => x.id === f.id));
  }
} else check('Testdaten haben Freistellungsaufträge', false);
// Wiederherstellen, obwohl die id schon wieder da ist (z. B. über Sync) → kein Doppel
FP = fresh();
const o = FP.Store.Objects.getAll()[0];
FP.Store.get().trash.push({ id: 'tr_dup', type: 'object', item: JSON.parse(JSON.stringify(o)), deletedAt: new Date().toISOString() });
const nObj = FP.Store.Objects.getAll().length;
FP.Trash.restore('tr_dup');
check('Wiederherstellen erzeugt kein Doppel, wenn die id existiert', FP.Store.Objects.getAll().length === nObj, FP.Store.Objects.getAll().length + '/' + nObj);

// ── Rentenrechnung: fehlende Eingaben werden gemeldet, nicht still zu 0 ──
FP = fresh();
const base = FP.Calculator.calcRente('person_1');
check('Echte Daten: Rente ohne Hinweise', base && Array.isArray(base.warnings) && base.warnings.length === 0, base && JSON.stringify(base.warnings));
FP = fresh(st => { delete st.retirement.profiles.person_1.gesetzlicheRente.zugangsfaktorOverride; });
const noZf = FP.Calculator.calcRente('person_1');
check('Fehlendes zugangsfaktorOverride gilt nicht als Override (gRV wie vorher)',
  noZf.gesetzlicheMonatsrenteBrutto === base.gesetzlicheMonatsrenteBrutto && base.gesetzlicheMonatsrenteBrutto > 0,
  noZf.gesetzlicheMonatsrenteBrutto + ' / ' + base.gesetzlicheMonatsrenteBrutto);
FP = fresh(st => { st.persons[0].birthDate = '01/01/1976'; st.retirement.profiles.person_1.gesetzlicheRente.currentEntgeltpunkte = 'x'; });
const bad = FP.Calculator.calcRente('person_1');
check('Falsches Geburtsdatum + Entgeltpunkte keine Zahl → zwei Hinweise', bad.warnings && bad.warnings.length >= 2, JSON.stringify(bad.warnings));
check('Rürup und Rente: eine Geburtsdatum-Regel', FP.Calculator.birthInfo && FP.Calculator.birthInfo({ birthDate: '' }).year === 1988);

// ── Objekt archivieren: Vorlagen auf Wunsch zum laufenden Monat beenden (ein _save, Buchungen abgeglichen) ──
FP = fresh();
const withRec = FP.Store.Objects.getAll().find(x => FP.Store.get().recurring.some(r => r.objectId === x.id && !r.validUntil));
if (!withRec) check('Testdaten: Objekt mit offener Vorlage', false);
else {
  const cur = FP.currentMonthStr(), num = m => { const p = m.split('.'); return +p[1] * 100 + +p[0]; };
  const open = FP.Store.Objects.openRecurring ? FP.Store.Objects.openRecurring(withRec.id) : [];
  check('openRecurring findet die offenen Vorlagen', open.length > 0, open.length);
  FP.Store.Objects.archive(withRec.id, true);
  const still = FP.Store.get().recurring.filter(r => r.objectId === withRec.id && (!r.validUntil || num(r.validUntil) > num(cur)));
  const later = FP.Store.get().transactions.filter(t => t.objectId === withRec.id && t.source === 'recurring' && num(t.date) > num(cur));
  check('Archivieren + beenden: keine Vorlage bucht über ' + cur + ' hinaus', still.length === 0 && later.length === 0, still.length + ' Vorlagen, ' + later.length + ' Buchungen');
  check('Archivieren + beenden: Objekt archiviert', FP.Store.Objects.getById(withRec.id).status === 'archiviert');
}
FP = fresh();
const withRec2 = FP.Store.Objects.getAll().find(x => FP.Store.get().recurring.some(r => r.objectId === x.id && !r.validUntil));
if (withRec2) {
  const n0 = FP.Store.get().recurring.filter(r => r.objectId === withRec2.id && !r.validUntil).length;
  FP.Store.Objects.archive(withRec2.id, false);
  check('Archivieren ohne Beenden: Vorlagen laufen weiter', FP.Store.get().recurring.filter(r => r.objectId === withRec2.id && !r.validUntil).length === n0);
}

// ── Home-Sparkline: Farbe aus dem Token statt fest #4F46E5 (folgt Hell/Dunkel) ──
const appSrc = fs.readFileSync(path.join(__dirname, '..', '..', 'app.js'), 'utf8');
const spark = (appSrc.match(/function hmDrawSparkline[\s\S]*?\n}\r?\n/) || [''])[0];
check('Home-Sparkline ohne feste Farbe', spark && !/#4F46E5|79,70,229/i.test(spark) && /--blue/.test(spark));
check('Ein Hell/Dunkel-Listener zeichnet alle Diagramme', /prefers-color-scheme: dark[\s\S]{0,200}_redrawActiveCharts/.test(appSrc));

// ── ⏹ Beenden: spätere Buchungen weg (auch rückwirkend), frühere bleiben, Vorlage bleibt für die Historie ──
FP = fresh();
{
  const num = m => { const p = m.split('.'); return +p[1] * 12 + +p[0]; };
  const cur = FP.currentMonthStr(), cN = num(cur);
  const S = FP.Store.get();
  const txOf = id => S.transactions.filter(t => t.source === 'recurring' && t.recurringId === id);
  // offene Vorlage mit Buchungen in den letzten 3 Monaten
  const rec = S.recurring.find(r => !r.validUntil && r.type !== 'savings' && txOf(r.id).filter(t => num(t.date) > cN - 3).length >= 3);
  if (!rec || !FP.Store.Recurring.end) check('Beenden: Funktion und passende Vorlage', false, !!rec);
  else {
    const y = Math.floor((cN - 3) / 12), mo = (cN - 3) - y * 12 || 12, yy = mo === 12 && (cN - 3) % 12 === 0 ? y - 1 : y;
    const last = String(mo).padStart(2, '0') + '.' + yy;
    const before = txOf(rec.id).filter(t => num(t.date) <= num(last)).length, all = txOf(rec.id).length;
    FP.Store.Recurring.end(rec.id, last);
    const after = txOf(rec.id);
    check('Beenden: keine Buchung nach ' + last + ' (rückwirkend)', after.every(t => num(t.date) <= num(last)), after.length + ' statt ' + before);
    check('Beenden: frühere Buchungen bleiben', after.length === before && before > 0, before);
    const kept = FP.Store.Recurring.getAll().find(r => r.id === rec.id);
    check('Beenden: Vorlage bleibt mit Ende', !!kept && kept.validUntil === last);
    check('Beenden: gilt als beendet im Jahr ' + yy, FP.Store.Recurring.endedInYear(kept, yy));
    FP.Store.Recurring.resume(rec.id);
    check('Fortsetzen: Buchungen bis heute wieder da', txOf(rec.id).length === all, txOf(rec.id).length + '/' + all);
    let bad;
    try { FP.Store.Recurring.end(rec.id, '01.1990'); } catch (e) { bad = e.message; }
    check('Beenden vor dem Start wird abgelehnt', !!bad, bad);
  }
  // ↕ Betragsänderung ist kein Vertragsende
  const rec2 = FP.Store.get().recurring.find(r => !r.validUntil && r.type !== 'savings' && num(r.validFrom) < cN - 2);
  if (rec2) {
    const m2 = String(((cN - 1) - 1) % 12 + 1).padStart(2, '0') + '.' + Math.floor((cN - 2) / 12);
    FP.Store.Recurring.split(rec2.id, m2, rec2.amount + 1);
    const old = FP.Store.Recurring.getAll().find(r => r.id === rec2.id);
    check('Betragsänderung (↕) zählt nicht als beendet', old.validUntil && !FP.Store.Recurring.endedInYear(old, Math.floor((num(old.validUntil) - 1) / 12)), old.validUntil);
  }
}

// ── Service Worker: bei hängendem Netz nach Zeitlimit aus dem Cache ──
const swSrc = fs.readFileSync(path.join(__dirname, '..', '..', 'sw.js'), 'utf8');
const handlers = {};
const cached = { tag: 'aus-cache' };
const swCtx = {
  self: { addEventListener: (t, f) => { handlers[t] = f; }, skipWaiting() {}, clients: { claim() {} }, location: { host: 'e-labs-x.github.io' } },
  caches: { match: () => Promise.resolve(cached), open: () => Promise.resolve({ put() {}, addAll() { return Promise.resolve(); } }), keys: () => Promise.resolve([]) },
  fetch: () => new Promise(() => {}),   // Funkloch: Antwort kommt nie
  URL, setTimeout, Promise, console
};
vm.createContext(swCtx);
vm.runInContext(swSrc, swCtx);
let responded = null;
handlers.fetch({ request: { method: 'GET', url: 'https://e-labs-x.github.io/finanzplaner/app.js?v=1', mode: 'no-cors' }, respondWith: p => { responded = p; } });
const limit = new Promise(r => setTimeout(() => r({ tag: 'haengt' }), 6000));
Promise.race([responded || Promise.resolve({ tag: 'keine Antwort' }), limit]).then(r => {
  check('Service Worker: hängendes Netz → nach Zeitlimit gespeicherte Fassung', r && r.tag === 'aus-cache', r && r.tag);
  console.log(results.join('\n'));
  const failed = results.filter(x => x.startsWith('FAIL')).length;
  console.log('SUMMARY ' + (results.length - failed) + '/' + results.length);
  process.exit(failed ? 1 : 0);
});
