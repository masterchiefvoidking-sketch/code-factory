# Factory Ecosystem — Canonical Map

**Document role:** Governing blueprint for all future repair, feature, and certification work  
**Author role:** Factory Systems Architect  
**Created:** 2026-07-05  
**Evidence source:** `docs/audits/ACTUAL_STATE_AUDIT.md` in each repository  
**Rules applied:** No redesign. No invented capabilities. Unknowns marked explicitly.

---

## Evidence Availability Statement

| Repository | Audit file present? | Evidence quality |
|------------|--------------------|--------------------|
| **code-factory** (contains factory-core + nested factory-standards) | **Yes** — `docs/audits/ACTUAL_STATE_AUDIT.md` | **Full forensic audit** |
| **factory-standards** (logical repo; nested in code-factory) | **Partial** — covered inside code-factory audit + `factory-standards/docs/foundation/FACTORY_CORE_VALIDATION.md` | **Derived; no standalone audit file** |
| **Factory** (orchestration/import repo) | **No** | **UNKNOWN** — referenced as "provisional" in validation doc only |
| **Citadel** | **No** | **UNKNOWN** |
| **Forgina** | **No** | **UNKNOWN** |
| **BossLady** | **No** | **UNKNOWN** |
| **Horizon** | **No** | **UNKNOWN** |

Only one repository workspace was available for audit ingestion. All entries without a verified audit are marked **UNKNOWN** and must not be assumed to exist, function, or contain code beyond what cross-references state.

---

# PART 1 — ECOSYSTEM INVENTORY

## 1.1 code-factory / factory-core

| Field | Value |
|-------|-------|
| **Git remote** | `github.com/masterchiefvoidking-sketch/code-factory` |
| **npm package** | `@factory/core` v0.1.0 |
| **Documented name** | `factory-core` |
| **Purpose** | Shared TypeScript SDK: Factory types, validators, certification helpers, event/object/health/report/Citadel utilities |
| **Current maturity** | Early foundation v0.1 — functional, recently bootstrapped (audit) |
| **Primary responsibility** | Reusable code layer implementing factory-standards contracts |
| **Secondary responsibilities** | Self-certification host (`factory-certification/`); CLI for create/validate package |
| **Technologies** | TypeScript, Node.js ES2022 ESM, tsup, Vitest, ESLint, tsx |
| **Approximate size** | ~55 tracked files, ~2,041 LOC TS, ~32 KB built JS |
| **Current health** | **Healthy** — build ✓, lint ✓, typecheck ✓, 16/16 tests ✓, self-cert 100/100 |
| **Overall audit score** | **74 / 100** |

---

## 1.2 factory-standards (logical repo, nested)

| Field | Value |
|-------|-------|
| **Location** | `factory-standards/` inside code-factory git repo |
| **npm package** | `@factory/standards` v1.0.0 (`private: true`) |
| **Purpose** | Standards validation tooling: canonical schema constants, import intake, foundation-repo review |
| **Current maturity** | Early foundation — validates one import (factory-core) successfully |
| **Primary responsibility** | Validate certification packages submitted to `imports/<tenant-id>/` |
| **Secondary responsibilities** | Foundation registry (`FOUNDATION_REPOS`); official validation records in `docs/foundation/` |
| **Technologies** | TypeScript, Node.js, tsx; depends on `@factory/core` via `file:..` |
| **Approximate size** | Subset of code-factory (~schemas + 1 script + imports); not separately counted in audit |
| **Current health** | **Healthy for current scope** — typecheck ✓, factory-core import PASS, FOUNDATION_READY true |
| **Overall audit score** | **No independent score** — not separately audited. Inherits monorepo context. Estimated operational health aligned with code-factory audit **Factory readiness: 77** |

---

## 1.3 Factory (orchestration repo)

