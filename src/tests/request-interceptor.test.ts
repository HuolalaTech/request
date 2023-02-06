import { request, interceptors } from "../request";
import { InvokeParams } from "../types/InvokeParams";
import { InvokeResult } from "../types/InvokeResult";
import "./libs/mock-xhr";

test(`request`, async () => {
  const addHeaderC = (args: InvokeParams) => {
    args.headers = { ...Object(args.headers), a: "2", b: "3" };
  };

  const args = {
    method: "GET",
    url: "/test",
    headers: { a: "1", b: "2" },
  };

  interceptors.request.use(addHeaderC);
  const res = await request(args);
  interceptors.request.eject(addHeaderC);

  expect(res).toMatchObject({
    data: {
      ...args,
      headers: { a: "2", b: "3" },
    },
    headers: { server: "mock" },
    statusCode: 200,
  });

  const res2 = await request(args);

  expect(res2).toMatchObject({
    data: {
      ...args,
      headers: { a: "1", b: "2" },
    },
    headers: { server: "mock" },
    statusCode: 200,
  });
});

test(`response`, async () => {
  const addHeaderC = (args: InvokeResult) => {
    args.statusCode = 500;
  };

  const args = {
    method: "GET",
    url: "/test",
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
