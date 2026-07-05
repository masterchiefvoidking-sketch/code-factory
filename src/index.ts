// Contracts
export * from "./contracts/index.js";

// Standards compatibility
export * from "./standards/index.js";

// Types
export * from "./types/index.js";

// Validators
export {
  validateTenantManifest,
  validateAudit,
  validateHealth,
  validateQualification,
  validateEvent,
  validateObject,
  validateCitadelArchivePackage,
  validateCertificationPackage,
} from "./validators/index.js";

// Certification SDK
export {
  createEmptyCertificationPackage,
  createCertificationPackage,
  readCertificationPackage,
  scoreCertificationPackage,
  writeValidationReport,
  writeCertificationPackage,
  validatePackageLayout,
  validateCertificationPackageDirectory,
  checkTenantIdConsistency,
  detectFakeConnectedStatus,
  detectOwnershipOverlap,
  computeReadinessScore,
} from "./certification/index.js";
export type {
  CreateCertificationPackageOptions,
  CreateEmptyCertificationPackageOptions,
  ReadinessScoreResult,
} from "./certification/index.js";

// Event SDK
export {
  createFactoryEvent,
  validateFactoryEvent,
  normalizeFactoryEvent,
} from "./events/index.js";
export type { CreateFactoryEventOptions } from "./events/index.js";

// Object SDK
export {
  createFactoryObject,
  validateFactoryObject,
  linkFactoryObjects,
} from "./objects/index.js";
export type { CreateFactoryObjectOptions } from "./objects/index.js";

// Health SDK
export { createHealthSnapshot, scoreHealth } from "./health/index.js";
export type { CreateHealthSnapshotOptions } from "./health/index.js";

// Report SDK
export { createFactoryReport, parseFactoryReportMetadata } from "./reports/index.js";
export type { CreateFactoryReportOptions } from "./reports/index.js";

// Citadel SDK
export {
  createCitadelArchivePackage,
  validateCitadelArchivePackageHelper as validateCitadelArchivePackageSdk,
} from "./citadel/index.js";
export type { CreateCitadelArchivePackageOptions } from "./citadel/index.js";

// Utils
export * from "./utils/index.js";
