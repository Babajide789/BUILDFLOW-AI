"use client"

import type { ReactNode } from "react"

import { OnboardingProgress } from "./onboarding-progress"

interface OnboardingShellProps {
  children: ReactNode
  currentStep: number
  completedSteps: number[]
}

const steps = [
  "Organization",
  "Construction",
  "Workspace",
  "Team",
  "Review",
]

export function OnboardingShell({
  children,
  currentStep,
  completedSteps,
}: OnboardingShellProps) {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        <div className="mx-auto w-full max-w-3xl space-y-8">
          <div className="space-y-2 text-center">
            <p className="text-sm font-medium text-primary">
              Welcome to BuildFlow
            </p>

            <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Set up your organization
            </h1>

            <p className="mx-auto max-w-xl text-sm text-muted-foreground sm:text-base">
              Tell us a little about your organization so we can
              configure your BuildFlow workspace.
            </p>
          </div>

          <OnboardingProgress
            currentStep={currentStep}
            completedSteps={completedSteps}
            steps={steps}
          />

          <section
            aria-label={`Onboarding step ${currentStep}`}
            className="rounded-xl border bg-card p-5 shadow-sm sm:p-6 md:p-8"
          >
            {children}
          </section>
        </div>
      </div>
    </main>
  )
}