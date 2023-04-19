import { CustomError } from '@huolala-tech/custom-error';

export class FailedToRequest extends CustomError {
  public readonly type;
  public readonly xhr;
  constructor(type: string, xhr: XMLHttpRequest) {
    super(`Failed to request because of ${type}`);
    this.type = type;
    this.xhr = xhr;
    this.name = 'FailedToRequest';
  }
}
