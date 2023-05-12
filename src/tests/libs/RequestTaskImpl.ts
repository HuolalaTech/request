import type { RequestTask } from '../../types/common';

export class RequestTaskImpl implements RequestTask {
  public readonly abort;
  constructor(abort: () => void) {
    this.abort = abort;
  }
}
