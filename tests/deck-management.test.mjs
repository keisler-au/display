import assert from 'node:assert/strict';
import {test} from 'node:test';
import {bindDeckManagement} from '../app/ui/deck-management.mjs';

function menu() {
  const listeners = new Map();
  const document = new EventTarget();
  const summary = {focus() { this.focused = true; }};
  const action = {closest:() => action};
  const management = {
    open:true, ownerDocument:document,
    querySelector:() => summary,
    contains:target => [management,summary,action].includes(target),
    addEventListener(type,handler,capture = false) { listeners.set(type,{handler,capture}); }
  };
  bindDeckManagement(management);
  const emit = (type,properties = {}) => listeners.get(type).handler(properties);
  const clickAction = callback => {
    const listener = listeners.get('click');
    if (listener.capture) listener.handler({target:action});
    callback();
    if (!listener.capture) listener.handler({target:action});
  };
  return {management,document,summary,action,emit,clickAction};
}

test('touch blur keeps Import available and its action runs before menu dismissal',() => {
  const {management,summary,emit,clickAction} = menu();
  emit('focusout',{relatedTarget:null});
  assert.equal(management.open,true);
  let fileChooserOpened = false;
  clickAction(() => {
    assert.equal(management.open,true);
    assert.equal(summary.focused,undefined);
    fileChooserOpened = true;
  });
  assert.equal(fileChooserOpened,true);
  assert.equal(management.open,false);
  assert.equal(summary.focused,undefined);
});

test('menu still dismisses on outside focus, outside taps and Escape',() => {
  const {management,document,summary,action,emit} = menu();
  emit('focusout',{relatedTarget:action});
  assert.equal(management.open,true);
  emit('focusout',{relatedTarget:{}});
  assert.equal(management.open,false);
  management.open = true;
  const pointer = new Event('pointerdown');
  Object.defineProperty(pointer,'target',{value:action});
  document.dispatchEvent(pointer);
  assert.equal(management.open,true);
  document.dispatchEvent(new Event('pointerdown'));
  assert.equal(management.open,false);
  management.open = true;
  let prevented = false;
  emit('keydown',{key:'Escape',preventDefault() { prevented = true; }});
  assert.equal(management.open,false);
  assert.equal(summary.focused,true);
  assert.equal(prevented,true);
});
