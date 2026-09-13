/*
  Warnings:

  - Added the required column `updatedAt` to the `TalentPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "talentPostId" TEXT;

-- AlterTable
ALTER TABLE "TalentPost" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "TalentLike" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TalentLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TalentComment" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TalentComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TalentLike_postId_userId_key" ON "TalentLike"("postId", "userId");

-- AddForeignKey
ALTER TABLE "TalentLike" ADD CONSTRAINT "TalentLike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "TalentPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TalentLike" ADD CONSTRAINT "TalentLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TalentComment" ADD CONSTRAINT "TalentComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "TalentPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TalentComment" ADD CONSTRAINT "TalentComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_talentPostId_fkey" FOREIGN KEY ("talentPostId") REFERENCES "TalentPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
