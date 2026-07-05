# factory-core Validation — factory-standards Official Record

**Validated:** 2026-07-05  
**Standards version:** 1.0.0  
**Import path:** `imports/factory-core/`  
**Tenant ID:** `factory-core`

---

## Validation Result

| Field | Value |
|-------|-------|
| **Result** | **PASS** |
| **Readiness score** | 100 / 100 |
| **Import eligible** | yes |
| **FOUNDATION_READY** | `true` |
| **TENANT_ROLLOUT_READY** | `true` |

Reports: `imports/factory-core/validation-report.json`, `imports/factory-core/validation-report.md`

---

## What factory-core Is

factory-core is a **foundation repo**, not a tenant application.

| Claim | Verified |
|-------|----------|
| tenantId is `factory-core` | yes |
| Mission identifies shared SDK role | yes |
| Owns shared code helpers, validators, types, SDK | yes |
| Does NOT own tenant behavior | yes |
| Does NOT own Factory standards | yes |
| Does NOT own app features | yes |
| Integration mode is honest (`sdk`) | yes |
| No fake connected claims | yes — status is `certified`, not `connected` |
| Schemas align with factory-standards | yes — standardsVersion 1.0.0, enums match |

---

## Foundation Review Checklist

- [x] tenant-id — `factory-core`
- [x] mission-sdk-role — shared TypeScript SDK mission statement
- [x] owns-shared-code — report documents validators, types, SDK surface
- [x] no-tenant-behavior — no user-facing app feature claims
- [x] no-standards-ownership — implements standards, does not define them
- [x] integration-mode-honest — `sdk` mode appropriate for foundation SDK repo
- [x] foundation-repo-registered — listed in factory-standards foundation registry

---

## Warnings

None.

---

## Gaps (non-blocking)

1. **Self-audit** — audit performed by `factory-core-self-audit`. Independent standards-side audit recommended before broad tenant rollout, but package structure and schema compliance are verified.
2. **npm publish** — `@factory/core` is not yet published to npm. Tenant repos can vendor from git or use `file:` dependency until publish.

---

## Required Fixes Before Tenant Rollout

**None.** factory-core is approved for tenant use via git vendoring or local dependency.

Optional improvements (not blockers):

- Publish `@factory/core` to npm registry
- Replace self-audit with independent standards auditor on next certification cycle

---

## Can factory-core Be Used by Tenant Repos?

**Yes.** Tenant repos can:

1. Install or vendor `@factory/core`
2. Use `create:package` and `validate:package` CLI helpers
3. Generate certification packages that factory-standards can validate
4. Share official Factory types, validators, and certification helpers

factory-core does not invent conflicting contracts — its `src/standards/` layer mirrors factory-standards enums and layout constants.

---

## Certification Order Status

```text
factory-standards  ✅ validated (this repo)
factory-core       ✅ validated (this document)
Factory repo       ✅ provisional
Citadel            ⏭ next
Forgina            after Citadel
BossLady
Horizon
```

**Next tenant to certify:** Citadel

---

## How to Re-run Validation

```bash
cd factory-standards
npm install
npm run validate:package -- imports/factory-core
```

Do not patch standards to make a failing package pass dishonestly. If validation fails, identify whether the issue is in the factory-core package or the standards schema and fix at the source.
