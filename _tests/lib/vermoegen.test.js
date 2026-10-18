// Vermögen: Historie-Tabelle und Monatsstände gegen echte Daten prüfen.
// Aufruf: node vermoegen.test.js <store.js> <daten.fpbackup>  — Ausgabe/Exit-Code wie vorlagen.test.js
'use strict';
const fs = require('fs'), vm = require('vm');
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

let FP = fresh();
const cur = FP.currentMonthStr(), year = parseInt(cur.split('.')[1], 10);
const h = FP.Calculator.getAssetHistory(year);
const total = FP.Calculator.getAssetSummary().total;
const last = h.sums[h.sums.length - 1];
check('Historie: Summe ' + cur + ' = Gesamtvermögen oben', last === total, last + ' / ' + total);
check('Historie: Spalten bis zum laufenden Monat', h.months.length && h.months[h.months.length - 1].key === cur, h.months.map(m => m.key).join(','));
let ok = true;
h.rows.forEach(r => r.cells.forEach((c, i) => {
  if (!c) return;
  const a = FP.Store.Assets.getById(r.id); if (!a) return;
  const own = (a.snapshots || []).find(s => s.date === h.months[i].key);
  if (c.own && (!own || own.value !== c.v)) ok = false;   // eigener Wert = eingetragener Monatsstand
  if (!c.own && own) ok = false;                          // grau nur, wenn wirklich kein Eintrag
}));
check('Historie: eigene Werte = Einträge, grau nur ohne Eintrag', ok);
check('Historie: jede Monatssumme = Summe der Zeilen', h.sums.every((s, i) => {
  const sum = Math.round(h.rows.reduce((t, r) => t + (r.cells[i] ? r.cells[i].v : 0), 0) * 100) / 100;
  return s === null ? sum === 0 : Math.abs(s - sum) < 0.005;
}));
check('Monatsstände chronologisch nach dem Laden', FP.Store.Assets.getAll().every(a =>
  (a.snapshots || []).every((s, i, arr) => i === 0 || FP.monthNum(arr[i - 1].date) < FP.monthNum(s.date))));

// Jahreswechsel: Januar nach Dezember eingetragen → Januar ist aktuell (früher Textsortierung: Dezember)
FP = fresh();
const a = FP.Store.Assets.getAll().find(x => x.status === 'aktiv');
if (a) {
  FP.Store.Assets.addSnapshot(a.id, '12.' + (year + 5), 111);
  FP.Store.Assets.addSnapshot(a.id, '01.' + (year + 6), 222);
  check('Jahreswechsel: Januar gilt als aktueller Stand', FP.Store.Assets.getLatestSnapshot(a.id).value === 222,
    FP.Store.Assets.getLatestSnapshot(a.id).date);
}
// Unsortierte Altdaten werden beim Laden chronologisch
FP = fresh(st => { const x = (st.assets || [])[0]; if (x) x.snapshots = [{ date: '01.2031', value: 2 }, { date: '12.2030', value: 1 }]; });
const x0 = FP.Store.Assets.getAll()[0];
if (x0) check('Laden sortiert unsortierte Monatsstände', x0.snapshots[x0.snapshots.length - 1].date === '01.2031');

console.log(results.join('\n'));
const failed = results.filter(r => r.startsWith('FAIL')).length;
console.log('SUMMARY ' + (results.length - failed) + '/' + results.length);
process.exit(failed ? 1 : 0);
