import { InvokeResult } from "./types/InvokeResult";
import { InvokeParams } from "./types/InvokeParams";
import type { Wx } from "./types/libs";

declare const swan: Wx;

export const requestWithSwan = <T>(args: InvokeParams) =>
  new Promise<InvokeResult<T>>((success, fail) => {
    const { headers, files, data, ...rest } = args;
    const fileNames = files ? Object.keys(files) : [];

    if (fileNames.length === 0) {
      /**
       * @see https://smartprogram.baidu.com/docs/develop/api/net/request/
       */
      swan.request({
        header: headers,
        data,
        ...rest,
        success: ({ header, data, ...rest }) =>
          success({ data: data as T, headers: header, ...rest }),
        fail,
      });
    } else if (fileNames.length === 1) {
      const name = fileNames[0];
      const filePath = files?.[name];
      /**
       * @see https://smartprogram.baidu.com/docs/develop/api/net/uploadfile/
       */
      swan.uploadFile({
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
      fail(
        new TypeError(
          "The Miniprogram does not support uploading multiple files in once"
        )
      );
    }
  });
