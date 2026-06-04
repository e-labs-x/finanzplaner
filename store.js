/**
 * FinanzPlaner v2 — Store & Calculator
 * =====================================
 * SCHICHT 1: Store     — Laden, Speichern, Migrieren, Validieren
 * SCHICHT 2: Calculator — Alle Berechnungen, kein UI-Code
 *
 * Kein Tab, keine UI-Referenz. Reine Logik.
 */

'use strict';

// ═══════════════════════════════════════════════════════════════
// KONSTANTEN
// ═══════════════════════════════════════════════════════════════

const FP_VERSION = '12.0.0';
const STORE_VERSION    = 1;
const LS_KEY           = 'finanzplaner_v3';
const BACKUP_KEY       = 'finanzplaner_v3_backups';
const MAX_AUTO_BACKUPS = 5;
const FREIBETRAG_EINZEL    = 1000;
const FREIBETRAG_GEMEINSAM = 2000;

// Monats-Kürzel DE
const MONATE_KURZ = ['Jan','Feb','Mär','Apr','Mai','Jun',
                     'Jul','Aug','Sep','Okt','Nov','Dez'];
const MONATE_LANG = ['Januar','Februar','März','April','Mai','Juni',
                     'Juli','August','September','Oktober','November','Dezember'];

// ═══════════════════════════════════════════════════════════════
// DEFAULT-DATEN
// ═══════════════════════════════════════════════════════════════

function createDefaultStore() {
  const now = new Date().toISOString();
  return {
    meta: {
      version:      STORE_VERSION,
      appVersion:   FP_VERSION,
      created:      now,
      lastModified: now,
      deviceId:     generateId('dev'),
    },

    // ── Personen ──
    persons: [
      {
        id:        'person_1',
        name:      'Person 1',
        birthDate: '',   // Geburtsjahr — Tag/Monat ggf. anpassen
        isPrimary: true,
        isActive:  true,
        gender:    'm',
      },
      {
        id:        'person_2',
        name:      'Partner',
        birthDate: '',             // Bitte eintragen
        isPrimary: false,
        isActive:  true,           // v2.0: Partner aktiv für gemeinsame Rentenplanung
        gender:    null,
      },
    ],

    // ── Kategorien ──
    // parentId:null = Hauptkategorie, parentId:'cat_xxx' = Unterkategorie
    categories: [
      // ── Notwendig (Hauptkategorien) ──
      { id:'cat_lebensmittel',  name:'Lebensmittel',     parentId:null,       group:'fixkosten', color:'var(--green)', hidden:false, sortOrder:1,  source:'system' },
      { id:'cat_wohnung',       name:'Wohnung',          parentId:null,       group:'fixkosten', color:'var(--cat-violet)', hidden:false, sortOrder:2,  source:'system' },
      { id:'cat_steuer',        name:'Steuer',           parentId:null,       group:'fixkosten', color:'var(--cat-slate)', hidden:false, sortOrder:3,  source:'system' },
      // Auto als Gruppe
      { id:'cat_auto',          name:'Auto & Mobilität', parentId:null,       group:'fixkosten', color:'var(--cat-cyan)', hidden:false, sortOrder:4,  source:'system' },
      { id:'cat_tanken',        name:'Tanken',           parentId:'cat_auto', group:'fixkosten', color:'var(--cat-cyan)', hidden:false, sortOrder:41, source:'system' },
      { id:'cat_autowaesche',   name:'Autowäsche',       parentId:'cat_auto', group:'fixkosten', color:'var(--cat-teal)', hidden:false, sortOrder:42, source:'system' },
      { id:'cat_autoteile',     name:'Auto-Teile',       parentId:'cat_auto', group:'fixkosten', color:'var(--amber)', hidden:false, sortOrder:43, source:'system' },
      { id:'cat_parken',        name:'Parken',           parentId:'cat_auto', group:'fixkosten', color:'var(--cat-slate)', hidden:false, sortOrder:44, source:'system' },
      { id:'cat_reinigung',     name:'Reinigung',        parentId:'cat_auto', group:'fixkosten', color:'var(--cat-slate)', hidden:false, sortOrder:45, source:'system' },

      // ── Freizeit & Lifestyle (Hauptkategorien) ──
      { id:'cat_restaurant',    name:'Restaurant',       parentId:null,       group:'freizeit',  color:'var(--amber)', hidden:false, sortOrder:10, source:'system' },
      { id:'cat_kaffee',        name:'Kaffee',           parentId:null,       group:'freizeit',  color:'var(--purple)', hidden:false, sortOrder:11, source:'system' },
      { id:'cat_kleidung',      name:'Kleidung',         parentId:null,       group:'freizeit',  color:'var(--cat-pink)', hidden:false, sortOrder:12, source:'system' },
      { id:'cat_urlaub',        name:'Urlaub',           parentId:null,       group:'freizeit',  color:'var(--cat-blue)', hidden:false, sortOrder:13, source:'system' },
      { id:'cat_geschenke',     name:'Geschenke',        parentId:null,       group:'freizeit',  color:'var(--cat-pink)', hidden:false, sortOrder:14, source:'system' },
      { id:'cat_gesundheit',    name:'Gesundheit',       parentId:null,       group:'freizeit',  color:'var(--red)', hidden:false, sortOrder:15, source:'system' },
      { id:'cat_friseur',       name:'Friseur',          parentId:null,       group:'freizeit',  color:'var(--cat-orange)', hidden:false, sortOrder:16, source:'system' },
      { id:'cat_weiterbildung', name:'Weiterbildung',    parentId:null,       group:'freizeit',  color:'var(--cat-cyan)', hidden:false, sortOrder:17, source:'system' },
      { id:'cat_lotto',         name:'Lotto',            parentId:null,       group:'freizeit',  color:'var(--cat-lime)', hidden:false, sortOrder:18, source:'system' },
      // Streaming als Gruppe
      { id:'cat_abos',          name:'Streaming & Abo',  parentId:null,       group:'freizeit',  color:'var(--cat-red)', hidden:false, sortOrder:19, source:'system' },
      { id:'cat_amazon',        name:'Amazon Prime',     parentId:'cat_abos', group:'freizeit',  color:'var(--cat-orange)', hidden:false, sortOrder:191,source:'system' },
      { id:'cat_netflix',       name:'Netflix',          parentId:'cat_abos', group:'freizeit',  color:'var(--cat-red)', hidden:false, sortOrder:192,source:'system' },
      { id:'cat_youtube',       name:'YouTube Premium',  parentId:'cat_abos', group:'freizeit',  color:'var(--cat-red)', hidden:false, sortOrder:193,source:'system' },
      { id:'cat_appletv',       name:'Apple TV',         parentId:'cat_abos', group:'freizeit',  color:'var(--cat-slate)', hidden:false, sortOrder:194,source:'system' },
      { id:'cat_icloud',        name:'iCloud',           parentId:'cat_abos', group:'freizeit',  color:'var(--cat-blue)', hidden:false, sortOrder:195,source:'system' },

      { id:'cat_sim_gps',       name:'SIM GPS Kind 1',   parentId:null,       group:'fixkosten', color:'var(--cat-cyan)', hidden:false, sortOrder:20, source:'system' },
      { id:'cat_sonstiges',     name:'Sonstiges',        parentId:null,       group:'freizeit',  color:'var(--cat-slate)', hidden:false, sortOrder:99, source:'system' },

      // Fixkosten-only Kategorien (showInInput:false → erscheinen nicht in der Eingabe-Leiste)
      { id:'fk_versicherungen', name:'Versicherungen',     parentId:null,                group:'fixkosten', color:'var(--cat-slate)', hidden:false, sortOrder:50,  source:'system', showInInput:false },
      { id:'fk_kfz_vers',       name:'KFZ-Versicherung',   parentId:'fk_versicherungen', group:'fixkosten', color:'var(--cat-slate)', hidden:false, sortOrder:501, source:'system', showInInput:false },
      { id:'fk_haftpflicht',    name:'Haftpflicht',        parentId:'fk_versicherungen', group:'fixkosten', color:'var(--cat-slate)', hidden:false, sortOrder:502, source:'system', showInInput:false },
      { id:'fk_hausrat',        name:'Hausrat',            parentId:'fk_versicherungen', group:'fixkosten', color:'var(--cat-slate)', hidden:false, sortOrder:503, source:'system', showInInput:false },
      { id:'fk_leben_bu',       name:'Leben / BU',         parentId:'fk_versicherungen', group:'fixkosten', color:'var(--cat-slate)', hidden:false, sortOrder:504, source:'system', showInInput:false },
      { id:'fk_pkv',            name:'Krankenversicherung',parentId:'fk_versicherungen', group:'fixkosten', color:'var(--cat-slate)', hidden:false, sortOrder:505, source:'system', showInInput:false },
      { id:'fk_kredite',        name:'Kredite & Leasing',  parentId:null,                group:'fixkosten', color:'var(--red)',       hidden:false, sortOrder:60,  source:'system', showInInput:false },
      { id:'fk_kredit',         name:'Kredit / Rate',      parentId:'fk_kredite',        group:'fixkosten', color:'var(--red)',       hidden:false, sortOrder:601, source:'system', showInInput:false },
      { id:'fk_leasing',        name:'Leasing',            parentId:'fk_kredite',        group:'fixkosten', color:'var(--red)',       hidden:false, sortOrder:602, source:'system', showInInput:false },
      { id:'fk_kfz_steuer',     name:'KFZ-Steuer',         parentId:'cat_auto',          group:'fixkosten', color:'var(--cat-cyan)', hidden:false, sortOrder:46,  source:'system', showInInput:false },
      { id:'fk_kfz_hu',         name:'HU / TÜV',           parentId:'cat_auto',          group:'fixkosten', color:'var(--cat-cyan)', hidden:false, sortOrder:47,  source:'system', showInInput:false },
    ],

    // ── Objekte / Projekte ──
    objects: [
      {
        id:          'obj_auto',
        name:        'Mein Auto',
        type:        'fahrzeug',
        description: '',
        startDate:   '01.2020',
        endDate:     null,
        icon:        '🚗',
        color:       '#2563EB',
        status:      'aktiv',
      },
    ],

    // ── Transaktionen ──
    transactions: [],

    // ── Wiederkehrende Ausgaben (v2.0: ersetzt fixedCosts) ──
    // type: 'fixed' | 'variable' | 'savings' (Rücklage)
    // Kein autoGenerate mehr — alle können per generateRecurring() gebucht werden
    // source auf Transaktionen: 'recurring', recurringId: id dieser Vorlage
    recurring: [
      { id:'rec_hausgeld',    name:'Hausgeld',    amount:284.78, type:'fixed',    categoryId:'cat_wohnung',     objectId:null,          personId:'person_1', validFrom:'01.2022', validUntil:null },
      { id:'rec_waerme',      name:'Heizung',             amount:208.00, type:'fixed',    categoryId:'cat_wohnung',     objectId:null,          personId:'person_1', validFrom:'01.2022', validUntil:null },
      { id:'rec_hort',        name:'Hort / KiTa',               amount:151.00, type:'fixed',    categoryId:'cat_sonstiges',   objectId:null,          personId:'person_1', validFrom:'01.2022', validUntil:null },
      { id:'rec_strom',       name:'Strom',                amount:68.00,  type:'fixed',    categoryId:'cat_wohnung',     objectId:null,          personId:'person_1', validFrom:'01.2022', validUntil:null },
      { id:'rec_internet',    name:'Internet & TV',     amount:64.88,  type:'fixed',    categoryId:'cat_wohnung',     objectId:null,          personId:'person_1', validFrom:'01.2022', validUntil:null },
      { id:'rec_kfzvers',     name:'KFZ-Versicherung',     amount:56.63,  type:'fixed',    categoryId:'cat_autoteile',   objectId:'obj_auto', personId:'person_1', validFrom:'01.2022', validUntil:null },
      { id:'rec_kfzsteuer',   name:'KFZ Steuer',                amount:31.92,  type:'fixed',    categoryId:'cat_steuer',      objectId:'obj_auto', personId:'person_1', validFrom:'01.2022', validUntil:null },
      { id:'rec_gez',         name:'GEZ',                       amount:18.36,  type:'fixed',    categoryId:'cat_steuer',      objectId:null,          personId:'person_1', validFrom:'01.2022', validUntil:null },
      { id:'rec_grundsteuer', name:'Grundsteuer',               amount:17.81,  type:'fixed',    categoryId:'cat_steuer',      objectId:null,          personId:'person_1', validFrom:'01.2022', validUntil:null },
      { id:'rec_handy',       name:'Handyvertrag Person 1',         amount:9.99,   type:'fixed',    categoryId:'cat_sonstiges',   objectId:null,          personId:'person_1', validFrom:'01.2022', validUntil:null },
      { id:'rec_haftpflicht', name:'Haftpflicht / Hausrat',     amount:13.93,  type:'fixed',    categoryId:'cat_sonstiges',   objectId:null,          personId:'person_1', validFrom:'01.2022', validUntil:null },
      { id:'rec_adac',        name:'ADAC',                      amount:8.25,   type:'fixed',    categoryId:'cat_sonstiges',   objectId:null,          personId:'person_1', validFrom:'01.2022', validUntil:null },
      { id:'rec_bu',          name:'BU Versicherung',           amount:98.08,  type:'variable', categoryId:'cat_sonstiges',   objectId:null,          personId:'person_1', validFrom:'01.2022', validUntil:null },
      { id:'rec_schwimm',     name:'Schwimmkurs Kind 1',        amount:111.57, type:'variable', categoryId:'cat_sonstiges',   objectId:null,          personId:'person_1', validFrom:'01.2022', validUntil:null },
      { id:'rec_tiefgarage',  name:'Tiefgarage',                amount:71.40,  type:'variable', categoryId:'cat_parken',      objectId:'obj_auto', personId:'person_1', validFrom:'01.2022', validUntil:null },
      { id:'rec_rechtsschutz',name:'Rechtsschutz',   amount:18.28,  type:'variable', categoryId:'cat_sonstiges',   objectId:null,          personId:'person_1', validFrom:'01.2022', validUntil:null },
      { id:'rec_rentenver',   name:'Private Rentenversicherung',     amount:36.92,  type:'variable', categoryId:'cat_sonstiges',   objectId:null,          personId:'person_1', validFrom:'01.2022', validUntil:null },
      { id:'rec_steuervor',   name:'Steuervorauszahlung',       amount:57.92,  type:'variable', categoryId:'cat_steuer',      objectId:null,          personId:'person_1', validFrom:'01.2022', validUntil:null },
      { id:'rec_rl_auto',     name:'Autokauf Rücklage',         amount:500.00, type:'savings',  categoryId:'cat_autoteile',   objectId:'obj_auto', personId:'person_1', validFrom:'01.2022', validUntil:null },
      { id:'rec_rl_kfz',      name:'KFZ Wartung Rücklage',     amount:30.06,  type:'savings',  categoryId:'cat_autoteile',   objectId:'obj_auto', personId:'person_1', validFrom:'01.2022', validUntil:null },
      { id:'rec_rl_renov',    name:'Renovierung Rücklage',      amount:40.00,  type:'savings',  categoryId:'cat_wohnung',     objectId:null,          personId:'person_1', validFrom:'01.2022', validUntil:null },
    ],

    // ── Gehalt ──
    salary: { person_1: {}, person_2: {} },

    // ── Sparplan ──
    savingsPlans: [],

    // ── Assets ──
    assets: [
      {
        id:         'asset_etf_1',
        name:       'ETF Welt',
        type:       'etf',
        ownerId:    'person_1',
        wkn:        '',
        isin:       '',
        currency:   'EUR',
        snapshots:  [],
        meta:       {},
        dataSource: 'manual',
        apiConfig:  null,
        status:     'aktiv',
      },
      {
        id:         'asset_gm_1',
        name:       'Geldmarkt',
        type:       'geldmarkt',
        ownerId:    'person_1',
        wkn:        '',
        isin:       '',
        currency:   'EUR',
        snapshots:  [],
        meta:       {},
        dataSource: 'manual',
        apiConfig:  null,
        status:     'aktiv',
      },
      {
        id:         'asset_etf_2',
        name:       'ETF Global (Kind 1)',
        type:       'etf',
        ownerId:    'joint',
        wkn:        '',
        isin:       '',
        currency:   'EUR',
        snapshots:  [],
        meta:       {},
        dataSource: 'manual',
        apiConfig:  null,
        status:     'aktiv',
      },
      {
        id:         'asset_etf_3',
        name:       'ETF Global (Kind 2)',
        type:       'etf',
        ownerId:    'joint',
        wkn:        '',
        isin:       '',
        currency:   'EUR',
        snapshots:  [],
        meta:       {},
        dataSource: 'manual',
        apiConfig:  null,
        status:     'aktiv',
      },
      {
        id:         'asset_tagesgeld',
        name:       'Tagesgeld',
        type:       'tagesgeld',
        ownerId:    'person_1',
        wkn:        '',
        isin:       '',
        currency:   'EUR',
        snapshots:  [],
        meta:       {},
        dataSource: 'manual',
        apiConfig:  null,
        status:     'aktiv',
      },
      {
        id:         'asset_immobilie',
        name:       'Eigentumswohnung',
        type:       'immobilie',
        ownerId:    'joint',
        wkn:        '',
        isin:       '',
        currency:   'EUR',
        snapshots:  [],
        meta:       { address:'', purchaseYear:'2020', purchasePrice:0 },
        dataSource: 'manual',
        apiConfig:  null,
        status:     'aktiv',
      },
    ],

    // ── Freistellungsaufträge ──
    freistellungsauftraege: [],

    // ── Rentenplanung ──
    retirement: {
      assumptions: {
        version:            1,
        inflationRate:      2.3,
        expectedReturn:     6.0,
        safeWithdrawalRate: 3.5,
        currency:           'EUR',
        kvZusatzbeitrag:    2.99,
        familienversicherungGrenze: 505,    // § 10 Abs. 1 Nr. 5 SGB V, jährlich prüfen
        gkvMindestBmg:      1131.67,        // § 240 Abs. 4 SGB V (1/30 Bezugsgröße 2026), jährlich prüfen
        durchschnittsentgelt: 45538,        // § 68 SGB VI, jährlich vom Rentenversicherungsbericht, jährlich prüfen
        bbgRvJahr:          96600,          // BBG Rentenversicherung 2026 (jährlich), jährlich prüfen
      },
      profiles: {
        person_1: {
          targetRetirementAge:          63,
          regularRetirementAge:         67,
          monthlyExpenseInRetirement:   4000,
          gesetzlicheRente: {
            currentEntgeltpunkte:       0,
            dataDate:                   '',
            estimatedNewPointsPerYear:  1.8,
            rentenwertWest:             40.79,
            region:                     'west',
            zugangsfaktorOverride:      null,
          },
          direktzusage: {
            employer:              'Arbeitgeber GmbH',
            monthlyAmountAtStart:  0,
            startAge:              63,
            dynamicPct:            0,
            guaranteed:            true,
            note:                  '',
          },
          ruerupRente: {
            provider:              '',
            monthlyAmountAtStart:  0,
            startAge:              67,
            dynamicPct:            0,
            currentValue:          0,
            dataDate:              '',
            note:                  '',
          },
          weitereRentenversicherungen: [],
          sonstigeEinkommen:           [],
          erbimmobilie: { enabled:false, inJahren:15, wert:250000, modus:'verkauf', miete:900, instandPct:1.5 },
          ausgabenOverride: null,
          kvStatus:                    'gkv',
        },
        person_2: {
          targetRetirementAge:          63,
          regularRetirementAge:         67,
          monthlyExpenseInRetirement:   0,
          gesetzlicheRente: {
            currentEntgeltpunkte:       0,
            dataDate:                   '',
            estimatedNewPointsPerYear:  1.5,
            rentenwertWest:             40.79,
            region:                     'west',
            zugangsfaktorOverride:      null,
          },
          direktzusage:                { employer:'', monthlyAmountAtStart:0, startAge:63, dynamicPct:0, guaranteed:false, note:'' },
          ruerupRente:                 { provider:'', monthlyAmountAtStart:0, startAge:67, dynamicPct:0, currentValue:0, rentenfaktor:0, autoCalc:true, linkedAge:true, dataDate:'', note:'' },
          weitereRentenversicherungen: [],
          sonstigeEinkommen:           [],
          erbimmobilie: { enabled:false, inJahren:15, wert:250000, modus:'verkauf', miete:900, instandPct:1.5 },
          ausgabenOverride: null,
          kvStatus:                    'gkv',
        },
      },
      scenarios: [
        {
          id:        'sz_basis',
          name:      'Basis',
          createdAt: new Date().toISOString(),
          overrides: { inflationRate:2.3 },
          classReturns: { etf:7.0, aktie:7.0, fonds:7.0, geldmarkt:2.5, tagesgeld:2.0, girokonto:0.0, espp:7.0, rsu:7.0 },
          isPinned:  true,
        },
        {
          id:        'sz_pessimistisch',
          name:      'Pessimistisch',
          createdAt: new Date().toISOString(),
          overrides: { inflationRate:3.5 },
          classReturns: { etf:4.0, aktie:4.0, fonds:4.0, geldmarkt:1.0, tagesgeld:0.5, girokonto:0.0, espp:4.0, rsu:4.0 },
          isPinned:  false,
        },
        {
          id:        'sz_optimistisch',
          name:      'Optimistisch',
          createdAt: new Date().toISOString(),
          overrides: { inflationRate:1.8 },
          classReturns: { etf:9.0, aktie:9.0, fonds:9.0, geldmarkt:3.5, tagesgeld:3.0, girokonto:0.0, espp:9.0, rsu:9.0 },
          isPinned:  false,
        },
        {
          id:        'sz_stresstest',
          name:      'Stresstest',
          createdAt: new Date().toISOString(),
          overrides: { inflationRate:4.0 },
          classReturns: { etf:1.0, aktie:1.0, fonds:1.0, geldmarkt:0.5, tagesgeld:0.5, girokonto:0.0, espp:1.0, rsu:1.0 },
          isPinned:  false,
        },
      ],
    },

    // ── Inflation ──
    inflation: {
      2001:2.0, 2002:1.4, 2003:1.0, 2004:1.7, 2005:1.5, 2006:1.6,
      2007:2.3, 2008:2.6, 2009:0.4, 2010:1.1, 2011:2.1, 2012:2.0,
      2013:1.5, 2014:0.9, 2015:0.3, 2016:0.5, 2017:1.8, 2018:1.9,
      2019:1.4, 2020:0.5, 2021:3.1, 2022:6.9, 2023:5.9, 2024:2.2,
      2025:2.3, 2026:2.1,
    },

    // ── Budget ──
    budget: { fixPct:50, freiPct:30, sparPct:20 },
    categoryBudgets: {},

    // ── Währungen (Kurs = Einheiten Fremdwährung pro 1 EUR) ──
    currencies: [
      { code:'USD', name:'US-Dollar',           symbol:'$',   rate:1.08,  active:true  },
      { code:'GBP', name:'Brit. Pfund',          symbol:'£',   rate:0.86,  active:true  },
      { code:'CHF', name:'Schweizer Franken',    symbol:'Fr.', rate:0.94,  active:true  },
      { code:'JPY', name:'Japan. Yen',           symbol:'¥',   rate:160.0, active:false },
      { code:'TRY', name:'Türkische Lira',       symbol:'₺',   rate:38.5,  active:false },
      { code:'PLN', name:'Poln. Zloty',          symbol:'zł',  rate:4.25,  active:false },
      { code:'SEK', name:'Schwed. Krone',        symbol:'kr',  rate:11.5,  active:false },
      { code:'NOK', name:'Norw. Krone',          symbol:'kr',  rate:11.8,  active:false },
      { code:'DKK', name:'Dän. Krone',           symbol:'kr',  rate:7.46,  active:false },
      { code:'CAD', name:'Kanad. Dollar',        symbol:'C$',  rate:1.48,  active:false },
      { code:'AUD', name:'Austral. Dollar',      symbol:'A$',  rate:1.65,  active:false },
      { code:'AED', name:'Dirham (VAE)',          symbol:'د.إ', rate:3.97,  active:false },
      { code:'HUF', name:'Ungar. Forint',        symbol:'Ft',  rate:405.0, active:false },
      { code:'CZK', name:'Tschech. Krone',       symbol:'Kč',  rate:25.3,  active:false },
    ],

    // ── Papierkorb (30 Tage, dann auto-gelöscht) ──
    trash: [],

    // ── Einstellungen ──
    settings: {
      currency:        'EUR',
      locale:          'de-DE',
      dateFormat:      'DD.MM.YYYY',
      theme:           'auto',
      partnerEnabled:  false,
      steuerlicheVeranlagung: 'gemeinsam',
      kinder: {
        anzahl:          0,
        kind1Alter:      0,
        kind2Alter:      0,
        kind3Alter:      0,
        ausbildungKosten: 800,
        ausbildungDauer:  4,
      },
      oneDrive: {
        enabled:    false,
        autoSync:   false,
        lastSync:   null,
        remotePath: '/Finanzplaner/Backups/',
        clientId:   null,
        tenantId:   'common',
      },
      githubSync: {
        enabled:   false,
        autoSync:  true,
        owner:     null,
        lastSync:  null,
      },
      deletedSystemCats: [],
    },

    // ── ESPP (Employee Stock Purchase Plan) ──
    espp: {
      settings: {
        ticker:           '',     // Aktien-Ticker für Alpha Vantage GLOBAL_QUOTE
        rabatt:           15,     // % Rabatt auf Kaufkurs
        eurUsdKurs:       1.10,   // EUR/USD Kursannahme
        aktuellerKursUsd: null,   // aktueller Marktpreis (überschreibt Kaufkurs im Depotwert)
        grenzsteuersatz:  42,     // % Grenzsteuersatz
        rabattFreibetrag: 2000,   // §8 Abs. 3 EStG — Freibetrag pro Jahr
      },
      zyklen: [],
    },

    // ── App-Log (max. 200 Einträge, älteste werden verdrängt) ──
    log: [],
  };
}

