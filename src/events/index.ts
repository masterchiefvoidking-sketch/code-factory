import { randomUUID } from "node:crypto";
import type { FactoryEvent, FactoryEventType } from "../types/index.js";
import { validateEvent } from "../validators/index.js";

const SCHEMA_VERSION = "1.0.0";

export interface CreateFactoryEventOptions {
  type: FactoryEventType;
  tenantId: string;
  source: string;
  payload: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  eventId?: string;
  timestamp?: string;
}

export function createFactoryEvent(options: CreateFactoryEventOptions): FactoryEvent {
  return {
    schemaVersion: SCHEMA_VERSION,
    eventId: options.eventId ?? randomUUID(),
    type: options.type,
    tenantId: options.tenantId,
    timestamp: options.timestamp ?? new Date().toISOString(),
    source: options.source,
    payload: options.payload,
    metadata: options.metadata,
  };
}

export function validateFactoryEvent(event: unknown) {
  return validateEvent(event);
}

export function normalizeFactoryEvent(event: FactoryEvent): FactoryEvent {
  return {
    ...event,
    tenantId: event.tenantId.trim(),
    source: event.source.trim(),
    payload: { ...event.payload },
    metadata: event.metadata ? { ...event.metadata } : undefined,
  };
}
