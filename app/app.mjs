import {mountApp, currentRoute, ROUTES} from './ui/shell.mjs';
import {node, button, link, field, focusHeading} from './ui/dom.mjs';
import {filters, questionRow, ratingActions, reviewList} from './ui/components.mjs';
import {TYPES, typeFor} from './types/index.mjs';
import {makeId} from './core/validation.mjs';
import {filterQuestions} from './core/difficulty.mjs';
import {BACKUP_FORMAT, parseCollection, readImport, applyImport, updateQuestion} from './core/model.mjs';
import {createStore, STORAGE_KEY} from './core/storage.mjs';
import {SET_SIZE, createSession, currentEntry, previous, advance, roundResults, sessionTotals} from './core/session.mjs';

const $ = id => document.getElementById(id);
// Accessing localStorage itself may throw in browsers that block storage.
const storage = {getItem:key => localStorage.getItem(key),setItem:(key,value) => localStorage.setItem(key,value)};
const store = createStore(storage);
// Keep undo available internally while its UI is undecided.
const SHOW_UNDO_BUTTON = false;
let route = currentRoute();
let activeFilter = 'all';
let editingId = null;
let session = null;
let editor = null;
if (location.pathname !== route.path) history.replaceState(null,'',route.path);
const updateNavigation = mountApp($('app'),navigate);
const visibleDecks = () => store.state.decks.filter(deck => deck.type === route.type);
const activeDeck = () => visibleDecks().find(deck => deck.id === store.state.activeDeckId) ?? visibleDecks()[0];
const tell = message => { $('message').textContent = message; };
function updateHeaderActions() {
  $('deckActions').hidden = !!session;
  $('importButton').hidden = !route.type && route.path !== '/guide/';
  $('exportButton').hidden = !route.type && route.path !== '/guide/';
  $('undoButton').hidden = !SHOW_UNDO_BUTTON || !store.canUndo;
}
function save(next, message, options) {
  try {
    store.save(next,options);
    updateHeaderActions();
    if (store.warning || message) tell(store.warning || message);
    if (!$('deckView').hidden) renderDecks();
    return true;
  } catch (error) { tell(`Could not apply this change: ${error.message}`); return false; }
}
function closeEditor() {
  editingId = null;
  editor = null;
  $('questionForm').hidden = true;
  $('workspace').classList.remove('is-editing');
}
function leaveStudy() {
  session = null;
  render();
}
function navigate(next, push = true) {
  if (push && location.pathname !== next.path) history.pushState(null,'',next.path);
  route = next;
  activeFilter = 'all';
  session = null;
  closeEditor();
  render();
  focusHeading($('app'));
}
window.addEventListener('popstate',() => navigate(currentRoute(),false));
function render() {
  updateNavigation();
  document.title = `${route.label} · Study Room`;
  $('pageTitle').textContent = session ? session.deck.name : route.title;
  $('pageTitle').classList.toggle('dashboard-title',route.path === '/');
  $('dashboardView').hidden = route.path !== '/';
  $('guideView').hidden = route.path !== '/guide/';
  if (route.path === '/guide/') $('guideLink').setAttribute('aria-current','page');
  else $('guideLink').removeAttribute('aria-current');
  $('deckView').hidden = !route.type || !!session;
  $('studyView').hidden = !session;
  updateHeaderActions();
  if (route.type) renderDecks();
}
function renderDecks() {
  const decks = visibleDecks();
  const deck = activeDeck();
  const questions = deck?.questions ?? [];
  const selected = filterQuestions(questions,activeFilter);
  $('deckSelect').replaceChildren(...decks.map(item => {
    const option = node('option',item.name);
    option.value = item.id;
    option.selected = item.id === deck?.id;
    return option;
  }));
  $('deckSelect').disabled = !decks.length;
  for (const control of ['renameDeckButton','deleteDeckButton','addQuestionButton']) $(control).disabled = !deck;
  $('studyButton').disabled = !selected.length;
  $('studyButton').textContent = `Study ${activeFilter === 'all' ? 'all' : activeFilter} (${selected.length})`;
  $('deckTitle').textContent = deck?.name ?? 'Your questions';
  $('filters').replaceChildren(...filters(questions,activeFilter,value => { activeFilter = value; renderDecks(); }));
  $('questionList').replaceChildren(...[...selected].reverse().map(question => questionRow(deck,question,{
    edit:() => openEditor(question),
    remove:() => {
      if (!confirm(`Delete “${question.prompt.slice(0,100)}”? You can undo this change.`)) return;
      closeEditor();
      save({...store.state,decks:store.state.decks.map(item => item.id === deck.id ? {...item,questions:item.questions.filter(q => q.id !== question.id)} : item)},'Question deleted');
    },
    rate:value => rateQuestion(deck.id,question.id,value)
  })));
  $('emptyState').hidden = !!selected.length;
  $('emptyState').replaceChildren(node('h3',questions.length ? `No ${activeFilter} questions yet` : deck ? 'This deck is ready for its first question' : 'Make room for something new'),
    node('p',questions.length ? 'Choose another practice set or change a question’s difficulty.' : deck ? 'Add a question using the same editor for every study type.' : 'Create a deck or import a JSON study file.','helper'));
}
function rateQuestion(deckId,questionId,value) {
  return save(updateQuestion(store.state,deckId,questionId,question => ({...question,difficulty:value})));
}
function openEditor(question) {
  const deck = activeDeck();
  if (!deck) return;
  editingId = question?.id ?? null;
  const form = $('questionForm');
  form.hidden = false;
  $('workspace').classList.add('is-editing');
  const prompt = field('Question or prompt','edit-prompt',{value:question?.prompt,multiline:deck.type === 'flashcard',required:true});
  editor = typeFor(deck).editor(question);
  const actions = node('div',undefined,'actions');
  const submit = node('button','Save question','button primary');
  submit.type = 'submit';
  actions.append(submit,button('Cancel',closeEditor));
  form.replaceChildren(node('h3',question ? 'Edit question' : 'Add question'),prompt.group);
  form.append(editor.element,actions);
  form.scrollIntoView({block:'start',behavior:'auto'});
  prompt.input.focus();
}
$('questionForm').addEventListener('submit',event => {
  event.preventDefault();
  const deck = activeDeck();
  const previousQuestion = deck.questions.find(question => question.id === editingId);
  const question = {...previousQuestion,id:editingId ?? makeId(),prompt:$('edit-prompt').value.trim(),
    difficulty:previousQuestion?.difficulty ?? 'unrated',progress:{attempts:0,correct:0},...editor.read()};
  const questions = previousQuestion ? deck.questions.map(item => item.id === question.id ? question : item) : [...deck.questions,question];
  if (save({...store.state,decks:store.state.decks.map(item => item.id === deck.id ? {...item,questions} : item)},'Question saved')) closeEditor();
});
$('addQuestionButton').addEventListener('click',() => openEditor());
$('deckSelect').addEventListener('change',() => {
  closeEditor(); activeFilter = 'all';
  save({...store.state,activeDeckId:$('deckSelect').value},'',{undo:false});
});
$('renameDeckButton').addEventListener('click',() => {
  const deck = activeDeck();
  const name = prompt('Rename deck:',deck.name)?.trim();
  if (!name || name === deck.name) return;
  save({...store.state,decks:store.state.decks.map(item => item.id === deck.id ? {...item,name} : item)},'Deck renamed');
});
$('deleteDeckButton').addEventListener('click',() => {
  const deck = activeDeck();
  if (!confirm(`Delete “${deck.name}” and its ${deck.questions.length} questions? You can undo this change.`)) return;
  closeEditor(); activeFilter = 'all';
  const decks = store.state.decks.filter(item => item.id !== deck.id);
  save({...store.state,decks,activeDeckId:decks.find(item => item.type === route.type)?.id ?? null},'Deck deleted');
});
function openDeckDialog() {
  const dialog = $('deckDialog');
  const form = node('form');
  const heading = node('h2','Create a deck'); heading.id = 'dialogTitle';
  const name = field('Deck name','new-deck-name',{required:true});
  const typeGroup = node('div',undefined,'form-field');
  const typeLabel = node('label','Study type'); typeLabel.htmlFor = 'new-deck-type';
  const type = node('select'); type.id = typeLabel.htmlFor;
  Object.values(TYPES).forEach(adapter => {
    const option = node('option',adapter.name); option.value = adapter.id; type.append(option);
  });
  type.value = route.type ?? 'flashcard';
  typeGroup.append(typeLabel,type);
  const actions = node('div',undefined,'actions');
  const submit = node('button','Create deck','button primary'); submit.type = 'submit';
  actions.append(submit,button('Cancel',() => dialog.close()));
  const error = node('p',undefined,'is-wrong'); error.setAttribute('role','status');
  form.append(heading,name.group,typeGroup,error,actions);
  form.addEventListener('submit',event => {
    event.preventDefault();
    const deck = {id:makeId(),name:name.input.value.trim(),type:type.value,questions:[]};
    try { parseCollection({...store.state,decks:[...store.state.decks,deck]}); }
    catch (problem) { error.textContent = problem.message; return; }
    closeEditor(); activeFilter = 'all';
    if (!save({...store.state,decks:[...store.state.decks,deck],activeDeckId:deck.id},'Deck created')) return;
    dialog.close();
    if (route.type && route.type !== deck.type) navigate(ROUTES.find(item => item.type === deck.type));
    openEditor();
  });
  dialog.replaceChildren(form);
  dialog.showModal();
  name.input.focus();
}
$('newDeckButton').addEventListener('click',openDeckDialog);

