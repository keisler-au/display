import assert from 'node:assert/strict';
import {test} from 'node:test';
import {parseCollection, readImport} from '../app/core/model.mjs';
import {importCandidates, importDecks} from '../app/core/import.mjs';

const deck = (id, name, answer = 'Current') => ({id,name,type:'flashcard',questions:[{id:`${id}-question`,prompt:'Question',answer}]});
const collection = decks => parseCollection({format:'study-room-backup',version:1,decks});

test('imports old B from a backup while retaining current A and unrelated decks',() => {
  const current = collection([deck('a','A'),deck('b','B'),deck('c','C')]);
  const old = readImport(collection([deck('a','A','Old A'),deck('b','B','Old B')]));
  const candidates = importCandidates(current,old.collection);
  assert.deepEqual(candidates.map(item => item.conflict),[true,true]);
  const result = importDecks(current,[candidates[1].deck]);
  assert.deepEqual(result.decks[0],current.decks[0]);
  assert.equal(result.decks[1].questions[0].answer,'Old B');
  assert.deepEqual(result.decks[2],current.decks[2]);
  assert.equal(result.activeDeckId,'b');
  assert.equal(current.decks[1].questions[0].answer,'Current');
});

test('hides identical decks even when deck and question IDs differ',() => {
  const current = collection([deck('a','A')]);
  assert.deepEqual(importCandidates(current,collection([deck('other-id','A')])),[]);
  assert.deepEqual(importCandidates(current,current),[]);
});

test('a name and type conflict replaces the deck despite different IDs',() => {
  const current = collection([deck('a','A')]);
  const incoming = collection([deck('other-id','A','Old')]);
  assert.equal(importCandidates(current,incoming)[0].conflict,true);
  const result = importDecks(current,incoming.decks);
  assert.equal(result.decks.length,1);
  assert.equal(result.decks[0].id,'a');
  assert.equal(result.decks[0].questions[0].answer,'Old');
});

test('same name with another study type is new, and ID collisions preserve unrelated decks',() => {
  const current = collection([deck('a','A')]);
  const incoming = collection([{id:'a',name:'A',type:'text',questions:[{id:'q',prompt:'Q',answers:['A']}]}]);
  assert.equal(importCandidates(current,incoming)[0].conflict,false);
  const result = importDecks(current,incoming.decks);
  assert.equal(result.decks.length,2);
  assert.deepEqual(result.decks[0],current.decks[0]);
  assert.notEqual(result.decks[1].id,'a');
  assert.equal(result.decks[1].type,'text');
  const renamed = importDecks(current,collection([deck('a','Another name')]).decks);
  assert.equal(renamed.decks.length,2);
  assert.deepEqual(renamed.decks[0],current.decks[0]);
});

test('import all skips identical decks and preserves decks missing from the file',() => {
  const current = collection([deck('a','A'),deck('b','B'),deck('c','C')]);
  const incoming = collection([deck('new-a','A'),deck('new-b','B','Old B'),deck('d','D')]);
  const candidates = importCandidates(current,incoming);
  assert.deepEqual(candidates.map(item => item.deck.name),['B','D']);
  const result = importDecks(current,candidates.map(item => item.deck));
  assert.deepEqual(result.decks.map(item => item.name),['A','B','C','D']);
  assert.deepEqual(result.decks[0],current.decks[0]);
  assert.deepEqual(importCandidates(result,incoming),[]);
});

test('detects changes in all study content and retains imported ratings and results',() => {
  const current = collection([
    {id:'text',name:'Text',type:'text',questions:[{id:'q',prompt:'Q',answers:['A'],notes:['Note']}]},
    {id:'mc',name:'Choice',type:'multiple-choice',questions:[{id:'q',prompt:'Q',options:['A','B'],correctAnswer:0}]}
  ]);
  const incoming = structuredClone(current);
  incoming.decks[0].matching.caseSensitive = true;
  incoming.decks[0].questions[0].notes[0] = 'Updated note';
  incoming.decks[0].questions[0].progress = {attempts:3,correct:2};
  incoming.decks[0].questions[0].difficulty = 'hard';
  incoming.decks[1].questions[0].correctAnswer = 1;
  assert.deepEqual(importCandidates(current,incoming).map(item => item.conflict),[true,true]);
  assert.deepEqual(importDecks(current,incoming.decks).decks,incoming.decks);
});

test('legacy backups support importing one deck without replacing other decks',() => {
  const current = collection([deck('flashcards:a','A'),deck('flashcards:b','B')]);
  const incoming = readImport({format:'flashcard-desk-backup',version:3,
    decks:[{id:'a',name:'A'},{id:'b',name:'B'}],
    cards:[{id:'qa',deckId:'a',front:'Q',back:'Old A'},{id:'qb',deckId:'b',front:'Q',back:'Old B'}]});
  const result = importDecks(current,[incoming.collection.decks[1]]);
  assert.deepEqual(result.decks[0],current.decks[0]);
  assert.equal(result.decks[1].questions[0].answer,'Old B');
});
