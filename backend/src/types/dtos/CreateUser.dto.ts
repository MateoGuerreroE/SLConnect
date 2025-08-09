import type { UserRole } from '@slchatapp/shared';
import {
  IsDateString,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';

// Validator for external handlers - minimal
// All opts can be edited per user basis
export class CreateUserDTO {
  @IsEmail()
  emailAddress: string;

  @IsString()
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsIn(['ADMIN', 'USER', 'TEACHER'])
  role: UserRole;
}

// Direct type to repo
export interface ICreateUser extends Omit<CreateUserDTO, 'password'> {
  authHash: string;
}

// Non-internal updates for User DTO
/**
 * TODO/NOTE: Removed avatarURL - This should be maybe handled by a validator to avoid
 * wrong use. Either by an uploader (maybe not now as Its purely mobile), or by a url validator with
 * image check on GenAI
 */
export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  career?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;
}
