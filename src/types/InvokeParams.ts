export interface InvokeParams {
  /**
   * An HTTP method, such as GET, POST.
   * NOTE: Some MiniProgram platforms can only support GET or POST methods,
   *       so using a RESTful API is not the best solution for MiniPrograms.
   */
  method: string;

  /**
   * Specify a request URL.
   */
  url: string;

  /**
   * Specify a request data.
   * NOTE: For GET method, the `data` will be converted to a query string.
   */
  data?: Record<string, unknown>;

  /**
   * Specify a timeout in milliseconds.
   */
  timeout?: number;

  /**
   * Specify the reqeust headers.
   * @example { Accept: 'application/json' }
   */
  headers?: Record<string, string>;

  /**
   * Specify the files that your want to upload.
   * This parameter indecates the HTTP method POST, and Content-Type multipart/form-data.
   * If you provided a conflict configuration, an error will be thrown.
   * NOTE: In browsers, the file is represented as a Blob or File object, whereas in other MiniProgram platforms,
   *       the file is represented as a string filePath.
   * NOTE: The MiniProgram platforms does not support uploading multiple files at once,
   *       if you specify more than one file, a BatchUploadError will be thrown.
   */
  files?: Record<string, Blob | File | string>;

  /**
   * Specify the response type.
   *
   * |             | Browser | WeChat | Alipay | Baidu |
   * | ----------- | ------- | ------ | ------ | ----- |
   * | text        | yes     | yes    | yes    | yes   |
   * | json        | yes     | yes    | yes    | yes   |
   * | arraybuffer | yes     | yes    | yes    | yes   |
   * | blob        | yes     | no     | no     | no    |
   */
  responseType?: XMLHttpRequestResponseType;

  /**
   * The withCredentials flag for XHR object.
   * NOTE: It's only used in browser.
   * @default true
   */
  withCredentials?: boolean;

  /**
   * An object that implemented the AbortSignal interface.
   * NOTE: If your environment cannot support the AbortController,
   *       you can use RequestControler from this package instread.
   */
  signal?: AbortSignal;

  /**
   * A handler function that trigger on uploading progress update.
   */
  onUploadProgress?: (progress: { total: number; loaded: number }) => void;
}
