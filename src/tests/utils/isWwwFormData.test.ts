import { isWwwFormData } from "../../utils/isWwwFormData";

test("basic", () => {
  expect(isWwwFormData("application/x-www-form-urlencoded")).toBeTruthy();
  expect(
    isWwwFormData("application/x-www-form-urlencoded; charset=UTF-8")
  ).toBeTruthy();
  expect(isWwwFormData("wtf")).toBeFalsy();
});

test("undefined", () => {
  expect(isWwwFormData()).toBeFalsy();
});
