import { Injectable } from '@nestjs/common';
import { SessionRepository } from 'src/modules/repository';
import jwt from 'jsonwebtoken';
import { ServerError, UnauthorizedError } from 'src/types';
import { SessionRecord } from '@slchatapp/shared';
import { handleServiceError } from 'src/utils/utils';
import { Hasher } from './Hashing';

@Injectable()
export class SessionService {
  secret: string;
  handleError = (error: unknown, message: string) =>
    handleServiceError(error, { source: 'SessionService', message });
  constructor(private readonly sessionRepository: SessionRepository) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new ServerError('JWT secret is not defined');
    }

    this.secret = secret;
  }

  async createSession(
    userId: string,
  ): Promise<SessionRecord & { refreshToken: string }> {
    try {
      const refreshToken = this.generateRefreshToken(userId);

      const newSession = await this.sessionRepository.createSession(
        userId,
        await Hasher.hash(refreshToken),
      );

      return { ...newSession, refreshToken };
    } catch (e) {
      return this.handleError(e, 'Error verifying session');
    }
  }

  private generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, this.secret, { expiresIn: 3600 * 24 * 60 });
  }

  async verifySession(refreshToken: string): Promise<SessionRecord> {
    try {
      const decoded = jwt.verify(refreshToken, this.secret) as {
        userId: string;
      };
      if (!decoded?.userId) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      const session = await this.sessionRepository.getSessionByUserId(
        decoded.userId,
      );

      if (!session) {
        throw new UnauthorizedError('Session not found');
      }

      if (session.revokedAt || session.expiresAt < new Date()) {
        throw new UnauthorizedError('Session is revoked or expired');
      }

      return session;
    } catch (e) {
      return this.handleError(e, 'Error verifying session');
    }
  }

  async revokeSession(userId: string): Promise<void> {
    try {
      const session = await this.sessionRepository.getSessionByUserId(userId);
      if (!session) {
        throw new UnauthorizedError('Session not found');
      }
      await this.sessionRepository.revokeSession(session.sessionId);
    } catch (e) {
      return this.handleError(e, 'Error revoking session');
    }
  }
}
