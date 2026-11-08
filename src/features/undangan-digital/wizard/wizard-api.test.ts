import { describe, expect, it } from "vitest";
import { accessToPermissions, composeAddress, resumeStep, roleToApi, subdomainError } from "./wizard-api";

describe("accessToPermissions", () => {
  it("returns undefined when nothing is selected so the role default applies", () => {
    expect(accessToPermissions([])).toBeUndefined();
  });
  it("maps labels to modules and keeps write over read", () => {
    expect(accessToPermissions(["Manajemen Vendor", "Budget & Anggaran"])).toEqual({ vendors: "write", sessions: "read", budget: "write" });
    expect(accessToPermissions(["Tamu Undangan"])).toEqual({ guests: "write", deliveries: "write" });
  });
  it("ignores unknown labels", () => {
    expect(accessToPermissions(["???"])).toBeUndefined();
  });
});

describe("roleToApi", () => {
  it("maps partner to panitia_vendor", () => {
    expect(roleToApi("pasangan")).toBe("pasangan");
    expect(roleToApi("partner")).toBe("panitia_vendor");
  });
});

describe("composeAddress", () => {
  it("joins the parts and skips empty ones", () => {
    expect(composeAddress({ address: "Jl. Mawar 1", village: "Menteng", district: "Menteng", city: "Jakarta Pusat", province: "DKI Jakarta", postalCode: "10310" })).toBe(
      "Jl. Mawar 1, Kel. Menteng, Kec. Menteng, Jakarta Pusat, DKI Jakarta 10310",
    );
    expect(composeAddress({ address: "", village: "", district: "", city: "Bandung", province: "", postalCode: "" })).toBe("Bandung");
  });
  it("caps the length at 500", () => {
    expect(composeAddress({ address: "a".repeat(600), village: "", district: "", city: "", province: "", postalCode: "" })).toHaveLength(500);
  });
});

describe("subdomainError", () => {
  it("enforces length and charset", () => {
    expect(subdomainError("abc")).toMatch(/6 sampai 18/);
    expect(subdomainError("Ayu_Budi123")).toMatch(/huruf kecil/);
    expect(subdomainError("ayu-dan-budi")).toBeUndefined();
  });
});

describe("resumeStep", () => {
  it("continues where the project left off", () => {
    expect(resumeStep({ template_id: "t", venue: null })).toBe("summary");
    expect(resumeStep({ template_id: null, venue: "Gedung" })).toBe("template");
    expect(resumeStep({ template_id: null, venue: null })).toBe("location");
  });
});
