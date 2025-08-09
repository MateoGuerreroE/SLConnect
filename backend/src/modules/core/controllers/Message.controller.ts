import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessageService } from '../services/Message.service';
import {
  ControllerResponse,
  CreateMessageDTO,
  ServerResponse,
} from 'src/types';
import { MessageRecord } from '@slchatapp/shared';
import { handleControllerError } from 'src/utils/utils';
import { Protected, User, type JWTUser } from 'src/utils';
import { validateBody } from 'src/utils/validation';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Protected()
  @Get('conversation/:conversationId')
  async getMessagesByConversation(
    @Param('conversationId') conversationId: string,
    @User() user: JWTUser,
  ): Promise<ControllerResponse<MessageRecord[]>> {
    try {
      const messages = await this.messageService.getMessagesByConversationId(
        conversationId,
        user.userId,
      );
      return ServerResponse.success(messages);
    } catch (e) {
      return handleControllerError(e);
    }
  }

  @Protected()
  @Post('add')
  async addMessageToConversation(
    @Body() body: CreateMessageDTO,
    @User() user: JWTUser,
  ): Promise<ControllerResponse<string>> {
    try {
      const data = await validateBody(CreateMessageDTO, body);
      const result = await this.messageService.addMessage(data, user.userId);
      return ServerResponse.success(result);
    } catch (e) {
      return handleControllerError(e);
    }
  }
}
