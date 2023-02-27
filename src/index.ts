import { Interceptor } from "./Interceptor";

import type { InvokeParams } from "./types/InvokeParams";
import type { InvokeResult } from "./types/InvokeResult";
import { internalRequest as rawRequest } from "./internalRequest";

export type InvokeContext = { request: InvokeParams };

export const interceptors = {
  request: new Interceptor<InvokeParams>(),
  response: new Interceptor<InvokeResult, InvokeContext>(),
};

export const request = (args: InvokeParams) => {
  const { request, response } = interceptors;
  return Interceptor.wrap(request, Promise.resolve(args)).then((params) => {
    const context: InvokeContext = { request: params };
    const resTask = Promise.resolve(params).then(rawRequest);
    return Interceptor.wrap(response, resTask, context);
  });
};

const globalThis =
  typeof window === "object"
    ? window
    : typeof global === "object"
    ? global
    : null;
if (globalThis) {
  const key = "@huolala-tech/request";
  if (key in globalThis) {
    console.error(`${key} was installed duplicately with different versions.`);
  } else {
    Object.defineProperty(globalThis, key, {
      configurable: true,
      value: request,
    });
  }
}
