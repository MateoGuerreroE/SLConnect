import { IsString } from 'class-validator';

export class CreateMessageDTO {
  @IsString()
  conversationId: string;

  @IsString()
  senderId: string;

  @IsString()
  content: string;
}
