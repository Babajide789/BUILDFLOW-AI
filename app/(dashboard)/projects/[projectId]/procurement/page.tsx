import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { ProcurementWorkspace } from "@/components/dashboard/procurement-workspace"
import { requireProcurementAccess } from "@/lib/auth/procurement-access"
import { getProjectProcurementRequests, getOrganizationSuppliers } from "@/lib/data/db/procurement"
import {
  mapProcurementRequests,
  mapSuppliers,
} from "@/lib/data/procurement-mapper"
import { getOrganizationProjectBoq } from "@/lib/data/boq-access"

interface ProjectProcurementPageProps {
  params: Promise<{ projectId: string }>
}

export default async function ProjectProcurementPage({
  params,
}: ProjectProcurementPageProps) {
  const { projectId } = await params

  const { project, membership } =
    await requireProcurementAccess(
      projectId,
      "procurement:read"
    )

  const [
    procurementRequests,
    suppliers,
    boq,
  ] = await Promise.all([
    getProjectProcurementRequests(project.id),
    getOrganizationSuppliers(
      membership.organizationId
    ),
    getOrganizationProjectBoq(
      project.id,
      membership.organizationId
    ),
  ])

  const requests =
    mapProcurementRequests(
      procurementRequests
    )

  const mappedSuppliers =
    mapSuppliers(suppliers)

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
            Procurement
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Manage procurement requests, suppliers, and
            material requirements linked to the project BOQ.
          </p>
        </div>
      </div>

      <ProcurementWorkspace
        projectId={project.id}
        requests={requests}
        suppliers={mappedSuppliers}
        boq={boq}
        role={membership.role}
      />
    </div>
  )
}