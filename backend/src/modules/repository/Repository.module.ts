import { Module } from '@nestjs/common';
import { PrismaModule } from '../datasource';
import { UserRepository } from './User.repository';

@Module({
  imports: [PrismaModule],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class RepositoryModule {}
