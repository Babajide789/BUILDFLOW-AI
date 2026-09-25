"use client"

import {
  type FormEvent,
  useState,
} from "react"
import { authClient } from "@/lib/auth-client"

export function AuthForm() {
  const [mode, setMode] = useState<"sign-in" | "sign-up">(
    "sign-up"
  )
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setPending(true)
    setMessage("")

    try {
      if (mode === "sign-up") {
        const { error } = await authClient.signUp.email({
          name,
          email,
          password,
        })

        if (error) {
          setMessage(error.message ?? "Unable to create account.")
          return
        }

        setMessage("Account created successfully.")
      } else {
        const { error } = await authClient.signIn.email({
          email,
          password,
        })

        if (error) {
          setMessage(error.message ?? "Unable to sign in.")
          return
        }

        setMessage("Signed in successfully.")
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md space-y-4"
    >
      {mode === "sign-up" && (
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Name"
          className="w-full rounded-md border bg-background px-3 py-2"
          required
        />
      )}

      <input
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        type="email"
        placeholder="Email"
        className="w-full rounded-md border bg-background px-3 py-2"
        required
      />

      <input
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        type="password"
        placeholder="Password"
        className="w-full rounded-md border bg-background px-3 py-2"
        minLength={8}
        required
      />

      <button
        type="submit"
        disabled={pending}
        className="rounded-md border px-4 py-2"
      >
        {pending
          ? "Please wait..."
          : mode === "sign-up"
            ? "Create account"
            : "Sign in"}
      </button>

      <button
        type="button"
        className="block text-sm underline"
        onClick={() => {
          setMode((current) =>
            current === "sign-up"
              ? "sign-in"
              : "sign-up"
          )
          setMessage("")
        }}
      >
        {mode === "sign-up"
          ? "Already have an account? Sign in"
          : "Need an account? Sign up"}
      </button>

      {message && (
        <p className="text-sm text-muted-foreground">
          {message}
        </p>
      )}
    </form>
  )
}