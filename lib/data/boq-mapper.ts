import type {
  Boq as PrismaBoq,
  BoqItem as PrismaBoqItem,
  BoqSection as PrismaBoqSection,
} from "@/generated/prisma/client"

import type {
  Boq,
  BoqItem,
  BoqItemStatus,
  BoqSection,
  BoqUnit,
} from "@/lib/types/boq"

const unitMap: Record<
  PrismaBoqItem["unit"],
  BoqUnit
> = {
  ITEM: "item",
  M: "m",
  M2: "m2",
  M3: "m3",
  KG: "kg",
  TONNE: "tonne",
  LITRE: "litre",
  DAY: "day",
  HOUR: "hour",
  LS: "ls",
}

const statusMap: Record<
  PrismaBoqItem["status"],
  BoqItemStatus
> = {
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
}

function mapBoqItem(
  item: PrismaBoqItem
): BoqItem {
  const quantity = Number(item.quantity)
  const rate = Number(item.rate)

  return {
    id: item.id,
    sectionId: item.sectionId,
    itemCode: item.itemCode,
    description: item.description,
    unit: unitMap[item.unit],
    quantity,
    rate,
    amount: quantity * rate,
    status: statusMap[item.status],
    sortOrder: item.sortOrder,
  }
}

function mapBoqSection(
  section: PrismaBoqSection & {
    items: PrismaBoqItem[]
  }
): BoqSection {
  return {
    id: section.id,
    boqId: section.boqId,
    name: section.name,
    description: section.description ?? "",
    sortOrder: section.sortOrder,
    items: section.items.map(mapBoqItem),
  }
}

export function mapBoq(
  boq: PrismaBoq & {
    sections: Array<
      PrismaBoqSection & {
        items: PrismaBoqItem[]
      }
    >
  }
): Boq {
  const sections = boq.sections.map(mapBoqSection)

  const items = sections.flatMap(
    (section) => section.items
  )

  const totalAmount = items.reduce(
    (total, item) => total + item.amount,
    0
  )

  const activeAmount = items
    .filter((item) => item.status === "active")
    .reduce(
      (total, item) => total + item.amount,
      0
    )

  const completedAmount = items
    .filter((item) => item.status === "completed")
    .reduce(
      (total, item) => total + item.amount,
      0
    )

  const cancelledAmount = items
    .filter((item) => item.status === "cancelled")
    .reduce(
      (total, item) => total + item.amount,
      0
    )

  const completedPercentage =
    totalAmount > 0
      ? (completedAmount / totalAmount) * 100
      : 0

  const activePercentage =
    totalAmount > 0
      ? (activeAmount / totalAmount) * 100
      : 0

  const cancelledPercentage =
    totalAmount > 0
      ? (cancelledAmount / totalAmount) * 100
      : 0

  return {
    id: boq.id,
    projectId: boq.projectId,
    name: boq.name,
    description: boq.description ?? "",
    sections,
    totalAmount,
    commercialSummary: {
      totalAmount,
      activeAmount,
      completedAmount,
      cancelledAmount,
      completedPercentage,
      activePercentage,
      cancelledPercentage,
    },
  }
}