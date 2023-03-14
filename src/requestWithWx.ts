import { InvokeResult } from "./types/InvokeResult";
import { InvokeParams } from "./types/InvokeParams";
import { Wx } from "./types/libs";
import { BatchUploadError, MiniProgramError } from "./errors";

declare const wx: Wx;

export const requestWithWx = <T>(args: InvokeParams) =>
  new Promise<InvokeResult<T>>((success, reject) => {
    const { headers, files, data, ...rest } = args;
    const fileNames = files ? Object.keys(files) : [];
    const fail = (obj: unknown) => {
      /**
       * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html#Object-err
       */
      const { errno, errMsg } = Object(obj);
      reject(new MiniProgramError(errno, errMsg));
    };
    if (fileNames.length === 0) {
      /**
       * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html
       */
      wx.request({
        header: headers,
        data,
        ...rest,
        success: ({ header, data, ...rest }) =>
          success({ ...rest, headers: header, data: data as T }),
        fail,
      });
    } else if (files && fileNames.length === 1) {
      const name = fileNames[0];
      const filePath = files[name];
      /**
       * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/upload/wx.uploadFile.html
       */
      wx.uploadFile({
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
      reject(new BatchUploadError());
    }
  });
