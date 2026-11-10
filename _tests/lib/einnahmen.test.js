// Weitere Einnahmen (Store v5): Migration, Rechnung, Betrag ab Monat, Papierkorb, Sync-Merge — gegen echte Daten.
// Aufruf: node einnahmen.test.js <store.js> <daten.fpbackup>  — Ausgabe/Exit-Code wie vorlagen.test.js
'use strict';
const fs = require('fs'), vm = require('vm'), path = require('path');
const [storePath, dataPath] = process.argv.slice(2);
const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const rawStore = raw.store || raw;
const src = fs.readFileSync(storePath, 'utf8');

function fresh(mutate, mem) {
  mem = mem || {};
  const localStorage = { getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: k => { delete mem[k]; } };
  const ctx = { window: { dispatchEvent() {}, addEventListener() {} }, localStorage, console: { log() {}, warn() {}, error() {} }, CustomEvent: function () {} };
  vm.createContext(ctx);
  if (!mem.finanzplaner_v3) {
    const st = JSON.parse(JSON.stringify(rawStore));
    if (st.settings && st.settings.azureSync) st.settings.azureSync.enabled = false;
    if (mutate) mutate(st);
    mem.finanzplaner_v3 = JSON.stringify(st);
  }
  vm.runInContext(src, ctx);
  const FP = ctx.window.FP;
  FP.Store.load();
  FP.__mem = mem;
  return FP;
}
const results = [];
function check(name, cond, info) { results.push((cond ? 'OK   ' : 'FAIL ') + name + (info !== undefined ? '  [' + info + ']' : '')); }
function throws(fn) { try { fn(); return false; } catch (e) { return true; } }
const r2 = x => Math.round(x * 100) / 100;

// ── 1. Migration v4 → v5 ──
let FP = fresh();
let S = FP.Store.get();
check('Store ist Version 5+ mit leerer Einnahmen-Liste', S.meta.version >= 5 && Array.isArray(S.incomes), S.meta.version);
check('Buchungen und Gehalt durch die Migration unverändert',
  S.transactions.length === rawStore.transactions.length && JSON.stringify(S.salary) === JSON.stringify(rawStore.salary),
  S.transactions.length + ' Buchungen');

// ── 2. Ohne weitere Einnahmen = bisherige Rechnung (nur Netto-Gehalt) ──
const months = new Set();
Object.keys(S.salary || {}).forEach(p => Object.keys(S.salary[p] || {}).forEach(m => months.add(m)));
const ids = S.settings && S.settings.partnerEnabled ? ['person_1', 'person_2'] : ['person_1'];
let diff = 0;
months.forEach(m => {
  const alt = r2(ids.reduce((s, p) => s + ((((S.salary[p] || {})[m] || {}).netSalary) || 0), 0));
  if (FP.Calculator.householdNetIncome(m) !== alt) diff++;
});
check('Ohne Einnahmen: Haushaltseinkommen = Netto-Gehalt wie bisher (alle Monate)', diff === 0 && months.size > 0, months.size + ' Monate, ' + diff + ' abweichend');

// ── 3. Monatlich und einmalig im richtigen Monat ──
const base = m => FP.Calculator.householdSalary(m);
const kg = FP.Store.Incomes.add({ name: 'Kindergeld', amount: 255, kind: 'monatlich', personId: 'gemeinsam', validFrom: '03.2026' });
const st = FP.Store.Incomes.add({ name: 'Steuererstattung', amount: 1234.56, kind: 'einmalig', personId: 'person_1', validFrom: '05.2026', validUntil: '09.2026' });
check('Monatlich: nicht vor dem Start', FP.Calculator.otherIncome('02.2026') === 0);
check('Monatlich: ab Start und offen bis in Folgejahre', FP.Calculator.otherIncome('03.2026') === 255 && FP.Calculator.otherIncome('12.2030') === 255);
check('Einmalig: nur im einen Monat (Bis-Monat wird ignoriert)', st.validUntil === '05.2026' &&
  FP.Calculator.otherIncome('05.2026') === r2(255 + 1234.56) && FP.Calculator.otherIncome('06.2026') === 255);
