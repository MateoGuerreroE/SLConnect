import { Module } from '@nestjs/common';
import { UserService } from './services/User.service';
import { RepositoryModule } from '../repository';
import { UserController } from './controllers/User.controller';

@Module({
  controllers: [UserController],
  imports: [RepositoryModule],
  providers: [UserService],
})
export class AccessManagementModule {}
