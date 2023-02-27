export type MayBeNull<T> = T | null;

export type ResolveHandler<T, C> = MayBeNull<
  (current: T & C) => void | Partial<T> | PromiseLike<Partial<T>>
>;

export type RejectHandler<T, C> = MayBeNull<
  (error: unknown & C) => T | PromiseLike<T>
>;

export class Interceptor<T, C = unknown> {
  private handlers = [] as [ResolveHandler<T, C>, RejectHandler<T, C>][];
  /**
   * Add an interceptor
   */
  use(
    onfulfilled: ResolveHandler<T, C> = null,
    onrejected: RejectHandler<T, C> = null
  ) {
    this.handlers.push([onfulfilled, onrejected]);
  }
  /**
   * Remove an interceptor
   */
  eject(
    onfulfilled: ResolveHandler<T, C> = null,
    onrejected: RejectHandler<T, C> = null
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

  static wrap<R extends object, C>(
    interceptor: Interceptor<R, C>,
    task: Promise<R>,
    context?: C
  ) {
    const { handlers } = interceptor;
    let t = task;
    for (let i = 0; i < handlers.length; i++) {
      const [resolve, reject] = handlers[i];
      t = t.then(({ ...args }) => {
        if (resolve) {
          const mArgs = { ...args, ...Object(context) } as R & C;
          return Promise.resolve(mArgs)
            .then(resolve)
            .then((updates) => {
              const result = { ...mArgs, ...updates };
              if (context) {
                const keys = Object.keys(context) as (keyof C)[];
                keys.forEach((key) => delete result[key]);
              }
              return result as R;
            });
        }
        return args;
      }, reject);
    }
    return t;
  }
}
