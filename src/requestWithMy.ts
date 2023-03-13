import { InvokeResult } from "./types/InvokeResult";
import { InvokeParams } from "./types/InvokeParams";
import { My } from "./types/libs";
import { BatchUploadError } from "./errors";

declare const my: My;

export const requestWithMy = <T>(args: InvokeParams) =>
  new Promise<InvokeResult<T>>((success, fail) => {
    const { headers, files, data, ...rest } = args;
    const fileNames = files ? Object.keys(files) : [];

    if (fileNames.length === 0) {
      /**
       * @see https://opendocs.alipay.com/mini/api/owycmh
       */
      my.request({
        headers,
        data,
        ...rest,
        success: ({ data, ...rest }) => {
          success({ data: data as T, ...rest });
        },
        fail,
      });
    } else if (fileNames.length === 1) {
      const name = fileNames[0];
      const filePath = files?.[name];
      /**
       * @see https://opendocs.alipay.com/mini/api/kmq4hc
       */
      my.uploadFile({
        header: headers,
        formData: data,
        name,
        filePath,
        ...rest,
        success: ({ header, data, ...rest }) =>
          success({ headers: header, data: data as T, ...rest }),
        fail,
      });
    } else {
      fail(new BatchUploadError());
    }
  });
