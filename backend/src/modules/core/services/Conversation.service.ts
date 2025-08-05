import { Injectable } from '@nestjs/common';
import { ConversationRecord } from '@slchatapp/shared';
import { ConversationRepository, UserRepository } from 'src/modules/repository';
import {
  CreateConversationDTO,
  ICreateConversation,
  NotFoundError,
} from 'src/types';
import { handleServiceError } from 'src/utils/utils';

@Injectable()
export class ConversationService {
  handleError = (error: unknown, message: string) =>
    handleServiceError(error, { source: 'ConversationService', message });

  constructor(
    private readonly conversationRepository: ConversationRepository,
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
}
