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
