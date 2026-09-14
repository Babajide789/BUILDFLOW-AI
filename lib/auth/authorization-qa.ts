import {
  canCreateProjects,
  canDeleteProjects,
  canInviteMembers,
  canManageOrganization,
  canUpdateProjects,
  hasPermission,
} from "./authorization"
import type {
  OrganizationMembership,
  OrganizationRole,
} from "@/lib/types/authorization"

const organizationId = "org-buildflow-demo"

function createMembership(
  role: OrganizationRole
): OrganizationMembership {
  return {
    id: `qa-${role}`,
    userId: `qa-${role}`,
    organizationId,
    role,
    status: "active",
  }
}

export interface AuthorizationQaResult {
  role: OrganizationRole
  passed: boolean
  checks: {
    organizationManage: boolean
    memberInvite: boolean
    projectCreate: boolean
    projectUpdate: boolean
    projectDelete: boolean
  }
}

export function runAuthorizationQa(): AuthorizationQaResult[] {
  const roles: OrganizationRole[] = [
    "owner",
    "admin",
    "member",
  ]

  return roles.map((role) => {
    const membership = createMembership(role)

    const checks = {
      organizationManage:
        canManageOrganization(membership),
      memberInvite:
        canInviteMembers(membership),
      projectCreate:
        canCreateProjects(membership),
      projectUpdate:
        canUpdateProjects(membership),
      projectDelete:
        canDeleteProjects(membership),
    }

    const expected = {
      owner: {
        organizationManage: true,
        memberInvite: true,
        projectCreate: true,
        projectUpdate: true,
        projectDelete: true,
      },
      admin: {
        organizationManage: false,
        memberInvite: true,
        projectCreate: true,
        projectUpdate: true,
        projectDelete: true,
      },
      member: {
        organizationManage: false,
        memberInvite: false,
        projectCreate: false,
        projectUpdate: true,
        projectDelete: false,
      },
    }[role]

    const passed = Object.entries(expected).every(
      ([key, value]) =>
        checks[key as keyof typeof checks] === value
    )

    return {
      role,
      passed,
      checks,
    }
  })
}

export function hasPassedAuthorizationQa(): boolean {
  return runAuthorizationQa().every(
    (result) => result.passed
  )
}

export function hasActiveMembershipAccess(
  membership: OrganizationMembership | null
): boolean {
  return (
    membership?.status === "active" &&
    hasPermission(
      membership,
      "organization:read"
    )
  )
}