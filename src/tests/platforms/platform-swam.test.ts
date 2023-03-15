import { request } from '../..';
import '../libs/mock-swan';

Object(global).XMLHttpRequest = null;

test(`basic`, async () => {
  expect(request({ method: 'GET', url: '/test' })).resolves.not.toBeNull();
});
