import { internalRequest } from './internalRequest';
import { InvokeContext } from './types/InvokeContext';
import { Interceptor } from './Interceptor';
import type { InvokeParams } from './types/InvokeParams';
import type { InvokeResult } from './types/InvokeResult';
import { AbortablePromise, RequestController, injectAbortable } from './RequestController';

export * from './errors';
export * from './constants';

export { isApplicationJson, isMultipartFormData, isWwwFormUrlEncoded } from './utils/predicates';

export { InvokeContext, InvokeParams, InvokeResult };

// Export the interceptore pairs definitions.
export const interceptors = {
  request: new Interceptor<InvokeParams>(),
  response: new Interceptor<InvokeResult, InvokeContext>(),
};

/**
 * Send an HTTP request and parse the result into JSON.
 *
 * NOTE:
 * 1. The generic parameter T will not be validated.
 * 2. The Content-Type of the response will be ignored.
 *    Although it is not a recommended practice, some MiniProgram platforms do it,
 *    so this library is designed to be compatible with them.
 * 3. If JSON parsing fails, an error will not be thrown.
 *    Instead, the original bad JSON will be provided as a string.
 */
export function request<T>(args: InvokeParams & { responseType?: 'json' }): AbortablePromise<InvokeResult<T>>;

/**
 * Send an HTTP request and receive the result in an arraybuffer.
 *
 * NOTE:
 * 1. Even if the response status is not 2xx, the response body will also be stored in an arraybuffer.
 * 2. The Content-Type of the response will be ignored.
 */
export function request(
  args: InvokeParams & { responseType: 'arraybuffer' },
): AbortablePromise<InvokeResult<ArrayBuffer>>;

/**
 * Send an HTTP request and receive the result as a string.
 *
 * NOTE:
 * 1. Even if the response status is not 2xx, the response body will also be stored in a string.
 * 2. The Content-Type of the response will be ignored.
 */
export function request(args: InvokeParams & { responseType: 'text' }): AbortablePromise<InvokeResult<string>>;

/**
 * Send an HTTP request and receive the result as a Blob object.
 *
 * NOTE:
 * 1. This "blob" type can only be used in browser environment, and MiniProgram platforms do not support it.
 * 2. Even if the response status is not 2xx, the response body will also be stored in a Blob object.
 * 3. The Content-Type of the response will be ignored.
 */
export function request(args: InvokeParams & { responseType: 'blob' }): AbortablePromise<InvokeResult<Blob>>;

export function request(args: InvokeParams) {
  const { request, response } = interceptors;
  const context: InvokeContext = {};
  // Execute request handlers as a pipeline.
  const controller = new RequestController();
  let task = Interceptor.pipeline(request, Promise.resolve(args)).then((params) => {
    // Update the context that may be used by response handlers.
    context.request = params;
    // Call the internal request method.
    return internalRequest(params, controller);
  });
  // Execute response handlers as a pipeline.
  task = Interceptor.pipeline(response, task, context);

  injectAbortable(task, controller);

  return task;
}

// Find the globalThis object across browsers and miniprogram platforms.
const globalThis =
  typeof window === 'object' ? window : typeof global === 'object' ? global : /* istanbul ignore next */ null;
if (globalThis) {
  // This key is the MD5 hash of the package name.
  const key = '54f09acea52941258aca926266ecf866';
  if (key in globalThis) {
    // Throw an error if this key was set in the global object.
    console.error(new Error(`The "request" lib was installed duplicately with different versions.`));
  } else {
    // Set the key to the global object.
    Object.defineProperty(globalThis, key, {
      configurable: true,
      value: request,
    });
  }
}
