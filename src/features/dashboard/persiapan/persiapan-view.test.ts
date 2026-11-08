import { describe, expect, it } from "vitest";
import type { EventSession } from "@/lib/vowly/types";
import { durationMinutes, groupSessions } from "./persiapan-view";

const session = (phase: string, start: string, end: string): EventSession => ({
  id: `${phase}${start}`, name: "s", phase, start_time: start, end_time: end, location: "", category: "", priority: "sedang", pic_name: "", notes: null, sort_order: 0, vendor_ids: [],
});

describe("durationMinutes", () => {
  it("computes minutes between HH:MM values", () => {
    expect(durationMinutes("08:00", "10:30")).toBe(150);
    expect(durationMinutes("10:00", "09:00")).toBe(0);
    expect(durationMinutes("x", "09:00")).toBe(0);
  });
});

describe("groupSessions", () => {
  it("groups by phase in first-seen order and spans their times", () => {
    const groups = groupSessions([session("Pagi", "08:00", "09:00"), session("", "10:00", "11:00"), session("Pagi", "09:15", "10:00")]);
    expect(groups.map((group) => group.phase)).toEqual(["Pagi", "Rundown Acara"]);
    expect(groups[0]).toMatchObject({ start: "08:00", end: "10:00" });
    expect(groups[0]?.sessions).toHaveLength(2);
  });
});
