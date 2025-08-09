import { Body, Controller, Post } from '@nestjs/common';
import { ConversationService } from '../services';
import { CreateConversationDTO, ServerResponse } from 'src/types';
import { handleControllerError } from 'src/utils/utils';
import type { ControllerResponse } from 'src/types';
import type { ConversationRecord } from '@slchatapp/shared';
import { validateBody } from 'src/utils/validation';
import { Protected, User } from 'src/utils';
import type { JWTUser } from 'src/utils';

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
}
