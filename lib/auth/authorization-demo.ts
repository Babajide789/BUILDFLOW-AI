import {
  canCreateProjects,
  canDeleteProjects,
  canManageMembers,
  canManageOrganization,
  canUpdateProjects,
  getCurrentOrganizationMembership,
} from "@/lib/auth"

export async function getCurrentAuthorizationDemo() {
  const membership =
    await getCurrentOrganizationMembership()

  return {
    membership,
    canManageOrganization:
      canManageOrganization(membership),
    canManageMembers:
      canManageMembers(membership),
    canCreateProjects:
      canCreateProjects(membership),
    canUpdateProjects:
      canUpdateProjects(membership),
    canDeleteProjects:
      canDeleteProjects(membership),
  }
}