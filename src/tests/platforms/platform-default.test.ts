import { request } from "../..";
import { PlatformError } from "../../errors";

Object(global).XMLHttpRequest = null;

test(`basic`, async () => {
  expect(request({ method: "GET", url: "/test" })).rejects.toBeInstanceOf(
    PlatformError
  );
});
