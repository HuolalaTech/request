export interface ProgressInfo {
  totalBytesExpectedToSend: number;
  totalBytesSent: number;
}

export interface RequestTask {
  abort(): void;
}

export interface UploadTask<I> extends RequestTask {
  onProgressUpdate(listener: (info: I) => void): void;
  offProgressUpdate(listener: (info: I) => void): void;
}

export type Header = Record<string, string>;

export interface Response {
  statusCode: number;
  header: Header;
  data: unknown;
}

export interface RequestParams<T = Response> {
  success: (obj: T) => void;
  fail?: (reason: unknown) => void;
  header?: Header;
  responseType?: 'text' | 'arraybuffer';
  dataType?: 'json' | 'string';
  data?: unknown;
}

export interface UploadParams<T = Response> {
  success: (obj: T) => void;
  fail?: (reason: unknown) => void;
  header?: Header;
  name: string;
  filePath?: string | Blob | File;
  formData?: Record<string, unknown>;
}

export interface BaseMpo {
  canIUse(name: string): boolean;
}
