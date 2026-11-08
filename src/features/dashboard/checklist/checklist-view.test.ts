import { describe, expect, it } from "vitest";
import type { ChecklistItem } from "@/lib/vowly/types";
import { groupByPhase } from "./checklist-view";

const task = (phase: string, status: ChecklistItem["status"]): ChecklistItem => ({
  id: `${phase}-${status}-${Math.random()}`,
  title: "t",
  phase,
  category: "",
  pic_name: "",
  priority: "sedang",
  status,
  due_date: null,
  cost_amount: null,
  budget_item_id: null,
  notes: null,
});

describe("groupByPhase", () => {
  it("orders phases alphabetically, puts blank phases last, and counts finished tasks", () => {
    const groups = groupByPhase([task("Fase 2", "selesai"), task("", "belum_mulai"), task("Fase 1", "selesai"), task("Fase 2", "belum_mulai")]);
    expect(groups.map((group) => group.phase)).toEqual(["Fase 1", "Fase 2", "Tanpa Fase"]);
    expect(groups[1]).toMatchObject({ done: 1 });
    expect(groups[1]?.items).toHaveLength(2);
  });
  it("is empty for no tasks", () => {
    expect(groupByPhase([])).toEqual([]);
  });
});
