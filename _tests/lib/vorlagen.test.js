// Vorlagen-Regel gegen echte Daten prüfen (Paket 3).
// Aufruf: node vorlagen.test.js <store.js> <daten.fpbackup>
// Gibt je Prüfung eine Zeile "OK …" / "FAIL …" aus, Exit-Code 1 bei Fehlern.
// Prüft Regeln, die für JEDEN Datenstand gelten müssen — keine Annahmen über konkrete Beträge.
'use strict';
const fs = require('fs'), vm = require('vm');
const [storePath, dataPath] = process.argv.slice(2);
const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const src = fs.readFileSync(storePath, 'utf8');

function fresh(mutate) {
  const mem = {};
  const localStorage = {
    getItem: k => (k in mem ? mem[k] : null),
    setItem: (k, v) => { mem[k] = String(v); },
    removeItem: k => { delete mem[k]; },
  };
  const window = { dispatchEvent() {}, addEventListener() {} };
  const ctx = { window, localStorage, console: { log() {}, warn() {}, error() {} }, CustomEvent: function () {} };
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
const r2 = x => Math.round(x * 100) / 100;
const startup = FP => [FP.Store.cleanupRecurringDuplicates({ silent: true }), FP.Store.generateRecurringTransactions({ retroactive: true, silent: true })];
const recById = FP => { const m = {}; FP.Store.Recurring.getAll().forEach(r => { m[r.id] = r; }); return m; };
function dupCount(FP) {
  const recMap = recById(FP), c = {}; let d = 0;
  FP.Store.Transactions.getAll().forEach(t => {
    if (t.source !== 'recurring') return;
    const r = recMap[t.recurringId]; if (!r) return;
    const k = r.name + '|' + (r.objectId || '') + '|' + t.date;
    c[k] = (c[k] || 0) + 1; if (c[k] === 2) d++;
  });
  return d;
}
const seriesTx = (FP, rec, year) => {
  const recMap = recById(FP);
  return FP.Store.Transactions.getAll().filter(t => {
    const r = recMap[t.recurringId];
    return r && r.name === rec.name && (r.objectId || null) === (rec.objectId || null) && (!year || t.date.endsWith('.' + year));
  });
};
const sumAll = FP => r2(FP.Store.Transactions.getAll().reduce((s, t) => s + t.amount, 0));

// ── 1. Laden, Start, Regeln auf dem echten Bestand ──
let FP = fresh();
const rawVersion = (raw.store || raw).meta.version;
check('Store lädt und ist auf aktueller Version', FP.Store.writeLock() === null && FP.Store.get().meta.version >= 3, 'Rohdaten v' + rawVersion);
const sumAfterLoad = sumAll(FP);
const st1 = startup(FP), st2 = startup(FP);
check('Start ändert beim zweiten Mal nichts (kein Hin und Her)', st2[0] === 0 && st2[1] === 0, 'Start1 ' + st1 + ' / Start2 ' + st2);
if (rawVersion >= 3) check('Start verändert die Summen nicht', sumAll(FP) === sumAfterLoad, sumAfterLoad + ' → ' + sumAll(FP));
check('Keine Doppelbuchung je Serie und Monat', dupCount(FP) === 0, dupCount(FP));
const recMap0 = recById(FP);
const orphans = FP.Store.Transactions.getAll().filter(t => t.source === 'recurring' && !recMap0[t.recurringId]).length;
check('Keine Fixkosten-Buchung ohne Vorlage', orphans === 0, orphans);
const bad = FP.Store.Recurring.getAll().filter(r => { try { FP.Store.Recurring._check(r); return false; } catch (e) { return true; } });
check('Jede Vorlage erfüllt die Invarianten', bad.length === 0, bad.map(r => r.name).join(', '));
const cm = FP.currentMonthStr();
const listSum = r2(FP.Store.Recurring.ownersInMonth(cm).filter(r => r.type !== 'savings' && !(r.skipMonths || []).includes(cm)).reduce((s, r) => s + r.amount, 0));
const booked = r2(FP.Store.Transactions.getAll().filter(t => t.source === 'recurring' && t.date === cm).reduce((s, t) => s + t.amount, 0));
check('Fixkosten-Liste ' + cm + ' = tatsächlich gebucht', listSum === booked, listSum + ' / ' + booked);
const m1 = JSON.parse(JSON.stringify(FP.Store.get()));

// Testvorlage: offen, keine Rücklage, mindestens seit Januar des Vorjahres, allein in ihrer Serie
const year = parseInt(cm.split('.')[1]);
function pickTemplate(F) {
  return F.Store.Recurring.getAll().find(r => {
    if (r.validUntil || r.type === 'savings') return false;
    const p = r.validFrom.split('.');
    if (parseInt(p[1]) > year - 1 || (parseInt(p[1]) === year - 1 && parseInt(p[0]) !== 1)) return false;
    return F.Store.Recurring.getAll().filter(o => o.name === r.name && (o.objectId || null) === (r.objectId || null)).length >= 1 &&
           seriesTx(F, r, year - 1).length === 12;
  });
}
const T = pickTemplate(FP);
check('Testvorlage gefunden', !!T, T ? T.name : 'keine offene Vorlage seit Vorjahr');

if (T) {
  // ── 2. ↕ Betrag ab Januar dieses Jahres ──
  FP = fresh(); startup(FP);
  let t = FP.Store.Recurring.getAll().find(r => r.id === T.id);
  const neu = r2(t.amount + 11);
  FP.Store.Recurring.split(t.id, '01.' + year, neu);
  const cur = seriesTx(FP, t, year), prev = seriesTx(FP, t, year - 1);
  check('↕: dieses Jahr neuer Betrag', cur.length > 0 && cur.every(x => x.amount === neu), cur.length + ' Buchungen');
  check('↕: Vorjahr alter Betrag, 12 Monate', prev.length === 12 && prev.every(x => x.amount === t.amount));
  check('↕: keine Doppel, Start danach ohne Änderung', dupCount(FP) === 0 && startup(FP).join() === '0,0');
  let threw = false; try { FP.Store.Recurring.split(t.id, '01.1990', 1); } catch (e) { threw = true; }
  check('↕: Monat vor Start wird abgelehnt', threw);

  // ── 3. ✏️ Korrektur ──
  FP = fresh(); startup(FP);
  t = FP.Store.Recurring.getAll().find(r => r.id === T.id);
  const korr = r2(t.amount + 7);
  FP.Store.Recurring.update(t.id, { amount: korr, validFrom: t.validFrom });
  check('✏️: alle Buchungen der Vorlage korrigiert', seriesTx(FP, t, year - 1).every(x => x.amount === korr) && seriesTx(FP, t, year - 1).length === 12);
  check('✏️: keine Doppel, Start ohne Änderung', dupCount(FP) === 0 && startup(FP).join() === '0,0');
  threw = false; try { FP.Store.Recurring.update(t.id, { validUntil: '01.1990' }); } catch (e) { threw = true; }
  check('✏️: Ende vor Start wird abgelehnt', threw);
  threw = false; try { FP.Store.Recurring.update(t.id, { type: '' }); } catch (e) { threw = true; }
  check('✏️: leerer Typ wird abgelehnt', threw);

  // ── 4. Löschen, Neustart, aus dem Papierkorb holen ──
  FP = fresh(); startup(FP);
  const before = sumAll(FP);
  FP.Store.Recurring.delete(T.id);
  startup(FP);
  const tr = FP.Store.Trash.getAll().find(e => e.type === 'recurring' && e.item.id === T.id);
  FP.Store.Trash.restore(tr.id);
  startup(FP);
  check('Papierkorb: Historie nicht doppelt', sumAll(FP) === before && dupCount(FP) === 0, before + ' → ' + sumAll(FP));

  // ── 5. Fixkosten-Buchung verschieben, nur Notiz, löschen und zurückholen ──
  FP = fresh(); startup(FP);
  const s0 = sumAll(FP);
  const mar = seriesTx(FP, T, year - 1).find(x => x.date === '03.' + (year - 1));
  FP.Store.Transactions.edit(mar.id, { date: '04.' + (year - 1) });
  startup(FP);
  const moved = FP.Store.Transactions.getById(mar.id);
  check('Verschieben: bleibt verschoben, März nicht neu gebucht',
    moved && moved.source === 'manual' && !seriesTx(FP, T, year - 1).some(x => x.date === '03.' + (year - 1)) && sumAll(FP) === s0);
  const may = seriesTx(FP, T, year - 1).find(x => x.date === '05.' + (year - 1));
  FP.Store.Transactions.edit(may.id, { note: 'nur Notiz' });
  check('Nur Notiz: Buchung bleibt an der Vorlage', FP.Store.Transactions.getById(may.id).source === 'recurring');
  const jun = seriesTx(FP, T, year - 1).find(x => x.date === '06.' + (year - 1));
  FP.Store.Transactions.delete(jun.id);
  startup(FP);
  check('Löschen: Fixkosten-Buchung bleibt gelöscht', !seriesTx(FP, T, year - 1).some(x => x.date === '06.' + (year - 1)));
  const trTx = FP.Store.Trash.getAll().find(e => e.type === 'transaction' && e.item.id === jun.id);
  FP.Store.Trash.restore(trTx.id);
  check('Löschen: Zurückholen bucht den Monat genau einmal',
    seriesTx(FP, T, year - 1).filter(x => x.date === '06.' + (year - 1)).length === 1 && dupCount(FP) === 0);
}

// ── 6. Migration ein zweites Mal ──
FP = fresh(st => { Object.assign(st, JSON.parse(JSON.stringify(m1))); st.meta.version = 2; });
const m2 = FP.Store.get();
check('Migration zweiter Lauf ändert nichts',
  m2.recurring.length === m1.recurring.length && (m2.trash || []).length === (m1.trash || []).length &&
  JSON.stringify(m2.recurring) === JSON.stringify(m1.recurring));

console.log(results.join('\n'));
const failed = results.filter(r => r.startsWith('FAIL')).length;
console.log('SUMMARY ' + (results.length - failed) + '/' + results.length);
process.exit(failed ? 1 : 0);
