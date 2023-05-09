import type { UploadTask } from '../../types/libs';

export class UploadTaskImpl implements UploadTask {
  onProgressUpdate(listener: (res: unknown) => void): void {
    throw new Error('Method not implemented.');
  }
  offProgressUpdate(listener: (res: unknown) => void): void {
    throw new Error('Method not implemented.');
  }
  abort(): void {
    throw new Error('Method not implemented.');
  }
}