check('Haushaltseinkommen = Gehalt + weitere Einnahmen', FP.Calculator.householdNetIncome('05.2026') === r2(base('05.2026') + 255 + 1234.56));
check('Monatsübersicht (Home/Budget) rechnet mit', FP.Calculator.getMonthSummary(5, 2026).netSalary === FP.Calculator.householdNetIncome('05.2026'));
check('Jahressumme je Eintrag', FP.Store.Incomes.sumInYear(kg, 2026) === 2550 && FP.Store.Incomes.sumInYear(st, 2026) === 1234.56 && FP.Store.Incomes.sumInYear(st, 2027) === 0);
check('Liste je Jahr', FP.Store.Incomes.inYear(2025).length === 0 && FP.Store.Incomes.inYear(2026).length === 2 && FP.Store.Incomes.inYear(2027).length === 1);

// ── 4. Person 2 zählt auch bei ausgeschaltetem Partner ──
const partnerWar = !!S.settings.partnerEnabled;
S.settings.partnerEnabled = false;
const p2 = FP.Store.Incomes.add({ name: 'Nebenjob', amount: 100, kind: 'einmalig', personId: 'person_2', validFrom: '07.2026' });
check('Einnahme von Person 2 zählt auch ohne Partner', FP.Calculator.otherIncome('07.2026') === 355);
S.settings.partnerEnabled = partnerWar;
FP.Store.Incomes.delete(p2.id);

// ── 5. Betrag ab Monat ──
const neu = FP.Store.Incomes.changeFrom(kg.id, '01.2027', 259);
check('Betrag ab Monat: alter Eintrag endet im Vormonat', FP.Store.Incomes.getById(kg.id).validUntil === '12.2026');
check('Betrag ab Monat: Monate davor alt, danach neu', FP.Calculator.otherIncome('12.2026') === 255 && FP.Calculator.otherIncome('01.2027') === 259 && neu.validFrom === '01.2027' && neu.personId === 'gemeinsam');
FP.Store.Incomes.changeFrom(neu.id, '01.2027', 260);
check('Betrag ab Startmonat = Korrektur ohne neuen Eintrag', FP.Store.Incomes.getAll().length === 3 && FP.Calculator.otherIncome('01.2027') === 260);
FP.Store.Incomes.end(neu.id, '06.2027');
check('Beenden: nach dem Bis-Monat nichts mehr', FP.Calculator.otherIncome('06.2027') === 260 && FP.Calculator.otherIncome('07.2027') === 0);

// ── 6. Ungültiges wird abgelehnt, nichts gespeichert ──
const n0 = FP.Store.Incomes.getAll().length;
check('Ablehnung: Betrag 0, kein Name, Bis vor Ab, Monat 13, falsche Person, Betrag ab vor Start',
  throws(() => FP.Store.Incomes.add({ name: 'x', amount: 0, validFrom: '01.2026' })) &&
  throws(() => FP.Store.Incomes.add({ name: ' ', amount: 5, validFrom: '01.2026' })) &&
  throws(() => FP.Store.Incomes.add({ name: 'x', amount: 5, validFrom: '05.2026', validUntil: '04.2026' })) &&
  throws(() => FP.Store.Incomes.add({ name: 'x', amount: 5, validFrom: '13.2026' })) &&
  throws(() => FP.Store.Incomes.add({ name: 'x', amount: 5, validFrom: '01.2026', personId: 'person_9' })) &&
  throws(() => FP.Store.Incomes.update(kg.id, { validUntil: '01.2020' })) &&
  throws(() => FP.Store.Incomes.changeFrom(kg.id, '01.2020', 300)) &&
  throws(() => FP.Store.Incomes.changeFrom(st.id, '06.2026', 300)),
  'vorher ' + n0);
