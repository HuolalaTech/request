export const isValidMPO = (obj: unknown): boolean => {
  try {
    if (!obj) return false;
    const { request, canIUse } = Object(obj);
    if (typeof request !== 'function') return false;
    if (typeof canIUse !== 'function') return false;
    const ok = canIUse.call(obj, 'request');
    if (typeof ok !== 'boolean') return false;
    return ok;
  } catch (error) {
    return false;
  }
};
