import { request } from '../..';
import '../libs/mock-my';

Object.defineProperty(global, 'XMLHttpRequest', { configurable: true, value: null });
Object.defineProperty(global, 'document', { configurable: true, value: null });

test(`basic`, async () => {
  expect(request({ method: 'GET', url: '/test' })).resolves.not.toBeNull();
});
