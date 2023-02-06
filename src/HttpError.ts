import { CustomError } from "@huolala-tech/custom-error";

/**
 * Network ok, http response has received, but status is unexpected.
 */
export class HttpError extends CustomError {
  readonly status;
  constructor(status: number) {
    super(status ? `HTTP status ${status}` : "Failed to fetch");
    this.name = "HttpException";
    this.status = status;
  }
}
