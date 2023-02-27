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
   * Add an interceptor pairs.
   */
  use(
    onfulfilled: ResolveHandler<T, C> = null,
    onrejected: RejectHandler<T, C> = null
  ) {
    this.handlers.push([onfulfilled, onrejected]);
  }

  /**
   * Remove an interceptor pairs.
   */
  eject(
    onfulfilled: ResolveHandler<T, C> = null,
    onrejected: RejectHandler<T, C> = null
  ) {
    const { handlers } = this;
    // Locate specified handler pairs (strict matching) and remove them from the handlers array.
    for (let i = 0; i < handlers.length; i++) {
      if (handlers[i][0] === onfulfilled && handlers[i][1] === onrejected) {
        handlers.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  /**
   * Execute an interceptor as a pipeline.
   */
  static pipeline<R extends object, C>(
    interceptor: Interceptor<R, C>,
    task: Promise<R>,
    context?: C
  ) {
    // Reduce all handlers into a promise chains.
    const { handlers } = interceptor;
    let t = task;
    for (let i = 0; i < handlers.length; i++) {
      const [sHandler, fHander] = handlers[i];
      t = t.then(({ ...args }) => {
        // Nothing to do if the success handler is not provided.
        if (!sHandler) return args;
        // Combine the args and context into a new object.
        // The success handlers may need to access the context.
        const mArgs = { ...args, ...Object(context) } as R & C;
        return Promise.resolve(mArgs)
          .then(sHandler)
          .then((updates) => {
            // After the success hadnler executed, combine the parameter returned value into a new object.
            // The handler may return a new partial object that needs to be combined into the source object.
            const result = { ...mArgs, ...updates };
            // If the context is providied, exclude certain properties of context from the result object.
            // Because handler functions return a R type rather than R&C type, it is equivalent to excluding context from the result.
            if (context) {
              const keys = Object.keys(context) as (keyof C)[];
              keys.forEach((key) => delete result[key]);
            }
            return result as R;
          });
      }, fHander);
    }
    return t;
  }
}
