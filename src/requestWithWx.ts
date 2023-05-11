import { InvokeResult } from './types/InvokeResult';
import { InvokeParams } from './types/InvokeParams';
import { BatchUploadError, MiniProgramError } from './errors';
import { RequestController } from './RequestController';
import { Wx } from './types/Wx';

declare const wx: Wx;

const convertResponseType = (responseType?: InvokeParams['responseType']) => {
  if (!responseType) return {};
  if (responseType === 'arraybuffer') return { responseType } as const;
  if (responseType === 'json') return { dataType: 'json' } as const;
  if (responseType === 'text') return { dataType: 'string' } as const;
  throw new TypeError(`The responseType "${responseType}" is not supported by WeChat Miniprogram`);
};

export const requestWithWx = <T>(args: InvokeParams, controller: RequestController = new RequestController()) =>
  new Promise<InvokeResult<T>>((resolve, reject) => {
    const { headers, files, data, responseType, onUploadProgress, ...rest } = args;
    const fileNames = files ? Object.keys(files) : [];

    const fail = (obj: unknown) => {
      /**
       * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html#Object-err
       */
      const { errno, errMsg } = Object(obj);
      reject(new MiniProgramError(errno, errMsg));
    };

    try {
      if (fileNames.length === 0) {
        /**
         * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html
         */
        const task = wx.request({
          header: headers,
          data,
          ...convertResponseType(responseType),
          ...rest,
          success: ({ header, data, ...rest }) => resolve({ ...rest, headers: header, data: data as T }),
          fail,
        });
        controller.abort = () => task.abort();
      } else if (files && fileNames.length === 1) {
        if (responseType) {
          throw new TypeError('The `responseType` is not supported if `files` not empty in WeChat Miniprogram');
        }
        const name = fileNames[0];
        const filePath = files[name];
        /**
         * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/upload/wx.uploadFile.html
         */
        const task = wx.uploadFile({
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
