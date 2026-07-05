import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { CERTIFICATION_PACKAGE_LAYOUT_VERSION, CERTIFICATION_REQUIRED_FILES } from "../standards/constants.js";
import type {
  FactoryAudit,
  FactoryCertificationPackage,
  FactoryHealth,
  FactoryQualification,
  FactoryReport,
  FactoryTenantManifest,
  PackageLayoutValidationResult,
  ReadinessScoreResult,
  ValidationResult,
} from "../types/index.js";
import {
  validateAudit,
  validateCertificationPackage,
  validateHealth,
  validateQualification,
} from "../validators/index.js";
import { computeReadinessScore } from "./scoring.js";
import { checkTenantIdConsistency, detectFakeConnectedStatus, detectOwnershipOverlap } from "./checks.js";

export interface CreateCertificationPackageOptions {
  tenantId: string;
  name: string;
  version: string;
  mission: string;
  integrationMode: FactoryTenantManifest["integrationMode"];
  status?: FactoryTenantManifest["status"];
  repository?: string;
  owners?: string[];
}

export interface CreateEmptyCertificationPackageOptions {
  tenantId: string;
  name?: string;
  mission?: string;
}

const SCHEMA_VERSION = "1.0.0";

/**
 * Create a skeleton certification package for manual completion.
 *
 * **Placeholder defaults — not production-ready:**
 * - manifest.status: `draft`, version: `0.0.0`, mission: `""` (empty mission fails validation)
 * - audit.auditor: `pending`, verdict: `conditional`
 * - health.status: `unknown`, score: 0
 * - qualification.status: `unqualified`, score: 0
 *
 * Default package fails `validateCertificationPackage()` (empty mission) and
 * `scoreCertificationPackage()` until fields are completed.
 */
export function createEmptyCertificationPackage(
  options: CreateEmptyCertificationPackageOptions,
): FactoryCertificationPackage {
  const now = new Date().toISOString();
  const name = options.name ?? options.tenantId;
  const mission = options.mission ?? "";

  const manifest: FactoryTenantManifest = {
    schemaVersion: SCHEMA_VERSION,
    tenantId: options.tenantId,
    name,
    version: "0.0.0",
    integrationMode: "library",
    status: "draft",
    mission,
    createdAt: now,
    updatedAt: now,
  };

  const audit: FactoryAudit = {
    schemaVersion: SCHEMA_VERSION,
    tenantId: options.tenantId,
    auditedAt: now,
    auditor: "pending",
    verdict: "conditional",
    findings: [],
    standardsVersion: SCHEMA_VERSION,
  };

  const health: FactoryHealth = {
    schemaVersion: SCHEMA_VERSION,
    tenantId: options.tenantId,
    capturedAt: now,
    status: "unknown",
    score: 0,
    checks: [],
  };

  const qualification: FactoryQualification = {
    schemaVersion: SCHEMA_VERSION,
    tenantId: options.tenantId,
    evaluatedAt: now,
    status: "unqualified",
    score: 0,
    criteria: [],
  };

  const report: FactoryReport = {
    metadata: {
      tenantId: options.tenantId,
      title: `${name} Certification Report`,
      format: "markdown",
      generatedAt: now,
      author: "factory-core",
    },
    content: `# ${name} Certification Report\n\nDraft package — fill in audit, health, and qualification details.\n`,
  };

  return {
    layoutVersion: CERTIFICATION_PACKAGE_LAYOUT_VERSION,
    tenantId: options.tenantId,
    generatedAt: now,
    manifest,
    audit,
    health,
    qualification,
    report,
  };
}

