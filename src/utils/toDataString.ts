export const toDataString = (s?: unknown) =>
  typeof s === "string" ? s : JSON.stringify(s);
