export interface InvokeParams {
  /**
   * NOTE: Some MiniProgram platforms can only support GET or POST methods, so using a RESTful API is not the best solution for MiniPrograms.
   */
  method: string;

  url: string;

  data?: Record<string, any>;

  timeout?: number;

  headers?: Record<string, string>;

  /**
   * NOTE: In browsers, the file is represented as a Blob or File object, whereas in other MiniProgram platforms, the file is represented as a string filePath.
   * NOTE: MiniProgram platforms doese not suport multiple files uploading in once.
   */
  files?: Record<string, Blob | File | string>;
}
