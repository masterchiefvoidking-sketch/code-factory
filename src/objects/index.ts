import { randomUUID } from "node:crypto";
import type { FactoryObject, FactoryObjectLink, FactoryObjectType } from "../types/index.js";
import { validateObject } from "../validators/index.js";

const SCHEMA_VERSION = "1.0.0";

export interface CreateFactoryObjectOptions {
  type: FactoryObjectType;
  tenantId: string;
  name: string;
  attributes: Record<string, unknown>;
  objectId?: string;
  links?: FactoryObjectLink[];
}

export function createFactoryObject(options: CreateFactoryObjectOptions): FactoryObject {
  const now = new Date().toISOString();
  return {
    schemaVersion: SCHEMA_VERSION,
    objectId: options.objectId ?? randomUUID(),
    type: options.type,
    tenantId: options.tenantId,
    name: options.name,
    createdAt: now,
    updatedAt: now,
    attributes: options.attributes,
    links: options.links,
  };
}

export function validateFactoryObject(object: unknown) {
  return validateObject(object);
}

export function linkFactoryObjects(
  source: FactoryObject,
  links: FactoryObjectLink[],
): FactoryObject {
  return {
    ...source,
    updatedAt: new Date().toISOString(),
    links: [...(source.links ?? []), ...links],
  };
}
