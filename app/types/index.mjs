import flashcards from './flashcards.mjs';
import textInputs from './text-inputs.mjs';
import multipleChoice from './multiple-choice.mjs';
export const TYPES = {flashcard:flashcards, text:textInputs, 'multiple-choice':multipleChoice};
export const typeFor = deck => TYPES[deck.type];
