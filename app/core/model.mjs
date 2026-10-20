import {fail, object, text, list, unique, count} from './validation.mjs';
import {difficulty} from './difficulty.mjs';
import {TYPES} from '../types/index.mjs';

const VERSION = 1;
export const BACKUP_FORMAT = 'study-room-backup';
const DECK_FORMAT = 'study-room-decks';
export const emptyCollection = () => ({format:BACKUP_FORMAT, version:VERSION, decks:[], activeDeckId:null});

export function parseCollection(raw) {
  const data = object(typeof raw === 'string' ? JSON.parse(raw) : raw, 'file');
  if (![BACKUP_FORMAT, DECK_FORMAT].includes(data.format)) fail('format', 'expected a Study Room deck or backup');
  if (data.version !== VERSION) fail('version', `only version ${VERSION} is supported`);
  const decks = unique(list(data.decks,'decks').map((value, index) => {
    const path = `decks[${index}]`;
    const valueObject = object(value,path);
    if (!Object.hasOwn(TYPES,valueObject.type)) fail(`${path}.type`, `expected ${Object.keys(TYPES).join(', ')}`);
    const adapter = TYPES[valueObject.type];
    const deck = {
      id:text(valueObject.id,`${path}.id`), name:text(valueObject.name,`${path}.name`), type:valueObject.type,
      ...(adapter.normalizeDeck?.(valueObject,path) ?? {})
    };
    deck.questions = unique(list(valueObject.questions,`${path}.questions`).map((value, qi) => {
      const qp = `${path}.questions[${qi}]`;
      const source = object(value,qp);
      // Normalize older keyed/nested answer lists to one string per required input.
      let question = source;
      if (deck.type === 'text') {
        let answers = source.answers;
        let notes = source.notes;
        if (answers && !Array.isArray(answers)) {
          const keyed = object(answers,`${qp}.answers`);
          const keyedNotes = object(notes ?? {},`${qp}.notes`);
          const keys = Object.keys(keyed);
          answers = keys.map(key => keyed[key]);
          notes = keys.map(key => keyedNotes[key] ?? '');
        }
        question = {...source,answers:list(answers,`${qp}.answers`).map(value => Array.isArray(value) ? value[0] : value),notes};
      }
      const progress = object(question.progress ?? {},`${qp}.progress`);
      const attempts = count(progress.attempts,`${qp}.progress.attempts`);
      const correct = count(progress.correct,`${qp}.progress.correct`);
      if (correct > attempts) fail(`${qp}.progress`, 'correct cannot exceed attempts');
      return {
        id:text(question.id,`${qp}.id`), prompt:text(question.prompt,`${qp}.prompt`),
        difficulty:difficulty(question.difficulty), progress:{attempts,correct},
        ...adapter.normalizeQuestion(question,qp,deck)
      };
    }),`${path}.questions`);
    return deck;
  }),'decks');
  return {format:data.format, version:VERSION, decks, activeDeckId:decks.some(deck => deck.id === data.activeDeckId) ? data.activeDeckId : decks[0]?.id ?? null};
}

// Compatibility lives at the boundary. The app only works with the shared model above.
export function readImport(raw) {
  const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
  if (data?.format === BACKUP_FORMAT || data?.format === DECK_FORMAT) return {collection:parseCollection(data), replace:data.format === BACKUP_FORMAT, scope:null};
  if (['text-test-decks','text-test-backup'].includes(data?.format)) {
    if (data.version !== 1) fail('version', 'unsupported Text Inputs format');
    const collection = parseCollection({...data,format:DECK_FORMAT});
    if (collection.decks.some(deck => deck.type !== 'text')) fail('decks','a legacy Text Inputs file can only contain text-input decks');
    return {collection, replace:data.format === 'text-test-backup', scope:'text'};
  }
  if (Array.isArray(data) || data?.format === 'flashcard-desk-backup' || (data && Array.isArray(data.cards) && !data.format)) {
    if (!Array.isArray(data) && data.version !== undefined && ![1,2,3].includes(data.version)) fail('version','unsupported flashcard format');
    const cards = list(Array.isArray(data) ? data : data.cards,'cards');
    const originalDecks = Array.isArray(data.decks) && data.decks.length ? data.decks : [{id:'legacy-general',name:'General'}];
    const knownDecks = unique(originalDecks.map((deck,index) => ({id:text(deck.id,`decks[${index}].id`),name:text(deck.name,`decks[${index}].name`)})),'decks');
    const fallback = knownDecks[0].id;
    const decks = knownDecks.map(deck => ({
      id:`flashcards:${deck.id}`,name:deck.name,type:'flashcard',
      questions:cards.filter(card => (knownDecks.some(item => item.id === card?.deckId) ? card.deckId : fallback) === deck.id).map((card,index) => {
        object(card,`cards[${index}]`);
        return {id:card.id,prompt:card.front,answer:card.back,difficulty:card.difficulty};
      })
    }));
    return {collection:parseCollection({format:DECK_FORMAT,version:VERSION,decks,activeDeckId:`flashcards:${data.activeDeckId}`}),replace:true,scope:'flashcard'};
  }
  fail('file','unrecognized deck or backup format');
}

export function mergeCollections(current,incoming) {
  const replacements = new Map(incoming.decks.map(deck => [deck.id,deck]));
  return parseCollection({...current, format:BACKUP_FORMAT,
    decks:[...current.decks.map(deck => replacements.get(deck.id) ?? deck), ...incoming.decks.filter(deck => !current.decks.some(item => item.id === deck.id))],
    activeDeckId:incoming.activeDeckId ?? current.activeDeckId
  });
}
export function applyImport(current, imported) {
  if (!imported.replace) return mergeCollections(current,imported.collection);
  if (!imported.scope) return parseCollection({...imported.collection,format:BACKUP_FORMAT});
  const kept = current.decks.filter(deck => deck.type !== imported.scope);
  // A legacy backup only replaces its own study type; preserve the rest of the collection.
  if (imported.collection.decks.some(deck => kept.some(item => item.id === deck.id))) fail('decks','an imported deck ID conflicts with a different study type');
  return parseCollection({...current,format:BACKUP_FORMAT,decks:[...kept,...imported.collection.decks],activeDeckId:imported.collection.activeDeckId});
}
export function updateQuestion(collection, deckId, questionId, update) {
  return {...collection, decks:collection.decks.map(deck => deck.id === deckId ? {...deck,questions:deck.questions.map(question => question.id === questionId ? update(question) : question)} : deck)};
}