// ═══════════════════════════════════════════════════════════════
// HILFSFUNKTIONEN
// ═══════════════════════════════════════════════════════════════

function generateId(prefix) {
  const ts  = Date.now().toString(36);
  const rnd = Math.random().toString(36).slice(2, 7);
  return `${prefix || 'id'}_${ts}_${rnd}`;
}

/** Datum-Format DD.MM.YYYY → Date-Objekt */
function parseDate(str) {
  if (!str) return null;
  // Format MM.YYYY (Monat.Jahr)
  const m1 = str.match(/^(\d{2})\.(\d{4})$/);
  if (m1) {
    const mon = parseInt(m1[1]), yr = parseInt(m1[2]);
    if (mon < 1 || mon > 12 || yr < 1900 || yr > 2200) return null;
    return new Date(yr, mon - 1, 1);
  }
  // Format DD.MM.YYYY
  const m2 = str.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (m2) {
    const day = parseInt(m2[1]), mon = parseInt(m2[2]), yr = parseInt(m2[3]);
    if (mon < 1 || mon > 12 || day < 1 || day > 31 || yr < 1900 || yr > 2200) return null;
    const d = new Date(yr, mon - 1, day);
    if (d.getMonth() !== mon - 1) return null; // ungültiges Datum (z.B. 31.02.)
    return d;
  }
  return null;
}

/** Aktuelles Monat als MM.YYYY */
function currentMonthStr() {
  const d = new Date();
  return String(d.getMonth() + 1).padStart(2, '0') + '.' + d.getFullYear();
}

/** Alle Monate von MM.YYYY bis MM.YYYY als Array */
function monthRange(from, to) {
  const start = parseDate(from);
  const end   = to ? parseDate(to) : new Date();
  if (!start) return [];
  const months = [];
  const cur = new Date(start);
  while (cur <= end) {
    months.push(
      String(cur.getMonth() + 1).padStart(2, '0') + '.' + cur.getFullYear()
    );
    cur.setMonth(cur.getMonth() + 1);
  }
  return months;
}

/** Runde auf 2 Dezimalstellen */
function r2(n) { return Math.round((n || 0) * 100) / 100; }

// ═══════════════════════════════════════════════════════════════
// MIGRATION
// ═══════════════════════════════════════════════════════════════

