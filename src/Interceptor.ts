export type MayBeNull<T> = T | null;

export type ResolveHandler<T> = MayBeNull<
  (current: T) => void | Partial<T> | PromiseLike<Partial<T>>
>;

export type RejectHandler<T> = MayBeNull<(error: any) => T | PromiseLike<T>>;

export class Interceptor<T> {
  private handlers = [] as [ResolveHandler<T>, RejectHandler<T>][];
  /**
   * Add an interceptor
   */
  use(
    onfulfilled: ResolveHandler<T> = null,
    onrejected: RejectHandler<T> = null
  ) {
    this.handlers.push([onfulfilled, onrejected]);
  }
  /**
   * Remove an interceptor
   */
  eject(
    onfulfilled: ResolveHandler<T> = null,
    onrejected: RejectHandler<T> = null
  ) {
    const { handlers } = this;
    for (let i = 0; i < handlers.length; i++) {
      if (handlers[i][0] === onfulfilled && handlers[i][1] === onrejected) {
        handlers.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  static wrap<T>(interceptor: Interceptor<T>, task: Promise<T>) {
    const { handlers } = interceptor;
    let t = task;
    for (let i = 0; i < handlers.length; i++) {
      const resolve = handlers[i][0];
      t = t.then(({ ...args }) => {
        if (resolve) {
          return Promise.resolve(args)
            .then(resolve)
            .then((updates) => ({ ...args, ...updates }));
        }
        return args;
      }, handlers[i][1]);
    }
    return t;
  }
}
