-- CreateEnum
CREATE TYPE "SupplierStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ProcurementRequestStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "status" "SupplierStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcurementRequest" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "supplierId" TEXT,
    "requestedBy" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProcurementRequestStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcurementRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcurementRequestItem" (
    "id" TEXT NOT NULL,
    "procurementRequestId" TEXT NOT NULL,
    "boqItemId" TEXT NOT NULL,
    "quantity" DECIMAL(18,4) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcurementRequestItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Supplier_organizationId_idx" ON "Supplier"("organizationId");

-- CreateIndex
CREATE INDEX "Supplier_organizationId_status_idx" ON "Supplier"("organizationId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_organizationId_name_key" ON "Supplier"("organizationId", "name");

-- CreateIndex
CREATE INDEX "ProcurementRequest_projectId_idx" ON "ProcurementRequest"("projectId");

-- CreateIndex
CREATE INDEX "ProcurementRequest_projectId_status_idx" ON "ProcurementRequest"("projectId", "status");

-- CreateIndex
CREATE INDEX "ProcurementRequest_supplierId_idx" ON "ProcurementRequest"("supplierId");

-- CreateIndex
CREATE INDEX "ProcurementRequest_requestedBy_idx" ON "ProcurementRequest"("requestedBy");

-- CreateIndex
CREATE UNIQUE INDEX "ProcurementRequest_projectId_reference_key" ON "ProcurementRequest"("projectId", "reference");

-- CreateIndex
CREATE INDEX "ProcurementRequestItem_procurementRequestId_idx" ON "ProcurementRequestItem"("procurementRequestId");

-- CreateIndex
CREATE INDEX "ProcurementRequestItem_boqItemId_idx" ON "ProcurementRequestItem"("boqItemId");

-- CreateIndex
CREATE UNIQUE INDEX "ProcurementRequestItem_procurementRequestId_boqItemId_key" ON "ProcurementRequestItem"("procurementRequestId", "boqItemId");

-- AddForeignKey
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcurementRequest" ADD CONSTRAINT "ProcurementRequest_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcurementRequest" ADD CONSTRAINT "ProcurementRequest_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcurementRequestItem" ADD CONSTRAINT "ProcurementRequestItem_procurementRequestId_fkey" FOREIGN KEY ("procurementRequestId") REFERENCES "ProcurementRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcurementRequestItem" ADD CONSTRAINT "ProcurementRequestItem_boqItemId_fkey" FOREIGN KEY ("boqItemId") REFERENCES "BoqItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
