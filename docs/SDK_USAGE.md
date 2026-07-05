# SDK Usage

Install (when published):

```bash
npm install @factory/core
```

## Types

```typescript
import type {
  FactoryTenantManifest,
  FactoryAudit,
  FactoryHealth,
  FactoryQualification,
  FactoryEvent,
  FactoryObject,
  FactoryReport,
  CitadelArchivePackage,
} from "@factory/core";
```

## Validators

```typescript
import {
  validateTenantManifest,
  validateAudit,
  validateHealth,
  validateQualification,
  validateEvent,
  validateObject,
  validateCitadelArchivePackage,
  validateCertificationPackage,
} from "@factory/core";

const result = validateTenantManifest(manifest);
if (!result.valid) console.error(result.errors);
```

## Certification SDK

```typescript
import {
  createEmptyCertificationPackage,
  createCertificationPackage,
  readCertificationPackage,
  scoreCertificationPackage,
  writeCertificationPackage,
  writeValidationReport,
  validatePackageLayout,
  computeReadinessScore,
} from "@factory/core";
```

### CLI

```bash
# Create an empty package skeleton
npm run create:package -- --tenant my-tenant

# Validate a package directory
npm run validate:package -- ./my-tenant-certification
```

## Event SDK

```typescript
import { createFactoryEvent, validateFactoryEvent, normalizeFactoryEvent } from "@factory/core";

const event = createFactoryEvent({
  type: "tenant.certified",
  tenantId: "my-tenant",
  source: "my-app",
  payload: { version: "1.0.0" },
});
```

## Object SDK

```typescript
import { createFactoryObject, validateFactoryObject, linkFactoryObjects } from "@factory/core";
```

## Health SDK

```typescript
import { createHealthSnapshot, scoreHealth } from "@factory/core";
```

## Report SDK

```typescript
import { createFactoryReport, parseFactoryReportMetadata } from "@factory/core";
```

## Citadel SDK

```typescript
import { createCitadelArchivePackage, validateCitadelArchivePackageSdk } from "@factory/core";
```
