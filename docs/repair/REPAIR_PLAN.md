# factory-core Repair Plan — Completion Pass 1

**Date:** 2026-07-05  
**Source of truth:** `docs/audits/ACTUAL_STATE_AUDIT.md`  
**Scope:** SDK foundation baseline only — no architecture redesign

---

## Goal

Bring factory-core (`@factory/core`) to a clean SDK foundation baseline: truthful docs, standards boundary clarity, drift protection, optional coverage, external fixture proof, and verified quality gates.

---

## Confirmed Defects (from audit)

| ID | Defect | Severity |
|----|--------|----------|
| D1 | Git repo `code-factory` ≠ npm `@factory/core` ≠ docs term `factory-core` | Medium — onboarding confusion |
| D2 | `factory-standards/` nested in same git repo — topology confusion | Medium — boundary blur |
| D3 | Standards constants duplicated (`src/standards/constants.ts` vs `factory-standards/schemas/constants.ts`) | High — drift risk |
| D4 | Test coverage not configured | Low — visibility gap |
| D5 | `examples/` README-only — no runnable external proof | Medium — SDK reuse unproven outside self-cert |
| D6 | `createEmptyCertificationPackage()` uses intentional placeholders | Low — must be documented, not mistaken for production-ready |
| D7 | No LICENSE file (MIT declared in package.json only) | Low — legal clarity |
| D8 | No CI (`.github/workflows`) | Medium — gates not automated |
| D9 | `@factory/core` not published to npm | Medium — tenants must vendor |
| D10 | Self-audit certification (`factory-core-self-audit`) | Low — independent audit deferred |
| D11 | 1 low npm audit (esbuild transitive) | Low |

---

## Naming / Topology Confusion

| Name | What it is |
|------|------------|
| **code-factory** | GitHub git repository remote name |
| **@factory/core** | npm package name (what tenants install) |
| **factory-core** | Ecosystem role / tenantId for this SDK foundation repo |

**Pass 1 action:** Document in `docs/NAMING.md` and README — do not rename repo or package.

---

## Duplicated Constants

Shared enum arrays and scalar values must match between:

- `src/standards/constants.ts` (factory-core mirror)
- `factory-standards/schemas/constants.ts` (co-located standards copy)

**Pass 1 action:** Option B — drift test that fails CI if shared values diverge. No risky import refactor.

---

## Coverage Gap

Audit: `vitest run --coverage` fails — missing `@vitest/coverage-v8`.

**Pass 1 action:** Add dependency + `npm run test:coverage` with no enforced thresholds.

---

## Placeholder / Default Package Risks

`createEmptyCertificationPackage()` defaults:

- `status: "draft"`, `auditor: "pending"`, `verdict: "conditional"`
- `health.status: "unknown"`, `qualification.status: "unqualified"`, scores 0

**Risk:** Tenant submits empty package believing it is cert-ready.

**Pass 1 action:** Document in SDK + test that empty packages are placeholders and fail production scoring.

---

## Example Gap

No fixture demonstrating validation of a non-`factory-core` tenant package.

**Pass 1 action:** Add `examples/fixtures/demo-tenant-certification/` + test.

**Citadel:** Not available in this repo — documented as next cross-repo proof per audit.

---

## Safest Repair Order

1. Document repair plan (this file)
2. Name/truth alignment docs
3. Standards boundary report
4. Constant drift test
5. Coverage baseline
6. External fixture + test
7. Placeholder documentation + tests
8. Run full verification
9. Record repair result

---

## Done Criteria

- [x] `docs/repair/REPAIR_PLAN.md` exists
- [x] `docs/NAMING.md` clarifies repo vs package vs role
- [x] `docs/repair/STANDARDS_BOUNDARY_REPORT.md` exists
- [x] Drift test passes and would fail on intentional mismatch
- [x] `npm run test:coverage` works
- [x] `examples/fixtures/demo-tenant-certification/` validates via core helpers
- [x] Placeholder behavior tested and documented
- [x] `npm install`, `test`, `build`, `lint`, `typecheck` all pass
- [x] `docs/repair/REPAIR_RESULT.md` records exact outputs
- [x] No repo rename, no standards merge, no UI, no invented integrations

---

## Explicitly Out of Scope (Pass 1)

- Renaming git repo or npm package
- Deleting or merging `factory-standards/`
- Citadel certification (cross-repo)
- CI pipeline setup
- npm publish
- LICENSE file addition (deferred — not in pass scope unless trivial)
- Fixing factory-standards validation-report layout warnings
