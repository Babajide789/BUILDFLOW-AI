"use client"

import { ArrowLeft, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import type {
  OrganizationSize,
  OrganizationType,
  ProjectType,
} from "@/lib/types/organization"

export interface OrganizationContextData {
  type: OrganizationType
  size: OrganizationSize
  projectTypes: ProjectType[]
}

interface OrganizationContextFormProps {
  initialData?: Partial<OrganizationContextData>
  onBack: () => void
  onContinue: (data: OrganizationContextData) => void
}

const organizationTypes: {
  value: OrganizationType
  label: string
}[] = [
  {
    value: "general-contractor",
    label: "General Contractor",
  },
  {
    value: "quantity-surveying",
    label: "Quantity Surveying / Cost Management",
  },
  {
    value: "project-management",
    label: "Project Management",
  },
  {
    value: "real-estate-developer",
    label: "Real Estate Developer",
  },
  {
    value: "architecture",
    label: "Architecture / Design",
  },
  {
    value: "engineering",
    label: "Engineering",
  },
  {
    value: "subcontractor",
    label: "Subcontractor",
  },
  {
    value: "construction-consultancy",
    label: "Construction Consultancy",
  },
  {
    value: "other",
    label: "Other",
  },
]

const organizationSizes: {
  value: OrganizationSize
  label: string
}[] = [
  { value: "1-10", label: "1–10 employees" },
  { value: "11-50", label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-500", label: "201–500 employees" },
  { value: "500+", label: "500+ employees" },
]

const projectTypes: {
  value: ProjectType
  label: string
}[] = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "industrial", label: "Industrial" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "renovation", label: "Renovation" },
  { value: "mixed-use", label: "Mixed Use" },
]

export function OrganizationContextForm({
  initialData,
  onBack,
  onContinue,
}: OrganizationContextFormProps) {
  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const selectedProjectTypes = formData
      .getAll("projectTypes")
      .map(String) as ProjectType[]

    const data: OrganizationContextData = {
      type: String(
        formData.get("type") ?? ""
      ) as OrganizationType,
      size: String(
        formData.get("size") ?? ""
      ) as OrganizationSize,
      projectTypes: selectedProjectTypes,
    }

    onContinue(data)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      <div className="space-y-2">
        <Label htmlFor="type">
          Organization Type
        </Label>

        <select
          id="type"
          name="type"
          defaultValue={initialData?.type ?? ""}
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="" disabled>
            Select organization type
          </option>

          {organizationTypes.map((option) => (
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
        <Label htmlFor="size">
          Organization Size
        </Label>

        <select
          id="size"
          name="size"
          defaultValue={initialData?.size ?? ""}
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="" disabled>
            Select organization size
          </option>

          {organizationSizes.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">
          Primary Project Types
        </legend>

        <p className="text-sm text-muted-foreground">
          Select all project types your organization typically
          works on.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {projectTypes.map((projectType) => {
            const checked =
              initialData?.projectTypes?.includes(
                projectType.value
              ) ?? false

            return (
              <label
                key={projectType.value}
                className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
              >
                <input
                  type="checkbox"
                  name="projectTypes"
                  value={projectType.value}
                  defaultChecked={checked}
                  className="size-4 accent-primary"
                />

                <span className="text-sm font-medium">
                  {projectType.label}
                </span>
              </label>
            )
          })}
        </div>
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