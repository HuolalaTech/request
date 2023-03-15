import { request } from '../..';
import '../libs/mock-my';

Object(global).XMLHttpRequest = null;

test(`basic`, async () => {
  expect(request({ method: 'GET', url: '/test' })).resolves.not.toBeNull();
});
