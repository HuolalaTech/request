import { PlatformError } from './errors';
import { requestWithMy } from './requestWithMy';
import { requestWithSwan } from './requestWithSwan';
import { requestWithTt } from './requestWithTt';
import { requestWithWx } from './requestWithWx';
import { requestWithKs } from './requestWithKs';
import { requestWithXhr } from './requestWithXhr';
import { InvokeParams } from './types/InvokeParams';
import { My } from './types/My';
import { Swan } from './types/Swan';
import { Wx } from './types/Wx';
import { Ks } from './types/Ks';
import { isValidMPO as isValidMpo } from './utils/predicates';

declare const wx: Wx;
declare const my: My;
declare const swan: Swan;
declare const tt: Swan;
declare const ks: Ks;

export const internalRequest = <T>(args: InvokeParams) => {
  // Detect the current platform and call the corresponding method.
  switch (true) {
    // On some strange platforms, an XMLHttpRequest object may be provided, but not avaliable. Therefore, we have to
    // detect the existence of document object to determine if it is a browser platform.
    case typeof XMLHttpRequest === 'function' && typeof document === 'object' && document !== null:
      return requestWithXhr<T>(args);
    // Noted that the 'ks' must be used ahead of 'wx', because kuaishou just copied wx's base code and has the 'wx'
    // variable left in the runtime.
    case typeof ks === 'object' && isValidMpo(ks):
      return requestWithKs<T>(args);
    case typeof wx === 'object' && isValidMpo(wx):
      return requestWithWx<T>(args);
    case typeof my === 'object' && isValidMpo(my):
      return requestWithMy<T>(args);
    case typeof tt === 'object' && isValidMpo(tt):
      return requestWithTt<T>(args);
    case typeof swan === 'object' && isValidMpo(swan):
      return requestWithSwan<T>(args);

    // If none of the MiniProgram platforms match, we can fallback to using an XMLHttpRequest if it exists.
    case typeof XMLHttpRequest === 'function':
      return requestWithXhr<T>(args);

    default: {
      throw new PlatformError();
    }
  }
};
