/**
 * Retrieves the value at a given path of an object. If the resolved value is
 * `undefined` or the object is `null`/`undefined`, the `defaultValue` is returned.
 *
 * @param {Object} object - The object to query.
 * @param {string|string[]} path - The path of the property to get. Can be a string
 *                                 with dot/bracket notation or an array of keys.
 * @param {*} [defaultValue] - The value returned if the resolved value is `undefined`.
 * @returns {*} - The resolved value or the `defaultValue` if the path does not exist.
 *
 * @example
 * const obj = { a: { b: { c: 42 } } };
 * get(obj, 'a.b.c'); // 42
 * get(obj, ['a', 'b', 'c']); // 42
 * get(obj, 'a.b.d', 'default'); // 'default'
 * get(null, 'a.b.c', 'default'); // 'default'
 */
export function get(object, path, defaultValue) {
  if (object == null) return defaultValue;

  const pathArray = Array.isArray(path)
    ? path.map(String)
    : path
        .replace(/\[(\d+)\]/g, '.$1')
        .split('.')
        .filter(Boolean);

  let result = object;

  for (const key of pathArray) {
    if (result == null) return defaultValue;
    result = result[key];
  }

  return result === undefined ? defaultValue : result;
}
