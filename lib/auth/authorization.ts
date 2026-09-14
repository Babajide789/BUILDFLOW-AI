import type {
  OrganizationMembership,
  OrganizationRole,
  Permission,
} from "@/lib/types/authorization"

import { rolePermissions } from "./permissions"

export function hasPermission(
  membership: OrganizationMembership | null | undefined,
  permission: Permission
): boolean {
  if (!membership || membership.status !== "active") {
    return false
  }

  return rolePermissions[membership.role].includes(permission)
}

export function hasRole(
  membership: OrganizationMembership | null | undefined,
  role: OrganizationRole
): boolean {
  if (!membership || membership.status !== "active") {
    return false
  }

  return membership.role === role
}

export function isOrganizationOwner(
  membership: OrganizationMembership | null | undefined
): boolean {
  return hasRole(membership, "owner")
}

export function canManageOrganization(
  membership: OrganizationMembership | null | undefined
): boolean {
  return hasPermission(membership, "organization:manage")
}

export function canInviteMembers(
  membership: OrganizationMembership | null | undefined
): boolean {
  return hasPermission(membership, "members:invite")
}

export function canManageMembers(
  membership: OrganizationMembership | null | undefined
): boolean {
  return (
    hasPermission(membership, "members:update") ||
    hasPermission(membership, "members:remove")
  )
}

export function canCreateProjects(
  membership: OrganizationMembership | null | undefined
): boolean {
  return hasPermission(membership, "projects:create")
}

export function canUpdateProjects(
  membership: OrganizationMembership | null | undefined
): boolean {
  return hasPermission(membership, "projects:update")
}

export function canDeleteProjects(
  membership: OrganizationMembership | null | undefined
): boolean {
  return hasPermission(membership, "projects:delete")
}