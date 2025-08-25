/*
  Warnings:

  - A unique constraint covering the columns `[conversationId,userId]` on the table `ConversationUser` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Conversation" DROP CONSTRAINT "Conversation_createdBy_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "ConversationUser_conversationId_userId_key" ON "public"."ConversationUser"("conversationId", "userId");
