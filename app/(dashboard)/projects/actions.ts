"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

import { getCurrentOrganizationMembership } from "@/lib/auth"
import { requirePermission } from "@/lib/auth/guards"
import {
  createBoq,
  createBoqItem,
  createBoqSection,
  deleteBoqItem,
  deleteBoqSection,
  updateBoqItem,
  updateBoqSection,
} from "@/lib/data/db/boq"
import { requireBoqAccess } from "@/lib/auth/boq-access"
import {
  createProject,
  deleteProject,
  updateProject,
} from "@/lib/data/db/projects"
import { prisma } from "@/lib/db/prisma"

const projectStatusSchema = z.enum([
  "planning",
  "active",
  "completed",
  "on-hold",
  "at-risk",
])

const boqUnitSchema = z.enum([
  "ITEM",
  "M",
  "M2",
  "M3",
  "KG",
  "TONNE",
  "LITRE",
  "DAY",
  "HOUR",
  "LS",
])

const boqItemStatusSchema = z.enum([
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
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
    .refine((value) => {
      const amount = Number(value)
      return Number.isFinite(amount) && amount >= 0
    }, "Enter a valid budget."),
  progress: z
    .string()
    .trim()
    .refine((value) => {
      const amount = Number(value)
      return (
        Number.isInteger(amount) &&
        amount >= 0 &&
        amount <= 100
      )
    }, "Progress must be a whole number between 0 and 100."),
  startDate: z.string().trim().optional(),
  endDate: z.string().trim().optional(),
})

const updateProjectSchema = createProjectSchema.extend({
  status: projectStatusSchema,
})

const createBoqSchema = z.object({
  projectId: z.string().trim().min(1),
  name: z
    .string()
    .trim()
    .min(2, "BOQ name must be at least 2 characters.")
    .max(160, "BOQ name is too long."),
  description: z
    .string()
    .trim()
    .max(1000, "BOQ description is too long.")
    .optional(),
})

const boqSectionSchema = z.object({
  boqId: z.string().trim().min(1),
  projectId: z.string().trim().min(1),
  name: z
    .string()
    .trim()
    .min(2, "Section name must be at least 2 characters.")
    .max(160, "Section name is too long."),
  description: z
    .string()
    .trim()
    .max(500, "Section description is too long.")
    .optional(),
})

const updateBoqSectionSchema = z.object({
  sectionId: z.string().trim().min(1),
  projectId: z.string().trim().min(1),
  name: z
    .string()
    .trim()
    .min(2, "Section name must be at least 2 characters.")
    .max(160, "Section name is too long."),
  description: z
    .string()
    .trim()
    .max(500, "Section description is too long.")
    .optional(),
})

const deleteBoqSectionSchema = z.object({
  sectionId: z.string().trim().min(1),
  projectId: z.string().trim().min(1),
})

const boqItemSchema = z.object({
  sectionId: z.string().trim().min(1),
  projectId: z.string().trim().min(1),
  itemCode: z
    .string()
    .trim()
    .min(1, "Item code is required.")
    .max(50, "Item code is too long."),
  description: z
    .string()
    .trim()
    .min(2, "Item description must be at least 2 characters.")
    .max(500, "Item description is too long."),
  unit: boqUnitSchema,
  quantity: z
    .string()
    .trim()
    .min(1, "Quantity is required.")
    .refine((value) => {
      const amount = Number(value)
      return Number.isFinite(amount) && amount >= 0
    }, "Enter a valid quantity."),
  rate: z
    .string()
    .trim()
    .min(1, "Rate is required.")
    .refine((value) => {
      const amount = Number(value)
      return Number.isFinite(amount) && amount >= 0
    }, "Enter a valid rate."),
})

const updateBoqItemSchema = boqItemSchema.extend({
  itemId: z.string().trim().min(1),
  status: boqItemStatusSchema,
})