// Bekannte Währungen für Dropdown-Auswahl (code, name, symbol)
const KNOWN_CURRENCIES = [
  { code:'AED', name:'Dirham (VAE)',          symbol:'د.إ' },
  { code:'AFN', name:'Afghan. Afghani',       symbol:'؋'   },
  { code:'ALL', name:'Alban. Lek',            symbol:'L'   },
  { code:'AMD', name:'Armen. Dram',           symbol:'֏'   },
  { code:'ANG', name:'Niederl.-Ant. Gulden',  symbol:'ƒ'   },
  { code:'AOA', name:'Angola. Kwanza',        symbol:'Kz'  },
  { code:'ARS', name:'Argent. Peso',          symbol:'$'   },
  { code:'AUD', name:'Austral. Dollar',       symbol:'A$'  },
  { code:'AWG', name:'Arub. Florin',          symbol:'ƒ'   },
  { code:'AZN', name:'Aserbaidsch. Manat',    symbol:'₼'   },
  { code:'BAM', name:'Bosnisch. Mark',        symbol:'KM'  },
  { code:'BBD', name:'Barbados-Dollar',       symbol:'Bds$'},
  { code:'BDT', name:'Banglade. Taka',        symbol:'৳'   },
  { code:'BGN', name:'Bulgar. Lew',           symbol:'лв'  },
  { code:'BHD', name:'Bahrain. Dinar',        symbol:'BD'  },
  { code:'BIF', name:'Burund. Franc',         symbol:'Fr'  },
  { code:'BMD', name:'Bermuda-Dollar',        symbol:'$'   },
  { code:'BND', name:'Brunei-Dollar',         symbol:'B$'  },
  { code:'BOB', name:'Boliv. Boliviano',      symbol:'Bs.' },
  { code:'BRL', name:'Brasil. Real',          symbol:'R$'  },
  { code:'BSD', name:'Bahama-Dollar',         symbol:'B$'  },
  { code:'BTN', name:'Bhutan. Ngultrum',      symbol:'Nu'  },
  { code:'BWP', name:'Botswana-Pula',         symbol:'P'   },
  { code:'BYN', name:'Weißruss. Rubel',       symbol:'Br'  },
  { code:'BZD', name:'Belize-Dollar',         symbol:'BZ$' },
  { code:'CAD', name:'Kanad. Dollar',         symbol:'C$'  },
  { code:'CDF', name:'Kongoles. Franc',       symbol:'Fr'  },
  { code:'CHF', name:'Schweizer Franken',     symbol:'Fr.' },
  { code:'CLP', name:'Chile. Peso',           symbol:'$'   },
  { code:'CNY', name:'Chines. Yuan',          symbol:'¥'   },
  { code:'COP', name:'Kolumb. Peso',          symbol:'$'   },
  { code:'CRC', name:'Costaric. Colón',       symbol:'₡'   },
  { code:'CUP', name:'Kubani. Peso',          symbol:'$'   },
  { code:'CVE', name:'Kap-Verdisch. Escudo',  symbol:'Esc' },
  { code:'CZK', name:'Tschech. Krone',        symbol:'Kč'  },
  { code:'DJF', name:'Dschibut. Franc',       symbol:'Fr'  },
  { code:'DKK', name:'Dän. Krone',            symbol:'kr'  },
  { code:'DOP', name:'Domin. Peso',           symbol:'RD$' },
  { code:'DZD', name:'Alger. Dinar',          symbol:'DA'  },
  { code:'EGP', name:'Ägypt. Pfund',          symbol:'£'   },
  { code:'ERN', name:'Eritre. Nakfa',         symbol:'Nfk' },
  { code:'ETB', name:'Äthiop. Birr',          symbol:'Br'  },
  { code:'FJD', name:'Fidschi-Dollar',        symbol:'FJ$' },
  { code:'FKP', name:'Falkland-Pfund',        symbol:'£'   },
  { code:'GBP', name:'Brit. Pfund',           symbol:'£'   },
  { code:'GEL', name:'Georg. Lari',           symbol:'₾'   },
  { code:'GHS', name:'Ghana-Cedi',            symbol:'₵'   },
  { code:'GIP', name:'Gibral. Pfund',         symbol:'£'   },
  { code:'GMD', name:'Gamb. Dalasi',          symbol:'D'   },
  { code:'GNF', name:'Guinea. Franc',         symbol:'Fr'  },
  { code:'GTQ', name:'Guatemal. Quetzal',     symbol:'Q'   },
  { code:'GYD', name:'Guyana-Dollar',         symbol:'G$'  },
  { code:'HKD', name:'Hongkong-Dollar',       symbol:'HK$' },
  { code:'HNL', name:'Hondur. Lempira',       symbol:'L'   },
  { code:'HRK', name:'Kroat. Kuna',           symbol:'kn'  },
  { code:'HTG', name:'Haiti. Gourde',         symbol:'G'   },
  { code:'HUF', name:'Ungar. Forint',         symbol:'Ft'  },
  { code:'IDR', name:'Indones. Rupiah',       symbol:'Rp'  },
  { code:'ILS', name:'Israel. Schekel',       symbol:'₪'   },
  { code:'INR', name:'Ind. Rupie',            symbol:'₹'   },
  { code:'IQD', name:'Irak. Dinar',           symbol:'ع.د' },
  { code:'IRR', name:'Iran. Rial',            symbol:'﷼'   },
  { code:'ISK', name:'Island. Krone',         symbol:'kr'  },
  { code:'JMD', name:'Jamaikal. Dollar',      symbol:'J$'  },
  { code:'JOD', name:'Jordan. Dinar',         symbol:'JD'  },
  { code:'JPY', name:'Japan. Yen',            symbol:'¥'   },
  { code:'KES', name:'Kenian. Schilling',     symbol:'KSh' },
  { code:'KGS', name:'Kirg. Som',             symbol:'с'   },
  { code:'KHR', name:'Kambodsch. Riel',       symbol:'៛'   },
  { code:'KMF', name:'Komorian. Franc',       symbol:'Fr'  },
  { code:'KRW', name:'Südkore. Won',          symbol:'₩'   },
  { code:'KWD', name:'Kuwaitisch. Dinar',     symbol:'KD'  },
  { code:'KYD', name:'Cayman-Dollar',         symbol:'CI$' },
  { code:'KZT', name:'Kasachst. Tenge',       symbol:'₸'   },
  { code:'LAK', name:'Laotisch. Kip',         symbol:'₭'   },
  { code:'LBP', name:'Libanesisch. Pfund',    symbol:'L£'  },
  { code:'LKR', name:'Sri-Lanka-Rupie',       symbol:'Rs'  },
  { code:'LRD', name:'Liberian. Dollar',      symbol:'L$'  },
  { code:'LSL', name:'Lesoth. Loti',          symbol:'L'   },
  { code:'LYD', name:'Libyscher Dinar',       symbol:'LD'  },
  { code:'MAD', name:'Marokkan. Dirham',      symbol:'MAD' },
  { code:'MDL', name:'Moldau. Leu',           symbol:'L'   },
  { code:'MGA', name:'Madagass. Ariary',      symbol:'Ar'  },
  { code:'MKD', name:'Mazed. Denar',          symbol:'den' },
  { code:'MMK', name:'Myanmar-Kyat',          symbol:'K'   },
  { code:'MNT', name:'Mongol. Tögrög',        symbol:'₮'   },
  { code:'MOP', name:'Macao. Pataca',         symbol:'P'   },
  { code:'MRU', name:'Mauretan. Ouguiya',     symbol:'UM'  },
  { code:'MUR', name:'Mauritius-Rupie',       symbol:'Rs'  },
  { code:'MVR', name:'Mald. Rufiyaa',         symbol:'Rf'  },
  { code:'MWK', name:'Malawi-Kwacha',         symbol:'MK'  },
  { code:'MXN', name:'Mexik. Peso',           symbol:'$'   },
  { code:'MYR', name:'Malays. Ringgit',       symbol:'RM'  },
  { code:'MZN', name:'Mosambik. Metical',     symbol:'MT'  },
  { code:'NAD', name:'Namibia-Dollar',        symbol:'N$'  },
  { code:'NGN', name:'Nigeria. Naira',        symbol:'₦'   },
  { code:'NIO', name:'Nicarag. Córdoba',      symbol:'C$'  },
  { code:'NOK', name:'Norw. Krone',           symbol:'kr'  },
  { code:'NPR', name:'Nepal. Rupie',          symbol:'Rs'  },
  { code:'NZD', name:'Neuseel. Dollar',       symbol:'NZ$' },
  { code:'OMR', name:'Oman. Rial',            symbol:'ر.ع.'},
  { code:'PAB', name:'Panama. Balboa',        symbol:'B/.' },
  { code:'PEN', name:'Peruanisch. Sol',       symbol:'S/.' },
  { code:'PGK', name:'Papua-Neuguinea-Kina',  symbol:'K'   },
  { code:'PHP', name:'Philipp. Peso',         symbol:'₱'   },
  { code:'PKR', name:'Pakist. Rupie',         symbol:'Rs'  },
  { code:'PLN', name:'Poln. Zloty',           symbol:'zł'  },
  { code:'PYG', name:'Paragua. Guaraní',      symbol:'₲'   },
  { code:'QAR', name:'Katar. Riyal',          symbol:'ر.ق' },
  { code:'RON', name:'Rumän. Leu',            symbol:'lei' },
  { code:'RSD', name:'Serb. Dinar',           symbol:'din' },
  { code:'RUB', name:'Russ. Rubel',           symbol:'₽'   },
  { code:'RWF', name:'Ruand. Franc',          symbol:'Fr'  },
  { code:'SAR', name:'Saudi. Riyal',          symbol:'ر.س' },
  { code:'SBD', name:'Salomon. Dollar',       symbol:'SI$' },
  { code:'SCR', name:'Seychell. Rupie',       symbol:'Rs'  },
  { code:'SDG', name:'Sudan. Pfund',          symbol:'£'   },
  { code:'SEK', name:'Schwed. Krone',         symbol:'kr'  },
  { code:'SGD', name:'Singap. Dollar',        symbol:'S$'  },
  { code:'SHP', name:'St.-Helena-Pfund',      symbol:'£'   },
  { code:'SLL', name:'Sierra-Leon. Leone',    symbol:'Le'  },
  { code:'SOS', name:'Somalia. Schilling',    symbol:'Sh'  },
  { code:'SRD', name:'Surinam. Dollar',       symbol:'$'   },
  { code:'STN', name:'São-tom. Dobra',        symbol:'Db'  },
  { code:'SVC', name:'El-Salvador. Colón',    symbol:'¢'   },
  { code:'SYP', name:'Syrisch. Pfund',        symbol:'£'   },
  { code:'SZL', name:'Swasil. Lilangeni',     symbol:'L'   },
  { code:'THB', name:'Thail. Baht',           symbol:'฿'   },
  { code:'TJS', name:'Tadschik. Somoni',      symbol:'SM'  },
  { code:'TMT', name:'Turkmenis. Manat',      symbol:'T'   },
  { code:'TND', name:'Tunesisch. Dinar',      symbol:'DT'  },
  { code:'TOP', name:'Tonga. Paʻanga',        symbol:'T$'  },
  { code:'TRY', name:'Türkische Lira',        symbol:'₺'   },
  { code:'TTD', name:'Trinid. Dollar',        symbol:'TT$' },
  { code:'TWD', name:'Taiwan-Dollar',         symbol:'NT$' },
  { code:'TZS', name:'Tansania. Schilling',   symbol:'Sh'  },
  { code:'UAH', name:'Ukrain. Hrywnja',       symbol:'₴'   },
  { code:'UGX', name:'Uganda. Schilling',     symbol:'Sh'  },
  { code:'USD', name:'US-Dollar',             symbol:'$'   },
  { code:'UYU', name:'Uruguay. Peso',         symbol:'$U'  },
  { code:'UZS', name:'Usbek. Sum',            symbol:'лв'  },
  { code:'VES', name:'Venezuel. Bolívar',     symbol:'Bs.S'},
  { code:'VND', name:'Vietnam. Dong',         symbol:'₫'   },
  { code:'VUV', name:'Vanuatu. Vatu',         symbol:'Vt'  },
  { code:'WST', name:'Samoa. Tala',           symbol:'T'   },
  { code:'XAF', name:'CFA-Franc (Zentral)',   symbol:'Fr'  },
  { code:'XCD', name:'Ostkarib. Dollar',      symbol:'EC$' },
  { code:'XOF', name:'CFA-Franc (West)',      symbol:'Fr'  },
  { code:'XPF', name:'CFP-Franc (Pazifik)',   symbol:'Fr'  },
  { code:'YER', name:'Jemen. Rial',           symbol:'﷼'   },
  { code:'ZAR', name:'Südafrik. Rand',        symbol:'R'   },
  { code:'ZMW', name:'Samb. Kwacha',          symbol:'ZK'  },
  { code:'ZWL', name:'Simbab. Dollar',        symbol:'Z$'  },
];

const DEFAULT_CURRENCIES = [
  { code:'USD', name:'US-Dollar',        symbol:'$',   rate:1.08,  active:true  },
  { code:'GBP', name:'Brit. Pfund',      symbol:'£',   rate:0.86,  active:true  },
  { code:'CHF', name:'Schweizer Franken',symbol:'Fr.', rate:0.94,  active:true  },
  { code:'JPY', name:'Japan. Yen',       symbol:'¥',   rate:160.0, active:false },
  { code:'TRY', name:'Türkische Lira',   symbol:'₺',   rate:38.5,  active:false },
  { code:'PLN', name:'Poln. Zloty',      symbol:'zł',  rate:4.25,  active:false },
  { code:'SEK', name:'Schwed. Krone',    symbol:'kr',  rate:11.5,  active:false },
  { code:'NOK', name:'Norw. Krone',      symbol:'kr',  rate:11.8,  active:false },
  { code:'DKK', name:'Dän. Krone',       symbol:'kr',  rate:7.46,  active:false },
  { code:'CAD', name:'Kanad. Dollar',    symbol:'C$',  rate:1.48,  active:false },
  { code:'AUD', name:'Austral. Dollar',  symbol:'A$',  rate:1.65,  active:false },
  { code:'AED', name:'Dirham (VAE)',      symbol:'د.إ', rate:3.97,  active:false },
  { code:'HUF', name:'Ungar. Forint',    symbol:'Ft',  rate:405.0, active:false },
  { code:'CZK', name:'Tschech. Krone',   symbol:'Kč',  rate:25.3,  active:false },
];

const MIGRATIONS = {
  // Zukünftige Schema-Migrationen hier hinzufügen:
  // 1: (data) => { /* Upgrade v1 → v2 */ return data; },
};

function migrateStore(data) {
  let v = data?.meta?.version || 1;
  while (v < STORE_VERSION) {
    const fn = MIGRATIONS[v];
    if (fn) data = fn(data);
    v++;
    if (data.meta) data.meta.version = v;
  }
  return data;
}

// ═══════════════════════════════════════════════════════════════
// VALIDIERUNG
// ═══════════════════════════════════════════════════════════════

function validateStore(data) {
  const errors = [];
  if (!data || typeof data !== 'object')   { errors.push('Store ist kein Objekt'); return errors; }
  if (!data.meta?.version)                  errors.push('meta.version fehlt');
  if (!Array.isArray(data.transactions))    errors.push('transactions ist kein Array');
  if (!Array.isArray(data.categories))      errors.push('categories ist kein Array');
  if (!Array.isArray(data.recurring))       errors.push('recurring ist kein Array');
  if (!Array.isArray(data.assets))          errors.push('assets ist kein Array');
  if (!Array.isArray(data.objects))         errors.push('objects ist kein Array');
  if (typeof data.salary !== 'object')      errors.push('salary ist kein Objekt');

  // Transaktionen validieren
  (data.transactions || []).forEach((tx, i) => {
    if (!tx.id)         errors.push(`tx[${i}]: id fehlt`);
    if (!tx.date)       errors.push(`tx[${i}]: date fehlt`);
    if (!tx.categoryId) errors.push(`tx[${i}]: categoryId fehlt`);
    if (typeof tx.amount !== 'number') errors.push(`tx[${i}]: amount kein Number`);
  });

  return errors;
}

// ═══════════════════════════════════════════════════════════════
// STORE — LESEN & SCHREIBEN
// ═══════════════════════════════════════════════════════════════

