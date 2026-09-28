import { notFound } from "next/navigation"

import { getCurrentOrganizationMembership } from "@/lib/auth"
import { requirePermission } from "@/lib/auth/guards"
import { getProjectBoq } from "@/lib/data/db/boq"
import { getOrganizationProject } from "@/lib/data/project-access"

type BoqPermission =
  | "boq:read"
  | "boq:create"
  | "boq:update"
  | "boq:delete"

export async function requireBoqAccess(
  projectId: string,
  permission: BoqPermission
) {
  const membership =
    await getCurrentOrganizationMembership()

  if (!membership) {
    notFound()
  }

  requirePermission(membership, permission)

  const project = await getOrganizationProject(
    projectId,
    membership.organizationId
  )

  if (!project) {
    notFound()
  }

  return {
    membership,
    project,
  }
}

export async function requireProjectBoqAccess(
  projectId: string,
  permission: BoqPermission
) {
  const { membership, project } =
    await requireBoqAccess(
      projectId,
      permission
    )

  const boq = await getProjectBoq(projectId)

  if (!boq) {
    return {
      membership,
      project,
      boq: null,
    }
  }

  return {
    membership,
    project,
    boq,
  }
}