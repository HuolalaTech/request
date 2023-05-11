import { InvokeResult } from './types/InvokeResult';
import { InvokeParams } from './types/InvokeParams';
import { BatchUploadError, MiniProgramError } from './errors';
import { RequestController } from './RequestController';
import { Tt } from './types/Tt';

declare const tt: Tt;

const convertResponseType = (responseType?: InvokeParams['responseType']) => {
  if (!responseType) return {};
  if (responseType === 'arraybuffer') return { responseType } as const;
  if (responseType === 'json') return { dataType: 'json' } as const;
  if (responseType === 'text') return { dataType: 'string' } as const;
  throw new TypeError(`The responseType "${responseType}" is not supported by DouYin Miniprogram`);
};

export const requestWithTt = <T>(args: InvokeParams, controller: RequestController = new RequestController()) =>
  new Promise<InvokeResult<T>>((resolve, reject) => {
    const { headers, files, data, responseType, onUploadProgress, ...rest } = args;
    const fileNames = files ? Object.keys(files) : [];

    const fail = (obj: unknown) => {
      /**
       * @see https://developer.open-douyin.com/docs/resource/zh-CN/mini-app/develop/api/network/http/tt-request#_%E5%9B%9E%E8%B0%83%E5%A4%B1%E8%B4%A5
       */
      const { errCode, errMsg } = Object(obj);
      reject(new MiniProgramError(errCode, errMsg));
    };

    try {
      if (fileNames.length === 0) {
        /**
         * @see https://developer.open-douyin.com/docs/resource/zh-CN/mini-app/develop/api/network/http/tt-request
         */
        const task = tt.request({
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
          throw new TypeError('The `responseType` is not supported if `files` not empty in DouYin Miniprogram');
        }
        const name = fileNames[0];
        const filePath = files[name];
        /**
         * @see https://developer.open-douyin.com/docs/resource/zh-CN/mini-app/develop/api/network/http/tt-upload-file
         */
        const task = tt.uploadFile({
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
