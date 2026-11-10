// Kontoauszug-Import (Store v6): Migration Person, ING-CSV lesen, Prüfliste, Übernehmen, Doppel-Schutz, Lernen, Sync-Merge.
// Gegen echte App-Daten, aber mit ERFUNDENEN Bankzeilen — keine echten Kontodaten im (öffentlichen) Repo.
// Aufruf: node import.test.js <store.js> <daten.fpbackup>  — Ausgabe/Exit-Code wie vorlagen.test.js
'use strict';
const fs = require('fs'), vm = require('vm'), path = require('path');
const [storePath, dataPath] = process.argv.slice(2);
const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const rawStore = raw.store || raw;
const src = fs.readFileSync(storePath, 'utf8');

function fresh(mutate, mem) {
  mem = mem || {};
  const localStorage = { getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: k => { delete mem[k]; } };
  const ctx = { window: { dispatchEvent() {}, addEventListener() {} }, localStorage, console: { log() {}, warn() {}, error() {} }, CustomEvent: function () {}, TextDecoder };
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

// ── Erfundener ING-Export: Zeilen alt → neu, Saldo-Kette wird gerechnet, Ausgabe neueste zuerst ──
const de = n => n.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const q = s => /[";]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
function makeCsv(rows, opts) {
  opts = opts || {};
  let saldo = opts.start || 1000;
  const out = rows.map(r => { saldo = r2(saldo + r[4]); return [r[0], r[0], q(r[1]), r[2], q(r[3]), '', de(saldo), 'EUR', de(r[4]), 'EUR'].join(';'); }).reverse();
  return ['Umsatzanzeige;Datei erstellt am: 10.11.2026 12:00', '', 'IBAN;' + (opts.iban || 'DE00 1111 2222 3333 4444 55'), 'Kontoname;Girokonto',
    'Bank;ING', 'Kunde;Test Kunde', 'Zeitraum;01.01.2026 - 31.01.2026', 'Saldo;' + de(saldo) + ';EUR', '', 'Sortierung;Datum absteigend', '',
    'In der CSV-Datei finden Sie alle bereits gebuchten Umsätze.', '',
    'Buchung;Wertstellungsdatum;Auftraggeber/Empfänger;Buchungstext;Verwendungszweck;Referenz;Saldo;Währung;Betrag;Währung'].concat(out).join('\n');
}
const p1 = String((rawStore.persons || [])[0] && rawStore.persons[0].name || 'Person').split(/\s+/)[0];
const ROWS = [
  ['05.01.2026', 'DM DROGERIEMARKT SAGT DANKE', 'Lastschrift', 'DM Drogerie/Teststr 1', -12.34],
  ['06.01.2026', '', 'Wertpapierkauf', 'WP-ABRECHNUNG Kauf ISIN TEST', -300],
  ['10.01.2026', 'Bundesagentur fur Arbeit - Familienkasse', 'Gutschrift', 'KG TEST', 500],
  ['12.01.2026', 'VISA BEISPIELSHOP', 'Lastschrift', 'NR XXXX KAUFUMSATZ', -40],
  ['15.01.2026', 'VISA BEISPIELSHOP', 'Gutschrift', 'GUTSCHRIFTSBELEG', 15],
  ['20.01.2026', p1 + ' Muster', 'Überweisung', 'Haushalt', -100],
  ['25.01.2026', 'Firma GmbH', 'Gehalt/Rente', 'Lohn/Gehalt', 900],
  ['26.01.2026', 'Zufall AG', 'Gutschrift', 'irgendwas; mit Semikolon "und" Anfuehrung', 7],
];
const CSV = makeCsv(ROWS);
const bytes1252 = Buffer.from(CSV.replace(/Ü/g, 'Ü'), 'latin1');   // ING liefert Windows-1252
const isTx = (FP, id) => FP.Store.get().transactions.some(t => t.id === id);

// ── 1. Migration v5 → v6 ──
let FP = fresh(st => { st.meta.version = 5; delete st.importLog; st.transactions.forEach(t => delete t.personId); });
let S = FP.Store.get();
check('Store ist Version 6 mit Import-Protokoll', S.meta.version === 6 && Array.isArray(S.importLog), S.meta.version);
check('Migration: jede bisherige Buchung gehört Person 1, Anzahl und Summe unverändert',
  S.transactions.every(t => t.personId === 'person_1') && S.transactions.length === rawStore.transactions.length &&
  r2(S.transactions.reduce((s, t) => s + t.amount, 0)) === r2(rawStore.transactions.reduce((s, t) => s + t.amount, 0)),
  S.transactions.length + ' Buchungen');
check('Fehlende Person (Altstand, Fixkosten) zählt als Person 1', FP.txPerson({}) === 'person_1' && FP.txPerson({ personId: 'person_2' }) === 'person_2');
const handTx = FP.Store.Transactions.add({ date: '01.2026', categoryId: S.categories[0].id, amount: 5 });
check('Neue Handbuchung = Person 1', handTx.personId === 'person_1');
FP.Store.Transactions.delete(handTx.id);

// ── 2. Lesen ──
const text = FP.bankDecode(bytes1252);
check('Windows-1252 wird erkannt (Umlaute korrekt)', text.indexOf('Umsätze') > 0 && text.indexOf('Überweisung') > 0);
check('UTF-8 wird ebenso gelesen', FP.bankDecode(Buffer.from(CSV, 'utf8')) === CSV);
const parsed = FP.parseIngCsv(text);
check('Alle Zeilen gelesen, Kontostand-Kette lückenlos', parsed.rows.length === ROWS.length && parsed.gaps === 0, parsed.rows.length + ' Zeilen, ' + parsed.gaps + ' Lücken');
check('Betrag, Datum, Semikolon im Zweck', parsed.rows[parsed.rows.length - 1].amount === -12.34 && parsed.rows[0].date === '2026-01-26' &&
  parsed.rows[0].purpose === 'irgendwas; mit Semikolon "und" Anfuehrung');
check('Fremde Datei und kaputte Zeile werden abgelehnt',
  throws(() => FP.parseIngCsv('a;b;c\n1;2;3')) && throws(() => FP.parseIngCsv(CSV + '\n27.01.2026;27.01.2026;X;Lastschrift')) &&
  throws(() => FP.parseIngCsv(CSV.replace('-12,34', 'abc'))));
const lueckeCsv = CSV.split('\n'); lueckeCsv.splice(lueckeCsv.length - 3, 1);
check('Fehlende Zeile mitten drin fällt an der Kontostand-Kette auf', FP.parseIngCsv(lueckeCsv.join('\n')).gaps === 1);
check('Fingerabdruck unabhängig vom Exportzeitraum',
  FP.parseIngCsv(makeCsv(ROWS.slice(0, 4))).rows.map(r => r.fp).join() === parsed.rows.slice(-4).map(r => r.fp).join());

// ── 3. Prüfliste ──
const tx0 = S.transactions.length;
let P = FP.Store.Imports.prepare(text);
const by = l => P.items.find(i => i.label.indexOf(l) >= 0 || i.text === l);
check('Prüfliste speichert nichts', S.transactions.length === tx0 && S.importLog.length === 0);
check('Wertpapierkauf, Kindergeld, Gehalt, Geldeingang: nicht übernommen',
  ['Wertpapierkauf', 'Familienkasse', 'Firma', 'Zufall'].every(l => { const i = by(l); return i && i.kind === 'other' && !i.take; }));
check('Überweisung an den Partner = Umbuchung, keine Ausgabe', by(p1).kind === 'other' && !by(p1).take && /Umbuchung/.test(by(p1).reason), p1);
check('Ausgaben angehakt, Erstattung desselben Händlers erkannt',
  by('DROGERIEMARKT').kind === 'expense' && by('DROGERIEMARKT').take && P.items.filter(i => i.key === 'BEISPIELSHOP').map(i => i.kind).sort().join() === 'expense,refund');
const lm = S.categories.find(c => c.name === 'Lebensmittel');
check('Drogerie → Lebensmittel (Vorschlag), Unbekanntes ohne Kategorie', (!lm || by('DROGERIEMARKT').categoryId === lm.id) && by('BEISPIELSHOP').categoryId === null);

// ── 4. Übernehmen ──
const cat = S.categories.find(c => !c.hidden && c.group === 'freizeit') || S.categories[0];
P.items.forEach(i => { if (i.take && !i.categoryId) i.categoryId = cat.id; });
const sumBefore = FP.Calculator.getMonthSummary(1, 2026).totalAusgaben;
// Pausieren: Händler BEISPIELSHOP (Kauf + Erstattung) noch ohne Kategorie → bleibt offen
const teil = JSON.parse(JSON.stringify(P.items)); teil.filter(i => i.key === 'BEISPIELSHOP').forEach(i => { i.categoryId = null; });
const res1 = FP.Store.Imports.commit(teil, 'person_2');
check('Teil-Übernahme: 1 übernommen, 5 ausgelassen, 2 ohne Kategorie bleiben offen (nicht im Protokoll)',
  res1.taken === 1 && res1.skipped === 5 && res1.open === 2 && res1.sum === 12.34 && S.importLog.length === 6, JSON.stringify(res1));
P = FP.Store.Imports.prepare(text);
check('Morgen dieselbe Datei: nur die 2 offenen Zeilen kommen wieder', P.items.length === 2 && P.known === 6 && P.items.every(i => i.key === 'BEISPIELSHOP' && i.take));
check('Nur offene Zeilen ohne Kategorie: nichts gespeichert, kein leerer Lauf',
  FP.Store.Imports.commit(P.items, 'person_2').batch === null && S.importLog.length === 6);
P.items.forEach(i => { i.categoryId = cat.id; });
const res2 = FP.Store.Imports.commit(P.items, 'person_2');
const res = { taken: res1.taken + res2.taken, skipped: res1.skipped + res2.skipped, sum: r2(res1.sum + res2.sum) };
const imp = S.transactions.filter(t => t.source === 'import');
check('Zusammen 3 Buchungen übernommen, 5 ausgelassen, Summe 12,34+40−15', res.taken === 3 && res.skipped === 5 && res.sum === 37.34 && imp.length === 3, JSON.stringify(res));
check('Zwei Läufe im Verlauf, Summen stimmen', FP.Store.Imports.batches().length === 2 && FP.Store.Imports.batches().map(b => b.sum).sort((a, b) => a - b).join() === '12.34,25');
check('Import-Buchungen: Person 2, Erstattung negativ, Bankname, Datum', imp.every(t => t.personId === 'person_2' && t.date === '01.2026' && /^tx_ing[0-9a-f]{16}$/.test(t.id)) &&
  imp.find(t => t.amount === -15) && imp.find(t => t.rawName === 'DM DROGERIEMARKT SAGT DANKE' && t.dateISO === '2026-01-05'));
check('Monatsübersicht rechnet die Import-Buchungen mit', r2(FP.Calculator.getMonthSummary(1, 2026).totalAusgaben - sumBefore) === 37.34);
check('Jede geprüfte Zeile steht im Protokoll', S.importLog.length === ROWS.length && S.importLog.filter(e => e.status === 'taken').length === 3);

// ── 5. Doppel-Schutz ──
P = FP.Store.Imports.prepare(text);
check('Gleiche Datei nochmal: nichts Neues', P.items.length === 0 && P.known === ROWS.length);
check('Übernehmen derselben Zeilen nochmal: keine Doppelung', FP.Store.Imports.commit(JSON.parse(JSON.stringify(res && imp.map(t => ({ fp: t.sourceRef, txId: t.id, take: true, categoryId: t.categoryId, amount: -t.amount, date: t.dateISO, key: 'X', label: 'X' })))), 'person_2').taken === 0 &&
  S.transactions.filter(t => t.source === 'import').length === 3);
const ROWS2 = ROWS.concat([['28.01.2026', 'VISA BEISPIELSHOP', 'Lastschrift', 'NR XXXX KAUFUMSATZ 2', -9.99], ['29.01.2026', 'Neuer Laden', 'Lastschrift', 'x', -3]]);
P = FP.Store.Imports.prepare(makeCsv(ROWS2));
check('Überlappender Export: nur die 2 neuen Zeilen', P.items.length === 2 && P.known === ROWS.length);
check('Gelernt: gleicher Händler bekommt die Kategorie vom letzten Mal', P.items[1].key === 'BEISPIELSHOP' && P.items[1].categoryId === cat.id && P.items[1].hint === 'gelernt');
P.items.forEach(i => { i.take = false; });
FP.Store.Imports.commit(P.items, 'person_2');
P = FP.Store.Imports.prepare(makeCsv(ROWS2.concat([['30.01.2026', 'Neuer Laden', 'Lastschrift', 'y', -4]])));
check('Ausgelassen: kommt nicht wieder hoch, Händler beim nächsten Mal abgewählt', P.items.length === 1 && !P.items[0].take && /ausgelassen/.test(P.items[0].reason));
check('Anderes Konto mit gleichen Zeilen = andere Fingerabdrücke', FP.Store.Imports.prepare(makeCsv(ROWS, { iban: 'DE00 9999 8888 7777 6666 55' })).items.length === ROWS.length);

// ── 6. Löschen ──
const dmTx = imp.find(t => t.amount === 12.34);
FP.Store.Transactions.delete(dmTx.id);
P = FP.Store.Imports.prepare(text);
check('Gelöschte Import-Buchung kommt beim nächsten Import nicht zurück', P.items.length === 0 && !isTx(FP, dmTx.id));
const tr = FP.Store.Trash.getAll().find(e => e.type === 'transaction' && e.item.id === dmTx.id);
FP.Store.Trash.restore(tr.id);
check('Wiederherstellen holt sie mit Person 2 zurück', isTx(FP, dmTx.id) && FP.Store.Transactions.getById(dmTx.id).personId === 'person_2');

// ── 7. Bearbeiten: Person ändern ──
FP.Store.Transactions.edit(dmTx.id, { personId: 'person_1' });
check('Person einer Buchung änderbar', FP.Store.Transactions.getById(dmTx.id).personId === 'person_1');

// ── 7b. Rückgängig (eigenes Gerät, frische Daten) ──
function importAll(D, csv) {
  const P = D.Store.Imports.prepare(csv);
  P.items.forEach(i => { if (i.take && !i.categoryId) i.categoryId = cat.id; });
  return D.Store.Imports.commit(P.items, 'person_2');
}
const U = fresh();
const u0 = U.Store.get().transactions.length, sum0 = U.Calculator.getMonthSummary(1, 2026).totalAusgaben;
const ub = importAll(U, text);
const handU = U.Store.Transactions.add({ date: '01.2026', categoryId: cat.id, amount: 1 });   // danach von Hand erfasst
const ur = U.Store.Imports.undo(ub.batch);
const US = U.Store.get();
check('Rückgängig: alle 3 Buchungen des Laufs im Papierkorb, Handbuchung bleibt', ur.removed === 3 && US.transactions.length === u0 + 1 &&
  US.transactions.some(t => t.id === handU.id) && US.trash.filter(e => e.type === 'transaction' && e.item.importId === ub.batch).length === 3);
check('Rückgängig: Monatsübersicht wie vorher (+ Handbuchung)', r2(U.Calculator.getMonthSummary(1, 2026).totalAusgaben - sum0) === 1);
let UP = U.Store.Imports.prepare(text);
check('Rückgängig: alle Zeilen wieder offen, Lauf nicht mehr im Verlauf, nichts „gelernt“',
  UP.items.length === ROWS.length && UP.known === 0 && U.Store.Imports.batches().length === 0 && UP.items.every(i => i.hint !== 'gelernt'));
check('Rückgängig ein zweites Mal: wirkungslos', U.Store.Imports.undo(ub.batch).removed === 0);
const ub2 = importAll(U, text);
const again = US.transactions.filter(t => t.source === 'import');
check('Neu übernehmen nach Rückgängig: 3 Buchungen mit neuer id, keine Doppel', again.length === 3 && again.every(t => /_1$/.test(t.id)) && ub2.taken === 3);
const oldTr = US.trash.find(e => e.type === 'transaction' && e.item.importId === ub.batch);
U.Store.Trash.restore(oldTr.id);
check('Alte Buchung aus dem Papierkorb holen, obwohl neu übernommen: keine Doppelung', US.transactions.filter(t => t.source === 'import').length === 3);
U.Store.Imports.undo(ub2.batch);
U.Store.Trash.restore(US.trash.find(e => e.type === 'transaction' && e.item.importId === ub.batch && e.item.amount === 12.34).id);
UP = U.Store.Imports.prepare(text);
check('Nach Rückgängig eine Buchung zurückgeholt: diese Zeile gilt als erledigt, die anderen sind offen', UP.known === 1 && UP.items.length === ROWS.length - 1);

// ── 8. Neustart + Backup ──
const FP2 = fresh(null, FP.__mem);
check('Neustart: Import-Buchungen und Protokoll bleiben', FP2.Store.get().transactions.filter(t => t.source === 'import').length === 3 && FP2.Store.get().importLog.length === ROWS2.length);
const bk = FP2.BackupManager.create('t');
check('Backup trägt Version 6 (alte App lehnt es ab, statt Personen zu verlieren)', bk._backup.storeVersion === 6 && Array.isArray(bk.store.importLog));

// ── 9. Sync-Merge: zwei Geräte importieren dieselbe Datei ──
const app = fs.readFileSync(path.join(path.dirname(storePath), 'app.js'), 'utf8');
const start = app.indexOf('function _mergeBackups(');
let i = app.indexOf('{', start), depth = 0;
for (; i < app.length; i++) { if (app[i] === '{') depth++; else if (app[i] === '}' && --depth === 0) break; }
const mctx = { FP: { sortSnapshots: FP.sortSnapshots } };
vm.createContext(mctx);
vm.runInContext(app.slice(start, i + 1) + '\nthis.merge = _mergeBackups;', mctx);
function device() {
  const D = fresh();
  const P = D.Store.Imports.prepare(text);
  P.items.forEach(i => { if (i.take && !i.categoryId) i.categoryId = cat.id; });
  D.Store.Imports.commit(P.items, 'person_2');
  return D.BackupManager.create('t');
}
const A = device(), B = device();
const m = mctx.merge(A, B).store;
const mi = m.transactions.filter(t => t.source === 'import');
check('Merge: zwei Geräte, gleiche Datei → keine doppelten Buchungen', mi.length === 3 && new Set(mi.map(t => t.id)).size === 3, mi.length + ' Import-Buchungen');
check('Merge: Protokoll ohne Doppel', m.importLog.length === ROWS.length && new Set(m.importLog.map(e => e.id)).size === ROWS.length);
const alt = JSON.parse(JSON.stringify(B)); delete alt.store.importLog; alt._backup.storeVersion = 5;
check('Merge mit Stand ohne Protokoll (altes Gerät): Protokoll bleibt', mctx.merge(A, alt).store.importLog.length === ROWS.length);

// Gerät A importiert, B hat den Stand per Sync, dann macht A rückgängig → Merge darf nichts wiederbeleben
const DA = fresh(); const ab = importAll(DA, text);
const Bold = DA.BackupManager.create('t');
DA.Store.Imports.undo(ab.batch);
const Anew = DA.BackupManager.create('t');
[['A neu + B alt', mctx.merge(Anew, Bold).store], ['B alt + A neu', mctx.merge(Bold, Anew).store]].forEach(([name, ms]) => {
  const DM = fresh(null, { finanzplaner_v3: JSON.stringify(ms) });
  const MP = DM.Store.Imports.prepare(text);
  check('Merge nach Rückgängig (' + name + '): Buchungen bleiben weg, Zeilen wieder offen',
    ms.transactions.filter(t => t.source === 'import').length === 0 && MP.items.length === ROWS.length && DM.Store.Imports.batches().length === 0);
});

const failed = results.filter(r => r.startsWith('FAIL')).length;
console.log(results.join('\n'));
console.log('SUMMARY ' + (results.length - failed) + '/' + results.length);
process.exit(failed ? 1 : 0);
