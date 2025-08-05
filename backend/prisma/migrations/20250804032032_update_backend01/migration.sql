/*
  Warnings:

  - You are about to drop the column `profilePictureUrl` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Conversation" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "profilePictureUrl";
