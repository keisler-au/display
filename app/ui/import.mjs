import {node, button} from './dom.mjs';
import {TYPES} from '../types/index.mjs';

export function showImportDialog(dialog, candidates, onImport) {
  const heading = node('h2','Import decks');
  heading.id = 'dialogTitle';
  const list = node('div',undefined,'import-list');
  const actions = node('div',undefined,'actions');
  const error = node('p',undefined,'is-wrong');
  error.setAttribute('role','status');
  let pending = [...candidates];
  function accept(selected) {
    try {
      if (!onImport(selected.map(item => item.deck))) return;
      pending = pending.filter(item => !selected.includes(item));
      if (!pending.length) dialog.close();
      else { renderRows(); all.focus(); }
    } catch (problem) { error.textContent = problem.message; }
  }
  function renderRows() {
    list.replaceChildren(...pending.map(item => {
      const row = node('div',undefined,'import-row');
      const details = node('div',undefined,'import-details');
      details.append(node('strong',item.deck.name),node('span',TYPES[item.deck.type].name,'import-type'));
      if (item.conflict) details.append(node('span','Conflict · replaces existing','import-conflict'));
      const action = button('Import',() => accept([item]));
      action.setAttribute('aria-label',`Import ${item.deck.name} (${TYPES[item.deck.type].name})`);
      row.append(details,action);
      return row;
    }));
  }
  const all = button('Import all decks',() => accept(pending),'button primary');
  actions.append(all,button('Close',() => dialog.close()));
  renderRows();
  dialog.replaceChildren(heading,list,error,actions);
  dialog.showModal();
  all.focus();
}
