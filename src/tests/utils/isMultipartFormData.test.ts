import { isMultipartFormData } from "../../utils/isMultipartFormData";

test("basic", () => {
  expect(isMultipartFormData("multipart/form-data")).toBeTruthy();
  expect(
    isMultipartFormData("multipart/form-data; boundary=---zzzzzzzzz")
  ).toBeTruthy();
  expect(isMultipartFormData("wtf")).toBeFalsy();
});

test("undefined", () => {
  expect(isMultipartFormData()).toBeFalsy();
});
