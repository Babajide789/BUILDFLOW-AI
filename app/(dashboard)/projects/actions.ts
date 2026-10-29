"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { Prisma } from "@/generated/prisma/client"

import { getCurrentOrganizationMembership } from "@/lib/auth"
import { requireBoqAccess } from "@/lib/auth/boq-access"
import {
  requireProcurementAccess,
  requireProjectProcurementRequestAccess,
  requireSupplierAccess,
} from "@/lib/auth/procurement-access"
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
import {
  createProcurementRequestWithItems,
  createProcurementRequestItem,
  createSupplier,
  deleteProcurementRequest,
  deleteProcurementRequestItem,
  deleteSupplier,
  updateProcurementRequest,
  updateProcurementRequestItem,
  updateSupplier,
} from "@/lib/data/db/procurement"
import {
  createProject,
  deleteProject,
  updateProject,
} from "@/lib/data/db/projects"
import { prisma } from "@/lib/db/prisma"
import {
  canEditProcurementRequest,
  canEditProcurementRequestItems,
  getNextProcurementStatus,
} from "@/lib/data/procurement-workflow"
import type { ProcurementRequestStatus as DomainProcurementRequestStatus } from "@/lib/types/procurement"

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

const supplierStatusSchema = z.enum([
  "active",
  "inactive",
])

const procurementRequestStatusSchema = z.enum([
  "DRAFT",
  "SUBMITTED",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
])

function isValidDateOnly(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const date = new Date(`${value}T00:00:00.000Z`)

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  )
}

const optionalProjectDateSchema = z.preprocess(
  (value) => {
    if (value === null || value === undefined) {
      return undefined
    }

    if (typeof value === "string" && value.trim() === "") {
      return undefined
    }

    return value
  },
  z
    .string()
    .trim()
    .refine(
      isValidDateOnly,
      "Enter a valid project date in YYYY-MM-DD format."
    )
    .optional()
)

const projectSchemaFields = z.object({
  name: z.string().trim().min(2, "Project name must be at least 2 characters.").max(120, "Project name is too long."),
  slug: z.string().trim().min(2, "Project slug must be at least 2 characters.").max(120, "Project slug is too long.").regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Project slug can only contain lowercase letters, numbers, and hyphens."
  ),
  description: z.string().trim().max(1000, "Description is too long.").optional(),
  client: z.string().trim().max(160, "Client name is too long.").optional(),
  location: z.string().trim().max(160, "Location is too long.").optional(),
  startDate: optionalProjectDateSchema,
  endDate: optionalProjectDateSchema,
})

const createProjectSchema = projectSchemaFields.superRefine(
  (data, context) => {
    if (
      data.startDate &&
      data.endDate &&
      data.startDate > data.endDate
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "Project end date cannot be earlier than its start date.",
      })
    }
  }
)

const updateProjectSchema = projectSchemaFields.extend({
  status: projectStatusSchema,
}).superRefine((data, context) => {
  if (
    data.startDate &&
    data.endDate &&
    data.startDate > data.endDate
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["endDate"],
      message: "Project end date cannot be earlier than its start date.",
    })
  }
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

/**
 * Validate a non-negative decimal string against the Prisma Decimal column.
 * BoqItem.quantity is Decimal(18, 4): at most 14 integer and 4 fractional digits.
 * BoqItem.rate is Decimal(18, 2): at most 16 integer and 2 fractional digits.
 *
 * Do not use Number() for validation here: it can accept exponent notation and
 * cannot reliably enforce the database scale/precision contract.
 */
function boqDecimalInputSchema(
  label: string,
  maxIntegerDigits: number,
  maxFractionDigits: number
) {
  return z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .refine(
      (value) => /^\d+(?:\.\d+)?$/.test(value),
      `Enter a valid non-negative ${label.toLowerCase()}.`
    )
    .refine((value) => {
      const [integerPart, fractionPart = ""] = value.split(".")
      const significantIntegerDigits = integerPart.replace(/^0+/, "").length

      return (
        significantIntegerDigits <= maxIntegerDigits &&
        fractionPart.length <= maxFractionDigits
      )
    }, `${label} exceeds the supported precision (${maxIntegerDigits} integer digits and ${maxFractionDigits} decimal places).`)
}

