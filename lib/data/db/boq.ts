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
  organizationId: string
  name: string
  description?: string | null
  sortOrder?: number
}

export interface UpdateBoqSectionInput {
  name?: string
  description?: string | null
  sortOrder?: number
}

export interface CreateBoqItemInput {
  sectionId: string
  organizationId: string
  itemCode: string
  description: string
  unit: BoqUnit
  quantity: Prisma.Decimal | number | string
  rate: Prisma.Decimal | number | string
  status?: BoqItemStatus
  sortOrder?: number
}

export interface UpdateBoqItemInput {
  itemCode?: string
  description?: string
  unit?: BoqUnit
  quantity?: Prisma.Decimal | number | string
  rate?: Prisma.Decimal | number | string
  status?: BoqItemStatus
  sortOrder?: number
}

export async function createBoq(input: CreateBoqInput) {
  return prisma.boq.create({
    data: {
      projectId: input.projectId,
      name: input.name,
      description: input.description ?? null,
    },
  })
}

export async function getProjectBoq(projectId: string) {
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

export async function updateBoqSection(
  sectionId: string,
  organizationId: string,
  input: UpdateBoqSectionInput
) {
  const section = await prisma.boqSection.findFirst({
    where: {
      id: sectionId,
      boq: {
        project: {
          organizationId,
        },
      },
    },
    select: {
      id: true,
    },
  })

  if (!section) {
    return null
  }

  return prisma.boqSection.update({
    where: {
      id: section.id,
    },
    data: input,
  })
}

export async function deleteBoqSection(
  sectionId: string,
  organizationId: string
) {
  const section = await prisma.boqSection.findFirst({
    where: {
      id: sectionId,
      boq: {
        project: {
          organizationId,
        },
      },
    },
    select: {
      id: true,
    },
  })

  if (!section) {
    return null
  }

  return prisma.boqSection.delete({
    where: {
      id: section.id,
    },
  })
}

export async function createBoqItem(
  input: CreateBoqItemInput
) {
  const section = await prisma.boqSection.findFirst({
    where: {
      id: input.sectionId,
      boq: {
        project: {
          organizationId: input.organizationId,
        },
      },
    },
    select: {
      id: true,
    },
  })

  if (!section) {
    return null
  }

  return prisma.boqItem.create({
    data: {
      sectionId: section.id,
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

export async function updateBoqItem(
  itemId: string,
  organizationId: string,
  input: UpdateBoqItemInput
) {
  const item = await prisma.boqItem.findFirst({
    where: {
      id: itemId,
      section: {
        boq: {
          project: {
            organizationId,
          },
        },
      },
    },
    select: {
      id: true,
    },
  })

  if (!item) {
    return null
  }

  return prisma.boqItem.update({
    where: {
      id: item.id,
    },
    data: input,
  })
}

export async function deleteBoqItem(
  itemId: string,
  organizationId: string
) {
  const item = await prisma.boqItem.findFirst({
    where: {
      id: itemId,
      section: {
        boq: {
          project: {
            organizationId,
          },
        },
      },
    },
    select: {
      id: true,
    },
  })

  if (!item) {
    return null
  }

  return prisma.boqItem.delete({
    where: {
      id: item.id,
    },
  })
}