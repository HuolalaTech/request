import { makeArray } from './makeArray';
import { isRecord } from './predicates';
import { toDataString } from './toDataString';

export const buildFormData = (data?: unknown | FormData): FormData => {
  if (data instanceof FormData) return data;

  const fd = new FormData();

  if (isRecord(data)) {
    Object.keys(data).forEach((key) => {
      // If a top-level value is an array, append multiple times to the same key.
      makeArray(data[key])
        .filter((value) => value !== undefined) // Ignore undefiend values
        .forEach((value) => fd.append(key, toDataString(value)));
    });
  }

  return fd;
};
