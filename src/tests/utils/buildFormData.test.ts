import { buildFormData } from "../../utils/buildFormData";

test("basic", () => {
  const fd = buildFormData({ a: 1, b: "two" });
  expect(fd.get("a")).toBe("1");
  expect(fd.get("b")).toBe("two");
});
