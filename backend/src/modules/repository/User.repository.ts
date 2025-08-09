import { Injectable } from '@nestjs/common';
import { PrismaService } from '../datasource';
import { ICreateUser, UpdateUserDTO } from 'src/types';
import { UserRecord } from '@slchatapp/shared';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: ICreateUser): Promise<UserRecord> {
    return this.prisma.user.create({
      data,
    });
  }

  async updateUser(
    userId: string,
    updates: UpdateUserDTO,
  ): Promise<UserRecord> {
    const user = await this.prisma.user.update({
      where: { userId },
      data: updates,
    });

    return user as UserRecord;
  }

  async getUserById(userId: string): Promise<UserRecord | null> {
    return this.prisma.user.findUnique({
      where: { userId },
    });
  }

  async getUserByEmail(emailAddress: string): Promise<UserRecord | null> {
    return this.prisma.user.findUnique({
      where: { emailAddress },
    });
  }

  async updateUserLastLogin(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { userId },
      data: { lastLogin: new Date() },
    });
  }

  // Soft deletion
  async removeUser(userId: string): Promise<string> {
    const user = await this.prisma.user.update({
      where: { userId },
      data: { isActive: false },
    });

    return user.userId;
  }

  /**
   * Intended for fetching a group member list
   */
  async getUserBatch(userIds: string[]): Promise<UserRecord[]> {
    return this.prisma.user.findMany({
      where: {
        userId: {
          in: userIds,
        },
      },
    });
  }
}
