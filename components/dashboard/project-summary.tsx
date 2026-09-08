import {
  CalendarCheck2,
  CalendarDays,
  CircleDollarSign,
  TrendingUp,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Project } from "@/lib/types/project"

interface ProjectSummaryProps {
  project: Project
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value))
}

export function ProjectSummary({
  project,
}: ProjectSummaryProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Progress
              </p>

              <p className="text-2xl font-semibold tracking-tight">
                {project.progress}%
              </p>
            </div>

            <div className="rounded-lg bg-muted p-2">
              <TrendingUp
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="mt-4">
            <Progress value={project.progress} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Budget
              </p>

              <p className="text-2xl font-semibold tracking-tight">
                {formatCurrency(project.budget)}
              </p>
            </div>

            <div className="rounded-lg bg-muted p-2">
              <CircleDollarSign
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Current project budget
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Start Date
              </p>

              <p className="text-2xl font-semibold tracking-tight">
                {formatDate(project.startDate)}
              </p>
            </div>

            <div className="rounded-lg bg-muted p-2">
              <CalendarDays
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Project commencement
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                End Date
              </p>

              <p className="text-2xl font-semibold tracking-tight">
                {formatDate(project.endDate)}
              </p>
            </div>

            <div className="rounded-lg bg-muted p-2">
              <CalendarCheck2
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Expected completion
          </p>
        </CardContent>
      </Card>
    </div>
  )
}