const boqItemSchema = z.object({
  sectionId: z.string().trim().min(1),
  projectId: z.string().trim().min(1),
  itemCode: z
    .string()
    .trim()
    .min(1, "Item code is required.")
    .max(50, "Item code is too long.")
    .transform((value) => value.toUpperCase()),
  description: z
    .string()
    .trim()
    .min(2, "Item description must be at least 2 characters.")
    .max(500, "Item description is too long."),
  unit: boqUnitSchema,
  quantity: boqDecimalInputSchema("Quantity", 14, 4),
  rate: boqDecimalInputSchema("Rate", 16, 2),
})

const updateBoqItemSchema = boqItemSchema.extend({
  itemId: z.string().trim().min(1),
  status: boqItemStatusSchema,
})

const deleteBoqItemSchema = z.object({
  itemId: z.string().trim().min(1),
  projectId: z.string().trim().min(1),
})

const createSupplierSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Supplier name must be at least 2 characters.")
    .max(160, "Supplier name is too long."),
  contact: z
    .string()
    .trim()
    .max(160, "Contact name is too long.")
    .optional(),
  email: z
    .string()
    .trim()
    .email("Enter a valid supplier email.")
    .max(160, "Supplier email is too long.")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .trim()
    .max(50, "Supplier phone number is too long.")
    .optional(),
  address: z
    .string()
    .trim()
    .max(500, "Supplier address is too long.")
    .optional(),
  status: supplierStatusSchema.optional(),
})

const updateSupplierSchema = createSupplierSchema.extend({
  supplierId: z.string().trim().min(1),
})

const deleteSupplierSchema = z.object({
  supplierId: z.string().trim().min(1),
})

const createProcurementRequestSchema = z.object({
  projectId: z.string().trim().min(1),
  reference: z
    .string()
    .trim()
    .min(2, "Request reference is required.")
    .max(100, "Request reference is too long."),
  description: z
    .string()
    .trim()
    .max(1000, "Request description is too long.")
    .optional(),
  supplierId: z
    .string()
    .trim()
    .optional(),
  status: procurementRequestStatusSchema.optional(),
})

const updateProcurementRequestSchema =
  createProcurementRequestSchema.extend({
    requestId: z.string().trim().min(1),
  })

const deleteProcurementRequestSchema = z.object({
  requestId: z.string().trim().min(1),
  projectId: z.string().trim().min(1),
})

const createProcurementRequestItemSchema = z.object({
  projectId: z.string().trim().min(1),
  procurementRequestId: z.string().trim().min(1),
  boqItemId: z.string().trim().min(1),
  quantity: z
    .string()
    .trim()
    .min(1, "Quantity is required.")
    .refine((value) => {
      const amount = Number(value)

      return (
        Number.isFinite(amount) &&
        amount > 0
      )
    }, "Enter a valid quantity greater than zero."),
  notes: z
    .string()
    .trim()
    .max(500, "Item notes are too long.")
    .optional(),
})

const updateProcurementRequestItemSchema = z.object({
  itemId: z.string().trim().min(1),
  projectId: z.string().trim().min(1),
  quantity: z
    .string()
    .trim()
    .min(1, "Quantity is required.")
    .refine((value) => {
      const amount = Number(value)

      return (
        Number.isFinite(amount) &&
        amount > 0
      )
    }, "Enter a valid quantity greater than zero."),
  notes: z
    .string()
    .trim()
    .max(500, "Item notes are too long.")
    .optional(),
})

