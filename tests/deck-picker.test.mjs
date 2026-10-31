import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createDeckPicker} from '../app/ui/deck-picker.mjs';

test('deck picker supports selection, keyboard navigation, dismissal, and empty decks',() => {
  const previousDocument = globalThis.document;
  let focused;
  class Element extends EventTarget {
    constructor() {
      super();
      this.attributes = new Map();
      this.children = [];
      this.classList = {toggle() {}};
    }
    setAttribute(name,value) { this.attributes.set(name,value); }
    removeAttribute(name) { this.attributes.delete(name); }
    replaceChildren(...children) { this.children = children; children.forEach(child => { child.parentElement = this; }); }
    contains(target) { return target === this || this.children.some(child => child.contains(target)); }
    focus() { focused = this; }
    scrollIntoView() {}
  }
  const document = new EventTarget();
  document.createElement = () => new Element();
  globalThis.document = document;
  try {
    const parent = new Element();
    const trigger = new Element();
    trigger.ownerDocument = document;
    const list = new Element();
    const value = new Element();
    parent.replaceChildren(trigger,list);
    const picker = createDeckPicker(trigger,list,value);
    const decks = [{id:'one',name:'Dutch'},{id:'two',name:'French'},{id:'three',name:'Spanish'}];
    let changes = 0;
    trigger.addEventListener('change',() => { changes++; picker.render(decks,trigger.value); });
    const key = (target,key) => {
      const event = new Event('keydown',{cancelable:true});
      Object.defineProperty(event,'key',{value:key});
      target.dispatchEvent(event);
    };
    picker.render(decks,'one');
    assert.equal(value.textContent,'Dutch');
    assert.equal(trigger.disabled,false);
    trigger.dispatchEvent(new Event('click'));
    assert.equal(list.hidden,false);
    assert.equal(focused,list);
    key(list,'ArrowDown');
    key(list,'Enter');
    assert.equal(trigger.value,'two');
    assert.equal(value.textContent,'French');
    assert.equal(changes,1);
    assert.equal(list.hidden,true);
    assert.equal(focused,trigger);
    key(trigger,'End');
    assert.equal(list.attributes.get('aria-activedescendant'),'deck-option-2');
    key(list,'Escape');
    assert.equal(changes,1);
    assert.equal(list.hidden,true);
    key(trigger,'Home');
    key(list,'s');
    key(list,'Enter');
    assert.equal(trigger.value,'three');
    trigger.dispatchEvent(new Event('click'));
    list.children[0].dispatchEvent(new Event('click'));
    assert.equal(trigger.value,'one');
    trigger.dispatchEvent(new Event('click'));
    key(list,'Tab');
    assert.equal(list.hidden,true);
    trigger.dispatchEvent(new Event('click'));
    document.dispatchEvent(new Event('pointerdown'));
    assert.equal(list.hidden,true);
    picker.render([],undefined);
    assert.equal(value.textContent,'No decks yet');
    assert.equal(trigger.disabled,true);
    assert.equal(list.children.length,0);
    key(trigger,'ArrowDown');
    assert.equal(list.hidden,true);
  } finally {
    globalThis.document = previousDocument;
  }
});
