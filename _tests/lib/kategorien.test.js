// Kategorien: Migration v3→v4 (leere eingebaute Doppel entfernen) gegen echte Daten prüfen.
// Aufruf: node kategorien.test.js <store.js> <daten.fpbackup>  — Ausgabe/Exit-Code wie vorlagen.test.js
'use strict';
const fs = require('fs'), vm = require('vm');
const [storePath, dataPath] = process.argv.slice(2);
const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const rawStore = raw.store || raw;
const src = fs.readFileSync(storePath, 'utf8');

function fresh(mutate) {
  const mem = {};
  const localStorage = { getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: k => { delete mem[k]; } };
  const ctx = { window: { dispatchEvent() {}, addEventListener() {} }, localStorage, console: { log() {}, warn() {}, error() {} }, CustomEvent: function () {} };
  vm.createContext(ctx);
  const st = JSON.parse(JSON.stringify(rawStore));
  if (st.settings && st.settings.azureSync) st.settings.azureSync.enabled = false;
  if (mutate) mutate(st);
  mem['finanzplaner_v3'] = JSON.stringify(st);
  vm.runInContext(src, ctx);
  const FP = ctx.window.FP;
  FP.Store.load();
  FP.__mem = mem;
  return FP;
}
const results = [];
function check(name, cond, info) { results.push((cond ? 'OK   ' : 'FAIL ') + name + (info !== undefined ? '  [' + info + ']' : '')); }
const norm = s => String(s || '').trim().toLowerCase();
const r2 = x => Math.round(x * 100) / 100;

let FP = fresh();
const s = FP.Store.get();
const used = new Set();
s.transactions.forEach(t => used.add(t.categoryId));
s.recurring.forEach(r => used.add(r.categoryId));
const leftover = s.categories.filter(c => c.source === 'system' && !used.has(c.id) &&
  s.categories.some(x => x !== c && x.source !== 'system' && !x.hidden && norm(x.name) === norm(c.name) && (x.parentId || null) === (c.parentId || null)));
check('Keine leere eingebaute Kategorie mehr neben gleichnamiger eigener', leftover.length === 0, leftover.map(c => c.name).join(', '));
// Vergleich nur für den Kategorien-Schritt: Basis = derselbe Bestand, aber Migration 3 (v3→v4) ausgeschaltet
const srcNo3 = src.replace(/\n  3: \(data\) => \{/, '\n  3: (data) => data, _off3: (data) => {');
const ctx0 = { window: { dispatchEvent() {}, addEventListener() {} }, console: { log() {}, warn() {}, error() {} }, CustomEvent: function () {},
  localStorage: (() => { const m = { finanzplaner_v3: JSON.stringify(rawStore) }; return { getItem: k => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, removeItem: k => { delete m[k]; } }; })() };
vm.createContext(ctx0); vm.runInContext(srcNo3, ctx0); ctx0.window.FP.Store.load();
const base = ctx0.window.FP.Store.get();
check('Buchungen unverändert durch den Kategorien-Schritt (Anzahl und Summe)', srcNo3 !== src &&
  s.transactions.length === base.transactions.length &&
  r2(s.transactions.reduce((a, t) => a + t.amount, 0)) === r2(base.transactions.reduce((a, t) => a + t.amount, 0)),
  s.transactions.length + ' / ' + base.transactions.length);
const lost = s.transactions.filter(t => !s.categories.some(c => c.id === t.categoryId)).length;
check('Keine Buchung zeigt auf eine entfernte Kategorie', lost === 0, lost);
const removed = rawStore.categories.filter(c => !s.categories.some(x => x.id === c.id));
check('Entfernte Kategorien liegen im Papierkorb und gelten als gelöscht',
  removed.every(c => (s.trash || []).some(e => e.type === 'category' && e.item.id === c.id) &&
                     (s.settings.deletedSystemCats || []).includes(c.id)),
  removed.map(c => c.name + ' (' + c.id + ')').join(', ') || 'nichts entfernt');

// Zweiter Start: _patchSystemCategories holt nichts zurück
const ids1 = s.categories.map(c => c.id).join(',');
FP.Store.load();
check('Neustart holt entfernte Kategorien nicht zurück', FP.Store.get().categories.map(c => c.id).join(',') === ids1);

// Migration nochmal auf migrierten Daten
const m1 = JSON.parse(JSON.stringify(FP.Store.get()));
m1.meta.version = 3;
FP.__mem['finanzplaner_v3'] = JSON.stringify(m1);
FP.Store.load();
check('Migration zweiter Lauf ändert nichts', FP.Store.get().categories.length === m1.categories.length &&
  (FP.Store.get().trash || []).length === (m1.trash || []).length);

// Benutzte eingebaute Kategorie mit gleichnamiger eigener bleibt (nur LEERE werden entfernt)
FP = fresh(st => {
  const sys = (st.categories || []).find(c => c.source === 'system' && c.parentId);
  if (!sys) return;
  st.categories.push({ id: 'cat_test_dup', name: sys.name, parentId: sys.parentId, source: 'user' });
  st.transactions.push({ id: 'tx_test_dup', date: '01.2026', categoryId: sys.id, amount: 1, source: 'manual' });
  st.meta.version = 3;
});
const kept = FP.Store.get().categories.some(c => c.id === (FP.Store.get().transactions.find(t => t.id === 'tx_test_dup') || {}).categoryId);
check('Benutzte eingebaute Kategorie bleibt trotz Doppel', kept);

console.log(results.join('\n'));
const failed = results.filter(r => r.startsWith('FAIL')).length;
console.log('SUMMARY ' + (results.length - failed) + '/' + results.length);
process.exit(failed ? 1 : 0);
