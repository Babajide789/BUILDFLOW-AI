import type { ReactNode } from "react"

import { AccessDenied } from "@/components/auth/access-denied"

import type { AuthorizationState } from "@/lib/auth/states"

interface AuthorizationStateViewProps {
  state: AuthorizationState
  children: ReactNode
}

export function AuthorizationStateView({
  state,
  children,
}: AuthorizationStateViewProps) {
  if (state === "authorized") {
    return <>{children}</>
  }

  if (state === "permission-denied") {
    return (
      <AccessDenied
        title="Permission denied"
        description="You do not have permission to perform this action."
      />
    )
  }

  if (state === "membership-suspended") {
    return (
      <AccessDenied
        title="Membership suspended"
        description="Your organization membership is currently suspended."
      />
    )
  }

  if (state === "membership-not-found") {
    return (
      <AccessDenied
        title="Organization access required"
        description="You do not have an active membership in this organization."
      />
    )
  }

  if (state === "organization-not-found") {
    return (
      <AccessDenied
        title="Organization not found"
        description="The requested organization could not be found."
      />
    )
  }

  if (state === "resource-not-found") {
    return (
      <AccessDenied
        title="Resource not found"
        description="The requested resource could not be found."
      />
    )
  }

  return (
    <AccessDenied
      title="Authentication required"
      description="You must be authenticated to access this area."
    />
  )
}