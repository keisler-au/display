import {emptyCollection, parseCollection, readImport, mergeCollections, BACKUP_FORMAT} from './model.mjs';

// Keep historical storage keys so existing decks and undo copies remain available.
export const STORAGE_KEY = 'study-room.library.v1';
const RECOVERY_KEY = 'study-room.library.recovery.v1';
const LEGACY = [
  ['flashcard-desk.cards.v1','flashcard-desk.recovery.v1','Flashcards'],
  ['study-room.text-tests.v1','study-room.text-tests.recovery.v1','Text Inputs']
];

export function createStore(storage) {
  let state = emptyCollection();
  let pending = false;
  let warning = '';
  let migrationWarning = '';
  let canUndo = false;
  let lastSavedRaw = null;
  function read(key, parser = parseCollection) {
    const raw = storage.getItem(key);
    return raw ? parser(raw) : null;
  }
  function save(next, {undo = true} = {}) {
    const validated = parseCollection({...next,format:BACKUP_FORMAT});
    const previous = state;
    state = validated;
    pending = true;
    try {
      if (storage.getItem(STORAGE_KEY) !== lastSavedRaw) {
        warning = 'Another tab changed the collection. Your changes are kept in memory; export a backup before reloading.';
        return false;
      }
      if (undo) {
        storage.setItem(RECOVERY_KEY,JSON.stringify(previous));
        canUndo = true;
      }
      const serialized = JSON.stringify(state);
      storage.setItem(STORAGE_KEY,serialized);
      if (storage.getItem(STORAGE_KEY) !== serialized) throw new Error('Save verification failed');
      lastSavedRaw = serialized;
      warning = migrationWarning;
      pending = false;
      return true;
    } catch (_) {
      warning = 'Could not save in this browser. Export a backup before leaving.';
      return false;
    }
  }
  function load() {
    const issues = [];
    let primaryExists = false;
    try {
      lastSavedRaw = storage.getItem(STORAGE_KEY);
      primaryExists = !!lastSavedRaw;
      const saved = lastSavedRaw ? parseCollection(lastSavedRaw) : null;
      if (saved) {
        state = saved; pending = false;
        warning = migrationWarning;
        try { canUndo = !!read(RECOVERY_KEY); } catch (_) { canUndo = false; }
        return;
      }
    } catch (_) { issues.push('The saved collection could not be read.'); }
    try {
      const recovered = read(RECOVERY_KEY);
      if (recovered) {
        state = recovered; pending = false; canUndo = true;
        warning = 'Recovered the previous saved collection. Export a backup.';
        return;
      }
    } catch (_) { /* Retain the unreadable copy for manual recovery. */ }
    if (primaryExists) { warning = `${issues.join(' ')} Import a backup to recover your collection.`; return; }
    let migrated = emptyCollection();
    let found = false;
    for (const [primary,recovery,name] of LEGACY) {
      let legacy = null;
      try { legacy = read(primary,raw => readImport(raw).collection); }
      catch (_) { issues.push(`${name} data could not be read.`); }
      if (!legacy) {
        try {
          legacy = read(recovery,raw => readImport(raw).collection);
          if (legacy) issues.push(`${name} was restored from its recovery copy.`);
        } catch (_) { issues.push(`${name} recovery data could not be read.`); }
      }
      if (legacy) {
        try { migrated = mergeCollections(migrated,legacy); found = true; }
        catch (_) { issues.push(`${name} has conflicting deck IDs. Import its backup separately.`); }
      }
    }
    warning = issues.join(' ');
    migrationWarning = warning;
    state = migrated;
    if (found) save(migrated,{undo:false});
  }
  load();
  return {
    get state() { return state; }, get warning() { return warning; },
    get canUndo() { return canUndo; }, get pending() { return pending; },
    save,
    undo() {
      const previous = read(RECOVERY_KEY);
      if (!previous) throw new Error('No previous saved copy is available.');
      return save(previous);
    },
    reload() { if (pending) return false; load(); return true; }
  };
}
