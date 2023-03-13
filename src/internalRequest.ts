import { PlatformError } from "./errors";
import { requestWithMy } from "./requestWithMy";
import { requestWithSwan } from "./requestWithSwan";
import { requestWithWx } from "./requestWithWx";
import { requestWithXhr } from "./requestWithXhr";
import { InvokeParams } from "./types/InvokeParams";
import { Wx, My, Swan } from "./types/libs";

declare const wx: Wx;
declare const my: My;
declare const swan: Swan;

export const internalRequest = <T>(args: InvokeParams) => {
  // Detect the current platform and call the corresponding method.
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
      throw new PlatformError();
    }
  }
};
