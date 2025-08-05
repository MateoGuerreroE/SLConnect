import { Body, Controller, Post } from '@nestjs/common';
import { ConversationService } from '../services';
import { CreateConversationDTO } from 'src/types';
import { handleControllerError } from 'src/utils/utils';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  // TODO Create Controller Type and response sender (integrate with handleControllerError) -> Should not throw error but return response
  // TODO JWT Extraction @User()
  @Post('create')
  async create(@Body() body: CreateConversationDTO) {
    try {
      const createdConversation =
        await this.conversationService.createConversation(
          body,
          'creatorUserId',
        ); // TODO CHANGE WITH DECORATOR

      return createdConversation;
    } catch (e) {
      return handleControllerError(e);
    }
  }
}
