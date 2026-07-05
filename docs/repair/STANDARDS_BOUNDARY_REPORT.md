# Standards Boundary Report

**Date:** 2026-07-05  
**Scope:** Investigate co-located `factory-standards/` inside the code-factory / factory-core repository  
**Action taken:** Document only — **not deleted, not merged**

---

## What Exists

```text
factory-standards/
├── package.json              @factory/standards (private)
├── schemas/constants.ts      Canonical constants (standards-side)
├── scripts/validate-package.ts  Foundation review + validation reports
├── imports/factory-core/     Imported certification package + validation reports
├── docs/foundation/          Official validation records
└── README.md
```

The repository root (`@factory/core`) also contains:

```text
src/standards/constants.ts    Mirror of shared enum/layout constants
factory-certification/        factory-core self-certification source
```

---

## Classification

| Content | Classification | Rationale |
|---------|----------------|-----------|
| `factory-standards/` directory | **Co-located logical repo** | Separate `package.json`, separate purpose (validation gate vs SDK) |
| `factory-standards/schemas/constants.ts` | **Standards-side canonical copy** | Comments claim canonical; includes `FOUNDATION_REPOS`, `STANDARDS_VERSION` |
| `src/standards/constants.ts` | **SDK mirror** | Comments say "mirrors factory-standards"; includes TypeScript types, `CERTIFICATION_FILE_TYPES`, `TENANT_ID_FIELDS` |
| `factory-standards/imports/factory-core/` | **Intentional import intake copy** | Certification workflow artifact, not duplicate code |
| `factory-certification/` | **Self-cert source of truth** | Copied to imports for standards validation |
| `factory-standards` dependency on `@factory/core` | **Expected integration** | Standards consumes SDK validators; not duplication |

**Verdict:** Not accidental junk. Not a test fixture. **Co-located foundation repos** with documented workflow overlap and constant duplication risk.

---

## Duplicate vs Vendored vs Accidental

| Item | Verdict |
|------|---------|
| Shared enum arrays in two `.ts` files | **Duplicate** — drift risk |
| Two `validate:package` scripts | **Layered, not duplicate** — core validates schema; standards adds foundation review |
| Two certification package directories | **Vendored/copy workflow** — intentional |
| Entire `factory-standards/` tree | **Co-located repo** — topology confusion, not code duplication |

---

## Should It Remain?

**Yes, for Pass 1.** Reasons:

1. Working cross-repo loop proven: factory-core self-cert → standards import → PASS
2. Deleting would break documented validation workflow
3. Audit safe-recommendations: preserve factory-standards foundation review checks
4. Canonical map: repair priority #4 addresses topology **after** more tenant audits — not now

---

## Drift Risk from factory-standards

| Risk | Mitigation (Pass 1) |
|------|---------------------|
| Enum values diverge between mirror and canonical | Drift test in `tests/standards-drift.test.ts` |
| Standards adds fields factory-core doesn't know | Standards owns law; factory-core must update mirror when standards change |
| factory-core invents conflicting constants | Mirror comments + drift test |
| Validation reports in import dir trigger layout warnings | Known issue — standards-side, out of Pass 1 scope |

---

## Boundary Rules (factory-core must NOT)

- Define `FOUNDATION_REPOS` or foundation review heuristics (standards owns)
- Write `FOUNDATION_READY` / `TENANT_ROLLOUT_READY` flags (standards owns)
- Claim ownership of standards law in certification reports

## Boundary Rules (factory-core MUST)

- Mirror shared enum/layout values in `src/standards/constants.ts`
- Provide validators and SDK consumed by standards tooling
- Keep self-certification at `factory-certification/` separate from `imports/`

---

## Recommendation

| Now (Pass 1) | Later |
|--------------|-------|
| Keep co-located layout | Investigate separate git repo per canonical map priority #4 |
| Drift test guard | Single source code generation or shared package |
| Document boundary (this file) | Independent factory-standards audit file |

---

## Conclusion

`factory-standards/` is **co-located standards tooling**, not accidental duplication of factory-core. The real defect is **dual constant files** without sync enforcement — addressed by drift test in Pass 1, not by deletion or merge.
