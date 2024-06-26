import { request } from '../..';
// Kuaishou has just copied wx's base code and has the 'wx' variable left...
import '../libs/mock-wx';
import '../libs/mock-ks';
import { requestWithKs } from '../../requestWithKs';
import { requestWithWx } from '../../requestWithWx';

Object.defineProperty(global, 'XMLHttpRequest', { configurable: true, value: null });
Object.defineProperty(global, 'document', { configurable: true, value: null });

jest.mock('../../requestWithKs', () => ({ requestWithKs: jest.fn() }))
jest.mock('../../requestWithWx', () => ({ requestWithWx: jest.fn() }))

test('look for `ks` object ahead of `wx`', async () => {

  await request({ method: 'GET', url: '/test' })
  expect(requestWithKs).toHaveBeenCalledTimes(1);
  expect(requestWithWx).not.toHaveBeenCalled()

})

test(`basic`, async () => {
  expect(request({ method: 'GET', url: '/test' })).resolves.not.toBeNull();
});
