import {node, button} from './dom.mjs';
import {DIFFICULTIES, FILTERS, label, difficultyCounts} from '../core/difficulty.mjs';
import {typeFor} from '../types/index.mjs';

export function ratingSelect(question, onChange) {
  const select = node('select',undefined,`difficulty-select ${question.difficulty}`);
  select.setAttribute('aria-label',`Difficulty for ${question.prompt.slice(0,80)}`);
  DIFFICULTIES.forEach(value => {
    const option = node('option',label(value));
    option.value = value;
    option.selected = question.difficulty === value;
    select.append(option);
  });
  select.addEventListener('change',() => onChange(select.value));
  return select;
}
export function filters(questions, selected, onSelect) {
  const counts = difficultyCounts(questions);
  return FILTERS.map(filter => {
    const chip = button(`${label(filter)} ${counts[filter]}`,()=>onSelect(filter),`filter-chip ${filter}`);
    chip.setAttribute('aria-pressed',String(filter === selected));
    return chip;
  });
}
export function ratingActions(onRate) {
  const group = node('div',undefined,'rating-actions');
  group.setAttribute('role','group');
  group.setAttribute('aria-label','Rate difficulty and continue');
  for (const value of ['hard','medium','easy']) {
    const rate = button(label(value),()=>onRate(value),`button rating-button ${value}`);
    group.append(rate);
  }
  return group;
}
export function questionRow(deck, question, {edit,remove,rate}) {
  const row = node('article',undefined,'panel question-row');
  const meta = node('div',undefined,'row-meta');
  meta.append(node('span',label(question.difficulty),`difficulty-badge ${question.difficulty}`));
  row.append(meta,node('h3',question.prompt,'row-prompt'));
  if (deck.type === 'text' && question.hint) row.append(node('p',question.hint,'helper'));
  typeFor(deck).answers(question).forEach(answer => {
    const line = node('p',undefined,'answer-line');
    line.append(node('strong',`${answer.label}:`),node('br'),node('span',answer.value));
    if (answer.note) line.append(node('span',` (${answer.note})`,'helper'));
    row.append(line);
  });
  const tools = node('div',undefined,'row-tools');
  tools.append(ratingSelect(question,rate),button('Edit',edit),button('Delete',remove,'button danger'));
  row.append(tools);
  return row;
}
export function reviewList(results, deck) {
  const container = node('section',undefined,'review-list');
  const checked = !!typeFor(deck).evaluate;
  const missed = checked ? results.filter(entry => entry.result && !entry.result.correct) : results;
  container.append(node('h3',checked ? 'Missed answers in this round' : 'Questions in this round'));
  if (!missed.length) container.append(node('p','None — perfect round!','helper'));
  missed.forEach(entry => {
    const item = node('article',undefined,'review-item');
    item.append(node('h4',entry.question.prompt));
    if (entry.result) {
      entry.result.fields.filter(field => !field.correct).forEach(field => {
        item.append(node('p',`${field.label}: ${field.expected}`,'is-correct'),node('p',`${deck.type === 'multiple-choice' ? 'You selected' : 'You entered'}: ${field.given || '(blank)'}`,'is-wrong'));
      });
    } else typeFor(deck).answers(entry.question).forEach(answer => item.append(node('p',`${answer.label}: ${answer.value}`)));
    item.append(node('span',label(entry.rating ?? entry.question.difficulty),`difficulty-badge ${entry.rating ?? entry.question.difficulty}`));
    container.append(item);
  });
  return container;
}
