import { InvokeParams } from '../types/InvokeParams';
import { buildQs } from './builders';
import { assertNotNull } from './assertions';

export const fixInvokeParams = ({ ...args }: InvokeParams) => {
  const method = args.method.toUpperCase();

  // Convert method to upper case.
  args.method = method;

  // For GET or HEAD methods, mixin the data into the QS.
  // NOTE: Some MiniProgram platforms only support this feature in the GET method.
  //       Screw it, we will implement it in a better way.
  //
  if (method === 'GET' || method === 'HEAD') {
    const { url, data } = args;

    // Matcha a URL
    // Group 1: Origin & Path
    // Group 2: Query String
    // Group 3: Fragment (unused)
    const matches = url.match(/^(.*?)(\?.*?)?(#.*)?$/);

    // The above pattern can match any string and will never be null.
    assertNotNull(matches);

    const originAndPath = matches[1];
    const preservedQs = matches[2] || '';

    // Build qs from object.
    // NOTE: The behavior of qs buider here is different from some MiniProgram platforms.
    //       Some MiniProgram platforms simply convert values to JSON strings unless it was originally a string.
    //       Here, we consider more complex cases of
    //       1. For an array value, separate it as a form of multiple value in single key.
    //       2. Undefined values will be ignored instead of being converted to "undefined" strings.
    //       3. Support specially for `BigInt` type, which cannot be serialized to a JSON by default.
    //       4. Support specially for `Date` type, which may be serialized to a string wrapped by a quote by default.
    //
    const appendingQs = buildQs(data);

    // Merge preservedQs and appendingQs.
    // NOTE: Some MiniProgram platforms cannot support multiple values in same key.
    //       For example:
    //       - url: "/path?a=1” data: { a: 2 }, which will be merged to "/path?a=2".
    //       - url: "/path?a=1&a=2” data: {}, which will be merged to "path?a=2".
    //       Obviously, this is NOT a smart implementation.
    //       Although there is no definitive standard for the multiple values in single key,
    //       but most Web frameworks such as Java Spring Framework define this usage to transfer an array of arguments.
    //       Therefore, our implementation retains support for the multiple values in single key.
    //
    let qs = preservedQs;
    if (appendingQs) {
      qs += (qs ? '&' : '?') + appendingQs;
    }

    args.url = originAndPath + qs;
    args.data = undefined;
  }

  return args;
};
