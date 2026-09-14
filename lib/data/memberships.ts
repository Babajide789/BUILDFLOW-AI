import type { OrganizationMembership } from "@/lib/types/authorization"

export const organizationMemberships: OrganizationMembership[] = [
  {
    id: "membership-owner",
    userId: "user-buildflow-owner",
    organizationId: "org-buildflow-demo",
    role: "owner",
    status: "active",
  },
  {
    id: "membership-admin",
    userId: "user-project-admin",
    organizationId: "org-buildflow-demo",
    role: "admin",
    status: "active",
  },
  {
    id: "membership-member",
    userId: "user-project-member",
    organizationId: "org-buildflow-demo",
    role: "member",
    status: "active",
  },
]