import { Injectable } from '@nestjs/common';
import { PrismaService } from '../datasource';
import { MessageRecord } from '@slchatapp/shared';
import { CreateMessageData } from 'src/types';

@Injectable()
export class MessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getMessagesByConversationId(
    conversationId: string,
  ): Promise<MessageRecord[]> {
    return this.prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },
    });
  }

  // DEBUG METHODS
  async getMessageById(messageId: string): Promise<MessageRecord | null> {
    return this.prisma.message.findUnique({
      where: {
        messageId,
      },
    });
  }

  // DEBUG METHODS
  async getMessageByUserId(userId: string): Promise<MessageRecord[]> {
    return this.prisma.message.findMany({
      where: {
        senderId: userId,
      },
    });
  }

  async createMessage(data: CreateMessageData): Promise<MessageRecord> {
    return this.prisma.message.create({
      data: {
        ...data,
        messageStatus: 'SENT',
      },
    });
  }

  async deliverMessage(messageId: string): Promise<void> {
    await this.prisma.message.update({
      where: { messageId },
      data: { messageStatus: 'DELIVERED' },
    });
  }
}
