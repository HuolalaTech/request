import { RequestController } from '../../RequestController';
import type { UploadTask } from '../../types/libs';

export class UploadTaskImpl extends RequestController implements UploadTask {
  private readonly list: ((res: unknown) => void)[] = [];
  public onProgressUpdate(listener: (res: unknown) => void): void {
    this.list.push(listener);
  }
  public offProgressUpdate(listener: (res: unknown) => void): void {
    const index = this.list.indexOf(listener);
    if (index !== -1) this.list.splice(index, 1);
  }
}
