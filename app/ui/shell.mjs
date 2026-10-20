import {node, link} from './dom.mjs';
import './viewport.mjs';

export const ROUTES = [
  {path:'/',label:'Dashboard',type:null,title:'Choose a focus.'},
  {path:'/flashcards/',label:'Flashcards',type:'flashcard',title:'Flashcards'},
  {path:'/text-inputs/',label:'Text Inputs',type:'text',title:'Text Inputs'}
];
export function currentRoute() {
  let path = location.pathname.replace(/\/?$/, '/');
  if (['/nederlands/','/text-tests/'].includes(path)) path = '/text-inputs/';
  return ROUTES.find(route => route.path === path) ?? ROUTES[0];
}
function bindNavigation(container, navigate) {
  container.addEventListener('click',event => {
    const anchor = event.target.closest('a');
    if (!anchor || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const route = ROUTES.find(route => route.path === anchor.getAttribute('href'));
    if (route) { event.preventDefault(); navigate(route); }
  });
}
export function mountNavigation(container, navigate) {
  const header = node('header',undefined,'site-nav');
  const home = link('', '/');
  home.className = 'site-home';
  home.setAttribute('aria-label','Study Room dashboard');
  home.append(node('span','S/','site-mark'),node('span','Study Room'));
  const nav = node('nav');
  nav.setAttribute('aria-label','Study Room');
  for (const route of ROUTES.filter(route => route.type)) nav.append(link(route.label,route.path));
  header.append(home,nav);
  container.replaceChildren(header);
  if (navigate) bindNavigation(header,navigate);
  return () => {
    header.querySelectorAll('a').forEach(anchor => {
      if (anchor.getAttribute('href') === location.pathname) anchor.setAttribute('aria-current','page');
      else anchor.removeAttribute('aria-current');
    });
  };
}

export function mountApp(root, navigate) {
  // Static application chrome is authored once, regardless of entry URL or study type.
  root.innerHTML = `
    <div id="navigation"></div>
    <header class="page-header">
      <h1 id="pageTitle"></h1>
      <div class="actions" id="deckActions"><button class="button" id="undoButton" type="button" hidden>Undo last change</button><button class="button" id="importButton" type="button">Import</button><button class="button" id="exportButton" type="button">Export backup</button><input id="importFile" type="file" accept="application/json,.json" hidden></div>
    </header>
    <p class="message" id="message" role="status"></p>
    <section class="dashboard" id="dashboardView" aria-label="Choose a study type"></section>
    <section id="deckView" aria-label="Study decks" hidden>
      <div class="deck-bar panel">
        <div class="deck-picker"><label for="deckSelect">Current deck</label><select id="deckSelect"></select></div>
        <div class="actions"><button class="button primary" id="newDeckButton" type="button">New deck</button><button class="button" id="renameDeckButton" type="button">Rename</button><button class="button danger" id="deleteDeckButton" type="button">Delete</button></div>
      </div>
      <div class="deck-heading"><h2 id="deckTitle">Your questions</h2><div class="actions"><button class="button" id="addQuestionButton" type="button">Add question</button><button class="button primary" id="studyButton" type="button">Study</button></div></div>
      <div class="filter-bar"><span class="eyebrow">Practice set</span><div class="filter-options" id="filters" role="group" aria-label="Filter questions by difficulty"></div></div>
      <div class="workspace" id="workspace"><form class="panel question-editor" id="questionForm" hidden></form><div><div class="question-list" id="questionList"></div><div class="panel empty" id="emptyState"></div></div></div>
    </section>
    <section class="study-view" id="studyView" aria-label="Study session" hidden>
      <div class="study-header"><button class="link-button" id="leaveStudyButton" type="button">← Back to questions</button><span id="studyCounter"></span></div>
      <div class="progress" id="studyProgress" role="progressbar" aria-label="Session progress" aria-valuemin="0" aria-valuemax="100"><div id="progressFill"></div></div>
      <div class="study-navigation"><button class="button" id="previousButton" type="button">← Previous question</button><span class="helper" id="studyContext"></span></div>
      <div id="studyStage"></div>
    </section>
    <dialog id="deckDialog" aria-labelledby="dialogTitle"></dialog>`;
  const dashboard = root.querySelector('#dashboardView');
  ROUTES.filter(route => route.type).forEach(route => {
    const tile = link('',route.path);
    tile.className = 'panel dashboard-card';
    tile.append(node('h2',route.label));
    const arrow = node('span','↗','dashboard-arrow');
    arrow.setAttribute('aria-hidden','true');
    tile.append(arrow);
    dashboard.append(tile);
  });
  bindNavigation(dashboard,navigate);
  return mountNavigation(root.querySelector('#navigation'),navigate);
}
