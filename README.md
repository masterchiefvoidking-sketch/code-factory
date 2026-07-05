# @factory/core (factory-core)

Shared TypeScript SDK for the Factory ecosystem — types, validators, certification helpers, events, objects, health, reports, and Citadel utilities.

> **Naming:** GitHub repo may be `code-factory`, npm package is `@factory/core`, ecosystem role is **factory-core**. See [docs/NAMING.md](docs/NAMING.md).

## Install

```bash
npm install
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build ESM + type declarations |
| `npm test` | Run Vitest test suite |
| `npm run test:coverage` | Run tests with coverage report (no enforced threshold) |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run validate:package -- ./path` | Validate a certification package |
| `npm run create:package -- --tenant id` | Create empty certification package (placeholder defaults) |

## Documentation

- [docs/NAMING.md](docs/NAMING.md) — repo vs package vs ecosystem role
- [docs/FACTORY_CORE_README.md](docs/FACTORY_CORE_README.md)
- [docs/STANDARDS_COMPATIBILITY.md](docs/STANDARDS_COMPATIBILITY.md)
- [docs/HOW_CORE_RELATES_TO_STANDARDS.md](docs/HOW_CORE_RELATES_TO_STANDARDS.md)
- [docs/SDK_USAGE.md](docs/SDK_USAGE.md)
- [docs/TENANT_INTEGRATION.md](docs/TENANT_INTEGRATION.md)
- [docs/repair/REPAIR_PLAN.md](docs/repair/REPAIR_PLAN.md)

## Self-certification

```bash
npm run validate:package -- ./factory-certification
```

## External fixture proof

```bash
npm run validate:package -- ./examples/fixtures/demo-tenant-certification
```

Certified copy for factory-standards validation: `factory-standards/imports/factory-core/`.