const Store = (() => {
  let _state = null;
  let _suppressTouch = false;

  function _touch() {
    if (_state?.meta) _state.meta.lastModified = new Date().toISOString();
  }

  function _save() {
    if (!_suppressTouch) _touch();
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(_state));
    } catch(e) {
      console.error('[Store] Fehler beim Speichern:', e);
      // iOS Private Mode: localStorage.setItem() wirft SecurityError / QuotaExceededError
      if (e.name === 'SecurityError' || e.name === 'QuotaExceededError' || String(e).includes('QuotaExceeded')) {
        if (window.toast) toast('⚠ Daten konnten nicht gespeichert werden. Privater Modus oder Speicher voll.');
        return;
      }
      throw new Error('LocalStorage voll oder gesperrt.');
    }
    // Nur bei echten User-Änderungen pushen — System-Saves (suppressTouch) nicht markieren
    if (!_suppressTouch && window.GHSync) try { GHSync.schedulePush(); } catch(e) {}
  }

  function _patchSystemCategories() {
    const defaults = createDefaultStore().categories;
    const deleted = _state.settings?.deletedSystemCats || [];
    let patched = false;
    defaults.forEach(def => {
      if (deleted.includes(def.id)) return; // bewusst gelöscht — nicht wieder hinzufügen
      const exists = _state.categories.find(c => c.id === def.id);
      if (!exists) {
        _state.categories.push(def);
        patched = true;
      } else if (exists.parentId !== def.parentId) {
        // parentId nachpatchen falls Hierarchie geändert wurde
        exists.parentId = def.parentId;
        patched = true;
      }
    });
    if (patched) _save();
  }

  function load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) {
        _state = createDefaultStore();
        _save();
        return { ok: true, fresh: true };
      }
      const parsed = JSON.parse(raw);
      _state = migrateStore(parsed);
      if (!_state.trash) _state.trash = [];
      if (!_state.categoryBudgets) _state.categoryBudgets = {};
      _suppressTouch = true;
      try {
        _patchSystemCategories(); // fehlende/geänderte System-Kategorien ergänzen
        Trash.purgeOld();         // Papierkorb-Einträge älter als 30 Tage entfernen
      } finally {
        _suppressTouch = false;
      }
      const errors = validateStore(_state);
      if (errors.length > 0) {
        console.warn('[Store] Validierungsfehler:', errors);
      }
      // _suppressTouch: lastModified darf beim Laden nicht auf "jetzt" gesetzt werden —
      // nur echte User-Änderungen sollen den Timestamp setzen (Grundlage für SHA-Konflikt-Auflösung)
      _suppressTouch = true;
      _save();
      _suppressTouch = false;
      return { ok: true, fresh: false, warnings: errors };
    } catch(e) {
      console.error('[Store] Ladefehler:', e);
      _state = createDefaultStore();
      return { ok: false, error: e.message };
    }
  }

  function get() {
    if (!_state) load();
    if (!_state.espp) {
      _state.espp = { settings:{ticker:'',rabatt:15,eurUsdKurs:1.10,aktuellerKursUsd:null,grenzsteuersatz:42,rabattFreibetrag:2000}, zyklen:[] };
      _suppressTouch = true;
      _save();
      _suppressTouch = false;
    }
    return _state;
  }

  function reset() {
    _state = createDefaultStore();
    _save();
  }

  // ── App-Log (max 200 Einträge) ──
  function appLog(level, msg) {
    if (!_state) return;
    if (!Array.isArray(_state.log)) _state.log = [];
    var _n=new Date(); var ts=_n.getFullYear()+'-'+String(_n.getMonth()+1).padStart(2,'0')+'-'+String(_n.getDate()).padStart(2,'0')+' '+String(_n.getHours()).padStart(2,'0')+':'+String(_n.getMinutes()).padStart(2,'0')+':'+String(_n.getSeconds()).padStart(2,'0');
    _state.log.unshift({ ts, level, msg: msg || '' });
    if (_state.log.length > 500) _state.log.length = 500;
    var _prev = _suppressTouch;
    _suppressTouch = true;
    _save();
    _suppressTouch = _prev;
  }

  // ── Wiederkehrende Ausgaben buchen (v2.0) ──
  // Ersetzt generateFixcostTransactions.
  // Bucht alle aktiven recurring-Vorlagen für fehlende Monate.
  // Rücklagen (type:'savings') werden NICHT auto-gebucht — nur auf Anforderung.
  function generateRecurringTransactions(options = {}) {
    if (!_state) return;
    const { retroactive = false } = options;
    if (!_state.recurring) _state.recurring = [];

    const existing = new Set(
      _state.transactions
        .filter(tx => tx.source === 'recurring')
        .map(tx => `${tx.recurringId}_${tx.date}`)
    );

    const toAdd = [];
    _state.recurring
      .filter(rec => rec.type !== 'savings')   // Rücklagen nicht auto-buchen
      .forEach(rec => {
        const months = monthRange(
          retroactive ? rec.validFrom : currentMonthStr(),
          rec.validUntil
        );
        months.forEach(month => {
          const key = `${rec.id}_${month}`;
          if (!existing.has(key)) {
            toAdd.push({
              id:          generateId('tx'),
              date:        month,
              categoryId:  rec.categoryId,
              objectId:    rec.objectId  || null,
              amount:      rec.amount,
              rawName:     rec.name,
              note:        '',
              source:      'recurring',
              recurringId: rec.id,
              createdAt:   new Date().toISOString(),
            });
          }
        });
      });

    if (toAdd.length > 0) {
      _state.transactions.push(...toAdd);
      _save();
      if (toAdd.length > 0) appLog('recurring_booked', toAdd.length + ' Transaktionen gebucht');
    }
    return toAdd.length;
  }

  // Rückwärtskompatibilität
  function generateFixcostTransactions(options = {}) {
    return generateRecurringTransactions(options);
  }

  // ── Transaktionen ──
  const Transactions = {
    add(tx) {
      const full = {
        id:            generateId('tx'),
        date:          tx.date || currentMonthStr(),
        categoryId:    tx.categoryId,
        subcategoryId: tx.subcategoryId || null,
        objectId:      tx.objectId     || null,
        amount:        r2(tx.amount),
        rawName:       tx.rawName      || '',
        note:          tx.note         || '',
        source:        tx.source       || 'manual',
        sourceRef:     tx.sourceRef    || null,
        createdAt:     new Date().toISOString(),
      };
      _state.transactions.push(full);
      _save();
      return full;
    },

    update(id, changes) {
      const idx = _state.transactions.findIndex(tx => tx.id === id);
      if (idx < 0) return null;
      if (changes.amount !== undefined) changes.amount = r2(changes.amount);
      _state.transactions[idx] = { ..._state.transactions[idx], ...changes };
      _save();
      return _state.transactions[idx];
    },

    delete(id) {
      const len = _state.transactions.length;
      _state.transactions = _state.transactions.filter(tx => tx.id !== id);
      if (_state.transactions.length < len) { _save(); return true; }
      return false;
    },

    /** Bulk-Zuordnung: objectId auf gefilterte Transaktionen setzen */
    bulkAssignObject(filter, objectId) {
      let count = 0;
      _state.transactions.forEach(tx => {
        const matchCat  = !filter.categoryId || tx.categoryId === filter.categoryId;
        const matchYear = !filter.year       || tx.date.endsWith('.' + filter.year);
        const matchSrc  = !filter.source     || tx.source === filter.source;
        if (matchCat && matchYear && matchSrc) {
          tx.objectId = objectId;
          count++;
        }
      });
      if (count > 0) _save();
      return count;
    },

    getAll()                { return _state.transactions; },
    getById(id)             { return _state.transactions.find(tx => tx.id === id); },
  };

  // ── Kategorien ──
  const Categories = {
    getAll()          { return _state.categories; },
    getVisible()      { return _state.categories.filter(c => !c.hidden); },
    getMain()         { return _state.categories.filter(c => !c.parentId && !c.hidden); },
    getSubs(parentId) { return _state.categories.filter(c => c.parentId === parentId && !c.hidden); },

    add(cat) {
      const full = {
        id:          generateId('cat'),
        name:        cat.name,
        parentId:    cat.parentId    || null,
        group:       cat.group       || 'freizeit',
        color:       cat.color       || '#6B7280',
        hidden:      false,
        sortOrder:   _state.categories.length + 1,
        source:      cat.source      || 'user',
        showInInput: cat.showInInput !== false,
      };
      _state.categories.push(full);
      _save();
      appLog('KATEGORIE', 'Neu: ' + full.name + (full.parentId ? ' (Unterkategorie)' : ''));
      return full;
    },

    hide(id) {
      const cat = _state.categories.find(c => c.id === id);
      if (cat) { cat.hidden = true; _save(); appLog('KATEGORIE', 'Ausgeblendet: ' + cat.name); }
    },

    show(id) {
      const cat = _state.categories.find(c => c.id === id);
      if (cat) { cat.hidden = false; _save(); appLog('KATEGORIE', 'Eingeblendet: ' + cat.name); }
    },

    update(id, changes) {
      const cat = _state.categories.find(c => c.id === id);
      if (!cat) return null;
      Object.assign(cat, changes);
      _save();
      appLog('KATEGORIE', 'Geändert: ' + cat.name);
      return cat;
    },

    delete(id) {
      const cat = _state.categories.find(c => c.id === id);
      if (!cat) return;
      if (cat.source === 'system') {
        if (!_state.settings.deletedSystemCats) _state.settings.deletedSystemCats = [];
        if (!_state.settings.deletedSystemCats.includes(id)) _state.settings.deletedSystemCats.push(id);
        _state.categories.filter(c => c.parentId === id).forEach(sub => {
          if (!_state.settings.deletedSystemCats.includes(sub.id)) _state.settings.deletedSystemCats.push(sub.id);
        });
      }
      // Papierkorb: erst Unterkategorien, dann Hauptkategorie
      _state.categories.filter(c => c.parentId === id).forEach(sub => Trash._add('category', sub));
      Trash._add('category', cat);
      _state.categories = _state.categories.filter(c => c.id !== id && c.parentId !== id);
      _save();
      appLog('KATEGORIE', 'Gelöscht: ' + cat.name);
    },

    /** Findet oder erstellt Kategorie anhand des Namens (für Import) */
    findOrCreate(name, parentName) {
      if (!name) return null;
      const nameLower = name.trim().toLowerCase();
      let cat = _state.categories.find(c => c.name.toLowerCase() === nameLower);
      if (!cat) {
        let parentId = null;
        if (parentName) {
          const parent = _state.categories.find(c =>
            c.name.toLowerCase() === parentName.trim().toLowerCase() && !c.parentId
          );
          if (parent) parentId = parent.id;
        }
        cat = Categories.add({ name: name.trim(), parentId });
      }
      return cat;
    },
  };

  // ── Objekte ──
  const Objects = {
    getAll()          { return _state.objects; },
    getActive()       { return _state.objects.filter(o => o.status === 'aktiv'); },
    getInputVisible() { return _state.objects.filter(o => o.status === 'aktiv' && !o.hideFromInput); },
    getArchived()     { return _state.objects.filter(o => o.status === 'archiviert'); },
    getById(id)       { return _state.objects.find(o => o.id === id); },

    add(obj) {
      const full = {
        id:          generateId('obj'),
        name:        obj.name,
        type:        obj.type        || 'sonstiges',
        description: obj.description || '',
        startDate:   obj.startDate   || currentMonthStr(),
        endDate:     obj.endDate     || null,
        icon:        obj.icon        || '📁',
        color:       obj.color       || '#6B7280',
        status:      'aktiv',
      };
      _state.objects.push(full);
      _save();
      return full;
    },

    archive(id) {
      const obj = _state.objects.find(o => o.id === id);
      if (obj) {
        obj.status  = 'archiviert';
        obj.endDate = obj.endDate || currentMonthStr();
        _save();
      }
    },

    update(id, changes) {
      const obj = _state.objects.find(o => o.id === id);
      if (!obj) return null;
      Object.assign(obj, changes);
      _save();
      return obj;
    },

    delete(id) {
      const obj = _state.objects.find(o => o.id === id);
      if (!obj) return;
      Trash._add('object', obj);
      _state.objects = _state.objects.filter(o => o.id !== id);
      _save();
    },
  };

  // ── Gehalt ──
  const Salary = {
    set(personId, month, data) {
      if (!_state.salary[personId]) _state.salary[personId] = {};
      _state.salary[personId][month] = {
        grossSalary: r2(data.grossSalary || 0),
        netSalary:   r2(data.netSalary   || 0),
        grossBonus:  r2(data.grossBonus  || 0),
        netBonus:    r2(data.netBonus    || 0),
        note:        data.note           || '',
      };
      _save();
    },

    get(personId, month) {
      return _state.salary[personId]?.[month] || null;
    },

    /** Kopiert einen Monat auf alle anderen Monate des gleichen Jahres */
    copyToYear(personId, sourceMonth) {
      const year = sourceMonth.split('.')[1];
      const src  = _state.salary[personId]?.[sourceMonth];
      if (!src || !year) return 0;
      let count = 0;
      MONATE_KURZ.forEach((_, i) => {
        const m = String(i + 1).padStart(2, '0') + '.' + year;
        if (m !== sourceMonth) {
          Salary.set(personId, m, { ...src, grossBonus:0, netBonus:0 });
          count++;
        }
      });
      return count;
    },

    getYear(personId, year) {
      const all = _state.salary[personId] || {};
      const result = {};
      Object.entries(all).forEach(([month, data]) => {
        if (month.endsWith('.' + year)) result[month] = data;
      });
      return result;
    },
  };

  // ── Assets ──
  const Assets = {
    getAll()          { return _state.assets; },
    getActive()       { return _state.assets.filter(a => a.status === 'aktiv'); },
    getById(id)       { return _state.assets.find(a => a.id === id); },

    addSnapshot(assetId, date, value, shares) {
      const asset = _state.assets.find(a => a.id === assetId);
      if (!asset) return null;
      // Überschreibe falls gleicher Monat vorhanden
      const idx = asset.snapshots.findIndex(s => s.date === date);
      const snap = { date, value: r2(value), shares: shares || null };
      if (idx >= 0) asset.snapshots[idx] = snap;
      else          asset.snapshots.push(snap);
      asset.snapshots.sort((a, b) => a.date.localeCompare(b.date));
      _save();
      return snap;
    },

    getLatestSnapshot(assetId) {
      const asset = _state.assets.find(a => a.id === assetId);
      if (!asset?.snapshots?.length) return null;
      return asset.snapshots[asset.snapshots.length - 1];
    },

    add(asset) {
      const full = {
        id:         generateId('asset'),
        name:       asset.name,
        type:       asset.type       || 'sonstiges',
        ownerId:    asset.ownerId    || 'person_1',
        wkn:        asset.wkn        || '',
        isin:       asset.isin       || '',
        currency:   asset.currency   || 'EUR',
        snapshots:  [],
        meta:       asset.meta       || {},
        dataSource: 'manual',
        apiConfig:  asset.apiConfig  || null,
        status:     'aktiv',
      };
      _state.assets.push(full);
      _save();
      return full;
    },

    update(id, changes) {
      const asset = _state.assets.find(a => a.id === id);
      if (!asset) return null;
      Object.assign(asset, changes);
      _save();
      return asset;
    },

    delete(id) {
      _state.assets = _state.assets.filter(a => a.id !== id);
      _save();
    },
  };

  // ── Freistellungsaufträge ──
  const Freistellung = {
    getAll()   { return _state.freistellungsauftraege; },
    getById(id){ return _state.freistellungsauftraege.find(f => f.id === id); },

    add(fsa) {
      const full = {
        id:          generateId('fsa'),
        institution: fsa.institution || '',
        betrag:      r2(fsa.betrag   || 0),
        personId:    fsa.personId    || 'person_1',
        validFrom:   fsa.validFrom   || currentMonthStr(),
        validUntil:  fsa.validUntil  || null,
        note:        fsa.note        || '',
      };
      _state.freistellungsauftraege.push(full);
      _save();
      return full;
    },

    update(id, changes) {
      const fsa = _state.freistellungsauftraege.find(f => f.id === id);
      if (!fsa) return null;
      if (changes.betrag !== undefined) changes.betrag = r2(changes.betrag);
      Object.assign(fsa, changes);
      _save();
      return fsa;
    },

    delete(id) {
      _state.freistellungsauftraege = _state.freistellungsauftraege.filter(f => f.id !== id);
      _save();
    },
  };

  // ── Wiederkehrende Ausgaben (v2.0) ──
  // Ersetzt fixedCosts. Kein autoGenerate-Flag mehr.
  // type: 'fixed' | 'variable' | 'savings'
  const Recurring = {
    getAll()    { return _state.recurring || []; },
    getActive() { return (_state.recurring || []).filter(r => !r.validUntil); },

    add(rec) {
      if (!_state.recurring) _state.recurring = [];
      const full = {
        id:          generateId('rec'),
        name:        rec.name,
        amount:      r2(rec.amount     || 0),
        type:        rec.type          || 'fixed',
        categoryId:  rec.categoryId    || 'cat_sonstiges',
        objectId:    rec.objectId      || null,
        personId:    rec.personId      || 'person_1',
        validFrom:   rec.validFrom     || currentMonthStr(),
        validUntil:  rec.validUntil    || null,
      };
      _state.recurring.push(full);
      _save();
      appLog('recurring_add', full.name);
      return full;
    },

    update(id, changes) {
      if (!_state.recurring) _state.recurring = [];
      const idx = _state.recurring.findIndex(r => r.id === id);
      if (idx < 0) return null;
      if (changes.amount !== undefined) changes.amount = r2(changes.amount);
      // Betragsänderung → alten Eintrag beenden, neuen anlegen (Audit-Trail)
      if (changes.amount !== undefined && changes.amount !== _state.recurring[idx].amount) {
        const old = _state.recurring[idx];
        old.validUntil = changes.validFrom || currentMonthStr();
        const newRec = { ...old, ...changes, id: generateId('rec'), validUntil: null };
        _state.recurring.push(newRec);
        _save();
        appLog('recurring_update', old.name + ' Betrag geändert');
        return newRec;
      }
      Object.assign(_state.recurring[idx], changes);
      _save();
      return _state.recurring[idx];
    },

    delete(id) {
      if (!_state.recurring) return;
      const rec = _state.recurring.find(r => r.id === id);
      if (!rec) return;
      Trash._add('recurring', rec);
      _state.recurring = _state.recurring.filter(r => r.id !== id);
      _save();
      appLog('recurring_delete', rec.name);
    },
  };

  // Rückwärtskompatibilität: FixedCosts zeigt auf Recurring
  const FixedCosts = Recurring;

  // ── Papierkorb ──
  const TRASH_TTL_DAYS = 30;
  const Trash = {
    _add(type, item) {
      if (!_state.trash) _state.trash = [];
      _state.trash.push({ id: generateId('tr'), type, item: JSON.parse(JSON.stringify(item)), deletedAt: new Date().toISOString() });
    },
    getAll()  { return _state.trash || []; },
    purgeOld() {
      if (!_state.trash?.length) return;
      const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - TRASH_TTL_DAYS);
      const before = _state.trash.length;
      _state.trash = _state.trash.filter(e => new Date(e.deletedAt) > cutoff);
      if (_state.trash.length < before) _save();
    },
    restore(trashId) {
      if (!_state.trash) return;
      const entry = _state.trash.find(e => e.id === trashId);
      if (!entry) return;
      if (entry.type === 'category')  _state.categories.push(entry.item);
      if (entry.type === 'object')    _state.objects.push(entry.item);
      if (entry.type === 'recurring') _state.recurring.push(entry.item);
      // Aus deletedSystemCats entfernen falls vorhanden
      if (entry.type === 'category' && _state.settings.deletedSystemCats) {
        _state.settings.deletedSystemCats = _state.settings.deletedSystemCats.filter(id => id !== entry.item.id);
      }
      _state.trash = _state.trash.filter(e => e.id !== trashId);
      _save();
      appLog('PAPIERKORB', 'Wiederhergestellt: ' + (entry.item.name || trashId));
    },
    permanentDelete(trashId) {
      if (!_state.trash) return;
      _state.trash = _state.trash.filter(e => e.id !== trashId);
      _save();
    },
    clear() { _state.trash = []; _save(); },
  };

  // ── Currencies ──
  const Currencies = {
    getAll()    { return _state.currencies || []; },
    getActive() { return ((_state.currencies)||[]).filter(c => c.active); },

    toggle(code) {
      const c = (_state.currencies||[]).find(c => c.code === code);
      if (c) { c.active = !c.active; _save(); }
    },

    updateRate(code, rate) {
      const c = (_state.currencies||[]).find(c => c.code === code);
      if (c) { c.rate = r2(rate); c.updatedAt = new Date().toISOString(); _save(); }
    },

    add(cur) {
      if (!_state.currencies) _state.currencies = [];
      if (_state.currencies.find(c => c.code === cur.code)) return false;
      _state.currencies.push({ code:cur.code, name:cur.name, symbol:cur.symbol||cur.code, rate:r2(cur.rate||1), active:true });
      _save(); return true;
    },

    remove(code) {
      if (!_state.currencies) return;
      _state.currencies = _state.currencies.filter(c => c.code !== code);
      _save();
    },

    // Fremdwährungsbetrag → EUR
    toEUR(amount, code) {
      if (!code || code === 'EUR') return r2(amount);
      const c = (_state.currencies||[]).find(c => c.code === code);
      return c ? r2(amount / c.rate) : r2(amount);
    },

    getSymbol(code) {
      if (!code || code === 'EUR') return '€';
      const c = (_state.currencies||[]).find(c => c.code === code);
      return c ? c.symbol : code;
    },
  };

  // ── Settings ──
  const Settings = {
    get()           { return _state.settings; },
    getBudget()     { return _state.budget; },
    getInflation()  { return _state.inflation; },
    getRetirement() { return _state.retirement; },

    setBudget(fix, frei, spar) {
      if (Math.round(fix + frei + spar) !== 100) throw new Error('Budget muss 100% ergeben');
      _state.budget = { fixPct:fix, freiPct:frei, sparPct:spar };
      _save();
    },

    getCategoryBudgets() { return _state.categoryBudgets || {}; },
    setCategoryBudget(catId, amount) {
      if (!_state.categoryBudgets) _state.categoryBudgets = {};
      _state.categoryBudgets[catId] = Math.max(0, amount);
      _save();
    },
    removeCategoryBudget(catId) {
      if (_state.categoryBudgets) delete _state.categoryBudgets[catId];
      _save();
    },

    setInflation(year, rate) {
      _state.inflation[year] = rate;
      _save();
    },

    deleteInflation(year) {
      delete _state.inflation[year];
      _save();
    },

    getApiKey(service) { return (_state.settings.apiKeys||{})[service]||''; },
    setApiKey(service, key) {
      if(!_state.settings.apiKeys) _state.settings.apiKeys={};
      _state.settings.apiKeys[service]=key;
      _save();
    },

    setOneDrive(config) {
      Object.assign(_state.settings.oneDrive, config);
      _save();
    },

    setGithubSync(config) {
      if (!_state.settings.githubSync) _state.settings.githubSync = {};
      Object.assign(_state.settings.githubSync, config);
      _save();
    },

    updateRetirementProfile(personId, changes) {
      if (!_state.retirement.profiles[personId]) return;
      deepMerge(_state.retirement.profiles[personId], changes);
      _save();
    },

    addRetirementScenario(scenario) {
      const full = {
        id:        generateId('sz'),
        name:      scenario.name,
        createdAt: new Date().toISOString(),
        overrides: scenario.overrides || {},
        isPinned:  false,
      };
      _state.retirement.scenarios.push(full);
      _save();
      return full;
    },

    updateScenarioClassReturns(scenarioId, classReturns) {
      const idx = _state.retirement.scenarios.findIndex(s => s.id === scenarioId);
      if (idx < 0) return;
      if (!_state.retirement.scenarios[idx].classReturns) _state.retirement.scenarios[idx].classReturns = {};
      Object.assign(_state.retirement.scenarios[idx].classReturns, classReturns);
      _save();
    },

    updateScenarioInflationRate(scenarioId, rate) {
      const idx = _state.retirement.scenarios.findIndex(s => s.id === scenarioId);
      if (idx < 0) return;
      if (!_state.retirement.scenarios[idx].overrides) _state.retirement.scenarios[idx].overrides = {};
      _state.retirement.scenarios[idx].overrides.inflationRate = rate;
      _save();
    },
  };

  return {
    load, get, reset, save: _save,
    appLog,
    Transactions,
    Categories,
    Objects,
    Salary,
    Assets,
    Freistellung,
    Recurring,
    FixedCosts,   // backward compat alias
    Settings,
    Currencies,
    Trash,
    generateRecurringTransactions,
    generateFixcostTransactions,  // backward compat alias
  };
})();

