import { CustomError } from "@huolala-tech/custom-error";

export class BatchUploadError extends CustomError {
  constructor() {
    super(`The MiniProgram does not support uploading multiple files in once`);
    this.name = "BatchUploadError";
  }
}
