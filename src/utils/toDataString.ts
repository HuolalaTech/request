export const toDataString = (s: unknown) => {
  switch (typeof s) {
    case 'string':
      return s;
    case 'bigint':
      return String(s);
    default:
      if (s instanceof Date) return s.toJSON();
      return JSON.stringify(s);
  }
};
