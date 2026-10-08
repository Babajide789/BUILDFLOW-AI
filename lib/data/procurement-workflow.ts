import type { OrganizationRole } from "@/lib/types/authorization"
import type { ProcurementRequestStatus } from "@/lib/types/procurement"

export type ProcurementWorkflowAction =
  | "submit"
  | "approve"
  | "reject"
  | "return_to_draft"
  | "cancel"

const transitions: Record<
  ProcurementRequestStatus,
  Partial<Record<ProcurementWorkflowAction, ProcurementRequestStatus>>
> = {
  draft: { submit: "submitted" },
  submitted: {
    approve: "approved",
    reject: "rejected",
    cancel: "cancelled",
  },
  approved: { cancel: "cancelled" },
  rejected: { return_to_draft: "draft" },
  cancelled: {},
}

const adminOnlyActions = new Set<ProcurementWorkflowAction>([
  "approve",
  "reject",
  "cancel",
])

export function canTransitionProcurementRequest(
  status: ProcurementRequestStatus,
  action: ProcurementWorkflowAction,
  role: OrganizationRole
) {
  if (adminOnlyActions.has(action) && role !== "owner" && role !== "admin") {
    return false
  }

  return Boolean(transitions[status][action])
}

export function getNextProcurementStatus(
  status: ProcurementRequestStatus,
  action: ProcurementWorkflowAction,
  role: OrganizationRole
) {
  if (!canTransitionProcurementRequest(status, action, role)) {
    return null
  }

  return transitions[status][action] ?? null
}

export function canEditProcurementRequest(
  status: ProcurementRequestStatus
) {
  return status === "draft" || status === "rejected"
}

export function canEditProcurementRequestItems(
  status: ProcurementRequestStatus
) {
  return status === "draft" || status === "rejected"
}

export function getProcurementWorkflowActions(
  status: ProcurementRequestStatus,
  role: OrganizationRole
): ProcurementWorkflowAction[] {
  return (Object.keys(transitions[status]) as ProcurementWorkflowAction[]).filter(
    (action) => canTransitionProcurementRequest(status, action, role)
  )
}
