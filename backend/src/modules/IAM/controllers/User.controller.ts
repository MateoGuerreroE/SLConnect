import { Body, Controller, Get, Post, Query, Headers } from '@nestjs/common';
import { UserService } from '../services/User.service';
import { UserRecord, UserLoginResponse } from '@slchatapp/shared';
import {
  ControllerResponse,
  CreateUserDTO,
  LoginUserDTO,
  ServerResponse,
  UnauthorizedError,
} from 'src/types';
import { handleControllerError } from 'src/utils/utils';
import { validateBody, validatePublicRequest } from 'src/utils/validation';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async createUser(
    @Body() body: CreateUserDTO,
    @Query('iam') iam: string | undefined, // This is pretty hacky, should be improved with a sever generated key
  ): Promise<ControllerResponse<UserRecord>> {
    try {
      validatePublicRequest(iam);
      const data = await validateBody(CreateUserDTO, body);
      const createdUser = await this.userService.createUser(data);
      return ServerResponse.success(createdUser);
    } catch (e) {
      return handleControllerError(e);
    }
  }

  @Post('login')
  async loginUser(
    @Body() body: LoginUserDTO,
  ): Promise<ControllerResponse<UserLoginResponse>> {
    try {
      const data = await validateBody(LoginUserDTO, body);

      const response = await this.userService.loginUser(
        data.emailAddress,
        data.password,
      );
      return ServerResponse.success(response);
    } catch (e) {
      return handleControllerError(e);
    }
  }

  @Get('refresh-token')
  async refreshToken(
    @Headers('x-refresh-token') refreshToken: string,
  ): Promise<ControllerResponse<UserLoginResponse>> {
    try {
      if (!refreshToken) {
        throw new UnauthorizedError('Refresh token is required');
      }

      const result = await this.userService.refreshUserToken(refreshToken);
      return ServerResponse.success(result);
    } catch (e) {
      return handleControllerError(e);
    }
  }

  @Get('logout')
  async logoutUser(
    @Query('user') userId: string,
  ): Promise<ControllerResponse<string>> {
    try {
      if (!userId) {
        throw new UnauthorizedError('User ID is required');
      }
      await this.userService.logoutUser(userId);
      return ServerResponse.success('Logged out successfully');
    } catch (e) {
      return handleControllerError(e);
    }
  }
}
