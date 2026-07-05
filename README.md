# @factory/core

Shared TypeScript SDK for the Factory ecosystem — types, validators, certification helpers, events, objects, health, reports, and Citadel utilities.

## Install

```bash
npm install
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build ESM + type declarations |
| `npm test` | Run Vitest test suite |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run validate:package -- ./path` | Validate a certification package |
| `npm run create:package -- --tenant id` | Create empty certification package |

## Documentation

- [docs/FACTORY_CORE_README.md](docs/FACTORY_CORE_README.md)
- [docs/STANDARDS_COMPATIBILITY.md](docs/STANDARDS_COMPATIBILITY.md)
- [docs/HOW_CORE_RELATES_TO_STANDARDS.md](docs/HOW_CORE_RELATES_TO_STANDARDS.md)
- [docs/SDK_USAGE.md](docs/SDK_USAGE.md)
- [docs/TENANT_INTEGRATION.md](docs/TENANT_INTEGRATION.md)

## Self-certification

```bash
npm run validate:package -- ./factory-certification
```

Certified copy for factory-standards validation: `factory-standards/imports/factory-core/`.
