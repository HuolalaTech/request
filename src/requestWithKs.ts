import { InvokeResult } from './types/InvokeResult';
import { InvokeParams } from './types/InvokeParams';
import { BatchUploadError, MiniProgramError } from './errors';
import { fixInvokeParams } from './utils/fixInvokeParams';
import { Ks } from './types/Ks';

declare const ks: Ks;

const convertResponseType = (responseType?: InvokeParams['responseType']) => {
  if (!responseType) return {};
  if (responseType === 'arraybuffer') return { responseType } as const;
  if (responseType === 'json') return { dataType: 'json' } as const;
  if (responseType === 'text') return { dataType: 'string' } as const;
  throw new TypeError(`The responseType "${responseType}" is not supported by DouYin Miniprogram`);
};

export const requestWithKs = <T>(args: InvokeParams) =>
  new Promise<InvokeResult<T>>((resolve, reject) => {
    const { headers, files, data, responseType, onUploadProgress, signal, ...rest } = fixInvokeParams(args);
    const fileNames = files ? Object.keys(files) : [];

    const fail = (obj: unknown) => {
      // Perhaps the official is joking with us, so important information actually no documentation :joy:.
      const { errCode, errMsg } = Object(obj);
      reject(new MiniProgramError(errCode, errMsg));
    };

    try {
      if (fileNames.length === 0) {
        /**
         * @see https://mp.kuaishou.com/docs/develop/api/network/request/request.html
         */
        const task = ks.request({
          header: headers,
          data,
          ...convertResponseType(responseType),
          ...rest,
          success: ({ header, data, ...rest }) => resolve({ data: data as T, headers: header, ...rest }),
          fail,
        });
        signal?.addEventListener('abort', () => task.abort());
      } else if (files && fileNames.length === 1) {
        if (responseType) {
          throw new TypeError('The `responseType` is not supported if `files` not empty in DouYin Miniprogram');
        }
        const name = fileNames[0];
        const filePath = files[name];
        /**
         * @see https://mp.kuaishou.com/docs/develop/api/network/upload/uploadFile.html
         */
        const task = ks.uploadFile({
          header: headers,
          formData: data,
          name,
          filePath,
          ...rest,
          success: ({ header, data, ...rest }) => resolve({ headers: header, data: data as T, ...rest }),
          fail,
        });
        // Bind onUploadProgress event.
        if (onUploadProgress)
          task.onProgressUpdate((e) => {
            onUploadProgress({ loaded: e.totalBytesSent, total: e.totalBytesExpectedToSend });
          });
        // Bind abort event.
        signal?.addEventListener('abort', () => task.abort());
      } else {
        throw new BatchUploadError();
      }
    } catch (error) {
      reject(error);
    }
  });
