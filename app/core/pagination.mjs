export const QUESTION_PAGE_SIZE = 50;

// Questions are stored oldest first and displayed newest first.
export function questionPage(questions, requestedPage = 0) {
  const pageCount = Math.max(1, Math.ceil(questions.length / QUESTION_PAGE_SIZE));
  const page = Math.max(0, Math.min(requestedPage, pageCount - 1));
  const end = questions.length - page * QUESTION_PAGE_SIZE;
  const start = Math.max(0, end - QUESTION_PAGE_SIZE);
  return {
    questions:questions.slice(start,end).reverse(), page, pageCount,
    first:questions.length ? page * QUESTION_PAGE_SIZE + 1 : 0,
    last:questions.length - start
  };
}
