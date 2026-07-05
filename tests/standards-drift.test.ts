import { describe, expect, it } from "vitest";
import * as coreStandards from "../src/standards/constants.js";

/**
 * Shared constant keys that must match between factory-core mirror and
 * co-located factory-standards/schemas/constants.ts
 */
const SHARED_CONSTANT_KEYS = [
  "CERTIFICATION_REQUIRED_FILES",
  "CERTIFICATION_PACKAGE_LAYOUT_VERSION",
  "INTEGRATION_MODES",
  "TENANT_STATUSES",
  "HEALTH_STATUSES",
  "QUALIFICATION_STATUSES",
  "AUDIT_VERDICTS",
  "FACTORY_EVENT_TYPES",
  "FACTORY_OBJECT_TYPES",
  "REPORT_FORMATS",
  "CITADEL_ARCHIVE_TYPES",
  "MIN_READINESS_SCORE",
] as const;

describe("standards constant drift guard", () => {
  it("shared constants match factory-standards/schemas/constants.ts", async () => {
    const standardsModule = await import("../factory-standards/schemas/constants.js");

    for (const key of SHARED_CONSTANT_KEYS) {
      const coreValue = coreStandards[key];
      const standardsValue = standardsModule[key];

      expect(
        standardsValue,
        `factory-standards/schemas/constants.ts missing ${key}`,
      ).toBeDefined();

      expect(
        JSON.stringify(coreValue),
        `${key} drifted between src/standards/constants.ts and factory-standards/schemas/constants.ts`,
      ).toBe(JSON.stringify(standardsValue));
    }
  });

  it("STANDARDS_VERSION in factory-standards matches core SCHEMA alignment", async () => {
    const standardsModule = await import("../factory-standards/schemas/constants.js");
    expect(standardsModule.STANDARDS_VERSION).toBe("1.0.0");
  });
});
