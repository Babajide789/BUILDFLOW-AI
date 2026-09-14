import { notFound } from "next/navigation"

import { ProjectDetailHeader } from "@/components/dashboard/project-detail-header"
import { ProjectOverview } from "@/components/dashboard/project-overview"
import { ProjectSummary } from "@/components/dashboard/project-summary"
import {
  currentOrganizationId,
  getCurrentOrganizationMembership,
} from "@/lib/auth"
import { getOrganizationProject } from "@/lib/data/project-access"

interface ProjectPageProps {
  params: Promise<{
    projectId: string
  }>
}

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { projectId } = await params

  const membership = getCurrentOrganizationMembership()

  if (!membership) {
    notFound()
  }

  const project = getOrganizationProject(
    projectId,
    currentOrganizationId
  )

  if (!project) {
    notFound()
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-4 md:p-6 lg:p-8">
      <ProjectDetailHeader project={project} />

      <ProjectSummary project={project} />

      <ProjectOverview project={project} />
    </div>
  )
}