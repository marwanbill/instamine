/*
  Warnings:

  - You are about to drop the `Cv` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cv" DROP CONSTRAINT "Cv_userId_fkey";

-- DropTable
DROP TABLE "Cv";

-- CreateTable
CREATE TABLE "AlumniProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "filiere" TEXT NOT NULL,
    "promoYear" INTEGER NOT NULL,
    "currentJobTitle" TEXT NOT NULL,
    "currentCompany" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "linkedinUrl" TEXT NOT NULL,
    "cvFileUrl" TEXT NOT NULL,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AlumniProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerEntry" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CareerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AlumniProfile_userId_key" ON "AlumniProfile"("userId");

-- CreateIndex
CREATE INDEX "AlumniProfile_filiere_idx" ON "AlumniProfile"("filiere");

-- CreateIndex
CREATE INDEX "AlumniProfile_promoYear_idx" ON "AlumniProfile"("promoYear");

-- CreateIndex
CREATE INDEX "AlumniProfile_industry_idx" ON "AlumniProfile"("industry");

-- AddForeignKey
ALTER TABLE "AlumniProfile" ADD CONSTRAINT "AlumniProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerEntry" ADD CONSTRAINT "CareerEntry_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "AlumniProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
