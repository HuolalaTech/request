import { InvokeResult } from './types/InvokeResult';
import { InvokeParams } from './types/InvokeParams';
import type { Wx } from './types/libs';
import { BatchUploadError, MiniProgramError } from './errors';

declare const swan: Wx;

const convertResponseType = (responseType?: InvokeParams['responseType']) => {
  if (!responseType) return {};
  if (responseType === 'arraybuffer') return { responseType };
  if (responseType === 'json') return { dataType: 'json' };
  if (responseType === 'text') return { dataType: 'string' };
  throw new TypeError(`The responseType "${responseType}" is not supported by WeChat Miniprogram`);
};

export const requestWithSwan = <T>(args: InvokeParams) =>
  new Promise<InvokeResult<T>>((resolve, reject) => {
    const { headers, files, data, responseType, ...rest } = args;
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
        swan.request({
          header: headers,
          data,
          ...convertResponseType(responseType),
          ...rest,
          success: ({ header, data, ...rest }) => resolve({ data: data as T, headers: header, ...rest }),
          fail,
        });
      } else if (files && fileNames.length === 1) {
        if (responseType) {
          throw new TypeError('The `responseType` is not supported if `files` not empty in Baidu Miniprogram');
        }
        const name = fileNames[0];
        const filePath = files[name];
        /**
         * @see https://smartprogram.baidu.com/docs/develop/api/net/uploadfile/
         */
        swan.uploadFile({
          header: headers,
          formData: data,
          name,
          filePath,
          ...rest,
          success: ({ header, data, ...rest }) => resolve({ headers: header, data: data as T, ...rest }),
          fail,
        });
      } else {
        throw new BatchUploadError();
      }
    } catch (error) {
      reject(error);
    }
  });
