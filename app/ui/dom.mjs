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
export function link(text, href) {
  const element = node('a', text);
  element.href = href;
  return element;
}
export function field(labelText, id, {value = '', multiline = false, required = false} = {}) {
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
  return {group, input};
}
export function focusHeading(container) {
  const heading = container.querySelector('h1, h2');
  if (heading) { heading.tabIndex = -1; heading.focus(); }
}
