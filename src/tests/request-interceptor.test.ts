import { CustomError } from '@huolala-tech/custom-error';
import { request, interceptors } from '..';
import { InvokeContext } from '../types/InvokeContext';
import { InvokeParams } from '../types/InvokeParams';
import { InvokeResult } from '../types/InvokeResult';
import './libs/mock-xhr';

test(`request`, async () => {
  const addHeaderC = (args: InvokeParams) => {
    args.headers = { ...Object(args.headers), a: '2', b: '3' };
  };

  const args = {
    method: 'GET',
    url: '/test',
    headers: { a: '1', b: '2' },
  };

  interceptors.request.use(addHeaderC);
  const res = await request(args);
  interceptors.request.eject(addHeaderC);

  expect(res).toMatchObject({
    data: {
      ...args,
      headers: { a: '2', b: '3' },
    },
    headers: { server: 'mock' },
    statusCode: 200,
  });

  const res2 = await request(args);

  expect(res2).toMatchObject({
    data: {
      ...args,
      headers: { a: '1', b: '2' },
    },
    headers: { server: 'mock' },
    statusCode: 200,
  });
});

test(`response`, async () => {
  const addHeaderC = (args: InvokeResult) => {
    args.statusCode = 500;
  };

  const args = {
    method: 'GET',
    url: '/test',
  };

  interceptors.response.use(addHeaderC);
  const res = await request(args);
  interceptors.response.eject(addHeaderC);

  expect(res).toMatchObject({
    data: args,
    statusCode: 500,
  });

  const res2 = await request(args);

  expect(res2).toMatchObject({
    data: args,
    statusCode: 200,
  });
});

test(`request extension fields`, async () => {
  const addReqWtf = (args: InvokeParams) => {
    const { headers, wtf } = args as InvokeParams & { wtf: string };
    args.headers = { wtf, ...headers };
  };
  const addResWtf = (args: InvokeResult & InvokeContext) => {
    const { headers, request } = args;
    const { wtf } = request as InvokeParams & { wtf: string };
    args.headers = { wtf, ...headers };
  };

  const args = {
    method: 'GET',
    url: '/test',
  };
  const wtfArgs = { wtf: 'hehe', ...args };

  interceptors.request.use(addReqWtf);
  interceptors.response.use(addResWtf);
  const res = await request(wtfArgs);
  interceptors.request.eject(addReqWtf);
  interceptors.response.eject(addResWtf);

  expect(res).toMatchObject({
    data: {
      ...args,
      headers: { wtf: 'hehe' },
    },
    headers: { server: 'mock', wtf: 'hehe' },
    statusCode: 200,
  });
});

test(`mock data`, async () => {
  class MockingThrowable extends CustomError {
    public readonly params: InvokeParams;
    constructor(params: InvokeParams) {
      super('never');
      this.params = params;
    }
  }

  const a = (params: InvokeParams) => {
    throw new MockingThrowable(params);
  };
  const b = (error: unknown) => {
    if (error instanceof MockingThrowable) {
      return { statusCode: 200, data: error.params.data, headers: { mock: 'true' } };
    }
    throw error;
  };

  interceptors.request.use(a);
  interceptors.response.use(null, b);

  const res = await request({ method: 'POST', url: '/', data: { a: 1 } });
  expect(res).toMatchObject({
    statusCode: 200,
    data: { a: 1 },
    headers: { mock: 'true' },
  });

  interceptors.request.eject(a);
  interceptors.response.eject(null, b);
});
