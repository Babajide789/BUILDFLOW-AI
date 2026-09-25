import type {
  OrganizationMembership,
  Permission,
} from "@/lib/types/authorization"

import { hasPermission } from "./authorization"

export interface OrganizationScopedResource {
  organizationId: string
}

export function canAccessOrganizationResource(
  membership:
    | OrganizationMembership
    | null
    | undefined,
  resource: OrganizationScopedResource,
  permission: Permission = "projects:read"
): boolean {
  if (!membership) {
    return false
  }

  if (membership.status !== "active") {
    return false
  }

  if (
    membership.organizationId !==
    resource.organizationId
  ) {
    return false
  }

  return hasPermission(
    membership,
    permission
  )
}

export function canModifyOrganizationResource(
  membership:
    | OrganizationMembership
    | null
    | undefined,
  resource: OrganizationScopedResource
): boolean {
  return canAccessOrganizationResource(
    membership,
    resource,
    "projects:update"
  )
}