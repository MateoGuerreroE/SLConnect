import { Injectable } from '@nestjs/common';
import { ConversationRecord } from '@slchatapp/shared';
import {
  ConversationRepository,
  ConversationUserRepository,
  UserRepository,
} from 'src/modules/repository';
import {
  CreateConversationDTO,
  ICreateConversation,
  NotFoundError,
  UnauthorizedError,
} from 'src/types';
import { handleServiceError } from 'src/utils/utils';

@Injectable()
export class ConversationService {
  handleError = (error: unknown, message: string) =>
    handleServiceError(error, { source: 'ConversationService', message });

  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly conversationUserRepository: ConversationUserRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createConversation(
    data: CreateConversationDTO,
    creator: string,
  ): Promise<ConversationRecord> {
    try {
      const user = await this.userRepository.getUserById(creator);
      if (!user) {
        throw new NotFoundError('User creator');
      }

      const conversationData: ICreateConversation = {
        ...data,
        createdBy: creator,
      };

      return this.conversationRepository.createConversation(conversationData);
    } catch (e) {
      return this.handleError(e, 'Error creating conversation');
    }
  }

  async verifyConversationUser(
    conversationId: string,
    userId: string,
  ): Promise<void> {
    const conversation =
      await this.conversationRepository.getConversationById(conversationId);

    console.log(userId);
    if (!conversation || conversation.isDeleted) {
      throw new NotFoundError('Conversation not found');
    }

    if (conversation.createdBy === userId) {
      return; // Creator is always part of the conversation
    }

    const isUserInConversation =
      await this.conversationUserRepository.verifyUserInConversation(
        conversation.conversationId,
        userId,
      );

    if (!isUserInConversation) {
      throw new UnauthorizedError('User is not part of the conversation');
    }
  }
}
