import { projects } from "@/lib/data/projects"

export function getOrganizationProject(
  projectId: string,
  organizationId: string
) {
  return (
    projects.find(
      (project) =>
        project.id === projectId &&
        project.organizationId === organizationId
    ) ?? null
  )
}

export function getOrganizationProjects(
  organizationId: string
) {
  return projects.filter(
    (project) =>
      project.organizationId === organizationId
  )
}