const deleteBoqItemSchema = z.object({
  itemId: z.string().trim().min(1),
  projectId: z.string().trim().min(1),
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

async function revalidateBoq(projectId: string) {
  revalidatePath(`/projects/${projectId}/boq`)
  revalidatePath(`/projects/${projectId}`)
}

export async function createProjectAction(
  formData: FormData
) {
  const membership =
    await getCurrentOrganizationMembership()

  if (!membership) {
    throw new Error(
      "You must belong to an organization."
    )
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
  const membership =
    await getCurrentOrganizationMembership()

  if (!membership) {
    throw new Error(
      "You must belong to an organization."
    )
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
  const membership =
    await getCurrentOrganizationMembership()

  if (!membership) {
    throw new Error(
      "You must belong to an organization."
    )
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

export async function createBoqAction(
  formData: FormData
) {
  const parsed = createBoqSchema.safeParse({
    projectId: formData.get("projectId"),
    name: formData.get("name"),
    description: formData.get("description"),
  })

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "Invalid BOQ details."
    )
  }

  const data = parsed.data

  await requireBoqAccess(
    data.projectId,
    "boq:create"
  )

  const existingBoq = await prisma.boq.findUnique({
    where: {
      projectId: data.projectId,
    },
    select: {
      id: true,
    },
  })

  if (existingBoq) {
    throw new Error(
      "A BOQ already exists for this project."
    )
  }

  await createBoq({
    projectId: data.projectId,
    name: data.name,
    description: getOptionalValue(data.description),
  })

  await revalidateBoq(data.projectId)

  return { success: true }
}

export async function createBoqSectionAction(
  formData: FormData
) {
  const parsed = boqSectionSchema.safeParse({
    boqId: formData.get("boqId"),
    projectId: formData.get("projectId"),
    name: formData.get("name"),
    description: formData.get("description"),
  })

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "Invalid section details."
    )
  }

  const data = parsed.data

  const { membership } = await requireBoqAccess(
    data.projectId,
    "boq:update"
  )

  const boq = await prisma.boq.findFirst({
    where: {
      id: data.boqId,
      projectId: data.projectId,
    },
    select: {
      id: true,
      _count: {
        select: {
          sections: true,
        },
      },
    },
  })

  if (!boq) {
    throw new Error("BOQ not found.")
  }

  await createBoqSection({
    boqId: boq.id,
    organizationId: membership.organizationId,
    name: data.name,
    description: getOptionalValue(data.description),
    sortOrder: boq._count.sections,
  })

  await revalidateBoq(data.projectId)

  return { success: true }
}

export async function updateBoqSectionAction(
  formData: FormData
) {
  const parsed = updateBoqSectionSchema.safeParse({
    sectionId: formData.get("sectionId"),
    projectId: formData.get("projectId"),
    name: formData.get("name"),
    description: formData.get("description"),
  })

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "Invalid section details."
    )
  }

  const data = parsed.data

  const { membership } = await requireBoqAccess(
    data.projectId,
    "boq:update"
  )

  const section = await updateBoqSection(
    data.sectionId,
    membership.organizationId,
    {
      name: data.name,
      description: getOptionalValue(data.description),
    }
  )

  if (!section) {
    throw new Error("Section not found.")
  }

  await revalidateBoq(data.projectId)

  return { success: true }
}

export async function deleteBoqSectionAction(
  formData: FormData
) {
  const parsed = deleteBoqSectionSchema.safeParse({
    sectionId: formData.get("sectionId"),
    projectId: formData.get("projectId"),
  })

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "Invalid section."
    )
  }

  const data = parsed.data

  const { membership } = await requireBoqAccess(
    data.projectId,
    "boq:delete"
  )

  const section = await deleteBoqSection(
    data.sectionId,
    membership.organizationId
  )

  if (!section) {
    throw new Error("Section not found.")
  }

  await revalidateBoq(data.projectId)

  return { success: true }
}

export async function createBoqItemAction(
  formData: FormData
) {
  const parsed = boqItemSchema.safeParse({
    sectionId: formData.get("sectionId"),
    projectId: formData.get("projectId"),
    itemCode: formData.get("itemCode"),
    description: formData.get("description"),
    unit: formData.get("unit"),
    quantity: formData.get("quantity"),
    rate: formData.get("rate"),
  })

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "Invalid BOQ item."
    )
  }

  const data = parsed.data

  const { membership } = await requireBoqAccess(
    data.projectId,
    "boq:update"
  )

  const section = await prisma.boqSection.findFirst({
    where: {
      id: data.sectionId,
      boq: {
        projectId: data.projectId,
      },
    },
    select: {
      id: true,
      _count: {
        select: {
          items: true,
        },
      },
    },
  })

  if (!section) {
    throw new Error("Section not found.")
  }

  try {
    await createBoqItem({
      sectionId: section.id,
      organizationId: membership.organizationId,
      itemCode: data.itemCode,
      description: data.description,
      unit: data.unit,
      quantity: data.quantity,
      rate: data.rate,
      sortOrder: section._count.items,
    })
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      throw new Error(
        "An item with this code already exists in this section."
      )
    }

    throw error
  }

  await revalidateBoq(data.projectId)

  return { success: true }
}

export async function updateBoqItemAction(
  formData: FormData
) {
  const parsed = updateBoqItemSchema.safeParse({
    itemId: formData.get("itemId"),
    sectionId: formData.get("sectionId"),
    projectId: formData.get("projectId"),
    itemCode: formData.get("itemCode"),
    description: formData.get("description"),
    unit: formData.get("unit"),
    quantity: formData.get("quantity"),
    rate: formData.get("rate"),
    status: formData.get("status"),
  })

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "Invalid BOQ item."
    )
  }

  const data = parsed.data

  const { membership } = await requireBoqAccess(
    data.projectId,
    "boq:update"
  )

  const item = await updateBoqItem(
    data.itemId,
    membership.organizationId,
    {
      itemCode: data.itemCode,
      description: data.description,
      unit: data.unit,
      quantity: data.quantity,
      rate: data.rate,
      status: data.status,
    }
  )

  if (!item) {
    throw new Error("BOQ item not found.")
  }

  await revalidateBoq(data.projectId)

  return { success: true }
}

export async function deleteBoqItemAction(
  formData: FormData
) {
  const parsed = deleteBoqItemSchema.safeParse({
    itemId: formData.get("itemId"),
    projectId: formData.get("projectId"),
  })

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "Invalid BOQ item."
    )
  }

  const data = parsed.data

  const { membership } = await requireBoqAccess(
    data.projectId,
    "boq:update"
  )

  const item = await deleteBoqItem(
    data.itemId,
    membership.organizationId
  )

  if (!item) {
    throw new Error("BOQ item not found.")
  }

  await revalidateBoq(data.projectId)

  return { success: true }
}