import { ContentError } from "../errors";
import { requestWithXhr } from "../requestWithXhr";

import "./libs/mock-xhr";

test(`[xhr] bad json`, async () => {
  const res = requestWithXhr({
    method: "GET",
    url: "/test",
    headers: {
      "response-body": "bad json",
    },
  });
  expect(res).rejects.toBeInstanceOf(SyntaxError);
});

test(`[xhr] content error`, async () => {
  const res = requestWithXhr({
    method: "POST",
    url: "/test",
    headers: {
      "content-type": "application/json",
    },
    files: { f1: new Blob() },
  });
  expect(res).rejects.toBeInstanceOf(ContentError);
});

test(`[xhr] send with json`, async () => {
  const res = requestWithXhr({
    method: "POST",
    url: "/test",
    headers: {
      "content-type": "application/json",
    },
    data: { a: 1 },
  });
  expect(res).resolves.toMatchObject({
    data: {
      data: { a: 1 },
      files: {},
      headers: { "content-type": "application/json" },
      method: "POST",
      url: "/test",
    },
    headers: { server: "mock" },
    statusCode: 200,
  });
});

test(`[xhr] send with form`, async () => {
  const res = requestWithXhr({
    method: "POST",
    url: "/test",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    data: { a: 1 },
  });
  expect(res).resolves.toMatchObject({
    data: {
      data: "a=1",
      files: {},
      headers: { "content-type": "application/x-www-form-urlencoded" },
      method: "POST",
      url: "/test",
    },
    headers: { server: "mock" },
    statusCode: 200,
  });
});

test(`[xhr] send with multipart`, async () => {
  const res = requestWithXhr({
    method: "POST",
    url: "/test",
    headers: {
      "content-type": "multipart/form-data",
    },
    data: { a: 1 },
  });
  expect(res).resolves.toMatchObject({
    data: {
      data: { a: "1" },
      files: {},
      headers: { "content-type": "multipart/form-data" },
      method: "POST",
      url: "/test",
    },
    headers: { server: "mock" },
    statusCode: 200,
  });
});
