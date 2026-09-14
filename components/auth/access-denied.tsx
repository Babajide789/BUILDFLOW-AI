import { ShieldAlert } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

interface AccessDeniedProps {
  title?: string
  description?: string
}

export function AccessDenied({
  title = "Access restricted",
  description = "You do not have permission to access this area.",
}: AccessDeniedProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <div className="flex size-10 items-center justify-center rounded-full border bg-muted">
          <ShieldAlert
            className="size-5 text-muted-foreground"
            aria-hidden="true"
          />
        </div>

        <div className="space-y-1">
          <h2 className="text-base font-semibold">
            {title}
          </h2>

          <p className="max-w-md text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}