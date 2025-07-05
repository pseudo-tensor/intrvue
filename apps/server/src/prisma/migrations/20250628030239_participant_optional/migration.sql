-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_participant_id_fkey";

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "participant_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
