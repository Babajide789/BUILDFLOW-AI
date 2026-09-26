import { prisma } from "@/lib/db/prisma"
import type {
  BoqItemStatus,
  BoqUnit,
  Prisma,
} from "@/generated/prisma/client"

export interface CreateBoqInput {
  projectId: string
  name: string
  description?: string | null
}

export interface CreateBoqSectionInput {
  boqId: string
  name: string
  description?: string | null
  sortOrder?: number
}

export interface CreateBoqItemInput {
  sectionId: string
  itemCode: string
  description: string
  unit: BoqUnit
  quantity: Prisma.Decimal | number | string
  rate: Prisma.Decimal | number | string
  status?: BoqItemStatus
  sortOrder?: number
}

export async function createBoq(
  input: CreateBoqInput
) {
  return prisma.boq.create({
    data: {
      projectId: input.projectId,
      name: input.name,
      description: input.description ?? null,
    },
  })
}

export async function getProjectBoq(
  projectId: string
) {
  return prisma.boq.findUnique({
    where: {
      projectId,
    },
    include: {
      sections: {
        orderBy: {
          sortOrder: "asc",
        },
        include: {
          items: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      },
    },
  })
}

export async function createBoqSection(
  input: CreateBoqSectionInput
) {
  return prisma.boqSection.create({
    data: {
      boqId: input.boqId,
      name: input.name,
      description: input.description ?? null,
      sortOrder: input.sortOrder ?? 0,
    },
  })
}

export async function createBoqItem(
  input: CreateBoqItemInput
) {
  return prisma.boqItem.create({
    data: {
      sectionId: input.sectionId,
      itemCode: input.itemCode,
      description: input.description,
      unit: input.unit,
      quantity: input.quantity,
      rate: input.rate,
      status: input.status ?? "ACTIVE",
      sortOrder: input.sortOrder ?? 0,
    },
  })
}