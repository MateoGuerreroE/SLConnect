import { Injectable } from '@nestjs/common';
import { PrismaService } from '../datasource';

@Injectable()
export class ConversationUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async addUserToConversation(
    conversationId: string,
    userId: string,
  ): Promise<void> {
    await this.prisma.conversationUser.create({
      data: {
        conversationId,
        userId,
      },
    });
  }

  async removeUserFromConversation(
    conversationId: string,
    userId: string,
  ): Promise<void> {
    await this.prisma.conversationUser.delete({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
    });
  }
}
