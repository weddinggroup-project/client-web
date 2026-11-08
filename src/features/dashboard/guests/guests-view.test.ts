import { describe, expect, it } from "vitest";
import { rsvpTotals } from "./guests-view";

describe("rsvpTotals", () => {
  it("counts entries and pax per RSVP status", () => {
    const totals = rsvpTotals([
      { rsvp_status: "hadir", pax: 2 },
      { rsvp_status: "hadir", pax: 1 },
      { rsvp_status: "belum_respons", pax: 3 },
      { rsvp_status: "tidak_hadir", pax: 1 },
    ]);
    expect(totals.all).toEqual({ count: 4, pax: 7 });
    expect(totals.hadir).toEqual({ count: 2, pax: 3 });
    expect(totals.belum_respons.pax).toBe(3);
    expect(totals.tidak_hadir.count).toBe(1);
  });
  it("is zero for an empty list", () => {
    expect(rsvpTotals([]).all).toEqual({ count: 0, pax: 0 });
  });
});
