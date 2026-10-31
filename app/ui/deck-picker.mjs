import {node} from './dom.mjs';

export function createDeckPicker(trigger, list, value) {
  let decks = [];
  let active = 0;
  let prefix = '';
  let lastTyped = 0;
  const close = (restoreFocus = false) => {
    list.hidden = true;
    trigger.setAttribute('aria-expanded','false');
    if (restoreFocus) trigger.focus();
  };
  const highlight = index => {
    active = Math.max(0,Math.min(decks.length - 1,index));
    [...list.children].forEach((option,index) => option.classList.toggle('is-active',index === active));
    const option = list.children[active];
    if (option) {
      list.setAttribute('aria-activedescendant',option.id);
      option.scrollIntoView({block:'nearest'});
    }
  };
  const open = () => {
    if (trigger.disabled) return;
    list.hidden = false;
    trigger.setAttribute('aria-expanded','true');
    prefix = '';
    highlight(decks.findIndex(deck => deck.id === trigger.value));
    list.focus();
  };
  const choose = index => {
    if (!decks[index]) return;
    trigger.value = decks[index].id;
    close(true);
    trigger.dispatchEvent(new Event('change'));
  };
  trigger.addEventListener('click',() => list.hidden ? open() : close());
  trigger.addEventListener('keydown',event => {
    if (['ArrowDown','ArrowUp','Home','End'].includes(event.key)) {
      event.preventDefault();
      open();
      if (event.key === 'Home') highlight(0);
      if (event.key === 'End') highlight(decks.length - 1);
    }
  });
  list.addEventListener('keydown',event => {
    if (event.key === 'Tab') { close(); return; }
    if (event.key === 'Escape') { event.preventDefault(); close(true); return; }
    if (['ArrowDown','ArrowUp','Home','End','Enter',' '].includes(event.key)) {
      event.preventDefault();
      if (event.key === 'ArrowDown') highlight((active + 1) % decks.length);
      if (event.key === 'ArrowUp') highlight((active - 1 + decks.length) % decks.length);
      if (event.key === 'Home') highlight(0);
      if (event.key === 'End') highlight(decks.length - 1);
      if (event.key === 'Enter' || event.key === ' ') choose(active);
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      const now = Date.now();
      prefix = (now - lastTyped < 700 ? prefix : '') + event.key.toLocaleLowerCase();
      lastTyped = now;
      const index = decks.findIndex(deck => deck.name.toLocaleLowerCase().startsWith(prefix));
      if (index !== -1) highlight(index);
    }
  });
  trigger.ownerDocument.addEventListener('pointerdown',event => {
    if (!trigger.parentElement.contains(event.target)) close();
  });
  trigger.parentElement.addEventListener('focusout',event => {
    if (!trigger.parentElement.contains(event.relatedTarget)) close();
  });
  return {
    render(items,selectedId) {
      close();
      decks = items;
      trigger.value = selectedId ?? '';
      trigger.disabled = !decks.length;
      value.textContent = decks.find(deck => deck.id === selectedId)?.name ?? 'No decks yet';
      list.removeAttribute('aria-activedescendant');
      list.replaceChildren(...decks.map((deck,index) => {
        const option = node('div',deck.name,'deck-option');
        option.id = `deck-option-${index}`;
        option.setAttribute('role','option');
        option.setAttribute('aria-selected',String(deck.id === selectedId));
        option.addEventListener('click',() => choose(index));
        return option;
      }));
    }
  };
}
