import { InvokeResult } from "./types/InvokeResult";
import { InvokeParams } from "./types/InvokeParams";

declare const wx: any;

export const requestWithWx = <T>(args: InvokeParams) =>
  new Promise<InvokeResult<T>>((success, fail) => {
    const { headers, files, data, ...rest } = args;
    const fileNames = files ? Object.keys(files) : [];
    if (fileNames.length === 0) {
      /**
       * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html
       */
      wx.request({
        header: headers,
        data,
        ...rest,
        success: ({ header, ...rest }: any) =>
          success({ ...rest, headers: header }),
        fail,
      });
    } else if (fileNames.length === 1) {
      const name = fileNames[0];
      const filePath = files?.[name];
      /**
       * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/upload/wx.uploadFile.html
       */
      wx.uploadFile({
        header: headers,
        formData: data,
        name,
        filePath,
        ...rest,
        success: ({ header, ...rest }: any) =>
          success({ ...rest, headers: header }),
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