check('Nach Ablehnungen unverändert', FP.Store.Incomes.getAll().length === n0 && FP.Store.Incomes.getById(kg.id).validUntil === '12.2026');

// ── 7. Speichern, Neustart, Papierkorb ──
const mem = FP.__mem;
const FP2 = fresh(null, mem);
check('Neustart: Einnahmen bleiben gespeichert', FP2.Store.Incomes.getAll().length === n0 && FP2.Calculator.otherIncome('05.2026') === r2(255 + 1234.56));
FP2.Store.Incomes.delete(st.id);
const tr = FP2.Store.Trash.getAll().find(e => e.type === 'income' && e.item.id === st.id);
check('Löschen legt in den Papierkorb', !!tr && !FP2.Store.Incomes.getById(st.id) && FP2.Calculator.otherIncome('05.2026') === 255);
FP2.Store.Trash.restore(tr.id);
check('Wiederherstellen holt sie zurück', !!FP2.Store.Incomes.getById(st.id) && FP2.Calculator.otherIncome('05.2026') === r2(255 + 1234.56));

// ── 8. Backup zu neu für alte App: Version 5 im Backup ──
const bk = FP2.BackupManager.create('t');
check('Backup trägt Version 5 (alte App lehnt es ab, statt die Liste zu verlieren)', bk._backup.storeVersion >= 5 && Array.isArray(bk.store.incomes));

// ── 9. Sync-Merge (_mergeBackups aus app.js) ──
const app = fs.readFileSync(path.join(path.dirname(storePath), 'app.js'), 'utf8');
const start = app.indexOf('function _mergeBackups(');
let i = app.indexOf('{', start), depth = 0;
for (; i < app.length; i++) { if (app[i] === '{') depth++; else if (app[i] === '}' && --depth === 0) break; }
const mctx = { FP: { sortSnapshots: FP.sortSnapshots } };
vm.createContext(mctx);
vm.runInContext(app.slice(start, i + 1) + '\nthis.merge = _mergeBackups;', mctx);
const merge = mctx.merge;
const clone = o => JSON.parse(JSON.stringify(o));
const lokal = clone(bk), server = clone(bk);
lokal.store.incomes.push({ id: 'inc_nurLokal', name: 'A', amount: 1, personId: 'gemeinsam', kind: 'einmalig', validFrom: '01.2026', validUntil: '01.2026', note: '' });
server.store.incomes.push({ id: 'inc_nurServer', name: 'B', amount: 2, personId: 'gemeinsam', kind: 'einmalig', validFrom: '01.2026', validUntil: '01.2026', note: '' });
let m = merge(lokal, server).store;
check('Merge: Einträge beider Geräte bleiben', m.incomes.some(e => e.id === 'inc_nurLokal') && m.incomes.some(e => e.id === 'inc_nurServer') && m.incomes.length === lokal.store.incomes.length + 1);
const alt = clone(server); delete alt.store.incomes; alt._backup.storeVersion = 4;
m = merge(lokal, alt).store;
check('Merge mit Stand ohne Liste (altes Gerät): lokale Einnahmen bleiben', m.incomes.length === lokal.store.incomes.length);
const geloescht = clone(lokal);
const weg = geloescht.store.incomes.find(e => e.id === kg.id);
geloescht.store.incomes = geloescht.store.incomes.filter(e => e.id !== kg.id);
geloescht.store.trash.push({ id: 'tr_x', type: 'income', item: weg, deletedAt: new Date().toISOString() });
m = merge(geloescht, server).store;
check('Merge: auf einem Gerät gelöschte Einnahme kommt nicht zurück', !m.incomes.some(e => e.id === kg.id));
m = merge(server, geloescht).store;
check('Merge andersherum: gelöschte Einnahme kommt nicht zurück', !m.incomes.some(e => e.id === kg.id));

const failed = results.filter(r => r.startsWith('FAIL')).length;
console.log(results.join('\n'));
console.log('SUMMARY ' + (results.length - failed) + '/' + results.length);
process.exit(failed ? 1 : 0);
