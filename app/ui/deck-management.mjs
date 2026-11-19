export function bindDeckManagement(management) {
  const close = (restoreFocus = false) => {
    management.open = false;
    if (restoreFocus) management.querySelector('summary').focus();
  };
  // Let the action run before hiding its button or moving focus. In particular,
  // Import must open the file chooser directly within the user's click.
  management.addEventListener('click',event => {
    if (event.target.closest('button,a')) close();
  });
  management.addEventListener('keydown',event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close(true);
    }
  });
  management.addEventListener('focusout',event => {
    // Touch browsers can blur the current control without focusing the tapped
    // button. Keep the menu available until its click or an outside tap.
    if (event.relatedTarget && !management.contains(event.relatedTarget)) close();
  });
  management.ownerDocument.addEventListener('pointerdown',event => {
    if (!management.contains(event.target)) close();
  });
}
