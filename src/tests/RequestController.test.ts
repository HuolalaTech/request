import { RequestController } from '../RequestController';

test('double abort', () => {
  const rc = new RequestController();
  const handler = jest.fn();
  rc.signal.addEventListener('abort', handler);
  rc.abort();
  rc.abort();
  expect(handler).toBeCalledTimes(1);
});

test('event', () => {
  const rc = new RequestController();
  const handler = jest.fn((e: Event) => {
    expect(e.type).toBe('abort');
    expect(rc.signal.aborted).toBeTruthy();
    expect(rc.signal.reason).toBeInstanceOf(Error);
  });
  rc.signal.addEventListener('abort', handler);
  rc.abort();
  expect(handler).toBeCalledTimes(1);
});

test('onabort', () => {
  const rc = new RequestController();
  const handler = jest.fn();
  rc.signal.onabort = handler;
  rc.abort();
  expect(handler).toBeCalledTimes(1);
});

test('remove', () => {
  const rc = new RequestController();
  const handler = jest.fn();
  rc.signal.addEventListener('abort', handler);
  rc.signal.removeEventListener('abort', handler);
  rc.abort();
  expect(handler).toBeCalledTimes(0);
});

test('throwIfAborted', () => {
  const rc = new RequestController();
  const { signal } = rc;
  signal.throwIfAborted();
  rc.abort();
  expect(() => {
    signal.throwIfAborted();
  }).toThrowError();
});
