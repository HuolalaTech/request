import { InvokeResult } from './types/InvokeResult';
import { InvokeParams } from './types/InvokeParams';
import { BatchUploadError, MiniProgramError } from './errors';
import { My } from './types/My';
import { fixInvokeParams } from './utils/fixInvokeParams';

declare const my: My;

const convertResponseType = (responseType?: InvokeParams['responseType']) => {
  if (!responseType) return {};
  if (responseType === 'arraybuffer') return { dataType: 'arraybuffer' } as const;
  if (responseType === 'json' || responseType === 'text') return { dataType: responseType } as const;
  throw new TypeError(`The responseType "${responseType}" is not supported by Alipay Miniprogram`);
};

export const requestWithMy = <T>(args: InvokeParams) =>
  new Promise<InvokeResult<T>>((resolve, reject) => {
    const { headers, files, data, responseType, onUploadProgress, signal, ...rest } = fixInvokeParams(args);
    const fileNames = files ? Object.keys(files) : [];

    const fail = (obj: unknown) => {
      /**
       * @see https://opendocs.alipay.com/mini/api/owycmh#fail%20%E5%9B%9E%E8%B0%83%E5%87%BD%E6%95%B0
       */
      const { error, errorMessage } = Object(obj);
      reject(new MiniProgramError(error, errorMessage));
    };

    try {
      if (fileNames.length === 0) {
        /**
         * @see https://opendocs.alipay.com/mini/api/owycmh
         */
        const task = my.request({
          headers,
          data,
          ...convertResponseType(responseType),
          ...rest,
          success: ({ data, ...rest }) => {
            resolve({ data: data as T, ...rest });
          },
          fail,
        });
        signal?.addEventListener('abort', () => task.abort());
      } else if (files && fileNames.length === 1) {
        if (responseType) {
          throw new TypeError('The `responseType` is not supported if `files` not empty in Alipay Miniprogram');
        }
        const name = fileNames[0];
        const filePath = files[name];
        /**
         * @see https://opendocs.alipay.com/mini/api/kmq4hc
         */
        const task = my.uploadFile({
          header: headers,
          formData: Object(data),
          name,
          filePath,
          ...rest,
          success: ({ header, data, ...rest }) => resolve({ headers: header, data: data as T, ...rest }),
          fail,
        });
        // Bind onUploadProgress event.
        if (onUploadProgress)
          task.onProgressUpdate((e) => {
            onUploadProgress({ loaded: e.totalBytesWritten, total: e.totalBytesExpectedToWrite });
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
