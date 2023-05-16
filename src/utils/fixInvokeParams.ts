import { InvokeParams } from '../types/InvokeParams';
import { buildQs } from './QueryStringBuilder';
import { assertNotNull } from './assertions';

export const fixInvokeParams = ({ ...args }: InvokeParams) => {
  const method = args.method.toUpperCase();

  // Convert method to upper case.
  args.method = method;

  // For GET or HEAD methods, mixin the data into the QS.
  if (method === 'GET' || method === 'HEAD') {
    const { url, data } = args;

    const matches = url.match(/^(.*?)(\?.*?)?(#.*)?$/);
    // This pattern can match any string and will never be null.
    assertNotNull(matches);

    const solid = matches[1]; // scheme + path
    let query = matches[2] || ''; // query string
    // matches[3] is a fragment, drop it.

    const aqs = buildQs(data);
    if (aqs) query += (query ? '&' : '?') + aqs;

    args.url = solid + query;
    args.data = undefined;
  }

  return args;
};
