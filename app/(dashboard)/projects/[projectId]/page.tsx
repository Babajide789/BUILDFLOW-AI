import { notFound } from "next/navigation"

import { ProjectDetailHeader } from "@/components/dashboard/project-detail-header"
import { ProjectOverview } from "@/components/dashboard/project-overview"
import { ProjectSummary } from "@/components/dashboard/project-summary"
import { projects } from "@/lib/data/projects"

interface ProjectPageProps {
  params: Promise<{
    projectId: string
  }>
}

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { projectId } = await params

  const project = projects.find(
    (item) => item.id === projectId
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