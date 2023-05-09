export type FixMy<T extends { header?: Header }> = Omit<T, 'header' | 'responseType'> & {
  headers: T['header'];
};

export interface RequestTask {
  abort(): void;
}

export interface UploadTask extends RequestTask {
  onProgressUpdate(listener: (res: unknown) => void): void;
  offProgressUpdate(listener: (res: unknown) => void): void;
}

export type Header = Record<string, string>;

export interface WxRes {
  statusCode: number;
  header: Header;
  data: unknown;
}

export interface WxReq1<T = WxRes> {
  success: (obj: T) => void;
  fail?: (reason: unknown) => void;
  header?: Header;
  responseType?: 'text' | 'arraybuffer';
  dataType?: string;
  data?: Record<string, unknown>;
}

export interface WxReq2<T = WxRes> {
  success: (obj: T) => void;
  fail?: (reason: unknown) => void;
  header?: Header;
  name: string;
  filePath?: string | Blob | File;
  formData?: Record<string, unknown>;
}

export interface Wx {
  request(req: WxReq1): RequestTask;
  uploadFile(req: WxReq2): UploadTask;
}

export type Swan = Wx;

export type MyReq1 = FixMy<WxReq1<FixMy<WxRes>>>;

export interface My {
  request(req: MyReq1): RequestTask;
  uploadFile(req: WxReq2): UploadTask;
}
