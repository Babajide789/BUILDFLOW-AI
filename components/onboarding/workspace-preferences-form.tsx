"use client"

import { useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Calculator,
  FileText,
  FolderKanban,
  Handshake,
  ShoppingCart,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import type { WorkspaceModule } from "@/lib/types/organization"

export interface WorkspacePreferencesData {
  modules: WorkspaceModule[]
}

interface WorkspacePreferencesFormProps {
  initialData?: Partial<WorkspacePreferencesData>
  onBack: () => void
  onContinue: (data: WorkspacePreferencesData) => void
}

const workspaceModules: {
  value: WorkspaceModule
  label: string
  description: string
  icon: typeof FolderKanban
}[] = [
  {
    value: "project-management",
    label: "Project Management",
    description:
      "Plan projects, track progress, milestones, tasks, and delivery.",
    icon: FolderKanban,
  },
  {
    value: "cost-management",
    label: "Cost Management",
    description:
      "Manage budgets, valuations, cost tracking, and financial visibility.",
    icon: Calculator,
  },
  {
    value: "procurement",
    label: "Procurement",
    description:
      "Coordinate purchasing, suppliers, procurement activities, and commitments.",
    icon: ShoppingCart,
  },
  {
    value: "documents",
    label: "Documents",
    description:
      "Organize project documents, files, records, and important information.",
    icon: FileText,
  },
  {
    value: "team-collaboration",
    label: "Team Collaboration",
    description:
      "Keep project teams aligned with shared communication and collaboration tools.",
    icon: Handshake,
  },
  {
    value: "ai-assistance",
    label: "AI Assistance",
    description:
      "Use BuildFlow AI to support decisions, analysis, and construction workflows.",
    icon: Brain,
  },
]

export function WorkspacePreferencesForm({
  initialData,
  onBack,
  onContinue,
}: WorkspacePreferencesFormProps) {
  const [error, setError] = useState("")

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const modules = formData.getAll(
      "modules"
    ) as WorkspaceModule[]

    if (modules.length === 0) {
      setError(
        "Select at least one workspace module to continue."
      )
      return
    }

    setError("")

    onContinue({
      modules,
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      <div className="space-y-2">
        <Label>
          Workspace modules
        </Label>

        <p className="text-sm text-muted-foreground">
          Select the areas you want available in your BuildFlow
          workspace. You can change these preferences later.
        </p>
      </div>

      <fieldset className="space-y-3">
        <legend className="sr-only">
          Workspace modules
        </legend>

        <div className="grid gap-4 sm:grid-cols-2">
          {workspaceModules.map((module) => {
            const Icon = module.icon

            const checked =
              initialData?.modules?.includes(module.value) ??
              false

            return (
              <label
                key={module.value}
                className="group flex cursor-pointer gap-4 rounded-xl border p-4 transition-colors hover:bg-accent has-checked:border-primary has-checked:bg-accent/50"
              >
                <input
                  type="checkbox"
                  name="modules"
                  value={module.value}
                  defaultChecked={checked}
                  className="mt-1 size-4 shrink-0 accent-primary"
                />

                <div className="flex min-w-0 gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background">
                    <Icon
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {module.label}
                    </p>

                    <p className="text-xs leading-5 text-muted-foreground">
                      {module.description}
                    </p>
                  </div>
                </div>
              </label>
            )
          })}
        </div>

        {error && (
          <p
            className="text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}
      </fieldset>

      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
        >
          <ArrowLeft
            className="size-4"
            aria-hidden="true"
          />
          Back
        </Button>

        <Button type="submit">
          Continue
          <ArrowRight
            className="size-4"
            aria-hidden="true"
          />
        </Button>
      </div>
    </form>
  )
}