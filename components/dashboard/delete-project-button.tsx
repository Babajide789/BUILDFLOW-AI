"use client"

import { useState } from "react"

import { deleteProjectAction } from "@/app/(dashboard)/projects/actions"
import { Button } from "@/components/ui/button"

interface DeleteProjectButtonProps {
  projectId: string
}

export function DeleteProjectButton({
  projectId,
}: DeleteProjectButtonProps) {
  const [isPending, setIsPending] = useState(false)

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project? This action cannot be undone."
    )

    if (!confirmed) {
      return
    }

    setIsPending(true)

    try {
      await deleteProjectAction(projectId)
    } catch {
      setIsPending(false)
    }
  }

  return (
    <Button
      type="button"
      variant="destructive"
      disabled={isPending}
      onClick={handleDelete}
    >
      {isPending ? "Deleting..." : "Delete project"}
    </Button>
  )
}