import assert from 'node:assert/strict';
import {test} from 'node:test';
import multipleChoice from '../app/types/multiple-choice.mjs';
import {parseCollection, readImport, applyImport, updateQuestion} from '../app/core/model.mjs';
import {createStore} from '../app/core/storage.mjs';
import {createSession, currentEntry, advance, previous, sessionTotals, roundResults} from '../app/core/session.mjs';
import {filterQuestions} from '../app/core/difficulty.mjs';

const question = {id:'sum',prompt:'2 + 2?',options:['3','4','5'],correctAnswer:1};
const collection = () => parseCollection({format:'study-room-decks',version:1,decks:[
  {id:'math',name:'Math',type:'multiple-choice',questions:[question]},
  {id:'recall',name:'Recall',type:'flashcard',questions:[{id:'hello',prompt:'Hi',answer:'Hello'}]},
  {id:'typing',name:'Typing',type:'text',questions:[{id:'hello',prompt:'Hi',answers:['Hello']}]}
]});

test('rejects ambiguous options and invalid answer indexes at the import boundary',() => {
  const parse = changes => parseCollection({...collection(),decks:[{...collection().decks[0],questions:[{...question,...changes}]}]});
  for (const options of [[],['one'],Array.from({length:11},(_,index) => String(index)),['same',' same '],['','two']]) {
    assert.throws(() => parse({options}),/options/);
  }
  for (const correctAnswer of [-1,3,1.5,'1',null,undefined]) {
    assert.throws(() => parse({correctAnswer}),/correctAnswer/);
  }
  assert.equal(parse({options:[' 3 ','4','5']}).decks[0].questions[0].options[0],'3');
});

test('grades selections and supplies the shared review field format',() => {
  assert.deepEqual(multipleChoice.evaluate({},question,{draft:{selected:0}}),{
    correct:false,fields:[{label:'Answer',given:'3',expected:'4',correct:false}]
  });
  assert.equal(multipleChoice.evaluate({},question,{draft:{selected:1}}).correct,true);
  assert.equal(multipleChoice.evaluate({},question,{draft:{}}).correct,false);
});

test('uses shared session totals, round results, and previous-question state',() => {
  const deck = collection().decks[0];
  const session = createSession(deck,deck.questions,'all');
  const entry = currentEntry(session);
  advance(session);
  assert.equal(session.index,0);
  entry.draft.selected = 1;
  entry.result = multipleChoice.evaluate(deck,question,entry);
  entry.revealed = true;
  entry.rating = 'easy';
  advance(session);
  assert.equal(session.summary,true);
  assert.deepEqual(sessionTotals(session),{completed:1,checked:1,correct:1,ratings:{unrated:0,hard:0,medium:0,easy:1}});
  assert.equal(roundResults(session)[0].question.id,question.id);
  previous(session);
  assert.equal(currentEntry(session).draft.selected,1);
  assert.equal(currentEntry(session).revealed,true);
});

test('persists ratings and results with other types and round-trips backups',() => {
  const updated = updateQuestion(collection(),'math','sum',item => ({...item,difficulty:'hard',progress:{attempts:2,correct:1}}));
  assert.equal(filterQuestions(updated.decks[0].questions,'hard').length,1);
  const memory = new Map();
  const storage = {getItem:key => memory.get(key) ?? null,setItem:(key,value) => memory.set(key,value)};
  const store = createStore(storage);
  assert.equal(store.save(updated),true);
  assert.deepEqual(createStore(storage).state,store.state);
  const backup = readImport(JSON.stringify(store.state));
  assert.deepEqual(applyImport(collection(),backup),store.state);
  assert.equal(store.state.decks.length,3);
});

test('preserves multiple choice when restoring a legacy backup of another type',() => {
  const original = collection();
  const legacy = readImport({format:'text-test-backup',version:1,decks:[original.decks[2]]});
  assert.deepEqual(applyImport(original,legacy).decks.find(deck => deck.id === 'math'),original.decks[0]);
});
