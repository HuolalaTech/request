import { makeArray } from './makeArray';
import { isRecord } from './predicates';
import { toDataString } from './toDataString';

export class QueryStringBuilder {
  private items: string[];

  constructor(data?: unknown) {
    this.items = [];
    if (isRecord(data)) {
      Object.keys(data).forEach((key) => {
        // If a top-level value is an array, append multiple times to the same key.
        // For example, { a: [ 1, 2 ] } will be converted to a=1&a=2.
        // NOTE: this rule is only applied to top-level arrays, nested arrays are converted to JSON.
        //       For example, { a: [ 1, 2, [ 3, 4 ] ] } will be converted to a=1&a=2&a=[3,4].
        makeArray(data[key]).forEach((value) => this.append(key, value));
      });
    }
  }

  public append(key: string, value: unknown) {
    if (value === undefined) return;
    this.items.push(encodeURIComponent(key) + '=' + encodeURIComponent(toDataString(value)));
  }

  public toString() {
    return this.items.join('&');
  }
}

export const buildQs = (data: unknown) => new QueryStringBuilder(data).toString();
