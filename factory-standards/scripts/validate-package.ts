import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  validateCertificationPackageDirectory,
  detectFakeConnectedStatus,
  type FactoryTenantManifest,
} from "@factory/core";
import {
  FOUNDATION_INTEGRATION_MODES,
  FOUNDATION_REPOS,
  STANDARDS_VERSION,
} from "../schemas/constants.js";

interface FoundationReviewCheck {
  id: string;
  passed: boolean;
  message: string;
}

interface ValidationReport {
  validatedAt: string;
  packagePath: string;
  tenantId: string;
  standardsVersion: string;
  validationResult: "pass" | "fail";
  readinessScore: number;
  importEligible: boolean;
  overallPassing: boolean;
  errors: string[];
  warnings: string[];
  foundationReview: FoundationReviewCheck[];
  FOUNDATION_READY: boolean;
  TENANT_ROLLOUT_READY: boolean;
  requiredFixes: string[];
  gaps: string[];
}

function reviewFoundationRepo(
  manifest: FactoryTenantManifest,
  reportContent: string,
): FoundationReviewCheck[] {
  const checks: FoundationReviewCheck[] = [];

  checks.push({
    id: "tenant-id",
    passed: manifest.tenantId === "factory-core",
    message:
      manifest.tenantId === "factory-core"
        ? "tenantId is factory-core"
        : `expected tenantId factory-core, got ${manifest.tenantId}`,
  });

  const missionLower = manifest.mission.toLowerCase();
  const missionOk =
    missionLower.includes("sdk") ||
    missionLower.includes("shared") ||
    missionLower.includes("typescript");
  checks.push({
    id: "mission-sdk-role",
    passed: missionOk,
    message: missionOk
      ? "mission identifies shared SDK role"
      : "mission must identify shared SDK / TypeScript role",
  });

  const ownsSharedCode =
    reportContent.includes("validators") ||
    reportContent.includes("types") ||
    reportContent.includes("SDK");
  checks.push({
    id: "owns-shared-code",
    passed: ownsSharedCode,
    message: ownsSharedCode
      ? "package documents shared code helpers, validators, types, SDK"
      : "report must document shared code surface",
  });

  const tenantBehaviorClaims = /\b(user-facing|app feature|tenant app|product feature)\b/i.test(
    reportContent + manifest.mission,
  );
  checks.push({
    id: "no-tenant-behavior",
    passed: !tenantBehaviorClaims,
    message: tenantBehaviorClaims
      ? "package must NOT claim tenant app behavior ownership"
      : "does NOT own tenant behavior",
  });

  const ownsStandards = /\b(defines standards|owns standards|source of truth for standards)\b/i.test(
    reportContent,
  );
  checks.push({
    id: "no-standards-ownership",
    passed: !ownsStandards,
    message: ownsStandards
      ? "factory-core must NOT claim ownership of Factory standards"
      : "does NOT own Factory standards",
  });

  const allowedModes = FOUNDATION_INTEGRATION_MODES["factory-core"] ?? ["sdk"];
  const modeHonest = allowedModes.includes(manifest.integrationMode);
  checks.push({
    id: "integration-mode-honest",
    passed: modeHonest,
    message: modeHonest
      ? `integration mode "${manifest.integrationMode}" is honest for foundation SDK repo`
      : `integration mode "${manifest.integrationMode}" is not valid for factory-core (allowed: ${allowedModes.join(", ")})`,
  });

  checks.push({
    id: "foundation-repo-registered",
    passed: FOUNDATION_REPOS.includes(manifest.tenantId as (typeof FOUNDATION_REPOS)[number]),
    message: FOUNDATION_REPOS.includes(manifest.tenantId as (typeof FOUNDATION_REPOS)[number])
      ? "tenantId is a registered foundation repo"
      : "tenantId is not registered as a foundation repo",
  });

  return checks;
}

function buildMarkdownReport(report: ValidationReport): string {
  const lines = [
    `# Validation Report: ${report.tenantId}`,
    "",
    `- **Validated at:** ${report.validatedAt}`,
    `- **Package path:** ${report.packagePath}`,
    `- **Standards version:** ${report.standardsVersion}`,
    `- **Validation result:** ${report.validationResult.toUpperCase()}`,
    `- **Readiness score:** ${report.readinessScore}/100`,
    `- **Import eligible:** ${report.importEligible ? "yes" : "no"}`,
    `- **FOUNDATION_READY:** ${report.FOUNDATION_READY}`,
    `- **TENANT_ROLLOUT_READY:** ${report.TENANT_ROLLOUT_READY}`,
    "",
    "## Foundation Review",
    "",
    ...report.foundationReview.map(
      (c) => `- [${c.passed ? "x" : " "}] **${c.id}**: ${c.message}`,
    ),
    "",
    "## Errors",
    ...(report.errors.length > 0 ? report.errors.map((e) => `- ${e}`) : ["- none"]),
    "",
    "## Warnings",
    ...(report.warnings.length > 0 ? report.warnings.map((w) => `- ${w}`) : ["- none"]),
    "",
    "## Gaps",
    ...(report.gaps.length > 0 ? report.gaps.map((g) => `- ${g}`) : ["- none"]),
    "",
    "## Required Fixes",
    ...(report.requiredFixes.length > 0
      ? report.requiredFixes.map((f) => `- ${f}`)
      : ["- none"]),
  ];
  return lines.join("\n") + "\n";
}

