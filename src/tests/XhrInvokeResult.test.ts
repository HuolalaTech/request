import { XhrInvokeResult } from '../XhrInvokeResult';
import './libs/mock-xhr';

test('write header', () => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/');
  xhr.send();
  const xi = new XhrInvokeResult(xhr);
  const customHeader = { a: '1' };
  xi.headers = customHeader;
  expect(xi.headers).toBe(customHeader);
});
