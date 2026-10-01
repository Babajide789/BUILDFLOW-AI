"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CheckCircle2,
  ClipboardList,
  Clock3,
  PackageCheck,
  Plus,
  Send,
  Trash2,
  Truck,
} from "lucide-react"

import {
  createProcurementRequestAction,
  deleteProcurementRequestAction,
} from "@/app/(dashboard)/projects/actions"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import type { Boq } from "@/lib/types/boq"
import type {
  ProcurementRequest,
  ProcurementRequestStatus,
  Supplier,
  SupplierStatus,
} from "@/lib/types/procurement"
import type { OrganizationRole } from "@/lib/types/authorization"

interface ProcurementWorkspaceProps {
  projectId: string
  requests: ProcurementRequest[]
  suppliers: Supplier[]
  boq: Boq | null
  role: OrganizationRole
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 2,
  }).format(value)
}

function getStatusLabel(
  status: ProcurementRequestStatus
) {
  const labels: Record<
    ProcurementRequestStatus,
    string
  > = {
    draft: "Draft",
    submitted: "Submitted",
    approved: "Approved",
    rejected: "Rejected",
    cancelled: "Cancelled",
  }

  return labels[status]
}

function getStatusVariant(
  status: ProcurementRequestStatus
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "approved":
      return "default"
    case "submitted":
      return "secondary"
    case "rejected":
      return "destructive"
    case "draft":
    case "cancelled":
      return "outline"
  }
}

function getSupplierName(
  suppliers: Supplier[],
  supplierId?: string | null
) {
  if (!supplierId) {
    return "Unassigned"
  }

  return (
    suppliers.find(
      (supplier) => supplier.id === supplierId
    )?.name ?? "Unknown supplier"
  )
}

function getBoqItemCount(
  boq: Boq | null
) {
  if (!boq) {
    return 0
  }

  return boq.sections.reduce(
    (total, section) =>
      total + section.items.length,
    0
  )
}

function canCreate(role: OrganizationRole) {
  return role === "owner" || role === "admin"
}

function canManageSuppliers(
  role: OrganizationRole
) {
  return role === "owner" || role === "admin"
}

