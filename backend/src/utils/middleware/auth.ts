import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRole } from '@slchatapp/shared';
import { Request } from 'express';
import { Response } from 'express';
import {
  ErrorCode,
  ErrorType,
  ServerError,
  ServerResponse,
  UnauthorizedError,
} from 'src/types';
import jwt from 'jsonwebtoken';

export interface JWTUser {
  userId: string;
  emailAddress: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: JWTUser;
}

@Injectable()
export class JWTGuard implements CanActivate {
  private readonly secret: string;

  constructor() {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new ServerError('Missing Auth parameters', {
        name: 'JWTGuardError',
        type: ErrorType.AUTHORIZATION,
        code: ErrorCode.SERVER_ERROR,
      });
    }

    this.secret = jwtSecret;
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const response = context.switchToHttp().getResponse<Response>();

    try {
      const authHeader = request.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        this.sendAuthError(response, 'Missing or invalid Authorization header');
        return false;
      }

      const token = authHeader.slice(7);
      const decoded = jwt.verify(token, this.secret) as JWTUser;

      request.user = decoded;
      return true;
    } catch (e) {
      this.sendAuthError(response, (e as Error).message);
      return false;
    }
  }

  private sendAuthError(response: Response, message: string): void {
    const error = new UnauthorizedError(message);
    const errorResponse = ServerResponse.failure(error);

    response.status(202).json(errorResponse);
  }
}
