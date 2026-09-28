import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { BoqWorkspace } from "@/components/dashboard/boq-workspace"
import { requireProjectAccess } from "@/lib/auth/project-access"
import { getOrganizationProjectBoq } from "@/lib/data/boq-access"

interface ProjectBoqPageProps {
  params: Promise<{ projectId: string }>
}

export default async function ProjectBoqPage({
  params,
}: ProjectBoqPageProps) {
  const { projectId } = await params

  const { project, membership } =
    await requireProjectAccess(
      projectId,
      "projects:read"
    )

  const boq = await getOrganizationProjectBoq(
    project.id,
    membership.organizationId
  )

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-4 md:p-6 lg:p-8">
      <div className="space-y-5">
        <Link
          href={`/projects/${project.id}`}
          className="-ml-2 inline-flex h-9 w-fit items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft
            className="size-4"
            aria-hidden="true"
          />
          Back to Project
        </Link>

        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {project.name}
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
            Bill of Quantities
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Manage the project&apos;s measured works, quantities,
            rates, and commercial value.
          </p>
        </div>
      </div>

      <BoqWorkspace
        boq={boq}
        projectId={project.id}
      />
    </div>
  )
}