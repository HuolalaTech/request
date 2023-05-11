import { Abortable } from './Abortable';
import { UploadParams, UploadTask, RequestParams, Header, Response, BaseMpo } from './common';

export interface MyProgressInfo {
  totalBytesExpectedToWrite: number;
  totalBytesWritten: number;
}

export interface MyResponse extends Omit<Response, 'header'> {
  headers: Header;
}

export interface MyRequestParams extends Omit<RequestParams<MyResponse>, 'header' | 'responseType' | 'dataType'> {
  headers?: Header;
  dataType?: 'arraybuffer' | 'json' | 'text';
}

export interface My extends BaseMpo {
  request(req: MyRequestParams): Abortable;
  uploadFile(req: UploadParams): UploadTask<MyProgressInfo>;
}
