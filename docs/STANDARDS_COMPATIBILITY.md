# Standards Compatibility

factory-core is the official reusable code layer that implements factory-standards.

## Roles

- **factory-standards** defines rules — schemas, protocols, audit criteria, certification requirements
- **factory-core** implements reusable code — types, validators, SDK helpers
- **Tenant repos** use factory-core to generate valid certification packages
- **factory-standards** validates submitted packages and decides import eligibility

## Compatibility layer

The `src/standards/` module mirrors factory-standards without redefining conflicting schemas:

| Constant | Purpose |
|----------|---------|
| `CERTIFICATION_REQUIRED_FILES` | Required certification filenames |
| `CERTIFICATION_PACKAGE_LAYOUT_VERSION` | Package layout version |
| `INTEGRATION_MODES` | Valid tenant integration modes |
| `TENANT_STATUSES` | Valid tenant lifecycle statuses |
| `HEALTH_STATUSES` | Valid health snapshot statuses |
| `QUALIFICATION_STATUSES` | Valid qualification statuses |
| `MIN_READINESS_SCORE` | Minimum score for import eligibility |

## Certification helpers

factory-core provides helpers aligned with factory-standards audit rules:

- `validatePackageLayout()` — required files present
- `checkTenantIdConsistency()` — tenantId matches across documents
- `detectFakeConnectedStatus()` — connected status backed by health evidence
- `detectOwnershipOverlap()` — duplicate owner claims across tenants
- `computeReadinessScore()` — weighted readiness for import

## Self-certification

factory-core certifies itself under tenant ID `factory-core`. The package lives in:

- `factory-certification/` (source of truth in this repo)
- `factory-standards/imports/factory-core/` (copy for standards-side validation)

Validate locally:

```bash
npm run validate:package -- ./factory-certification
npm run validate:package -- ./factory-standards/imports/factory-core
```

## When standards change

1. Update factory-standards documentation and schemas
2. Mirror changes in `src/standards/`
3. Update validators and tests in factory-core
4. Re-run self-certification and copy the updated package to imports
