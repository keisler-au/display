import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createEditorLayout} from '../app/ui/editor-layout.mjs';

test('editor dimensions survive form replacement and reopening with saved preferences', () => {
  const previous = {document:globalThis.document, window:globalThis.window, ResizeObserver:globalThis.ResizeObserver};
  const observers = [];
  const values = new Map();
  const storage = {getItem:key => values.get(key) ?? null, setItem:(key,value) => values.set(key,value)};
  const element = (width = 350) => ({
    style:{setProperty(name,value) { this[name] = value; }},
    attributes:{}, listeners:{}, classList:{add() {}, remove() {}},
    append(child) { this.child = child; },
    setAttribute(name,value) { this.attributes[name] = value; },
    addEventListener(name,handler) { this.listeners[name] = handler; },
    getBoundingClientRect:() => ({width}),
    setPointerCapture() {}
  });
  globalThis.document = {createElement:() => element()};
  globalThis.window = {addEventListener() {}};
  globalThis.ResizeObserver = class {
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe() {}
    disconnect() {}
  };
  try {
    const workspace = element(1120);
    const form = element();
    form.id = 'questionForm';
    let answer = {id:'edit-answer', style:{}};
    form.querySelectorAll = () => [answer];
    const layout = createEditorLayout(workspace, form, storage);
    layout.restore();
    assert.equal(answer.style.height, undefined);
    answer.style.height = '360px';
    // Capture synchronously before saving rebuilds the form, even if the
    // browser has not delivered a resize observation yet.
    layout.capture();
    answer = {id:'edit-answer', style:{}};
    layout.restore();
    assert.equal(answer.style.height, '360px');
    answer.style.height = '410px';
    observers[0].callback();

    const divider = workspace.child;
    divider.listeners.pointerdown({button:0, pointerId:1, clientX:350, preventDefault() {}});
    divider.listeners.pointermove({pointerId:1, clientX:550});
    divider.listeners.pointerup();
    assert.equal(workspace.style['--editor-width'], '550px');
    divider.listeners.keydown({key:'End', preventDefault() {}});
    assert.equal(workspace.style['--editor-width'], '818px');
    divider.listeners.keydown({key:'Home', preventDefault() {}});
    assert.equal(workspace.style['--editor-width'], '280px');

    const reopened = element(1120);
    answer = {id:'edit-answer', style:{}};
    createEditorLayout(reopened, form, storage).restore();
    assert.equal(reopened.style['--editor-width'], '280px');
    assert.equal(answer.style.height, '410px');

    const blockedStorage = {getItem() { throw new Error('Blocked'); }, setItem() { throw new Error('Blocked'); }};
    const fallback = createEditorLayout(element(1120), form, blockedStorage);
    assert.doesNotThrow(() => { fallback.capture(); fallback.restore(); });
  } finally {
    Object.assign(globalThis, previous);
  }
});
