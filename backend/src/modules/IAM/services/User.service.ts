import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/modules/repository';
import { CreateUserDTO } from 'src/types';
import { Hasher } from './Hashing';
import { handleServiceError } from 'src/utils/utils';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  handleError = (error: unknown, message: string) =>
    handleServiceError(error, { source: 'UserService', message });

  async createUser(data: CreateUserDTO) {
    try {
      const { password, ...userData } = data;
      const authHash = await Hasher.hash(password);

      const newUser = await this.userRepository.createUser({
        ...userData,
        authHash,
      });
      return newUser;
    } catch (e) {
      return this.handleError(e, 'Error creating user');
    }
  }
}
