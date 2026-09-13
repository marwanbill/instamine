/*
  Warnings:

  - Added the required column `category` to the `TalentPost` table without a default value. This is not possible if the table is not empty.
  - Made the column `mediaUrl` on table `TalentPost` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "TalentCategory" AS ENUM ('DRAWING', 'STORY_TELLING', 'DESIGN', 'WRITING', 'MUSIC', 'PHOTOGRAPHY');

-- AlterTable
ALTER TABLE "TalentPost" ADD COLUMN     "category" "TalentCategory" NOT NULL,
ALTER COLUMN "mediaUrl" SET NOT NULL;
