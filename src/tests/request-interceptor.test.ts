import { request, interceptors } from "..";
import { InvokeContext } from "../types/InvokeContext";
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
    method: "GET",
    url: "/test",
  };
  const wtfArgs = { wtf: "hehe", ...args };

  interceptors.request.use(addReqWtf);
  interceptors.response.use(addResWtf);
  const res = await request(wtfArgs);
  interceptors.request.eject(addReqWtf);
  interceptors.response.eject(addResWtf);

  expect(res).toMatchObject({
    data: {
      ...args,
      headers: { wtf: "hehe" },
    },
    headers: { server: "mock", wtf: "hehe" },
    statusCode: 200,
  });
});