const deleteProcurementRequestItemSchema = z.object({
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

const supplierStatusMap = {
  active: "ACTIVE",
  inactive: "INACTIVE",
} as const

function getOptionalDate(value: string | undefined) {
  const trimmed = value?.trim()

  if (!trimmed) {
    return null
  }

  // Project date schemas validate this value before it reaches persistence.
  // Keep a defensive check here so invalid dates can never silently become null.
  if (!isValidDateOnly(trimmed)) {
    throw new Error("Enter a valid project date in YYYY-MM-DD format.")
  }

  return new Date(`${trimmed}T00:00:00.000Z`)
}

/**
 * The current project budget is BOQ-derived, not an independently approved
 * contract sum. Include active and completed BOQ items, but exclude cancelled
 * items. Round the resulting monetary total to the project's 2-decimal scale.
 * A future cost-plan/contract-sum feature should introduce its own explicit
 * source of truth rather than silently reusing this derived value.
 */
async function syncProjectBudgetFromBoq(projectId: string) {
  const items = await prisma.boqItem.findMany({
    where: {
      status: { not: "CANCELLED" },
      section: {
        boq: {
          projectId,
        },
      },
    },
    select: {
      quantity: true,
      rate: true,
    },
  })

  // Round each BOQ line to currency precision before summing. This keeps the
  // stored project budget consistent with the line amounts shown in the BOQ.
  const total = items.reduce(
    (sum, item) =>
      sum.plus(item.quantity.mul(item.rate).toDecimalPlaces(2)),
    new Prisma.Decimal(0)
  ).toDecimalPlaces(2)

  await prisma.project.updateMany({
    where: { id: projectId },
    data: { budget: total },
  })

  revalidatePath("/projects")
}

/**
 * Project progress remains a value-weighted BOQ status estimate until a future
 * execution-tracking milestone introduces measured actual quantities. Cancelled
 * items are excluded from both the planned-value denominator and completed
 * value. Decimal arithmetic is retained until the final whole-percent result.
 */
async function syncProjectProgressFromBoq(projectId: string) {
  const items = await prisma.boqItem.findMany({
    where: {
      status: { not: "CANCELLED" },
      section: {
        boq: {
          projectId,
        },
      },
    },
    select: {
      quantity: true,
      rate: true,
      status: true,
    },
  })

  // Use the same per-line 2-decimal rounding as the BOQ and budget totals.
  const totalValue = items.reduce(
    (sum, item) =>
      sum.plus(item.quantity.mul(item.rate).toDecimalPlaces(2)),
    new Prisma.Decimal(0)
  )

  const completedValue = items.reduce(
    (sum, item) =>
      item.status === "COMPLETED"
        ? sum.plus(item.quantity.mul(item.rate).toDecimalPlaces(2))
        : sum,
    new Prisma.Decimal(0)
  )

  const progress = totalValue.gt(0)
    ? Math.round(completedValue.div(totalValue).mul(100).toNumber())
    : 0

  await prisma.project.updateMany({
    where: { id: projectId },
    data: { progress },
  })

  revalidatePath("/projects")
}

async function revalidateBoq(projectId: string) {
  revalidatePath(`/projects/${projectId}/boq`)
  revalidatePath(`/projects/${projectId}`)
  revalidatePath(`/projects/${projectId}/edit`)
  revalidatePath("/projects")
}

async function revalidateProcurement(
  projectId: string
) {
  revalidatePath(`/projects/${projectId}`)
  revalidatePath(
    `/projects/${projectId}/procurement`
  )
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

  requirePermission(
    membership,
    "projects:create"
  )

  const parsed = createProjectSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    client: formData.get("client"),
    location: formData.get("location"),
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
      description: getOptionalValue(
        data.description
      ),
      client: getOptionalValue(data.client),
      location: getOptionalValue(data.location),
      budget: 0,
      progress: 0,
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

  requirePermission(
    membership,
    "projects:update"
  )

  const parsed = updateProjectSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    client: formData.get("client"),
    location: formData.get("location"),
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
        description: getOptionalValue(
          data.description
        ),
        client: getOptionalValue(data.client),
        location: getOptionalValue(data.location),
        status: statusMap[data.status],
        startDate: getOptionalDate(
          data.startDate
        ),
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
  revalidatePath(
    `/projects/${project.id}/edit`
  )

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

  requirePermission(
    membership,
    "projects:delete"
  )

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
    description: getOptionalValue(
      data.description
    ),
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
    description: getOptionalValue(
      data.description
    ),
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
    data.projectId,
    membership.organizationId,
    {
      name: data.name,
      description: getOptionalValue(
        data.description
      ),
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
    data.projectId,
    membership.organizationId
  )

  if (!section) {
    throw new Error("Section not found.")
  }

  await syncProjectBudgetFromBoq(data.projectId)
  await syncProjectProgressFromBoq(data.projectId)
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

  await syncProjectBudgetFromBoq(data.projectId)
  await syncProjectProgressFromBoq(data.projectId)
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

  let item

  try {
    item = await updateBoqItem(
      data.itemId,
      data.projectId,
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

  if (!item) {
    throw new Error("BOQ item not found.")
  }

  await syncProjectBudgetFromBoq(data.projectId)
  await syncProjectProgressFromBoq(data.projectId)
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
    data.projectId,
    membership.organizationId
  )

  if (!item) {
    throw new Error("BOQ item not found.")
  }

  await syncProjectBudgetFromBoq(data.projectId)
  await syncProjectProgressFromBoq(data.projectId)
  await revalidateBoq(data.projectId)

  return { success: true }
}

export async function createSupplierAction(
  formData: FormData
) {
  const membership =
    await getCurrentOrganizationMembership()

  if (!membership) {
    throw new Error(
      "You must belong to an organization."
    )
  }

  requirePermission(
    membership,
    "procurement:create"
  )

  const parsed = createSupplierSchema.safeParse({
    name: formData.get("name"),
    contact: formData.get("contact"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    status:
      formData.get("status") || undefined,
  })

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "Invalid supplier details."
    )
  }

  const data = parsed.data

  const supplier = await createSupplier({
    organizationId: membership.organizationId,
    name: data.name,
    contact: getOptionalValue(data.contact),
    email: getOptionalValue(data.email),
    phone: getOptionalValue(data.phone),
    address: getOptionalValue(data.address),
    status: data.status
      ? supplierStatusMap[data.status]
      : undefined,
  })

  revalidatePath("/projects")

  return {
    success: true,
    supplierId: supplier.id,
  }
}

export async function updateSupplierAction(
  formData: FormData
) {
  const parsed = updateSupplierSchema.safeParse({
    supplierId: formData.get("supplierId"),
    name: formData.get("name"),
    contact: formData.get("contact"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    status:
      formData.get("status") || undefined,
  })

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "Invalid supplier details."
    )
  }

  const data = parsed.data

  const { supplier } =
    await requireSupplierAccess(
      data.supplierId,
      "procurement:update"
    )

  const updatedSupplier =
    await updateSupplier(
      supplier.id,
      supplier.organizationId,
      {
        name: data.name,
        contact: getOptionalValue(data.contact),
        email: getOptionalValue(data.email),
        phone: getOptionalValue(data.phone),
        address: getOptionalValue(data.address),
        status: data.status ? supplierStatusMap[data.status.toLowerCase() as keyof typeof supplierStatusMap] : undefined,
      }
    )

  if (!updatedSupplier) {
    throw new Error("Supplier not found.")
  }

  revalidatePath("/projects")

  return { success: true }
}

export async function deleteSupplierAction(
  formData: FormData
) {
  const parsed = deleteSupplierSchema.safeParse({
    supplierId: formData.get("supplierId"),
  })

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "Invalid supplier."
    )
  }

  const data = parsed.data

  const { supplier } =
    await requireSupplierAccess(
      data.supplierId,
      "procurement:delete"
    )

  const deletedSupplier =
    await deleteSupplier(
      supplier.id,
      supplier.organizationId
    )

  if (!deletedSupplier) {
    throw new Error("Supplier not found.")
  }

  revalidatePath("/projects")

  return { success: true }
}

