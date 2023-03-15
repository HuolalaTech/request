import { requestWithWx } from '../requestWithWx';
import { requestWithMy } from '../requestWithMy';
import { requestWithSwan } from '../requestWithSwan';

import './libs/mock-wx';
import './libs/mock-my';
import './libs/mock-swan';

describe('all libs tests', () => {
  for (const [name, request] of [
    ['wx', requestWithWx],
    ['my', requestWithMy],
    ['swan', requestWithSwan],
  ] as const) {
    test(`[${name}] fail`, async () => {
      const res = request({
        method: 'GET',
        url: '/test',
        headers: { code: '123', msg: 'hehe' },
      });
      expect(res).rejects.toMatchObject({
        code: 123,
        message: 'hehe',
      });
    });
  }
});
