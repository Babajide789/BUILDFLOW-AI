export type ProjectStatus =
  | "planning"
  | "active"
  | "completed"
  | "on-hold"
  | "at-risk"

export interface Project {
  id: string
  name: string
  client: string
  location: string
  status: ProjectStatus
  budget: number
  progress: number
  startDate: string
  endDate: string
}