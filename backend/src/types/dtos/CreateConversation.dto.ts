import type { ConversationType } from '@slchatapp/shared';
import { IsIn, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateConversationDTO {
  @ValidateIf((data: CreateConversationDTO) => data.type === 'GROUP')
  @IsNotEmpty({ message: 'Name is required for group conversations' })
  @IsString()
  name?: string;

  @IsString()
  createdBy: string;

  @IsIn(['GROUP', 'PRIVATE'])
  type: ConversationType;
}
