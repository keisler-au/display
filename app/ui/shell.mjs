import {node, link} from './dom.mjs';
import './viewport.mjs';
import {mountGuide} from './guide.mjs';

export const ROUTES = [
  {path:'/',label:'Dashboard',type:null,title:'Choose a focus.'},
  {path:'/flashcards/',label:'Flashcards',type:'flashcard',title:'Flashcards'},
  {path:'/text-inputs/',label:'Text Inputs',type:'text',title:'Text Inputs'},
  {path:'/multiple-choice/',label:'Multiple Choice',type:'multiple-choice',title:'Multiple Choice'},
  {path:'/guide/',label:'Guide',type:null,title:'Guide'}
];
export function currentRoute() {
  const path = location.pathname.replace(/\/?$/, '/');
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
function mountNavigation(container, navigate) {
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
  bindNavigation(header,navigate);
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
    <header class="page-header" id="pageHeader">
      <h1 id="pageTitle"></h1>
      <div id="headerDeckActions"></div>
    </header>
    <p class="message" id="message" role="status"></p>
    <section class="dashboard" id="dashboardView" aria-label="Choose a study type"></section>
    <section class="guide-view" id="guideView" aria-label="Import guide" hidden></section>
    <section id="deckView" aria-label="Study decks" hidden>
      <div class="deck-bar">
        <div class="deck-controls">
          <div class="deck-picker">
            <span class="eyebrow" id="deckSelectLabel">Current deck</span>
            <div class="deck-selection">
              <div class="deck-select-container"><button class="deck-select" id="deckSelect" type="button" aria-haspopup="listbox" aria-expanded="false" aria-controls="deckOptions" aria-labelledby="deckSelectLabel deckSelectValue"><span id="deckSelectValue"></span><span class="select-chevron" aria-hidden="true"></span></button><div class="deck-options" id="deckOptions" role="listbox" tabindex="-1" aria-labelledby="deckSelectLabel" hidden></div></div>
              <div id="deckManagementSlot"><details class="deck-management" id="deckManagement">
                <summary class="button">Manage decks</summary>
                <div class="deck-management-options" id="deckActions">
                  <div id="deckManagementEditing">
                  <button class="deck-menu-action" id="newDeckButton" type="button">New deck</button>
                  <button class="deck-menu-action" id="renameDeckButton" type="button">Rename deck</button>
                  <button class="deck-menu-action danger" id="deleteDeckButton" type="button">Delete deck</button>
                  </div>
                  <div class="deck-menu-utilities">
                    <a class="deck-menu-action" id="guideLink" href="/guide/">Guide</a>
                    <button class="deck-menu-action" id="importButton" type="button">Import</button>
                    <button class="deck-menu-action" id="exportButton" type="button">Export</button>
                    <button class="deck-menu-action" id="undoButton" type="button" hidden>Undo Last Change</button>
                  </div>
                </div>
              </details></div>
            </div>
          </div>
        </div>
        <div class="filter-bar">
          <div class="difficulty-picker"><div class="filter-options" id="filters" role="group" aria-label="Filter questions by difficulty"></div></div>
          <div class="actions"><button class="button primary" id="studyButton" type="button">Study</button></div>
        </div>
      </div>
      <div class="question-search form-field">
        <div class="question-toolbar">
          <div class="actions"><input id="questionSearch" type="search" aria-label="Search questions" placeholder="Search cards and answers…" aria-controls="questionList" autocomplete="off"></div>
          <button class="button" id="addQuestionButton" type="button">Add question</button>
        </div>
        <p class="helper" id="questionSearchStatus" role="status"></p>
      </div>
      <div class="workspace" id="workspace"><form class="panel question-editor" id="questionForm" hidden></form><div>
        <div class="question-list" id="questionList"></div><div class="panel empty" id="emptyState"></div>
        <nav class="question-pagination" id="questionPagination" aria-label="Question pages" hidden><button class="pagination-button" id="previousPageButton" type="button" aria-controls="questionList">← Previous</button><span class="helper" id="questionPageStatus" role="status"></span><button class="pagination-button" id="nextPageButton" type="button" aria-controls="questionList">Next →</button></nav>
      </div></div>
    </section>
    <section class="study-view" id="studyView" aria-label="Study session" hidden>
      <div class="study-header"><button class="link-button" id="leaveStudyButton" type="button">← Back to questions</button><span id="studyCounter"></span></div>
      <div class="progress" id="studyProgress" role="progressbar" aria-label="Session progress" aria-valuemin="0" aria-valuemax="100"><div id="progressFill"></div></div>
      <div class="study-navigation"><button class="button" id="previousButton" type="button">← Previous question</button><span class="helper" id="studyContext"></span></div>
      <div id="studyStage"></div>
    </section>
    <input id="importFile" type="file" accept="application/json,.json" hidden>
    <dialog id="deckDialog" aria-labelledby="dialogTitle"></dialog>`;
  const management = root.querySelector('#deckManagement');
  const closeManagement = (restoreFocus = false) => {
    management.open = false;
    if (restoreFocus) management.querySelector('summary').focus();
  };
  management.addEventListener('click',event => {
    if (event.target.closest('button,a')) closeManagement(true);
  },true);
  management.addEventListener('keydown',event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeManagement(true);
    }
  });
  management.addEventListener('focusout',event => {
    if (!management.contains(event.relatedTarget)) closeManagement();
  });
  root.ownerDocument.addEventListener('pointerdown',event => {
    if (!management.contains(event.target)) closeManagement();
  });
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
  bindNavigation(root.querySelector('#deckActions'),navigate);
  mountGuide(root.querySelector('#guideView'));
  return mountNavigation(root.querySelector('#navigation'),navigate);
}
