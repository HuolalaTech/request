import { InvokeResult } from './types/InvokeResult';
import { parseRawHeaderAsMap } from './utils/parseRawHeaderAsMap';
import { isApplicationJson } from './utils/isApplicationJson';

export class XhrInvokeResult<T> implements InvokeResult<T> {
  public statusCode: number;
  public data: T;
  public declare headers: Record<string, string>;
  private declare xhr;
  constructor(xhr: XMLHttpRequest) {
    Object.defineProperties(this, {
      xhr: { value: xhr, configurable: true },
      // The 'headers' field is computed lazily and will not be computed unless it is accessed.
      // QUESTION: Why not define it as a standard getter properties of class?
      // ANSWER: It must be retrievable by Object.keys, while the startnd getter properties are not.
      headers: {
        configurable: true,
        enumerable: true,
        get: () => {
          const value = parseRawHeaderAsMap(xhr.getAllResponseHeaders());
          // This getter will be called only once, and the result will be cached in the property value.
          Object.defineProperty(this, 'headers', {
            configurable: true,
            enumerable: true,
            writable: true,
            value,
          });
          return value;
        },
        // This field is also writable, so the setter must be provided.
        // QUESTION: Why is it writable?
        // ANSWER: The InvokeResult<T> may be used in an interceptor, so users may need to modify certain properties.
        set: (value) => {
          Object.defineProperty(this, 'headers', {
            configurable: true,
            enumerable: true,
            writable: true,
            value,
          });
        },
      },
    });
    const { status, responseText } = xhr;
    this.statusCode = status;
    let res: unknown = responseText;
    const ct = xhr.getResponseHeader('Content-Type');
    // NOTE: A void method of Spring Framework responds with an emtpy content in application/json.
    // Do not parse it as a JSON if the responseText is emtpy.
    if ((!ct || isApplicationJson(ct)) && responseText) {
      res = JSON.parse(responseText);
    }
    this.data = res as T;
  }
}
