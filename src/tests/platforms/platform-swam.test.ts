import { request } from '../..';
import '../libs/mock-swan';

Object.defineProperty(global, 'document', { configurable: true, value: null });

test(`basic`, async () => {
  expect(request({ method: 'GET', url: '/test' })).resolves.not.toBeNull();
});
