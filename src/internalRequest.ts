import { RequestController } from './RequestController';
import { PlatformError } from './errors';
import { requestWithMy } from './requestWithMy';
import { requestWithSwan } from './requestWithSwan';
import { requestWithWx } from './requestWithWx';
import { requestWithXhr } from './requestWithXhr';
import { InvokeParams } from './types/InvokeParams';
import { Wx, My, Swan } from './types/libs';
import { isValidMPO } from './utils/predicates';

declare const wx: Wx;
declare const my: My;
declare const swan: Swan;

export const internalRequest = <T>(args: InvokeParams, controller?: RequestController) => {
  // Detect the current platform and call the corresponding method.
  switch (true) {
    // On some strange platforms, an XMLHttpRequest object may be provided, but not avaliable. Therefore, we have to
    // detect the existence of document object to determine if it is a browser platform.
    case typeof XMLHttpRequest === 'function' && typeof document === 'object' && document !== null:
      return requestWithXhr<T>(args, controller);

    case typeof wx === 'object' && isValidMPO(wx):
      return requestWithWx<T>(args, controller);
    case typeof my === 'object' && isValidMPO(my):
      return requestWithMy<T>(args, controller);
    case typeof swan === 'object' && isValidMPO(swan):
      return requestWithSwan<T>(args, controller);

    // If none of the MiniProgram platforms match, we can fallback to using an XMLHttpRequest if it exists.
    case typeof XMLHttpRequest === 'function':
      return requestWithXhr<T>(args, controller);

    default: {
      throw new PlatformError();
    }
  }
};