// ═══════════════════════════════════════════════════════════════
// BACKUP-MANAGER
// ═══════════════════════════════════════════════════════════════

const BackupManager = {
  /** Erstellt einen vollständigen Snapshot */
  create(label) {
    const store = Store.get();
    const backup = {
      _backup: {
        format:        'fpbackup',
        formatVersion: 1,
        exportedAt:    new Date().toLocaleString('de-DE'),
        appVersion:    FP_VERSION,
        storeVersion:  STORE_VERSION,
        label:         label || 'Manuell',
      },
      store,
    };
    return backup;
  },

  /** Download als .fpbackup Datei — DOM-Trigger über fp:download-Event (app.js) */
  download(label) {
    const backup   = BackupManager.create(label);
    const json     = JSON.stringify(backup, null, 2);
    const date     = new Date().toLocaleDateString('de-DE').replace(/\./g, '-');
    const time     = new Date().toLocaleTimeString('de-DE', {hour:'2-digit', minute:'2-digit', second:'2-digit'}).replace(/:/g, '-');
    const filename = `Finanzplaner_Backup_${date}_${time}.fpbackup`;
    BackupManager._saveAutoBackup(backup);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fp:download', { detail: { json, filename } }));
    }
  },

  /** Import aus .fpbackup Datei */
  import(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const raw    = JSON.parse(e.target.result);
          // Nur echte .fpbackup-Dateien akzeptieren
          if (raw._backup?.format !== 'fpbackup') {
            return reject(new Error('Ungültiges Format — nur .fpbackup-Dateien werden akzeptiert.'));
          }
          const backupStoreVersion = raw._backup?.storeVersion;
          if (backupStoreVersion && backupStoreVersion > STORE_VERSION) {
            return reject(new Error(
              `Backup zu neu (Version ${backupStoreVersion}), diese App kennt nur Version ${STORE_VERSION}. ` +
              `Bitte die aktuelle App-Version verwenden.`
            ));
          }
          const data   = raw.store || raw;
          // Grundstruktur prüfen bevor Migration
          if (!Array.isArray(data.transactions) || !Array.isArray(data.categories) || !Array.isArray(data.persons)) {
            return reject(new Error('Backup-Datei beschädigt oder unvollständig — Grundstruktur fehlt.'));
          }
          const migrated = migrateStore(data);
          const errors = validateStore(migrated);
          if (errors.length > 0) {
            return reject(new Error('Validierungsfehler: ' + errors.join(', ')));
          }
          // GitHub-Sync-Einstellungen vom aktuellen Gerät beibehalten (nicht aus Backup überschreiben)
          try {
            const currentRaw = localStorage.getItem(LS_KEY);
            if (currentRaw) {
              const currentGhSync = JSON.parse(currentRaw)?.settings?.githubSync;
              if (currentGhSync && migrated.settings) migrated.settings.githubSync = currentGhSync;
            }
          } catch(e) {}
          // Backup vor dem Import
          BackupManager._saveAutoBackup(BackupManager.create('Vor Import'));
          localStorage.setItem(LS_KEY, JSON.stringify(migrated));
          resolve({
            ok: true,
            transactions: migrated.transactions?.length || 0,
            categories:   migrated.categories?.length   || 0,
            warnings:     errors,
          });
        } catch(err) {
          reject(new Error('Datei konnte nicht gelesen werden: ' + err.message));
        }
      };
      reader.readAsText(file);
    });
  },

  /** Auto-Backup in LocalStorage (max 5) */
  _saveAutoBackup(backup) {
    try {
      let backups = JSON.parse(localStorage.getItem(BACKUP_KEY) || '[]');
      backups.unshift({
        timestamp: new Date().toISOString(),
        label:     backup._backup?.label || 'Auto',
        data:      backup,
      });
      backups = backups.slice(0, MAX_AUTO_BACKUPS);
      localStorage.setItem(BACKUP_KEY, JSON.stringify(backups));
    } catch(e) {
      console.warn('[Backup] Auto-Backup fehlgeschlagen:', e);
    }
  },

  getAutoBackups() {
    try {
      return JSON.parse(localStorage.getItem(BACKUP_KEY) || '[]');
    } catch { return []; }
  },

  restoreAutoBackup(index) {
    const backups = BackupManager.getAutoBackups();
    if (!backups[index]) throw new Error('Backup nicht gefunden');
    const data = backups[index].data?.store || backups[index].data;
    localStorage.setItem(LS_KEY, JSON.stringify(data));
    return { ok: true };
  },
};

// ═══════════════════════════════════════════════════════════════
// EXCEL-IMPORT
// ═══════════════════════════════════════════════════════════════

const ExcelImporter = {
  /**
   * Verarbeitet die Flat-Table aus dem Excel-Import.
   * Erwartet ein Array von Zeilen-Objekten:
   * { jahr, monat, monat_nr, rohname, kategorie, unterkategorie, objekt, betrag }
   */
  importRows(rows) {
    const result = {
      imported:   0,
      skipped:    0,
      duplicates: 0,
      newCats:    [],
      newObjects: [],
      errors:     [],
    };

    // Duplikat-Erkennung: existierende Excel-Transaktionen
    const existing = new Set(
      Store.Transactions.getAll()
        .filter(tx => tx.source === 'excel')
        .map(tx => `${tx.date}_${tx.rawName}_${tx.amount}`)
    );

    rows.forEach((row, i) => {
      try {
        // Validierung
        if (!row.jahr || !row.monat_nr || !row.kategorie || !row.betrag) {
          result.errors.push(`Zeile ${i + 2}: Pflichtfeld fehlt`);
          result.skipped++;
          return;
        }

        const betrag = parseFloat(String(row.betrag).replace(',', '.'));
        if (isNaN(betrag) || betrag <= 0) {
          result.errors.push(`Zeile ${i + 2}: Ungültiger Betrag "${row.betrag}"`);
          result.skipped++;
          return;
        }

        const month = String(row.monat_nr).padStart(2, '0') + '.' + row.jahr;
        const key   = `${month}_${row.rohname || ''}_${r2(betrag)}`;

        if (existing.has(key)) {
          result.duplicates++;
          return;
        }

        // Kategorie finden oder anlegen
        const cat = Store.Categories.findOrCreate(row.kategorie);
        if (!cat) { result.errors.push(`Zeile ${i + 2}: Kategorie konnte nicht angelegt werden`); result.skipped++; return; }

        // Unterkategorie
        let subCat = null;
        if (row.unterkategorie) {
          subCat = Store.Categories.findOrCreate(row.unterkategorie, row.kategorie);
        }

        // Objekt
        let obj = null;
        if (row.objekt) {
          obj = Store.Objects.getAll().find(o => o.name.toLowerCase() === row.objekt.trim().toLowerCase());
          if (!obj) {
            obj = Store.Objects.add({ name: row.objekt.trim(), type: 'sonstiges' });
            result.newObjects.push(obj.name);
          }
        }

        Store.Transactions.add({
          date:          month,
          categoryId:    cat.id,
          subcategoryId: subCat?.id || null,
          objectId:      obj?.id    || null,
          amount:        r2(betrag),
          rawName:       row.rohname || '',
          note:          '',
          source:        'excel',
        });

        existing.add(key);
        result.imported++;
      } catch(e) {
        result.errors.push(`Zeile ${i + 2}: ${e.message}`);
        result.skipped++;
      }
    });

    return result;
  },
};

// ═══════════════════════════════════════════════════════════════
// CALCULATOR — Alle Berechnungen (kein UI-Code)
// ═══════════════════════════════════════════════════════════════

// ── Deutsche Einkommensteuer 2026 (Grundtabelle, Näherung) ───────────────────
function rpCalcIncomeTax(zvE, isSplit) {
  if (isSplit) return 2 * rpCalcIncomeTax(zvE / 2, false);
  if (zvE <= 0)       return 0;
  if (zvE <= 17431)  { const y = (zvE - 12096) / 10000; return Math.max(0, (979.18 * y + 1400) * y); }
  if (zvE <= 68430)  { const z = (zvE - 17431) / 10000; return (192.59 * z + 2397) * z + 1025.38; }
  if (zvE <= 277826)   return 0.42 * zvE - 10911.92;
  return 0.45 * zvE - 19246.2;
}

