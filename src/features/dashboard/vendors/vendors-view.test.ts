import { describe, expect, it } from "vitest";
import { whatsappLink } from "./vendors-view";

describe("whatsappLink", () => {
  it("builds a wa.me link from a normalized number", () => {
    expect(whatsappLink("+6281200001110")).toBe("https://wa.me/6281200001110");
    expect(whatsappLink("+62 812-0000-1110")).toBe("https://wa.me/6281200001110");
  });
  it("returns null without a usable number", () => {
    expect(whatsappLink("")).toBeNull();
    expect(whatsappLink("123")).toBeNull();
  });
});
