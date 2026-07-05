# factory-standards

The law repo for the Factory ecosystem — schemas, protocols, audit rules, and certification validation.

## Validate an imported certification package

```bash
cd factory-standards
npm install
npm run validate:package -- imports/factory-core
```

Produces `validation-report.json` and `validation-report.md` in the package directory.

## Foundation repos

| Repo | Role |
|------|------|
| factory-standards | Rules, schemas, validation |
| factory-core | Shared TypeScript SDK implementing standards |

## Imports

Certification packages submitted by foundation and tenant repos land in `imports/<tenant-id>/`.