function toDomainProcurementStatus(
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED" | "CANCELLED"
): DomainProcurementRequestStatus {
  const map = {
    DRAFT: "draft",
    SUBMITTED: "submitted",
    APPROVED: "approved",
    REJECTED: "rejected",
    CANCELLED: "cancelled",
  } as const

  return map[status]
}

function toPrismaProcurementStatus(
  status: DomainProcurementRequestStatus
) {
  const map = {
    draft: "DRAFT",
    submitted: "SUBMITTED",
    approved: "APPROVED",
    rejected: "REJECTED",
    cancelled: "CANCELLED",
  } as const

  return map[status]
}

async function validateProcurementSupplier(
  supplierId: string | null | undefined,
  permission: "procurement:create" | "procurement:update"
) {
  if (!supplierId) {
    return
  }

  await requireSupplierAccess(supplierId, permission)
}

export async function createProcurementRequestAction(
  formData: FormData
) {
  const parsed =
    createProcurementRequestSchema.safeParse({
      projectId: formData.get("projectId"),
      reference: formData.get("reference"),
      description: formData.get("description"),
      supplierId:
        formData.get("supplierId") ||
        undefined,
      status:
        formData.get("status") ||
        undefined,
    })

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "Invalid procurement request."
    )
  }

  const data = parsed.data

  const { membership } =
    await requireProcurementAccess(
      data.projectId,
      "procurement:create"
    )

  if (data.status && data.status !== "DRAFT") {
    throw new Error(
      "New procurement requests must start in draft status."
    )
  }

  const supplierId = getOptionalValue(data.supplierId)

  await validateProcurementSupplier(
    supplierId,
    "procurement:create"
  )

  const boqItemIds = formData
    .getAll("boqItemId")
    .map((value) => String(value).trim())
    .filter(Boolean)

  const items = boqItemIds.map((boqItemId) => {
    const quantity = String(
      formData.get(`quantity_${boqItemId}`) ?? ""
    ).trim()
    const notes = String(
      formData.get(`notes_${boqItemId}`) ?? ""
    ).trim()
    const numericQuantity = Number(quantity)

    if (
      !quantity ||
      !Number.isFinite(numericQuantity) ||
      numericQuantity <= 0
    ) {
      throw new Error(
        `Enter a valid quantity greater than zero for BOQ item ${boqItemId}.`
      )
    }

    return {
      boqItemId,
      quantity,
      notes: getOptionalValue(notes),
    }
  })

  try {
    const request = await createProcurementRequestWithItems({
      projectId: data.projectId,
      requestedById: membership.userId,
      reference: data.reference,
      description: getOptionalValue(data.description),
      supplierId,
      status: "DRAFT",
      items,
    })

    await revalidateProcurement(data.projectId)

    return {
      success: true,
      requestId: request.id,
    }
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      const target =
        "meta" in error &&
        error.meta &&
        typeof error.meta === "object" &&
        "target" in error.meta
          ? String(error.meta.target)
          : ""

      if (
        target.includes("procurementRequestId") ||
        target.includes("boqItemId")
      ) {
        throw new Error(
          "One of the selected BOQ items is already included in the procurement request."
        )
      }

      throw new Error(
        "A procurement request with this reference already exists in this project."
      )
    }

    throw error
  }
}

