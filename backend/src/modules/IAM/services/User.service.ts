import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/modules/repository';
import { CreateUserDTO, ServerError, UnauthorizedError } from 'src/types';
import { Hasher } from './Hashing';
import { handleServiceError } from 'src/utils/utils';
import jwt from 'jsonwebtoken';
import { UserLoginResponse } from '@slchatapp/shared';
import { SessionService } from './Session.service';

@Injectable()
export class UserService {
  private secret: string;
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionService: SessionService,
  ) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new ServerError('JWT secret is not defined');
    }

    this.secret = secret;
  }
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

  async loginUser(
    emailAddress: string,
    password: string,
  ): Promise<UserLoginResponse> {
    try {
      const user = await this.userRepository.getUserByEmail(emailAddress);

      if (!user) {
        throw new UnauthorizedError('Invalid credentials');
      }

      const isPasswordValid = await Hasher.compare(password, user.authHash);
      if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid credentials');
      }

      const token = jwt.sign(
        {
          userId: user.userId,
          emailAddress: user.emailAddress,
          role: user.role,
        },
        this.secret,
        { expiresIn: 3600 * 24 },
      );

      const session = await this.sessionService.createSession(user.userId);

      await this.userRepository.updateUserLastLogin(user.userId);

      return {
        user,
        token,
        refreshToken: session.refreshToken,
      };
    } catch (e) {
      return this.handleError(e, 'Error logging user');
    }
  }

  async refreshUserToken(refreshToken: string): Promise<UserLoginResponse> {
    try {
      const session = await this.sessionService.verifySession(refreshToken);
      const user = await this.userRepository.getUserById(session.userId);

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      const newToken = jwt.sign(
        {
          userId: user.userId,
          emailAddress: user.emailAddress,
          role: user.role,
        },
        this.secret,
        { expiresIn: 3600 * 24 },
      );

      return {
        user,
        token: newToken,
        refreshToken,
      };
    } catch (e) {
      return this.handleError(e, 'Error refreshing user token');
    }
  }

  async logoutUser(userId: string): Promise<void> {
    try {
      await this.sessionService.revokeSession(userId);
    } catch (e) {
      return this.handleError(e, 'Error logging out user');
    }
  }
}
