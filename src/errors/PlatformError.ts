import { CustomError } from "@huolala-tech/custom-error";

export class PlatformError extends CustomError {
  constructor() {
    super(`Invalid platform`);
    this.name = "PlatformError";
  }
}
