export const isMultipartFormData = (s?: string) =>
  s ? /\bmultipart\/form-data\b/i.test(s) : false;
