import { Injectable } from '@nestjs/common';
import { MessageRecord } from '@slchatapp/shared';
import { MessageRepository } from 'src/modules/repository';
import { CreateMessageDTO } from 'src/types';
import { handleServiceError } from 'src/utils/utils';
import { ConversationService } from './Conversation.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly messageRepository: MessageRepository,
  ) {}

  handleError = (error: unknown, message: string) =>
    handleServiceError(error, { source: 'MessageService', message });

  async getMessagesByConversationId(
    conversationId: string,
    userId: string,
  ): Promise<MessageRecord[]> {
    try {
      await this.conversationService.verifyConversationUser(
        conversationId,
        userId,
      );

      return this.messageRepository.getMessagesByConversationId(conversationId);
    } catch (e) {
      return this.handleError(e, 'Unable to get messages');
    }
  }

  // This should emit event so that the message is notified to the users in the conv
  async addMessage(data: CreateMessageDTO, sender: string): Promise<string> {
    try {
      await this.conversationService.verifyConversationUser(
        data.conversationId,
        sender,
      );

      const message = await this.messageRepository.createMessage({
        ...data,
        senderId: sender,
      });

      return message.messageId;
    } catch (e) {
      return this.handleError(e, 'Unable to add message');
    }
  }
}
