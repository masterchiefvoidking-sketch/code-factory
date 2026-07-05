# Factory Core

`@factory/core` is the shared TypeScript SDK for the Factory ecosystem.

## What this repo is

- Reusable code: types, validators, SDK helpers, certification utilities
- Implements rules defined by **factory-standards**
- Does **not** contain tenant app features

## What this repo is not

- Not the standards/law repo (that is **factory-standards**)
- Not a replacement for per-tenant certification work

## Quick start

```bash
npm install
npm run build
npm test
npm run validate:package -- ./factory-certification
```

## Package exports

See [SDK_USAGE.md](./SDK_USAGE.md) for function-level documentation.

## Relationship to factory-standards

See [HOW_CORE_RELATES_TO_STANDARDS.md](./HOW_CORE_RELATES_TO_STANDARDS.md) and [STANDARDS_COMPATIBILITY.md](./STANDARDS_COMPATIBILITY.md).

## Tenant integration

See [TENANT_INTEGRATION.md](./TENANT_INTEGRATION.md).
