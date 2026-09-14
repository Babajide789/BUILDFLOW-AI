import type {
  OrganizationMembership,
  Permission,
} from "@/lib/types/authorization"

import { hasPermission } from "./authorization"
import { getOrganizationMembership } from "./membership"

export function requireOrganizationMembership(
  userId: string,
  organizationId: string
): OrganizationMembership {
  const membership = getOrganizationMembership(
    userId,
    organizationId
  )

  if (!membership) {
    throw new Error(
      "You do not have membership in this organization."
    )
  }

  if (membership.status === "suspended") {
    throw new Error(
      "Your organization membership is suspended."
    )
  }

  if (membership.status !== "active") {
    throw new Error(
      "You do not have active access to this organization."
    )
  }

  return membership
}

export function requirePermission(
  membership: OrganizationMembership,
  permission: Permission
): OrganizationMembership {
  if (!hasPermission(membership, permission)) {
    throw new Error(
      "You do not have permission to perform this action."
    )
  }

  return membership
}

export function requireOrganizationPermission(
  userId: string,
  organizationId: string,
  permission: Permission
): OrganizationMembership {
  const membership = requireOrganizationMembership(
    userId,
    organizationId
  )

  return requirePermission(
    membership,
    permission
  )
}