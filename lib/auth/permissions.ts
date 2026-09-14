import type {
  OrganizationRole,
  Permission,
} from "@/lib/types/authorization"

const ownerPermissions: Permission[] = [
  "organization:read",
  "organization:update",
  "organization:manage",
  "members:read",
  "members:invite",
  "members:update",
  "members:remove",
  "projects:read",
  "projects:create",
  "projects:update",
  "projects:delete",
]

const adminPermissions: Permission[] = [
  "organization:read",
  "organization:update",
  "members:read",
  "members:invite",
  "members:update",
  "members:remove",
  "projects:read",
  "projects:create",
  "projects:update",
  "projects:delete",
]

const memberPermissions: Permission[] = [
  "organization:read",
  "members:read",
  "projects:read",
  "projects:update",
]

export const rolePermissions: Record<
  OrganizationRole,
  readonly Permission[]
> = {
  owner: ownerPermissions,
  admin: adminPermissions,
  member: memberPermissions,
}