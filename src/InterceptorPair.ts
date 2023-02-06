import { Interceptor } from "./Interceptor";

export interface InterceptorPair<A, R> {
  request: Interceptor<A>;
  response: Interceptor<R>;
}

export const setupInterceptorPair = <A, R>(
  pair: InterceptorPair<A, R>,
  func: (a: A) => Promise<R>
) => {
  const { request, response } = pair;
  return (args: A) =>
    Interceptor.wrap<R>(
      response,
      Interceptor.wrap(request, Promise.resolve(args)).then(func)
    );
};
