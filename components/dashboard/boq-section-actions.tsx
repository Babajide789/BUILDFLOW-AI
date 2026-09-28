"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  Check,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react"

import {
  createBoqSectionAction,
  deleteBoqSectionAction,
  updateBoqSectionAction,
} from "@/app/(dashboard)/projects/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface BoqSectionActionsProps {
  boqId: string
  projectId: string
}

export function BoqSectionActions({
  boqId,
  projectId,
}: BoqSectionActionsProps) {
  const router = useRouter()

  const [name, setName] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCreate() {
    if (!name.trim()) {
      setError("Section name is required.")
      return
    }

    setIsAdding(true)
    setError(null)

    const formData = new FormData()

    formData.set("boqId", boqId)
    formData.set("projectId", projectId)
    formData.set("name", name)
    formData.set("description", "")

    try {
      await createBoqSectionAction(formData)

      setName("")
      router.refresh()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create section."
      )

      setIsAdding(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          placeholder="New section name"
          disabled={isAdding}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              void handleCreate()
            }
          }}
        />

        <Button
          type="button"
          onClick={() => void handleCreate()}
          disabled={isAdding}
        >
          <Plus
            className="size-4"
            aria-hidden="true"
          />

          {isAdding
            ? "Adding..."
            : "Add section"}
        </Button>
      </div>

      {error ? (
        <p className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

interface BoqSectionEditProps {
  sectionId: string
  projectId: string
  name: string
  description: string
  onCancel: () => void
}

export function BoqSectionEdit({
  sectionId,
  projectId,
  name: initialName,
  description: initialDescription,
  onCancel,
}: BoqSectionEditProps) {
  const router = useRouter()

  const [name, setName] = useState(initialName)
  const [description, setDescription] = useState(
    initialDescription
  )
  const [isPending, setIsPending] =
    useState(false)
  const [error, setError] = useState<string | null>(
    null
  )

  async function handleSave() {
    if (!name.trim()) {
      setError("Section name is required.")
      return
    }

    setIsPending(true)
    setError(null)

    const formData = new FormData()

    formData.set("sectionId", sectionId)
    formData.set("projectId", projectId)
    formData.set("name", name)
    formData.set("description", description)

    try {
      await updateBoqSectionAction(formData)
      router.refresh()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update section."
      )

      setIsPending(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          disabled={isPending}
          placeholder="Section name"
        />

        <Input
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          disabled={isPending}
          placeholder="Description"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          disabled={isPending}
          onClick={() => void handleSave()}
        >
          <Check
            className="size-4"
            aria-hidden="true"
          />

          {isPending ? "Saving..." : "Save"}
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={isPending}
          onClick={onCancel}
        >
          <X
            className="size-4"
            aria-hidden="true"
          />
          Cancel
        </Button>
      </div>

      {error ? (
        <p className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

interface BoqSectionDeleteButtonProps {
  sectionId: string
  projectId: string
}

export function BoqSectionDeleteButton({
  sectionId,
  projectId,
}: BoqSectionDeleteButtonProps) {
  const router = useRouter()

  const [isPending, setIsPending] =
    useState(false)

  async function handleDelete() {
    const confirmed = window.confirm(
      "Delete this BOQ section and all of its line items?"
    )

    if (!confirmed) {
      return
    }

    setIsPending(true)

    const formData = new FormData()

    formData.set("sectionId", sectionId)
    formData.set("projectId", projectId)

    try {
      await deleteBoqSectionAction(formData)
      router.refresh()
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to delete section."
      )

      setIsPending(false)
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() => void handleDelete()}
      className="text-muted-foreground hover:text-destructive"
    >
      <Trash2
        className="size-4"
        aria-hidden="true"
      />

      {isPending
        ? "Deleting..."
        : "Delete section"}
    </Button>
  )
}

interface BoqSectionEditButtonProps {
  onEdit: () => void
}

export function BoqSectionEditButton({
  onEdit,
}: BoqSectionEditButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onEdit}
    >
      <Pencil
        className="size-4"
        aria-hidden="true"
      />
      Edit
    </Button>
  )
}