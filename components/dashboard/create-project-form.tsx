"use client"

import { useState } from "react"

import { createProjectAction } from "@/app/(dashboard)/projects/actions"
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

export function CreateProjectForm() {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    setError(null)

    try {
      await createProjectAction(formData)
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
          : "Unable to create project."
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
              <Label htmlFor="name">Project name</Label>

              <Input
                id="name"
                name="name"
                placeholder="Victoria Island Residence"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Project slug</Label>

              <Input
                id="slug"
                name="slug"
                placeholder="victoria-island-residence"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>

            <Textarea
              id="description"
              name="description"
              placeholder="Describe the project..."
              rows={4}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>

              <Input
                id="client"
                name="client"
                placeholder="Client or organization"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>

              <Input
                id="location"
                name="location"
                placeholder="Lagos, Nigeria"
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start date</Label>

              <Input
                id="startDate"
                name="startDate"
                type="date"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End date</Label>

              <Input
                id="endDate"
                name="endDate"
                type="date"
              />
            </div>
          </div>

          <div className="rounded-lg border bg-muted/20 p-4">
            <p className="text-sm font-medium">
              Budget and progress
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Project budget will be established from the BOQ,
              while construction progress will be tracked separately
              once project execution begins.
            </p>
          </div>

          {error ? (
            <p className="text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={isPending}
          >
            {isPending
              ? "Creating project..."
              : "Create project"}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}