import { InvokeResult } from './types/InvokeResult';
import { InvokeParams } from './types/InvokeParams';
import { buildFormData } from './utils/builders';
import { buildQs } from './utils/builders';
import { XhrInvokeResult } from './XhrInvokeResult';
import { ContentError, FailedToRequest } from './errors';
import { isContentType, isMultipartFormData, isWwwFormUrlEncoded } from './utils/predicates';
import { APPLICATION_JSON, CONTENT_TYPE } from './constants';
import { fixInvokeParams } from './utils/fixInvokeParams';

export const requestWithXhr = <T>(params: InvokeParams) => {
  const {
    method,
    url,
    data,
    timeout,
    headers,
    files = {},
    responseType,
    withCredentials = true,
    signal,
    onUploadProgress,
  } = fixInvokeParams(params);

  return new Promise<InvokeResult<T>>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // The readyState 4 indicates that the XHR object is working completed,
    // but just completed alone cannot ensure success.
    // In fact, there are 4 possible end states: load, error, timeout, and abort.
    const errorHandler = ({ type }: ProgressEvent) => reject(new FailedToRequest(type, xhr));
    xhr.addEventListener('abort', errorHandler);
    xhr.addEventListener('timeout', errorHandler);
    xhr.addEventListener('error', errorHandler);
    xhr.addEventListener('load', () => resolve(new XhrInvokeResult(xhr)));

    // Bind onUploadProgress event.
    if (onUploadProgress)
      xhr.upload.addEventListener('progress', ({ total, loaded }) => {
        onUploadProgress({ loaded, total });
      });

    xhr.open(method, url, true);
    xhr.withCredentials = withCredentials;

    // NOTE: Do not use responseType=json, because
    // 1. Some lagency webkit cannot suport responseType=json.
    // 2. The behavior of json type will change illegal JSON response to null and never catch parsing errors.
    //    In fact, if there is parsing error, we should use the original string as the result.
    if (responseType && responseType !== 'json') {
      xhr.responseType = responseType;
    }

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
      xhr.send(buildFormData({ ...data, ...files }));
    } else if (data) {
      // If the content type is not provided, use the application/json as the default.
      if (!contentType) {
        xhr.setRequestHeader(CONTENT_TYPE, APPLICATION_JSON);
        xhr.send(JSON.stringify(data));
      }
      // Serialize the data according to the specified Content-Type.
      else if (isWwwFormUrlEncoded(contentType)) {
        xhr.setRequestHeader(CONTENT_TYPE, contentType);
        xhr.send(buildQs(data));
      } else if (isMultipartFormData(contentType)) {
        // The FormData provides the Content-Type with correct boundary value.
        // Do not set the Content-Type explicitly, otherwise the boundary value may be lose.
        xhr.send(buildFormData(data));
      } else {
        xhr.setRequestHeader(CONTENT_TYPE, contentType);
        xhr.send(JSON.stringify(data));
      }
    } else {
      xhr.send();
    }
    // Bind abort event.
    signal?.addEventListener('abort', () => xhr.abort());
  });
};
