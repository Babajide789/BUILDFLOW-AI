import { getProjectBoq } from "@/lib/data/db/boq"
import { getOrganizationProject } from "@/lib/data/project-access"
import { mapBoq } from "@/lib/data/boq-mapper"

export async function getOrganizationProjectBoq(
  projectId: string,
  organizationId: string
) {
  const project = await getOrganizationProject(
    projectId,
    organizationId
  )

  if (!project) {
    return null
  }

  const boq = await getProjectBoq(projectId)

  return boq ? mapBoq(boq) : null
}