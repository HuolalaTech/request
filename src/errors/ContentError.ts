import { CustomError } from '@huolala-tech/custom-error';

export class ContentError extends CustomError {
  constructor(contentType: string) {
    super(`The files cannot upload with Content-Type ${contentType}`);
    this.name = 'ContentError';
  }
}
