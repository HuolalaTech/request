export type FixMy<T extends { header?: Header }> = Omit<T, 'header'> & {
  headers: T['header'];
};

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
  request(req: WxReq1): void;
  uploadFile(req: WxReq2): void;
}

export type Swan = Wx;

export type MyReq1 = FixMy<WxReq1<FixMy<WxRes>>>;

export interface My {
  request(req: MyReq1): void;
  uploadFile(req: WxReq2): void;
}