export async function updateProcurementRequestAction(
  formData: FormData
) {
  const parsed =
    updateProcurementRequestSchema.safeParse({
      requestId: formData.get("requestId"),
      projectId: formData.get("projectId"),
      reference: formData.get("reference"),
      description: formData.get("description"),
      supplierId:
        formData.get("supplierId") ||
        undefined,
      status:
        formData.get("status") ||
        undefined,
    })

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "Invalid procurement request."
    )
  }

  const data = parsed.data

  const { membership, request } =
    await requireProjectProcurementRequestAccess(
      data.projectId,
      data.requestId,
      "procurement:update"
    )

  const currentStatus = toDomainProcurementStatus(
    request.status
  )
  const targetStatus = data.status
    ? toDomainProcurementStatus(data.status)
    : currentStatus

  if (targetStatus === currentStatus) {
    if (!canEditProcurementRequest(currentStatus)) {
      throw new Error(
        "This procurement request is locked and cannot be edited in its current status."
      )
    }
  } else {
    const action =
      targetStatus === "submitted" &&
      currentStatus === "draft"
        ? "submit"
        : targetStatus === "approved" &&
            currentStatus === "submitted"
          ? "approve"
          : targetStatus === "rejected" &&
              currentStatus === "submitted"
            ? "reject"
            : targetStatus === "draft" &&
                currentStatus === "rejected"
              ? "return_to_draft"
              : targetStatus === "cancelled" &&
                  (currentStatus === "submitted" ||
                    currentStatus === "approved")
                ? "cancel"
                : null

    if (!action) {
      throw new Error(
        `Invalid procurement workflow transition: ${currentStatus} → ${targetStatus}.`
      )
    }

    const nextStatus = getNextProcurementStatus(
      currentStatus,
      action,
      membership.role
    )

    if (!nextStatus) {
      throw new Error(
        `You are not authorized to transition this request from ${currentStatus} to ${targetStatus}.`
      )
    }
  }

  const supplierId = formData.has("supplierId")
    ? getOptionalValue(data.supplierId)
    : request.supplierId

  await validateProcurementSupplier(
    supplierId,
    "procurement:update"
  )

  const updatedRequest =
    await updateProcurementRequest(
      request.id,
      data.projectId,
      {
        reference: data.reference,
        description: getOptionalValue(
          data.description
        ),
        supplierId,
        status: toPrismaProcurementStatus(
          targetStatus
        ),
      }
    )

  if (!updatedRequest) {
    throw new Error(
      "Procurement request not found."
    )
  }

  await revalidateProcurement(data.projectId)

  return { success: true }
}

