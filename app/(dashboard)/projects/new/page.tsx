import { redirect } from "next/navigation"

import { CreateProjectForm } from "@/components/dashboard/create-project-form"
import { getCurrentOrganizationMembership } from "@/lib/auth"
import { requirePermission } from "@/lib/auth/guards"

export default async function NewProjectPage() {
  const membership = await getCurrentOrganizationMembership()

  if (!membership) {
    redirect("/projects")
  }

  requirePermission(membership, "projects:create")

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 p-4 md:p-6 lg:p-8">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          Projects
        </p>

        <h1 className="text-3xl font-semibold tracking-tight">
          Create project
        </h1>

        <p className="text-muted-foreground">
          Add a new construction project to your organization.
        </p>
      </div>

      <CreateProjectForm />
    </div>
  )
}