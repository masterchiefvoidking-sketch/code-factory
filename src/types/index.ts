import type {
  AuditVerdict,
  CitadelArchiveType,
  FactoryEventType,
  FactoryObjectType,
  HealthStatus,
  IntegrationMode,
  QualificationStatus,
  ReportFormat,
  TenantStatus,
} from "../standards/constants.js";

export type {
  AuditVerdict,
  CitadelArchiveType,
  FactoryEventType,
  FactoryObjectType,
  HealthStatus,
  IntegrationMode,
  QualificationStatus,
  ReportFormat,
  TenantStatus,
};

export interface FactoryTenantManifest {
  schemaVersion: string;
  tenantId: string;
  name: string;
  version: string;
  integrationMode: IntegrationMode;
  status: TenantStatus;
  mission: string;
  repository?: string;
  owners?: string[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FactoryAuditFinding {
  code: string;
  severity: "info" | "warning" | "error";
  message: string;
  field?: string;
}

export interface FactoryAudit {
  schemaVersion: string;
  tenantId: string;
  auditedAt: string;
  auditor: string;
  verdict: AuditVerdict;
  findings: FactoryAuditFinding[];
  standardsVersion: string;
}

export interface FactoryHealthCheck {
  name: string;
  status: HealthStatus;
  message?: string;
}

export interface FactoryHealth {
  schemaVersion: string;
  tenantId: string;
  capturedAt: string;
  status: HealthStatus;
  score: number;
  checks: FactoryHealthCheck[];
}

export interface FactoryQualificationCriterion {
  id: string;
  name: string;
  passed: boolean;
  weight: number;
  notes?: string;
}

export interface FactoryQualification {
  schemaVersion: string;
  tenantId: string;
  evaluatedAt: string;
  status: QualificationStatus;
  score: number;
  criteria: FactoryQualificationCriterion[];
  readinessScore?: number;
}

export interface FactoryEvent {
  schemaVersion: string;
  eventId: string;
  type: FactoryEventType;
  tenantId: string;
  timestamp: string;
  source: string;
  payload: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface FactoryObjectLink {
  rel: string;
  targetId: string;
  targetType: FactoryObjectType;
}

export interface FactoryObject {
  schemaVersion: string;
  objectId: string;
  type: FactoryObjectType;
  tenantId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  attributes: Record<string, unknown>;
  links?: FactoryObjectLink[];
}

export interface FactoryReportMetadata {
  tenantId: string;
  title: string;
  format: ReportFormat;
  generatedAt: string;
  author: string;
  summary?: string;
}

export interface FactoryReport {
  metadata: FactoryReportMetadata;
  content: string;
}

export interface CitadelArchiveEntry {
  path: string;
  checksum: string;
  sizeBytes: number;
}

export interface CitadelArchivePackage {
  schemaVersion: string;
  archiveId: string;
  tenantId: string;
  archiveType: CitadelArchiveType;
  createdAt: string;
  entries: CitadelArchiveEntry[];
  manifestChecksum: string;
}

export interface FactoryCertificationPackage {
  layoutVersion: string;
  tenantId: string;
  generatedAt: string;
  manifest: FactoryTenantManifest;
  audit: FactoryAudit;
  health: FactoryHealth;
  qualification: FactoryQualification;
  report: FactoryReport;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface PackageLayoutValidationResult extends ValidationResult {
  missingFiles: string[];
  extraFiles: string[];
}

export interface ReadinessScoreResult {
  score: number;
  maxScore: number;
  breakdown: Record<string, number>;
  importEligible: boolean;
}

export interface CertificationScoreResult {
  readiness: ReadinessScoreResult;
  auditPassing: boolean;
  healthPassing: boolean;
  qualificationPassing: boolean;
  overallPassing: boolean;
}
