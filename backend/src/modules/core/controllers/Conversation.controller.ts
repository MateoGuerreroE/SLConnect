import { Body, Controller, Post } from '@nestjs/common';
import { ConversationService } from '../services';
import { CreateConversationDTO, ServerResponse } from 'src/types';
import { handleControllerError } from 'src/utils/utils';
import type { ControllerResponse } from 'src/types';
import type { ConversationRecord } from '@slchatapp/shared';
import { validateBody } from 'src/utils/validation';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  // TODO JWT Extraction @User()
  @Post('create')
  async create(
    @Body() body: CreateConversationDTO,
  ): Promise<ControllerResponse<ConversationRecord>> {
    try {
      const data = await validateBody(CreateConversationDTO, body);
      const createdConversation =
        await this.conversationService.createConversation(
          data,
          '58b5c707-c30a-4851-88ab-377f4863b1be',
        ); // TODO CHANGE WITH DECORATOR

      return ServerResponse.success(createdConversation);
    } catch (e) {
      return handleControllerError(e);
    }
  }
}
