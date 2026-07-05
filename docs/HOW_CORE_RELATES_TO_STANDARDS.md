# How Core Relates to Standards

Factory splits responsibilities across two foundation repos:

| Repo | Role |
|------|------|
| **factory-standards** | Rules, schemas, protocols, audit rules, certification requirements |
| **factory-core** | Shared TypeScript code that implements those rules |

## Division of labor

**factory-standards** answers:

- What files belong in a certification package?
- What statuses, modes, and verdicts are valid?
- What must pass before Factory imports a tenant?

**factory-core** answers:

- How do I validate a manifest in code?
- How do I create and score a certification package?
- How do I emit Factory events and objects with consistent shapes?

## Workflow

1. factory-standards defines the rules
2. factory-core implements reusable code for those rules
3. Each tenant repo uses factory-core helpers + the certification prompt
4. Each tenant generates a certification package
5. factory-standards validates the package
6. Factory imports qualified tenants
7. Citadel archives important history

## Compatibility rule

factory-core must not invent schemas that conflict with factory-standards. The `src/standards/` layer mirrors factory-standards constants and enums. When standards change, update `src/standards/` first, then validators and SDK helpers.
