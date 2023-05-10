import { InvokeResult } from './types/InvokeResult';
import { parseRawHeaderAsMap } from './utils/parseRawHeaderAsMap';

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

    const { status, responseType } = xhr;
    this.statusCode = status;

    // The Content-Type of the response will be ignored.
    // Although it is not a recommended practice, some MiniProgram platforms do it,
    // so this library is designed to be compatible with them.

    // If the responseType is not "json", it could be "arraybuffer", "blob", "document", and "text",
    // so use directlly the xhr.response as the data.
    if (responseType && responseType !== 'json') {
      // The `response` property of the xhr object may be a getter, get it only when needed, not too early.
      this.data = xhr.response;
    } else {
      // The `responseText` property of the xhr object may be a getter, get it only when needed, not too early.
      const { responseText } = xhr;

      // Attempt to parse the responseText as JSON.
      // If the parsing fails, fall back to using the original bad JSON string as the data instead of throwing error.
      // NOTE: This is designed to be compatible with WeChat MiniProgram.
      try {
        this.data = JSON.parse(responseText);
      } catch (error) {
        this.data = responseText as T;
      }
    }
  }
}
