"use client"

import {
  Check,
  Pencil,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import type {
  Organization,
  TeamMember,
  WorkspaceModule,
} from "@/lib/types/organization"

interface OnboardingReviewProps {
  organization: Partial<Organization>
  modules: WorkspaceModule[]
  team: TeamMember[]
  onEdit: (step: number) => void
  onComplete: () => void
}

const moduleLabels: Record<WorkspaceModule, string> = {
  "project-management": "Project Management",
  "cost-management": "Cost Management",
  procurement: "Procurement",
  documents: "Documents",
  "team-collaboration": "Team Collaboration",
  "ai-assistance": "AI Assistance",
}

const organizationTypeLabels: Record<
  NonNullable<Organization["type"]>,
  string
> = {
  "general-contractor": "General Contractor",
  "quantity-surveying":
    "Quantity Surveying / Cost Management",
  "project-management": "Project Management",
  "real-estate-developer": "Real Estate Developer",
  architecture: "Architecture / Design",
  engineering: "Engineering",
  subcontractor: "Subcontractor",
  "construction-consultancy":
    "Construction Consultancy",
  other: "Other",
}

const organizationSizeLabels: Record<
  NonNullable<Organization["size"]>,
  string
> = {
  "1-10": "1–10 employees",
  "11-50": "11–50 employees",
  "51-200": "51–200 employees",
  "201-500": "201–500 employees",
  "500+": "500+ employees",
}

const projectTypeLabels: Record<
  NonNullable<Organization["projectTypes"]>[number],
  string
> = {
  residential: "Residential",
  commercial: "Commercial",
  industrial: "Industrial",
  infrastructure: "Infrastructure",
  renovation: "Renovation",
  "mixed-use": "Mixed Use",
}

function ReviewSection({
  title,
  step,
  onEdit,
  children,
}: {
  title: string
  step: number
  onEdit: (step: number) => void
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4 rounded-xl border p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-medium">
          {title}
        </h3>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onEdit(step)}
        >
          <Pencil
            className="size-3.5"
            aria-hidden="true"
          />
          Edit
        </Button>
      </div>

      {children}
    </section>
  )
}

function Detail({
  label,
  value,
}: {
  label: string
  value?: string
}) {
  return (
    <div className="space-y-1">
      <dt className="text-xs text-muted-foreground">
        {label}
      </dt>

      <dd className="text-sm font-medium">
        {value || "Not provided"}
      </dd>
    </div>
  )
}

export function OnboardingReview({
  organization,
  modules,
  team,
  onEdit,
  onComplete,
}: OnboardingReviewProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
          <Check
            className="size-5 text-primary"
            aria-hidden="true"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold">
            Review your setup
          </h2>

          <p className="text-sm text-muted-foreground">
            Everything looks good? Complete your setup to enter
            your BuildFlow workspace.
          </p>
        </div>
      </div>

      <ReviewSection
        title="Organization"
        step={1}
        onEdit={onEdit}
      >
        <dl className="grid gap-4 sm:grid-cols-2">
          <Detail
            label="Organization name"
            value={organization.name}
          />

          <Detail
            label="Legal name"
            value={organization.legalName}
          />

          <Detail
            label="Business email"
            value={organization.email}
          />

          <Detail
            label="Phone"
            value={organization.phone}
          />

          <Detail
            label="Website"
            value={organization.website}
          />

          <Detail
            label="Country"
            value={organization.country}
          />

          <Detail
            label="City"
            value={organization.city}
          />

          <Detail
            label="State / Province"
            value={organization.state}
          />

          <div className="space-y-1 sm:col-span-2">
            <dt className="text-xs text-muted-foreground">
              Business address
            </dt>

            <dd className="text-sm font-medium">
              {organization.address || "Not provided"}
            </dd>
          </div>
        </dl>
      </ReviewSection>

      <ReviewSection
        title="Construction context"
        step={2}
        onEdit={onEdit}
      >
        <dl className="grid gap-4 sm:grid-cols-2">
          <Detail
            label="Organization type"
            value={
              organization.type
                ? organizationTypeLabels[organization.type]
                : undefined
            }
          />

          <Detail
            label="Organization size"
            value={
              organization.size
                ? organizationSizeLabels[organization.size]
                : undefined
            }
          />
        </dl>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Project types
          </p>

          <div className="flex flex-wrap gap-2">
            {organization.projectTypes?.length ? (
              organization.projectTypes.map((type) => (
                <span
                  key={type}
                  className="rounded-full border bg-muted px-2.5 py-1 text-xs font-medium"
                >
                  {projectTypeLabels[type]}
                </span>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">
                None selected
              </span>
            )}
          </div>
        </div>
      </ReviewSection>

      <ReviewSection
        title="Workspace"
        step={3}
        onEdit={onEdit}
      >
        <div className="flex flex-wrap gap-2">
          {modules.length ? (
            modules.map((module) => (
              <span
                key={module}
                className="rounded-full border bg-muted px-2.5 py-1 text-xs font-medium"
              >
                {moduleLabels[module]}
              </span>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">
              No modules selected
            </span>
          )}
        </div>
      </ReviewSection>

      <ReviewSection
        title="Team"
        step={4}
        onEdit={onEdit}
      >
        {team.length ? (
          <div className="space-y-3">
            {team.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between gap-4 rounded-lg bg-muted/40 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {member.email}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {member.role === "admin"
                      ? "Admin"
                      : "Member"}{" "}
                    · Invitation pending
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No additional team members added yet.
          </p>
        )}
      </ReviewSection>

      <div className="border-t pt-6">
        <Button
          type="button"
          className="w-full"
          onClick={onComplete}
        >
          Complete Setup
          <Check
            className="size-4"
            aria-hidden="true"
          />
        </Button>
      </div>
    </div>
  )
}