function exportBackup() {
  const data = {...store.state,format:BACKUP_FORMAT,exportedAt:new Date().toISOString()};
  const url = URL.createObjectURL(new Blob([JSON.stringify(data,null,2)+'\n'],{type:'application/json'}));
  const anchor = link('',url); anchor.download = `study-room-backup-${new Date().toISOString().slice(0,10)}.json`;
  document.body.append(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url),1000);
  tell('Download started. Keep the file as a portable copy of your study data.');
}
$('exportButton').addEventListener('click',exportBackup);
$('importButton').addEventListener('click',() => $('importFile').click());
$('importFile').addEventListener('change',async () => {
  const file = $('importFile').files[0];
  if (!file) return;
  try {
    const imported = readImport(await file.text());
    if (imported.replace) {
      const scope = imported.scope ? TYPES[imported.scope].name.toLowerCase() : 'study';
      if (!confirm(`Restore ${imported.collection.decks.length} decks? This replaces your ${scope} decks${imported.scope ? ' and keeps the other study types' : ''}. You can undo this change.`)) return;
    } else {
      if (!imported.collection.decks.length) throw new Error('The file contains no decks.');
      const duplicates = imported.collection.decks.filter(deck => store.state.decks.some(item => item.id === deck.id));
      if (duplicates.length && !confirm(`Replace ${duplicates.length} decks with matching IDs, including their saved results and ratings? Other decks will be kept. You can undo this change.`)) return;
    }
    const next = applyImport(store.state,imported);
    closeEditor(); leaveStudy(); activeFilter = 'all';
    if (save(next,`${imported.collection.decks.length} decks imported`)) {
      const selected = store.state.decks.find(deck => deck.id === store.state.activeDeckId);
      if (selected && selected.type !== route.type) navigate(ROUTES.find(item => item.type === selected.type));
    }
  } catch (error) { tell(`Could not import: ${error.message}`); }
  finally { $('importFile').value = ''; }
});
$('undoButton').addEventListener('click',() => {
  try {
    store.undo(); closeEditor(); activeFilter = 'all'; leaveStudy();
    tell(store.warning || 'Previous saved change restored');
  } catch (error) { tell(`Could not undo: ${error.message}`); }
});
window.addEventListener('storage',event => {
  if (event.key !== STORAGE_KEY && event.key !== null) return;
  if (store.pending || !$('questionForm').hidden || $('deckDialog').open || session) {
    tell('Another tab changed your decks. Your current work is still open; export it before reloading to keep a separate copy.');
    return;
  }
  if (store.reload()) { closeEditor(); render(); tell(store.warning || 'Decks updated from another tab'); }
});

