/**
 * Safely gets the value at a given path of an object.
 * Supports dot and bracket notation (e.g., "a.b[0].c").
 */
export default function get<T = any>(
  object: any,
  path: string,
  defaultValue?: any
): T {
  if (object == null || typeof path !== 'string' || !path.trim()) {
    return defaultValue;
  }

  const pathArray = path
    .replace(/\[(\d+)\]/g, '.$1') // Convert a[0] to a.0
    .split('.')
    .filter(Boolean);

  let result = object;

  for (const key of pathArray) {
    if (result == null || typeof result !== 'object') return defaultValue;
    result = result[key];
  }

  return result === undefined ? defaultValue : result;
}
