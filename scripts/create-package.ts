#!/usr/bin/env node
import { writeCertificationPackage, createEmptyCertificationPackage } from "../src/certification/package.js";

function parseArgs(argv: string[]): { tenant: string; output: string } {
  let tenant = "";
  let output = "";

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--tenant" && argv[i + 1]) {
      tenant = argv[++i];
    } else if (arg === "--output" && argv[i + 1]) {
      output = argv[++i];
    } else if (!arg.startsWith("-") && !tenant) {
      tenant = arg;
    }
  }

  if (!tenant) {
    console.error("Usage: npm run create:package -- --tenant <tenant-id> [--output ./path]");
    process.exit(1);
  }

  return { tenant, output: output || `./${tenant}-certification` };
}

const { tenant, output } = parseArgs(process.argv.slice(2));
const pkg = createEmptyCertificationPackage({ tenantId: tenant });

writeCertificationPackage(output, pkg);
console.log(`Created empty certification package for tenant "${tenant}" at ${output}`);