| Field | Value |
|-------|-------|
| **Audit** | **None** |
| **Purpose** | **UNKNOWN** — audit states expected owner of "Factory import/orchestration" |
| **Referenced status** | "provisional" per `factory-standards/docs/foundation/FACTORY_CORE_VALIDATION.md` |
| **Current maturity** | **UNKNOWN** |
| **Technologies** | **UNKNOWN** |
| **Size** | **UNKNOWN** |
| **Health** | **UNKNOWN** |
| **Overall audit score** | **UNKNOWN** |

---

## 1.4 Citadel

| Field | Value |
|-------|-------|
| **Audit** | **None** |
| **Purpose** | **UNKNOWN** — audit references "Citadel archiving workflow (future tenant)" and `createCitadelArchivePackage()` types in factory-core |
| **Referenced status** | Next tenant to certify (validation doc certification order) |
| **Current maturity** | **UNKNOWN** |
| **Technologies** | **UNKNOWN** |
| **Size** | **UNKNOWN** |
| **Health** | **UNKNOWN** |
| **Overall audit score** | **UNKNOWN** |

---

## 1.5 Forgina

| Field | Value |
|-------|-------|
| **Audit** | **None** |
| **Purpose** | **UNKNOWN** — named in certification order after Citadel |
| **Current maturity** | **UNKNOWN** |
| **Technologies** | **UNKNOWN** |
| **Size** | **UNKNOWN** |
| **Health** | **UNKNOWN** |
| **Overall audit score** | **UNKNOWN** |

---

## 1.6 BossLady

| Field | Value |
|-------|-------|
| **Audit** | **None** |
| **Purpose** | **UNKNOWN** — named in certification order only |
| **Current maturity** | **UNKNOWN** |
| **Technologies** | **UNKNOWN** |
| **Size** | **UNKNOWN** |
| **Health** | **UNKNOWN** |
| **Overall audit score** | **UNKNOWN** |

---

## 1.7 Horizon

| Field | Value |
|-------|-------|
| **Audit** | **None** |
| **Purpose** | **UNKNOWN** — named in certification order only |
| **Current maturity** | **UNKNOWN** |
| **Technologies** | **UNKNOWN** |
| **Size** | **UNKNOWN** |
| **Health** | **UNKNOWN** |
| **Overall audit score** | **UNKNOWN** |

---

# PART 2 — RESPONSIBILITY MATRIX

## factory-core (`@factory/core`)

**OWNS:**
- Factory domain TypeScript types (manifest, audit, health, qualification, event, object, report, Citadel archive, certification package)
- Runtime validators for Factory JSON documents
- Certification package create / read / write / score / layout validation
- SDK helpers: events, objects, health snapshots, reports, Citadel archive structures
- Mirror of standards enums in `src/standards/constants.ts` (compatibility layer)
- Self-certification package for tenantId `factory-core`
- CLI: `create:package`, `validate:package` (core-level validation)

**MUST NOT own:**
- Canonical standards law (long-term source of truth)
- Tenant application features (Citadel, Forgina, BossLady, Horizon UI/logic)
- Factory import orchestration execution
- Independent certification judgment (pass/fail gate for ecosystem)
- Persistent storage of tenant data (audit: in-memory only for events/objects; file I/O only for certification packages)

**Consumes:**
- factory-standards enum/layout definitions (mirrored, not imported at runtime from separate package)

**Provides:**
- `@factory/core` npm library (ESM + types)
- Certification tooling for tenant repos
- Validation primitives used by factory-standards

---

## factory-standards (`@factory/standards`)

**OWNS:**
- Canonical constants in `factory-standards/schemas/constants.ts`
- Foundation repo registry (`FOUNDATION_REPOS`, `FOUNDATION_INTEGRATION_MODES`)
- Import intake directory structure: `imports/<tenant-id>/`
- Foundation-repo review heuristics (mission, integration mode, no tenant behavior, no standards ownership)
- Official validation records (`validation-report.json/md`, `docs/foundation/*`)

**MUST NOT own:**
- Shared SDK implementation (belongs to factory-core)
- Tenant app runtime behavior
- Factory import execution

**Consumes:**
- `@factory/core` — validation functions, certification package reading, detectFakeConnectedStatus

