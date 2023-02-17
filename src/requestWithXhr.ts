import { HttpError } from "./HttpError";
import { InvokeResult } from "./types/InvokeResult";
import { InvokeParams } from "./types/InvokeParams";
import { parseRawHeaderAsMap } from "./utils/parseRawHeaderAsMap";
import { isWwwFormData } from "./utils/isWwwFormData";
import { buildFormData } from "./utils/buildFormData";
import { buildQs } from "./utils/buildQs";
import { isMultipartFormData } from "./utils/isMultipartFormData";
import { isApplicationJson } from "./utils/isApplicationJson";

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
      const { status, responseText } = xhr;
      try {
        if (status >= 200 && status < 300) {
          const hd = parseRawHeaderAsMap(xhr.getAllResponseHeaders());
          let res: any = responseText;
          const ct = hd["content-type"];
          if ((!ct || isApplicationJson(ct)) && responseText) {
            res = JSON.parse(responseText);
          }
          resolve({ statusCode: status, headers: hd, data: res });
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
    let contentType;
    if (headers) {
      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
        if (/^Content-Type$/i.test(key)) contentType = headers[key];
      });
    }

    const fileKeys = Object.keys(files);
    if (fileKeys.length) {
      if (contentType && !isMultipartFormData(contentType))
        throw new Error(`files cannot upload with content-type ${contentType}`);
      const fd = buildFormData(data);
      fileKeys.forEach((key) => fd.append(key, files[key]));
      xhr.send(fd);
    } else if (data) {
      if (!contentType) {
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));
      } else if (isWwwFormData(contentType)) {
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
