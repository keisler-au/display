import {fail, text, list, makeId} from '../core/validation.mjs';
import {node, button, field} from '../ui/dom.mjs';

export default {
  id:'multiple-choice', name:'Multiple Choice',
  normalizeQuestion(question, path) {
    const options = list(question.options,`${path}.options`).map((value,index) => text(value,`${path}.options[${index}]`));
    if (options.length < 2 || options.length > 10) fail(`${path}.options`,'use 2–10 options');
    if (new Set(options).size !== options.length) fail(`${path}.options`,'options must be distinct');
    const correctAnswer = question.correctAnswer;
    if (!Number.isInteger(correctAnswer) || correctAnswer < 0 || correctAnswer >= options.length) fail(`${path}.correctAnswer`,'expected the zero-based index of the correct option');
    return {options,correctAnswer};
  },
  editor(question) {
    const element = node('fieldset',undefined,'choice-group');
    const rows = node('div');
    const entries = [];
    const name = makeId();
    const update = () => {
      entries.forEach((entry,index) => {
        entry.label.textContent = `Option ${index+1}`;
        entry.radio.setAttribute('aria-label',`Option ${index+1} is correct`);
        entry.remove.hidden = entries.length <= 2;
      });
      add.disabled = entries.length >= 10;
    };
    const append = (value = '', correct = false, focus = false) => {
      if (entries.length >= 10) return;
      const answer = field('Option',makeId(),{value,required:true});
      const group = node('div',undefined,'answer-editor-row');
      const selection = node('label',undefined,'choice-selection');
      const radio = node('input');
      radio.type = 'radio'; radio.name = name; radio.required = true; radio.checked = correct;
      selection.append(radio,node('span','Correct answer'));
      const entry = {...answer,group,radio,label:answer.group.querySelector('label')};
      entry.remove = button('Remove option',() => {
        if (entries.length <= 2) return;
        entries.splice(entries.indexOf(entry),1);
        group.remove(); update();
      });
      group.append(answer.group,selection,entry.remove);
      entries.push(entry); rows.append(group); update();
      if (focus) answer.input.focus();
    };
    const add = button('Add option',() => append('',false,true));
    element.append(rows,add);
    (question?.options ?? ['','','','']).forEach((value,index) => append(value,index === (question?.correctAnswer ?? 0)));
    return {element,read:() => ({options:entries.map(entry => entry.input.value.trim()),correctAnswer:entries.findIndex(entry => entry.radio.checked)})};
  },
  answers(question) { return [{label:'Correct answer',value:question.options[question.correctAnswer]}]; },
  study({question, entry, reveal}) {
    const form = node('form');
    const group = node('fieldset',undefined,'choice-group');
    // Keep the shuffled order stable when revisiting a question.
    if (!entry.choiceOrder) {
      entry.choiceOrder = question.options.map((_,index) => index);
      for (let index=entry.choiceOrder.length-1;index>0;index--) {
        const other = Math.floor(Math.random()*(index+1));
        [entry.choiceOrder[index],entry.choiceOrder[other]] = [entry.choiceOrder[other],entry.choiceOrder[index]];
      }
    }
    entry.choiceOrder.forEach(index => {
      const option = node('label',undefined,'choice-option');
      const input = node('input');
      input.type = 'radio'; input.name = 'study-choice'; input.value = String(index);
      input.required = true; input.checked = entry.draft.selected === index; input.disabled = entry.revealed;
      input.addEventListener('change',() => { entry.draft.selected = index; });
      option.append(input,node('span',question.options[index]));
      if (entry.revealed && index === question.correctAnswer) {
        option.classList.add('is-correct'); option.append(node('span','Correct answer','choice-status'));
      } else if (entry.revealed && input.checked) {
        option.classList.add('is-wrong'); option.append(node('span','Your answer','choice-status'));
      }
      group.append(option);
    });
    form.append(group);
    if (!entry.revealed) {
      const check = node('button','Check answer','button primary');
      check.type = 'submit'; form.append(check);
    } else {
      const feedback = node('p',entry.result.correct ? 'Correct!' : `Expected: ${question.options[question.correctAnswer]}`,`answer-feedback ${entry.result.correct ? 'is-correct' : 'is-wrong'}`);
      feedback.setAttribute('role','status'); form.append(feedback);
    }
    form.addEventListener('submit',event => {
      event.preventDefault();
      if (!entry.revealed && Number.isInteger(entry.draft.selected)) reveal();
    });
    return form;
  },
  evaluate(deck, question, entry) {
    const correct = entry.draft.selected === question.correctAnswer;
    return {correct,fields:[{label:'Answer',given:question.options[entry.draft.selected] ?? '',expected:question.options[question.correctAnswer],correct}]};
  }
};
