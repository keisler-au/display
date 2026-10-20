import assert from 'node:assert/strict';
import {test} from 'node:test';
import {questionPage, QUESTION_PAGE_SIZE} from '../app/core/pagination.mjs';
import {filterQuestions} from '../app/core/difficulty.mjs';
import {createSession} from '../app/core/session.mjs';

test('pages a large deck newest first without gaps, duplicates, or changing stored order',() => {
  const questions = Array.from({length:1339},(_,id) => ({id}));
  const original = [...questions];
  const seen = [];
  for (let index = 0; index < Math.ceil(questions.length / QUESTION_PAGE_SIZE); index++) {
    const page = questionPage(questions,index);
    assert.ok(page.questions.length <= QUESTION_PAGE_SIZE);
    assert.equal(page.first,seen.length + 1);
    seen.push(...page.questions);
    assert.equal(page.last,seen.length);
  }
  assert.deepEqual(seen,[...original].reverse());
  assert.deepEqual(questions,original);
});

test('clamps the page after deleting or filtering questions and handles empty decks',() => {
  const questions = Array.from({length:51},(_,id) => ({id}));
  assert.equal(questionPage(questions,1).questions.length,1);
  const shortened = questionPage(questions.slice(1),1);
  assert.equal(shortened.page,0);
  assert.equal(shortened.questions.length,50);
  const empty = questionPage([],10);
  assert.deepEqual(empty.questions,[]);
  assert.equal(empty.page,0);
  assert.equal(empty.pageCount,1);
  assert.equal(empty.first,0);
  assert.equal(empty.last,0);
});

test('pagination leaves the full filtered set available to study',() => {
  const questions = Array.from({length:240},(_,id) => ({id:String(id),difficulty:id % 2 ? 'easy' : 'hard'}));
  const selected = filterQuestions(questions,'hard');
  assert.equal(questionPage(selected).questions.length,50);
  const session = createSession({id:'deck',questions},selected,'hard');
  assert.equal(session.questions.length,120);
  assert.deepEqual(new Set(session.questions.map(question => question.id)),new Set(selected.map(question => question.id)));
});
