import { PageSection } from "@/components/dashboard/page-section"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Project } from "@/lib/types/project"

interface ProjectOverviewProps {
  project: Project
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value))
}

export function ProjectOverview({
  project,
}: ProjectOverviewProps) {
  return (
    <div className="space-y-8">
      <PageSection
        title="Project Overview"
        description="Key information and timeline for this project."
      >
        <Card>
          <CardContent className="p-6">
            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">
                  Project Name
                </p>

                <p className="mt-1 font-medium">
                  {project.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Client
                </p>

                <p className="mt-1 font-medium">
                  {project.client}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Location
                </p>

                <p className="mt-1 font-medium">
                  {project.location}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Status
                </p>

                <p className="mt-1 font-medium capitalize">
                  {project.status.replace("-", " ")}
                </p>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">
                  Start Date
                </p>

                <p className="mt-1 font-medium">
                  {formatDate(project.startDate)}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Expected Completion
                </p>

                <p className="mt-1 font-medium">
                  {formatDate(project.endDate)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageSection>

      <PageSection
        title="Project Timeline"
        description="Current project schedule milestones."
      >
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1 size-2 shrink-0 rounded-full bg-primary" />

                <div className="space-y-1">
                  <p className="font-medium">
                    Project Start
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {formatDate(project.startDate)}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex gap-4">
                <div className="mt-1 size-2 shrink-0 rounded-full bg-muted-foreground" />

                <div className="space-y-1">
                  <p className="font-medium">
                    Expected Completion
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {formatDate(project.endDate)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </div>
  )
}