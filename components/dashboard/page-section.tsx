import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface PageSectionProps {
  title?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}

function PageSection({
  title,
  description,
  actions,
  children,
  className,
}: PageSectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      {(title || description || actions) && (
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 space-y-1">
            {title ? (
              <h2 className="font-heading text-lg font-semibold tracking-tight">
                {title}
              </h2>
            ) : null}

            {description ? (
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>

          {actions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {actions}
            </div>
          ) : null}
        </div>
      )}

      {children}
    </section>
  )
}

export { PageSection }