#!/usr/bin/env node
import { validateCertificationPackageDirectory } from "../src/certification/package.js";

const target = process.argv[2];

if (!target) {
  console.error("Usage: npm run validate:package -- ./path/to/package");
  process.exit(1);
}

const result = validateCertificationPackageDirectory(target);

console.log(`Package: ${target}`);
console.log(`Layout valid: ${result.layout.valid ? "yes" : "no"}`);
console.log(`Overall valid: ${result.valid ? "yes" : "no"}`);

if (result.score) {
  console.log(`Readiness score: ${result.score.readiness.score}/${result.score.readiness.maxScore}`);
  console.log(`Import eligible: ${result.score.readiness.importEligible ? "yes" : "no"}`);
}

if (result.errors.length > 0) {
  console.log("\nErrors:");
  for (const error of result.errors) console.log(`  - ${error}`);
}

if (result.warnings.length > 0) {
  console.log("\nWarnings:");
  for (const warning of result.warnings) console.log(`  - ${warning}`);
}

process.exit(result.valid ? 0 : 1);
