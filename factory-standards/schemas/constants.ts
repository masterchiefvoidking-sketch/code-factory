/**
 * Canonical factory-standards definitions.
 * factory-core mirrors these constants — do not drift.
 */

export const STANDARDS_VERSION = "1.0.0";

export const CERTIFICATION_REQUIRED_FILES = [
  "factory-manifest.json",
  "factory-audit.json",
  "factory-health.json",
  "factory-qualification.json",
  "factory-report.md",
] as const;

export const CERTIFICATION_PACKAGE_LAYOUT_VERSION = "1.0.0";

export const INTEGRATION_MODES = [
  "embedded",
  "standalone",
  "library",
  "service",
  "sdk",
] as const;

export const TENANT_STATUSES = [
  "draft",
  "active",
  "connected",
  "qualified",
  "certified",
  "archived",
  "suspended",
] as const;

export const HEALTH_STATUSES = ["healthy", "degraded", "unhealthy", "unknown"] as const;

export const QUALIFICATION_STATUSES = ["unqualified", "pending", "qualified", "rejected"] as const;

export const AUDIT_VERDICTS = ["pass", "fail", "conditional"] as const;

export const FACTORY_EVENT_TYPES = [
  "tenant.created",
  "tenant.updated",
  "tenant.certified",
  "health.snapshot",
  "audit.completed",
  "object.created",
  "object.linked",
  "report.generated",
  "citadel.archived",
] as const;

export const FACTORY_OBJECT_TYPES = [
  "tenant",
  "artifact",
  "report",
  "event",
  "archive",
  "contract",
] as const;

export const REPORT_FORMATS = ["markdown", "json"] as const;

export const CITADEL_ARCHIVE_TYPES = [
  "certification",
  "audit-trail",
  "health-history",
  "full-tenant",
] as const;

export const MIN_READINESS_SCORE = 70;

/** Foundation repos certified under factory-standards. */
export const FOUNDATION_REPOS = ["factory-standards", "factory-core"] as const;

/** Valid integration modes per foundation repo type. */
export const FOUNDATION_INTEGRATION_MODES: Record<string, readonly string[]> = {
  "factory-core": ["sdk", "library"],
  "factory-standards": ["library"],
};
