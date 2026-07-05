import { createHash, randomUUID } from "node:crypto";
import type { CitadelArchiveEntry, CitadelArchivePackage, CitadelArchiveType } from "../types/index.js";
import { validateCitadelArchivePackage } from "../validators/index.js";

const SCHEMA_VERSION = "1.0.0";

export interface CreateCitadelArchivePackageOptions {
  tenantId: string;
  archiveType: CitadelArchiveType;
  entries: CitadelArchiveEntry[];
  archiveId?: string;
  manifestChecksum?: string;
}

export function createCitadelArchivePackage(
  options: CreateCitadelArchivePackageOptions,
): CitadelArchivePackage {
  const manifestChecksum =
    options.manifestChecksum ??
    createHash("sha256")
      .update(JSON.stringify(options.entries))
      .digest("hex");

  return {
    schemaVersion: SCHEMA_VERSION,
    archiveId: options.archiveId ?? randomUUID(),
    tenantId: options.tenantId,
    archiveType: options.archiveType,
    createdAt: new Date().toISOString(),
    entries: options.entries,
    manifestChecksum,
  };
}

export function validateCitadelArchivePackageHelper(pkg: unknown) {
  return validateCitadelArchivePackage(pkg);
}
