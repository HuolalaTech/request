import { requestWithXhr } from "../requestWithXhr";
import { requestWithWx } from "../requestWithWx";
import { requestWithMy } from "../requestWithMy";
import { requestWithSwan } from "../requestWithSwan";

import "./libs/mock-xhr";
import "./libs/mock-wx";
import "./libs/mock-my";
import "./libs/mock-swan";
import { BatchUploadError } from "../errors";

describe("all libs tests", () => {
  for (const [name, request] of [
    ["wx", requestWithWx],
    ["my", requestWithMy],
    ["swan", requestWithSwan],
  ] as const) {
    test(`[${name}] batch upload error`, async () => {
      const f1 = new Blob(["f1"], { type: "text/plain" });
      const f2 = new Blob(["f2"], { type: "text/plain" });
      const res = request({
        method: "POST",
        url: "/test",
        files: { f1, f2 },
      });
      expect(res).rejects.toBeInstanceOf(BatchUploadError);
    });
  }
});

test(`[xhr] batch upload not error`, async () => {
  const f1 = new Blob(["f1"], { type: "text/plain" });
  const f2 = new Blob(["f2"], { type: "text/plain" });
  const res = await requestWithXhr({
    method: "POST",
    url: "/test",
    files: { f1, f2 },
  });
  expect(res).toMatchObject({
    data: {
      data: {},
      files: {
        f1: "data:text/plain;base64,ZjE=",
        f2: "data:text/plain;base64,ZjI=",
      },
      headers: {},
      method: "POST",
      url: "/test",
    },
    headers: { server: "mock" },
    statusCode: 200,
  });
});
