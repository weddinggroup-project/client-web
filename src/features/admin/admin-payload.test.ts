import { describe, expect, it } from "vitest";
import { dateToInstant, parseFeatures, userPayload, voucherPayload } from "./admin-payload";

describe("parseFeatures", () => {
  it("splits lines, trims, and drops blanks", () => {
    expect(parseFeatures(" A \n\nB\n  \nC")).toEqual(["A", "B", "C"]);
    expect(parseFeatures("")).toEqual([]);
  });
});

describe("dateToInstant", () => {
  it("builds UTC instants for the start and end of a day", () => {
    expect(dateToInstant("2026-12-31", "start")).toBe("2026-12-31T00:00:00Z");
    expect(dateToInstant("2026-12-31", "end")).toBe("2026-12-31T23:59:59Z");
    expect(dateToInstant("", "start")).toBeUndefined();
    expect(dateToInstant("31/12/2026", "end")).toBeUndefined();
  });
});

describe("userPayload", () => {
  const values = { name: " Ayu ", email: "a@example.com", role: "user", password: "" };
  it("always sends the password on create", () => {
    expect(userPayload(values, "create")).toMatchObject({ name: "Ayu", password: "" });
  });
  it("omits an empty password on update and sends a new one", () => {
    expect(userPayload(values, "update")).not.toHaveProperty("password");
    expect(userPayload({ ...values, password: "rahasia1" }, "update")).toMatchObject({ password: "rahasia1" });
  });
});

describe("voucherPayload", () => {
  it("uppercases the code, parses numbers and dates, and skips empty optionals", () => {
    const body = voucherPayload({ code: "hemat5k", kind: "voucher", discount_type: "fixed", amount: "5.000", quota: "", valid_from: "2026-11-01", valid_until: "", is_active: true });
    expect(body).toEqual({ code: "HEMAT5K", kind: "voucher", discount_type: "fixed", amount: 5000, valid_from: "2026-11-01T00:00:00Z", is_active: true });
  });
  it("sends quota when set", () => {
    expect(voucherPayload({ code: "abc", kind: "referral", discount_type: "percent", amount: "10", quota: "50", valid_from: "", valid_until: "", is_active: false })).toMatchObject({ quota: 50, is_active: false });
  });
});
