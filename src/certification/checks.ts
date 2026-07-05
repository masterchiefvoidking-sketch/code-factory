import type { FactoryCertificationPackage, FactoryTenantManifest, ReadinessScoreResult } from "../types/index.js";
import { MIN_READINESS_SCORE } from "../standards/constants.js";
import {
  validateAudit,
  validateHealth,
  validateQualification,
  validateTenantManifest,
} from "../validators/index.js";

export function computeReadinessScore(pkg: FactoryCertificationPackage): ReadinessScoreResult {
  const breakdown: Record<string, number> = {
    manifest: 0,
    audit: 0,
    health: 0,
    qualification: 0,
    report: 0,
  };

  if (validateTenantManifest(pkg.manifest).valid) breakdown.manifest = 20;
  if (validateAudit(pkg.audit).valid && pkg.audit.verdict === "pass") breakdown.audit = 25;
  if (validateHealth(pkg.health).valid && pkg.health.status !== "unhealthy") breakdown.health = 20;
  if (validateQualification(pkg.qualification).valid && pkg.qualification.status === "qualified") {
    breakdown.qualification = 25;
  }
  if (pkg.report.content.trim().length > 0 && pkg.report.metadata.title.trim().length > 0) {
    breakdown.report = 10;
  }

  const score = Object.values(breakdown).reduce((sum, value) => sum + value, 0);

  return {
    score,
    maxScore: 100,
    breakdown,
    importEligible: score >= MIN_READINESS_SCORE,
  };
}

export function checkTenantIdConsistency(
  pkg: FactoryCertificationPackage,
): { valid: boolean; errors: string[]; tenantIds: string[] } {
  const tenantIds = [
    pkg.manifest.tenantId,
    pkg.audit.tenantId,
    pkg.health.tenantId,
    pkg.qualification.tenantId,
    pkg.report.metadata.tenantId,
    pkg.tenantId,
  ];
  const unique = [...new Set(tenantIds)];

  if (unique.length === 1) {
    return { valid: true, errors: [], tenantIds: unique };
  }

  return {
    valid: false,
    errors: [`tenantId mismatch: expected single value, found ${unique.join(", ")}`],
    tenantIds: unique,
  };
}

export function detectFakeConnectedStatus(
  manifest: FactoryTenantManifest,
  health: { status: string; checks: { name: string; status: string }[] },
): { detected: boolean; reasons: string[] } {
  const reasons: string[] = [];

  if (manifest.status === "connected") {
    const hasConnectionCheck = health.checks.some(
      (check) =>
        check.name.includes("connection") ||
        check.name.includes("integration") ||
        check.name.includes("factory-import"),
    );
    const hasHealthyConnection = health.checks.some(
      (check) =>
        (check.name.includes("connection") || check.name.includes("integration")) &&
        check.status === "healthy",
    );

    if (!hasConnectionCheck) {
      reasons.push("manifest status is connected but no connection health check present");
    }
    if (!hasHealthyConnection && health.status !== "healthy") {
      reasons.push("manifest claims connected but health does not confirm active connection");
    }
  }

  return { detected: reasons.length > 0, reasons };
}

export function detectOwnershipOverlap(
  manifests: FactoryTenantManifest[],
): { detected: boolean; overlaps: string[] } {
  const ownerMap = new Map<string, string[]>();

  for (const manifest of manifests) {
    for (const owner of manifest.owners ?? []) {
      const normalized = owner.trim().toLowerCase();
      if (!normalized) continue;
      const tenants = ownerMap.get(normalized) ?? [];
      tenants.push(manifest.tenantId);
      ownerMap.set(normalized, tenants);
    }
  }

  const overlaps: string[] = [];
  for (const [owner, tenants] of ownerMap.entries()) {
    const uniqueTenants = [...new Set(tenants)];
    if (uniqueTenants.length > 1) {
      overlaps.push(`owner "${owner}" claimed by tenants: ${uniqueTenants.join(", ")}`);
    }
  }

  return { detected: overlaps.length > 0, overlaps };
}
