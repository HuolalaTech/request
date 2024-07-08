import { RequestParams, UploadParams, UploadTask, ProgressInfo, BaseMpo, RequestTask } from './common';

export interface Ks extends BaseMpo {
  request(req: RequestParams): RequestTask;
  uploadFile(req: UploadParams): UploadTask<ProgressInfo>;
}
