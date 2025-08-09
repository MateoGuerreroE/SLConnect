import { Module } from '@nestjs/common';
import { ConversationService } from './services';
import { ConversationController } from './controllers/Conversation.controller';
import { RepositoryModule } from '../repository';
import { MessageService } from './services/Message.service';
import { MessageController } from './controllers/Message.controller';

@Module({
  imports: [RepositoryModule],
  controllers: [ConversationController, MessageController],
  providers: [ConversationService, MessageService],
})
export class CoreModule {}
