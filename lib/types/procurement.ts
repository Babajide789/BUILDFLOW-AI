export type SupplierStatus =
  | "active"
  | "inactive"

export type ProcurementRequestStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "cancelled"
  | "rejected"

export interface Supplier {
  id: string
  organizationId: string
  name: string
  contact: string
  email: string
  phone: string
  address: string
  status: SupplierStatus
}

export interface ProcurementRequestItem {
  id: string
  procurementRequestId: string
  boqItemId: string
  quantity: number
  notes: string
}

export interface ProcurementRequest {
  id: string
  projectId: string
  supplierId: string | null
  requestedById: string
  reference: string
  description: string
  status: ProcurementRequestStatus
  items: ProcurementRequestItem[]
}
