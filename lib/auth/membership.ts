import { organizationMemberships } from "@/lib/data/memberships"
import type { OrganizationMembership } from "@/lib/types/authorization"

export function getOrganizationMembership(
  userId: string,
  organizationId: string
): OrganizationMembership | null {
  return (
    organizationMemberships.find(
      (membership) =>
        membership.userId === userId &&
        membership.organizationId === organizationId
    ) ?? null
  )
}

export function getUserOrganizationMemberships(
  userId: string
): OrganizationMembership[] {
  return organizationMemberships.filter(
    (membership) => membership.userId === userId
  )
}