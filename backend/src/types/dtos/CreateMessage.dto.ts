import { IsString } from 'class-validator';

export class CreateMessageDTO {
  @IsString()
  conversationId: string;

  @IsString()
  content: string;
}

export class CreateMessageData extends CreateMessageDTO {
  senderId: string;
}
