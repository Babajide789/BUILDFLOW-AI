"use client"

import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

interface OnboardingProgressProps {
  currentStep: number
  completedSteps: number[]
  steps: string[]
}

export function OnboardingProgress({
  currentStep,
  completedSteps,
  steps,
}: OnboardingProgressProps) {
  return (
    <nav
      aria-label="Onboarding progress"
      className="w-full"
    >
      <ol className="flex items-start justify-between gap-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted =
            completedSteps.includes(stepNumber)
          const isCurrent = stepNumber === currentStep

          return (
            <li
              key={step}
              className="flex min-w-0 flex-1 flex-col items-center gap-2"
            >
              <div className="flex w-full items-center">
                {index > 0 && (
                  <div
                    className={cn(
                      "h-px flex-1",
                      completedSteps.includes(stepNumber - 1)
                        ? "bg-primary"
                        : "bg-border"
                    )}
                    aria-hidden="true"
                  />
                )}

                <div
                  aria-current={
                    isCurrent ? "step" : undefined
                  }
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                    isCompleted &&
                      "border-primary bg-primary text-primary-foreground",
                    isCurrent &&
                      !isCompleted &&
                      "border-primary bg-primary text-primary-foreground",
                    !isCompleted &&
                      !isCurrent &&
                      "border-border bg-background text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check
                      className="size-4"
                      aria-hidden="true"
                    />
                  ) : (
                    stepNumber
                  )}
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-px flex-1",
                      isCompleted
                        ? "bg-primary"
                        : "bg-border"
                    )}
                    aria-hidden="true"
                  />
                )}
              </div>

              <span
                className={cn(
                  "hidden text-center text-xs sm:block",
                  isCurrent
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}