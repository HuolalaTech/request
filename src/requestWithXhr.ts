import { InvokeResult } from './types/InvokeResult';
import { InvokeParams } from './types/InvokeParams';
import { isWwwFormData } from './utils/isWwwFormData';
import { buildFormData } from './utils/buildFormData';
import { buildQs } from './utils/buildQs';
import { isMultipartFormData } from './utils/isMultipartFormData';
import { XhrInvokeResult } from './XhrInvokeResult';
import { ContentError } from './errors';
import { isContentType } from './utils/isContentType';

export const requestWithXhr = <T>({ method, url, data, timeout, headers, files = {} }: InvokeParams) => {
  return new Promise<InvokeResult<T>>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState !== 4) return;
      try {
        resolve(new XhrInvokeResult<T>(xhr));
      } catch (error) {
        reject(error);
      }
    });

    xhr.addEventListener('error', reject);

    xhr.open(method, url, true);

    xhr.withCredentials = true;

    if (timeout) xhr.timeout = timeout;

    // Copy the provided headers to the XHR object, except for Content-Type.
    // Store the Content-Type in a variable that will be useful later.
    let contentType: string | undefined;
    if (headers) {
      Object.keys(headers).forEach((key) => {
        // NOTE: A JavaScript object is case-sensitive. If the Content-Type header is provided multiple times
        //       with different case, the latest value will be used.
        if (isContentType(key)) {
          contentType = headers[key];
        } else {
          xhr.setRequestHeader(key, headers[key]);
        }
      });
    }

    const fileKeys = Object.keys(files);
    // If file list is not empty, construct the data as a FormData object and send it with multipart/form-data.
    if (fileKeys.length) {
      if (contentType && !isMultipartFormData(contentType)) {
        throw new ContentError(contentType);
      }
      // The FormData provides the Content-Type with correct boundary value.
      // Do not set the Content-Type explicitly, otherwise the boundary value may be lose.
      const fd = buildFormData(data);
      fileKeys.forEach((key) => fd.append(key, files[key]));
      xhr.send(fd);
    } else if (data) {
      // If the content type is not provided, use the application/json as the default.
      if (!contentType) {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
      }
      // Serialize the data according to the specified Content-Type.
      else if (isWwwFormData(contentType)) {
        xhr.setRequestHeader('Content-Type', contentType);
        xhr.send(buildQs(data));
      } else if (isMultipartFormData(contentType)) {
        // The FormData provides the Content-Type with correct boundary value.
        // Do not set the Content-Type explicitly, otherwise the boundary value may be lose.
        xhr.send(buildFormData(data));
      } else {
        xhr.setRequestHeader('Content-Type', contentType);
        xhr.send(JSON.stringify(data));
      }
    } else {
      xhr.send();
    }
  });
};
