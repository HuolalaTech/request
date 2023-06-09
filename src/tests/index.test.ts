import './libs/mock-xhr';
import { FailedToRequest, request } from '..';

type IsAny<T> = 0 extends 1 & T ? true : false;
type IsUnknown<T> = unknown extends T ? true : false;

test('types', async () => {
  const { data, headers, statusCode } = await request({ method: 'GET', url: '' });

  const isAny: IsAny<typeof data> = false;
  expect(isAny).toBeFalsy();

  const isUnknown: IsUnknown<typeof data> = true;
  expect(isUnknown).toBeTruthy();

  // Assert string type
  const mock: string = headers['server'];
  expect(mock).toBe('mock');

  // Assert number type
  const status: number = statusCode;
  expect(status).toBe(200);

  // responseType supports empty string
  request({ method: 'GET', url: '', responseType: '' });

  // responseType supports undefined
  request({ method: 'GET', url: '', responseType: undefined });

  // responseType supports XMLHttpRequestResponseType
  request({ method: 'GET', url: '', responseType: '' as XMLHttpRequestResponseType });
});

test('blob', async () => {
  const { data } = await request({ method: 'GET', url: '', responseType: 'blob' });
  const isBlob: Blob = data;
  expect(isBlob).toBeInstanceOf(Blob);
});

test('arraybuffer', async () => {
  const { data } = await request({ method: 'GET', url: '', responseType: 'arraybuffer' });
  const isArrayBuffer: ArrayBuffer = data;
  expect(isArrayBuffer.constructor.name).toBe('ArrayBuffer');
});

test('text', async () => {
  const { data } = await request({ method: 'GET', url: '', responseType: 'text' });
  const isString: string = data;
  expect(typeof isString).toBe('string');
});

test('abort', async () => {
  const a = new AbortController();
  const req = request({ method: 'GET', url: '', responseType: 'text', signal: a.signal });
  a.abort();
  expect(req).rejects.toBeInstanceOf(FailedToRequest);
});
