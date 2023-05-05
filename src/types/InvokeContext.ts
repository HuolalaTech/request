import { InvokeParams } from './InvokeParams';

export type InvokeContext = {
  /**
   * The request parameters, which may be null if thrown in the request interceptor.
   */
  request?: InvokeParams;
};
