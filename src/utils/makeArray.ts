import { isArray } from './predicates';

/**
 * Convert T | T[] to T[]
 */
export const makeArray = <T>(maybeArray: T | T[]) => {
  const result: T[] = [];
  if (isArray(maybeArray)) {
    for (let i = 0; i < maybeArray.length; i++) {
      result.push(maybeArray[i]);
    }
  } else {
    result.push(maybeArray);
  }
  return result;
};
