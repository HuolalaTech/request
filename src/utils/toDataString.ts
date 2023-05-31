export const toDataString = (s: unknown) => {
  switch (typeof s) {
    case 'string':
      return s;

    // Convert to string directly, because a `BigInt` type cannot be serialized to a JSON.
    case 'bigint':
      return String(s);

    default:
      // If simply convert the `Date` to string using `JSON.stringify`, the result will be wrapped by double quotes.
      // Because stringify will call the toJSON method first, and stringify the string result as a JSON string,
      // as we as known, a JSON string is wrapped by double quotes.
      // Most Web frameworks cannot support that weird serialization for `Date` type.
      // Therefore, using the result of toJSON directly is the better solution.
      if (s instanceof Date) return s.toJSON();

      return JSON.stringify(s);
  }
};
