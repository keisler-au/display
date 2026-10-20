import flashcards from './flashcards.mjs';
import textInputs from './text-inputs.mjs';
export const TYPES = {flashcard:flashcards, text:textInputs};
export const typeFor = deck => TYPES[deck.type];