**Provides:**
- Standards-side `validate:package` with FOUNDATION_READY / TENANT_ROLLOUT_READY flags
- Certification gate decisions for submitted packages

---

## Factory (orchestration repo)

**OWNS:** **UNKNOWN**

**MUST NOT own:** **UNKNOWN**

**Consumes:** **UNKNOWN** — audit expects readiness score + validation result as import gate

**Provides:** **UNKNOWN** — audit expects "Factory imports qualified tenants"

---

## Citadel / Forgina / BossLady / Horizon

**OWNS:** **UNKNOWN** for all four

**MUST NOT own:** **UNKNOWN**

**Consumes:** **UNKNOWN** — audit expects tenants may use `@factory/core` via npm/git vendor/`file:`

**Provides:** **UNKNOWN**

---

# PART 3 — ECOSYSTEM LAYERS

Evidence-based layer assignment. Layers without audited repos contain only documented references or UNKNOWN placeholders.

```text
Layer 1 — Standards (Law)
├── factory-standards          [AUDITED: nested, operational]
└── Status: Validates imports; one certified import (factory-core)

Layer 2 — Shared SDK (Factory Language)
├── factory-core (@factory/core) [AUDITED: operational]
└── Status: Self-certified 100/100; TENANT_ROLLOUT_READY true

Layer 3 — Brains
└── UNKNOWN — no repository audited; no audit evidence of existence

Layer 4 — Operating Systems
└── UNKNOWN — no repository audited; no audit evidence of existence

Layer 5 — Applications / Tenants
├── Citadel                      [UNKNOWN — named, not audited]
├── Forgina                      [UNKNOWN — named, not audited]
├── BossLady                     [UNKNOWN — named, not audited]
├── Horizon                      [UNKNOWN — named, not audited]
└── Status: Referenced in certification order; zero verified code

Layer 6 — Orchestration
├── Factory repo                 [UNKNOWN — "provisional" reference only]
└── Status: Expected import/orchestration owner per audit; not present in workspace

Layer 7 — Archived / Experimental
└── UNKNOWN — no audited archived or experimental repos identified
```

**Observed architectural tension (audit evidence):** Layers 1 and 2 physically coexist in one git repository (`code-factory`) while documentation describes them as separate foundation repos.

---

# PART 4 — MATURITY

Maturity scale: **0 Idea → 1 Scaffold → 2 Prototype → 3 Beta → 4 Daily Driver → 5 Foundation**

| Repository | Level | Rationale (audit evidence) |
|------------|-------|----------------------------|
| **factory-core** | **5 — Foundation** | Working SDK, zero runtime deps, all quality gates pass, self-certified, standards-validated, TENANT_ROLLOUT_READY true. v0.1 but serves as ecosystem language layer. |
| **factory-standards** | **5 — Foundation** | Operational validation loop proven on factory-core import; canonical schemas exist; foundation review implemented. Co-located and incomplete tenant coverage (one import only). |
| **Factory** | **UNKNOWN** | Referenced as "provisional" — insufficient audit evidence to assign level |
| **Citadel** | **UNKNOWN** | Named as next certify target; no repo audit |
| **Forgina** | **UNKNOWN** | Named only |
| **BossLady** | **UNKNOWN** | Named only |
| **Horizon** | **UNKNOWN** | Named only |

**Note:** factory-core and factory-standards earn Foundation on **functional role**, not completeness. Audit overall score 74/100 reflects provisional packaging (no npm publish, no CI, monorepo layout).

---

# PART 5 — INTEGRATION MAP

## Verified integrations (audit evidence)

```text
factory-core ──self-certifies──► factory-certification/
                                        │
                                        │ copy
                                        ▼
factory-standards/imports/factory-core/
        │
        │ npm run validate:package
        │ (uses @factory/core via file:..)
        ▼
validation-report.json / .md
FOUNDATION_READY: true
TENANT_ROLLOUT_READY: true
```

