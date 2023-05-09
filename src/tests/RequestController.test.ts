import { RequestController } from '../RequestController';

test('double abort', () => {
  const rc = new RequestController();
  const handler = jest.fn();
  rc.abort = handler;
  rc.abort();
  rc.abort();
  expect(handler).toBeCalledTimes(1);
});

test('set handler after an abort', () => {
  const rc = new RequestController();
  rc.abort();
  const handler = jest.fn();
  rc.abort = handler;
  expect(handler).toBeCalledTimes(1);
});
