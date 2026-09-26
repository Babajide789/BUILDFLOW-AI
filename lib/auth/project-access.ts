import { notFound } from "next/navigation"

import {
  getCurrentOrganizationMembership,
} from "@/lib/auth"

import {
  requirePermission,
} from "@/lib/auth/guards"

import {
  getOrganizationProject,
} from "@/lib/data/project-access"

export async function requireProjectAccess(
  projectId: string,
  permission:
    | "projects:read"
    | "projects:update"
    | "projects:delete"
) {
  const membership =
    await getCurrentOrganizationMembership()

  if (!membership) {
    notFound()
  }

  requirePermission(
    membership,
    permission
  )

  const project =
    await getOrganizationProject(
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