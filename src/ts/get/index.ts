type Path<T> = T extends object
  ? {
      [K in keyof T & (string | number)]: T[K] extends object
        ? T[K] extends Array<infer U>
          ? `${K}` | `${K}[${number}]` | `${K}[${number}].${Path<U>}`
          : `${K}` | `${K}.${Path<T[K]>}`
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

/**
 * Gets the value at the specified path of an object.
 * @param object The object to query.
 * @param path The path of the property to get.
 * @param defaultValue The value returned if the resolved value is undefined.
 * @returns Returns the resolved value.
 */
export function get<T, P extends Path<T>>(
  object: T,
  path: P,
  defaultValue?: any
): PathValue<T, P> | any {
  if (object == null) return defaultValue;
  if (!path) return defaultValue;

  const pathArray = path
    // it will convert a[0] to a.0
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean);

  let result: any = object;

  for (const key of pathArray) {
    if (result == null) return defaultValue;
    result = result[key];
  }

  return result === undefined ? defaultValue : result;
}
