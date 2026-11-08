import { describe, expect, it } from "vitest";
import { missingRequired, type FieldDef } from "./form-modal";

const fields: FieldDef[] = [
  { kind: "text", name: "name", label: "Nama", required: true },
  { kind: "multi", name: "tags", label: "Tag", required: true, options: [] },
  { kind: "checkbox", name: "agree", label: "Setuju", required: true },
  { kind: "text", name: "note", label: "Catatan" },
];

describe("missingRequired", () => {
  it("flags empty required fields of every kind", () => {
    expect(missingRequired(fields, { name: "  ", tags: [], agree: false, note: "" })).toEqual({
      name: "Nama wajib diisi",
      tags: "Tag wajib diisi",
      agree: "Setuju wajib diisi",
    });
  });
  it("passes filled values", () => {
    expect(missingRequired(fields, { name: "Ayu", tags: ["a"], agree: true, note: "" })).toEqual({});
  });
});
