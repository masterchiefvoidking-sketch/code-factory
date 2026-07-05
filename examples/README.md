# Examples

## External fixture (demo tenant)

Minimal certification package proving `@factory/core` validates a **non-factory-core** tenant:

```bash
npm run validate:package -- ./examples/fixtures/demo-tenant-certification
npm test -- tests/external-fixture.test.ts
```

Fixture tenantId: `demo-tenant` (not `factory-core`).

## Self-certification (factory-core)

```bash
npm run validate:package -- ./factory-certification
```

## Create empty package for a new tenant

```bash
npm run create:package -- --tenant citadel --output ./examples/citadel-certification
```

Empty packages use **placeholder defaults** — schema-valid but not production-ready until filled in.

## Next cross-repo proof

**Citadel certification** is the next step per audit — requires Citadel repo, not available from factory-core alone.
