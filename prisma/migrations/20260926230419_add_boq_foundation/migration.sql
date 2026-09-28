-- CreateEnum
CREATE TYPE "BoqUnit" AS ENUM ('ITEM', 'M', 'M2', 'M3', 'KG', 'TONNE', 'LITRE', 'DAY', 'HOUR', 'LS');

-- CreateEnum
CREATE TYPE "BoqItemStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Boq" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Boq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoqSection" (
    "id" TEXT NOT NULL,
    "boqId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoqSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoqItem" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "itemCode" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unit" "BoqUnit" NOT NULL,
    "quantity" DECIMAL(18,4) NOT NULL,
    "rate" DECIMAL(18,2) NOT NULL,
    "status" "BoqItemStatus" NOT NULL DEFAULT 'ACTIVE',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoqItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Boq_projectId_key" ON "Boq"("projectId");

-- CreateIndex
CREATE INDEX "BoqSection_boqId_idx" ON "BoqSection"("boqId");

-- CreateIndex
CREATE INDEX "BoqSection_boqId_sortOrder_idx" ON "BoqSection"("boqId", "sortOrder");

-- CreateIndex
CREATE INDEX "BoqItem_sectionId_idx" ON "BoqItem"("sectionId");

-- CreateIndex
CREATE INDEX "BoqItem_sectionId_sortOrder_idx" ON "BoqItem"("sectionId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "BoqItem_sectionId_itemCode_key" ON "BoqItem"("sectionId", "itemCode");

-- AddForeignKey
ALTER TABLE "Boq" ADD CONSTRAINT "Boq_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoqSection" ADD CONSTRAINT "BoqSection_boqId_fkey" FOREIGN KEY ("boqId") REFERENCES "Boq"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoqItem" ADD CONSTRAINT "BoqItem_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "BoqSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
