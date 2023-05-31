import { isArray, isRecord } from './predicates';
import { toDataString } from './toDataString';

interface Appendable {
  append(name: string, value: string): void;
}

class QueryStringBuilder implements Appendable {
  private items: string[];
  constructor() {
    this.items = [];
  }
  public append(key: string, value: string) {
    this.items.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
  }
  public toString() {
    return this.items.join('&');
  }
}

/**
 * Convert T | T[] to T[]
 */
const makeArray = <T>(maybeArray: T | T[]) => {
  const result: T[] = [];
  if (isArray(maybeArray)) {
    for (let i = 0; i < maybeArray.length; i++) {
      result.push(maybeArray[i]);
    }
  } else {
    result.push(maybeArray);
  }
  return result;
};

const copyDataToAppendable = (data: unknown, target: Appendable) => {
  if (!isRecord(data)) return;
  Object.keys(data).forEach((key) => {
    // If a top-level value is an array, append multiple times to the same key.
    // For example, { a: [ 1, 2 ] } will be converted to a=1&a=2.
    // NOTE: this rule is only applied to top-level arrays, nested arrays are converted to JSON.
    //       For example, { a: [ 1, 2, [ 3, 4 ] ] } will be converted to a=1&a=2&a=[3,4].
    //
    makeArray(data[key])
      .filter((value) => value !== undefined) // Ignore undefiend values
      .forEach((value) => target.append(key, toDataString(value)));
  });
};

export const buildFormData = (data?: unknown | FormData): FormData => {
  if (data instanceof FormData) return data;
  const fd = new FormData();
  copyDataToAppendable(data, fd);
  return fd;
};

export const buildQs = (data: unknown | URLSearchParams) => {
  // The URLSearchParams may not be defined on some platforms.
  if (typeof URLSearchParams === 'function' && data instanceof URLSearchParams) {
    return data.toString();
  }
  const qsb = new QueryStringBuilder();
  copyDataToAppendable(data, qsb);
  return qsb.toString();
};
