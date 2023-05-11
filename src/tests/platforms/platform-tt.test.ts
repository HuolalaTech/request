import { request } from '../..';
import '../libs/mock-tt';

Object.defineProperty(global, 'document', { configurable: true, value: null });

test(`basic`, async () => {
  expect(request({ method: 'GET', url: '/test' })).resolves.not.toBeNull();
});
