import { describe, expect, it } from "vitest";
import { errorFromEnvelope, toQueryString } from "./client";
import { formatDate, formatRelative, formatRupiah, formatRupiahShort, initials, parseRupiah } from "./format";
import { hasSafeSegments, isAllowedBackendPath, isSameOrigin } from "./proxy-path";
import { landingPath, safeNext } from "./safe-next";
import { SESSION_COOKIE, sessionCookieOptions, tokenMaxAge } from "./session-cookie";

const jwt = (payload: object) => `h.${Buffer.from(JSON.stringify(payload)).toString("base64url")}.s`;

describe("isAllowedBackendPath", () => {
  it.each([
    [["invitations", "abc", "guests"], true],
    [["packages"], true],
    [[], false],
    [["..", "admin"], false],
    [["admin", "users"], false],
    [["auth", "login"], false],
    [["auth", "register"], false],
    [["auth", "change-password"], true],
    [["webhooks", "payments"], false],
    [["invitations", "a%2Fb"], false],
    [["a", "b", "c", "d", "e", "f", "g", "h", "i"], false],
  ])("%j -> %s", (segments, expected) => {
    expect(isAllowedBackendPath(segments)).toBe(expected);
  });
});

describe("isSameOrigin", () => {
  it("allows requests without Origin, rejects mismatches", () => {
    expect(isSameOrigin(null, "app.test")).toBe(true);
    expect(isSameOrigin("https://app.test", "app.test")).toBe(true);
    expect(isSameOrigin("https://evil.test", "app.test")).toBe(false);
    expect(isSameOrigin("not a url", "app.test")).toBe(false);
    expect(isSameOrigin("https://app.test", null)).toBe(false);
  });
});

describe("safeNext", () => {
  it.each([
    ["/dashboard/x", "/dashboard/x"],
    ["//evil.test", "/dashboard"],
    ["https://evil.test", "/dashboard"],
    ["/\\evil.test", "/dashboard"],
    ["/a\nb", "/dashboard"],
    [undefined, "/dashboard"],
  ])("%s -> %s", (input, expected) => {
    expect(safeNext(input)).toBe(expected);
  });
  it("uses the first of repeated params", () => {
    expect(safeNext(["/a", "/b"])).toBe("/a");
  });
});

describe("session cookie", () => {
  it("derives max age from exp and never goes negative", () => {
    expect(tokenMaxAge(jwt({ exp: 1_000_100 }), 1_000_000)).toBe(100);
    expect(tokenMaxAge(jwt({ exp: 10 }), 1_000_000)).toBe(0);
  });
  it("falls back to 24h for unreadable tokens", () => {
    expect(tokenMaxAge("garbage")).toBe(86_400);
    expect(tokenMaxAge(jwt({}))).toBe(86_400);
  });
  it("is httpOnly and lax", () => {
    expect(SESSION_COOKIE).toBe("vowly_token");
    expect(sessionCookieOptions(60, true)).toMatchObject({ httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 60 });
  });
});

describe("client helpers", () => {
  it("builds query strings without empty values", () => {
    expect(toQueryString({ page: 2, search: "", x: undefined, y: null, ok: true })).toBe("?page=2&ok=true");
    expect(toQueryString()).toBe("");
  });
  it("maps validation errors to fields", () => {
    const error = errorFromEnvelope({ status: "error", code: 422, message: "Data tidak valid", data: { errors: [{ field: "email", tag: "email", message: "email tidak valid" }] } }, 422);
    expect(error.status).toBe(422);
    expect(error.fields).toEqual({ email: "email tidak valid" });
    expect(errorFromEnvelope(null, 500).message).toMatch(/kesalahan/i);
  });
});

describe("format", () => {
  it("formats rupiah and parses typed amounts", () => {
    expect(formatRupiah(450_000_000)).toMatch(/450\.000\.000/);
    expect(formatRupiahShort(285_500_000)).toBe("Rp 285,5 jt");
    expect(parseRupiah("15.000.000")).toBe(15_000_000);
    expect(parseRupiah("Rp 1.500")).toBe(1500);
    expect(parseRupiah("")).toBeNaN();
    expect(parseRupiah("12,5")).toBeNaN();
  });
  it("formats calendar dates without timezone drift", () => {
    expect(formatDate("2026-11-26")).toBe("26 November 2026");
    expect(formatDate("2026-11-26T00:00:00Z")).toBe("26 November 2026");
    expect(formatDate(null)).toBe("-");
    expect(formatDate("nope")).toBe("-");
  });
  it("describes relative time", () => {
    const now = new Date("2026-11-08T10:00:00Z");
    expect(formatRelative("2026-11-08T09:59:50Z", now)).toBe("baru saja");
    expect(formatRelative("2026-11-08T08:00:00Z", now)).toMatch(/2 jam/);
  });
  it("builds initials", () => {
    expect(initials("Dimas Prasetyo")).toBe("DP");
    expect(initials("  ayu ")).toBe("A");
    expect(initials("")).toBe("?");
  });
});

describe("landingPath", () => {
  it("sends admins to /admin by default but honours an explicit return path", () => {
    expect(landingPath("admin", "/dashboard")).toBe("/admin");
    expect(landingPath("admin", "/dashboard/abc")).toBe("/dashboard/abc");
    expect(landingPath("user", "/dashboard")).toBe("/dashboard");
  });
});

describe("hasSafeSegments", () => {
  it("accepts plain segments only", () => {
    expect(hasSafeSegments(["users", "123"])).toBe(true);
    expect(hasSafeSegments([])).toBe(false);
    expect(hasSafeSegments(["..", "x"])).toBe(false);
    expect(hasSafeSegments(["a%2Fb"])).toBe(false);
  });
});
