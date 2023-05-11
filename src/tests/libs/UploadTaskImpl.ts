import { RequestController } from '../../RequestController';
import { MyProgressInfo } from '../../types/My';
import type { ProgressInfo, UploadTask } from '../../types/common';

type Info = ProgressInfo & MyProgressInfo;

export class UploadTaskImpl extends RequestController implements UploadTask<Info> {
  constructor() {
    super();
    setTimeout(() => {
      UploadTaskImpl.dispatch(this, 1000, 1000);
    });
  }
  private readonly list: ((res: Info) => void)[] = [];
  public onProgressUpdate(listener: (res: Info) => void): void {
    this.list.push(listener);
  }
  public offProgressUpdate(listener: (res: Info) => void): void {
    const index = this.list.indexOf(listener);
    if (index !== -1) this.list.splice(index, 1);
  }
  public static dispatch(target: UploadTaskImpl, total: number, loaded: number) {
    target.list.forEach((f) =>
      f({
        totalBytesExpectedToSend: total,
        totalBytesSent: loaded,
        totalBytesExpectedToWrite: total,
        totalBytesWritten: loaded,
      }),
    );
  }
}
