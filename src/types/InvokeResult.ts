export interface InvokeResult<T = unknown> {
  statusCode: number;
  data: T;
  headers: Record<string, string>;
}
