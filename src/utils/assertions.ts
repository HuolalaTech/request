export function assertNotNull<T>(u: T | null): asserts u is T {
  if (u === null) throw new TypeError('variable must not be null here');
}
