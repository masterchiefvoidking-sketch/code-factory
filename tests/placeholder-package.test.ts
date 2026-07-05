import { describe, expect, it } from "vitest";
import {
  createEmptyCertificationPackage,
  scoreCertificationPackage,
  validateCertificationPackage,
} from "../src/index.js";

describe("createEmptyCertificationPackage placeholder defaults", () => {
  it("creates intentionally incomplete draft package", () => {
    const pkg = createEmptyCertificationPackage({ tenantId: "new-tenant" });

    expect(pkg.manifest.status).toBe("draft");
    expect(pkg.manifest.version).toBe("0.0.0");
    expect(pkg.audit.auditor).toBe("pending");
    expect(pkg.audit.verdict).toBe("conditional");
    expect(pkg.health.status).toBe("unknown");
    expect(pkg.health.score).toBe(0);
    expect(pkg.qualification.status).toBe("unqualified");
    expect(pkg.qualification.score).toBe(0);
    expect(pkg.report.content).toContain("Draft package");
  });

  it("is not production-ready (schema and scoring fail with default placeholders)", () => {
    const pkg = createEmptyCertificationPackage({ tenantId: "new-tenant" });

    const validation = validateCertificationPackage(pkg);
    expect(validation.valid).toBe(false);
    expect(validation.errors.some((e) => e.includes("mission"))).toBe(true);

    const score = scoreCertificationPackage(pkg);
    expect(score.overallPassing).toBe(false);
    expect(score.readiness.importEligible).toBe(false);
    expect(score.auditPassing).toBe(false);
    expect(score.qualificationPassing).toBe(false);
  });

  it("remains non-production-ready even when mission is provided", () => {
    const pkg = createEmptyCertificationPackage({
      tenantId: "new-tenant",
      mission: "Draft tenant — fill in certification details.",
    });

    const validation = validateCertificationPackage(pkg);
    expect(validation.valid).toBe(true);

    const score = scoreCertificationPackage(pkg);
    expect(score.overallPassing).toBe(false);
    expect(score.readiness.importEligible).toBe(false);
  });
});
