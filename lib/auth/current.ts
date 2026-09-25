import {
  getCurrentAuthenticatedUser,
} from "./session"

import {
  getUserOrganizationMemberships,
} from "./membership"

export async function getCurrentUser() {
  return getCurrentAuthenticatedUser()
}

export async function getCurrentOrganizationMembership() {
  const user = await getCurrentAuthenticatedUser()

  if (!user) {
    return null
  }

  const memberships =
    await getUserOrganizationMemberships(user.id)

  return (
    memberships.find(
      (membership) =>
        membership.status === "active"
    ) ?? null
  )
}