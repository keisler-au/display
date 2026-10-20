import {node, button} from './dom.mjs';

const instructions = `Convert the attached study materials or existing decks into Study Room JSON using the structure below. Replace the example with questions covering the supplied content. Preserve the source language and meaning; omit anything without a supported answer. Give every deck a new unique ID and every question a unique ID within its deck, so importing creates new decks. Use nonempty strings (maximum 8000 characters each). Return only valid JSON, without Markdown or commentary, as a downloadable .json file if possible.`;

export const GUIDE_PROMPTS = [
  {
    title:'Flashcards',
    prompt:`${instructions}

Use one focused prompt and its answer per flashcard.

{"format":"study-room-decks","version":1,"decks":[{"id":"new-flashcard-deck-id","name":"Deck name","type":"flashcard","questions":[{"id":"question-1","prompt":"What is the capital of France?","answer":"Paris"}]}]}`
  },
  {
    title:'Text Inputs',
    prompt:`${instructions}

Each item in "answers" is a separate required input, not an alternative spelling. Make the prompt clear about which answers are needed and in what order. Use 1–30 answers per question; prefer short, unambiguous answers. Matching ignores case and normalizes whitespace.

{"format":"study-room-decks","version":1,"decks":[{"id":"new-text-deck-id","name":"Deck name","type":"text","questions":[{"id":"question-1","prompt":"What is the capital of France?","answers":["Paris"]}]}]}`
  },
  {
    title:'Multiple Choice',
    prompt:`${instructions}

For each question, create 2–10 distinct options with exactly one correct answer and plausible, clearly incorrect distractors. When converting flashcards, use the original answer as the correct option. "correctAnswer" is the correct option's zero-based index (0 = first option). Do not add letter prefixes; the app shuffles the options.

{"format":"study-room-decks","version":1,"decks":[{"id":"new-choice-deck-id","name":"Deck name","type":"multiple-choice","questions":[{"id":"question-1","prompt":"What is the capital of France?","options":["Paris","Rome","Berlin","Madrid"],"correctAnswer":0}]}]}`
  }
];

export function mountGuide(container) {
  container.append(node('p','Use AI to turn your study materials, including documents or existing decks, into decks for your chosen testing type. Attach your materials with one of the prompts below, then save the response as a .json file and select Import.','helper'));
  GUIDE_PROMPTS.forEach(({title,prompt},index) => {
    const card = node('section',undefined,'panel guide-card');
    const header = node('div',undefined,'guide-card-header');
    const heading = node('h2',title);
    heading.id = `guide-prompt-${index}`;
    const pre = node('pre',undefined,'guide-code');
    pre.tabIndex = 0;
    pre.setAttribute('aria-labelledby',heading.id);
    const code = node('code',prompt);
    pre.append(code);
    const status = node('p',undefined,'helper guide-copy-status');
    status.setAttribute('role','status');
    const copy = button('⧉ Copy',async () => {
      try {
        await navigator.clipboard.writeText(prompt);
        status.textContent = 'Copied.';
      } catch (_) {
        const range = document.createRange();
        range.selectNodeContents(code);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        status.textContent = 'Select Copy from your browser menu, or press Ctrl+C / ⌘C.';
      }
    });
    copy.setAttribute('aria-label',`Copy ${title} prompt`);
    header.append(heading,copy);
    card.append(header,pre,status);
    container.append(card);
  });
}
