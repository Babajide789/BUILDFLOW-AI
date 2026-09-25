import { prisma } from "@/lib/db/prisma"

export function getMembership(
  userId: string,
  organizationId: string
) {
  return prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  })
}

export function getUserMemberships(
  userId: string
) {
  return prisma.membership.findMany({
    where: {
      userId,
    },
    include: {
      organization: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  })
}

export function getOrganizationMemberships(
  organizationId: string
) {
  return prisma.membership.findMany({
    where: {
      organizationId,
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  })
}