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

  "boq:read",
  "boq:create",
  "boq:update",
  "boq:delete",

  "procurement:read",
  "procurement:create",
  "procurement:update",
  "procurement:delete",
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

  "boq:read",
  "boq:create",
  "boq:update",
  "boq:delete",

  "procurement:read",
  "procurement:create",
  "procurement:update",
  "procurement:delete",
]

const memberPermissions: Permission[] = [
  "organization:read",
  "members:read",

  "projects:read",
  "projects:update",

  "boq:read",
  "boq:update",

  "procurement:read",
  "procurement:update",
]

export const rolePermissions: Record<
  OrganizationRole,
  readonly Permission[]
> = {
  owner: ownerPermissions,
  admin: adminPermissions,
  member: memberPermissions,
}