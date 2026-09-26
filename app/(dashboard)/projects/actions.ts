"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

import { getCurrentOrganizationMembership } from "@/lib/auth"
import { requirePermission } from "@/lib/auth/guards"
import {
  createProject,
  deleteProject,
  updateProject,
} from "@/lib/data/db/projects"

const projectStatusSchema = z.enum([
  "planning",
  "active",
  "completed",
  "on-hold",
  "at-risk",
])

const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Project name must be at least 2 characters.")
    .max(120, "Project name is too long."),

  slug: z
    .string()
    .trim()
    .min(2, "Project slug must be at least 2 characters.")
    .max(120, "Project slug is too long.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Project slug can only contain lowercase letters, numbers, and hyphens."
    ),

  description: z
    .string()
    .trim()
    .max(1000, "Description is too long.")
    .optional(),

  client: z
    .string()
    .trim()
    .max(160, "Client name is too long.")
    .optional(),

  location: z
    .string()
    .trim()
    .max(160, "Location is too long.")
    .optional(),

  budget: z
    .string()
    .trim()
    .min(1, "Budget is required.")
    .refine(
      (value) => {
        const amount = Number(value)

        return Number.isFinite(amount) && amount >= 0
      },
      "Enter a valid budget."
    ),

  progress: z
    .string()
    .trim()
    .refine(
      (value) => {
        const amount = Number(value)

        return (
          Number.isInteger(amount) &&
          amount >= 0 &&
          amount <= 100
        )
      },
      "Progress must be a whole number between 0 and 100."
    ),

  startDate: z.string().trim().optional(),

  endDate: z.string().trim().optional(),
})

const updateProjectSchema = createProjectSchema.extend({
  status: projectStatusSchema,
})

const statusMap = {
  planning: "PLANNING",
  active: "ACTIVE",
  completed: "COMPLETED",
  "on-hold": "ON_HOLD",
  "at-risk": "AT_RISK",
} as const

function getOptionalValue(value: string | undefined) {
  const trimmed = value?.trim()

  return trimmed ? trimmed : null
}

function getOptionalDate(value: string | undefined) {
  const trimmed = value?.trim()

  if (!trimmed) {
    return null
  }

  const date = new Date(`${trimmed}T00:00:00`)

  return Number.isNaN(date.getTime()) ? null : date
}

export async function createProjectAction(
  formData: FormData
) {
  const membership = await getCurrentOrganizationMembership()

  if (!membership) {
    throw new Error("You must belong to an organization.")
  }

  requirePermission(membership, "projects:create")

  const parsed = createProjectSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    client: formData.get("client"),
    location: formData.get("location"),
    budget: formData.get("budget"),
    progress: formData.get("progress"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
  })

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "Invalid project details."
    )
  }

  const data = parsed.data

  let project

  try {
    project = await createProject({
      organizationId: membership.organizationId,
      name: data.name,
      slug: data.slug,
      description: getOptionalValue(data.description),
      client: getOptionalValue(data.client),
      location: getOptionalValue(data.location),
      budget: data.budget,
      progress: Number(data.progress),
      startDate: getOptionalDate(data.startDate),
      endDate: getOptionalDate(data.endDate),
    })
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      throw new Error(
        "A project with this slug already exists in your organization. Please choose a different slug."
      )
    }

    throw error
  }

  redirect(`/projects/${project.id}`)
}

export async function updateProjectAction(
  projectId: string,
  formData: FormData
) {
  const membership = await getCurrentOrganizationMembership()

  if (!membership) {
    throw new Error("You must belong to an organization.")
  }

  requirePermission(membership, "projects:update")

  const parsed = updateProjectSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    client: formData.get("client"),
    location: formData.get("location"),
    budget: formData.get("budget"),
    progress: formData.get("progress"),
    status: formData.get("status"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
  })

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "Invalid project details."
    )
  }

  const data = parsed.data

  let project

  try {
    project = await updateProject(
      projectId,
      membership.organizationId,
      {
        name: data.name,
        slug: data.slug,
        description: getOptionalValue(data.description),
        client: getOptionalValue(data.client),
        location: getOptionalValue(data.location),
        status: statusMap[data.status],
        budget: data.budget,
        progress: Number(data.progress),
        startDate: getOptionalDate(data.startDate),
        endDate: getOptionalDate(data.endDate),
      }
    )
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      throw new Error(
        "A project with this slug already exists in your organization. Please choose a different slug."
      )
    }

    throw error
  }

  if (!project) {
    throw new Error("Project not found.")
  }

  revalidatePath("/projects")
  revalidatePath(`/projects/${project.id}`)
  revalidatePath(`/projects/${project.id}/edit`)

  redirect(`/projects/${project.id}`)
}

export async function deleteProjectAction(
  projectId: string
) {
  const membership = await getCurrentOrganizationMembership()

  if (!membership) {
    throw new Error("You must belong to an organization.")
  }

  requirePermission(membership, "projects:delete")

  const project = await deleteProject(
    projectId,
    membership.organizationId
  )

  if (!project) {
    throw new Error("Project not found.")
  }

  revalidatePath("/projects")
  revalidatePath(`/projects/${projectId}`)

  redirect("/projects")
}