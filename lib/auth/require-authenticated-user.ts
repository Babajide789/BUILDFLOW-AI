import { redirect } from "next/navigation"

import { getCurrentAuthenticatedUser } from "./session"

export async function requireAuthenticatedUser() {
  const user = await getCurrentAuthenticatedUser()

  if (!user) {
    redirect("/")
  }

  return user
}