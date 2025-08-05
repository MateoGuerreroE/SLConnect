import { Module } from '@nestjs/common';
import { PrismaModule } from '../datasource';
import { UserRepository } from './User.repository';
import { SessionRepository } from './Session.repository';
import { MessageRepository } from './Message.repository';
import { ConversationRepository } from './Conversation.repository';
import { ConversationUserRepository } from './ConversationUser.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    UserRepository,
    SessionRepository,
    MessageRepository,
    ConversationRepository,
    ConversationUserRepository,
  ],
  exports: [
    UserRepository,
    SessionRepository,
    MessageRepository,
    ConversationRepository,
    ConversationUserRepository,
  ],
})
export class RepositoryModule {}