| From | To | Interface | Status |
|------|-----|-----------|--------|
| factory-core | factory-standards | Certification package (5 files) copied to `imports/<tenant>/` | **Verified** — factory-core only |
| factory-standards | factory-core | `@factory/core` npm `file:..` dependency | **Verified** |
| Tenant repos | factory-core | npm install / git vendor / `file:` | **Designed, not verified** — no tenant repo audited |
| factory-core | Citadel | `createCitadelArchivePackage()` types | **Types only** — no live integration |
| factory-standards | Factory | **UNKNOWN** | Expected post-validation import — not verified |
| Citadel | factory-core | **UNKNOWN** | Referenced in docs |
| Any tenant | factory-standards | Submit package to imports | **Verified path for factory-core only** |

## Required interfaces (from audit — factory-core exports)

**Certification package files (required):**
- `factory-manifest.json`
- `factory-audit.json`
- `factory-health.json`
- `factory-qualification.json`
- `factory-report.md`

**Required certification flow (documented):**
1. Tenant uses factory-core to generate package
2. Tenant validates locally via `npm run validate:package`
3. Package copied to `factory-standards/imports/<tenant-id>/`
4. factory-standards runs `npm run validate:package`
5. **UNKNOWN:** Factory import step
6. **UNKNOWN:** Citadel archive step

## Required outputs (verified for factory-core)

- Readiness score (0–100, min 70 for import eligible)
- ValidationResult `{ valid, errors, warnings }`
- FOUNDATION_READY / TENANT_ROLLOUT_READY (standards validator only)

## Unknown integrations

- Factory repo import mechanism
- Citadel archive execution
- All tenant-to-tenant communication
- External APIs (audit: none in factory-core)
- npm registry publish path for `@factory/core`
- CI/CD across repos
- Brains / Operating Systems layers (existence unknown)

---

# PART 6 — DUPLICATION ANALYSIS

Identified from audit evidence only. No redesign proposed.

| Category | Duplication | Location / evidence |
|----------|-------------|----------------------|
| **Duplicate concepts** | Standards constants defined twice | `src/standards/constants.ts` vs `factory-standards/schemas/constants.ts` — files differ |
| **Duplicate concepts** | Types vs contracts | `src/contracts/` re-exports `src/types/` — redundant alias |
| **Duplicate engines** | Package validation CLI | Root `scripts/validate-package.ts` vs `factory-standards/scripts/validate-package.ts` — different scope but overlapping validation |
| **Duplicate engines** | Readiness scoring path | `src/certification/scoring.ts` re-exports from `checks.ts` (1 line) |
| **Duplicate dashboards** | **None identified** | No UI in any audited repo |
| **Duplicate storage** | Certification package copies | `factory-certification/` vs `factory-standards/imports/factory-core/` — intentional duplicate per workflow |
| **Duplicate documentation** | Ecosystem role docs | Multiple docs explain standards↔core relationship (HOW_CORE_RELATES, STANDARDS_COMPATIBILITY, FACTORY_CORE_README) |
| **Duplicate responsibility** | Standards validation + SDK validation | factory-core validates packages; factory-standards also validates using factory-core — layered, not identical |
| **Duplicate responsibility** | Repo identity | Git `code-factory`, npm `@factory/core`, docs `factory-core`, nested `factory-standards` — naming overlap |
| **Duplicate responsibility** | Layer 1 + Layer 2 in one git repo | Documented as separate foundation repos, co-located in one repository |

---

# PART 7 — REPAIR PRIORITY

Ordered queue for **future repair work** (not started). Position reflects audit evidence: dependencies, certification order, and risk.

| Priority | Repository | Why this position |
|----------|------------|-------------------|
| **1** | **Obtain audits for un-audited repos** | Cannot govern what is not evidenced. Citadel, Factory, Forgina, BossLady, Horizon are UNKNOWN. |
| **2** | **Citadel** | Documented next tenant to certify (`FACTORY_CORE_VALIDATION.md`). Proves factory-core works outside self-cert. |
| **3** | **Factory** | Import/orchestration gate between standards validation and ecosystem use — referenced as provisional; blocks end-to-end loop. |
| **4** | **factory-standards / factory-core topology** | Audit flags monorepo vs split-repo as top investigation item; drift risk on duplicated constants. No repair until audits complete for dependent repos. |
| **5** | **Forgina** | Certification order: after Citadel. |
| **6** | **BossLady** | Certification order: after Forgina. |
| **7** | **Horizon** | Certification order: last named tenant. |
| **8** | **factory-core operational gaps** | npm publish, CI, coverage, LICENSE file, independent audit — audit lists as gaps, not blockers. |
| **9** | **factory-standards minor fixes** | validation-report files trigger layout warnings — audit safe-repair item. |

