import { InvokeResult } from './types/InvokeResult';
import { InvokeParams } from './types/InvokeParams';
import { BatchUploadError, MiniProgramError } from './errors';
import { RequestController } from './RequestController';
import { Swan } from './types/Swan';

declare const swan: Swan;

const convertResponseType = (responseType?: InvokeParams['responseType']) => {
  if (!responseType) return {};
  if (responseType === 'arraybuffer') return { responseType } as const;
  if (responseType === 'json') return { dataType: 'json' } as const;
  if (responseType === 'text') return { dataType: 'string' } as const;
  throw new TypeError(`The responseType "${responseType}" is not supported by Baidu Miniprogram`);
};

export const requestWithSwan = <T>(args: InvokeParams, controller: RequestController = new RequestController()) =>
  new Promise<InvokeResult<T>>((resolve, reject) => {
    const { headers, files, data, responseType, onUploadProgress, ...rest } = args;
    const fileNames = files ? Object.keys(files) : [];

    const fail = (obj: unknown) => {
      // Perhaps the official is joking with us, so important information actually no documentation :joy:.
      const { errCode, errMsg } = Object(obj);
      reject(new MiniProgramError(errCode, errMsg));
    };

    try {
      if (fileNames.length === 0) {
        /**
         * @see https://smartprogram.baidu.com/docs/develop/api/net/request/
         */
        const task = swan.request({
          header: headers,
          data,
          ...convertResponseType(responseType),
          ...rest,
          success: ({ header, data, ...rest }) => resolve({ data: data as T, headers: header, ...rest }),
          fail,
        });
        controller.abort = () => task.abort();
      } else if (files && fileNames.length === 1) {
        if (responseType) {
          throw new TypeError('The `responseType` is not supported if `files` not empty in Baidu Miniprogram');
        }
        const name = fileNames[0];
        const filePath = files[name];
        /**
         * @see https://smartprogram.baidu.com/docs/develop/api/net/uploadfile/
         */
        const task = swan.uploadFile({
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
        controller.abort = () => task.abort();
      } else {
        throw new BatchUploadError();
      }
    } catch (error) {
      reject(error);
    }
  });