export function ProcurementWorkspace({
  projectId,
  requests,
  suppliers,
  boq,
  role,
}: ProcurementWorkspaceProps) {
  const [showRequestForm, setShowRequestForm] =
    useState(false)
  const [showSupplierPanel, setShowSupplierPanel] =
    useState(false)

  const requestSummary = useMemo(() => {
    return {
      total: requests.length,
      draft: requests.filter(
        (request) => request.status === "draft"
      ).length,
      submitted: requests.filter(
        (request) =>
          request.status === "submitted"
      ).length,
      approved: requests.filter(
        (request) =>
          request.status === "approved"
      ).length,
    }
  }, [requests])

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Truck
                    className="size-5"
                    aria-hidden="true"
                  />
                </div>

                <Badge variant="outline">
                  Procurement
                </Badge>
              </div>

              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Procurement Requests
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Track project purchasing requirements
                  from BOQ demand through procurement
                  approval.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {canManageSuppliers(role) ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setShowSupplierPanel(
                      (value) => !value
                    )
                  }
                >
                  <Truck
                    className="size-4"
                    aria-hidden="true"
                  />
                  Suppliers
                </Button>
              ) : null}

              {canCreate(role) ? (
                <Button
                  type="button"
                  onClick={() =>
                    setShowRequestForm(
                      (value) => !value
                    )
                  }
                >
                  <Plus
                    className="size-4"
                    aria-hidden="true"
                  />
                  New request
                </Button>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={
            <ClipboardList className="size-5 text-muted-foreground" />
          }
          label="Total requests"
          value={String(requestSummary.total)}
        />

        <SummaryCard
          icon={
            <Clock3 className="size-5 text-muted-foreground" />
          }
          label="Draft"
          value={String(requestSummary.draft)}
        />

        <SummaryCard
          icon={
            <Send className="size-5 text-muted-foreground" />
          }
          label="Submitted"
          value={String(
            requestSummary.submitted
          )}
        />

        <SummaryCard
          icon={
            <CheckCircle2 className="size-5 text-muted-foreground" />
          }
          label="Approved"
          value={String(
            requestSummary.approved
          )}
        />
      </div>

      {showRequestForm ? (
        <ProcurementRequestCreateForm
          projectId={projectId}
          suppliers={suppliers}
          boqItemCount={getBoqItemCount(boq)}
          onCancel={() =>
            setShowRequestForm(false)
          }
        />
      ) : null}

      {showSupplierPanel ? (
        <SupplierPanel
          suppliers={suppliers}
        />
      ) : null}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>
                Procurement requests
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Requests currently associated with this
                project.
              </p>
            </div>

            <Badge variant="outline">
              {formatNumber(requests.length)}{" "}
              {requests.length === 1
                ? "request"
                : "requests"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {requests.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <ClipboardList
                className="mx-auto size-10 text-muted-foreground"
                aria-hidden="true"
              />

              <h3 className="mt-4 font-medium">
                No procurement requests yet
              </h3>

              <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-muted-foreground">
                Create the first procurement request for
                this project to begin tracking material and
                purchasing requirements.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-215 text-sm">
                <thead className="bg-muted/30">
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground sm:px-6">
                      Reference
                    </th>

                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Description
                    </th>

                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Supplier
                    </th>

                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                      BOQ items
                    </th>

                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Status
                    </th>

                    <th className="px-4 py-3 text-right font-medium text-muted-foreground sm:px-6">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((request) => (
                    <ProcurementRequestRow
                      key={request.id}
                      request={request}
                      projectId={projectId}
                      supplierName={getSupplierName(
                        suppliers,
                        getSupplierId(request)
                      )}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function getSupplierId(
  request: ProcurementRequest
) {
  return (
    request as ProcurementRequest & {
      supplierId?: string | null
    }
  ).supplierId
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <Card>
      <CardContent className="flex items-start gap-4 p-5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>

          <p className="mt-1 text-lg font-semibold">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function ProcurementRequestCreateForm({
  projectId,
  suppliers,
  boqItemCount,
  onCancel,
}: {
  projectId: string
  suppliers: Supplier[]
  boqItemCount: number
  onCancel: () => void
}) {
  const router = useRouter()

  const [reference, setReference] =
    useState("")
  const [description, setDescription] =
    useState("")
  const [supplierId, setSupplierId] =
    useState("")
  const [isPending, setIsPending] =
    useState(false)
  const [error, setError] =
    useState<string | null>(null)

  async function handleSubmit() {
    if (!reference.trim()) {
      setError("Request reference is required.")
      return
    }

    setIsPending(true)
    setError(null)

    const formData = new FormData()

    formData.set(
      "projectId",
      projectId
    )
    formData.set(
      "reference",
      reference.trim()
    )
    formData.set(
      "description",
      description.trim()
    )

    if (supplierId) {
      formData.set(
        "supplierId",
        supplierId
      )
    }

    try {
      await createProcurementRequestAction(
        formData
      )

      router.refresh()
      onCancel()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create procurement request."
      )
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Create procurement request
        </CardTitle>

        <p className="text-sm text-muted-foreground">
          Create a request first, then associate its
          requirements with BOQ items.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="procurement-reference"
              className="text-sm font-medium"
            >
              Reference
            </label>

            <Input
              id="procurement-reference"
              value={reference}
              onChange={(event) =>
                setReference(
                  event.target.value
                )
              }
              placeholder="PR-003"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="procurement-supplier"
              className="text-sm font-medium"
            >
              Supplier
            </label>

            <select
              id="procurement-supplier"
              value={supplierId}
              onChange={(event) =>
                setSupplierId(
                  event.target.value
                )
              }
              disabled={isPending}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">
                Select supplier
              </option>

              {suppliers.map((supplier) => (
                <option
                  key={supplier.id}
                  value={supplier.id}
                >
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="procurement-description"
            className="text-sm font-medium"
          >
            Description
          </label>

          <textarea
            id="procurement-description"
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            placeholder="Describe what needs to be procured..."
            disabled={isPending}
            rows={3}
            className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="rounded-lg border bg-muted/20 p-4 text-sm text-muted-foreground">
          <p>
            {boqItemCount} BOQ{" "}
            {boqItemCount === 1
              ? "item is"
              : "items are"}{" "}
            currently available for procurement
            requirements.
          </p>
        </div>

        {error ? (
          <p className="text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={() =>
              void handleSubmit()
            }
            disabled={isPending}
          >
            <Plus
              className="size-4"
              aria-hidden="true"
            />
            {isPending
              ? "Creating..."
              : "Create request"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function SupplierPanel({
  suppliers,
}: {
  suppliers: Supplier[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Suppliers</CardTitle>

        <p className="text-sm text-muted-foreground">
          Suppliers available to this organization.
        </p>
      </CardHeader>

      <CardContent className="p-0">
        {suppliers.length === 0 ? (
          <div className="px-6 py-8 text-sm text-muted-foreground">
            No suppliers have been registered yet.
          </div>
        ) : (
          <div className="divide-y">
            {suppliers.map((supplier) => (
              <SupplierRow
                key={supplier.id}
                supplier={supplier}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SupplierRow({
  supplier,
}: {
  supplier: Supplier
}) {
  return (
    <div className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-medium">
          {supplier.name}
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          {supplier.contact ||
            supplier.email ||
            supplier.phone ||
            "No contact information"}
        </p>
      </div>

      <Badge
        variant={
          supplier.status === "active"
            ? "default"
            : "secondary"
        }
      >
        {getSupplierStatusLabel(
          supplier.status
        )}
      </Badge>
    </div>
  )
}

function getSupplierStatusLabel(
  status: SupplierStatus
) {
  return status === "active"
    ? "Active"
    : "Inactive"
}

function ProcurementRequestRow({
  request,
  projectId,
  supplierName,
}: {
  request: ProcurementRequest
  projectId: string
  supplierName: string
}) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] =
    useState(false)

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete ${request.reference}?`
    )

    if (!confirmed) {
      return
    }

    setIsDeleting(true)

    const formData = new FormData()

    formData.set(
      "requestId",
      request.id
    )
    formData.set(
      "projectId",
      projectId
    )

    try {
      await deleteProcurementRequestAction(
        formData
      )

      router.refresh()
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to delete procurement request."
      )

      setIsDeleting(false)
    }
  }

  return (
    <tr className="border-b last:border-b-0">
      <td className="px-4 py-4 font-medium sm:px-6">
        {request.reference}
      </td>

      <td className="px-4 py-4">
        <div className="max-w-sm">
          <p className="line-clamp-2">
            {request.description ||
              "No description provided"}
          </p>
        </div>
      </td>

      <td className="px-4 py-4">
        {supplierName}
      </td>

      <td className="px-4 py-4 text-center tabular-nums">
        <div className="inline-flex items-center gap-1.5">
          <PackageCheck
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
          {request.items.length}
        </div>
      </td>

      <td className="px-4 py-4">
        <Badge
          variant={getStatusVariant(
            request.status
          )}
        >
          {getStatusLabel(
            request.status
          )}
        </Badge>
      </td>

      <td className="px-4 py-4 text-right sm:px-6">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isDeleting}
          onClick={() =>
            void handleDelete()
          }
          className="text-muted-foreground hover:text-destructive"
          aria-label={`Delete ${request.reference}`}
        >
          <Trash2
            className="size-4"
            aria-hidden="true"
          />
        </Button>
      </td>
    </tr>
  )
}