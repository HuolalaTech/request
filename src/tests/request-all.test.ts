import { requestWithXhr } from '../requestWithXhr';
import { requestWithWx } from '../requestWithWx';
import { requestWithMy } from '../requestWithMy';
import { requestWithSwan } from '../requestWithSwan';
import { TextDecoder } from 'util';

import './libs/mock-xhr';
import './libs/mock-wx';
import './libs/mock-my';
import './libs/mock-tt';
import './libs/mock-swan';
import { requestWithTt } from '../requestWithTt';

describe('all libs tests', () => {
  for (const [name, request] of [
    ['xhr', requestWithXhr],
    ['wx', requestWithWx],
    ['my', requestWithMy],
    ['tt', requestWithTt],
    ['swan', requestWithSwan],
  ] as const) {
    test(`[${name}] basic`, async () => {
      const res = await request({
        method: 'GET',
        url: '/test',
        headers: { a: '1', b: '2' },
        timeout: 100,
      });
      expect(res).toMatchObject({
        data: {
          method: 'GET',
          url: '/test',
          headers: { a: '1', b: '2' },
          timeout: 100,
        },
        headers: { server: 'mock' },
        statusCode: 200,
      });
    });

    test(`[${name}] post`, async () => {
      const res = await request({
        method: 'POST',
        url: '/test',
        data: { a: '1', b: '2' },
      });
      expect(res).toMatchObject({
        data: {
          method: 'POST',
          url: '/test',
          data: { a: '1', b: '2' },
        },
        headers: { server: 'mock' },
        statusCode: 200,
      });
    });

    test(`[${name}] files`, async () => {
      const f1 = new Blob(['abc'], { type: 'text/plain' });
      const res = await request({
        method: 'POST',
        url: '/test',
        data: { a: '1', b: '2' },
        files: { f1 },
      });
      expect(res).toMatchObject({
        data: {
          method: 'POST',
          url: '/test',
          data: { a: '1', b: '2' },
          files: { f1: 'data:text/plain;base64,YWJj' },
        },
        headers: { server: 'mock' },
        statusCode: 200,
      });
    });

    test(`[${name}] 500`, async () => {
      const res = await request({
        method: 'GET',
        url: '/test',
        headers: {
          'status-code': '500',
        },
      });
      expect(res).toMatchObject({
        data: {
          method: 'GET',
          url: '/test',
        },
        headers: { server: 'mock' },
        statusCode: 500,
      });
    });

    test(`[${name}] responseType=arraybuffer`, async () => {
      const params = { method: 'GET', url: '/test' };
      const res = await request<ArrayBuffer>({ ...params, responseType: 'arraybuffer' });
      const raw = new TextDecoder().decode(res.data);
      expect(JSON.parse(raw)).toMatchObject(params);
    });

    test(`[${name}] responseType=text`, async () => {
      const params = { method: 'GET', url: '/test' };
      const res = await request<string>({ ...params, responseType: 'text' });
      expect(JSON.parse(res.data)).toMatchObject(params);
    });

    test(`[${name}] responseType=json`, async () => {
      const params = { method: 'GET', url: '/test' };
      const res = await request({ ...params, responseType: 'json' });
      expect(res.data).toMatchObject(params);
    });

    test(`[${name}] onUploadProgress`, async () => {
      const onUploadProgress = jest.fn();
      await request({ method: 'POST', url: '/test', onUploadProgress, files: { a: 'aa' } });
      expect(onUploadProgress).toHaveBeenCalledTimes(1);
      expect(onUploadProgress).toHaveBeenNthCalledWith(1, { total: 1000, loaded: 1000 });
    });

    test(`[${name}] GET method take data`, async () => {
      const params = { method: 'GET', url: '/test', data: { a: 1, b: 2, c: [1, 2] } };
      const res = await request<string>({ ...params });
      expect(res.data).toMatchObject({
        method: 'GET',
        url: '/test?a=1&b=2&c=1&c=2',
      });
    });

    test(`[${name}] HEAD method take data`, async () => {
      const params = { method: 'HEAD', url: '/test?x=1', data: { a: 1, b: 2, c: [1, 2] } };
      const res = await request<string>({ ...params });
      expect(res.data).toMatchObject({
        method: 'HEAD',
        url: '/test?x=1&a=1&b=2&c=1&c=2',
      });
    });
  }
});
