# Naming — Repository vs Package vs Ecosystem Role

factory-core uses three names in different contexts. They are **not bugs** — they serve different purposes.

---

## Quick Reference

| Context | Name | Example |
|---------|------|---------|
| **Git remote / GitHub** | `code-factory` | `github.com/masterchiefvoidking-sketch/code-factory` |
| **npm package** | `@factory/core` | `npm install @factory/core` |
| **Ecosystem role / tenantId** | `factory-core` | Self-certification `tenantId: "factory-core"` |

---

## GitHub repository: `code-factory`

The git remote and GitHub repository may be named **code-factory**. This is the **host repository** that currently contains:

- The `@factory/core` SDK source (repository root)
- Co-located `factory-standards/` tooling (nested; separate logical repo)
- Documentation, tests, and certification packages

**Do not assume** `code-factory` is a tenant application or the Factory orchestration repo.

---

## npm package: `@factory/core`

When tenants install or import the shared SDK, they use:

```json
{
  "dependencies": {
    "@factory/core": "..."
  }
}
```

Build output: `dist/index.js` + `dist/index.d.ts`.

This is the **installable artifact name**. It is scoped under `@factory` to avoid collisions with unrelated npm packages.

---

## Ecosystem role: `factory-core`

In Factory ecosystem documentation and certification:

- **factory-core** = the shared code layer (types, validators, SDK helpers)
- **factory-standards** = the standards/law layer (schemas, validation gate)
- Tenant apps (Citadel, Forgina, etc.) = separate repos

The self-certification package uses `tenantId: "factory-core"` to identify this SDK foundation repo in Factory language.

---

## What this repo is NOT

| Name | Not this |
|------|----------|
| `code-factory` | Not necessarily the Factory orchestration/import repo |
| `@factory/core` | Not a tenant application |
| `factory-core` | Not the standards law repo (that is factory-standards) |

---

## Future rename?

Audit noted possible split: separate git repos for factory-core and factory-standards. **Pass 1 does not rename anything.** If rename happens later, this document should be updated first.

---

## For new engineers

1. Clone **code-factory** from GitHub
2. Run `npm install` at repo root
3. Import from **`@factory/core`** in TypeScript
4. Refer to ecosystem docs as **factory-core** when discussing Factory certification role
