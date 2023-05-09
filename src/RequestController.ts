export interface Abortable {
  abort: () => void;
}

export type AbortablePromise<T> = Promise<T> & Abortable;

export class RequestController implements Abortable {
  private readonly triggerAbort: () => void;
  private abortHandler?: () => void;

  constructor() {
    /**
     * Why is this function defined as a property rather than a method?
     * Because a method is actually defined on the prototype, which depends on the "this" context.
     * However, this function needs to bind the current "this" as it may be called in an unknown context.
     */
    this.triggerAbort = () => {
      this.abortHandler?.();
    };
  }

  public set abort(handler) {
    this.abortHandler = handler;
  }

  /**
   * NOTE: A ReqeustController object always return same instance when get the "abort".
   */
  public get abort() {
    return this.triggerAbort;
  }
}

export function injectAbortable<T>(
  target: Promise<T>,
  controller: RequestController,
): asserts target is AbortablePromise<T> {
  const { abort } = controller;
  Object.defineProperty(target, 'abort', { configurable: true, value: abort });
}
