import { CustomError } from "@huolala-tech/custom-error";

export class HttpError extends CustomError {
  public readonly status;
  constructor(status: number) {
    super(status ? `HTTP status ${status}` : "Failed to fetch");
    this.name = "HttpError";
    this.status = status;
  }
}