export function createCertificationPackage(
  options: CreateCertificationPackageOptions,
): FactoryCertificationPackage {
  const now = new Date().toISOString();

  const manifest: FactoryTenantManifest = {
    schemaVersion: SCHEMA_VERSION,
    tenantId: options.tenantId,
    name: options.name,
    version: options.version,
    integrationMode: options.integrationMode,
    status: options.status ?? "active",
    mission: options.mission,
    repository: options.repository,
    owners: options.owners,
    createdAt: now,
    updatedAt: now,
  };

  const audit: FactoryAudit = {
    schemaVersion: SCHEMA_VERSION,
    tenantId: options.tenantId,
    auditedAt: now,
    auditor: "factory-core",
    verdict: "pass",
    findings: [],
    standardsVersion: SCHEMA_VERSION,
  };

  const health: FactoryHealth = {
    schemaVersion: SCHEMA_VERSION,
    tenantId: options.tenantId,
    capturedAt: now,
    status: "healthy",
    score: 85,
    checks: [
      { name: "schema-compliance", status: "healthy", message: "Schemas validate" },
      { name: "tests", status: "healthy", message: "Test suite passes" },
    ],
  };

  const qualification: FactoryQualification = {
    schemaVersion: SCHEMA_VERSION,
    tenantId: options.tenantId,
    evaluatedAt: now,
    status: "qualified",
    score: 85,
    criteria: [
      { id: "standards-alignment", name: "Standards alignment", passed: true, weight: 40 },
      { id: "validation-coverage", name: "Validation coverage", passed: true, weight: 30 },
      { id: "documentation", name: "Documentation", passed: true, weight: 30 },
    ],
  };

  const report: FactoryReport = {
    metadata: {
      tenantId: options.tenantId,
      title: `${options.name} Certification Report`,
      format: "markdown",
      generatedAt: now,
      author: "factory-core",
      summary: options.mission,
    },
    content: `# ${options.name} Certification Report\n\n${options.mission}\n`,
  };

  return {
    layoutVersion: CERTIFICATION_PACKAGE_LAYOUT_VERSION,
    tenantId: options.tenantId,
    generatedAt: now,
    manifest,
    audit,
    health,
    qualification,
    report,
  };
}

