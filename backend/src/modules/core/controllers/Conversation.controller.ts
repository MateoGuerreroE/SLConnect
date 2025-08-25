import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import type { ConversationRecord } from '@slchatapp/shared';
import { ConversationType } from 'generated/prisma';
import type { ControllerResponse } from 'src/types';
import { CreateConversationDTO, ServerResponse } from 'src/types';
import { AddUsersToConversationDTO } from 'src/types/dtos/Conversation.dtos';
import type { JWTUser } from 'src/utils';
import { Protected, User } from 'src/utils';
import { handleControllerError } from 'src/utils/utils';
import { validateBody } from 'src/utils/validation';
import { ConversationService } from '../services';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Protected()
  @Post('create')
  async create(
    @Body() body: CreateConversationDTO,
    @User() user: JWTUser,
  ): Promise<ControllerResponse<ConversationRecord>> {
    try {
      const data = await validateBody(CreateConversationDTO, body);
      const createdConversation =
        await this.conversationService.createConversation(data, user.userId);

      return ServerResponse.success(createdConversation);
    } catch (e) {
      return handleControllerError(e);
    }
  }

  @Protected()
  @Get('')
  async getByUserId(
    @User() user: JWTUser,
    @Query('type') type?: string,
    @Query('includeLastMessage') includeLastMessage?: string,
  ): Promise<ControllerResponse<ConversationRecord[]>> {
    try {
      const conversations =
        await this.conversationService.getConversationsByUserId(
          user.userId,
          type as ConversationType,
          includeLastMessage === '1',
        );

      return ServerResponse.success(conversations);
    } catch (e) {
      return handleControllerError(e);
    }
  }

  @Protected()
  @Post('addUsers')
  async addUsersToConversation(
    @User() user: JWTUser,
    @Body() body: AddUsersToConversationDTO,
  ) {
    try {
      const data = await validateBody(AddUsersToConversationDTO, body);
      await this.conversationService.addUsersToConversation(
        data.conversationId,
        data.userEmails,
        user,
      );

      return ServerResponse.success(null, 200);
    } catch (e) {
      return handleControllerError(e);
    }
  }
}
