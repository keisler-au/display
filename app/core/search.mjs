import {typeFor} from '../types/index.mjs';

const normalize = value => value.normalize('NFC').toLowerCase().trim().replace(/\s+/gu,' ');

export function searchQuestions(deck, questions, query) {
  const term = normalize(query);
  if (!term) return questions;
  const adapter = typeFor(deck);
  return questions.filter(question => {
    const fields = [question.prompt,question.hint,...(question.options ?? [])];
    for (const answer of adapter.answers(question)) fields.push(answer.value,answer.note);
    return fields.some(value => typeof value === 'string' && normalize(value).includes(term));
  });
}
