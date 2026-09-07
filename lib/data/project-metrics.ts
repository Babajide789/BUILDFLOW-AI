import type { Project } from "@/lib/types/project"

export interface ProjectMetrics {
  total: number
  active: number
  completed: number
  atRisk: number
}

export function getProjectMetrics(
  projects: Project[]
): ProjectMetrics {
  return {
    total: projects.length,
    active: projects.filter(
      (project) => project.status === "active"
    ).length,
    completed: projects.filter(
      (project) => project.status === "completed"
    ).length,
    atRisk: projects.filter(
      (project) => project.status === "at-risk"
    ).length,
  }
}