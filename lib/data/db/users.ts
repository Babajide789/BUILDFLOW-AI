import { prisma } from "@/lib/db/prisma"

export function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
  })
}

export function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  })
}