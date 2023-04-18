import { request } from '../..';
import { PlatformError } from '../../errors';

Object.defineProperty(global, 'XMLHttpRequest', { configurable: true, value: null });

test(`basic`, async () => {
  expect(request({ method: 'GET', url: '/test' })).rejects.toBeInstanceOf(PlatformError);
});
