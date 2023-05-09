import { InvokeResult } from './types/InvokeResult';
import { InvokeParams } from './types/InvokeParams';
import { My } from './types/libs';
import { BatchUploadError, MiniProgramError } from './errors';

declare const my: My;

const convertResponseType = (responseType?: InvokeParams['responseType']) => {
  if (!responseType) return {};
  if (responseType === 'arraybuffer') return { dataType: 'arraybuffer' };
  if (responseType === 'json' || responseType === 'text') return { dataType: responseType };
  throw new TypeError(`The responseType "${responseType}" is not supported by Alipay Miniprogram`);
};

export const requestWithMy = <T>(args: InvokeParams) =>
  new Promise<InvokeResult<T>>((resolve, reject) => {
    const { headers, files, data, responseType, ...rest } = args;
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
        my.request({
          headers,
          data,
          ...convertResponseType(responseType),
          ...rest,
          success: ({ data, ...rest }) => {
            resolve({ data: data as T, ...rest });
          },
          fail,
        });
      } else if (files && fileNames.length === 1) {
        if (responseType) {
          throw new TypeError('The `responseType` is not supported if `files` not empty in Alipay Miniprogram');
        }
        const name = fileNames[0];
        const filePath = files[name];
        /**
         * @see https://opendocs.alipay.com/mini/api/kmq4hc
         */
        my.uploadFile({
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
