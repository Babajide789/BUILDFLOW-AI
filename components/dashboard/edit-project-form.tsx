"use client"

import { useState } from "react"

import { updateProjectAction } from "@/app/(dashboard)/projects/actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type {
  Project,
  ProjectStatus,
} from "@/lib/types/project"

interface EditProjectFormProps {
  project: Project
}

const statusOptions: Array<{
  value: ProjectStatus
  label: string
}> = [
  {
    value: "planning",
    label: "Planning",
  },
  {
    value: "active",
    label: "Active",
  },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "at-risk",
    label: "At Risk",
  },
  {
    value: "on-hold",
    label: "On Hold",
  },
]

export function EditProjectForm({
  project,
}: EditProjectFormProps) {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    setError(null)

    try {
      await updateProjectAction(project.id, formData)
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "digest" in error
      ) {
        throw error
      }

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update project."
      )

      setIsPending(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                Project name
              </Label>

              <Input
                id="name"
                name="name"
                defaultValue={project.name}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">
                Project slug
              </Label>

              <Input
                id="slug"
                name="slug"
                defaultValue={project.slug}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description
            </Label>

            <Textarea
              id="description"
              name="description"
              defaultValue={project.description}
              placeholder="Describe the project..."
              rows={4}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="client">
                Client
              </Label>

              <Input
                id="client"
                name="client"
                defaultValue={project.client}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                Location
              </Label>

              <Input
                id="location"
                name="location"
                defaultValue={project.location}
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="status">
                Project status
              </Label>

              <select
                id="status"
                name="status"
                defaultValue={project.status}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">
                Start date
              </Label>

              <Input
                id="startDate"
                name="startDate"
                type="date"
                defaultValue={project.startDate}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">
              End date
            </Label>

            <Input
              id="endDate"
              name="endDate"
              type="date"
              defaultValue={project.endDate}
            />
          </div>

          <div className="rounded-lg border bg-muted/20 p-4">
            <p className="text-sm font-medium">
              Budget and progress are system-managed
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Budget is derived from the project BOQ and progress
              will be managed through project progress tracking.
            </p>
          </div>

          {error ? (
            <p className="text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isPending}
            >
              {isPending
                ? "Saving changes..."
                : "Save changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}