import { CustomError } from '@huolala-tech/custom-error';

export class MiniProgramError extends CustomError {
  public readonly code;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.name = 'MiniProgramError';
  }
}
