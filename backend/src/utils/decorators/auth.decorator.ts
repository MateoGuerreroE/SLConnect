import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedRequest, JWTGuard, JWTUser } from '../middleware/auth';

export const User = createParamDecorator(
  (_, ctx: ExecutionContext): JWTUser | null => {
    const request: AuthenticatedRequest = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return null;
    }

    return user;
  },
);

export function Protected() {
  return applyDecorators(UseGuards(JWTGuard));
}
