"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { createBoqAction } from "@/app/(dashboard)/projects/actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface BoqCreateFormProps {
  projectId: string
}

export function BoqCreateForm({
  projectId,
}: BoqCreateFormProps) {
  const router = useRouter()

  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    setError(null)

    try {
      await createBoqAction(formData)
      router.refresh()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create BOQ."
      )
      setIsPending(false)
    }
  }

  return (
    <form action={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Create project BOQ</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <input
            type="hidden"
            name="projectId"
            value={projectId}
          />

          <div className="space-y-2">
            <Label htmlFor="boq-name">
              BOQ name
            </Label>

            <Input
              id="boq-name"
              name="name"
              defaultValue="Main Works BOQ"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="boq-description">
              Description
            </Label>

            <Textarea
              id="boq-description"
              name="description"
              placeholder="Describe the scope covered by this BOQ..."
              rows={4}
            />
          </div>

          {error ? (
            <p className="text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isPending}
            >
              {isPending
                ? "Creating BOQ..."
                : "Create BOQ"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}