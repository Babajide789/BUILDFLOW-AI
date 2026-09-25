import {
  getOrganizationProjects as getOrganizationProjectsFromDb,
  getProject as getProjectFromDb,
} from "@/lib/data/db/projects"

import { mapProject, mapProjects } from "@/lib/data/project-mapper"

export async function getOrganizationProject(
  projectId: string,
  organizationId: string
) {
  const project = await getProjectFromDb(projectId, organizationId)

  return project ? mapProject(project) : null
}

export async function getOrganizationProjects(
  organizationId: string
) {
  const projects =
    await getOrganizationProjectsFromDb(organizationId)

  return mapProjects(projects)
}