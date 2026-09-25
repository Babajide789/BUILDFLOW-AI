import { prisma } from "@/lib/db/prisma"

export function getOrganizationById(
  organizationId: string
) {
  return prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
  })
}

export function getOrganizationBySlug(
  slug: string
) {
  return prisma.organization.findUnique({
    where: {
      slug,
    },
  })
}