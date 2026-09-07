"use client"

import Link from "next/link"
import { Search, SlidersHorizontal } from "lucide-react"
import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Project, ProjectStatus } from "@/lib/types/project"

interface ProjectsTableProps {
  projects: Project[]
}

const statusOptions: Array<{
  value: "all" | ProjectStatus
  label: string
}> = [
  { value: "all", label: "All Statuses" },
  { value: "planning", label: "Planning" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "on-hold", label: "On Hold" },
  { value: "at-risk", label: "At Risk" },
]

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

function getStatusVariant(
  status: ProjectStatus
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "active":
      return "default"

    case "completed":
      return "secondary"

    case "at-risk":
      return "destructive"

    case "planning":
      return "outline"

    case "on-hold":
      return "secondary"
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value)
}

export function ProjectsTable({
  projects,
}: ProjectsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<
    "all" | ProjectStatus
  >("all")

  const filteredProjects = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return projects.filter((project) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        project.name.toLowerCase().includes(normalizedSearch) ||
        project.client.toLowerCase().includes(normalizedSearch) ||
        project.location.toLowerCase().includes(normalizedSearch)

      const matchesStatus =
        statusFilter === "all" ||
        project.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [projects, searchTerm, statusFilter])

  const hasActiveFilters =
    searchTerm.trim().length > 0 || statusFilter !== "all"

  function clearFilters() {
    setSearchTerm("")
    setStatusFilter("all")
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />

          <Input
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search projects, clients, or locations..."
            aria-label="Search projects"
            className="h-10 pl-9"
          />
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          <SlidersHorizontal
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as "all" | ProjectStatus
              )
            }
            aria-label="Filter projects by status"
            className="h-10 min-w-0 flex-1 rounded-md border bg-background px-3 text-sm text-foreground shadow-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring sm:min-w-44 sm:flex-none"
          >
            {statusOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="shrink-0 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>

      {/* Result summary */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {filteredProjects.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-foreground">
            {projects.length}
          </span>{" "}
          projects
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="min-w-56">
                Project
              </TableHead>

              <TableHead className="min-w-48">
                Client
              </TableHead>

              <TableHead className="min-w-48">
                Location
              </TableHead>

              <TableHead className="min-w-32">
                Status
              </TableHead>

              <TableHead className="min-w-40 text-right">
                Budget
              </TableHead>

              <TableHead className="min-w-52">
                Progress
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="py-4">
                  <Link
                    href={`/projects/${project.id}`}
                    className="font-medium transition-colors hover:text-primary hover:underline"
                  >
                    {project.name}
                  </Link>
                </TableCell>

                <TableCell className="py-4">
                  {project.client}
                </TableCell>

                <TableCell className="py-4 text-muted-foreground">
                  {project.location}
                </TableCell>

                <TableCell className="py-4">
                  <Badge
                    variant={getStatusVariant(project.status)}
                  >
                    {getStatusLabel(project.status)}
                  </Badge>
                </TableCell>

                <TableCell className="py-4 text-right font-medium">
                  {formatCurrency(project.budget)}
                </TableCell>

                <TableCell className="py-4">
                  <div className="flex min-w-40 items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <Progress value={project.progress} />
                    </div>

                    <span className="w-10 shrink-0 text-right text-sm font-medium tabular-nums text-muted-foreground">
                      {project.progress}%
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-40 px-6 text-center"
                >
                  <div className="mx-auto max-w-sm">
                    <p className="text-sm font-medium">
                      No projects found
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Try adjusting your search or status
                      filter.
                    </p>

                    {hasActiveFilters ? (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-3 text-sm font-medium text-primary underline-offset-4 hover:underline"
                      >
                        Clear filters
                      </button>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}