export interface InvokeResult<T = any> {
  statusCode: number;
  data: T;
  headers: Record<string, string>;
}
