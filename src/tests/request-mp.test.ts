import { requestWithWx } from '../requestWithWx';
import { requestWithMy } from '../requestWithMy';
import { requestWithSwan } from '../requestWithSwan';

import './libs/mock-wx';
import './libs/mock-my';
import './libs/mock-swan';
import { MiniProgramError } from '../errors';
import { RequestController } from '../RequestController';

describe('all libs tests', () => {
  for (const [name, request] of [
    ['wx', requestWithWx],
    ['my', requestWithMy],
    ['swan', requestWithSwan],
  ] as const) {
    test(`[${name}] fail`, async () => {
      const params = { method: 'GET', url: '/test' };
      const res = request({ ...params, headers: { code: '123', msg: 'hehe' } });
      expect(res).rejects.toMatchObject({
        code: 123,
        message: 'hehe',
      });
    });

    test(`[${name}] responseType=blob`, async () => {
      const params = { method: 'GET', url: '/test' };
      const res = request({ ...params, responseType: 'blob' });
      expect(res).rejects.toThrowError(TypeError);
    });

    test(`[${name}] responseType=arraybuffer and files not emtpy`, async () => {
      const params = { method: 'GET', url: '/test', files: { f: 'hehe' } };
      const res = request({ ...params, responseType: 'arraybuffer' });
      expect(res).rejects.toThrowError(TypeError);
    });

    test(`[${name}] abort`, async () => {
      const controller = new RequestController();
      const req = request({ method: 'GET', url: '/test' }, controller);
      controller.abort();
      expect(req).rejects.toBeInstanceOf(MiniProgramError);
    });

    test(`[${name}] abort upload`, async () => {
      const controller = new RequestController();
      const req = request({ method: 'GET', url: '/test', files: { f1: 'hehe' } }, controller);
      controller.abort();
      expect(req).rejects.toBeInstanceOf(MiniProgramError);
    });
  }
});
