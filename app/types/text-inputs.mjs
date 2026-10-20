import {fail, object, text, list, makeId} from '../core/validation.mjs';
import {node, button, field} from '../ui/dom.mjs';

function normalize(value, matching = {}) {
  let result = value.normalize('NFC').trim().replace(/\s+/gu, ' ');
  if (!matching.caseSensitive) result = result.toLowerCase();
  if (matching.ignoreDiacritics) result = result.normalize('NFD').replace(/\p{M}/gu, '');
  return result;
}
const checkAnswer = (given, expected, matching) => normalize(given, matching) === normalize(expected, matching);
const answerLabel = (index, length) => length === 1 ? 'Answer' : `Answer ${index+1}`;

export default {
  id:'text', name:'Text Inputs',
  normalizeDeck(deck, path) {
    const matching = object(deck.matching ?? {}, `${path}.matching`);
    for (const key of ['caseSensitive', 'ignoreDiacritics']) {
      if (matching[key] !== undefined && typeof matching[key] !== 'boolean') fail(`${path}.matching.${key}`, 'expected true or false');
    }
    return {
      matching:{caseSensitive:matching.caseSensitive ?? false, ignoreDiacritics:matching.ignoreDiacritics ?? false},
      answerLanguage:text(deck.answerLanguage, `${path}.answerLanguage`, true)
    };
  },
  normalizeQuestion(question, path) {
    const answers = list(question.answers, `${path}.answers`).map((value,index) => text(value, `${path}.answers[${index}]`));
    if (!answers.length || answers.length > 30) fail(`${path}.answers`, 'use 1–30 answers');
    const notes = list(question.notes ?? [], `${path}.notes`);
    if (notes.length > answers.length) fail(`${path}.notes`, 'notes must correspond to answers');
    return {hint:text(question.hint, `${path}.hint`, true), answers, notes:answers.map((_,index) => text(notes[index], `${path}.notes[${index}]`, true))};
  },
  editor(question) {
    const element = node('div');
    const hint = field('Prompt hint (optional)', 'edit-hint', {value:question?.hint});
    const rows = node('div');
    const entries = [];
    const update = () => {
      entries.forEach((entry,index) => {
        entry.group.querySelector('label').textContent = answerLabel(index,entries.length);
        entry.remove.hidden = entries.length === 1;
      });
      add.disabled = entries.length >= 30;
    };
    const append = (value = '', note = '', focus = false) => {
      if (entries.length >= 30) return;
      const answer = field('Answer', makeId(), {value, required:true});
      const group = node('div',undefined,'answer-editor-row');
      const entry = {...answer,group,note};
      entry.remove = button('Remove answer',() => {
        entries.splice(entries.indexOf(entry),1);
        group.remove(); update();
      });
      group.append(answer.group,entry.remove);
      entries.push(entry); rows.append(group); update();
      if (focus) answer.input.focus();
    };
    const add = button('Add extra answer',() => append('','',true));
    element.append(hint.group,rows,add);
    (question?.answers ?? ['']).forEach((value,index) => append(value,question?.notes[index] ?? ''));
    return {element, read:() => ({
      hint:hint.input.value.trim(),
      answers:entries.map(entry => entry.input.value.trim()),
      notes:entries.map(entry => entry.note)
    })};
  },
  answers(question) { return question.answers.map((value,index) => ({label:answerLabel(index,question.answers.length),value,note:question.notes[index]})); },
  study({deck, question, entry, reveal}) {
    const form = node('form', undefined, 'typed-question');
    const inputs = [];
    question.answers.forEach((expected,index) => {
      const answer = field(answerLabel(index,question.answers.length), `study-answer-${index}`, {value:entry.draft[index] ?? ''});
      const input = answer.input;
      input.autocomplete = 'off';
      input.spellcheck = false;
      input.setAttribute('autocapitalize', 'off');
      input.enterKeyHint = index === question.answers.length-1 ? 'done' : 'next';
      if (deck.answerLanguage) input.lang = deck.answerLanguage;
      input.addEventListener('input', () => { entry.draft[index] = input.value; });
      input.addEventListener('keydown', event => {
        if (event.key === 'Enter' && !event.isComposing && !entry.revealed && inputs[index+1]) {
          event.preventDefault(); inputs[index+1].focus();
        }
      });
      if (entry.revealed) {
        input.readOnly = true;
        const result = entry.result.fields[index];
        input.classList.add(result.correct ? 'is-correct' : 'is-wrong');
        input.setAttribute('aria-invalid', String(!result.correct));
        const feedback = node('p', `${result.correct ? 'Correct' : 'Expected'}: ${expected}${question.notes[index] ? ` (${question.notes[index]})` : ''}`, `answer-feedback ${result.correct ? 'is-correct' : 'is-wrong'}`);
        feedback.id = `${input.id}-feedback`;
        answer.group.append(feedback);
        input.setAttribute('aria-describedby',feedback.id);
      }
      inputs.push(input); form.append(answer.group);
    });
    if (!entry.revealed) {
      const check = node('button', 'Check answer', 'button primary');
      check.type = 'submit'; form.append(check);
    }
    form.addEventListener('submit', event => { event.preventDefault(); if (!entry.revealed) reveal(); });
    return form;
  },
  evaluate(deck, question, entry) {
    const fields = question.answers.map((expected,index) => ({label:answerLabel(index,question.answers.length),given:entry.draft[index] ?? '',expected,correct:checkAnswer(entry.draft[index] ?? '',expected,deck.matching)}));
    return {correct:fields.every(answer => answer.correct),fields};
  }
};