// ── Netto-Berechnung aller Rentenquellen (GKV, aktuelles Recht 2026) ─────────
// type: 'gesetzlich' | 'betriebsrente' | 'ruerup' | 'bav' | 'privat'
// Quellen:
//   - Gesetzl. Rente: halber KV (DRV trägt andere Hälfte), voller PV, Kohortenversteuerung
//   - Betriebsrente/bAV: voller KV oberhalb Freibetrag (§229 SGB V), voller PV, 100% steuerpflichtig
//   - Rürup (Basis-Rente): KEINE KV/PV (kein Versorgungsbezug nach §229 SGB V), Kohortenversteuerung
//   - Private RV: KEINE KV/PV, Ertragsanteilbesteuerung nach §22 Nr.1 Satz 3 EStG
function rpCalcNetAmounts(retirementYear, amounts, opts) {
  const isSplit       = opts && opts.steuerVeranlagung === 'gemeinsam';
  const kinderAnzahl  = (opts && opts.kinderAnzahl != null) ? opts.kinderAnzahl : (opts && opts.hatKinder ? 1 : 0);

  // Besteuerungsanteil §22 Nr. 1a EStG nach JStG 2022: 2005→50%, +2%/Jahr bis 2020 (80%), +0,5%/Jahr bis 2058 (100%)
  const bA = retirementYear >= 2058 ? 1.0
           : retirementYear >  2020 ? Math.min(1.0, 0.80 + (retirementYear - 2020) * 0.005)
           : retirementYear >  2005 ? Math.min(0.80, 0.50 + (retirementYear - 2005) * 0.02)
           : 0.50;

  // Sozialversicherungssätze 2026
  const kvZusatz   = (opts && opts.kvZusatzbeitrag != null) ? opts.kvZusatzbeitrag : 2.99;
  const kvHalb     = (14.6 + kvZusatz) / 2 / 100;  // Gesetzl. Rente: Rentner zahlt Hälfte
  const kvVoll     = 0.1750;   // bAV/Versorgungsbezug: voller Satz (kein DRV-Zuschuss)
  const kvFreibetr = 197.75;   // 2026: 1/20 Bezugsgröße (€3.955), §226 SGB V
  // PV-Satz gestaffelt nach Kinderzahl (§ 55 SGB XI, ab 01.07.2025)
  const pvSatz = kinderAnzahl >= 5 ? 0.024 : kinderAnzahl === 4 ? 0.0265 : kinderAnzahl === 3 ? 0.029 : kinderAnzahl === 2 ? 0.0315 : kinderAnzahl === 1 ? 0.034 : 0.042;

  const g = amounts.gesetzlich || 0;
  const d = amounts.direkt     || 0;
  const ru = amounts.ruerup    || 0;

  // Weitere aufgeteilt: bAV-Typ (wie Betriebsrente) vs. Privat (keine KV/PV)
  const weitereArr  = amounts.weitere || [];
  const wBavTotal   = weitereArr.filter(w => w.type === 'bav').reduce((s, w) => s + (w.brutto||0), 0);
  const wPrivTotal  = weitereArr.filter(w => w.type !== 'bav').reduce((s, w) => s + (w.brutto||0), 0);
  // Ertragsanteil §22 Nr.1 Satz 3 EStG — gewichtet nach Startalter
  const _eaTable = a => a<=60?0.22:a===61?0.22:a===62?0.21:a===63?0.20:a===64?0.19:a<=66?0.18:a<=68?0.17:a===69?0.16:a<=71?0.15:0.14;
  const privArr   = weitereArr.filter(w => w.type !== 'bav');
  const ertragsanteil = wPrivTotal > 0
    ? privArr.reduce((s, w) => s + (w.brutto||0) * _eaTable(w.startAge||67), 0) / wPrivTotal
    : 0.18;

  // ── KV/PV ──
  const gKV  = g * kvHalb;
  const gPV  = g * pvSatz;

  // Aggregierter bAV-Freibetrag gilt für d + wBavTotal zusammen (§226 SGB V Abs.1 S.1)
  const gesamtBav   = d + wBavTotal;
  const kvBavBasis  = Math.max(0, gesamtBav - kvFreibetr);
  const dKV  = gesamtBav > 0 ? (d / gesamtBav) * kvBavBasis * kvVoll : 0;
  const dPV  = d * pvSatz;
  const wBKV = gesamtBav > 0 ? (wBavTotal / gesamtBav) * kvBavBasis * kvVoll : 0;
  const wBPV = wBavTotal * pvSatz;
  // Rürup & privat: keine KV/PV

  // ── Einkommensteuer ──

  const stpflichtigJahr = Math.max(0,
    (g + ru) * bA * 12          // Gesetzl. + Rürup: Kohortenversteuerung
    + (d + wBavTotal) * 12      // bAV: 100% steuerpflichtig
    + wPrivTotal * ertragsanteil * 12  // Private RV: Ertragsanteil
    - (isSplit ? 24192 : 12096) // Grundfreibetrag 2026
    - (isSplit ? 204 : 102)     // Werbungskostenpauschale §9a Abs. 1 Nr. 3 EStG
  );
  const estJahr  = rpCalcIncomeTax(stpflichtigJahr, isSplit);
  const estMonat = estJahr / 12;
  // Grenzsteuersatz für Günstigerprüfung §32d Abs. 6 EStG
  const marginalRate = stpflichtigJahr > 0
    ? (rpCalcIncomeTax(stpflichtigJahr + 1000, isSplit) - estJahr) / 1000
    : 0;

  // Steuer proportional auf Quellen verteilen
  const gesamtB = g + d + ru + wBavTotal + wPrivTotal;
  const t = x => gesamtB > 0 ? estMonat * x / gesamtB : 0;

  const gesNetto  = r2(Math.max(0, g - gKV - gPV - t(g)));
  const dirNetto  = r2(Math.max(0, d - dKV - dPV - t(d)));
  const ruNetto   = r2(Math.max(0, ru - t(ru)));
  const wBNetto   = r2(Math.max(0, wBavTotal - wBKV - wBPV - t(wBavTotal)));
  const wPNetto   = r2(Math.max(0, wPrivTotal - t(wPrivTotal)));

  // Per-Eintrag
  const weitereNettoArr = weitereArr.map(w => {
    const brutto = w.brutto || 0;
    const isBav  = w.type === 'bav';
    const pool   = isBav ? wBavTotal : wPrivTotal;
    const poolN  = isBav ? wBNetto   : wPNetto;
    return Object.assign({}, w, { netto: pool > 0 ? r2(poolN * brutto / pool) : 0 });
  });

  return {
    gesNetto, dirNetto, ruNetto,
    weitereNetto: r2(wBNetto + wPNetto),
    weitereNettoArr,
    gesamtNetto: r2(gesNetto + dirNetto + ruNetto + wBNetto + wPNetto),
    besteuerungsanteil: r2(bA * 100),
    estMonat: r2(estMonat),
    kvFreibetr,
    gKV: r2(gKV), gPV: r2(gPV),
    dKV: r2(dKV), dPV: r2(dPV),
    gesamtBrutto: r2(gesamtB),
    marginalRate: r2(marginalRate * 100) / 100,
    stpflichtigJahr,
  };
}

