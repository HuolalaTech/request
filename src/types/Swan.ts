import { Abortable } from './Abortable';
import { RequestParams, UploadParams, UploadTask, ProgressInfo, BaseMpo } from './common';

export interface Swan extends BaseMpo {
  request(req: RequestParams): Abortable;
  uploadFile(req: UploadParams): UploadTask<ProgressInfo>;
}
