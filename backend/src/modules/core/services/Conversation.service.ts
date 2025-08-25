import { Injectable } from '@nestjs/common';
import { ConversationRecord, ConversationType } from '@slchatapp/shared';
import {
  ConversationRepository,
  ConversationUserRepository,
  UserRepository,
} from 'src/modules/repository';
import {
  CreateConversationDTO,
  ICreateConversation,
  NotFoundError,
  ServerError,
  UnauthorizedError,
} from 'src/types';
import { JWTUser } from 'src/utils';
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
      if (data.type === 'PRIVATE') {
        if (data.targetUserId === creator) {
          throw new ServerError('Cannot create private conversation with self');
        }
        const targetUser = await this.userRepository.getUserById(
          data.targetUserId!,
        );
        if (!targetUser) {
          throw new NotFoundError('Target user for private conversation');
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { targetUserId, ...createConversationData } = data;

      const conversationData: ICreateConversation = {
        ...createConversationData,
        createdBy: creator,
      };

      const conversation =
        await this.conversationRepository.createConversation(conversationData);

      await this.conversationUserRepository.addUserToConversation(
        conversation.conversationId,
        user.userId,
      );

      if (data.type === 'PRIVATE') {
        await this.conversationUserRepository.addUserToConversation(
          conversation.conversationId,
          data.targetUserId!,
        );
      }

      return conversation;
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

  async getConversationsByUserId(
    userId: string,
    type?: ConversationType,
    includeLastMessage: boolean = false,
  ): Promise<ConversationRecord[]> {
    try {
      const user = await this.userRepository.getUserById(userId);
      if (!user) {
        throw new NotFoundError('User');
      }

      return this.conversationRepository.getConversationsByUserId(
        userId,
        type,
        includeLastMessage,
      );
    } catch (e) {
      return this.handleError(e, 'Error fetching conversations by user ID');
    }
  }

  async addUsersToConversation(
    conversationId: string,
    userEmails: string[],
    requestingUser: JWTUser,
  ): Promise<void> {
    try {
      if (requestingUser.role === 'USER') {
        throw new UnauthorizedError(
          'Only admins or teachers can add users to conversations',
        );
      }
      const conversation =
        await this.conversationRepository.getConversationById(conversationId);
      if (!conversation || conversation.isDeleted) {
        throw new NotFoundError('Conversation not found');
      }
      if (conversation.type !== 'GROUP') {
        throw new ServerError('Can only add users to group conversations');
      }

      for (const email of userEmails) {
        const user = await this.userRepository.getUserByEmail(email);
        if (!user) {
          throw new NotFoundError(`User with email ${email}`);
        }

        const isUserInConversation =
          await this.conversationUserRepository.verifyUserInConversation(
            conversationId,
            user.userId,
          );
        if (isUserInConversation) {
          continue; // Skip if user is already in the conversation
        }

        await this.conversationUserRepository.addUserToConversation(
          conversationId,
          user.userId,
        );
      }
    } catch (e) {
      this.handleError(e, 'Error adding users to conversation');
    }
  }
}
