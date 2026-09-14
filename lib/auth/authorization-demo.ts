import { currentUser } from "@/lib/data/users"
import { getOrganizationMembership } from "@/lib/auth/membership"
import {
  canCreateProjects,
  canInviteMembers,
  canManageOrganization,
  hasPermission,
} from "@/lib/auth/authorization"

const organizationId = "org-buildflow-demo"

export const currentUserMembership =
  getOrganizationMembership(
    currentUser.id,
    organizationId
  )

export const currentUserAuthorization = {
  canManageOrganization: canManageOrganization(
    currentUserMembership
  ),
  canInviteMembers: canInviteMembers(
    currentUserMembership
  ),
  canCreateProjects: canCreateProjects(
    currentUserMembership
  ),
  canDeleteProjects: hasPermission(
    currentUserMembership,
    "projects:delete"
  ),
}