**Explicitly not in queue yet:** Brains, Operating Systems, Archived layers — no audit evidence they exist.

---

# PART 8 — CERTIFICATION GATES

Gates derived from **verified** factory-core + factory-standards behavior. Higher maturity levels add requirements inferred from audit gaps — marked where not yet verified.

## Level 0 — Idea

| Gate | Requirement |
|------|-------------|
| Minimum tests | **UNKNOWN** |
| Documentation | **UNKNOWN** |
| Qualification | None |
| Factory certification | None |
| Required scripts | None |
| Required CI | None |

## Level 1 — Scaffold

| Gate | Requirement |
|------|-------------|
| Minimum tests | **UNKNOWN** |
| Documentation | README exists |
| Qualification | None |
| Factory certification | None |
| Required scripts | **UNKNOWN** |
| Required CI | None |

## Level 2 — Prototype

| Gate | Requirement |
|------|-------------|
| Minimum tests | Some tests exist (audit: factory-core has 16) |
| Documentation | Basic docs beyond README |
| Qualification | Package can be created (`create:package`) |
| Factory certification | Local `validate:package` passes |
| Required scripts | `validate:package`, `create:package` |
| Required CI | **UNKNOWN** — not present in audit |

## Level 3 — Beta

| Gate | Requirement |
|------|-------------|
| Minimum tests | All tests pass; coverage **UNKNOWN** (not configured) |
| Documentation | Integration guide (audit: TENANT_INTEGRATION.md exists for factory-core) |
| Qualification | `status: qualified` in factory-qualification.json |
| Factory certification | Readiness score ≥ 70 (verified MIN_READINESS_SCORE) |
| Required scripts | build, test, lint, typecheck (verified for factory-core) |
| Required CI | **UNKNOWN** — audit: no `.github/workflows` |

## Level 4 — Daily Driver

| Gate | Requirement |
|------|-------------|
| Minimum tests | Sustained pass rate + coverage threshold — **threshold UNKNOWN** |
| Documentation | Complete operational docs |
| Qualification | Independent qualification audit — **not verified** (factory-core uses self-audit) |
| Factory certification | factory-standards import PASS |
| Required scripts | Full script suite + publish pipeline — **publish UNKNOWN** |
| Required CI | Automated build/test/lint on PR — **UNKNOWN** |

## Level 5 — Foundation

| Gate | Requirement |
|------|-------------|
| Minimum tests | 16/16 pass (factory-core verified); tenant repos **UNKNOWN** |
| Documentation | Role boundary docs (verified: what repo is / is not) |
| Qualification | All criteria passed; readiness ≥ 70 |
| Factory certification | factory-standards validation PASS + FOUNDATION_READY true (verified for factory-core) |
| Required scripts | `validate:package`, `create:package`, build, test, lint, typecheck |
| Required CI | **UNKNOWN** — not verified for any foundation repo |

**Verified foundation certification package contents:**
- factory-manifest.json (tenantId, integrationMode, mission, status)
- factory-audit.json (verdict, standardsVersion)
- factory-health.json (checks, score)
- factory-qualification.json (criteria, status)
- factory-report.md

---

# PART 9 — SUCCESS CRITERIA

What the **completed** Factory ecosystem looks like — defined as observable outcomes, not redesign proposals.

## Reliability

- Every repo has an independent `ACTUAL_STATE_AUDIT.md` kept current
- Certification packages validate locally and at factory-standards with consistent results
- No undocumented drift between standards constants and core mirrors
- Import gate (Factory repo) operates on verified validation output — **currently UNKNOWN**

