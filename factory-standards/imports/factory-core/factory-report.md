# factory-core Certification Report

Shared TypeScript SDK for Factory contracts, validation, events, objects, health, reports, and certification helpers.

## Summary

factory-core implements the reusable code layer defined by factory-standards. It provides official types, validators, and certification helpers so tenant repos do not reimplement Factory language.

## Standards Alignment

- Certification package layout matches factory-standards required filenames
- Integration modes, tenant statuses, health statuses, and qualification statuses use factory-standards enums
- Validators enforce schema shape without inventing conflicting fields

## SDK Surface

- Types: manifest, audit, health, qualification, event, object, report, Citadel archive
- Validators for all certification documents
- Certification SDK: create, read, score, layout validation, readiness scoring
- Event, object, health, report, and Citadel helpers

## Self-Certification

This package was generated and validated using factory-core itself. Run:

```bash
npm run validate:package -- ./factory-certification
```

## Readiness

All qualification criteria passed. factory-core is ready to support tenant repos installing `@factory/core`.
