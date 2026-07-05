import { describe, expect, it } from "vitest";
import { join } from "node:path";
import {
  readCertificationPackage,
  validateCertificationPackageDirectory,
  computeReadinessScore,
} from "../src/index.js";

const FIXTURE_PATH = join(process.cwd(), "examples/fixtures/demo-tenant-certification");

describe("external fixture proof (non-factory-core tenant)", () => {
  it("validates demo-tenant fixture directory", () => {
    const result = validateCertificationPackageDirectory(FIXTURE_PATH);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.package?.tenantId).toBe("demo-tenant");
    expect(result.package?.tenantId).not.toBe("factory-core");
  });

  it("reads fixture and scores as import-eligible", () => {
    const pkg = readCertificationPackage(FIXTURE_PATH);
    const readiness = computeReadinessScore(pkg);

    expect(pkg.manifest.tenantId).toBe("demo-tenant");
    expect(readiness.score).toBeGreaterThanOrEqual(70);
    expect(readiness.importEligible).toBe(true);
  });
});
