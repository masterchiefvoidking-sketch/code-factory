# Tenant Integration

This guide explains how a tenant repo adopts factory-core.

## Prerequisites

1. Your repo is a Factory tenant candidate with a stable `tenantId`
2. factory-standards defines the certification requirements for your integration mode
3. You install or vendor `@factory/core`

## Steps

### 1. Install factory-core

```bash
npm install @factory/core
```

Or copy/vendor this repo if you are not yet publishing to npm.

### 2. Create a certification package

```bash
npm run create:package -- --tenant your-tenant-id --output ./factory-certification
```

Fill in:

- `factory-manifest.json` — name, version, mission, integration mode
- `factory-audit.json` — audit findings and verdict
- `factory-health.json` — health checks and score
- `factory-qualification.json` — criteria results
- `factory-report.md` — human-readable summary

### 3. Validate locally before submission

```bash
npm run validate:package -- ./factory-certification
```

Fix all errors. Warnings may be acceptable depending on factory-standards policy.

### 4. Use SDK helpers in your app

- Emit events with `createFactoryEvent()`
- Register objects with `createFactoryObject()`
- Snapshot health with `createHealthSnapshot()`
- Generate reports with `createFactoryReport()`

Keep tenant-specific business logic in your repo. Use factory-core only for Factory contract compliance.

### 5. Submit for factory-standards validation

Copy your certification package to the factory-standards intake path (or open a PR per your org process). factory-standards validates; Factory imports qualified tenants.

## Integration modes

| Mode | Typical use |
|------|-------------|
| `embedded` | App runs inside Factory shell |
| `standalone` | Independent deployable service |
| `library` | Shared library consumed by other tenants |
| `service` | HTTP/gRPC backend |
| `sdk` | Developer toolkit (like factory-core itself) |

Choose the mode that matches factory-standards definitions for your repo.

## Checklist

- [ ] `tenantId` consistent across all certification files
- [ ] Required filenames present
- [ ] Validators pass for each JSON document
- [ ] Readiness score ≥ 70
- [ ] No fake `connected` status without health evidence
- [ ] No ownership overlaps with other tenants
