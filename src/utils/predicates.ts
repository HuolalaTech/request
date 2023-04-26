import { APPLICATION_JSON, MULTIPART_FORM_DATA, WWW_FORM_URLENCODED } from '../constants';

const createMediaTypePredicate = (ct: string) => {
  /**
   * @see https://datatracker.ietf.org/doc/html/rfc7231#section-3.1.1.1
   * media-type = type "/" subtype *( OWS ";" OWS parameter )
   * type = token
   * subtype = token
   * parameter = token "=" ( token / quoted-string )
   * NOTE: The type, subtype, and parameter name tokens are case-insensitive.
   */
  const pattern = new RegExp(`^${ct}(?:\\s*;|$)`, 'i');
  return RegExp.prototype.test.bind(pattern);
};

/**
 * Detects a WWW_FORM_URLENCODED
 */
export const isWwwFormUrlEncoded = createMediaTypePredicate(WWW_FORM_URLENCODED);

/**
 * Detects a MULTIPART_FORM_DATA
 */
export const isMultipartFormData = createMediaTypePredicate(MULTIPART_FORM_DATA);

/**
 * Detects a APPLICATION_JSON
 */
export const isApplicationJson = createMediaTypePredicate(APPLICATION_JSON);

/**
 * Detects a Content-Type string case-insesitive
 */
export const isContentType = (key: string) => /^Content-Type$/i.test(key);

/**
 * Detects a MiniProgram runtime object
 */
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