const packagePath = resolve(process.argv[2] ?? "imports/factory-core");
const result = validateCertificationPackageDirectory(packagePath);

if (!result.package || !result.score) {
  const failReport: ValidationReport = {
    validatedAt: new Date().toISOString(),
    packagePath,
    tenantId: "unknown",
    standardsVersion: STANDARDS_VERSION,
    validationResult: "fail",
    readinessScore: 0,
    importEligible: false,
    overallPassing: false,
    errors: result.errors,
    warnings: result.warnings,
    foundationReview: [],
    FOUNDATION_READY: false,
    TENANT_ROLLOUT_READY: false,
    requiredFixes: result.errors,
    gaps: ["Package could not be loaded — fix layout and schema errors first."],
  };

  writeFileSync(join(packagePath, "validation-report.json"), JSON.stringify(failReport, null, 2) + "\n");
  writeFileSync(join(packagePath, "validation-report.md"), buildMarkdownReport(failReport));
  console.error("Validation failed — package could not be loaded.");
  process.exit(1);
}

const pkg = result.package;
const reportContent = readFileSync(join(packagePath, "factory-report.md"), "utf8");
const foundationReview = reviewFoundationRepo(pkg.manifest, reportContent);
const fakeConnected = detectFakeConnectedStatus(pkg.manifest, pkg.health);

const foundationPassed = foundationReview.every((c) => c.passed) && !fakeConnected.detected;
const schemaAligned = pkg.audit.standardsVersion === STANDARDS_VERSION;

const errors = [...result.errors];
const warnings = [...result.warnings];

if (!schemaAligned) {
  warnings.push(
    `audit.standardsVersion is ${pkg.audit.standardsVersion}, expected ${STANDARDS_VERSION}`,
  );
}
if (fakeConnected.detected) {
  errors.push(...fakeConnected.reasons.map((r) => `fake-connected: ${r}`));
}
for (const check of foundationReview.filter((c) => !c.passed)) {
  errors.push(`foundation-review.${check.id}: ${check.message}`);
}

const gaps: string[] = [];
const requiredFixes: string[] = [];

if (pkg.audit.auditor === "factory-core-self-audit") {
  gaps.push("Audit performed by factory-core self-audit; independent standards audit recommended before tenant rollout.");
}
if (!schemaAligned) {
  requiredFixes.push(`Update audit.standardsVersion to ${STANDARDS_VERSION}`);
}
gaps.push("@factory/core not yet published to npm — tenants can vendor from git until publish.");

const overallPassing = result.valid && foundationPassed && schemaAligned && result.score.overallPassing;

const validationReport: ValidationReport = {
  validatedAt: new Date().toISOString(),
  packagePath,
  tenantId: pkg.tenantId,
  standardsVersion: STANDARDS_VERSION,
  validationResult: overallPassing ? "pass" : "fail",
  readinessScore: result.score.readiness.score,
  importEligible: result.score.readiness.importEligible,
  overallPassing,
  errors,
  warnings,
  foundationReview,
  FOUNDATION_READY: overallPassing,
  TENANT_ROLLOUT_READY: overallPassing,
  requiredFixes,
  gaps,
};

writeFileSync(
  join(packagePath, "validation-report.json"),
  JSON.stringify(validationReport, null, 2) + "\n",
);
writeFileSync(join(packagePath, "validation-report.md"), buildMarkdownReport(validationReport));

console.log(`Package: ${packagePath}`);
console.log(`Validation result: ${validationReport.validationResult}`);
console.log(`Readiness score: ${validationReport.readinessScore}/100`);
console.log(`FOUNDATION_READY: ${validationReport.FOUNDATION_READY}`);
console.log(`TENANT_ROLLOUT_READY: ${validationReport.TENANT_ROLLOUT_READY}`);

if (validationReport.warnings.length > 0) {
  console.log("\nWarnings:");
  for (const w of validationReport.warnings) console.log(`  - ${w}`);
}
if (validationReport.errors.length > 0) {
  console.log("\nErrors:");
  for (const e of validationReport.errors) console.log(`  - ${e}`);
}

process.exit(overallPassing ? 0 : 1);
