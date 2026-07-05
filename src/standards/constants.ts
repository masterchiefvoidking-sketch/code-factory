/**
 * Standards compatibility layer — mirrors factory-standards definitions.
 * Do not invent conflicting schemas; keep names aligned with factory-standards.
 */

/** Required files in a Factory certification package directory. */
export const CERTIFICATION_REQUIRED_FILES = [
  "factory-manifest.json",
  "factory-audit.json",
  "factory-health.json",
  "factory-qualification.json",
  "factory-report.md",
] as const;

export type CertificationRequiredFile = (typeof CERTIFICATION_REQUIRED_FILES)[number];

/** Canonical certification package layout version. */
export const CERTIFICATION_PACKAGE_LAYOUT_VERSION = "1.0.0";

/** JSON document types keyed by filename. */
export const CERTIFICATION_FILE_TYPES: Record<CertificationRequiredFile, "json" | "markdown"> = {
  "factory-manifest.json": "json",
  "factory-audit.json": "json",
  "factory-health.json": "json",
  "factory-qualification.json": "json",
  "factory-report.md": "markdown",
};

/** Tenant integration modes defined by factory-standards. */
export const INTEGRATION_MODES = [
  "embedded",
  "standalone",
  "library",
  "service",
  "sdk",
] as const;

export type IntegrationMode = (typeof INTEGRATION_MODES)[number];

/** Tenant lifecycle statuses defined by factory-standards. */
export const TENANT_STATUSES = [
  "draft",
  "active",
  "connected",
  "qualified",
  "certified",
  "archived",
  "suspended",
] as const;

export type TenantStatus = (typeof TENANT_STATUSES)[number];

/** Health snapshot statuses defined by factory-standards. */
export const HEALTH_STATUSES = [
  "healthy",
  "degraded",
  "unhealthy",
  "unknown",
] as const;

export type HealthStatus = (typeof HEALTH_STATUSES)[number];

/** Qualification statuses defined by factory-standards. */
export const QUALIFICATION_STATUSES = [
  "unqualified",
  "pending",
  "qualified",
  "rejected",
] as const;

export type QualificationStatus = (typeof QUALIFICATION_STATUSES)[number];

/** Audit verdicts defined by factory-standards. */
export const AUDIT_VERDICTS = ["pass", "fail", "conditional"] as const;

export type AuditVerdict = (typeof AUDIT_VERDICTS)[number];

/** Factory event types defined by factory-standards. */
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

export type FactoryEventType = (typeof FACTORY_EVENT_TYPES)[number];

/** Factory object types defined by factory-standards. */
export const FACTORY_OBJECT_TYPES = [
  "tenant",
  "artifact",
  "report",
  "event",
  "archive",
  "contract",
] as const;

export type FactoryObjectType = (typeof FACTORY_OBJECT_TYPES)[number];

/** Report formats defined by factory-standards. */
export const REPORT_FORMATS = ["markdown", "json"] as const;

export type ReportFormat = (typeof REPORT_FORMATS)[number];

/** Citadel archive package types. */
export const CITADEL_ARCHIVE_TYPES = [
  "certification",
  "audit-trail",
  "health-history",
  "full-tenant",
] as const;

export type CitadelArchiveType = (typeof CITADEL_ARCHIVE_TYPES)[number];

/** Minimum readiness score (0–100) for import eligibility. */
export const MIN_READINESS_SCORE = 70;

/** Fields that must agree on tenantId across certification documents. */
export const TENANT_ID_FIELDS = {
  manifest: "tenantId",
  audit: "tenantId",
  health: "tenantId",
  qualification: "tenantId",
} as const;
