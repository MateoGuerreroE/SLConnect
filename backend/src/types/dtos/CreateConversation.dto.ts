import type { ConversationType } from '@slchatapp/shared';
import { IsIn, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateConversationDTO {
  @ValidateIf((data: CreateConversationDTO) => data.type === 'GROUP')
  @IsNotEmpty({ message: 'Name is required for group conversations' })
  @IsString()
  name?: string;

  @IsIn(['GROUP', 'PRIVATE'])
  type: ConversationType;

  @ValidateIf((data: CreateConversationDTO) => data.type === 'PRIVATE')
  @IsNotEmpty()
  @IsString()
  targetUserId?: string;
}

export interface ICreateConversation
  extends Omit<CreateConversationDTO, 'targetUserId'> {
  createdBy: string;
}
