console.error = jest.fn();

Object.defineProperties(global, {
  window: { configurable: true, value: void 0 },
  "54f09acea52941258aca926266ecf866": {
    configurable: true,
    enumerable: true,
    value: true,
  },
});

import { request } from "..";
import "./libs/mock-xhr";

test(`basic`, async () => {
  await request({ method: "GET", url: "/" });
  expect(console.error).toBeCalledTimes(1);
});
