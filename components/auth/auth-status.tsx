"use client"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"

export function AuthStatus() {
  const {
    data: session,
    isPending,
  } = authClient.useSession()

  if (isPending) {
    return (
      <span className="text-sm text-muted-foreground">
        Loading...
      </span>
    )
  }

  if (!session) {
    return (
      <span className="text-sm text-muted-foreground">
        Not authenticated
      </span>
    )
  }

  const handleSignOut = async () => {
    await authClient.signOut()
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-muted-foreground">
        Signed in as {session.user.email}
      </span>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </div>
  )
}