import { RequestParams, UploadParams, UploadTask, ProgressInfo, BaseMpo, RequestTask } from './common';

export interface Wx extends BaseMpo {
  request(req: RequestParams): RequestTask;
  uploadFile(req: UploadParams): UploadTask<ProgressInfo>;
}
