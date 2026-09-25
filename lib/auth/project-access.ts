import { notFound } from "next/navigation"

import type {
  OrganizationMembership,
  Permission,
} from "@/lib/types/authorization"

import { hasPermission } from "./authorization"
import { getCurrentOrganizationMembership } from "./current"
import { getCurrentAuthenticatedUser } from "./session"
import { getOrganizationProject } from "@/lib/data/project-access"

export interface AuthorizedProjectAccess {
  project: NonNullable<
    ReturnType<typeof getOrganizationProject>
  >
  membership: OrganizationMembership
}

export async function requireProjectAccess(
  projectId: string,
  permission: Permission = "projects:read"
): Promise<AuthorizedProjectAccess> {
  const user =
    await getCurrentAuthenticatedUser()

  if (!user) {
    notFound()
  }

  const membership =
    await getCurrentOrganizationMembership()

  if (!membership) {
    notFound()
  }

  if (!hasPermission(membership, permission)) {
    notFound()
  }

  const project = getOrganizationProject(
    projectId,
    membership.organizationId
  )

  if (!project) {
    notFound()
  }

  return {
    project,
    membership,
  }
}