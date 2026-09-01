interface ProjectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { projectId } = await params;

  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-semibold tracking-tight">
          Project {projectId}
        </h1>

        <p className="mt-2 text-muted-foreground">
          Project details will be implemented in a later sprint.
        </p>
      </div>
    </div>
  );
}