import { prisma } from "@/lib/db/prisma"

import type {
  Prisma,
  ProcurementRequestStatus,
  SupplierStatus,
} from "@/generated/prisma/client"

export interface CreateSupplierInput {
  organizationId: string
  name: string
  contact?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  status?: SupplierStatus
}

export interface UpdateSupplierInput {
  name?: string
  contact?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  status?: SupplierStatus
}

export interface CreateProcurementRequestInput {
  projectId: string
  requestedById: string
  reference: string
  description?: string | null
  status?: ProcurementRequestStatus
  supplierId?: string | null
}

export interface UpdateProcurementRequestInput {
  reference?: string
  description?: string | null
  status?: ProcurementRequestStatus
  supplierId?: string | null
}

export interface CreateProcurementRequestItemInput {
  procurementRequestId: string
  boqItemId: string
  quantity: Prisma.Decimal | number | string
  notes?: string | null
}

export interface UpdateProcurementRequestItemInput {
  quantity?: Prisma.Decimal | number | string
  notes?: string | null
}

export async function createSupplier(
  input: CreateSupplierInput
) {
  return prisma.supplier.create({
    data: {
      organizationId: input.organizationId,
      name: input.name,
      contact: input.contact ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      address: input.address ?? null,
      status: input.status ?? "ACTIVE",
    },
  })
}

export async function getOrganizationSuppliers(
  organizationId: string
) {
  return prisma.supplier.findMany({
    where: {
      organizationId,
    },
    orderBy: {
      name: "asc",
    },
  })
}

export async function getOrganizationSupplier(
  supplierId: string,
  organizationId: string
) {
  return prisma.supplier.findFirst({
    where: {
      id: supplierId,
      organizationId,
    },
  })
}

export async function updateSupplier(
  supplierId: string,
  organizationId: string,
  input: UpdateSupplierInput
) {
  const supplier = await getOrganizationSupplier(
    supplierId,
    organizationId
  )

  if (!supplier) {
    return null
  }

  return prisma.supplier.update({
    where: {
      id: supplier.id,
    },
    data: input,
  })
}

export async function deleteSupplier(
  supplierId: string,
  organizationId: string
) {
  const supplier = await getOrganizationSupplier(
    supplierId,
    organizationId
  )

  if (!supplier) {
    return null
  }

  return prisma.supplier.delete({
    where: {
      id: supplier.id,
    },
  })
}

export async function createProcurementRequest(
  input: CreateProcurementRequestInput
) {
  return prisma.procurementRequest.create({
    data: {
      projectId: input.projectId,
      requestedBy: input.requestedById,
      supplierId: input.supplierId ?? null,
      reference: input.reference,
      description: input.description ?? null,
      status: input.status ?? "DRAFT",
    },
  })
}

export async function getProjectProcurementRequests(
  projectId: string
) {
  const requests = await prisma.procurementRequest.findMany({
    where: {
      projectId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  if (requests.length === 0) {
    return []
  }

  const items = await prisma.procurementRequestItem.findMany({
    where: {
      procurementRequestId: {
        in: requests.map((request) => request.id),
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  })

  const itemsByRequest = new Map<
    string,
    typeof items
  >()

  for (const item of items) {
    const existing =
      itemsByRequest.get(item.procurementRequestId) ?? []

    existing.push(item)
    itemsByRequest.set(
      item.procurementRequestId,
      existing
    )
  }

  return requests.map((request) => ({
    ...request,
    items: itemsByRequest.get(request.id) ?? [],
  }))
}

export async function getProjectProcurementRequest(
  requestId: string,
  projectId: string
) {
  const request =
    await prisma.procurementRequest.findFirst({
      where: {
        id: requestId,
        projectId,
      },
    })

  if (!request) {
    return null
  }

  const items =
    await prisma.procurementRequestItem.findMany({
      where: {
        procurementRequestId: request.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    })

  return {
    ...request,
    items,
  }
}

export async function updateProcurementRequest(
  requestId: string,
  projectId: string,
  input: UpdateProcurementRequestInput
) {
  const request =
    await prisma.procurementRequest.findFirst({
      where: {
        id: requestId,
        projectId,
      },
      select: {
        id: true,
      },
    })

  if (!request) {
    return null
  }

  return prisma.procurementRequest.update({
    where: {
      id: request.id,
    },
    data: input,
  })
}

export async function deleteProcurementRequest(
  requestId: string,
  projectId: string
) {
  const request =
    await prisma.procurementRequest.findFirst({
      where: {
        id: requestId,
        projectId,
      },
      select: {
        id: true,
      },
    })

  if (!request) {
    return null
  }

  return prisma.procurementRequest.delete({
    where: {
      id: request.id,
    },
  })
}

export async function createProcurementRequestItem(
  input: CreateProcurementRequestItemInput
) {
  const request =
    await prisma.procurementRequest.findUnique({
      where: {
        id: input.procurementRequestId,
      },
      select: {
        id: true,
        projectId: true,
      },
    })

  if (!request) {
    return null
  }

  const boqItem = await prisma.boqItem.findFirst({
    where: {
      id: input.boqItemId,
      section: {
        boq: {
          projectId: request.projectId,
        },
      },
    },
    select: {
      id: true,
    },
  })

  if (!boqItem) {
    return null
  }

  return prisma.procurementRequestItem.create({
    data: {
      procurementRequestId: request.id,
      boqItemId: boqItem.id,
      quantity: input.quantity,
      notes: input.notes ?? null,
    },
  })
}

export async function updateProcurementRequestItem(
  itemId: string,
  projectId: string,
  input: UpdateProcurementRequestItemInput
) {
  const item =
    await prisma.procurementRequestItem.findFirst({
      where: {
        id: itemId,
        procurementRequest: {
          projectId,
        },
      },
      select: {
        id: true,
      },
    })

  if (!item) {
    return null
  }

  return prisma.procurementRequestItem.update({
    where: {
      id: item.id,
    },
    data: input,
  })
}

export async function deleteProcurementRequestItem(
  itemId: string,
  projectId: string
) {
  const item =
    await prisma.procurementRequestItem.findFirst({
      where: {
        id: itemId,
        procurementRequest: {
          projectId,
        },
      },
      select: {
        id: true,
      },
    })

  if (!item) {
    return null
  }

  return prisma.procurementRequestItem.delete({
    where: {
      id: item.id,
    },
  })
}