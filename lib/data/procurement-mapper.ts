import type {
  ProcurementRequest as PrismaProcurementRequest,
  ProcurementRequestItem as PrismaProcurementRequestItem,
  Supplier as PrismaSupplier,
} from "@/generated/prisma/client"

import type {
  ProcurementRequest,
  ProcurementRequestItem,
  ProcurementRequestStatus,
  Supplier,
  SupplierStatus,
} from "@/lib/types/procurement"

const supplierStatusMap: Record<
  PrismaSupplier["status"],
  SupplierStatus
> = {
  ACTIVE: "active",
  INACTIVE: "inactive",
}

const requestStatusMap: Record<
  PrismaProcurementRequest["status"],
  ProcurementRequestStatus
> = {
  DRAFT: "draft",
  SUBMITTED: "submitted",
  APPROVED: "approved",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
}

function mapSupplier(supplier: PrismaSupplier): Supplier {
  return {
    id: supplier.id,
    organizationId: supplier.organizationId,
    name: supplier.name,
    contact: supplier.contact ?? "",
    email: supplier.email ?? "",
    phone: supplier.phone ?? "",
    address: supplier.address ?? "",
    status: supplierStatusMap[supplier.status],
  }
}

function mapProcurementRequestItem(
  item: PrismaProcurementRequestItem
): ProcurementRequestItem {
  return {
    id: item.id,
    procurementRequestId: item.procurementRequestId,
    boqItemId: item.boqItemId,
    quantity: Number(item.quantity),
    notes: item.notes ?? "",
  }
}

export function mapProcurementRequest(
  request: PrismaProcurementRequest & {
    items: PrismaProcurementRequestItem[]
  }
): ProcurementRequest {
  return {
    id: request.id,
    projectId: request.projectId,
    supplierId: request.supplierId,
    requestedById: request.requestedBy,
    reference: request.reference,
    description: request.description ?? "",
    status: requestStatusMap[request.status],
    items: request.items.map(mapProcurementRequestItem),
  }
}

export function mapProcurementRequests(
  requests: Array<
    PrismaProcurementRequest & {
      items: PrismaProcurementRequestItem[]
    }
  >
): ProcurementRequest[] {
  return requests.map(mapProcurementRequest)
}

export function mapSupplierRecord(supplier: PrismaSupplier): Supplier {
  return mapSupplier(supplier)
}

export function mapSuppliers(suppliers: PrismaSupplier[]): Supplier[] {
  return suppliers.map(mapSupplier)
}
