import {
  AlertTriangle,
  CheckCircle2,
  FolderKanban,
  Plus,
  Workflow,
} from "lucide-react"

import { PageHeader } from "@/components/dashboard/page-header"
import { PageSection } from "@/components/dashboard/page-section"
import { ProjectsTable } from "@/components/dashboard/projects-table"
import { PermissionGate } from "@/components/auth/permission-gate"
import { Button } from "@/components/ui/button"
import {
  getCurrentOrganizationMembership,
} from "@/lib/auth"
import { getOrganizationProjects } from "@/lib/data/project-access"
import { getProjectMetrics } from "@/lib/data/project-metrics"
import { requirePermission } from "@/lib/auth/guards"

export default async function ProjectsPage() {
  const membership =
    await getCurrentOrganizationMembership()

  if (!membership) {
    return (
      <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">
        <PageHeader
          title="Projects"
          description="You do not currently have access to an organization."
        />
      </div>
    )
  }

  requirePermission(
    membership,
    "projects:read"
  )

  const organizationProjects =
    getOrganizationProjects(
      membership.organizationId
    )

  const metrics =
    getProjectMetrics(
      organizationProjects
    )

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Projects"
        description="Manage and monitor all construction projects."
        actions={
          <PermissionGate
            membership={membership}
            permission="projects:create"
          >
            <Button>
              <Plus
                className="size-4"
                aria-hidden="true"
              />
              New Project
            </Button>
          </PermissionGate>
        }
      />

      <PageSection
        title="Project Overview"
        description="A quick overview of your construction portfolio."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Projects
                </p>

                <p className="text-3xl font-semibold tracking-tight">
                  {metrics.total}
                </p>
              </div>

              <div className="rounded-lg bg-muted p-2">
                <FolderKanban
                  className="size-4 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Across your portfolio
            </p>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Active Projects
                </p>

                <p className="text-3xl font-semibold tracking-tight">
                  {metrics.active}
                </p>
              </div>

              <div className="rounded-lg bg-muted p-2">
                <Workflow
                  className="size-4 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Currently in progress
            </p>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Completed Projects
                </p>

                <p className="text-3xl font-semibold tracking-tight">
                  {metrics.completed}
                </p>
              </div>

              <div className="rounded-lg bg-muted p-2">
                <CheckCircle2
                  className="size-4 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Successfully delivered
            </p>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  At Risk
                </p>

                <p className="text-3xl font-semibold tracking-tight">
                  {metrics.atRisk}
                </p>
              </div>

              <div className="rounded-lg bg-muted p-2">
                <AlertTriangle
                  className="size-4 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Require attention
            </p>
          </div>
        </div>
      </PageSection>

      <PageSection
        title="Projects"
        description="Search and filter your construction projects."
      >
        <ProjectsTable projects={organizationProjects} />
      </PageSection>
    </div>
  )
}