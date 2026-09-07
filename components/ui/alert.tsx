import type { HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

type AlertVariant = "default" | "destructive"

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
}

function Alert({
  className,
  variant = "default",
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      data-slot="alert"
      data-variant={variant}
      className={cn(
        "relative w-full rounded-lg border px-4 py-3 text-sm",
        variant === "default" &&
          "bg-background text-foreground",
        variant === "destructive" &&
          "border-destructive/50 text-destructive dark:border-destructive",
        className
      )}
      {...props}
    />
  )
}

function AlertTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5
      data-slot="alert-title"
      className={cn(
        "mb-1 font-medium leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-sm text-muted-foreground [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export {
  Alert,
  AlertTitle,
  AlertDescription,
}