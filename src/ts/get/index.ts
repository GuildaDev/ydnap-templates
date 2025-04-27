type Path<T> = T extends object
  ? {
      [K in keyof T & (string | number)]: T[K] extends object
        ?
            | `${K}`
            | `${K}.${Path<T[K]>}`
            | (T[K] extends Array<infer U>
                ? `${K}[${number}]` | `${K}[${number}].${Path<U>}`
                : never)
        : `${K}`;
    }[keyof T & (string | number)]
  : never;

type PathValue<T, P> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : unknown
  : P extends `${infer K}[${number}]`
    ? K extends keyof T
      ? T[K] extends Array<infer U>
        ? U
        : unknown
      : unknown
    : P extends keyof T
      ? T[P]
      : unknown;

function isObject(value: any): value is object {
  return typeof value === 'object' && value !== null;
}
/**
 * Gets the value at the specified path of an object.
 * @param object The object to query.
 * @param path The path of the property to get.
 * @param defaultValue The value returned if the resolved value is undefined.
 * @returns Returns the resolved value.
 */
export function get<T, P extends string>(
  object: T,
  path: P,
  defaultValue?: any
): any {
  if (object == null) return defaultValue;
  if (!path) return defaultValue;

  const pathArray = Array.isArray(path)
    ? path.map(String)
    : path
        .replace(/\[(\d+)\]/g, '.$1')
        .split('.')
        .filter(Boolean);

  let result: any = object;

  for (const key of pathArray) {
    if (result == null || !isObject(result)) {
      return defaultValue;
    }
    result = result[key];
  }

  return result === undefined ? defaultValue : result;
}
