export const SET_SIZE = 15;
export function createSession(deck, questions, filter) {
  const items = structuredClone(questions);
  for (let index=items.length-1;index>0;index--) {
    const other = Math.floor(Math.random()*(index+1));
    [items[index],items[other]] = [items[other],items[index]];
  }
  return {deck:structuredClone(deck),questions:items,filter,index:0,summary:false,
    entries:items.map(() => ({draft:{},revealed:false,result:null,rating:null,visited:false,showPrompt:false}))};
}
export const currentEntry = session => session.entries[session.index];
export function previous(session) {
  if (session.summary) { session.summary = false; session.index--; }
  else if (session.index > 0) session.index--;
}
export function advance(session) {
  if (!currentEntry(session)?.revealed) return;
  currentEntry(session).visited = true;
  session.index++;
  session.summary = session.index === session.questions.length || session.index % SET_SIZE === 0;
}
export function roundResults(session) {
  const start = Math.floor((session.index-1)/SET_SIZE)*SET_SIZE;
  return session.entries.slice(start,session.index).map((entry,index) => ({...entry,question:session.questions[start+index]}));
}
export function sessionTotals(session) {
  return session.entries.reduce((totals,entry) => {
    if (entry.visited) totals.completed++;
    if (entry.result) { totals.checked++; totals.correct += Number(entry.result.correct); }
    if (entry.rating && entry.visited) totals.ratings[entry.rating]++;
    return totals;
  },{completed:0,checked:0,correct:0,ratings:{unrated:0,hard:0,medium:0,easy:0}});
}
