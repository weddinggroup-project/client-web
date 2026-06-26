import { describe, expect, it } from "vitest";
import { z } from "zod";
import { AppError } from "@/lib/errors/app-error";
import { validate } from "./validate";

const schema = z.object({ name: z.string().min(2) });

describe("validate", () => {
  it("returns parsed data", () => {
    expect(validate(schema, { name: "Gani" })).toEqual({ name: "Gani" });
  });

  it("throws an AppError for invalid input", () => {
    expect(() => validate(schema, { name: "G" })).toThrow(AppError);
  });
});
