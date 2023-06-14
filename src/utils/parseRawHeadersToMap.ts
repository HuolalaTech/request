const parseAndForEach = (headers: string, callback: (key: string, value: string) => void) => {
  // The raw headers data is represented line by line, so it is most appropriate to use the "m" in the RegExp.
  // Group 1: header name
  // Group 2: header value
  for (const pattern = /^(.*?): (.*)$/gm; ; ) {
    const matches = pattern.exec(headers);
    if (!matches) break;
    callback(matches[1], matches[2]);
  }
};

/**
 * Convert raw headers string to a `Record<string, string>`.
 *
 * NOTE: All header name will convert to lower-case.
 *
 * NOTE: If multiple values in single key, this method will retains the latest.
 *
 * @param headers a string that returned from `xhr.getAllResponseHeaders()`
 */
export const parseRawHeadersToMap = (headers: string) => {
  const map: Record<string, string> = Object.create(null);
  parseAndForEach(headers, (k, v) => (map[k.toLocaleLowerCase()] = v));
  return map;
};
