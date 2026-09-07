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
import { Button } from "@/components/ui/button"
import { projects } from "@/lib/data/projects"
import { getProjectMetrics } from "@/lib/data/project-metrics"

export default function ProjectsPage() {
  const metrics = getProjectMetrics(projects)

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Projects"
        description="Manage and monitor all construction projects."
        actions={
          <Button>
            <Plus className="size-4" aria-hidden="true" />
            New Project
          </Button>
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
        <ProjectsTable projects={projects} />
      </PageSection>
    </div>
  )
}