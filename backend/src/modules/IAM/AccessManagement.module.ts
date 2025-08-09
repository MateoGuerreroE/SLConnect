import { Module } from '@nestjs/common';
import { UserService } from './services/User.service';
import { RepositoryModule } from '../repository';
import { UserController } from './controllers/User.controller';
import { SessionService } from './services/Session.service';

@Module({
  controllers: [UserController],
  imports: [RepositoryModule],
  providers: [UserService, SessionService],
})
export class AccessManagementModule {}
