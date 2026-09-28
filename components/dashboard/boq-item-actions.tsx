
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react"

import {
  createBoqItemAction,
  deleteBoqItemAction,
  updateBoqItemAction,
} from "@/app/(dashboard)/projects/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import type {
  BoqItem,
  BoqUnit,
} from "@/lib/types/boq"

const unitOptions: Array<{
  value: BoqUnit
  label: string
}> = [
  { value: "item", label: "Item" },
  { value: "m", label: "m" },
  { value: "m2", label: "m²" },
  { value: "m3", label: "m³" },
  { value: "kg", label: "kg" },
  { value: "tonne", label: "tonne" },
  { value: "litre", label: "litre" },
  { value: "day", label: "day" },
  { value: "hour", label: "hour" },
  { value: "ls", label: "L/S" },
]

const statusOptions = [
  { value: "ACTIVE", label: "Active" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
] as const

function toPrismaUnit(unit: BoqUnit) {
  return unit.toUpperCase() as
    | "ITEM"
    | "M"
    | "M2"
    | "M3"
    | "KG"
    | "TONNE"
    | "LITRE"
    | "DAY"
    | "HOUR"
    | "LS"
}

interface BoqItemCreateFormProps {
  sectionId: string
  projectId: string
}

export function BoqItemCreateForm({
  sectionId,
  projectId,
}: BoqItemCreateFormProps) {
  const router = useRouter()

  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [unit, setUnit] = useState<BoqUnit>("ls")

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    setError(null)

    try {
      await createBoqItemAction(formData)
      router.refresh()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create BOQ item."
      )
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form
      action={handleSubmit}
      className="grid gap-3 border-t bg-muted/10 p-4 sm:grid-cols-2 lg:grid-cols-6"
    >
      <input
        type="hidden"
        name="sectionId"
        value={sectionId}
      />

      <input
        type="hidden"
        name="projectId"
        value={projectId}
      />

      <Input
        name="itemCode"
        placeholder="Item code"
        required
        disabled={isPending}
      />

      <Input
        name="description"
        placeholder="Description"
        required
        disabled={isPending}
        className="lg:col-span-2"
      />

      <select
        name="unit"
        value={toPrismaUnit(unit)}
        onChange={(event) =>
          setUnit(
            event.target.value.toLowerCase() as BoqUnit
          )
        }
        disabled={isPending}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {unitOptions.map((option) => (
          <option
            key={option.value}
            value={toPrismaUnit(option.value)}
          >
            {option.label}
          </option>
        ))}
      </select>

      <Input
        name="quantity"
        type="number"
        min="0"
        step="0.0001"
        placeholder="Quantity"
        required
        disabled={isPending}
      />

      <Input
        name="rate"
        type="number"
        min="0"
        step="0.01"
        placeholder="Rate"
        required
        disabled={isPending}
      />

      <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-6">
        <Button
          type="submit"
          size="sm"
          disabled={isPending}
        >
          <Plus
            className="size-4"
            aria-hidden="true"
          />
          {isPending ? "Adding..." : "Add line item"}
        </Button>

        {error ? (
          <p className="text-sm text-destructive">
            {error}
          </p>
        ) : null}
      </div>
    </form>
  )
}

interface BoqItemEditFormProps {
  item: BoqItem
  projectId: string
  onCancel: () => void
}

export function BoqItemEditForm({
  item,
  projectId,
  onCancel,
}: BoqItemEditFormProps) {
  const router = useRouter()

  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [itemCode, setItemCode] = useState(item.itemCode)
  const [description, setDescription] = useState(item.description)
  const [unit, setUnit] = useState<BoqUnit>(item.unit)
  const [quantity, setQuantity] = useState(String(item.quantity))
  const [rate, setRate] = useState(String(item.rate))
  const [status, setStatus] = useState(item.status.toUpperCase())

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    setError(null)

    try {
      await updateBoqItemAction(formData)
      router.refresh()
      onCancel()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update BOQ item."
      )
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form
      action={handleSubmit}
      className="grid gap-3 bg-muted/10 p-4 sm:grid-cols-2 lg:grid-cols-7"
    >
      <input
        type="hidden"
        name="itemId"
        value={item.id}
      />

      <input
        type="hidden"
        name="sectionId"
        value={item.sectionId}
      />

      <input
        type="hidden"
        name="projectId"
        value={projectId}
      />

      <Input
        name="itemCode"
        value={itemCode}
        onChange={(event) =>
          setItemCode(event.target.value)
        }
        required
        disabled={isPending}
      />

      <Input
        name="description"
        value={description}
        onChange={(event) =>
          setDescription(event.target.value)
        }
        required
        disabled={isPending}
        className="lg:col-span-2"
      />

      <select
        name="unit"
        value={toPrismaUnit(unit)}
        onChange={(event) =>
          setUnit(
            event.target.value.toLowerCase() as BoqUnit
          )
        }
        disabled={isPending}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {unitOptions.map((option) => (
          <option
            key={option.value}
            value={toPrismaUnit(option.value)}
          >
            {option.label}
          </option>
        ))}
      </select>

      <Input
        name="quantity"
        type="number"
        min="0"
        step="0.0001"
        value={quantity}
        onChange={(event) =>
          setQuantity(event.target.value)
        }
        required
        disabled={isPending}
      />

      <Input
        name="rate"
        type="number"
        min="0"
        step="0.01"
        value={rate}
        onChange={(event) =>
          setRate(event.target.value)
        }
        required
        disabled={isPending}
      />

      <select
        name="status"
        value={status}
        onChange={(event) =>
          setStatus(event.target.value)
        }
        disabled={isPending}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {statusOptions.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-7">
        <Button
          type="submit"
          size="sm"
          disabled={isPending}
        >
          <Save
            className="size-4"
            aria-hidden="true"
          />
          {isPending ? "Saving..." : "Save"}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={onCancel}
        >
          <X
            className="size-4"
            aria-hidden="true"
          />
          Cancel
        </Button>

        {error ? (
          <p className="text-sm text-destructive">
            {error}
          </p>
        ) : null}
      </div>
    </form>
  )
}

interface BoqItemRowActionsProps {
  item: BoqItem
  projectId: string
  onEdit: () => void
}

export function BoqItemRowActions({
  item,
  projectId,
  onEdit,
}: BoqItemRowActionsProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete ${item.itemCode}?`
    )

    if (!confirmed) return

    setIsPending(true)

    const formData = new FormData()
    formData.set("itemId", item.id)
    formData.set("projectId", projectId)

    try {
      await deleteBoqItemAction(formData)
      router.refresh()
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to delete BOQ item."
      )
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={isPending}
        onClick={onEdit}
        aria-label={`Edit ${item.itemCode}`}
      >
        <Pencil
          className="size-4"
          aria-hidden="true"
        />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={isPending}
        onClick={() => void handleDelete()}
        className="text-muted-foreground hover:text-destructive"
        aria-label={`Delete ${item.itemCode}`}
      >
        <Trash2
          className="size-4"
          aria-hidden="true"
        />
      </Button>
    </div>
  )
}