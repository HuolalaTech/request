export const isApplicationJson = (s?: string) =>
  s ? /\bapplication\/json\b/i.test(s) : false;
