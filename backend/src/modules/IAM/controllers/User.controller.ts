import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../services/User.service';
import { UserRecord } from '@slchatapp/shared';
import { ControllerResponse, CreateUserDTO, ServerResponse } from 'src/types';
import { handleControllerError } from 'src/utils/utils';
import { validateBody } from 'src/utils/validation';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async createUser(
    @Body() body: CreateUserDTO,
  ): Promise<ControllerResponse<UserRecord>> {
    try {
      const data = await validateBody(CreateUserDTO, body);
      const createdUser = await this.userService.createUser(data);
      return ServerResponse.success(createdUser);
    } catch (e) {
      return handleControllerError(e);
    }
  }
}
