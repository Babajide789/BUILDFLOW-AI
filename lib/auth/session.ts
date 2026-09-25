import { headers } from "next/headers"
import { auth } from "@/lib/better-auth"

export async function getCurrentSession() {
  return auth.api.getSession({
    headers: await headers(),
  })
}

export async function getCurrentAuthenticatedUser() {
  const session = await getCurrentSession()

  return session?.user ?? null
}