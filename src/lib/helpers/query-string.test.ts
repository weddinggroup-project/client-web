import { describe, expect, it } from "vitest";
import { createQueryString } from "./query-string";

describe("createQueryString", () => {
  it("serializes useful values and ignores empty ones", () => {
    expect(
      createQueryString({
        page: 2,
        active: true,
        search: "",
        category: ["web", "nextjs"],
        empty: null,
      }),
    ).toBe("page=2&active=true&category=web&category=nextjs");
  });
});
