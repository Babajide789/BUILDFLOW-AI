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

  const totalAmount = sections.reduce(
    (sectionTotal, section) =>
      sectionTotal +
      section.items.reduce(
        (itemTotal, item) => itemTotal + item.amount,
        0
      ),
    0
  )

  return {
    id: boq.id,
    projectId: boq.projectId,
    name: boq.name,
    description: boq.description ?? "",
    sections,
    totalAmount,
  }
}