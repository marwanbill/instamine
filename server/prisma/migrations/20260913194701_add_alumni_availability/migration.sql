-- AlterTable
ALTER TABLE "AlumniProfile" ADD COLUMN     "openToGeneralQuestions" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "openToInterviewPrep" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "openToMentoring" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "openToReferrals" BOOLEAN NOT NULL DEFAULT false;
