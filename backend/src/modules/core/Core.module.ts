import { Module } from '@nestjs/common';
import { ConversationService } from './services';
import { ConversationController } from './controllers/Conversation.controller';
import { RepositoryModule } from '../repository';

@Module({
  imports: [RepositoryModule],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class CoreModule {}
