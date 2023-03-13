import { HttpError } from "./errors";
import { InvokeResult } from "./types/InvokeResult";
import { InvokeParams } from "./types/InvokeParams";
import { isWwwFormData } from "./utils/isWwwFormData";
import { buildFormData } from "./utils/buildFormData";
import { buildQs } from "./utils/buildQs";
import { isMultipartFormData } from "./utils/isMultipartFormData";
import { XhrInvokeResult } from "./XhrInvokeResult";

export const requestWithXhr = <T>({
  method,
  url,
  data,
  timeout,
  headers,
  files = {},
}: InvokeParams) => {
  return new Promise<InvokeResult<T>>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState < 4) return;
      const { status } = xhr;
      try {
        if (status >= 200 && status < 300) {
          resolve(new XhrInvokeResult<T>(xhr));
        } else {
          reject(new HttpError(status));
        }
      } catch (error) {
        reject(error);
      }
    });

    xhr.addEventListener("error", reject);

    xhr.open(method, url, true);

    xhr.withCredentials = true;

    if (timeout) xhr.timeout = timeout;

    // Copy the provided headers to the XHR object and save the Content-Type to variable which is useful below.
    let contentType;
    if (headers) {
      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
        if (/^Content-Type$/i.test(key)) contentType = headers[key];
      });
    }

    const fileKeys = Object.keys(files);
    // If file list is not empty, construct the data as a FormData object and send it with multipart/form-data.
    if (fileKeys.length) {
      if (contentType && !isMultipartFormData(contentType))
        throw new Error(`files cannot upload with content-type ${contentType}`);
      const fd = buildFormData(data);
      fileKeys.forEach((key) => fd.append(key, files[key]));
      xhr.send(fd);
    } else if (data) {
      // If the content type is not provided, use the application/json as the default.
      if (!contentType) {
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));
      }
      // Serialize the data according to the specified Content-Type.
      else if (isWwwFormData(contentType)) {
        xhr.send(buildQs(data));
      } else if (isMultipartFormData(contentType)) {
        xhr.send(buildFormData(data));
      } else {
        xhr.send(JSON.stringify(data));
      }
    } else {
      xhr.send();
    }
  });
};
