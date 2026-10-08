"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CheckCircle2,
  ClipboardList,
  Clock3,
  Mail,
  MapPin,
  PackageCheck,
  Pencil,
  Phone,
  Plus,
  Send,
  Trash2,
  Truck,
  UserRound,
  X,
  ChevronDown,
} from "lucide-react"

import {
  createProcurementRequestAction,
  createProcurementRequestItemAction,
  createSupplierAction,
  deleteProcurementRequestAction,
  deleteProcurementRequestItemAction,
  deleteSupplierAction,
  updateProcurementRequestAction,
  updateProcurementRequestItemAction,
  updateSupplierAction,
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
import type { ProcurementWorkflowAction } from "@/lib/data/procurement-workflow"
import {
  canEditProcurementRequest,
  canEditProcurementRequestItems,
  getProcurementWorkflowActions,
} from "@/lib/data/procurement-workflow"

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

function canCreate(role: OrganizationRole) {
  return role === "owner" || role === "admin"
}

function canManageSuppliers(role: OrganizationRole) {
  return (
    role === "owner" ||
    role === "admin" ||
    role === "member"
  )
}

function canDelete(role: OrganizationRole) {
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
        (request) => request.status === "submitted"
      ).length,

      approved: requests.filter(
        (request) => request.status === "approved"
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
          boq={boq}
          onCancel={() =>
            setShowRequestForm(false)
          }
        />
      ) : null}

      {showSupplierPanel ? (
        <SupplierPanel
          suppliers={suppliers}
          role={role}
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
                Requests currently associated with
                this project.
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
                Create the first procurement request
                for this project to begin tracking
                material and purchasing requirements.
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

                    {canDelete(role) ? (
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground sm:px-6">
                        Actions
                      </th>
                    ) : null}
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
                        request.supplierId
                      )}
                      suppliers={suppliers}
                      boq={boq}
                      role={role}
                      canDelete={canDelete(role)}
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
  boq,
  onCancel,
}: {
  projectId: string
  suppliers: Supplier[]
  boq: Boq | null
  onCancel: () => void
}) {
  const router = useRouter()
  const [reference, setReference] = useState("")
  const [description, setDescription] = useState("")
  const [supplierId, setSupplierId] = useState("")
  const [selectedItems, setSelectedItems] = useState<Record<string, { quantity: string; notes: string }>>({})
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleItem(item: Boq["sections"][number]["items"][number]) {
    setSelectedItems((current) => {
      if (current[item.id]) {
        const next = { ...current }
        delete next[item.id]
        return next
      }
      return {
        ...current,
        [item.id]: { quantity: String(item.quantity), notes: "" },
      }
    })
  }

  function updateSelectedItem(
    itemId: string,
    field: "quantity" | "notes",
    value: string
  ) {
    setSelectedItems((current) => ({
      ...current,
      [itemId]: {
        ...current[itemId],
        [field]: value,
      },
    }))
  }

  async function handleSubmit() {
    if (!reference.trim()) {
      setError("Request reference is required.")
      return
    }

    for (const [itemId, value] of Object.entries(selectedItems)) {
      const quantity = Number(value.quantity)
      if (!Number.isFinite(quantity) || quantity <= 0) {
        setError("Every selected BOQ item must have a quantity greater than zero.")
        return
      }
      void itemId
    }

    setIsPending(true)
    setError(null)

    const formData = new FormData()
    formData.set("projectId", projectId)
    formData.set("reference", reference.trim())
    formData.set("description", description.trim())

    if (supplierId) {
      formData.set("supplierId", supplierId)
    }

    for (const [itemId, value] of Object.entries(selectedItems)) {
      formData.append("boqItemId", itemId)
      formData.set(`quantity_${itemId}`, value.quantity.trim())
      formData.set(`notes_${itemId}`, value.notes.trim())
    }

    try {
      await createProcurementRequestAction(formData)
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
        <CardTitle>Create procurement request</CardTitle>
        <p className="text-sm text-muted-foreground">
          Create the request and attach its BOQ requirements in the same workflow.
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="procurement-reference" className="text-sm font-medium">Reference</label>
            <Input
              id="procurement-reference"
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              placeholder="PR-003"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="procurement-supplier" className="text-sm font-medium">Supplier</label>
            <select
              id="procurement-supplier"
              value={supplierId}
              onChange={(event) => setSupplierId(event.target.value)}
              disabled={isPending}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select supplier</option>
              {suppliers.filter((supplier) => supplier.status === "active").map((supplier) => (
                <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="procurement-description" className="text-sm font-medium">Description</label>
          <textarea
            id="procurement-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe what needs to be procured..."
            disabled={isPending}
            rows={3}
            className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="space-y-3 rounded-lg border p-4">
          <div>
            <h3 className="font-medium">BOQ requirements</h3>
            <p className="mt-1 text-sm text-muted-foreground">Select the BOQ items needed for this request and set procurement quantities.</p>
          </div>

          {!boq || boq.sections.length === 0 ? (
            <div className="rounded-md border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
              No BOQ sections are available for this project yet.
            </div>
          ) : (
            <div className="space-y-2">
              {boq.sections.map((section) => {
                const isOpen = openSections[section.id] ?? false
                const selectedCount = section.items.filter((item) => selectedItems[item.id]).length
                const sectionTotal = section.items.reduce((sum, item) => sum + item.amount, 0)

                return (
                  <div key={section.id} className="overflow-hidden rounded-lg border">
                    <button
                      type="button"
                      onClick={() => setOpenSections((current) => ({ ...current, [section.id]: !isOpen }))}
                      className="flex w-full items-center justify-between gap-4 bg-muted/20 px-4 py-3 text-left"
                      aria-expanded={isOpen}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <ChevronDown className={`size-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                        <div className="min-w-0">
                          <p className="font-medium">{section.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {section.items.length} {section.items.length === 1 ? "item" : "items"} · {formatNumber(sectionTotal)} · {selectedCount} selected
                          </p>
                        </div>
                      </div>
                    </button>

                    {isOpen ? (
                      <div className="divide-y">
                        {section.items.map((item) => {
                          const selected = selectedItems[item.id]
                          return (
                            <div key={item.id} className="p-4">
                              <div className="flex items-start gap-3">
                                <input
                                  type="checkbox"
                                  checked={Boolean(selected)}
                                  onChange={() => toggleItem(item)}
                                  disabled={isPending}
                                  className="mt-1 size-4 rounded border-input"
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium">{item.itemCode} — {item.description}</p>
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    BOQ quantity: {formatNumber(item.quantity)} {item.unit} · Rate: {formatNumber(item.rate)}
                                  </p>
                                </div>
                              </div>

                              {selected ? (
                                <div className="mt-3 grid gap-3 pl-7 md:grid-cols-[0.7fr_1.5fr]">
                                  <div className="space-y-2">
                                    <label className="text-xs font-medium">Procurement quantity</label>
                                    <Input
                                      type="number"
                                      min="0.0001"
                                      step="any"
                                      value={selected.quantity}
                                      onChange={(event) => updateSelectedItem(item.id, "quantity", event.target.value)}
                                      disabled={isPending}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-xs font-medium">Notes</label>
                                    <Input
                                      value={selected.notes}
                                      onChange={(event) => updateSelectedItem(item.id, "notes", event.target.value)}
                                      placeholder="Requirement notes"
                                      disabled={isPending}
                                    />
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          )
                        })}
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={() => void handleSubmit()} disabled={isPending}>
            <Plus className="size-4" aria-hidden="true" />
            {isPending ? "Creating..." : "Create request"}
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isPending}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  )
}

function SupplierPanel({
  suppliers,
  role,
}: {
  suppliers: Supplier[]
  role: OrganizationRole
}) {
  const [showCreateForm, setShowCreateForm] =
    useState(false)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>
              Supplier management
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage suppliers available to this
              organization&apos;s procurement
              workflows.
            </p>
          </div>

          {canCreate(role) ? (
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setShowCreateForm(
                  (value) => !value
                )
              }
            >
              {showCreateForm ? (
                <X
                  className="size-4"
                  aria-hidden="true"
                />
              ) : (
                <Plus
                  className="size-4"
                  aria-hidden="true"
                />
              )}

              {showCreateForm
                ? "Close"
                : "Add supplier"}
            </Button>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {showCreateForm ? (
          <SupplierCreateForm
            onCreated={() =>
              setShowCreateForm(false)
            }
          />
        ) : null}

        {suppliers.length === 0 ? (
          <div className="rounded-lg border border-dashed px-6 py-10 text-center">
            <Truck
              className="mx-auto size-9 text-muted-foreground"
              aria-hidden="true"
            />

            <h3 className="mt-4 font-medium">
              No suppliers yet
            </h3>

            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-muted-foreground">
              Add an organization supplier before
              assigning suppliers to procurement
              requests.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-205 text-sm">
              <thead className="bg-muted/30">
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Supplier
                  </th>

                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Contact
                  </th>

                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Location
                  </th>

                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Status
                  </th>

                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {suppliers.map((supplier) => (
                  <SupplierRow
                    key={supplier.id}
                    supplier={supplier}
                    role={role}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SupplierCreateForm({
  onCreated,
}: {
  onCreated: () => void
}) {
  const router = useRouter()

  const [name, setName] = useState("")
  const [contact, setContact] =
    useState("")
  const [email, setEmail] =
    useState("")
  const [phone, setPhone] =
    useState("")
  const [address, setAddress] =
    useState("")

  const [isPending, setIsPending] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  async function handleSubmit() {
    if (!name.trim()) {
      setError(
        "Supplier name is required."
      )
      return
    }

    setIsPending(true)
    setError(null)

    const formData = new FormData()

    formData.set("name", name.trim())
    formData.set(
      "contact",
      contact.trim()
    )
    formData.set("email", email.trim())
    formData.set("phone", phone.trim())
    formData.set(
      "address",
      address.trim()
    )

    try {
      await createSupplierAction(
        formData
      )

      router.refresh()
      onCreated()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create supplier."
      )
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="rounded-lg border bg-muted/20 p-4">
      <div className="mb-4">
        <h3 className="font-medium">
          Add supplier
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Supplier details are stored at the
          organization level and can be reused
          across projects.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SupplierField
          id="supplier-create-name"
          label="Supplier name"
          value={name}
          onChange={setName}
          placeholder="PrimeBuild Materials"
          disabled={isPending}
          required
        />

        <SupplierField
          id="supplier-create-contact"
          label="Contact person"
          value={contact}
          onChange={setContact}
          placeholder="Chinedu Okafor"
          disabled={isPending}
        />

        <SupplierField
          id="supplier-create-email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="procurement@example.com"
          disabled={isPending}
        />

        <SupplierField
          id="supplier-create-phone"
          label="Phone"
          value={phone}
          onChange={setPhone}
          placeholder="+234 800 000 0000"
          disabled={isPending}
        />

        <div className="md:col-span-2">
          <SupplierField
            id="supplier-create-address"
            label="Address"
            value={address}
            onChange={setAddress}
            placeholder="Supplier office address"
            disabled={isPending}
          />
        </div>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
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
            ? "Adding..."
            : "Add supplier"}
        </Button>
      </div>
    </div>
  )
}

function SupplierField({
  id,
  label,
  value,
  onChange,
  placeholder,
  disabled,
  type = "text",
  required = false,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  type?: string
  required?: boolean
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-sm font-medium"
      >
        {label}
        {required ? (
          <span className="text-destructive">
            {" "}
            *
          </span>
        ) : null}
      </label>

      <Input
        id={id}
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  )
}

function SupplierRow({
  supplier,
  role,
}: {
  supplier: Supplier
  role: OrganizationRole
}) {
  const router = useRouter()

  const [isEditing, setIsEditing] =
    useState(false)

  const [isPending, setIsPending] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  const [name, setName] =
    useState(supplier.name)

  const [contact, setContact] =
    useState(supplier.contact)

  const [email, setEmail] =
    useState(supplier.email)

  const [phone, setPhone] =
    useState(supplier.phone)

  const [address, setAddress] =
    useState(supplier.address)

  const [status, setStatus] =
    useState<SupplierStatus>(
      supplier.status
    )

  async function handleUpdate() {
    if (!name.trim()) {
      setError(
        "Supplier name is required."
      )
      return
    }

    setIsPending(true)
    setError(null)

    const formData = new FormData()

    formData.set(
      "supplierId",
      supplier.id
    )

    formData.set("name", name.trim())
    formData.set(
      "contact",
      contact.trim()
    )
    formData.set("email", email.trim())
    formData.set("phone", phone.trim())
    formData.set(
      "address",
      address.trim()
    )
    formData.set("status", status)

    try {
      await updateSupplierAction(
        formData
      )

      router.refresh()
      setIsEditing(false)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update supplier."
      )
    } finally {
      setIsPending(false)
    }
  }

  async function handleStatusToggle() {
    const nextStatus: SupplierStatus =
      supplier.status === "active"
        ? "inactive"
        : "active"

    setIsPending(true)
    setError(null)

    const formData = new FormData()

    formData.set(
      "supplierId",
      supplier.id
    )

    formData.set(
      "name",
      supplier.name
    )

    formData.set(
      "contact",
      supplier.contact
    )

    formData.set(
      "email",
      supplier.email
    )

    formData.set(
      "phone",
      supplier.phone
    )

    formData.set(
      "address",
      supplier.address
    )

    formData.set(
      "status",
      nextStatus
    )

    try {
      await updateSupplierAction(
        formData
      )

      router.refresh()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update supplier status."
      )
    } finally {
      setIsPending(false)
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete ${supplier.name}? This supplier will no longer be available for procurement requests.`
    )

    if (!confirmed) {
      return
    }

    setIsPending(true)
    setError(null)

    const formData = new FormData()

    formData.set(
      "supplierId",
      supplier.id
    )

    try {
      await deleteSupplierAction(
        formData
      )

      router.refresh()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete supplier."
      )

      setIsPending(false)
    }
  }

  if (isEditing) {
    return (
      <tr className="border-b last:border-b-0">
        <td
          colSpan={5}
          className="p-4"
        >
          <div className="rounded-lg border bg-muted/20 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium">
                  Edit supplier
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Update supplier information and
                  availability.
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  setIsEditing(false)
                }
                disabled={isPending}
                aria-label="Close supplier editor"
              >
                <X
                  className="size-4"
                  aria-hidden="true"
                />
              </Button>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <SupplierField
                id={`supplier-name-${supplier.id}`}
                label="Supplier name"
                value={name}
                onChange={setName}
                disabled={isPending}
                required
              />

              <SupplierField
                id={`supplier-contact-${supplier.id}`}
                label="Contact person"
                value={contact}
                onChange={setContact}
                disabled={isPending}
              />

              <SupplierField
                id={`supplier-email-${supplier.id}`}
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                disabled={isPending}
              />

              <SupplierField
                id={`supplier-phone-${supplier.id}`}
                label="Phone"
                value={phone}
                onChange={setPhone}
                disabled={isPending}
              />

              <div className="md:col-span-2">
                <SupplierField
                  id={`supplier-address-${supplier.id}`}
                  label="Address"
                  value={address}
                  onChange={setAddress}
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor={`supplier-status-${supplier.id}`}
                  className="text-sm font-medium"
                >
                  Status
                </label>

                <select
                  id={`supplier-status-${supplier.id}`}
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target
                        .value as SupplierStatus
                    )
                  }
                  disabled={isPending}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>
                </select>
              </div>
            </div>

            {error ? (
              <p className="mt-4 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={() =>
                  void handleUpdate()
                }
                disabled={isPending}
              >
                {isPending
                  ? "Saving..."
                  : "Save changes"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  setIsEditing(false)
                }
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <tr className="border-b align-top last:border-b-0">
      <td className="px-4 py-4">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Truck
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0">
            <p className="font-medium">
              {supplier.name}
            </p>

            {supplier.email ? (
              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Mail
                  className="size-3.5"
                  aria-hidden="true"
                />
                <span className="truncate">
                  {supplier.email}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="space-y-1 text-sm">
          {supplier.contact ? (
            <div className="flex items-center gap-1.5">
              <UserRound
                className="size-3.5 text-muted-foreground"
                aria-hidden="true"
              />
              <span>{supplier.contact}</span>
            </div>
          ) : null}

          {supplier.phone ? (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Phone
                className="size-3.5"
                aria-hidden="true"
              />
              <span>{supplier.phone}</span>
            </div>
          ) : null}

          {!supplier.contact &&
          !supplier.phone &&
          !supplier.email ? (
            <span className="text-muted-foreground">
              No contact information
            </span>
          ) : null}
        </div>
      </td>

      <td className="max-w-56 px-4 py-4">
        {supplier.address ? (
          <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
            <MapPin
              className="mt-0.5 size-3.5 shrink-0"
              aria-hidden="true"
            />

            <span className="line-clamp-2">
              {supplier.address}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground">
            Not provided
          </span>
        )}
      </td>

      <td className="px-4 py-4">
        <Badge
          variant={
            supplier.status === "active"
              ? "default"
              : "secondary"
          }
        >
          {supplier.status === "active"
            ? "Active"
            : "Inactive"}
        </Badge>
      </td>

      <td className="px-4 py-4 text-right">
        <div className="flex flex-wrap justify-end gap-1">
          {canManageSuppliers(role) ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isPending}
              onClick={() =>
                setIsEditing(true)
              }
              aria-label={`Edit ${supplier.name}`}
            >
              <Pencil
                className="size-4"
                aria-hidden="true"
              />
            </Button>
          ) : null}

          {canManageSuppliers(role) ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isPending}
              onClick={() =>
                void handleStatusToggle()
              }
              aria-label={
                supplier.status === "active"
                  ? `Deactivate ${supplier.name}`
                  : `Activate ${supplier.name}`
              }
            >
              {supplier.status === "active" ? (
                <X
                  className="size-4"
                  aria-hidden="true"
                />
              ) : (
                <CheckCircle2
                  className="size-4"
                  aria-hidden="true"
                />
              )}
            </Button>
          ) : null}

          {canDelete(role) ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isPending}
              onClick={() =>
                void handleDelete()
              }
              className="text-muted-foreground hover:text-destructive"
              aria-label={`Delete ${supplier.name}`}
            >
              <Trash2
                className="size-4"
                aria-hidden="true"
              />
            </Button>
          ) : null}
        </div>

        {error ? (
          <p className="mt-2 max-w-48 text-xs text-destructive">
            {error}
          </p>
        ) : null}
      </td>
    </tr>
  )
}

function ProcurementRequestRow({
  request,
  projectId,
  supplierName,
  suppliers,
  boq,
  role,
  canDelete,
}: {
  request: ProcurementRequest
  projectId: string
  supplierName: string
  suppliers: Supplier[]
  boq: Boq | null
  role: OrganizationRole
  canDelete: boolean
}) {
  const router = useRouter()

  const [expanded, setExpanded] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reference, setReference] = useState(request.reference)
  const [description, setDescription] = useState(request.description)
  const [supplierId, setSupplierId] = useState(request.supplierId ?? "")

  const editable = canEditProcurementRequest(request.status)
  const itemsEditable = canEditProcurementRequestItems(request.status)
  const workflowActions = getProcurementWorkflowActions(
    request.status,
    role
  )

  async function saveRequest() {
    if (!reference.trim()) {
      setError("Request reference is required.")
      return
    }

    setIsPending(true)
    setError(null)

    const formData = new FormData()
    formData.set("requestId", request.id)
    formData.set("projectId", projectId)
    formData.set("reference", reference.trim())
    formData.set("description", description.trim())
    if (supplierId) {
      formData.set("supplierId", supplierId)
    }

    try {
      await updateProcurementRequestAction(formData)
      router.refresh()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update procurement request."
      )
    } finally {
      setIsPending(false)
    }
  }

  async function transition(action: ProcurementWorkflowAction) {
    setIsPending(true)
    setError(null)

    const formData = new FormData()
    formData.set("requestId", request.id)
    formData.set("projectId", projectId)
    formData.set("reference", reference.trim() || request.reference)
    formData.set("description", description.trim())
    if (supplierId) {
      formData.set("supplierId", supplierId)
    }

    const targetStatus = {
      submit: "SUBMITTED",
      approve: "APPROVED",
      reject: "REJECTED",
      return_to_draft: "DRAFT",
      cancel: "CANCELLED",
    } as const

    formData.set("status", targetStatus[action])

    try {
      await updateProcurementRequestAction(formData)
      router.refresh()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update procurement workflow."
      )
    } finally {
      setIsPending(false)
    }
  }

  async function deleteRequest() {
    if (!window.confirm(`Delete ${request.reference}?`)) {
      return
    }

    setIsPending(true)
    setError(null)

    const formData = new FormData()
    formData.set("requestId", request.id)
    formData.set("projectId", projectId)

    try {
      await deleteProcurementRequestAction(formData)
      router.refresh()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete procurement request."
      )
      setIsPending(false)
    }
  }

  return (
    <>
      <tr className="border-b align-top last:border-b-0">
        <td className="px-4 py-4 font-medium sm:px-6">
          <button
            type="button"
            className="text-left hover:underline"
            onClick={() => setExpanded((value) => !value)}
          >
            {request.reference}
          </button>
        </td>

        <td className="px-4 py-4">
          <div className="max-w-sm">
            <p className="line-clamp-2">
              {request.description || "No description provided"}
            </p>
          </div>
        </td>

        <td className="px-4 py-4">{supplierName}</td>

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
          <Badge variant={getStatusVariant(request.status)}>
            {getStatusLabel(request.status)}
          </Badge>
        </td>

        {canDelete ? (
          <td className="px-4 py-4 text-right sm:px-6">
            {request.status === "draft" || request.status === "rejected" ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isPending}
                onClick={() => void deleteRequest()}
                className="text-muted-foreground hover:text-destructive"
                aria-label={`Delete ${request.reference}`}
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </Button>
            ) : null}
          </td>
        ) : null}
      </tr>

      {expanded ? (
        <tr className="border-b bg-muted/10">
          <td colSpan={canDelete ? 6 : 5} className="p-0">
            <div className="space-y-6 p-5 sm:p-6">
              <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>Request details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Reference</label>
                        <Input
                          value={reference}
                          onChange={(event) => setReference(event.target.value)}
                          disabled={!editable || isPending}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Supplier</label>
                        <select
                          value={supplierId}
                          onChange={(event) => setSupplierId(event.target.value)}
                          disabled={!editable || isPending}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="">Unassigned</option>
                          {suppliers
                            .filter((supplier) => supplier.status === "active")
                            .map((supplier) => (
                              <option key={supplier.id} value={supplier.id}>
                                {supplier.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <textarea
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        disabled={!editable || isPending}
                        rows={3}
                        className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>

                    {editable ? (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => void saveRequest()}
                        disabled={isPending}
                      >
                        {isPending ? "Saving..." : "Save details"}
                      </Button>
                    ) : null}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Workflow</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={getStatusVariant(request.status)}>
                        {getStatusLabel(request.status)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {request.items.length} requirement{request.items.length === 1 ? "" : "s"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {workflowActions.map((action) => {
                        const labels = {
                          submit: "Submit",
                          approve: "Approve",
                          reject: "Reject",
                          return_to_draft: "Return to Draft",
                          cancel: "Cancel",
                        } as const

                        return (
                          <Button
                            key={action}
                            type="button"
                            size="sm"
                            variant={
                              action === "reject" || action === "cancel"
                                ? "outline"
                                : "default"
                            }
                            disabled={isPending}
                            onClick={() => void transition(action)}
                          >
                            {labels[action]}
                          </Button>
                        )
                      })}
                    </div>

                    {error ? (
                      <p className="text-sm text-destructive">{error}</p>
                    ) : null}
                  </CardContent>
                </Card>
              </div>

              <ProcurementRequestItems
                projectId={projectId}
                request={request}
                boq={boq}
                editable={itemsEditable}
              />
            </div>
          </td>
        </tr>
      ) : null}
    </>
  )
}

function ProcurementRequestItems({
  projectId,
  request,
  boq,
  editable,
}: {
  projectId: string
  request: ProcurementRequest
  boq: Boq | null
  editable: boolean
}) {
  const router = useRouter()
  const [boqItemId, setBoqItemId] = useState("")
  const [quantity, setQuantity] = useState("")
  const [notes, setNotes] = useState("")
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const availableItems = useMemo(() => {
    const used = new Set(request.items.map((item) => item.boqItemId))
    return boq?.sections.flatMap((section) =>
      section.items.filter((item) => !used.has(item.id))
    ) ?? []
  }, [boq, request.items])

  async function addItem() {
    if (!boqItemId || !quantity.trim()) {
      setError("Select a BOQ item and enter a quantity.")
      return
    }

    setIsPending(true)
    setError(null)

    const formData = new FormData()
    formData.set("projectId", projectId)
    formData.set("procurementRequestId", request.id)
    formData.set("boqItemId", boqItemId)
    formData.set("quantity", quantity.trim())
    formData.set("notes", notes.trim())

    try {
      await createProcurementRequestItemAction(formData)
      setBoqItemId("")
      setQuantity("")
      setNotes("")
      router.refresh()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to add procurement requirement."
      )
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>BOQ requirements</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Requirements attached to this procurement request.
            </p>
          </div>
          <Badge variant="outline">{request.items.length}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {request.items.length === 0 ? (
          <div className="rounded-lg border border-dashed px-5 py-8 text-center text-sm text-muted-foreground">
            No BOQ requirements have been added yet.
          </div>
        ) : (
          <div className="space-y-3">
            {request.items.map((item) => (
              <ProcurementRequestItemRow
                key={item.id}
                projectId={projectId}
                item={item}
                boq={boq}
                editable={editable}
              />
            ))}
          </div>
        )}

        {editable ? (
          <div className="rounded-lg border bg-muted/20 p-4">
            <div className="grid gap-4 lg:grid-cols-[1.5fr_0.7fr_1.5fr_auto] lg:items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium">BOQ item</label>
                <select
                  value={boqItemId}
                  onChange={(event) => setBoqItemId(event.target.value)}
                  disabled={isPending || availableItems.length === 0}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">
                    {availableItems.length === 0
                      ? "All BOQ items already added"
                      : "Select BOQ item"}
                  </option>
                  {availableItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.itemCode} — {item.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>
                <Input
                  type="number"
                  min="0.0001"
                  step="any"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  disabled={isPending}
                  placeholder="120"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Input
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  disabled={isPending}
                  placeholder="Main structural works"
                />
              </div>

              <Button
                type="button"
                size="sm"
                onClick={() => void addItem()}
                disabled={isPending || availableItems.length === 0}
              >
                <Plus className="size-4" aria-hidden="true" />
                Add item
              </Button>
            </div>
          </div>
        ) : null}

        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : null}
      </CardContent>
    </Card>
  )
}

function ProcurementRequestItemRow({
  projectId,
  item,
  boq,
  editable,
}: {
  projectId: string
  item: ProcurementRequest["items"][number]
  boq: Boq | null
  editable: boolean
}) {
  const router = useRouter()
  const boqItem = boq?.sections
    .flatMap((section) => section.items)
    .find((candidate) => candidate.id === item.boqItemId)

  const [quantity, setQuantity] = useState(String(item.quantity))
  const [notes, setNotes] = useState(item.notes)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function save() {
    setIsPending(true)
    setError(null)

    const formData = new FormData()
    formData.set("itemId", item.id)
    formData.set("projectId", projectId)
    formData.set("quantity", quantity.trim())
    formData.set("notes", notes.trim())

    try {
      await updateProcurementRequestItemAction(formData)
      router.refresh()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update requirement."
      )
    } finally {
      setIsPending(false)
    }
  }

  async function remove() {
    if (!window.confirm("Remove this BOQ requirement from the request?")) {
      return
    }

    setIsPending(true)
    setError(null)

    const formData = new FormData()
    formData.set("itemId", item.id)
    formData.set("projectId", projectId)

    try {
      await deleteProcurementRequestItemAction(formData)
      router.refresh()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to remove requirement."
      )
      setIsPending(false)
    }
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="grid gap-4 lg:grid-cols-[1.5fr_0.7fr_1.5fr_auto] lg:items-end">
        <div>
          <p className="font-medium">
            {boqItem?.itemCode ?? "BOQ item"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {boqItem?.description ?? "BOQ item unavailable"}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Quantity</label>
          <Input
            type="number"
            min="0.0001"
            step="any"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            disabled={!editable || isPending}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Notes</label>
          <Input
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            disabled={!editable || isPending}
            placeholder="Requirement notes"
          />
        </div>

        {editable ? (
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <Button
              type="button"
              size="sm"
              onClick={() => void save()}
              disabled={isPending}
            >
              Save
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => void remove()}
              disabled={isPending}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </Button>
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="mt-3 text-xs text-destructive">{error}</p>
      ) : null}
    </div>
  )
}