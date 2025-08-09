import { IsEmail, IsString } from 'class-validator';

export class LoginUserDTO {
  @IsEmail()
  emailAddress: string;

  @IsString()
  password: string;
}
