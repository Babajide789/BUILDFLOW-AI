import { prisma } from "@/lib/db/prisma"
import type { Prisma, ProjectStatus } from "@/generated/prisma/client"

export interface CreateProjectInput {
  organizationId: string
  name: string
  slug: string
  description?: string | null
  client?: string | null
  location?: string | null
  status?: ProjectStatus
  budget: Prisma.Decimal | number | string
  progress?: number
  startDate?: Date | null
  endDate?: Date | null
}

export interface UpdateProjectInput {
  name?: string
  slug?: string
  description?: string | null
  client?: string | null
  location?: string | null
  status?: ProjectStatus
  budget?: Prisma.Decimal | number | string
  progress?: number
  startDate?: Date | null
  endDate?: Date | null
}

export async function createProject(input: CreateProjectInput) {
  return prisma.project.create({
    data: {
      organizationId: input.organizationId,
      name: input.name,
      slug: input.slug,
      description: input.description ?? null,
      client: input.client ?? null,
      location: input.location ?? null,
      status: input.status ?? "PLANNING",
      budget: input.budget,
      progress: input.progress ?? 0,
      startDate: input.startDate ?? null,
      endDate: input.endDate ?? null,
    },
  })
}

export async function getProject(
  projectId: string,
  organizationId: string
) {
  return prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId,
    },
  })
}

export async function getOrganizationProjects(organizationId: string) {
  return prisma.project.findMany({
    where: {
      organizationId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function updateProject(
  projectId: string,
  organizationId: string,
  input: UpdateProjectInput
) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId,
    },
    select: {
      id: true,
    },
  })

  if (!project) {
    return null
  }

  return prisma.project.update({
    where: {
      id: project.id,
    },
    data: input,
  })
}

export async function deleteProject(
  projectId: string,
  organizationId: string
) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId,
    },
    select: {
      id: true,
    },
  })

  if (!project) {
    return null
  }

  return prisma.project.delete({
    where: {
      id: project.id,
    },
  })
}