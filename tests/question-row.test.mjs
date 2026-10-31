import assert from 'node:assert/strict';
import {test} from 'node:test';
import {questionRow} from '../app/ui/components.mjs';

class Element {
  children = [];
  attributes = {};
  listeners = {};
  append(...children) { this.children.push(...children); }
  setAttribute(name,value) { this.attributes[name] = value; }
  addEventListener(name,listener) { this.listeners[name] = listener; }
  click() { this.listeners.click(); }
}

test('questions start expanded and collapse their details without hiding the prompt',() => {
  const previous = globalThis.document;
  globalThis.document = {createElement:() => new Element()};
  try {
    const states = [];
    const question = {id:'one',prompt:'Hello?',answer:'Hallo',difficulty:'easy'};
    const actions = {edit() {},remove() {},rate() {},toggle:value => states.push(value)};
    const row = questionRow({type:'flashcard'},question,actions);
    const [meta,prompt,details] = row.children;
    const control = meta.children[0];
    assert.equal(prompt.textContent,'Hello?');
    assert.equal(details.hidden,false);
    assert.equal(control.attributes['aria-expanded'],'true');
    assert.equal(control.attributes['aria-controls'],details.id);
    assert.equal(control.children[0].textContent,'Collapse');
    assert.equal(details.children[0].children[2].textContent,'Hallo');
    // The editable difficulty remains in the tools, rather than the header.
    const tools = details.children.at(-1);
    assert.equal(tools.children[0].className,'difficulty-select easy');
    control.click();
    assert.equal(details.hidden,true);
    assert.equal(prompt.hidden,undefined);
    assert.equal(control.attributes['aria-expanded'],'false');
    assert.equal(control.children[0].textContent,'Expand');
    control.click();
    assert.equal(details.hidden,false);
    assert.deepEqual(states,[false,true]);
    const restored = questionRow({type:'flashcard'},question,{...actions,expanded:false});
    assert.equal(restored.children[2].hidden,true);
    assert.equal(restored.children[0].children[0].children[0].textContent,'Expand');
  } finally {
    globalThis.document = previous;
  }
});
