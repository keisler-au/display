import assert from 'node:assert/strict';
import {test} from 'node:test';
import {showImportDialog} from '../app/ui/import.mjs';

// Exercise the dialog's actions without requiring a browser dependency.
class Element {
  children = [];
  listeners = {};
  attributes = {};
  open = false;
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = children; }
  setAttribute(name,value) { this.attributes[name] = value; }
  addEventListener(name,handler) { this.listeners[name] = handler; }
  click() { this.listeners.click(); }
  focus() { this.focused = true; }
  showModal() { this.open = true; }
  close() { this.open = false; }
}

test('dialog imports individual decks, leaves the others available, and imports the rest at once',() => {
  const previous = globalThis.document;
  globalThis.document = {createElement:() => new Element()};
  try {
    const dialog = new Element();
    const a = {deck:{name:'A',type:'flashcard'},conflict:false};
    const b = {deck:{name:'B',type:'text'},conflict:true};
    const imported = [];
    showImportDialog(dialog,[a,b],decks => { imported.push(decks); return true; });
    const [,list,,actions] = dialog.children;
    assert.equal(dialog.open,true);
    assert.equal(list.children.length,2);
    assert.deepEqual(list.children[0].children[0].children.map(item => item.textContent),['A','Flashcards']);
    assert.deepEqual(list.children[1].children[0].children.map(item => item.textContent),['B','Text Inputs','Conflict · replaces existing']);
    assert.equal(actions.children[0].textContent,'Import all decks');
    list.children[1].children[1].click();
    assert.deepEqual(imported,[[b.deck]]);
    assert.equal(dialog.open,true);
    assert.equal(list.children.length,1);
    actions.children[0].click();
    assert.deepEqual(imported,[[b.deck],[a.deck]]);
    assert.equal(dialog.open,false);
  } finally { globalThis.document = previous; }
});

test('closing makes no change, failed imports remain available, and errors stay in the dialog',() => {
  const previous = globalThis.document;
  globalThis.document = {createElement:() => new Element()};
  try {
    const dialog = new Element();
    const candidate = {deck:{name:'A',type:'flashcard'},conflict:false};
    let attempts = 0;
    showImportDialog(dialog,[candidate],() => { attempts++; return false; });
    const [,list,error,actions] = dialog.children;
    actions.children[0].click();
    assert.equal(dialog.open,true);
    assert.equal(list.children.length,1);
    assert.equal(attempts,1);
    actions.children[1].click();
    assert.equal(attempts,1);
    assert.equal(dialog.open,false);
    showImportDialog(dialog,[candidate],() => { throw new Error('Import failed'); });
    dialog.children[3].children[0].click();
    assert.equal(dialog.children[2].textContent,'Import failed');
    assert.equal(dialog.open,true);
  } finally { globalThis.document = previous; }
});
