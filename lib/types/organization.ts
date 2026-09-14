import type { OrganizationRole } from "@/lib/types/authorization"

export type OrganizationType =
  | "general-contractor"
  | "quantity-surveying"
  | "project-management"
  | "real-estate-developer"
  | "architecture"
  | "engineering"
  | "subcontractor"
  | "construction-consultancy"
  | "other"

export type OrganizationSize =
  | "1-10"
  | "11-50"
  | "51-200"
  | "201-500"
  | "500+"

export type ProjectType =
  | "residential"
  | "commercial"
  | "industrial"
  | "infrastructure"
  | "renovation"
  | "mixed-use"

export type WorkspaceModule =
  | "project-management"
  | "cost-management"
  | "procurement"
  | "documents"
  | "team-collaboration"
  | "ai-assistance"

export type TeamMemberRole = OrganizationRole

export type TeamMemberStatus =
  | "active"
  | "invited"

export interface TeamMember {
  id: string
  name: string
  email: string
  role: TeamMemberRole
  status: TeamMemberStatus
}

export interface Organization {
  id: string
  name: string
  legalName: string
  email: string
  phone: string
  website: string
  address: string
  city: string
  state: string
  country: string
  type: OrganizationType
  size: OrganizationSize
  projectTypes: ProjectType[]
}

export interface OnboardingState {
  organization: Partial<Organization>
  workspace: {
    modules: WorkspaceModule[]
  }
  team: TeamMember[]
  currentStep: number
  completedSteps: number[]
  onboardingComplete: boolean
}