function startStudy(deck = activeDeck(), questions = filterQuestions(deck?.questions ?? [],activeFilter), filter = activeFilter) {
  if (!deck || !questions.length) return;
  if (store.state.activeDeckId !== deck.id) save({...store.state,activeDeckId:deck.id},'',{undo:false});
  session = createSession(deck,questions,filter);
  updateHeaderActions();
  closeEditor();
  $('deckView').hidden = true;
  $('studyView').hidden = false;
  $('pageTitle').textContent = deck.name;
  $('studyView').scrollIntoView({block:'start',behavior:'auto'});
  renderStudy();
}
$('studyButton').addEventListener('click',() => startStudy());
$('leaveStudyButton').addEventListener('click',leaveStudy);
$('previousButton').addEventListener('click',() => { previous(session); renderStudy(); });
window.addEventListener('keydown',event => { if (event.key === 'Escape' && session && !$('deckDialog').open) leaveStudy(); });
function reveal() {
  if (!session) return;
  const entry = currentEntry(session);
  if (entry.revealed) return;
  const question = session.questions[session.index];
  const adapter = typeFor(session.deck);
  entry.result = adapter.evaluate?.(session.deck,question,entry) ?? null;
  entry.revealed = true;
  // A completed question is persisted once. Revisiting it only changes its difficulty.
  save(updateQuestion(store.state,session.deck.id,question.id,item => ({...item,progress:{attempts:item.progress.attempts+1,correct:item.progress.correct+Number(entry.result?.correct ?? false)}})));
  renderStudy();
}
function rateAndAdvance(rating) {
  if (!session || session.summary) return;
  const entry = currentEntry(session);
  if (!entry?.revealed) return;
  const question = session.questions[session.index];
  if (!rateQuestion(session.deck.id,question.id,rating)) return;
  entry.rating = rating;
  advance(session);
  renderStudy();
}
function renderStudy() {
  if (!session) return;
  const {deck,questions,index} = session;
  const totals = sessionTotals(session);
  $('studyCounter').textContent = session.summary ? (index === questions.length ? 'Session complete' : 'Round complete') : `${index+1} of ${questions.length}`;
  $('studyContext').textContent = session.summary ? '' : `Round ${Math.floor(index/SET_SIZE)+1} of ${Math.ceil(questions.length/SET_SIZE)}`;
  const progress = Math.round(totals.completed/questions.length*100);
  $('progressFill').style.width = `${progress}%`;
  $('studyProgress').setAttribute('aria-valuenow',String(progress));
  $('previousButton').disabled = index === 0;
  if (session.summary) { renderSummary(); return; }
  const question = questions[index];
  const entry = currentEntry(session);
  const panel = node('article',undefined,'panel study-panel');
  if (deck.type !== 'flashcard') panel.append(node('h2',question.prompt,'question-prompt'));
  if (deck.type === 'text' && question.hint) panel.append(node('p',question.hint,'prompt-hint'));
  panel.append(typeFor(deck).study({deck,question,entry,reveal,render:renderStudy}));
  if (entry.revealed) {
    const controls = node('section',undefined,'study-controls');
    controls.append(ratingActions(rateAndAdvance));
    panel.append(controls);
  }
  $('studyStage').replaceChildren(panel);
  if (typeFor(deck).evaluate && !entry.revealed) (panel.querySelector('input:checked') ?? panel.querySelector('input'))?.focus();
  else if (deck.type === 'flashcard' && !entry.revealed) panel.querySelector('.recall-card')?.focus();
  else panel.querySelector('.rating-button')?.focus();
}
function renderSummary() {
  const complete = session.index === session.questions.length;
  const totals = sessionTotals(session);
  const round = roundResults(session);
  const panel = node('article',undefined,'panel study-panel');
  const hero = node('div',undefined,'session-summary');
  hero.append(node('h2',complete ? 'Study session complete' : 'Round complete'),
    node('p',`${totals.completed} / ${session.questions.length}`,'summary-number'),node('p','questions reviewed','helper'));
  if (totals.checked) hero.append(node('p',`${totals.correct} / ${totals.checked} correct · ${Math.round(totals.correct/totals.checked*100)}% accuracy`));
  hero.append(node('p',`Hard ${totals.ratings.hard} · Medium ${totals.ratings.medium} · Easy ${totals.ratings.easy} · Unrated ${totals.ratings.unrated}`,'helper'));
  const actions = node('div',undefined,'actions centered');
  if (!complete) actions.append(button('Continue to next round',() => { session.summary = false; renderStudy(); },'button primary'));
  else actions.append(button('Study this set again',() => {
    const deck = store.state.decks.find(deck => deck.id === session.deck.id);
    const ids = new Set(session.questions.map(question => question.id));
    startStudy(deck,deck.questions.filter(question => ids.has(question.id)),session.filter);
  },'button primary'));
  actions.append(button('Back to questions',leaveStudy));
  hero.append(actions);
  panel.append(hero,reviewList(round,session.deck));
  $('studyStage').replaceChildren(panel);
  focusHeading(panel);
}

render();
if (store.warning) tell(store.warning);
