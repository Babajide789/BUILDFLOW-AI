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

async function seedProjectBoq(projectId: string) {
  const boq = await prisma.boq.upsert({
    where: {
      projectId,
    },
    update: {
      name: "Main Works BOQ",
      description:
        "Baseline bill of quantities for the project.",
    },
    create: {
      projectId,
      name: "Main Works BOQ",
      description:
        "Baseline bill of quantities for the project.",
    },
  })

  const sections = [
    {
      name: "Preliminaries",
      description:
        "General preliminaries and project establishment works.",
      items: [
        {
          itemCode: "PRE-001",
          description:
            "Site establishment and mobilization",
          unit: "LS" as const,
          quantity: "1",
          rate: "4500000",
        },
        {
          itemCode: "PRE-002",
          description:
            "Temporary site facilities and services",
          unit: "LS" as const,
          quantity: "1",
          rate: "2800000",
        },
      ],
    },
    {
      name: "Substructure",
      description:
        "Excavation, foundation and ground floor works.",
      items: [
        {
          itemCode: "SUB-001",
          description:
            "Excavation for foundation trenches",
          unit: "M3" as const,
          quantity: "180",
          rate: "8500",
        },
        {
          itemCode: "SUB-002",
          description:
            "Reinforced concrete foundation",
          unit: "M3" as const,
          quantity: "95",
          rate: "185000",
        },
        {
          itemCode: "SUB-003",
          description:
            "High tensile reinforcement",
          unit: "TONNE" as const,
          quantity: "14.5",
          rate: "1250000",
        },
      ],
    },
    {
      name: "Superstructure",
      description:
        "Structural frame and associated works.",
      items: [
        {
          itemCode: "SUP-001",
          description:
            "Reinforced concrete columns and beams",
          unit: "M3" as const,
          quantity: "120",
          rate: "210000",
        },
        {
          itemCode: "SUP-002",
          description: "Blockwork",
          unit: "M2" as const,
          quantity: "1850",
          rate: "9500",
        },
      ],
    },
  ]

  for (
    let sectionIndex = 0;
    sectionIndex < sections.length;
    sectionIndex++
  ) {
    const sectionData = sections[sectionIndex]

    const sectionId = `${boq.id}-${sectionData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}`

    const section = await prisma.boqSection.upsert({
      where: {
        id: sectionId,
      },
      update: {
        name: sectionData.name,
        description: sectionData.description,
        sortOrder: sectionIndex,
      },
      create: {
        id: sectionId,
        boqId: boq.id,
        name: sectionData.name,
        description: sectionData.description,
        sortOrder: sectionIndex,
      },
    })

    for (
      let itemIndex = 0;
      itemIndex < sectionData.items.length;
      itemIndex++
    ) {
      const item = sectionData.items[itemIndex]

      await prisma.boqItem.upsert({
        where: {
          sectionId_itemCode: {
            sectionId: section.id,
            itemCode: item.itemCode,
          },
        },
        update: {
          description: item.description,
          unit: item.unit,
          quantity: item.quantity,
          rate: item.rate,
          status: "ACTIVE",
          sortOrder: itemIndex,
        },
        create: {
          sectionId: section.id,
          itemCode: item.itemCode,
          description: item.description,
          unit: item.unit,
          quantity: item.quantity,
          rate: item.rate,
          status: "ACTIVE",
          sortOrder: itemIndex,
        },
      })
    }
  }

  return boq
}

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
      description:
        "Development organization for BuildFlow AI.",
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

  const demoProjects = [
    {
      slug: "victoria-island-residence",
      name: "Victoria Island Residence",
      client: "Adekunle Holdings",
      location: "Victoria Island, Lagos",
      status: "ACTIVE" as const,
      budget: "185000000",
      progress: 68,
      startDate: new Date("2026-01-15"),
      endDate: new Date("2026-11-30"),
    },
    {
      slug: "lekki-commercial-centre",
      name: "Lekki Commercial Centre",
      client: "Coastal Properties Ltd.",
      location: "Lekki Phase 1, Lagos",
      status: "ACTIVE" as const,
      budget: "320000000",
      progress: 42,
      startDate: new Date("2026-03-01"),
      endDate: new Date("2027-02-28"),
    },
    {
      slug: "ikeja-office-complex",
      name: "Ikeja Office Complex",
      client: "MetroWorks Nigeria",
      location: "Ikeja, Lagos",
      status: "PLANNING" as const,
      budget: "275000000",
      progress: 8,
      startDate: new Date("2026-10-01"),
      endDate: new Date("2027-08-31"),
    },
    {
      slug: "ikoyi-residential-tower",
      name: "Ikoyi Residential Tower",
      client: "Harbour Developments",
      location: "Ikoyi, Lagos",
      status: "COMPLETED" as const,
      budget: "410000000",
      progress: 100,
      startDate: new Date("2024-06-01"),
      endDate: new Date("2026-05-31"),
    },
    {
      slug: "yaba-innovation-hub",
      name: "Yaba Innovation Hub",
      client: "UrbanBuild Group",
      location: "Yaba, Lagos",
      status: "AT_RISK" as const,
      budget: "150000000",
      progress: 54,
      startDate: new Date("2026-02-15"),
      endDate: new Date("2026-12-15"),
    },
    {
      slug: "ajah-estate-development",
      name: "Ajah Estate Development",
      client: "Greenfield Estates",
      location: "Ajah, Lagos",
      status: "ON_HOLD" as const,
      budget: "225000000",
      progress: 31,
      startDate: new Date("2025-11-01"),
      endDate: new Date("2027-01-31"),
    },
  ]

  const seededProjects = []

  for (const project of demoProjects) {
    const seededProject = await prisma.project.upsert({
      where: {
        organizationId_slug: {
          organizationId: organization.id,
          slug: project.slug,
        },
      },
      update: {
        name: project.name,
        client: project.client,
        location: project.location,
        status: project.status,
        budget: project.budget,
        progress: project.progress,
        startDate: project.startDate,
        endDate: project.endDate,
      },
      create: {
        organizationId: organization.id,
        ...project,
      },
    })

    seededProjects.push(seededProject)
  }

  const victoriaIslandResidence = seededProjects.find(
    (project) =>
      project.slug === "victoria-island-residence"
  )

  if (!victoriaIslandResidence) {
    throw new Error(
      "Victoria Island Residence project was not found after seeding."
    )
  }

  const boq = await seedProjectBoq(
    victoriaIslandResidence.id
  )

  console.log(
    "BuildFlow development bootstrap complete."
  )

  console.log({
    userId: user.id,
    organizationId: organization.id,
    membershipId: membership.id,
    role: membership.role,
    status: membership.status,
    projectsSeeded: demoProjects.length,
    boqId: boq.id,
    boqProjectId: boq.projectId,
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