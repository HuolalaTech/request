import './libs/mock-xhr';
import { create, request, interceptors } from '..';

interceptors.request.use((param) => {
  param.url = '/:joy:';
});

test('match global intercepters', async () => {
  const res = await request({ method: 'GET', url: '/hehe' });
  expect(res).toMatchObject({
    statusCode: 200,
    data: { method: 'GET', url: '/:joy:' },
  });
});

test('create (do not match global interceptors)', async () => {
  const { request } = create();
  const res = await request({ method: 'GET', url: '/hehe' });
  expect(res).toMatchObject({
    statusCode: 200,
    data: { method: 'GET', url: '/hehe' },
  });
});

test('create (use new interceptoers)', async () => {
  const { request, interceptors } = create();
  interceptors.request.use((param) => {
    param.url += '/haha';
  });
  const res = await request({ method: 'GET', url: '/hehe' });
  expect(res).toMatchObject({
    statusCode: 200,
    data: { method: 'GET', url: '/hehe/haha' },
  });
});
