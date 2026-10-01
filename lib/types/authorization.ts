export type OrganizationRole =
  | "owner"
  | "admin"
  | "member"

export type MembershipStatus =
  | "active"
  | "invited"
  | "suspended"

export type Permission =
  | "organization:read"
  | "organization:update"
  | "organization:manage"
  | "members:read"
  | "members:invite"
  | "members:update"
  | "members:remove"
  | "projects:read"
  | "projects:create"
  | "projects:update"
  | "projects:delete"
  | "boq:read"
  | "boq:create"
  | "boq:update"
  | "boq:delete"
  | "procurement:read"
  | "procurement:create"
  | "procurement:update"
  | "procurement:delete"

export interface OrganizationMembership {
  id: string
  userId: string
  organizationId: string
  role: OrganizationRole
  status: MembershipStatus
}