'use strict';

const MON = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
const LABELS = { home:'Home', eingabe:'Eingabe', auswertung:'Übersicht', cashflow:'Cashflow', budget:'Budget', reports:'Reports', objekte:'Objekte', gehalt:'Gehalt', vermoegen:'Vermögen', rente:'Rentenplanung', fixkosten:'Fixkosten', einstellungen:'Einstellungen', mehr:'Mehr' };
const MEHR_PAGES = ['gehalt','fixkosten','objekte','einstellungen'];
const ICONS  = {
  cat_lebensmittel:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
  cat_restaurant:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>',
  cat_kaffee:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>',
  cat_auto:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17H5v-7l3-5h8l3 5v7z"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/></svg>',
  cat_tanken:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16"/><path d="M3 10h11"/><path d="M14 7h2a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9l-3-3"/></svg>',
  cat_autowaesche:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17H5v-7l3-5h8l3 5v7z"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/><path d="M9 3c0 1-1 2-1 3"/><path d="M13 3c0 1-1 2-1 3"/></svg>',
  cat_autoteile:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
  cat_parken:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>',
  cat_reinigung:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  cat_kleidung:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/></svg>',
  cat_urlaub:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 3 21 3c0 0-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>',
  cat_wohnung:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  cat_geschenke:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>',
  cat_gesundheit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
  cat_friseur:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>',
  cat_weiterbildung:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
  cat_abos:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
  cat_amazon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
  cat_netflix:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>',
  cat_youtube:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>',
  cat_appletv:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></svg>',
  cat_icloud:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>',
  cat_lotto:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  cat_steuer:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
  cat_sonstiges:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>',
  cat_sim_gps:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M15 2v6l-3-2-3 2V2"/></svg>'
};
const ICON_FALLBACK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>';
const OBJ_ICONS = {
  fahrzeug: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17H5v-7l3-5h8l3 5v7z"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/></svg>',
  reise:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 3 21 3c0 0-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>',
  projekt:  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
  person:   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>',
  geraet:   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
  sonstiges:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>'
};
const SECS   = [ { k:'fixkosten', lbl:'Notwendig' }, { k:'freizeit', lbl:'Freizeit & Lifestyle' } ];

let selCat = null, secState = {};
let amt = '', hasDec = false, decPos = 0;

// ── GitHub Sync ──────────────────────────────────────────────────────────────
var GHSync = (function() {
  var TOKEN_KEY    = 'fp_gh_token';
  var REPO         = 'finanzplaner-data';
  var SYNC_FILE    = 'sync.fpbackup';
  var LS_KEY_STORE = 'finanzplaner_v3';
  var _pushTimer    = null;
  var _busy         = false;
  var _origSetItem  = null;
  var _startupLock  = true;
  var _pendingPush  = false;
  var _justPushed   = false;
  var _syncingNow   = false;
  var _scheduleCount = 0;

  function _token() { return localStorage.getItem(TOKEN_KEY); }
  function _cfg()   { var s = FP.Store.Settings.get().githubSync; return s || {}; }
  function _owner() { return _cfg().owner; }
  function _active(){ return _cfg().enabled && !!_token() && !!_owner(); }

  function _api(method, path, body) {
    var opts = { method: method, headers: {
      'Authorization': 'token ' + _token(),
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    }};
    if (body) opts.body = JSON.stringify(body);
    return fetch('https://api.github.com' + path, opts).then(function(r) {
      if (r.status === 404) { var e = new Error('Not Found'); e.status = 404; throw e; }
      if (!r.ok) return r.json().then(function(e2) { throw new Error(e2.message || r.status); });
      return r.status === 204 ? null : r.json();
    });
  }

  function _enc(str) { return btoa(unescape(encodeURIComponent(str))); }
  function _dec(b64) { return decodeURIComponent(escape(atob(b64.replace(/\s/g,'')))); }

  // Verbinden: Token prüfen, Owner ermitteln, erstes Push
  function connect(token) {
    return fetch('https://api.github.com/user', { headers: {
      'Authorization': 'token ' + token,
      'Accept': 'application/vnd.github.v3+json'
    }}).then(function(r) {
      if (!r.ok) throw new Error('Token ungültig oder fehlende Berechtigung');
      return r.json();
    }).then(function(user) {
      localStorage.setItem(TOKEN_KEY, token);
      FP.Store.Settings.setGithubSync({ enabled: true, owner: user.login, lastSync: null, autoSync: true });
      ghsRenderUI();
      return _ensureRepo(user.login);
    }).then(function() {
      return _checkRemoteAndDecide();
    });
  }

  // Sicherstellen dass Repo existiert und initialisiert ist
  function _ensureRepo(owner) {
    return _api('GET', '/repos/' + owner + '/' + REPO + '/contents/').catch(function(e) {
      if (e.status === 404) {
        return _api('PUT', '/repos/' + owner + '/' + REPO + '/contents/README.md', {
          message: 'Init Finanzplaner Sync',
          content: _enc('# Finanzplaner Sync\nAutomatisch synchronisierte Daten.')
        });
      }
    });
  }

  // Push: lokale Daten hochladen
  function push(silent) {
    if (!_active() || _busy) return Promise.resolve();
    _busy = true;
    _setBusy(true);
    var path = '/repos/' + _owner() + '/' + REPO + '/contents/' + SYNC_FILE;
    var backup = FP.BackupManager.create('Auto-Sync');
    var content = _enc(JSON.stringify(backup));
    return _api('GET', path).catch(function(e) {
      if (e.status === 404) return null;
      throw e;
    }).then(function(existing) {
      var body = { message: 'Sync ' + new Date().toISOString().slice(0,16), content: content };
      if (existing && existing.sha) body.sha = existing.sha;
      return _api('PUT', path, body);
    }).then(function(putResult) {
      _busy = false;
      _setBusy(false);
      var now = new Date().toISOString();
      var newSHA = putResult && putResult.commit ? putResult.commit.sha : null;
      _justPushed = true;
      setTimeout(function() { _justPushed = false; if (_pendingPush) { _pendingPush = false; schedulePush(); } }, 12000);
      _syncingNow = true;
      FP.Store.Settings.setGithubSync({ lastSync: now, lastCommitSHA: newSHA });
      FP.Store.appLog('SYNC', '↑ Hochgeladen');
      _syncingNow = false;
      ghsRenderUI();
      setSyncStatus('synced', 'Synchronisiert');
      if (!silent) toast('↑ Sync abgeschlossen');
      _maybeDailyBackup(backup, content);
    }).catch(function(err) {
      _busy = false;
      _setBusy(false);
      // 422 = SHA veraltet (anderes Gerät hat zwischenzeitlich gepusht) → einmal neu versuchen
      if (err.status === 422 && !push._retrying) {
        push._retrying = true;
        setSyncStatus('pending', 'Wiederhole…');
        setTimeout(function() { push._retrying = false; push(silent); }, 1500);
        return;
      }
      push._retrying = false;
      setSyncStatus('error', 'Fehler');
      _syncingNow = true;
      FP.Store.appLog('SYNC', '↑ Upload fehlgeschlagen: ' + err.message);
      _syncingNow = false;
      if (!silent) toast('Sync-Fehler: ' + err.message);
      console.error('[GHSync] push:', err);
    });
  }

  // Pull: Remote-Daten laden und anwenden
  function pull(silent, commitSHA) {
    if (!_active() || _busy) return Promise.resolve();
    _busy = true;
    _setBusy(true);
    var path = '/repos/' + _owner() + '/' + REPO + '/contents/' + SYNC_FILE;
    // SHA holen falls nicht übergeben (z.B. manueller Pull via Button)
    var shaP = commitSHA
      ? Promise.resolve(commitSHA)
      : _api('GET', '/repos/' + _owner() + '/' + REPO + '/commits?path=' + SYNC_FILE + '&per_page=1')
          .then(function(c) { return c && c[0] ? c[0].sha : null; }).catch(function(){ return null; });
    var _sha = null;
    return shaP.then(function(sha) {
      _sha = sha;
      return _api('GET', path);
    }).then(function(file) {
      if (!file || !file.content) throw new Error('Keine Sync-Datei gefunden');
      var jsonStr = _dec(file.content);
      var blob = new Blob([jsonStr], { type: 'application/json' });
      var f = new File([blob], 'sync.fpbackup');
      return FP.BackupManager.import(f);
    }).then(function() {
      _busy = false;
      _setBusy(false);
      // SHA + lastSync direkt in localStorage schreiben ohne _state zu überschreiben
      try {
        var s = JSON.parse(localStorage.getItem(LS_KEY_STORE) || '{}');
        if (!s.settings) s.settings = {};
        if (!s.settings.githubSync) s.settings.githubSync = {};
        s.settings.githubSync.lastSync      = new Date().toISOString();
        s.settings.githubSync.lastCommitSHA = _sha;
        s.settings.githubSync.enabled       = true;
        s.settings.githubSync.owner         = _owner();
        s.settings.githubSync.autoSync      = _cfg().autoSync !== false;
        _origSetItem(LS_KEY_STORE, JSON.stringify(s));
      } catch(e) {}
      if (!silent) { toast('↓ Daten geladen — App wird neu gestartet'); setTimeout(function(){ location.reload(); }, 1200); }
    }).catch(function(err) {
      _busy = false;
      _setBusy(false);
      if (err.status === 404) { push(silent); return; }
      if (!silent) toast('Sync-Fehler: ' + err.message);
      console.error('[GHSync] pull:', err);
    });
  }

  // Entscheiden ob push oder pull — GitHub ist immer führend
  function _checkRemoteAndDecide() {
    var path = '/repos/' + _owner() + '/' + REPO + '/contents/' + SYNC_FILE;
    return _api('GET', path).then(function(file) {
      // GitHub hat Daten → immer laden. Wer lokale Daten hochladen will: ↑ Upload nutzen.
      if (file && file.content) { return pull(false); }
      // GitHub leer → lokale Daten hochladen
      return push(false);
    }).catch(function() { return push(false); });
  }

  // Tägliches Backup erstellen (einmal pro Tag)
  function _maybeDailyBackup(backup, content) {
    var today = new Date().toISOString().slice(0,10);
    var path = '/repos/' + _owner() + '/' + REPO + '/contents/backups/' + today + '.fpbackup';
    _api('GET', path).catch(function(e) {
      if (e.status === 404) {
        _api('PUT', path, { message: 'Backup ' + today, content: content }).catch(function(){});
      }
    });
  }

  // Auto-Push nach Änderungen (debounced, 8 Sekunden)
  function schedulePush() {
    _scheduleCount++;
    if (_syncingNow) return;
    if (!_active() || _cfg().autoSync === false) return;
    if (_justPushed) { _pendingPush = true; return; }
    if (_startupLock) { _pendingPush = true; setSyncStatus('pending', 'Ausstehend…'); return; }
    clearTimeout(_pushTimer);
    setSyncStatus('pending', 'Ausstehend…');
    _pushTimer = setTimeout(function() { _pushTimer = null; push(true); }, 500);
  }

  function _releaseLock() {
    _startupLock = false;
    if (_pendingPush) { _pendingPush = false; schedulePush(); }
  }

  function _checkRemote() {
    if (!_active() || _busy) return;
    var localSHA = _cfg().lastCommitSHA;
    _api('GET', '/repos/' + _owner() + '/' + REPO + '/commits?path=' + SYNC_FILE + '&per_page=1')
      .then(function(commits) {
        if (!commits || !commits[0]) return;
        var remoteSHA = commits[0].sha;
        if (remoteSHA !== localSHA) {
          toast('Neuere Daten auf GitHub — wird geladen…');
          setTimeout(function(){ pull(false, remoteSHA); }, 400);
        }
      }).catch(function(){});
  }

  function startPolling() {
    // Alle 3 Minuten auf neuere Remote-Daten prüfen
    setInterval(function() { _checkRemote(); }, 180000);
    // Live-Debug-Anzeige (nur lesen, kein Store-Zugriff)
    setInterval(function() {
      var el = document.getElementById('sync-debug');
      if (!el) return;
      var cfg = _cfg();
      el.innerHTML =
        'active: '       + _active()       + '&nbsp;&nbsp;' +
        'autoSync: '     + cfg.autoSync    + '<br>' +
        'startupLock: '  + _startupLock    + '&nbsp;&nbsp;' +
        'busy: '         + _busy           + '<br>' +
        'justPushed: '   + _justPushed     + '&nbsp;&nbsp;' +
        'pending: '      + _pendingPush    + '<br>' +
        'scheduleCalls: '+ _scheduleCount;
    }, 1000);
  }

  function installStorageHook() {
    _origSetItem = localStorage.setItem.bind(localStorage);
    // schedulePush wird direkt aus FP.Store._save aufgerufen (iOS-sicher)
  }

  function disconnect() {
    localStorage.removeItem(TOKEN_KEY);
    FP.Store.Settings.setGithubSync({ enabled: false, owner: null, lastSync: null });
    ghsRenderUI();
    toast('GitHub-Verbindung getrennt');
  }

  function _setBusy(on) {
    var pushBtn = document.getElementById('st-gh-push-btn');
    var pullBtn = document.getElementById('st-gh-pull-btn');
    var dot = document.getElementById('st-gh-dot');
    if (pushBtn) pushBtn.disabled = on;
    if (pullBtn) pullBtn.disabled = on;
    if (dot) dot.className = 'ghs-status-dot ' + (on ? 'busy' : 'ok');
    if (on) setSyncStatus('busy', 'Sync…');
    else    setSyncStatus('synced', 'Synchronisiert');
  }

  function init() {
    ghsRenderUI();
    if (_active()) setSyncStatus('pending', 'Prüfe…');
    else setSyncStatus('off', '');
    // Startup-Lock nach 15 Sekunden aufheben
    setTimeout(function() { _releaseLock(); }, 15000);
    if (_active()) {
      // Beim Start prüfen ob Remote neuer ist (SHA-Vergleich — unabhängig von Uhrzeiten)
      setTimeout(function() {
        var localSHA = _cfg().lastCommitSHA;
        _api('GET', '/repos/' + _owner() + '/' + REPO + '/commits?path=' + SYNC_FILE + '&per_page=1')
          .then(function(commits) {
            if (!commits || !commits[0]) { _releaseLock(); return; }
            var remoteSHA = commits[0].sha;
            if (remoteSHA !== localSHA) {
              // SHA-Mismatch: Dateiinhalt holen und lastModified vergleichen.
              // Nur wenn Remote wirklich neuer ist → pull. Sonst lokale Änderungen hochladen.
              _api('GET', '/repos/' + _owner() + '/' + REPO + '/contents/' + SYNC_FILE)
                .then(function(file) {
                  var doPull = function() {
                    toast('Neuere Daten auf GitHub — wird geladen…');
                    setTimeout(function(){ pull(false, remoteSHA); }, 500);
                  };
                  if (!file || !file.content) { doPull(); return; }
                  try {
                    var rBackup = JSON.parse(_dec(file.content));
                    var rMod = ((rBackup.store || rBackup).meta || {}).lastModified || '';
                    var lMod = (FP.Store.get().meta || {}).lastModified || '';
                    if (lMod > rMod) {
                      // Lokale Daten sind neuer → hochladen statt überschreiben
                      _releaseLock();
                    } else {
                      doPull();
                    }
                  } catch(e) {
                    doPull();
                  }
                }).catch(function() { _releaseLock(); });
            } else {
              _releaseLock();
              setSyncStatus('synced', 'Synchronisiert');
            }
          }).catch(function(){ _releaseLock(); });
      }, 2000);
    }
  }

  return { connect: connect, push: push, pull: pull, checkRemote: _checkRemote, schedulePush: schedulePush, disconnect: disconnect, init: init, installStorageHook: installStorageHook, startPolling: startPolling };
})();

// ── GitHub Sync UI-Funktionen ─────────────────────────────────────────────────
function setSyncStatus(state, label) {
  // state: 'synced' | 'pending' | 'busy' | 'error' | 'off'
  var ind   = document.getElementById('sync-indicator');
  var dot   = document.getElementById('sync-dot');
  var lbl   = document.getElementById('sync-lbl');
  var badge = document.getElementById('bn-sync-badge');
  if (!ind) return;
  if (state === 'off') {
    ind.style.display = 'none';
    if (badge) badge.classList.remove('show');
    return;
  }
  ind.style.display = 'flex';
  if (dot) dot.className = 'sync-dot ' + state;
  if (lbl) lbl.textContent = label || '';
  if (badge) {
    badge.style.background = state === 'synced' ? 'var(--green)' : state === 'error' ? 'var(--red)' : 'var(--amber)';
    badge.classList.toggle('show', state !== 'synced');
  }
}

function ghsRenderUI() {
  var cfg = FP.Store.Settings.get().githubSync || {};
  var token = localStorage.getItem('fp_gh_token');
  var connected = cfg.enabled && !!token && !!cfg.owner;
  var setup = document.getElementById('st-gh-setup');
  var conn  = document.getElementById('st-gh-connected');
  var badge = document.getElementById('st-gh-badge');
  var lbl   = document.getElementById('st-gh-status-lbl');
  var auto  = document.getElementById('st-gh-auto');
  if (!setup) return;
  if (connected) {
    setup.style.display = 'none';
    conn.style.display  = 'block';
    if (badge) { badge.textContent = '✓ ' + cfg.owner; badge.style.color = 'var(--green)'; }
    if (lbl) {
      lbl.textContent = cfg.lastSync
        ? 'Letzter Sync: ' + new Date(cfg.lastSync).toLocaleString('de-DE',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})
        : 'Noch nicht synchronisiert';
    }
    if (auto) auto.checked = cfg.autoSync !== false;
  } else {
    setup.style.display = 'block';
    conn.style.display  = 'none';
    if (badge) { badge.textContent = 'Nicht verbunden'; badge.style.color = 'var(--tx3)'; }
  }
}

function ghsConnect() {
  var inp = document.getElementById('st-gh-token-input');
  var token = inp ? inp.value.trim() : '';
  if (!token) { toast('Bitte Token eingeben'); return; }
  if (!token.startsWith('ghp_') && !token.startsWith('github_pat_')) { toast('Token muss mit ghp_ beginnen'); return; }
  toast('Verbinde mit GitHub…');
  GHSync.connect(token).catch(function(err) { toast('Fehler: ' + err.message); });
}

function ghsPush() {
  toast('Lade hoch…');
  GHSync.push(false);
}

function ghsPull() {
  toast('Lade herunter…');
  GHSync.pull(false);
}

function ghsCheck() {
  toast('Prüfe auf neue Daten…');
  GHSync.checkRemote();
}

function ghsDisconnect() {
  if (!confirm('GitHub-Verbindung wirklich trennen?\nDie Daten auf GitHub bleiben erhalten.')) return;
  GHSync.disconnect();
}

function ghsToggleAuto(val) {
  FP.Store.Settings.setGithubSync({ autoSync: val });
  toast(val ? 'Auto-Sync aktiviert' : 'Auto-Sync deaktiviert');
}

document.addEventListener('DOMContentLoaded', function() {
  FP.Store.load();
  FP.Store.generateRecurringTransactions({ retroactive: true });
  setHeute();
  buildCats();
  buildObjSel();
  renderEntries();
  applySB();
  if (window.innerWidth >= 768) nav('home');
  window.addEventListener('resize', function(){
    if(document.getElementById('p-rente').classList.contains('active')) rpSidebarHeight();
  });
  // GitHub Sync initialisieren + localStorage-Hook für Auto-Push
  GHSync.installStorageHook();
  GHSync.init();
  GHSync.startPolling();
});

/* ── Navigation ── */
function nav(id) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('[data-p]').forEach(function(b) { b.classList.remove('active'); });
  var pg = document.getElementById('p-' + id);
  if (pg) pg.classList.add('active');
  document.querySelectorAll('[data-p="' + id + '"]').forEach(function(b) { b.classList.add('active'); });
  var navId = MEHR_PAGES.indexOf(id) >= 0 ? 'mehr' : id;
  document.querySelectorAll('[data-p="' + navId + '"]').forEach(function(b) { b.classList.add('active'); });
  var lbl = document.getElementById('mob-lbl');
  if (lbl) lbl.textContent = LABELS[id] || id;
  if (id === 'home')       setTimeout(hmInit, 80);
  if (id === 'auswertung') setTimeout(avInit, 80);
  if (id === 'cashflow')   setTimeout(cfInit, 80);
  if (id === 'reports')    setTimeout(rp2Init, 80);
  if (id === 'budget')     setTimeout(bgtInit, 80);
  if (id === 'gehalt')    setTimeout(ghInit, 80);
  if (id === 'vermoegen') setTimeout(vmInit, 80);
  if (id === 'rente')     setTimeout(rpInit, 80);
  if (id === 'fixkosten')    setTimeout(fkInit, 80);
  if (id === 'objekte')       setTimeout(obInit, 80);
  if (id === 'einstellungen') setTimeout(stInit, 80);
}

/* ── Sidebar ── */
function toggleSB() {
  var sb = document.getElementById('sidebar');
  var exp = sb.classList.toggle('expanded');
  localStorage.setItem('fp_sb_expanded', exp ? '1' : '0');
}
function applySB() {
  var sb = document.getElementById('sidebar');
  if (localStorage.getItem('fp_sb_expanded') === '1') sb.classList.add('expanded');
}

/* ── Home Dashboard ── */
function hmInit() {
  var now   = new Date();
  var month = now.getMonth() + 1;
  var year  = now.getFullYear();

  var summary = FP.Calculator.getMonthSummary(month, year);
  var assets  = FP.Calculator.getAssetSummary();
  var rolling = FP.Calculator.getRollingMonths(month, year, 12);

  var netWorth  = assets.total;
  var assetCnt  = assets.items ? assets.items.length : 0;
  var ausgaben  = summary.totalAusgaben;
  var einnahmen = summary.netSalary;
  var saldo     = einnahmen - ausgaben;
  var sparPct   = einnahmen > 0 ? Math.round((saldo / einnahmen) * 100) : 0;
  var sparFill  = Math.min(Math.max(sparPct, 0), 100);
  var saldoColor = saldo >= 0 ? 'var(--blue)' : 'var(--red)';
  var rateColor  = sparPct >= 20 ? 'var(--blue)' : sparPct >= 10 ? 'var(--amber)' : 'var(--red)';

  var sparkData = rolling.map(function(pt) {
    return FP.Calculator.getMonthSummary(pt.month, pt.year).totalAusgaben;
  });

  // Kategorie-Map für Farben
  var store  = FP.Store.get();
  var catMap = {};
  store.categories.forEach(function(c) { catMap[c.id] = c; });

  // Top-5 Kategorien nach Betrag
  var cats = Object.keys(summary.byCat)
    .map(function(id) { return { id: id, data: summary.byCat[id] }; })
    .sort(function(a, b) { return b.data.total - a.data.total; })
    .slice(0, 5);
  var topAmt = cats.length ? cats[0].data.total : 1;

  var catsHtml = cats.length ? cats.map(function(c) {
    var color = (catMap[c.id] && catMap[c.id].color) || 'var(--cat-slate)';
    var pct   = Math.round((c.data.total / topAmt) * 100);
    return '<div class="hm-cat-row">' +
      '<div class="hm-cat-dot" style="background:' + color + '"></div>' +
      '<div class="hm-cat-name">' + c.data.name + '</div>' +
      '<div class="hm-cat-bar-wrap"><div class="hm-cat-bar-fill" style="width:' + pct + '%;background:' + color + '"></div></div>' +
      '<div class="hm-cat-amt">' + eur(c.data.total) + '</div>' +
    '</div>';
  }).join('') : '<div class="hm-empty">Noch keine Buchungen diesen Monat</div>';

  var monatLabel = FP.MONATE_LANG[month - 1] + ' ' + year;

  document.getElementById('hm-wrap').innerHTML =
    '<div class="hm-month-badge">' + monatLabel + '</div>' +

    // ── Hero ──
    '<div class="hm-hero">' +
      '<div class="hm-hero-main">' +
        '<div class="hm-hero-eyebrow">Netto-Vermögen</div>' +
        '<div class="hm-hero-amount">' + eur(netWorth) + '</div>' +
        '<div class="hm-hero-sub">' + assetCnt + ' Positionen</div>' +
      '</div>' +
      '<canvas id="hm-spark" width="180" height="56" style="flex-shrink:0"></canvas>' +
      '<div class="hm-hero-rate">' +
        '<div class="hm-rate-eyebrow">Sparquote</div>' +
        '<div class="hm-rate-val" style="color:' + rateColor + '">' + sparPct + ' %</div>' +
        '<div class="hm-rate-bar-wrap"><div class="hm-rate-bar-fill" style="width:' + sparFill + '%;background:' + rateColor + '"></div></div>' +
      '</div>' +
    '</div>' +

    // ── KPIs ──
    '<div class="hm-kpi-row">' +
      '<div class="hm-kpi-card hm-kpi-einnahmen"><div class="hm-kpi-label">Einnahmen</div><div class="hm-kpi-value" style="color:var(--blue)">' + eur(einnahmen) + '</div></div>' +
      '<div class="hm-kpi-card hm-kpi-ausgaben"><div class="hm-kpi-label">Ausgaben</div><div class="hm-kpi-value" style="color:var(--red)">' + eur(ausgaben) + '</div></div>' +
      '<div class="hm-kpi-card hm-kpi-saldo" style="border-top-color:' + saldoColor + ';background:linear-gradient(180deg,' + (saldo >= 0 ? 'var(--green-lt)' : 'var(--red-lt)') + ' 0%,var(--surf) 60%)"><div class="hm-kpi-label">Saldo</div><div class="hm-kpi-value" style="color:' + saldoColor + '">' + (saldo >= 0 ? '+' : '') + eur(saldo) + '</div></div>' +
    '</div>' +

    // ── Bottom ──
    '<div class="hm-bottom-row">' +
      '<div class="hm-cats-card"><div class="hm-cats-title">Top-Kategorien</div>' + catsHtml + '</div>' +
      '<div class="hm-actions-card">' +
        '<button class="hm-action-btn" onclick="nav(\'eingabe\')">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>' +
          'Buchung erfassen' +
        '</button>' +
        '<button class="hm-action-btn" onclick="nav(\'vermoegen\')">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>' +
          'Vermögen aktualisieren' +
        '</button>' +
        '<button class="hm-action-btn" onclick="nav(\'auswertung\')">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>' +
          'Übersicht' +
        '</button>' +
        '<button class="hm-action-btn" onclick="nav(\'rente\')">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7"/></svg>' +
          'Rentenplanung' +
        '</button>' +
      '</div>' +
    '</div>';

  setTimeout(function() { hmDrawSparkline(sparkData); }, 20);
}

function hmDrawSparkline(data) {
  var canvas = document.getElementById('hm-spark');
  if (!canvas) return;
  var dpr = window.devicePixelRatio || 1;
  var W = 180, H = 56;
  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width  = W + 'px';
  canvas.style.height = H + 'px';
  var ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  var nonZero = data.filter(function(v) { return v > 0; });
  if (nonZero.length < 2) return;
  var maxV = Math.max.apply(null, nonZero);
  var PAD = 3;
  var pts = data.map(function(v, i) {
    return {
      x: PAD + (i / (data.length - 1)) * (W - PAD * 2),
      y: H - PAD - (v / maxV) * (H - PAD * 2 - 4)
    };
  });

  // Gradient fill
  var grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, 'rgba(79,70,229,0.18)');
  grad.addColorStop(1, 'rgba(79,70,229,0)');
  ctx.beginPath();
  pts.forEach(function(p, i) { i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); });
  ctx.lineTo(pts[pts.length - 1].x, H);
  ctx.lineTo(pts[0].x, H);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.strokeStyle = '#4F46E5';
  ctx.lineWidth   = 1.8;
  ctx.lineJoin    = 'round';
  ctx.lineCap     = 'round';
  pts.forEach(function(p, i) { i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); });
  ctx.stroke();

  // Current month dot
  var last = pts[pts.length - 1];
  ctx.beginPath();
  ctx.arc(last.x, last.y, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#4F46E5';
  ctx.fill();
}

/* ── Kategorien aufbauen (v2.0: Hierarchie-aware, keine Grid-Lücken) ── */
function buildCats() {
  var panel = document.getElementById('cats-panel');
  panel.innerHTML = '';
  var allCats = FP.Store.Categories.getVisible().filter(function(c) { return c.showInInput !== false; });
  var mainCats = allCats.filter(function(c) { return !c.parentId; });

  SECS.forEach(function(sec) {
    var grp = mainCats.filter(function(c) { return c.group === sec.k; });
    if (!grp.length) return;

    var wrap = document.createElement('div');
    wrap.className = 'cat-sec';

    var lbl = document.createElement('div');
    lbl.className = 'cat-sec-lbl';
    lbl.textContent = sec.lbl;
    wrap.appendChild(lbl);

    // Leaf-Kategorien (ohne Kinder) in eigenem Grid
    var leafCats = grp.filter(function(c) {
      return FP.Store.Categories.getSubs(c.id).length === 0;
    });
    var parentCats = grp.filter(function(c) {
      return FP.Store.Categories.getSubs(c.id).length > 0;
    });

    if (leafCats.length > 0) {
      var grid = document.createElement('div');
      grid.className = 'cat-grid';
      grid.id = 'grid-' + sec.k;
      leafCats.forEach(function(cat) {
        var btn = document.createElement('button');
        btn.className = 'cat-btn' + (selCat === cat.id ? ' sel' : '');
        btn.dataset.p = cat.id;
        btn.innerHTML = '<span class="cat-ico">' + (ICONS[cat.id] || ICON_FALLBACK) + '</span><span>' + cat.name + '</span>';
        btn.onclick = function() { pickCat(cat.id, cat.name); };
        grid.appendChild(btn);
      });
      // "+ Neu" nur wenn keine Parent-Blöcke folgen (sonst unten)
      if (parentCats.length === 0) {
        var addBtn = document.createElement('button');
        addBtn.className = 'cat-btn';
        addBtn.style.cssText = 'border-style:dashed;color:var(--tx3)';
        addBtn.innerHTML = '<span class="cat-ico" style="font-size:18px">＋</span><span>Neu</span>';
        addBtn.onclick = openKatModal;
        grid.appendChild(addBtn);
      }
      wrap.appendChild(grid);
    }

    // Gruppen-Blöcke (mit Kindern) — full-width, ohne Grid-Mixing
    parentCats.forEach(function(cat) {
      var subs = FP.Store.Categories.getSubs(cat.id);
      var block = document.createElement('div');
      block.className = 'cat-grp-block';

      var hdr = document.createElement('div');
      hdr.className = 'cat-grp-hdr';
      hdr.innerHTML = (ICONS[cat.id] || ICON_FALLBACK) + ' ' + cat.name;
      block.appendChild(hdr);

      var subGrid = document.createElement('div');
      subGrid.className = 'cat-sub-grid';

      // Erster Button = Parent selbst (mit eigenem Namen + Icon)
      var parentBtn = document.createElement('button');
      parentBtn.className = 'cat-btn cat-sub-btn' + (selCat === cat.id ? ' sel' : '');
      parentBtn.dataset.p = cat.id;
      parentBtn.innerHTML = '<span class="cat-ico">' + (ICONS[cat.id] || ICON_FALLBACK) + '</span><span>' + cat.name + '</span>';
      parentBtn.onclick = function() { pickCat(cat.id, cat.name); };
      subGrid.appendChild(parentBtn);

      subs.forEach(function(sub) {
        var btn = document.createElement('button');
        btn.className = 'cat-btn cat-sub-btn' + (selCat === sub.id ? ' sel' : '');
        btn.dataset.p = sub.id;
        btn.innerHTML = '<span class="cat-ico">' + (ICONS[sub.id] || ICON_FALLBACK) + '</span><span>' + sub.name + '</span>';
        btn.onclick = function() { pickCat(sub.id, cat.name + ' · ' + sub.name); };
        subGrid.appendChild(btn);
      });
      block.appendChild(subGrid);
      wrap.appendChild(block);
    });

    // "+ Neu" am Ende der Sektion (wenn Parent-Blöcke vorhanden)
    if (parentCats.length > 0) {
      var addWrap = document.createElement('div');
      addWrap.className = 'cat-grp-block';
      var addGrid = document.createElement('div');
      addGrid.className = 'cat-sub-grid';
      var addBtn = document.createElement('button');
      addBtn.className = 'cat-btn cat-sub-btn';
      addBtn.style.cssText = 'border-style:dashed;color:var(--tx3)';
      addBtn.innerHTML = '<span class="cat-ico" style="font-size:18px">＋</span><span>Neu</span>';
      addBtn.onclick = openKatModal;
      addGrid.appendChild(addBtn);
      addWrap.appendChild(addGrid);
      wrap.appendChild(addWrap);
    }

    panel.appendChild(wrap);
  });
}

function pickCat(id, name) {
  selCat = id;
  document.querySelectorAll('.cat-btn').forEach(function(b) { b.classList.toggle('sel', b.dataset.p === id); });
  document.getElementById('np-cat').textContent = name;
  updSave();
}

function buildObjSel() {
  var sel = document.getElementById('np-obj');
  sel.innerHTML = '<option value="">Objekt…</option>';
  FP.Store.Objects.getActive().forEach(function(o) {
    var opt = document.createElement('option'); opt.value = o.id; opt.textContent = o.name; sel.appendChild(opt);
  });
}

/* ── Numpad ── */
function npKey(d) {
  if (d === ',') {
    if (hasDec) return;
    hasDec = true; decPos = 0;
    if (!amt) amt = '0';
    amt += ',';
  } else {
    if (hasDec) { if (decPos >= 2) return; decPos++; }
    if (amt === '0') amt = d; else amt += d;
  }
  document.getElementById('np-amt').textContent = amt || '0';
  npUpdateConv();
  updSave();
}
function npDel() {
  if (!amt) return;
  var last = amt.slice(-1);
  if (last === ',') { hasDec = false; decPos = 0; }
  else if (hasDec) decPos = Math.max(0, decPos - 1);
  amt = amt.slice(0, -1);
  document.getElementById('np-amt').textContent = amt || '0';
  npUpdateConv();
  updSave();
}
function getAmt() { return parseFloat((amt || '0').replace(',', '.')) || 0; }
function updSave() { document.getElementById('np-save').disabled = !(selCat && getAmt() > 0); }

function setHeute() {
  document.getElementById('np-date').value = new Date().toISOString().split('T')[0];
}
function isoToMY(iso) {
  var p = (iso || new Date().toISOString().split('T')[0]).split('-');
  return p[1] + '.' + p[0];
}

/* ── Währungs-Picker ── */
var npCur = 'EUR';

function npCurrencyToggle(e) {
  e.stopPropagation();
  var picker = document.getElementById('np-curr-picker');
  if (picker.classList.contains('open')) { picker.classList.remove('open'); return; }
  // Optionen aufbauen
  var active = FP.Store.Currencies.getActive();
  var html = '<div class="np-curr-opt' + (npCur==='EUR'?' sel':'') + '" onclick="npCurrencySelect(\'EUR\')"><span class="np-curr-code">EUR</span><span class="np-curr-sym">€</span><span>Euro</span></div>';
  active.forEach(function(c) {
    html += '<div class="np-curr-opt' + (npCur===c.code?' sel':'') + '" onclick="npCurrencySelect(\''+c.code+'\')">'
      +'<span class="np-curr-code">'+c.code+'</span><span class="np-curr-sym">'+c.symbol+'</span><span>'+c.name+'</span></div>';
  });
  picker.innerHTML = html;
  picker.classList.add('open');
}

function npCurrencySelect(code) {
  npCur = code;
  var btn = document.getElementById('np-currency-btn');
  var sym = FP.Store.Currencies.getSymbol(code);
  btn.textContent = sym;
  btn.classList.toggle('active', code !== 'EUR');
  document.getElementById('np-curr-picker').classList.remove('open');
  npUpdateConv();
}

function npUpdateConv() {
  var el = document.getElementById('np-conv');
  if (!el) return;
  if (npCur === 'EUR') { el.textContent = ''; return; }
  var a = getAmt();
  if (!a) { el.textContent = ''; return; }
  var eurAmt = FP.Store.Currencies.toEUR(a, npCur);
  var c = FP.Store.Currencies.getAll().find(function(x){return x.code===npCur;});
  el.textContent = '1 '+npCur+' = '+(c ? (1/c.rate).toFixed(4) : '?')+' € · '+eur(a)+' '+npCur+' = '+eur(eurAmt);
}

// Picker schließen wenn außerhalb geklickt
document.addEventListener('click', function(e) {
  var picker = document.getElementById('np-curr-picker');
  if (picker && !picker.contains(e.target) && e.target.id !== 'np-currency-btn') {
    picker.classList.remove('open');
  }
});

/* ── Typ (Ausgabe / Erstattung) — Segmented Control ── */
var isErstattet = false;

function setTyp(typ) {
  isErstattet = (typ === 'erstattung');
  var aus  = document.getElementById('np-seg-aus');
  var ers  = document.getElementById('np-seg-ers');
  var s    = document.getElementById('np-save');
  var sign = document.getElementById('np-sign');
  if (isErstattet) {
    aus.classList.remove('active');
    ers.classList.add('active');
    s.classList.add('erstattet');
    if (sign) { sign.textContent = '−'; sign.style.color = 'var(--green)'; }
  } else {
    ers.classList.remove('active');
    aus.classList.add('active');
    s.classList.remove('erstattet');
    if (sign) { sign.textContent = ''; }
  }
}

/* Rückwärtskompatibilität (falls noch irgendwo genutzt) */
function toggleErstattung() { setTyp(isErstattet ? 'ausgabe' : 'erstattung'); }

/* ── Notiz ein-/ausblenden ── */
function npToggleNotiz() {
  var wrap = document.getElementById('np-notiz-wrap');
  var ico  = document.getElementById('np-notiz-ico');
  var lbl  = document.getElementById('np-notiz-lbl');
  var isOpen = wrap.classList.toggle('open');
  ico.textContent  = isOpen ? '−' : '＋';
  lbl.textContent  = isOpen ? 'Notiz verbergen' : 'Notiz hinzufügen';
  if (isOpen) setTimeout(function() { document.getElementById('np-note').focus(); }, 220);
}

/* ── Speichern ── */
function speichern() {
  var a = getAmt();
  if (!a || !selCat) return;
  var cat = FP.Store.Categories.getAll().find(function(c) { return c.id === selCat; });
  var eurAmt = npCur === 'EUR' ? a : FP.Store.Currencies.toEUR(a, npCur);
  var finalAmt = isErstattet ? -eurAmt : eurAmt;
  FP.Store.Transactions.add({
    date: isoToMY(document.getElementById('np-date').value),
    categoryId: selCat,
    subcategoryId: null,
    objectId:      document.getElementById('np-obj').value || null,
    amount: finalAmt,
    rawName: cat ? cat.name : '',
    note: document.getElementById('np-note').value.trim(),
    source: 'manual'
  });
  var pfx = isErstattet ? '↩ Rückbuchung ' : '✓ ';
  var convNote = npCur !== 'EUR' ? ' ('+a+' '+npCur+')' : '';
  toast(pfx + (cat ? cat.name : '') + '  ' + eur(eurAmt) + convNote);
  appLog('TX', (isErstattet?'Rückbuchung ':'Neu ') + (cat?cat.name:'') + ' ' + eur(finalAmt));
  reset();
  renderEntries();
  // Auswertung live aktualisieren wenn sichtbar
  if (document.getElementById('p-auswertung') &&
      document.getElementById('p-auswertung').classList.contains('active')) {
    avRender();
  }
}
function reset() {
  amt = ''; hasDec = false; decPos = 0; selCat = null;
  document.getElementById('np-amt').textContent = '0';
  document.getElementById('np-cat').textContent = '— Kategorie wählen —';
  document.getElementById('np-note').value = '';
  document.getElementById('np-obj').value = '';
  document.getElementById('np-obj').classList.remove('has-val');
  document.querySelectorAll('.cat-btn').forEach(function(b) { b.classList.remove('sel'); });
  // Typ zurücksetzen
  if (isErstattet) setTyp('ausgabe');
  // Notiz verbergen
  var wrap = document.getElementById('np-notiz-wrap');
  if (wrap && wrap.classList.contains('open')) {
    wrap.classList.remove('open');
    var ico = document.getElementById('np-notiz-ico');
    var lbl = document.getElementById('np-notiz-lbl');
    if (ico) ico.textContent = '＋';
    if (lbl) lbl.textContent = 'Notiz hinzufügen';
  }
  if (npCur !== 'EUR') npCurrencySelect('EUR');
  document.getElementById('np-conv').textContent = '';
  updSave();
}

/* ── Einträge ── */
function renderEntries() {
  var txs  = FP.Store.Transactions.getAll().filter(function(t) { return t.source === 'manual'; }).slice(-12).reverse();
  var cMap = {}; FP.Store.Categories.getAll().forEach(function(c) { cMap[c.id] = c; });
  var oMap = {}; FP.Store.Objects.getAll().forEach(function(o) { oMap[o.id] = o; });
  document.getElementById('e-cnt').textContent = txs.length + ' Einträge';
  var list = document.getElementById('e-list');
  if (!txs.length) { list.innerHTML = '<div style="padding:28px 16px;text-align:center"><div style="font-size:32px;margin-bottom:8px;opacity:.4">✏️</div><div style="font-size:14px;font-weight:600;color:var(--tx2);margin-bottom:4px">Noch nichts erfasst</div><div style="font-size:12px;color:var(--tx3)">Kategorie wählen, Betrag eingeben, speichern.</div></div>'; return; }
  list.innerHTML = txs.map(function(tx) {
    var cat = cMap[tx.categoryId]; var obj = oMap[tx.objectId];
    var mo = tx.date.split('.'); var dateTx = MON[parseInt(mo[0])-1] + ' ' + mo[1];
    var grp = cat ? cat.group : 'freizeit';
    var objTag = obj ? '<span class="pill pill-obj" style="gap:4px">' + (OBJ_ICONS[obj.type]||'') + ' ' + obj.name + '</span>' : '';
    return '<div class="e-row">'
      + '<div class="e-bar" style="background:' + (cat ? cat.color : '#6B7280') + '"></div>'
      + '<div class="e-info">'
      + '<div class="e-cat">' + (cat ? cat.name : '?') + '</div>'
      + (tx.note ? '<div class="e-note">' + esc(tx.note) + '</div>' : '')
      + '<div class="e-meta"><span style="font-size:11px;color:var(--tx3)">' + dateTx + '</span>'
      + '<span class="pill ' + (grp === 'fixkosten' ? 'pill-fix' : 'pill-frei') + '">' + (grp === 'fixkosten' ? 'Fix' : 'Frei') + '</span>'
      + objTag + '</div></div>'
      + '<div class="e-amt" style="color:' + (tx.amount < 0 ? 'var(--green)' : 'inherit') + '">' + (tx.amount < 0 ? '↩\u2009' : '') + eur(Math.abs(tx.amount)) + '</div>'
      + '<button class="e-del" onclick="delTx(\'' + tx.id + '\')">✕</button>'
      + '</div>';
  }).join('');
}
function delTx(id) {
  var tx = FP.Store.Transactions.getAll().find(function(t){return t.id===id;});
  FP.Store.Transactions.delete(id);
  renderEntries();
  toast('Eintrag gelöscht');
  if(tx) appLog('TX', 'Gelöscht: '+(tx.rawName||'')+ ' ' +eur(tx.amount));
}

/* ── Neue Kategorie ── */
function openKatModal() {
  var par = document.getElementById('mc-par');
  par.innerHTML = '<option value="">— Hauptkategorie —</option>';
  FP.Store.Categories.getAll().filter(function(c) { return !c.parentId; }).forEach(function(c) {
    var o = document.createElement('option'); o.value = c.id; o.textContent = c.name; par.appendChild(o);
  });
  document.getElementById('mc-name').value = '';
  openM('m-cat');
}
function saveKat() {
  var name = document.getElementById('mc-name').value.trim();
  if (!name) { toast('Bitte Namen eingeben'); return; }
  var editId = document.getElementById('mc-edit-id').value;
  var showInInput = document.getElementById('mc-show-input') ? document.getElementById('mc-show-input').classList.contains('on') : true;
  if (editId) {
    var grp = document.getElementById('mc-grp').value;
    var par = document.getElementById('mc-par').value || null;
    var parCat = par ? FP.Store.Categories.getAll().find(function(c){return c.id===par;}) : null;
    FP.Store.Categories.update(editId, {
      name: name,
      group: parCat ? parCat.group : grp,
      parentId: par,
      showInInput: showInInput,
    });
    closeM('m-cat');
    buildCats();
    stRenderCats();
    toast('✓ "' + name + '" gespeichert');
  } else {
    var grp  = document.getElementById('mc-grp').value;
    var par  = document.getElementById('mc-par').value || null;
    var parCat = par ? FP.Store.Categories.getAll().find(function(c) { return c.id === par; }) : null;
    FP.Store.Categories.add({ name: name, group: parCat ? parCat.group : grp, parentId: par, showInInput: showInInput });
    closeM('m-cat');
    buildCats();
    toast('✓ "' + name + '" angelegt');
  }
}

/* ── Modal ── */
function openM(id)  { document.getElementById(id).classList.add('open'); }
function closeM(id) { document.getElementById(id).classList.remove('open'); }

function confirmDialog(msg, label, onOk){
  // Sicherstellen dass Modal im Standard-Zustand ist
  var extra=document.getElementById('mconf-extra');
  if(extra){extra.style.display='none';extra.innerHTML='';}
  var cancel=document.getElementById('mconf-cancel');
  if(cancel){cancel.style.display='';cancel.textContent='Abbrechen';}
  var okBtn=document.getElementById('mconf-ok');
  okBtn.style.background='var(--red)';okBtn.style.borderColor='var(--red)';
  document.getElementById('mconf-msg').textContent=msg;
  okBtn.textContent=label||'OK';
  okBtn.onclick=function(){ closeM('m-confirm'); onOk(); };
  openM('m-confirm');
}

/* ── Toast ── */
var toastT;
function toast(msg) {
  var el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(function() { el.classList.remove('show'); }, 2600);
}

/* ── App-Log ── */
function appLog(level, msg) {
  FP.Store.appLog(level, msg);
  var el = document.getElementById('st-log-output');
  if(el) _renderLog(el);
}
function _fmtLogTs(ts) {
  try {
    var d = new Date(ts.replace(' ', 'T'));
    var dd  = String(d.getDate()).padStart(2,'0');
    var mm  = String(d.getMonth()+1).padStart(2,'0');
    var yy  = d.getFullYear();
    var hh  = String(d.getHours()).padStart(2,'0');
    var min = String(d.getMinutes()).padStart(2,'0');
    return dd+'.'+mm+'.'+yy+' '+hh+':'+min;
  } catch(e) { return ts; }
}
function _renderLog(el) {
  var log = FP.Store.get().log || [];
  if(!log.length){ el.textContent='(noch keine Einträge)'; return; }
  el.innerHTML = log.slice(0,200).map(function(e){
    var col = e.level==='ERROR'?'var(--red)':e.level==='WARN'?'var(--amber)':e.level==='SYNC'?'var(--green)':e.level==='KATEGORIE'?'var(--purple)':e.level==='INFO'?'var(--tx2)':'var(--blue)';
    return '<div style="margin-bottom:4px"><span style="color:var(--tx3);font-size:11px">'+_fmtLogTs(e.ts)+'</span> '
      +'<span style="color:'+col+';font-weight:600">'+e.level+'</span> '
      +'<span style="word-break:break-all">'+(e.msg||'').replace(/</g,'&lt;')+'</span></div>';
  }).join('');
}
function stOpenLog() {
  var el = document.getElementById('st-log-output');
  if(el) _renderLog(el);
}
function stToggleMehr() {
  var wrap = document.querySelector('#p-einstellungen .st-wrap');
  var btn  = document.getElementById('st-mehr-btn');
  if (!wrap || !btn) return;
  var on = wrap.classList.toggle('erweitert');
  btn.textContent = on ? '－ Erweiterte Einstellungen ausblenden' : '＋ Erweiterte Einstellungen';
}

function stCopyLog() {
  var log = FP.Store.get().log || [];
  var text = log.map(function(e){ return e.ts+' ['+e.level+'] '+e.msg; }).join('\n');
  if(!text){ toast('Log ist leer'); return; }
  navigator.clipboard.writeText(text).then(function(){ toast('Log kopiert'); })
    .catch(function(){ toast('Kopieren fehlgeschlagen — bitte manuell markieren'); });
}
function stClearLog() {
  FP.Store.get().log = [];
  FP.Store.save();
  var el = document.getElementById('st-log-output');
  if(el) el.textContent='(noch keine Einträge)';
  toast('Log geleert');
}

/* ── Format ── */
function eur(n) {
  return (n || 0).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '\u202F€';
}


var avS={mode:'monat',month:new Date().getMonth()+1,year:new Date().getFullYear(),view:'donut',sortBy:'amt',sortDir:'desc',selCat:null,katView:'kategorien',expandedGroup:null};
var avHov=-1, avHovSub=-1, _avLayout=null;
function avHeute(){avS.month=new Date().getMonth()+1;avS.year=new Date().getFullYear();avRender();}
function avMode(m,el){avS.mode=m;avS.selCat=null;document.querySelectorAll('.av-mode-btn').forEach(function(b){b.classList.remove('active');});el.classList.add('active');avRender();}
function avView(v,el){avS.view=v;document.querySelectorAll('.av-view-btn').forEach(function(b){b.classList.remove('active');});el.classList.add('active');avRenderViz(avBC());}
function avShift(d){
  if(avS.mode==='monat'){avS.month+=d;if(avS.month>12){avS.month=1;avS.year++;}if(avS.month<1){avS.month=12;avS.year--;}}
  else if(avS.mode==='quartal'){var q=Math.ceil(avS.month/3)+d;if(q>4){q=1;avS.year++;}if(q<1){q=4;avS.year--;}avS.month=(q-1)*3+1;}
  else{avS.year+=d;}
  avRender();
}
function avSort(col){
  if(avS.sortBy===col){avS.sortDir=avS.sortDir==='desc'?'asc':'desc';}else{avS.sortBy=col;avS.sortDir=col==='name'?'asc':'desc';}
  ['name','pct','amt'].forEach(function(c){var e=document.getElementById('avh-'+c);if(e){e.classList.remove('asc','desc');if(c===avS.sortBy)e.classList.add(avS.sortDir);}});
  var bc=avBC();avRenderKat(bc);
}
function avSelCat(id){avS.selCat=avS.selCat===id?null:id;var bc=avBC();avRenderKat(bc);avRenderViz(bc);}
function avLabel(){
  if(avS.mode==='monat')return MON[avS.month-1]+' '+avS.year;
  if(avS.mode==='quartal')return 'Q'+Math.ceil(avS.month/3)+' '+avS.year;
  return String(avS.year);
}
function avMonths(){
  var ms=[];
  if(avS.mode==='monat'){ms=[String(avS.month).padStart(2,'0')+'.'+avS.year];}
  else if(avS.mode==='quartal'){var q=Math.ceil(avS.month/3);for(var i=(q-1)*3+1;i<=q*3;i++)ms.push(String(i).padStart(2,'0')+'.'+avS.year);}
  else{for(var i=1;i<=12;i++)ms.push(String(i).padStart(2,'0')+'.'+avS.year);}
  return ms;
}
function avBC(){
  var store=FP.Store.get();var cats={};store.categories.forEach(function(c){cats[c.id]=c;});
  var bc={};
  store.transactions.forEach(function(tx){
    if(avMonths().indexOf(tx.date)<0)return;
    var cat=cats[tx.categoryId];if(!cat)return;
    if(!bc[tx.categoryId])bc[tx.categoryId]={cat:cat,total:0,count:0};
    bc[tx.categoryId].total+=tx.amount;bc[tx.categoryId].count++;
  });
  return bc;
}
function avSorted(bc){
  var t=Math.abs(avTotal(bc))||1;
  var items=Object.values(bc).filter(function(d){return d.total!==0;});
  items.sort(function(a,b){
    if(avS.sortBy==='name')return avS.sortDir==='asc'?a.cat.name.localeCompare(b.cat.name):b.cat.name.localeCompare(a.cat.name);
    var va=avS.sortBy==='pct'?Math.abs(a.total)/t:Math.abs(a.total);
    var vb=avS.sortBy==='pct'?Math.abs(b.total)/t:Math.abs(b.total);
    return avS.sortDir==='asc'?va-vb:vb-va;
  });
  return items;
}
function avTotal(bc){return Object.values(bc).reduce(function(s,d){return s+d.total;},0);}
function avRender(){
  avS.expandedGroup=null;
  // Period-Label: Monat groß + Jahr klein (Apple-Stil)
  var lbl=document.getElementById('av-lbl');
  if(lbl){
    if(avS.mode==='monat'){
      lbl.innerHTML='<span class="av-lbl-mon">'+MON[avS.month-1]+'</span><span class="av-lbl-yr">'+avS.year+'</span>';
    } else if(avS.mode==='quartal'){
      lbl.innerHTML='<span class="av-lbl-mon">Q'+Math.ceil(avS.month/3)+'</span><span class="av-lbl-yr">'+avS.year+'</span>';
    } else {
      lbl.innerHTML='<span class="av-lbl-mon">'+avS.year+'</span>';
    }
  }
  var pk=document.getElementById('av-picker');if(pk)pk.value=avS.year+'-'+String(avS.month).padStart(2,'0')+'-01';
  avChart();avToepfe();var bc=avBC();avRenderKat(bc);avRenderViz(bc);
}
function avChart(){
  var canvas=document.getElementById('avc');if(!canvas)return;
  var dpr=window.devicePixelRatio||1;
  var W=canvas.parentNode.getBoundingClientRect().width||canvas.parentNode.offsetWidth||600;var H=150;
  canvas.width=W*dpr;canvas.height=H*dpr;canvas.style.width=W+'px';canvas.style.height=H+'px';
  var ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);ctx.clearRect(0,0,W,H);
  var pts,ci;
  if(avS.mode==='monat'){
    pts=FP.Calculator.getRollingMonths(avS.month,avS.year,12);
  } else if(avS.mode==='quartal'){
    var q=Math.ceil(avS.month/3);pts=[];
    for(ci=(q-1)*3+1;ci<=q*3;ci++)pts.push({month:ci,year:avS.year,dateStr:String(ci).padStart(2,'0')+'.'+avS.year});
  } else {
    pts=[];
    for(ci=1;ci<=12;ci++)pts.push({month:ci,year:avS.year,dateStr:String(ci).padStart(2,'0')+'.'+avS.year});
  }
  var n=pts.length;
  var cs=getComputedStyle(document.documentElement);
  var cTx=cs.getPropertyValue('--tx').trim()||'#1C1C1E';
  var cTx3=cs.getPropertyValue('--tx3').trim()||'#AEAEB2';
  var store=FP.Store.get();var txs=store.transactions;
  var cats={};store.categories.forEach(function(c){cats[c.id]=c;});
  var fixVals=pts.map(function(p){
    return txs.filter(function(t){var c=cats[t.categoryId];return t.date===p.dateStr&&t.amount>0&&c&&c.group==='fixkosten';}).reduce(function(s,t){return s+t.amount;},0);
  });
  var freiVals=pts.map(function(p){
    return txs.filter(function(t){var c=cats[t.categoryId];return t.date===p.dateStr&&t.amount>0&&(!c||c.group!=='fixkosten');}).reduce(function(s,t){return s+t.amount;},0);
  });
  var sparVals=pts.map(function(p,i){
    var net=(store.salary&&store.salary.person_1&&store.salary.person_1[p.dateStr])?(store.salary.person_1[p.dateStr].netSalary||0):0;
    return Math.max(0,net-fixVals[i]-freiVals[i]);
  });
  var totals=pts.map(function(p,i){return fixVals[i]+freiVals[i]+sparVals[i];});
  // Grouped bars: maxV = größter Einzelwert (nicht Summe)
  var allVals=fixVals.concat(freiVals).concat(sparVals);
  var maxV=Math.max.apply(null,allVals.concat([1]));
  var pL=8,pR=8,pT=32,pB=24,bW=(W-pL-pR)/n,cH=H-pT-pB;
  var outerGap=Math.max(3,bW*0.14);
  var innerW=bW-outerGap;
  var subGap=1.5;
  var subW=(innerW-2*subGap)/3;
  _avLayout={pL:pL,bW:bW,outerGap:outerGap,subW:subW,subGap:subGap,n:n};
  var cs2=getComputedStyle(document.documentElement);
  var SEGS=[
    {nc:cs2.getPropertyValue('--blue-lt').trim()||'#DBEAFE',hc:cs2.getPropertyValue('--blue-bd').trim()||'#93C5FD',ac:cs2.getPropertyValue('--blue').trim()||'#3B82F6'},
    {nc:cs2.getPropertyValue('--green-lt').trim()||'#D1FAE5',hc:cs2.getPropertyValue('--green-mid').trim()||'#6EE7B7',ac:cs2.getPropertyValue('--green').trim()||'#059669'},
    {nc:cs2.getPropertyValue('--purple-lt').trim()||'#EDE9FE',hc:cs2.getPropertyValue('--purple-mid').trim()||'#C4B5FD',ac:cs2.getPropertyValue('--purple').trim()||'#7C3AED'}
  ];
  pts.forEach(function(p,i){
    var segsV=[fixVals[i],freiVals[i],sparVals[i]];
    var isCur=avS.mode==='monat'&&p.month===avS.month&&p.year===avS.year;
    var isHov=avHov===i;
    var x=pL+i*bW+outerGap/2;
    segsV.forEach(function(v,si){
      if(v<=0)return;
      var bh=Math.max(2,(v/maxV)*cH);
      var bx=x+si*(subW+subGap);
      var by=H-pB-bh;
      ctx.fillStyle=isCur?SEGS[si].ac:(isHov?SEGS[si].hc:SEGS[si].nc);
      // Abgerundete Oberkante
      var r=Math.min(3,subW/2,bh/2);
      ctx.beginPath();
      ctx.moveTo(bx+r,by);
      ctx.lineTo(bx+subW-r,by);
      ctx.quadraticCurveTo(bx+subW,by,bx+subW,by+r);
      ctx.lineTo(bx+subW,by+bh);
      ctx.lineTo(bx,by+bh);
      ctx.lineTo(bx,by+r);
      ctx.quadraticCurveTo(bx,by,bx+r,by);
      ctx.closePath();
      ctx.fill();
    });
    // Monatsbezeichnung unten
    ctx.font=(isCur?'700 ':'')+'10px Inter,sans-serif';
    ctx.fillStyle=isCur?cTx:cTx3;
    ctx.textAlign='center';ctx.textBaseline='bottom';
    ctx.fillText(MON[p.month-1].slice(0,3),x+innerW/2,H);
    // Horizontaler Einzelbetrag über dem gehoverten Balken
    if(isHov&&avHovSub>=0){
      var v=segsV[avHovSub];
      if(v>0){
        var bh2=Math.max(2,(v/maxV)*cH);
        var bx2=x+avHovSub*(subW+subGap);
        var barCX=bx2+subW/2;
        // Text zentriert über Balken, aber innerhalb Canvas-Grenzen halten
        var labelX=Math.min(Math.max(barCX,36),W-36);
        ctx.font='700 10px Inter,sans-serif';
        ctx.fillStyle=SEGS[avHovSub].ac;
        ctx.textAlign='center';ctx.textBaseline='bottom';
        ctx.fillText(eur(v),labelX,H-pB-bh2-4);
      }
    }
  });
  canvas.onclick=null;
  canvas.onmousemove=function(e){
    var r=canvas.getBoundingClientRect(),x=e.clientX-r.left;
    avHov=Math.floor((x-pL)/bW);
    avHovSub=-1;
    if(_avLayout&&avHov>=0&&avHov<_avLayout.n){
      var colX=_avLayout.pL+avHov*_avLayout.bW+_avLayout.outerGap/2;
      var si=Math.floor((x-colX)/(_avLayout.subW+_avLayout.subGap));
      if(si>=0&&si<=2)avHovSub=si;
    }
    avChart();
  };
  canvas.onmouseleave=function(){avHov=-1;avHovSub=-1;avChart();};
  var vals=totals;var curV,prevV=0,prevLbl,nz,avg;
  if(avS.mode==='monat'){
    curV=vals[n-1]||0;prevV=vals[n-2]||0;prevLbl='Vormonat';
    nz=vals.filter(function(v){return v>0;});avg=nz.length?nz.reduce(function(s,v){return s+v;},0)/nz.length:0;
  } else if(avS.mode==='quartal'){
    curV=vals.reduce(function(s,v){return s+v;},0);
    var pq=Math.ceil(avS.month/3)-1,pqy=avS.year;if(pq<1){pq=4;pqy--;}
    for(var mi=(pq-1)*3+1;mi<=pq*3;mi++){var ds=String(mi).padStart(2,'0')+'.'+pqy;prevV+=txs.filter(function(t){return t.date===ds&&t.amount>0;}).reduce(function(s,t){return s+t.amount;},0);}
    prevLbl='Vorquartal';nz=vals.filter(function(v){return v>0;});avg=nz.length?nz.reduce(function(s,v){return s+v;},0)/nz.length:0;
  } else {
    curV=vals.reduce(function(s,v){return s+v;},0);
    for(var mj=1;mj<=12;mj++){var dsj=String(mj).padStart(2,'0')+'.'+(avS.year-1);prevV+=txs.filter(function(t){return t.date===dsj&&t.amount>0;}).reduce(function(s,t){return s+t.amount;},0);}
    prevLbl='Vorjahr';nz=vals.filter(function(v){return v>0;});avg=nz.length?nz.reduce(function(s,v){return s+v;},0)/nz.length:0;
  }
  var diff=curV-prevV;var avgLbl=avS.mode==='monat'?'Ø 12 Monate':'Ø Monat';
  // Prozentuale Aufteilung für den aktuellen Zeitraum
  var curFix=0,curFrei=0;
  if(avS.mode==='monat'){
    curFix=fixVals[n-1]||0;curFrei=freiVals[n-1]||0;
  } else {
    fixVals.forEach(function(v){curFix+=v;});freiVals.forEach(function(v){curFrei+=v;});
  }
  var curSpar=Math.max(0,curV-curFix-curFrei);
  // Nettolohn nur des aktuellen Zeitraums (nicht aller rolling pts)
  var curNet=0;
  var salaryPts=avS.mode==='monat'?[pts[n-1]]:pts;
  salaryPts.forEach(function(p){var s=store.salary&&store.salary.person_1&&store.salary.person_1[p.dateStr];if(s)curNet+=s.netSalary||0;});
  var pBase=curNet>0?curNet:curV; // Fallback auf Gesamt wenn kein Gehalt erfasst
  var pFix=pBase>0?Math.round(curFix/pBase*100):0;
  var pFrei=pBase>0?Math.round(curFrei/pBase*100):0;
  var pSpar=pBase>0?Math.round(curSpar/pBase*100):0;
  // Sparquote: nur sinnvoll wenn Gehalt erfasst
  var sparquoteVal  = curNet>0 ? pSpar+'%' : '—';
  var sparquoteClr  = curNet>0 ? (pSpar>=20?'var(--green)':pSpar>=10?'var(--amber)':'var(--red)') : 'var(--tx3)';
  var sparquoteSub  = curNet>0 ? 'vom Netto' : 'Kein Gehalt';
  // Fixkostenquote: relativ zu Netto wenn vorhanden, sonst zu Ausgaben
  var fkqBase       = curNet>0 ? 'vom Netto' : 'der Ausgaben';
  var fkqPct        = curNet>0 ? pFix : (curV>0?Math.round(curFix/curV*100):0);
  var fkqClr        = fkqPct<=50?'var(--green)':fkqPct<=65?'var(--amber)':'var(--red)';
  var st=document.getElementById('av-stats');
  if(st)st.innerHTML=
    '<div class="av-stat"><div class="av-stat-lbl">'+avLabel()+'</div><div class="av-stat-val">'+eur(curV)+'</div></div>'+
    '<div class="av-stat"><div class="av-stat-lbl">'+prevLbl+'</div><div class="av-stat-val" style="color:'+(diff>0?'var(--red)':'var(--green)')+'">'+(diff>=0?'+':'')+eur(diff)+'</div></div>'+
    '<div class="av-stat"><div class="av-stat-lbl">'+avgLbl+'</div><div class="av-stat-val">'+eur(avg)+'</div></div>'+
    '<div class="av-stat"><div class="av-stat-lbl">Sparquote</div><div class="av-stat-val" style="color:'+sparquoteClr+'">'+sparquoteVal+'</div><div class="av-stat-sub">'+sparquoteSub+'</div></div>'+
    '<div class="av-stat"><div class="av-stat-lbl">Fixkostenquote</div><div class="av-stat-val" style="color:'+fkqClr+'">'+fkqPct+'%</div><div class="av-stat-sub">'+fkqBase+'</div></div>'+
    '<div class="av-legend">'+
      '<span class="av-leg-item"><span class="av-leg-dot" style="background:var(--blue)"></span><span>Fixkosten<br><span style="color:var(--blue);font-weight:700">'+pFix+'%</span></span></span>'+
      '<span class="av-leg-item"><span class="av-leg-dot" style="background:var(--green)"></span><span>Freizeit<br><span style="color:var(--green);font-weight:700">'+pFrei+'%</span></span></span>'+
      '<span class="av-leg-item"><span class="av-leg-dot" style="background:var(--purple)"></span><span>Sparen<br><span style="color:var(--purple);font-weight:700">'+pSpar+'%</span></span></span>'+
    '</div>';
}
function avToepfe(){
  var store=FP.Store.get();var bc=avBC();var cats={};store.categories.forEach(function(c){cats[c.id]=c;});
  var fixT=0,freiT=0;
  Object.values(bc).forEach(function(d){if(d.cat.group==='fixkosten')fixT+=d.total;else freiT+=d.total;});
  var ms=avMonths();var net=0;
  ms.forEach(function(m){var s=store.salary&&store.salary.person_1&&store.salary.person_1[m];if(s)net+=s.netSalary||0;});
  var bud=store.budget||{fixPct:50,freiPct:30,sparPct:20};
  var tp=[{cls:'fix',lbl:'Fixkosten',ist:fixT,soll:net*bud.fixPct/100},{cls:'frei',lbl:'Freizeit',ist:freiT,soll:net*bud.freiPct/100},{cls:'spar',lbl:'Sparen',ist:Math.max(0,net-fixT-freiT),soll:net*bud.sparPct/100}];
  var el=document.getElementById('av-toepfe');
  if(!el)return;
  if(net===0){
    el.innerHTML='<div style="grid-column:1/-1;padding:12px 14px;background:var(--amber-lt);border-radius:10px;font-size:12px;color:var(--amber);line-height:1.5">'+
      'Kein Gehalt für diesen Zeitraum erfasst — Budget-Soll kann nicht berechnet werden.<br>'+
      '<span style="cursor:pointer;text-decoration:underline" onclick="navTo(\'gehalt\')">Gehalt im Gehalt-Tab eintragen →</span>'+
      '</div>'+
      tp.map(function(t){
        return '<div class="av-topf '+t.cls+'"><div class="av-topf-lbl">'+t.lbl+'</div>'+
          '<div class="av-topf-valrow"><div class="av-topf-val">'+eur(t.ist)+'</div><span class="av-topf-badge none">—</span></div>'+
          '<div class="av-topf-sub">Kein Gehalt erfasst</div>'+
          '<div class="av-topf-bar"><div class="av-topf-fill" style="width:0%"></div></div></div>';
      }).join('');
    return;
  }
  el.innerHTML=tp.map(function(t){
    var p=t.soll>0?t.ist/t.soll*100:0;
    var pBar=Math.min(100,p);
    var ov=t.ist>t.soll&&t.soll>0;
    var badgeCls=t.soll<=0?'none':ov?'over':p>=90?'warn':'ok';
    var badgeTxt=t.soll>0?Math.round(p)+'%':'—';
    return '<div class="av-topf '+t.cls+(ov?' over':'')+'">'+
      '<div class="av-topf-lbl">'+t.lbl+'</div>'+
      '<div class="av-topf-valrow">'+
        '<div class="av-topf-val">'+eur(t.ist)+'</div>'+
        '<span class="av-topf-badge '+badgeCls+'">'+badgeTxt+'</span>'+
      '</div>'+
      '<div class="av-topf-sub">'+(t.soll>0?'Soll\u2009'+eur(t.soll):'Kein Gehalt erfasst')+'</div>'+
      '<div class="av-topf-bar"><div class="av-topf-fill" style="width:'+pBar.toFixed(1)+'%"></div></div>'+
    '</div>';
  }).join('');
}
// Aktualisiert Spalten-Header-Bezeichnung je nach View
function avUpdateTblHeader(){
  var el=document.getElementById('avh-name');
  if(!el)return;
  var labels={kategorien:'Kategorie',gruppen:'Gruppe',objekte:'Objekt'};
  el.childNodes[0]&&el.childNodes[0].nodeType===3
    ? el.childNodes[0].nodeValue=labels[avS.katView]||'Kategorie'
    : el.textContent=labels[avS.katView]||'Kategorie';
}

function avKatView(v,el){
  avS.katView=v;
  avS.expandedGroup=null;
  document.querySelectorAll('.av-seg-btn').forEach(function(b){b.classList.remove('active');});
  el.classList.add('active');
  avUpdateTblHeader();
  var bc=avBC();avRenderKat(bc);
}

function avRenderKat(bc){
  avUpdateTblHeader();
  if(avS.katView==='gruppen'){ avRenderKatGruppen(bc); return; }
  if(avS.katView==='objekte'){ avRenderKatObjekte(); return; }
  // Standard: Kategorien
  var items=avSorted(bc);var total=Math.abs(avTotal(bc))||1;
  var el=document.getElementById('av-kat-list');if(!el)return;
  if(!items.length){el.innerHTML='<div style="padding:16px;color:var(--tx3);font-size:13px">Keine Daten.</div>';return;}
  el.innerHTML=items.map(function(d){
    var pct=(Math.abs(d.total)/total*100).toFixed(1);
    var color=d.cat.color||'#6B7280';
    return '<div class="av-kat-row" onclick="avCatDetail(\''+d.cat.id+'\')">'+
      '<div class="av-kat-dot" style="background:'+color+'"></div>'+
      '<div class="av-kat-name">'+d.cat.name+'</div>'+
      '<div class="av-row-bar-wrap"><div class="av-row-bar-track"><div class="av-row-bar-fill" style="width:'+pct+'%;background:'+color+'"></div></div></div>'+
      '<div class="av-kat-amt" style="color:'+(d.total<0?'var(--green)':'var(--tx)')+'">'+eur(Math.abs(d.total))+'</div>'+
    '</div>';
  }).join('')+
  '<div class="av-kat-row tot">'+
    '<div class="av-kat-dot"></div>'+
    '<div class="av-kat-name">Gesamt</div>'+
    '<div class="av-row-bar-wrap"></div>'+
    '<div class="av-kat-amt">'+eur(Math.abs(avTotal(bc)))+'</div>'+
  '</div>';
}

/* ── Gruppen-View ── */
function avBCGrouped(bc){
  var catMap={};FP.Store.Categories.getAll().forEach(function(c){catMap[c.id]=c;});
  var groups={};
  Object.values(bc).forEach(function(d){
    var cat=d.cat;
    var gid=cat.parentId&&catMap[cat.parentId]?cat.parentId:cat.id;
    var gcAt=catMap[gid]||cat;
    if(!groups[gid])groups[gid]={cat:gcAt,total:0,count:0,children:[]};
    groups[gid].total+=d.total;
    groups[gid].count+=d.count;
    if(cat.parentId) groups[gid].children.push(d);
  });
  return groups;
}

function avRenderKatGruppen(bc){
  var groups=avBCGrouped(bc);
  var el=document.getElementById('av-kat-list');if(!el)return;
  var total=Math.abs(avTotal(bc))||1;
  var items=Object.values(groups).filter(function(g){return g.total!==0;});
  items.sort(function(a,b){return Math.abs(b.total)-Math.abs(a.total);});
  if(!items.length){el.innerHTML='<div style="padding:16px;color:var(--tx3);font-size:13px">Keine Daten.</div>';return;}
  var html=items.map(function(g){
    var pct=(Math.abs(g.total)/total*100).toFixed(1);
    var color=g.cat.color||'#6B7280';
    var isOpen=avS.expandedGroup===g.cat.id;
    var hasKids=g.children.length>0;
    var arrow=hasKids?'<span class="av-kat-grp-arrow'+(isOpen?' open':'')+'">›</span>':'<span style="width:14px;flex-shrink:0"></span>';
    var onclick=hasKids?'avToggleGroup(\''+g.cat.id+'\')':'avCatDetail(\''+g.cat.id+'\')';
    var row='<div class="av-kat-grp" onclick="'+onclick+'">'+
      arrow+
      '<div class="av-kat-dot" style="background:'+color+'"></div>'+
      '<div class="av-kat-grp-name">'+g.cat.name+'</div>'+
      '<div class="av-row-bar-wrap"><div class="av-row-bar-track"><div class="av-row-bar-fill" style="width:'+pct+'%;background:'+color+'"></div></div></div>'+
      '<div class="av-kat-amt" style="color:'+(g.total<0?'var(--green)':'var(--tx)')+'">'+eur(Math.abs(g.total))+'</div>'+
    '</div>';
    if(isOpen&&hasKids){
      var kids=g.children.slice().sort(function(a,b){return Math.abs(b.total)-Math.abs(a.total);});
      row+=kids.map(function(d){
        var cpct=(Math.abs(d.total)/Math.abs(g.total)*100).toFixed(1);
        var cc=d.cat.color||'#6B7280';
        return '<div class="av-kat-sub" onclick="avCatDetail(\''+d.cat.id+'\')">'+
          '<div class="av-kat-dot" style="background:'+cc+'"></div>'+
          '<div class="av-kat-name">'+d.cat.name+'</div>'+
          '<div class="av-row-bar-wrap"><div class="av-row-bar-track"><div class="av-row-bar-fill" style="width:'+cpct+'%;background:'+cc+'"></div></div></div>'+
          '<div class="av-kat-amt" style="color:'+(d.total<0?'var(--green)':'var(--tx)')+'">'+eur(Math.abs(d.total))+'</div>'+
        '</div>';
      }).join('');
    }
    return row;
  }).join('');
  html+='<div class="av-kat-row tot"><div class="av-kat-dot"></div><div class="av-kat-name">Gesamt</div><div class="av-row-bar-wrap"></div><div class="av-kat-amt">'+eur(Math.abs(avTotal(bc)))+'</div></div>';
  el.innerHTML=html;
}

function avToggleGroup(id){
  avS.expandedGroup=avS.expandedGroup===id?null:id;
  avRenderKat(avBC());
}

/* ── Objekte-View ── */
var AV_OBJ_COLORS=['var(--blue)','var(--green)','var(--purple)','var(--amber)','var(--red)','#0891B2','#EC4899','#84CC16','#64748B','#F97316'];

function avBCObj(){
  var store=FP.Store.get();
  var objMap={};store.objects.forEach(function(o){objMap[o.id]=o;});
  var catMap={};store.categories.forEach(function(c){catMap[c.id]=c;});
  var bo={};var colorIdx=0;
  store.transactions.forEach(function(tx){
    if(avMonths().indexOf(tx.date)<0)return;
    if(!tx.objectId)return;
    var obj=objMap[tx.objectId];
    if(!obj||obj.status==='archiviert')return;
    if(!bo[tx.objectId]){
      bo[tx.objectId]={obj:obj,total:0,count:0,byCat:{},
        color:AV_OBJ_COLORS[colorIdx%AV_OBJ_COLORS.length]};
      colorIdx++;
    }
    bo[tx.objectId].total+=tx.amount;
    bo[tx.objectId].count++;
    var cid=tx.categoryId||'_uncat';
    if(!bo[tx.objectId].byCat[cid])
      bo[tx.objectId].byCat[cid]={total:0,cat:catMap[cid]||{id:cid,name:'Ohne Kategorie',color:'var(--cat-slate)'}};
    bo[tx.objectId].byCat[cid].total+=tx.amount;
  });
  return bo;
}

function avRenderKatObjekte(){
  var bo=avBCObj();
  var el=document.getElementById('av-kat-list');if(!el)return;
  var items=Object.values(bo).filter(function(d){return d.total!==0;});
  items.sort(function(a,b){return Math.abs(b.total)-Math.abs(a.total);});
  if(!items.length){
    el.innerHTML='<div style="padding:16px;color:var(--tx3);font-size:13px">Keine Ausgaben mit Objekt-Zuordnung.</div>';
    return;
  }
  var grandTotal=items.reduce(function(s,d){return s+Math.abs(d.total);},0)||1;
  var html=items.map(function(d){
    var pct=(Math.abs(d.total)/grandTotal*100).toFixed(0);
    var isOpen=avS.expandedGroup===d.obj.id;
    var row='<div class="av-kat-grp" onclick="avToggleObj(\''+d.obj.id+'\')">'+
      '<span class="av-kat-grp-arrow'+(isOpen?' open':'')+'">›</span>'+
      '<span style="width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--tx2)">'+(OBJ_ICONS[d.obj.type]||d.obj.icon||'')+'</span>'+
      '<div class="av-kat-grp-name">'+d.obj.name+'</div>'+
      '<div class="av-kat-pct">'+pct+'%</div>'+
      '<div class="av-kat-amt" style="color:'+(d.total<0?'var(--green)':'var(--tx)')+'">'+eur(Math.abs(d.total))+'</div>'+
      '</div>';
    if(isOpen){
      var cats=Object.values(d.byCat).filter(function(c){return c.total!==0;});
      cats.sort(function(a,b){return Math.abs(b.total)-Math.abs(a.total);});
      row+=cats.map(function(c){
        var cpct=(Math.abs(c.total)/Math.abs(d.total)*100).toFixed(0);
        return '<div class="av-kat-sub" onclick="avCatDetail(\''+c.cat.id+'\')">'+
          '<div class="av-kat-dot" style="background:'+(c.cat.color||'#6B7280')+'"></div>'+
          '<div class="av-kat-name">'+c.cat.name+'</div>'+
          '<div class="av-kat-pct">'+cpct+'%</div>'+
          '<div class="av-kat-amt">'+eur(Math.abs(c.total))+'</div>'+
          '</div>';
      }).join('');
    }
    return row;
  }).join('');
  html+='<div class="av-kat-row tot"><div class="av-kat-dot"></div><div class="av-kat-name">Gesamt</div><div class="av-kat-pct"></div><div class="av-kat-amt">'+eur(grandTotal)+'</div></div>';
  el.innerHTML=html;
}

function avToggleObj(id){
  avS.expandedGroup=avS.expandedGroup===id?null:id;
  avRenderKatObjekte();
}
function avRenderViz(bc){
  var el=document.getElementById('av-viz');if(!el)return;
  var items=avSorted(bc).filter(function(d){return d.total>0;});
  var total=Math.abs(avTotal(bc))||1;
  if(avS.view==='donut'){
    var S=200,cx=100,cy=100,r=80,ri=50;
    var svg='<svg width="'+S+'" height="'+S+'" viewBox="0 0 180 180">';
    var sa=-Math.PI/2;
    items.slice(0,9).forEach(function(d){
      var sl=(Math.abs(d.total)/total)*2*Math.PI;var ea=sa+sl;
      var x1=cx+r*Math.cos(sa),y1=cy+r*Math.sin(sa),x2=cx+r*Math.cos(ea),y2=cy+r*Math.sin(ea);
      var xi1=cx+ri*Math.cos(ea),yi1=cy+ri*Math.sin(ea),xi2=cx+ri*Math.cos(sa),yi2=cy+ri*Math.sin(sa);
      var lg=sl>Math.PI?1:0;var isSel=avS.selCat===d.cat.id;var op=avS.selCat&&!isSel?0.2:1;
      svg+='<path d="M'+x1.toFixed(1)+','+y1.toFixed(1)+' A'+r+','+r+' 0 '+lg+',1 '+x2.toFixed(1)+','+y2.toFixed(1)+' L'+xi1.toFixed(1)+','+yi1.toFixed(1)+' A'+ri+','+ri+' 0 '+lg+',0 '+xi2.toFixed(1)+','+yi2.toFixed(1)+' Z" fill="'+(d.cat.color||'#6B7280')+'" opacity="'+op+'" stroke="#fff" stroke-width="1.5"/>';
      sa=ea;
    });
    var midT=avS.selCat?items.filter(function(d){return d.cat.id===avS.selCat;}).reduce(function(s,d){return s+Math.abs(d.total);},0):Math.abs(avTotal(bc));
    var midCat=avS.selCat?items.find(function(d){return d.cat.id===avS.selCat;}):null;
    var midN=midCat?midCat.cat.name:'Gesamt';
    // Name kürzen wenn zu lang für Donut-Mitte
    if(midN.length>10)midN=midN.slice(0,9)+'…';
    var dcs=getComputedStyle(document.documentElement);
    var dtx=dcs.getPropertyValue('--tx').trim()||'#1C1C1E';
    var dtx3=dcs.getPropertyValue('--tx3').trim()||'#AEAEB2';
    // Center: Label oben, Betrag groß darunter
    svg+='<text x="90" y="93" text-anchor="middle" font-size="9" fill="'+dtx3+'" font-family="Inter,sans-serif" letter-spacing="0.5">'+midN.toUpperCase()+'</text>';
    svg+='<text x="90" y="112" text-anchor="middle" font-size="15" font-weight="800" fill="'+dtx+'" font-family="Inter,sans-serif" letter-spacing="-0.5">'+eur(midT)+'</text>';
    svg+='</svg>';
    el.innerHTML=svg;
  } else {
    el.style.alignItems='flex-start';
    el.innerHTML='<div style="width:100%">'+items.slice(0,6).map(function(d){
      var w=(Math.abs(d.total)/total*100).toFixed(1);var op=avS.selCat&&avS.selCat!==d.cat.id?0.25:1;
      return '<div class="av-bal-item" style="opacity:'+op+'"><div class="av-bal-lbl"><span style="color:var(--tx2)">'+d.cat.name+'</span><span style="color:var(--tx);font-weight:600">'+eur(Math.abs(d.total))+'</span></div><div class="av-bal-track"><div class="av-bal-fill" style="width:'+w+'%;background:'+(d.cat.color||'#6B7280')+'"></div></div></div>';
    }).join('')+'</div>';
  }
}

/* ── Kategorie-Detailansicht ── */
function avCatDetail(id){
  var cat=FP.Store.Categories.getAll().find(function(c){return c.id===id;});
  if(!cat)return;
  var years=FP.Calculator.getAvailableYears();
  if(!years.length)return;
  var trend=FP.Calculator.getCategoryTrend(id,years[0],years[years.length-1]);

  // Aggregate by year
  var byYear={};
  years.forEach(function(y){byYear[y]=0;});
  trend.forEach(function(p){byYear[p.year]=(byYear[p.year]||0)+p.total;});

  var total=trend.reduce(function(s,p){return s+p.total;},0);
  var activeYears=Object.values(byYear).filter(function(v){return v>0;});
  var avgYear=activeYears.length?total/activeYears.length:0;
  var avgMonth=trend.length?total/trend.length:0;

  // All transactions for this category, newest first
  var store=FP.Store.get();
  var allTxs=store.transactions.filter(function(tx){return tx.categoryId===id;});
  allTxs.sort(function(a,b){
    var ap=a.date.split('.'),bp=b.date.split('.');
    return (parseInt(bp[1])*12+parseInt(bp[0]))-(parseInt(ap[1])*12+parseInt(ap[0]));
  });

  var el=document.getElementById('av-kat-list');
  if(!el)return;
  el.style.maxHeight='none';
  el.style.overflowY='visible';
  el.style.display='flex';
  el.style.flexDirection='column';
  el.style.gap='12px';

  // Build transactions list grouped by month
  var txByMonth={};
  allTxs.forEach(function(tx){
    if(!txByMonth[tx.date])txByMonth[tx.date]=[];
    txByMonth[tx.date].push(tx);
  });
  var catMap={};store.categories.forEach(function(c){catMap[c.id]=c;});
  var objMap={};if(store.objects)store.objects.forEach(function(o){objMap[o.id]=o;});

  var txHtml=Object.entries(txByMonth).map(function(e){
    var dateStr=e[0],txs=e[1];
    var parts=dateStr.split('.');
    var mo=parseInt(parts[0]),yr=parseInt(parts[1]);
    var moLbl=MON[mo-1]+' '+yr;
    var monthTotal=txs.reduce(function(s,t){return s+t.amount;},0);
    var rows=txs.map(function(tx){
      var sub=tx.subcategoryId?catMap[tx.subcategoryId]:null;
      var obj=tx.objectId?objMap[tx.objectId]:null;
      var lbl=tx.rawName||(sub?sub.name:cat.name);
      var noteParts=[sub?sub.name:null,obj?obj.name:null,tx.note||null].filter(Boolean);
      var isRefund=tx.amount<0;
      return '<div class="av-cd-tx">'+
        '<div class="av-cd-tx-lbl">'+
          '<div class="av-cd-tx-name">'+(isRefund?'<span style="color:var(--green);font-size:10px;font-weight:700;margin-right:4px">ERSTATTUNG</span>':'')+lbl+'</div>'+
          (noteParts.length?'<div class="av-cd-tx-note">'+noteParts.join(' · ')+'</div>':'')+
        '</div>'+
        '<div class="av-cd-tx-amt" style="color:'+(isRefund?'var(--green)':'var(--tx)')+'">'+
          (isRefund?'+ ':'')+eur(Math.abs(tx.amount))+
        '</div>'+
      '</div>';
    }).join('');
    return '<div class="av-cd-mo-hdr">'+
        '<span style="font-weight:700;color:var(--tx)">'+moLbl+'</span>'+
        '<span style="font-weight:700;color:var(--tx)">'+eur(Math.abs(monthTotal))+'</span>'+
      '</div>'+rows;
  }).join('');

  var color=cat.color||'#6B7280';
  var icon=ICONS[cat.id]||'';
  el.innerHTML=
    // ── Header-Card: Zurück + Name + 3 Kennzahlen ──
    '<div class="av-cd-card">'+
      '<div class="av-cd-back" onclick="avCatBack()">‹ Zurück</div>'+
      '<div class="av-cd-hdr">'+
        '<div class="av-cd-dot" style="background:'+color+'"></div>'+
        '<div class="av-cd-name">'+(icon||'')+'<span>'+cat.name+'</span></div>'+
      '</div>'+
      '<div class="av-cd-stats">'+
        '<div class="av-cd-stat"><div class="av-cd-stat-lbl">Gesamt</div><div class="av-cd-stat-val">'+eur(total)+'</div></div>'+
        '<div class="av-cd-stat"><div class="av-cd-stat-lbl">Ø / Monat</div><div class="av-cd-stat-val">'+eur(avgMonth)+'</div></div>'+
        '<div class="av-cd-stat"><div class="av-cd-stat-lbl">Buchungen</div><div class="av-cd-stat-val">'+allTxs.length+'</div></div>'+
      '</div>'+
    '</div>'+
    // ── Verlauf-Chart ──
    '<div class="av-cd-card" style="padding:14px 16px 12px">'+
      '<div class="av-cd-sec-lbl">Verlauf</div>'+
      '<canvas id="av-cd-canvas" style="display:block;width:100%;margin-top:8px"></canvas>'+
    '</div>'+
    // ── Buchungen ──
    '<div class="av-cd-card av-cd-tx-card">'+
      '<div class="av-cd-sec-lbl" style="padding:14px 16px 10px">Buchungen</div>'+
      (txHtml||'<div style="padding:0 16px 14px;color:var(--tx3);font-size:13px">Keine Buchungen.</div>')+
    '</div>';

  // Draw chart after DOM update
  requestAnimationFrame(function(){ avCatTrend(id,trend,cat); });
}

function avCatBack(){
  var el=document.getElementById('av-kat-list');
  if(el){el.style.maxHeight='420px';el.style.overflowY='auto';el.style.display='';el.style.flexDirection='';el.style.gap='';}
  var bc=avBC();avRenderKat(bc);
}

function avCatTrend(id,trend,cat){
  var canvas=document.getElementById('av-cd-canvas');
  if(!canvas)return;
  var color=cat.color||'#6B7280';
  var dpr=window.devicePixelRatio||1;
  var W=canvas.parentNode.getBoundingClientRect().width||canvas.parentNode.offsetWidth||300;
  var H=130;
  canvas.width=W*dpr;canvas.height=H*dpr;
  canvas.style.width=W+'px';canvas.style.height=H+'px';
  var ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);ctx.clearRect(0,0,W,H);

  if(!trend.length){
    ctx.font='12px Inter,sans-serif';
    ctx.fillStyle='#AEAEB2';ctx.textAlign='center';
    ctx.fillText('Keine Daten',W/2,H/2);return;
  }

  var cs=getComputedStyle(document.documentElement);
  var cTx=cs.getPropertyValue('--tx').trim()||'#1C1C1E';
  var cTx3=cs.getPropertyValue('--tx3').trim()||'#AEAEB2';
  var cBrd=cs.getPropertyValue('--brd').trim()||'#E5E5EA';

  // Build full month list (incl. zeros) from first to last data point
  var pts=[];
  var firstPt=trend[0],lastPt=trend[trend.length-1];
  var trendMap={};
  trend.forEach(function(p){trendMap[p.date]=p.total;});
  for(var yr=firstPt.year;yr<=lastPt.year;yr++){
    var mStart=yr===firstPt.year?firstPt.month:1;
    var mEnd=yr===lastPt.year?lastPt.month:12;
    for(var mo=mStart;mo<=mEnd;mo++){
      var ds=String(mo).padStart(2,'0')+'.'+yr;
      pts.push({month:mo,year:yr,date:ds,total:trendMap[ds]||0});
    }
  }

  var n=pts.length;
  var pL=6,pR=6,pT=18,pB=28;
  var cW=W-pL-pR,cH=H-pT-pB;
  var maxV=Math.max.apply(null,pts.map(function(p){return p.total;}).concat([1]));
  var bW=cW/n;var gap=Math.max(1,bW*.2);
  var curM=new Date().getMonth()+1,curY=new Date().getFullYear();

  var avg=trend.reduce(function(s,p){return s+p.total;},0)/trend.length;
  var avgY=pT+cH-(avg/maxV)*cH;

  function drawTrend(hovIdx){
    ctx.clearRect(0,0,W,H);
    // Average line
    ctx.beginPath();ctx.setLineDash([3,3]);
    ctx.strokeStyle=cBrd;ctx.lineWidth=1;
    ctx.moveTo(pL,avgY);ctx.lineTo(W-pR,avgY);ctx.stroke();
    ctx.setLineDash([]);

    pts.forEach(function(p,i){
      var x=pL+i*bW;
      var isCur=p.month===curM&&p.year===curY;
      var isHov=i===hovIdx;
      var bh=p.total>0?Math.max(2,(p.total/maxV)*cH):0;
      var by=pT+cH-bh;

      if(p.total>0){
        ctx.fillStyle=isHov?cTx:color;
        ctx.globalAlpha=isHov?1:(isCur?1:0.55);
        ctx.beginPath();
        ctx.roundRect?ctx.roundRect(x+gap/2,by,bW-gap,bh,2):ctx.rect(x+gap/2,by,bW-gap,bh);
        ctx.fill();
        ctx.globalAlpha=1;
      }

      // Value label: hovered bar OR current month
      if((isHov||isCur)&&p.total>0){
        ctx.font='bold 9px Inter,sans-serif';
        ctx.fillStyle=cTx;ctx.textAlign='center';ctx.textBaseline='bottom';
        ctx.fillText(eur(p.total),x+bW/2,by-2);
      }

      // Month label
      if(p.month===1||n<=18||(n<=36&&p.month%3===1)||(n>36&&p.month===7)){
        ctx.font=(isCur?'bold ':'')+' 8px Inter,sans-serif';
        ctx.fillStyle=isCur?cTx:cTx3;ctx.textAlign='center';ctx.textBaseline='top';
        var lbl=p.month===1?'Jan \''+String(p.year).slice(2):MON[p.month-1].slice(0,3);
        ctx.fillText(lbl,x+bW/2,H-pB+4);
      }
    });

    // Hover label at top
    if(hovIdx>=0&&hovIdx<pts.length&&pts[hovIdx].total>0){
      var p=pts[hovIdx];
      var lbl=MON[p.month-1]+' '+p.year;
      ctx.font='bold 9px Inter,sans-serif';
      ctx.fillStyle=cTx3;ctx.textAlign='left';ctx.textBaseline='top';
      ctx.fillText(lbl,pL,1);
    }

    // Avg label
    ctx.font='9px Inter,sans-serif';
    ctx.fillStyle=cTx3;ctx.textAlign='right';ctx.textBaseline='bottom';
    ctx.fillText('Ø '+eur(avg),W-pR,avgY-2);
  }

  drawTrend(-1);

  canvas.style.cursor='pointer';
  canvas.onmousemove=function(e){
    var r=canvas.getBoundingClientRect();
    var x=(e.clientX-r.left)*(W/r.width);
    var idx=Math.floor((x-pL)/bW);
    drawTrend((idx>=0&&idx<pts.length)?idx:-1);
  };
  canvas.onmouseleave=function(){drawTrend(-1);};
  canvas.onclick=function(e){
    var r=canvas.getBoundingClientRect();
    var x=(e.clientX-r.left)*(W/r.width);
    var idx=Math.floor((x-pL)/bW);
    if(idx>=0&&idx<pts.length&&pts[idx].total>0){
      toast(MON[pts[idx].month-1]+' '+pts[idx].year+' · '+eur(pts[idx].total));
    }
  };
}

function avPickerChange(val){
  if(!val)return;
  var parts=val.split('-');
  avS.year=parseInt(parts[0]);avS.month=parseInt(parts[1]);
  avRender();
}

function avInit(){
  avS.month=new Date().getMonth()+1;avS.year=new Date().getFullYear();
  // Tab wird sichtbar — Canvas braucht einen Frame damit clientWidth korrekt ist
  requestAnimationFrame(function() { avRender(); });
}

/* ════════════════════════════════════════
   OBJEKTE TAB
════════════════════════════════════════ */
var obS={selectedId:null};
var OB_TYPE_LABEL={fahrzeug:'Fahrzeug',reise:'Reise',projekt:'Projekt',person:'Person',geraet:'Gerät',sonstiges:'Sonstiges'};

function obInit(){obS.selectedId=null;obRender();}

function obNew(){
  _stEditObjId = null;
  document.getElementById('mo-name').value='';
  document.getElementById('mo-type').value='fahrzeug';
  document.getElementById('mo-desc').value='';
  document.getElementById('mo-ttl').textContent='Neues Objekt';
  document.getElementById('mo-save-btn').textContent='Erstellen';
  openM('m-obj');
  setTimeout(function(){document.getElementById('mo-name').focus();},150);
}

function obArchive(id){
  FP.Store.Objects.archive(id);
  obS.selectedId=null;
  obRenderGrid();
  toast('Archiviert');
}

function obRestore(id){
  FP.Store.Objects.update(id,{status:'aktiv',endDate:null});
  obRenderDetail(id);
  toast('Wiederhergestellt');
}

function obRender(){
  if(obS.selectedId)obRenderDetail(obS.selectedId);
  else              obRenderGrid();
}

function obRenderGrid(){
  var el=document.getElementById('ob-wrap');
  if(!el)return;
  var objs=FP.Store.Objects.getAll();
  var active=objs.filter(function(o){return o.status!=='archiviert';});
  var arch=objs.filter(function(o){return o.status==='archiviert';});

  var header='<div class="ob-hdr"><span class="ob-hdr-title">Objekte</span><button class="st-btn primary" onclick="obNew()">+ Neu</button></div>';

  if(!active.length&&!arch.length){
    el.innerHTML=header+'<div class="ph"><div class="ph-ico">'+OBJ_ICONS.fahrzeug+'</div><div class="ph-title">Noch keine Objekte</div><div class="ph-sub">Fahrzeuge, Reisen, Projekte — tippe auf + Neu</div></div>';
    return;
  }

  var gridHtml=function(list){
    return list.map(function(o){
      var s=FP.Calculator.getObjectSummary(o.id);
      var total=s?s.total:0;var cnt=s?s.txCount:0;
      return '<div class="ob-card" onclick="obSelect(\''+o.id+'\')">'+
        '<div class="ob-card-ico">'+(OBJ_ICONS[o.type]||o.icon||'')+'</div>'+
        '<div class="ob-card-name">'+o.name+'</div>'+
        '<div class="ob-card-type">'+(OB_TYPE_LABEL[o.type]||o.type)+'</div>'+
        '<div class="ob-card-total">'+eur(total)+'</div>'+
        '<div class="ob-card-cnt">'+cnt+' Buchungen</div>'+
        '</div>';
    }).join('');
  };

  var html=header+'<div class="ob-grid">'+gridHtml(active)+'</div>';
  if(arch.length){
    html+='<div style="font-size:12px;font-weight:700;color:var(--tx3);text-transform:uppercase;letter-spacing:.05em;margin-top:4px">Archiviert</div>'+
      '<div class="ob-grid" style="opacity:.5">'+gridHtml(arch)+'</div>';
  }
  el.innerHTML=html;
}

function obSelect(id){obS.selectedId=id;obRenderDetail(id);}

function obBack(){obS.selectedId=null;obRenderGrid();}

function obRenderDetail(id){
  var el=document.getElementById('ob-wrap');
  if(!el)return;
  var s=FP.Calculator.getObjectSummary(id);
  if(!s){el.innerHTML='<div style="padding:20px;color:var(--tx3)">Objekt nicht gefunden.</div>';return;}
  var o=s.object;

  // Kategorien sortiert
  var cats=Object.entries(s.byCat).sort(function(a,b){return b[1].total-a[1].total;});
  var catRows=cats.map(function(e){
    var name=e[0],d=e[1];
    return '<div class="ob-row">'+
      '<div class="ob-row-dot" style="background:'+(d.color||'#6B7280')+'"></div>'+
      '<div class="ob-row-name">'+name+'</div>'+
      '<div class="ob-row-cnt">'+d.count+'×</div>'+
      '<div class="ob-row-amt">'+eur(d.total)+'</div>'+
      '</div>';
  }).join('');

  // Jahre sortiert
  var years=Object.entries(s.byYear).sort(function(a,b){return b[0]-a[0];});
  var yearRows=years.map(function(e){
    return '<div class="ob-row">'+
      '<div class="ob-row-name" style="font-weight:600">'+e[0]+'</div>'+
      '<div class="ob-row-amt">'+eur(e[1])+'</div>'+
      '</div>';
  }).join('');

  var isArch=o.status==='archiviert';
  el.innerHTML=
    '<div class="ob-back" onclick="obBack()">‹ Alle Objekte</div>'+
    '<div class="ob-detail-hdr">'+
      '<div class="ob-detail-ico">'+(OBJ_ICONS[o.type]||o.icon||'')+'</div>'+
      '<div class="ob-detail-name">'+o.name+'</div>'+
      '<div class="ob-detail-type">'+(OB_TYPE_LABEL[o.type]||o.type)+(o.description?' · '+o.description:'')+(isArch?' · archiviert':'')+'</div>'+
      '<div class="ob-detail-total">'+eur(s.total)+'</div>'+
      '<div class="ob-detail-sub">'+s.txCount+' Buchungen gesamt</div>'+
      '<div style="margin-top:14px">'+
        (isArch
          ? '<button class="st-btn" onclick="obRestore(\''+o.id+'\')">Wiederherstellen</button>'
          : '<button class="st-btn danger" onclick="obArchive(\''+o.id+'\')">Archivieren</button>')+
      '</div>'+
    '</div>'+
    (cats.length?'<div class="ob-section"><div class="ob-section-hdr">Nach Kategorie</div>'+catRows+'</div>':'') +
    (years.length?'<div class="ob-section"><div class="ob-section-hdr">Nach Jahr</div>'+yearRows+'</div>':'') +
    (!cats.length&&!years.length?'<div style="padding:20px;text-align:center;color:var(--tx3);font-size:13px">Noch keine Buchungen für dieses Objekt.</div>':'');
}

/* ════════════════════════════════════════
   EINSTELLUNGEN TAB
════════════════════════════════════════ */
// Offizielle Destatis-Werte (VPI, Jahresdurchschnitt) + Bundesbank-Prognosen
// Stand: April 2026 — bei Bedarf manuell korrigierbar
var INFL_REF = {
  2000:1.4, 2001:2.0, 2002:1.4, 2003:1.0, 2004:1.7, 2005:1.5,
  2006:1.6, 2007:2.3, 2008:2.6, 2009:0.4, 2010:1.1, 2011:2.1,
  2012:2.0, 2013:1.5, 2014:0.9, 2015:0.3, 2016:0.5, 2017:1.8,
  2018:1.9, 2019:1.4, 2020:0.5, 2021:3.1, 2022:6.9, 2023:5.9,
  2024:2.2, 2025:2.3, 2026:2.1, 2027:2.0
};
// Jahre bis einschl. dieses Jahres gelten als Destatis-Werte, danach Prognosen
var INFL_REF_CONFIRMED_UNTIL = 2025;

function stInflUpdate(){
  var updated=0;
  Object.keys(INFL_REF).forEach(function(yr){
    FP.Store.Settings.setInflation(parseInt(yr), INFL_REF[yr]);
    updated++;
  });
  stRenderInflation();
  appLog('EINST', updated+' Inflationswerte aktualisiert (Destatis/Bundesbank)');
  toast(updated+' Inflationswerte aktualisiert (Destatis/Bundesbank)');
}

function stRenderInflation(){
  var el=document.getElementById('st-infl-rows');
  if(!el)return;
  var infl=FP.Store.get().inflation||{};
  var years=Object.keys(infl).map(Number).sort(function(a,b){return b-a;});
  el.innerHTML=years.map(function(yr){
    var isPrognose=yr>INFL_REF_CONFIRMED_UNTIL;
    return '<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--brd)">'+
      '<span style="font-size:13px;font-weight:600;color:var(--tx);width:48px">'+yr+'</span>'+
      (isPrognose?'<span style="font-size:10px;background:var(--blue-lt);color:var(--blue);border-radius:4px;padding:1px 5px;flex-shrink:0">Prognose</span>':
                  '<span style="font-size:10px;background:var(--surf2);color:var(--tx3);border-radius:4px;padding:1px 5px;flex-shrink:0">Destatis</span>')+
      '<input class="fi" type="number" min="-5" max="30" step="0.1" inputmode="decimal"'+
        ' style="flex:1;padding:4px 8px;font-size:13px"'+
        ' value="'+infl[yr]+'"'+
        ' onchange="stInflSave('+yr+',this.value)">'+
      '<span style="font-size:13px;color:var(--tx3);flex-shrink:0">%</span>'+
      (isPrognose?'<button onclick="stInflDelete('+yr+')" style="background:none;border:none;color:var(--tx3);cursor:pointer;font-size:16px;padding:0 4px;line-height:1" title="Löschen">×</button>':'<span style="width:24px"></span>')+
    '</div>';
  }).join('');
}

function stInflSave(year,val){
  var rate=parseFloat(val);
  if(isNaN(rate))return;
  FP.Store.Settings.setInflation(year,rate);
  appLog('EINST', 'Inflation '+year+': '+rate.toFixed(1)+'%');
  toast(year+': '+rate.toFixed(1)+'% gespeichert');
}

function stInflDelete(year){
  FP.Store.Settings.deleteInflation(year);
  stRenderInflation();
  appLog('EINST', 'Inflation '+year+' entfernt');
  toast(year+' entfernt');
}

function stInflAdd(){
  var yr=parseInt(document.getElementById('st-infl-new-year').value);
  var rate=parseFloat(document.getElementById('st-infl-new-rate').value);
  if(!yr||yr<2000||yr>2099){toast('Bitte gültiges Jahr eingeben');return;}
  if(isNaN(rate)){toast('Bitte Inflationsrate eingeben');return;}
  FP.Store.Settings.setInflation(yr,rate);
  document.getElementById('st-infl-new-year').value='';
  document.getElementById('st-infl-new-rate').value='';
  stRenderInflation();
  appLog('EINST', 'Inflation '+yr+': '+rate.toFixed(1)+'% hinzugefügt');
  toast(yr+': '+rate.toFixed(1)+'% hinzugefügt');
}

function stInit(){ stRender(); }

function stRender(){
  stRenderStammdaten();
  stRenderBudget();
  stRenderCats();
  stRenderObjs();
  stRenderTrash();
  stRenderCurrencies();
  stRenderInflation();
  stRenderApiKey();
  stOpenLog();
}

function stRenderApiKey(){
  var key=FP.Store.Settings.getApiKey('alphavantage');
  var inp=document.getElementById('st-av-key');
  var status=document.getElementById('st-av-status');
  if(!inp)return;
  inp.value=key;
  if(key){
    status.style.color='var(--green)';
    status.textContent='✓ API-Key gespeichert · Kursabruf aktiv';
  } else {
    status.style.color='var(--amber)';
    status.textContent='⚠ Kein API-Key — Kursabruf nicht möglich';
  }
}

function stSaveApiKey(){
  var key=document.getElementById('st-av-key').value.trim();
  FP.Store.Settings.setApiKey('alphavantage',key);
  stRenderApiKey();
  toast(key?'API-Key gespeichert':'API-Key entfernt');
}

function stTestApiKey(){
  var key=document.getElementById('st-av-key').value.trim()||FP.Store.Settings.getApiKey('alphavantage');
  var status=document.getElementById('st-av-status');
  if(!key){status.style.color='var(--amber)';status.textContent='⚠ Bitte zuerst API-Key eingeben';return;}

  // Verbindungstest + Kursabruf für alle hinterlegten Ticker
  status.style.color='var(--tx3)'; status.textContent='Teste Verbindung …';
  var testUrl='https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey='+encodeURIComponent(key);
  vmFetchWithTimeout(testUrl,10000)
    .then(function(r){return r.json();})
    .then(function(d){
      if(d&&d.Information) throw new Error('Key ungültig oder Limit: '+d.Information.slice(0,80));
      var q=d&&d['Global Quote'];
      if(!q||!q['05. price']) throw new Error('Keine Antwort — Key prüfen');
      var lines=['✓ Verbindung OK (AAPL: '+parseFloat(q['05. price']).toFixed(2)+')',''];
      var assets=FP.Store.Assets.getActive().filter(function(a){return a.ticker;});
      if(!assets.length){status.style.color='var(--green)';status.innerHTML=lines[0];return;}
      // 1,5s Pause nach AAPL-Test bevor ETFs abgefragt werden
      setTimeout(function(){
      function testNext(i){
        if(i>=assets.length){
          status.style.color='var(--green)';
          status.innerHTML=lines.map(function(l){return l.replace(/</g,'&lt;');}).join('<br>');
          _renderLog(document.getElementById('st-log-output'));
          return;
        }
        var a=assets[i];
        status.style.color='var(--tx3)';
        status.textContent='Teste '+a.ticker+' ('+(i+1)+'/'+assets.length+') …';
        vmFetchPrice(a.ticker)
          .then(function(r){lines.push('✓ '+a.ticker+': '+r.price.toFixed(2)+' EUR');})
          .catch(function(e){lines.push('✗ '+a.ticker+': '+e.message);})
          .then(function(){ setTimeout(function(){ testNext(i+1); }, 1500); });
      }
      testNext(0);
      }, 1500); // Ende setTimeout nach AAPL
    })
    .catch(function(e){
      status.style.color='var(--red)';
      status.textContent='✗ Verbindungsfehler: '+(e&&e.message?e.message:'CORS oder Netzwerk');
    });
}

function stRenderBudget(){
  var b=FP.Store.Settings.getBudget();
  document.getElementById('st-fix').value =b.fixPct;
  document.getElementById('st-frei').value=b.freiPct;
  document.getElementById('st-spar').value=b.sparPct;
  stUpdateBudgetTotal();
}

function stUpdateBudgetTotal(){
  var fix =parseInt(document.getElementById('st-fix').value)||0;
  var frei=parseInt(document.getElementById('st-frei').value)||0;
  var spar=parseInt(document.getElementById('st-spar').value)||0;
  var total=fix+frei+spar;
  var el=document.getElementById('st-budget-total');
  if(el){el.textContent=total+'%';el.style.color=total===100?'var(--green)':'var(--red)';}
  document.getElementById('st-fix-pct').textContent =fix+'%';
  document.getElementById('st-frei-pct').textContent=frei+'%';
  document.getElementById('st-spar-pct').textContent=spar+'%';
}

function stSaveBudget(){
  var fix =parseInt(document.getElementById('st-fix').value)||0;
  var frei=parseInt(document.getElementById('st-frei').value)||0;
  var spar=parseInt(document.getElementById('st-spar').value)||0;
  if(fix+frei+spar!==100){toast('Summe muss 100% ergeben');return;}
  FP.Store.Settings.setBudget(fix,frei,spar);
  appLog('EINST', 'Budget: Fix '+fix+'% / Frei '+frei+'% / Spar '+spar+'%');
  toast('Budget gespeichert');
}

function stRenderCats(){
  var el=document.getElementById('st-cats');
  if(!el)return;
  var allCats=FP.Store.Categories.getAll();
  var parents=allCats.filter(function(c){return!c.parentId;});
  var html='';
  parents.forEach(function(c){
    var hidden=c.hidden;
    var icon=ICONS[c.id]||ICON_FALLBACK;
    var subs=allCats.filter(function(s){return s.parentId===c.id;});
    // Hauptkategorie
    html+='<div class="st-row">'+
      '<div style="width:10px;height:10px;border-radius:50%;background:'+(c.color||'#6B7280')+';flex-shrink:0"></div>'+
      '<div class="st-row-info">'+
        '<div class="st-row-name" style="opacity:'+(hidden?0.4:1)+'">'+icon+'<span>'+c.name+'</span></div>'+
        '<div class="st-row-sub">'+(c.group==='fixkosten'?'Notwendig':'Freizeit & Lifestyle')+
          (subs.length?' · '+subs.length+' Unterkategor'+(subs.length===1?'ie':'ien'):'')+(hidden?' · ausgeblendet':'')+
          (c.showInInput===false?'<span class="fk-only-badge">Nur Fixkosten</span>':'')+'</div>'+
      '</div>'+
      '<div class="st-row-actions">'+
        '<button class="st-btn" onclick="stEditCat(\''+c.id+'\')">Bearbeiten</button>'+
        '<button class="st-btn" onclick="stToggleCat(\''+c.id+'\','+hidden+')">'+(hidden?'Einblenden':'Ausblenden')+'</button>'+
        '<button class="st-btn danger" onclick="stDeleteCat(\''+c.id+'\')">Löschen</button>'+
      '</div>'+
    '</div>';
    // Unterkategorien eingerückt darunter
    subs.forEach(function(s){
      var shidden=s.hidden;
      html+='<div class="st-row" style="padding-left:24px;background:var(--bg)">'+
        '<div style="width:7px;height:7px;border-radius:50%;background:'+(s.color||'#6B7280')+';flex-shrink:0;margin-left:6px"></div>'+
        '<div class="st-row-info">'+
          '<div class="st-row-name" style="font-size:13px;opacity:'+(shidden?0.4:1)+'">'+s.name+'</div>'+
          '<div class="st-row-sub">Unterkategorie von '+c.name+(shidden?' · ausgeblendet':'')+'</div>'+
        '</div>'+
        '<div class="st-row-actions">'+
          '<button class="st-btn" onclick="stEditCat(\''+s.id+'\')">Bearbeiten</button>'+
          '<button class="st-btn" onclick="stToggleCat(\''+s.id+'\','+shidden+')">'+(shidden?'Einblenden':'Ausblenden')+'</button>'+
          '<button class="st-btn danger" onclick="stDeleteCat(\''+s.id+'\')">Löschen</button>'+
        '</div>'+
      '</div>';
    });
  });
  el.innerHTML=html||'<div style="padding:14px 0;color:var(--tx3);font-size:13px">Keine Kategorien.</div>';
}

function stToggleCat(id,hidden){
  if(hidden)FP.Store.Categories.show(id);
  else      FP.Store.Categories.hide(id);
  stRenderCats();
  buildCats();
  toast(hidden?'Eingeblendet':'Ausgeblendet');
}

function stDeleteCat(id){
  var cat=FP.Store.Categories.getAll().find(function(c){return c.id===id;});
  if(!cat)return;
  var isSystem=cat.source==='system';
  var txs=FP.Store.Transactions.getAll().filter(function(t){return t.categoryId===id;});
  var recs=FP.Store.Recurring.getAll().filter(function(r){return r.categoryId===id;});
  var inUse=txs.length+recs.length;
  // System-Kategorien ohne Nutzung dürfen echte gelöscht werden; mit Nutzung nur ausblenden
  var mustHide=isSystem&&inUse>0;
  var action=mustHide?'ausblenden':'löschen';
  var msg=inUse>0
    ?'"'+cat.name+'" '+action+'? Bei '+txs.length+' Transaktionen wird die Kategorie als Notiz gesichert.'+(recs.length?' '+recs.length+' Fixkosten-Vorlagen auf "Sonstiges".':'')
    :'"'+cat.name+'" '+action+'?';
  if(!confirm(msg))return;
  txs.forEach(function(t){
    var n=t.note?t.note.trim():'';
    FP.Store.Transactions.update(t.id,{categoryId:'cat_sonstiges',note:n?n+' \xb7 ['+cat.name+']':'['+cat.name+']'});
  });
  recs.forEach(function(r){
    FP.Store.Recurring.update(r.id,{categoryId:'cat_sonstiges'});
  });
  if(mustHide){
    FP.Store.Categories.hide(id);
  } else {
    FP.Store.Categories.delete(id);
  }
  stRenderCats();
  buildCats();
  toast('"'+cat.name+'" '+(mustHide?'ausgeblendet':'gelöscht')+(txs.length>0?' \xb7 '+txs.length+' Buchungen gesichert':''));
}

function stNewKat(){
  document.getElementById('mc-edit-id').value='';
  document.getElementById('mc-ttl').textContent='Neue Kategorie';
  document.getElementById('mc-save-btn').textContent='Erstellen';
  document.getElementById('mc-name').value='';
  document.getElementById('mc-grp').value='freizeit';
  var tgl=document.getElementById('mc-show-input');
  if(tgl) tgl.classList.add('on');
  var par=document.getElementById('mc-par');
  if(par){
    par.innerHTML='<option value="">— Hauptkategorie —</option>'+
      FP.Store.Categories.getMain().map(function(c){
        return '<option value="'+c.id+'">'+c.name+'</option>';
      }).join('');
  }
  document.getElementById('mc-par-group').style.display='';
  openM('m-cat');
  setTimeout(function(){document.getElementById('mc-name').focus();},150);
}

function stEditCat(id){
  var cat=FP.Store.Categories.getAll().find(function(c){return c.id===id;});
  if(!cat)return;
  document.getElementById('mc-edit-id').value=id;
  document.getElementById('mc-ttl').textContent='Kategorie bearbeiten';
  document.getElementById('mc-save-btn').textContent='Speichern';
  document.getElementById('mc-name').value=cat.name;
  document.getElementById('mc-grp').value=cat.group;
  var tgl=document.getElementById('mc-show-input');
  if(tgl){ if(cat.showInInput===false) tgl.classList.remove('on'); else tgl.classList.add('on'); }
  var hasSubs=FP.Store.Categories.getAll().some(function(c){return c.parentId===id;});
  var parGroup=document.getElementById('mc-par-group');
  if(hasSubs){
    // Kategorie hat Unterkategorien → kann nicht selbst Unterkategorie werden
    parGroup.style.display='none';
  } else {
    var par=document.getElementById('mc-par');
    par.innerHTML='<option value="">— Keine (Hauptkategorie) —</option>'+
      FP.Store.Categories.getAll().filter(function(c){return !c.parentId&&c.id!==id;}).map(function(c){
        return '<option value="'+c.id+'"'+(cat.parentId===c.id?' selected':'')+'>'+c.name+'</option>';
      }).join('');
    parGroup.style.display='';
  }
  openM('m-cat');
  setTimeout(function(){document.getElementById('mc-name').focus();},150);
}

function stRenderTrash(){
  var el=document.getElementById('st-trash');
  if(!el)return;
  var items=FP.Trash.getAll();
  if(!items.length){
    el.innerHTML='<div style="padding:14px 0;color:var(--tx3);font-size:13px">Papierkorb ist leer.</div>';
    return;
  }
  var typeLabel={category:'Kategorie',object:'Objekt',recurring:'Fixkost'};
  var now=Date.now();
  el.innerHTML=items.map(function(e){
    var daysLeft=Math.max(0,30-Math.floor((now-new Date(e.deletedAt).getTime())/86400000));
    return '<div class="st-row">'+
      '<div class="st-row-info">'+
        '<div class="st-row-name" style="opacity:0.7">'+e.item.name+'</div>'+
        '<div class="st-row-sub">'+typeLabel[e.type]+' · noch '+daysLeft+' Tag'+(daysLeft===1?'':'e')+'</div>'+
      '</div>'+
      '<div class="st-row-actions">'+
        '<button class="st-btn" onclick="stTrashRestore(\''+e.id+'\')">Wiederherstellen</button>'+
        '<button class="st-btn danger" onclick="stTrashDelete(\''+e.id+'\')">Endgültig löschen</button>'+
      '</div>'+
    '</div>';
  }).join('');
}
function stTrashRestore(id){
  FP.Trash.restore(id);
  stRenderCats();
  stRenderObjs();
  stRenderTrash();
  buildCats();
  toast('Wiederhergestellt');
}
function stTrashDelete(id){
  if(!confirm('Endgültig löschen? Das kann nicht rückgängig gemacht werden.'))return;
  FP.Trash.permanentDelete(id);
  stRenderTrash();
  toast('Endgültig gelöscht');
}
function stTrashClear(){
  if(!FP.Trash.getAll().length)return;
  if(!confirm('Papierkorb leeren? Alle Einträge werden endgültig gelöscht.'))return;
  FP.Trash.clear();
  stRenderTrash();
  toast('Papierkorb geleert');
}

function stRenderObjs(){
  var el=document.getElementById('st-objs');
  if(!el)return;
  var objs=FP.Store.Objects.getAll();
  if(!objs.length){
    el.innerHTML='<div style="padding:14px 0;color:var(--tx3);font-size:13px">Noch keine Objekte vorhanden.</div>';
    return;
  }
  var typeLabel={fahrzeug:'Fahrzeug',reise:'Reise',projekt:'Projekt',person:'Person',geraet:'Gerät',sonstiges:'Sonstiges'};
  el.innerHTML=objs.map(function(o){
    var arch=o.status==='archiviert';
    return '<div class="st-row">'+
      '<div class="st-row-info">'+
        '<div class="st-row-name" style="opacity:'+(arch?0.4:1)+'">'+(OBJ_ICONS[o.type]||o.icon||'')+'<span>'+o.name+'</span></div>'+
        '<div class="st-row-sub">'+(typeLabel[o.type]||o.type)+(o.description?' · '+o.description:'')+(arch?' · archiviert':'')+'</div>'+
      '</div>'+
      '<div class="st-row-actions">'+
        '<button class="st-btn" onclick="stEditObj(\''+o.id+'\')" style="margin-right:6px">Bearbeiten</button>'+
        (arch?
          '<button class="st-btn" onclick="stRestoreObj(\''+o.id+'\')">Wiederherstellen</button>':
          '<button class="st-btn danger" onclick="stArchiveObj(\''+o.id+'\')">Archivieren</button>')+
        '<button class="st-btn danger" onclick="stDeleteObj(\''+o.id+'\')" style="margin-left:6px">Löschen</button>'+
      '</div>'+
      '</div>';
  }).join('');
}

function stArchiveObj(id){
  var obj=FP.Store.Objects.getById(id);
  FP.Store.Objects.archive(id);
  stRenderObjs();
  appLog('OBJEKT', 'Archiviert: '+(obj?obj.name:id));
  toast('Archiviert');
}
function stRestoreObj(id){
  var obj=FP.Store.Objects.getById(id);
  FP.Store.Objects.update(id,{status:'aktiv',endDate:null});
  stRenderObjs();
  appLog('OBJEKT', 'Wiederhergestellt: '+(obj?obj.name:id));
  toast('Wiederhergestellt');
}
function stDeleteObj(id){
  var obj=FP.Store.Objects.getById(id);
  var name=obj?obj.name:'dieses Objekt';
  confirmDialog('„'+name+'" wirklich löschen? Alle zugehörigen Buchungen verlieren die Objekt-Zuweisung.',
    'Endgültig löschen',function(){
      FP.Store.Objects.delete(id);
      stRenderObjs();
      appLog('OBJEKT', 'Gelöscht: '+name);
      toast('Objekt gelöscht');
  });
}

var _stEditObjId = null;

function stNewObj(){
  _stEditObjId = null;
  document.getElementById('mo-name').value='';
  document.getElementById('mo-type').value='fahrzeug';
  document.getElementById('mo-desc').value='';
  document.getElementById('mo-ttl').textContent='Neues Objekt';
  document.getElementById('mo-save-btn').textContent='Erstellen';
  openM('m-obj');
  setTimeout(function(){document.getElementById('mo-name').focus();},150);
}

function stEditObj(id){
  var obj=FP.Store.Objects.getById(id);
  if(!obj)return;
  _stEditObjId = id;
  document.getElementById('mo-name').value=obj.name||'';
  document.getElementById('mo-type').value=obj.type||'fahrzeug';
  document.getElementById('mo-desc').value=obj.description||'';
  document.getElementById('mo-ttl').textContent='Objekt bearbeiten';
  document.getElementById('mo-save-btn').textContent='Speichern';
  openM('m-obj');
  setTimeout(function(){document.getElementById('mo-name').focus();},150);
}

function stSaveObj(){
  var name=document.getElementById('mo-name').value.trim();
  if(!name){toast('Name eingeben');return;}
  var type=document.getElementById('mo-type').value;
  var desc=document.getElementById('mo-desc').value.trim();
  if(_stEditObjId){
    FP.Store.Objects.update(_stEditObjId,{name:name,type:type,description:desc});
    closeM('m-obj');
    stRenderObjs();
    obRenderGrid();
    appLog('OBJEKT', 'Bearbeitet: '+name+' ('+type+')');
    toast('Objekt gespeichert');
  } else {
    FP.Store.Objects.add({name:name,type:type,description:desc,color:'var(--cat-slate)'});
    closeM('m-obj');
    stRenderObjs();
    obRenderGrid();
    appLog('OBJEKT', 'Neu: '+name+' ('+type+')');
    toast('Objekt erstellt');
  }
}

/* ── Währungen (Settings) ── */
function stRenderCurrencies(){
  var el=document.getElementById('st-currencies');
  if(!el)return;
  var all=FP.Store.Currencies.getAll();
  if(!all.length){
    el.innerHTML='<div style="padding:14px 0;color:var(--tx3);font-size:13px">Keine Währungen vorhanden.</div>';
    return;
  }
  el.innerHTML=all.map(function(c){
    var isEUR=c.code==='EUR';
    var active=c.active!==false;
    return '<div class="st-row">'+
      '<div class="st-row-info">'+
        '<div class="st-row-name" style="opacity:'+(active?1:0.4)+'">'+
          '<span style="font-weight:600;min-width:36px;display:inline-block">'+c.code+'</span> '+
          '<span style="color:var(--tx2)">'+c.symbol+'</span> '+
          '<span style="font-size:12px;color:var(--tx3)"> '+c.name+'</span>'+
        '</div>'+
        (isEUR?'<div class="st-row-sub">Basiswährung</div>':
          '<div class="st-row-sub">1 EUR = '+(c.rate||'—')+' '+c.code+'</div>')+
      '</div>'+
      '<div class="st-row-actions">'+
        (isEUR?'':
          '<button class="st-btn" onclick="stOpenRate(\''+c.code+'\')">Kurs</button>'+
          '<button class="st-btn" onclick="stToggleCurrency(\''+c.code+'\')">'+(active?'Ausblenden':'Einblenden')+'</button>'+
          '<button class="st-btn danger" onclick="stRemoveCurrency(\''+c.code+'\')">Entfernen</button>')+
      '</div>'+
    '</div>';
  }).join('');
}

function stToggleCurrency(code){
  FP.Store.Currencies.toggle(code);
  var cur=FP.Store.Currencies.getAll().find(function(c){return c.code===code;});
  appLog('WÄHRUNG', code+(cur&&cur.active===false?' ausgeblendet':' eingeblendet'));
  stRenderCurrencies();
  npRebuildPicker();
}

function stOpenRate(code){
  var cur=FP.Store.Currencies.getAll().find(function(c){return c.code===code;});
  if(!cur)return;
  document.getElementById('mrate-code').value=code;
  document.getElementById('mrate-lbl').textContent='1 EUR = ? '+code;
  document.getElementById('mrate-ttl').textContent=cur.name+' Kurs';
  document.getElementById('mrate-val').value=cur.rate||'';
  openM('m-rate');
  setTimeout(function(){document.getElementById('mrate-val').focus();},150);
}

function stSaveRate(){
  var code=document.getElementById('mrate-code').value;
  var val=parseFloat(document.getElementById('mrate-val').value);
  if(!code||!val||val<=0){toast('Ungültiger Wert');return;}
  FP.Store.Currencies.updateRate(code,val);
  closeM('m-rate');
  stRenderCurrencies();
  npUpdateConv();
  appLog('WÄHRUNG', code+' Kurs manuell: 1 EUR = '+val);
  toast('Kurs aktualisiert');
}

function stNewCurrency(){
  // Dropdown mit noch nicht vorhandenen Währungen befüllen
  var existing=FP.Store.Currencies.getAll().map(function(c){return c.code;});
  var pick=document.getElementById('mcur-pick');
  pick.innerHTML='<option value="">— Währung wählen —</option>';
  KNOWN_CURRENCIES.forEach(function(k){
    if(existing.indexOf(k.code)>=0) return; // bereits vorhanden
    var o=document.createElement('option');
    o.value=k.code;
    o.textContent=k.code+' – '+k.name+' ('+k.symbol+')';
    pick.appendChild(o);
  });
  document.getElementById('mcur-manual').style.display='none';
  document.getElementById('mcur-add-btn').disabled=true;
  document.getElementById('mcur-code').value='';
  document.getElementById('mcur-name').value='';
  document.getElementById('mcur-sym').value='';
  document.getElementById('mcur-rate').value='';
  openM('m-cur');
}

function mcurPickKnown(code){
  var manual=document.getElementById('mcur-manual');
  var btn=document.getElementById('mcur-add-btn');
  if(!code){ manual.style.display='none'; btn.disabled=true; return; }
  var k=KNOWN_CURRENCIES.find(function(c){return c.code===code;});
  if(!k){ manual.style.display='none'; btn.disabled=true; return; }
  document.getElementById('mcur-code').value=k.code;
  document.getElementById('mcur-name').value=k.name;
  document.getElementById('mcur-sym').value=k.symbol;
  document.getElementById('mcur-rate').value=''; // Kurs muss eingegeben oder per Update geladen werden
  manual.style.display='block';
  btn.disabled=false;
  setTimeout(function(){document.getElementById('mcur-rate').focus();},100);
}

function stSaveCurrency(){
  var code=(document.getElementById('mcur-code').value||'').toUpperCase().trim();
  var name=(document.getElementById('mcur-name').value||'').trim();
  var sym=(document.getElementById('mcur-sym').value||'').trim();
  var rateVal=document.getElementById('mcur-rate').value;
  var rate=rateVal?parseFloat(rateVal):null;
  if(!code||code.length<2){toast('Währung auswählen');return;}
  if(!name||!sym){toast('Ungültige Währungsdaten');return;}
  var exists=FP.Store.Currencies.getAll().some(function(c){return c.code===code;});
  if(exists){toast(code+' existiert bereits');return;}
  FP.Store.Currencies.add({code:code,name:name,symbol:sym,rate:rate||1,active:true});
  closeM('m-cur');
  stRenderCurrencies();
  npRebuildPicker();
  if(!rate){
    stUpdateRates(code);
    appLog('WÄHRUNG', code+' ('+name+') hinzugefügt – Kurs wird geladen');
    toast(code+' hinzugefügt – Kurs wird geladen …');
  } else {
    appLog('WÄHRUNG', code+' ('+name+') hinzugefügt, Kurs: 1 EUR = '+rate);
    toast(code+' hinzugefügt');
  }
}

// ── Kurs-Update: JSONP (iOS-kompatibel) + fetch als Fallback ──
//
// iOS Safari blockiert fetch() von file://-Seiten zu externen URLs.
// Script-Tag-Injection (JSONP) umgeht diese Einschränkung, da <script src>
// nicht unter dieselbe Same-Origin-Policy fällt.

// JSONP-Helfer: lädt URL via <script>-Tag, API muss ?callback=NAME unterstützen
function _jsonpFetch(url, cbParam, timeoutMs){
  return new Promise(function(resolve, reject){
    var name='_fpCb'+Date.now();
    var el=document.createElement('script');
    var done=false;
    var timer=setTimeout(function(){
      if(done)return; done=true;
      _jsonpCleanup(el,name); reject(new Error('timeout'));
    }, timeoutMs||8000);
    window[name]=function(data){
      if(done)return; done=true;
      clearTimeout(timer); _jsonpCleanup(el,name); resolve(data);
    };
    el.onerror=function(){
      if(done)return; done=true;
      clearTimeout(timer); _jsonpCleanup(el,name); reject(new Error('load error'));
    };
    el.src=url+(url.indexOf('?')>=0?'&':'?')+cbParam+'='+name;
    document.head.appendChild(el);
  });
}
function _jsonpCleanup(el,name){
  try{ delete window[name]; }catch(e){}
  if(el&&el.parentNode) el.parentNode.removeChild(el);
}

// Alle APIs werden PARALLEL gestartet — schnellste Antwort gewinnt.
// JSONP via CORS-Proxy: umgeht iOS file://-Einschränkung (script-Tag statt fetch).
// fetch: Desktop-Fallback (antwortet sofort, JSONP läuft still im Hintergrund).
var _enc=encodeURIComponent;
var RATE_APIS=[
  // ── JSONP-Proxies (iOS file:// kompatibel) ──
  {
    method:'jsonp', cbParam:'callback',
    url:'https://api.allorigins.win/get?url='+_enc('https://api.frankfurter.app/latest?from=EUR'),
    getRates:function(w){ try{return JSON.parse(w.contents).rates||{};}catch(e){return {};} }
  },
  {
    method:'jsonp', cbParam:'callback',
    url:'https://www.whateverorigin.com/get?url='+_enc('https://api.frankfurter.app/latest?from=EUR'),
    getRates:function(w){ try{return JSON.parse(w.contents).rates||{};}catch(e){return {};} }
  },
  {
    method:'jsonp', cbParam:'callback',
    url:'https://api.allorigins.win/get?url='+_enc('https://open.er-api.com/v6/latest/EUR'),
    getRates:function(w){ try{return JSON.parse(w.contents).rates||{};}catch(e){return {};} }
  },
  // ── Direkter fetch (Desktop) ──
  {
    method:'fetch',
    url:'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.min.json',
    getRates:function(d){ return d.eur||{}; }
  },
  {
    method:'fetch',
    url:'https://api.frankfurter.app/latest?from=EUR',
    getRates:function(d){ return d.rates||{}; }
  },
  {
    method:'fetch',
    url:'https://open.er-api.com/v6/latest/EUR',
    getRates:function(d){ return d.rates||{}; }
  }
];

function stUpdateRates(onlyCode){
  var btn=document.getElementById('st-rates-btn');
  if(btn){btn.disabled=true;btn.textContent='Lädt …';}

  // iOS erkennen (iPhone, iPad, auch iPad Pro das sich als Mac ausgibt)
  var isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent)||
            (navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);

  if(isIOS){
    if(btn){btn.disabled=false;btn.textContent='Kurse aktualisieren';}
    _showIosRatesHint();
    return;
  }

  var done=false;
  var remaining=RATE_APIS.length;

  function applyRates(rawRates){
    if(done)return;
    if(!rawRates||Object.keys(rawRates).length<5)return;
    done=true;
    var rates={};
    Object.keys(rawRates).forEach(function(k){ rates[k.toUpperCase()]=rawRates[k]; });
    var all=FP.Store.Currencies.getAll();
    var updated=0;
    all.forEach(function(c){
      if(c.code==='EUR')return;
      if(onlyCode&&c.code!==onlyCode)return;
      if(rates[c.code]&&rates[c.code]>0){ FP.Store.Currencies.updateRate(c.code,rates[c.code]); updated++; }
    });
    stRenderCurrencies();
    npUpdateConv();
    if(btn){btn.disabled=false;btn.textContent='Kurse aktualisieren';}
    var msg=onlyCode
      ?(rates[onlyCode]?'Kurs geladen: 1 EUR = '+rates[onlyCode]+' '+onlyCode:'Kein Kurs für '+onlyCode+' verfügbar')
      :(updated+' Kurs'+(updated!==1?'e':'')+' aktualisiert');
    appLog('WÄHRUNG', msg);
    toast(msg);
  }

  function onFail(){
    remaining--;
    if(remaining===0&&!done){
      done=true;
      if(btn){btn.disabled=false;btn.textContent='Kurse aktualisieren';}
      toast('Nicht erreichbar – Kurs bitte manuell eingeben.');
    }
  }

  RATE_APIS.forEach(function(api){
    var p=api.method==='jsonp'
      ? _jsonpFetch(api.url,api.cbParam,9000)
      : fetch(api.url).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json();});
    p.then(function(data){ applyRates(api.getRates(data)); })
     .catch(onFail);
  });
}

function _showIosRatesHint(){
  var extra=document.getElementById('mconf-extra');
  extra.style.display='block';
  extra.innerHTML=
    '<div style="background:var(--bg);border-radius:8px;padding:12px 14px;font-size:13px;line-height:1.6">'+
    '<b>Option 1 – In Safari öffnen:</b><br>'+
    'Files-App → Datei gedrückt halten → Teilen → <i>In Safari öffnen</i><br><br>'+
    '<b>Option 2 – Am PC aktualisieren:</b><br>'+
    'Kurse auf dem PC aktualisieren, Backup exportieren und auf iOS importieren.<br><br>'+
    '<b>Option 3 – Manuell eingeben:</b><br>'+
    'Kurs unter dem jeweiligen Eintrag über „Kurs" anpassen.'+
    '</div>';
  document.getElementById('mconf-ttl').textContent='Automatisches Update nicht möglich';
  document.getElementById('mconf-msg').textContent=
    'Lokale HTML-Dateien dürfen auf iOS keine Internetverbindung aufbauen. Das ist eine iOS-Sicherheitseinschränkung.';
  var okBtn=document.getElementById('mconf-ok');
  okBtn.textContent='Verstanden';
  okBtn.style.background='var(--blue)';
  okBtn.style.borderColor='var(--blue)';
  okBtn.onclick=function(){ closeM('m-confirm'); };
  document.getElementById('mconf-cancel').style.display='none';
  openM('m-confirm');
}

function stRemoveCurrency(code){
  confirmDialog(code+' wirklich aus der Liste entfernen?','Entfernen',function(){
    FP.Store.Currencies.remove(code);
    stRenderCurrencies();
    if(npCur===code) npCurrencySelect('EUR');
    npRebuildPicker();
    appLog('WÄHRUNG', code+' entfernt');
    toast(code+' entfernt');
  });
}

function npRebuildPicker(){
  // Picker wird bei jedem Öffnen neu gebaut (npCurrencyToggle) — nur schließen
  var picker=document.getElementById('np-curr-picker');
  if(picker) picker.classList.remove('open');
}

function stDownload(){
  FP.BackupManager.download('Manuell');
  appLog('BACKUP', 'Export heruntergeladen');
  toast('Backup heruntergeladen');
}

function stExportExcel(btn) {
  if (typeof XLSX === 'undefined') {
    if (btn) { btn.disabled = true; btn.textContent = 'Lädt…'; }
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    s.onload  = function() { if (btn) { btn.disabled = false; btn.textContent = '📊 Excel'; } stExportExcel(btn); };
    s.onerror = function() { if (btn) { btn.disabled = false; btn.textContent = '📊 Excel'; } toast('Fehler: Internetverbindung für Excel-Export benötigt'); };
    document.head.appendChild(s);
    return;
  }

  var store   = FP.Store.get();
  var cats    = {};  store.categories.forEach(function(c){ cats[c.id] = c; });
  var objs    = {};  store.objects.forEach(function(o){ objs[o.id] = o; });
  var persons = {};  store.persons.forEach(function(p){ persons[p.id] = p; });
  var ownerLbl = function(id){ return (persons[id] && persons[id].name) || (id === 'joint' ? 'Gemeinsam' : id); };
  var wb = XLSX.utils.book_new();

  // ── Sheet 1: Transaktionen ──
  var txRows = [['Datum','Betrag (€)','Kategorie','Gruppe','Objekt','Person','Notiz']];
  var txSorted = store.transactions.slice().sort(function(a,b){
    var pa=a.date.split('.'),pb=b.date.split('.');
    return (pa[1]-pb[1])||((pa[0]||0)-(pb[0]||0));
  });
  txSorted.forEach(function(tx){
    var cat = cats[tx.categoryId];
    var obj = tx.objectId ? objs[tx.objectId] : null;
    txRows.push([
      tx.date,
      tx.amount,
      cat ? cat.name : '',
      cat ? (cat.group==='fixkosten' ? 'Fixkosten' : 'Freizeit') : '',
      obj ? obj.name : '',
      ownerLbl(tx.personId || 'person_1'),
      tx.note || ''
    ]);
  });
  var wsTx = XLSX.utils.aoa_to_sheet(txRows);
  wsTx['!cols'] = [{wch:10},{wch:12},{wch:22},{wch:12},{wch:20},{wch:14},{wch:30}];
  XLSX.utils.book_append_sheet(wb, wsTx, 'Transaktionen');

  // ── Sheet 2: Vorlagen (Fixkosten/Wiederkehrend) ──
  var TYPE_LBL = {fixed:'Fix', variable:'Variabel', savings:'Rücklage'};
  var fkRows = [['Name','Betrag (€/Mo)','Typ','Kategorie','Gültig ab','Gültig bis']];
  (store.recurring || []).forEach(function(r){
    var cat = cats[r.categoryId];
    fkRows.push([r.name, r.amount, TYPE_LBL[r.type]||r.type, cat?cat.name:'', r.validFrom||'', r.validUntil||'']);
  });
  var wsFk = XLSX.utils.aoa_to_sheet(fkRows);
  wsFk['!cols'] = [{wch:32},{wch:14},{wch:12},{wch:22},{wch:12},{wch:12}];
  XLSX.utils.book_append_sheet(wb, wsFk, 'Vorlagen');

  // ── Sheet 3: Vermögen / Assets ──
  var asRows = [['Name','Typ','Eigentümer','Letzter Wert (€)','Stand','ISIN','WKN']];
  (store.assets || []).filter(function(a){ return a.status==='aktiv'; }).forEach(function(a){
    var snap = a.snapshots && a.snapshots.length ? a.snapshots[a.snapshots.length-1] : null;
    asRows.push([a.name, VM_TYPE_LABEL[a.type]||a.type, ownerLbl(a.ownerId), snap?snap.value:'', snap?snap.date:'', a.isin||'', a.wkn||'']);
  });
  var wsAs = XLSX.utils.aoa_to_sheet(asRows);
  wsAs['!cols'] = [{wch:30},{wch:14},{wch:14},{wch:16},{wch:12},{wch:18},{wch:10}];
  XLSX.utils.book_append_sheet(wb, wsAs, 'Vermögen');

  // ── Sheet 4: Sparpläne ──
  var spRows = [['Name','Betrag (€/Mo)','Gültig bis']];
  (store.savingsPlans || []).forEach(function(sp){
    spRows.push([sp.name||'Sparplan', sp.monthlyAmount, sp.validUntil||'']);
  });
  var wsSp = XLSX.utils.aoa_to_sheet(spRows);
  wsSp['!cols'] = [{wch:28},{wch:14},{wch:12}];
  XLSX.utils.book_append_sheet(wb, wsSp, 'Sparpläne');

  var date = new Date().toLocaleDateString('de-DE').replace(/\./g,'-');
  XLSX.writeFile(wb, 'Finanzplaner_Export_' + date + '.xlsx');
  appLog('BACKUP', 'Excel-Export heruntergeladen');
  toast('Excel-Export heruntergeladen');
}

function stImport(input){
  var file=input.files[0];
  if(!file)return;
  FP.BackupManager.import(file).then(function(res){
    input.value='';
    appLog('BACKUP', 'Import erfolgreich · '+res.transactions+' Transaktionen · Datei: '+file.name);
    toast('Import erfolgreich · '+res.transactions+' Transaktionen');
    setTimeout(function(){location.reload();},1200);
  }).catch(function(err){
    input.value='';
    appLog('ERROR', 'Import fehlgeschlagen: '+err.message);
    toast('Fehler: '+err.message);
  });
}

/* ── Ausgaben-Import aus ausgaben_flat_v2.xlsx ── */
var _XLSX_CAT_MAP = {
  'Lebensmittel':'cat_lebensmittel','Ausgehen':'cat_restaurant','Kaffee':'cat_kaffee',
  'Tanken':'cat_tanken','Autowäsche':'cat_autowaesche','Auto-Teile':'cat_autoteile',
  'Parken':'cat_parken','Reinigung':'cat_reinigung','Wohnung':'cat_wohnung',
  'Steuer':'cat_steuer','Kleidung':'cat_kleidung','Urlaub':'cat_urlaub',
  'Gesundheit':'cat_gesundheit','Geschenke':'cat_geschenke','Friseur':'cat_friseur',
  'Weiterbildung':'cat_weiterbildung','Lotto':'cat_lotto','Amazon Prime':'cat_amazon',
  'Netflix':'cat_netflix','YouTube Premium':'cat_youtube','Apple TV':'cat_appletv',
  'iCloud':'cat_icloud','Sonstiges':'cat_sonstiges','SIM GPS Kind 1':'cat_sim_gps',
};

function _xlsxParseAmount(v){
  if(v==null||v==='') return 0;
  if(typeof v==='number') return Math.abs(v);
  var s=String(v).replace(/[€\s]/g,'').replace(/\./g,'').replace(',','.');
  return Math.abs(parseFloat(s)||0);
}

function _xlsxGetOrCreateObject(name){
  if(!name||!name.trim()) return null;
  var found=(FP.Store.Objects.getAll()||[]).find(function(o){return o.name===name;});
  if(found) return found.id;
  return FP.Store.Objects.add({name:name,type:'sonstiges',description:'',icon:'📦',color:'var(--cat-slate)'}).id;
}

function stImportAusgaben(input){
  var file=input.files[0];
  if(!file){ input.value=''; return; }

  var txCount=(FP.Store.Transactions.getAll()||[]).length;
  confirmDialog(
    'Beim Import werden alle bestehenden '+txCount+' Transaktionen gelöscht und durch die Excel-Daten ersetzt. Ein Backup wird automatisch gespeichert.',
    'Importieren & ersetzen',
    function(){
      var lbl=document.getElementById('st-import-xlsx-lbl');
      if(lbl){lbl.style.opacity='0.6';lbl.textContent='Lädt…';}

      function doImport(XLSX){
        var reader=new FileReader();
        reader.onload=function(e){
          try{
            var wb=XLSX.read(e.target.result,{type:'array',cellDates:false});
            var ws=wb.Sheets['Ausgaben_Flat'];
            if(!ws){toast('Sheet "Ausgaben_Flat" nicht gefunden');return;}

            var rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:null,raw:true});
            if(rows.length<2){toast('Keine Daten gefunden');return;}

            // Header-Zeile analysieren: Spalten I (idx 8) und J (idx 9) optional
            var hasColI=rows[0][8]!=null;
            var hasColJ=rows[0][9]!=null;

            // Backup erstellen bevor Transaktionen unwiderruflich gelöscht werden
            FP.BackupManager._saveAutoBackup(FP.BackupManager.create('Vor Excel-Import'));

            // Bestehende Transaktionen löschen
            var store=FP.Store.get();
            store.transactions=[];
            FP.Store.save();

        var imported=0,skipped=0,nocat=0,flaggedSkip=0,badData=0;
        var nocatNames={};  // {katName: count} für WARN-Log
        // Gültige Kategorie-IDs aus Store für Spalte-I-Validierung
        var validCatIds={};
        (store.categories||[]).forEach(function(c){ validCatIds[c.id]=true; });

        rows.slice(1).forEach(function(row,rowIdx){
          if(!row||row.every(function(c){return c==null||c===''})) return;

          // Spalte J: Import?
          if(hasColJ){
            var flag=String(row[9]||'').trim().toUpperCase();
            if(flag==='NEIN'||flag==='NO'){skipped++;flaggedSkip++;return;}
          }

          var jahr  =parseInt(row[0])||0;
          var monat =parseInt(row[2])||0;
          var roh   =String(row[3]||'').trim();
          var katRaw=String(row[4]||'').trim();
          var objRaw=String(row[6]||'').trim();
          var betrag=_xlsxParseAmount(row[7]);

          if(!jahr||!monat||!betrag){badData++;skipped++;return;}

          var date=String(monat).padStart(2,'0')+'.'+jahr;

          // categoryId: Spalte I bevorzugt, sonst Mapping-Tabelle
          var catId=null;
          if(hasColI&&row[8]&&String(row[8]).trim()&&!String(row[8]).startsWith('FEHLT_')){
            var colI=String(row[8]).trim();
            if(validCatIds[colI]){
              catId=colI;
            } else {
              // Spalte I gesetzt, aber ID existiert nicht im Store
              nocat++;skipped++;
              nocatNames['[Spalte I] '+colI]=(nocatNames['[Spalte I] '+colI]||0)+1;
              return;
            }
          } else {
            catId=_XLSX_CAT_MAP[katRaw]||null;
          }

          if(!catId){
            nocat++;skipped++;
            if(katRaw) nocatNames[katRaw]=(nocatNames[katRaw]||0)+1;
            return;
          }

          // Objekt
          var objId=_xlsxGetOrCreateObject(objRaw||null);

          FP.Store.Transactions.add({
            date:      date,
            categoryId:catId,
            rawName:   roh,
            amount:    betrag,
            objectId:  objId,
            source:    'import',
            sourceRef: 'xlsx_'+file.name,
          });
          imported++;
        });

        FP.Store.save();

        // ── Import-Log: Zusammenfassung ──
        var parts=['✓ '+imported+' importiert'];
        if(flaggedSkip) parts.push(flaggedSkip+' via Spalte-J übersprungen');
        if(badData)     parts.push(badData+' ohne Datum/Betrag');
        if(nocat)       parts.push(nocat+' ohne Kategorie-Mapping');
        appLog('INFO','Excel-Import abgeschlossen · '+parts.join(' · '));

        // Je unbekanntem Kategorie-Name eine WARN-Zeile
        Object.keys(nocatNames).sort().forEach(function(name){
          appLog('WARN','Import übersprungen: Kategorie "'+name+'" ('+nocatNames[name]+'x) — kein Mapping vorhanden');
        });
        if(badData){
          appLog('WARN','Import: '+badData+' Zeile(n) mit fehlendem Datum oder Betrag übersprungen');
        }

        // UI aktualisieren
        if(typeof auInit==='function') auInit();
        if(typeof npRebuildPicker==='function') npRebuildPicker();

        if(lbl){lbl.style.opacity='';lbl.innerHTML='📥 Importieren<input type="file" accept=".xlsx" style="display:none" onchange="stImportAusgaben(this)">';}
        toast('✓ '+imported+' Transaktionen importiert'+(skipped?' · '+skipped+' übersprungen':''));
      } catch(err){
        appLog('ERROR','Excel-Import Fehler: '+err.message);
        toast('Import fehlgeschlagen: '+err.message);
        if(lbl){lbl.style.opacity='';lbl.innerHTML='📥 Importieren<input type="file" accept=".xlsx" style="display:none" onchange="stImportAusgaben(this)">';}
      }
    };
    reader.readAsArrayBuffer(file);
  }

      if(typeof XLSX==='undefined'){
        var s=document.createElement('script');
        s.src='https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
        s.onload=function(){doImport(XLSX);};
        s.onerror=function(){toast('Fehler: SheetJS konnte nicht geladen werden');if(lbl){lbl.style.opacity='';lbl.textContent='📥 Importieren';}};
        document.head.appendChild(s);
      } else {
        doImport(XLSX);
      }
    }
  );
  input.value='';
}

function stReset(){
  confirmDialog('Wirklich alle Daten löschen? Ein Backup wird vorher automatisch erstellt.','Alles löschen',function(){
    appLog('RESET', 'Alle Daten gelöscht — Backup wurde erstellt');
    FP.BackupManager.download('Vor Reset');
    setTimeout(function(){
      localStorage.removeItem('finanzplaner_v3');
      location.reload();
    },800);
  });
}

/* ════════════════════════════════════════
   ESPP
════════════════════════════════════════ */

function esppEnsure(){
  var store=FP.Store.get();
  if(!store.espp){store.espp={settings:{ticker:'',rabatt:15,eurUsdKurs:1.10,aktuellerKursUsd:null,grenzsteuersatz:42,rabattFreibetrag:2000},zyklen:[]};FP.Store.save();}
  return store;
}

function esppCycleMonths(hj,jahr){
  if(hj==='H1') return ['11.'+(jahr-1),'12.'+(jahr-1),'01.'+jahr,'02.'+jahr,'03.'+jahr,'04.'+jahr];
  return ['05.'+jahr,'06.'+jahr,'07.'+jahr,'08.'+jahr,'09.'+jahr,'10.'+jahr];
}

function esppPurchaseDateIso(hj,jahr){
  return hj==='H1'?(jahr+'-05-14'):(jahr+'-11-14');
}

function esppGetEinzahlung(hj,jahr,pct){
  var store=FP.Store.get();
  var sal=(store.salary&&store.salary.person_1)||{};
  var months=esppCycleMonths(hj,jahr);
  var avail=months.filter(function(m){return sal[m]&&sal[m].grossSalary>0;});
  if(!avail.length) return null;
  var avg=avail.reduce(function(s,m){return s+sal[m].grossSalary;},0)/avail.length;
  return Math.round(avg*6*pct/100*100)/100;
}

function esppCalc(z,s){
  var res={};
  if(!z.kaufkursUsd) return res;
  var kpUsd=z.kaufkursUsd*(1-s.rabatt/100);
  res.kaufpreisUsd=Math.round(kpUsd*100)/100;
  res.anzahlAktien=z.anzahlAktienOverride||null;
  if(!res.anzahlAktien) return res;
  res.gwvEur=Math.round(res.anzahlAktien*z.kaufkursUsd*(s.rabatt/100)/s.eurUsdKurs*100)/100;
  // Freibetrag anteilig nach tatsächlicher Anzahl Zyklen im selben Jahr (§8 Abs. 3 EStG: 2000€/Jahr)
  var fb=s._fbProZyklus!=null?s._fbProZyklus:s.rabattFreibetrag/2;
  res.steuerEur=Math.round(Math.max(0,res.gwvEur-fb)*s.grenzsteuersatz/100*100)/100;
  res.nettoGwvEur=Math.round((res.gwvEur-res.steuerEur)*100)/100;
  var bewertungsKurs=s.aktuellerKursUsd||z.kaufkursUsd;
  res.depotWertEur=Math.round(res.anzahlAktien*bewertungsKurs/s.eurUsdKurs*100)/100;
  if(z.verkaufskursUsd&&z.verkaufskursUsd>0){
    res.verkaufserloesEur=Math.round(res.anzahlAktien*z.verkaufskursUsd/s.eurUsdKurs*100)/100;
    res.kursgewinnEur=Math.round((res.verkaufserloesEur-res.depotWertEur)*100)/100;
  }
  return res;
}

function esppRender(){
  var el=document.getElementById('vm-espp');
  if(!el) return;
  var store=esppEnsure();
  var s=store.espp.settings;
  // Auto-sync EUR/USD aus Währungen-Einstellungen
  var usdCur=(store.currencies||[]).find(function(c){return c.code==='USD';});
  if(usdCur&&usdCur.rate){s.eurUsdKurs=usdCur.rate;FP.Store.save();}
  var zyklen=(store.espp.zyklen||[]).slice().sort(function(a,b){
    if(a.jahr!==b.jahr) return b.jahr-a.jahr;
    return a.halbjahr==='H2'?-1:1;
  });

  var apiKey=FP.Store.Settings.getApiKey('alphavantage');
  var settHtml='<div class="vm-espp-settings">'+
    '<div class="vm-espp-sf"><span class="vm-espp-slbl">Ticker</span>'+
    '<input class="vm-espp-sinp wide" id="espp-ticker" type="text" value="'+(s.ticker||'')+'" placeholder="z.B. ULS" oninput="this.value=this.value.toUpperCase();esppSaveSettings()" style="text-transform:uppercase"></div>'+
    '<div class="vm-espp-sf"><span class="vm-espp-slbl">Aktueller Kurs USD</span>'+
    '<div style="display:flex;gap:6px;align-items:center">'+
    '<input class="vm-espp-sinp" id="espp-aktkurs" type="number" step="0.01" value="'+(s.aktuellerKursUsd||'')+'" placeholder="manuell" onchange="esppSaveSettings()">'+
    (apiKey?'<button onclick="esppFetchAktKurs()" style="background:var(--blue);border:none;border-radius:6px;padding:4px 8px;font-size:11px;font-weight:600;color:var(--on-accent);cursor:pointer;white-space:nowrap" id="espp-aktkurs-btn">↻</button>':'<span style="font-size:10px;color:var(--tx3)">kein API-Key</span>')+
    '</div></div>'+
    '<div class="vm-espp-sf"><span class="vm-espp-slbl">EUR/USD</span>'+
    '<span style="font-size:13px;font-family:var(--mono);color:var(--tx2);padding:4px 8px;background:var(--surf2);border:1px solid var(--brd);border-radius:6px;white-space:nowrap">'+s.eurUsdKurs.toFixed(4)+' <span style="font-size:10px;color:var(--tx3);font-family:inherit">aus Währungen</span></span></div>'+
    '<div class="vm-espp-sf"><span class="vm-espp-slbl">Rabatt %</span>'+
    '<input class="vm-espp-sinp" id="espp-rabatt" type="number" step="1" value="'+s.rabatt+'" onchange="esppSaveSettings()"></div>'+
    '<div class="vm-espp-sf"><span class="vm-espp-slbl">Grenzsteuer %</span>'+
    '<input class="vm-espp-sinp" id="espp-gst" type="number" step="1" value="'+s.grenzsteuersatz+'" onchange="esppSaveSettings()"></div>'+
    '<div class="vm-espp-sf"><span class="vm-espp-slbl">Freibetrag §8 €/J</span>'+
    '<input class="vm-espp-sinp" id="espp-fb" type="number" step="100" value="'+s.rabattFreibetrag+'" onchange="esppSaveSettings()"></div>'+
    '</div>';

  var tblHtml;
  if(!zyklen.length){
    tblHtml='<div style="padding:20px;text-align:center;color:var(--tx3);font-size:13px">Noch keine Zyklen erfasst.</div>';
  } else {
    // Zyklen pro Jahr zählen → Freibetrag korrekt anteilig aufteilen
    var zyklenPerJahr={};
    zyklen.forEach(function(z){ zyklenPerJahr[z.jahr]=(zyklenPerJahr[z.jahr]||0)+1; });
    var rows=zyklen.map(function(z){
      var sZ=Object.assign({},s,{_fbProZyklus:s.rabattFreibetrag/(zyklenPerJahr[z.jahr]||1)});
      var c=esppCalc(z,sZ);
      var status=!z.kaufkursUsd?'laufend':(!z.verkaufskursUsd?'gekauft':'verkauft');
      var statusLbl={laufend:'Laufend',gekauft:'Gehalten',verkauft:'Verkauft'}[status];
      var kursStr=z.kaufkursUsd?'$'+z.kaufkursUsd.toFixed(2):'<span style="color:var(--tx3)">–</span>';
      var aktStr=c.anzahlAktien!=null?c.anzahlAktien:'–';
      var gwvStr=c.gwvEur!=null?eur(c.gwvEur):'–';
      var stStr=c.steuerEur!=null?(c.steuerEur===0?'<span style="color:var(--green);font-family:var(--mono)">0 €</span>':eur(c.steuerEur)):'–';
      return '<tr>'+
        '<td>'+z.halbjahr+' '+z.jahr+'</td>'+
        '<td>'+kursStr+'</td>'+
        '<td>'+aktStr+'</td>'+
        '<td>'+gwvStr+'</td>'+
        '<td>'+stStr+'</td>'+
        '<td><span class="vm-espp-badge '+status+'">'+statusLbl+'</span></td>'+
        '<td style="white-space:nowrap">'+
          '<button onclick="esppEditZyklus(\''+z.id+'\')" style="background:none;border:1px solid var(--brd);border-radius:6px;padding:2px 7px;font-size:11px;color:var(--tx3);cursor:pointer;margin-right:2px">✎</button>'+
          '<button onclick="esppDelZyklus(\''+z.id+'\')" style="background:none;border:none;padding:2px 4px;font-size:13px;color:var(--tx3);cursor:pointer">✕</button>'+
        '</td>'+
      '</tr>';
    }).join('');
    tblHtml='<div style="overflow-x:auto"><table class="vm-espp-tbl">'+
      '<thead><tr><th>Zyklus</th><th>Kaufkurs</th><th>Aktien</th><th>GWV</th><th>Steuer</th><th>Status</th><th></th></tr></thead>'+
      '<tbody>'+rows+'</tbody></table></div>';
  }

  el.innerHTML=
    '<div class="vm-espp-hdr">'+
    '<span class="vm-espp-title">📊 ESPP — Employee Stock Purchase Plan (Fidelity)</span>'+
    '<button class="av-heute" onclick="esppOpenNew()" style="font-size:12px;padding:5px 10px">+ Zyklus</button>'+
    '</div>'+
    settHtml+tblHtml+
    '<div class="vm-espp-hint">GWV = Geldwerter Vorteil (Rabattgewinn bei Kauf, §8 Abs.3 EStG). Freibetrag 2.000 €/Jahr wird je zur Hälfte pro Zyklus angesetzt. Steuerangaben sind Schätzungen — Steuerberater konsultieren.</div>';
}

function esppSaveSettings(){
  var store=esppEnsure();
  var t=document.getElementById('espp-ticker');
  if(t) store.espp.settings.ticker=t.value.toUpperCase().trim();
  var ak=document.getElementById('espp-aktkurs');
  if(ak) store.espp.settings.aktuellerKursUsd=parseFloat(ak.value)||null;
  store.espp.settings.rabatt          =parseFloat(document.getElementById('espp-rabatt').value)||15;
  store.espp.settings.grenzsteuersatz =parseFloat(document.getElementById('espp-gst').value)||42;
  store.espp.settings.rabattFreibetrag=parseFloat(document.getElementById('espp-fb').value)||2000;
  FP.Store.save();
}

function esppOpenNew(){
  document.getElementById('me-id').value='';
  document.getElementById('me-ttl').textContent='Zyklus hinzufügen';
  document.getElementById('me-hj').value='H1';
  document.getElementById('me-jahr').value=new Date().getFullYear();
  document.getElementById('me-kaufkurs').value='';
  document.getElementById('me-aktien').value='';
  document.getElementById('me-vkurs').value='';
  document.getElementById('me-vdatum').value='';
  openM('m-espp');
}

function esppEditZyklus(id){
  var store=esppEnsure();
  var z=(store.espp.zyklen||[]).find(function(x){return x.id===id;});
  if(!z) return;
  document.getElementById('me-id').value        =z.id;
  document.getElementById('me-ttl').textContent ='Zyklus bearbeiten';
  document.getElementById('me-hj').value        =z.halbjahr;
  document.getElementById('me-jahr').value      =z.jahr;
  document.getElementById('me-kaufkurs').value  =z.kaufkursUsd||'';
  document.getElementById('me-aktien').value    =z.anzahlAktienOverride||'';
  document.getElementById('me-vkurs').value     =z.verkaufskursUsd||'';
  document.getElementById('me-vdatum').value    =z.verkaufsDatum||'';
  openM('m-espp');
}

function esppSaveZyklus(){
  var id    =document.getElementById('me-id').value;
  var hj    =document.getElementById('me-hj').value;
  var jahr  =parseInt(document.getElementById('me-jahr').value)||0;
  var kurs  =parseFloat(document.getElementById('me-kaufkurs').value)||null;
  var aktien=parseInt(document.getElementById('me-aktien').value)||null;
  var vkurs =parseFloat(document.getElementById('me-vkurs').value)||null;
  var vdatum=document.getElementById('me-vdatum').value.trim();
  if(!jahr){toast('Jahr ist ein Pflichtfeld');return;}
  var store=esppEnsure();
  var data={halbjahr:hj,jahr:jahr,kaufkursUsd:kurs,anzahlAktienOverride:aktien,verkaufskursUsd:vkurs,verkaufsDatum:vdatum};
  if(id){
    var idx=store.espp.zyklen.findIndex(function(z){return z.id===id;});
    if(idx>=0) Object.assign(store.espp.zyklen[idx],data);
  } else {
    data.id='espp_'+hj.toLowerCase()+'_'+jahr+'_'+Date.now();
    store.espp.zyklen.push(data);
  }
  FP.Store.save();
  closeM('m-espp');
  vmRender();
  toast('Zyklus gespeichert');
}

function esppFetchAktKurs(onDone){
  var store=esppEnsure();
  var ticker=store.espp.settings.ticker;
  if(!ticker){toast('Ticker eintragen');if(onDone)onDone();return;}
  var apiKey=FP.Store.Settings.getApiKey('alphavantage');
  if(!apiKey){toast('Kein Alpha Vantage API-Key');if(onDone)onDone();return;}
  var btn=document.getElementById('espp-aktkurs-btn');
  if(btn){btn.disabled=true;btn.textContent='…';}
  var url='https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol='+
    encodeURIComponent(ticker)+'&apikey='+encodeURIComponent(apiKey);
  vmFetchWithTimeout(url,15000)
    .then(function(r){return r.json();})
    .then(function(d){
      if(d&&d.Information) throw new Error(d.Information);
      if(d&&d.Note) throw new Error(d.Note);
      var price=d&&d['Global Quote']&&parseFloat(d['Global Quote']['05. price']);
      if(!price) throw new Error('Kein Kurs für '+ticker+' — Ticker prüfen');
      store.espp.settings.aktuellerKursUsd=price;
      FP.Store.save();
      var inp=document.getElementById('espp-aktkurs');
      if(inp) inp.value=price.toFixed(2);
      if(!onDone){vmRender();toast('✓ '+ticker+': $'+price.toFixed(2));}
    })
    .catch(function(e){
      appLog('ERROR','ESPP Kursabruf ('+ticker+'): '+e.message);
      if(!onDone) toast('Fehler: '+e.message);
    })
    .then(function(){
      if(btn){btn.disabled=false;btn.textContent='↻';}
      if(onDone) onDone();
    });
}

function esppDelZyklus(id){
  confirmDialog('Zyklus wirklich löschen?','Löschen',function(){
    var store=esppEnsure();
    store.espp.zyklen=(store.espp.zyklen||[]).filter(function(z){return z.id!==id;});
    FP.Store.save();
    vmRender();
    toast('Zyklus gelöscht');
  });
}

/* ════════════════════════════════════════
   FIXKOSTEN TAB
════════════════════════════════════════ */
var FK_TYPE_LABEL={fixed:'Fix',variable:'Variabel',savings:'Rücklage'};
var FK_TYPE_COLOR={fixed:'var(--blue)',variable:'var(--amber)',savings:'var(--purple)'};

function fkInit(){ fkRender(); }

function fkRender(){
  fkRenderStats();
  fkRenderList();
}

function fkRenderStats(){
  var el=document.getElementById('fk-stats');
  if(!el)return;
  var items=FP.Store.Recurring.getActive();
  var totFix=0,totRue=0;
  items.forEach(function(fc){
    if(fc.type==='fixed'||fc.type==='variable')totFix+=fc.amount;
    else if(fc.type==='savings')totRue+=fc.amount;
  });
  var grand=FP.r2(totFix+totRue);
  var cards=[
    {lbl:'Gesamt/Monat',val:eur(grand),sub:items.length+' Posten',color:'var(--tx)'},
    {lbl:'Fixkosten',val:eur(FP.r2(totFix)),sub:'monatlich',color:'var(--blue)'},
    {lbl:'Rücklagen',val:eur(FP.r2(totRue)),sub:'monatlich zurücklegen',color:'var(--purple)'},
  ];
  el.innerHTML=cards.map(function(c){
    return '<div class="fk-stat">'+
      '<div class="fk-stat-lbl">'+c.lbl+'</div>'+
      '<div class="fk-stat-val" style="color:'+c.color+'">'+c.val+'</div>'+
      '<div class="fk-stat-sub">'+c.sub+'</div>'+
      '</div>';
  }).join('');
}

function fkRenderList(){
  var el=document.getElementById('fk-list');
  if(!el)return;
  var items=FP.Store.Recurring.getActive();
  var cats=FP.Store.Categories.getAll();
  var objs=FP.Store.Objects.getAll();
  var catMap={};cats.forEach(function(c){catMap[c.id]=c;});
  var objMap={};objs.forEach(function(o){objMap[o.id]=o;});

  if(!items.length){
    el.innerHTML='<div class="fk-group"><div style="padding:20px;text-align:center;color:var(--tx3);font-size:13px">Keine Fixkosten vorhanden. Tippe auf + Hinzufügen.</div></div>';
    return;
  }

  var groups={fixkosten:[],savings:[]};
  items.forEach(function(fc){
    if(fc.type==='fixed'||fc.type==='variable') groups.fixkosten.push(fc);
    else if(fc.type==='savings') groups.savings.push(fc);
  });
  var groupDef=[
    {key:'fixkosten',lbl:'Fixkosten',color:'var(--blue)'},
    {key:'savings',  lbl:'Rücklage', color:'var(--purple)'},
  ];

  el.innerHTML=groupDef.filter(function(g){return groups[g.key].length>0;}).map(function(g){
    var list=groups[g.key];
    var total=FP.r2(list.reduce(function(s,fc){return s+fc.amount;},0));
    var rows=list.map(function(fc){
      var cat=catMap[fc.categoryId];
      var obj=fc.objectId?objMap[fc.objectId]:null;
      var meta=(cat?cat.name:'')+(obj?' · '+obj.name:'')+(fc.validFrom?' · ab '+fc.validFrom:'');
      return '<div class="fk-row">'+
        '<div class="fk-row-info">'+
          '<div class="fk-row-name">'+fc.name+'</div>'+
          '<div class="fk-row-meta">'+meta+'</div>'+
        '</div>'+
        '<div class="fk-row-amt" style="color:'+g.color+'">'+eur(fc.amount)+'</div>'+
        '<div class="fk-row-actions">'+
          '<button class="fk-row-btn" onclick="fkOpenEdit(\''+fc.id+'\')">✏️</button>'+
          '<button class="fk-row-btn del" onclick="fkDelete(\''+fc.id+'\')">🗑</button>'+
        '</div>'+
        '</div>';
    }).join('');
    return '<div class="fk-group">'+
      '<div class="fk-group-hdr">'+
        '<span class="fk-group-lbl" style="color:'+g.color+'">'+g.lbl+'</span>'+
        '<span class="fk-group-total">'+eur(total)+'/Monat</span>'+
      '</div>'+rows+
      '</div>';
  }).join('');
}

function fkOpenNew(){
  document.getElementById('mfk-id').value='';
  document.getElementById('mfk-ttl').textContent='Vorlage hinzufügen';
  document.getElementById('mfk-name').value='';
  document.getElementById('mfk-amount').value='';
  document.getElementById('mfk-type').value='fixed';
  document.getElementById('mfk-from').value=FP.currentMonthStr();
  fkFillCatSelect('');
  fkFillObjSelect('');
  openM('m-fk');
  setTimeout(function(){document.getElementById('mfk-name').focus();},150);
}

function fkOpenEdit(id){
  var fc=FP.Store.Recurring.getAll().find(function(f){return f.id===id;});
  if(!fc)return;
  document.getElementById('mfk-id').value=fc.id;
  document.getElementById('mfk-ttl').textContent='Vorlage bearbeiten';
  document.getElementById('mfk-name').value=fc.name;
  document.getElementById('mfk-amount').value=fc.amount;
  document.getElementById('mfk-type').value=fc.type;
  document.getElementById('mfk-from').value=fc.validFrom||FP.currentMonthStr();
  fkFillCatSelect(fc.categoryId);
  fkFillObjSelect(fc.objectId);
  openM('m-fk');
}

function fkFillCatSelect(selected){
  var sel=document.getElementById('mfk-cat');
  var all=FP.Store.Categories.getVisible();
  var opts='';
  // Hauptkategorien ohne Kinder + alle Unter-Kategorien (mit Einrückung)
  all.filter(function(c){return !c.parentId;}).forEach(function(parent){
    var subs=all.filter(function(c){return c.parentId===parent.id;});
    if(subs.length>0){
      opts+='<optgroup label="'+parent.name+'">';
      subs.forEach(function(s){
        opts+='<option value="'+s.id+'"'+(s.id===selected?' selected':'')+'>'+s.name+'</option>';
      });
      opts+='</optgroup>';
    } else {
      opts+='<option value="'+parent.id+'"'+(parent.id===selected?' selected':'')+'>'+parent.name+'</option>';
    }
  });
  sel.innerHTML=opts;
}

function fkFillObjSelect(selected){
  var sel=document.getElementById('mfk-obj');
  var objs=FP.Store.Objects.getActive();
  sel.innerHTML='<option value="">— kein Objekt —</option>'+
    objs.map(function(o){
      return '<option value="'+o.id+'"'+(o.id===selected?' selected':'')+'>'+o.name+'</option>';
    }).join('');
}

function fkSave(){
  var id=document.getElementById('mfk-id').value;
  var name=document.getElementById('mfk-name').value.trim();
  var amount=parseFloat(document.getElementById('mfk-amount').value)||0;
  if(!name||!amount){toast('Name und Betrag eingeben');return;}
  var newObjectId=document.getElementById('mfk-obj').value||null;
  var newCategoryId=document.getElementById('mfk-cat').value;
  var data={
    name:name,
    amount:amount,
    type:document.getElementById('mfk-type').value,
    categoryId:newCategoryId,
    objectId:newObjectId,
    validFrom:document.getElementById('mfk-from').value.trim()||FP.currentMonthStr(),
  };
  if(id){
    FP.Store.Recurring.update(id,data);
    // Bestehende Transaktionen synchronisieren (objectId / categoryId geändert)
    FP.Store.get().transactions
      .filter(function(tx){return tx.source==='recurring'&&tx.recurringId===id;})
      .forEach(function(tx){
        var changes={};
        if(tx.objectId!==newObjectId)   changes.objectId=newObjectId;
        if(tx.categoryId!==newCategoryId) changes.categoryId=newCategoryId;
        if(Object.keys(changes).length)  FP.Store.Transactions.update(tx.id,changes);
      });
  } else {
    FP.Store.Recurring.add(data);
  }
  // Fehlende Monate nachgenerieren
  FP.Store.generateRecurringTransactions({retroactive:true});
  closeM('m-fk');
  fkRender();
  toast('Gespeichert');
}

function fkDelete(id){
  FP.Store.Recurring.delete(id);
  fkRender();
  toast('Gelöscht');
}

/* ════════════════════════════════════════
   RENTENPLANUNG TAB
════════════════════════════════════════ */
var rpS={person:'person_1',scenarioId:'sz_basis',formOpen:false,weitere:[],ruerupAutoCalc:true,ruerupLinkedAge:true};

function rpInit(){
  var store=FP.Store.get();
  rpRenderScenarios();
  rpRender();
  rpFillForm();
  setTimeout(rpSidebarHeight, 80);
}

function rpSidebarHeight(){
  if(window.innerWidth<960)return;
  var sb=document.querySelector('#p-rente .rp-sidebar');
  var mn=document.querySelector('#p-rente .rp-main');
  if(!sb||!mn)return;
  var top=sb.getBoundingClientRect().top;
  var h=(window.innerHeight-top)+'px';
  sb.style.height=h; sb.style.overflowY='auto';
  mn.style.height=h; mn.style.overflowY='auto';
}

function rpRender(){
  rpRenderPersonToggle();
  rpRenderScenarios();
  rpRenderMain();
  rpFillForm();
  rpRenderRenditeSliders();
  rpUpdateSidebarLiveInfo();
}

function rpRenderMain(){
  var store=FP.Store.get();
  var partnerOn=store.settings.partnerEnabled;
  var r1=FP.Calculator.calcRente('person_1',rpS.scenarioId);
  var r2=partnerOn?FP.Calculator.calcRente('person_2',rpS.scenarioId):null;
  // Ehegattensplitting: Steuerverteilung korrigieren wenn gemeinsame Veranlagung
  if(partnerOn && r1 && r2 && store.settings.steuerlicheVeranlagung==='gemeinsam'){
    var zvE1=r1.netResult.stpflichtigJahr||0;
    var zvE2=r2.netResult.stpflichtigJahr||0;
    var combinedZvE=zvE1+zvE2;
    var singleTax=rpCalcIncomeTax(zvE1,false)+rpCalcIncomeTax(zvE2,false);
    var jointTax=rpCalcIncomeTax(combinedZvE,true);
    var splittingVorteil=Math.max(0,singleTax-jointTax);
    // Vorteil proportional aufteilen (nach ZvE-Anteil)
    var anteil1=combinedZvE>0?zvE1/combinedZvE:0.5;
    var splVorteilMonat1=splittingVorteil/12*anteil1;
    var splVorteilMonat2=splittingVorteil/12*(1-anteil1);
    // Netto-Einkommen um Splitting-Vorteil erhöhen
    r1=Object.assign({},r1,{
      gesamtEinkommen:r1.gesamtEinkommen+splVorteilMonat1,
      gesamtEinkommenVoll:r1.gesamtEinkommenVoll+splVorteilMonat1,
      estMonat:r1.estMonat-splVorteilMonat1,
      splittingVorteil:splVorteilMonat1
    });
    r2=Object.assign({},r2,{
      gesamtEinkommen:r2.gesamtEinkommen+splVorteilMonat2,
      gesamtEinkommenVoll:r2.gesamtEinkommenVoll+splVorteilMonat2,
      estMonat:r2.estMonat-splVorteilMonat2,
      splittingVorteil:splVorteilMonat2
    });
  }
  // KV-Familienversicherung: nur wenn Partner-Person GKV hat
  // Wenn Person 2 auf Familienversicherung hofft, muss Person 1 noch GKV-versichert sein
  if(partnerOn && r2 && r2.kvLueckeStatus === 'familienversicherung'){
    var p1Profile=store.retirement&&store.retirement.profiles&&store.retirement.profiles['person_1'];
    var p1KvStatus=p1Profile&&p1Profile.kvStatus||'gkv';
    if(p1KvStatus === 'pkv'){
      // Person 1 ist PKV → Familienversicherung über Person 1 nicht möglich
      r2=Object.assign({},r2,{kvLueckeStatus:'freiwillig',kvFreiwilligKosten:r2.kvFreiwilligKosten||0});
    }
  }
  var result=(rpS.person==='person_2'?r2:r1)||r1;
  if(!result){
    document.getElementById('rp-kpi-grid').innerHTML='<div style="padding:20px;color:var(--tx3);font-size:13px">Kein Rentenprofil vorhanden.</div>';
    return;
  }
  rpRenderKpi(r1,r2,store);
  rpRenderTabs(r1,r2,store);
  // rpRenderAbzuegeCalc is called from within the Depot tab render
  if(rpActiveTab==='depot') rpRenderAbzuegeCalc(result);
}

function rpRenderPersonToggle(){
  var el=document.getElementById('rp-person-bar');
  if(!el)return;
  var store=FP.Store.get();
  var persons=[
    {id:'person_1', name: (store.persons&&store.persons.find(function(p){return p.id==='person_1'})?.name)||'Person 1'},
    {id:'person_2', name: (store.persons&&store.persons.find(function(p){return p.id==='person_2'})?.name)||'Partner'},
  ];
  if(!store.settings.partnerEnabled){
    el.innerHTML='';
    return;
  }
  el.style.background='var(--surf2)';
  el.style.borderRadius='12px';
  el.style.padding='4px';
  el.style.marginBottom='12px';
  el.innerHTML=persons.map(function(p){
    var isActive=rpS.person===p.id;
    return '<button class="rp-sz-btn'+(isActive?' active':'')+'" style="flex:1;padding:8px 12px;border-radius:9px" onclick="rpSelectPerson(\''+p.id+'\')">'+p.name+(isActive?' ✎':'')+'</button>';
  }).join('');
}

function rpSelectPerson(id){
  rpS.person=id;
  rpRender();
}

function rpPersonName(id, store) {
  var p = store.persons && store.persons.find(function(p){return p.id===id;});
  return p ? p.name : (id==='person_1'?'Person 1':'Partner');
}

function rpRenderPartnerCompare(r1, r2, store) { return; // Waisenfunktion — Inhalt in rpRenderTabHaushalt
  var el = document.getElementById('rp-partner-compare');
  if(!el) return;
  if(!r1 && !r2){ el.style.display='none'; return; }
  var n1 = rpPersonName('person_1', store);
  var n2 = rpPersonName('person_2', store);
  function col(r, name) {
    if(!r) return '<div class="rp-partner-col"><div class="rp-partner-name">'+name+'</div><div style="color:var(--tx3);font-size:12px">Kein Profil erfasst.</div></div>';
    var abzPct = r.gesetzlicheMonatsrenteBrutto > 0 ? Math.round((1 - r.gesetzlicheMonatsrente/r.gesetzlicheMonatsrenteBrutto)*100) : 0;
    var lueckeCls = r.hatLuecke ? 'color:var(--red)' : 'color:var(--green)';
    return '<div class="rp-partner-col">'+
      '<div class="rp-partner-name">'+name+' &nbsp;·&nbsp; Rente ab '+r.targetRetirementAge+'</div>'+
      '<div class="rp-partner-row"><span class="rp-partner-lbl">Gesetzl. Rente (Netto)</span><span class="rp-partner-val">'+eur(r.gesetzlicheMonatsrente)+'</span></div>'+
      '<div class="rp-partner-row"><span class="rp-partner-lbl">Gesamteinkommen</span><span class="rp-partner-val">'+eur(r.gesamtEinkommen)+'</span></div>'+
      '<div class="rp-partner-row"><span class="rp-partner-lbl">Ausgaben</span><span class="rp-partner-val">'+eur(r.ausgaben)+'</span></div>'+
      '<div class="rp-partner-row"><span class="rp-partner-lbl">Rentenlücke</span><span class="rp-partner-val" style="'+lueckeCls+'">'+(r.hatLuecke?eur(r.luecke):'Kein Defizit')+'</span></div>'+
      '<div class="rp-partner-row"><span class="rp-partner-lbl">Depot bei Rente</span><span class="rp-partner-val">'+eur(r.depotAtRetire)+'</span></div>'+
      '</div>';
  }
  // Witwenrente §46 SGB VI: 55% der gesetzl. Rente des Verstorbenen (große Witwenrente)
  var witwe1 = r1 ? Math.round(r1.gesetzlicheMonatsrenteBrutto * 0.55) : 0;
  var witwe2 = r2 ? Math.round(r2.gesetzlicheMonatsrenteBrutto * 0.55) : 0;
  var witweRow = (r1 && r2 && (witwe1>0||witwe2>0)) ?
    '<div style="margin-top:10px;padding:10px;background:var(--surf2);border-radius:8px;border:1px solid var(--brd)">'+
      '<div style="font-size:11px;font-weight:700;color:var(--tx3);margin-bottom:6px">WITWENRENTE §46 SGB VI (große, 55 %)</div>'+
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'+
        '<div><div style="font-size:11px;color:var(--tx3)">'+n2+' verstirbt → '+n1+' erhält</div><div style="font-size:14px;font-weight:700;color:var(--blue)">'+eur(witwe2)+'/Mo</div><div style="font-size:10px;color:var(--tx3)">Brutto · zzgl. eigener Rente · steuerpflichtig</div></div>'+
        '<div><div style="font-size:11px;color:var(--tx3)">'+n1+' verstirbt → '+n2+' erhält</div><div style="font-size:14px;font-weight:700;color:var(--blue)">'+eur(witwe1)+'/Mo</div><div style="font-size:10px;color:var(--tx3)">Brutto · zzgl. eigener Rente · steuerpflichtig</div></div>'+
      '</div>'+
    '</div>' : '';
  el.style.display='block';
  el.innerHTML='<div class="rp-partner-grid" style="margin-bottom:12px">'+col(r1,n1)+col(r2,n2)+'</div>'+witweRow;
}

function rpRenderHousehold(r1, r2, store) { return; // Waisenfunktion — Inhalt in rpRenderTabHaushalt
  var el = document.getElementById('rp-household');
  if(!el || !r1) { if(el) el.style.display='none'; return; }
  var hhEinkommen = (r1 ? r1.gesamtEinkommen : 0) + (r2 ? r2.gesamtEinkommen : 0);
  var hhAusgaben  = (r1 ? r1.ausgaben : 0) + (r2 ? r2.ausgaben : 0);
  var hhLuecke    = Math.max(0, hhAusgaben - hhEinkommen);
  var hhDepot     = (r1 ? r1.depotAtRetire : 0) + (r2 ? r2.depotAtRetire : 0);
  var hhSwrNetto  = (r1 ? r1.swrNetto : 0) + (r2 ? r2.swrNetto : 0);
  var lueckeCls   = hhLuecke > 0 ? 'var(--red)' : 'var(--green)';
  el.style.display = 'block';
  el.innerHTML = '<div class="rp-hh-card">'+
    '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--tx3);margin-bottom:10px">Haushalt Gesamt</div>'+
    '<div class="rp-hh-row"><span class="rp-hh-lbl">HH-Gesamteinkommen</span><span class="rp-hh-val">'+eur(hhEinkommen)+'/Mo</span></div>'+
    '<div class="rp-hh-row"><span class="rp-hh-lbl">Gesamte Ausgaben</span><span class="rp-hh-val">'+eur(hhAusgaben)+'/Mo</span></div>'+
    '<div class="rp-hh-row"><span class="rp-hh-lbl">HH-Depot gesamt</span><span class="rp-hh-val">'+eur(hhDepot)+'</span></div>'+
    '<div class="rp-hh-row"><span class="rp-hh-lbl">Depot-Entnahme Netto</span><span class="rp-hh-val">'+eur(hhSwrNetto)+'/Mo</span></div>'+
    '<div class="rp-hh-row" style="margin-top:4px"><span class="rp-hh-lbl" style="font-weight:800">HH-Rentenlücke</span><span class="rp-hh-val" style="color:'+lueckeCls+'">'+(hhLuecke>0?eur(hhLuecke):'Kein Defizit')+'</span></div>'+
    ((r1&&r1.splittingVorteil)||(r2&&r2.splittingVorteil)?'<div class="rp-hh-row" style="margin-top:4px"><span class="rp-hh-lbl" style="color:var(--green)">Splitting-Vorteil/Mo</span><span class="rp-hh-val" style="color:var(--green)">+'+eur((r1&&r1.splittingVorteil||0)+(r2&&r2.splittingVorteil||0))+'</span></div>':'')+
    '</div>';
}

function rpRenderScenarios(){
  var store=FP.Store.get();
  var el=document.getElementById('rp-sz-bar');
  if(!el)return;
  el.innerHTML=store.retirement.scenarios.map(function(s){
    return '<button class="rp-sz-btn'+(s.id===rpS.scenarioId?' active':'')+'" onclick="rpSelectScenario(\''+s.id+'\')">'+s.name+'</button>';
  }).join('');
}

function rpSelectScenario(id){
  rpS.scenarioId=id;
  rpRenderScenarios();
  rpRenderRenditeSliders();
  rpRender();
}

/* ── Rendite-Annahmen Schieberegler ── */
var RP_CR_DEFAULTS = {
  sz_basis:         { etf:7.0, aktie:7.0, fonds:7.0, geldmarkt:2.5, tagesgeld:2.0, girokonto:0.0, espp:7.0, rsu:7.0 },
  sz_pessimistisch: { etf:4.0, aktie:4.0, fonds:4.0, geldmarkt:1.0, tagesgeld:0.5, girokonto:0.0, espp:4.0, rsu:4.0 },
  sz_optimistisch:  { etf:9.0, aktie:9.0, fonds:9.0, geldmarkt:3.5, tagesgeld:3.0, girokonto:0.0, espp:9.0, rsu:9.0 },
  sz_stresstest:    { etf:1.0, aktie:1.0, fonds:1.0, geldmarkt:0.5, tagesgeld:0.5, girokonto:0.0, espp:1.0, rsu:1.0 },
};
var RP_CR_CONFIG = [
  { key:'etf',       label:'ETF / Aktien',  min:0, max:15, step:0.5 },
  { key:'aktie',     label:'Einzelaktien',  min:0, max:15, step:0.5 },
  { key:'fonds',     label:'Fonds',         min:0, max:12, step:0.5 },
  { key:'geldmarkt', label:'Geldmarkt',     min:0, max:8,  step:0.5 },
  { key:'tagesgeld', label:'Tagesgeld',     min:0, max:6,  step:0.5 },
  { key:'girokonto', label:'Girokonto',     min:0, max:4,  step:0.5 },
  { key:'espp',      label:'ESPP',          min:0, max:15, step:0.5 },
  { key:'rsu',       label:'RSU',           min:0, max:15, step:0.5 },
];
var RP_INFL_DEFAULTS = {
  sz_basis:2.3, sz_pessimistisch:3.5, sz_optimistisch:1.8, sz_stresstest:4.0
};

function rpGetInflationRate(){
  var sz=rpGetActiveScenario();
  var def=RP_INFL_DEFAULTS[sz.id]!==undefined?RP_INFL_DEFAULTS[sz.id]:2.3;
  return (sz.overrides&&sz.overrides.inflationRate!=null)?sz.overrides.inflationRate:def;
}

function rpGetActiveScenario(){
  var store=FP.Store.get();
  return store.retirement.scenarios.find(function(s){return s.id===rpS.scenarioId;})
      || store.retirement.scenarios.find(function(s){return s.isPinned;})
      || {id:'',classReturns:{}};
}

function rpGetClassReturns(){
  var sz=rpGetActiveScenario();
  return Object.assign({}, RP_CR_DEFAULTS[sz.id]||RP_CR_DEFAULTS.sz_basis, sz.classReturns||{});
}

function rpRenderRenditeSliders(){
  var el=document.getElementById('rp-rendite-sliders');
  if(!el) return;
  var cr=rpGetClassReturns();
  // Nur Asset-Klassen anzeigen die im Portfolio vorhanden sind
  var store=FP.Store.get();
  var activeTypes={};
  (store.assets||[]).filter(function(a){return a.status==='aktiv'&&a.type!=='immobilie'&&a.type!=='sonstiges';}).forEach(function(a){activeTypes[a.type]=true;});
  var html='';
  RP_CR_CONFIG.forEach(function(cfg){
    if(!activeTypes[cfg.key]) return;
    var val=cr[cfg.key]!==undefined?cr[cfg.key]:0;
    html+='<div class="rp-f">'+
      '<div class="rp-fl"><span>'+cfg.label+'</span><span class="rp-fv" id="rp-cr-sv-'+cfg.key+'">'+val.toFixed(1)+'%</span></div>'+
      '<input type="range" class="rp-sl-range" id="rp-cr-sl-'+cfg.key+'" min="'+cfg.min+'" max="'+cfg.max+'" step="'+cfg.step+'" value="'+val+'" '+
        'oninput="rpSetClassReturn(\''+cfg.key+'\',this.value)">'+
    '</div>';
  });
  var infl=rpGetInflationRate();
  var inflHtml='<div style="border-top:1px solid var(--brd);margin:10px 0 8px"></div>'+
    '<div class="rp-f">'+
      '<div class="rp-fl"><span>Inflation</span><span class="rp-fv" id="rp-infl-sv">'+infl.toFixed(1)+'%</span></div>'+
      '<input type="range" class="rp-sl-range" id="rp-infl-sl" min="0" max="8" step="0.1" value="'+infl+'" oninput="rpSetInflationRate(this.value)">'+
    '</div>';
  el.innerHTML=(html||'<div style="font-size:12px;color:var(--tx3)">Keine Anlagen im Vermögen-Tab erfasst.</div>')+inflHtml;
  rpUpdateWeightedLabel();
}

function rpSetClassReturn(type, value){
  var v=parseFloat(value);
  var sv=document.getElementById('rp-cr-sv-'+type);
  if(sv) sv.textContent=v.toFixed(1)+'%';
  var sz=rpGetActiveScenario();
  if(!sz.id) return;
  FP.Store.Settings.updateScenarioClassReturns(sz.id, (function(o){o[type]=v;return o;})({}) );
  rpUpdateWeightedLabel();
  rpRenderMain(); // live Berechnung updaten
}

function rpSetInflationRate(value){
  var v=parseFloat(value);
  var sv=document.getElementById('rp-infl-sv');
  if(sv) sv.textContent=v.toFixed(1)+'%';
  var sz=rpGetActiveScenario();
  if(!sz.id) return;
  FP.Store.Settings.updateScenarioInflationRate(sz.id, v);
  rpUpdateWeightedLabel();
  rpRenderMain();
}

function rpResetClassReturns(){
  var sz=rpGetActiveScenario();
  if(!sz.id) return;
  var defaults=RP_CR_DEFAULTS[sz.id]||RP_CR_DEFAULTS.sz_basis;
  FP.Store.Settings.updateScenarioClassReturns(sz.id, Object.assign({},defaults));
  var inflDef=RP_INFL_DEFAULTS[sz.id]!==undefined?RP_INFL_DEFAULTS[sz.id]:2.3;
  FP.Store.Settings.updateScenarioInflationRate(sz.id, inflDef);
  rpRenderRenditeSliders();
  rpRenderMain();
}

function rpRuerupProject(suppressSave){
  var projEl=document.getElementById('rp-ruerup-proj');
  var stEl  =document.getElementById('rp-ruerup-stinfo');
  var val   =parseFloat(document.getElementById('rp-ruerup-val').value)||0;
  var rf    =parseFloat(document.getElementById('rp-ruerup-rf').value)||487;
  var retAge=parseInt(document.getElementById('rp-ruerup-age').value)||67;

  // Aktuelles Alter aus store.persons
  var store=FP.Store.get();
  var prof=(store.persons||[]).find(function(p){return p.id===rpS.person;})
         ||(store.persons||[])[0]||{};
  var birthYear=prof.birthDate?parseInt(prof.birthDate.split('.').pop()):1990;
  var currentAge=new Date().getFullYear()-birthYear;
  var years=Math.max(0,retAge-currentAge);
  var retYear=new Date().getFullYear()+years;

  // Besteuerungsanteil §22 Nr. 1a EStG
  var bA=retYear>=2058?1.0:retYear>2020?Math.min(1.0,0.80+(retYear-2020)*0.005):retYear>2005?Math.min(0.80,0.50+(retYear-2005)*0.02):0.50;
  if(stEl) stEl.textContent='Kohorte '+retYear+': '+Math.round(bA*100)+'% steuerpflichtig (§22 Nr. 1a EStG)';

  if(!projEl) return;
  if(val<=0){projEl.innerHTML='';return;}

  // Gewichtete Rendite aus Portfolio
  var cr=rpGetClassReturns();
  var NICHT_DEPOT=['immobilie','sonstiges'];
  var depot=FP.Calculator.getAssetSummary();
  var items=depot.items.filter(function(i){return!NICHT_DEPOT.includes(i.type);});
  var total=items.reduce(function(s,i){return s+i.value;},0)||1;
  var weightedR=items.reduce(function(s,item){
    var rate=cr[item.type]!==undefined?cr[item.type]:(cr.etf||7);
    return s+(item.value/total)*rate;
  },0)||7;

  var fundAtRet=val*Math.pow(1+weightedR/100,years);
  var monthly=fundAtRet*rf/10000/12;

  projEl.innerHTML=
    'Ø <strong>'+weightedR.toFixed(1)+'%</strong> Rendite, '+years+' Jahre → '+
    'Fonds ~<strong>'+eur(Math.round(fundAtRet/500)*500)+'</strong>'+
    ' → <strong>~'+Math.round(monthly)+' €/Mo</strong> brutto';

  if(rpS.ruerupAutoCalc){
    var fld=document.getElementById('rp-ruerup');
    if(fld) fld.value=Math.round(monthly);
    rpRuerupUpdateModeBadge();
    if(!suppressSave) rpQuickSave();
  }
}

function rpRuerupUpdateModeBadge(){
  var el=document.getElementById('rp-ruerup-mode');
  if(!el) return;
  if(rpS.ruerupAutoCalc){
    el.textContent='↻ auto';
    el.style.background='var(--green,var(--green))';
    el.style.color='var(--on-accent)';
    el.style.border='none';
    el.title='Automatisch aus Projektion — klicken für manuell';
  } else {
    el.textContent='✎ manuell';
    el.style.background='transparent';
    el.style.color='var(--tx3)';
    el.style.border='1px solid var(--brd)';
    el.title='Manuell eingegeben — klicken für automatisch';
  }
}

function rpRuerupToggleMode(){
  rpS.ruerupAutoCalc=!rpS.ruerupAutoCalc;
  rpRuerupUpdateModeBadge();
  if(rpS.ruerupAutoCalc) rpRuerupProject();
  else rpQuickSave();
}

function rpRuerupManualEdit(){
  if(rpS.ruerupAutoCalc){
    rpS.ruerupAutoCalc=false;
    rpRuerupUpdateModeBadge();
  }
}

function rpUpdateWeightedLabel(){
  var el=document.getElementById('rp-rendite-weighted');
  if(!el) return;
  var cr=rpGetClassReturns();
  var NICHT_DEPOT=['immobilie','sonstiges'];
  var depot=FP.Calculator.getAssetSummary();
  var items=depot.items.filter(function(i){return!NICHT_DEPOT.includes(i.type);});
  var total=items.reduce(function(s,i){return s+i.value;},0)||1;
  var w=items.reduce(function(s,item){
    var rate=cr[item.type]!==undefined?cr[item.type]:(cr.etf||7);
    return s+(item.value/total)*rate;
  },0);
  var infl=rpGetInflationRate();
  var real=w-infl;
  el.textContent='Ø '+w.toFixed(1)+'% nominal · '+real.toFixed(1)+'% real';
}

function rpRenderResults(r){ return; // Waisenfunktion — DOM-Element rp-results existiert nicht
  var el=document.getElementById('rp-results');
  if(!el)return;
  var lueckeCls=r.hatLuecke?'luecke':'ok';
  var deferredNote=r.deferredSources&&r.deferredSources.length?
    r.deferredSources.map(function(d){return d.name+' ab '+d.startAge;}).join(', '):'';
  var einkommenSub='Brutto: '+eur(r.gesamtBrutto)+' · Ziel: '+eur(r.ausgaben)+'/Monat';
  if(deferredNote) einkommenSub+=' · Noch nicht aktiv: '+deferredNote;
  var lueckeSub=r.hatLuecke?'pro Monat (Netto)':'Einkommen deckt Ausgaben';
  if(r.hatLuecke&&!r.hatLueckeVoll&&r.deferredSources&&r.deferredSources.length)
    lueckeSub+=' · Kein Defizit sobald alle Quellen aktiv';
  var cards=[
    {lbl:'Gesetzliche Rente (Netto)',val:eur(r.gesetzlicheMonatsrente),sub:'Brutto: '+eur(r.gesetzlicheMonatsrenteBrutto)+' · '+r.punkteBeiRente.toFixed(1)+' Punkte'+(r.zugangsfaktor<1?' · '+FP.r2((1-r.zugangsfaktor)*100)+'% Abschlag':''),cls:''},
    {lbl:'Gesamteinkommen (Netto)',val:eur(r.gesamtEinkommen),sub:einkommenSub,cls:''},
    {lbl:'Rentenlücke',val:r.hatLuecke?eur(r.luecke):'Kein Defizit',sub:lueckeSub,cls:lueckeCls},
    {lbl:'Renteneintritt in',val:Math.max(0,r.yearsToRetire)+' Jahren',sub:'Alter '+r.targetRetirementAge+' · '+r.currentAge+' heute',cls:''},
  ];
  el.innerHTML=cards.map(function(c){
    return '<div class="rp-res '+c.cls+'">'+
      '<div class="rp-res-lbl">'+c.lbl+'</div>'+
      '<div class="rp-res-val">'+c.val+'</div>'+
      '<div class="rp-res-sub">'+c.sub+'</div>'+
      '</div>';
  }).join('');
}

function rpRenderIncome(r){ return; // Waisenfunktion — DOM-Element rp-income existiert nicht
  var el=document.getElementById('rp-income');
  if(!el)return;
  var colors={gesetzlich:'var(--blue)',direkt:'var(--green)',ruerup:'var(--purple)',weitere:'var(--amber)'};
  // Basis-Quellen
  var sources=[
    {key:'gesetzlich',lbl:'Gesetzliche Rente',val:r.gesetzlicheMonatsrente,brutto:r.gesetzlicheMonatsrenteBrutto,aktiv:true},
    {key:'direkt',lbl:'Betriebsrente',val:r.direktzusageMonatlich,brutto:r.direktzusageBrutto,aktiv:r.direktzusageAktiv,startAge:r.direktzusageStartAge},
    {key:'ruerup',lbl:'Rürup-Rente',val:r.ruerupMonatlich,brutto:r.ruerupBrutto,aktiv:r.ruerupAktiv,startAge:r.ruerupStartAge},
  ].filter(function(s){return s.val>0;});
  // Weitere Rentenversicherungen einzeln
  (r.weitereQuellennetto||[]).forEach(function(w,i){
    if(w.netto>0) sources.push({key:'weitere_'+i,lbl:w.name,val:w.netto,brutto:w.brutto,aktiv:w.aktiv,startAge:w.startAge});
  });
  if(!sources.length){
    el.innerHTML='<div style="padding:16px;color:var(--tx3);font-size:13px">Noch keine Renteneinkommen erfasst.</div>';
    return;
  }
  // Bar basiert auf Volleinkommen (damit deferred sichtbar aber transparent)
  var total=r.gesamtEinkommenVoll||r.gesamtEinkommen||1;
  var barHtml=sources.map(function(s){
    var col=colors[s.key]||colors['weitere'];
    var opacity=s.aktiv?'1':'0.35';
    return '<div class="rp-income-seg" style="width:'+(s.val/total*100).toFixed(1)+'%;background:'+col+';opacity:'+opacity+'"></div>';
  }).join('');
  var nr = r.netResult || {};
  var legHtml=sources.map(function(s){
    var col=colors[s.key]||colors['weitere'];
    var ageSub=!s.aktiv?' <span style="color:var(--amber);font-size:11px">ab Alter '+s.startAge+'</span>':'';
    var abzSub='';
    if(s.brutto && s.brutto !== s.val){
      var abzArr=['Brutto: '+eur(s.brutto)];
      if(s.key==='gesetzlich'&&nr.gKV) abzArr.push('KV: '+eur(nr.gKV),'PV: '+eur(nr.gPV));
      if(s.key==='direkt'&&nr.dKV!=null) abzArr.push('KV: '+eur(nr.dKV),'PV: '+eur(nr.dPV));
      if(nr.estMonat){var share=r.gesamtBrutto>0?(s.brutto/r.gesamtBrutto):0;abzArr.push('ESt: ~'+eur(Math.round(nr.estMonat*share)));}
      abzSub=' <span style="color:var(--tx3);font-size:11px">('+abzArr.join(' · ')+')</span>';
    }
    return '<div class="rp-income-leg" style="opacity:'+(s.aktiv?'1':'0.6')+'"><div class="rp-income-dot" style="background:'+col+'"></div>'+s.lbl+' — '+eur(s.val)+' Netto'+abzSub+ageSub+'</div>';
  }).join('');
  el.innerHTML='<div class="rp-income-bar">'+barHtml+'</div><div class="rp-income-legend">'+legHtml+'</div>';
}

function rpRenderDepot(r){ return; // Waisenfunktion — DOM-Element rp-depot existiert nicht
  var el=document.getElementById('rp-depot');
  if(!el)return;
  var rows=[
    {lbl:'Depot heute',val:eur(r.depotStart),sub:''},
    {lbl:'Monatliche Sparrate',val:eur(r.monthlySavings),sub:''},
    {lbl:'Depot bei Rentenbeginn',val:eur(r.depotAtRetire),sub:''},
    {lbl:'Entnahme Netto ('+r.swrRate+'% SWR)',val:eur(r.swrNetto)+'/Monat',sub:'Brutto: '+eur(r.safeWithdrawal)+' · ca. '+r.swrEffectiveTaxPct+'% Steuer (Aktien-ETF, 30% Teilfr.)'},
    {lbl:'Depot-Haltbarkeit',val:(function(){
      if(!r.hatLuecke)return'Kein Depot-Verzehr nötig';
      if(r.depotJahre<=0)return'< 1 Jahr';
      var bisAlter=Math.round(r.targetRetirementAge+r.depotJahre);
      return'bis ca. Alter\u2009'+bisAlter+'\u2009('+r.depotJahre.toFixed(0)+'\u2009Jahre)';
    })(),sub:''},
  ];
  el.innerHTML=rows.map(function(row){
    return '<div class="rp-proj-row"><span class="rp-proj-lbl">'+row.lbl+'</span><span class="rp-proj-val">'+row.val+'</span></div>'+
      (row.sub?'<div style="font-size:11px;color:var(--tx3);padding:0 0 6px 0;margin-top:-2px">'+row.sub+'</div>':'');
  }).join('');
}

function rpRenderAbzuegeCalc(r){
  var el=document.getElementById('rp-abzuege-calc');
  if(!el||!r||!r.netResult)return;
  var nr=r.netResult;
  var bA=nr.besteuerungsanteil||0;
  var pvlbl=r.netResult?'Voller Satz':'';
  var lines=[
    '<strong>Automatisch berechnete Abzüge (GKV-versichert, 2026)</strong>',
    'Besteuerungsanteil: <strong>'+bA.toFixed(1)+'%</strong> (Renteneintritt '+r.targetRetirementAge+', JStG 2022)',
    'KV Gesetzl. Rente: <strong>'+eur(nr.gKV)+'/Mo.</strong> · PV: <strong>'+eur(nr.gPV)+'/Mo.</strong> (DRV trägt KV-Hälfte)',
  ];
  if(r.direktzusageBrutto>0) lines.push('KV Betriebsrente: <strong>'+eur(nr.dKV)+'/Mo.</strong> (Freibetrag '+eur(nr.kvFreibetr)+'/Mo.) · PV: <strong>'+eur(nr.dPV)+'/Mo.</strong>');
  lines.push('Einkommensteuer: <strong>'+eur(nr.estMonat)+'/Mo.</strong> (alle Quellen zusammen, ca.)');
  el.innerHTML=lines.join('<br>');
}

function rpFillForm(){
  var store=FP.Store.get();
  var p=store.retirement.profiles[rpS.person]||store.retirement.profiles.person_1;
  var expVal=p.ausgabenOverride!=null?p.ausgabenOverride:(p.monthlyExpenseInRetirement||4000);
  document.getElementById('rp-retage').value    =p.targetRetirementAge||63;
  document.getElementById('rp-regular-age').value=p.regularRetirementAge||67;
  var kvSel=document.getElementById('rp-kv-status');
  if(kvSel) kvSel.value=p.kvStatus||'gkv';
  document.getElementById('rp-expenses').value  =expVal;
  document.getElementById('rp-expenses2').value =expVal;
  document.getElementById('rp-gehaltssteig').value=p.gehaltsSteigerung!=null?p.gehaltsSteigerung:2.0;
  rpSyncSlider('retage');
  rpSyncSlider('expenses');
  rpSyncSlider('gehaltssteig');
  // sync expenses2 slider
  var sl2=document.getElementById('rp-expenses-sl2');
  var sv2=document.getElementById('rp-expenses-sv2');
  if(sl2) sl2.value=expVal;
  if(sv2) sv2.textContent=parseFloat(expVal).toLocaleString('de-DE')+' €';
  document.getElementById('rp-punkte').value    =p.gesetzlicheRente.currentEntgeltpunkte||'';
  document.getElementById('rp-punkte-date').value=p.gesetzlicheRente.dataDate||'';
  rpUpdateEpYearUI(rpS.person);
  document.getElementById('rp-rentenwert').value=p.gesetzlicheRente.rentenwertWest||40.79;
  var _kvZ=store.retirement&&store.retirement.assumptions&&store.retirement.assumptions.kvZusatzbeitrag!=null?store.retirement.assumptions.kvZusatzbeitrag:2.99;
  document.getElementById('rp-kv-zusatz').value=_kvZ;
  var _fvG=(store.retirement&&store.retirement.assumptions&&store.retirement.assumptions.familienversicherungGrenze!=null)?store.retirement.assumptions.familienversicherungGrenze:505;
  var _gkvM=(store.retirement&&store.retirement.assumptions&&store.retirement.assumptions.gkvMindestBmg!=null)?store.retirement.assumptions.gkvMindestBmg:1131.67;
  var fvEl=document.getElementById('rp-fv-grenze');if(fvEl)fvEl.value=_fvG;
  var gmEl=document.getElementById('rp-gkv-mindest');if(gmEl)gmEl.value=_gkvM;
  var _kvAnz=document.getElementById('rp-kv-satz-anzeige');
  if(_kvAnz)_kvAnz.textContent=((14.6+_kvZ)/2).toFixed(2).replace('.',',');
  document.getElementById('rp-direkt').value    =p.direktzusage.monthlyAmountAtStart||'';
  document.getElementById('rp-direkt-ag').value =p.direktzusage.employer||'';
  document.getElementById('rp-ruerup').value    =p.ruerupRente.monthlyAmountAtStart||'';
  document.getElementById('rp-ruerup-age').value=p.ruerupRente.startAge||67;
  document.getElementById('rp-ruerup-val').value=p.ruerupRente.currentValue||'';
  document.getElementById('rp-ruerup-rf').value =p.ruerupRente.rentenfaktor||'';
  rpS.ruerupAutoCalc  = p.ruerupRente.autoCalc  !== false;
  rpS.ruerupLinkedAge = p.ruerupRente.linkedAge !== false;
  if(rpS.ruerupLinkedAge){
    document.getElementById('rp-ruerup-age').value = p.targetRetirementAge||63;
  }
  rpRuerupUpdateModeBadge();
  rpRuerupUpdateAgeBadge();
  rpRuerupProject(true);
  document.getElementById('rp-nf-gesetzlich').value   =p.netFactorGesetzlich!=null?p.netFactorGesetzlich:'';
  document.getElementById('rp-nf-betriebsrente').value=p.netFactorBetriebsrente!=null?p.netFactorBetriebsrente:'';
  document.getElementById('rp-nf-ruerup').value       =p.netFactorRuerup!=null?p.netFactorRuerup:'';
  // Entnahme-Strategie
  var strat=p.entnahmeStrategie||'luecke';
  var stratSel=document.getElementById('rp-entnahme-strat');
  if(stratSel) stratSel.value=strat;
  rpToggleEntnahmeFields(strat);
  var swrEl=document.getElementById('rp-swr');
  if(swrEl){swrEl.value=p.swrRate||3.5;rpSyncSlider('swr');}
  var grEl=document.getElementById('rp-guardrails');
  if(grEl) grEl.checked=!!(p.guardrails);
  var festEl=document.getElementById('rp-entnahme-fest');
  if(festEl) festEl.value=p.entnahmeFest||'';
  // Kinder
  var kSet=store.settings?.kinder||{};
  var kKosten=document.getElementById('rp-k-kosten');
  var kDauer=document.getElementById('rp-k-dauer');
  if(kKosten) kKosten.value=p.kinderKostenOverride!=null?p.kinderKostenOverride:(kSet.ausbildungKosten||800);
  if(kDauer)  kDauer.value =p.kinderDauerOverride!=null?p.kinderDauerOverride:(kSet.ausbildungDauer||4);
  // Erbimmobilie
  var erb=p.erbimmobilie||{};
  var erbTgl=document.getElementById('rp-erbe-tgl');
  if(erbTgl){erbTgl.classList.toggle('on',!!erb.enabled);document.getElementById('rp-erbe-fields').style.display=erb.enabled?'block':'none';}
  var erbeJahre=document.getElementById('rp-erbe-jahre');
  var erbeWert=document.getElementById('rp-erbe-wert');
  var erbeModus=document.getElementById('rp-erbe-modus');
  var erbeMiete=document.getElementById('rp-erbe-miete');
  if(erbeJahre) erbeJahre.value=erb.inJahren||15;
  if(erbeWert)  erbeWert.value =erb.wert||250000;
  if(erbeModus){erbeModus.value=erb.modus||'verkauf';rpToggleErbeFields();}
  if(erbeMiete) erbeMiete.value=erb.miete||900;
  var _retAgeForLoad = p.targetRetirementAge||63;
  rpS.weitere=(p.weitereRentenversicherungen||[]).map(function(w){
    var linked = w.linkedRetAge !== false;
    return {
      name:w.name||'', modus:w.modus||'monatlich',
      monthlyAmountAtStart:w.monthlyAmountAtStart||0,
      einmalbetrag:w.einmalbetrag||0, eigenbeitraege:w.eigenbeitraege||0,
      steuermodell:w.steuermodell||'halbeinkuenfte', persSteuersatz:w.persSteuersatz||25,
      startAge: linked ? _retAgeForLoad : (w.startAge||67),
      type:w.type||'privat', linkedRetAge: linked,
    };
  });
  rpRenderWeitere();
}


function rpGetErtragsanteil(age) {
  if(age<=60)return 22; if(age===61)return 22; if(age===62)return 21;
  if(age===63)return 20; if(age===64)return 19; if(age<=66)return 18;
  if(age<=68)return 17; if(age===69)return 16; if(age<=71)return 15;
  return 14;
}
function rpRenderWeitere(){
  var el=document.getElementById('rp-weitere-list');
  if(!el)return;
  if(!rpS.weitere.length){
    el.innerHTML='<div style="color:var(--tx3);font-size:12px;padding:4px 0">Noch keine weiteren Renten erfasst.</div>';
    return;
  }
  var _stW=FP.Store.get();
  var _rpW=_stW.retirement&&_stW.retirement.profiles&&_stW.retirement.profiles[rpS.person];
  var targetAge=_rpW?(_rpW.targetRetirementAge||63):63;
  el.innerHTML=rpS.weitere.map(function(w,i){
    var t=w.type||'privat';
    var m=w.modus||'monatlich';
    var isE=m==='einmalig';
    var stm=w.steuermodell||'halbeinkuenfte';
    var startAge=w.startAge||67;
    // Warnung: monatliche Rente startet nach Rentenbeginn
    var warn=(!isE&&startAge>targetAge)
      ?'<div style="color:var(--amber,var(--amber));font-size:11px;margin-top:5px">⚠ Beginnt erst ab Alter '+startAge+' — zählt nicht sofort ab Rentenbeginn.</div>'
      :'';
    // Ertragsanteil-Info für monatliche private RV
    var eaInfo='';
    if(!isE&&t==='privat'){
      var ea=rpGetErtragsanteil(startAge);
      eaInfo='<div style="color:var(--tx3);font-size:11px;margin-top:5px">Ertragsanteil §22 EStG ab Alter '+startAge+': <strong>'+ea+'%</strong> steuerpflichtig · Rest steuerfrei</div>';
    }
    // Steuer-Zeile für einmalig
    var taxRow='';
    if(isE){
      // bAV einmalig: §22 Nr. 5 EStG — volle Versteuerung, kein Wahlrecht
      if(t==='bav'){
        taxRow='<div style="background:var(--surf,rgba(0,0,0,.03));border-radius:7px;padding:8px 10px;margin-top:6px">'+
          '<div style="font-size:11px;color:var(--tx3);margin-bottom:6px">Steuer §22 Nr. 5 EStG — volle Versteuerung als Einkommen</div>'+
          '<div style="display:flex;align-items:center;gap:6px">'+
            '<span style="font-size:11px;color:var(--tx3)">Pers. Steuersatz</span>'+
            '<input class="fi rp-w-steuersatz" type="number" min="1" max="55" step="1" placeholder="42" value="'+(w.persSteuersatz||42)+'" style="width:56px;background:var(--surf);border-color:var(--brd)"> %'+
          '</div>'+
          '<input type="hidden" class="rp-w-steuer" value="halbeinkuenfte">'+
        '</div>';
      } else {
        var stzFeld=stm==='halbeinkuenfte'
          ?'<input class="fi rp-w-steuersatz" type="number" min="1" max="55" step="1" placeholder="25" value="'+(w.persSteuersatz||25)+'" style="width:56px;background:var(--surf);border-color:var(--brd)"> %'
          :'';
        var hint=stm==='steuerfrei'
          ?'<div style="font-size:11px;color:var(--green,var(--green));margin-top:4px">✓ Steuerfrei gem. §20 EStG a.F. — gilt für Verträge vor 01.01.2005 mit Laufzeit ≥12 J. und Todesfallschutz ≥60% der Beitragssumme.</div>'
          :'';
        taxRow='<div style="background:var(--surf,rgba(0,0,0,.03));border-radius:7px;padding:8px 10px;margin-top:6px">'+
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:6px">'+
            '<div>'+
              '<div style="font-size:11px;color:var(--tx3);margin-bottom:3px">Eigenbeiträge gesamt</div>'+
              '<input class="fi rp-w-eigenb" type="number" min="0" step="1000" placeholder="0 €" value="'+(w.eigenbeitraege||'')+'" style="width:100%;box-sizing:border-box;background:var(--surf);border-color:var(--brd)">'+
            '</div>'+
            '<div>'+
              '<div style="font-size:11px;color:var(--tx3);margin-bottom:3px">Steuermodell</div>'+
              '<select class="fi rp-w-steuer" style="width:100%;font-size:12px;padding:6px 4px;box-sizing:border-box;background:var(--surf);border-color:var(--brd)">'+
                '<option value="steuerfrei"'+(stm==='steuerfrei'?' selected':'')+'>Steuerfrei (vor 2005)</option>'+
                '<option value="halbeinkuenfte"'+(stm==='halbeinkuenfte'?' selected':'')+'>Halbeinkünfte 50%</option>'+
                '<option value="abgeltung"'+(stm==='abgeltung'?' selected':'')+'>Abgeltung 26,375%</option>'+
              '</select>'+
            '</div>'+
          '</div>'+
          (stm==='halbeinkuenfte'
            ?'<div style="display:flex;align-items:center;gap:6px"><span style="font-size:11px;color:var(--tx3)">Pers. Steuersatz</span>'+stzFeld+'</div>'
            :'')+
          hint+
        '</div>';
      }
    }
    var inpSt='background:var(--surf);border-color:var(--brd);';
    return '<div class="rp-w-row" style="padding:10px 12px;background:var(--surf2);border:1px solid var(--brd);border-radius:10px;margin-bottom:8px">'+
      // Zeile 1: Name (volle Breite)
      '<input class="fi rp-w-name" type="text" placeholder="z.B. Allianz Private RV" value="'+(w.name||'').replace(/"/g,'&quot;')+'" style="width:100%;box-sizing:border-box;margin-bottom:6px;'+inpSt+'">'+
      // Zeile 2: Betrag | Ab Alter | Typ | Modus | ×
      '<div style="display:flex;flex-wrap:wrap;gap:5px;align-items:center">'+
        (isE
          ?'<input class="fi rp-w-einmal" type="number" min="0" step="1000" inputmode="decimal" placeholder="Auszahlbetrag €" value="'+(w.einmalbetrag||'')+'" style="flex:2;min-width:110px;padding:8px 10px;font-size:13px;'+inpSt+'">'
          :'<input class="fi rp-w-amt" type="number" min="0" step="10" inputmode="decimal" placeholder="€ / Monat" value="'+(w.monthlyAmountAtStart||'')+'" style="flex:2;min-width:110px;padding:8px 10px;font-size:13px;'+inpSt+'">'
        )+
        '<input class="fi rp-w-age" type="number" min="50" max="90" step="1" inputmode="numeric" placeholder="Alter" value="'+startAge+'" '+(w.linkedRetAge?'disabled ':'')+'style="flex:0 0 66px;width:66px;padding:8px 6px;font-size:13px;'+inpSt+'">'+
        '<span onclick="rpWeitereToggleAge('+i+')" style="cursor:pointer;font-size:13px;padding:0 2px;flex-shrink:0;opacity:'+(w.linkedRetAge?1:0.4)+'" title="'+(w.linkedRetAge?'Mit Rentenalter verknüpft – klicken zum Entkoppeln':'Manuell – klicken zum Verknüpfen')+'">🔗</span>'+
        '<input type="hidden" class="rp-w-linked-age" value="'+(w.linkedRetAge?'1':'0')+'">'+
        '<select class="fi rp-w-type" style="flex:0 0 74px;width:74px;padding:8px 4px;font-size:13px;'+inpSt+'">'+
          '<option value="bav"'+(t==='bav'?' selected':'')+'>bAV</option>'+
          '<option value="privat"'+(t==='privat'?' selected':'')+'>Privat</option>'+
        '</select>'+
        '<select class="fi rp-w-modus" style="flex:0 0 86px;width:86px;padding:8px 4px;font-size:13px;'+inpSt+'">'+
          '<option value="monatlich"'+(m==='monatlich'?' selected':'')+'>Monatl.</option>'+
          '<option value="einmalig"'+(m==='einmalig'?' selected':'')+'>Einmalig</option>'+
        '</select>'+
        '<button onclick="rpRemoveWeitere('+i+')" style="color:var(--red);font-size:18px;line-height:1;padding:0 2px;background:none;border:none;cursor:pointer;flex-shrink:0">×</button>'+
      '</div>'+
      taxRow+eaInfo+warn+
      '</div>';
  }).join('');
  // addEventListener statt inline oninput/onchange — inline Handler feuern nicht auf dynamisch erstellten Elementen
  el.querySelectorAll('.rp-w-name,.rp-w-amt,.rp-w-einmal,.rp-w-eigenb,.rp-w-steuersatz').forEach(function(inp){
    inp.addEventListener('input',rpQuickSave);
    inp.addEventListener('change',rpQuickSave);
  });
  el.querySelectorAll('.rp-w-age,.rp-w-type').forEach(function(inp){
    inp.addEventListener('change',rpQuickSave);
  });
  el.querySelectorAll('.rp-w-modus').forEach(function(sel,idx){
    sel.addEventListener('change',function(){ rpWeitereModusChange(idx,this.value); });
  });
  el.querySelectorAll('.rp-w-steuer').forEach(function(sel,idx){
    sel.addEventListener('change',function(){ rpWeitereSteuerwechsel(idx,this.value); });
  });
}

function rpSyncWeitereFromDOM(){
  document.querySelectorAll('.rp-w-row').forEach(function(row,i){
    if(!rpS.weitere[i])return;
    var w=rpS.weitere[i];
    w.name=(row.querySelector('.rp-w-name')||{value:''}).value;
    w.type=(row.querySelector('.rp-w-type')||{value:'privat'}).value;
    var modus=(row.querySelector('.rp-w-modus')||{value:'monatlich'}).value;
    w.modus=modus;
    var linked=(row.querySelector('.rp-w-linked-age')||{value:'1'}).value==='1';
    w.linkedRetAge=linked;
    if(!linked)w.startAge=parseInt((row.querySelector('.rp-w-age')||{value:'67'}).value)||67;
    if(modus==='einmalig'){
      w.einmalbetrag=parseFloat((row.querySelector('.rp-w-einmal')||{value:'0'}).value)||0;
      w.eigenbeitraege=parseFloat((row.querySelector('.rp-w-eigenb')||{value:'0'}).value)||0;
      w.steuermodell=(row.querySelector('.rp-w-steuer')||{value:'halbeinkuenfte'}).value;
      w.persSteuersatz=w.steuermodell==='steuerfrei'?0:(parseFloat((row.querySelector('.rp-w-steuersatz')||{value:'25'}).value)||25);
    }else{
      w.monthlyAmountAtStart=parseFloat((row.querySelector('.rp-w-amt')||{value:'0'}).value)||0;
    }
  });
}

function rpAddWeitere(){
  rpSyncWeitereFromDOM();
  var retAge=parseInt((document.getElementById('rp-retage')||{}).value||'')||63;
  rpS.weitere.push({name:'',modus:'monatlich',monthlyAmountAtStart:0,einmalbetrag:0,eigenbeitraege:0,steuermodell:'halbeinkuenfte',persSteuersatz:25,startAge:retAge,type:'privat',linkedRetAge:true});
  rpRenderWeitere();
  rpQuickSave();
}

function rpWeitereModusChange(i, val) {
  rpSyncWeitereFromDOM();
  rpS.weitere[i].modus = val;
  rpRenderWeitere();
}

function rpWeitereToggleAge(i) {
  rpSyncWeitereFromDOM();
  var retAge=parseInt((document.getElementById('rp-retage')||{}).value||'')||63;
  rpS.weitere[i].linkedRetAge = !rpS.weitere[i].linkedRetAge;
  if(rpS.weitere[i].linkedRetAge) rpS.weitere[i].startAge = retAge;
  rpRenderWeitere();
  rpQuickSave();
}

function rpWeitereSteuerwechsel(i, val) {
  rpSyncWeitereFromDOM();
  rpS.weitere[i].steuermodell = val;
  rpRenderWeitere();
  rpQuickSave();
}

function rpRuerupToggleAge() {
  var retAge=parseInt((document.getElementById('rp-retage')||{}).value||'')||63;
  rpS.ruerupLinkedAge = !rpS.ruerupLinkedAge;
  if(rpS.ruerupLinkedAge){
    document.getElementById('rp-ruerup-age').value = retAge;
    rpRuerupProject();
  }
  rpRuerupUpdateAgeBadge();
  rpQuickSave();
}

function rpRuerupUpdateAgeBadge() {
  var el=document.getElementById('rp-ruerup-age-lock');
  var inp=document.getElementById('rp-ruerup-age');
  if(!el) return;
  if(rpS.ruerupLinkedAge){
    el.style.background='var(--green,var(--green))';
    el.style.color='var(--on-accent)';
    el.title='Mit Rentenalter verknüpft — klicken zum Entkoppeln';
    if(inp){inp.disabled=true;inp.style.opacity='0.6';}
  } else {
    el.style.background='transparent';
    el.style.color='var(--tx3)';
    el.style.border='1px solid var(--brd)';
    el.title='Manuell — klicken zum Verknüpfen';
    if(inp){inp.disabled=false;inp.style.opacity='';}
  }
}

function rpRemoveWeitere(i){
  rpSyncWeitereFromDOM();
  rpS.weitere.splice(i,1);
  rpRenderWeitere();
  rpQuickSave();
}

// Sidebar-Sektionen Zustand
var rpSecState = {basis:true, rente:true, rendite:true, bav:false, ruerup:false, weitere:false, ausgaben:false, depot:false, kinder:false, erbe:false, abzuege:false};

function rpToggleMehr() {
  var sb = document.querySelector('#p-rente .rp-sidebar');
  var btn = document.getElementById('rp-mehr-btn');
  if (!sb || !btn) return;
  var on = sb.classList.toggle('erweitert');
  btn.textContent = on ? '－ Weitere Optionen ausblenden' : '＋ Weitere Optionen einblenden';
}

function rpToggleSec(key) {
  rpSecState[key] = !rpSecState[key];
  var body = document.getElementById('rp-sb-' + key);
  var arr  = document.getElementById('rp-sarr-' + key);
  if (body) body.style.display = rpSecState[key] ? 'block' : 'none';
  if (arr)  { arr.classList.toggle('open', rpSecState[key]); }
}

function rpQuickSave() {
  // Verknüpfte Alter auf aktuelles Rentenalter setzen, bevor DOM gelesen wird
  var _retAgeNow = parseInt((document.getElementById('rp-retage')||{}).value||'')||63;
  if(rpS.ruerupLinkedAge){
    var _ra=document.getElementById('rp-ruerup-age');
    if(_ra) _ra.value=_retAgeNow;
  }
  document.querySelectorAll('.rp-w-row').forEach(function(row){
    var linked=(row.querySelector('.rp-w-linked-age')||{value:'1'}).value==='1';
    if(linked){var ae=row.querySelector('.rp-w-age');if(ae)ae.value=_retAgeNow;}
  });
  var nfG = document.getElementById('rp-nf-gesetzlich').value.trim();
  var nfB = document.getElementById('rp-nf-betriebsrente').value.trim();
  var nfR = document.getElementById('rp-nf-ruerup').value.trim();
  // Ausgaben: read from the active slider (expenses or expenses2)
  var rawExp = document.getElementById('rp-expenses').value || document.getElementById('rp-expenses2').value;
  var ausgabenQuelle = (document.getElementById('rp-ausgaben-quelle')||{}).value||'auto';
  var expVal = parseFloat(rawExp)||null;
  // Erbimmobilie
  var erbEnabled = document.getElementById('rp-erbe-tgl') && document.getElementById('rp-erbe-tgl').classList.contains('on');
  var entnahmeStrat = (document.getElementById('rp-entnahme-strat')||{}).value||'luecke';
  FP.Store.Settings.updateRetirementProfile(rpS.person, {
    targetRetirementAge:        parseInt(document.getElementById('rp-retage').value) || 63,
    regularRetirementAge:       parseInt(document.getElementById('rp-regular-age').value) || 67,
    kvStatus:                   (document.getElementById('rp-kv-status')||{}).value||'gkv',
    gehaltsSteigerung:          parseFloat(document.getElementById('rp-gehaltssteig').value) || 2.0,
    monthlyExpenseInRetirement: ausgabenQuelle === 'manuell' ? (expVal||4000) : (expVal||null),
    ausgabenOverride:           ausgabenQuelle === 'manuell' ? (expVal||null) : null,
    epPerYearMode: (function(){
      var store=FP.Store.get();
      var prof=store.retirement&&store.retirement.profiles&&store.retirement.profiles[rpS.person];
      return (prof&&prof.epPerYearMode)||'auto';
    })(),
    gesetzlicheRente: {
      currentEntgeltpunkte:      parseFloat(document.getElementById('rp-punkte').value) || 0,
      dataDate:                  document.getElementById('rp-punkte-date').value.trim(),
      estimatedNewPointsPerYear: parseFloat(document.getElementById('rp-punkte-year').value) || 1.8,
      rentenwertWest:            parseFloat(document.getElementById('rp-rentenwert').value) || 40.79,
    },
    direktzusage: {
      monthlyAmountAtStart: parseFloat(document.getElementById('rp-direkt').value) || 0,
      employer:             document.getElementById('rp-direkt-ag').value.trim(),
    },
    ruerupRente: {
      monthlyAmountAtStart: parseFloat(document.getElementById('rp-ruerup').value) || 0,
      startAge:             parseInt(document.getElementById('rp-ruerup-age').value) || 67,
      currentValue:         parseFloat(document.getElementById('rp-ruerup-val').value) || 0,
      rentenfaktor:         parseFloat(document.getElementById('rp-ruerup-rf').value) || 0,
      autoCalc:             rpS.ruerupAutoCalc,
      linkedAge:            rpS.ruerupLinkedAge,
    },
    weitereRentenversicherungen: (function() {
      var rows = document.querySelectorAll('.rp-w-row');
      var arr = [];
      rows.forEach(function(row) {
        var modusEl = row.querySelector('.rp-w-modus');
        var modus = modusEl ? modusEl.value : 'monatlich';
        var name = (row.querySelector('.rp-w-name')||{value:''}).value.trim() || 'Weitere';
        var startAge = parseInt((row.querySelector('.rp-w-age')||{value:'67'}).value) || 67;
        var type = (row.querySelector('.rp-w-type')||{value:'privat'}).value || 'privat';
        var linkedRetAge = (row.querySelector('.rp-w-linked-age')||{value:'1'}).value === '1';
        startAge = linkedRetAge ? _retAgeNow : startAge;
        if (modus === 'einmalig') {
          var einmalbetrag = parseFloat((row.querySelector('.rp-w-einmal')||{value:'0'}).value) || 0;
          var stm = (row.querySelector('.rp-w-steuer')||{value:'halbeinkuenfte'}).value || 'halbeinkuenfte';
          if (einmalbetrag > 0 || name) arr.push({
            name, modus, startAge, type, linkedRetAge,
            einmalbetrag,
            eigenbeitraege: parseFloat((row.querySelector('.rp-w-eigenb')||{value:'0'}).value) || 0,
            steuermodell:   stm,
            persSteuersatz: stm === 'steuerfrei' ? 0 : (parseFloat((row.querySelector('.rp-w-steuersatz')||{value:'25'}).value) || 25),
            monthlyAmountAtStart: 0,
          });
        } else {
          var amt = parseFloat((row.querySelector('.rp-w-amt')||{value:'0'}).value) || 0;
          if (amt > 0 || name) arr.push({
            name, modus, startAge, type, linkedRetAge,
            monthlyAmountAtStart: amt,
            einmalbetrag: 0, eigenbeitraege: 0, steuermodell: 'halbeinkuenfte', persSteuersatz: 25,
          });
        }
      });
      return arr;
    })(),
    netFactorGesetzlich:    nfG !== '' ? parseFloat(nfG) : null,
    netFactorBetriebsrente: nfB !== '' ? parseFloat(nfB) : null,
    netFactorRuerup:        nfR !== '' ? parseFloat(nfR) : null,
    entnahmeStrategie:      entnahmeStrat,
    swrRate:                parseFloat(document.getElementById('rp-swr').value||'') || null,
    guardrails:             !!(document.getElementById('rp-guardrails')||{}).checked,
    entnahmeFest:           parseFloat(document.getElementById('rp-entnahme-fest').value||'') || 0,
    kinderKostenOverride:   parseFloat(document.getElementById('rp-k-kosten').value||'') || null,
    kinderDauerOverride:    parseInt(document.getElementById('rp-k-dauer').value||'') || null,
    erbimmobilie: {
      enabled:   erbEnabled,
      inJahren:  parseInt((document.getElementById('rp-erbe-jahre')||{}).value||'') || 15,
      wert:      parseFloat((document.getElementById('rp-erbe-wert')||{}).value||'') || 250000,
      modus:     (document.getElementById('rp-erbe-modus')||{}).value || 'verkauf',
      miete:     parseFloat((document.getElementById('rp-erbe-miete')||{}).value||'') || 900,
    },
  });
  // Ergebnisse sofort neu berechnen
  rpRenderMain();
}

/* ── KV-Zusatzbeitrag speichern ── */
function rpSaveKvZusatz(val){
  var v=parseFloat(val)||2.99;
  var s=FP.Store.get();
  if(!s.retirement)s.retirement={};
  if(!s.retirement.assumptions)s.retirement.assumptions={};
  s.retirement.assumptions.kvZusatzbeitrag=v;
  FP.Store.save();
  var anzeige=document.getElementById('rp-kv-satz-anzeige');
  if(anzeige)anzeige.textContent=((14.6+v)/2).toFixed(2).replace('.',',');
  rpRenderMain();
}

/* ── EP/Jahr Auto-Berechnung aus Gehaltsdaten ── */
function rpCalcEpPerYear(personId){
  var store=FP.Store.get();
  var a=store.retirement&&store.retirement.assumptions||{};
  var durchschnitt=a.durchschnittsentgelt||45538;
  var bbg=a.bbgRvJahr||96600;
  var salData=(store.salary&&store.salary[personId])||{};
  var keys=Object.keys(salData).sort(function(a,b){
    var pa=a.split('.'),pb=b.split('.');
    return (parseInt(pa[1])*100+parseInt(pa[0]))-(parseInt(pb[1])*100+parseInt(pb[0]));
  });
  if(!keys.length)return null;
  // Letzte 12 Monate
  var last12=keys.slice(-12);
  var totalGross=last12.reduce(function(s,k){return s+(salData[k].grossSalary||0);},0);
  if(!totalGross)return null;
  var annualGross=totalGross*(12/last12.length);
  var rvGross=Math.min(annualGross,bbg);
  return Math.round(rvGross/durchschnitt*100)/100;
}

function rpSetEpMode(mode){
  var store=FP.Store.get();
  var profile=store.retirement&&store.retirement.profiles&&store.retirement.profiles[rpS.person];
  if(!profile)return;
  profile.epPerYearMode=mode;
  FP.Store.save();
  rpUpdateEpYearUI(rpS.person);
  rpRenderMain();
}

function rpSyncSliderNd(val){
  var inp=document.getElementById('rp-punkte-year');
  var sv=document.getElementById('rp-punkte-year-sv');
  if(inp)inp.value=val;
  if(sv)sv.textContent=parseFloat(val).toFixed(2);
}

function rpUpdateEpYearUI(personId){
  var store=FP.Store.get();
  var profile=store.retirement&&store.retirement.profiles&&store.retirement.profiles[personId]||{};
  var mode=profile.epPerYearMode||'auto';
  var autoVal=rpCalcEpPerYear(personId);
  var hasData=autoVal!==null;

  var elAuto=document.getElementById('rp-py-auto');
  var elManual=document.getElementById('rp-py-manual');
  var elNoData=document.getElementById('rp-py-nodata');
  var elSv=document.getElementById('rp-punkte-year-sv');
  var elHidden=document.getElementById('rp-punkte-year');

  // Alle verstecken
  if(elAuto)elAuto.style.display='none';
  if(elManual)elManual.style.display='none';
  if(elNoData)elNoData.style.display='none';

  if(!hasData){
    // Kein Gehalt: immer manueller Slider (rp-py-nodata)
    if(elNoData)elNoData.style.display='block';
    var ndSlider=document.getElementById('rp-punkte-year-sl-nd');
    var curVal=profile.estimatedNewPointsPerYear||1.8;
    if(ndSlider)ndSlider.value=curVal;
    if(elHidden)elHidden.value=curVal;
    if(elSv)elSv.textContent=curVal.toFixed(2);
  } else if(mode==='auto'||!mode){
    // Auto-Modus: Info-Box zeigen
    if(elAuto){elAuto.style.display='flex';}
    var autoEl=document.getElementById('rp-py-auto-val');
    if(autoEl)autoEl.textContent=autoVal.toFixed(2)+' EP/Jahr';
    if(elSv)elSv.textContent='';
    if(elHidden)elHidden.value=autoVal;
  } else {
    // Manuell-Modus: Slider zeigen
    if(elManual)elManual.style.display='block';
    var manVal=profile.estimatedNewPointsPerYear||autoVal||1.8;
    var sl=document.getElementById('rp-punkte-year-sl');
    if(sl)sl.value=manVal;
    if(elHidden)elHidden.value=manVal;
    if(elSv)elSv.textContent=manVal.toFixed(2);
    rpSyncSlider('punkte-year');
  }
}

function rpSaveFvGrenze(val){
  var v=parseFloat(val)||505;
  var s=FP.Store.get();
  if(!s.retirement)s.retirement={};
  if(!s.retirement.assumptions)s.retirement.assumptions={};
  s.retirement.assumptions.familienversicherungGrenze=v;
  FP.Store.save();
  rpRenderMain();
}

function rpSaveGkvMindest(val){
  var v=parseFloat(val)||1131.67;
  var s=FP.Store.get();
  if(!s.retirement)s.retirement={};
  if(!s.retirement.assumptions)s.retirement.assumptions={};
  s.retirement.assumptions.gkvMindestBmg=v;
  FP.Store.save();
  rpRenderMain();
}

/* ── Helper: Ausgaben 12-Monats-Avg ── */
function rpCalcAusgabenAvg() {
  var store=FP.Store.get();
  var now=new Date();
  var total=0,months=0;
  for(var mi=0;mi<12;mi++){
    var d=new Date(now.getFullYear(),now.getMonth()-mi,1);
    var ds=String(d.getMonth()+1).padStart(2,'0')+'.'+d.getFullYear();
    var monthTotal=0;
    store.transactions.forEach(function(tx){if(tx.date===ds)monthTotal+=tx.amount;});
    if(monthTotal!==0){total+=monthTotal;months++;}
  }
  return months>0?Math.round(Math.max(0,total)/months):0;
}

/* ── Sidebar: live info updaten ohne full re-render ── */
function rpUpdateSidebarLiveInfo() {
  // Ausgaben-Avg Info
  var avg=rpCalcAusgabenAvg();
  var info=document.getElementById('rp-ausgaben-avg-info');
  if(info) info.textContent='Ø letzte 12 Monate aus Transaktionen: '+eur(avg)+'/Monat';
  // Depot live info — nach aktiver Person gefiltert (gleiche Logik wie calcRente)
  var NICHT_DEPOT_LI=['immobilie','sonstiges'];
  var personId=rpS.person||'person_1';
  var depot=FP.Calculator.getAssetSummary();
  var depotVal=depot.items
    .filter(function(i){return!NICHT_DEPOT_LI.includes(i.type);})
    .filter(function(i){return(i.ownerId||'person_1')===personId||i.ownerId==='joint';})
    .reduce(function(s,i){return s+(i.ownerId==='joint'?i.value*0.5:i.value);},0);
  var _spNow=new Date();
  var store=FP.Store.get();
  var sp=((store.savingsPlans||[])
    .filter(function(s){return(s.personId||'person_1')===personId;})
    .filter(function(s){return!s.validUntil||new Date(s.validUntil)>_spNow;}).reduce(function(s,p){return s+p.monthlyAmount;},0))
    +(store.assets||[]).filter(function(a){return a.status==='aktiv'&&a.monthlyPlan>0;})
      .filter(function(a){return(a.ownerId||'person_1')===personId||a.ownerId==='joint';})
      .reduce(function(s,a){return s+a.monthlyPlan*(a.ownerId==='joint'?0.5:1);},0);
  var depInfo=document.getElementById('rp-depot-live-info');
  if(depInfo) depInfo.textContent='Depot heute: '+eur(depotVal)+' · Sparrate: '+eur(sp)+'/Mo';
  var hdrInfo=document.getElementById('rp-depot-hdr-info');
  if(hdrInfo) hdrInfo.textContent=sp>0?eur(sp)+'/Mo':'';
  // Kinder info
  var kSet=FP.Store.get().settings?.kinder||{};
  var kInfo=document.getElementById('rp-kinder-info');
  if(kInfo){
    if(!kSet.anzahl){kInfo.textContent='Keine Kinder erfasst. Stammdaten → Einstellungen.';}
    else {
      var kids=[];
      if(kSet.anzahl>=1&&kSet.kind1Alter)kids.push('Kind 1: '+kSet.kind1Alter+' J.');
      if(kSet.anzahl>=2&&kSet.kind2Alter)kids.push('Kind 2: '+kSet.kind2Alter+' J.');
      if(kSet.anzahl>=3&&kSet.kind3Alter)kids.push('Kind 3: '+kSet.kind3Alter+' J.');
      kInfo.textContent=kids.join(' · ')||kSet.anzahl+' Kind(er) — Alter bitte in Einstellungen eintragen';
    }
  }
}

/* ── Toggle Entnahme-Felder je Strategie ── */
function rpToggleEntnahmeFields(strat) {
  var swrF=document.getElementById('rp-swr-field');
  var festF=document.getElementById('rp-fest-field');
  if(swrF) swrF.style.display=strat==='swr'?'block':'none';
  if(festF) festF.style.display=strat==='fest'?'block':'none';
}
function rpOnAusgabenQuelle() {
  var q=(document.getElementById('rp-ausgaben-quelle')||{}).value||'auto';
  if(q==='auto'){var avg=rpCalcAusgabenAvg();if(avg){document.getElementById('rp-expenses2').value=avg;document.getElementById('rp-expenses').value=avg;var sl2=document.getElementById('rp-expenses-sl2');if(sl2)sl2.value=avg;var sv2=document.getElementById('rp-expenses-sv2');if(sv2)sv2.textContent=avg.toLocaleString('de-DE')+' €';}}
  rpQuickSave();
}
function rpToggleErbe() {
  var tgl=document.getElementById('rp-erbe-tgl');
  tgl.classList.toggle('on');
  document.getElementById('rp-erbe-fields').style.display=tgl.classList.contains('on')?'block':'none';
  rpQuickSave();
}
function rpToggleErbeFields() {
  var modus=(document.getElementById('rp-erbe-modus')||{}).value||'verkauf';
  var f=document.getElementById('rp-erbe-miete-field');
  if(f) f.style.display=modus==='miete'?'block':'none';
}

/* ── Validierung: Warnungen sammeln ── */
function rpCollectWarnings(r, skipDepot) {
  if (!r) return [];
  var w = [];
  if (!r.punkteBeiRente || r.punkteBeiRente <= 0)
    w.push('Rentenpunkte sind 0 — gesetzliche Rente wird mit 0 € berechnet. Werte aus der Renteninformation eintragen.');
  if (!r.ausgaben || r.ausgaben <= 0)
    w.push('Ausgaben/Monat sind 0 — Rentenlücke kann nicht berechnet werden.');
  if (r.yearsToRetire < 0)
    w.push('Renteneintrittsalter liegt in der Vergangenheit (Alter ' + r.targetRetirementAge + ').');
  if (r.targetRetirementAge < 63)
    w.push('Hinweis: Gesetzliche Rente (GRV) kann frühestens ab 63 bezogen werden (45 Beitragsjahre vorausgesetzt). Bei Alter ' + r.targetRetirementAge + ' wird die GRV-Auszahlung in der Berechnung trotzdem ab diesem Alter angesetzt — das dient der Planung (z.B. Frühpension, Beamte, private Rente), entspricht aber nicht dem gesetzlichen GRV-Bezug.');
  if (!skipDepot && r.depotStart <= 0 && r.monthlySavings <= 0)
    w.push('Kein Depot und kein Sparplan erfasst — Depot bei Rente wird als 0 € berechnet.');
  if (r.kvLueckeJahre > 0 && r.kvLueckeStatus === 'freiwillig')
    w.push('KV-Lücke: ' + r.kvLueckeJahre + ' Jahre freiwillige GKV geschätzt (~' + eur(r.kvFreiwilligKosten) + '/Mo). Gewinnanteil der Entnahme (~' + eur(r.kvGainMonatlich) + '/Mo) überschreitet die Familienversicherungsgrenze (505 €/Mo).');
  if (r.kvLueckeJahre > 0 && r.kvStatus === 'pkv')
    w.push('PKV: ' + r.kvLueckeJahre + ' Jahre PKV-Beitrag im Ruhestand — Kosten bitte in den monatlichen Ausgaben erfassen.');
  return w;
}

/* ── KPI Cards ── */
function rpRenderKpi(r1,r2,store) {
  var el=document.getElementById('rp-kpi-grid');
  if(!el)return;
  var partnerOn=store.settings.partnerEnabled;
  // Use the sidebar person as primary if not partner mode
  var r=partnerOn?r1:(r1);
  if(!r){el.innerHTML='';return;}
  // Warnungen
  var warnings = rpCollectWarnings(r1, false);
  if (partnerOn && r2) rpCollectWarnings(r2, true).forEach(function(w){ if(warnings.indexOf(w)<0) warnings.push(w); });
  if (partnerOn) {
    var p2 = store.persons.find(function(p){return p.id==='person_2';});
    if (!p2 || !p2.birthDate) warnings.push('Partner aktiv, aber kein Geburtsdatum für Person 2 eingetragen (Einstellungen → Stammdaten).');
  }
  var warnHtml = warnings.length ? '<div style="grid-column:1/-1;background:var(--amber-lt,var(--amber-lt));border:1px solid var(--amber,var(--amber));border-radius:10px;padding:10px 14px;font-size:12px;color:var(--amber,var(--amber));line-height:1.6;margin-bottom:4px">'+
    '⚠️ '+warnings.join('<br>⚠️ ')+'</div>' : '';
  // Haushalt-Werte
  var hhEink=(r1?r1.gesamtEinkommen:0)+(r2?r2.gesamtEinkommen:0)+(r1&&r1.erbMieteMonatlich?r1.erbMieteMonatlich:0)+(r2&&r2.erbMieteMonatlich?r2.erbMieteMonatlich:0);
  var hhAusg=(r1?r1.ausgaben:0)+(r2&&r2.ausgaben&&partnerOn?r2.ausgaben:0);
  var hhDepot=(r1?r1.depotAtRetire:0)+(r2&&partnerOn?r2.depotAtRetire:0);
  var hhLuecke=Math.max(0,hhAusg-(hhEink+(r1?r1.entnahmeMonatlich:0)+(r2&&partnerOn?r2.entnahmeMonatlich:0)));
  var depJahre=r1?r1.depotJahre:0;
  var yearsNote=!partnerOn?'Rente ab '+r.targetRetirementAge+' · '+Math.max(0,r.yearsToRetire)+' Jahre':
    'P1 ab '+r1.targetRetirementAge+(r2?' · P2 ab '+r2.targetRetirementAge:'');
  var cards=[
    {lbl:'Rentenlücke',val:hhLuecke>0?eur(hhLuecke):'Kein Defizit',sub:hhLuecke>0?'nach Entnahme':'Einkommen reicht',cls:(hhLuecke>0?'luecke':'ok')+' primary'},
    {lbl:'Depot bei Rente',val:eur(hhDepot),sub:partnerOn?'P1+P2':'ab Alter '+r.targetRetirementAge,cls:'primary'},
    {lbl:'Depot reicht',val:(r1&&!r1.hatLuecke)?'∞':depJahre>=60?'60+ J.':depJahre>0?depJahre.toFixed(0)+' J.':'< 1 J.',sub:(r1&&!r1.hatLuecke)?'Kein Depot-Verzehr nötig':depJahre>0&&depJahre<10?'⚠️ < 10 Jahre':yearsNote,cls:((r1&&!r1.hatLuecke)||depJahre>=20?'ok':(depJahre>0?'luecke':''))+' primary'},
    {lbl:'Renteneinkommen (Netto)',val:eur(partnerOn?hhEink:r.gesamtEinkommen+r.erbMieteMonatlich),sub:'Brutto: '+eur(partnerOn?(r1?r1.gesamtBrutto:0)+(r2?r2.gesamtBrutto:0):r.gesamtBrutto),cls:''},
    {lbl:'Ausgaben/Mo',val:eur(partnerOn?hhAusg:r.ausgaben),sub:partnerOn?'Beide':'Ruhestand',cls:''},
  ];
  el.innerHTML=warnHtml+cards.map(function(c){
    return '<div class="rp-kpi '+c.cls+'"><div class="rp-kpi-lbl">'+c.lbl+'</div><div class="rp-kpi-val">'+c.val+'</div><div class="rp-kpi-sub">'+c.sub+'</div></div>';
  }).join('');
}

/* ── Tabs ── */
var rpActiveTab='verlauf';
function rpRenderTabs(r1,r2,store) {
  var store=store||FP.Store.get();
  var partnerOn=store.settings.partnerEnabled;
  var tabBar=document.getElementById('rp-tabs');
  var tabContent=document.getElementById('rp-tc');
  if(!tabBar||!tabContent)return;
  var tabs=[{id:'verlauf',lbl:'📊 Verlauf'},{id:'stichtag',lbl:'📅 Stichtag'},{id:'rente',lbl:'🏛️ Rente'}];
  if(partnerOn) tabs.push({id:'haushalt',lbl:'👨‍👩‍👧 Haushalt'});
  if(!partnerOn && rpActiveTab==='haushalt') rpActiveTab='verlauf';
  tabBar.innerHTML=tabs.map(function(t){
    return '<button class="rp-tab'+(t.id===rpActiveTab?' act':'')+'" onclick="rpSelectTab(\''+t.id+'\')" >'+t.lbl+'</button>';
  }).join('');
  if(rpActiveTab==='verlauf')       rpRenderTabVerlauf(r1,r2,store,tabContent);
  else if(rpActiveTab==='stichtag') rpRenderTabStichtag(r1,r2,store,tabContent);
  else if(rpActiveTab==='rente')    rpRenderTabRente(r1,r2,store,tabContent);
  else if(rpActiveTab==='haushalt') rpRenderTabHaushalt(r1,r2,store,tabContent);
}
function rpSelectTab(id){rpActiveTab=id;rpRenderMain();}

/* ── Tab: Verlauf + Entnahme (zusammengeführt) ── */
var rpVerlaufHov=-1;
function rpRenderTabVerlauf(r1,r2,store,el) {
  if(!r1){el.innerHTML='<div style="padding:20px;color:var(--tx3);font-size:13px">Kein Profil vorhanden.</div>';return;}
  var r=(rpS.person==='person_2'&&r2)?r2:r1;
  var rOther=(rpS.person==='person_2')?r1:(r2||null);
  var data=r.verlaufData||[];
  if(!data.length){el.innerHTML='<div style="padding:20px;color:var(--tx3);font-size:13px">Keine Daten.</div>';return;}
  var retAge=r.retirementAge||r.targetRetirementAge;
  var partnerOn=store.settings.partnerEnabled;
  var ret2Age=(partnerOn&&rOther)?(rOther.retirementAge||rOther.targetRetirementAge):null;
  var ep=r.entnahmePlan||[];
  var hasGuardrail=ep.some(function(w){return w.guardrailAktiv;});
  // Ausbildungsphasen berechnen
  var kSet=store.settings&&store.settings.kinder||{};
  var kinderAnzahl=kSet.anzahl||0;
  var kinderAlterArr=[kSet.kind1Alter||0,kSet.kind2Alter||0,kSet.kind3Alter||0].slice(0,kinderAnzahl);
  var kDauer=kSet.ausbildungDauer||4;
  var curAge=r.currentAge||40;
  var ausbildungPeriods=kinderAlterArr.map(function(ca){
    var start=curAge+(18-ca);
    return{start:start,end:start+kDauer};
  }).filter(function(p){return p.end>curAge;});
  var stratLbl=r.entnahmeStrat==='luecke'?'Rentenlücke':r.entnahmeStrat==='swr'?(r.swrRate+'% SWR'+(r.guardrails?' + Guardrails':'')):('Fest '+eur(r.entnahmeMonatlich));
  var tableRows=ep.slice(0,30).map(function(w){
    var grIco=w.guardrailAktiv?' <span style="font-size:10px;color:var(--amber)" title="Guardrail">⚠</span>':'';
    return '<tr class="'+(w.alter===retAge?'hl':'')+'"><td>'+w.alter+'</td><td>'+eur(w.depot)+'</td><td style="color:var(--red)">'+eur(w.entnahme)+grIco+'</td><td style="color:var(--green)">'+eur(w.rendite)+'</td></tr>';
  }).join('');
  var pName=rpPersonName(rpS.person||'person_1',store);
  var oName=rpPersonName(rpS.person==='person_2'?'person_1':'person_2',store);
  // Legende
  var legendHtml='<div style="display:flex;gap:14px;flex-wrap:wrap;margin:8px 0 14px;font-size:11px;color:var(--tx3)">'+
    '<span><span style="display:inline-block;width:12px;height:3px;background:var(--blue);border-radius:2px;vertical-align:middle;margin-right:4px"></span>Ansparphase</span>'+
    '<span><span style="display:inline-block;width:12px;height:3px;background:var(--amber);border-radius:2px;vertical-align:middle;margin-right:4px"></span>Entnahmephase</span>'+
    '<span><span style="display:inline-block;width:12px;height:3px;border-top:2px dashed var(--red);vertical-align:middle;margin-right:4px"></span>Worst-Case (−30%)</span>'+
    '<span><span style="display:inline-block;width:2px;height:12px;background:var(--red);vertical-align:middle;margin-right:4px;opacity:.7"></span>'+pName+' ab '+retAge+'</span>'+
    (ret2Age?'<span><span style="display:inline-block;width:2px;height:12px;background:var(--green);vertical-align:middle;margin-right:4px;opacity:.7"></span>'+oName+' ab '+ret2Age+'</span>':'')+
    (ausbildungPeriods.length?'<span><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:rgba(124,58,237,0.25);border:1px solid var(--purple);vertical-align:middle;margin-right:4px"></span>Ausbildung</span>':'')+
  '</div>';
  el.innerHTML=
    '<div class="rp-chart-wrap"><canvas id="rp-verlauf-canvas" style="display:block;width:100%;cursor:crosshair"></canvas></div>'+
    legendHtml+
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:8px">'+
      '<div class="rp-rc"><div class="rp-rc-title">Entnahme/Mo</div><div style="font-size:20px;font-weight:800;font-family:var(--mono);color:var(--blue)">'+eur(r.entnahmeMonatlich)+'</div><div style="font-size:11px;color:var(--tx3)">'+stratLbl+'</div></div>'+
      '<div class="rp-rc"><div class="rp-rc-title">Depot bei Rente</div><div style="font-size:20px;font-weight:800;font-family:var(--mono)">'+eur(r.depotAtRetire)+'</div><div style="font-size:11px;color:var(--tx3)">Kinder-Abzug: '+eur(r.kinderGesamtkosten)+'</div></div>'+
      '<div class="rp-rc"><div class="rp-rc-title">Depot reicht</div><div style="font-size:20px;font-weight:800;font-family:var(--mono);color:'+(!r.hatLuecke?'var(--green)':r.depotJahre>=20?'var(--green)':'var(--amber)')+'">'+(!r.hatLuecke?'∞':r.depotJahre>=60?'60+ J.':r.depotJahre>0?r.depotJahre.toFixed(0)+' J.':'< 1 J.')+'</div><div style="font-size:11px;color:var(--tx3)">'+(!r.hatLuecke?'Kein Depot-Verzehr nötig':'ab Alter '+retAge)+'</div>'+(r.wcDepotJahre>0?'<div style="font-size:10px;color:var(--red);margin-top:2px">Worst-Case: '+(r.wcDepotJahre>=60?'60+ J.':r.wcDepotJahre.toFixed(0)+' J.')+' (−30% Schock)</div>':'')+'</div>'+
    '</div>'+
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px">'+
      '<div class="rp-rc" style="padding:10px 12px"><div class="rp-rc-title" style="font-size:10px">Depot heute</div><div style="font-size:15px;font-weight:700;font-family:var(--mono)">'+eur(r.depotStart)+'</div></div>'+
      '<div class="rp-rc" style="padding:10px 12px"><div class="rp-rc-title" style="font-size:10px">Sparrate/Mo</div><div style="font-size:15px;font-weight:700;font-family:var(--mono);color:var(--blue)">'+eur(r.monthlySavings)+'</div></div>'+
      '<div class="rp-rc" style="padding:10px 12px"><div class="rp-rc-title" style="font-size:10px">Ø Rendite</div><div style="font-size:15px;font-weight:700;font-family:var(--mono)">'+r.weightedReturn.toFixed(1)+'%</div></div>'+
    '</div>'+
    (hasGuardrail?'<div style="font-size:11px;color:var(--amber);margin-bottom:8px;padding:6px 10px;background:var(--surf2);border-radius:8px">⚠ Guardrail hat angesprochen: Entnahme wurde in markierten Jahren auf 90% reduziert</div>':'')+
    '<table class="rp-dt"><thead><tr><th style="text-align:left">Alter</th><th>Depot</th><th>Entnahme/J.</th><th>Rendite</th></tr></thead><tbody>'+tableRows+'</tbody></table>'+
    '<div style="margin-top:10px;padding:8px 12px;background:var(--surf2);border-radius:8px;font-size:11px;color:var(--tx3);line-height:1.5">'+
    '<strong style="color:var(--tx2)">Hinweis: Rendite-Reihenfolge (Sequence-of-Returns)</strong> — Diese Tabelle rechnet mit gleichmäßiger Jahresrendite. In der Realität können starke Verluste in den ersten Rentenjahren das Depot dauerhaft belasten.'+
    '</div>';
  rpVerlaufHov=-1;
  requestAnimationFrame(function(){
    var cv=document.getElementById('rp-verlauf-canvas');
    if(!cv)return;
    var wcData=r.wcVerlauf||[];
    rpDrawVerlaufChart(cv,data,retAge,-1,ausbildungPeriods,ep,ret2Age,wcData);
    var PAD_L=62,PAD_R=16;
    cv.onmousemove=function(e){
      var rect=cv.getBoundingClientRect(),mx=e.clientX-rect.left;
      var cW=rect.width-PAD_L-PAD_R;
      var minA=data[0].alter,rng=(data[data.length-1].alter-minA)||1;
      var best=-1,bd=1e9;
      data.forEach(function(d,i){
        var dx=Math.abs(mx-(PAD_L+(d.alter-minA)/rng*cW));
        if(dx<bd){bd=dx;best=i;}
      });
      if(best!==rpVerlaufHov){rpVerlaufHov=best;rpDrawVerlaufChart(cv,data,retAge,rpVerlaufHov,ausbildungPeriods,ep,ret2Age,wcData);}
    };
    cv.onmouseleave=function(){rpVerlaufHov=-1;rpDrawVerlaufChart(cv,data,retAge,-1,ausbildungPeriods,ep,ret2Age,wcData);};
  });
}
function rpDrawVerlaufChart(canvas,data,retAge,hovIdx,ausbildungPeriods,entnahmePlan,ret2Age,wcData) {
  if(!canvas||!data.length)return;
  var cs=getComputedStyle(document.documentElement);
  var cTx3=cs.getPropertyValue('--tx3').trim()||'#AEAEB2';
  var cBrd=cs.getPropertyValue('--brd').trim()||'#E5E5EA';
  var cBlue=cs.getPropertyValue('--blue').trim()||'oklch(55% 0.24 262)';
  var cAmber=cs.getPropertyValue('--amber').trim()||'oklch(75% 0.2 75)';
  var cPurple=cs.getPropertyValue('--purple').trim()||'oklch(57% 0.22 295)';
  var dpr=window.devicePixelRatio||1;
  var W=canvas.getBoundingClientRect().width||canvas.offsetWidth||500;
  var H=250;
  canvas.width=W*dpr;canvas.height=H*dpr;
  canvas.style.width=W+'px';canvas.style.height=H+'px';
  var ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);ctx.clearRect(0,0,W,H);
  var PAD={t:16,r:16,b:32,l:62};
  var cW=W-PAD.l-PAD.r,cH=H-PAD.t-PAD.b;
  var maxDepot=Math.max.apply(null,data.map(function(d){return d.depot;}));
  if(!maxDepot)maxDepot=1;
  var maxY=Math.ceil(maxDepot/100000)*100000*1.1;
  var minAlter=data[0].alter,maxAlter=data[data.length-1].alter;
  var alterRange=maxAlter-minAlter||1;
  function toX(alter){return PAD.l+(alter-minAlter)/alterRange*cW;}
  function toY(v){return PAD.t+cH-(v/maxY)*cH;}
  // Ausbildungs-Bänder (vor Gitter, damit alles drüber liegt)
  if(ausbildungPeriods&&ausbildungPeriods.length){
    ausbildungPeriods.forEach(function(p){
      if(p.end<=minAlter||p.start>=maxAlter)return;
      var x1=toX(Math.max(p.start,minAlter));
      var x2=toX(Math.min(p.end,maxAlter));
      ctx.fillStyle='rgba(124,58,237,0.09)';
      ctx.fillRect(x1,PAD.t,x2-x1,cH);
      ctx.strokeStyle='rgba(124,58,237,0.3)';ctx.lineWidth=1;ctx.setLineDash([3,3]);
      ctx.beginPath();ctx.moveTo(x1,PAD.t);ctx.lineTo(x1,PAD.t+cH);ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle=cPurple;ctx.font='bold 10px Inter,system-ui,sans-serif';ctx.textAlign='center';
      ctx.fillText('Ausb.',(x1+x2)/2,PAD.t+cH-5);
    });
  }
  // Gitter
  [0,0.25,0.5,0.75,1].forEach(function(s){
    var v=maxY*s,y=toY(v);
    ctx.strokeStyle=cBrd;ctx.lineWidth=0.5;
    ctx.beginPath();ctx.moveTo(PAD.l,y);ctx.lineTo(PAD.l+cW,y);ctx.stroke();
    ctx.fillStyle=cTx3;ctx.font='11px Inter,system-ui,sans-serif';ctx.textAlign='right';
    ctx.fillText(v>=1e6?(v/1e6).toFixed(1)+'M':v>=1e3?(v/1e3).toFixed(0)+'K':'0',PAD.l-5,y+4);
  });
  // X-Achse
  for(var a=Math.ceil(minAlter/5)*5;a<=maxAlter;a+=5){
    var x=toX(a);
    ctx.fillStyle=cTx3;ctx.font='11px Inter,system-ui,sans-serif';ctx.textAlign='center';
    ctx.fillText(a,x,H-PAD.b+14);
    ctx.strokeStyle=cBrd;ctx.lineWidth=0.5;
    ctx.beginPath();ctx.moveTo(x,PAD.t);ctx.lineTo(x,PAD.t+cH);ctx.stroke();
  }
  // Renteneintritts-Linien P1 + P2
  function drawRetLine(age, color, labelY) {
    if(age==null||age<minAlter||age>maxAlter)return;
    var rx=toX(age);
    ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.setLineDash([4,3]);
    ctx.beginPath();ctx.moveTo(rx,PAD.t);ctx.lineTo(rx,PAD.t+cH);ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle=color;ctx.font='bold 11px Inter,system-ui,sans-serif';ctx.textAlign='center';
    ctx.fillText(''+age,rx,labelY);
  }
  var _csRp=getComputedStyle(document.documentElement);
  drawRetLine(retAge,_csRp.getPropertyValue('--red').trim()||'oklch(57% 0.24 22)',PAD.t+10);
  drawRetLine(ret2Age,_csRp.getPropertyValue('--green').trim()||'oklch(57% 0.2 295)',PAD.t+22);
  // Fills + Linien
  var anspar=data.filter(function(d){return d.alter<=retAge;});
  var entn=data.filter(function(d){return d.alter>=retAge;});
  if(anspar.length>=2){
    ctx.beginPath();
    anspar.forEach(function(d,i){i===0?ctx.moveTo(toX(d.alter),toY(d.depot)):ctx.lineTo(toX(d.alter),toY(d.depot));});
    ctx.lineTo(toX(anspar[anspar.length-1].alter),toY(0));ctx.lineTo(toX(anspar[0].alter),toY(0));ctx.closePath();
    ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--blue-lt').trim()||'oklch(95% 0.048 268)';ctx.fill();
  }
  if(entn.length>=2){
    ctx.beginPath();
    entn.forEach(function(d,i){i===0?ctx.moveTo(toX(d.alter),toY(d.depot)):ctx.lineTo(toX(d.alter),toY(d.depot));});
    ctx.lineTo(toX(entn[entn.length-1].alter),toY(0));ctx.lineTo(toX(entn[0].alter),toY(0));ctx.closePath();
    ctx.fillStyle='rgba(245,158,11,0.10)';ctx.fill();
  }
  function drawLine(pts,color){
    if(pts.length<2)return;
    ctx.setLineDash([]);ctx.strokeStyle=color;ctx.lineWidth=2.5;ctx.lineJoin='round';
    ctx.beginPath();
    pts.forEach(function(d,i){var x=toX(d.alter),y=toY(d.depot);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
    ctx.stroke();
  }
  drawLine(anspar,cBlue);
  drawLine(entn,cAmber);
  // Worst-Case-Linie: gestrichelt rot, nur Entnahmephase
  if(wcData&&wcData.length>=2){
    var cRed=getComputedStyle(document.documentElement).getPropertyValue('--red').trim()||'oklch(57% 0.24 22)';
    ctx.setLineDash([5,4]);ctx.strokeStyle=cRed;ctx.lineWidth=1.8;ctx.lineJoin='round';
    ctx.beginPath();
    wcData.forEach(function(d,i){
      if(d.alter<minAlter||d.alter>maxAlter)return;
      var x=toX(d.alter),y=toY(d.depot);
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    });
    ctx.stroke();ctx.setLineDash([]);
  }
  // Hover-Crosshair + Tooltip
  if(hovIdx>=0&&data[hovIdx]){
    var hd=data[hovIdx];
    var hx=toX(hd.alter),hy=toY(hd.depot);
    ctx.strokeStyle='rgba(100,100,100,0.4)';ctx.lineWidth=1;ctx.setLineDash([3,3]);
    ctx.beginPath();ctx.moveTo(hx,PAD.t);ctx.lineTo(hx,PAD.t+cH);ctx.stroke();
    ctx.beginPath();ctx.moveTo(PAD.l,hy);ctx.lineTo(PAD.l+cW,hy);ctx.stroke();
    ctx.setLineDash([]);
    var ptColor=hd.alter<=retAge?cBlue:cAmber;
    ctx.fillStyle=ptColor;ctx.beginPath();ctx.arc(hx,hy,5,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(hx,hy,5,0,Math.PI*2);ctx.stroke();
    var depotStr=hd.depot>=1e6?(hd.depot/1e6).toFixed(2)+' M €':hd.depot>=1e3?(hd.depot/1000).toFixed(0)+' K €':'0 €';
    var line1='Alter '+hd.alter+(hd.alter===retAge?' 🎯':'');
    var line2=depotStr;
    var line3='';
    if(entnahmePlan&&hd.alter>=retAge){
      var ep=entnahmePlan.find(function(e){return e.alter===hd.alter;});
      if(ep&&ep.entnahme>0)line3='Entnahme: '+eur(ep.entnahme/12)+'/Mo';
    }
    ctx.font='bold 12px Inter,system-ui,sans-serif';
    var tw=Math.max(ctx.measureText(line1).width,ctx.measureText(line2).width,line3?ctx.measureText(line3).width:0);
    var tp=8,th=line3?62:44,tx=hx+14,ty=PAD.t+8;
    if(tx+tw+tp*2>W-4)tx=hx-tw-tp*2-14;
    if(ty+th>PAD.t+cH)ty=PAD.t+cH-th-4;
    ctx.fillStyle='rgba(28,28,30,0.88)';
    ctx.beginPath();ctx.rect(tx-tp,ty-tp,tw+tp*2,th);ctx.fill();
    ctx.fillStyle='#fff';ctx.textAlign='left';
    ctx.fillText(line1,tx,ty+12);
    ctx.font='12px Inter,system-ui,sans-serif';ctx.fillStyle='rgba(255,255,255,0.75)';
    ctx.fillText(line2,tx,ty+30);
    if(line3)ctx.fillText(line3,tx,ty+48);
  }
}

/* ── Bar Chart: Stichtag ── */
var rpStichtagHov=-1;
function rpDrawStichtagChart(canvas,rows,retAge,hovIdx){
  if(!canvas||!rows.length)return;
  var cs=getComputedStyle(document.documentElement);
  var cTx3=cs.getPropertyValue('--tx3').trim()||'#AEAEB2';
  var cBrd=cs.getPropertyValue('--brd').trim()||'#E5E5EA';
  var cBlue=cs.getPropertyValue('--blue').trim()||'oklch(55% 0.24 262)';
  var cGreen=cs.getPropertyValue('--green').trim()||'oklch(57% 0.2 150)';
  var cAmber=cs.getPropertyValue('--amber').trim()||'oklch(75% 0.2 75)';
  var dpr=window.devicePixelRatio||1;
  var W=canvas.getBoundingClientRect().width||canvas.offsetWidth||500;
  var H=canvas.parentElement?canvas.parentElement.clientHeight||250:250;
  canvas.width=W*dpr;canvas.height=H*dpr;
  canvas.style.width=W+'px';canvas.style.height=H+'px';
  var ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);ctx.clearRect(0,0,W,H);
  var PAD={t:22,r:16,b:32,l:62};
  var cW=W-PAD.l-PAD.r,cH=H-PAD.t-PAD.b;
  var maxDepot=Math.max.apply(null,rows.map(function(r){return r.depot;}));
  if(!maxDepot)maxDepot=1;
  var maxY=Math.ceil(maxDepot/100000)*100000*1.1;
  var n=rows.length;
  var barW=Math.min(36,Math.floor(cW/(n+1)*0.72));
  var spacing=(cW-barW*n)/(n+1);
  [0,0.25,0.5,0.75,1].forEach(function(s){
    var v=maxY*s,y=PAD.t+cH-(v/maxY)*cH;
    ctx.strokeStyle=cBrd;ctx.lineWidth=0.5;
    ctx.beginPath();ctx.moveTo(PAD.l,y);ctx.lineTo(PAD.l+cW,y);ctx.stroke();
    ctx.fillStyle=cTx3;ctx.font='11px Inter,system-ui,sans-serif';ctx.textAlign='right';
    ctx.fillText(v>=1e6?(v/1e6).toFixed(1)+'M':v>=1e3?(v/1e3).toFixed(0)+'K':'0',PAD.l-5,y+4);
  });
  rows.forEach(function(r,i){
    var bx=PAD.l+spacing+i*(barW+spacing);
    var barH=(r.depot/maxY)*cH;
    var by=PAD.t+cH-barH;
    var color=r.phase==='Anspar'?cBlue:r.isRet?cGreen:cAmber;
    var isHov=(i===hovIdx);
    ctx.globalAlpha=isHov?1.0:0.82;
    var rad=3;
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.moveTo(bx+rad,by);ctx.lineTo(bx+barW-rad,by);
    ctx.quadraticCurveTo(bx+barW,by,bx+barW,by+rad);
    ctx.lineTo(bx+barW,PAD.t+cH);ctx.lineTo(bx,PAD.t+cH);
    ctx.lineTo(bx,by+rad);ctx.quadraticCurveTo(bx,by,bx+rad,by);
    ctx.closePath();ctx.fill();
    ctx.globalAlpha=1.0;
    ctx.fillStyle=r.isRet?cGreen:cTx3;
    ctx.font=(r.isRet?'bold ':'')+' 11px Inter,system-ui,sans-serif';
    ctx.textAlign='center';
    ctx.fillText(r.alter,bx+barW/2,H-PAD.b+14);
    if(barH>18){
      var valStr=r.depot>=1e6?(r.depot/1e6).toFixed(1)+'M':r.depot>=1e3?(r.depot/1e3).toFixed(0)+'K':'';
      if(valStr){ctx.fillStyle=color;ctx.font='10px Inter,system-ui,sans-serif';ctx.textAlign='center';ctx.fillText(valStr,bx+barW/2,by-4);}
    }
    if(isHov){
      var depStr=r.depot>=1e6?(r.depot/1e6).toFixed(2)+' M €':r.depot>=1e3?(r.depot/1e3).toFixed(0)+' K €':'0 €';
      var line1='Alter '+r.alter+(r.isRet?' 🎯':'');
      var line2=depStr;
      ctx.font='bold 12px Inter,system-ui,sans-serif';
      var tw=Math.max(ctx.measureText(line1).width,ctx.measureText(line2).width);
      var tp=8,th=44,tx=bx+barW/2+6,ty=by-52;
      if(tx+tw+tp*2>W-4)tx=bx+barW/2-tw-tp*2-6;
      if(ty<2)ty=2;
      ctx.fillStyle='rgba(28,28,30,0.88)';
      ctx.beginPath();ctx.rect(tx-tp,ty,tw+tp*2,th);ctx.fill();
      ctx.fillStyle='#fff';ctx.textAlign='left';
      ctx.fillText(line1,tx,ty+14);
      ctx.font='12px Inter,system-ui,sans-serif';ctx.fillStyle='rgba(255,255,255,0.75)';
      ctx.fillText(line2,tx,ty+32);
    }
  });
}

/* ── Line Chart: Entnahme ── */
var rpEntnahmeHov=-1;
function rpDrawEntnahmeChart(canvas,data,retAge,hovIdx){
  if(!canvas||!data.length)return;
  var cs=getComputedStyle(document.documentElement);
  var cTx3=cs.getPropertyValue('--tx3').trim()||'#AEAEB2';
  var cBrd=cs.getPropertyValue('--brd').trim()||'#E5E5EA';
  var cAmber=cs.getPropertyValue('--amber').trim()||'oklch(75% 0.2 75)';
  var dpr=window.devicePixelRatio||1;
  var W=canvas.getBoundingClientRect().width||canvas.offsetWidth||500;
  var H=canvas.parentElement?canvas.parentElement.clientHeight||250:250;
  canvas.width=W*dpr;canvas.height=H*dpr;
  canvas.style.width=W+'px';canvas.style.height=H+'px';
  var ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);ctx.clearRect(0,0,W,H);
  var PAD={t:16,r:16,b:32,l:62};
  var cW=W-PAD.l-PAD.r,cH=H-PAD.t-PAD.b;
  var maxDepot=Math.max.apply(null,data.map(function(d){return d.depot;}));
  if(!maxDepot)maxDepot=1;
  var maxY=Math.ceil(maxDepot/100000)*100000*1.1;
  var minAlter=data[0].alter,maxAlter=data[data.length-1].alter;
  var alterRange=maxAlter-minAlter||1;
  function toX(a){return PAD.l+(a-minAlter)/alterRange*cW;}
  function toY(v){return PAD.t+cH-(Math.max(0,v)/maxY)*cH;}
  [0,0.25,0.5,0.75,1].forEach(function(s){
    var v=maxY*s,y=toY(v);
    ctx.strokeStyle=cBrd;ctx.lineWidth=0.5;
    ctx.beginPath();ctx.moveTo(PAD.l,y);ctx.lineTo(PAD.l+cW,y);ctx.stroke();
    ctx.fillStyle=cTx3;ctx.font='11px Inter,system-ui,sans-serif';ctx.textAlign='right';
    ctx.fillText(v>=1e6?(v/1e6).toFixed(1)+'M':v>=1e3?(v/1e3).toFixed(0)+'K':'0',PAD.l-5,y+4);
  });
  for(var a=Math.ceil(minAlter/5)*5;a<=maxAlter;a+=5){
    var x=toX(a);
    ctx.fillStyle=cTx3;ctx.font='11px Inter,system-ui,sans-serif';ctx.textAlign='center';
    ctx.fillText(a,x,H-PAD.b+14);
    ctx.strokeStyle=cBrd;ctx.lineWidth=0.5;
    ctx.beginPath();ctx.moveTo(x,PAD.t);ctx.lineTo(x,PAD.t+cH);ctx.stroke();
  }
  ctx.beginPath();
  data.forEach(function(d,i){i===0?ctx.moveTo(toX(d.alter),toY(d.depot)):ctx.lineTo(toX(d.alter),toY(d.depot));});
  ctx.lineTo(toX(data[data.length-1].alter),toY(0));
  ctx.lineTo(toX(data[0].alter),toY(0));
  ctx.closePath();ctx.fillStyle='rgba(245,158,11,0.10)';ctx.fill();
  ctx.strokeStyle=cAmber;ctx.lineWidth=2.5;ctx.lineJoin='round';ctx.setLineDash([]);
  ctx.beginPath();
  data.forEach(function(d,i){i===0?ctx.moveTo(toX(d.alter),toY(d.depot)):ctx.lineTo(toX(d.alter),toY(d.depot));});
  ctx.stroke();
  data.forEach(function(d){
    if(d.guardrailAktiv){
      ctx.fillStyle='rgba(245,158,11,0.8)';
      ctx.beginPath();ctx.arc(toX(d.alter),toY(d.depot),3,0,Math.PI*2);ctx.fill();
    }
  });
  if(hovIdx>=0&&data[hovIdx]){
    var hd=data[hovIdx];
    var hx=toX(hd.alter),hy=toY(hd.depot);
    ctx.strokeStyle='rgba(100,100,100,0.4)';ctx.lineWidth=1;ctx.setLineDash([3,3]);
    ctx.beginPath();ctx.moveTo(hx,PAD.t);ctx.lineTo(hx,PAD.t+cH);ctx.stroke();
    ctx.beginPath();ctx.moveTo(PAD.l,hy);ctx.lineTo(PAD.l+cW,hy);ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle=cAmber;ctx.beginPath();ctx.arc(hx,hy,5,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(hx,hy,5,0,Math.PI*2);ctx.stroke();
    var depStr=hd.depot>=1e6?(hd.depot/1e6).toFixed(2)+' M €':hd.depot>=1e3?(hd.depot/1e3).toFixed(0)+' K €':'0 €';
    var entStr=hd.entnahme>0?eur(hd.entnahme/12)+'/Mo':'–';
    var line1='Alter '+hd.alter;
    var line2='Depot: '+depStr;
    var line3='Entnahme: '+entStr;
    ctx.font='bold 12px Inter,system-ui,sans-serif';
    var tw=Math.max(ctx.measureText(line1).width,ctx.measureText(line2).width,ctx.measureText(line3).width);
    var tp=8,th=62,tx=hx+14,ty=PAD.t+8;
    if(tx+tw+tp*2>W-4)tx=hx-tw-tp*2-14;
    if(ty+th>PAD.t+cH)ty=PAD.t+cH-th-4;
    ctx.fillStyle='rgba(28,28,30,0.88)';
    ctx.beginPath();ctx.rect(tx-tp,ty-tp,tw+tp*2,th);ctx.fill();
    ctx.fillStyle='#fff';ctx.textAlign='left';
    ctx.fillText(line1,tx,ty+12);
    ctx.font='12px Inter,system-ui,sans-serif';ctx.fillStyle='rgba(255,255,255,0.75)';
    ctx.fillText(line2,tx,ty+30);
    ctx.fillText(line3,tx,ty+48);
  }
}

/* ── Tab: Stichtag ── */
function rpRenderTabStichtag(r1,r2,store,el) {
  if(!r1){el.innerHTML='<div style="padding:20px;color:var(--tx3);font-size:13px">Kein Profil vorhanden.</div>';return;}
  var r=(rpS.person==='person_2'&&r2)?r2:r1;
  var data=r.verlaufData||[];
  var ep=r.entnahmePlan||[];
  var retAge=r.retirementAge||r.targetRetirementAge;
  var curAge=r.currentAge||40;
  // Schlüssel-Alter: aktuelle Dekaden + Rente + 10/20/30 Jahre nach Rente
  var keyAges=[45,50,55,60,retAge,70,75,80,85];
  var seen={};keyAges=keyAges.filter(function(a){if(a<=curAge||seen[a])return false;seen[a]=true;return true;});
  var rows=keyAges.map(function(a){
    var d=data.find(function(x){return x.alter===a;});
    if(!d)return null;
    var isRet=(a===retAge);
    var phase=a<retAge?'Anspar':(isRet?'Rente':'Entnahme');
    var epE=ep.find(function(e){return e.alter===a;});
    var entnahmeJahr=epE?epE.entnahme:0;
    var renditeJahr=epE?epE.rendite:0;
    return{alter:a,depot:d.depot,entnahme:entnahmeJahr,rendite:renditeJahr,phase:phase,isRet:isRet};
  }).filter(Boolean);
  if(!rows.length){el.innerHTML='<div style="padding:20px;color:var(--tx3)">Keine Stichtag-Daten. Bitte Geburtsdatum und Renteneintrittsalter setzen.</div>';return;}
  var maxDepot=Math.max.apply(null,rows.map(function(r){return r.depot;}));
  function depotBar(v){
    var pct=maxDepot>0?Math.round(v/maxDepot*100):0;
    return '<div style="display:flex;align-items:center;gap:6px">'+
      '<div style="flex:1;height:6px;background:var(--brd);border-radius:3px;overflow:hidden">'+
        '<div style="width:'+pct+'%;height:100%;background:var(--blue);border-radius:3px;transition:width .3s"></div>'+
      '</div>'+
      '<span style="font-variant-numeric:tabular-nums;font-size:13px;min-width:76px;text-align:right">'+eur(v)+'</span>'+
    '</div>';
  }
  var tbody=rows.map(function(r){
    var retCls=r.isRet?'background:var(--blue-lt);font-weight:600':'';
    var phaseColor=r.phase==='Anspar'?'var(--blue)':r.isRet?'var(--green)':'var(--amber)';
    return '<tr style="border-bottom:1px solid var(--brd);'+retCls+'">'+
      '<td style="padding:10px 12px;white-space:nowrap">'+
        '<span style="font-size:15px;font-weight:600">'+r.alter+'</span>'+
        (r.isRet?'<span style="margin-left:5px;font-size:11px;color:var(--blue)">← Rente</span>':'')+
      '</td>'+
      '<td style="padding:10px 12px;min-width:180px">'+depotBar(r.depot)+'</td>'+
      '<td style="padding:10px 12px;text-align:right;font-variant-numeric:tabular-nums;font-size:12px;color:var(--tx3)">'+
        (r.entnahme>0?eur(r.entnahme/12)+'/Mo':r.rendite>0?'+'+eur(r.rendite/12):'-')+
      '</td>'+
      '<td style="padding:10px 12px">'+
        '<span style="font-size:11px;padding:2px 7px;border-radius:4px;background:'+phaseColor+';color:var(--on-accent);opacity:.85">'+r.phase+'</span>'+
      '</td>'+
    '</tr>';
  }).join('');
  var hasEntnahme=rows.some(function(r){return r.entnahme>0;});
  var closedRows=rows;
  el.innerHTML=
    '<div class="rp-chart-wrap"><canvas id="rp-stichtag-canvas" style="display:block;width:100%;cursor:crosshair"></canvas></div>'+
    '<div style="display:flex;gap:12px;flex-wrap:wrap;margin:8px 0 14px;font-size:11px;color:var(--tx3)">'+
      '<span><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:var(--blue);vertical-align:middle;margin-right:4px"></span>Anspar</span>'+
      '<span><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:var(--green);vertical-align:middle;margin-right:4px"></span>Renteneintritt 🎯</span>'+
      '<span><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:var(--amber);vertical-align:middle;margin-right:4px"></span>Entnahme</span>'+
    '</div>'+
    '<div style="overflow-x:auto">'+
    '<table style="width:100%;border-collapse:collapse;min-width:360px">'+
      '<thead><tr style="border-bottom:2px solid var(--brd);font-size:11px;color:var(--tx3)">'+
        '<th style="padding:6px 12px;text-align:left;font-weight:600">Alter</th>'+
        '<th style="padding:6px 12px;text-align:left;font-weight:600">Depot</th>'+
        '<th style="padding:6px 12px;text-align:right;font-weight:600">'+(hasEntnahme?'Entnahme/Mo':'Rendite/Mo')+'</th>'+
        '<th style="padding:6px 12px;text-align:left;font-weight:600">Phase</th>'+
      '</tr></thead>'+
      '<tbody>'+tbody+'</tbody>'+
    '</table>'+
    '</div>';
  rpStichtagHov=-1;
  requestAnimationFrame(function(){
    var cv=document.getElementById('rp-stichtag-canvas');
    if(!cv)return;
    rpDrawStichtagChart(cv,closedRows,retAge,-1);
    cv.onmousemove=function(e){
      var rect=cv.getBoundingClientRect(),mx=e.clientX-rect.left;
      var cW=rect.width-62-16;
      var n=closedRows.length;
      var barW=Math.min(36,Math.floor(cW/(n+1)*0.72));
      var spacing=(cW-barW*n)/(n+1);
      var best=-1;
      closedRows.forEach(function(r,i){
        var bx=62+spacing+i*(barW+spacing);
        if(mx>=bx-4&&mx<=bx+barW+4)best=i;
      });
      if(best!==rpStichtagHov){rpStichtagHov=best;rpDrawStichtagChart(cv,closedRows,retAge,rpStichtagHov);}
    };
    cv.onmouseleave=function(){rpStichtagHov=-1;rpDrawStichtagChart(cv,closedRows,retAge,-1);};
  });
}

/* ── Tab: Rente (P1 / P2 nebeneinander) ── */
function rpRenderTabRente(r1,r2,store,el) {
  var partnerOn=store.settings.partnerEnabled;
  var n1=rpPersonName('person_1',store);
  var n2=rpPersonName('person_2',store);
  function renteCol(r,name){
    if(!r)return '<div class="rp-rc"><div class="rp-rc-title">'+name+'</div><div style="color:var(--tx3);font-size:12px">Kein Profil.</div></div>';
    var lueckeCls=r.hatLuecke?'color:var(--red)':'color:var(--green)';
    var rows=[
      {l:'Rentenpunkte',v:r.punkteBeiRente.toFixed(1)+' EP'},
      {l:'Rentenabschlag',v:r.abschlagPct>0?'−'+r.abschlagPct+'%':'Kein Abschlag ('+((r.zugangsfaktor||1)*100).toFixed(1)+'%)'},
      {l:'Gesetzl. Rente Brutto',v:eur(r.gesetzlicheMonatsrenteBrutto)},
      {l:'Gesetzl. Rente Netto',v:eur(r.gesetzlicheMonatsrente)},
    ];
    if(r.direktzusageBrutto>0)rows.push({l:'Betriebsrente Netto'+(r.direktzusageAktiv?'':' (ab '+r.direktzusageStartAge+')'),v:eur(r.direktzusageMonatlich)});
    if(r.ruerupBrutto>0)rows.push({l:'Rürup Netto'+(r.ruerupAktiv?'':' (ab '+r.ruerupStartAge+')'),v:eur(r.ruerupMonatlich)});
    (r.weitereQuellennetto||[]).forEach(function(w){
      if(w.brutto>0)rows.push({l:(w.name||'Weitere RV')+(w.aktiv?'':' (ab '+w.startAge+')')+' Netto',v:eur(w.netto)});
    });
    if(r.erbMieteMonatlich>0)rows.push({l:'Erbimmobilie Miete',v:eur(r.erbMieteMonatlich)});
    rows.push({l:'Ausgaben/Mo (heute)',v:eur(r.ausgaben)});
    if(r.ausgabenNominal&&r.ausgabenNominal!==r.ausgaben)rows.push({l:'Ausgaben nominal (Rente)',v:eur(r.ausgabenNominal),dim:true});
    if(r.kaufkraftHeute&&r.kaufkraftHeute!==r.gesamtEinkommen)rows.push({l:'Kaufkraft heute',v:eur(r.kaufkraftHeute),dim:true});
    var lbl=r.hatLuecke?'Rentenlücke':'Kein Defizit';
    var val=r.hatLuecke?eur(r.luecke):'✓';
    // KV-Lücke anzeigen
    var kvHtml='';
    if(r.kvLueckeJahre>0){
      if(r.kvLueckeStatus==='freiwillig'){
        kvHtml='<div style="margin-top:6px;padding:6px 8px;border-radius:8px;background:var(--amber-lt,rgba(245,158,11,.08));border:1px solid var(--amber,#F59E0B);font-size:11px;color:var(--tx2)">'+
          '<span style="color:var(--amber);font-weight:600">⚠ KV-Lücke ('+r.kvLueckeJahre+' J.)</span> '+
          'Freiwillige GKV geschätzt: <strong>'+eur(r.kvFreiwilligKosten)+'/Mo</strong> · '+
          'Gewinn-Entnahme ~'+eur(r.kvGainMonatlich)+'/Mo überschreitet Familienversicherungsgrenze (505 €)'+
          '</div>';
      } else if(r.kvLueckeStatus==='familienversicherung'){
        kvHtml='<div style="margin-top:6px;padding:6px 8px;border-radius:8px;background:var(--green-lt,rgba(5,150,105,.08));border:1px solid var(--green-bd,rgba(5,150,105,.2));font-size:11px;color:var(--tx2)">'+
          '<span style="color:var(--green);font-weight:600">✓ KV-Lücke ('+r.kvLueckeJahre+' J.)</span> '+
          'Familienversicherung möglich · Gewinnanteil ~'+eur(r.kvGainMonatlich)+'/Mo &lt; 505 €'+
          '</div>';
      } else if(r.kvLueckeStatus==='pkv'){
        kvHtml='<div style="margin-top:6px;padding:6px 8px;border-radius:8px;background:var(--surf2);border:1px solid var(--brd);font-size:11px;color:var(--tx2)">'+
          '<span style="font-weight:600">PKV ('+r.kvLueckeJahre+' J.)</span> · Beiträge bitte in monatlichen Ausgaben erfassen</div>';
      }
    }
    var deferredHtml='';
    if(r.hatLuecke&&!r.hatLueckeVoll&&r.deferredSources&&r.deferredSources.length){
      var deferredNote=r.deferredSources.map(function(d){return d.name+' ab '+d.startAge;}).join(', ');
      deferredHtml='<div style="margin-top:6px;padding:6px 8px;border-radius:8px;background:var(--green-lt,rgba(5,150,105,.08));border:1px solid var(--green-bd,rgba(5,150,105,.2));font-size:11px;color:var(--tx2)">'+
        '<span style="color:var(--green);font-weight:600">Kein Defizit</span> sobald aktiv: '+deferredNote+'</div>';
    }
    return '<div class="rp-rc"><div class="rp-rc-title">'+name+' · ab '+r.targetRetirementAge+'</div>'+
      rows.map(function(row){return '<div class="rp-row"'+(row.dim?' style="opacity:.65"':'')+'>'+
        '<span class="rl">'+row.l+'</span><span class="rv">'+row.v+'</span></div>';}).join('')+
      '<div class="rp-al '+(r.hatLuecke?'luecke':'ok')+'"><div class="rp-al-lbl">'+lbl+'</div><div class="rp-al-val" style="'+lueckeCls+'">'+val+'</div></div>'+
      deferredHtml+
      kvHtml+
      '</div>';
  }
  var hhHtml='';
  if(partnerOn&&r1&&r2){
    var hhEink=(r1.gesamtEinkommen||0)+(r2.gesamtEinkommen||0)+(r1.erbMieteMonatlich||0)+(r2.erbMieteMonatlich||0);
    var hhAusg=(r1.ausgaben||0)+(r2.ausgaben||0);
    var hhEntn=(r1.entnahmeMonatlich||0)+(r2.entnahmeMonatlich||0);
    var hhDepot=(r1.depotAtRetire||0)+(r2.depotAtRetire||0);
    var hhLuecke=Math.max(0,hhAusg-(hhEink+hhEntn));
    hhHtml='<div style="margin-top:14px;border-top:1px solid var(--brd);padding-top:14px">'+
      '<div style="font-size:11px;font-weight:600;color:var(--tx3);margin-bottom:8px;text-transform:uppercase;letter-spacing:.04em">Haushalt gesamt</div>'+
      '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">'+
        '<div class="rp-rc" style="padding:10px 12px">'+
          '<div class="rp-rc-title" style="font-size:10px">HH-Einkommen</div>'+
          '<div style="font-size:16px;font-weight:700;font-family:var(--mono)">'+eur(hhEink+hhEntn)+'</div>'+
          '<div style="font-size:11px;color:var(--tx3)">Rente + Entnahme</div>'+
        '</div>'+
        '<div class="rp-rc" style="padding:10px 12px">'+
          '<div class="rp-rc-title" style="font-size:10px">HH-Ausgaben</div>'+
          '<div style="font-size:16px;font-weight:700;font-family:var(--mono);color:var(--red)">'+eur(hhAusg)+'</div>'+
          '<div style="font-size:11px;color:var(--tx3)">Beide zusammen</div>'+
        '</div>'+
        '<div class="rp-rc" style="padding:10px 12px">'+
          '<div class="rp-rc-title" style="font-size:10px">HH-Depot</div>'+
          '<div style="font-size:16px;font-weight:700;font-family:var(--mono)">'+eur(hhDepot)+'</div>'+
          '<div style="font-size:11px;color:var(--tx3)">P1 + P2</div>'+
        '</div>'+
        '<div class="rp-al '+(hhLuecke>0?'luecke':'ok')+'" style="margin:0;border-radius:10px">'+
          '<div class="rp-al-lbl">'+(hhLuecke>0?'HH-Rentenlücke':'Kein HH-Defizit')+'</div>'+
          '<div class="rp-al-val">'+(hhLuecke>0?eur(hhLuecke):'✓')+'</div>'+
        '</div>'+
      '</div>'+
    '</div>';
  }
  if(partnerOn){
    el.innerHTML='<div class="rp-rg">'+renteCol(r1,n1)+renteCol(r2,n2)+'</div>'+rpRenderIncomeHtml(r1)+hhHtml;
  } else {
    el.innerHTML='<div class="rp-rg" style="grid-template-columns:1fr">'+renteCol(r1,n1)+'</div>'+rpRenderIncomeHtml(r1);
  }
}

/* ── Income bar (reusable) ── */
function rpRenderIncomeHtml(r) {
  if(!r)return'';
  var colors={gesetzlich:'var(--blue)',direkt:'var(--green)',ruerup:'var(--purple)',weitere:'var(--amber)'};
  var sources=[
    {key:'gesetzlich',lbl:'Gesetzl. Rente',val:r.gesetzlicheMonatsrente,aktiv:true},
    {key:'direkt',lbl:'Betriebsrente',val:r.direktzusageMonatlich,aktiv:r.direktzusageAktiv},
    {key:'ruerup',lbl:'Rürup',val:r.ruerupMonatlich,aktiv:r.ruerupAktiv},
  ].filter(function(s){return s.val>0;});
  (r.weitereQuellennetto||[]).forEach(function(w,i){if(w.netto>0)sources.push({key:'w'+i,lbl:w.name,val:w.netto,aktiv:w.aktiv});});
  if(!sources.length)return'';
  var total=r.gesamtEinkommenVoll||1;
  var barHtml=sources.map(function(s){var c=colors[s.key]||colors.weitere;return '<div class="rp-income-seg" style="width:'+(s.val/total*100).toFixed(1)+'%;background:'+c+';opacity:'+(s.aktiv?1:.35)+'"></div>';}).join('');
  var legHtml=sources.map(function(s){var c=colors[s.key]||colors.weitere;return '<div class="rp-income-leg" style="opacity:'+(s.aktiv?1:.6)+'"><div class="rp-income-dot" style="background:'+c+'"></div>'+s.lbl+' '+eur(s.val)+' Netto</div>';}).join('');
  return '<div style="margin-top:14px"><div class="rp-income-bar">'+barHtml+'</div><div class="rp-income-legend">'+legHtml+'</div></div>';
}

/* ── Tab: Entnahme ── */
function rpRenderTabEntnahme(r1,r2,store,el) {
  var r=(rpS.person==='person_2'&&r2)?r2:r1;if(!r){el.innerHTML='';return;}
  var hasGuardrail=r.entnahmePlan.some(function(w){return w.guardrailAktiv;});
  var chartData=r.entnahmePlan.slice(0,30);
  var rows=chartData.map(function(w){
    var grIco=w.guardrailAktiv?' <span style="font-size:10px;color:var(--amber)" title="Guardrail aktiv">⚠</span>':'';
    return '<tr class="'+(w.alter===r.targetRetirementAge?'hl':'')+'"><td>'+w.alter+'</td><td>'+eur(w.depot)+'</td><td style="color:var(--red)">'+eur(w.entnahme)+grIco+'</td><td style="color:var(--green)">'+eur(w.rendite)+'</td></tr>';
  }).join('');
  var stratLbl=r.entnahmeStrat==='luecke'?'Rentenlücke':r.entnahmeStrat==='swr'?(r.swrRate+'% SWR'+(r.guardrails?' + Guardrails':'')):('Fest '+eur(r.entnahmeMonatlich));
  el.innerHTML='<div style="margin-bottom:12px"><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">'+
    '<div class="rp-rc"><div class="rp-rc-title">Entnahme/Mo</div><div style="font-size:20px;font-weight:800;font-family:var(--mono);color:var(--blue)">'+eur(r.entnahmeMonatlich)+'</div><div style="font-size:11px;color:var(--tx3)">'+stratLbl+'</div></div>'+
    '<div class="rp-rc"><div class="rp-rc-title">Depot bei Rente</div><div style="font-size:20px;font-weight:800;font-family:var(--mono)">'+eur(r.depotAtRetire)+'</div><div style="font-size:11px;color:var(--tx3)">Kinder-Abzug: '+eur(r.kinderGesamtkosten)+'</div></div>'+
    '<div class="rp-rc"><div class="rp-rc-title">Depot reicht</div><div style="font-size:20px;font-weight:800;font-family:var(--mono);color:'+(!r.hatLuecke?'var(--green)':r.depotJahre>=20?'var(--green)':'var(--amber)')+'">'+(!r.hatLuecke?'∞':r.depotJahre>=60?'60+ J.':r.depotJahre>0?r.depotJahre.toFixed(0)+' J.':'< 1 J.')+'</div><div style="font-size:11px;color:var(--tx3)">'+(!r.hatLuecke?'Kein Depot-Verzehr nötig':'ab Alter '+r.targetRetirementAge)+'</div></div>'+
    '</div></div>'+
    '<div style="font-size:12px;color:var(--tx3);margin-bottom:6px">Depot-Verlauf im Ruhestand</div>'+
    '<div class="rp-chart-wrap"><canvas id="rp-entnahme-canvas" style="display:block;width:100%;cursor:crosshair"></canvas></div>'+
    '<div style="display:flex;gap:16px;flex-wrap:wrap;margin:8px 0 14px;font-size:11px;color:var(--tx3)">'+
      '<span><span style="display:inline-block;width:12px;height:3px;background:var(--amber);border-radius:2px;vertical-align:middle;margin-right:4px"></span>Depot-Verlauf</span>'+
      (hasGuardrail?'<span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--amber);vertical-align:middle;margin-right:4px"></span>Guardrail aktiv</span>':'')+
    '</div>'+
    (hasGuardrail?'<div style="font-size:11px;color:var(--amber);margin-bottom:8px;padding:6px 10px;background:var(--surf2);border-radius:8px">⚠ Guardrail hat angesprochen: Entnahme wurde in markierten Jahren auf 90% reduziert</div>':'')+
    '<table class="rp-dt"><thead><tr><th style="text-align:left">Alter</th><th>Depot</th><th>Entnahme/J.</th><th>Rendite</th></tr></thead><tbody>'+rows+'</tbody></table>'+
    '<div style="margin-top:10px;padding:8px 12px;background:var(--surf2);border-radius:8px;font-size:11px;color:var(--tx3);line-height:1.5">'+
    '<strong style="color:var(--tx2)">Hinweis: Rendite-Reihenfolge (Sequence-of-Returns)</strong> — Diese Tabelle rechnet mit gleichmäßiger Jahresrendite. In der Realität können starke Verluste in den ersten Rentenjahren das Depot dauerhaft belasten, selbst wenn die Durchschnittsrendite stimmt. Tipp: Etwas mehr Puffer einplanen oder Guardrails aktivieren.'+
    '</div>';
  rpEntnahmeHov=-1;
  requestAnimationFrame(function(){
    var cv=document.getElementById('rp-entnahme-canvas');
    if(!cv)return;
    rpDrawEntnahmeChart(cv,chartData,r.targetRetirementAge,-1);
    cv.onmousemove=function(e){
      var rect=cv.getBoundingClientRect(),mx=e.clientX-rect.left;
      var cW=rect.width-62-16;
      if(!chartData.length)return;
      var minA=chartData[0].alter,rng=(chartData[chartData.length-1].alter-minA)||1;
      var best=-1,bd=1e9;
      chartData.forEach(function(d,i){
        var dx=Math.abs(mx-(62+(d.alter-minA)/rng*cW));
        if(dx<bd){bd=dx;best=i;}
      });
      if(best!==rpEntnahmeHov){rpEntnahmeHov=best;rpDrawEntnahmeChart(cv,chartData,r.targetRetirementAge,rpEntnahmeHov);}
    };
    cv.onmouseleave=function(){rpEntnahmeHov=-1;rpDrawEntnahmeChart(cv,chartData,r.targetRetirementAge,-1);};
  });
}

/* ── Tab: Depot-Plan ── */
function rpRenderTabDepot(r1,r2,store,el) {
  var r=(rpS.person==='person_2'&&r2)?r2:r1;if(!r){el.innerHTML='';return;}
  el.innerHTML='<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:14px">'+
    '<div class="rp-rc"><div class="rp-rc-title">Depot heute</div><div style="font-size:20px;font-weight:800;font-family:var(--mono)">'+eur(r.depotStart)+'</div><div style="font-size:11px;color:var(--tx3)">Ohne Immobilien + Sonstiges</div></div>'+
    '<div class="rp-rc"><div class="rp-rc-title">Sparrate/Mo</div><div style="font-size:20px;font-weight:800;font-family:var(--mono);color:var(--blue)">'+eur(r.monthlySavings)+'</div><div style="font-size:11px;color:var(--tx3)">Sparpläne + Asset-Monatspläne</div></div>'+
    '<div class="rp-rc"><div class="rp-rc-title">Ø Rendite (gewichtet)</div><div style="font-size:20px;font-weight:800;font-family:var(--mono)">'+r.weightedReturn.toFixed(1)+'%</div><div style="font-size:11px;color:var(--tx3)">Nach Portfolio-Komposition</div></div>'+
    '<div class="rp-rc"><div class="rp-rc-title">Abzug Kinder</div><div style="font-size:20px;font-weight:800;font-family:var(--mono);color:var(--amber)">'+eur(r.kinderGesamtkosten)+'</div><div style="font-size:11px;color:var(--tx3)">Ausbildungskosten gesamt</div></div>'+
    '</div>'+
    '<div class="rp-rc" style="padding:12px 14px;margin-bottom:10px">'+
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span class="rp-rc-title">Abzüge (berechnet)</span></div>'+
    '<div id="rp-abzuege-calc" class="rp-abz-calc">Wird berechnet…</div>'+
    '</div>';
}

/* ── Tab: Haushalt ── */
function rpRenderTabHaushalt(r1,r2,store,el) {
  if(!r1){el.innerHTML='';return;}
  var n1=rpPersonName('person_1',store);
  var n2=rpPersonName('person_2',store);
  var hhEink=(r1?r1.gesamtEinkommen:0)+(r2?r2.gesamtEinkommen:0)+(r1?r1.erbMieteMonatlich:0)+(r2?r2.erbMieteMonatlich:0);
  var hhAusg=(r1?r1.ausgaben:0)+(r2?r2.ausgaben:0);
  var hhEntn=(r1?r1.entnahmeMonatlich:0)+(r2?r2.entnahmeMonatlich:0);
  var hhDepot=(r1?r1.depotAtRetire:0)+(r2?r2.depotAtRetire:0);
  var hhLuecke=Math.max(0,hhAusg-(hhEink+hhEntn));
  // Ehegattensplitting
  var splVorteil1=(r1&&r1.splittingVorteil)||0;
  var splVorteil2=(r2&&r2.splittingVorteil)||0;
  var splVorteilGes=splVorteil1+splVorteil2;
  var isGemeinsam=store.settings.steuerlicheVeranlagung==='gemeinsam';
  var splHtml='';
  if(r2&&isGemeinsam){
    splHtml='<div class="rp-rc" style="margin-top:10px">'+
      '<div class="rp-rc-title">Ehegattensplitting (gemeinsame Veranlagung)</div>'+
      '<div class="rp-row"><span class="rl">Anteil '+n1+'</span><span class="rv" style="color:var(--green)">'+eur(splVorteil1)+'/Mo</span></div>'+
      '<div class="rp-row"><span class="rl">Anteil '+n2+'</span><span class="rv" style="color:var(--green)">'+eur(splVorteil2)+'/Mo</span></div>'+
      '<div class="rp-row total"><span>Steuerersparnis gesamt</span><span style="font-family:var(--mono);color:var(--green)">'+eur(splVorteilGes)+'/Mo · '+eur(splVorteilGes*12)+'/J.</span></div>'+
      '<div style="font-size:11px;color:var(--tx3);margin-top:6px">Das Splitting-Verfahren teilt das gemeinsame zvE durch 2, berechnet die Steuer und verdoppelt sie — günstig bei unterschiedlichen Einkommen.</div>'+
    '</div>';
  } else if(r2){
    splHtml='<div class="rp-rc" style="margin-top:10px">'+
      '<div class="rp-rc-title">Ehegattensplitting</div>'+
      '<div style="font-size:12px;color:var(--tx3);padding:8px 0">Einzelveranlagung aktiv — kein Splitting-Vorteil berechnet. Umstellen auf gemeinsame Veranlagung in Einstellungen → Stammdaten.</div>'+
    '</div>';
  }
  // Witwenrente §46 SGB VI
  var witwe1=r1?Math.round((r1.gesetzlicheMonatsrenteBrutto||0)*0.55):0;
  var witwe2=r2?Math.round((r2.gesetzlicheMonatsrenteBrutto||0)*0.55):0;
  var witweHtml='';
  if(r2){
    witweHtml='<div class="rp-rc" style="margin-top:10px">'+
      '<div class="rp-rc-title">Witwenrente §46 SGB VI (Große Witwenrente)</div>'+
      '<div class="rp-row"><span class="rl">'+n2+' erhält bei Tod von '+n1+'</span><span class="rv">'+eur(witwe1)+'/Mo</span></div>'+
      '<div class="rp-row"><span class="rl">'+n1+' erhält bei Tod von '+n2+'</span><span class="rv">'+eur(witwe2)+'/Mo</span></div>'+
      '<div style="font-size:11px;color:var(--tx3);margin-top:6px">55% der gesetzlichen Brutto-Rente des Verstorbenen (§46 Abs. 2 SGB VI). Brutto-Betrag vor Steuern und KV-Abzügen.</div>'+
    '</div>';
  }
  el.innerHTML='<div class="rp-rg">'+
    '<div class="rp-rc">'+
      '<div class="rp-rc-title">Haushalt Einkommen</div>'+
      '<div class="rp-row"><span class="rl">'+n1+' Rente Netto</span><span class="rv">'+eur(r1?r1.gesamtEinkommen:0)+'</span></div>'+
      (r2?'<div class="rp-row"><span class="rl">'+n2+' Rente Netto</span><span class="rv">'+eur(r2.gesamtEinkommen)+'</span></div>':'')+
      '<div class="rp-row"><span class="rl">Depot-Entnahme</span><span class="rv">'+eur(hhEntn)+'</span></div>'+
      ((r1&&r1.erbMieteMonatlich>0)||(r2&&r2.erbMieteMonatlich>0)?'<div class="rp-row"><span class="rl">Erbimmobilie Miete</span><span class="rv">'+eur((r1?r1.erbMieteMonatlich:0)+(r2?r2.erbMieteMonatlich:0))+'</span></div>':'')+
      '<div class="rp-row total"><span>HH-Einkommen</span><span style="font-family:var(--mono)">'+eur(hhEink+hhEntn)+'</span></div>'+
    '</div>'+
    '<div class="rp-rc">'+
      '<div class="rp-rc-title">Haushalt Ausgaben & Lage</div>'+
      '<div class="rp-row"><span class="rl">Ausgaben gesamt</span><span class="rv" style="color:var(--red)">'+eur(hhAusg)+'</span></div>'+
      '<div class="rp-row"><span class="rl">HH-Depot</span><span class="rv">'+eur(hhDepot)+'</span></div>'+
      '<div class="rp-al '+(hhLuecke>0?'luecke':'ok')+'" style="margin-top:12px">'+
        '<div class="rp-al-lbl">'+(hhLuecke>0?'HH-Rentenlücke':'Kein HH-Defizit')+'</div>'+
        '<div class="rp-al-val">'+(hhLuecke>0?eur(hhLuecke):'✓')+'</div>'+
      '</div>'+
    '</div>'+
  '</div>'+
  splHtml+witweHtml;
}

/* ── Einstellungen: Stammdaten speichern ── */
function stSaveStammdaten() {
  var store=FP.Store.get();
  // P1
  var p1=store.persons.find(function(p){return p.id==='person_1';});
  if(p1){
    var n=document.getElementById('st-p1-name');
    var b=document.getElementById('st-p1-birth');
    if(n&&n.value.trim()) p1.name=n.value.trim();
    if(b&&b.value.trim()) p1.birthDate=b.value.trim();
  }
  // P2
  var p2=store.persons.find(function(p){return p.id==='person_2';});
  if(p2){
    var n2=document.getElementById('st-p2-name');
    var b2=document.getElementById('st-p2-birth');
    if(n2&&n2.value.trim()) p2.name=n2.value.trim();
    if(b2&&b2.value.trim()) p2.birthDate=b2.value.trim();
  }
  // Steuerliche Veranlagung
  var sv=document.getElementById('st-steuer-veranlagung');
  if(sv) store.settings.steuerlicheVeranlagung=sv.value;
  // Kinder
  if(!store.settings.kinder) store.settings.kinder={};
  var k=store.settings.kinder;
  k.anzahl=parseInt(document.getElementById('st-k-anzahl').value)||0;
  k.ausbildungKosten=parseFloat(document.getElementById('st-k-kosten').value)||800;
  k.ausbildungDauer=parseInt(document.getElementById('st-k-dauer').value)||4;
  k.kind1Alter=parseInt((document.getElementById('st-k1-alter')||{}).value)||0;
  k.kind2Alter=parseInt((document.getElementById('st-k2-alter')||{}).value)||0;
  k.kind3Alter=parseInt((document.getElementById('st-k3-alter')||{}).value)||0;
  FP.Store.save();
  appLog('EINST', 'Stammdaten gespeichert: '+(p1?p1.name:'')+(p2&&store.settings.partnerEnabled?' + '+p2.name:''));
}

function stTogglePartner() {
  var store=FP.Store.get();
  store.settings.partnerEnabled=!store.settings.partnerEnabled;
  FP.Store.save();
  var tgl=document.getElementById('st-partner-tgl');
  var fields=document.getElementById('st-partner-fields');
  if(tgl) tgl.classList.toggle('on',store.settings.partnerEnabled);
  if(fields) fields.style.display=store.settings.partnerEnabled?'block':'none';
}

function stUpdateKinderFields() {
  var anzahl=parseInt(document.getElementById('st-k-anzahl').value)||0;
  var wrap=document.getElementById('st-kinder-alter');
  if(!wrap)return;
  wrap.style.display=anzahl>0?'block':'none';
  var k1=document.getElementById('st-k1-wrap');
  var k2=document.getElementById('st-k2-wrap');
  var k3=document.getElementById('st-k3-wrap');
  if(k1) k1.style.display=anzahl>=1?'block':'none';
  if(k2) k2.style.display=anzahl>=2?'block':'none';
  if(k3) k3.style.display=anzahl>=3?'block':'none';
}

function stRenderStammdaten() {
  var store=FP.Store.get();
  var p1=store.persons.find(function(p){return p.id==='person_1';})||{};
  var p2=store.persons.find(function(p){return p.id==='person_2';})||{};
  var kinder=store.settings?.kinder||{};
  var partnerOn=store.settings.partnerEnabled;
  var n1=document.getElementById('st-p1-name');
  var b1=document.getElementById('st-p1-birth');
  if(n1) n1.value=p1.name||'';
  if(b1) b1.value=p1.birthDate||'';
  var tgl=document.getElementById('st-partner-tgl');
  if(tgl) tgl.classList.toggle('on',partnerOn);
  var fields=document.getElementById('st-partner-fields');
  if(fields) fields.style.display=partnerOn?'block':'none';
  var n2=document.getElementById('st-p2-name');
  var b2=document.getElementById('st-p2-birth');
  if(n2) n2.value=p2.name||'';
  if(b2) b2.value=p2.birthDate||'';
  var svEl=document.getElementById('st-steuer-veranlagung');
  if(svEl) svEl.value=store.settings.steuerlicheVeranlagung||'einzeln';
  var kAnz=document.getElementById('st-k-anzahl');
  var kKos=document.getElementById('st-k-kosten');
  var kDau=document.getElementById('st-k-dauer');
  var kA1=document.getElementById('st-k1-alter');
  var kA2=document.getElementById('st-k2-alter');
  var kA3=document.getElementById('st-k3-alter');
  if(kAnz) kAnz.value=kinder.anzahl||0;
  if(kKos) kKos.value=kinder.ausbildungKosten||800;
  if(kDau) kDau.value=kinder.ausbildungDauer||4;
  if(kA1)  kA1.value=kinder.kind1Alter||0;
  if(kA2)  kA2.value=kinder.kind2Alter||0;
  if(kA3)  kA3.value=kinder.kind3Alter||0;
  stUpdateKinderFields();
}

function rpSyncSlider(id, val) {
  var sl  = document.getElementById('rp-' + id + '-sl');
  var inp = document.getElementById('rp-' + id);
  var sv  = document.getElementById('rp-' + id + '-sv');
  // When called with explicit val: use it. When called without: read from hidden input (set by rpFillForm).
  var v   = val !== undefined ? val : (inp ? inp.value : (sl ? sl.value : ''));
  if (!v) return;
  if (sl)  sl.value = v;
  if (inp) inp.value = v;
  if (sv) {
    if (id === 'expenses' || id === 'expenses2') sv.textContent = parseFloat(v).toLocaleString('de-DE') + ' €';
    else if (id === 'punkte-year') sv.textContent = parseFloat(v).toFixed(2);
    else if (id === 'swr') sv.textContent = parseFloat(v).toFixed(1) + '%';
    else if (id === 'gehaltssteig') sv.textContent = parseFloat(v).toFixed(1) + ' %';
    else sv.textContent = v;
  }
}

/* ════════════════════════════════════════
   VERMÖGEN TAB
════════════════════════════════════════ */
var VM_TYPE_COLOR  = {etf:'#3B82F6',aktie:'#2563EB',geldmarkt:'#10B981',tagesgeld:'#0891B2',girokonto:'#059669',immobilie:'#7C3AED',espp:'#F59E0B',rsu:'#EC4899',sonstiges:'#94A3B8'};
var VM_TYPE_LABEL  = {etf:'ETF',aktie:'Aktie',geldmarkt:'Geldmarkt',tagesgeld:'Tagesgeld',girokonto:'Girokonto',immobilie:'Immobilie',espp:'ESPP',rsu:'RSU',sonstiges:'Sonstiges'};
var VM_OWNER_LABEL = {person_1:'Person 1',person_2:'Partner',joint:'Gemeinsam'};
function vmBuildOwnerLabel(){
  var persons=FP.Store.get().persons||[];
  var p1=persons.find(function(p){return p.id==='person_1';});
  var p2=persons.find(function(p){return p.id==='person_2';});
  VM_OWNER_LABEL={
    person_1: (p1&&p1.name)||'Person 1',
    person_2: (p2&&p2.name)||'Partner',
    joint:    'Gemeinsam',
  };
}
function vmFillOwnerSelects(){
  vmBuildOwnerLabel();
  ['ma-owner','mf-person'].forEach(function(selId){
    var sel=document.getElementById(selId);
    if(!sel)return;
    var cur=sel.value;
    sel.innerHTML=
      '<option value="person_1">'+VM_OWNER_LABEL.person_1+'</option>'+
      '<option value="person_2">'+VM_OWNER_LABEL.person_2+'</option>'+
      '<option value="joint">Gemeinsam</option>';
    sel.value=cur||'person_1';
  });
}
var vmSnapAsset    = null;

// ── Automatische Kurs-Aktualisierung via Alpha Vantage ──────────────────────
// API-Key kostenlos auf alphavantage.co (25 Abfragen/Tag, CORS-bestätigt)
// Symbol-Format: Xetra-Kürzel + .DE (z.B. SPYI.DE, VWCE.DE) — kein Umbau nötig

function vmFetchWithTimeout(url, ms){
  var ctrl=typeof AbortController!=='undefined'?new AbortController():null;
  var timer=ctrl?setTimeout(function(){ctrl.abort();},ms):null;
  return fetch(url,ctrl?{cache:'no-store',signal:ctrl.signal}:{cache:'no-store'})
    .then(function(r){if(timer)clearTimeout(timer);if(!r.ok)throw new Error('HTTP '+r.status);return r;})
    .catch(function(e){if(timer)clearTimeout(timer);throw e;});
}

function vmFetchPrice(ticker){
  var apiKey=FP.Store.Settings.getApiKey('alphavantage');
  if(!apiKey){
    var err=new Error('Kein API-Key — bitte in Einstellungen hinterlegen');
    appLog('ERROR',err.message);
    return Promise.reject(err);
  }
  var url='https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol='
    +encodeURIComponent(ticker)+'&apikey='+encodeURIComponent(apiKey);
  appLog('INFO','Kursabruf: '+ticker);
  return vmFetchWithTimeout(url,15000)
    .then(function(r){return r.json();})
    .then(function(d){
      appLog('INFO','Antwort für '+ticker+': '+JSON.stringify(d));
      if(d&&d.Information) throw new Error('API-Limit oder Key ungültig: '+d.Information.slice(0,80));
      if(d&&d.Note) throw new Error('Rate-Limit: '+d.Note.slice(0,80));
      var q=d&&d['Global Quote'];
      if(!q||!q['05. price']) throw new Error('Kein Kurs — Symbol unbekannt oder Markt geschlossen');
      var price=parseFloat(q['05. price']);
      if(!price||isNaN(price)||price<=0) throw new Error('Ungültiger Kurs für '+ticker);
      var date=q['07. latest trading day']||'';
      appLog('INFO','✓ '+ticker+' = '+price+' ('+date+')');
      return {price:price, currency:'EUR', symbol:ticker, date:date};
    })
    .catch(function(e){
      appLog('ERROR',ticker+': '+e.message);
      throw e;
    });
}

function vmRefreshPrices(){
  var btn=document.getElementById('vm-refresh-btn');
  if(btn){btn.disabled=true;btn.textContent='Lädt …';}

  if(!FP.Store.Settings.getApiKey('alphavantage')){
    if(btn){btn.disabled=false;btn.textContent='↻ Kurse aktualisieren';}
    toast('Kein API-Key — bitte unter Einstellungen hinterlegen');
    return;
  }

  var assets=FP.Store.Assets.getActive().filter(function(a){
    return a.ticker&&a.shares;
  });
  var esppTicker=(FP.Store.get().espp&&FP.Store.get().espp.settings&&FP.Store.get().espp.settings.ticker)||'';

  if(!assets.length&&!esppTicker){
    if(btn){btn.disabled=false;btn.textContent='↻ Kurse aktualisieren';}
    toast('Keine Anlagen mit Ticker und Anteilen gefunden');
    return;
  }

  var today=new Date();
  var mm=String(today.getMonth()+1).padStart(2,'0')+'.'+today.getFullYear();
  var updated=0, failed=[];

  // Alpha Vantage: max 1 Anfrage/Sekunde — sequenziell mit 1,5s Abstand
  function fetchNext(i){
    if(i>=assets.length){
      // ESPP-Kurs am Ende mitaktualisieren wenn Ticker vorhanden
      if(esppTicker){
        esppFetchAktKurs(function(){
          if(btn){btn.disabled=false;btn.textContent='↻ Kurse aktualisieren';}
          vmRender();
          var msg=updated+' Kurs'+(updated!==1?'e':'')+' aktualisiert';
          if(failed.length) msg+=' · '+failed.length+' fehlgeschlagen';
          toast(msg+' (inkl. ESPP)');
        });
      } else {
        if(btn){btn.disabled=false;btn.textContent='↻ Kurse aktualisieren';}
        vmRender();
        if(updated>0&&failed.length===0) toast(updated+' Kurs'+(updated>1?'e':'')+' aktualisiert');
        else if(updated>0) toast(updated+' aktualisiert, '+failed.length+' fehlgeschlagen');
        else toast('Kursabruf fehlgeschlagen — Details im Log (Einstellungen)');
      }
      return;
    }
    var asset=assets[i];
    var shares=asset.shares||null;
    if(btn) btn.textContent='Lädt '+(i+1)+'/'+assets.length+' …';
    vmFetchPrice(asset.ticker)
      .then(function(result){
        var value=shares?r2(result.price*shares):r2(result.price);
        FP.Store.Assets.addSnapshot(asset.id,mm,value,shares);
        updated++;
      })
      .catch(function(e){
        var msg=e&&e.message?e.message:'Unbekannt';
        failed.push(asset.name+': '+msg.slice(0,80));
      })
      .then(function(){
        setTimeout(function(){ fetchNext(i+1); }, 1500);
      });
  }
  fetchNext(0);
}

function vmInit(){ vmBuildOwnerLabel(); vmRender(); }

function vmRender(){
  vmRenderTotal();
  vmRenderCharts();
  vmRenderAssets();
  vmRenderFsa();
  esppRender();
}

function vmRenderCharts(){
  var el=document.getElementById('vm-charts');
  if(!el)return;
  var store=FP.Store.get();
  var assets=store.assets.filter(function(a){return a.status==='aktiv';});

  // ── Verlaufsdaten: alle Snapshots aller Assets nach Monat summieren ──
  var byMonth={};
  assets.forEach(function(asset){
    var snaps=asset.snapshots||[];
    snaps.forEach(function(s){
      if(!s.date||!s.value)return;
      byMonth[s.date]=(byMonth[s.date]||0)+s.value;
    });
  });
  var months=Object.keys(byMonth).sort(function(a,b){
    var pa=a.split('.'),pb=b.split('.');
    return (parseInt(pa[1])*100+parseInt(pa[0]))-(parseInt(pb[1])*100+parseInt(pb[0]));
  });

  // ── Asset-Balken: aktuelle Werte ──
  var s=FP.Calculator.getAssetSummary();
  var items=s.items.filter(function(i){return i.value>0;}).slice();
  var esppVal=s.byType['espp']||0;
  if(esppVal>0) items.push({id:'__espp__',name:'ESPP (Fidelity)',type:'espp',value:esppVal});
  items.sort(function(a,b){return b.value-a.value;});
  var total=s.total||1;

  var barsHtml=items.map(function(item){
    var color=VM_TYPE_COLOR[item.type]||'#94A3B8';
    var pct=(item.value/total*100).toFixed(1);
    return '<div class="vm-bar-row">'+
      '<div class="vm-bar-lbl" title="'+item.name+'">'+item.name+'</div>'+
      '<div class="vm-bar-track"><div class="vm-bar-fill" style="width:'+pct+'%;background:'+color+'"></div></div>'+
      '<div class="vm-bar-val">'+eur(item.value)+'</div>'+
    '</div>';
  }).join('');

  el.innerHTML=(items.length?'<div class="vm-chart-title">Anlagen im Überblick</div>'+barsHtml:'');
}

function vmDrawTrend(canvas, pts){
  var ctx=canvas.getContext('2d');
  var dpr=devicePixelRatio||1;
  var W=canvas.width/dpr, H=canvas.height/dpr;
  var PAD={t:12,r:16,b:28,l:60};
  var cW=W-PAD.l-PAD.r, cH=H-PAD.t-PAD.b;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.scale(dpr,dpr);
  var cs=getComputedStyle(document.documentElement);
  var cBlue=cs.getPropertyValue('--blue').trim()||'oklch(55% 0.24 262)';
  var cTx3=cs.getPropertyValue('--tx3').trim()||'#AEAEB2';

  var vals=pts.map(function(p){return p.value;});
  var minV=Math.min.apply(null,vals)*0.97;
  var maxV=Math.max.apply(null,vals)*1.03;
  var rng=maxV-minV||1;

  function xOf(i){return PAD.l+i/(pts.length-1)*cW;}
  function yOf(v){return PAD.t+cH-(v-minV)/rng*cH;}

  // Füllfläche
  var grad=ctx.createLinearGradient(0,PAD.t,0,PAD.t+cH);
  var _blueVal=getComputedStyle(document.documentElement).getPropertyValue('--blue-glow').trim()||'oklch(52% 0.22 268 / .2)';
  grad.addColorStop(0,_blueVal);
  grad.addColorStop(1,'transparent');
  ctx.beginPath();
  ctx.moveTo(xOf(0),yOf(pts[0].value));
  pts.forEach(function(p,i){if(i>0)ctx.lineTo(xOf(i),yOf(p.value));});
  ctx.lineTo(xOf(pts.length-1),PAD.t+cH);
  ctx.lineTo(xOf(0),PAD.t+cH);
  ctx.closePath();
  ctx.fillStyle=grad;
  ctx.fill();

  // Linie
  ctx.beginPath();
  ctx.moveTo(xOf(0),yOf(pts[0].value));
  pts.forEach(function(p,i){if(i>0)ctx.lineTo(xOf(i),yOf(p.value));});
  ctx.strokeStyle=cBlue;
  ctx.lineWidth=2.5;
  ctx.lineJoin='round';
  ctx.stroke();

  // Punkte + Labels X-Achse (jeden 2. oder 3. anzeigen)
  var step=Math.ceil(pts.length/6);
  ctx.font='11px Inter,system-ui,sans-serif';
  ctx.fillStyle=cTx3;
  ctx.textAlign='center';
  pts.forEach(function(p,i){
    // Punkt
    ctx.beginPath();
    ctx.arc(xOf(i),yOf(p.value),3,0,Math.PI*2);
    ctx.fillStyle=cBlue;
    ctx.fill();
    // X-Label
    if(i%step===0||i===pts.length-1){
      ctx.fillStyle='#8E8E93';
      ctx.fillText(p.label,xOf(i),H-4);
    }
  });

  // Y-Achse: min + max
  ctx.textAlign='right';
  ctx.fillStyle='#8E8E93';
  ctx.font='11px Inter,system-ui,sans-serif';
  ctx.fillText(eur(maxV),PAD.l-6,PAD.t+8);
  ctx.fillText(eur(minV),PAD.l-6,PAD.t+cH+4);

  ctx.setTransform(1,0,0,1,0,0);
}

function vmRenderTotal(){
  var el=document.getElementById('vm-total');
  if(!el)return;
  var store=FP.Store.get();
  var s=FP.Calculator.getAssetSummary();
  var total=s.total;

  var segs=Object.entries(s.byType).filter(function(e){return e[1]>0;}).map(function(e){
    return {type:e[0],value:e[1],pct:total>0?e[1]/total*100:0,color:VM_TYPE_COLOR[e[0]]||'#94A3B8',label:VM_TYPE_LABEL[e[0]]||e[0]};
  }).sort(function(a,b){return b.value-a.value;});

  if(!segs.length){
    el.innerHTML='<div class="vm-total-lbl">Gesamtvermögen</div><div class="vm-total-val">–</div>';
    return;
  }

  // Portfolio Rendite
  var totalCostBasis=0;
  store.assets.filter(function(a){return a.status==='aktiv'&&a.costBasis>0;}).forEach(function(a){totalCostBasis+=a.costBasis;});
  var portfolioGain=totalCostBasis>0?r2(total-totalCostBasis):null;
  var portfolioGainPct=totalCostBasis>0?(total-totalCostBasis)/totalCostBasis*100:null;

  // byMonth für Trendchart — Forward-Fill: letzter bekannter Wert pro Asset je Monat
  var activeAssets=store.assets.filter(function(a){return a.status==='aktiv';});
  function vmCmpDate(a,b){var pa=a.split('.'),pb=b.split('.');return(parseInt(pa[1])*100+parseInt(pa[0]))-(parseInt(pb[1])*100+parseInt(pb[0]));}
  var allDatesSet={};
  activeAssets.forEach(function(asset){(asset.snapshots||[]).forEach(function(snap){if(snap.date&&snap.value)allDatesSet[snap.date]=1;});});
  var months=Object.keys(allDatesSet).sort(vmCmpDate);
  var hasTrend=months.length>=2;
  var trendPts=months.map(function(m){
    var total=0,breakdown=[];
    activeAssets.forEach(function(asset){
      var snaps=(asset.snapshots||[]).filter(function(s){return s.date&&s.value&&vmCmpDate(s.date,m)<=0;});
      if(!snaps.length)return;
      snaps.sort(function(a,b){return vmCmpDate(a.date,b.date);});
      var lv=snaps[snaps.length-1].value;
      total+=lv;
      breakdown.push({name:asset.name,value:lv,type:asset.type||'sonstiges'});
    });
    return{label:m,value:total,breakdown:breakdown};
  });

  // Legend (single column für schmalere Donut-Spalte)
  var legHtml=segs.map(function(sg,i){
    return '<div class="vm-dleg" data-i="'+i+'" onmouseenter="vmDonutHighlight('+i+')" onmouseleave="vmDonutHighlight(-1)">'+
      '<div style="width:9px;height:9px;border-radius:3px;background:'+sg.color+';flex-shrink:0"></div>'+
      '<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;color:var(--tx2)">'+sg.label+'</span>'+
      '<span style="font-size:11px;font-weight:700;color:var(--tx);font-family:var(--mono);white-space:nowrap">'+eur(sg.value)+'</span>'+
      '<span style="font-size:10px;color:var(--tx3);min-width:28px;text-align:right;flex-shrink:0">'+sg.pct.toFixed(1)+'%</span>'+
    '</div>';
  }).join('');

  // CSS einmalig
  if(!document.getElementById('_vm-layout-css')){
    var _s=document.createElement('style');
    _s.id='_vm-layout-css';
    _s.textContent=
      '.vm-ti{display:flex;gap:20px;align-items:flex-start}'+
      '.vm-dc{flex-shrink:0;width:196px}'+
      '.vm-tc{flex:1;min-width:0}'+
      '.vm-dleg{display:flex;align-items:center;gap:5px;padding:3px 4px;border-radius:6px;cursor:default;transition:background .1s,opacity .1s}'+
      '@media(max-width:560px){.vm-ti{flex-direction:column}.vm-dc,.vm-tc{width:100%!important}}';
    document.head.appendChild(_s);
  }

  el.innerHTML=
    '<div class="vm-ti">'+
      '<div class="vm-dc" id="vm-donut-col">'+
        '<canvas id="vm-donut-canvas" style="display:block;margin:0 auto;cursor:default"></canvas>'+
        '<div id="vm-dleg-wrap" style="margin-top:10px;border-top:1px solid var(--brd);padding-top:8px;display:flex;flex-direction:column;text-align:left">'+legHtml+'</div>'+
        (totalCostBasis>0
          ?'<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--brd)">'+
              '<div style="font-size:10px;color:var(--tx3)">Einstand '+eur(totalCostBasis)+'</div>'+
              '<div style="font-size:12px;font-weight:700;color:'+(portfolioGain>=0?'var(--green)':'var(--red)')+'">'+
                (portfolioGain>=0?'+':'')+eur(portfolioGain)+' ('+portfolioGainPct.toFixed(1)+'%)'+
              '</div></div>'
          :'')+
      '</div>'+
      '<div class="vm-tc" id="vm-trend-col">'+
        '<div style="font-size:11px;font-weight:600;color:var(--tx3);margin-bottom:4px;padding-left:52px">Vermögensentwicklung</div>'+
        (hasTrend
          ?'<canvas id="vm-trend-canvas-r" style="display:block;width:100%"></canvas>'
          :'<div style="height:250px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px;border:1.5px dashed var(--brd);border-radius:10px;color:var(--tx3)">'+
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:32px;height:32px;opacity:0.4"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>'+
            '<div style="font-size:11px;text-align:center;line-height:1.6">Verlauf erscheint nach dem<br>ersten monatlichen Kurs-Update</div>'+
            '</div>')+
      '</div>'+
    '</div>';

  requestAnimationFrame(function(){
    // Donut
    var donutCol=document.getElementById('vm-donut-col');
    var canvas=document.getElementById('vm-donut-canvas');
    if(!canvas)return;
    var dpr=window.devicePixelRatio||1;
    var W=Math.max(Math.min(donutCol?donutCol.clientWidth-4:190,200),120);
    canvas.width=W*dpr; canvas.height=W*dpr;
    canvas.style.width=W+'px'; canvas.style.height=W+'px';

    var cx=W/2,cy=W/2,R=W/2-6,ri=Math.round(R*0.60);
    var gap=segs.length>1?0.024:0;
    var hovIdx=-1;

    var angle=-Math.PI/2;
    segs.forEach(function(sg){
      sg._s=angle+gap/2;
      sg._w=Math.max(sg.pct/100*Math.PI*2-gap,0.01);
      sg._e=sg._s+sg._w;
      angle+=sg._w+gap;
    });

    function cv(v){return getComputedStyle(document.documentElement).getPropertyValue(v).trim()||'';}

    function draw(hi){
      var ctx=canvas.getContext('2d');
      ctx.setTransform(1,0,0,1,0,0);
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      var tx=cv('--tx')||'#111';
      var tx3=cv('--tx3')||'#888';

      segs.forEach(function(sg,i){
        ctx.beginPath();
        ctx.arc(cx,cy,R+(hi===i?5:0),sg._s,sg._e);
        ctx.arc(cx,cy,ri,sg._e,sg._s,true);
        ctx.closePath();
        ctx.fillStyle=sg.color;
        ctx.globalAlpha=(hi>=0&&hi!==i)?0.4:1;
        ctx.fill();
      });
      ctx.globalAlpha=1;

      ctx.globalCompositeOperation='destination-out';
      ctx.beginPath();ctx.arc(cx,cy,ri,0,Math.PI*2);
      ctx.fill();
      ctx.globalCompositeOperation='source-over';

      ctx.textAlign='center';ctx.textBaseline='middle';
      var fs1=Math.max(Math.round(W*0.054),9);
      var fs2=Math.max(Math.round(W*0.090),14);
      var lbl,val,valColor;
      if(hi>=0&&segs[hi]){lbl=segs[hi].label;val=eur(segs[hi].value);valColor=segs[hi].color;}
      else{lbl='Gesamtvermögen';val=eur(total);valColor=tx;}
      ctx.font='700 '+fs2+'px Inter,system-ui,sans-serif';
      while(ctx.measureText(val).width>ri*1.75&&fs2>10){fs2--;ctx.font='700 '+fs2+'px Inter,system-ui,sans-serif';}
      ctx.fillStyle=tx3;ctx.font='500 '+fs1+'px Inter,system-ui,sans-serif';
      ctx.fillText(lbl,cx,cy-Math.round(W*0.105));
      ctx.fillStyle=valColor;ctx.font='700 '+fs2+'px Inter,system-ui,sans-serif';
      ctx.fillText(val,cx,cy+Math.round(W*0.028));
    }

    canvas._donut={draw:draw};
    draw(-1);

    function hitSeg(e){
      var rect=canvas.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(W/rect.width);
      var my=(e.clientY-rect.top)*(W/rect.height);
      var dx=mx-cx,dy=my-cy,d=Math.sqrt(dx*dx+dy*dy);
      if(d<ri||d>R+8)return -1;
      var a=Math.atan2(dy,dx);if(a<-Math.PI/2)a+=Math.PI*2;
      for(var i=0;i<segs.length;i++){if(a>=segs[i]._s&&a<segs[i]._e)return i;}
      return -1;
    }

    canvas.onmousemove=function(e){
      var h=hitSeg(e);
      canvas.style.cursor=h>=0?'pointer':'default';
      if(h!==hovIdx){hovIdx=h;vmDonutHighlight(h);}
    };
    canvas.onmouseleave=function(){hovIdx=-1;vmDonutHighlight(-1);};

    // Trendchart rechts
    if(hasTrend){
      var tc=document.getElementById('vm-trend-canvas-r');
      var tcol=document.getElementById('vm-trend-col');
      if(tc&&tcol)vmDrawTrendRight(tc,trendPts,totalCostBasis);
    }
  });
}

function vmDonutHighlight(idx){
  var canvas=document.getElementById('vm-donut-canvas');
  if(canvas&&canvas._donut)canvas._donut.draw(idx);
  document.querySelectorAll('.vm-dleg').forEach(function(r,i){
    r.style.background=(idx>=0&&i===idx)?'var(--bg2,rgba(0,0,0,0.06))':'';
    r.style.opacity=(idx>=0&&i!==idx)?'0.4':'1';
  });
}

function vmDrawTrendRight(canvas,pts,costBasis){
  if(!pts||pts.length<1)return;

  // Alle Assets über alle Datenpunkte sammeln (Name → {type, farbe, werte[]})
  var assetMap={};
  pts.forEach(function(pt){
    (pt.breakdown||[]).forEach(function(b){
      if(!assetMap[b.name])assetMap[b.name]={type:b.type,values:[]};
    });
  });
  var assetNames=Object.keys(assetMap);
  // Farben zuweisen: je Asset eine eindeutige Farbe per Typ, mehrere desselben Typs mit Helligkeit gestaffelt
  var typeCount={};
  var PALETTE=['#3B82F6','#10B981','#F59E0B','#7C3AED','#EC4899','#0891B2','#059669','#2563EB','#D97706','#6D28D9','#DB2777','#0E7490'];
  var palIdx=0;
  assetNames.forEach(function(n){
    var type=assetMap[n].type;
    var base=VM_TYPE_COLOR[type]||PALETTE[palIdx%PALETTE.length];
    typeCount[type]=(typeCount[type]||0)+1;
    assetMap[n].color=base;
    palIdx++;
  });

  // Pro Asset die Werte je Datenpunkt (0 wenn nicht vorhanden)
  assetNames.forEach(function(n){
    assetMap[n].values=pts.map(function(pt){
      var found=(pt.breakdown||[]).find(function(b){return b.name===n;});
      return found?found.value:0;
    });
  });

  var dpr=window.devicePixelRatio||1;
  var W=Math.max(canvas.parentElement?canvas.parentElement.clientWidth||280:280,100);
  var LEGEND_H=assetNames.length>1?Math.ceil(assetNames.length/2)*18+8:0;
  var H=250+LEGEND_H;
  canvas.width=W*dpr; canvas.height=H*dpr;
  canvas.style.width=W+'px'; canvas.style.height=H+'px';
  canvas.style.cursor='crosshair';

  var pL=52,pR=14,pT=12,pB=30+LEGEND_H;
  var cW=W-pL-pR,cH=H-pT-pB;

  var allVals=pts.map(function(p){return p.value;});
  if(costBasis>0)allVals.push(costBasis);
  var minV=Math.min.apply(null,allVals.filter(function(v){return v>0;}))||0;
  var maxV=Math.max.apply(null,allVals)||1;
  var vRange=maxV-minV||1;
  minV=Math.max(0,minV-vRange*0.08);
  maxV=maxV+vRange*0.05;
  vRange=maxV-minV;

  function vy(v){return pT+cH*(1-(v-minV)/vRange);}
  function vx(i){return pL+(pts.length<2?cW/2:i/(pts.length-1)*cW);}

  var cs=getComputedStyle(document.documentElement);
  var brd=cs.getPropertyValue('--brd').trim()||'#E5E7EB';
  var tx=cs.getPropertyValue('--tx').trim()||'#111';
  var tx2=cs.getPropertyValue('--tx2').trim()||'#555';
  var tx3=cs.getPropertyValue('--tx3').trim()||'#888';
  var surf=cs.getPropertyValue('--surf').trim()||'#fff';
  var totalColor='#64748B';

  function draw(hi){
    var ctx=canvas.getContext('2d');
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.setTransform(dpr,0,0,dpr,0,0);

    // Grid + Y-Labels
    var nGrid=4;
    for(var g=0;g<=nGrid;g++){
      var gv=minV+(g/nGrid)*vRange,gy=vy(gv);
      ctx.strokeStyle=brd;ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(pL,gy);ctx.lineTo(W-pR,gy);ctx.stroke();
      ctx.fillStyle=tx3;ctx.font='500 10px Inter,system-ui,sans-serif';
      ctx.textAlign='right';ctx.textBaseline='middle';
      ctx.fillText(vmFmtK(gv),pL-5,gy);
    }

    // Einstandslinie
    if(costBasis>0){
      var cy2=vy(costBasis);
      ctx.strokeStyle='#94A3B8';ctx.lineWidth=1.5;ctx.setLineDash([5,4]);
      ctx.beginPath();ctx.moveTo(pL,cy2);ctx.lineTo(W-pR,cy2);ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle='#94A3B8';ctx.font='500 9px Inter,system-ui,sans-serif';
      ctx.textAlign='left';ctx.textBaseline='bottom';
      ctx.fillText('Einstand',pL+3,cy2-2);
    }

    // Hover-Vertikale
    if(hi>=0&&hi<pts.length){
      ctx.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--brd').trim()||'rgba(0,0,0,0.10)';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(vx(hi),pT);ctx.lineTo(vx(hi),pT+cH);ctx.stroke();
    }

    // Einzellinien pro Asset (nur wenn mehr als 1)
    if(assetNames.length>1){
      assetNames.forEach(function(n){
        var aData=assetMap[n];
        var hasData=aData.values.some(function(v){return v>0;});
        if(!hasData)return;
        ctx.beginPath();
        var started=false;
        aData.values.forEach(function(v,i){
          if(v<=0)return;
          if(!started){ctx.moveTo(vx(i),vy(v));started=true;}
          else ctx.lineTo(vx(i),vy(v));
        });
        ctx.strokeStyle=aData.color;
        ctx.lineWidth=hi>=0?1.5:2;
        ctx.globalAlpha=hi>=0?0.5:0.85;
        ctx.lineJoin='round';
        ctx.stroke();
        ctx.globalAlpha=1;
      });
    }

    // Gesamtlinie (dicker, im Vordergrund)
    ctx.beginPath();
    pts.forEach(function(p,i){if(i===0)ctx.moveTo(vx(0),vy(p.value));else ctx.lineTo(vx(i),vy(p.value));});
    ctx.strokeStyle=assetNames.length===1?(assetMap[assetNames[0]]&&assetMap[assetNames[0]].color||totalColor):totalColor;
    ctx.lineWidth=assetNames.length===1?2.5:3;
    ctx.lineJoin='round';
    ctx.stroke();

    // Punkte auf Gesamtlinie
    pts.forEach(function(p,i){
      ctx.beginPath();ctx.arc(vx(i),vy(p.value),hi===i?5:2.5,0,Math.PI*2);
      ctx.fillStyle=assetNames.length===1?(assetMap[assetNames[0]]&&assetMap[assetNames[0]].color||totalColor):totalColor;
      ctx.fill();
      if(hi===i){ctx.strokeStyle=surf;ctx.lineWidth=2;ctx.stroke();}
    });

    // X-Labels
    ctx.font='500 10px Inter,system-ui,sans-serif';ctx.fillStyle=tx3;ctx.textBaseline='top';
    var step=Math.max(1,Math.ceil(pts.length/5));
    var shown={};
    for(var xi=0;xi<pts.length;xi+=step){
      shown[xi]=1;
      var lx=vx(xi),ta='center';
      if(lx<pL+20){lx=pL;ta='left';}
      else if(lx>W-pR-20){lx=W-pR;ta='right';}
      ctx.textAlign=ta;ctx.fillText(pts[xi].label,lx,pT+cH+5);
    }
    if(!shown[pts.length-1]){ctx.textAlign='right';ctx.fillText(pts[pts.length-1].label,W-pR,pT+cH+5);}

    // Legende
    if(assetNames.length>1){
      var legY=H-LEGEND_H+4;
      var cols=2,colW=Math.floor(W/cols);
      assetNames.forEach(function(n,i){
        var col=i%cols,row=Math.floor(i/cols);
        var lx2=col*colW+pL,ly2=legY+row*18;
        ctx.beginPath();ctx.arc(lx2+4,ly2+5,4,0,Math.PI*2);
        ctx.fillStyle=assetMap[n].color;ctx.globalAlpha=0.9;ctx.fill();ctx.globalAlpha=1;
        var label=n.length>22?n.slice(0,21)+'…':n;
        ctx.font='500 10px Inter,system-ui,sans-serif';ctx.fillStyle=tx2;
        ctx.textAlign='left';ctx.textBaseline='middle';
        ctx.fillText(label,lx2+12,ly2+5);
      });
    } else if(assetNames.length===1){
      // Einzelner Asset: Name als Titel
      var sName=assetNames[0];
      ctx.font='600 10px Inter,system-ui,sans-serif';ctx.fillStyle=assetMap[sName].color;
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(sName,pL+cW/2,H-8);
    }

    // Hover-Tooltip
    if(hi>=0&&hi<pts.length){
      var hp=pts[hi],hxc=vx(hi),hyc=vy(hp.value);
      var bd=(hp.breakdown||[]).sort(function(a,b){return b.value-a.value;}).slice(0,6);
      var lines=[hp.label,'Gesamt: '+eur(hp.value)];
      bd.forEach(function(b){
        var nm=b.name.length>18?b.name.slice(0,17)+'…':b.name;
        lines.push(nm+': '+eur(b.value));
      });
      if((hp.breakdown||[]).length>6)lines.push('+'+(hp.breakdown.length-6)+' weitere');

      ctx.font='500 10px Inter,system-ui,sans-serif';
      var maxTW=0;lines.forEach(function(l){var fw=ctx.measureText(l).width;if(fw>maxTW)maxTW=fw;});
      var ttPad=9,ttLH=15,ttW=maxTW+ttPad*2+4,ttH=lines.length*ttLH+ttPad*2;
      var ttX=hxc+12,ttY=Math.max(pT+2,hyc-ttH/2);
      if(ttX+ttW>W-2)ttX=hxc-ttW-12;
      if(ttY+ttH>pT+cH-2)ttY=pT+cH-ttH-2;
      if(ttY<pT)ttY=pT;

      ctx.save();
      ctx.shadowColor='oklch(0% 0 0 / 0.13)';ctx.shadowBlur=10;ctx.shadowOffsetY=3;
      ctx.fillStyle=surf;
      var tr=7;
      ctx.beginPath();
      ctx.moveTo(ttX+tr,ttY);ctx.lineTo(ttX+ttW-tr,ttY);ctx.quadraticCurveTo(ttX+ttW,ttY,ttX+ttW,ttY+tr);
      ctx.lineTo(ttX+ttW,ttY+ttH-tr);ctx.quadraticCurveTo(ttX+ttW,ttY+ttH,ttX+ttW-tr,ttY+ttH);
      ctx.lineTo(ttX+tr,ttY+ttH);ctx.quadraticCurveTo(ttX,ttY+ttH,ttX,ttY+ttH-tr);
      ctx.lineTo(ttX,ttY+tr);ctx.quadraticCurveTo(ttX,ttY,ttX+tr,ttY);
      ctx.closePath();ctx.fill();ctx.restore();
      ctx.strokeStyle=brd;ctx.lineWidth=1;ctx.stroke();

      ctx.textAlign='left';ctx.textBaseline='top';
      lines.forEach(function(l,i){
        var ly=ttY+ttPad+i*ttLH;
        if(i===0){ctx.font='500 10px Inter,system-ui,sans-serif';ctx.fillStyle=tx3;}
        else if(i===1){ctx.font='700 11px Inter,system-ui,sans-serif';ctx.fillStyle=tx;}
        else{
          // Farbiger Punkt vor Asset-Zeile
          var bItem=(hp.breakdown||[]).find(function(b){var nm=b.name.length>18?b.name.slice(0,17)+'…':b.name;return nm+': '+eur(b.value)===l;});
          ctx.font='500 10px Inter,system-ui,sans-serif';
          ctx.fillStyle=bItem&&assetMap[bItem.name]?assetMap[bItem.name].color:tx2;
        }
        ctx.fillText(l,ttX+ttPad,ly);
      });
    }
  }

  canvas._trendHov=-1;
  draw(-1);

  canvas.onmousemove=function(e){
    var r=canvas.getBoundingClientRect(),mx=(e.clientX-r.left)*(W/r.width);
    var ni=-1,nd=9999;
    pts.forEach(function(p,i){var d=Math.abs(vx(i)-mx);if(d<nd){nd=d;ni=i;}});
    var idx=nd<40?ni:-1;
    if(idx!==canvas._trendHov){canvas._trendHov=idx;draw(idx);}
  };
  canvas.onmouseleave=function(){canvas._trendHov=-1;draw(-1);};
}

function vmFmtK(v){
  if(v>=1000000)return (v/1000000).toFixed(1).replace('.0','')+'M';
  if(v>=1000)return Math.round(v/1000)+'K';
  return Math.round(v)+'';
}

function vmRenderAssets(){
  var el=document.getElementById('vm-assets');
  if(!el)return;
  var s=FP.Calculator.getAssetSummary();
  if(!s.items.length){
    el.innerHTML='<div style="grid-column:1/-1;padding:20px;text-align:center;color:var(--tx3);font-size:13px">Keine Anlagen vorhanden.</div>';
    return;
  }
  var esppVal=s.byType['espp']||0;
  var ec=VM_TYPE_COLOR['espp']||'var(--amber)';
  var esppTile='<div class="vm-asset" onclick="document.getElementById(\'vm-espp\').scrollIntoView({behavior:\'smooth\',block:\'start\'})" style="cursor:pointer">'+
    '<div class="vm-asset-top">'+
      '<div><div class="vm-asset-name">ESPP (Fidelity)</div></div>'+
      '<div style="display:flex;align-items:center;gap:6px">'+
        '<div class="vm-asset-type" style="color:'+ec+';background:'+ec+'22">ESPP</div>'+
      '</div>'+
    '</div>'+
    (esppVal>0
      ? '<div class="vm-asset-val" style="color:'+ec+'">'+eur(esppVal)+'</div>'+
        '<div class="vm-asset-meta">Gehaltene Zyklen · Details unten</div>'
      : '<div class="vm-asset-val" style="color:var(--tx3);font-size:15px">–</div>'+
        '<div class="vm-asset-meta">Noch keine Zyklen erfasst</div>')+
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">'+
      '<div class="vm-asset-owner">'+(VM_OWNER_LABEL['person_1']||'Person 1')+'</div>'+
      '<button onclick="event.stopPropagation();document.getElementById(\'vm-espp\').scrollIntoView({behavior:\'smooth\',block:\'start\'})" style="background:var(--surf2);border:1px solid var(--brd);border-radius:6px;padding:4px 10px;font-size:11px;font-weight:600;color:var(--tx2);cursor:pointer">Details ↓</button>'+
    '</div>'+
  '</div>';
  el.innerHTML=s.items.map(function(item){
    var color=VM_TYPE_COLOR[item.type]||'#94A3B8';
    var alpha=color+'22';
    var hasVal=item.value>0;
    var asset=FP.Store.Assets.getById(item.id);
    var isinHint=asset&&asset.isin?'<span style="font-size:10px;color:var(--tx3);font-family:var(--mono)">'+asset.isin+'</span>':'';

    // Performance badge
    var perfHtml='';
    if(asset&&asset.costBasis&&item.value>0){
      var gain=r2(item.value-asset.costBasis);
      var gainPct=(gain/asset.costBasis*100);
      var gc=gain>=0?'var(--green)':'var(--red)';
      var gs=gain>=0?'+':'';
      perfHtml='<div style="font-size:11px;font-weight:600;color:'+gc+';margin-top:4px">'+
        gs+eur(gain)+' ('+gs+gainPct.toFixed(1)+'%) · Einstand '+eur(asset.costBasis)+'</div>';
    }

    // Mini sparkline SVG
    var sparkHtml='';
    var snaps=asset&&asset.snapshots?asset.snapshots:[];
    if(snaps.length>=2){
      var sVals=snaps.map(function(s){return s.value;});
      var sMin=Math.min.apply(null,sVals),sMax=Math.max.apply(null,sVals);
      var sRange=sMax-sMin||1;
      var svgH=28,pad=4;
      var pts=snaps.map(function(s,i){
        var x=(i/(snaps.length-1)*100).toFixed(1);
        var y=(svgH-pad-(s.value-sMin)/sRange*(svgH-pad*2)).toFixed(1);
        return [x,y];
      });
      var isUp=snaps[snaps.length-1].value>=snaps[0].value;
      var _csVm=getComputedStyle(document.documentElement);
      var lc=isUp?_csVm.getPropertyValue('--green').trim()||'oklch(57% 0.2 295)':'var(--red)';
      var fc=isUp?_csVm.getPropertyValue('--green-lt').trim()||'oklch(95.5% 0.042 295)':_csVm.getPropertyValue('--red-lt').trim()||'oklch(97% 0.04 22)';
      var polyPts=pts.map(function(p){return p[0]+','+p[1];}).join(' ');
      var fillD='M0,'+svgH+' '+pts.map(function(p){return 'L'+p[0]+','+p[1];}).join(' ')+' L100,'+svgH+' Z';
      sparkHtml='<svg viewBox="0 0 100 '+svgH+'" preserveAspectRatio="none" style="display:block;width:100%;height:'+svgH+'px;margin:8px 0 2px;border-radius:4px;overflow:hidden">'+
        '<path d="'+fillD+'" fill="'+fc+'"/>'+
        '<polyline points="'+polyPts+'" fill="none" stroke="'+lc+'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'+
        '</svg>';
    }

    return '<div class="vm-asset">'+
      '<div class="vm-asset-top">'+
        '<div>'+
          '<div class="vm-asset-name">'+item.name+'</div>'+
          (isinHint?'<div style="margin-top:2px">'+isinHint+'</div>':'')+
        '</div>'+
        '<div style="display:flex;align-items:center;gap:6px">'+
          '<div class="vm-asset-type" style="color:'+color+';background:'+alpha+'">'+(VM_TYPE_LABEL[item.type]||item.type)+'</div>'+
          '<button onclick="vmEditAsset(\''+item.id+'\')" style="background:none;border:1px solid var(--brd);border-radius:6px;padding:2px 7px;font-size:11px;color:var(--tx3);cursor:pointer">✎</button>'+
          '<button onclick="vmDelAsset(event,\''+item.id+'\')" style="background:none;border:none;padding:2px 5px;font-size:13px;color:var(--tx3);cursor:pointer" title="Anlage löschen">✕</button>'+
        '</div>'+
      '</div>'+
      '<div class="vm-asset-val" style="color:'+(hasVal?color:'var(--tx3);font-size:15px')+'">'+eur(item.value)+'</div>'+
      '<div class="vm-asset-meta">'+(item.date?'Stand: '+item.date:'Noch kein Wert erfasst')+'</div>'+
      perfHtml+
      sparkHtml+
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">'+
        '<div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap">'+
          '<div class="vm-asset-owner">'+(VM_OWNER_LABEL[item.ownerId]||item.ownerId)+'</div>'+
          (asset&&asset.monthlyPlan
            ?'<div onclick="vmEditAsset(\''+item.id+'\')" style="display:inline-flex;align-items:center;padding:1px 6px;border-radius:99px;font-size:10px;font-weight:600;background:rgba(124,58,237,0.12);color:var(--purple);cursor:pointer" title="Sparplan bearbeiten">€'+asset.monthlyPlan+'/Mo</div>'
            :'')+
        '</div>'+
        '<button onclick="vmOpenSnapshot(\''+item.id+'\')" style="background:var(--blue);border:none;border-radius:6px;padding:4px 10px;font-size:11px;font-weight:600;color:var(--on-accent);cursor:pointer">+ Wert eintragen</button>'+
      '</div>'+
    '</div>';
  }).join('')+esppTile;
}

function vmDelAsset(evt,id){
  evt.stopPropagation();
  var asset=FP.Store.Assets.getById(id);
  var aname=asset?asset.name:id;
  confirmDialog('Anlage wirklich löschen?','Löschen',function(){
    FP.Store.Assets.delete(id);
    vmRender();
    appLog('VERMÖGEN', 'Gelöscht: '+aname);
    toast('Anlage gelöscht');
  });
}

function vmRenderFsa(){
  var el=document.getElementById('vm-fsa');
  if(!el)return;
  var s=FP.Calculator.getFreistellungSummary();
  var pct=s.freibetrag>0?Math.min(100,s.gesamt/s.freibetrag*100):0;
  var over=s.ausgeschoepft;
  var listHtml=s.items.length?'<div class="vm-fsa-list">'+s.items.map(function(f){
    var pl=VM_OWNER_LABEL[f.personId]||f.personId;
    return '<div class="vm-fsa-row">'+
      '<div class="vm-fsa-inst">'+f.institution+
        '<span style="font-size:10px;color:var(--tx3);margin-left:6px">'+pl+'</span>'+
      '</div>'+
      '<div class="vm-fsa-amt">'+eur(f.betrag)+'</div>'+
      '<button class="vm-fsa-del" onclick="vmDelFsa(event,\''+f.id+'\')">🗑</button>'+
      '</div>';
  }).join('')+'</div>':'<div style="padding:12px 16px;color:var(--tx3);font-size:13px">Noch keine Aufträge erfasst.</div>';
  el.innerHTML='<div class="vm-fsa-bar-wrap">'+
    '<div class="vm-fsa-bar-track"><div class="vm-fsa-bar-fill'+(over?' over':'')+'" style="width:'+pct.toFixed(1)+'%"></div></div>'+
    '<div class="vm-fsa-nums"><span>'+eur(s.gesamt)+' vergeben</span><span style="color:'+(over?'var(--red)':'var(--tx3)')+'">'+eur(s.verfuegbar)+' verfügbar</span><span>Max. '+eur(s.freibetrag)+'</span></div>'+
    '</div>'+listHtml+
    '<div style="padding:12px 16px;border-top:1px solid var(--brd)">'+
      '<button class="vm-add-btn" onclick="vmOpenFsa()">+ Freistellungsauftrag hinzufügen</button>'+
    '</div>';
}

function vmOpenSnapshot(assetId){
  vmSnapAsset=assetId;
  var asset=FP.Store.Assets.getById(assetId);
  var snap=FP.Store.Assets.getLatestSnapshot(assetId);
  var today=new Date();
  var mm=String(today.getMonth()+1).padStart(2,'0')+'.'+today.getFullYear();
  document.getElementById('ms-ttl').textContent=asset?asset.name:'Wert erfassen';
  document.getElementById('ms-date').value=mm;
  document.getElementById('ms-value').value='';
  document.getElementById('ms-fetch-result').textContent='';

  var hasTicker=asset&&asset.ticker;
  document.getElementById('ms-fetch-row').style.display=hasTicker?'':'none';
  document.getElementById('ms-value-row').style.display=hasTicker?'none':'';
  var info=document.getElementById('ms-isin-info');
  if(hasTicker){
    var shares=asset.shares||0;
    info.style.display='';
    info.textContent='Ticker: '+asset.ticker+(shares?' · '+shares+' Anteile':'  · Bitte Anteile im ✎ Bearbeiten hinterlegen');
  } else {
    info.style.display='none';
  }
  openM('m-snapshot');
}

function vmFetchAndFill(){
  var asset=FP.Store.Assets.getById(vmSnapAsset);
  if(!asset||!asset.ticker){toast('Kein Ticker hinterlegt — bitte im ✎ Bearbeiten eintragen');return;}
  var shares=asset.shares;
  if(!shares){toast('Bitte Anzahl Anteile im ✎ Bearbeiten hinterlegen');return;}
  var btn=document.getElementById('ms-fetch-btn');
  var res=document.getElementById('ms-fetch-result');
  btn.disabled=true;btn.textContent='Lädt …';
  res.style.color='var(--tx3)';res.textContent='Rufe Kurs für '+asset.ticker+' ab …';
  vmFetchPrice(asset.ticker)
    .then(function(result){
      var value=r2(result.price*shares);
      document.getElementById('ms-value').value=value;
      document.getElementById('ms-value-row').style.display='';
      res.style.color='var(--green)';
      res.textContent='✓ '+result.symbol+' · '+result.price.toFixed(2)+' '+result.currency+' × '+shares+' = '+eur(value);
      btn.disabled=false;btn.textContent='↻ Kurs erneut abrufen';
    })
    .catch(function(e){
      res.style.color='var(--red)';
      res.textContent='Fehler: '+(e.message||'Kurs nicht verfügbar');
      btn.disabled=false;btn.textContent='↻ Erneut versuchen';
    });
}

function vmSaveSnapshot(){
  if(!vmSnapAsset)return;
  var date=document.getElementById('ms-date').value.trim();
  var value=parseFloat(document.getElementById('ms-value').value)||0;
  var asset=FP.Store.Assets.getById(vmSnapAsset);
  var shares=asset?asset.shares:null;
  if(!date||!value){toast('Datum und Wert eingeben');return;}
  FP.Store.Assets.addSnapshot(vmSnapAsset,date,value,shares||null);
  closeM('m-snapshot');
  vmRender();
  toast('Wert gespeichert');
}

function vmOpenFsa(){
  vmFillOwnerSelects();
  document.getElementById('mf-id').value='';
  document.getElementById('mf-inst').value='';
  document.getElementById('mf-betrag').value='';
  document.getElementById('mf-person').value='person_1';
  openM('m-fsa');
  setTimeout(function(){document.getElementById('mf-inst').focus();},150);
}

function vmSaveFsa(){
  var id=document.getElementById('mf-id').value;
  var data={
    institution:document.getElementById('mf-inst').value.trim(),
    betrag:parseFloat(document.getElementById('mf-betrag').value)||0,
    personId:document.getElementById('mf-person').value
  };
  if(!data.institution||!data.betrag){toast('Institution und Betrag eingeben');return;}
  if(id){FP.Store.Freistellung.update(id,data);appLog('VERMÖGEN','Freistellungsauftrag aktualisiert: '+data.institution+' '+eur(data.betrag));}
  else  {FP.Store.Freistellung.add(data);appLog('VERMÖGEN','Freistellungsauftrag hinzugefügt: '+data.institution+' '+eur(data.betrag));}
  closeM('m-fsa');
  vmRender();
  toast('Gespeichert');
}

function vmDelFsa(evt,id){
  evt.stopPropagation();
  FP.Store.Freistellung.delete(id);
  appLog('VERMÖGEN','Freistellungsauftrag gelöscht: '+id);
  vmRender();
  toast('Gelöscht');
}

// Zeigt/versteckt Wertpapier-Felder je nach Typ
var MA_MANUAL_TYPES = ['immobilie','tagesgeld','girokonto','sonstiges'];
function maOnTypeChange(){
  var type=document.getElementById('ma-type').value;
  var show=MA_MANUAL_TYPES.indexOf(type)===-1;
  document.getElementById('ma-security-fields').style.display=show?'':'none';
}

function vmOpenNewAsset(){
  vmFillOwnerSelects();
  document.getElementById('ma-id').value='';
  document.getElementById('ma-ttl').textContent='Neue Anlage';
  document.getElementById('ma-save-btn').textContent='Anlegen';
  document.getElementById('ma-name').value='';
  document.getElementById('ma-type').value='etf';
  document.getElementById('ma-owner').value='person_1';
  document.getElementById('ma-wkn').value='';
  document.getElementById('ma-isin').value='';
  document.getElementById('ma-ticker').value='';
  document.getElementById('ma-shares').value='';
  document.getElementById('ma-costbasis').value='';
  document.getElementById('ma-monthlyplan').value='';
  maOnTypeChange();
  openM('m-asset');
  setTimeout(function(){document.getElementById('ma-name').focus();},150);
}

function vmEditAsset(id){
  vmFillOwnerSelects();
  var a=FP.Store.Assets.getById(id);
  if(!a)return;
  document.getElementById('ma-id').value=id;
  document.getElementById('ma-ttl').textContent='Anlage bearbeiten';
  document.getElementById('ma-save-btn').textContent='Speichern';
  document.getElementById('ma-name').value=a.name||'';
  document.getElementById('ma-type').value=a.type||'etf';
  document.getElementById('ma-owner').value=a.ownerId||'person_1';
  document.getElementById('ma-wkn').value=a.wkn||'';
  document.getElementById('ma-isin').value=a.isin||'';
  document.getElementById('ma-ticker').value=a.ticker||'';
  document.getElementById('ma-shares').value=a.shares||'';
  document.getElementById('ma-costbasis').value=a.costBasis||'';
  document.getElementById('ma-monthlyplan').value=a.monthlyPlan||'';
  maOnTypeChange();
  openM('m-asset');
  setTimeout(function(){document.getElementById('ma-name').focus();},150);
}

function vmSaveAsset(){
  var id=document.getElementById('ma-id').value;
  var name=document.getElementById('ma-name').value.trim();
  if(!name){toast('Name eingeben');return;}
  var shares=parseFloat(document.getElementById('ma-shares').value)||null;
  var data={
    name:name,
    type:document.getElementById('ma-type').value,
    ownerId:document.getElementById('ma-owner').value,
    wkn:document.getElementById('ma-wkn').value.trim(),
    isin:document.getElementById('ma-isin').value.trim().toUpperCase(),
    ticker:document.getElementById('ma-ticker').value.trim().toUpperCase(),
    shares:shares,
    currency:'EUR',
    costBasis:parseFloat(document.getElementById('ma-costbasis').value)||null,
    monthlyPlan:parseFloat(document.getElementById('ma-monthlyplan').value)||null
  };
  if(id){
    var a=FP.Store.Assets.getById(id);
    if(a){Object.assign(a,data);FP.Store.save();}
    appLog('VERMÖGEN', 'Bearbeitet: '+name);
    toast('Gespeichert');
  } else {
    FP.Store.Assets.add(data);
    appLog('VERMÖGEN', 'Neue Anlage: '+name+' ('+data.type+')');
    toast('Anlage erstellt');
  }
  closeM('m-asset');
  vmRender();
}

/* ════════════════════════════════════════
   GEHALT TAB
════════════════════════════════════════ */
var ghS={year:new Date().getFullYear(),person:'person_1'};
var ghEditMonth=null;

function ghInit(){
  ghS.year=new Date().getFullYear();
  ghRender();
}

function ghShift(d){
  ghS.year+=d;
  ghRender();
}

function ghHeute(){
  ghS.year=new Date().getFullYear();
  ghRender();
}

function ghSetPerson(personId){
  ghS.person=personId;
  ghRender();
}

function ghRender(){
  var store=FP.Store.get();
  var partnerOn=store.settings&&store.settings.partnerEnabled;
  var swWrap=document.getElementById('gh-person-sw');
  if(swWrap){
    swWrap.style.display=partnerOn?'flex':'none';
    var p1n=store.persons&&store.persons.find(function(p){return p.id==='person_1'});
    var p2n=store.persons&&store.persons.find(function(p){return p.id==='person_2'});
    var b1=document.getElementById('gh-sw-p1');
    var b2=document.getElementById('gh-sw-p2');
    if(b1){b1.textContent=(p1n&&p1n.name)||'Person 1';b1.style.background=ghS.person==='person_1'?'var(--blue)':'';b1.style.color=ghS.person==='person_1'?'var(--on-accent)':'';}
    if(b2){b2.textContent=(p2n&&p2n.name)||'Person 2';b2.style.background=ghS.person==='person_2'?'var(--blue)':'';b2.style.color=ghS.person==='person_2'?'var(--on-accent)':'';}
  }
  var lbl=document.getElementById('gh-year-lbl');
  if(lbl)lbl.textContent=ghS.year;
  ghRenderStats();
  ghRenderMonths();
  ghRenderRealWage();
}

function ghRenderStats(){
  var el=document.getElementById('gh-stats');
  if(!el)return;
  var data=FP.Calculator.getSalaryYear(ghS.person,ghS.year);
  var monthCount=Object.keys(data.byMonth).length;
  var grossInclBonus=r2(data.grossTotal+data.bonusGross);
  var netInclBonus=r2(data.netTotal+data.bonusNet);
  var cards=[
    {lbl:'Brutto Jahresgehalt',val:eur(data.grossTotal),sub:'Ø '+eur(r2(data.grossTotal/12))+'/Monat',color:'var(--tx)'},
    {lbl:'Bonus Brutto',val:data.bonusGross?eur(data.bonusGross):'—',sub:data.bonusGross?'':'Kein Bonus erfasst',color:'var(--green)'},
    {lbl:'Brutto inkl. Bonus',val:eur(grossInclBonus),sub:'Ø '+eur(r2(grossInclBonus/12))+'/Monat',color:'var(--tx)'},
    {lbl:'Netto inkl. Bonus',val:eur(netInclBonus),sub:'Ø '+eur(r2(data.netTotal/12))+'/Monat regulär',color:'var(--blue)'}
  ];
  el.innerHTML=cards.map(function(c){
    return '<div class="gh-stat"><div class="gh-stat-lbl">'+c.lbl+'</div>'+
      '<div class="gh-stat-val" style="color:'+c.color+'">'+c.val+'</div>'+
      (c.sub?'<div class="gh-stat-sub">'+c.sub+'</div>':'')+
      '</div>';
  }).join('');
}

function ghRenderMonths(){
  var el=document.getElementById('gh-months');
  if(!el)return;
  var store=FP.Store.get();
  var sd=(store.salary&&store.salary[ghS.person])||{};
  var names=['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
  el.innerHTML=names.map(function(name,i){
    var mm=String(i+1).padStart(2,'0')+'.'+ghS.year;
    var d=sd[mm];
    var has=d&&d.netSalary;
    return '<div class="gh-month'+(has?'':' empty')+'" onclick="ghOpenMonth(\''+mm+'\')">'+
      '<div class="gh-month-name">'+name+'</div>'+
      '<div class="gh-month-net">'+(has?eur(d.netSalary):'—')+'</div>'+
      (has?'<div class="gh-month-gross">Brutto '+eur(d.grossSalary)+'</div>':'')+
      (has&&d.netBonus?'<div class="gh-month-bonus">Gesamt '+eur(d.netSalary+d.netBonus)+' (Bonus '+eur(d.netBonus)+')</div>':'')+
      '</div>';
  }).join('');
}

function ghRenderRealWage(){
  var el=document.getElementById('gh-rw');
  if(!el)return;
  var history=FP.Calculator.getRealWageHistory(ghS.person);
  var canvas=document.getElementById('ghc');

  if(!history||history.length<2){
    if(canvas)canvas.style.display='none';
    el.innerHTML='<div style="padding:24px;text-align:center;color:var(--tx3);font-size:13px">Noch keine Daten. Bitte Gehaltsdaten für mindestens 2 Jahre erfassen.</div>';
    return;
  }
  if(canvas)canvas.style.display='block';

  var store=FP.Store.get();
  var infl=store.inflation||{};

  // YoY-Werte einmal zentral berechnen (Chart + Tabelle nutzen dieselben Zahlen)
  var pts=history.slice(1).map(function(r,i){
    var prev=history[i];
    var inflRate=infl[r.year]||0;
    var nomYoY=prev&&prev.monthlyNet?FP.r2((r.monthlyNet-prev.monthlyNet)/prev.monthlyNet*100):0;
    var realYoY=FP.r2((((1+nomYoY/100)/(1+inflRate/100))-1)*100);
    return {year:r.year,monthlyNet:r.monthlyNet,nomYoY:nomYoY,realYoY:realYoY,inflRate:inflRate};
  });

  // ── Chart ──────────────────────────────
  requestAnimationFrame(function(){ ghDrawChart(canvas, pts); });

  // ── Tabelle (gleiche Werte wie Chart) ──
  el.innerHTML='<table class="gh-rw-table"><thead><tr>'+
    '<th>Jahr</th><th>Ø Netto/Monat</th><th>Nominal p.a.</th><th>Reallohn p.a.</th><th>Inflation p.a.</th>'+
    '</tr></thead><tbody>'+
    pts.slice().reverse().map(function(r){
      var ncCls=r.nomYoY>0?'gh-chg-pos':r.nomYoY<0?'gh-chg-neg':'';
      var rcCls=r.realYoY>0?'gh-chg-pos':r.realYoY<0?'gh-chg-neg':'';
      return '<tr>'+
        '<td style="font-weight:700">'+r.year+'</td>'+
        '<td>'+eur(r.monthlyNet)+'</td>'+
        '<td class="'+ncCls+'">'+(r.nomYoY>0?'+':'')+r.nomYoY.toFixed(1)+'%</td>'+
        '<td class="'+rcCls+'">'+(r.realYoY>0?'+':'')+r.realYoY.toFixed(1)+'%</td>'+
        '<td style="color:var(--tx3)">'+r.inflRate.toFixed(1)+'%</td>'+
        '</tr>';
    }).join('')+
    // Basisjahr ohne YoY-Werte
    '<tr style="color:var(--tx3)">'+
      '<td style="font-weight:700">'+history[0].year+'</td>'+
      '<td>'+eur(history[0].monthlyNet)+'</td>'+
      '<td>Basisjahr</td><td>—</td>'+
      '<td>'+(infl[history[0].year]||0).toFixed(1)+'%</td>'+
    '</tr>'+
    '</tbody></table>';
}

function ghDrawChart(canvas, pts){
  if(!canvas||!pts.length)return;
  var cs=getComputedStyle(document.documentElement);
  var cTx=cs.getPropertyValue('--tx').trim()||'#1C1C1E';
  var cTx3=cs.getPropertyValue('--tx3').trim()||'#AEAEB2';
  var cBrd=cs.getPropertyValue('--brd').trim()||'#E5E5EA';
  var cBlue=cs.getPropertyValue('--blue').trim()||'oklch(55% 0.24 262)';
  var cGreen=cs.getPropertyValue('--green').trim()||'oklch(57% 0.2 150)';
  var cRed=cs.getPropertyValue('--red').trim()||'oklch(57% 0.24 22)';
  var cAmber=cs.getPropertyValue('--amber').trim()||'oklch(75% 0.2 75)';

  var W=canvas.getBoundingClientRect().width||canvas.offsetWidth||300;
  var H=284;
  var dpr=window.devicePixelRatio||1;
  canvas.width=W*dpr; canvas.height=H*dpr;
  canvas.style.width=W+'px'; canvas.style.height=H+'px';
  var ctx=canvas.getContext('2d');
  ctx.scale(dpr,dpr);

  var PAD={t:36,r:16,b:32,l:50};
  var cW=W-PAD.l-PAD.r;
  var cH=H-PAD.t-PAD.b;
  var n=pts.length;
  var slotW=cW/n;
  var barW=Math.min(slotW*0.3,22);
  var gap=barW*0.4;

  var allVals=pts.map(function(p){return p.nomYoY;})
    .concat(pts.map(function(p){return p.realYoY;}))
    .concat(pts.map(function(p){return p.inflRate;}));
  var maxV=Math.max.apply(null,allVals.map(Math.abs));
  maxV=Math.max(maxV,3);
  maxV=Math.ceil(maxV/2)*2+2;

  function toY(v){ return PAD.t+cH/2-(v/maxV)*(cH/2); }

  function draw(hovIdx){
    ctx.clearRect(0,0,W,H);

    // Gitter + Y-Achse
    ctx.lineWidth=0.5;
    [-maxV,-maxV/2,0,maxV/2,maxV].forEach(function(v){
      var y=toY(v);
      ctx.strokeStyle=cBrd;
      ctx.beginPath();ctx.moveTo(PAD.l,y);ctx.lineTo(PAD.l+cW,y);ctx.stroke();
      ctx.fillStyle=cTx3;ctx.font='12px Inter,system-ui,sans-serif';
      ctx.textAlign='right';
      ctx.fillText((v>0?'+':'')+v.toFixed(0)+'%',PAD.l-5,y+4);
    });
    ctx.strokeStyle=cTx3;ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(PAD.l,toY(0));ctx.lineTo(PAD.l+cW,toY(0));ctx.stroke();

    // Balken
    pts.forEach(function(p,i){
      var x=PAD.l+slotW*i+slotW/2;
      var y0=toY(0);
      var isHov=i===hovIdx;
      ctx.globalAlpha=isHov?1:0.7;

      // Nominal (blau)
      ctx.fillStyle=cBlue;
      var yN=toY(p.nomYoY);
      ctx.beginPath();
      ctx.roundRect?ctx.roundRect(x-gap-barW,Math.min(yN,y0),barW,Math.abs(yN-y0)||2,2):
        ctx.rect(x-gap-barW,Math.min(yN,y0),barW,Math.abs(yN-y0)||2);
      ctx.fill();

      // Real (grün/rot)
      ctx.fillStyle=p.realYoY>=0?cGreen:cRed;
      var yR=toY(p.realYoY);
      ctx.beginPath();
      ctx.roundRect?ctx.roundRect(x+gap,Math.min(yR,y0),barW,Math.abs(yR-y0)||2,2):
        ctx.rect(x+gap,Math.min(yR,y0),barW,Math.abs(yR-y0)||2);
      ctx.fill();

      ctx.globalAlpha=1;
      ctx.fillStyle=isHov?cTx:cTx3;
      ctx.font=(isHov?'bold ':'')+'13px Inter,system-ui,sans-serif';
      ctx.textAlign='center';
      ctx.fillText(String(p.year),x,H-PAD.b+14);
    });

    // Inflation-Linie
    ctx.strokeStyle=cAmber;ctx.lineWidth=2.5;
    ctx.setLineDash([4,3]);
    ctx.beginPath();
    pts.forEach(function(p,i){
      var x=PAD.l+slotW*i+slotW/2;
      if(i===0)ctx.moveTo(x,toY(p.inflRate));else ctx.lineTo(x,toY(p.inflRate));
    });
    ctx.stroke();ctx.setLineDash([]);
    pts.forEach(function(p,i){
      var x=PAD.l+slotW*i+slotW/2;
      ctx.fillStyle=cAmber;
      ctx.beginPath();ctx.arc(x,toY(p.inflRate),i===hovIdx?6:4,0,Math.PI*2);ctx.fill();
    });

    // Hover-Info-Zeile oben (alle 3 Werte auf einmal, sauber lesbar)
    if(hovIdx>=0&&hovIdx<n){
      var p=pts[hovIdx];
      var txt=p.year+'  |  Nominal: '+(p.nomYoY>0?'+':'')+p.nomYoY.toFixed(1)+'%'+
              '  |  Real: '+(p.realYoY>0?'+':'')+p.realYoY.toFixed(1)+'%'+
              '  |  Inflation: '+p.inflRate.toFixed(1)+'%';
      ctx.font='13px Inter,system-ui,sans-serif';
      var tw=ctx.measureText(txt).width+20;
      ctx.fillStyle=cs.getPropertyValue('--surf').trim()||'#fff';
      ctx.beginPath();ctx.roundRect?ctx.roundRect(PAD.l,2,tw,22,4):ctx.rect(PAD.l,2,tw,22);
      ctx.fill();
      ctx.fillStyle=cTx;ctx.textAlign='left';
      ctx.fillText(txt,PAD.l+10,17);
    }

    // Legende (im Canvas — exakt gleiche Farben + Alpha wie die Balken)
    var lgY=H-8;
    ctx.font='11px Inter,system-ui,sans-serif';
    ctx.textAlign='left';
    var lgX=PAD.l;

    // Nominal (blaue Balken, gleiche Alpha wie Chart)
    ctx.globalAlpha=0.7;ctx.fillStyle=cBlue;
    ctx.beginPath();ctx.roundRect?ctx.roundRect(lgX,lgY-9,10,10,2):ctx.rect(lgX,lgY-9,10,10);ctx.fill();
    ctx.globalAlpha=1;ctx.fillStyle=cTx3;
    ctx.fillText('Nominal Δ p.a.',lgX+14,lgY);
    lgX+=14+ctx.measureText('Nominal Δ p.a.').width+16;

    // Reallohn (grün wenn positiv, rot wenn negativ — beide als Split zeigen)
    ctx.globalAlpha=0.7;
    ctx.fillStyle=cGreen;ctx.beginPath();ctx.roundRect?ctx.roundRect(lgX,lgY-9,5,10,[2,0,0,2]):ctx.rect(lgX,lgY-9,5,10);ctx.fill();
    ctx.fillStyle=cRed;ctx.beginPath();ctx.roundRect?ctx.roundRect(lgX+5,lgY-9,5,10,[0,2,2,0]):ctx.rect(lgX+5,lgY-9,5,10);ctx.fill();
    ctx.globalAlpha=1;ctx.fillStyle=cTx3;
    ctx.fillText('Reallohn Δ p.a.',lgX+14,lgY);
    lgX+=14+ctx.measureText('Reallohn Δ p.a.').width+16;

    // Inflation (gestrichelte Amber-Linie + Punkt)
    ctx.strokeStyle=cAmber;ctx.lineWidth=2;ctx.setLineDash([4,3]);
    ctx.beginPath();ctx.moveTo(lgX,lgY-4);ctx.lineTo(lgX+12,lgY-4);ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle=cAmber;ctx.beginPath();ctx.arc(lgX+6,lgY-4,3,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=cTx3;ctx.fillText('Inflation p.a.',lgX+16,lgY);
  }

  draw(-1);
  canvas.style.cursor='default';
  canvas.onmousemove=function(e){
    var rect=canvas.getBoundingClientRect();
    var x=(e.clientX-rect.left)*(W/rect.width);
    var idx=Math.floor((x-PAD.l)/slotW);
    draw((idx>=0&&idx<n)?idx:-1);
  };
  canvas.onmouseleave=function(){draw(-1);};
  canvas.onclick=null;
}

function ghOpenMonth(month){
  ghEditMonth=month;
  var parts=month.split('.');
  var name=['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'][parseInt(parts[0])-1];
  var ttl=document.getElementById('mg-ttl');
  if(ttl)ttl.textContent='Gehalt — '+name+' '+parts[1];
  var d=FP.Store.Salary.get(ghS.person||'person_1',month)||{};
  document.getElementById('mg-gross').value     =d.grossSalary||'';
  document.getElementById('mg-net').value       =d.netSalary||'';
  document.getElementById('mg-grossbonus').value=d.grossBonus||'';
  // Feld zeigt Gesamtauszahlung = netSalary + netBonus (nur wenn Bonus vorhanden)
  document.getElementById('mg-netbonus').value=(d.netBonus&&d.netSalary)?(r2(d.netSalary+d.netBonus)):'';
  document.getElementById('mg-note').value      =d.note||'';
  openM('m-gehalt');
}

function ghSave(){
  if(!ghEditMonth)return;
  var netSalary   =parseFloat(document.getElementById('mg-net').value)||0;
  var totalNetPay =parseFloat(document.getElementById('mg-netbonus').value)||0;
  // netBonus = Gesamtauszahlung − reguläres Netto (mind. 0)
  var netBonus    =totalNetPay>netSalary?r2(totalNetPay-netSalary):0;
  FP.Store.Salary.set(ghS.person||'person_1',ghEditMonth,{
    grossSalary: parseFloat(document.getElementById('mg-gross').value)||0,
    netSalary:   netSalary,
    grossBonus:  parseFloat(document.getElementById('mg-grossbonus').value)||0,
    netBonus:    netBonus,
    note:        document.getElementById('mg-note').value||''
  });
  closeM('m-gehalt');
  ghRender();
  toast('Gespeichert');
}

function ghCopyYear(){
  var jan='01.'+ghS.year;
  var d=FP.Store.Salary.get(ghS.person||'person_1',jan);
  if(!d||!d.grossSalary){toast('Bitte zuerst Januar erfassen');return;}
  var n=FP.Store.Salary.copyToYear(ghS.person||'person_1',jan);
  ghRender();
  toast(n+' Monate übernommen');
}

/* ── Suche ── */
function openSearch(){
  document.getElementById('search-overlay').classList.add('open');
  var inp=document.getElementById('sr-input');
  inp.value='';
  document.getElementById('sr-results').innerHTML='<div class="sr-hint">Tippe um zu suchen…</div>';
  setTimeout(function(){inp.focus();},80);
}
function closeSearch(){
  document.getElementById('search-overlay').classList.remove('open');
}

document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){closeSearch();}
  if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();openSearch();}
});

function srSearch(q){
  q=(q||'').trim().toLowerCase();
  var el=document.getElementById('sr-results');
  if(!q||q.length<1){el.innerHTML='<div class="sr-hint">Tippe um zu suchen…</div>';return;}

  var store=FP.Store.get();
  var cMap={};store.categories.forEach(function(c){cMap[c.id]=c;});
  var oMap={};store.objects.forEach(function(o){oMap[o.id]=o;});
  var html='';

  // ── Transaktionen
  var txAll=store.transactions.slice().reverse();
  var txHits=txAll.filter(function(tx){
    var cat=cMap[tx.categoryId];
    var obj=oMap[tx.objectId];
    return (cat&&cat.name.toLowerCase().includes(q))
      ||(tx.note&&tx.note.toLowerCase().includes(q))
      ||(tx.rawName&&tx.rawName.toLowerCase().includes(q))
      ||(obj&&obj.name.toLowerCase().includes(q))
      ||tx.date.includes(q)
      ||String(Math.abs(tx.amount)).includes(q);
  }).slice(0,30);

  if(txHits.length){
    html+='<div class="sr-section-lbl">Transaktionen ('+txHits.length+(txHits.length===30?'+':'')+')</div>';
    html+=txHits.map(function(tx){
      var cat=cMap[tx.categoryId];
      var obj=oMap[tx.objectId];
      var color=cat?cat.color:'var(--cat-slate)';
      var title=(cat?cat.name:'?')+(tx.rawName&&tx.rawName!==cat.name?' · '+tx.rawName:'');
      var subParts=[tx.date];
      if(tx.note)subParts.push(tx.note);
      if(obj)subParts.push(obj.name);
      var sub=subParts.join(' · ');
      var amtColor=tx.amount<0?'var(--green)':'inherit';
      return '<button class="sr-item" onclick="srGoDate(\''+tx.date+'\')">'
        +'<div class="sr-item-dot" style="background:'+color+'"></div>'
        +'<div class="sr-item-info"><div class="sr-item-title">'+title+'</div>'
        +'<div class="sr-item-sub">'+sub+'</div></div>'
        +'<div class="sr-item-right" style="color:'+amtColor+'">'+(tx.amount<0?'↩\u2009':'')+eur(Math.abs(tx.amount))+'</div>'
        +'</button>';
    }).join('');
  }

  // ── Fixkosten
  var fkHits=(store.recurring||[]).filter(function(fc){
    return fc.name.toLowerCase().includes(q)||(fc.validFrom&&fc.validFrom.includes(q));
  });
  if(fkHits.length){
    html+='<div class="sr-section-lbl">Fixkosten</div>';
    html+=fkHits.map(function(fc){
      var cat=cMap[fc.categoryId];
      var color=cat?cat.color:'var(--cat-slate)';
      var status=fc.validUntil?'bis '+fc.validUntil:'aktiv';
      return '<button class="sr-item" onclick="closeSearch();nav(\'fixkosten\')">'
        +'<div class="sr-item-dot" style="background:'+color+'"></div>'
        +'<div class="sr-item-info"><div class="sr-item-title">'+fc.name+'</div>'
        +'<div class="sr-item-sub">ab '+fc.validFrom+' · '+status+'</div></div>'
        +'<div class="sr-item-right">'+eur(fc.amount)+'/Mo</div>'
        +'</button>';
    }).join('');
  }

  // ── Anlagen
  var assetHits=store.assets.filter(function(a){
    return a.name.toLowerCase().includes(q)
      ||(a.wkn&&a.wkn.toLowerCase().includes(q))
      ||(a.isin&&a.isin.toLowerCase().includes(q));
  });
  if(assetHits.length){
    html+='<div class="sr-section-lbl">Anlagen</div>';
    html+=assetHits.map(function(a){
      var color=VM_TYPE_COLOR[a.type]||'#94A3B8';
      var snap=FP.Store.Assets.getLatestSnapshot(a.id);
      var meta=[a.wkn,a.isin].filter(Boolean).join(' · ');
      return '<button class="sr-item" onclick="closeSearch();nav(\'vermoegen\')">'
        +'<div class="sr-item-dot" style="background:'+color+'"></div>'
        +'<div class="sr-item-info"><div class="sr-item-title">'+a.name+'</div>'
        +(meta?'<div class="sr-item-sub">'+meta+'</div>':'')
        +'</div>'
        +(snap?'<div class="sr-item-right">'+eur(snap.value)+'</div>':'')
        +'</button>';
    }).join('');
  }

  // ── Objekte
  var objHits=store.objects.filter(function(o){
    return o.name.toLowerCase().includes(q)
      ||(o.description&&o.description.toLowerCase().includes(q));
  });
  if(objHits.length){
    html+='<div class="sr-section-lbl">Objekte</div>';
    html+=objHits.map(function(o){
      return '<button class="sr-item" onclick="srGoObj(\''+o.id+'\')">'
        +'<div class="sr-item-dot" style="background:'+(o.color||'#6B7280')+'"></div>'
        +'<div class="sr-item-info"><div class="sr-item-title">'+(OBJ_ICONS[o.type]||'')+'<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+o.name+'</span></div>'
        +(o.description?'<div class="sr-item-sub">'+esc(o.description)+'</div>':'')
        +'</div></button>';
    }).join('');
  }

  // ── Kategorien
  var catHits=store.categories.filter(function(c){
    return !c.hidden&&c.name.toLowerCase().includes(q);
  });
  if(catHits.length){
    html+='<div class="sr-section-lbl">Kategorien</div>';
    html+=catHits.map(function(c){
      return '<button class="sr-item" onclick="srGoCat(\''+c.id+'\')">'
        +'<div class="sr-item-dot" style="background:'+c.color+'"></div>'
        +'<div class="sr-item-info"><div class="sr-item-title">'+(ICONS[c.id]||'')+'<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+c.name+'</span></div>'
        +'<div class="sr-item-sub">'+(c.group==='fixkosten'?'Fixkosten':'Freizeit')+(c.parentId?' · Unterkategorie':'')+'</div>'
        +'</div></button>';
    }).join('');
  }

  el.innerHTML=html||'<div class="sr-empty">Keine Ergebnisse für „'+q+'"</div>';
}

// Transaktion: Auswertung auf den passenden Monat setzen
function srGoDate(dateStr){
  var parts=dateStr.split('.');
  avS.month=parseInt(parts[0]);
  avS.year=parseInt(parts[1]);
  avS.mode='monat';
  document.querySelectorAll('.av-mode-btn').forEach(function(b){
    b.classList.toggle('active',b.dataset.m==='monat');
  });
  closeSearch();
  nav('auswertung');
}

// Objekt: direkt in Detailansicht springen
function srGoObj(id){
  closeSearch();
  nav('objekte');
  setTimeout(function(){ obSelect(id); },120);
}

// Kategorie: Auswertung öffnen + Kategorie-Detailansicht
function srGoCat(id){
  closeSearch();
  nav('auswertung');
  setTimeout(function(){ avCatDetail(id); },120);
}

// ── Budget ──
var bgtState = { month: new Date().getMonth() + 1, year: new Date().getFullYear(), editingCat: null };

function bgtInit() { bgtUpdateHeader(); bgtRender(); }

function bgtShift(d) {
  bgtState.month += d;
  if (bgtState.month > 12) { bgtState.month = 1; bgtState.year++; }
  if (bgtState.month < 1)  { bgtState.month = 12; bgtState.year--; }
  bgtState.editingCat = null;
  bgtUpdateHeader();
  bgtRender();
}

function bgtUpdateHeader() {
  var el = document.getElementById('bgt-month-lbl');
  if (el) el.textContent = FP.MONATE_LANG[bgtState.month - 1] + ' ' + bgtState.year;
}

function bgtRender() {
  var store    = FP.Store.get();
  var budgets  = FP.Store.Settings.getCategoryBudgets();
  var summary  = FP.Calculator.getMonthSummary(bgtState.month, bgtState.year);
  var byCat    = summary.byCat;
  var catMap   = {};
  store.categories.forEach(function(c) { catMap[c.id] = c; });

  // Kategorien mit Budget
  var budgeted = Object.keys(budgets).map(function(catId) {
    var spent   = byCat[catId] ? byCat[catId].total : 0;
    var limit   = budgets[catId];
    var cat     = catMap[catId];
    return { catId: catId, name: cat ? cat.name : catId, color: cat ? cat.color : 'var(--cat-slate)', spent: spent, limit: limit };
  }).sort(function(a, b) { return b.spent - a.spent; });

  // Gesamtsummary
  var totalSpent = budgeted.reduce(function(s, b) { return s + b.spent; }, 0);
  var totalLimit = budgeted.reduce(function(s, b) { return s + b.limit; }, 0);
  var totalPct   = totalLimit > 0 ? Math.min((totalSpent / totalLimit) * 100, 100) : 0;
  var sumBarCls  = totalPct >= 100 ? 'bgt-bar-over' : totalPct >= 80 ? 'bgt-bar-warn' : 'bgt-bar-ok';

  var sumEl = document.getElementById('bgt-summary');
  if (sumEl) {
    sumEl.innerHTML = budgeted.length === 0
      ? '<div class="bgt-empty">Noch kein Budget gesetzt — klick auf "Budget hinzufügen"</div>'
      : '<div class="bgt-sum-row"><span class="bgt-sum-lbl">Gesamt</span><span class="bgt-sum-amounts"><strong>' + eur(totalSpent) + '</strong> von ' + eur(totalLimit) + '</span></div>' +
        '<div class="bgt-sum-bar-wrap"><div class="bgt-sum-bar-fill ' + sumBarCls + '" style="width:' + totalPct.toFixed(1) + '%"></div></div>';
  }

  // Kategorien mit Budget rendern
  var listEl = document.getElementById('bgt-list');
  if (!listEl) return;
  var html = '';

  if (budgeted.length > 0) {
    html += '<div class="bgt-section-lbl">Budgetierte Kategorien</div>';
    budgeted.forEach(function(b) {
      var pct    = b.limit > 0 ? Math.min((b.spent / b.limit) * 100, 100) : 0;
      var over   = b.spent > b.limit;
      var warn   = !over && pct >= 80;
      var barCls = over ? 'bgt-bar-over' : warn ? 'bgt-bar-warn' : 'bgt-bar-ok';
      var stCls  = over ? 'bgt-status-over' : warn ? 'bgt-status-warn' : 'bgt-status-ok';
      var stTxt  = over
        ? '▲ ' + eur(b.spent - b.limit) + ' überzogen'
        : warn
        ? '⚡ ' + eur(b.limit - b.spent) + ' verbleibend'
        : '✓ ' + eur(b.limit - b.spent) + ' verbleibend';

      var editRow = bgtState.editingCat === b.catId
        ? '<div class="bgt-edit-row">' +
          '<input class="bgt-edit-input" id="bgt-inp-' + b.catId + '" type="number" min="0" step="10" value="' + b.limit + '" placeholder="Budget in €">' +
          '<button class="bgt-edit-save" onclick="bgtSave(\'' + b.catId + '\')">Speichern</button>' +
          '<button class="bgt-edit-cancel" onclick="bgtCancelEdit()">Abbrechen</button>' +
          '<button class="bgt-edit-del" onclick="bgtRemove(\'' + b.catId + '\')">Entfernen</button>' +
          '</div>'
        : '';

      html += '<div class="bgt-item">' +
        '<div class="bgt-item-top">' +
          '<div class="bgt-item-dot" style="background:' + b.color + '"></div>' +
          '<div class="bgt-item-name">' + b.name + '</div>' +
          '<div class="bgt-item-amounts"><span>' + eur(b.spent) + '</span> / ' + eur(b.limit) + '</div>' +
          '<button class="bgt-item-edit" onclick="bgtStartEdit(\'' + b.catId + '\')">' + (bgtState.editingCat === b.catId ? 'Schließen' : 'Bearbeiten') + '</button>' +
        '</div>' +
        '<div class="bgt-bar-wrap"><div class="bgt-bar-fill ' + barCls + '" style="width:' + pct.toFixed(1) + '%"></div></div>' +
        '<div class="bgt-status ' + stCls + '">' + stTxt + '</div>' +
        editRow +
        '</div>';
    });
  }

  // Kategorien ohne Budget aber mit Ausgaben
  var unbudgetedWithSpend = Object.keys(byCat)
    .filter(function(catId) { return !budgets[catId] && byCat[catId].total > 0; })
    .map(function(catId) { return { catId: catId, name: byCat[catId].name, color: (catMap[catId] && catMap[catId].color) || 'var(--cat-slate)', spent: byCat[catId].total }; })
    .sort(function(a, b) { return b.spent - a.spent; });

  if (unbudgetedWithSpend.length > 0) {
    html += '<div class="bgt-section-lbl" style="margin-top:8px">Ohne Budget — diesen Monat aktiv</div>';
    html += '<div class="bgt-unbudgeted">';
    unbudgetedWithSpend.forEach(function(u) {
      html += '<div class="bgt-unb-item">' +
        '<div class="bgt-item-dot" style="background:' + u.color + '"></div>' +
        '<div class="bgt-unb-name">' + u.name + '</div>' +
        '<div class="bgt-unb-amt">' + eur(u.spent) + '</div>' +
        '<button class="bgt-unb-add" onclick="bgtQuickAdd(\'' + u.catId + '\')">+ Budget</button>' +
        '</div>';
    });
    html += '</div>';
  }

  listEl.innerHTML = html;

  if (bgtState.editingCat) {
    var inp = document.getElementById('bgt-inp-' + bgtState.editingCat);
    if (inp) { inp.focus(); inp.select(); }
  }
}

function bgtStartEdit(catId) {
  bgtState.editingCat = bgtState.editingCat === catId ? null : catId;
  bgtRender();
}

function bgtCancelEdit() { bgtState.editingCat = null; bgtRender(); }

function bgtSave(catId) {
  var inp = document.getElementById('bgt-inp-' + catId);
  if (!inp) return;
  var val = parseFloat(inp.value);
  if (isNaN(val) || val < 0) { toast('Bitte einen gültigen Betrag eingeben'); return; }
  FP.Store.Settings.setCategoryBudget(catId, val);
  bgtState.editingCat = null;
  toast('Budget gespeichert');
  bgtRender();
}

function bgtRemove(catId) {
  FP.Store.Settings.removeCategoryBudget(catId);
  bgtState.editingCat = null;
  toast('Budget entfernt');
  bgtRender();
}

function bgtQuickAdd(catId) {
  bgtState.editingCat = catId;
  var budgets = FP.Store.Settings.getCategoryBudgets();
  if (!budgets[catId]) FP.Store.Settings.setCategoryBudget(catId, 0);
  bgtRender();
}

function bgtOpenAdd() {
  var store   = FP.Store.get();
  var budgets = FP.Store.Settings.getCategoryBudgets();
  var unset   = store.categories.filter(function(c) { return !budgets[c.id] && !c.hidden; });
  if (!unset.length) { toast('Alle Kategorien haben bereits ein Budget'); return; }
  var sel = document.getElementById('bgt-add-cat');
  if (sel) {
    sel.innerHTML = unset.map(function(c) { return '<option value="' + c.id + '">' + c.name + '</option>'; }).join('');
  }
  var inp = document.getElementById('bgt-add-val');
  if (inp) inp.value = '';
  openM('m-bgt-add');
}

function bgtAddConfirm() {
  var catEl = document.getElementById('bgt-add-cat');
  var valEl = document.getElementById('bgt-add-val');
  if (!catEl || !valEl) return;
  var catId = catEl.value;
  var val   = parseFloat(valEl.value);
  if (!catId) { toast('Bitte Kategorie wählen'); return; }
  if (isNaN(val) || val <= 0) { toast('Bitte einen Betrag eingeben'); return; }
  FP.Store.Settings.setCategoryBudget(catId, val);
  closeM('m-bgt-add');
  toast('Budget hinzugefügt');
  bgtRender();
}

// ── Cashflow ──
var cfY = new Date().getFullYear();

function cfInit() {
  var el = document.getElementById('cf-year');
  if (el) el.textContent = cfY;
  cfRender();
}

function cfShift(d) {
  cfY += d;
  var el = document.getElementById('cf-year');
  if (el) el.textContent = cfY;
  cfRender();
}

function cfGetData() {
  var store = FP.Store.get();
  var months = [];
  for (var m = 1; m <= 12; m++) {
    var ds = String(m).padStart(2, '0') + '.' + cfY;
    var inc = 0;
    ['person_1', 'person_2'].forEach(function(pid) {
      if (store.salary && store.salary[pid] && store.salary[pid][ds]) {
        inc += store.salary[pid][ds].netSalary || 0;
      }
    });
    var exp = store.transactions
      .filter(function(t) { return t.date === ds && t.amount > 0; })
      .reduce(function(s, t) { return s + t.amount; }, 0);
    months.push({ m: m, ds: ds, inc: inc, exp: exp, net: inc - exp });
  }
  return months;
}

function cfRender() {
  var months = cfGetData();
  var totalInc = months.reduce(function(s, mo) { return s + mo.inc; }, 0);
  var totalExp = months.reduce(function(s, mo) { return s + mo.exp; }, 0);
  var totalNet = totalInc - totalExp;

  var incEl = document.getElementById('cf-inc');
  var expEl = document.getElementById('cf-exp');
  var netEl = document.getElementById('cf-net');
  if (incEl) incEl.textContent = eur(totalInc);
  if (expEl) expEl.textContent = eur(totalExp);
  if (netEl) {
    netEl.textContent = (totalNet >= 0 ? '+' : '') + eur(totalNet);
    netEl.className = 'cf-kpi-val ' + (totalNet >= 0 ? 'cf-net-pos' : 'cf-net-neg');
  }

  cfDrawChart(months);
  cfRenderTable(months);
}

function cfDrawChart(months) {
  var canvas = document.getElementById('cf-canvas');
  if (!canvas) return;
  var dpr = window.devicePixelRatio || 1;
  var W = canvas.parentNode.getBoundingClientRect().width || canvas.parentNode.offsetWidth || 600;
  var H = 180;
  canvas.width = W * dpr; canvas.height = H * dpr;
  canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
  var ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  var cs = getComputedStyle(document.documentElement);
  var cGreen    = cs.getPropertyValue('--green').trim();
  var cGreenLt  = cs.getPropertyValue('--green-lt').trim();
  var cRed      = cs.getPropertyValue('--red').trim();
  var cRedLt    = cs.getPropertyValue('--red-lt').trim();
  var cBlue     = cs.getPropertyValue('--blue').trim();
  var cBrd      = cs.getPropertyValue('--brd').trim();
  var cTx       = cs.getPropertyValue('--tx').trim();
  var cTx3      = cs.getPropertyValue('--tx3').trim();

  var maxV = Math.max.apply(null, months.map(function(mo) { return Math.max(mo.inc, mo.exp, 1); }));
  var pL = 8, pR = 8, pT = 16, pB = 22;
  var bW = (W - pL - pR) / 12;
  var cH = H - pT - pB;
  var outerGap = Math.max(2, bW * 0.10);
  var innerW = bW - outerGap;
  var barW = (innerW - 2) / 2;

  // Horizontale Hilfslinien (3 Linien)
  ctx.strokeStyle = cBrd;
  ctx.lineWidth = 0.5;
  for (var g = 1; g <= 3; g++) {
    var gy = pT + (g / 4) * cH;
    ctx.beginPath();
    ctx.moveTo(pL, gy);
    ctx.lineTo(W - pR, gy);
    ctx.stroke();
  }
  var now = new Date();

  function drawBar(x, y, w, h, color) {
    var r = Math.min(3, w / 2, h / 2);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
  }

  months.forEach(function(mo, i) {
    var isCur = cfY === now.getFullYear() && (i + 1) === (now.getMonth() + 1);
    var xBase = pL + i * bW + outerGap / 2;

    if (mo.inc > 0) {
      var bh = Math.max(2, (mo.inc / maxV) * cH);
      drawBar(xBase, H - pB - bh, barW, bh, isCur ? cGreen : cGreenLt);
    }
    if (mo.exp > 0) {
      var bh2 = Math.max(2, (mo.exp / maxV) * cH);
      drawBar(xBase + barW + 2, H - pB - bh2, barW, bh2, isCur ? cRed : cRedLt);
    }

    ctx.font = (isCur ? '700 ' : '') + '10px Inter,sans-serif';
    ctx.fillStyle = isCur ? cTx : cTx3;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(MON[i].slice(0, 3), xBase + innerW / 2, H);
  });

  // Netto-Trend-Linie (gestrichelt)
  var hasAny = months.some(function(mo) { return mo.inc > 0 || mo.exp > 0; });
  if (hasAny) {
    ctx.strokeStyle = cBlue;
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    var started = false;
    months.forEach(function(mo, i) {
      if (mo.inc === 0 && mo.exp === 0) return;
      var cx = pL + i * bW + outerGap / 2 + innerW / 2;
      var netPct = (mo.net + maxV) / (2 * maxV);
      netPct = Math.min(1, Math.max(0, netPct));
      var cy = pT + (1 - netPct) * cH;
      if (!started) { ctx.moveTo(cx, cy); started = true; }
      else           { ctx.lineTo(cx, cy); }
    });
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

function cfRenderTable(months) {
  var el = document.getElementById('cf-table');
  if (!el) return;
  var now = new Date();
  var hasAny = months.some(function(mo) { return mo.inc > 0 || mo.exp > 0; });
  if (!hasAny) {
    el.innerHTML = '<div class="cf-empty">Keine Daten für ' + cfY + '</div>';
    return;
  }

  var html = '<table class="cf-tbl"><thead><tr>' +
    '<th>Monat</th><th>Einnahmen</th><th>Ausgaben</th><th>Netto</th><th></th>' +
    '</tr></thead><tbody>';

  months.forEach(function(mo, i) {
    var isCur = cfY === now.getFullYear() && (i + 1) === (now.getMonth() + 1);
    var hasData = mo.inc > 0 || mo.exp > 0;
    var netBadgeCls = hasData ? (mo.net >= 0 ? 'cf-net-pos' : 'cf-net-neg') : 'cf-net-nil';
    var netStr = hasData ? ((mo.net >= 0 ? '+' : '') + eur(mo.net)) : '–';
    var netCell = '<span class="cf-net-badge ' + netBadgeCls + '">' + netStr + '</span>';
    var trend = '';
    if (i > 0 && hasData && (months[i - 1].inc > 0 || months[i - 1].exp > 0)) {
      var delta = mo.net - months[i - 1].net;
      trend = delta >= 0
        ? '<span class="cf-trend cf-trend-up">↑</span>'
        : '<span class="cf-trend cf-trend-dn">↓</span>';
    }
    html += '<tr' + (isCur ? ' class="cf-cur"' : '') + '>' +
      '<td>' + MON[i] + '</td>' +
      '<td>' + (mo.inc > 0 ? eur(mo.inc) : '–') + '</td>' +
      '<td>' + (mo.exp > 0 ? eur(mo.exp) : '–') + '</td>' +
      '<td style="text-align:left;padding-left:10px">' + netCell + '</td>' +
      '<td>' + trend + '</td>' +
      '</tr>';
  });

  html += '</tbody></table>';
  el.innerHTML = html;
}

// ── Reports ──
function esc(s) { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
var _rp2 = { period: 'all', offset: 0, cats: [] };
var RP2_MLAB = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];

function rp2Init() {
  _rp2.cats = [];
  _rp2.period = 'all';
  _rp2.offset = 0;
  document.querySelectorAll('.rp2-period-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.period === 'all');
  });
  var nav = document.getElementById('rp2-period-nav');
  if (nav) nav.style.display = 'none';
  var search = document.getElementById('rp2-search');
  if (search) search.value = '';
  rp2RenderChips();
  rp2UpdatePeriodLabel();
  rp2Render();
}

function rp2SetPeriod(p) {
  _rp2.period = p;
  _rp2.offset = 0;
  document.querySelectorAll('.rp2-period-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.period === p);
  });
  var nav = document.getElementById('rp2-period-nav');
  if (nav) nav.style.display = (p === 'all') ? 'none' : 'flex';
  rp2UpdatePeriodLabel();
  rp2Render();
}

function rp2Shift(d) {
  _rp2.offset += d;
  rp2UpdatePeriodLabel();
  rp2Render();
}

function rp2UpdatePeriodLabel() {
  var range = rp2GetRange();
  var lbl = document.getElementById('rp2-period-lbl');
  if (lbl) lbl.textContent = range.label;
}

function rp2RenderChips() {
  var cats = FP.Store.Categories.getAll().filter(function(c) { return !c.parentId; });
  cats.sort(function(a, b) { return (a.name || '').localeCompare(b.name || '', 'de'); });
  var wrap = document.getElementById('rp2-cat-chips');
  if (!wrap) return;
  wrap.innerHTML = cats.map(function(c) {
    var active = _rp2.cats.indexOf(c.id) >= 0 ? ' active' : '';
    return '<button class="rp2-cat-chip' + active + '" onclick="rp2ToggleCat(\'' + c.id + '\')">' +
      '<span class="rp2-chip-dot" style="background:' + (c.color || 'var(--tx3)') + '"></span>' +
      esc(c.name) + '</button>';
  }).join('');
}

function rp2ToggleCat(id) {
  var idx = _rp2.cats.indexOf(id);
  if (idx >= 0) _rp2.cats.splice(idx, 1); else _rp2.cats.push(id);
  rp2RenderChips();
  rp2Render();
}

function rp2SelectAll() {
  _rp2.cats = FP.Store.Categories.getAll().filter(function(c) { return !c.parentId; }).map(function(c) { return c.id; });
  rp2RenderChips();
  rp2Render();
}

function rp2ClearCats() {
  _rp2.cats = [];
  rp2RenderChips();
  rp2Render();
}

function rp2GetRange() {
  var now = new Date();
  var p = _rp2.period;
  var o = _rp2.offset;

  if (p === 'all') return { label: 'Gesamt', from: null, to: null };

  if (p === 'year') {
    var yr = now.getFullYear() + o;
    return { label: String(yr), from: yr + '-01-01', to: yr + '-12-31' };
  }

  if (p === 'quarter') {
    var base = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
    base.setMonth(base.getMonth() + o * 3);
    var q = Math.floor(base.getMonth() / 3);
    var qy = base.getFullYear();
    var qFrom = new Date(qy, q * 3, 1);
    var qTo   = new Date(qy, q * 3 + 3, 0);
    var QLAB  = ['Q1', 'Q2', 'Q3', 'Q4'];
    return {
      label: QLAB[q] + ' ' + qy,
      from:  rp2DateStr(qFrom),
      to:    rp2DateStr(qTo)
    };
  }

  if (p === 'month') {
    var mBase = new Date(now.getFullYear(), now.getMonth() + o, 1);
    var mTo   = new Date(mBase.getFullYear(), mBase.getMonth() + 1, 0);
    return {
      label: RP2_MLAB[mBase.getMonth()] + ' ' + mBase.getFullYear(),
      from:  rp2DateStr(mBase),
      to:    rp2DateStr(mTo)
    };
  }
  return { label: '', from: null, to: null };
}

function rp2DateStr(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

/* Gibt ISO-Datum für Vergleich zurück. MM.YYYY → YYYY-MM-01, DD.MM.YYYY → YYYY-MM-DD */
function rp2TxISO(tx) {
  if (!tx.date) return null;
  var p = tx.date.split('.');
  if (p.length === 3) return p[2] + '-' + p[1].padStart(2,'0') + '-' + p[0].padStart(2,'0');
  if (p.length === 2) return p[1] + '-' + p[0].padStart(2,'0') + '-01';
  return tx.date;
}

/* Gibt lesbares Datum zurück: MM.YYYY bleibt MM.YYYY, YYYY-MM-DD → DD.MM.YYYY */
function rp2TxFmt(tx) {
  if (!tx.date) return '';
  var p = tx.date.split('.');
  if (p.length >= 2) return tx.date;
  if (tx.date.length === 10) return tx.date.substring(8)+'.'+tx.date.substring(5,7)+'.'+tx.date.substring(0,4);
  return tx.date;
}

function rp2Filter() {
  var range = rp2GetRange();
  var q = ((document.getElementById('rp2-search') || {}).value || '').toLowerCase().trim();

  var catParent = {};
  FP.Store.Categories.getAll().forEach(function(c) { catParent[c.id] = c.parentId || c.id; });

  var all = FP.Store.Transactions.getAll();
  return all.filter(function(tx) {
    if (_rp2.cats.length) {
      var rootId = catParent[tx.categoryId] || tx.categoryId;
      if (_rp2.cats.indexOf(tx.categoryId) < 0 && _rp2.cats.indexOf(rootId) < 0) return false;
    }
    if (range.from || range.to) {
      var d = rp2TxISO(tx);
      if (!d) return false;
      if (range.from && d < range.from) return false;
      if (range.to   && d > range.to)   return false;
    }
    if (q) {
      var note = (tx.note || '').toLowerCase();
      var raw  = (tx.rawName || '').toLowerCase();
      if (!note.includes(q) && !raw.includes(q)) return false;
    }
    return true;
  });
}

function rp2Render() {
  var hint    = document.getElementById('rp2-hint');
  var emptyEl = document.getElementById('rp2-empty');
  var bdCard  = document.getElementById('rp2-breakdown-card');
  var txCard  = document.getElementById('rp2-tx-card');

  if (!_rp2.cats.length) {
    if (hint)    hint.style.display    = '';
    if (emptyEl) emptyEl.style.display = 'none';
    if (bdCard)  bdCard.style.display  = 'none';
    if (txCard)  txCard.style.display  = 'none';
    rp2SetKpi(null, null, null);
    return;
  }
  if (hint) hint.style.display = 'none';

  var txs = rp2Filter();
  txs.sort(function(a, b) {
    var da = rp2TxISO(a) || '', db = rp2TxISO(b) || '';
    return db < da ? -1 : db > da ? 1 : 0;
  });

  if (!txs.length) {
    if (emptyEl) emptyEl.style.display = 'flex';
    if (bdCard)  bdCard.style.display  = 'none';
    if (txCard)  txCard.style.display  = 'none';
    rp2SetKpi(0, 0, 0);
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';

  var total  = txs.reduce(function(s, tx) { return s + Math.abs(tx.amount); }, 0);
  var months = rp2CountMonths(txs);
  var avg    = months > 0 ? total / months : 0;
  rp2SetKpi(total, txs.length, avg);

  if (_rp2.period !== 'month') {
    if (bdCard) bdCard.style.display = '';
    rp2RenderBreakdown(txs);
  } else {
    if (bdCard) bdCard.style.display = 'none';
  }

  if (txCard) txCard.style.display = '';
  rp2RenderTxList(txs);
}

function rp2CountMonths(txs) {
  var keys = {};
  txs.forEach(function(tx) {
    var d = rp2TxISO(tx);
    if (d) keys[d.substring(0, 7)] = true;
  });
  return Object.keys(keys).length || 1;
}

function rp2SetKpi(total, count, avg) {
  var fmt = function(v) { return v === null ? '–' : v.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'; };
  var el = document.getElementById('rp2-kpi-total'); if (el) el.textContent = fmt(total);
  el = document.getElementById('rp2-kpi-count'); if (el) el.textContent = count === null ? '–' : String(count);
  el = document.getElementById('rp2-kpi-avg');   if (el) el.textContent = fmt(avg);
}

function rp2BuildByMonth(txs) {
  var byMonth = {};
  txs.forEach(function(tx) {
    var d = rp2TxISO(tx);
    if (!d) return;
    var key = d.substring(0, 7);
    byMonth[key] = (byMonth[key] || 0) + Math.abs(tx.amount);
  });
  return byMonth;
}

function rp2RenderBreakdown(txs) {
  var byMonth = rp2BuildByMonth(txs);
  var keys = Object.keys(byMonth).sort().reverse();
  var total = txs.reduce(function(s, tx) { return s + Math.abs(tx.amount); }, 0);

  var html = '<table class="cf-tbl"><thead><tr><th>Monat</th><th>Betrag</th><th>Anteil</th></tr></thead><tbody>';
  keys.forEach(function(k) {
    var parts  = k.split('-');
    var mlbl   = RP2_MLAB[parseInt(parts[1], 10) - 1] + ' ' + parts[0];
    var val    = byMonth[k];
    var pct    = total > 0 ? Math.round((val / total) * 100) : 0;
    html += '<tr><td>' + esc(mlbl) + '</td>' +
      '<td style="color:var(--red);font-weight:600">' + val.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €</td>' +
      '<td>' + pct + ' %</td></tr>';
  });
  html += '</tbody></table>';
  document.getElementById('rp2-breakdown').innerHTML = html;
}

function rp2RenderTxList(txs) {
  var cats = {};
  FP.Store.Categories.getAll().forEach(function(c) { cats[c.id] = c; });
  var objs = {};
  FP.Store.Objects.getAll().forEach(function(o) { objs[o.id] = o; });

  var html = '';
  txs.forEach(function(tx) {
    var cat   = tx.categoryId ? cats[tx.categoryId] : null;
    var obj   = tx.objectId   ? objs[tx.objectId]   : null;
    var dFmt  = rp2TxFmt(tx);
    var isPos = Number(tx.amount) > 0;
    var amt   = isFinite(tx.amount) ? Math.abs(Number(tx.amount)) : 0;

    var catName = cat && cat.name && cat.name !== 'undefined' ? cat.name : '';
    var catClr  = cat && cat.color ? cat.color : 'var(--tx3)';
    var objName = obj && obj.name && obj.name !== 'undefined' ? obj.name : '';
    var note    = tx.note && tx.note !== 'undefined' ? tx.note : '';

    var meta = [];
    if (catName) meta.push('<span style="color:' + catClr + ';font-weight:600">' + esc(catName) + '</span>');
    if (objName) meta.push(esc(objName));

    html += '<div class="rp2-tx-item">' +
      '<div class="rp2-tx-date">' + esc(dFmt) + '</div>' +
      '<div class="rp2-tx-main">' +
        (meta.length ? '<div class="rp2-tx-meta">' + meta.join(' · ') + '</div>' : '') +
        (note ? '<div class="rp2-tx-note">' + esc(note) + '</div>' : '') +
      '</div>' +
      '<div class="rp2-tx-amt' + (isPos ? ' rp2-pos' : '') + '">' +
        (isPos ? '+' : '−') + amt.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €' +
      '</div></div>';
  });
  document.getElementById('rp2-tx-list').innerHTML = html || '<div class="cf-empty">Keine Einträge</div>';
}

function rp2ExportExcel(btn) {
  if (typeof XLSX === 'undefined') {
    if (btn) { btn.disabled = true; btn.textContent = 'Lädt…'; }
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    s.onload  = function() { if (btn) { btn.disabled = false; btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Excel'; } rp2ExportExcel(null); };
    s.onerror = function() { if (btn) { btn.disabled = false; btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Excel'; } toast('Fehler: Internetverbindung für Excel-Export benötigt'); };
    document.head.appendChild(s);
    return;
  }

  var txs = rp2Filter();
  txs.sort(function(a, b) { var da = rp2TxISO(a)||'', db = rp2TxISO(b)||''; return da < db ? -1 : da > db ? 1 : 0; });

  var cats = {};
  FP.Store.Categories.getAll().forEach(function(c) { cats[c.id] = c; });
  var objs = {};
  FP.Store.Objects.getAll().forEach(function(o) { objs[o.id] = o; });

  // Sheet 1: Transaktionen
  var txRows = [['Datum','Betrag (€)','Kategorie','Objekt','Notiz']];
  txs.forEach(function(tx) {
    var cat = tx.categoryId ? cats[tx.categoryId] : null;
    var obj = tx.objectId   ? objs[tx.objectId]   : null;
    txRows.push([
      rp2TxFmt(tx),
      tx.amount,
      cat && cat.name !== 'undefined' ? (cat.name || '') : '',
      obj && obj.name !== 'undefined' ? (obj.name || '') : '',
      tx.note && tx.note !== 'undefined' ? (tx.note || '') : ''
    ]);
  });

  // Sheet 2: Monats-Breakdown
  var byMonth = rp2BuildByMonth(txs);
  var total   = Object.values(byMonth).reduce(function(s, v) { return s + v; }, 0);
  var sumKeys = Object.keys(byMonth).sort();
  var sumRows = [['Monat','Betrag (€)','Anteil (%)']];
  sumKeys.forEach(function(k) {
    var p = k.split('-');
    sumRows.push([
      RP2_MLAB[parseInt(p[1],10)-1] + ' ' + p[0],
      byMonth[k],
      total > 0 ? Math.round((byMonth[k]/total)*100) : 0
    ]);
  });
  sumRows.push(['Gesamt', total, 100]);

  var catNames = _rp2.cats.map(function(id) { return cats[id] ? cats[id].name : id; }).join(', ');
  var dateStr = new Date().toISOString().substring(0, 10).replace(/-/g, '');

  var wb  = XLSX.utils.book_new();
  var ws1 = XLSX.utils.aoa_to_sheet(txRows);
  XLSX.utils.book_append_sheet(wb, ws1, 'Transaktionen');
  var ws2 = XLSX.utils.aoa_to_sheet(sumRows);
  XLSX.utils.book_append_sheet(wb, ws2, 'Monats-Übersicht');

  var fname = 'Report_' + (catNames.replace(/[^a-zA-ZäöüÄÖÜ0-9_]/g, '_').substring(0, 30) || 'Kategorien') + '_' + dateStr + '.xlsx';
  XLSX.writeFile(wb, fname);
  toast('Excel-Export heruntergeladen');
}

// ── Sidebar Tooltip ──
(function(){
  var tip = document.createElement('div');
  tip.id = 'sb-tooltip';
  document.body.appendChild(tip);
  var hideT;

  document.querySelectorAll('#sidebar .sb-item[data-tip]').forEach(function(btn){
    btn.addEventListener('mouseenter', function(){
      var sb = document.getElementById('sidebar');
      if(sb && sb.classList.contains('expanded')) return;
      clearTimeout(hideT);
      var r = btn.getBoundingClientRect();
      tip.textContent = btn.getAttribute('data-tip');
      tip.style.left = (r.right + 10) + 'px';
      tip.style.top  = (r.top + r.height/2) + 'px';
      tip.style.transform = 'translateY(-50%)';
      tip.style.opacity = '1';
    });
    btn.addEventListener('mouseleave', function(){
      hideT = setTimeout(function(){ tip.style.opacity = '0'; }, 80);
    });
  });
})();

