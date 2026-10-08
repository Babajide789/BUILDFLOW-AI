import Link from "next/link"
import { ArrowLeft, CalendarDays, ClipboardList, MapPin, Truck, UserRound } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { Project, ProjectStatus } from "@/lib/types/project"

interface ProjectDetailHeaderProps {
  project: Project
  showEditAction?: boolean
}

function getStatusLabel(status: ProjectStatus) {
  const labels: Record<ProjectStatus, string> = {
    planning: "Planning",
    active: "Active",
    completed: "Completed",
    "on-hold": "On Hold",
    "at-risk": "At Risk",
  }
  return labels[status]
}

function getStatusVariant(status: ProjectStatus): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "active": return "default"
    case "completed": return "secondary"
    case "at-risk": return "destructive"
    case "planning": return "outline"
    case "on-hold": return "secondary"
  }
}

function formatDate(value: string) {
  if (!value) return "Not set"
  return new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value))
}

export function ProjectDetailHeader({ project, showEditAction = true }: ProjectDetailHeaderProps) {
  return (
    <div className="space-y-5">
      <Link
        href="/projects"
        className="-ml-2 inline-flex h-9 w-fit items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to Projects
      </Link>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">{project.name}</h1>
            <Badge variant={getStatusVariant(project.status)}>{getStatusLabel(project.status)}</Badge>
          </div>

          <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2">
            <span className="inline-flex items-center gap-1.5"><UserRound className="size-4" aria-hidden="true" />{project.client || "No client specified"}</span>
            <span className="inline-flex items-center gap-1.5"><MapPin className="size-4" aria-hidden="true" />{project.location || "No location specified"}</span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 lg:items-end">
          <div className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays className="size-4" aria-hidden="true" />
            {formatDate(project.startDate)} – {formatDate(project.endDate)}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Tooltip>
              <TooltipTrigger render={<Link href={`/projects/${project.id}/boq`} className="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />}>
                <ClipboardList className="size-4" aria-hidden="true" />
                View BOQ
              </TooltipTrigger>
              <TooltipContent>Open project BOQ</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger render={<Link href={`/projects/${project.id}/procurement`} className="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />}>
                <Truck className="size-4" aria-hidden="true" />
                Procurement
              </TooltipTrigger>
              <TooltipContent>Open project procurement</TooltipContent>
            </Tooltip>

            {showEditAction ? (
              <Tooltip>
                <TooltipTrigger render={<Link href={`/projects/${project.id}/edit`} className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />}>
                  Edit project
                </TooltipTrigger>
                <TooltipContent>Edit project details</TooltipContent>
              </Tooltip>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
