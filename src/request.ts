import { requestWithMy } from "./requestWithMy";
import { requestWithSwan } from "./requestWithSwan";
import { requestWithWx } from "./requestWithWx";
import { requestWithXhr } from "./requestWithXhr";
import { Interceptor } from "./Interceptor";

import type { InvokeParams } from "./types/InvokeParams";
import type { InvokeResult } from "./types/InvokeResult";
import { setupInterceptorPair } from "./InterceptorPair";

declare const wx: any;
declare const my: any;
declare const swan: any;

export const interceptors = {
  request: new Interceptor<InvokeParams>(),
  response: new Interceptor<InvokeResult>(),
};

export const request = setupInterceptorPair(
  interceptors,
  <T>(args: InvokeParams) => {
    switch (true) {
      case typeof XMLHttpRequest === "function":
        return requestWithXhr<T>(args);
      case typeof wx === "object":
        return requestWithWx<T>(args);
      case typeof my === "object":
        return requestWithMy<T>(args);
      case typeof swan === "object":
        return requestWithSwan<T>(args);
      default: {
        throw new TypeError("Invalid platform");
      }
    }
  }
);
