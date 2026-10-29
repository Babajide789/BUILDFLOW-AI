import { Prisma } from "@/generated/prisma/client"
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

const unitMap: Record<PrismaBoqItem["unit"], BoqUnit> = {
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

const statusMap: Record<PrismaBoqItem["status"], BoqItemStatus> = {
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
}

/** Monetary line values are rounded to the database currency scale (2 dp). */
function getLineAmount(item: PrismaBoqItem): Prisma.Decimal {
  return item.quantity.mul(item.rate).toDecimalPlaces(2)
}

function sumAmounts(
  items: PrismaBoqItem[],
  predicate: (item: PrismaBoqItem) => boolean = () => true
): Prisma.Decimal {
  return items.reduce(
    (sum, item) => predicate(item) ? sum.plus(getLineAmount(item)) : sum,
    new Prisma.Decimal(0)
  ).toDecimalPlaces(2)
}

function percentage(amount: Prisma.Decimal, total: Prisma.Decimal): number {
  if (!total.gt(0)) return 0
  return amount.div(total).mul(100).toDecimalPlaces(2).toNumber()
}

function mapBoqItem(item: PrismaBoqItem): BoqItem {
  return {
    id: item.id,
    sectionId: item.sectionId,
    itemCode: item.itemCode,
    description: item.description,
    unit: unitMap[item.unit],
    quantity: item.quantity.toNumber(),
    rate: item.rate.toNumber(),
    amount: getLineAmount(item).toNumber(),
    status: statusMap[item.status],
    sortOrder: item.sortOrder,
  }
}

function mapBoqSection(
  section: PrismaBoqSection & { items: PrismaBoqItem[] }
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
    sections: Array<PrismaBoqSection & { items: PrismaBoqItem[] }>
  }
): Boq {
  const sections = boq.sections.map(mapBoqSection)
  const rawItems = boq.sections.flatMap((section) => section.items)
  const total = sumAmounts(rawItems)
  const active = sumAmounts(rawItems, (item) => item.status === "ACTIVE")
  const completed = sumAmounts(rawItems, (item) => item.status === "COMPLETED")
  const cancelled = sumAmounts(rawItems, (item) => item.status === "CANCELLED")

  const totalAmount = total.toNumber()
  const activeAmount = active.toNumber()
  const completedAmount = completed.toNumber()
  const cancelledAmount = cancelled.toNumber()

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
      completedPercentage: percentage(completed, total),
      activePercentage: percentage(active, total),
      cancelledPercentage: percentage(cancelled, total),
    },
  }
}
