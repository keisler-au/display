import assert from 'node:assert/strict';
import {test} from 'node:test';
import {searchQuestions} from '../app/core/search.mjs';
import {filterQuestions} from '../app/core/difficulty.mjs';
import {questionPage} from '../app/core/pagination.mjs';
import {parseCollection, updateQuestion} from '../app/core/model.mjs';

test('finds flashcard prompts and answers regardless of case or surrounding whitespace',() => {
  const deck = {type:'flashcard'};
  const questions = [
    {id:'a',prompt:'Good morning',answer:'Goedemorgen'},
    {id:'b',prompt:'Evening',answer:'Goedenavond'}
  ];
  assert.deepEqual(searchQuestions(deck,questions,' MORNING '),[questions[0]]);
  assert.deepEqual(searchQuestions(deck,questions,'GOEDENAVOND'),[questions[1]]);
  assert.equal(searchQuestions(deck,questions,'  '),questions);
  assert.deepEqual(searchQuestions(deck,questions,'missing'),[]);
});

test('searches text answers, hints, and notes with normalized Unicode and whitespace',() => {
  const deck = {type:'text'};
  const question = {prompt:'A drink',hint:'In a café',answers:['Hot\n chocolate','Coffee'],notes:['Sweet','Without milk']};
  for (const query of ['cafe\u0301','hot chocolate','coffee','without milk']) {
    assert.deepEqual(searchQuestions(deck,[question],query),[question]);
  }
});

test('finds multiple choice options including distractors',() => {
  const deck = {type:'multiple-choice'};
  const question = {prompt:'Choose a number',options:['Three','Four'],correctAnswer:1};
  assert.deepEqual(searchQuestions(deck,[question],'three'),[question]);
  assert.deepEqual(searchQuestions(deck,[question],'four'),[question]);
});

test('searches the whole difficulty set before pagination without altering study questions',() => {
  const deck = {type:'flashcard'};
  const questions = Array.from({length:1339},(_,id) => ({
    id:String(id),prompt:`Question ${id}`,answer:'A matching answer',difficulty:id % 2 ? 'easy' : 'hard'
  }));
  const selected = filterQuestions(questions,'hard');
  assert.ok(!questionPage(selected).questions.includes(questions[0]));
  assert.deepEqual(searchQuestions(deck,selected,'question 0'),[questions[0]]);
  const matches = searchQuestions(deck,selected,'matching');
  assert.equal(matches.length,670);
  assert.equal(questionPage(matches).questions.length,50);
  assert.equal(questionPage(matches,13).questions.length,20);
  assert.equal(selected.length,670);
  assert.equal(questions.length,1339);
});

test('search results reflect saved edits without changing other questions',() => {
  const collection = parseCollection({format:'study-room-decks',version:1,decks:[{
    id:'deck',name:'Deck',type:'flashcard',questions:[
      {id:'one',prompt:'First',answer:'Original'},
      {id:'two',prompt:'Second',answer:'Other'}
    ]
  }]});
  const updated = updateQuestion(collection,'deck','one',question => ({...question,answer:'Revised'}));
  const deck = updated.decks[0];
  assert.equal(searchQuestions(deck,deck.questions,'original').length,0);
  assert.equal(searchQuestions(deck,deck.questions,'revised')[0].id,'one');
  assert.equal(collection.decks[0].questions[0].answer,'Original');
  assert.equal(deck.questions[1],collection.decks[0].questions[1]);
});
