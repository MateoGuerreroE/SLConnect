import { Module } from '@nestjs/common';
import { PrismaModule } from '../datasource';

@Module({
  imports: [PrismaModule],
})
export class RepositoryModule {}
