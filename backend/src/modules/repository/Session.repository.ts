import { Injectable } from '@nestjs/common';
import { PrismaService } from '../datasource';
import { SessionRecord } from '@slchatapp/shared';

@Injectable()
export class SessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getSessionById(sessionId: string): Promise<SessionRecord | null> {
    return this.prisma.session.findUnique({
      where: {
        sessionId,
      },
    });
  }

  async getSessionByUserId(userId: string): Promise<SessionRecord | null> {
    return this.prisma.session.findFirst({
      where: {
        userId,
      },
    });
  }

  async createSession(
    userId: string,
    refreshToken: string,
  ): Promise<SessionRecord> {
    const refDate = new Date();
    const expiresAt = new Date().setMonth(refDate.getMonth() + 2);

    return this.prisma.session.create({
      data: {
        userId,
        expiresAt: new Date(expiresAt),
        refreshTokenHash: refreshToken,
      },
    });
  }

  async revokeSession(sessionId: string): Promise<void> {
    await this.prisma.session.update({
      where: { sessionId },
      data: { revokedAt: new Date() },
    });
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.prisma.session.delete({
      where: { sessionId },
    });
  }
}
