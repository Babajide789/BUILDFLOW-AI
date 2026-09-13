"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { OnboardingReview } from "@/components/onboarding/onboarding-review"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"
import { OrganizationContextForm } from "@/components/onboarding/organization-context-form"
import { OrganizationProfileForm } from "@/components/onboarding/organization-profile-form"
import { TeamConfigurationForm } from "@/components/onboarding/team-configuration-form"
import { WorkspacePreferencesForm } from "@/components/onboarding/workspace-preferences-form"
import type { OnboardingState } from "@/lib/types/organization"

const initialState: OnboardingState = {
  organization: {},
  workspace: {
    modules: [],
  },
  team: [],
  currentStep: 1,
  completedSteps: [],
  onboardingComplete: false,
}

export default function OnboardingPage() {
  const router = useRouter()

  const [state, setState] =
    useState<OnboardingState>(initialState)

  const markStepComplete = (
    current: OnboardingState,
    step: number
  ) => {
    return Array.from(
      new Set([...current.completedSteps, step])
    )
  }

  const handleProfileContinue = (
    data: Parameters<
      React.ComponentProps<
        typeof OrganizationProfileForm
      >["onContinue"]
    >[0]
  ) => {
    setState((current) => ({
      ...current,
      organization: {
        ...current.organization,
        ...data,
      },
      currentStep: 2,
      completedSteps: markStepComplete(
        current,
        1
      ),
    }))
  }

  const handleContextContinue = (
    data: Parameters<
      React.ComponentProps<
        typeof OrganizationContextForm
      >["onContinue"]
    >[0]
  ) => {
    setState((current) => ({
      ...current,
      organization: {
        ...current.organization,
        ...data,
      },
      currentStep: 3,
      completedSteps: markStepComplete(
        current,
        2
      ),
    }))
  }

  const handleWorkspaceContinue = (
    data: Parameters<
      React.ComponentProps<
        typeof WorkspacePreferencesForm
      >["onContinue"]
    >[0]
  ) => {
    setState((current) => ({
      ...current,
      workspace: data,
      currentStep: 4,
      completedSteps: Array.from(
        new Set([...current.completedSteps, 3])
      ),
    }))
  }

  const handleTeamContinue = (
    data: Parameters<
      React.ComponentProps<
        typeof TeamConfigurationForm
      >["onContinue"]
    >[0]
  ) => {
    setState((current) => ({
      ...current,
      team: data,
      currentStep: 5,
      completedSteps: Array.from(
        new Set([...current.completedSteps, 4])
      ),
    }))
  }

  const handleBack = () => {
    setState((current) => ({
      ...current,
      currentStep: Math.max(
        1,
        current.currentStep - 1
      ),
    }))
  }

  const handleEdit = (step: number) => {
    setState((current) => ({
      ...current,
      currentStep: step,
    }))
  }

  const handleComplete = () => {
    setState((current) => ({
      ...current,
      currentStep: 5,
      onboardingComplete: true,
      completedSteps: Array.from(
        new Set([...current.completedSteps, 5])
      ),
    }))

    router.push("/projects")
  }

  return (
    <OnboardingShell
      currentStep={state.currentStep}
      completedSteps={state.completedSteps}
    >
      {state.currentStep === 1 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">
              Organization profile
            </h2>

            <p className="text-sm text-muted-foreground">
              Start by telling us about your organization.
            </p>
          </div>

          <OrganizationProfileForm
            initialData={state.organization}
            onContinue={handleProfileContinue}
          />
        </div>
      )}

      {state.currentStep === 2 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">
              Your construction context
            </h2>

            <p className="text-sm text-muted-foreground">
              Help us understand the type of construction work
              your organization manages.
            </p>
          </div>

          <OrganizationContextForm
            initialData={state.organization}
            onBack={handleBack}
            onContinue={handleContextContinue}
          />
        </div>
      )}

      {state.currentStep === 3 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">
              Workspace preferences
            </h2>

            <p className="text-sm text-muted-foreground">
              Choose the BuildFlow capabilities you want your
              workspace to focus on.
            </p>
          </div>

          <WorkspacePreferencesForm
            initialData={state.workspace}
            onBack={handleBack}
            onContinue={handleWorkspaceContinue}
          />
        </div>
      )}

      {state.currentStep === 4 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">
              Team configuration
            </h2>

            <p className="text-sm text-muted-foreground">
              Set up your initial team and invite people who
              should collaborate with you.
            </p>
          </div>

          <TeamConfigurationForm
            initialData={state.team}
            organizationName={state.organization.name}
            onBack={handleBack}
            onContinue={handleTeamContinue}
          />
        </div>
      )}

      {state.currentStep === 5 && (
        <OnboardingReview
          organization={state.organization}
          modules={state.workspace.modules}
          team={state.team}
          onEdit={handleEdit}
          onComplete={handleComplete}
        />
      )}
    </OnboardingShell>
  )
}