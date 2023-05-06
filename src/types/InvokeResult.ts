export interface InvokeResult<T = unknown> {
  /**
   * Response status code.
   */
  statusCode: number;

  /**
   * Parsed response body.
   */
  data: T;

  /**
   * Response headers.
   */
  headers: Record<string, string>;
}
