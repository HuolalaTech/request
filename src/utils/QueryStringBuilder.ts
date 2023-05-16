import { toDataString } from './toDataString';

const isRecord = (u: unknown): u is Record<PropertyKey, unknown> => typeof u === 'object' && u !== null;

export class QueryStringBuilder {
  private items: string[];

  constructor(data?: unknown) {
    this.items = [];
    if (isRecord(data)) {
      const keys = Object.keys(data);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = data[key];
        // If a top-level value is an array, append multiple times to the same key.
        // For example, { a: [ 1, 2 ] } will be converted to a=1&a=2.
        // NOTE: this rule is only applied to top-level arrays, nested arrays are converted to JSON.
        //       For example, { a: [ 1, 2, [ 3, 4 ] ] } will be converted to a=1&a=2&a=[3,4].
        if (value instanceof Array) {
          for (let j = 0; j < value.length; j++) {
            this.append(key, value[j]);
          }
        } else {
          this.append(key, value);
        }
      }
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
