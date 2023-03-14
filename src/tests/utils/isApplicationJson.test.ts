import { isApplicationJson } from "../../utils/isApplicationJson";

test("basic", () => {
  expect(isApplicationJson("application/json")).toBeTruthy();
  expect(isApplicationJson("application/json; charset=UTF-8")).toBeTruthy();
  expect(isApplicationJson("wtf")).toBeFalsy();
});

test("undefined", () => {
  expect(isApplicationJson()).toBeFalsy();
});
