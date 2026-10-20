// Use the visible viewport so editors and dialogs also fit above a mobile keyboard.
let frame = null;
function updateViewport() {
  frame = null;
  const viewport = window.visualViewport;
  // Pinch zoom should magnify the interface rather than trigger a new layout.
  if (viewport && Math.abs(viewport.scale - 1) > 0.01) return;
  const height = viewport?.height ?? window.innerHeight;
  const offset = viewport?.offsetTop ?? 0;
  document.documentElement.style.setProperty('--viewport-height', `${height}px`);
  document.documentElement.style.setProperty('--viewport-offset-top', `${offset}px`);
}
function scheduleUpdate() {
  if (frame === null) frame = requestAnimationFrame(updateViewport);
}
window.addEventListener('resize', scheduleUpdate);
window.visualViewport?.addEventListener('resize', scheduleUpdate);
window.visualViewport?.addEventListener('scroll', scheduleUpdate);
updateViewport();
