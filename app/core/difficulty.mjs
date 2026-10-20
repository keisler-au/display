export const DIFFICULTIES = ['unrated', 'hard', 'medium', 'easy'];
export const FILTERS = ['all', ...DIFFICULTIES];
export const label = value => value.charAt(0).toUpperCase() + value.slice(1);
export const difficulty = value => DIFFICULTIES.includes(value) ? value : 'unrated';
export const filterQuestions = (questions, filter) => filter === 'all' ? questions : questions.filter(question => question.difficulty === filter);
export function difficultyCounts(questions) {
  return questions.reduce((counts, question) => {
    counts[question.difficulty]++;
    counts.all++;
    return counts;
  }, Object.fromEntries(FILTERS.map(filter => [filter, 0])));
}
