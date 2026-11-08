import { describe, expect, it } from "vitest";
import { profileCompleteness } from "./profil-view";

describe("profileCompleteness", () => {
  const full = { venue: "Gedung", city: "Jakarta", guestCount: 200, loveStory: "cerita", totalBudget: 1, members: 2, giftAccounts: 1 };
  it("is 100 when everything is filled", () => {
    expect(profileCompleteness(full)).toBe(100);
  });
  it("drops by one seventh per missing item", () => {
    expect(profileCompleteness({ ...full, loveStory: null })).toBe(86);
    expect(profileCompleteness({ venue: null, city: null, guestCount: null, loveStory: null, totalBudget: 0, members: 0, giftAccounts: 0 })).toBe(0);
  });
});
