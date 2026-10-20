export function fail(path, message) { throw new Error(`${path}: ${message}`); }
export function object(value, path) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(path, 'expected an object');
  return value;
}
export function text(value, path, optional = false) {
  if (optional && (value === undefined || value === '')) return '';
  if (typeof value !== 'string' || !value.trim() || value.length > 8000) fail(path, 'expected text (1–8000 characters)');
  return value.trim();
}
export function list(value, path) {
  if (!Array.isArray(value)) fail(path, 'expected an array');
  return value;
}
export function unique(items, path) {
  if (new Set(items.map(item => item.id)).size !== items.length) fail(path, 'duplicate IDs');
  return items;
}
export function count(value, path) {
  if (value === undefined) return 0;
  if (!Number.isSafeInteger(value) || value < 0) fail(path, 'expected a non-negative integer');
  return value;
}
export const makeId = () => globalThis.crypto?.randomUUID?.() ?? `item-${Date.now()}-${Math.random().toString(16).slice(2)}`;
