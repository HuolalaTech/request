import { toDataString } from "./toDataString";

export const buildFormData = (
  data?: Record<string, any> | FormData
): FormData => {
  if (data instanceof FormData) return data;
  const fd = new FormData();
  if (!data) return fd;
  Object.keys(data).forEach((key) =>
    [].concat(data[key]).forEach((value) => fd.append(key, toDataString(value)))
  );
  return fd;
};
