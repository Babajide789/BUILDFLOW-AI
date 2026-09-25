import { AuthStatus } from "@/components/auth/auth-status"
import { AuthForm } from "./auth-form"

export default function AuthTestPage() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Authentication Test
        </h1>

        <p className="text-sm text-muted-foreground">
          Temporary development surface for validating
          BuildFlow authentication.
        </p>
      </div>

      <AuthForm />

      <div className="border-t pt-6">
        <AuthStatus />
      </div>
    </div>
  )
}