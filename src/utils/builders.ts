import { isArray, isRecord } from './predicates';
import { toDataString } from './toDataString';

/**
 * Iterate an object as entities, and if the top-level value is an array, iterate it again as a matrix.
 * For example, { a: [ 1, 2 ], b: 3 } will iterate with ('a', 1), ('a', 2), and ('b', 3).
 * This design is useful for building a parameters of a HTTP request.
 * Many Web frameworks use such parameter style to receive array, such as Java Spring Framework and PHP, and so on.
 * NOTE: Undefined value will be ignored.
 */
const matrixForEach = (data: unknown, callback: (key: string, value: unknown) => void) => {
  if (!isRecord(data)) return;
  const keys = Object.keys(data);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const maybeArray = data[key];
    if (isArray(maybeArray)) {
      for (let j = 0; j < maybeArray.length; j++) {
        if (maybeArray[j] !== undefined) callback(key, maybeArray[j]);
      }
    } else {
      if (maybeArray !== undefined) callback(key, maybeArray);
    }
  }
};

/**
 * Build a FormData from a data with below rules:
 * 1. For an array value, separate it as a form of multiple value in single key.
 * 2. Undefined values will be ignored instead of being converted to "undefined" strings.
 * 3. Support specially for `BigInt` type, which cannot be serialized to a JSON by default.
 * 4. Support specially for `Date` type, which may be serialized to a string wrapped by a quote by default.
 */
export const buildFormData = (data?: unknown | FormData): FormData => {
  if (data instanceof FormData) return data;
  const fd = new FormData();
  matrixForEach(data, (key, value) => fd.append(key, value instanceof Blob ? value : toDataString(value)));
  return fd;
};

/**
 * Build a query string from a data with below rules:
 * 1. For an array value, separate it as a form of multiple value in single key.
 * 2. Undefined values will be ignored instead of being converted to "undefined" strings.
 * 3. Support specially for `BigInt` type, which cannot be serialized to a JSON by default.
 * 4. Support specially for `Date` type, which may be serialized to a string wrapped by a quote by default.
 * NOTE: The returned string never starts with a "?", and can be sent directly as payload for x-www-form-urlencoded.
 */
export const buildQs = (data: unknown | URLSearchParams) => {
  // The URLSearchParams may not be defined on some platforms.
  if (typeof URLSearchParams === 'function' && data instanceof URLSearchParams) {
    return data.toString();
  }
  const items: string[] = [];
  matrixForEach(data, (key, value) =>
    items.push(encodeURIComponent(key) + '=' + encodeURIComponent(toDataString(value))),
  );
  return items.join('&');
};
