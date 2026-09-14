"use client"

import type { ReactNode } from "react"

import type {
  OrganizationMembership,
  OrganizationRole,
} from "@/lib/types/authorization"

import { hasRole } from "@/lib/auth"

interface RoleGateProps {
  membership: OrganizationMembership | null | undefined
  role: OrganizationRole
  children: ReactNode
  fallback?: ReactNode
}

export function RoleGate({
  membership,
  role,
  children,
  fallback = null,
}: RoleGateProps) {
  if (!hasRole(membership, role)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}