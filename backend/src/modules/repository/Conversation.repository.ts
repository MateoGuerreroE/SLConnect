import { Injectable } from '@nestjs/common';
import { ConversationRecord, ConversationType } from '@slchatapp/shared';
import { ICreateConversation } from 'src/types';
import { PrismaService } from '../datasource';

@Injectable()
export class ConversationRepository {
  constructor(private readonly prisma: PrismaService) {}

  // TODO Missing all conversation fetch for a admin panel maybe?
  async getConversationsByUserId(
    userId: string,
    type?: ConversationType,
    includeLastMessages?: boolean,
  ): Promise<ConversationRecord[]> {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        Users: {
          some: {
            userId: userId,
          },
        },
        ...(type && { type }),
      },
      include: {
        _count: {
          select: { Users: true },
        },
        Users: {
          where: { Conversation: { type: 'PRIVATE' } },
          select: {
            User: {
              select: {
                firstName: true,
                lastName: true,
                emailAddress: true,
              },
            },
          },
        },
        ...(includeLastMessages && {
          Messages: {
            select: { content: true, senderId: true },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        }),
      },
    });

    return conversations.map((conv) => {
      if (conv.type === 'PRIVATE') {
        return {
          ...conv,
          name: `${conv.Users[0]?.User.firstName} & ${conv.Users[1]?.User.firstName ?? ''}`,
        };
      }
      return conv;
    });
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
