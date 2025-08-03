import { Injectable } from '@nestjs/common';
import { PrismaService } from '../datasource';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: any) {
    return this.prisma.user.create({
      data,
    });
  }
}
