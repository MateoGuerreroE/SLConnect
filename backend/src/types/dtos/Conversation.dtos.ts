import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AddUsersToConversationDTO {
  @IsNotEmpty()
  @IsString()
  conversationId: string;

  @IsArray()
  @IsEmail({}, { each: true })
  @IsString({ each: true })
  userEmails: string[];
}
