import { describe, expect, it } from "vitest";
import {
  validateTenantManifest,
  validateHealth,
  validateQualification,
  createFactoryEvent,
  createFactoryObject,
  createCitadelArchivePackage,
  validateCitadelArchivePackage,
  validatePackageLayout,
  checkTenantIdConsistency,
  detectFakeConnectedStatus,
  detectOwnershipOverlap,
  computeReadinessScore,
  readCertificationPackage,
  scoreCertificationPackage,
  validateCertificationPackageDirectory,
} from "../src/index.js";
import { join } from "node:path";

const validManifest = {
  schemaVersion: "1.0.0",
  tenantId: "demo-tenant",
  name: "Demo Tenant",
  version: "1.0.0",
  integrationMode: "standalone" as const,
  status: "active" as const,
  mission: "Demonstrate Factory integration.",
  createdAt: "2026-07-05T00:00:00.000Z",
  updatedAt: "2026-07-05T00:00:00.000Z",
};

describe("validateTenantManifest", () => {
  it("accepts a valid manifest", () => {
    const result = validateTenantManifest(validManifest);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects missing tenantId", () => {
    const result = validateTenantManifest({ ...validManifest, tenantId: "" });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("tenantId"))).toBe(true);
  });
});

describe("validateHealth", () => {
  it("accepts a valid health snapshot", () => {
    const result = validateHealth({
      schemaVersion: "1.0.0",
      tenantId: "demo-tenant",
      capturedAt: "2026-07-05T00:00:00.000Z",
      status: "healthy",
      score: 90,
      checks: [{ name: "tests", status: "healthy" }],
    });
    expect(result.valid).toBe(true);
  });

  it("rejects invalid status", () => {
    const result = validateHealth({
      schemaVersion: "1.0.0",
      tenantId: "demo-tenant",
      capturedAt: "2026-07-05T00:00:00.000Z",
      status: "broken",
      score: 90,
      checks: [],
    });
    expect(result.valid).toBe(false);
  });
});

describe("validateQualification", () => {
  it("accepts qualified tenant", () => {
    const result = validateQualification({
      schemaVersion: "1.0.0",
      tenantId: "demo-tenant",
      evaluatedAt: "2026-07-05T00:00:00.000Z",
      status: "qualified",
      score: 85,
      criteria: [{ id: "a", name: "A", passed: true, weight: 100 }],
    });
    expect(result.valid).toBe(true);
  });
});

describe("createFactoryEvent", () => {
  it("creates a normalized event", () => {
    const event = createFactoryEvent({
      type: "tenant.created",
      tenantId: "demo-tenant",
      source: "tests",
      payload: { name: "Demo" },
    });
    expect(event.eventId).toBeTruthy();
    expect(event.type).toBe("tenant.created");
  });
});

describe("createFactoryObject", () => {
  it("creates a tenant object", () => {
    const object = createFactoryObject({
      type: "tenant",
      tenantId: "demo-tenant",
      name: "Demo Object",
      attributes: { role: "primary" },
    });
    expect(object.objectId).toBeTruthy();
    expect(object.type).toBe("tenant");
  });
});

describe("certification package helpers", () => {
  it("validates package layout for self-certification", () => {
    const layout = validatePackageLayout(join(process.cwd(), "factory-certification"));
    expect(layout.valid).toBe(true);
    expect(layout.missingFiles).toHaveLength(0);
  });

  it("checks tenantId consistency", () => {
    const pkg = readCertificationPackage(join(process.cwd(), "factory-certification"));
    const result = checkTenantIdConsistency(pkg);
    expect(result.valid).toBe(true);
    expect(result.tenantIds).toEqual(["factory-core"]);
  });

  it("detects fake connected status", () => {
    const detected = detectFakeConnectedStatus(
      { ...validManifest, status: "connected" },
      { status: "degraded", checks: [{ name: "tests", status: "healthy" }] },
    );
    expect(detected.detected).toBe(true);
    expect(detected.reasons.length).toBeGreaterThan(0);
  });

  it("detects ownership overlap", () => {
    const overlap = detectOwnershipOverlap([
      { ...validManifest, tenantId: "tenant-a", owners: ["team-x"] },
      { ...validManifest, tenantId: "tenant-b", owners: ["team-x"] },
    ]);
    expect(overlap.detected).toBe(true);
  });

  it("computes readiness score for self-certification", () => {
    const pkg = readCertificationPackage(join(process.cwd(), "factory-certification"));
    const readiness = computeReadinessScore(pkg);
    expect(readiness.score).toBeGreaterThanOrEqual(70);
    expect(readiness.importEligible).toBe(true);
  });

  it("scores certification package", () => {
    const pkg = readCertificationPackage(join(process.cwd(), "factory-certification"));
    const score = scoreCertificationPackage(pkg);
    expect(score.overallPassing).toBe(true);
  });
});

describe("validateCitadelArchivePackage", () => {
  it("validates archive package", () => {
    const archive = createCitadelArchivePackage({
      tenantId: "demo-tenant",
      archiveType: "certification",
      entries: [{ path: "factory-manifest.json", checksum: "abc", sizeBytes: 100 }],
    });
    const result = validateCitadelArchivePackage(archive);
    expect(result.valid).toBe(true);
  });
});

describe("self-certification package validates", () => {
  it("passes full directory validation", () => {
    const result = validateCertificationPackageDirectory(
      join(process.cwd(), "factory-certification"),
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("passes factory-standards import copy validation", () => {
    const result = validateCertificationPackageDirectory(
      join(process.cwd(), "factory-standards/imports/factory-core"),
    );
    expect(result.valid).toBe(true);
  });
});
