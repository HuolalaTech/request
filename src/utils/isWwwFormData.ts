export const isWwwFormData = (s?: string) => (s ? /\bapplication\/x-www-form-urlencoded\b/i.test(s) : false);
