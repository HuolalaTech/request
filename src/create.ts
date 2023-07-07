import { internalRequest } from './internalRequest';
import { InvokeContext } from './types/InvokeContext';
import { Interceptor } from './Interceptor';

import type { InvokeParams } from './types/InvokeParams';
import type { InvokeResult } from './types/InvokeResult';

/**
 * Create a standalone pairs `request` and `interceptors` and set common request parameters.
 *
 * By default, this library already provides a pairs of `request` and `interceptors`,
 * if you just want to send a request, you can call `request` function directly, rather than use this.
 *
 * In typicle, you have two scenarios where you might use this function:
 * 1. You want to set a common request parameters for all requests.
 * 2. You want have an isolate intercepters environment.
 *
 * @param defaultParams The default parameters.
 */
export const create = (defaultParams: Partial<InvokeParams> = {}) => {
  // The interceptore pairs definitions.
  const interceptors = {
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
  function request<T>(args: InvokeParams & { responseType?: 'json' | '' }): Promise<InvokeResult<T>>;

  /**
   * Send an HTTP request and receive the result in an arraybuffer.
   *
   * NOTE:
   * 1. Even if the response status is not 2xx, the response body will also be stored in an arraybuffer.
   * 2. The Content-Type of the response will be ignored.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function request<T extends ArrayBuffer = ArrayBuffer>(
    args: InvokeParams & { responseType: 'arraybuffer' },
  ): Promise<InvokeResult<ArrayBuffer>>;

  /**
   * Send an HTTP request and receive the result as a string.
   *
   * NOTE:
   * 1. Even if the response status is not 2xx, the response body will also be stored in a string.
   * 2. The Content-Type of the response will be ignored.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function request<T extends string = string>(
    args: InvokeParams & { responseType: 'text' },
  ): Promise<InvokeResult<string>>;

  /**
   * Send an HTTP request and receive the result as a Blob object.
   *
   * NOTE:
   * 1. This "blob" type can only be used in browser environment, and MiniProgram platforms do not support it.
   * 2. Even if the response status is not 2xx, the response body will also be stored in a Blob object.
   * 3. The Content-Type of the response will be ignored.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function request<T extends Blob = Blob>(args: InvokeParams & { responseType: 'blob' }): Promise<InvokeResult<Blob>>;

  /**
   * Send an HTTP request.
   *
   * NOTE:
   * 1. The generic parameter T will not be validated.
   * 2. The Content-Type of the response will be ignored.
   *    Although it is not a recommended practice, some MiniProgram platforms do it,
   *    so this library is designed to be compatible with them.
   */
  function request<T>(args: InvokeParams): Promise<InvokeResult<T>>;

  function request(args: InvokeParams) {
    const { request, response } = interceptors;
    const context: InvokeContext = {};
    // Execute request handlers as a pipeline.
    const task = Interceptor.pipeline(request, Promise.resolve({ ...defaultParams, ...args })).then((params) => {
      // Update the context that may be used by response handlers.
      context.request = params;
      // Call the internal request method.
      return internalRequest(params);
    });
    // Execute response handlers as a pipeline.
    return Interceptor.pipeline(response, task, context);
  }

  return { request, interceptors };
};