const Calculator = {

  // ── Monatszusammenfassung ──
  getMonthSummary(month, year) {
    const dateStr = String(month).padStart(2, '0') + '.' + year;
    const store   = Store.get();

    const txs = store.transactions.filter(tx => tx.date === dateStr);

    let fixTotal = 0, freiTotal = 0;
    const byCat = {};

    const catMap = {};
    store.categories.forEach(c => catMap[c.id] = c);

    txs.forEach(tx => {
      const cat   = catMap[tx.categoryId];
      const group = cat?.group || 'freizeit';
      if (group === 'fixkosten') fixTotal += tx.amount;
      else                       freiTotal += tx.amount;
      if (!byCat[tx.categoryId]) byCat[tx.categoryId] = { name: cat?.name || '?', group, total: 0, count: 0 };
      byCat[tx.categoryId].total += tx.amount;
      byCat[tx.categoryId].count++;
    });

    // Netto-Gehalt für diesen Monat
    const salary   = store.salary?.person_1?.[dateStr];
    const netSalary = salary?.netSalary || 0;
    const budget   = store.budget;
    const sollFix  = r2(netSalary * budget.fixPct  / 100);
    const sollFrei = r2(netSalary * budget.freiPct / 100);
    const sollSpar = r2(netSalary * budget.sparPct / 100);

    return {
      dateStr,
      month,
      year,
      totalAusgaben: r2(fixTotal + freiTotal),
      fixTotal:      r2(fixTotal),
      freiTotal:     r2(freiTotal),
      netSalary,
      sollFix,
      sollFrei,
      sollSpar,
      byCat,
      txCount: txs.length,
    };
  },

  // ── Jahresübersicht ──
  getYearSummary(year) {
    const months = {};
    let yearTotal = 0;
    for (let m = 1; m <= 12; m++) {
      const sum = Calculator.getMonthSummary(m, year);
      months[m] = sum;
      yearTotal += sum.totalAusgaben;
    }
    const nonZero = Object.values(months).filter(m => m.totalAusgaben > 0);
    return {
      year,
      months,
      yearTotal:    r2(yearTotal),
      monthlyAvg:   nonZero.length ? r2(yearTotal / nonZero.length) : 0,
    };
  },

  // ── Mehrjahres-Vergleich ──
  getMultiYearSummary(years) {
    const result = {};
    years.forEach(yr => { result[yr] = Calculator.getYearSummary(yr); });
    return result;
  },

  // ── Kategorien-Vergleich über Zeit ──
  getCategoryTrend(categoryId, fromYear, toYear) {
    const store  = Store.get();
    const points = [];
    for (let yr = fromYear; yr <= toYear; yr++) {
      for (let m = 1; m <= 12; m++) {
        const dateStr = String(m).padStart(2, '0') + '.' + yr;
        const total = store.transactions
          .filter(tx => tx.date === dateStr && tx.categoryId === categoryId)
          .reduce((s, tx) => s + tx.amount, 0);
        if (total > 0) points.push({ date: dateStr, month: m, year: yr, total: r2(total) });
      }
    }
    return points;
  },

  // ── Objekt-Auswertung ──
  getObjectSummary(objectId) {
    const store  = Store.get();
    const obj    = store.objects.find(o => o.id === objectId);
    if (!obj) return null;

    const txs = store.transactions.filter(tx => tx.objectId === objectId);

    const byCat    = {};
    const byYear   = {};
    const byMonth  = {};
    const catMap   = {};
    store.categories.forEach(c => catMap[c.id] = c);

    let total = 0;
    txs.forEach(tx => {
      total += tx.amount;

      // Nach Kategorie
      const catName = catMap[tx.categoryId]?.name || 'Unbekannt';
      if (!byCat[catName]) byCat[catName] = { total:0, count:0, color: catMap[tx.categoryId]?.color };
      byCat[catName].total += tx.amount;
      byCat[catName].count++;

      // Nach Jahr
      const yr = tx.date.split('.')[1];
      if (!byYear[yr]) byYear[yr] = 0;
      byYear[yr] += tx.amount;

      // Nach Monat
      if (!byMonth[tx.date]) byMonth[tx.date] = 0;
      byMonth[tx.date] += tx.amount;
    });

    // Runden
    Object.values(byCat).forEach(c  => { c.total  = r2(c.total);  });
    Object.keys(byYear).forEach(y   => { byYear[y] = r2(byYear[y]); });
    Object.keys(byMonth).forEach(m  => { byMonth[m]= r2(byMonth[m])});

    return {
      object:   obj,
      total:    r2(total),
      txCount:  txs.length,
      byCat,
      byYear,
      byMonth,
    };
  },

  // ── Vermögens-Übersicht ──
  getAssetSummary() {
    const store  = Store.get();
    let total    = 0;
    const byType = {};
    const items  = [];

    store.assets.filter(a => a.status === 'aktiv').forEach(asset => {
      const snap = asset.snapshots?.[asset.snapshots.length - 1];
      const val  = snap?.value || 0;
      total += val;

      if (!byType[asset.type]) byType[asset.type] = 0;
      byType[asset.type] += val;

      items.push({
        id:       asset.id,
        name:     asset.name,
        type:     asset.type,
        ownerId:  asset.ownerId,
        value:    val,
        date:     snap?.date || null,
        currency: asset.currency,
      });
    });

    // ESPP-Depot (gehaltene Zyklen) in Gesamtvermögen einbeziehen
    const espp = store.espp;
    if (espp?.zyklen?.length && espp.settings) {
      const s = espp.settings;
      let esppVal = 0;
      espp.zyklen.forEach(z => {
        if (!z.kaufkursUsd || z.verkaufskursUsd > 0) return;
        const anzahl = z.anzahlAktienOverride;
        if (!anzahl) return;
        const bewKurs = s.aktuellerKursUsd || z.kaufkursUsd;
        esppVal += r2(anzahl * bewKurs / s.eurUsdKurs);
      });
      if (esppVal > 0) {
        total += esppVal;
        byType['espp'] = (byType['espp'] || 0) + esppVal;
      }
    }

    return { total: r2(total), byType, items };
  },

  // ── Freistellungsauftrag-Übersicht ──
  getFreistellungSummary() {
    const store = Store.get();
    const isGemeinsam = store.settings.steuerlicheVeranlagung === 'gemeinsam';
    const freibetrag  = isGemeinsam ? FREIBETRAG_GEMEINSAM : FREIBETRAG_EINZEL;

    let sumPerson1 = 0, sumPerson2 = 0, sumJoint = 0;

    store.freistellungsauftraege.forEach(fsa => {
      if (fsa.personId === 'person_1')  sumPerson1 += fsa.betrag;
      else if (fsa.personId === 'person_2') sumPerson2 += fsa.betrag;
      else if (fsa.personId === 'joint')    sumJoint   += fsa.betrag;
    });

    const gesamt    = r2(sumPerson1 + sumPerson2 + sumJoint);
    const verfuegbar = r2(Math.max(0, freibetrag - gesamt));

    return {
      freibetrag,
      sumPerson1:  r2(sumPerson1),
      sumPerson2:  r2(sumPerson2),
      sumJoint:    r2(sumJoint),
      gesamt,
      verfuegbar,
      ausgeschoepft: gesamt >= freibetrag,
      items: store.freistellungsauftraege,
    };
  },

  // ── Gehalt-Auswertung ──
  getSalaryYear(personId, year) {
    const byMonth  = Store.Salary.getYear(personId, year);
    let grossTotal = 0, netTotal = 0, bonusGross = 0, bonusNet = 0;
    Object.values(byMonth).forEach(m => {
      grossTotal += m.grossSalary;
      netTotal   += m.netSalary;
      bonusGross += m.grossBonus;
      bonusNet   += m.netBonus;
    });
    return {
      year,
      byMonth,
      grossTotal:   r2(grossTotal),
      netTotal:     r2(netTotal),
      bonusGross:   r2(bonusGross),
      bonusNet:     r2(bonusNet),
      monthlyNet:   r2(netTotal / 12),
    };
  },

  // ── Reallohn vs. Inflation ──
  getRealWageHistory(personId) {
    const store     = Store.get();
    const salaryData = store.salary[personId] || {};
    const inflation  = store.inflation || {};

    // Jahres-Nettowerte ermitteln
    const yearData = {};
    Object.entries(salaryData).forEach(([month, data]) => {
      const yr = month.split('.')[1];
      if (!yearData[yr]) yearData[yr] = { netTotal:0, months:0 };
      yearData[yr].netTotal += data.netSalary;
      yearData[yr].months++;
    });

    const years = Object.keys(yearData).sort();
    if (years.length < 2) return [];

    const baseYear   = years[0];
    const baseNet    = yearData[baseYear].netTotal / (yearData[baseYear].months || 12);
    let cumulativeInfl = 1.0;

    return years.map(yr => {
      if (yr > baseYear) {
        cumulativeInfl *= (1 + (inflation[parseInt(yr)] || 0) / 100);
      }
      const monthlyNet = yearData[yr].netTotal / (yearData[yr].months || 12);
      const nominal    = baseNet > 0 ? (monthlyNet - baseNet) / baseNet * 100 : 0;
      const real       = baseNet > 0 ? (monthlyNet / (baseNet * cumulativeInfl) - 1) * 100 : 0;
      return {
        year:           parseInt(yr),
        monthlyNet:     r2(monthlyNet),
        nominalChange:  r2(nominal),
        realChange:     r2(real),
        inflCumulative: r2((cumulativeInfl - 1) * 100),
      };
    });
  },

  // ── Rentenplanung ──
  calcRente(personId, scenarioId) {
    const store    = Store.get();
    const profile  = store.retirement.profiles[personId];
    if (!profile) return null;

    const baseAssumptions = store.retirement.assumptions;
    const scenario = store.retirement.scenarios.find(s => s.id === scenarioId)
                  || store.retirement.scenarios.find(s => s.isPinned)
                  || { overrides: {} };

    // Merge: profile always wins (targetRetirementAge etc. from sidebar, not scenario)
    const p = {
      ...baseAssumptions,
      ...scenario.overrides,
      ...profile,
    };

    const person       = store.persons.find(pe => pe.id === personId);
    const _rawYear  = person?.birthDate ? parseInt(person.birthDate.split('.').pop()) : NaN;
    const birthYear = (_rawYear >= 1900 && _rawYear <= 2100) ? _rawYear : 1988;
    const currentYear  = new Date().getFullYear();
    const currentAge   = currentYear - birthYear;
    const yearsToRetire = p.targetRetirementAge - currentAge;

    // Gesetzliche Rente berechnen
    const rente    = profile.gesetzlicheRente;

    // EP/Jahr: Auto aus Gehaltsdaten oder manueller Override
    const epMode = profile.epPerYearMode || 'auto';
    let epPerYear = rente.estimatedNewPointsPerYear || 1.8;
    if (epMode === 'auto') {
      const a2 = baseAssumptions || {};
      const durchschnitt = a2.durchschnittsentgelt || 45538;
      const bbg = a2.bbgRvJahr || 96600;
      const salData = (store.salary && store.salary[personId]) || {};
      const salKeys = Object.keys(salData).sort((a,b)=>{
        const [ma,ya]=[parseInt(a.split('.')[0]),parseInt(a.split('.')[1])];
        const [mb,yb]=[parseInt(b.split('.')[0]),parseInt(b.split('.')[1])];
        return (ya*100+ma)-(yb*100+mb);
      });
      const last12 = salKeys.slice(-12);
      const totalGross = last12.reduce((s,k)=>s+(salData[k].grossSalary||0),0);
      if (totalGross > 0) {
        const annualGross = totalGross * (12 / last12.length);
        epPerYear = Math.round(Math.min(annualGross, bbg) / durchschnitt * 100) / 100;
      }
    }

    // Hochrechnung ab dataDate (nicht ab heute) — vermeidet Doppelzählung bereits akkumulierter Punkte
    let yearsForPoints = yearsToRetire;
    if (rente.dataDate) {
      const m = rente.dataDate.match(/^(\d{1,2})\.(\d{4})$/);
      if (m) {
        const dataYear  = parseInt(m[2]);
        const dataMonth = parseInt(m[1]);
        const now       = new Date();
        const sinceData = (now.getFullYear() - dataYear) + (now.getMonth() + 1 - dataMonth) / 12;
        yearsForPoints  = yearsToRetire + Math.max(0, sinceData);
      }
    }
    const punkteBeiRente = rente.currentEntgeltpunkte
                         + (epPerYear * Math.max(0, yearsForPoints));
    const regularRetirementAge = p.regularRetirementAge || 67;
    const abstandMonate = (regularRetirementAge - p.targetRetirementAge) * 12;
    let zugangsfaktor;
    if (rente.zugangsfaktorOverride !== null) {
      zugangsfaktor = rente.zugangsfaktorOverride;
    } else if (abstandMonate > 0) {
      // 0,3% Abschlag pro Monat vor Regelrentenalter (§ 77 SGB VI)
      zugangsfaktor = Math.max(0.5, 1.0 - abstandMonate * 0.003);
    } else {
      // 0,5% Zuschlag pro Monat nach Regelrentenalter (§ 77 Abs. 2 SGB VI)
      zugangsfaktor = 1.0 + Math.abs(abstandMonate) * 0.005;
    }

    const gesetzlicheMonatsrenteBrutto = r2(
      punkteBeiRente * zugangsfaktor * rente.rentenwertWest
    );

    const retirementYear = currentYear + Math.max(0, yearsToRetire);

    // Depot-Projektion: Immobilien + Sonstiges ausgeschlossen; Rendite pro Asset-Klasse aus Szenario
    const NICHT_DEPOT = ['immobilie', 'sonstiges'];
    const CR_DEFAULTS = { etf:7, aktie:7, fonds:7, geldmarkt:2.5, tagesgeld:2, girokonto:0, espp:7, rsu:7 };
    const classReturns = Object.assign({}, CR_DEFAULTS, scenario.classReturns || {});
    const depot       = Calculator.getAssetSummary();
    // Depot nach Eigentümer aufteilen: eigene Assets 100%, gemeinsame 50%
    const depotItems  = depot.items
      .filter(i => !NICHT_DEPOT.includes(i.type))
      .filter(i => (i.ownerId || 'person_1') === personId || i.ownerId === 'joint')
      .map(i => i.ownerId === 'joint' ? Object.assign({}, i, { value: r2(i.value * 0.5) }) : i);
    const depotStart  = r2(depotItems.reduce((s, i) => s + i.value, 0));
    const totalWeight = depotStart || 1;
    const weightedReturn = depotItems.reduce((s, item) => {
      const rate = classReturns[item.type] !== undefined ? classReturns[item.type] : (classReturns.etf || 7);
      return s + (item.value / totalWeight) * rate;
    }, 0);
    const monthlyReturn = Math.pow(1 + weightedReturn / 100, 1/12) - 1;

    const _now = new Date();
    // Sparraten: savingsPlans nach personId filtern (kein personId → Person 1); asset.monthlyPlan nach ownerId filtern
    const monthlySavings = ((store.savingsPlans || [])
          .filter(sp => (sp.personId || 'person_1') === personId)
          .filter(sp => !sp.validUntil || new Date(sp.validUntil) > _now)
          .reduce((s, sp) => s + sp.monthlyAmount, 0))
      + (store.assets || [])
        .filter(a => a.status === 'aktiv' && a.monthlyPlan > 0)
        .filter(a => (a.ownerId || 'person_1') === personId || a.ownerId === 'joint')
        .reduce((s, a) => s + a.monthlyPlan * (a.ownerId === 'joint' ? 0.5 : 1), 0);

    const gehaltsSteigerung = profile.gehaltsSteigerung != null ? profile.gehaltsSteigerung : 2.0;

    // Kinder-Daten aus Settings
    const kSet = store.settings?.kinder || {};
    const kinderAnzahl = kSet.anzahl || 0;
    const kinderAlter  = [kSet.kind1Alter||0, kSet.kind2Alter||0, kSet.kind3Alter||0].slice(0, kinderAnzahl);
    const kKosten  = profile.kinderKostenOverride != null ? profile.kinderKostenOverride : (kSet.ausbildungKosten || 800);
    const kDauer   = profile.kinderDauerOverride  != null ? profile.kinderDauerOverride  : (kSet.ausbildungDauer  || 4);

    // Erbimmobilie aus Profil
    const erb = profile.erbimmobilie || {};

    const targetAge = p.targetRetirementAge;
    // Einmalige RV-Auszahlungen vorab berechnen (werden in Akkumulation + Rente injiziert)
    const weitereEinmalig = (profile.weitereRentenversicherungen || [])
      .filter(rv => rv.modus === 'einmalig')
      .map(rv => {
        const ertrag = Math.max(0, (rv.einmalbetrag||0) - (rv.eigenbeitraege||0));
        let steuer = 0;
        // bAV einmalig: §22 Nr. 5 EStG — voller Betrag steuerpflichtig (nicht nur Ertrag)
        if (rv.type === 'bav') steuer = (rv.einmalbetrag||0) * ((rv.persSteuersatz||42)/100);
        else if (rv.steuermodell === 'halbeinkuenfte') steuer = ertrag * 0.5 * ((rv.persSteuersatz||25)/100);
        else if (rv.steuermodell === 'abgeltung')  steuer = ertrag * 0.26375;
        return {
          name: rv.name || 'Einmalig', startAge: rv.startAge || 67,
          nettoEinmalig: r2(Math.max(0, (rv.einmalbetrag||0) - steuer)),
          vorRente: (rv.startAge || 67) <= targetAge,
        };
      });

    let depotAtRetire = depotStart;
    let kinderGesamtkosten = 0;
    const monthsToRetire = Math.max(0, yearsToRetire * 12);
    const verlaufAnspar = [{ alter: currentAge, depot: Math.round(depotStart) }];
    for (let i = 0; i < monthsToRetire; i++) {
      const yearFromNow = i / 12;
      // Kinder: Ausbildungskosten während 18–(18+kDauer), inflationsbereinigt
      let kinderAbzug = 0;
      const inflFaktor = Math.pow(1 + (p.inflationRate||2.3) / 100, yearFromNow);
      kinderAlter.forEach(alter => {
        const ageNow = alter + yearFromNow;
        if (ageNow >= 18 && ageNow < 18 + kDauer) kinderAbzug += kKosten * inflFaktor;
      });
      kinderGesamtkosten += kinderAbzug;
      // Erbimmobilie: Verkauf einmalig in Jahr erbInJahren; Miete laufend ab erbInJahren
      let erbBonus = 0;
      if (erb.enabled) {
        const erbJahr = erb.inJahren || 15;
        if (erb.modus === 'verkauf') {
          if (i >= erbJahr * 12 && i < erbJahr * 12 + 1) erbBonus = erb.wert || 0;
        } else if (erb.modus === 'miete' && i >= erbJahr * 12) {
          erbBonus = erb.miete || 0;
        }
      }
      // Einmalige RV-Auszahlungen, die vor Rentenbeginn anfallen
      let einmaligBonus = 0;
      weitereEinmalig.filter(rv => rv.vorRente).forEach(rv => {
        const rvMo = Math.round((rv.startAge - currentAge) * 12);
        if (i >= rvMo && i < rvMo + 1) einmaligBonus += rv.nettoEinmalig;
      });
      const savingsThisMonth = monthlySavings * Math.pow(1 + gehaltsSteigerung / 100, yearFromNow);
      depotAtRetire = depotAtRetire * (1 + monthlyReturn) + savingsThisMonth - kinderAbzug + erbBonus + einmaligBonus;
      if ((i + 1) % 12 === 0) verlaufAnspar.push({ alter: currentAge + Math.round((i + 1) / 12), depot: Math.round(Math.max(0, depotAtRetire)) });
    }
    depotAtRetire = r2(Math.max(0, depotAtRetire));
    // Einmalige Auszahlungen genau bei Rentenbeginn (rvMo == monthsToRetire, daher im Loop nicht erfasst)
    weitereEinmalig.filter(rv => rv.vorRente).forEach(rv => {
      if (Math.round((rv.startAge - currentAge) * 12) >= monthsToRetire) depotAtRetire += rv.nettoEinmalig;
    });
    depotAtRetire = r2(Math.max(0, depotAtRetire));

    // Einnahmen — mit startAge-Bewusstsein
    const direktzusageBrutto   = profile.direktzusage?.monthlyAmountAtStart || 0;
    const direktzusageStartAge = profile.direktzusage?.startAge || targetAge;
    const direktzusageAktiv    = direktzusageStartAge <= targetAge;

    const ruerupBrutto   = profile.ruerupRente?.monthlyAmountAtStart || 0;
    const ruerupStartAge = profile.ruerupRente?.startAge || 67;
    const ruerupAktiv    = ruerupStartAge <= targetAge;

    // Weitere Rentenversicherungen — monatlich: laufendes Einkommen; einmalig: Kapitalabfindung
    const weitereQuellen = (profile.weitereRentenversicherungen || [])
      .filter(rv => (rv.modus || 'monatlich') === 'monatlich')
      .map(rv => ({
        name:     rv.name || 'Weitere',
        brutto:   rv.monthlyAmountAtStart || 0,
        startAge: rv.startAge || 67,
        type:     rv.type || 'privat',
        aktiv:    (rv.startAge || 67) <= targetAge,
      }));
    const weitereBrutto = weitereQuellen.reduce((s, rv) => s + rv.brutto, 0);

    // Bonusse nach Rentenbeginn: Erbimmobilie-Verkauf + einmalige RV-Auszahlungen nach Rente
    const postRetBonusMonate = [];
    if (erb.enabled && erb.modus === 'verkauf') {
      const erbRenteMo = Math.round((erb.inJahren||15)*12 - monthsToRetire);
      if (erbRenteMo >= 0) postRetBonusMonate.push({ monat: erbRenteMo, wert: erb.wert||0 });
    }
    weitereEinmalig.filter(rv => !rv.vorRente).forEach(rv =>
      postRetBonusMonate.push({ monat: Math.round((rv.startAge - targetAge)*12), wert: rv.nettoEinmalig })
    );

    // ── Netto-Berechnung via rpCalcNetAmounts (GKV, aktuelles Recht 2026) ──
    const netResult = rpCalcNetAmounts(retirementYear, {
      gesetzlich: gesetzlicheMonatsrenteBrutto,
      direkt:     direktzusageBrutto,
      ruerup:     ruerupBrutto,
      weitere:    weitereQuellen.map(rv => ({ brutto: rv.brutto, type: rv.type, startAge: rv.startAge })),
    }, {
      kinderAnzahl:      kinderAnzahl,
      steuerVeranlagung: store.settings.steuerlicheVeranlagung || 'einzeln',
      kvZusatzbeitrag:   store.retirement?.assumptions?.kvZusatzbeitrag ?? 2.99,
    });
    // Manuelle Overrides (nur wenn Nutzer explizit Netto-Faktor gesetzt hat)
    const gesetzlicheMonatsrente = p.netFactorGesetzlich != null
      ? r2(gesetzlicheMonatsrenteBrutto * p.netFactorGesetzlich / 100)
      : netResult.gesNetto;
    const direktzusageMonatlich  = p.netFactorBetriebsrente != null
      ? r2(direktzusageBrutto * p.netFactorBetriebsrente / 100)
      : netResult.dirNetto;
    const ruerupMonatlich        = p.netFactorRuerup != null
      ? r2(ruerupBrutto * p.netFactorRuerup / 100)
      : netResult.ruNetto;
    const weitereQuellennetto    = weitereQuellen.map((rv, i) => {
      const wn = netResult.weitereNettoArr[i];
      const calcNetto = wn ? wn.netto : 0;
      return Object.assign({}, rv, { netto: p.netFactorBetriebsrente != null
        ? r2(rv.brutto * p.netFactorBetriebsrente / 100)
        : calcNetto });
    });
    const weitereMonatlich = weitereQuellennetto.reduce((s, rv) => s + rv.netto, 0);

    // Sofort-Einkommen (nur Quellen, die ab targetAge aktiv sind)
    const gesamtEinkommen = r2(
      gesetzlicheMonatsrente
      + (direktzusageAktiv ? direktzusageMonatlich : 0)
      + (ruerupAktiv ? ruerupMonatlich : 0)
      + weitereQuellennetto.filter(rv => rv.aktiv).reduce((s, rv) => s + rv.netto, 0)
    );

    // Volleinkommen (alle Quellen aktiv — spätestens ab höchstem startAge)
    const gesamtEinkommenVoll = r2(
      gesetzlicheMonatsrente + direktzusageMonatlich + ruerupMonatlich + weitereMonatlich
    );

    const gesamtBrutto = r2(
      gesetzlicheMonatsrenteBrutto + direktzusageBrutto + ruerupBrutto + weitereBrutto
    );

    // Aufgeschobene Quellen für UI-Anzeige
    const deferredSources = [];
    if (!direktzusageAktiv && direktzusageBrutto > 0)
      deferredSources.push({ name:'Betriebsrente', startAge:direktzusageStartAge, netto:direktzusageMonatlich });
    if (!ruerupAktiv && ruerupBrutto > 0)
      deferredSources.push({ name:'Rürup-Rente', startAge:ruerupStartAge, netto:ruerupMonatlich });
    weitereQuellennetto.filter(rv => !rv.aktiv).forEach(rv =>
      deferredSources.push({ name:rv.name, startAge:rv.startAge, netto:rv.netto }));

    // Ausgaben: manueller Override > Auto-Durchschnitt letzte 12 Monate > Profil-Default (nur person_1 fällt auf 4000 zurück)
    let ausgaben = p.monthlyExpenseInRetirement != null ? p.monthlyExpenseInRetirement : (personId === 'person_1' ? 4000 : 0);
    if (profile.ausgabenOverride != null) {
      ausgaben = profile.ausgabenOverride;
    } else if (p.monthlyExpenseInRetirement == null) {
      const avg = rpCalcAusgabenAvg();
      if (avg > 0) ausgaben = avg;
    }

    // Erbimmobilie Miete: nach Rente als monatliches Einkommen
    const erbMieteMonatlich = (erb.enabled && erb.modus === 'miete') ? (erb.miete || 0) : 0;

    // Rentenlücke — auf Sofort-Einkommen (ungünstigster Fall)
    const ausgabenEffektiv = ausgaben;
    const luecke       = r2(Math.max(0, ausgabenEffektiv - gesamtEinkommen - erbMieteMonatlich));
    const lueckeVoll   = r2(Math.max(0, ausgaben - gesamtEinkommenVoll - erbMieteMonatlich));

    const inflMonthly = Math.pow(1 + (p.inflationRate||2.3) / 100, 1/12) - 1;
    let depotMonate = 0;
    if (luecke > 0) {
      let d = depotAtRetire;
      let lueckeInfl = luecke;
      while (d > 0 && depotMonate < 600) {
        postRetBonusMonate.forEach(b => { if (depotMonate === b.monat) d += b.wert; });
        d = d * (1 + monthlyReturn) - lueckeInfl;
        lueckeInfl *= (1 + inflMonthly);
        depotMonate++;
      }
    }

    // Entnahme-Strategie aus Profil
    const entnahmeStrat  = profile.entnahmeStrategie || 'luecke';
    const swrRate        = profile.swrRate != null ? profile.swrRate : (p.safeWithdrawalRate || 3.5);
    const entnahmeFest   = profile.entnahmeFest || 0;
    const guardrails     = !!(profile.guardrails);
    const swr            = r2(depotAtRetire * swrRate / 100 / 12);

    // Steuer-Schätzung auf Depot-Entnahme (Aktien-ETF, 30% Teilfreistellung)
    const gMonth = gehaltsSteigerung / 100 / 12;
    const totalContributions = depotStart + (gMonth > 0
      ? monthlySavings * (Math.pow(1 + gMonth, monthsToRetire) - 1) / gMonth
      : monthlySavings * monthsToRetire);
    const estimatedGains   = Math.max(0, depotAtRetire - totalContributions);
    const gainRatio        = depotAtRetire > 0 ? estimatedGains / depotAtRetire : 0;
    // Freistellungsauftrag (§ 20 Abs. 9 EStG): 1000 € / 2000 € gemeinsam je Jahr
    const freistellungMonat = (store.settings.steuerlicheVeranlagung === 'gemeinsam') ? 2000/12 : 1000/12;
    const taxableGainFraction = swr > 0 ? Math.max(0, gainRatio * 0.70 - freistellungMonat / swr) : gainRatio * 0.70;
    // Günstigerprüfung §32d Abs. 6 EStG: persönlicher Grenzsteuersatz wenn < 26,375%
    const abgeltungSatz = 0.26375;
    const grenzSatz = netResult.marginalRate || abgeltungSatz;
    const effectiveTaxRate = taxableGainFraction * Math.min(abgeltungSatz, grenzSatz);
    const swrNetto         = r2(swr * (1 - effectiveTaxRate));

    // Entnahmebetrag je Strategie
    let entnahmeMonatlich;
    if (entnahmeStrat === 'swr')        entnahmeMonatlich = swrNetto;
    else if (entnahmeStrat === 'fest')  entnahmeMonatlich = entnahmeFest;
    else                                entnahmeMonatlich = luecke; // 'luecke'

    // Depot-Haltbarkeit (per Entnahme-Strategie neu berechnen, mit Guardrails)
    depotMonate = 0;
    if (entnahmeMonatlich > 0 && depotAtRetire > 0) {
      const grFloorM = depotAtRetire * 0.80;
      const grCeilM  = depotAtRetire * 0.95;
      let entnahmeM = entnahmeMonatlich;
      let grAktivM  = false;
      let d = depotAtRetire;
      while (d > 0 && depotMonate < 720) {
        postRetBonusMonate.forEach(b => { if (depotMonate === b.monat) d += b.wert; });
        if (guardrails && entnahmeStrat === 'swr') {
          if (!grAktivM && d < grFloorM)      { entnahmeM = r2(entnahmeMonatlich * 0.90); grAktivM = true; }
          else if (grAktivM && d >= grCeilM)  { entnahmeM = entnahmeMonatlich; grAktivM = false; }
        }
        d = d * (1 + monthlyReturn) - r2(entnahmeM / (1 - effectiveTaxRate));
        // Inflation: bei Lücken-Strategie wächst die Entnahme mit Inflation
        if (entnahmeStrat === 'luecke') entnahmeM = r2(entnahmeM * (1 + inflMonthly));
        depotMonate++;
      }
    }

    // Entnahmeplan (40 Jahre) — optional mit Guardrails
    const entnahmePlan = [];
    {
      const grFloor  = depotAtRetire * 0.80; // Guardrail-Schwelle: −20%
      const grCeil   = depotAtRetire * 0.95; // Erholung: 5% unter Plan reicht
      let entnahmeAkt = entnahmeMonatlich;   // kann sich durch Guardrail ändern
      let guardrailAktiv = false;
      let d = depotAtRetire;
      for (let y = 0; y <= Math.min(depotMonate > 0 ? Math.ceil(depotMonate/12) + 2 : 40, 40); y++) {
        // Post-Rente-Bonusse (Erbimmobilie / einmalige RV) im richtigen Jahr
        const yBonus = postRetBonusMonate.filter(b => b.monat >= y*12 && b.monat < (y+1)*12).reduce((s,b)=>s+b.wert,0);
        if (yBonus > 0) d += yBonus;
        // Guardrail-Logik: nur bei SWR-Strategie
        if (guardrails && entnahmeStrat === 'swr' && entnahmeMonatlich > 0) {
          if (!guardrailAktiv && d < grFloor) {
            entnahmeAkt = r2(entnahmeMonatlich * 0.90); // −10%
            guardrailAktiv = true;
          } else if (guardrailAktiv && d >= grCeil) {
            entnahmeAkt = entnahmeMonatlich; // wiederherstellen
            guardrailAktiv = false;
          }
        }
        const bruttoAkt = entnahmeAkt > 0 ? r2(entnahmeAkt / (1 - effectiveTaxRate)) : 0;
        const alter = p.targetRetirementAge + y;
        const renditeJ = d * (Math.pow(1 + weightedReturn/100, 1) - 1);
        d = d * (1 + weightedReturn/100) - bruttoAkt * 12;
        entnahmePlan.push({ alter, depot: Math.max(0, Math.round(d)), entnahme: Math.round(entnahmeAkt * 12), rendite: Math.round(renditeJ), guardrailAktiv });
        if (d <= 0) break;
      }
    }

    // Worst-Case: −30% Depot-Schock zum Rentenbeginn (Sequence-of-Returns)
    let wcDepotMonate = 0;
    const wcDepotStart = r2(depotAtRetire * 0.70);
    const wcEntnahme = entnahmeMonatlich;
    if (wcEntnahme > 0 && wcDepotStart > 0) {
      let dWc = wcDepotStart;
      let wcEntnahmeM = wcEntnahme;
      while (dWc > 0 && wcDepotMonate < 720) {
        dWc = dWc * (1 + monthlyReturn) - r2(wcEntnahmeM / (1 - effectiveTaxRate));
        if (entnahmeStrat === 'luecke') wcEntnahmeM = r2(wcEntnahmeM * (1 + inflMonthly));
        wcDepotMonate++;
      }
    }
    const wcVerlauf = [];
    {
      let dWc = wcDepotStart;
      let wcEntnahmeAkt = wcEntnahme;
      const wcMax = Math.min(wcDepotMonate > 0 ? Math.ceil(wcDepotMonate/12)+2 : 40, 40);
      for (let y = 0; y <= wcMax; y++) {
        wcVerlauf.push({ alter: p.targetRetirementAge + y, depot: Math.max(0, Math.round(dWc)) });
        dWc = dWc * (1 + weightedReturn/100) - r2(wcEntnahmeAkt / (1 - effectiveTaxRate)) * 12;
        if (entnahmeStrat === 'luecke') wcEntnahmeAkt = r2(wcEntnahmeAkt * Math.pow(1 + inflMonthly, 12));
        if (dWc <= 0) break;
      }
    }

    // Kaufkraft: Renteneinkommen in heutiger Kaufkraft; benötigte Summe nominal
    const inflationRate = p.inflationRate || 2.3;
    const kaufkraftHeute  = yearsToRetire > 0 ? r2(gesamtEinkommen / Math.pow(1 + inflationRate / 100, yearsToRetire)) : gesamtEinkommen;
    const ausgabenNominal = yearsToRetire > 0 ? r2(ausgaben * Math.pow(1 + inflationRate / 100, yearsToRetire)) : ausgaben;

    // ── KV-Lücke: Frühverrentung vor Regelrentenalter ──────────────────────────
    // Zwischen Aufhören (targetRetirementAge) und Regelrente (regularRetirementAge)
    // ist man kein Rentner → kein Anspruch auf KVdR (§ 5 Abs. 1 Nr. 11 SGB V)
    const kvStatus     = profile.kvStatus || 'gkv';
    const kvLueckeJahre = Math.max(0, regularRetirementAge - p.targetRetirementAge);
    const assumptions  = store.retirement && store.retirement.assumptions || {};
    const fvGrenze     = assumptions.familienversicherungGrenze || 505;   // § 10 Abs. 1 Nr. 5 SGB V
    const gkvMindestBmg = assumptions.gkvMindestBmg || 1131.67;           // § 240 Abs. 4 SGB V

    let kvLueckeStatus  = 'kein';        // 'kein' | 'familienversicherung' | 'freiwillig'
    let kvFreiwilligKosten = 0;          // €/Monat freiwillige GKV (wenn nötig)
    let kvGainMonatlich = 0;            // geschätzter Gewinnanteil der Depot-Entnahme

    if (kvLueckeJahre > 0 && kvStatus === 'gkv') {
      // Geschätzter Gewinnanteil der Entnahme (gainRatio aus Depot-Berechnung oben)
      kvGainMonatlich = r2(entnahmeMonatlich * gainRatio);

      // Familienversicherung: möglich wenn Gewinnanteil < fvGrenze
      // (setzt voraus dass Partner GKV-versichert ist — wird in rpRenderMain geprüft)
      if (kvGainMonatlich <= fvGrenze) {
        kvLueckeStatus = 'familienversicherung';
      } else {
        kvLueckeStatus = 'freiwillig';
        // Freiwillige GKV: Beitrag auf max(tatsächliches Einkommen, Mindest-BMG)
        const bemessungsgrundlage = Math.max(gkvMindestBmg, Math.min(kvGainMonatlich, 5512.50));
        const kvZusatzFreiw = assumptions.kvZusatzbeitrag != null ? assumptions.kvZusatzbeitrag : 2.99;
        const kinderAnzahl  = store.settings && store.settings.kinder ? (store.settings.kinder.anzahl||0) : 0;
        const pvSatzFreiw   = kinderAnzahl >= 5 ? 0.024 : kinderAnzahl === 4 ? 0.0265 : kinderAnzahl === 3 ? 0.029 : kinderAnzahl === 2 ? 0.0315 : kinderAnzahl === 1 ? 0.034 : 0.042;
        kvFreiwilligKosten  = r2(bemessungsgrundlage * ((14.6 + kvZusatzFreiw) / 100 + pvSatzFreiw));
      }
    } else if (kvStatus === 'pkv') {
      kvLueckeStatus = 'pkv'; // PKV-Beitrag muss der Nutzer manuell in Ausgaben erfassen
    }

    return {
      personId,
      scenario:              scenario.name || 'Basis',
      currentAge,
      yearsToRetire,
      regularRetirementAge,
      targetRetirementAge:   p.targetRetirementAge,
      zugangsfaktor:         r2(zugangsfaktor),
      abschlagPct:           r2((1 - zugangsfaktor) * 100),
      punkteBeiRente:        r2(punkteBeiRente),
      gesetzlicheMonatsrenteBrutto,
      gesetzlicheMonatsrente,
      direktzusageBrutto,
      direktzusageMonatlich,
      direktzusageAktiv,
      direktzusageStartAge,
      ruerupBrutto,
      ruerupMonatlich,
      ruerupAktiv,
      ruerupStartAge,
      weitereBrutto,
      weitereMonatlich,
      weitereQuellennetto,
      gesamtBrutto,
      gesamtEinkommen,
      gesamtEinkommenVoll,
      deferredSources,
      netResult,
      besteuerungsanteil: netResult.besteuerungsanteil,
      estMonat:           netResult.estMonat,
      ausgaben,
      ausgabenEffektiv,
      luecke,
      lueckeVoll,
      erbMieteMonatlich,
      depotStart:            r2(depotStart),
      weightedReturn:        r2(weightedReturn),
      monthlySavings,
      depotAtRetire,
      kinderGesamtkosten:    r2(kinderGesamtkosten),
      depotHaltbarkeit:      depotMonate,
      depotJahre:            r2(depotMonate / 12),
      safeWithdrawal:        swr,
      swrNetto,
      swrRate,
      guardrails,
      swrEffectiveTaxPct:    r2(effectiveTaxRate * 100),
      entnahmeStrat,
      entnahmeMonatlich,
      entnahmePlan,
      verlaufData:           verlaufAnspar.concat((entnahmePlan||[]).slice(1).map(e=>({alter:e.alter,depot:e.depot}))),
      wcDepotMonate,
      wcDepotJahre:          r2(wcDepotMonate / 12),
      wcVerlauf,
      retirementAge:         p.targetRetirementAge,
      hatLuecke:             luecke > 0,
      hatLueckeVoll:         lueckeVoll > 0,
      kaufkraftHeute,
      ausgabenNominal,
      inflationRate,
      gehaltsSteigerung,
      kvStatus,
      kvLueckeJahre,
      kvLueckeStatus,
      kvGainMonatlich,
      kvFreiwilligKosten,
    };
  },

  // ── Rollierender 12-Monats-Zeitstrahl ──
  getRollingMonths(endMonth, endYear, count) {
    const result = [];
    let m = endMonth, y = endYear;
    for (let i = 0; i < count; i++) {
      result.unshift({ month: m, year: y, dateStr: String(m).padStart(2,'0') + '.' + y });
      m--;
      if (m < 1) { m = 12; y--; }
    }
    return result;
  },

  // ── Alle verfügbaren Jahre aus Transaktionen ──
  getAvailableYears() {
    const store = Store.get();
    const years = new Set(
      store.transactions.map(tx => parseInt(tx.date.split('.')[1]))
    );
    return Array.from(years).filter(Boolean).sort();
  },
};

// ═══════════════════════════════════════════════════════════════
// HILFSFUNKTION: Deep Merge
// ═══════════════════════════════════════════════════════════════

function deepMerge(target, source) {
  Object.keys(source || {}).forEach(key => {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  });
  return target;
}

// ═══════════════════════════════════════════════════════════════
// EXPORT (für Single-HTML-Datei: globale Variablen)
// ═══════════════════════════════════════════════════════════════

if (typeof window !== 'undefined') {
  window.FP = {
    Store,
    Trash: Store.Trash,
    Calculator,
    BackupManager,
    ExcelImporter,
    MONATE_KURZ,
    MONATE_LANG,
    generateId,
    currentMonthStr,
    r2,
  };
}

