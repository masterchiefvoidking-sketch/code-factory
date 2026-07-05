import {
  AUDIT_VERDICTS,
  CERTIFICATION_REQUIRED_FILES,
  CITADEL_ARCHIVE_TYPES,
  FACTORY_EVENT_TYPES,
  FACTORY_OBJECT_TYPES,
  HEALTH_STATUSES,
  INTEGRATION_MODES,
  QUALIFICATION_STATUSES,
  REPORT_FORMATS,
  TENANT_STATUSES,
} from "../standards/constants.js";
import type { ValidationResult } from "../types/index.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isEnumValue<T extends readonly string[]>(
  value: unknown,
  allowed: T,
): value is T[number] {
  return typeof value === "string" && (allowed as readonly string[]).includes(value);
}

function isIsoDateString(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function isNumberInRange(value: unknown, min: number, max: number): value is number {
  return typeof value === "number" && !Number.isNaN(value) && value >= min && value <= max;
}

function pushFieldError(errors: string[], field: string, message: string): void {
  errors.push(`${field}: ${message}`);
}

export function validateTenantManifest(input: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isRecord(input)) {
    return { valid: false, errors: ["manifest must be an object"], warnings };
  }

  if (!isNonEmptyString(input.schemaVersion)) pushFieldError(errors, "schemaVersion", "required");
  if (!isNonEmptyString(input.tenantId)) pushFieldError(errors, "tenantId", "required");
  if (!isNonEmptyString(input.name)) pushFieldError(errors, "name", "required");
  if (!isNonEmptyString(input.version)) pushFieldError(errors, "version", "required");
  if (!isEnumValue(input.integrationMode, INTEGRATION_MODES)) {
    pushFieldError(errors, "integrationMode", `must be one of ${INTEGRATION_MODES.join(", ")}`);
  }
  if (!isEnumValue(input.status, TENANT_STATUSES)) {
    pushFieldError(errors, "status", `must be one of ${TENANT_STATUSES.join(", ")}`);
  }
  if (!isNonEmptyString(input.mission)) pushFieldError(errors, "mission", "required");
  if (!isIsoDateString(input.createdAt)) pushFieldError(errors, "createdAt", "must be ISO date");
  if (!isIsoDateString(input.updatedAt)) pushFieldError(errors, "updatedAt", "must be ISO date");

  if (Array.isArray(input.owners) && input.owners.length === 0) {
    warnings.push("owners: empty array");
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validateAudit(input: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isRecord(input)) {
    return { valid: false, errors: ["audit must be an object"], warnings };
  }

  if (!isNonEmptyString(input.schemaVersion)) pushFieldError(errors, "schemaVersion", "required");
  if (!isNonEmptyString(input.tenantId)) pushFieldError(errors, "tenantId", "required");
  if (!isIsoDateString(input.auditedAt)) pushFieldError(errors, "auditedAt", "must be ISO date");
  if (!isNonEmptyString(input.auditor)) pushFieldError(errors, "auditor", "required");
  if (!isEnumValue(input.verdict, AUDIT_VERDICTS)) {
    pushFieldError(errors, "verdict", `must be one of ${AUDIT_VERDICTS.join(", ")}`);
  }
  if (!isNonEmptyString(input.standardsVersion)) {
    pushFieldError(errors, "standardsVersion", "required");
  }
  if (!Array.isArray(input.findings)) {
    pushFieldError(errors, "findings", "must be an array");
  } else {
    for (const [index, finding] of input.findings.entries()) {
      if (!isRecord(finding)) {
        pushFieldError(errors, `findings[${index}]`, "must be an object");
        continue;
      }
      if (!isNonEmptyString(finding.code)) pushFieldError(errors, `findings[${index}].code`, "required");
      if (!["info", "warning", "error"].includes(String(finding.severity))) {
        pushFieldError(errors, `findings[${index}].severity`, "invalid");
      }
      if (!isNonEmptyString(finding.message)) {
        pushFieldError(errors, `findings[${index}].message`, "required");
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validateHealth(input: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isRecord(input)) {
    return { valid: false, errors: ["health must be an object"], warnings };
  }

  if (!isNonEmptyString(input.schemaVersion)) pushFieldError(errors, "schemaVersion", "required");
  if (!isNonEmptyString(input.tenantId)) pushFieldError(errors, "tenantId", "required");
  if (!isIsoDateString(input.capturedAt)) pushFieldError(errors, "capturedAt", "must be ISO date");
  if (!isEnumValue(input.status, HEALTH_STATUSES)) {
    pushFieldError(errors, "status", `must be one of ${HEALTH_STATUSES.join(", ")}`);
  }
  if (!isNumberInRange(input.score, 0, 100)) pushFieldError(errors, "score", "must be 0–100");

  if (!Array.isArray(input.checks)) {
    pushFieldError(errors, "checks", "must be an array");
  } else if (input.checks.length === 0) {
    warnings.push("checks: empty array");
  } else {
    for (const [index, check] of input.checks.entries()) {
      if (!isRecord(check)) {
        pushFieldError(errors, `checks[${index}]`, "must be an object");
        continue;
      }
      if (!isNonEmptyString(check.name)) pushFieldError(errors, `checks[${index}].name`, "required");
      if (!isEnumValue(check.status, HEALTH_STATUSES)) {
        pushFieldError(errors, `checks[${index}].status`, "invalid");
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validateQualification(input: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isRecord(input)) {
    return { valid: false, errors: ["qualification must be an object"], warnings };
  }

  if (!isNonEmptyString(input.schemaVersion)) pushFieldError(errors, "schemaVersion", "required");
  if (!isNonEmptyString(input.tenantId)) pushFieldError(errors, "tenantId", "required");
  if (!isIsoDateString(input.evaluatedAt)) {
    pushFieldError(errors, "evaluatedAt", "must be ISO date");
  }
  if (!isEnumValue(input.status, QUALIFICATION_STATUSES)) {
    pushFieldError(errors, "status", `must be one of ${QUALIFICATION_STATUSES.join(", ")}`);
  }
  if (!isNumberInRange(input.score, 0, 100)) pushFieldError(errors, "score", "must be 0–100");

  if (!Array.isArray(input.criteria)) {
    pushFieldError(errors, "criteria", "must be an array");
  } else if (input.criteria.length === 0) {
    warnings.push("criteria: empty array");
  } else {
    for (const [index, criterion] of input.criteria.entries()) {
      if (!isRecord(criterion)) {
        pushFieldError(errors, `criteria[${index}]`, "must be an object");
        continue;
      }
      if (!isNonEmptyString(criterion.id)) pushFieldError(errors, `criteria[${index}].id`, "required");
      if (!isNonEmptyString(criterion.name)) pushFieldError(errors, `criteria[${index}].name`, "required");
      if (typeof criterion.passed !== "boolean") {
        pushFieldError(errors, `criteria[${index}].passed`, "must be boolean");
      }
      if (!isNumberInRange(criterion.weight, 0, 100)) {
        pushFieldError(errors, `criteria[${index}].weight`, "must be 0–100");
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validateEvent(input: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isRecord(input)) {
    return { valid: false, errors: ["event must be an object"], warnings };
  }

  if (!isNonEmptyString(input.schemaVersion)) pushFieldError(errors, "schemaVersion", "required");
  if (!isNonEmptyString(input.eventId)) pushFieldError(errors, "eventId", "required");
  if (!isEnumValue(input.type, FACTORY_EVENT_TYPES)) {
    pushFieldError(errors, "type", `must be one of ${FACTORY_EVENT_TYPES.join(", ")}`);
  }
  if (!isNonEmptyString(input.tenantId)) pushFieldError(errors, "tenantId", "required");
  if (!isIsoDateString(input.timestamp)) pushFieldError(errors, "timestamp", "must be ISO date");
  if (!isNonEmptyString(input.source)) pushFieldError(errors, "source", "required");
  if (!isRecord(input.payload)) pushFieldError(errors, "payload", "must be an object");

  return { valid: errors.length === 0, errors, warnings };
}

export function validateObject(input: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isRecord(input)) {
    return { valid: false, errors: ["object must be an object"], warnings };
  }

  if (!isNonEmptyString(input.schemaVersion)) pushFieldError(errors, "schemaVersion", "required");
  if (!isNonEmptyString(input.objectId)) pushFieldError(errors, "objectId", "required");
  if (!isEnumValue(input.type, FACTORY_OBJECT_TYPES)) {
    pushFieldError(errors, "type", `must be one of ${FACTORY_OBJECT_TYPES.join(", ")}`);
  }
  if (!isNonEmptyString(input.tenantId)) pushFieldError(errors, "tenantId", "required");
  if (!isNonEmptyString(input.name)) pushFieldError(errors, "name", "required");
  if (!isIsoDateString(input.createdAt)) pushFieldError(errors, "createdAt", "must be ISO date");
  if (!isIsoDateString(input.updatedAt)) pushFieldError(errors, "updatedAt", "must be ISO date");
  if (!isRecord(input.attributes)) pushFieldError(errors, "attributes", "must be an object");

  if (Array.isArray(input.links)) {
    for (const [index, link] of input.links.entries()) {
      if (!isRecord(link)) {
        pushFieldError(errors, `links[${index}]`, "must be an object");
        continue;
      }
      if (!isNonEmptyString(link.rel)) pushFieldError(errors, `links[${index}].rel`, "required");
      if (!isNonEmptyString(link.targetId)) pushFieldError(errors, `links[${index}].targetId`, "required");
      if (!isEnumValue(link.targetType, FACTORY_OBJECT_TYPES)) {
        pushFieldError(errors, `links[${index}].targetType`, "invalid");
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validateCitadelArchivePackage(input: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isRecord(input)) {
    return { valid: false, errors: ["archive package must be an object"], warnings };
  }

  if (!isNonEmptyString(input.schemaVersion)) pushFieldError(errors, "schemaVersion", "required");
  if (!isNonEmptyString(input.archiveId)) pushFieldError(errors, "archiveId", "required");
  if (!isNonEmptyString(input.tenantId)) pushFieldError(errors, "tenantId", "required");
  if (!isEnumValue(input.archiveType, CITADEL_ARCHIVE_TYPES)) {
    pushFieldError(errors, "archiveType", `must be one of ${CITADEL_ARCHIVE_TYPES.join(", ")}`);
  }
  if (!isIsoDateString(input.createdAt)) pushFieldError(errors, "createdAt", "must be ISO date");
  if (!isNonEmptyString(input.manifestChecksum)) {
    pushFieldError(errors, "manifestChecksum", "required");
  }

  if (!Array.isArray(input.entries)) {
    pushFieldError(errors, "entries", "must be an array");
  } else if (input.entries.length === 0) {
    warnings.push("entries: empty array");
  } else {
    for (const [index, entry] of input.entries.entries()) {
      if (!isRecord(entry)) {
        pushFieldError(errors, `entries[${index}]`, "must be an object");
        continue;
      }
      if (!isNonEmptyString(entry.path)) pushFieldError(errors, `entries[${index}].path`, "required");
      if (!isNonEmptyString(entry.checksum)) pushFieldError(errors, `entries[${index}].checksum`, "required");
      if (typeof entry.sizeBytes !== "number" || entry.sizeBytes < 0) {
        pushFieldError(errors, `entries[${index}].sizeBytes`, "must be non-negative number");
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validateCertificationPackage(input: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isRecord(input)) {
    return { valid: false, errors: ["certification package must be an object"], warnings };
  }

  const manifestResult = validateTenantManifest(input.manifest);
  const auditResult = validateAudit(input.audit);
  const healthResult = validateHealth(input.health);
  const qualificationResult = validateQualification(input.qualification);

  errors.push(...manifestResult.errors.map((e) => `manifest.${e}`));
  errors.push(...auditResult.errors.map((e) => `audit.${e}`));
  errors.push(...healthResult.errors.map((e) => `health.${e}`));
  errors.push(...qualificationResult.errors.map((e) => `qualification.${e}`));

  warnings.push(...manifestResult.warnings.map((w) => `manifest.${w}`));
  warnings.push(...auditResult.warnings.map((w) => `audit.${w}`));
  warnings.push(...healthResult.warnings.map((w) => `health.${w}`));
  warnings.push(...qualificationResult.warnings.map((w) => `qualification.${w}`));

  if (!isRecord(input.report) || !isRecord(input.report.metadata)) {
    pushFieldError(errors, "report.metadata", "required");
  } else {
    const metadata = input.report.metadata;
    if (!isNonEmptyString(metadata.tenantId)) pushFieldError(errors, "report.metadata.tenantId", "required");
    if (!isNonEmptyString(metadata.title)) pushFieldError(errors, "report.metadata.title", "required");
    if (!isEnumValue(metadata.format, REPORT_FORMATS)) {
      pushFieldError(errors, "report.metadata.format", "invalid");
    }
    if (!isIsoDateString(metadata.generatedAt)) {
      pushFieldError(errors, "report.metadata.generatedAt", "must be ISO date");
    }
    if (!isNonEmptyString(metadata.author)) pushFieldError(errors, "report.metadata.author", "required");
  }

  if (typeof input.report !== "object" || input.report === null || typeof (input.report as { content?: unknown }).content !== "string") {
    pushFieldError(errors, "report.content", "required string");
  }

  if (isRecord(input.manifest) && isRecord(input.audit) && isRecord(input.health) && isRecord(input.qualification)) {
    const tenantIds = [
      input.manifest.tenantId,
      input.audit.tenantId,
      input.health.tenantId,
      input.qualification.tenantId,
    ];
    const unique = new Set(tenantIds);
    if (unique.size > 1) {
      errors.push(`tenantId mismatch across documents: ${[...unique].join(", ")}`);
    }
  }

  if (!CERTIFICATION_REQUIRED_FILES.every((file) => file.startsWith("factory-"))) {
    warnings.push("unexpected certification file naming");
  }

  return { valid: errors.length === 0, errors, warnings };
}
