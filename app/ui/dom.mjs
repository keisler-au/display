export function node(tag, text, className) {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = text;
  if (className) element.className = className;
  return element;
}
export function button(text, action, className = 'button') {
  const element = node('button', text, className);
  element.type = 'button';
  element.addEventListener('click', action);
  return element;
}
export function link(text, href, download = false) {
  const element = node('a', text);
  element.href = href;
  if (download) element.download = '';
  return element;
}
export function field(labelText, id, {value = '', multiline = false, required = false, help = ''} = {}) {
  const group = node('div', undefined, 'form-field');
  const label = node('label', labelText);
  label.htmlFor = id;
  const input = node(multiline ? 'textarea' : 'input');
  if (!multiline) input.type = 'text';
  input.id = id;
  input.value = value;
  input.maxLength = 8000;
  input.required = required;
  group.append(label, input);
  if (help) {
    const hint = node('p', help, 'field-help');
    hint.id = `${id}-help`;
    input.setAttribute('aria-describedby', hint.id);
    group.append(hint);
  }
  return {group, input};
}
export function focusHeading(container) {
  const heading = container.querySelector('h1, h2');
  if (heading) { heading.tabIndex = -1; heading.focus(); }
}
