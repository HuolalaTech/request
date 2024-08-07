import { CONTENT_TYPE, APPLICATION_JSON, MULTIPART_FORM_DATA, WWW_FORM_URLENCODED } from '../constants';

type MultiCases<T extends string> = T | Lowercase<T> | Uppercase<T>;

const createMediaTypePredicate = <T extends string>(ct: T) => {
  /**
   * @see https://datatracker.ietf.org/doc/html/rfc7231#section-3.1.1.1
   * media-type = type "/" subtype *( OWS ";" OWS parameter )
   * type = token
   * subtype = token
   * parameter = token "=" ( token / quoted-string )
   *
   * NOTE: The type, subtype, and parameter name tokens are case-insensitive.
   */
  type AndParameter<T extends string> = `${T}; ${string}`;
  const pattern = new RegExp(`^${ct}(?:\\s*;|$)`, 'i');
  // Infact, this pattern only tests the input with the "i" flag, and does not completely match the type declaration.
  // Nevertheless, a stricter type constraint is preferable to the default "string" type.
  return RegExp.prototype.test.bind(pattern) as (s: string) => s is MultiCases<T> | MultiCases<AndParameter<T>>;
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
export const isContentType = RegExp.prototype.test.bind(new RegExp(`^${CONTENT_TYPE}$`, 'i')) as (
  s: string,
) => s is MultiCases<typeof CONTENT_TYPE>;

export const isRecord = (u: unknown): u is Record<PropertyKey, unknown> => typeof u === 'object' && u !== null;

export const isArray = (u: unknown): u is unknown[] => Object.prototype.toString.call(u) === '[object Array]';

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
