import { currentUser } from "@/lib/data/users"

import { getOrganizationMembership } from "./membership"

export const currentOrganizationId =
  "org-buildflow-demo"

export function getCurrentUser() {
  return currentUser
}

export function getCurrentOrganizationMembership() {
  return getOrganizationMembership(
    currentUser.id,
    currentOrganizationId
  )
}