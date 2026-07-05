import type { FactoryHealth, FactoryHealthCheck, HealthStatus } from "../types/index.js";
import { validateHealth } from "../validators/index.js";

const SCHEMA_VERSION = "1.0.0";

export interface CreateHealthSnapshotOptions {
  tenantId: string;
  status: HealthStatus;
  checks: FactoryHealthCheck[];
  score?: number;
}

export function createHealthSnapshot(options: CreateHealthSnapshotOptions): FactoryHealth {
  const passingChecks = options.checks.filter((c) => c.status === "healthy").length;
  const computedScore =
    options.score ??
    (options.checks.length === 0 ? 0 : Math.round((passingChecks / options.checks.length) * 100));

  return {
    schemaVersion: SCHEMA_VERSION,
    tenantId: options.tenantId,
    capturedAt: new Date().toISOString(),
    status: options.status,
    score: computedScore,
    checks: options.checks,
  };
}

export function scoreHealth(health: FactoryHealth): number {
  const validation = validateHealth(health);
  if (!validation.valid) return 0;

  if (health.checks.length === 0) return health.score;

  const weights: Record<HealthStatus, number> = {
    healthy: 1,
    degraded: 0.5,
    unhealthy: 0,
    unknown: 0.25,
  };

  const total = health.checks.reduce((sum, check) => sum + weights[check.status], 0);
  return Math.round((total / health.checks.length) * 100);
}
