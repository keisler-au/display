import {node} from './dom.mjs';

const STORAGE_KEY = 'study-room.editor-layout.v1';

export function createEditorLayout(workspace, form, storage) {
  let preferences = {};
  try {
    const saved = JSON.parse(storage.getItem(STORAGE_KEY));
    if (saved && typeof saved === 'object') preferences = saved;
  } catch (_) { /* Layout preferences are optional when storage is unavailable. */ }
  const validSize = value => Number.isFinite(value) && value > 0;
  const persist = () => {
    try { storage.setItem(STORAGE_KEY, JSON.stringify(preferences)); }
    catch (_) { /* Keep the current layout even if it cannot be saved. */ }
  };
  if (validSize(preferences.width)) workspace.style.setProperty('--editor-width', `${preferences.width}px`);

  const divider = node('div', undefined, 'editor-divider');
  divider.tabIndex = 0;
  divider.setAttribute('role', 'separator');
  divider.setAttribute('aria-label', 'Editor panel width');
  divider.setAttribute('aria-orientation', 'vertical');
  divider.setAttribute('aria-controls', form.id);
  divider.title = 'Drag to resize editor, or use the left and right arrow keys';
  workspace.append(divider);

  const maximum = () => Math.max(280, workspace.getBoundingClientRect().width - 302);
  function updateRange() {
    divider.setAttribute('aria-valuemin', '280');
    divider.setAttribute('aria-valuemax', String(Math.round(maximum())));
    divider.setAttribute('aria-valuenow', String(Math.round(form.getBoundingClientRect().width)));
  }
  function resize(width) {
    preferences.width = Math.min(maximum(), Math.max(280, width));
    workspace.style.setProperty('--editor-width', `${preferences.width}px`);
    updateRange();
    persist();
  }
  let drag = null;
  divider.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    event.preventDefault();
    drag = {id:event.pointerId, x:event.clientX, width:form.getBoundingClientRect().width};
    divider.setPointerCapture(event.pointerId);
    workspace.classList.add('is-resizing');
  });
  divider.addEventListener('pointermove', event => {
    if (drag?.id === event.pointerId) resize(drag.width + event.clientX - drag.x);
  });
  const stop = () => { drag = null; workspace.classList.remove('is-resizing'); };
  divider.addEventListener('pointerup', stop);
  divider.addEventListener('pointercancel', stop);
  divider.addEventListener('lostpointercapture', stop);
  divider.addEventListener('keydown', event => {
    const width = form.getBoundingClientRect().width;
    const sizes = {ArrowLeft:width - 20, ArrowRight:width + 20, Home:280, End:maximum()};
    if (!(event.key in sizes)) return;
    event.preventDefault();
    resize(sizes[event.key]);
  });

  // Native textarea resizing writes an inline height. Remember only those explicit
  // sizes, so the usual field dimensions remain the default until adjusted.
  function capture() {
    let changed = false;
    for (const input of form.querySelectorAll('textarea')) {
      const height = parseFloat(input.style.height);
      if (!validSize(height) || preferences[input.id] === height) continue;
      preferences[input.id] = height;
      changed = true;
    }
    if (changed) persist();
  }
  const fieldsObserver = new ResizeObserver(capture);
  const workspaceObserver = new ResizeObserver(updateRange);
  workspaceObserver.observe(workspace);
  window.addEventListener('pagehide', capture);
  return {
    capture,
    restore() {
      fieldsObserver.disconnect();
      for (const input of form.querySelectorAll('textarea')) {
        if (validSize(preferences[input.id])) input.style.height = `${preferences[input.id]}px`;
        fieldsObserver.observe(input);
      }
      updateRange();
    }
  };
}
