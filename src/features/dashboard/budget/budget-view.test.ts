import { describe, expect, it } from "vitest";
import { groupByCategory } from "./budget-view";

describe("groupByCategory", () => {
  it("sums per category, names blanks 'Lainnya', and sorts by estimate", () => {
    const rows = groupByCategory([
      { category: "Katering", estimated_amount: 100, actual_amount: 40 },
      { category: "", estimated_amount: 10, actual_amount: 5 },
      { category: "Katering", estimated_amount: 50, actual_amount: 10 },
      { category: "Venue", estimated_amount: 200, actual_amount: 200 },
    ]);
    expect(rows).toEqual([
      { category: "Venue", estimated: 200, actual: 200 },
      { category: "Katering", estimated: 150, actual: 50 },
      { category: "Lainnya", estimated: 10, actual: 5 },
    ]);
  });
  it("returns an empty list for no items", () => {
    expect(groupByCategory([])).toEqual([]);
  });
});
