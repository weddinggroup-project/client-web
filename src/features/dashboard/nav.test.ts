import { describe, expect, it } from "vitest";
import { countdownLabel, isActive, navSections, projectHref } from "./nav";

describe("nav", () => {
  it("builds project hrefs", () => {
    expect(projectHref("p1", "")).toBe("/dashboard/p1");
    expect(projectHref("p1", "budget")).toBe("/dashboard/p1/budget");
  });
  it("matches Home only on the exact root and other items on sub-paths", () => {
    expect(isActive("/dashboard/p1", "p1", "")).toBe(true);
    expect(isActive("/dashboard/p1/budget", "p1", "")).toBe(false);
    expect(isActive("/dashboard/p1/budget", "p1", "budget")).toBe(true);
    expect(isActive("/dashboard/p1/budget/x", "p1", "budget")).toBe(true);
    expect(isActive("/dashboard/p1/budgets", "p1", "budget")).toBe(false);
  });
  it("has unique slugs", () => {
    const slugs = navSections.flatMap((section) => section.items.map((item) => item.slug));
    expect(new Set(slugs).size).toBe(slugs.length);
  });
  it("writes the header pill", () => {
    expect(countdownLabel("A & B", 12)).toBe("A & B • 12 Hari Menuju Akad & Resepsi");
    expect(countdownLabel("A & B", 0)).toMatch(/hari bahagia/i);
    expect(countdownLabel("A & B", -3)).toMatch(/berlalu/);
    expect(countdownLabel("A & B", null)).toBe("A & B");
  });
});
