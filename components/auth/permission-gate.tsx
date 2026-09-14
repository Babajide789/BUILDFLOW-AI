"use client"

import type { ReactNode } from "react"

import type {
  OrganizationMembership,
  Permission,
} from "@/lib/types/authorization"

import { hasPermission } from "@/lib/auth"

interface PermissionGateProps {
  membership: OrganizationMembership | null | undefined
  permission: Permission
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGate({
  membership,
  permission,
  children,
  fallback = null,
}: PermissionGateProps) {
  if (!hasPermission(membership, permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}