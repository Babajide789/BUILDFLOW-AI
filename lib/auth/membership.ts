import {
  getMembership,
  getUserMemberships,
} from "@/lib/data/db/memberships"

import type {
  OrganizationMembership,
  OrganizationRole,
  MembershipStatus,
} from "@/lib/types/authorization"

function mapOrganizationRole(
  role: "OWNER" | "ADMIN" | "MEMBER"
): OrganizationRole {
  switch (role) {
    case "OWNER":
      return "owner"

    case "ADMIN":
      return "admin"

    case "MEMBER":
      return "member"
  }
}

function mapMembershipStatus(
  status: "ACTIVE" | "INVITED" | "SUSPENDED"
): MembershipStatus {
  switch (status) {
    case "ACTIVE":
      return "active"

    case "INVITED":
      return "invited"

    case "SUSPENDED":
      return "suspended"
  }
}

function toOrganizationMembership(
  membership: {
    id: string
    userId: string
    organizationId: string
    role: "OWNER" | "ADMIN" | "MEMBER"
    status: "ACTIVE" | "INVITED" | "SUSPENDED"
  }
): OrganizationMembership {
  return {
    id: membership.id,
    userId: membership.userId,
    organizationId: membership.organizationId,
    role: mapOrganizationRole(membership.role),
    status: mapMembershipStatus(membership.status),
  }
}

export async function getOrganizationMembership(
  userId: string,
  organizationId: string
): Promise<OrganizationMembership | null> {
  const membership = await getMembership(
    userId,
    organizationId
  )

  if (!membership) {
    return null
  }

  return toOrganizationMembership(membership)
}

export async function getUserOrganizationMemberships(
  userId: string
): Promise<OrganizationMembership[]> {
  const memberships = await getUserMemberships(userId)

  return memberships.map(toOrganizationMembership)
}