## Integration

- End-to-end loop verified: **tenant → factory-core → factory-standards → Factory → Citadel**
- Today verified segment: **factory-core → factory-standards** only
- Each tenant consumes `@factory/core` through a documented, reproducible install path (npm or approved alternative)
- Required certification filenames and schema versions stable across ecosystem

## Testing

- All repos: build, lint, typecheck pass in CI — **CI existence UNKNOWN**
- factory-core: tests pass (16/16 verified); coverage tooling configured — **not yet**
- Tenant repos: minimum test gate per certification level — **UNKNOWN**

## Maintainability

- One canonical owner per responsibility (standards law vs SDK code vs tenant features)
- Clear git repo topology (split or monorepo — decision **UNKNOWN**, must be documented)
- No duplicated constants without automated sync or single source of truth
- LICENSE, CHANGELOG, CONTRIBUTING present in foundation repos — **partially missing per audit**

## Performance

- factory-core: fast build/test verified (~253ms tests, ~660ms dts build)
- Tenant performance criteria: **UNKNOWN**

## Developer experience

- New engineer can install factory-core, create certification package, validate locally in documented steps — **verified**
- New engineer can understand any repo from audit + this canonical map
- CLI exit codes and error messages sufficient for automation — **partially verified**

## Minimal duplication

- Single canonical standards schema source
- Single validation authority for certification judgment (factory-standards)
- Single SDK implementation (factory-core)
- No tenant reimplements Factory types/validators

## Clear ownership

| Concern | Owner |
|---------|-------|
| Standards law | factory-standards |
| Shared code | factory-core |
| Import orchestration | Factory repo (**UNKNOWN**) |
| Archive execution | Citadel (**UNKNOWN**) |
| App features | Respective tenant repos (**UNKNOWN**) |

---

# APPENDIX A — AUDIT SCORES (factory-core / code-factory)

From `docs/audits/ACTUAL_STATE_AUDIT.md` — the only verified audit.

| Dimension | Score |
|-----------|-------|
| Mission clarity | 82 |
| Architecture | 75 |
| Code quality | 80 |
| Documentation | 78 |
| Testing | 65 |
| Maintainability | 72 |
| Scalability | 60 |
| UX | 50 (no UI; CLI only) |
| Performance | 85 |
| Factory readiness | 77 |
| **Overall maturity** | **74** |

---

# APPENDIX B — CERTIFICATION ORDER (documented reference)

From `factory-standards/docs/foundation/FACTORY_CORE_VALIDATION.md` — not independently audited.

```text
factory-standards  ✅ validated (in workspace)
factory-core       ✅ validated
Factory repo       ✅ provisional  ← not verified by audit
Citadel            ⏭ next
Forgina            after Citadel
BossLady
Horizon
```

---

# APPENDIX C — GLOBAL UNKNOWNS

1. Existence, code, and maturity of Factory, Citadel, Forgina, BossLady, Horizon repos
2. Existence of Brains and Operating Systems layer repos
3. Final git topology (monorepo vs multi-repo)
4. External factory-standards remote (if any) separate from nested folder
5. npm publish plan and registry for `@factory/core`
6. JSON Schema as authoritative spec vs hand-coded validators
7. CI/CD requirements and implementation
8. Independent audit process vs self-audit
9. Factory import mechanism after standards validation
10. Citadel archive integration beyond type definitions in factory-core

---

# APPENDIX D — GOVERNANCE RULES FOR FUTURE WORK

Every future repair, feature, or certification **must**:

1. Cite evidence from an `ACTUAL_STATE_AUDIT.md` or update that audit after material change
2. Respect the responsibility matrix in Part 2
3. Not assign tenant features to factory-core or standards law to factory-core
4. Not invent capabilities for UNKNOWN repos
5. Follow certification gates in Part 8 for the target maturity level
6. Follow repair priority in Part 7 unless a higher-priority dependency blocks work
7. Update this canonical map when a new repo is audited or a verified integration changes

---

*This document is architecture governance only. No repository was modified except creation of this file.*
