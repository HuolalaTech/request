import { internalRequest } from './internalRequest';
import { InvokeContext } from './types/InvokeContext';
import { Interceptor } from './Interceptor';
import type { InvokeParams } from './types/InvokeParams';
import type { InvokeResult } from './types/InvokeResult';

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
 * Send a http request.
 * NOTE: The generic parameter T is not validated.
 * @returns {Promise<T>}
 */
export const request = <T = unknown>(args: InvokeParams) => {
  const { request, response } = interceptors;
  const context: InvokeContext = {};
  // Execute request handlers as a pipeline.
  const pReq = Interceptor.pipeline(request, Promise.resolve(args)).then((params) => {
    // Update the context that may be used by response handlers.
    context.request = params;
    // Call the internal request method.
    return internalRequest(params);
  });
  // Execute response handlers as a pipeline.
  return Interceptor.pipeline(response, pReq, context) as Promise<InvokeResult<T>>;
};
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