export function readCertificationPackage(dirPath: string): FactoryCertificationPackage {
  const manifest = JSON.parse(
    readFileSync(join(dirPath, "factory-manifest.json"), "utf8"),
  ) as FactoryTenantManifest;
  const audit = JSON.parse(readFileSync(join(dirPath, "factory-audit.json"), "utf8")) as FactoryAudit;
  const health = JSON.parse(readFileSync(join(dirPath, "factory-health.json"), "utf8")) as FactoryHealth;
  const qualification = JSON.parse(
    readFileSync(join(dirPath, "factory-qualification.json"), "utf8"),
  ) as FactoryQualification;
  const reportContent = readFileSync(join(dirPath, "factory-report.md"), "utf8");

  const titleMatch = reportContent.match(/^#\s+(.+)$/m);
  const summaryMatch = reportContent.match(/\n\n([^#\n].+?)\n/s);

  const report: FactoryReport = {
    metadata: {
      tenantId: manifest.tenantId,
      title: titleMatch?.[1] ?? `${manifest.name} Certification Report`,
      format: "markdown",
      generatedAt: manifest.updatedAt,
      author: "factory-core",
      summary: summaryMatch?.[1]?.trim(),
    },
    content: reportContent,
  };

  return {
    layoutVersion: CERTIFICATION_PACKAGE_LAYOUT_VERSION,
    tenantId: manifest.tenantId,
    generatedAt: manifest.updatedAt,
    manifest,
    audit,
    health,
    qualification,
    report,
  };
}

export function validatePackageLayout(dirPath: string): PackageLayoutValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const missingFiles: string[] = [];
  const extraFiles: string[] = [];

  if (!existsSync(dirPath)) {
    return {
      valid: false,
      errors: [`directory not found: ${dirPath}`],
      warnings,
      missingFiles: [...CERTIFICATION_REQUIRED_FILES],
      extraFiles,
    };
  }

  const entries = readdirSync(dirPath);
  const entrySet = new Set(entries);

  for (const required of CERTIFICATION_REQUIRED_FILES) {
    if (!entrySet.has(required)) {
      missingFiles.push(required);
      errors.push(`missing required file: ${required}`);
    }
  }

  for (const entry of entries) {
    if (!CERTIFICATION_REQUIRED_FILES.includes(entry as (typeof CERTIFICATION_REQUIRED_FILES)[number])) {
      extraFiles.push(entry);
      warnings.push(`unexpected file: ${entry}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    missingFiles,
    extraFiles,
  };
}

export { checkTenantIdConsistency, detectFakeConnectedStatus, detectOwnershipOverlap, computeReadinessScore };

export function scoreCertificationPackage(pkg: FactoryCertificationPackage) {
  const validation = validateCertificationPackage(pkg);
  const readiness = computeReadinessScore(pkg);
  const tenantConsistency = checkTenantIdConsistency(pkg);
  const fakeConnected = detectFakeConnectedStatus(pkg.manifest, pkg.health);
  const ownershipOverlap = detectOwnershipOverlap([pkg.manifest]);

  const auditPassing = pkg.audit.verdict === "pass" && validateAudit(pkg.audit).valid;
  const healthPassing = pkg.health.status !== "unhealthy" && validateHealth(pkg.health).valid;
  const qualificationPassing =
    pkg.qualification.status === "qualified" && validateQualification(pkg.qualification).valid;

  const overallPassing =
    validation.valid &&
    tenantConsistency.valid &&
    !fakeConnected.detected &&
    !ownershipOverlap.detected &&
    auditPassing &&
    healthPassing &&
    qualificationPassing &&
    readiness.importEligible;

  return {
    readiness,
    auditPassing,
    healthPassing,
    qualificationPassing,
    overallPassing,
    validation,
    tenantConsistency,
    fakeConnected,
    ownershipOverlap,
  };
}

export function writeValidationReport(
  outputPath: string,
  pkg: FactoryCertificationPackage,
  scoreResult: ReturnType<typeof scoreCertificationPackage>,
): void {
  const lines = [
    `# Validation Report: ${pkg.manifest.name}`,
    "",
    `- Tenant ID: ${pkg.tenantId}`,
    `- Generated: ${new Date().toISOString()}`,
    `- Overall passing: ${scoreResult.overallPassing ? "YES" : "NO"}`,
    `- Readiness score: ${scoreResult.readiness.score}/${scoreResult.readiness.maxScore}`,
    `- Import eligible: ${scoreResult.readiness.importEligible ? "YES" : "NO"}`,
    "",
    "## Breakdown",
    ...Object.entries(scoreResult.readiness.breakdown).map(([k, v]) => `- ${k}: ${v}`),
    "",
    "## Validation Errors",
    ...(scoreResult.validation.errors.length > 0
      ? scoreResult.validation.errors.map((e) => `- ${e}`)
      : ["- none"]),
    "",
    "## Warnings",
    ...(scoreResult.validation.warnings.length > 0
      ? scoreResult.validation.warnings.map((w) => `- ${w}`)
      : ["- none"]),
  ];

  writeFileSync(outputPath, lines.join("\n") + "\n", "utf8");
}

export function writeCertificationPackage(dirPath: string, pkg: FactoryCertificationPackage): void {
  mkdirSync(dirPath, { recursive: true });
  writeFileSync(join(dirPath, "factory-manifest.json"), JSON.stringify(pkg.manifest, null, 2) + "\n");
  writeFileSync(join(dirPath, "factory-audit.json"), JSON.stringify(pkg.audit, null, 2) + "\n");
  writeFileSync(join(dirPath, "factory-health.json"), JSON.stringify(pkg.health, null, 2) + "\n");
  writeFileSync(
    join(dirPath, "factory-qualification.json"),
    JSON.stringify(pkg.qualification, null, 2) + "\n",
  );
  writeFileSync(join(dirPath, "factory-report.md"), pkg.report.content, "utf8");
}

export function validateCertificationPackageDirectory(dirPath: string): ValidationResult & {
  layout: PackageLayoutValidationResult;
  package: FactoryCertificationPackage | null;
  score: ReturnType<typeof scoreCertificationPackage> | null;
} {
  const layout = validatePackageLayout(dirPath);
  if (!layout.valid) {
    return { valid: false, errors: layout.errors, warnings: layout.warnings, layout, package: null, score: null };
  }

  const pkg = readCertificationPackage(dirPath);
  const score = scoreCertificationPackage(pkg);
  const errors = [...score.validation.errors];
  const warnings = [...score.validation.warnings, ...layout.warnings];

  if (!score.tenantConsistency.valid) errors.push(...score.tenantConsistency.errors);
  if (score.fakeConnected.detected) errors.push(...score.fakeConnected.reasons);
  if (score.ownershipOverlap.detected) warnings.push(...score.ownershipOverlap.overlaps);

  return {
    valid: errors.length === 0 && score.overallPassing,
    errors,
    warnings,
    layout,
    package: pkg,
    score,
  };
}

export type { ReadinessScoreResult };
