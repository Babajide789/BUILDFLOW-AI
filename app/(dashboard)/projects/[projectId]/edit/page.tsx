import { DeleteProjectButton } from "@/components/dashboard/delete-project-button"
import { EditProjectForm } from "@/components/dashboard/edit-project-form"
import { ProjectDetailHeader } from "@/components/dashboard/project-detail-header"
import { requireProjectAccess } from "@/lib/auth/project-access"

interface EditProjectPageProps {
  params: Promise<{ projectId: string }>
}

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { projectId } = await params

  const { project } = await requireProjectAccess(
    projectId,
    "projects:update"
  )

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 p-4 md:p-6 lg:p-8">
        <ProjectDetailHeader
            project={project}
            showEditAction={false}
        />

        <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
            Edit project
            </h1>

            <p className="text-muted-foreground">
            Update the project information and save your changes.
            </p>
        </div>

        <EditProjectForm project={project} />

        <div className="border-t pt-6">
            <div className="space-y-2">
            <h2 className="text-sm font-semibold">
                Danger zone
            </h2>

            <p className="text-sm text-muted-foreground">
                Permanently delete this project and its
                project record.
            </p>
        </div>

        <div className="mt-4">
          <DeleteProjectButton
            projectId={project.id}
          />
        </div>
      </div>
    </div>
  )
}