"use client"

import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface OrganizationProfileData {
  name: string
  legalName: string
  email: string
  phone: string
  website: string
  address: string
  city: string
  state: string
  country: string
}

interface OrganizationProfileFormProps {
  initialData?: Partial<OrganizationProfileData>
  onContinue: (data: OrganizationProfileData) => void
}

export function OrganizationProfileForm({
  initialData,
  onContinue,
}: OrganizationProfileFormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const data: OrganizationProfileData = {
      name: String(formData.get("name") ?? "").trim(),
      legalName: String(formData.get("legalName") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      website: String(formData.get("website") ?? "").trim(),
      address: String(formData.get("address") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      state: String(formData.get("state") ?? "").trim(),
      country: String(formData.get("country") ?? "").trim(),
    }

    onContinue(data)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            Organization Name
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g. BuildFlow Construction"
            defaultValue={initialData?.name}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="legalName">
            Legal Name
          </Label>
          <Input
            id="legalName"
            name="legalName"
            placeholder="Registered legal name"
            defaultValue={initialData?.legalName}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Business Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="hello@company.com"
            defaultValue={initialData?.email}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone Number
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+234 800 000 0000"
            defaultValue={initialData?.phone}
            required
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="website">
            Website
            <span className="ml-1 text-muted-foreground">
              (optional)
            </span>
          </Label>
          <Input
            id="website"
            name="website"
            type="url"
            placeholder="https://company.com"
            defaultValue={initialData?.website}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address">
            Business Address
          </Label>
          <Input
            id="address"
            name="address"
            placeholder="Street address"
            defaultValue={initialData?.address}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">
            City
          </Label>
          <Input
            id="city"
            name="city"
            placeholder="Lagos"
            defaultValue={initialData?.city}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">
            State / Province
          </Label>
          <Input
            id="state"
            name="state"
            placeholder="Lagos"
            defaultValue={initialData?.state}
            required
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="country">
            Country
          </Label>
          <Input
            id="country"
            name="country"
            placeholder="Nigeria"
            defaultValue={initialData?.country ?? "Nigeria"}
            required
          />
        </div>
      </div>

      <div className="flex justify-end border-t pt-6">
        <Button type="submit">
          Continue
          <ArrowRight
            className="size-4"
            aria-hidden="true"
          />
        </Button>
      </div>
    </form>
  )
}