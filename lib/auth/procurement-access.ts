import { notFound } from "next/navigation"

import { getCurrentOrganizationMembership } from "@/lib/auth"
import { requirePermission } from "@/lib/auth/guards"

import {
  getOrganizationSupplier,
  getProjectProcurementRequest,
} from "@/lib/data/db/procurement"

import { getOrganizationProject } from "@/lib/data/project-access"

type ProcurementPermission =
  | "procurement:read"
  | "procurement:create"
  | "procurement:update"
  | "procurement:delete"

export async function requireProcurementAccess(
  projectId: string,
  permission: ProcurementPermission
) {
  const membership =
    await getCurrentOrganizationMembership()

  if (!membership) {
    notFound()
  }

  requirePermission(membership, permission)

  const project = await getOrganizationProject(
    projectId,
    membership.organizationId
  )

  if (!project) {
    notFound()
  }

  return {
    membership,
    project,
  }
}

export async function requireProjectProcurementRequestAccess(
  projectId: string,
  requestId: string,
  permission: ProcurementPermission
) {
  const { membership, project } =
    await requireProcurementAccess(
      projectId,
      permission
    )

  const request =
    await getProjectProcurementRequest(
      requestId,
      projectId
    )

  if (!request) {
    notFound()
  }

  return {
    membership,
    project,
    request,
  }
}

export async function requireSupplierAccess(
  supplierId: string,
  permission: ProcurementPermission
) {
  const membership =
    await getCurrentOrganizationMembership()

  if (!membership) {
    notFound()
  }

  requirePermission(membership, permission)

  const supplier =
    await getOrganizationSupplier(
      supplierId,
      membership.organizationId
    )

  if (!supplier) {
    notFound()
  }

  return {
    membership,
    supplier,
  }
}