import { Injectable } from '@nestjs/common';
import { PrismaService } from '../datasource';
import { ConversationRecord } from '@slchatapp/shared';
import { ICreateConversation } from 'src/types';

@Injectable()
export class ConversationRepository {
  constructor(private readonly prisma: PrismaService) {}

  // TODO Missing all conversation fetch for a admin panel maybe?
  async getConversationsByUserId(
    userId: string,
  ): Promise<ConversationRecord[]> {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        Users: {
          some: {
            userId: userId,
          },
        },
      },
    });

    return conversations;
  }

  async getConversationById(
    conversationId: string,
  ): Promise<ConversationRecord | null> {
    return this.prisma.conversation.findUnique({
      where: {
        conversationId,
      },
      include: {
        Messages: true,
        Users: true,
      },
    });
  }

  async createConversation(
    data: ICreateConversation,
  ): Promise<ConversationRecord> {
    return this.prisma.conversation.create({
      data: {
        ...data,
      },
    });
  }

  // Conversations can only be updated on the name field (Only groups) - Verification should be done by service layer
  async updateConversation(
    conversationId: string,
    name: string,
  ): Promise<ConversationRecord> {
    return this.prisma.conversation.update({
      where: { conversationId },
      data: { name },
    });
  }

  async removeConversation(conversationId: string): Promise<string> {
    const result = await this.prisma.conversation.update({
      where: { conversationId },
      data: { isDeleted: true },
    });

    return result.conversationId;
  }
}
