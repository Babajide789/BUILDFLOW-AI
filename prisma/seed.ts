import "dotenv/config"

import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/prisma/client"

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured.")
}

const adapter = new PrismaPg({
  connectionString,
})

const prisma = new PrismaClient({
  adapter,
})

async function main() {
  const user = await prisma.user.findFirst({
    orderBy: {
      createdAt: "asc",
    },
  })

  if (!user) {
    throw new Error(
      "No user found. Sign up through Better Auth before running the seed."
    )
  }

  const organization = await prisma.organization.upsert({
    where: {
      slug: "buildflow-demo",
    },
    update: {},
    create: {
      name: "BuildFlow Demo",
      slug: "buildflow-demo",
      description: "Development organization for BuildFlow AI.",
      location: "Lagos, Nigeria",
    },
  })

  const membership = await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: user.id,
        organizationId: organization.id,
      },
    },
    update: {
      role: "OWNER",
      status: "ACTIVE",
    },
    create: {
      userId: user.id,
      organizationId: organization.id,
      role: "OWNER",
      status: "ACTIVE",
    },
  })

  console.log("BuildFlow development bootstrap complete.")
  console.log({
    userId: user.id,
    organizationId: organization.id,
    membershipId: membership.id,
    role: membership.role,
    status: membership.status,
  })
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })