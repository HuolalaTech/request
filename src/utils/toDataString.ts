export const toDataString = (s?: unknown) => {
  if (typeof s === "string") return s;
  if (s instanceof Date) return s.toJSON();
  return JSON.stringify(s);
};
