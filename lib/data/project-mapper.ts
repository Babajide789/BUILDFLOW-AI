import type { Project as PrismaProject } from "@/generated/prisma/client"

import type {
  Project,
  ProjectStatus,
} from "@/lib/types/project"

const statusMap: Record<
  PrismaProject["status"],
  ProjectStatus
> = {
  PLANNING: "planning",
  ACTIVE: "active",
  COMPLETED: "completed",
  ON_HOLD: "on-hold",
  AT_RISK: "at-risk",
}

export function mapProject(
  project: PrismaProject
): Project {
  return {
    id: project.id,
    name: project.name,
    organizationId: project.organizationId,
    client: project.client ?? "",
    location: project.location ?? "",
    status: statusMap[project.status],
    budget: Number(project.budget),
    progress: project.progress,
    startDate: project.startDate
      ? project.startDate.toISOString().slice(0, 10)
      : "",
    endDate: project.endDate
      ? project.endDate.toISOString().slice(0, 10)
      : "",
  }
}

export function mapProjects(
  projects: PrismaProject[]
): Project[] {
  return projects.map(mapProject)
}