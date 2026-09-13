"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Mail, Plus, Trash2, UserRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type {
  TeamMember,
  TeamMemberRole,
} from "@/lib/types/organization"

interface TeamConfigurationFormProps {
  initialData?: TeamMember[]
  organizationName?: string
  onBack: () => void
  onContinue: (data: TeamMember[]) => void
}

const roleOptions: {
  value: TeamMemberRole
  label: string
  description: string
}[] = [
  {
    value: "admin",
    label: "Admin",
    description: "Can help manage the organization and workspace.",
  },
  {
    value: "member",
    label: "Member",
    description: "Standard workspace access for project team members.",
  },
]

function createMemberId() {
  return `member-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`
}

export function TeamConfigurationForm({
  initialData = [],
  organizationName,
  onBack,
  onContinue,
}: TeamConfigurationFormProps) {
  const [members, setMembers] =
    useState<TeamMember[]>(initialData)

  const [email, setEmail] = useState("")
  const [role, setRole] =
    useState<TeamMemberRole>("member")
  const [error, setError] = useState("")

  const handleAddMember = () => {
    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail) {
      setError("Enter an email address to send an invitation.")
      return
    }

    if (!normalizedEmail.includes("@")) {
      setError("Enter a valid email address.")
      return
    }

    if (
      members.some(
        (member) =>
          member.email.toLowerCase() === normalizedEmail
      )
    ) {
      setError("This email has already been added.")
      return
    }

    setMembers((current) => [
      ...current,
      {
        id: createMemberId(),
        name: normalizedEmail.split("@")[0],
        email: normalizedEmail,
        role,
        status: "invited",
      },
    ])

    setEmail("")
    setError("")
  }

  const handleRemoveMember = (id: string) => {
    setMembers((current) =>
      current.filter((member) => member.id !== id)
    )
  }

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    onContinue(members)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      <div className="space-y-2">
        <h3 className="text-sm font-medium">
          Set up your initial team
        </h3>

        <p className="text-sm text-muted-foreground">
          {organizationName
            ? `You're setting up the first team for ${organizationName}.`
            : "You're setting up the first team for your organization."}{" "}
          You can invite more people later.
        </p>
      </div>

      <div className="rounded-xl border bg-muted/30 p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background">
            <UserRound
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">
              Organization Owner
            </p>

            <p className="text-xs text-muted-foreground">
              You will become the initial owner of this organization.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="team-email">
            Invite a team member
          </Label>

          <p className="text-xs text-muted-foreground">
            Add teammates by email. Invitations are represented
            locally for now and will be connected to real
            membership infrastructure in the authorization phase.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_180px_auto]">
          <Input
            id="team-email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setError("")
            }}
            placeholder="colleague@company.com"
          />

          <select
            value={role}
            onChange={(event) =>
              setRole(
                event.target.value as TeamMemberRole
              )
            }
            aria-label="Team member role"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          >
            {roleOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>

          <Button
            type="button"
            variant="outline"
            onClick={handleAddMember}
          >
            <Plus
              className="size-4"
              aria-hidden="true"
            />
            Add
          </Button>
        </div>

        {error && (
          <p
            className="text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>

      {members.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium">
            Pending invitations
          </h3>

          <div className="divide-y rounded-xl border">
            {members.map((member) => {
              const roleLabel =
                roleOptions.find(
                  (option) => option.value === member.role
                )?.label ?? member.role

              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Mail
                        className="size-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {member.email}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {roleLabel} · Invitation pending
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleRemoveMember(member.id)
                    }
                    aria-label={`Remove ${member.email}`}
                  >
                    <Trash2
                      className="size-4"
                      aria-hidden="true"
                    />
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
        >
          <ArrowLeft
            className="size-4"
            aria-hidden="true"
          />
          Back
        </Button>

        <Button type="submit">
          Continue
          <ArrowRight
            className="size-4"
            aria-hidden="true"
          />
        </Button>
      </div>
    </form>
  )
}