export async function deleteProcurementRequestAction(
  formData: FormData
) {
  const parsed =
    deleteProcurementRequestSchema.safeParse({
      requestId: formData.get("requestId"),
      projectId: formData.get("projectId"),
    })

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "Invalid procurement request."
    )
  }

  const data = parsed.data

  const { request } =
    await requireProjectProcurementRequestAccess(
      data.projectId,
      data.requestId,
      "procurement:delete"
    )

  const currentStatus = toDomainProcurementStatus(
    request.status
  )

  if (!canEditProcurementRequest(currentStatus)) {
    throw new Error(
      "Only draft or rejected procurement requests can be deleted."
    )
  }

  const deletedRequest =
    await deleteProcurementRequest(
      request.id,
      data.projectId
    )

  if (!deletedRequest) {
    throw new Error(
      "Procurement request not found."
    )
  }

  await revalidateProcurement(data.projectId)

  return { success: true }
}

export async function createProcurementRequestItemAction(
  formData: FormData
) {
  const parsed =
    createProcurementRequestItemSchema.safeParse({
      projectId: formData.get("projectId"),
      procurementRequestId:
        formData.get("procurementRequestId"),
      boqItemId: formData.get("boqItemId"),
      quantity: formData.get("quantity"),
      notes: formData.get("notes"),
    })

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "Invalid procurement request item."
    )
  }

  const data = parsed.data

  const { request } =
    await requireProjectProcurementRequestAccess(
      data.projectId,
      data.procurementRequestId,
      "procurement:update"
    )

  const currentStatus = toDomainProcurementStatus(
    request.status
  )

  if (!canEditProcurementRequestItems(currentStatus)) {
    throw new Error(
      "Procurement request items are locked in the current request status."
    )
  }

  try {
    const item =
      await createProcurementRequestItem({
        procurementRequestId:
          data.procurementRequestId,
        boqItemId: data.boqItemId,
        quantity: data.quantity,
        notes: getOptionalValue(data.notes),
      })

    if (!item) {
      throw new Error(
        "The procurement request or BOQ item could not be found."
      )
    }

    await revalidateProcurement(data.projectId)

    return {
      success: true,
      itemId: item.id,
    }
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      throw new Error(
        "This BOQ item is already included in the procurement request."
      )
    }

    throw error
  }
}

export async function updateProcurementRequestItemAction(
  formData: FormData
) {
  const parsed =
    updateProcurementRequestItemSchema.safeParse({
      itemId: formData.get("itemId"),
      projectId: formData.get("projectId"),
      quantity: formData.get("quantity"),
      notes: formData.get("notes"),
    })

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "Invalid procurement request item."
    )
  }

  const data = parsed.data

  const { request } =
    await requireProjectProcurementRequestAccess(
      data.projectId,
      await getProcurementRequestIdForItem(data.itemId, data.projectId),
      "procurement:update"
    )

  const currentStatus = toDomainProcurementStatus(
    request.status
  )

  if (!canEditProcurementRequestItems(currentStatus)) {
    throw new Error(
      "Procurement request items are locked in the current request status."
    )
  }

  const item =
    await updateProcurementRequestItem(
      data.itemId,
      data.projectId,
      {
        quantity: data.quantity,
        notes: getOptionalValue(data.notes),
      }
    )

  if (!item) {
    throw new Error(
      "Procurement request item not found."
    )
  }

  await revalidateProcurement(data.projectId)

  return { success: true }
}

async function getProcurementRequestIdForItem(
  itemId: string,
  projectId: string
) {
  const item = await prisma.procurementRequestItem.findFirst({
    where: {
      id: itemId,
      procurementRequest: {
        projectId,
      },
    },
    select: {
      procurementRequestId: true,
    },
  })

  if (!item) {
    throw new Error("Procurement request item not found.")
  }

  return item.procurementRequestId
}

export async function deleteProcurementRequestItemAction(
  formData: FormData
) {
  const parsed =
    deleteProcurementRequestItemSchema.safeParse({
      itemId: formData.get("itemId"),
      projectId: formData.get("projectId"),
    })

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "Invalid procurement request item."
    )
  }

  const data = parsed.data

  const requestId = await getProcurementRequestIdForItem(
    data.itemId,
    data.projectId
  )

  const { request } =
    await requireProjectProcurementRequestAccess(
      data.projectId,
      requestId,
      "procurement:update"
    )

  const currentStatus = toDomainProcurementStatus(
    request.status
  )

  if (!canEditProcurementRequestItems(currentStatus)) {
    throw new Error(
      "Procurement request items are locked in the current request status."
    )
  }

  const item =
    await deleteProcurementRequestItem(
      data.itemId,
      data.projectId
    )

  if (!item) {
    throw new Error(
      "Procurement request item not found."
    )
  }

  await revalidateProcurement(data.projectId)

  return { success: true }
}