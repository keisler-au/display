import {BACKUP_FORMAT, parseCollection} from './model.mjs';
import {makeId} from './validation.mjs';

// IDs identify stored records, rather than the contents of a deck.
function contents({id, ...deck}) {
  return JSON.stringify({...deck,questions:deck.questions.map(({id, ...question}) => question)});
}

export function importCandidates(current, incoming) {
  return incoming.decks.flatMap(deck => {
    const matches = current.decks.filter(item => item.name === deck.name && item.type === deck.type);
    if (matches.some(item => contents(item) === contents(deck))) return [];
    return [{deck,conflict:matches.length > 0}];
  });
}

export function importDecks(current, selected) {
  const decks = [...current.decks];
  let activeDeckId = current.activeDeckId;
  for (const deck of selected) {
    const index = decks.findIndex(item => item.name === deck.name && item.type === deck.type);
    if (index >= 0 && contents(decks[index]) === contents(deck)) continue;
    // Keep the existing identity when replacing a named deck. Unrelated ID
    // collisions must never replace another deck or study type.
    let id = index >= 0 ? decks[index].id : deck.id;
    while (index < 0 && decks.some(item => item.id === id)) id = makeId();
    const imported = {...deck,id};
    if (index >= 0) decks[index] = imported;
    else decks.push(imported);
    activeDeckId = id;
  }
  return parseCollection({...current,format:BACKUP_FORMAT,decks,activeDeckId});
}
