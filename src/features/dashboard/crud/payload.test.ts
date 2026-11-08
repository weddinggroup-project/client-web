import { describe, expect, it } from "vitest";
import { initialText, integer, money, optionalText, text } from "./payload";

describe("payload helpers", () => {
  it("trims text", () => {
    expect(text({ a: "  x " }, "a")).toBe("x");
    expect(text({}, "a")).toBe("");
  });
  it("omits empty optional text on create but clears on update", () => {
    expect(optionalText({ a: "" }, "a", "create")).toBeUndefined();
    expect(optionalText({ a: "" }, "a", "update")).toBe("");
    expect(optionalText({ a: "v" }, "a", "create")).toBe("v");
  });
  it("parses money and leaves invalid input for the server to reject", () => {
    expect(money({ a: "1.500.000" }, "a")).toBe(1_500_000);
    expect(money({ a: "" }, "a")).toBe(0);
    expect(money({ a: "abc" }, "a")).toBeUndefined();
  });
  it("parses integers", () => {
    expect(integer({ a: "12" }, "a")).toBe(12);
    expect(integer({ a: "1.5" }, "a")).toBeUndefined();
    expect(integer({ a: "" }, "a")).toBeUndefined();
  });
  it("renders initial values", () => {
    expect(initialText(null)).toBe("");
    expect(initialText(0)).toBe("0");
  });
});
