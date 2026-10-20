import {text} from '../core/validation.mjs';
import {node, button, field} from '../ui/dom.mjs';

export default {
  id: 'flashcard', name: 'Flashcards',
  normalizeQuestion(question, path) { return {answer:text(question.answer, `${path}.answer`)}; },
  editor(question) {
    const answer = field('Answer', 'edit-answer', {value:question?.answer, multiline:true, required:true});
    return {element:answer.group, read:() => ({answer:answer.input.value.trim()})};
  },
  answers(question) { return [{label:'Answer', value:question.answer}]; },
  study({question, entry, reveal, render}) {
    const card = button('', () => {
      if (!entry.revealed) reveal();
      else { entry.showPrompt = !entry.showPrompt; render(); }
    }, 'recall-card');
    const showingAnswer = entry.revealed && !entry.showPrompt;
    card.append(node('span', showingAnswer ? 'Answer' : 'Question', 'eyebrow'),
      node('span', showingAnswer ? question.answer : question.prompt, showingAnswer ? 'recall-answer' : 'question-prompt'));
    const container = node('div');
    container.append(card);
    if (!entry.revealed) container.append(button('Show answer', reveal, 'button primary wide'));
    return container;
  }
};
